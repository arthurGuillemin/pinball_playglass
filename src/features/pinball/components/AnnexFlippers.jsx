import { forwardRef, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { RigidBody, MeshCollider } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { Quaternion, Euler } from "three";
import { TILT_X, FLIP_Y, SLERP } from "../constants/flipperConfig";

const ANGLE_REST = (0 * Math.PI) / 180;
const ANGLE_ACTIVE = (50 * Math.PI) / 180;

const PIVOT_R = [0.09838, 0.5, -1.2];
const PIVOT_L = [-0.10013, 0.5, -1.2];

const ROT = {
  restR: new Quaternion().setFromEuler(new Euler(0, ANGLE_REST, 0)),
  restL: new Quaternion().setFromEuler(new Euler(0, -ANGLE_REST, 0)),
  activeR: new Quaternion().setFromEuler(
    new Euler(0, ANGLE_REST - ANGLE_ACTIVE, 0),
  ),
  activeL: new Quaternion().setFromEuler(
    new Euler(0, -ANGLE_REST + ANGLE_ACTIVE, 0),
  ),
};

// ─── Flipper individuel ───────────────────────────────────────────────────────

const AnnexFlipper = forwardRef(function AnnexFlipper(
  { nodeName, pivot },
  ref,
) {
  const { nodes } = useGLTF("/pinball.glb");
  const node = nodes[nodeName];

  if (!node) {
    console.warn(`[AnnexFlipper] Node manquant : "${nodeName}"`);
    return null;
  }

  return (
    <RigidBody
      ref={ref}
      type="kinematicPosition"
      colliders={false}
      position={pivot}
    >
      <MeshCollider type="hull" restitution={2} friction={0.1}>
        <mesh
          geometry={node.geometry}
          material={node.material}
          rotation={[TILT_X, FLIP_Y, 0]}
          castShadow
        />
      </MeshCollider>
    </RigidBody>
  );
});

// ─── Animateur ────────────────────────────────────────────────────────────────

function AnnexFlipperAnimator({ rightRef, leftRef, activeFlippers }) {
  const curR = useRef(ROT.restR.clone());
  const curL = useRef(ROT.restL.clone());

  useFrame(() => {
    const tR = activeFlippers.right ? ROT.activeR : ROT.restR;
    const tL = activeFlippers.left ? ROT.activeL : ROT.restL;

    curR.current.slerp(tR, SLERP);
    curL.current.slerp(tL, SLERP);

    rightRef.current?.setNextKinematicRotation(curR.current);
    leftRef.current?.setNextKinematicRotation(curL.current);
  });

  return null;
}

// ─── Composant public ─────────────────────────────────────────────────────────

export function AnnexFlippers({ activeFlippers }) {
  const rightRef = useRef();
  const leftRef = useRef();

  return (
    <>
      <AnnexFlipper
        ref={rightRef}
        nodeName="COL_flipper_R_annexe"
        pivot={PIVOT_R}
      />
      <AnnexFlipper
        ref={leftRef}
        nodeName="COL_flipper_L_annexe"
        pivot={PIVOT_L}
      />
      <AnnexFlipperAnimator
        rightRef={rightRef}
        leftRef={leftRef}
        activeFlippers={activeFlippers}
      />
    </>
  );
}

useGLTF.preload("/pinball.glb");
