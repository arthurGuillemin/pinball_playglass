const COMBO_COLORS = ["#4488ff", "#44ff88", "#ffaa00", "#ff4400", "#ff00ff"];

export default function ComboDisplay({ combo, multiplier }) {
  if (multiplier <= 1) return null;
  const color = COMBO_COLORS[Math.min(multiplier - 1, COMBO_COLORS.length - 1)];
  const flames = "🔥".repeat(Math.min(combo, 5));
  return (
    <div
      style={{
        position: "absolute",
        top: 65,
        left: "50%",
        transform: "translateX(-50%)",
        color,
        fontFamily: "monospace",
        fontSize: "1.1rem",
        textShadow: `0 0 10px ${color}`,
        zIndex: 10,
        pointerEvents: "none",
        transition: "color 0.2s",
      }}
    >
      COMBO x{multiplier} {flames}
    </div>
  );
}
