import { useState, useEffect } from "react";
import wsService from "../services/socket.service";

export const useFlipperControls = () => {
  const [activeFlippers, setActiveFlippers] = useState({
    right: false,
    left: false,
  });

  useEffect(() => {
    wsService.onMessage((data) => {
      if (data.type !== "BUTTON") return;
      if (data.event === "LEFT_FLIPPER_DOWN")
        setActiveFlippers((p) => ({ ...p, left: true }));
      if (data.event === "LEFT_FLIPPER_UP")
        setActiveFlippers((p) => ({ ...p, left: false }));
      if (data.event === "RIGHT_FLIPPER_DOWN")
        setActiveFlippers((p) => ({ ...p, right: true }));
      if (data.event === "RIGHT_FLIPPER_UP")
        setActiveFlippers((p) => ({ ...p, right: false }));
    });

    const keyMap = { ArrowRight: "right", ArrowLeft: "left" };
    const handleKey = (e, isActive) => {
      const side = keyMap[e.code];
      if (side) setActiveFlippers((p) => ({ ...p, [side]: isActive }));
    };

    window.addEventListener("keydown", (e) => handleKey(e, true));
    window.addEventListener("keyup", (e) => handleKey(e, false));
    return () => {
      window.removeEventListener("keydown", (e) => handleKey(e, true));
      window.removeEventListener("keyup", (e) => handleKey(e, false));
    };
  }, []);

  return { activeFlippers, setActiveFlippers };
};
