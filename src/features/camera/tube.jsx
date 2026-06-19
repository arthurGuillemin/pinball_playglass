import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const ANNEX_POS = new THREE.Vector3(-0.006032346496364, 2, -0.9590925838537748);
const ANNEX_LOOK = new THREE.Vector3(0, 0.8, -2.5);

const HOME_POS = new THREE.Vector3(
  0.0008573606614677,
  2.052221119462724,
  0.2631354204559488,
);
const HOME_LOOK = new THREE.Vector3(
  -0.0012172428294691686,
  1.0563327468386152,
  0.16424547531753497,
);
export default function TubeCinematic({ onFinish, onStart }) {
  const { camera } = useThree();
  const active = useRef(false);
  const isReturn = useRef(false);
  const startPos = useRef(new THREE.Vector3());
  const startLook = useRef(new THREE.Vector3());
  const endPos = useRef(new THREE.Vector3());
  const endLook = useRef(new THREE.Vector3());
  const t = useRef(0);

  const startTravel = (targetPos, targetLook, returning = false) => {
    if (active.current) return;

    onStart?.();

    startPos.current.copy(camera.position);
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    startLook.current.copy(camera.position).addScaledVector(dir, 2);

    endPos.current.copy(targetPos);
    endLook.current.copy(targetLook);
    isReturn.current = returning;

    setTimeout(() => {
      t.current = 0;
      active.current = true;
    }, 50);
  };

  useEffect(() => {
    const toAnnex = () => startTravel(ANNEX_POS, ANNEX_LOOK, false);
    const toMain = () => startTravel(HOME_POS, HOME_LOOK, true);

    window.addEventListener("annex-camera", toAnnex);
    window.addEventListener("main-camera", toMain);
    return () => {
      window.removeEventListener("annex-camera", toAnnex);
      window.removeEventListener("main-camera", toMain);
    };
  }, [camera]);

  useFrame(() => {
    if (!active.current) return;

    t.current = Math.min(t.current + 0.012, 1);

    const ease =
      t.current < 0.5
        ? 2 * t.current * t.current
        : -1 + (4 - 2 * t.current) * t.current;

    camera.position.lerpVectors(startPos.current, endPos.current, ease);

    const lookNow = new THREE.Vector3().lerpVectors(
      startLook.current,
      endLook.current,
      ease,
    );
    camera.lookAt(lookNow);

    if (t.current >= 1) {
      active.current = false;
      camera.position.copy(endPos.current);
      camera.lookAt(endLook.current);

      // Réactive OrbitControls seulement au retour
      if (isReturn.current) {
        onFinish?.();
      }
    }
  });

  return null;
}
