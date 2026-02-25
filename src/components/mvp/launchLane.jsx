import { RigidBody } from "@react-three/rapier";
export default function RightLane() {
  return (
    <group rotation={[Math.PI / 6, 0, 0]} position={[0, -1, 0]}>
      <RigidBody type="fixed">
        <mesh position={[2.4, 0.5, 2]}>
          <boxGeometry args={[0.2, 2, 6]} />
          <meshStandardMaterial color="black" />
        </mesh>
      </RigidBody>

      <RigidBody type="fixed">
        <mesh position={[3.2, 0.5, 2]}>
          <boxGeometry args={[0.2, 2, 8]} />
          <meshStandardMaterial color="black" />
        </mesh>
      </RigidBody>

      <RigidBody type="fixed">
        <mesh position={[2.7, 0.5, 5]}>
          <boxGeometry args={[1, 2, 0.2]} />
          <meshStandardMaterial color="black" />
        </mesh>
      </RigidBody>
    </group>
  );
}
