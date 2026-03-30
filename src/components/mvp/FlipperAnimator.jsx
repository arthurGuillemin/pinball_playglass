import { useFrame } from "@react-three/fiber";

export default function FlipperAnimator({
  flippers,
  activeFlippers,
  rotations,
}) {
  useFrame(() => {
    ["right", "left"].forEach((side) => {
      const flipper = flippers[side];
      if (flipper.ref.current) {
        const targetQuat = activeFlippers[side]
          ? rotations[`active${side.charAt(0).toUpperCase() + side.slice(1)}`]
          : rotations[`base${side.charAt(0).toUpperCase() + side.slice(1)}`];
        flipper.rotation.current.slerp(targetQuat, 0.3);
        flipper.ref.current.setNextKinematicRotation(flipper.rotation.current);
      }
    });
  });
  return null;
}
