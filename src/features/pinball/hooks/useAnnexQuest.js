import { useState, useCallback, useRef } from "react";

const QUEST_BONUS_PHASE1 = 500;
const QUEST_BONUS_PHASE2 = 1500;
const CARD_RISE_DELAY_MS = 900;

/**
 * Gère la quête de la zone annexe :
 *   Phase 1 → toucher les 4 plaques → bonus 500pts → elles se relèvent
 *   Phase 2 → recommencer → bonus 1500pts → reset phase 1
 *   Perte    → balle quitte la zone → reset silencieux
 */
export function useAnnexQuest(onBonus) {
  const [cardHits, setCardHits] = useState([false, false, false, false]);
  const [cardsRaised, setCardsRaised] = useState([true, true, true, true]);
  const [phase, setPhase] = useState(1);
  const riseTimer = useRef(null);

  const onCardHit = useCallback(
    (index) => {
      setCardHits((prev) => {
        if (prev[index]) return prev;

        const next = [...prev];
        next[index] = true;

        // Enfoncer la plaque visuellement
        setCardsRaised((r) => {
          const nr = [...r];
          nr[index] = false;
          return nr;
        });

        const allHit = next.every(Boolean);
        if (allHit) {
          setPhase((p) => {
            const bonus = p === 1 ? QUEST_BONUS_PHASE1 : QUEST_BONUS_PHASE2;
            onBonus?.(bonus);

            if (riseTimer.current) clearTimeout(riseTimer.current);
            riseTimer.current = setTimeout(() => {
              setCardsRaised([true, true, true, true]);
              setCardHits([false, false, false, false]);
            }, CARD_RISE_DELAY_MS);

            return p === 1 ? 2 : 1;
          });
        }

        return next;
      });
    },
    [onBonus],
  );

  const onQuestLost = useCallback(() => {
    if (riseTimer.current) clearTimeout(riseTimer.current);
    setCardHits([false, false, false, false]);
    setCardsRaised([true, true, true, true]);
    setPhase(1);
  }, []);

  return { cardHits, cardsRaised, phase, onCardHit, onQuestLost };
}
