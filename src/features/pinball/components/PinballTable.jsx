import { useGLTF } from "@react-three/drei";
import { RigidBody, MeshCollider, CuboidCollider } from "@react-three/rapier";
import { MeshStandardMaterial } from "three";

const STATIC_WALL_NODES = [
  "COL_wall_01",
  "COL_wall_02",
  "COL_wall_03",
  "COL_wall_04",
  "COL_wall_down_R",
  "COL_wall_down_L",
  "COL_wall_mini_down_R",
  "COL_luncher_L",
  "COL_luncher_L_up",
  "COL_fork_mini_R_left",
  "COL_fork_mini_R_right",
];

const CURVE_NODES = [
  "COL_CURVE_circle_top",
  "COL_CURVE_wall_diag_up_R",
  "COL_CURVE_cave_up_R",
  "COL_CURVE_cave_down_R",
  "COL_CURVE_cave_up_L",
  "COL_CURVE_cave_up_middle",
  "COL_CURVE_cave_down_L",
  "COL_CURVE_circle",
  "COL_CURVE_flipper_down_courbe_R",
  "COL_CURVE_flipper_down_courbe_L",
];

// Nodes avec scale non-1 → hull obligatoire
const HULL_NODES = ["COL_CURVE_wall_block_L"];

const BUMPER_NODES = [
  "COL_bumper_01",
  "COL_bumper_02",
  "COL_bumper_03",
  "COL_bumper_04",
  "COL_mini_bumper_01",
  "COL_mini_bumper_02",
  "COL_mini_bumper_03",
];

const defaultMat = new MeshStandardMaterial({ color: "#aaaaaa", side: 2 });

function FloorCollider() {
  return (
    <RigidBody type="fixed" colliders={false} position={[0, -0.024, 0]}>
      <CuboidCollider
        args={[0.45, 0.025, 0.82]}
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
          castShadow
          receiveShadow
        />
      </MeshCollider>
    </RigidBody>
  );
}

export function PinballTable({ onBumperHit, onSlingshotHit }) {
  const { nodes } = useGLTF("/pinball.glb");

  return (
    <group>
      <FloorCollider />

      {STATIC_WALL_NODES.map((name) => {
        const node = nodes[name];
        if (!node) return null;
        return (
          <StaticMesh key={name} node={node} restitution={0.3} friction={0.5} />
        );
      })}

      {CURVE_NODES.map((name) => {
        const node = nodes[name];
        if (!node) return null;
        return (
          <StaticMesh key={name} node={node} restitution={0.5} friction={0.3} />
        );
      })}

      {HULL_NODES.map((name) => {
        const node = nodes[name];
        if (!node) return null;
        return (
          <HullMesh key={name} node={node} restitution={0.5} friction={0.3} />
        );
      })}

      {["COL_SLING_slingshot_R", "COL_SLING_slingshot_L"].map((name) => {
        const node = nodes[name];
        if (!node) return null;
        return (
          <SlingshotMesh key={name} node={node} onContact={onSlingshotHit} />
        );
      })}

      {BUMPER_NODES.map((name) => {
        const node = nodes[name];
        if (!node) return null;
        return (
          <HullMesh
            key={name}
            node={node}
            restitution={5}
            friction={0}
            onContact={onBumperHit}
          />
        );
      })}
    </group>
  );
}

useGLTF.preload("/pinball.glb");
