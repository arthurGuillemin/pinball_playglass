import { useEffect, useRef } from "react";
import Stats from "stats.js";
import { useFrame } from "@react-three/fiber";

const StatsPanel = () => {
  const statsRef = useRef(null);

  useEffect(() => {
    const stats = new Stats();
    stats.showPanel(0); // 0: FPS

    stats.dom.style.position = "absolute";
    stats.dom.style.top = "0px";
    stats.dom.style.left = "0px";

    document.body.appendChild(stats.dom);
    statsRef.current = stats;

    return () => {
      document.body.removeChild(stats.dom);
    };
  }, []);

  useFrame(() => {
    if (!statsRef.current) return;

    statsRef.current.begin();
    statsRef.current.end();
  });

  return null;
};

export default StatsPanel;
