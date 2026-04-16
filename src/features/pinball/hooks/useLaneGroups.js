import { useState, useCallback } from "react";

/**
 * Définition des groupes de lanes.
 * Chaque groupe a :
 *  - id        : identifiant unique
 *  - bonus     : points accordés quand toutes les LEDs sont allumées
 *  - lanes     : liste des lanes du groupe, chacune avec son sensor et sa LED GLB
 *
 * Convention de nommage Blender :
 *   SENSOR_<groupe>_<index>
 *   LED_<groupe>_<index>
 *
 * Pour ajouter un groupe :
 *   1. Crée les nodes dans Blender avec le bon préfixe
 *   2. Ajoute une entrée ici
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
  // Décommente quand tu as créé les nodes dans Blender :
  // {
  //   id: "lanes_left",
  //   bonus: 5000,
  //   lanes: [
  //     { sensor: "SENSOR_lane_left_1", led: "LED_lane_left_1" },
  //     { sensor: "SENSOR_lane_left_2", led: "LED_lane_left_2" },
  //   ],
  // },
  // {
  //   id: "bumpers_group",
  //   bonus: 10000,
  //   lanes: [
  //     { sensor: "SENSOR_bumper_1", led: "LED_bumper_1" },
  //     { sensor: "SENSOR_bumper_2", led: "LED_bumper_2" },
  //     { sensor: "SENSOR_bumper_3", led: "LED_bumper_3" },
  //   ],
  // },
];

/**
 * État initial : toutes les LEDs éteintes pour chaque groupe.
 * Structure : { lanes_right: [false, false], bumpers_group: [false, false, false], ... }
 */
function buildInitialState() {
  return Object.fromEntries(
    LANE_GROUPS.map((g) => [g.id, g.lanes.map(() => false)]),
  );
}

/**
 * useLaneGroups
 *
 * Gère l'état allumé/éteint de chaque LED par groupe.
 * - Une LED s'allume quand la balle passe sur son sensor → elle reste allumée.
 * - Quand toutes les LEDs d'un groupe sont allumées → bonus de points + les LEDs
 *   restent allumées (le groupe est "complété").
 * - Un groupe complété ne peut plus être re-déclenché (les LEDs sont "locked").
 */
export function useLaneGroups(onBonus) {
  const [groupStates, setGroupStates] = useState(buildInitialState);

  /**
   * Appelé par LaneSensors quand la balle passe sur un sensor.
   * @param {string} groupId  - ex: "lanes_right"
   * @param {number} laneIndex - index dans le tableau lanes du groupe
   */
  const onSensorHit = useCallback(
    (groupId, laneIndex) => {
      setGroupStates((prev) => {
        const group = LANE_GROUPS.find((g) => g.id === groupId);
        const current = [...prev[groupId]];

        // Déjà complété → ignore
        if (current.every(Boolean)) return prev;

        // Allume la LED
        current[laneIndex] = true;

        // Vérifie si le groupe est maintenant complet
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
