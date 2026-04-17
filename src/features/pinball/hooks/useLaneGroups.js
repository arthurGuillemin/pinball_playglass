import { useState, useCallback } from "react";

/**
 * Groupes de lanes lus depuis le GLB pinball_refonte.glb
 *
 * Groupes détectés :
 *  - lanes_right  : 2 lanes (SENSOR/LED _lane_right_1 et _2)
 *  - lanes_left   : 2 lanes (SENSOR/LED _lane_left_1 et _2)
 *  - lane_rampe   : 1 sensor/led (passage de rampe, groupe solo)
 *  - luncher      : sensor de sortie du lanceur (pas de LED associée)
 *
 * Un groupe est "complété" quand toutes ses LEDs sont allumées.
 * Les LEDs restent allumées une fois activées (pas de reset automatique).
 */
export const LANE_GROUPS = [
  {
    id: "lanes_right",
    bonus: 5000,
    lanes: [
      { sensor: "SENSOR_lane_right_1", led: "LED_lane_right_1" },
      { sensor: "SENSOR_lane_right_2", led: "LED_lane_right_2" },
    ],
  },
  {
    id: "lanes_left",
    bonus: 5000,
    lanes: [
      { sensor: "SENSOR_lane_left_1", led: "LED_lane_left_1" },
      { sensor: "SENSOR_lane_left_2", led: "LED_lane_left_2" },
    ],
  },
  {
    id: "lane_rampe",
    bonus: 3000,
    lanes: [{ sensor: "SENSOR_lane_rampe", led: "LED_lane_rampe" }],
  },
  // SENSOR_luncher n'a pas de LED associée dans le GLB — à brancher séparément si besoin
];

function buildInitialState() {
  return Object.fromEntries(
    LANE_GROUPS.map((g) => [g.id, g.lanes.map(() => false)]),
  );
}

export function useLaneGroups(onBonus) {
  const [groupStates, setGroupStates] = useState(buildInitialState);

  const onSensorHit = useCallback(
    (groupId, laneIndex) => {
      setGroupStates((prev) => {
        const group = LANE_GROUPS.find((g) => g.id === groupId);
        const current = [...prev[groupId]];

        // Déjà allumée ou groupe complété → ignore
        if (current[laneIndex]) return prev;

        current[laneIndex] = true;

        if (current.every(Boolean)) {
          onBonus?.(group.bonus);
        }

        return { ...prev, [groupId]: current };
      });
    },
    [onBonus],
  );

  return { groupStates, onSensorHit };
}
