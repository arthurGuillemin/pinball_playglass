import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Physics, RigidBody } from "@react-three/rapier";
import { useState, useEffect, useRef } from "react";
import { Quaternion, Euler } from "three";
import wsService from "./services/socket.service.js";

import Flipper from "./components/mvp/Flipper";
import Ball from "./components/mvp/ball";
import InclinedFloor from "./components/mvp/Floor";
import Walls from "./components/mvp/walls";
import Bumper from "./components/mvp/bumper";
import Glass from "./components/mvp/glass";
import Slingshot from "./components/mvp/Slingshot";

export default function App() {
  const [gameState, setGameState] = useState({
    isRunning: false,
    score: 0,
    balls: 3,
    currentPlayer: "arthur",
  });

  const flippers = useRef({
    right: { ref: useRef(), rotation: useRef() },
    left: { ref: useRef(), rotation: useRef() },
  }).current;

  const [activeFlippers, setActiveFlippers] = useState({
    right: false,
    left: false,
  });

  const rotations = useRef({
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
  }).current;

  useEffect(() => {
    flippers.right.rotation.current = rotations.baseRight.clone();
    flippers.left.rotation.current = rotations.baseLeft.clone();
  }, []);

  useEffect(() => {
    wsService.connect();

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

    wsService.onScreenMessage((data) => {
      if (data.type === "state_update") {
        setGameState(data.state);
      }
      if (data.type === "game_over") {
        setGameState(data.state);
        fetch("http://localhost:3000/api/scores", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            player_name: data.state.currentPlayer,
            score: data.state.score,
          }),
        });
      }
    });

    return () => wsService.disconnect();
  }, []);

  useEffect(() => {
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

  function FlipperAnimator() {
    useFrame(() => {
      ["right", "left"].forEach((side) => {
        const flipper = flippers[side];
        if (flipper.ref.current) {
          const targetQuat = activeFlippers[side]
            ? rotations[`active${side.charAt(0).toUpperCase() + side.slice(1)}`]
            : rotations[`base${side.charAt(0).toUpperCase() + side.slice(1)}`];
          flipper.rotation.current.slerp(targetQuat, 0.3);
          flipper.ref.current.setNextKinematicRotation(
            flipper.rotation.current,
          );
        }
      });
    });
    return null;
  }

  if (!gameState.isRunning) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          background: "black",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
        }}
      >
        {gameState.score > 0 && (
          <>
            <p style={{ color: "white", fontSize: 32 }}>GAME OVER</p>
            <p style={{ color: "white", fontSize: 24 }}>
              Score : {gameState.score}
            </p>
          </>
        )}
        <p style={{ color: "white", fontSize: 48 }}>FLIPPER MVP</p>
        <button
          onClick={() => wsService.startGame("Player1")}
          style={{
            padding: "15px 40px",
            fontSize: 24,
            cursor: "pointer",
            background: "blue",
            color: "white",
            border: "none",
            borderRadius: 8,
          }}
        >
          START
        </button>
      </div>
    );
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
          <Flipper side="right" ref={flippers.right.ref} />
          <Flipper side="left" ref={flippers.left.ref} />
          <FlipperAnimator />
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
