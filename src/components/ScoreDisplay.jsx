export default function ScoreDisplay({ score }) {
  return (
    <div
      style={{
        position: "absolute",
        top: 20,
        left: "50%",
        transform: "translateX(-50%)",
        color: "#fff",
        fontFamily: "monospace",
        fontSize: "1.8rem",
        textShadow: "0 0 12px #ff0",
        zIndex: 10,
        pointerEvents: "none",
      }}
    >
      SCORE : {score}
    </div>
  );
}
