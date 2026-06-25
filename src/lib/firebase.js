// ─────────────────────────────────────────────────────────────
// FIREBASE SETUP
// ─────────────────────────────────────────────────────────────
// 1. Go to https://console.firebase.google.com → Add project (free)
// 2. Inside the project: Build → Realtime Database → Create Database
//    → start in TEST MODE (fine for a one-night private event).
// 3. Project settings (gear icon) → General → "Your apps" → Add app → Web
//    → copy the config object it gives you and paste the values below.
// ─────────────────────────────────────────────────────────────

import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  set,
  update,
  onValue,
  push,
  serverTimestamp,
  remove,
  get,
  runTransaction,
} from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCupmXEoztKyQuZuX7xB2lCYVtYRbY2Dcc",
  authDomain: "vidhisudhargayi.firebaseapp.com",
  databaseURL: "https://vidhisudhargayi-default-rtdb.firebaseio.com",
  projectId: "vidhisudhargayi",
  storageBucket: "vidhisudhargayi.firebasestorage.app",
  messagingSenderId: "457484497394",
  appId: "1:457484497394:web:bc013cebb21be5675d3b6b",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

// All game state lives under a single root so multiple games
// (e.g. a rehearsal test run) don't collide. Change GAME_ID per event
// if you want a fresh board — otherwise leave as "main".
export const GAME_ID = "main";
const gamePath = (...segments) => ["games", GAME_ID, ...segments].join("/");

export const dbRefs = {
  state: () => ref(db, gamePath("state")), // { phase, questionIndex, questionStartedAt }
  players: () => ref(db, gamePath("players")), // { [playerId]: { name, score, joinedAt } }
  player: (playerId) => ref(db, gamePath("players", playerId)),
  answers: (questionIndex) => ref(db, gamePath("answers", String(questionIndex))), // { [playerId]: { choice, answeredAt } }
};

export { set, update, onValue, push, serverTimestamp, remove, get, ref, runTransaction };
