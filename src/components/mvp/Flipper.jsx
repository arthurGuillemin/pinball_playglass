import { forwardRef } from "react";
import { RigidBody } from "@react-three/rapier";

const Flipper = forwardRef(
  (
    {
      side = "right",
      position,
      size = [2.7, 0.5, 0.5],
      color,
      rotation = [Math.PI / 6, 0, 0],
    },
    ref,
  ) => {
    const isLeft = side === "left";
    const defaultPosition = isLeft ? [-3, -2.8, 4] : [3, -2.8, 4];
    const defaultColor = isLeft ? "pink" : "blue";
    const meshOffset = isLeft ? size[0] / 2 : -size[0] / 2;
    const yRotation = isLeft ? -Math.PI / 12 : Math.PI / 12;

    return (
      <RigidBody
        ref={ref}
        type="kinematicPosition"
        colliders="cuboid"
        restitution={1.2}
        position={position || defaultPosition}
        rotation={[rotation[0], yRotation, 0]}
      >
        <mesh position={[meshOffset, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={size} />
          <meshStandardMaterial color={color || defaultColor} />
        </mesh>
      </RigidBody>
    );
  },
);

export default Flipper;
