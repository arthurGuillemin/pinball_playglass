import { RigidBody } from "@react-three/rapier";
import { useMemo } from "react";
import * as THREE from "three";

function Slingshot({ position = [0, 0, 0], side = "left" }) {
  const isLeft = side === "left";

  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    if (isLeft) {
      shape.moveTo(0, 0);
      shape.lineTo(0, 1.8);
      shape.lineTo(1, 0);
      shape.lineTo(0, 0);
    } else {
      shape.moveTo(0, 0);
      shape.lineTo(0, 1.8);
      shape.lineTo(-1, 0);
      shape.lineTo(0, 0);
    }

    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.5,
      bevelEnabled: false,
    });
  }, [isLeft]);

  const meshRotation = useMemo(
    () => [-Math.PI / 3, 0, isLeft ? 0 : -6.3],
    [isLeft],
  );

  const handleCollision = (event) => {
    const contactPoint = event.manifold.solverContactPoint(0);
    const onHypotenuse =
      Math.abs(contactPoint.x) > 0.1 && Math.abs(contactPoint.z) > 0.1;
  };

  return (
    <group position={position}>
      <RigidBody
        type="fixed"
        colliders="hull"
        restitution={4}
        onCollisionEnter={handleCollision}
      >
        <mesh
          geometry={geometry}
          castShadow
          receiveShadow
          rotation={meshRotation}
        >
          <meshStandardMaterial color={isLeft ? "orange" : "green"} />
        </mesh>
      </RigidBody>
    </group>
  );
}

export default Slingshot;
