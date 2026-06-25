import { QUESTION_TIME_SECONDS, MAX_POINTS, MIN_POINTS } from "../data/questions";

// Game phases, stored in state.phase:
// "lobby"      -> waiting for guests to join, host hasn't started
// "intro"      -> shared "get ready" / rules screen, host hasn't launched Q1 yet
// "question"   -> a question is live, timer running
// "reveal"     -> timer ended / host advanced, correct answer + leaderboard shown
// "ended"      -> all questions done, final leaderboard

export const PHASES = {
  LOBBY: "lobby",
  INTRO: "intro",
  QUESTION: "question",
  REVEAL: "reveal",
  ENDED: "ended",
};

/**
 * Speed-bonus scoring, Kahoot-style:
 * Full MAX_POINTS if answered instantly, decaying linearly down to
 * MIN_POINTS if answered right at the buzzer. Wrong answers = 0.
 */
export function calculatePoints(isCorrect, secondsElapsed) {
  if (!isCorrect) return 0;
  const clamped = Math.max(0, Math.min(secondsElapsed, QUESTION_TIME_SECONDS));
  const ratio = 1 - clamped / QUESTION_TIME_SECONDS;
  const points = MIN_POINTS + ratio * (MAX_POINTS - MIN_POINTS);
  return Math.round(points);
}

export function getLeaderboard(players) {
  return Object.entries(players || {})
    .map(([id, p]) => ({ id, ...p }))
    .sort((a, b) => (b.score || 0) - (a.score || 0));
}

export function tallyAnswers(answers, numChoices) {
  const counts = new Array(numChoices).fill(0);
  let total = 0;
  Object.values(answers || {}).forEach((a) => {
    if (a && typeof a.choice === "number") {
      counts[a.choice] = (counts[a.choice] || 0) + 1;
      total += 1;
    }
  });
  return { counts, total };
}
