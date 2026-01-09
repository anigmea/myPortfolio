import { useEffect, useState, memo } from "react";

interface GameState {
  location: string;
  inventory: string[];
  health: number;
  score: number;
  turns: number;
}

interface HistoryEntry {
  command: string;
  base: string;
  narrative: string;
}

const INITIAL_STATE: GameState = {
  location: "vault",
  inventory: [],
  health: 100,
  score: 0,
  turns: 0,
};

// Simple mechanical engine: rooms & actions
function processLocalCommand(state: GameState, command: string): { next: GameState; text: string } {
  const cmd = command.trim().toLowerCase();
  let text = "";
  let next: GameState = { ...state, turns: state.turns + 1 };

  if (cmd === "look" || cmd === "look around") {
    if (state.location === "vault") {
      text =
        "You are in a cold server vault. Racks of machines exhale warm air. A maintenance hatch leads OUT, and a diagnostic CONSOLE flickers nearby.";
    } else if (state.location === "corridor") {
      text =
        "You stand in a narrow corridor lined with fiber bundles. One way leads back to the VAULT, another toward a glass-walled LAB.";
    } else if (state.location === "lab") {
      text =
        "You’re in a lab of suspended drones, robotic arms, and open chassis. A rooftop ACCESS ladder disappears upward into the dark.";
    } else {
      text = "You pause and take it all in. The architecture hums quietly around you.";
    }
    return { next, text };
  }

  if (cmd.startsWith("go ") || cmd.startsWith("move ")) {
    const dir = cmd.split(" ")[1];
    if (state.location === "vault" && (dir === "out" || dir === "corridor")) {
      next.location = "corridor";
      text = "You leave the vault and step into a long corridor.";
    } else if (state.location === "corridor" && dir === "vault") {
      next.location = "vault";
      text = "You slip back into the vault, the door closing softly behind you.";
    } else if (state.location === "corridor" && dir === "lab") {
      next.location = "lab";
      text = "You head toward the lab, passing sensor arrays that track your motion.";
    } else if (state.location === "lab" && dir === "access") {
      next.location = "rooftop";
      next.score += 50;
      text =
        "You climb the access ladder toward the rooftop. Cold air greets you as city lights flare below. Something about this elevation feels like a way out. (+50 score)";
    } else {
      text = "You hesitate. That path doesn’t feel valid from here.";
    }
    return { next, text };
  }

  if (cmd === "check console" || cmd === "use console") {
    if (state.location === "vault") {
      next.score += 10;
      text = "You wake an old diagnostic console. Logs of failed experiments flicker by. (+10 score)";
    } else {
      text = "There is no console here to check.";
    }
    return { next, text };
  }

  if (cmd === "inventory" || cmd === "inv") {
    text =
      next.inventory.length === 0
        ? "You quickly pat yourself down. No physical tools, just your mind and the system around you."
        : `You carry: ${next.inventory.join(", ")}.`;
    return { next, text };
  }

  if (cmd === "stats") {
    text = `Status — Health: ${next.health}, Score: ${next.score}, Turns: ${next.turns}.`;
    return { next, text };
  }

  if (cmd === "rest") {
    next.health = Math.min(100, next.health + 5);
    text = "You take a moment to breathe. The noise of the facility recedes. (+5 health)";
    return { next, text };
  }

  if (cmd === "quit" || cmd === "exit") {
    text = "You close your eyes and let the simulation dissolve.";
    return { next, text };
  }

  // Fallback: describe uncertainty mechanically; Gemini will make it interesting.
  text =
    "You attempt something that doesn’t quite map cleanly to known actions. The system hesitates, waiting for a clearer intention.";
  return { next, text };
}

let llmDisabled = false;

async function embellish(base: string, recentNarrative: string[]): Promise<string | null> {
  // Short-circuit if we've already detected quota issues or the LLM is disabled.
  if (llmDisabled) return null;
  try {
    const res = await fetch("/api/adventure", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ base, context: recentNarrative }),
    });

    if (!res.ok) {
      // If we're over quota or otherwise blocked, permanently disable embellishment
      if (res.status === 429) {
        llmDisabled = true;
      }
      return null;
    }

    const data = (await res.json()) as { text: string };
    return data.text || null;
  } catch (e) {
    console.error("Adventure embellish error:", e);
    // On network / other errors, keep the game purely local from now on.
    llmDisabled = true;
    return null;
  }
}

export const TextAdventure = memo(function TextAdventure({
  isActive,
  onComplete,
}: {
  isActive: boolean;
  onComplete: () => void;
}) {
  const [state, setState] = useState<GameState>(INITIAL_STATE);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isActive) return;
    setState(INITIAL_STATE);
    setHistory([]);
    setInput("");
    setError(null);
    setIsLoading(false);
    // Show initial mechanical intro
    const introBase =
      "You awaken in a server vault controlled by DK-01. Racks of machines surround you, and a single hatch leads out.";
    setHistory([{ command: "—", base: introBase, narrative: introBase }]);
  }, [isActive]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const command = input.trim();
    setInput("");
    setError(null);

    const { next, text: base } = processLocalCommand(state, command);
    setState(next);

    // Local update so the game feels snappy
    let entry: HistoryEntry = { command, base, narrative: base };
    setHistory((prev) => [...prev, entry]);

    if (command.toLowerCase() === "quit" || command.toLowerCase() === "exit") {
      onComplete();
      return;
    }

    // Ask Gemini to embellish the base text using recent narrative
    try {
      setIsLoading(true);
      const recentNarrative = history.slice(-3).map((h) => h.narrative);
      const embellished = await embellish(base, recentNarrative);
      if (embellished) {
        setHistory((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { ...updated[updated.length - 1], narrative: embellished };
          return updated;
        });
      }
    } catch {
      setError("The narrative layer is offline. Continuing with the base game only.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black text-green-400 p-8 overflow-auto">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-2 text-green-300">Neural Sprawl: DK‑01 Adventure</h2>
        <p className="text-sm text-green-300/80 mb-4">
          Core logic runs locally; DK‑01 rewrites each move into deeper narrative. Type what you want to do.
        </p>

        <div className="mb-3 text-xs text-green-500/80">
          Location: <span className="font-mono">{state.location}</span> | Health: {state.health} | Score: {state.score} |
          Turns: {state.turns}
        </div>

        <div className="mb-4 p-4 border border-green-500/50 bg-black/50 rounded whitespace-pre-wrap">
          {history.map((h, idx) => (
            <div key={idx} className="mb-3">
              {idx > 0 && (
                <div className="text-green-300 mb-1">&gt; {h.command}</div>
              )}
              <div>{h.narrative}</div>
            </div>
          ))}
          {isLoading && <div className="text-green-400/80">...rewriting reality</div>}
        </div>

        {error && <div className="mb-3 text-sm text-red-400">{error}</div>}

        <form onSubmit={handleSubmit} className="mt-2">
          <div className="flex">
            <span className="text-green-300 mr-2">&gt;</span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent border-none text-green-400 outline-none"
              placeholder='Examples: "look around", "go out", "check console", "rest", "stats", "inventory"'
              autoFocus
            />
          </div>
        </form>

        <div className="mt-4 text-sm text-green-500">
          System commands: <span className="font-mono">look</span>,{" "}
          <span className="font-mono">go [direction]</span>, <span className="font-mono">check console</span>,{" "}
          <span className="font-mono">inventory</span>, <span className="font-mono">stats</span>,{" "}
          <span className="font-mono">rest</span>, <span className="font-mono">quit</span>.
        </div>
      </div>
    </div>
  );
});

