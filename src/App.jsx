import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import { PinballScene } from "./features/pinball/components/PinballScene";
import { useFlipperControls } from "./features/pinball/hooks/useFlipperControls";
import { useGameState } from "./features/pinball/hooks/useGameState";
import ScoreDisplay from "./components/ScoreDisplay";
import ChargeBar from "./components/ChargeBar";
import ControlsHint from "./components/ControlsHint";
import StatsPanel from "./utils/stats.js";

const env = import.meta.env.VITE_ENV;
let debugState;
if (env === "dev") {
  debugState = true;
} else {
  debugState = false;
}

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
  const { score, charging, chargeLevel, onBumperHit, onSlingshotHit } =
    useGameState();

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#111" }}>
      <ScoreDisplay score={score} />
      <ChargeBar charging={charging} chargeLevel={chargeLevel} />
      <ControlsHint />

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
          />
        </Suspense>
        <OrbitControls makeDefault target={[0, 0, 0]} />
      </Canvas>
    </div>
  );
}
