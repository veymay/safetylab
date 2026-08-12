"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";

const ROOM_HALF_WIDTH = 15;
const ROOM_BACK_Z = -10;
const ROOM_FRONT_Z = 7;
const ROOM_DEPTH = ROOM_FRONT_Z - ROOM_BACK_Z;
const ROOM_CENTER_Z = (ROOM_FRONT_Z + ROOM_BACK_Z) / 2;
const WALL_HEIGHT = 4.2;

export function Floor({ color, onFloorClick }) {
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, ROOM_CENTER_Z]}
      onClick={onFloorClick}
      receiveShadow
    >
      <planeGeometry args={[ROOM_HALF_WIDTH * 2, ROOM_DEPTH]} />
      <meshStandardMaterial color={color} roughness={0.9} metalness={0.05} />
    </mesh>
  );
}

function ZoneRing({ position, radius, color }) {
  return (
    <mesh position={[position[0], 0.02, position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius - 0.08, radius, 64]} />
      <meshBasicMaterial color={color} transparent opacity={0.85} />
    </mesh>
  );
}

function WallPoster({ position, rotationY = 0, title, body, accent }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh>
        <boxGeometry args={[1.7, 1.15, 0.04]} />
        <meshStandardMaterial color="#f4f1ea" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.42, 0.021]}>
        <boxGeometry args={[1.7, 0.26, 0.01]} />
        <meshStandardMaterial color={accent} />
      </mesh>
      <Text
        position={[0, 0.42, 0.03]}
        fontSize={0.09}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.5}
        textAlign="center"
      >
        {title}
      </Text>
      <Text
        position={[0, -0.05, 0.03]}
        fontSize={0.068}
        color="#1f2937"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.45}
        textAlign="center"
        lineHeight={1.5}
      >
        {body}
      </Text>
    </group>
  );
}

