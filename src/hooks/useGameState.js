import { useState, useEffect } from "react";
import wsService from "../services/socket.service";

export const useGameState = () => {
  const [gameState, setGameState] = useState({
    isRunning: false,
    score: 1,
    balls: 3,
    currentPlayer: null,
  });

  useEffect(() => {
    wsService.onScreenMessage((data) => {
      if (data.type === "state_update") {
        setGameState(data.state);
      }
      if (data.type === "game_over") {
        setGameState(data.state);
        fetch("http://localhost:3000/api/scores", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            player_name: data.state.currentPlayer,
            score: data.state.score,
          }),
        });
      }
    });
  }, []);

  return gameState;
};
