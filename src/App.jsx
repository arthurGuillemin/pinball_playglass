import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { useEffect, useRef } from "react";
import { Quaternion, Euler } from "three";
import wsService from "./services/socket.service.js";

import Flipper from "./components/mvp/Flipper";
import Ball from "./components/mvp/ball";
import InclinedFloor from "./components/mvp/Floor";
import Walls from "./components/mvp/walls";
import Bumper from "./components/mvp/bumper";
import Glass from "./components/mvp/glass";
import Slingshot from "./components/mvp/Slingshot";
import FlipperAnimator from "./components/mvp/FlipperAnimator";
import StartScreen from "./components/mvp/StartScreen";

import { useFlipperControls } from "./hooks/useFlipperControls";
import { useGameState } from "./hooks/useGameState";

const ROTATIONS = {
  baseRight: new Quaternion().setFromEuler(
    new Euler(Math.PI / 6, Math.PI / 12, 0),
  ),
  baseLeft: new Quaternion().setFromEuler(
    new Euler(Math.PI / 6, -Math.PI / 12, 0),
  ),
  activeRight: new Quaternion().setFromEuler(
    new Euler(Math.PI / 6, Math.PI / 12 - Math.PI / 4, 0),
  ),
  activeLeft: new Quaternion().setFromEuler(
    new Euler(Math.PI / 6, -Math.PI / 12 + Math.PI / 4, 0),
  ),
};

export default function App() {
  const gameState = useGameState();
  const { activeFlippers } = useFlipperControls();

  const rightFlipperRef = useRef();
  const leftFlipperRef = useRef();
  const rightRotation = useRef();
  const leftRotation = useRef();

  const flippers = {
    right: { ref: rightFlipperRef, rotation: rightRotation },
    left: { ref: leftFlipperRef, rotation: leftRotation },
  };

  useEffect(() => {
    rightRotation.current = ROTATIONS.baseRight.clone();
    leftRotation.current = ROTATIONS.baseLeft.clone();
  }, []);

  useEffect(() => {
    wsService.connect();
    return () => wsService.disconnect();
  }, []);

  if (!gameState.isRunning) {
    return <StartScreen score={gameState.score} />;
  }

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          color: "white",
          fontSize: 20,
          zIndex: 10,
        }}
      >
        <p>Score : {gameState.score}</p>
        <p>HP : {gameState.balls}</p>
      </div>

      <Canvas shadows camera={{ position: [0, 6, 12], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 5]} intensity={1} castShadow />

        <Physics gravity={[0, -9.81, 0]}>
          <Ball onBallLost={() => wsService.emitBallLost()} />
          <InclinedFloor />
          <Walls />
          <Flipper side="right" ref={rightFlipperRef} />
          <Flipper side="left" ref={leftFlipperRef} />
          <FlipperAnimator
            flippers={flippers}
            activeFlippers={activeFlippers}
            rotations={ROTATIONS}
          />
          <Bumper position={[-1, 0.45, -2]} points={100} />
          <Bumper position={[1, 0.45, -2]} points={200} />
          <Bumper position={[0, -0.15, -1]} points={100} />
          <Slingshot side="left" position={[-2, -2.1, 2.4]} />
          <Slingshot side="right" position={[2, -2.1, 2.4]} />
          <Glass />
        </Physics>
        <OrbitControls />
      </Canvas>
    </div>
  );
}
