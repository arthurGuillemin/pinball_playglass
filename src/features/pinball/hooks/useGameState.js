import { useState, useEffect, useCallback } from "react";
import { useLaneGroups } from "./useLaneGroups";

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

  // Bonus déclenché quand un groupe de lanes est complété
  const onBonus = useCallback((points) => setScore((s) => s + points), []);

  const { groupStates, onSensorHit } = useLaneGroups(onBonus);

  const onBumperHit = useCallback(() => setScore((s) => s + 100), []);
  const onSlingshotHit = useCallback(() => setScore((s) => s + 50), []);

  return {
    score,
    charging,
    chargeLevel,
    groupStates,
    onSensorHit,
    onBumperHit,
    onSlingshotHit,
  };
}
