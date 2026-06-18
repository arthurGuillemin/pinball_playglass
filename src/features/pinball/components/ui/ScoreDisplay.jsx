import { useEffect, useRef } from "react";
import { useSound } from "../../hooks/useSound";

export default function ScoreDisplay({ score }) {
  const { play } = useSound();

  const lastThreshold = useRef(0);

  useEffect(() => {
    const currentThreshold = Math.floor(score / 5000);

    if (currentThreshold > lastThreshold.current) {
      const randomVoice = Math.floor(Math.random() * 5) + 1;

      play(`narrator${randomVoice}`, 5);

      lastThreshold.current = currentThreshold;
    }
  }, [score, play]);

  return (
    <div
      style={{
        position: "absolute",
        top: 20,
        left: "50%",
        transform: "translateX(-50%)",
        color: "#fff",
        fontFamily: "monospace",
        fontSize: "1.8rem",
        textShadow: "0 0 12px #ff0",
        zIndex: 10,
        pointerEvents: "none",
      }}
    >
      SCORE : {score}
    </div>
  );
}
