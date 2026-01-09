import { useEffect, useState, useRef, memo } from "react";

interface MatrixRainProps {
  isActive: boolean;
  onComplete?: () => void;
}

interface Drop {
  id: string;
  y: number;
  char: string;
  speed: number;
}

interface Column {
  id: number;
  x: number;
  drops: Drop[];
}

export const MatrixRain = memo(function MatrixRain({ isActive, onComplete }: MatrixRainProps) {
  const [columns, setColumns] = useState<Column[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && onComplete) {
        onComplete(); // ✅ close animation
      }
    }

    if (isActive) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isActive, onComplete]);

  // Matrix animation
  useEffect(() => {
    if (!isActive) return;

    const characters =
      "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
    const columnCount = Math.floor(window.innerWidth / 20);

    const initialColumns = Array.from({ length: columnCount }, (_, i) => ({
      id: i,
      x: i * 20,
      drops: Array.from(
        { length: Math.floor(Math.random() * 20) + 10 },
        (_, j) => ({
          id: `${i}-${j}`,
          y: Math.random() * window.innerHeight,
          char: characters[Math.floor(Math.random() * characters.length)],
          speed: Math.random() * 3 + 1,
        })
      ),
    }));

    setColumns(initialColumns);

    const interval = setInterval(() => {
      setColumns((prev) =>
        prev.map((col) => ({
          ...col,
          drops: col.drops
            .map((drop) => ({
              ...drop,
              y: drop.y + drop.speed,
              char:
                Math.random() < 0.1
                  ? characters[Math.floor(Math.random() * characters.length)]
                  : drop.char,
            }))
            .filter((drop) => drop.y < window.innerHeight + 50)
            .concat(
              Math.random() < 0.3
                ? [
                    {
                      id: `${col.id}-${Date.now()}`,
                      y: -50,
                      char:
                        characters[Math.floor(Math.random() * characters.length)],
                      speed: Math.random() * 3 + 1,
                    },
                  ]
                : []
            ),
        }))
      );
    }, 50);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      if (onComplete) {
        onComplete(); // end animation
      }
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 pointer-events-none"
      style={{ background: "rgba(0, 0, 0, 0.8)" }}
    >
      {columns.flatMap((col) =>
        col.drops.map((drop) => (
          <div
            key={drop.id}
            className="absolute text-green-400 font-mono text-sm"
            style={{
              left: col.x,
              top: drop.y,
              opacity: Math.max(0, 1 - drop.y / window.innerHeight),
              textShadow: "0 0 5px #00ff00",
            }}
          >
            {drop.char}
          </div>
        ))
      )}
    </div>
  );
});
