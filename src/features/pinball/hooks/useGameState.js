import { useState, useEffect, useCallback, useRef } from "react";
import { useLaneGroups } from "./useLaneGroups";
import socketService from "../../../services/socket.service";
import { useAnnexQuest } from "./useAnnexQuest";

const BOOST_DURATION_MS = 2500; // durée du boost en ms

export function useGameState() {
  const [score, setScore] = useState(0);
  const [balls, setBalls] = useState(3);
  const [isRunning, setIsRunning] = useState(false);
  const [charging, setCharging] = useState(false);
  const [chargeLevel, setChargeLevel] = useState(0);
  const [boosted, setBoosted] = useState(false);
  const boostTimer = useRef(null);
  const {
    cardHits,
    cardsRaised,
    phase: annexPhase,
    onCardHit,
    onQuestLost,
  } = useAnnexQuest((pts) => setScore((s) => s + pts));

  useEffect(() => {
    socketService.connect();
    socketService.onScreenMessage((data) => {
      if (data.type === "state_update") {
        setScore(data.state.score);
        setBalls(data.state.balls);
        setIsRunning(data.state.isRunning);
      }
      if (data.type === "game_over") {
        setScore(data.state.score);
        setIsRunning(false);
      }
    });
    const onCharge = (e) => {
      setCharging(e.detail.charging);
      setChargeLevel(e.detail.level);
    };
    window.addEventListener("ball-charge", onCharge);
    return () => {
      window.removeEventListener("ball-charge", onCharge);
      socketService.disconnect();
    };
  }, []);

  const onBumperHit = useCallback(() => {
    socketService.send("hit", { points: 100 });
  }, []);

  const onSlingshotHit = useCallback(() => {
    socketService.send("hit", { points: 50 });
  }, []);

  const startGame = useCallback((playerName) => {
    socketService.send("start_game", { playerName });
  }, []);
  const onBonus = useCallback((points) => setScore((s) => s + points), []);
  const { groupStates, onSensorHit } = useLaneGroups(onBonus);

  const onBoostHit = useCallback(() => {
    setBoosted(true);
    window.dispatchEvent(new CustomEvent("ball-boost"));
    clearTimeout(boostTimer.current);
    boostTimer.current = setTimeout(() => setBoosted(false), BOOST_DURATION_MS);
  }, []);

  const onBallLost = useCallback(() => {
    socketService.send("ball_lost");
  }, []);

  return {
    score,
    balls,
    isRunning,
    charging,
    chargeLevel,
    boosted,
    groupStates,
    onSensorHit,
    onBoostHit,
    onBumperHit,
    onSlingshotHit,
    startGame,
    onBallLost,
    cardHits,
    cardsRaised,
    annexPhase,
    onCardHit,
    onQuestLost,
  };
}
