import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

// Couleurs selon le niveau de combo (x1 → x5)
const COMBO_COLORS = [
  "#4488ff", // x1 — bleu (idle)
  "#44ff88", // x2 — vert
  "#ffaa00", // x3 — orange
  "#ff4400", // x4 — rouge
  "#ff00ff", // x5 — violet
];

/**
 * Lumières d'ambiance du flipper :
 *  - leftRef / rightRef : clignotement lent déphasé (idle)
 *  - comboRef           : pulse rapide coloré selon le multiplicateur actif
 *
 * Utilise useFrame pour animer les intensités sans re-render React.
 * À placer dans le Canvas, EN DEHORS du groupe rotatif du plateau.
 */
export function PinballLights({ multiplier = 1 }) {
  const leftRef = useRef();
  const rightRef = useRef();
  const comboRef = useRef();

  const comboColor =
    COMBO_COLORS[Math.min(multiplier - 1, COMBO_COLORS.length - 1)];

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;

    // Clignotement idle lent, déphasé gauche/droite
    if (leftRef.current)
      leftRef.current.intensity = 0.35 + Math.sin(t * 1.8) * 0.15;
    if (rightRef.current)
      rightRef.current.intensity = 0.35 + Math.sin(t * 1.8 + Math.PI) * 0.15;

    // Combo : pulse plus rapide selon le multiplicateur, éteint si pas de combo
    if (comboRef.current) {
      if (multiplier > 1) {
        const speed = 2 + multiplier * 1.5;
        comboRef.current.intensity = 1.2 + Math.sin(t * speed) * 0.8;
      } else {
        comboRef.current.intensity = 0;
      }
    }
  });

  return (
    <>
      {/* Ambiance flanc gauche */}
      <pointLight
        ref={leftRef}
        position={[-0.45, 0.25, 0]}
        color="#4488ff"
        distance={1.2}
        decay={2}
      />
      {/* Ambiance flanc droit */}
      <pointLight
        ref={rightRef}
        position={[0.45, 0.25, 0]}
        color="#4488ff"
        distance={1.2}
        decay={2}
      />
      {/* Lumière combo (centre-haut du plateau) */}
      <pointLight
        ref={comboRef}
        position={[0, 0.35, -0.3]}
        color={comboColor}
        distance={1.8}
        decay={2}
      />
    </>
  );
}
