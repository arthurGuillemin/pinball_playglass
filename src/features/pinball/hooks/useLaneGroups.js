import { useState, useCallback } from "react";

// Groupes du plateau principal uniquement — les cards annexe sont gérées par AnnexZone
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

// State des cards annexe séparé
const ANNEX_CARD_COUNT = 4;
const ANNEX_BONUS_PHASE1 = 500;
const ANNEX_BONUS_PHASE2 = 1500;

function buildInitialState() {
  return Object.fromEntries(
    LANE_GROUPS.map((g) => [g.id, g.lanes.map(() => false)]),
  );
}

export function useLaneGroups(onBonus) {
  const [groupStates, setGroupStates] = useState(buildInitialState);
  const [cardStates, setCardStates] = useState(
    Array(ANNEX_CARD_COUNT).fill(false),
  );
  const [annexPhase, setAnnexPhase] = useState(1);

  const onSensorHit = useCallback(
    (groupId, laneIndex) => {
      setGroupStates((prev) => {
        const group = LANE_GROUPS.find((g) => g.id === groupId);
        const current = [...prev[groupId]];
        if (current[laneIndex]) return prev;
        current[laneIndex] = true;
        if (current.every(Boolean)) onBonus?.(group.bonus);
        return { ...prev, [groupId]: current };
      });
    },
    [onBonus],
  );

  const onCardHit = useCallback(
    (cardIndex) => {
      setCardStates((prev) => {
        if (prev[cardIndex]) return prev;
        const next = [...prev];
        next[cardIndex] = true;
        const allHit = next.every(Boolean);
        if (allHit) {
          const bonus =
            annexPhase === 1 ? ANNEX_BONUS_PHASE1 : ANNEX_BONUS_PHASE2;
          onBonus?.(bonus);
          setTimeout(() => {
            setCardStates(Array(ANNEX_CARD_COUNT).fill(false));
            setAnnexPhase((p) => (p === 1 ? 2 : 1));
          }, 900);
        }
        return next;
      });
    },
    [onBonus, annexPhase],
  );

  const onQuestLost = useCallback(() => {
    setCardStates(Array(ANNEX_CARD_COUNT).fill(false));
    setAnnexPhase(1);
  }, []);

  return {
    groupStates,
    onSensorHit,
    cardStates,
    annexPhase,
    onCardHit,
    onQuestLost,
  };
}
