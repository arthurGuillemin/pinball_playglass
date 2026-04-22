import { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { RigidBody, MeshCollider, CuboidCollider } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const GLB = "/pinball.glb";

const FLOOR_NODE = "COL_floor_annexe";

const STATIC_NODES = [
  "COL_wall_annexe_1",
  "COL_wall_annexe_2",
  "COL_annexe_top",
  "COL_annexe_bottom",
  "COL_wall_annexe_down_R",
  "COL_wall_annexe_down_L",
];

// Positions calculées en appliquant la rotation GLB sur les vertices locaux
const CARDS = [
  {
    sensor: "SENSOR_card_1",
    led: "LED_lane_card_1",
    pos: [0.14, 0.3908, 1.5972],
    half: [0.05, 0.06, 0.05],
  },
  {
    sensor: "SENSOR_card_2",
    led: "LED_lane_card_2",
    pos: [0.05, 0.3908, 1.6207],
    half: [0.05, 0.06, 0.05],
  },
  {
    sensor: "SENSOR_card_3",
    led: "LED_lane_card_3",
    pos: [-0.05, 0.3908, 1.6207],
    half: [0.05, 0.06, 0.05],
  },
  {
    sensor: "SENSOR_card_4",
    led: "LED_lane_card_4",
    pos: [-0.14, 0.3908, 1.5972],
    half: [0.05, 0.06, 0.05],
  },
];

const CARD_SINK_Y = -0.12;

const COLOR_DIM = new THREE.Color("#3a2000");
const COLOR_ON = new THREE.Color("#ffaa00");
const COLOR_COMPLETED = new THREE.Color("#fff5cc");

function getMeshes(node) {
  if (!node) return [];
  if (node.type === "Mesh") return [node];
  return node.children?.filter((c) => c.type === "Mesh") ?? [];
}

function StaticMesh({ node }) {
  if (!node?.geometry) return null;
  return (
    <RigidBody type="fixed" colliders={false} restitution={0.35} friction={0.4}>
      <MeshCollider type="trimesh">
        <mesh
          geometry={node.geometry}
          material={node.material}
          position={node.position}
          quaternion={node.quaternion}
          scale={node.scale}
          castShadow
          receiveShadow
        />
      </MeshCollider>
    </RigidBody>
  );
}

// LED identique au pattern LaneSensors
function CardLed({ node, isLit, groupDone }) {
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

  const meshes = getMeshes(node);
  if (!meshes.length) return null;

  return (
    <group
      position={node.position}
      quaternion={node.quaternion}
      scale={node.scale}
    >
      <mesh geometry={meshes[0].geometry}>
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
        distance={0.12}
        decay={2}
      />
    </group>
  );
}

// Card animée qui descend quand touchée
function CardTarget({ cardData, index, isLit, groupDone, raised, onCardHit }) {
  const { nodes } = useGLTF(GLB);
  const cardGroupRef = useRef();
  const currentY = useRef(raised ? 0 : CARD_SINK_Y); // initialiser selon l'état
  const targetY = raised ? 0 : CARD_SINK_Y;

  useFrame((_, delta) => {
    if (!cardGroupRef.current) return;
    currentY.current = THREE.MathUtils.lerp(
      currentY.current,
      targetY,
      1 - Math.exp(-10 * delta),
    );
    cardGroupRef.current.position.y = currentY.current;
  });

  const sNode = nodes[cardData.sensor];
  const lNode = nodes[cardData.led];

  return (
    <>
      {/* Card + sensor (descend quand touchée) */}
      <group ref={cardGroupRef}>
        {raised && (
          <RigidBody
            type="fixed"
            sensor
            onIntersectionEnter={() => onCardHit(index)}
          >
            <CuboidCollider args={cardData.half} position={cardData.pos} />
          </RigidBody>
        )}
        {getMeshes(sNode).map((m, j) => (
          <mesh
            key={j}
            geometry={m.geometry}
            material={m.material}
            position={sNode.position}
            quaternion={sNode.quaternion}
            castShadow
          />
        ))}
      </group>

      {/* LED fixe sur le sol */}
      <CardLed node={lNode} isLit={isLit} groupDone={groupDone} />
    </>
  );
}

export function AnnexZone({ cardStates, annexPhase, onCardHit, onQuestLost }) {
  const { nodes } = useGLTF(GLB);

  const safeStates = cardStates ?? [false, false, false, false];
  const groupDone = safeStates.every(Boolean);
  const cardsRaised = safeStates.map((hit) => !hit);

  const floorMeshes = getMeshes(nodes[FLOOR_NODE]);

  return (
    <>
      {/* Sol */}
      <RigidBody
        type="fixed"
        colliders={false}
        restitution={0.3}
        friction={0.6}
      >
        <CuboidCollider
          args={[0.25, 0.025, 0.25]}
          position={[0, 0.3, 1.4628]}
        />
        {floorMeshes.map((m, i) => (
          <mesh
            key={i}
            geometry={m.geometry}
            material={m.material}
            castShadow
            receiveShadow
          />
        ))}
      </RigidBody>

      {/* Murs */}
      {STATIC_NODES.map((name) => (
        <StaticMesh key={name} node={nodes[name]} />
      ))}

      {/* Sensor de sortie */}
      <RigidBody type="fixed" sensor onIntersectionEnter={onQuestLost}>
        <CuboidCollider args={[0.25, 0.06, 0.04]} position={[0, 0.25, 1.21]} />
      </RigidBody>

      {/* Cards */}
      {CARDS.map((cardData, i) => (
        <CardTarget
          key={cardData.sensor}
          cardData={cardData}
          index={i}
          isLit={safeStates[i]}
          groupDone={groupDone}
          raised={cardsRaised[i]}
          onCardHit={onCardHit}
        />
      ))}
    </>
  );
}

useGLTF.preload(GLB);
