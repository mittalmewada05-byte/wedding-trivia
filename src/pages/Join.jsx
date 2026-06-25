import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { dbRefs, set, serverTimestamp } from "../lib/firebase";

function makePlayerId() {
  return "p_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export default function Join() {
  const [name, setName] = useState("");
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleJoin(e) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Type your name so we know it's you!");
      return;
    }
    if (trimmed.length > 24) {
      setError("Keep it under 24 characters.");
      return;
    }
    setJoining(true);
    try {
      const playerId = makePlayerId();
      await set(dbRefs.player(playerId), {
        name: trimmed,
        score: 0,
        joinedAt: serverTimestamp(),
      });
      localStorage.setItem("trivia_player_id", playerId);
      localStorage.setItem("trivia_player_name", trimmed);
      navigate("/play");
    } catch (err) {
      setError("Couldn't join — check your connection and try again.");
      setJoining(false);
    }
  }

  return (
    <div className="page-center">
      <div className="card pop-in" style={{ maxWidth: 420, textAlign: "center" }}>
        <div style={{ fontSize: 44, marginBottom: 4 }}>💍</div>
        <h1 style={{ fontSize: 30, color: "var(--text)", marginBottom: 6 }}>Wedding Trivia</h1>
        <p style={{ color: "var(--text-soft)", marginTop: 0, marginBottom: 24, fontSize: 15 }}>
          Enter your name to join the game. Keep your phone handy — questions start soon!
        </p>
        <form onSubmit={handleJoin} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            maxLength={24}
            style={{
              padding: "16px 18px",
              fontSize: 18,
              borderRadius: "var(--radius-md)",
              border: "3px solid var(--lavender)",
              background: "var(--white)",
              color: "var(--text)",
              textAlign: "center",
              fontWeight: 600,
            }}
          />
          {error && <div style={{ color: "#C0507A", fontSize: 14, fontWeight: 600 }}>{error}</div>}
          <button
            type="submit"
            disabled={joining}
            className="btn-primary"
            style={{ fontSize: 19, padding: "16px 0" }}
          >
            {joining ? "Joining…" : "Let's go! 🎉"}
          </button>
        </form>
      </div>
    </div>
  );
}
