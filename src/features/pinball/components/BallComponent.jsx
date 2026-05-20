import { useRef } from "react";
import { RigidBody } from "@react-three/rapier";
import { SPAWN } from "../constants/ballConfig";
import { useBallControls } from "../hooks/useBallControls";

function Ball() {
  const ref = useRef(null);
  useBallControls(ref);

  return (
    <RigidBody
      ref={ref}
      colliders="ball"
      restitution={0.2}
      friction={0.5}
      linearDamping={0.2}
      angularDamping={0.4}
      ccd={true}
      mass={1}
      position={[SPAWN.x, SPAWN.y, SPAWN.z]}
    >
      <mesh castShadow>
        <sphereGeometry args={[0.02, 32, 32]} />
        <meshStandardMaterial color="#e0e0e0" metalness={0.9} roughness={0.1} />
      </mesh>
    </RigidBody>
  );
}

export default Ball;
