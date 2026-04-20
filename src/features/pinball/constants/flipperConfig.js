import { Quaternion, Euler } from "three";

export const ANGLE_ACTIVE = (50 * Math.PI) / 180;
export const SLERP = 0.6;

export const ROTATIONS = {
  baseRight: new Quaternion().setFromEuler(new Euler(0, 0, 0)),
  baseLeft: new Quaternion().setFromEuler(new Euler(0, 0, 0)),
  baseRight2: new Quaternion().setFromEuler(new Euler(0, 0, 0)),
  activeRight: new Quaternion().setFromEuler(new Euler(0, -ANGLE_ACTIVE, 0)),
  activeLeft: new Quaternion().setFromEuler(new Euler(0, ANGLE_ACTIVE, 0)),
  activeRight2: new Quaternion().setFromEuler(new Euler(0, -ANGLE_ACTIVE, 0)),
};

export const TILT_X = (7 * Math.PI) / 180;
export const FLIP_Y = Math.PI;

export const FLIPPER_CONFIG = {
  left: {
    nodeName: "COL_flipper_L",
    pivotWorld: [-0.17, -0.075, 0.66],
    meshRotationY: 0,
  },
  right: {
    nodeName: "COL_flipper_R",
    pivotWorld: [0.1, -0.075, 0.66],
    meshRotationY: 0,
  },
  right2: {
    nodeName: "COL_flipper_R_up",
    pivotWorld: [0.33, -0.05, 0.1246],
  },
};

export const FLIPPER_STATIC_NODES = {
  left: ["COL_wall_flipper_L", "COL_CURVE_flipper_down_courbe_L"],
  right: ["COL_wall_flipper_R", "COL_CURVE_flipper_down_courbe_R"],
  right2: [],
};
