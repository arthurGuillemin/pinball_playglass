import wsService from "../../services/socket.service";

export default function StartScreen({ score }) {
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
      <p style={{ color: "white", fontSize: 48 }}>FLIPPER MVP</p>
      <button
        onClick={() => wsService.startGame("Player1")}
        style={{
          padding: "15px 40px",
          fontSize: 24,
          cursor: "pointer",
          background: "blue",
          color: "white",
          border: "none",
          borderRadius: 8,
        }}
      >
        START
      </button>
    </div>
  );
}
