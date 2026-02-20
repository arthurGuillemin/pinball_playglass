import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Physics, RigidBody } from "@react-three/rapier";

function Ball() {
  return (
    <RigidBody colliders="ball" restitution={0.6} friction={0.5}>
      <mesh castShadow>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial color="red" />
      </mesh>
    </RigidBody>
  );
}

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

export default function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas shadows camera={{ position: [0, 6, 12], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 5]} intensity={1} castShadow />

        <Physics gravity={[0, -9.81, 0]}>
          <Ball />
          <InclinedFloor />
          <Walls />
          <Bumper />
        </Physics>
        <OrbitControls />
      </Canvas>
    </div>
  );
}
