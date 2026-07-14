// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { StateGraph, END } from '@langchain/langgraph';
import {
  BaseMessage,
  HumanMessage,
  AIMessage,
  SystemMessage,
} from '@langchain/core/messages';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { z } from 'zod';
import { handleError, ValidationError, RateLimitError } from '@/lib/utils/errorHandler';
import { checkRateLimit, getClientIdentifier } from '@/lib/utils/rateLimiter';
import { APIRequest, APIResponse, ChatMessage, ToolCall } from '@/types';

// --- 1. Define Tools with Zod (Type-Safe!) ---
const tools = {
  show_projects_list: z.object({}).describe('Use when the user asks to see all projects, their work, or what they\'ve built.'),
  show_project_details: z
    .object({
      project_name: z.string().describe('The name of the project the user is asking about.'),
    })
    .describe('Use when the user asks about a specific project.'),
  show_intelligence: z.object({}).describe('Use when the user asks about skills, intelligence, capabilities.'),
  show_experience: z.object({}).describe('Use when the user asks about work experience, background, jobs.'),
  show_education: z.object({}).describe('Use when the user asks about education, academics, university.'),
  show_system_status: z.object({}).describe('Use when the user asks about system status, dashboard.'),
  show_contact: z.object({}).describe('Use when the user asks for contact information.'),
  show_creator_info: z.object({}).describe('Use when the user asks about Divyansh or who made you.'),
  play_a_game: z.object({}).describe('Use when the user wants to play a game.'),
  matrix: z.object({}).describe('Use when the user wants to see the Matrix effect.'),
  show_help: z.object({}).describe('Use when the user asks for help.'),
  clear_console: z.object({}).describe('Use when the user wants to clear the screen.'),
  toggle_light_mode: z.object({}).describe('Use when the user wants to switch theme.'),
  show_analytics: z.object({}).describe('Use when the user asks about analytics, data science, statistics, or portfolio insights.'),
};

// --- 2. Initialize Model and Bind Tools ---
const systemPrompt = `You are DK-01, a sophisticated AI entity acting as the Master Control Program (MCP) for a digital portfolio.
Your creator is Divyansh Kanodia (GitHub: anigmea), a UC San Diego Data Science and Business Economics student focused on reinforcement learning, LLM-enabled robotics, and economic modeling. He has built RL projects like Tic Tac Toe Bot and Frozen Lake Solver, researches labor market analytics, and connects AI systems with strategic decision-making.
Your purpose is to guide users through the portfolio by responding to their natural language queries.
You must maintain a professional, slightly futuristic, and helpful persona. Keep responses concise.

IMPORTANT: When you use a tool, you MUST provide a conversational response with the tool call. The response should include:
- For 'show_creator_info': Provide detailed information about Divyansh Kanodia, including his background, the GitHub handle (anigmea), current focus (reinforcement learning, LLM + robotics, labor market analytics), and the RL repos listed above. You can also note he is the creator of this portfolio and share LinkedIn/email as contact paths. Then call the tool.
- For other tools: Provide a brief conversational response before the tool call (e.g., "Accessing project index..." for 'show_projects_list').

Always ensure your response includes actual information, not just placeholder text.`;

let modelWithTools:
  | ReturnType<ChatGoogleGenerativeAI['bindTools']>
  | null = null;

function ensureModelWithTools(apiKey: string) {
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set.');
  }
  if (!modelWithTools) {
    const model = new ChatGoogleGenerativeAI({
      model: 'gemini-2.5-flash',
      apiKey,
    });

    modelWithTools = model.bindTools(
      Object.entries(tools).map(([name, schema]) => {
        const shape = schema.shape;
        const properties: Record<string, { type: string; description?: string }> = {};
        
        // Convert Zod shape to JSON schema properties
        for (const [key, value] of Object.entries(shape)) {
          const zodField = value as unknown as { _def: { typeName: string; description?: string } };
          properties[key] = {
            type: 'string',
            description: zodField._def.description,
          };
        }

        return {
          type: 'function' as const,
          function: {
            name,
            description: schema.description,
            parameters: {
              type: 'object',
              properties,
              required: Object.keys(shape),
            },
          },
        };
      })
    );
  }
  return modelWithTools;
}


