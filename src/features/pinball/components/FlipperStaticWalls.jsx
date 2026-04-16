import { useGLTF } from "@react-three/drei";
import { RigidBody, MeshCollider } from "@react-three/rapier";
import { FLIPPER_STATIC_NODES } from "../constants/flipperConfig";

export function FlipperStaticWalls({ side = "right" }) {
  const { nodes } = useGLTF("/pinball.glb");

  return (
    <group>
      {FLIPPER_STATIC_NODES[side].map((name) => {
        const node = nodes[name];
        if (!node) return null;
        return (
          <RigidBody
            key={name}
            type="fixed"
            colliders={false}
            restitution={0.8}
            friction={0.4}
          >
            <MeshCollider type="trimesh">
              <mesh
                geometry={node.geometry}
                material={node.material}
                position={node.position}
                quaternion={node.quaternion}
                scale={node.scale}
                castShadow
                receiveShadow
              />
            </MeshCollider>
          </RigidBody>
        );
      })}
    </group>
  );
}
