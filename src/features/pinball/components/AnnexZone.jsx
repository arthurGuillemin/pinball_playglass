import { useGLTF } from "@react-three/drei";
import { RigidBody, MeshCollider, CuboidCollider } from "@react-three/rapier";
import * as THREE from "three";
import { FLIP_Y } from "../constants/flipperConfig";

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

const CARDS = [
  {
    sensor: "SENSOR_card_1",
    led: "LED_lane_card_1",
    worldPos: [0.14, 0.302, -1.617],
    half: [0.025, 0.04, 0.017],
  },
  {
    sensor: "SENSOR_card_2",
    led: "LED_lane_card_2",
    worldPos: [0.05, 0.302, -1.64],
    half: [0.026, 0.04, 0.007],
  },
  {
    sensor: "SENSOR_card_3",
    led: "LED_lane_card_3",
    worldPos: [-0.05, 0.302, -1.64],
    half: [0.026, 0.04, 0.007],
  },
  {
    sensor: "SENSOR_card_4",
    led: "LED_lane_card_4",
    worldPos: [-0.14, 0.302, -1.617],
    half: [0.025, 0.04, 0.017],
  },
];

const MAT_OFF = new THREE.MeshStandardMaterial({
  color: "#1a1400",
  emissive: "#000000",
  emissiveIntensity: 0,
  roughness: 0.9,
});
const MAT_P1 = new THREE.MeshStandardMaterial({
  color: "#ffcc00",
  emissive: "#ffaa00",
  emissiveIntensity: 2.5,
  roughness: 0.3,
  toneMapped: false,
});
const MAT_P2 = new THREE.MeshStandardMaterial({
  color: "#ff6600",
  emissive: "#ff3300",
  emissiveIntensity: 3.5,
  roughness: 0.2,
  toneMapped: false,
});

// Identique à StaticMesh dans PinballTable — pas de rotation supplémentaire
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

export function AnnexZone({
  cardHits,
  cardsRaised,
  phase,
  onCardHit,
  onQuestLost,
}) {
  const { nodes } = useGLTF(GLB);

  const floorNode = nodes[FLOOR_NODE];
  const floorMeshes =
    floorNode?.type === "Mesh"
      ? [floorNode]
      : (floorNode?.children?.filter((c) => c.type === "Mesh") ?? []);

  return (
    <>
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

      {STATIC_NODES.map((name) => (
        <StaticMesh key={name} node={nodes[name]} />
      ))}

      <RigidBody type="fixed" sensor onIntersectionEnter={onQuestLost}>
        <CuboidCollider args={[0.25, 0.06, 0.04]} position={[0, 0.25, 1.21]} />
      </RigidBody>

      {CARDS.map((cardData, i) => {
        const sNode = nodes[cardData.sensor];
        const lNode = nodes[cardData.led];
        const ledMat = !cardHits[i] ? MAT_OFF : phase === 2 ? MAT_P2 : MAT_P1;
        const sMeshes =
          sNode?.type === "Mesh"
            ? [sNode]
            : (sNode?.children?.filter((c) => c.type === "Mesh") ?? []);
        const lMeshes =
          lNode?.type === "Mesh"
            ? [lNode]
            : (lNode?.children?.filter((c) => c.type === "Mesh") ?? []);
        return (
          <group key={cardData.sensor}>
            {cardsRaised[i] && (
              <RigidBody
                type="fixed"
                sensor
                onIntersectionEnter={() => onCardHit(i)}
              >
                <CuboidCollider
                  args={cardData.half}
                  position={cardData.worldPos}
                />
              </RigidBody>
            )}
            {sMeshes.map((m, j) => (
              <mesh
                key={j}
                geometry={m.geometry}
                material={m.material}
                position={sNode.position}
                quaternion={sNode.quaternion}
                castShadow
              />
            ))}
            {lMeshes.map((m, j) => (
              <mesh
                key={j}
                geometry={m.geometry}
                material={j === 0 ? ledMat : m.material}
                position={lNode.position}
                quaternion={lNode.quaternion}
                scale={lNode.scale}
              >
                {j === 0 && cardHits[i] && (
                  <pointLight
                    color={phase === 2 ? "#ff3300" : "#ffaa00"}
                    intensity={0.5}
                    distance={0.18}
                    decay={2}
                  />
                )}
              </mesh>
            ))}
          </group>
        );
      })}
    </>
  );
}

useGLTF.preload(GLB);
