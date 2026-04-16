import { useFrame } from "@react-three/fiber";
import { ROTATIONS, SLERP } from "../constants/flipperConfig";

export function FlipperAnimator({
  rightRef,
  leftRef,
  right2Ref,
  rightRot,
  leftRot,
  right2Rot,
  activeFlippers,
}) {
  useFrame(() => {
    if (rightRef.current) {
      rightRot.current.slerp(
        activeFlippers.right ? ROTATIONS.activeRight : ROTATIONS.baseRight,
        SLERP,
      );
      rightRef.current.setNextKinematicRotation(rightRot.current);
    }
    if (leftRef.current) {
      leftRot.current.slerp(
        activeFlippers.left ? ROTATIONS.activeLeft : ROTATIONS.baseLeft,
        SLERP,
      );
      leftRef.current.setNextKinematicRotation(leftRot.current);
    }
    if (right2Ref.current) {
      right2Rot.current.slerp(
        activeFlippers.right2 ? ROTATIONS.activeRight2 : ROTATIONS.baseRight2,
        SLERP,
      );
      right2Ref.current.setNextKinematicRotation(right2Rot.current);
    }
  });
  return null;
}
