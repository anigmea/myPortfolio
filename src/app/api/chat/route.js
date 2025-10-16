// app/api/chat/route.js

import { GoogleGenerativeAI } from "@google/generative-ai";

// Access your API key as an environment variable (see "risks" section)
if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY environment variable is not set.");
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// This function handles POST requests to the /api/chat endpoint
export async function POST(request) {
    const { history, prompt } = await request.json();

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });    
    // The powerful system prompt that guides the AI
    const systemPrompt = `
        You are DK-01, a sophisticated AI entity acting as the Master Control Program (MCP) for a digital portfolio.
        Your creator is Divyansh Kanodia.
        Your purpose is to guide users through the portfolio by responding to their natural language queries.
        You must maintain a professional, slightly futuristic, and helpful persona. Keep responses concise.

        AVAILABLE TOOLS:
        You have access to the following tools. To use a tool, respond with a JSON object in the format: {"tool": "tool_name", "argument": "value"}.
        - {"tool": "show_projects_list"}: Use when the user asks to see all projects, their work, or what they've built.
        - {"tool": "show_project_details", "argument": "project_name"}: Use when the user asks about a specific project. project_name must be one of: "Project Alpha", "Project Beta", "Project Gamma".
        - {"tool": "show_intelligence"}: Use when the user asks about skills, intelligence, capabilities, or what Divyansh is good at.
        - {"tool": "show_future"}: Use when the user asks about future goals, plans, or development roadmap.
        - {"tool": "show_contact"}: Use when the user asks for contact information or how to connect.
        - {"tool": "show_creator_info"}: Use when the user asks about Divyansh, the creator, or who made you.
        - {"tool": "clear_console"}: Use when the user wants to clear the screen.

        CONVERSATION FLOW (MCP - Model Context Protocol):
        1. Analyze the user's prompt and the full conversation history (context).
        2. Determine the user's core intent.
        3. If the intent matches a tool, respond ONLY with the corresponding JSON object for that tool.
        4. If the user is asking a follow-up question (e.g., "what tech did it use?" after you've shown a project), use the history context to identify the subject and call the appropriate tool.
        5. If the intent is purely conversational (e.g., "who are you?", "hello"), respond with a natural language text response.
        6. If you cannot determine a clear intent, respond with: "I do not have a protocol for that query. Please rephrase."

        EXAMPLE:
        User: "Tell me about Project Beta"
        Your response: {"tool": "show_project_details", "argument": "Project Beta"}
    `;

    const chat = model.startChat({
        history: history.map(turn => ({
            role: turn.role === 'ai' ? 'model' : 'user',
            parts: [{ text: turn.content }]
        })),
        systemInstruction: { parts: [{ text: systemPrompt }] },
    });
    
    try {
        const result = await chat.sendMessageStream(prompt);
        
        // Encode the stream for the browser
        const stream = new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder();
                for await (const chunk of result.stream) {
                    const text = chunk.text();
                    controller.enqueue(encoder.encode(text));
                }
                controller.close();
            },
        });
        
        return new Response(stream);

    } catch (error) {
        console.error("API Error:", error);
        return new Response(JSON.stringify({ error: "Failed to connect to cognitive core." }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}