const SHAPE_COLORS = ["var(--lavender)", "var(--blush)", "var(--mint)", "var(--butter)"];
const SHAPE_ICONS = ["▲", "◆", "●", "■"];

const SNOOZE_LABELS = [
  "still snoozing 😴",
  "lost in the buffet line 🍽️",
  "thinking *really* hard 🤔",
  "phone died, probably 🔌",
];

/**
 * Live bar chart of how many guests picked each option.
 * Bars are sized relative to `totalPlayers` (not just the responses so far),
 * so the chart reads as "share of the whole room," not "share of answers in."
 * `revealCorrect`: if set, highlights the correct index with a border/glow.
 * `totalPlayers`: total guests in the game right now (for the denominator
 *   and the "still deciding" bucket). Falls back to `total` if omitted.
 */
export default function AnswerBars({
  choices,
  counts,
  total,
  totalPlayers = null,
  revealCorrect = null,
  myChoice = null,
}) {
  const denominator = Math.max(1, totalPlayers ?? total);
  const pending = Math.max(0, denominator - total);
  const snoozeLabel = SNOOZE_LABELS[total % SNOOZE_LABELS.length];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
      {choices.map((choice, i) => {
        const count = counts[i] || 0;
        const pct = Math.round((count / denominator) * 100);
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
              <span>
                {count}
                <span style={{ opacity: 0.6, fontWeight: 500 }}> ({pct}%)</span>
              </span>
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

      {pending > 0 && (
        <div>
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
              opacity: 0.75,
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span>💤</span>
              {snoozeLabel}
            </span>
            <span>{pending}</span>
          </div>
          <div
            style={{
              height: 28,
              borderRadius: 14,
              background: "rgba(74,46,92,0.08)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${Math.round((pending / denominator) * 100)}%`,
                background:
                  "repeating-linear-gradient(45deg, rgba(74,46,92,0.18) 0 8px, rgba(74,46,92,0.08) 8px 16px)",
                borderRadius: 14,
                transition: "width 0.5s ease-out",
              }}
            />
          </div>
        </div>
      )}

      <div
        style={{
          textAlign: "center",
          fontSize: 13,
          color: "var(--text-soft)",
          marginTop: 4,
          fontWeight: 600,
        }}
      >
        {total} of {denominator} responded
      </div>
    </div>
  );
}

export { SHAPE_COLORS, SHAPE_ICONS };
