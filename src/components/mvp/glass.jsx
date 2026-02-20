import { RigidBody } from "@react-three/rapier";

function Glass() {
  const tilt = Math.PI / 6;

  return (
    <RigidBody type="fixed" colliders="cuboid">
      <mesh receiveShadow rotation={[Math.PI / 6, 0, 0]} position={[0, 0.7, 0]}>
        <boxGeometry args={[6, 0.15, 10]} />

        <meshStandardMaterial color="lightblue" transparent opacity={0} />
      </mesh>
    </RigidBody>
  );
}

export default Glass;
