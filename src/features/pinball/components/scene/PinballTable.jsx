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

import { useSound } from "../../hooks/useSound";

const GLB = "/pinball.glb";
const DICE_GLB = "/dice.glb";

const defaultMat = new MeshStandardMaterial({ color: "#aaaaaa", side: 2 });

const MUSHROOM_NODES = ["champi1", "champi2", "champi3"];

function FloorCollider() {
  return (
    <RigidBody type="fixed" colliders={false} position={[0, -0.024, 0]}>
      <CuboidCollider
        args={[0.45, 0.04, 0.82]}
        friction={0.5}
        restitution={0.3}
      />
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

function VisualNode({ node }) {
  if (!node) return null;
  if (node.type === "Mesh") {
    return (
      <mesh
        geometry={node.geometry}
        material={node.material}
        position={node.position}
        quaternion={node.quaternion}
        scale={node.scale}
        castShadow
      />
    );
  }
  if (node.type === "Group" || node.type === "Object3D") {
    return (
      <group
        position={node.position}
        quaternion={node.quaternion}
        scale={node.scale}
      >
        {node.children?.map((child, i) => (
          <VisualNode key={i} node={child} />
        ))}
      </group>
    );
  }
  return null;
}

function ExternalModel({
  scene,
  scale = 0.1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}) {
  if (!scene) return null;
  return (
    <primitive
      object={scene}
      scale={scale}
      position={position}
      rotation={rotation}
    />
  );
}

export function PinballTable({ onBumperHit, onSlingshotHit }) {
  const { nodes } = useGLTF(GLB);
  const { scene: diceScene } = useGLTF(DICE_GLB);
  const { play } = useSound();

  const floorNode = nodes["COL_floor"];

  return (
    <group>
      <FloorCollider />
      {floorNode && (
        <mesh
          geometry={floorNode.geometry}
          material={floorNode.material}
          position={floorNode.position}
          quaternion={floorNode.quaternion}
          scale={floorNode.scale}
          receiveShadow
        />
      )}

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
        return (
          <SlingshotMesh
            key={name}
            node={n}
            onContact={() => {
              onSlingshotHit();
              play("slingshot", 0.1);
            }}
          />
        );
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
            onContact={() => {
              onBumperHit();
              play("bumper", 0.3);
            }}
          />
        );
      })}
      {MUSHROOM_NODES.map((name) => {
        const n = nodes[name];
        if (!n) return null;
        return <VisualNode key={name} node={n} />;
      })}
      <ExternalModel
        scene={diceScene}
        scale={0.03}
        position={[0, 0.98, 2.67]}
        rotation={[0, Math.PI, 0]}
      />
    </group>
  );
}

useGLTF.preload(GLB);
useGLTF.preload(DICE_GLB);
