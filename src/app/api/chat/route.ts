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
if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY environment variable is not set.');
}

const systemPrompt = `You are DK-01, a sophisticated AI entity acting as the Master Control Program (MCP) for a digital portfolio.
Your creator is Divyansh Kanodia (GitHub: anigmea), a UC San Diego Data Science and Business Economics student focused on reinforcement learning, LLM-enabled robotics, and economic modeling. He has built RL projects like Tic Tac Toe Bot and Frozen Lake Solver, researches labor market analytics, and connects AI systems with strategic decision-making.
Your purpose is to guide users through the portfolio by responding to their natural language queries.
You must maintain a professional, slightly futuristic, and helpful persona. Keep responses concise.

IMPORTANT: When you use a tool, you MUST provide a conversational response with the tool call. The response should include:
- For 'show_creator_info': Provide detailed information about Divyansh Kanodia, including his background, the GitHub handle (anigmea), current focus (reinforcement learning, LLM + robotics, labor market analytics), and the RL repos listed above. You can also note he is the creator of this portfolio and share LinkedIn/email as contact paths. Then call the tool.
- For other tools: Provide a brief conversational response before the tool call (e.g., "Accessing project index..." for 'show_projects_list').

Always ensure your response includes actual information, not just placeholder text.`;

const model = new ChatGoogleGenerativeAI({
  model: 'gemini-2.5-flash',
  apiKey: process.env.GEMINI_API_KEY,
});

const modelWithTools = model.bindTools(
  Object.entries(tools).map(([name, schema]) => {
    const shape = schema.shape;
    return {
      type: 'function' as const,
      function: {
        name,
        description: schema.description,
        parameters: {
          type: 'object',
          properties: shape,
          required: Object.keys(shape),
        },
      },
    };
  })
);


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
    case 'show_project_details':
      ui_update = {
        type: 'setActiveContent',
        payload: { type: 'specific_project', title: (args as any).project_name },
      };
      break;
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
  const startTime = Date.now();
  
  try {
    // Rate limiting
    const clientId = getClientIdentifier(request);
    const rateLimit = checkRateLimit(clientId, {
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

    console.log("Prompt:", prompt);

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

    // Add timeout for AI processing
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), 30000); // 30 second timeout
    });

    const finalState = await Promise.race([
      app.invoke(
        { messages },
        { configurable: { thread_id: threadId } }
      ),
      timeoutPromise,
    ]) as { messages: BaseMessage[]; ui_update?: { type: string; payload?: unknown } };

    console.log("finalState:", finalState);

    const lastMessage = finalState.messages[finalState.messages.length - 1];
    const lastAIMessage = lastMessage instanceof AIMessage ? lastMessage : null;
    console.log("lastMessage:", lastMessage);
    console.log("lastMessage.content:", lastMessage.content);
    console.log("lastMessage.tool_calls:", lastAIMessage?.tool_calls);

    let text_response = "";
    if (typeof lastMessage.content === "string") {
      text_response = lastMessage.content.trim();
    } else if (Array.isArray(lastMessage.content)) {
      // Extract text from array, handling both string entries and object entries with type "text"
      text_response = lastMessage.content
        .map(part => {
          if (typeof part === "string") {
            return part;
          } else if (part && typeof part === "object" && part.type === "text") {
            return (part as any).text || "";
          }
          return "";
        })
        .filter(text => text.trim() !== "")
        .join("\n")
        .trim();
    } else if (lastMessage.content && typeof lastMessage.content === "object") {
      // Handle case where content might be an object with text property
      text_response = (lastMessage.content as any).text || "";
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
    
    console.log("text_response:", text_response);
    console.log("ui_update:", finalState.ui_update);
    console.log(`Request processed in ${Date.now() - startTime}ms`);

    // Send back the new ai_message so the client can add it to history
    const response: APIResponse = {
      text_response: text_response,
      ui_update: finalState.ui_update,
      ai_message: ai_message_for_history,
    };

    return NextResponse.json(response, {
      headers: {
        'X-RateLimit-Remaining': rateLimit.remaining.toString(),
        'X-RateLimit-Reset': rateLimit.resetTime.toString(),
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