import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useGame } from "../pinball/context/GameContext";

const START_POS = new THREE.Vector3(-0.0429, -0.0497, 0.786);
const TARGET_POS = new THREE.Vector3(
  -0.0031482368870522606,
  1.6802378199245809,
  1.2681252268760064,
);
const TARGET_LOOK = new THREE.Vector3(0, 0, 0);

function CameraIntro({ active, onFinish }) {
  const { camera } = useThree();
  const { isRunning, startGame } = useGame(); // ✅

  const curve = useRef(
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.0429, -0.0497, 0.786),
      new THREE.Vector3(-0.0199, -0.0268, 0.4416),
      new THREE.Vector3(-0.3713, 0.0361, 0.0),
      new THREE.Vector3(-0.3264, 0.063, -0.2221),
      new THREE.Vector3(-0.0675, 0.114, -0.5166),
      new THREE.Vector3(0.1976, 0.1636, -0.7549),
      new THREE.Vector3(0.33, 0.1366, -0.6058),
      new THREE.Vector3(0.3752, -0.0473, 0.7856),
    ]),
  );

  const t = useRef(0);
  const phase = useRef(0);
  const started = useRef(false);
  const finished = useRef(false);
  const previousIsRunning = useRef(false);

  useEffect(() => {
    camera.position.copy(START_POS);
    camera.lookAt(curve.current.getTangent(0));
  }, [camera]);

  useEffect(() => {
    if (!isRunning && previousIsRunning.current) {
      t.current = 0;
      phase.current = 0;
      started.current = false;
      finished.current = false;
      camera.position.copy(START_POS);
      camera.lookAt(curve.current.getTangent(0));
    }

    if (isRunning && !previousIsRunning.current && !started.current) {
      console.log("🎮 Intro démarrée via WebSocket (backglass)");
      started.current = true;
      phase.current = 1;
    }

    previousIsRunning.current = isRunning;
  }, [isRunning, camera]);

  useEffect(() => {
    const handleKey = (e) => {
      const key = e.key.toLowerCase();

      if (key === "t" && !started.current) {
        console.log("🔧 Dev : touche T");
        startGame("Player1");
        started.current = true;
        phase.current = 1;
      }

      if (key === "s" && active && !finished.current) {
        camera.position.copy(TARGET_POS);
        camera.lookAt(TARGET_LOOK);
        finished.current = true;
        onFinish?.();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [active, camera, onFinish, startGame]);

  useFrame(() => {
    if (!active || finished.current || phase.current === 0) return;

    if (phase.current === 1) {
      t.current += 0.002;
      if (t.current >= 1) {
        t.current = 1;
        phase.current = 2;
      }
      const point = curve.current.getPoint(t.current);
      const tangent = curve.current.getTangent(t.current);
      camera.position.copy(point);
      camera.lookAt(point.clone().add(tangent));
    }

    if (phase.current === 2) {
      camera.position.lerp(TARGET_POS, 0.05);
      camera.lookAt(TARGET_LOOK);
      if (camera.position.distanceTo(TARGET_POS) < 0.01) {
        finished.current = true;
        onFinish?.();
      }
    }
  });

  return null;
}

export default CameraIntro;
