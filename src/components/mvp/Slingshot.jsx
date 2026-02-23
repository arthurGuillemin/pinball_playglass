import { RigidBody } from "@react-three/rapier";
import { useMemo } from "react";
import * as THREE from "three";

function Slingshot({ position = [0, 0, 0], side = "left" }) {
  const isLeft = side === "left";

  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(0, 1.8);
    shape.lineTo(1, 0);
    shape.lineTo(0, 0);

    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.5,
      bevelEnabled: false,
    });
  }, []);

  const impulseDirection = useMemo(
    () => ({
      x: isLeft ? -0.5 : 0.5,
      y: 0,
      z: 0.35,
    }),
    [isLeft],
  );

  const meshRotation = useMemo(
    () => [-Math.PI / 3, 0, isLeft ? 3 : 4],
    [isLeft],
  );

  const handleCollision = (event) => {
    const ball = event.other.rigidBody;
    if (!ball || !event.manifold) return;

    const contactPoint = event.manifold.solverContactPoint(0);
    const onHypotenuse =
      Math.abs(contactPoint.x) > 0.1 && Math.abs(contactPoint.z) > 0.1;

    if (onHypotenuse) {
      ball.applyImpulse(impulseDirection, true);
    }
  };

  return (
    <group position={position} rotation={[0, 0, 0]}>
      <RigidBody
        type="fixed"
        colliders="hull"
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
