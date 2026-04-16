import { useRef, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { LANE_GROUPS } from "../hooks/useLaneGroups";

const COLOR_OFF = new THREE.Color("#220044");
const COLOR_ON = new THREE.Color("#cc44ff");
const COLOR_COMPLETED = new THREE.Color("#ffffff");

function LedMesh({ ledNode, isLit, groupDone }) {
  const matRef = useRef();

  useFrame(() => {
    if (!matRef.current) return;
    if (groupDone) {
      matRef.current.emissive.set(COLOR_COMPLETED);
      matRef.current.emissiveIntensity = 3 + Math.sin(Date.now() * 0.003);
    } else if (isLit) {
      matRef.current.emissive.set(COLOR_ON);
      matRef.current.emissiveIntensity = 6;
    } else {
      matRef.current.emissive.set(COLOR_ON);
      matRef.current.emissiveIntensity = 0.15;
    }
  });

  if (!ledNode) return null;

  const childMesh = ledNode.children?.[0];
  if (!childMesh?.geometry) return null;

  return (
    <group
      position={ledNode.position}
      quaternion={ledNode.quaternion}
      scale={ledNode.scale}
    >
      <mesh
        geometry={childMesh.geometry}
        position={childMesh.position}
        quaternion={childMesh.quaternion}
        scale={childMesh.scale}
      >
        <meshStandardMaterial
          ref={matRef}
          color={COLOR_OFF}
          emissive={COLOR_ON}
          emissiveIntensity={0.15}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

export function LaneSensors({ groupStates, onSensorHit }) {
  const { nodes, scene } = useGLTF("/pinball.glb");

  // Diagnostic au montage — useEffect évite l'accès au ref pendant le render
  useEffect(() => {
    console.group("[LaneSensors] Diagnostic au montage");
    LANE_GROUPS.forEach((group) => {
      console.log(`Groupe: ${group.id}`);
      group.lanes.forEach(({ sensor, led }, i) => {
        const sNode = nodes[sensor];
        const ledNode = scene.getObjectByName(led);
        console.log(
          `  Lane ${i} | SENSOR: ${sensor}`,
          sNode ? "✅" : "❌ ABSENT",
        );
        console.log(
          `  Lane ${i} | LED:    ${led}`,
          ledNode ? "✅" : "❌ ABSENT",
        );
        if (ledNode) {
          console.log(
            `    children:`,
            ledNode.children?.map((c) => `${c.name} (geo:${!!c.geometry})`),
          );
        }
      });
    });
    console.log("groupStates reçu:", groupStates);
    console.groupEnd();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {LANE_GROUPS.map((group) => {
        const leds = groupStates[group.id] ?? [];
        const groupDone = leds.length > 0 && leds.every(Boolean);

        return group.lanes.map(({ sensor, led }, laneIndex) => {
          const sNode = nodes[sensor];
          const ledNode = scene.getObjectByName(led);
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
                    console.log(
                      `[SENSOR HIT] ${sensor} → group:${group.id} lane:${laneIndex} | avant:`,
                      groupStates[group.id],
                    );
                    onSensorHit(group.id, laneIndex);
                  }}
                >
                  <CuboidCollider
                    args={[s.x, s.y, s.z]}
                    position={[p.x, p.y, p.z]}
                  />
                </RigidBody>
              )}

              <LedMesh ledNode={ledNode} isLit={isLit} groupDone={groupDone} />
            </group>
          );
        });
      })}
    </>
  );
}
