import { useRef, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { LANE_GROUPS } from "../hooks/useLaneGroups";
import { TILT_X, FLIP_Y } from "../constants/flipperConfig";

const GLB = "/pinball.glb?v=4";

const COLOR_DIM = new THREE.Color("#3a2000");
const COLOR_ON = new THREE.Color("#ffaa00");
const COLOR_COMPLETED = new THREE.Color("#fff5cc");

// Quaternion du groupe parent — appliqué sur positions ET rotations
const GROUP_EULER = new THREE.Euler(TILT_X, FLIP_Y, 0, "XYZ");
const GROUP_QUAT = new THREE.Quaternion().setFromEuler(GROUP_EULER);

// Position GLB (espace Blender) → world-space
function toWorldPos(nodePosition) {
  return nodePosition.clone().applyQuaternion(GROUP_QUAT);
}

// Quaternion GLB → world-space (groupe * local)
function toWorldQuat(nodeQuaternion) {
  return GROUP_QUAT.clone().multiply(nodeQuaternion);
}

// ─── LED visuelle ─────────────────────────────────────────────────────────────
function LedMesh({ node, isLit, groupDone }) {
  const matRef = useRef();
  const lightRef = useRef();

  useFrame(() => {
    if (!matRef.current || !lightRef.current) return;
    if (groupDone) {
      const pulse = 1.5 + Math.sin(Date.now() * 0.005) * 0.3;
      matRef.current.emissive.set(COLOR_COMPLETED);
      matRef.current.emissiveIntensity = pulse;
      lightRef.current.intensity = 0.08;
      lightRef.current.color.set(COLOR_COMPLETED);
    } else if (isLit) {
      matRef.current.emissive.set(COLOR_ON);
      matRef.current.emissiveIntensity = 1.8;
      lightRef.current.intensity = 0.06;
      lightRef.current.color.set(COLOR_ON);
    } else {
      matRef.current.emissive.set(COLOR_DIM);
      matRef.current.emissiveIntensity = 0.4;
      lightRef.current.intensity = 0;
    }
  });

  if (!node?.geometry) return null;

  // Applique la transformation du groupe sur position + quaternion
  const worldPos = toWorldPos(node.position.clone());
  const worldQuat = toWorldQuat(node.quaternion.clone());

  return (
    <group position={worldPos} quaternion={worldQuat} scale={node.scale}>
      <mesh geometry={node.geometry}>
        <meshStandardMaterial
          ref={matRef}
          color="#1a0d00"
          emissive={COLOR_DIM}
          emissiveIntensity={0.4}
          roughness={0.3}
          metalness={0.1}
          toneMapped={false}
        />
      </mesh>
      <pointLight
        ref={lightRef}
        intensity={0}
        color={COLOR_ON}
        distance={0.08}
        decay={2}
      />
    </group>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────
export function LaneSensors({ groupStates, onSensorHit, onBoostHit }) {
  const { nodes } = useGLTF(GLB);

  useEffect(() => {
    if (import.meta.env.VITE_ENV !== "dev") return;
    console.group("[LaneSensors] positions world-space");
    LANE_GROUPS.forEach((group) => {
      group.lanes.forEach(({ sensor }) => {
        const n = nodes[sensor];
        if (!n) {
          console.warn(`❌ ${sensor} introuvable`);
          return;
        }
        const wp = toWorldPos(n.position.clone());
        console.log(
          `${sensor} → [${wp.x.toFixed(3)}, ${wp.y.toFixed(3)}, ${wp.z.toFixed(3)}]`,
        );
      });
    });
    console.groupEnd();
  }, [nodes]);

  return (
    <>
      {LANE_GROUPS.map((group) => {
        const leds = groupStates[group.id] ?? [];
        const groupDone = leds.length > 0 && leds.every(Boolean);

        return group.lanes.map(({ sensor, led }, laneIndex) => {
          const sNode = nodes[sensor];
          const ledNode = nodes[led];
          const isLit = leds[laneIndex] ?? false;

          const worldPos = sNode
            ? toWorldPos(sNode.position.clone())
            : new THREE.Vector3();
          const half = (sNode?.scale?.x ?? 0.0124) * 1.5;

          return (
            <group key={sensor}>
              {sNode && (
                <RigidBody
                  type="fixed"
                  sensor={true}
                  onIntersectionEnter={() => {
                    console.log(`[HIT] ${sensor} → ${group.id}[${laneIndex}]`);
                    onSensorHit(group.id, laneIndex);
                  }}
                >
                  <CuboidCollider
                    args={[half, half, half]}
                    position={[worldPos.x, worldPos.y, worldPos.z]}
                  />
                </RigidBody>
              )}
              <LedMesh node={ledNode} isLit={isLit} groupDone={groupDone} />
            </group>
          );
        });
      })}

      {Object.keys(nodes)
        .filter((name) => name.startsWith("SENSOR_boost"))
        .map((name) => {
          const n = nodes[name];
          if (!n) return null;
          const worldPos = toWorldPos(n.position.clone());
          const half = (n.scale?.x ?? 0.0124) * 1.5;
          return (
            <RigidBody
              key={name}
              type="fixed"
              sensor={true}
              onIntersectionEnter={() => {
                console.log("[BOOST] déclenché");
                onBoostHit();
              }}
            >
              <CuboidCollider
                args={[half, half, half]}
                position={[worldPos.x, worldPos.y, worldPos.z]}
              />
            </RigidBody>
          );
        })}
    </>
  );
}

useGLTF.preload(GLB);
