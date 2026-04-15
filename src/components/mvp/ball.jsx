import { RigidBody } from "@react-three/rapier";
import { useRef, useEffect, useCallback } from "react";

const MAX_CHARGE_TIME = 1500;
const MAX_VELOCITY = 4;
const SPAWN = { x: 0.41, y: 0.03, z: 0.78 };

function Ball() {
  const ref = useRef(null);
  const chargeStart = useRef(null);
  const animFrame = useRef(null);

  function emitCharge(charging, level = 0) {
    window.dispatchEvent(
      new CustomEvent("ball-charge", { detail: { charging, level } }),
    );
  }

  const respawn = useCallback(() => {
    if (!ref.current) return;
    ref.current.setTranslation(SPAWN, true);
    ref.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
    ref.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
    cancelAnimationFrame(animFrame.current);
    chargeStart.current = null;
    emitCharge(false);
  }, []);

  const launch = useCallback(() => {
    if (!ref.current || chargeStart.current === null) return;
    const elapsed = Date.now() - chargeStart.current;
    const ratio = Math.min(elapsed / MAX_CHARGE_TIME, 1);
    const speed = 0.5 + ratio * (MAX_VELOCITY - 0.5);
    ref.current.setLinvel({ x: 0, y: 0, z: -speed }, true);
    cancelAnimationFrame(animFrame.current);
    chargeStart.current = null;
    emitCharge(false);
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.code === "Space" && !e.repeat) {
        e.preventDefault();
        chargeStart.current = Date.now();
        emitCharge(true, 0);
        const update = () => {
          if (chargeStart.current === null) return;
          const level = Math.min(
            (Date.now() - chargeStart.current) / MAX_CHARGE_TIME,
            1,
          );
          emitCharge(true, level);
          animFrame.current = requestAnimationFrame(update);
        };
        animFrame.current = requestAnimationFrame(update);
      }
      if (e.code === "KeyR") respawn();
    };
    const onKeyUp = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        launch();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      cancelAnimationFrame(animFrame.current);
    };
  }, [launch, respawn]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!ref.current) return;
      if (ref.current.translation().y < -1) respawn();
    }, 500);
    return () => clearInterval(interval);
  }, [respawn]);

  return (
    <RigidBody
      ref={ref}
      colliders="ball"
      restitution={0.6}
      friction={0.5}
      linearDamping={0.2}
      angularDamping={0.4}
      position={[SPAWN.x, SPAWN.y, SPAWN.z]}
    >
      <mesh castShadow>
        <sphereGeometry args={[0.02, 32, 32]} />
        <meshStandardMaterial color="#e0e0e0" metalness={0.9} roughness={0.1} />
      </mesh>
    </RigidBody>
  );
}

export default Ball;
