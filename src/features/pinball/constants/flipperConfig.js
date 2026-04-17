import { Quaternion, Euler } from "three";

export const ANGLE_ACTIVE = (50 * Math.PI) / 180;
export const SLERP = 0.3;

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
  left: { nodeName: "COL_flipper_L", pivotWorld: [-0.18, -0.075, 0.66] },
  right: { nodeName: "COL_flipper_R", pivotWorld: [0.116, -0.075, 0.662] },
  right2: {
    nodeName: "COL_flipper_R001",
    pivotWorld: [0.33, -0.02, 0.0033942],
  },
};

export const FLIPPER_STATIC_NODES = {
  left: ["COL_wall_flipper_L", "COL_CURVE_flipper_down_courbe_L"],
  right: [
    "COL_wall_flipper_R",
    "COL_CURVE_flipper_down_courbe_R",
    "COL_flipper_UP_R",
  ],
  right2: [
    "COL_wall_flipper_R",
    "COL_CURVE_flipper_down_courbe_R.001",
    "COL_flipper_UP_R.001",
  ],
};
