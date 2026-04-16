import { useState, useEffect, useCallback } from "react";

export function useGameState() {
  const [score, setScore] = useState(0);
  const [charging, setCharging] = useState(false);
  const [chargeLevel, setChargeLevel] = useState(0);

  useEffect(() => {
    const onCharge = (e) => {
      setCharging(e.detail.charging);
      setChargeLevel(e.detail.level);
    };
    window.addEventListener("ball-charge", onCharge);
    return () => window.removeEventListener("ball-charge", onCharge);
  }, []);

  const onBumperHit = useCallback(() => setScore((s) => s + 100), []);
  const onSlingshotHit = useCallback(() => setScore((s) => s + 50), []);

  return { score, charging, chargeLevel, onBumperHit, onSlingshotHit };
}
