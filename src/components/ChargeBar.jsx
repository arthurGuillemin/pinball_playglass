export default function ChargeBar({ charging, chargeLevel }) {
  if (!charging) return null;
  return (
    <div
      style={{
        position: "absolute",
        bottom: 60,
        left: "50%",
        transform: "translateX(-50%)",
        width: 200,
        height: 14,
        background: "#222",
        borderRadius: 7,
        overflow: "hidden",
        zIndex: 10,
        border: "1px solid #555",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${chargeLevel * 100}%`,
          background: `hsl(${120 - chargeLevel * 120}, 90%, 50%)`,
          borderRadius: 7,
        }}
      />
    </div>
  );
}
