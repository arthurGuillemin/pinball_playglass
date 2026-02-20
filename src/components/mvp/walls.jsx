import { RigidBody } from "@react-three/rapier";

function Walls() {
  const tilt = Math.PI / 6;

  return (
    <>
      <RigidBody type="fixed" colliders="cuboid">
        <mesh
          receiveShadow
          rotation={[tilt, 0, 0]}
          position={[0, -1 + Math.sin(tilt) * 5, -Math.cos(tilt) * 5]}
        >
          <boxGeometry args={[6, 3, 0.5]} />
          <meshStandardMaterial color="grey" />
        </mesh>
      </RigidBody>

      <RigidBody type="fixed" colliders="cuboid">
        <mesh
          receiveShadow
          rotation={[tilt, 0, 0]}
          position={[0, -1 - Math.sin(tilt) * 5, Math.cos(tilt) * 5]}
        >
          <boxGeometry args={[6, 3, 0.5]} />
          <meshStandardMaterial color="grey" />
        </mesh>
      </RigidBody>

      <RigidBody type="fixed" colliders="cuboid">
        <mesh receiveShadow rotation={[tilt, 0, 0]} position={[-3, -1, 0]}>
          <boxGeometry args={[0.5, 3, 10]} />
          <meshStandardMaterial color="grey" />
        </mesh>
      </RigidBody>

      <RigidBody type="fixed" colliders="cuboid">
        <mesh receiveShadow rotation={[tilt, 0, 0]} position={[3, -1, 0]}>
          <boxGeometry args={[0.5, 3, 10]} />
          <meshStandardMaterial color="grey" />
        </mesh>
      </RigidBody>
    </>
  );
}

export default Walls;
