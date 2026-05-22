import { useMemo } from "react";
import { LANE_GROUPS } from "../constants/laneGroups";

export { LANE_GROUPS };

// Transforme lightsActivated (array de sensor names) en groupStates
// { lanes_right: [true, false], lane_rampe: [true], ... }
export function useLaneGroups(lightsActivated = []) {
  const groupStates = useMemo(() => {
    const activated = new Set(lightsActivated);
    return Object.fromEntries(
      LANE_GROUPS.map((g) => [
        g.id,
        g.lanes.map(({ sensor }) => activated.has(sensor)),
      ]),
    );
  }, [lightsActivated]);

  return { groupStates };
}
