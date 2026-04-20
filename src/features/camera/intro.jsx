import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

function CameraIntro({ active, onFinish }) {
  const { camera } = useThree();

  const curve = useRef(
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.0429, -0.0497, 0.786),
      new THREE.Vector3(-0.0199, -0.0268, 0.4416),
      new THREE.Vector3(-0.3713, 0.0361, 0.0),
      new THREE.Vector3(-0.3264, 0.063, -0.2221),
      new THREE.Vector3(-0.0675, 0.114, -0.5166),
      new THREE.Vector3(0.1976, 0.1636, -0.7549),
      new THREE.Vector3(0.33, 0.1366, -0.6058),
      new THREE.Vector3(0.3752, -0.0473, 0.7856),
    ]),
  );

  const t = useRef(0);
  const phase = useRef(0);
  const finished = useRef(false);
  const speed = 0.002;

  const targetPos = new THREE.Vector3(
    -0.0031482368870522606,
    1.6802378199245809,
    1.2681252268760064,
  );
  const targetLook = new THREE.Vector3(0, 0, 0);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key.toLowerCase() === "s" && active && !finished.current) {
        // snap direct à la fin
        camera.position.copy(targetPos);
        camera.lookAt(targetLook);

        finished.current = true;
        onFinish?.();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [active, camera, onFinish]);

  useFrame(() => {
    if (!active || finished.current) return;

    if (phase.current === 0) {
      t.current += speed;

      if (t.current >= 1) {
        t.current = 1;
        phase.current = 1;
      }

      const point = curve.current.getPoint(t.current);
      const tangent = curve.current.getTangent(t.current);

      camera.position.copy(point);
      camera.lookAt(point.clone().add(tangent));
    } else if (phase.current === 1) {
      camera.position.lerp(targetPos, 0.05);
      camera.lookAt(targetLook);

      if (camera.position.distanceTo(targetPos) < 0.01) {
        finished.current = true;
        onFinish?.();
      }
    }
  });

  return null;
}

export default CameraIntro;