function Shell({ wallColor }) {
  return (
    <group>
      {/* orqa devor */}
      <mesh position={[0, WALL_HEIGHT / 2, ROOM_BACK_Z]}>
        <boxGeometry args={[ROOM_HALF_WIDTH * 2, WALL_HEIGHT, 0.2]} />
        <meshStandardMaterial color={wallColor} roughness={0.8} />
      </mesh>
      {/* old devor (kirish tomoni ham yopiq) */}
      <mesh position={[0, WALL_HEIGHT / 2, ROOM_FRONT_Z]}>
        <boxGeometry args={[ROOM_HALF_WIDTH * 2, WALL_HEIGHT, 0.2]} />
        <meshStandardMaterial color={wallColor} roughness={0.8} />
      </mesh>
      {/* chap devor */}
      <mesh position={[-ROOM_HALF_WIDTH, WALL_HEIGHT / 2, ROOM_CENTER_Z]}>
        <boxGeometry args={[0.2, WALL_HEIGHT, ROOM_DEPTH]} />
        <meshStandardMaterial color={wallColor} roughness={0.8} />
      </mesh>
      {/* o'ng devor */}
      <mesh position={[ROOM_HALF_WIDTH, WALL_HEIGHT / 2, ROOM_CENTER_Z]}>
        <boxGeometry args={[0.2, WALL_HEIGHT, ROOM_DEPTH]} />
        <meshStandardMaterial color={wallColor} roughness={0.8} />
      </mesh>
      {/* shift */}
      <mesh position={[0, WALL_HEIGHT, ROOM_CENTER_Z]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[ROOM_HALF_WIDTH * 2, ROOM_DEPTH]} />
        <meshStandardMaterial color="#2b3138" roughness={1} side={2} />
      </mesh>
      {/* shift chiroqlari */}
      {[-10, -5, 0, 5, 10].map((x) => (
        <mesh key={x} position={[x, WALL_HEIGHT - 0.05, ROOM_CENTER_Z]}>
          <boxGeometry args={[2.2, 0.08, 0.3]} />
          <meshStandardMaterial color="#fefce8" emissive="#fefce8" emissiveIntensity={1.4} />
        </mesh>
      ))}
      {/* devor-pol plintusi */}
      <mesh position={[0, 0.1, ROOM_BACK_Z + 0.09]}>
        <boxGeometry args={[ROOM_HALF_WIDTH * 2, 0.2, 0.05]} />
        <meshStandardMaterial color="#171a1c" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.1, ROOM_FRONT_Z - 0.09]}>
        <boxGeometry args={[ROOM_HALF_WIDTH * 2, 0.2, 0.05]} />
        <meshStandardMaterial color="#171a1c" roughness={0.9} />
      </mesh>
      <mesh position={[-ROOM_HALF_WIDTH + 0.09, 0.1, ROOM_CENTER_Z]}>
        <boxGeometry args={[0.05, 0.2, ROOM_DEPTH]} />
        <meshStandardMaterial color="#171a1c" roughness={0.9} />
      </mesh>
      <mesh position={[ROOM_HALF_WIDTH - 0.09, 0.1, ROOM_CENTER_Z]}>
        <boxGeometry args={[0.05, 0.2, ROOM_DEPTH]} />
        <meshStandardMaterial color="#171a1c" roughness={0.9} />
      </mesh>

      {/* Xavfsizlik posterlari */}
      <WallPoster
        position={[-9.5, 2.1, ROOM_BACK_Z + 0.13]}
        title="MEXANIK XAVFSIZLIK"
        accent="#eab308"
        body={"Ishlayotgan uskunaga\nqo'l tekkizmang.\nErkin kiyim kiymang."}
      />
      <WallPoster
        position={[0, 2.1, ROOM_BACK_Z + 0.13]}
        title="ELEKTR XAVFSIZLIGI"
        accent="#2563eb"
        body={"Shchitga yaqinlashmang.\nShikastlangan kabelga\nqo'l tekkizmang."}
      />
      <WallPoster
        position={[9.5, 2.1, ROOM_BACK_Z + 0.13]}
        title="YONG'IN XAVFSIZLIGI"
        accent="#dc2626"
        body={"Ochiq olov taqiqlanadi.\nChiqish yo'lini\nbekitmang."}
      />
      <WallPoster
        position={[-ROOM_HALF_WIDTH + 0.13, 2.1, -5]}
        rotationY={Math.PI / 2}
        title="SHAXSIY HIMOYA"
        accent="#16a34a"
        body={"Kaska va maxsus\npoyabzalsiz sexga\nkirish taqiqlanadi."}
      />
      <WallPoster
        position={[ROOM_HALF_WIDTH - 0.13, 2.1, 2]}
        rotationY={-Math.PI / 2}
        title="FAVQULODDA HOLAT"
        accent="#f97316"
        body={"Signal bering.\nYig'ilish nuqtasiga\ntinch harakatlaning."}
      />
    </group>
  );
}

function SafetyStripes({ position, length, rotationY = 0 }) {
  const stripes = 6;
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {Array.from({ length: stripes }).map((_, i) => (
        <mesh key={i} position={[i * (length / stripes) - length / 2, 0.011, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[length / stripes / 2, 0.5]} />
          <meshBasicMaterial color={i % 2 === 0 ? "#f2b705" : "#111315"} />
        </mesh>
      ))}
    </group>
  );
}

/* ---------------- Mexanik uskunalar sexi ---------------- */

