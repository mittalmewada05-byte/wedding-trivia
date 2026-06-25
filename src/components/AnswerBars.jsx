const SHAPE_COLORS = ["var(--lavender)", "var(--blush)", "var(--mint)", "var(--butter)"];
const SHAPE_ICONS = ["▲", "◆", "●", "■"];

/**
 * Live bar chart of how many guests picked each option.
 * `revealCorrect`: if set, highlights the correct index with a border/glow.
 */
export default function AnswerBars({ choices, counts, total, revealCorrect = null, myChoice = null }) {
  const max = Math.max(1, ...counts);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
      {choices.map((choice, i) => {
        const count = counts[i] || 0;
        const pct = Math.round((count / max) * 100);
        const isCorrect = revealCorrect === i;
        const isMine = myChoice === i;
        return (
          <div key={i}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 4,
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                fontSize: 14,
                color: "var(--text-soft)",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: SHAPE_COLORS[i] }}>{SHAPE_ICONS[i]}</span>
                {choice}
                {isMine && <span style={{ fontSize: 12, opacity: 0.7 }}>(your pick)</span>}
              </span>
              <span>{count}</span>
            </div>
            <div
              style={{
                height: 28,
                borderRadius: 14,
                background: "rgba(74,46,92,0.08)",
                overflow: "hidden",
                border: isCorrect ? "3px solid var(--mint)" : "3px solid transparent",
                boxShadow: isCorrect ? "0 0 0 3px rgba(168,224,200,0.5)" : "none",
                transition: "border 0.3s, box-shadow 0.3s",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${count > 0 ? pct : 0}%`,
                  background: SHAPE_COLORS[i],
                  borderRadius: 14,
                  transition: "width 0.5s ease-out",
                }}
              />
            </div>
          </div>
        );
      })}
      <div
        style={{
          textAlign: "center",
          fontSize: 13,
          color: "var(--text-soft)",
          marginTop: 4,
          fontWeight: 600,
        }}
      >
        {total} response{total === 1 ? "" : "s"}
      </div>
    </div>
  );
}

export { SHAPE_COLORS, SHAPE_ICONS };
