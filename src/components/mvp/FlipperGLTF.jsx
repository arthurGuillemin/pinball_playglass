import { forwardRef } from "react";
import { useGLTF } from "@react-three/drei";
import { RigidBody, MeshCollider } from "@react-three/rapier";

const TILT_X = (7 * Math.PI) / 180;
const FLIP_Y = Math.PI;

const FLIPPER_CONFIG = {
  left: { nodeName: "COL_flipper_L", pivotWorld: [-0.167, -0.075, 0.661] },
  right: { nodeName: "COL_flipper_R", pivotWorld: [0.1, -0.066, 0.661] },
  right2: {
    nodeName: "COL_flipper_R001",
    pivotWorld: [0.33, -0.05, 0.0033942],
  },
};

const FLIPPER_STATIC_NODES = {
  left: ["COL_wall_flipper_L", "COL_CURVE_flipper_down_courbe_L"],
  right: [
    "COL_wall_flipper_R",
    "COL_CURVE_flipper_down_courbe_R",
    "COL_flipper_UP_R",
  ],
  right2: [
    "COL_wall_flipper_R",
    "COL_CURVE_flipper_down_courbe_R.001",
    "COL_flipper_UP_R.001",
  ],
};

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

const FlipperGLTF = forwardRef(({ side = "right" }, ref) => {
  const { nodes } = useGLTF("/pinball.glb");
  const { nodeName, pivotWorld } = FLIPPER_CONFIG[side];
  const node = nodes[nodeName];
  if (!node) {
    console.warn(`[FlipperGLTF] Node manquant : "${nodeName}"`);
    return null;
  }

  return (
    <RigidBody
      ref={ref}
      type="kinematicPosition"
      colliders={false}
      restitution={2}
      friction={0.1}
      position={pivotWorld}
    >
      <MeshCollider type="hull">
        <mesh
          geometry={node.geometry}
          material={node.material}
          rotation={[TILT_X, FLIP_Y, 0]}
          castShadow
          scale={node.scale}
        />
      </MeshCollider>
    </RigidBody>
  );
});

FlipperGLTF.displayName = "FlipperGLTF";
export default FlipperGLTF;

useGLTF.preload("/pinball.glb");
