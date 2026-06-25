import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dbRefs, onValue, set, serverTimestamp, ref, db, GAME_ID, runTransaction } from "../lib/firebase";
import { QUESTIONS, QUESTION_TIME_SECONDS } from "../data/questions";
import { PHASES, tallyAnswers, getLeaderboard, calculatePoints } from "../lib/gameLogic";
import TimerRing from "../components/TimerRing";
import AnswerBars from "../components/AnswerBars";
import Leaderboard from "../components/Leaderboard";
import ConfettiBurst from "../components/ConfettiBurst";

const CATEGORY_LABEL = { couple: "Our Story 💕", wedding: "Wedding Trivia 💒", guess: "Newlywed Guess 😏", vibe: "Crowd Vibe Check 🎉" };
const CATEGORY_COLOR = { couple: "var(--blush)", wedding: "var(--sky)", guess: "var(--butter)", vibe: "var(--lavender)" };

export default function Play() {
  const navigate = useNavigate();
  const playerId = typeof window !== "undefined" ? localStorage.getItem("trivia_player_id") : null;
  const playerName = typeof window !== "undefined" ? localStorage.getItem("trivia_player_name") : null;

  const [state, setState] = useState(null);
  const [answers, setAnswers] = useState({});
  const [players, setPlayers] = useState({});
  const [myChoice, setMyChoice] = useState(null);
  const [lastSeenIndex, setLastSeenIndex] = useState(-1);

  // Redirect to join if no player id
  useEffect(() => {
    if (!playerId) navigate("/");
  }, [playerId, navigate]);

  // Subscribe to game state
  useEffect(() => {
    const unsub = onValue(dbRefs.state(), (snap) => setState(snap.val() || { phase: PHASES.LOBBY, questionIndex: -1 }));
    return () => unsub();
  }, []);

  // Subscribe to players (for leaderboard)
  useEffect(() => {
    const unsub = onValue(dbRefs.players(), (snap) => setPlayers(snap.val() || {}));
    return () => unsub();
  }, []);

  const questionIndex = state?.questionIndex ?? -1;
  const question = questionIndex >= 0 ? QUESTIONS[questionIndex] : null;

  // Reset local answer state when a new question starts
  useEffect(() => {
    if (questionIndex !== lastSeenIndex) {
      setMyChoice(null);
      setLastSeenIndex(questionIndex);
    }
  }, [questionIndex, lastSeenIndex]);

  // Subscribe to answers for the current question
  useEffect(() => {
    if (questionIndex < 0) return;
    const unsub = onValue(dbRefs.answers(questionIndex), (snap) => setAnswers(snap.val() || {}));
    return () => unsub();
  }, [questionIndex]);

  async function submitAnswer(choiceIdx) {
    if (myChoice !== null || !question || !playerId) return;
    setMyChoice(choiceIdx);
    const answeredAt = Date.now();
    const startedAt = state?.questionStartedAt || answeredAt;
    const secondsElapsed = Math.max(0, (answeredAt - startedAt) / 1000);
    const isCorrect = choiceIdx === question.correct;

    // Write only to this player's own slot so concurrent guests answering
    // at the same time never clobber each other's responses.
    await set(ref(db, `games/${GAME_ID}/answers/${questionIndex}/${playerId}`), {
      choice: choiceIdx,
      secondsElapsed,
      isCorrect,
    });

    // Update score atomically so double-submits or flaky retries can't
    // double-count points.
    if (isCorrect) {
      const pts = calculatePoints(true, secondsElapsed);
      await runTransaction(dbRefs.player(playerId), (current) => {
        if (!current) return { name: playerName, score: pts };
        return { ...current, score: (current.score || 0) + pts };
      });
    }
  }

  if (!state) {
    return (
      <div className="page-center">
        <p style={{ color: "var(--text-soft)" }}>Connecting…</p>
      </div>
    );
  }

  // ── LOBBY ──────────────────────────────────────────
  if (state.phase === PHASES.LOBBY) {
    return (
      <div className="page-center">
        <div className="card pop-in" style={{ textAlign: "center", maxWidth: 400 }}>
          <div style={{ fontSize: 40 }}>🎊</div>
          <h2 style={{ fontSize: 24, margin: "10px 0" }}>You're in, {playerName}!</h2>
          <p style={{ color: "var(--text-soft)" }}>Sit tight — the host will start the game any moment.</p>
          <div className="spinner" />
        </div>
        <style>{`
          .spinner {
            margin-top: 18px; width: 32px; height: 32px; border-radius: 50%;
            border: 4px solid rgba(74,46,92,0.15); border-top-color: var(--plum);
            animation: spin 0.9s linear infinite;
          }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  // ── ENDED ──────────────────────────────────────────
  if (state.phase === PHASES.ENDED) {
    const board = getLeaderboard(players);
    const myRank = board.findIndex((p) => p.id === playerId);
    return (
      <div className="page-center">
        <ConfettiBurst count={70} />
        <div className="card pop-in" style={{ maxWidth: 440, width: "100%" }}>
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 40 }}>🏆</div>
            <h2 style={{ fontSize: 26 }}>Final Scores!</h2>
            {myRank >= 0 && (
              <p style={{ color: "var(--text-soft)" }}>
                You finished #{myRank + 1} with {board[myRank].score} points
              </p>
            )}
          </div>
          <Leaderboard players={board} highlightId={playerId} />
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="page-center">
        <p style={{ color: "var(--text-soft)" }}>Waiting for the next question…</p>
      </div>
    );
  }

  const { counts, total } = tallyAnswers(answers, question.choices.length);
  const hasAnswered = myChoice !== null;
  const showResults = hasAnswered || state.phase === PHASES.REVEAL;

  // ── QUESTION / REVEAL ──────────────────────────────
  return (
    <div className="page-center" style={{ paddingTop: 28, paddingBottom: 28 }}>
      {state.phase === PHASES.REVEAL && myChoice === question.correct && <ConfettiBurst count={40} />}
      <div className="card pop-in" style={{ maxWidth: 440, width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              padding: "4px 12px",
              borderRadius: 20,
              background: CATEGORY_COLOR[question.category],
              color: "var(--text)",
            }}
          >
            {CATEGORY_LABEL[question.category]}
          </span>
          <span style={{ fontSize: 13, color: "var(--text-soft)", fontWeight: 600 }}>
            Q{questionIndex + 1} / {QUESTIONS.length}
          </span>
        </div>

        {!showResults && (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <TimerRing startedAt={state.questionStartedAt} durationSeconds={QUESTION_TIME_SECONDS} size={84} />
          </div>
        )}

        <h2 style={{ fontSize: 22, textAlign: "center", marginBottom: 20, lineHeight: 1.3 }}>{question.prompt}</h2>

        {!showResults ? (
          <div style={{ display: "grid", gap: 12 }}>
            {question.choices.map((choice, i) => (
              <button key={i} onClick={() => submitAnswer(i)} className="choice-btn" style={{ background: choiceColor(i) }}>
                {choice}
              </button>
            ))}
          </div>
        ) : (
          <>
            {hasAnswered && state.phase === PHASES.QUESTION && (
              <p style={{ textAlign: "center", color: "var(--text-soft)", fontWeight: 600, marginBottom: 14 }}>
                Got it! Watching live results…
              </p>
            )}
            {state.phase === PHASES.REVEAL && (
              <p
                style={{
                  textAlign: "center",
                  fontWeight: 700,
                  marginBottom: 14,
                  color: myChoice === question.correct ? "#3F9B6E" : myChoice === null ? "var(--text-soft)" : "#C0507A",
                }}
              >
                {myChoice === question.correct
                  ? "✅ Correct! Nice one."
                  : myChoice === null
                  ? "⏱️ Time's up — you didn't answer in time."
                  : "❌ Not quite!"}
              </p>
            )}
            <AnswerBars
              choices={question.choices}
              counts={counts}
              total={total}
              myChoice={myChoice}
              revealCorrect={state.phase === PHASES.REVEAL ? question.correct : null}
            />
          </>
        )}
      </div>

      {state.phase === PHASES.REVEAL && (
        <div className="card pop-in" style={{ maxWidth: 440, width: "100%", marginTop: 16 }}>
          <h3 style={{ fontSize: 17, marginBottom: 12, textAlign: "center" }}>Leaderboard so far</h3>
          <Leaderboard players={getLeaderboard(players)} highlightId={playerId} limit={5} />
        </div>
      )}
    </div>
  );
}

function choiceColor(i) {
  return ["var(--lavender)", "var(--blush)", "var(--mint)", "var(--butter)"][i % 4];
}
