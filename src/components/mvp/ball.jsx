import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { RigidBody } from "@react-three/rapier";

function Ball() {
  const ballRef = useRef();

  useFrame(() => {
    if (!ballRef.current) return;
    const pos = ballRef.current.translation();
    if (pos.y < -10) {
      ballRef.current.setTranslation({ x: 0, y: 0.6, z: 0 }, true);
      ballRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      ballRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
    }
  });

  return (
    <RigidBody ref={ballRef} colliders="ball" restitution={0.6} friction={0.5}>
      <mesh castShadow>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial color="red" />
      </mesh>
    </RigidBody>
  );
}

export default Ball;
