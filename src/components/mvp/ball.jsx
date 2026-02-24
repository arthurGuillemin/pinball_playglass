import { RigidBody } from "@react-three/rapier";
import { useRef } from "react";

export default function Ball({ ballRef }) {
  return (
    <RigidBody
      ref={ballRef}
      colliders="ball"
      restitution={0.5}
      position={[2.7, -2, 4]}
    >
      <mesh>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial color="red" />
      </mesh>
    </RigidBody>
  );
}