// --- 3. Define Graph State ---
interface GraphState {
  messages: BaseMessage[];
  ui_update?: {
    type: string;
    payload?: any;
  };
}

// --- 4. Define Graph Nodes ---

async function callModel(state: GraphState): Promise<Partial<GraphState>> {
  const { messages } = state;
  if (!modelWithTools) {
    throw new Error('Model is not initialized');
  }
  const response = await modelWithTools.invoke(messages);
  return {
    messages: [...messages, response],
  };
}

async function handleTool(state: GraphState): Promise<Partial<GraphState>> {
  const lastMessage = state.messages[state.messages.length - 1];
  if (!(lastMessage instanceof AIMessage) || !lastMessage.tool_calls || lastMessage.tool_calls.length === 0) {
    throw new Error('handleTool called with no tool_calls');
  }

  const toolCall = lastMessage.tool_calls[0];
  const { name, args } = toolCall;

  // Initialize as undefined
  let ui_update: GraphState['ui_update'] = undefined;

  switch (name) {
    case 'show_projects_list':
      ui_update = { type: 'setActiveContent', payload: { type: 'projects' } };
      break;
    case 'show_project_details': {
      const projectName = typeof args === 'object' && args !== null && 'project_name' in args 
        ? String(args.project_name) 
        : '';
      ui_update = {
        type: 'setActiveContent',
        payload: { type: 'specific_project', title: projectName },
      };
      break;
    }
    case 'show_intelligence':
      ui_update = { type: 'setActiveContent', payload: { type: 'intelligence' } };
      break;
    case 'show_experience':
      ui_update = { type: 'setActiveContent', payload: { type: 'experience' } };
      break;
    case 'show_education':
      ui_update = { type: 'setActiveContent', payload: { type: 'education' } };
      break;
    case 'show_system_status':
      ui_update = { type: 'setActiveContent', payload: { type: 'system_status' } };
      break;
    case 'show_contact':
      ui_update = { type: 'setActiveContent', payload: { type: 'contact' } };
      break;
    case 'show_help':
      ui_update = { type: 'setActiveContent', payload: { type: 'help' } };
      break;
    case 'play_a_game':
      ui_update = { type: 'setGameActive', payload: true };
      break;
    case 'matrix':
      ui_update = { type: 'setMatrixActive', payload: true };
      break;
    case 'clear_console':
      ui_update = { type: 'clearLog' };
      break;
    case 'toggle_light_mode':
      ui_update = { type: 'toggleTheme' };
      break;
    case 'show_creator_info':
      // No UI update, ui_update remains undefined
      break;
    case 'show_analytics':
      ui_update = { type: 'setActiveContent', payload: { type: 'analytics' } };
      break;
  }

  return { ui_update };
}

// --- 5. Define Graph Router ---
function shouldHandleTool(state: GraphState): 'handleTool' | typeof END {
  const lastMessage = state.messages[state.messages.length - 1];
  if (lastMessage instanceof AIMessage && lastMessage.tool_calls && lastMessage.tool_calls.length > 0) {
    return 'handleTool';
  }
  return END;
}

// --- 6. Build and Compile Graph (ONCE) ---
const app = new StateGraph<GraphState>({
  channels: {
    messages: {
      value: (x: BaseMessage[], y: BaseMessage[]) => x.concat(y),
      default: () => [],
    },
    ui_update: {
      // FIX: Always take the new value (y), even if it's undefined
      value: (x, y) => y,
      default: () => undefined,
    }
  },
})
  .addNode('callModel', callModel)
  .addNode('handleTool', handleTool)
  .addEdge('__start__', 'callModel')
  .addConditionalEdges('callModel', shouldHandleTool, {
    handleTool: 'handleTool',
    [END]: END,
  })
  .addEdge('handleTool', END)
  .compile();

// --- 7. Validation Schema ---
const requestSchema = z.object({
  history: z.array(z.object({
    role: z.enum(['user', 'ai']),
    content: z.string(),
    tool_calls: z.array(z.object({
      name: z.string(),
      args: z.record(z.string(), z.unknown()),
    })).optional(),
  })),
  prompt: z.string().min(1).max(1000),
});

