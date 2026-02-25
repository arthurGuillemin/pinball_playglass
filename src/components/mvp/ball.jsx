import { RigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

const SPAWN_POSITION = { x: 2.7, y: -2, z: 4 };

export default function Ball({ ballRef, onBallLost }) {
  const hasTriggered = useRef(false);

  useFrame(() => {
    if (!ballRef?.current) return;

    const pos = ballRef.current.translation();

    if (pos.y < -10 && !hasTriggered.current) {
      hasTriggered.current = true;

      // 🔥 prévenir le serveur
      if (onBallLost) onBallLost();

      // respawn
      ballRef.current.setTranslation(SPAWN_POSITION, true);
      ballRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      ballRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);

      // petit délai pour éviter spam
      setTimeout(() => {
        hasTriggered.current = false;
      }, 500);
    }
  });

  return (
    <RigidBody
      ref={ballRef}
      colliders="ball"
      restitution={0.6}
      friction={0.5}
      position={[2.7, -2, 4]}
    >
      <mesh castShadow>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial color="red" />
      </mesh>
    </RigidBody>
  );
}
