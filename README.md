# 💍 Wedding Trivia

A live, host-controlled trivia game for your wedding reception. Guests scan a
QR code, join on their phones, and answer multiple-choice questions in real
time — with a 30-second timer, live result bars, speed-bonus scoring, and a
running leaderboard. Pastel + funky by design.

Two screens:
- **`/host`** — open this on your laptop, connect it to the projector/TV. This is
  the control panel: shows the QR code, starts the game, advances questions,
  shows live results and the leaderboard.
- **`/`** (the join page) — this is what guests scan into on their phones.

---

## 1. One-time setup (~15 minutes, free)

### A. Create a free Firebase project (the real-time sync backend)

1. Go to **https://console.firebase.google.com** → **Add project** → name it
   anything (e.g. "our-wedding-trivia") → you can skip Google Analytics →
   Create.
2. In the left sidebar: **Build → Realtime Database → Create Database**.
   - Choose any region close to you.
   - Start in **test mode** for now (we'll lock it down with the rules file
     in this project in step C).
3. In the left sidebar: click the **gear icon → Project settings**.
   Scroll to "Your apps" → click the **`</>`  (Web)** icon → register an app
   (any nickname) → it will show you a `firebaseConfig` object that looks like:

   ```js
   const firebaseConfig = {
     apiKey: "AIza...",
     authDomain: "our-wedding-trivia.firebaseapp.com",
     databaseURL: "https://our-wedding-trivia-default-rtdb.firebaseio.com",
     projectId: "our-wedding-trivia",
     storageBucket: "our-wedding-trivia.appspot.com",
     messagingSenderId: "...",
     appId: "...",
   };
   ```

4. Open **`src/lib/firebase.js`** in this project and paste your real values
   in place of the `"YOUR_..."` placeholders at the top of the file.

### B. Lock down the database rules (so they don't expire)

Test-mode rules auto-expire after 30 days. Instead:

1. In Firebase Console → **Realtime Database → Rules** tab.
2. Copy everything from **`firebase-rules.txt`** (in this project) and paste
   it in, replacing what's there.
3. Click **Publish**.

This keeps the game's data open (no login system, so guests can join with
zero friction) but doesn't expire, and doesn't open the rest of your Firebase
project.

### C. Edit your questions

Open **`src/data/questions.js`**. Replace the `[bracketed]` placeholders with
your real answers, and double check every `correct` index (0 = first choice,
1 = second, etc.) matches the right answer. You can reorder, add, or delete
questions freely — just keep the same `{ id, category, prompt, choices,
correct }` shape.

---

## 2. Deploy it for free (so guests can reach it on their phones)

The easiest free option is **Vercel** (no credit card needed):

1. Push this project folder to a GitHub repo (or use the no-git alternative below).
2. Go to **https://vercel.com** → sign up free → **Add New Project** → import
   your repo → Framework Preset will auto-detect **Vite** → Deploy.
3. Vercel gives you a free URL like `https://our-wedding-trivia.vercel.app`.
   That's the link your QR code will point to automatically (it reads the
   current page's URL).

**No-git alternative:** run `npm run build` locally, then drag the resulting
`dist` folder into **https://app.netlify.com/drop** for an instant free
hosted URL. Re-drag whenever you make edits.

---

## 3. Before the big day — test it!

1. Open `your-deployed-url.com/host` on your laptop.
2. Scan the QR code with your own phone (or open the base URL on a second
   device) and join as a test guest.
3. Click **Start Game**, answer on your phone, watch the timer, check that
   results show up live on both screens, click through to the leaderboard.
4. Click **Reset game** on the host screen when you're done testing — this
   zeroes scores and clears answers so guests start fresh on the actual day.

**Tip:** do this test run with a friend or two on a different WiFi network
than yours (or on cellular data) to simulate real guest conditions.

---

## 4. On the wedding day

1. Open `your-url.com/host` on your laptop, connect it to the venue TV/projector.
2. Make sure the QR code is visible to the room (zoom your browser if needed —
   `Cmd/Ctrl +`).
3. Let guests join over a minute or two — the host screen shows a live count.
4. Hit **Start Game** when ready. From there:
   - Each question auto-reveals when the 30s timer ends (or click
     **Reveal Now** to cut it short).
   - Click **Next Question** to continue.
   - After question 10, you'll land on the final leaderboard automatically.

---

## Local development

```bash
npm install
npm run dev      # starts a local dev server, prints a URL
npm run build    # production build → outputs to dist/
```

To test the multi-device experience locally, run `npm run dev -- --host` so
other devices on your WiFi can reach your laptop's dev server by its local IP.

---

## Customizing the look

All colors and fonts are defined as CSS variables at the top of
**`src/index.css`** — change the hex values there to retheme the whole app at
once. The two fonts (Baloo 2 for headers, Quicksand for body) are loaded from
Google Fonts in the same file.

## Troubleshooting

- **QR code shows but joining fails** → double check `databaseURL` in
  `src/lib/firebase.js` matches exactly what Firebase gave you.
- **Host shows guests joined but their screens are stuck on "Connecting…"** →
  almost always a Firebase rules issue — re-check step B above.
- **Timer looks off between host and guest screens** → this is normal for a
  second or two due to network latency; it self-corrects since everyone reads
  the same `questionStartedAt` timestamp from the database rather than
  trusting their own local timer.
