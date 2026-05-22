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

const CURVE_DURATION = 7000;
const LERP_DURATION = 1500;
const TOTAL_DURATION = 10000;

function CameraIntro({ active, onFinish }) {
  const { camera } = useThree();
  const { isRunning, startGame } = useGame();

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

  const phase = useRef(0);
  const started = useRef(false);
  const finished = useRef(false);
  const previousIsRunning = useRef(false);
  const startTime = useRef(0);
  const phaseStartTime = useRef(0);

  useEffect(() => {
    camera.position.copy(START_POS);
    camera.lookAt(curve.current.getTangent(0));
  }, [camera]);

  useEffect(() => {
    if (!isRunning && previousIsRunning.current) {
      phase.current = 0;
      started.current = false;
      finished.current = false;
      startTime.current = 0;
      phaseStartTime.current = 0;
      camera.position.copy(START_POS);
      camera.lookAt(curve.current.getTangent(0));
    }

    if (isRunning && !previousIsRunning.current && !started.current) {
      console.log("🎮 Intro démarrée via WebSocket (6 secondes)");
      started.current = true;
      phase.current = 1;
      startTime.current = performance.now();
      phaseStartTime.current = performance.now();
    }

    previousIsRunning.current = isRunning;
  }, [isRunning, camera]);

  useEffect(() => {
    const handleKey = (e) => {
      const key = e.key.toLowerCase();

      if (key === "t" && !started.current) {
        startGame();
        started.current = true;
        phase.current = 1;
        startTime.current = performance.now();
        phaseStartTime.current = performance.now();
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

    const now = performance.now();
    const totalElapsed = now - startTime.current;

    if (phase.current === 1) {
      const phaseElapsed = now - phaseStartTime.current;
      const t = Math.min(phaseElapsed / CURVE_DURATION, 1);

      if (t >= 1) {
        phase.current = 2;
        phaseStartTime.current = now;
      }

      const point = curve.current.getPoint(t);
      const tangent = curve.current.getTangent(t);
      camera.position.copy(point);
      camera.lookAt(point.clone().add(tangent));
    }

    if (phase.current === 2) {
      const phaseElapsed = now - phaseStartTime.current;
      const lerpProgress = Math.min(phaseElapsed / LERP_DURATION, 1);
      const easedProgress = 1 - Math.pow(1 - lerpProgress, 3);

      camera.position.lerpVectors(
        curve.current.getPoint(1),
        TARGET_POS,
        easedProgress,
      );
      camera.lookAt(TARGET_LOOK);

      if (lerpProgress >= 1) {
        camera.position.copy(TARGET_POS);
        finished.current = true;
        console.log(`✅ Intro terminée en ${totalElapsed.toFixed(0)}ms`);
        onFinish?.();
      }
    }
  });

  return null;
}

export default CameraIntro;