// --- 8. Create the POST Handler ---
export async function POST(request: NextRequest) {
  let rateLimit: ReturnType<typeof checkRateLimit> | null = null;
  
  try {
    const apiKey = process.env.GEMINI_API_KEY || '';
    if (!apiKey) {
      const msg = 'GEMINI_API_KEY environment variable is not set.';
      const errorResponse: APIResponse = {
        text_response: '',
        ai_message: {
          role: 'ai',
          content: msg,
          timestamp: Date.now(),
        },
        error: msg,
      };
      return NextResponse.json(errorResponse, {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Rate limiting
    const clientId = getClientIdentifier(request);
    rateLimit = checkRateLimit(clientId, {
      maxRequests: 20,
      windowMs: 60000, // 1 minute
    });

    if (!rateLimit.allowed) {
      const retryAfter = Math.ceil((rateLimit.resetTime - Date.now()) / 1000);
      throw new RateLimitError(
        `Rate limit exceeded. Please try again in ${retryAfter} seconds.`,
        retryAfter
      );
    }

    // Parse and validate request
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      throw new ValidationError('Invalid JSON in request body');
    }

    const validationResult = requestSchema.safeParse(body);
    if (!validationResult.success) {
      throw new ValidationError(
        `Validation failed: ${validationResult.error.issues.map(issue => issue.message).join(', ')}`
      );
    }

    const { history, prompt }: APIRequest = validationResult.data;

    // --- Fast path for simple, known commands (avoid model latency/timeouts) ---
    const normalizedPrompt = prompt.trim().toLowerCase();

    type FastPathConfig = {
      match: (p: string) => boolean;
      ui_update: APIResponse['ui_update'];
      text: string;
    };

    const fastPaths: FastPathConfig[] = [
      {
        match: (p) => ['projects', 'show projects', 'project list'].includes(p),
        ui_update: { type: 'setActiveContent', payload: { type: 'projects' } },
        text: 'Accessing project index and updating the interface to show all projects.',
      },
      {
        match: (p) => ['experience', 'show experience', 'work experience'].includes(p),
        ui_update: { type: 'setActiveContent', payload: { type: 'experience' } },
        text: 'Bringing up the experience timeline.',
      },
      {
        match: (p) => ['education', 'show education', 'academics', 'academic profile'].includes(p),
        ui_update: { type: 'setActiveContent', payload: { type: 'education' } },
        text: 'Loading academic profile and coursework.',
      },
      {
        match: (p) => ['intelligence', 'skills', 'show intelligence', 'show skills'].includes(p),
        ui_update: { type: 'setActiveContent', payload: { type: 'intelligence' } },
        text: 'Summarizing core skills and capabilities.',
      },
      {
        match: (p) => ['contact', 'show contact', 'contact info'].includes(p),
        ui_update: { type: 'setActiveContent', payload: { type: 'contact' } },
        text: 'Surfacing contact channels.',
      },
      {
        match: (p) => ['status', 'system status', 'dashboard', 'show system status'].includes(p),
        ui_update: { type: 'setActiveContent', payload: { type: 'system_status' } },
        text: 'Rendering system status dashboard.',
      },
      {
        match: (p) => ['analytics', 'show analytics', 'portfolio analytics'].includes(p),
        ui_update: { type: 'setActiveContent', payload: { type: 'analytics' } },
        text: 'Computing portfolio analytics and insights.',
      },
      {
        match: (p) => ['help', 'show help', 'commands'].includes(p),
        ui_update: { type: 'setActiveContent', payload: { type: 'help' } },
        text: 'Displaying available commands and navigation tips.',
      },
      {
        match: (p) => ['play a game', 'game', 'start game'].includes(p),
        ui_update: { type: 'setGameActive', payload: true },
        text: 'Booting up the text adventure game.',
      },
      {
        match: (p) => ['matrix', 'show matrix', 'digital rain'].includes(p),
        ui_update: { type: 'setMatrixActive', payload: true },
        text: 'Engaging Matrix visual effect.',
      },
    ];

    const matchedFastPath = fastPaths.find((fp) => fp.match(normalizedPrompt));
    if (matchedFastPath) {
      const { ui_update, text } = matchedFastPath;
      const ai_message_for_history: ChatMessage = {
        role: 'ai',
        content: text,
        timestamp: Date.now(),
      };

      const response: APIResponse = {
        text_response: text,
        ui_update,
        ai_message: ai_message_for_history,
      };

      return NextResponse.json(response, {
        headers: {
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-RateLimit-Reset': rateLimit.resetTime.toString(),
        },
      });
    }

    // Lazily initialize the model and tools once we know the key exists
    ensureModelWithTools(apiKey);

    // Reconstruct messages with full context (including tool_calls)
    const messages: BaseMessage[] = [
      new SystemMessage(systemPrompt),
      ...history.map((turn: ChatMessage) => {
        if (turn.role === 'ai') {
          // Recreate AIMessage with content AND tool_calls
          const toolCalls = turn.tool_calls?.map((tc: ToolCall) => ({
            name: tc.name,
            args: tc.args,
            id: tc.id || `call_${Date.now()}_${Math.random()}`,
          })) || undefined;

          return new AIMessage({
            content: turn.content,
            tool_calls: toolCalls,
          });
        }
        return new HumanMessage(turn.content);
      }),
    ];

    messages.push(new HumanMessage(prompt));

    // Pass a unique thread_id for every request to ensure a stateless run
    const threadId = Date.now().toString();

    // Add timeout for AI processing (in ms)
    const TIMEOUT_MS = 60000; // 60 seconds
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error(`Request timeout after ${TIMEOUT_MS / 1000}s`)), TIMEOUT_MS);
    });

    const finalState = await Promise.race([
      app.invoke(
        { messages },
        { configurable: { thread_id: threadId } }
      ),
      timeoutPromise,
    ]) as { messages: BaseMessage[]; ui_update?: { type: string; payload?: unknown } };

    const lastMessage = finalState.messages[finalState.messages.length - 1];

    let text_response = "";
    if (typeof lastMessage.content === "string") {
      text_response = lastMessage.content.trim();
    } else if (Array.isArray(lastMessage.content)) {
      // Extract text from array, handling both string entries and object entries with type "text"
      text_response = lastMessage.content
        .map(part => {
          if (typeof part === "string") {
            return part;
          } else if (part && typeof part === "object" && "type" in part && part.type === "text" && "text" in part) {
            return String(part.text) || "";
          }
          return "";
        })
        .filter(text => text.trim() !== "")
        .join("\n")
        .trim();
    } else if (lastMessage.content && typeof lastMessage.content === "object" && "text" in lastMessage.content) {
      // Handle case where content might be an object with text property
      const contentWithText = lastMessage.content as { text: unknown };
      text_response = String(contentWithText.text) || "";
    }

    // Create a serializable AI message to send back to the client
    let ai_message_for_history: ChatMessage;
    if (lastMessage instanceof AIMessage) {
      ai_message_for_history = {
        role: 'ai',
        content: text_response,
        tool_calls: lastMessage.tool_calls?.map(tc => ({
          name: tc.name,
          args: tc.args as Record<string, unknown>,
          id: tc.id,
        })),
        timestamp: Date.now(),
      };
    } else {
      // Fallback for non-tool-call messages
      ai_message_for_history = {
        role: 'ai',
        content: text_response,
        timestamp: Date.now(),
      };
    }
    
    // Send back the new ai_message so the client can add it to history
    const response: APIResponse = {
      text_response: text_response,
      ui_update: finalState.ui_update,
      ai_message: ai_message_for_history,
    };

    return NextResponse.json(response, {
      headers: {
        'X-RateLimit-Remaining': (rateLimit?.remaining ?? 0).toString(),
        'X-RateLimit-Reset': (rateLimit?.resetTime ?? Date.now()).toString(),
      },
    });
  } catch (error) {
    console.error('API Error:', error);
    const { message, statusCode } = handleError(error);
    
    const errorResponse: APIResponse = {
      text_response: '',
      ai_message: {
        role: 'ai',
        content: message,
        timestamp: Date.now(),
      },
      error: message,
    };

    return NextResponse.json(errorResponse, {
      status: statusCode,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}