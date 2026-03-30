import { RigidBody } from "@react-three/rapier";
import { useState, useEffect } from "react";

export default function Launcher({ ballRef }) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space") {
        setIsActive(true);
        if (ballRef?.current) {
          ballRef.current.applyImpulse({ x: 0, y: 2, z: 0 });
        }
      }
    };
    const handleKeyUp = (e) => {
      if (e.code === "Space") setIsActive(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [ballRef]);
  return (
    <RigidBody type="fixed" rotation={[Math.PI / 6, 0, 0]}>
      <mesh position={[2.7, 0, 5]}>
        <boxGeometry args={[0.5, 1, 0.5]} />
        <meshStandardMaterial color={isActive ? "red" : "green"} />
      </mesh>
    </RigidBody>
  );
}
