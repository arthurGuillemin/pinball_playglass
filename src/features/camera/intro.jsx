import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

function CameraIntro({ active, onFinish }) {
  const { camera } = useThree();

  const curve = useRef(
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(
        -0.04294265951812948,
        -0.049772120742153196,
        0.7860773329821105,
      ),
      new THREE.Vector3(
        -0.019928705142897903,
        -0.02686682201667486,
        0.4416504977953599,
      ),
      new THREE.Vector3(-0.37131598936392957, 0.03614809961164034, 0.0),
      new THREE.Vector3(
        -0.3264818311849407,
        0.06305775796879048,
        -0.2221204338579097,
      ),
      new THREE.Vector3(
        -0.06755797364653146,
        0.1140151528856484,
        -0.516642477927032,
      ),
      new THREE.Vector3(
        0.19766327403302242,
        0.16367639310550314,
        -0.7549548091645989,
      ),
      new THREE.Vector3(0.33, 0.13660375587433313, -0.605808166372657),
      new THREE.Vector3(
        0.37526342916551714,
        -0.047351854071872826,
        0.7856115568007047,
      ),
    ]),
  );

  const t = useRef(0);
  const phase = useRef(0); // 0 = courbe, 1 = remontée
  const finished = useRef(false);
  const speed = 0.002;
  useFrame(() => {
    if (!active || finished.current) return;
    /* ---------------- PHASE 1 : CURVE ---------------- */
    if (phase.current === 0) {
      t.current += speed;

      if (t.current >= 1) {
        t.current = 1;
        phase.current = 1; // switch phase
      }

      const point = curve.current.getPoint(t.current);
      const tangent = curve.current.getTangent(t.current);

      camera.position.copy(point);
      camera.lookAt(point.clone().add(tangent));
    } else if (phase.current === 1) {
      const targetPos = new THREE.Vector3(
        -0.0031482368870522606,
        1.6802378199245809,
        1.2681252268760064,
      );
      const targetLook = new THREE.Vector3(0, 0, 0);

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
