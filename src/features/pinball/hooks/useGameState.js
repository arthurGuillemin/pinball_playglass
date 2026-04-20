import { useState, useEffect, useCallback } from "react";
import socketService from "../../../services/socket.service";

export function useGameState() {
  const [score, setScore] = useState(0);
  const [balls, setBalls] = useState(3);
  const [isRunning, setIsRunning] = useState(false);
  const [charging, setCharging] = useState(false);
  const [chargeLevel, setChargeLevel] = useState(0);

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

  const onBallLost = useCallback(() => {
    socketService.send("ball_lost");
  }, []);

  return {
    score,
    balls,
    isRunning,
    charging,
    chargeLevel,
    onBumperHit,
    onSlingshotHit,
    startGame,
    onBallLost,
  };
}
