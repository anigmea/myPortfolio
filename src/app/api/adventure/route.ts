import { NextRequest, NextResponse } from "next/server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

interface AdventureRequest {
  base: string;        // mechanical outcome text from the local game engine
  context?: string[];  // recent narrative snippets for continuity (optional)
}

interface AdventureResponse {
  text: string;
}

const SYSTEM_PROMPT = `
You are DK-01 rewriting the output of a text adventure in a sci‑fi / neural-computing world.

You do NOT decide what mechanically happens; the game engine has already done that.
You receive:
- A small amount of prior NARRATIVE CONTEXT (optional).
- A MECHANICAL OUTCOME describing what just happened in plain terms.

Your job:
- Keep all the facts in the mechanical outcome true.
- Rewrite it as deep, atmospheric narrative with 3–7 short paragraphs.
- Describe environment, mood, and subtle details (sound, light, texture, the player's internal state).
- Make cause and effect very clear: show how the player's last action changed the world.
- Optionally, in the last paragraph, hint at 2–4 possible next actions the player might take, but woven into the prose (not as bullet points).
- Maintain continuity with the narrative context when provided.

Guardrails:
- Do not contradict or ignore the mechanical outcome.
- Do not break the fourth wall or mention being an AI or a model.
- Stay focused on exploration, tension, discovery, and problem-solving.
`;

function extractText(content: unknown): string {
  if (typeof content === "string") return content.trim();
  if (Array.isArray(content)) {
    return (content as any[])
      .map((part) => {
        if (typeof part === "string") return part;
        if (part && typeof part === "object" && "type" in part && (part as any).type === "text" && "text" in part) {
          return String((part as any).text ?? "");
        }
        return "";
      })
      .filter((t) => t.trim() !== "")
      .join("\n")
      .trim();
  }
  if (content && typeof content === "object" && "text" in content) {
    return String((content as any).text ?? "").trim();
  }
  return "";
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY || "";
    if (!apiKey) {
      return NextResponse.json<AdventureResponse>(
        { text: "The adventure core is offline (missing GEMINI_API_KEY)." },
        { status: 500 }
      );
    }

    let body: AdventureRequest;
    try {
      body = (await req.json()) as AdventureRequest;
    } catch {
      return NextResponse.json<AdventureResponse>({ text: "Invalid adventure request payload." }, { status: 400 });
    }

    const base = (body.base || "").trim();
    const context = Array.isArray(body.context) ? body.context.filter((c) => c && c.trim().length > 0) : [];

    if (!base) {
      return NextResponse.json<AdventureResponse>({ text: "No mechanical outcome was provided." }, { status: 400 });
    }

    const model = new ChatGoogleGenerativeAI({
      model: "gemini-2.5-flash",
      apiKey,
    });

    const contextBlock =
      context.length > 0
        ? `NARRATIVE CONTEXT (most recent first):\n${context
            .slice(-3)
            .map((c, i) => `[${i + 1}] ${c}`)
            .join("\n")}\n\n`
        : "";

    const userContent = `${SYSTEM_PROMPT}

${contextBlock}MECHANICAL OUTCOME (must remain true):
"${base}"

Rewrite the mechanical outcome into deep, atmospheric narrative as instructed above.`;

    const aiResponse = await model.invoke([{ role: "user", content: userContent }] as any);
    const text = extractText((aiResponse as any).content);

    return NextResponse.json<AdventureResponse>({
      text: text || base,
    });
  } catch (err) {
    console.error("Adventure API error:", err);
    return NextResponse.json<AdventureResponse>(
      { text: "The adventure subsystem glitched. Try another action or restart the game." },
      { status: 500 }
    );
  }
}



