import { io } from "socket.io-client";

const URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

export const screensSocket = io(`${URL}/screens`, {
  autoConnect: false,
});

export const controllersSocket = io(`${URL}/controllers`, {
  autoConnect: false,
});

export const emitScore = (points) => {
  if (screensSocket.connected) {
    screensSocket.emit("score_update", { points });
  } else {
    console.log(`[Socket non co] score local : +${points} pts`);
  }
};
