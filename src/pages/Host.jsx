import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { dbRefs, onValue, set, update, serverTimestamp, remove } from "../lib/firebase";
import { QUESTIONS, QUESTION_TIME_SECONDS } from "../data/questions";
import { PHASES, tallyAnswers, getLeaderboard } from "../lib/gameLogic";
import TimerRing from "../components/TimerRing";
import AnswerBars from "../components/AnswerBars";
import Leaderboard from "../components/Leaderboard";
import ConfettiBurst from "../components/ConfettiBurst";

const CATEGORY_LABEL = { couple: "Our Story 💕", wedding: "Wedding Trivia 💒", guess: "Newlywed Guess 😏" };
const CATEGORY_COLOR = { couple: "var(--blush)", wedding: "var(--sky)", guess: "var(--butter)" };

export default function Host() {
  const [state, setState] = useState(null);
  const [answers, setAnswers] = useState({});
  const [players, setPlayers] = useState({});
  const [joinUrl, setJoinUrl] = useState("");

  useEffect(() => {
    setJoinUrl(window.location.origin + "/");
  }, []);

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

  async function startGame() {
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
    await update(dbRefs.state(), { phase: PHASES.REVEAL });
  }

  async function resetGame() {
    if (!window.confirm("Reset the whole game? This clears scores and answers (players stay joined).")) return;
    for (let i = 0; i < QUESTIONS.length; i++) {
      await remove(dbRefs.answers(i));
    }
    const updates = {};
    Object.keys(players).forEach((id) => {
      updates[id] = { ...players[id], score: 0 };
    });
    await set(dbRefs.players(), updates);
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
            <QRCodeSVG value={joinUrl} size={220} fgColor="#4A2E5C" bgColor="#FFFFFF" />
          </div>
          <p style={{ marginTop: 12, color: "var(--text-soft)", fontSize: 14 }}>{joinUrl}</p>
          <button onClick={startGame} className="btn-primary" style={{ marginTop: 18, fontSize: 20, padding: "16px 36px" }}>
            Start Game 🎉
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
          <AnswerBars choices={question.choices} counts={counts} total={total} />
          <p style={{ textAlign: "center", marginTop: 12, color: "var(--text-soft)", fontWeight: 600 }}>
            {total} / {playerCount} responded
          </p>
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <button onClick={revealAnswer} className="btn-secondary">
              Reveal Now ⚡
            </button>
          </div>
        </div>
      )}

      {state.phase === PHASES.REVEAL && question && (
        <div className="card pop-in">
          {questionIndex >= 0 && <ConfettiBurst count={30} />}
          <QuestionHeader index={questionIndex} question={question} />
          <h2 style={{ fontSize: 22, textAlign: "center", marginBottom: 6 }}>{question.prompt}</h2>
          <p style={{ textAlign: "center", color: "var(--text-soft)", marginBottom: 16, fontWeight: 600 }}>
            Correct answer: <strong style={{ color: "var(--text)" }}>{question.choices[question.correct]}</strong>
          </p>
          <AnswerBars choices={question.choices} counts={counts} total={total} revealCorrect={question.correct} />
          <div style={{ marginTop: 24 }}>
            <h3 style={{ fontSize: 17, marginBottom: 12, textAlign: "center" }}>Leaderboard</h3>
            <Leaderboard players={getLeaderboard(players)} limit={8} />
          </div>
          <div style={{ textAlign: "center", marginTop: 20 }}>
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

      <div style={{ textAlign: "center", marginTop: 28 }}>
        <button onClick={resetGame} className="btn-ghost">
          Reset game
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
