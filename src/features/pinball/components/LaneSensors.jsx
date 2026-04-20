import { useRef, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { LANE_GROUPS } from "../hooks/useLaneGroups";

const GLB = "/pinball.glb?v=4";

const COLOR_DIM = new THREE.Color("#3a2000");
const COLOR_ON = new THREE.Color("#ffaa00");
const COLOR_COMPLETED = new THREE.Color("#fff5cc");

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

  return (
    <group
      position={node.position}
      quaternion={node.quaternion}
      scale={node.scale}
    >
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

// ─── Sensor boost (invisible, pas de LED) ────────────────────────────────────
function BoostSensor({ node, onBoostHit }) {
  if (!node) return null;

  const p = node.position ?? new THREE.Vector3();
  const s = node.scale ?? new THREE.Vector3(0.012, 0.012, 0.012);

  return (
    <RigidBody
      type="fixed"
      sensor={true}
      onIntersectionEnter={() => {
        console.log("[BOOST] SENSOR_boost déclenché");
        onBoostHit();
      }}
    >
      <CuboidCollider args={[s.x, s.y, s.z]} position={[p.x, p.y, p.z]} />
    </RigidBody>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────
export function LaneSensors({ groupStates, onSensorHit, onBoostHit }) {
  const { nodes } = useGLTF(GLB);

  useEffect(() => {
    console.group("[LaneSensors] Diagnostic");
    LANE_GROUPS.forEach((group) => {
      console.log(`▸ Groupe "${group.id}"`);
      group.lanes.forEach(({ sensor, led }, i) => {
        const sNode = nodes[sensor];
        const ledNode = nodes[led];
        console.log(`  [${i}] SENSOR: ${sensor}`, sNode ? "✅" : "❌");
        console.log(
          `  [${i}] LED:    ${led}`,
          ledNode?.geometry ? "✅" : "❌ pas de geometry",
        );
      });
    });
    const boostNodes = Object.keys(nodes).filter((n) =>
      n.startsWith("SENSOR_boost"),
    );
    console.log(`▸ SENSOR_boost* (${boostNodes.length})`, boostNodes);
    console.groupEnd();
  }, []);

  return (
    <>
      {/* Lanes + LEDs */}
      {LANE_GROUPS.map((group) => {
        const leds = groupStates[group.id] ?? [];
        const groupDone = leds.length > 0 && leds.every(Boolean);

        return group.lanes.map(({ sensor, led }, laneIndex) => {
          const sNode = nodes[sensor];
          const ledNode = nodes[led];
          const isLit = leds[laneIndex] ?? false;

          const p = sNode?.position ?? new THREE.Vector3();
          const s = sNode?.scale ?? new THREE.Vector3(0.012, 0.012, 0.012);

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
                    args={[s.x, s.y, s.z]}
                    position={[p.x, p.y, p.z]}
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
        .map((name) => (
          <BoostSensor key={name} node={nodes[name]} onBoostHit={onBoostHit} />
        ))}
    </>
  );
}

useGLTF.preload(GLB);
