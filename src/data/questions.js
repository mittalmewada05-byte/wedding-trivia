// ─────────────────────────────────────────────────────────────
// WEDDING TRIVIA QUESTIONS — edit me!
// ─────────────────────────────────────────────────────────────
// • Replace [bracketed] placeholders with your real details.
// • `correct` is the 0-based index of the right answer (0=A, 1=B, 2=C, 3=D).
// • `category` just controls the little label + accent color shown on screen.
//   Options: "couple" | "wedding" | "guess"
// • Keep exactly 4 choices per question — the UI is built around 4.
// • You can reorder, add, or delete questions freely; just keep the
//   same shape for each object.
// ─────────────────────────────────────────────────────────────

export const COUPLE_NAMES = {
  partnerA: "Partner A",
  partnerB: "Partner B",
};

export const QUESTIONS = [
  {
    id: 1,
    category: "guess",
    prompt: "Who is more likely to cry first during the ceremony?",
    choices: ["Partner A", "Partner B", "Both, simultaneously", "Neither — ice queens"],
    correct: 0,
  },
  {
    id: 2,
    category: "couple",
    prompt: "Where did Partner A and Partner B first meet?",
    choices: ["[Real location]", "A bar in Cleveland", "On a dating app", "Through mutual friends"],
    correct: 0,
  },
  {
    id: 3,
    category: "wedding",
    prompt: 'Traditionally, what does "something blue" symbolize in the old wedding rhyme?',
    choices: ["Fidelity and loyalty", "Good luck", "Wealth", "New beginnings"],
    correct: 0,
  },
  {
    id: 4,
    category: "couple",
    prompt: "What did they do on their first official date?",
    choices: ["[Real answer]", "Mini golf gone wrong", "A movie neither remembers", "A walk that 'wasn't a date'"],
    correct: 0,
  },
  {
    id: 5,
    category: "guess",
    prompt: 'Who said "I love you" first?',
    choices: ["Partner A", "Partner B", "They said it at the same time", "It's still TBD"],
    correct: 0,
  },
  {
    id: 6,
    category: "wedding",
    prompt: "Historically, why does the bride traditionally stand on the groom's left?",
    choices: [
      "So his right hand was free to fight off rival suitors",
      "It was considered good luck",
      "A tradition borrowed from royal weddings",
      "No real reason — just convention",
    ],
    correct: 0,
  },
  {
    id: 7,
    category: "couple",
    prompt: "Where did the proposal happen?",
    choices: ["[Real location]", "In line at Costco", "At a sports game, on the big screen", "On a Zoom call"],
    correct: 0,
  },
  {
    id: 8,
    category: "wedding",
    prompt: "What's the most popular month to get married in the U.S.?",
    choices: ["June", "December", "February", "March"],
    correct: 0,
  },
  {
    id: 9,
    category: "guess",
    prompt: "Who takes longer to get ready before going out?",
    choices: ["Partner A", "Partner B", "They're exactly the same", "Depends entirely on the occasion"],
    correct: 0,
  },
  {
    id: 10,
    category: "couple",
    prompt: "What song is their first dance?",
    choices: ["[Real song]", "Their inside-joke song", "Something dramatically operatic", "Whatever the DJ grabs last-minute"],
    correct: 0,
  },
];

// Points: base points for a correct answer, scaled down by how long
// the guest took to answer (faster = closer to full points).
export const QUESTION_TIME_SECONDS = 30;
export const MAX_POINTS = 1000;
export const MIN_POINTS = 200; // floor for a correct-but-slow answer