function PressMachine({ position }) {
  const boltPositions = [
    [-0.85, 0.3, 0.75],
    [0.85, 0.3, 0.75],
    [-0.85, 1.5, 0.75],
    [0.85, 1.5, 0.75],
  ];
  return (
    <group position={position}>
      <mesh position={[0, 0.9, 0]} castShadow>
        <boxGeometry args={[1.6, 1.8, 1.4]} />
        <meshStandardMaterial color="#3a4148" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.95, 0]} castShadow>
        <boxGeometry args={[1.9, 0.3, 1.7]} />
        <meshStandardMaterial color="#f2b705" metalness={0.3} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.15, 0.85]}>
        <boxGeometry args={[1.9, 0.3, 0.15]} />
        <meshStandardMaterial color="#111315" />
      </mesh>
      {boltPositions.map((p, i) => (
        <mesh key={i} position={p} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.06, 8]} />
          <meshStandardMaterial color="#9ca3af" metalness={0.8} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

function LockoutStation({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 1, 0]} castShadow>
        <boxGeometry args={[0.05, 2, 0.05]} />
        <meshStandardMaterial color="#4b5563" metalness={0.6} />
      </mesh>
      <mesh position={[0, 1.5, 0.03]} castShadow>
        <boxGeometry args={[0.6, 0.45, 0.05]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.6} />
      </mesh>
      {[-0.15, 0.05, 0.2].map((x, i) => (
        <group key={i} position={[x, 1.32, 0.07]}>
          <mesh>
            <boxGeometry args={[0.08, 0.1, 0.04]} />
            <meshStandardMaterial color="#dc2626" metalness={0.4} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.035, 0.012, 8, 16, Math.PI]} />
            <meshStandardMaterial color="#9ca3af" metalness={0.8} roughness={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function ConveyorBelt({ position }) {
  const beltRef = useRef(null);
  useFrame(({ clock }) => {
    if (beltRef.current) {
      beltRef.current.material.emissiveIntensity = 0.3 + Math.sin(clock.getElapsedTime() * 3) * 0.15;
    }
  });
  return (
    <group position={position}>
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[3.2, 0.5, 1]} />
        <meshStandardMaterial color="#23272b" roughness={0.7} />
      </mesh>
      <mesh ref={beltRef} position={[0, 0.68, 0]}>
        <boxGeometry args={[2.9, 0.05, 0.9]} />
        <meshStandardMaterial color="#f2b705" emissive="#f2b705" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[-1.5, 0.35, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.25, 1, 16]} />
        <meshStandardMaterial color="#111315" metalness={0.5} />
      </mesh>
      <mesh position={[1.5, 0.35, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.25, 1, 16]} />
        <meshStandardMaterial color="#111315" metalness={0.5} />
      </mesh>
      <SafetyStripes position={[0, 0, 0.65]} length={3.2} />
    </group>
  );
}

function CompressorUnit({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.6, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 1.2, 20]} />
        <meshStandardMaterial color="#5b636b" metalness={0.5} roughness={0.4} />
      </mesh>
      {[0.2, 0.5, 0.8].map((y) => (
        <mesh key={y} position={[0.42, y, 0]}>
          <boxGeometry args={[0.08, 0.12, 0.5]} />
          <meshStandardMaterial color="#1a1d20" />
        </mesh>
      ))}
    </group>
  );
}

function PPERack({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 1, 0]} castShadow>
        <boxGeometry args={[0.06, 2, 0.06]} />
        <meshStandardMaterial color="#4b5563" metalness={0.6} />
      </mesh>
      <mesh position={[0, 1.7, 0]} castShadow>
        <sphereGeometry args={[0.22, 16, 16, 0, Math.PI * 2, 0, Math.PI / 1.8]} />
        <meshStandardMaterial color="#f2b705" roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.05, 0.05]} castShadow>
        <boxGeometry args={[0.45, 0.55, 0.12]} />
        <meshStandardMaterial color="#eab308" roughness={0.6} />
      </mesh>
    </group>
  );
}

/* ---------------- Elektr xavfsizligi ---------------- */

function ElectricalPanel({ position }) {
  const lightRef = useRef(null);
  useFrame(({ clock }) => {
    if (lightRef.current) {
      const t = clock.getElapsedTime();
      lightRef.current.intensity = 0.6 + Math.max(0, Math.sin(t * 9)) * 1.4;
    }
  });
  return (
    <group position={position}>
      <mesh position={[0, 1.1, 0]} castShadow>
        <boxGeometry args={[1.8, 2.2, 0.4]} />
        <meshStandardMaterial color="#2b3138" metalness={0.4} roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.1, 0.21]}>
        <boxGeometry args={[1.5, 1.8, 0.02]} />
        <meshStandardMaterial color="#101316" />
      </mesh>
      {[0.5, 0.9, 1.3, 1.7].map((y) => (
        <mesh key={y} position={[0, y, 0.23]}>
          <boxGeometry args={[1.2, 0.12, 0.02]} />
          <meshStandardMaterial color="#f2b705" emissive="#f2b705" emissiveIntensity={0.5} />
        </mesh>
      ))}
      <pointLight ref={lightRef} position={[0, 1.1, 0.6]} color="#ff5a3c" distance={2} intensity={0.8} />
      <SafetyStripes position={[0, 0, 1.1]} length={2.4} />
    </group>
  );
}

