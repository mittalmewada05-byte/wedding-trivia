import { useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { dbRefs, onValue, set, update, serverTimestamp, remove } from "../lib/firebase";
import { QUESTIONS, QUESTION_TIME_SECONDS } from "../data/questions";
import { PHASES, tallyAnswers, getLeaderboard } from "../lib/gameLogic";
import TimerRing from "../components/TimerRing";
import AnswerBars from "../components/AnswerBars";
import Leaderboard from "../components/Leaderboard";
import ConfettiBurst from "../components/ConfettiBurst";

const CATEGORY_LABEL = { couple: "Our Story 💕", wedding: "Wedding Trivia 💒", guess: "Newlywed Guess 😏", vibe: "Crowd Vibe Check 🎉" };
const CATEGORY_COLOR = { couple: "var(--blush)", wedding: "var(--sky)", guess: "var(--butter)", vibe: "var(--lavender)" };

export default function Host() {
  const [state, setState] = useState(null);
  const [answers, setAnswers] = useState({});
  const [players, setPlayers] = useState({});
  // Compute synchronously on first render so QRCodeSVG never sees an
  // empty string (which throws and can crash the whole page).
  const [joinUrl] = useState(() => (typeof window !== "undefined" ? window.location.origin + "/" : ""));

  useEffect(() => {
    const unsub = onValue(dbRefs.state(), (snap) => setState(snap.val() || { phase: PHASES.LOBBY, questionIndex: -1 }));
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = onValue(dbRefs.players(), (snap) => setPlayers(snap.val() || {}));
    return () => unsub();
  }, []);

  const questionIndex = state?.questionIndex ?? -1;
  const question = questionIndex >= 0 && questionIndex < QUESTIONS.length ? QUESTIONS[questionIndex] : null;

  useEffect(() => {
    if (questionIndex < 0) return;
    const unsub = onValue(dbRefs.answers(questionIndex), (snap) => setAnswers(snap.val() || {}));
    return () => unsub();
  }, [questionIndex]);

  const playerCount = Object.keys(players || {}).length;
  const { counts, total } = question ? tallyAnswers(answers, question.choices.length) : { counts: [], total: 0 };

  // Tracks which question index was most recently revealed *forward*
  // (via "Reveal Now" or the timer expiring), so confetti only fires the
  // first time a question is revealed — not when navigating back to
  // re-view an earlier one with the Previous button.
  const lastRevealedIndexRef = useRef(-1);

  async function showIntro() {
    await set(dbRefs.state(), { phase: PHASES.INTRO, questionIndex: -1 });
  }

  async function launchFirstQuestion() {
    await set(dbRefs.state(), {
      phase: PHASES.QUESTION,
      questionIndex: 0,
      questionStartedAt: Date.now(),
    });
  }

  async function nextQuestion() {
    const nextIndex = questionIndex + 1;
    if (nextIndex >= QUESTIONS.length) {
      await update(dbRefs.state(), { phase: PHASES.ENDED });
    } else {
      await set(dbRefs.state(), {
        phase: PHASES.QUESTION,
        questionIndex: nextIndex,
        questionStartedAt: Date.now(),
      });
    }
  }

  async function revealAnswer() {
    lastRevealedIndexRef.current = questionIndex;
    await update(dbRefs.state(), { phase: PHASES.REVEAL });
  }

  async function previousQuestion() {
    const prevIndex = questionIndex - 1;
    if (prevIndex < 0) return; // already at Q1, nothing earlier to show
    // Land on REVEAL for the earlier question so the host can see that
    // question's answers + leaderboard again, without reopening voting.
    await set(dbRefs.state(), {
      phase: PHASES.REVEAL,
      questionIndex: prevIndex,
      questionStartedAt: state?.questionStartedAt || Date.now(),
    });
  }

  async function resetGame() {
    if (!window.confirm("Reset the game? This clears scores and answers (players stay joined).")) return;
    for (let i = 0; i < QUESTIONS.length; i++) {
      await remove(dbRefs.answers(i));
    }
    const updates = {};
    Object.keys(players).forEach((id) => {
      updates[id] = { ...players[id], score: 0 };
    });
    await set(dbRefs.players(), updates);
    lastRevealedIndexRef.current = -1;
    await set(dbRefs.state(), { phase: PHASES.LOBBY, questionIndex: -1 });
  }

  async function clearEverything() {
    if (
      !window.confirm(
        "Start completely fresh? This removes ALL joined guests, scores, and answers — everyone will need to re-scan the QR code and rejoin. Use this right before the real game, not between test runs."
      )
    )
      return;
    for (let i = 0; i < QUESTIONS.length; i++) {
      await remove(dbRefs.answers(i));
    }
    await remove(dbRefs.players());
    lastRevealedIndexRef.current = -1;
    await set(dbRefs.state(), { phase: PHASES.LOBBY, questionIndex: -1 });
  }

  if (!state) return <div className="page-center">Loading…</div>;

  return (
    <div style={{ minHeight: "100vh", padding: "28px 20px", maxWidth: 760, margin: "0 auto" }}>
      <header style={{ textAlign: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 28 }}>💍 Wedding Trivia — Host</h1>
        <p style={{ color: "var(--text-soft)", marginTop: 4 }}>
          {playerCount} guest{playerCount === 1 ? "" : "s"} joined
        </p>
      </header>

      {state.phase === PHASES.LOBBY && (
        <div className="card pop-in" style={{ textAlign: "center" }}>
          <h2 style={{ marginBottom: 14, fontSize: 20 }}>Have guests scan to join</h2>
          <div
            style={{
              display: "inline-block",
              padding: 16,
              background: "var(--white)",
              borderRadius: "var(--radius-md)",
              boxShadow: "var(--shadow-pop)",
            }}
          >
            {joinUrl ? (
              <QRCodeSVG value={joinUrl} size={220} fgColor="#4A2E5C" bgColor="#FFFFFF" />
            ) : (
              <div style={{ width: 220, height: 220, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-soft)" }}>
                Loading QR code…
              </div>
            )}
          </div>
          <p style={{ marginTop: 12, color: "var(--text-soft)", fontSize: 14 }}>{joinUrl}</p>
          <button onClick={showIntro} className="btn-primary" style={{ marginTop: 18, fontSize: 20, padding: "16px 36px" }}>
            Show Rules & Get Ready 🎉
          </button>
        </div>
      )}

      {state.phase === PHASES.INTRO && (
        <div className="card pop-in" style={{ textAlign: "center" }}>
          <div style={{ fontSize: 40 }}>💍🎉</div>
          <h2 style={{ fontSize: 24, marginBottom: 6 }}>Vidhi & Sudhir's Wedding Trivia</h2>
          <p style={{ color: "var(--text-soft)", marginBottom: 16 }}>
            Guests are looking at the rules + scoring explainer on their phones right
            now. Give the room a few seconds to read, then kick things off.
          </p>
          <div
            style={{
              textAlign: "left",
              background: "rgba(74,46,92,0.06)",
              borderRadius: "var(--radius-md)",
              padding: "16px 18px",
              fontSize: 14,
              lineHeight: 1.6,
              marginBottom: 18,
            }}
          >
            <p style={{ margin: "0 0 6px" }}>📱 4 choices, 30 seconds per question.</p>
            <p style={{ margin: "0 0 6px" }}>⚡ Faster correct answers score more points.</p>
            <p style={{ margin: 0 }}>🫣 Equal-opportunity embarrassment for both the bride and groom — guaranteed.</p>
          </div>
          <p style={{ color: "var(--text-soft)", marginBottom: 16, fontWeight: 600 }}>
            {playerCount} guest{playerCount === 1 ? "" : "s"} ready
          </p>
          <button onClick={launchFirstQuestion} className="btn-primary" style={{ fontSize: 20, padding: "16px 36px" }}>
            Start Question 1 →
          </button>
        </div>
      )}

      {state.phase === PHASES.QUESTION && question && (
        <div className="card pop-in">
          <QuestionHeader index={questionIndex} question={question} />
          <div style={{ display: "flex", justifyContent: "center", margin: "18px 0" }}>
            <TimerRing
              startedAt={state.questionStartedAt}
              durationSeconds={QUESTION_TIME_SECONDS}
              onExpire={revealAnswer}
              size={110}
            />
          </div>
          <h2 style={{ fontSize: 24, textAlign: "center", marginBottom: 18 }}>{question.prompt}</h2>
          <AnswerBars choices={question.choices} counts={counts} total={total} totalPlayers={playerCount} />
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <button onClick={revealAnswer} className="btn-secondary">
              Reveal Now ⚡
            </button>
          </div>
        </div>
      )}

      {state.phase === PHASES.REVEAL && question && (
        <div className="card pop-in">
          {questionIndex === lastRevealedIndexRef.current && <ConfettiBurst count={30} />}
          <QuestionHeader index={questionIndex} question={question} />
          <h2 style={{ fontSize: 22, textAlign: "center", marginBottom: 6 }}>{question.prompt}</h2>
          <p style={{ textAlign: "center", color: "var(--text-soft)", marginBottom: 16, fontWeight: 600 }}>
            Correct answer: <strong style={{ color: "var(--text)" }}>{question.choices[question.correct]}</strong>
          </p>
          <AnswerBars choices={question.choices} counts={counts} total={total} totalPlayers={playerCount} revealCorrect={question.correct} />
          <div style={{ marginTop: 24 }}>
            <h3 style={{ fontSize: 17, marginBottom: 12, textAlign: "center" }}>Leaderboard</h3>
            <Leaderboard players={getLeaderboard(players)} limit={8} />
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 20, flexWrap: "wrap" }}>
            <button
              onClick={previousQuestion}
              className="btn-secondary"
              disabled={questionIndex <= 0}
              style={{ fontSize: 16, padding: "12px 24px", opacity: questionIndex <= 0 ? 0.5 : 1 }}
            >
              ← Previous Question
            </button>
            <button onClick={nextQuestion} className="btn-primary" style={{ fontSize: 18, padding: "14px 32px" }}>
              {questionIndex + 1 >= QUESTIONS.length ? "See Final Results 🏆" : "Next Question →"}
            </button>
          </div>
        </div>
      )}

      {state.phase === PHASES.ENDED && (
        <div className="card pop-in" style={{ textAlign: "center" }}>
          <ConfettiBurst count={80} />
          <div style={{ fontSize: 44 }}>🏆</div>
          <h2 style={{ fontSize: 26, marginBottom: 16 }}>Final Leaderboard</h2>
          <Leaderboard players={getLeaderboard(players)} limit={10} />
        </div>
      )}

      <div style={{ textAlign: "center", marginTop: 28, display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
        <button onClick={resetGame} className="btn-ghost">
          Reset scores (keep guests joined)
        </button>
        <button onClick={clearEverything} className="btn-ghost" style={{ color: "#C0507A" }}>
          Clear everyone & start fresh
        </button>
      </div>
    </div>
  );
}

function QuestionHeader({ index, question }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span
        style={{
          fontSize: 13,
          fontWeight: 700,
          padding: "5px 14px",
          borderRadius: 20,
          background: CATEGORY_COLOR[question.category],
        }}
      >
        {CATEGORY_LABEL[question.category]}
      </span>
      <span style={{ fontSize: 14, color: "var(--text-soft)", fontWeight: 700 }}>
        Question {index + 1} of {QUESTIONS.length}
      </span>
    </div>
  );
}
