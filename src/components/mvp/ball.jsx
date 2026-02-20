import { RigidBody } from "@react-three/rapier";

function Ball() {
  return (
    <RigidBody colliders="ball" restitution={0.6} friction={0.5}>
      <mesh castShadow>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial color="red" />
      </mesh>
    </RigidBody>
  );
}

export default Ball;
