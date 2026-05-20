import { Suspense } from "react";
import { Physics } from "@react-three/rapier";
import { PinballTable } from "./PinballTable";
import { FlipperStaticWalls } from "./FlipperStaticWalls";
import FlipperMesh from "./FlipperMesh";
import { FlipperAnimator } from "./FlipperAnimator";
import Ball from "./BallComponent";
import { LaneSensors } from "./LaneSensors";
import { TILT_X, FLIP_Y } from "../constants/flipperConfig";
import { useGame } from "../context/GameContext";

const env = import.meta.env.VITE_ENV;
const debugState = env === "dev";

export function PinballScene({
  rightRef,
  leftRef,
  right2Ref,
  rightRot,
  leftRot,
  right2Rot,
  activeFlippers,
}) {
  const { onBumperHit, onSlingshotHit } = useGame();

  return (
    <Physics
      gravity={[0, -9.81, 0]}
      debug={debugState}
      timeStep={1 / 120}
      numSolverIterations={8}
    >
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
        <LaneSensors />
      </Suspense>

      <Suspense fallback={null}>
        <FlipperMesh side="left" ref={leftRef} />
        <FlipperMesh side="right" ref={rightRef} />
        <FlipperMesh side="right2" ref={right2Ref} />
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
  );
}
