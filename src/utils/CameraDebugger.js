import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

function CameraDebugger() {
  const { camera } = useThree();

  useFrame(() => {
    window.camPos = {
      x: camera.position.x,
      y: camera.position.y,
      z: camera.position.z,
    };

    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);

    window.camLookDir = {
      x: dir.x,
      y: dir.y,
      z: dir.z,
    };

    window.camLookAt = {
      x: camera.position.x + dir.x,
      y: camera.position.y + dir.y,
      z: camera.position.z + dir.z,
    };
  });

  return null;
}

export default CameraDebugger;
