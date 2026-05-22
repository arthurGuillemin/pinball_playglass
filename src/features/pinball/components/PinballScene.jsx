import { Suspense } from "react";
import { Physics } from "@react-three/rapier";
import { PinballTable } from "./scene/PinballTable";
import { FlipperStaticWalls } from "./flippers/FlipperStaticWalls";
import FlipperMesh from "./flippers/FlipperMesh";
import { FlipperAnimator } from "./flippers/FlipperAnimator";
import Ball from "./ball/BallComponent";
import { LaneSensors } from "./lanes/LaneSensors";
import { AnnexZone } from "./annex/AnnexZone";
import { AnnexFlippers } from "./annex/AnnexFlippers";
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
  const {
    onBumperHit,
    onSlingshotHit,
    cardStates,
    annexPhase,
    onCardHit,
    onQuestLost,
  } = useGame();

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
          <AnnexZone
            cardStates={cardStates}
            annexPhase={annexPhase}
            onCardHit={onCardHit}
            onQuestLost={onQuestLost}
          />
        </Suspense>
      </group>

      <Suspense fallback={null}>
        <LaneSensors />
      </Suspense>

      <Suspense fallback={null}>
        <FlipperMesh side="left" ref={leftRef} />
        <FlipperMesh side="right" ref={rightRef} />
        <FlipperMesh side="right2" ref={right2Ref} />
        <AnnexFlippers activeFlippers={activeFlippers} />
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
