import { useMemo } from "react";

const COLORS = ["var(--lavender)", "var(--blush)", "var(--mint)", "var(--butter)", "var(--sky)"];
const SHAPES = ["circle", "square", "triangle"];

function randomPiece(i) {
  return {
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.4,
    duration: 2.2 + Math.random() * 1.4,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
    size: 8 + Math.random() * 10,
    rotation: Math.random() * 360,
    drift: (Math.random() - 0.5) * 200,
  };
}

/** Fire-and-forget confetti burst. Mount it conditionally to trigger. */
export default function ConfettiBurst({ count = 60 }) {
  const pieces = useMemo(() => Array.from({ length: count }, (_, i) => randomPiece(i)), [count]);

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 999 }}>
      {pieces.map((p) => (
        <span
          key={p.id}
          style={{
            position: "absolute",
            top: -20,
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            background: p.shape === "triangle" ? "transparent" : p.color,
            borderRadius: p.shape === "circle" ? "50%" : p.shape === "square" ? "3px" : 0,
            borderLeft: p.shape === "triangle" ? `${p.size / 2}px solid transparent` : "none",
            borderRight: p.shape === "triangle" ? `${p.size / 2}px solid transparent` : "none",
            borderBottom: p.shape === "triangle" ? `${p.size}px solid ${p.color}` : "none",
            animation: `confetti-fall ${p.duration}s ease-in ${p.delay}s forwards`,
            "--drift": `${p.drift}px`,
            "--rot": `${p.rotation}deg`,
          }}
        />
      ))}
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
          100% { transform: translate(var(--drift), 110vh) rotate(var(--rot)); opacity: 0.9; }
        }
      `}</style>
    </div>
  );
}
