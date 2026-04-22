import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense, useState } from "react";
import { PinballScene } from "./features/pinball/components/PinballScene";
import { useFlipperControls } from "./features/pinball/hooks/useFlipperControls";
import ScoreDisplay from "./components/ScoreDisplay";
import ChargeBar from "./components/ChargeBar";
import ControlsHint from "./components/ControlsHint";
import StatsPanel from "./utils/stats.js";
import CameraDebugger from "./utils/CameraDebugger.js";
import CameraIntro from "./features/camera/intro.jsx";
import { useGameState } from "./features/pinball/hooks/useGameState.js";

const env = import.meta.env.VITE_ENV;
const debugState = env === "dev";

export default function App() {
  const {
    rightRef,
    leftRef,
    right2Ref,
    rightRot,
    leftRot,
    right2Rot,
    activeFlippers,
  } = useFlipperControls();

  const {
    score,
    isRunning,
    charging,
    chargeLevel,
    groupStates,
    onSensorHit,
    onBoostHit,
    onBumperHit,
    onSlingshotHit,
    onBallLost,
    cardHits,
    cardsRaised,
    annexPhase,
    onCardHit,
    onQuestLost,
  } = useGameState();

  const [cameraIntro, setCameraIntro] = useState(true);

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#111" }}>
      <ScoreDisplay score={score} />
      <ChargeBar charging={charging} chargeLevel={chargeLevel} />
      <ControlsHint />

      <Canvas
        shadows
        camera={{ position: [0, 3, 2.5], fov: 45, near: 0.01, far: 100 }}
      >
        <CameraIntro
          active={isRunning}
          onFinish={() => setCameraIntro(false)}
        />

        <CameraDebugger />

        <ambientLight intensity={0.5} />
        <directionalLight
          position={[0.5, 4, 1]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />

        {debugState && <StatsPanel />}

        <Suspense fallback={null}>
          <PinballScene
            rightRef={rightRef}
            leftRef={leftRef}
            right2Ref={right2Ref}
            rightRot={rightRot}
            leftRot={leftRot}
            right2Rot={right2Rot}
            activeFlippers={activeFlippers}
            onBumperHit={onBumperHit}
            onSlingshotHit={onSlingshotHit}
            onBoostHit={onBoostHit}
            onSensorHit={onSensorHit}
            groupStates={groupStates}
            onBallLost={onBallLost}
            cardHits={cardHits}
            cardsRaised={cardsRaised}
            annexPhase={annexPhase}
            onCardHit={onCardHit}
            onQuestLost={onQuestLost}
          />
        </Suspense>

        {!cameraIntro && <OrbitControls makeDefault target={[0, 0, 0]} />}
      </Canvas>
    </div>
  );
}
