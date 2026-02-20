import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Physics, RigidBody } from "@react-three/rapier";
import { useState, useEffect, useRef } from "react";
import { Quaternion, Euler } from "three";

import Flipper from "./components/mvp/Flipper";
import Ball from "./components/mvp/ball";
import InclinedFloor from "./components/mvp/Floor";
import Walls from "./components/mvp/walls";
import Bumper from "./components/mvp/bumper";
import Glass from "./components/mvp/glass";
export default function App() {
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
    const keyMap = { ArrowRight: "right", ArrowLeft: "left" };

    const handleKey = (e, isActive) => {
      const side = keyMap[e.code];
      if (side) setActiveFlippers((prev) => ({ ...prev, [side]: isActive }));
    };

    const handleKeyDown = (e) => handleKey(e, true);
    const handleKeyUp = (e) => handleKey(e, false);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
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

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas shadows camera={{ position: [0, 6, 12], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 5]} intensity={1} castShadow />

        <Physics gravity={[0, -9.81, 0]}>
          <Ball />
          <InclinedFloor />
          <Walls />
          <Flipper side="right" ref={flippers.right.ref} />
          <Flipper side="left" ref={flippers.left.ref} />
          <FlipperAnimator />
          <Bumper position={[-0.3, -0.71, 0]} points={100} />
          <Bumper position={[0.8, -0.71, 0]} points={200} />
          <Glass />
        </Physics>
        <OrbitControls />
      </Canvas>
    </div>
  );
}