function DamagedCable({ position, resolved }) {
  return (
    <group position={position}>
      <mesh rotation={[0, 0.4, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 2.4, 10]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.6} />
      </mesh>
      {!resolved && (
        <mesh position={[0.3, 0.06, 0.1]}>
          <sphereGeometry args={[0.08, 10, 10]} />
          <meshStandardMaterial color="#ff9800" emissive="#ff5a00" emissiveIntensity={0.8} />
        </mesh>
      )}
      {resolved && (
        <mesh position={[0.3, 0.08, 0.1]}>
          <torusGeometry args={[0.09, 0.025, 8, 16]} />
          <meshStandardMaterial color="#16a34a" emissive="#16a34a" emissiveIntensity={0.5} />
        </mesh>
      )}
      <mesh position={[-0.9, 0.35, -0.1]} rotation={[0, Math.PI / 5, 0]}>
        <coneGeometry args={[0.28, 0.5, 4]} />
        <meshStandardMaterial color={resolved ? "#4b5563" : "#f2b705"} />
      </mesh>
    </group>
  );
}

function WetFloorPuddle({ position, resolved }) {
  return (
    <group position={position}>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.012, 0]}
        scale={resolved ? 0.001 : 1}
      >
        <circleGeometry args={[0.9, 32]} />
        <meshStandardMaterial color="#4f7fa8" roughness={0.1} metalness={0.3} transparent opacity={0.55} />
      </mesh>
      <mesh position={[0.9, 0.4, -0.5]} rotation={[0, -0.6, 0]}>
        <coneGeometry args={[0.3, 0.55, 4]} />
        <meshStandardMaterial color={resolved ? "#4b5563" : "#f2b705"} />
      </mesh>
    </group>
  );
}

function OverloadedOutlet({ position, resolved }) {
  const sparkRef = useRef(null);
  useFrame(({ clock }) => {
    if (sparkRef.current) {
      sparkRef.current.intensity = resolved
        ? 0
        : 0.3 + Math.max(0, Math.sin(clock.getElapsedTime() * 11)) * 1.2;
    }
  });
  const plugAngles = resolved ? [-0.15, 0.15] : [-0.5, -0.15, 0.2, 0.5];
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[0.55, 0.14, 0.14]} />
        <meshStandardMaterial color="#e5e7eb" roughness={0.5} />
      </mesh>
      {plugAngles.map((a, i) => (
        <mesh key={i} position={[-0.2 + i * 0.14, 0.1, 0]} rotation={[0, 0, a]} castShadow>
          <boxGeometry args={[0.05, 0.16, 0.1]} />
          <meshStandardMaterial color={resolved ? "#4b5563" : "#1f2937"} />
        </mesh>
      ))}
      <pointLight ref={sparkRef} position={[0, 0.1, 0.1]} color="#ffb020" distance={1.2} intensity={0.5} />
    </group>
  );
}

/* ---------------- Yong'in xavfsizligi ---------------- */

function GasCylinderRack({ position }) {
  const glowRef = useRef(null);
  useFrame(({ clock }) => {
    if (glowRef.current) {
      glowRef.current.intensity = 0.5 + Math.sin(clock.getElapsedTime() * 2) * 0.3;
    }
  });
  const offsets = [-0.5, 0, 0.5];
  return (
    <group position={position}>
      {offsets.map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh position={[0, 0.75, 0]} castShadow>
            <cylinderGeometry args={[0.22, 0.22, 1.5, 16]} />
            <meshStandardMaterial color="#b91c1c" metalness={0.4} roughness={0.4} />
          </mesh>
          <mesh position={[0, 1.55, 0]} castShadow>
            <sphereGeometry args={[0.22, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#7f1d1d" metalness={0.4} roughness={0.4} />
          </mesh>
        </group>
      ))}
      <pointLight ref={glowRef} position={[0, 1, 0.6]} color="#ff7a1a" distance={2.5} intensity={0.6} />
      <SafetyStripes position={[0, 0, 0.9]} length={2.6} />
    </group>
  );
}

