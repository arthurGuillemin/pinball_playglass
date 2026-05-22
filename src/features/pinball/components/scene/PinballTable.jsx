import { useGLTF } from "@react-three/drei";
import { RigidBody, MeshCollider, CuboidCollider } from "@react-three/rapier";
import { MeshStandardMaterial } from "three";
import {
  STATIC_WALL_NODES,
  CURVE_NODES,
  HULL_NODES,
  BUMPER_NODES,
  SLINGSHOT_NODES,
} from "../../constants/tableNodes";

const GLB = "/pinball.glb";
const defaultMat = new MeshStandardMaterial({ color: "#aaaaaa", side: 2 });

function FloorCollider() {
  return (
    <RigidBody type="fixed" colliders={false} position={[0, -0.024, 0]}>
      <CuboidCollider
        args={[0.45, 0.04, 0.82]}
        friction={0.5}
        restitution={0.3}
      />
      <mesh receiveShadow>
        <boxGeometry args={[0.9, 0.05, 1.64]} />
        <meshStandardMaterial color="#555" roughness={0.8} metalness={0.1} />
      </mesh>
    </RigidBody>
  );
}

function StaticMesh({ node, restitution = 0.3, friction = 0.4, onContact }) {
  return (
    <RigidBody
      type="fixed"
      colliders={false}
      restitution={restitution}
      friction={friction}
      onCollisionEnter={onContact}
    >
      <MeshCollider type="trimesh">
        <mesh
          geometry={node.geometry}
          material={node.material ?? defaultMat}
          position={node.position}
          quaternion={node.quaternion}
          scale={node.scale}
          castShadow
          receiveShadow
        />
      </MeshCollider>
    </RigidBody>
  );
}

function HullMesh({ node, restitution = 0.3, friction = 0.4, onContact }) {
  return (
    <RigidBody
      type="fixed"
      colliders={false}
      restitution={restitution}
      friction={friction}
      onCollisionEnter={onContact}
    >
      <MeshCollider type="hull">
        <mesh
          geometry={node.geometry}
          material={node.material ?? defaultMat}
          position={node.position}
          quaternion={node.quaternion}
          scale={node.scale}
          castShadow
          receiveShadow
        />
      </MeshCollider>
    </RigidBody>
  );
}

function SlingshotMesh({ node, onContact }) {
  return (
    <RigidBody
      type="fixed"
      colliders={false}
      restitution={2.5}
      friction={0}
      onCollisionEnter={onContact}
    >
      <MeshCollider type="trimesh">
        <mesh
          geometry={node.geometry}
          material={node.material ?? defaultMat}
          position={node.position}
          quaternion={node.quaternion}
          scale={node.scale}
          castShadow
          receiveShadow
        />
      </MeshCollider>
    </RigidBody>
  );
}

export function PinballTable({ onBumperHit, onSlingshotHit }) {
  const { nodes } = useGLTF(GLB);

  return (
    <group>
      <FloorCollider />
      {STATIC_WALL_NODES.map((name) => {
        const n = nodes[name];
        if (!n) return null;
        return (
          <StaticMesh key={name} node={n} restitution={0.3} friction={0.5} />
        );
      })}
      {CURVE_NODES.map((name) => {
        const n = nodes[name];
        if (!n) return null;
        return (
          <StaticMesh key={name} node={n} restitution={0.5} friction={0.3} />
        );
      })}
      {HULL_NODES.map((name) => {
        const n = nodes[name];
        if (!n) return null;
        return (
          <HullMesh key={name} node={n} restitution={0.5} friction={0.3} />
        );
      })}
      {SLINGSHOT_NODES.map((name) => {
        const n = nodes[name];
        if (!n) return null;
        return <SlingshotMesh key={name} node={n} onContact={onSlingshotHit} />;
      })}
      {BUMPER_NODES.map((name) => {
        const n = nodes[name];
        if (!n) return null;
        return (
          <HullMesh
            key={name}
            node={n}
            restitution={5}
            friction={0}
            onContact={onBumperHit}
          />
        );
      })}
    </group>
  );
}

useGLTF.preload(GLB);
