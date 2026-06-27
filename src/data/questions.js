// ─────────────────────────────────────────────────────────────
// WEDDING TRIVIA QUESTIONS — edit me!
// ─────────────────────────────────────────────────────────────
// • `correct` is the 0-based index of the right answer (0=A, 1=B, 2=C, 3=D).
// • `category` controls the little label + accent color shown on screen.
//   Options: "couple" | "guess" | "vibe"
//   - "guess" = real answer exists, scored normally.
//   - "vibe"  = no real right/wrong — it's a room read. Whatever you set
//     as `correct` is just whichever option you (the host) want to
//     highlight live based on the crowd's reaction — totally your call
//     in the moment, change it before the big day or even live if you want.
// • Keep exactly 4 choices per question — the UI is built around 4.
// • Reorder, add, or delete questions freely; keep the same shape.
// ─────────────────────────────────────────────────────────────

export const COUPLE_NAMES = {
  partnerA: "Vidhi",
  partnerB: "Sudhir",
};

export const QUESTIONS = [
  {
    id: 1,
    category: "guess",
    prompt: "Who is more likely to hit snooze 5 times before actually getting up?",
    choices: ["Vidhi", "Sudhir", "Both — alarms fear them equally", "Neither, disgustingly punctual"],
    correct: 0,
  },
  {
    id: 2,
    category: "couple",
    prompt: "Where did Vidhi and Sudhir actually meet?",
    choices: ["Grad school", "A wedding (someone else's)", "Through family", "A coffee shop"],
    correct: 0,
  },
  {
    id: 3,
    category: "guess",
    prompt: "Who takes longer to reply to texts, even now?",
    choices: ["Vidhi", "Sudhir", "Both, equally terrible", "Neither — instant replies, disgustingly functional"],
    correct: 0,
  },
  {
    id: 4,
    category: "vibe",
    prompt: "How many years until baby #1 shows up? (No wrong answers, just vibes 👀)",
    choices: ["Less than 1 year", "1–2 years", "3+ years — let them enjoy married life first", "Not telling us anything"],
    correct: 3,
  },
  {
    id: 5,
    category: "guess",
    prompt: "Who has been caught talking to their phone or laptop like it can hear them?",
    choices: ["Vidhi", "Sudhir", "Both, frequently", "Neither, too dignified for that"],
    correct: 3,
  },
  {
    id: 6,
    category: "vibe",
    prompt: "Who takes the most pictures of their food before eating it?",
    choices: ["Vidhi", "Sudhir", "Both — food gets cold while they pose it", "Neither, food doesn't survive that long"],
    correct: 0,
  },
  {
    id: 7,
    category: "guess",
    prompt: 'Who is more likely to fall asleep during a movie, then insist they "saw the whole thing"?',
    choices: ["Vidhi", "Sudhir", "Both, every single time", "Neither — they live-tweet the plot holes"],
    correct: 1,
  },
  {
    id: 8,
    category: "couple",
    prompt: "What's one food they both can never say no to?",
    choices: ["Idli", "Poha", "Misal Pav", "Medu Vada"],
    correct: 1,
  },
  {
    id: 9,
    category: "couple",
    prompt: "Which TV show have Vidhi and Sudhir watched together?",
    choices: ["Suits", "Friends", "How I Met Your Mother", "Off Campus"],
    correct: 3,
  },
  {
    id: 10,
    category: "couple",
    prompt: "Which wedding detail took the longest to finalize?",
    choices: ["The wedding hashtag (#vidhisudhargayi)", "Cocktail menu", "Venue", "Food menu"],
    correct: 3,
  },
];

// Points: base points for a correct answer, scaled down by how long
// the guest took to answer (faster = closer to full points).
export const QUESTION_TIME_SECONDS = 30;
export const MAX_POINTS = 1000;
export const MIN_POINTS = 200; // floor for a correct-but-slow answer
