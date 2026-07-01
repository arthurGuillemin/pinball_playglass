import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useGame } from "../pinball/context/GameContext";

const START_POS = new THREE.Vector3(
  -0.03409729353507393,
  -0.05714938415576888,
  0.78592481985506,
);
const TARGET_POS = new THREE.Vector3(
  0.0008573606614677,
  2.052221119462724,
  0.2631354204559488,
);
const TARGET_LOOK = new THREE.Vector3(
  -0.0012172428294691686,
  1.0563327468386152,
  0.16424547531753497,
);

function CameraIntro({ active, onFinish }) {
  const { camera } = useThree();
  const { isRunning, startGame } = useGame();

  const curve = useRef(
    new THREE.CatmullRomCurve3([
      // ── Départ ──────────────────────────────────────────────────────────
      new THREE.Vector3(
        -0.03409729353507393,
        -0.05714938415576888,
        0.78592481985506,
      ),
      // Descente douce
      new THREE.Vector3(-0.07, -0.02, 0.6),
      // ── Points intermédiaires ajoutés — lissent le grand saut ───────────
      new THREE.Vector3(-0.133, 0.013, 0.324),
      new THREE.Vector3(-0.196, 0.046, 0.048),
      // ── Reprise du parcours original ────────────────────────────────────
      new THREE.Vector3(
        -0.3422256525097715,
        0.0640402223918468,
        -0.2889255062911455,
      ),

      new THREE.Vector3(
        -0.32100767419066684,
        0.11094394005145136,
        -0.5053127757290066,
      ),
      new THREE.Vector3(
        -0.1956158462741147,
        0.10996008604788639,
        -0.6021004220137204,
      ),
      new THREE.Vector3(
        0.04330464198837975,
        0.1458018272676451,
        -0.7045332436396786,
      ),
      new THREE.Vector3(
        0.22626143240225263,
        0.14880427396027257,
        -0.7475337725174473,
      ),
      new THREE.Vector3(
        0.3777479065948783,
        0.13053683750926395,
        -0.6121293665702451,
      ),
      new THREE.Vector3(
        0.37411781346247097,
        -0.041759004961539684,
        0.7578886931173632,
      ),
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
      onFinish && onFinish(false);
    }

    if (isRunning && !previousIsRunning.current && !started.current) {
      started.current = true;
      phase.current = 1;
    }

    previousIsRunning.current = isRunning;
  }, [isRunning, camera, onFinish]);

  useEffect(() => {
    const handleKey = (e) => {
      const key = e.key.toLowerCase();

      if (key === "t" && !started.current) {
        startGame("DEV");
        started.current = true;
        phase.current = 1;
      }

      if (key === "s" && active && !finished.current) {
        camera.position.copy(TARGET_POS);
        camera.lookAt(TARGET_LOOK);
        finished.current = true;
        onFinish?.(true);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [active, camera, onFinish, startGame]);

  useFrame(() => {
    if (!active || finished.current || phase.current === 0) return;

    if (phase.current === 1) {
      t.current += 0.005;
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
        onFinish?.(true);
      }
    }
  });

  return null;
}

export default CameraIntro;