function ExtinguisherStation({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 1, -0.1]} castShadow>
        <boxGeometry args={[0.5, 0.7, 0.08]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.9, 0.05]} castShadow>
        <cylinderGeometry args={[0.12, 0.14, 0.55, 16]} />
        <meshStandardMaterial color="#dc2626" metalness={0.3} roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.2, 0.05]} castShadow>
        <cylinderGeometry args={[0.04, 0.06, 0.15, 12]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
    </group>
  );
}

function VentDuct({ position }) {
  const glowRef = useRef(null);
  useFrame(({ clock }) => {
    if (glowRef.current) {
      glowRef.current.material.emissiveIntensity = 0.3 + Math.sin(clock.getElapsedTime() * 1.5) * 0.2;
    }
  });
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[0.7, 0.7, 0.4]} />
        <meshStandardMaterial color="#6b7280" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh ref={glowRef} position={[0, 0, 0.21]}>
        <boxGeometry args={[0.55, 0.55, 0.02]} />
        <meshStandardMaterial color="#fb923c" emissive="#fb923c" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

function BlockedExit({ position, resolved }) {
  const crateOffsets = [
    [-0.25, 0.25, 0],
    [0.25, 0.25, 0.1],
    [0, 0.75, 0.05],
  ];
  return (
    <group position={position}>
      <mesh position={[0, 1.4, -0.15]} castShadow>
        <boxGeometry args={[1.2, 2.2, 0.1]} />
        <meshStandardMaterial color="#4b5563" roughness={0.6} />
      </mesh>
      <mesh position={[0, 2.4, -0.05]}>
        <boxGeometry args={[0.9, 0.28, 0.06]} />
        <meshStandardMaterial
          color="#16a34a"
          emissive="#16a34a"
          emissiveIntensity={resolved ? 1.4 : 0.8}
        />
      </mesh>
      {!resolved &&
        crateOffsets.map((p, i) => (
          <mesh key={i} position={p} castShadow>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial color="#a16207" roughness={0.8} />
          </mesh>
        ))}
    </group>
  );
}

/* ---------------- Asosiy komponent (bitta yaxlit sex) ---------------- */

const STATION_MODELS = {
  press: PressMachine,
  panel: ElectricalPanel,
  gas: GasCylinderRack,
};

export default function Factory({ theme, stations, foundIds, onFloorClick }) {
  return (
    <group>
      <Floor color={theme.floorColor} onFloorClick={onFloorClick} />
      <Shell wallColor={theme.wallColor} />

      {stations.map((station) => {
        const Model = STATION_MODELS[station.id];
        return (
          <group key={station.id}>
            {Model && <Model position={station.position} />}
            <ZoneRing position={station.position} radius={station.warningRadius} color="#f2b705" />
            <ZoneRing position={station.position} radius={station.dangerRadius} color="#e5342a" />
          </group>
        );
      })}

      {/* Mexanik hudud atrofidagi qo'shimcha xavflar */}
      <ConveyorBelt position={[-12.5, 0, -7]} />
      <CompressorUnit position={[-6, 0, -3]} />
      <PPERack position={[-9.5, 0, 1.5]} />
      <LockoutStation position={[-12, 0, -2]} />

      {/* Elektr hududi atrofidagi qo'shimcha xavflar */}
      <DamagedCable position={[-3.5, 0.1, -3]} resolved={foundIds.includes("cable")} />
      <WetFloorPuddle position={[3.5, 0, -3]} resolved={foundIds.includes("wetfloor")} />
      <OverloadedOutlet position={[2, 0.5, 1]} resolved={foundIds.includes("overload")} />

      {/* Yong'in hududi atrofidagi qo'shimcha xavflar */}
      <ExtinguisherStation position={[6.5, 0, -2]} />
      <VentDuct position={[12.5, 1.4, -2]} />
      <BlockedExit position={[9.5, 0, 1.5]} resolved={foundIds.includes("exit")} />
    </group>
  );
}
