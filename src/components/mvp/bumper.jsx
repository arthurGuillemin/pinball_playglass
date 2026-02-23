import { RigidBody } from "@react-three/rapier";
import { emitScore } from "../../services/socket.service";
function Bumper({ position = [0, 0, 0], onScore, points }) {
  const tilt = Math.PI / 6;

  const handleCollision = () => {
    console.log(`contact avec le bumper :${points}  points`);
    onScore?.(points);
    emitScore(points);
  };

  return (
    <RigidBody
      type="fixed"
      colliders="ball"
      restitution={4}
      friction={0}
      position={position}
      rotation={[tilt, 0, 0]}
      onCollisionEnter={handleCollision}
    >
      <mesh castShadow>
        <sphereGeometry args={[0.25, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="blue" />
      </mesh>
    </RigidBody>
  );
}

export default Bumper;
