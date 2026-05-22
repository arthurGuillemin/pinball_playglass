import { useFrame, useThree } from "@react-three/fiber";

function CameraDebugger() {
  const { camera } = useThree();

  useFrame(() => {
    window.camPos = camera.position.clone();
  });

  return null;
}

export default CameraDebugger;
