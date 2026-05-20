import { useState, useCallback } from "react";
import { LANE_GROUPS } from "../constants/laneGroups";

export { LANE_GROUPS };

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
