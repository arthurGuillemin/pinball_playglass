export default function ControlsHint() {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 20,
        left: "50%",
        transform: "translateX(-50%)",
        color: "#aaa",
        fontFamily: "monospace",
        fontSize: "0.85rem",
        zIndex: 10,
        pointerEvents: "none",
      }}
    >
      ← Flipper G &nbsp;|&nbsp; Flipper D → &nbsp;|&nbsp; [Espace] Lancer
      &nbsp;|&nbsp; [R] Respawn
    </div>
  );
}
