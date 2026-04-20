import { useState, useCallback } from "react";

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
  {
    id: "lane_cave",
    bonus: 3000,
    lanes: [{ sensor: "SENSOR_lane_cave", led: "LED_lane_cave" }],
  },
  {
    id: "lane_up_right",
    bonus: 3000,
    lanes: [{ sensor: "SENSOR_lane_up_right", led: "LED_lane_up_right" }],
  },
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
