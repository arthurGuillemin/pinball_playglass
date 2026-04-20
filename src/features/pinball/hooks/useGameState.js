import { useState, useEffect, useCallback, useRef } from "react";
import { useLaneGroups } from "./useLaneGroups";

const BOOST_DURATION_MS = 2500; // durée du boost en ms

export function useGameState() {
  const [score, setScore] = useState(0);
  const [charging, setCharging] = useState(false);
  const [chargeLevel, setChargeLevel] = useState(0);
  const [boosted, setBoosted] = useState(false);
  const boostTimer = useRef(null);

  useEffect(() => {
    const onCharge = (e) => {
      setCharging(e.detail.charging);
      setChargeLevel(e.detail.level);
    };
    window.addEventListener("ball-charge", onCharge);
    return () => window.removeEventListener("ball-charge", onCharge);
  }, []);

  const onBonus = useCallback((points) => setScore((s) => s + points), []);
  const { groupStates, onSensorHit } = useLaneGroups(onBonus);

  const onBoostHit = useCallback(() => {
    setBoosted(true);
    window.dispatchEvent(new CustomEvent("ball-boost"));
    clearTimeout(boostTimer.current);
    boostTimer.current = setTimeout(() => setBoosted(false), BOOST_DURATION_MS);
  }, []);

  const onBumperHit = useCallback(() => setScore((s) => s + 100), []);
  const onSlingshotHit = useCallback(() => setScore((s) => s + 50), []);

  return {
    score,
    charging,
    chargeLevel,
    boosted,
    groupStates,
    onSensorHit,
    onBoostHit,
    onBumperHit,
    onSlingshotHit,
  };
}
