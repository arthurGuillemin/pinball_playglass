import { RigidBody } from "@react-three/rapier";

function Bumper() {
  const tilt = Math.PI / 6;

  return (
    <RigidBody
      type="fixed"
      colliders="ball"
      restitution={4}
      friction={0}
      position={[-0.3, -0.71, 0]}
      rotation={[tilt, 0, 0]}
    >
      <mesh castShadow>
        <sphereGeometry args={[0.25, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="blue" />
      </mesh>
    </RigidBody>
  );
}

export default Bumper;
