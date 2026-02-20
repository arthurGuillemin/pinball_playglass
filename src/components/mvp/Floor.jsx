import { RigidBody } from "@react-three/rapier";

function InclinedFloor() {
  return (
    <RigidBody type="fixed" colliders="cuboid">
      <mesh receiveShadow rotation={[Math.PI / 6, 0, 0]} position={[0, -1, 0]}>
        <boxGeometry args={[6, 0.5, 10]} />
        <meshStandardMaterial color="grey" />
      </mesh>
    </RigidBody>
  );
}

export default InclinedFloor;
