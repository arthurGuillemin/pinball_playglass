import { useRef, useState, useCallback } from "react";

const COMBO_TIMEOUT_MS = 2000;
const MAX_MULTIPLIER = 5;

/**
 * Gère le système de combos et multiplicateurs de score.
 * Un combo s'accumule tant que les hits arrivent en moins de 2s.
 */
export function useComboSystem(setScore) {
  const [combo, setCombo] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const timerRef = useRef(null);

  const registerHit = useCallback(
    (basePoints) => {
      setCombo((prev) => {
        const next = prev + 1;
        const mult = Math.min(next, MAX_MULTIPLIER);
        setMultiplier(mult);
        setScore((s) => s + basePoints * mult);
        return next;
      });

      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setCombo(0);
        setMultiplier(1);
      }, COMBO_TIMEOUT_MS);
    },
    [setScore],
  );

  return { combo, multiplier, registerHit };
}
