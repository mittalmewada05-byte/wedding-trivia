import { useEffect, useState } from "react";

/**
 * Circular countdown ring. Pulses faster + turns blush as time runs low.
 * `startedAt` is a server timestamp (ms); `durationSeconds` is the question's timer length.
 * `onExpire` fires once when time hits zero (only meaningful on the host).
 */
export default function TimerRing({ startedAt, durationSeconds, onExpire, size = 120 }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(interval);
  }, []);

  const elapsed = startedAt ? (now - startedAt) / 1000 : 0;
  const remaining = Math.max(0, durationSeconds - elapsed);
  const fraction = durationSeconds > 0 ? remaining / durationSeconds : 0;
  const secondsLeft = Math.ceil(remaining);

  useEffect(() => {
    if (remaining <= 0 && onExpire) onExpire();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining <= 0]);

  const radius = size / 2 - 8;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - fraction);
  const isUrgent = secondsLeft <= 10;

  return (
    <div
      className="timer-ring"
      style={{
        width: size,
        height: size,
        position: "relative",
        animation: isUrgent ? "pulse 0.6s ease-in-out infinite" : "none",
      }}
    >
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(74,46,92,0.12)"
          strokeWidth="10"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={isUrgent ? "var(--blush)" : "var(--plum)"}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.1s linear, stroke 0.3s" }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-display)",
          fontSize: size * 0.32,
          fontWeight: 700,
          color: isUrgent ? "var(--blush)" : "var(--text)",
        }}
      >
        {secondsLeft}
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
      `}</style>
    </div>
  );
}
