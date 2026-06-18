import { useState, useCallback, useRef } from "react";
import socketService from "../../../services/socket.service";
import { useSound } from "./useSound";
const CARD_RISE_DELAY_MS = 900;

export function useAnnexQuest() {
  const [cardHits, setCardHits] = useState([false, false, false, false]);
  const [cardsRaised, setCardsRaised] = useState([true, true, true, true]);
  const [phase, setPhase] = useState(1);
  const riseTimer = useRef(null);
  const sentRef = useRef(false);
  const { play } = useSound();

  const onCardHit = useCallback(
    (index) => {
      setCardHits((prev) => {
        if (prev[index]) return prev;
        const next = [...prev];
        next[index] = true;

        setCardsRaised((r) => {
          const nr = [...r];
          nr[index] = false;
          return nr;
        });

        const allHit = next.every(Boolean);
        if (allHit && !sentRef.current) {
          sentRef.current = true;
          play("jackpot", 0.3);
          socketService.send("cards_down");
          if (riseTimer.current) clearTimeout(riseTimer.current);
          riseTimer.current = setTimeout(() => {
            setCardsRaised([true, true, true, true]);
            setCardHits([false, false, false, false]);
            sentRef.current = false;
          }, CARD_RISE_DELAY_MS);
          setPhase((p) => (p === 1 ? 2 : 1));
        }

        return next;
      });
    },
    [play],
  );

  const onQuestLost = useCallback(() => {
    if (riseTimer.current) clearTimeout(riseTimer.current);
    setCardHits([false, false, false, false]);
    setCardsRaised([true, true, true, true]);
    setPhase(1);
    sentRef.current = false;
  }, []);

  return { cardHits, cardsRaised, phase, onCardHit, onQuestLost };
}
