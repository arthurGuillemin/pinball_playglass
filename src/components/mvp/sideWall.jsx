import { RigidBody } from "@react-three/rapier";

function SideWall() {
  const tilt = Math.PI / 6;
  return (
    <RigidBody type="fixed" colliders="cuboid">
      <mesh
        receiveShadow
        rotation={[tilt, 2, 0]}
        position={[1.7, -1 + Math.sin(tilt) * 5, -Math.cos(tilt) * 5]}
      >
        <boxGeometry args={[6, 3, 0.1]} />
        <meshStandardMaterial color="grey" />
      </mesh>
    </RigidBody>
  );
}

export default SideWall;
