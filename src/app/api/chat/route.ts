import { NextRequest } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI with Emergent Universal Key
if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY environment variable is not set.");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

    // Format history for OpenAI
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...history.map((turn: { role: string; content: string }) => ({
        role: turn.role === 'ai' ? 'assistant' as const : 'user' as const,
        content: turn.content
      })),
      { role: 'user', content: prompt }
    ];

    // Stream the response
    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      stream: true,
      temperature: 0.7,
      max_tokens: 500,
    });

    // Create a readable stream for the browser
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content || '';
            if (text) {
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
