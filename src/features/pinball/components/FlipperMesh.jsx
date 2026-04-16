import { forwardRef } from "react";
import { useGLTF } from "@react-three/drei";
import { RigidBody, MeshCollider } from "@react-three/rapier";
import { FLIPPER_CONFIG, TILT_X, FLIP_Y } from "../constants/flipperConfig";

const FlipperMesh = forwardRef(({ side = "right" }, ref) => {
  const { nodes } = useGLTF("/pinball.glb");
  const { nodeName, pivotWorld } = FLIPPER_CONFIG[side];
  const node = nodes[nodeName];

  if (!node) {
    console.warn(`[FlipperMesh] Node manquant : "${nodeName}"`);
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

FlipperMesh.displayName = "FlipperMesh";
export default FlipperMesh;

useGLTF.preload("/pinball.glb");
