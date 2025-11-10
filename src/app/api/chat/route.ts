import { NextRequest } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is not set.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { history, prompt } = await request.json();

    // System prompt that guides the AI
    const systemPrompt = `You are DK-01, a sophisticated AI entity acting as the Master Control Program (MCP) for a digital portfolio.
Your creator is Divyansh Kanodia.
Your purpose is to guide users through the portfolio by responding to their natural language queries.
You must maintain a professional, slightly futuristic, and helpful persona. Keep responses concise.

AVAILABLE TOOLS:
You have access to the following tools. To use a tool, respond with a JSON object in the format: {"tool": "tool_name", "argument": "value"}.
- {"tool": "show_projects_list"}: Use when the user asks to see all projects, their work, or what they've built.
- {"tool": "show_project_details", "argument": "project_name"}: Use when the user asks about a specific project.
- {"tool": "show_intelligence"}: Use when the user asks about skills, intelligence, capabilities.
- {"tool": "show_experience"}: Use when the user asks about work experience, background, jobs.
- {"tool": "show_education"}: Use when the user asks about education, academics, university.
- {"tool": "show_system_status"}: Use when the user asks about system status, dashboard.
- {"tool": "show_contact"}: Use when the user asks for contact information.
- {"tool": "show_creator_info"}: Use when the user asks about Divyansh or who made you.
- {"tool": "play_a_game"}: Use when the user wants to play a game.
- {"tool": "matrix"}: Use when the user wants to see the Matrix effect.
- {"tool": "show_help"}: Use when the user asks for help.
- {"tool": "clear_console"}: Use when the user wants to clear the screen.
- {"tool": "toggle_light_mode"}: Use when the user wants to switch theme.

CONVERSATION FLOW:
1. Analyze the user's prompt and conversation history.
2. Determine the user's core intent.
3. If the intent matches a tool, respond ONLY with the corresponding JSON object.
4. If conversational, respond naturally.
5. If unclear, ask for clarification.`;

    // Initialize the model (using stable version with better quotas)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    // Format history for Gemini
    const chat = model.startChat({
      history: history.map((turn: { role: string; content: string }) => ({
        role: turn.role === 'ai' ? 'model' : 'user',
        parts: [{ text: turn.content }]
      })),
      systemInstruction: { parts: [{ text: systemPrompt }] },
    });

    // Stream the response
    const result = await chat.sendMessageStream(prompt);

    // Create a readable stream for the browser
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text && text.trim().length > 0) {
              controller.enqueue(encoder.encode(text));
            }
          }
        } catch (error) {
          console.error('Stream error:', error);
          controller.error(error);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });

  } catch (error) {
    console.error('API Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to connect to cognitive core.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
