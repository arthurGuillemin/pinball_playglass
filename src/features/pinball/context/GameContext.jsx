import { createContext, useContext } from "react";
import { useGameState } from "../hooks/useGameState";

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const gameState = useGameState();
  return (
    <GameContext.Provider value={gameState}>{children}</GameContext.Provider>
  );
}
