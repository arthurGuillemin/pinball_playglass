import { useEffect, useRef } from "react";
import Stats from "stats.js";
import { useFrame, useThree } from "@react-three/fiber";

const StatsPanel = () => {
  const statsRef = useRef(null);
  const { gl } = useThree();

  useEffect(() => {
    const stats = new Stats();

    // 0: FPS, 1: MS, 2: MB
    stats.showPanel(0);

    stats.dom.style.position = "absolute";
    stats.dom.style.top = "30px";
    stats.dom.style.left = "10px";

    document.body.appendChild(stats.dom);
    statsRef.current = stats;

    return () => {
      document.body.removeChild(stats.dom);
    };
  }, []);

  useFrame(() => {
    if (!statsRef.current) return;

    // Début mesure FPS
    statsRef.current.begin();
    const drawCalls = gl.info.render.calls;
    console.log("Draw calls:", drawCalls);
    gl.info.reset();
    statsRef.current.end();
  });

  return null;
};

export default StatsPanel;
