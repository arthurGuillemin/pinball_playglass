import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
});

export const getScores = () => api.get("/scores");
export const postScore = (player_name, score) =>
  api.post("/scores", { player_name, score });
