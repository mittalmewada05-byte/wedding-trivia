const MEDALS = ["🥇", "🥈", "🥉"];

export default function Leaderboard({ players, highlightId = null, limit = 10 }) {
  const top = players.slice(0, limit);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
      {top.map((p, i) => {
        const isMe = p.id === highlightId;
        return (
          <div
            key={p.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 18px",
              borderRadius: "var(--radius-md)",
              background: isMe ? "var(--lavender)" : "var(--white)",
              boxShadow: "var(--shadow-card)",
              border: isMe ? "3px solid var(--plum)" : "3px solid transparent",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 20,
                fontWeight: 700,
                width: 36,
                textAlign: "center",
                color: "var(--text-soft)",
              }}
            >
              {MEDALS[i] || `#${i + 1}`}
            </div>
            <div style={{ flex: 1, fontWeight: 600, fontSize: 17, color: "var(--text)" }}>
              {p.name} {isMe && <span style={{ fontSize: 13, opacity: 0.7 }}>(you)</span>}
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--text)" }}>
              {p.score || 0}
            </div>
          </div>
        );
      })}
      {top.length === 0 && (
        <div style={{ textAlign: "center", color: "var(--text-soft)", padding: 20 }}>
          No scores yet — first question coming up!
        </div>
      )}
    </div>
  );
}
