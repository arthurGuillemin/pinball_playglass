import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { useState, useEffect, useRef, Suspense, useCallback } from "react";
import { Quaternion, Euler } from "three";
import FlipperGLTF, { FlipperStaticWalls } from "./components/mvp/FlipperGLTF";
import { PinballTable } from "./components/mvp/PinballTable";
import Ball from "./components/mvp/ball";
import StatsPanel from "./components/mvp/stats";
const FLIP_Y = Math.PI;
const TILT_X = (6.5 * Math.PI) / 180;
const ANGLE_ACTIVE = (50 * Math.PI) / 180;
const SLERP = 0.3;

// Hors du composant — pas de problème de ref pendant le render
const ROTATIONS = {
  baseRight: new Quaternion().setFromEuler(new Euler(0, 0, 0)),
  baseLeft: new Quaternion().setFromEuler(new Euler(0, 0, 0)),
  baseRight2: new Quaternion().setFromEuler(new Euler(0, 0, 0)),
  activeRight: new Quaternion().setFromEuler(new Euler(0, -ANGLE_ACTIVE, 0)),
  activeLeft: new Quaternion().setFromEuler(new Euler(0, ANGLE_ACTIVE, 0)),
  activeRight2: new Quaternion().setFromEuler(new Euler(0, -ANGLE_ACTIVE, 0)),
};

function FlipperAnimator({
  rightRef,
  leftRef,
  right2Ref,
  rightRot,
  leftRot,
  right2Rot,
  activeFlippers,
}) {
  useFrame(() => {
    if (rightRef.current) {
      rightRot.current.slerp(
        activeFlippers.right ? ROTATIONS.activeRight : ROTATIONS.baseRight,
        SLERP,
      );
      rightRef.current.setNextKinematicRotation(rightRot.current);
    }
    if (leftRef.current) {
      leftRot.current.slerp(
        activeFlippers.left ? ROTATIONS.activeLeft : ROTATIONS.baseLeft,
        SLERP,
      );
      leftRef.current.setNextKinematicRotation(leftRot.current);
    }
    if (right2Ref.current) {
      right2Rot.current.slerp(
        activeFlippers.right2 ? ROTATIONS.activeRight2 : ROTATIONS.baseRight2,
        SLERP,
      );
      right2Ref.current.setNextKinematicRotation(right2Rot.current);
    }
  });
  return null;
}

export default function App() {
  const rightRef = useRef(null);
  const leftRef = useRef(null);
  const rightRot = useRef(new Quaternion());
  const leftRot = useRef(new Quaternion());
  const right2Ref = useRef(null);
  const right2Rot = useRef(new Quaternion());

  const [activeFlippers, setActiveFlippers] = useState({
    right: false,
    left: false,
    right2: false,
  });
  const [score, setScore] = useState(0);
  const [charging, setCharging] = useState(false);
  const [chargeLevel, setChargeLevel] = useState(0);

  useEffect(() => {
    const onCharge = (e) => {
      setCharging(e.detail.charging);
      setChargeLevel(e.detail.level);
    };
    window.addEventListener("ball-charge", onCharge);
    return () => window.removeEventListener("ball-charge", onCharge);
  }, []);

  useEffect(() => {
    const onDown = (e) => {
      if (e.code === "ArrowRight")
        setActiveFlippers((p) => ({ ...p, right: true, right2: true }));
      if (e.code === "ArrowLeft")
        setActiveFlippers((p) => ({ ...p, left: true }));
    };
    const onUp = (e) => {
      if (e.code === "ArrowRight")
        setActiveFlippers((p) => ({ ...p, right: false, right2: false }));
      if (e.code === "ArrowLeft")
        setActiveFlippers((p) => ({ ...p, left: false }));
    };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, []);

  const onBumperHit = useCallback(() => setScore((s) => s + 100), []);
  const onSlingshotHit = useCallback(() => setScore((s) => s + 50), []);

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#111" }}>
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

      {charging && (
        <div
          style={{
            position: "absolute",
            bottom: 60,
            left: "50%",
            transform: "translateX(-50%)",
            width: 200,
            height: 14,
            background: "#222",
            borderRadius: 7,
            overflow: "hidden",
            zIndex: 10,
            border: "1px solid #555",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${chargeLevel * 100}%`,
              background: `hsl(${120 - chargeLevel * 120}, 90%, 50%)`,
              borderRadius: 7,
            }}
          />
        </div>
      )}

      <div
        style={{
          position: "absolute",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          color: "#aaa",
          fontFamily: "monospace",
          fontSize: "0.85rem",
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        ← Flipper G &nbsp;|&nbsp; Flipper D → &nbsp;|&nbsp; [Espace] Lancer
        &nbsp;|&nbsp; [R] Respawn
      </div>

      <Canvas
        shadows
        camera={{ position: [0, 3, 2.5], fov: 45, near: 0.01, far: 100 }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[0.5, 4, 1]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />

        <StatsPanel />

        <Physics gravity={[0, -9.81, 0]} debug={true}>
          <group rotation={[TILT_X, FLIP_Y, 0]}>
            <Suspense fallback={null}>
              <PinballTable
                onBumperHit={onBumperHit}
                onSlingshotHit={onSlingshotHit}
              />
              <FlipperStaticWalls side="left" />
              <FlipperStaticWalls side="right" />
              <FlipperStaticWalls side="right2" />
            </Suspense>
          </group>

          <Suspense fallback={null}>
            <FlipperGLTF side="left" ref={leftRef} />
            <FlipperGLTF side="right" ref={rightRef} />
            <FlipperGLTF side="right2" ref={right2Ref} />
          </Suspense>

          <Ball />
          <FlipperAnimator
            rightRef={rightRef}
            leftRef={leftRef}
            right2Ref={right2Ref}
            rightRot={rightRot}
            leftRot={leftRot}
            right2Rot={right2Rot}
            activeFlippers={activeFlippers}
          />
        </Physics>

        <OrbitControls makeDefault target={[0, 0, 0]} />
      </Canvas>
    </div>
  );
}
