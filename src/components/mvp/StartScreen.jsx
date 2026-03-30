import wsService from "../../services/socket.service";
import { useState } from "react";

export default function StartScreen({ score }) {
  const [playerName, setPlayerName] = useState("");

  const handleStart = () => {
    if (!playerName.trim()) return;
    wsService.startGame(playerName.trim());
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "black",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
      }}
    >
      {score > 0 && (
        <>
          <p style={{ color: "white", fontSize: 32 }}>GAME OVER</p>
          <p style={{ color: "white", fontSize: 24 }}>Score : {score}</p>
        </>
      )}
      <p style={{ color: "white", fontSize: 48 }}>FLIPPEzz R MVP</p>
      <input
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        placeholder="Ton pseudo"
        style={{
          padding: "10px 20px",
          fontSize: 20,
          borderRadius: 8,
          border: "none",
          textAlign: "center",
        }}
      />
      <button
        onClick={handleStart}
        disabled={!playerName.trim()}
        style={{
          padding: "15px 40px",
          fontSize: 24,
          cursor: "pointer",
          background: "blue",
          color: "white",
          border: "none",
          borderRadius: 8,
          opacity: playerName.trim() ? 1 : 0.5,
        }}
      >
        START
      </button>
    </div>
  );
}
