// ─────────────────────────────────────────────────────────────
// WEDDING TRIVIA QUESTIONS — edit me!
// ─────────────────────────────────────────────────────────────
// • Replace [bracketed] placeholders with your real details.
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
    prompt: "Who is the noisier sleeper?",
    choices: ["Vidhi", "Sudhir", "Tie — earplugs required", "Neither, content gremlins"],
    correct: 0,
  },
  {
    id: 4,
    category: "couple",
    prompt: "What did Vidhi and Sudhir actually bond over first in grad school?",
    choices: ["[Real answer]", "Arguing over the last samosa at a department event", "A shared deadline panic at 2 AM", "A mutual hatred of group projects"],
    correct: 0,
  },
  {
    id: 5,
    category: "guess",
    prompt: "Who takes longer to reply to texts, even now?",
    choices: ["Vidhi", "Sudhir", "Both, equally terrible", "Neither — instant replies, disgustingly functional"],
    correct: 1,
  },
  {
    id: 6,
    category: "guess",
    prompt: 'Who said "I love you" first?',
    choices: ["Vidhi", "Sudhir", "Said it at the same time, ruining the moment", "Still hasn't technically happened"],
    correct: 0,
  },
  {
    id: 7,
    category: "vibe",
    prompt: "How many years until baby #1 shows up? (No wrong answers, just vibes 👀)",
    choices: ["Less than 1 year", "1–2 years", "3+ years — let them enjoy married life first", "Not telling us anything"],
    correct: 2,
  },
  {
    id: 8,
    category: "guess",
    prompt: "Who has been caught talking to their phone or laptop like it can hear them?",
    choices: ["Vidhi", "Sudhir", "Both, frequently", "Neither, too dignified for that"],
    correct: 0,
  },
  {
    id: 9,
    category: "guess",
    prompt: "Who is the better cook, honestly?",
    choices: ["Vidhi", "Sudhir", "Equally dangerous in a kitchen", "They order in, let's be real"],
    correct: 1,
  },
  {
    id: 10,
    category: "guess",
    prompt: "Who takes the most pictures of their food before eating it?",
    choices: ["Vidhi", "Sudhir", "Both — food gets cold while they pose it", "Neither, food doesn't survive that long"],
    correct: 0,
  },
  {
    id: 11,
    category: "vibe",
    prompt: "Whose side will dance the hardest at the reception tonight? (Room vote — no wrong answers!)",
    choices: ["The Mewada side", "The More side", "Equally unhinged, honestly", "The DJ — he's not even related"],
    correct: 2,
  },
  {
    id: 13,
    category: "vibe",
    prompt: 'Who is more likely to fall asleep during a movie, then insist they "saw the whole thing"?',
    choices: ["Vidhi", "Sudhir", "Both, every single time", "Neither — they live-tweet the plot holes"],
    correct: 2,
  },
  {
    id: 14,
    category: "vibe",
    prompt: 'Who takes the longest to actually leave after saying "I\'m leaving in 5 minutes"?',
    choices: ["Vidhi", "Sudhir", 'Both — "5 minutes" is a lie they both tell', "Neither, scarily punctual people"],
    correct: 2,
  },
  {
    id: 15,
    category: "vibe",
    prompt: "Who has a more dramatic reaction to losing at a board game or cards?",
    choices: ["Vidhi", "Sudhir", "Both — competitive chaos", "Neither, suspiciously chill losers"],
    correct: 2,
  },
  {
    id: 16,
    category: "vibe",
    prompt: 'Who is more likely to start a sentence with "okay but hear me out" before a questionable idea?',
    choices: ["Vidhi", "Sudhir", "Both, constantly", "Neither, all ideas pre-approved by logic"],
    correct: 2,
  },
];

// Points: base points for a correct answer, scaled down by how long
// the guest took to answer (faster = closer to full points).
export const QUESTION_TIME_SECONDS = 30;
export const MAX_POINTS = 1000;
export const MIN_POINTS = 200; // floor for a correct-but-slow answer
