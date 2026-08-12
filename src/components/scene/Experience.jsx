"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Text, Billboard, RoundedBox } from "@react-three/drei";
import { XR, XROrigin, useXR } from "@react-three/xr";
import * as THREE from "three";
import Factory from "./Factory";
import HazardMarker from "./HazardMarker";
import { getZoneState } from "@/lib/scenario";
import { useXRSupport } from "@/lib/useXRSupport";

const EYE_HEIGHT = 1.55;
const MOVE_SPEED = 4.5;
const START_POSITION = new THREE.Vector3(0, 0, 5);
const ZONE_RANK = { safe: 0, warning: 1, danger: 2 };
const ZONE_ALERTS = {
  warning: { color: "#f2b705", label: "DIQQAT\nXavfli uskunaga yaqinlashmoqdasiz" },
  danger: { color: "#e5342a", label: "XAVFLI HUDUD!\nZudlik bilan orqaga qayting!" },
};
const DANGER_SOUND_INTERVAL = 0.9;

const LIFTING_ID = "lifting";
const PICKUP_POS = [-6, 0, 4.5];
const DROPZONE_POS = [-6, 0, -0.8];
const DROP_RADIUS = 1.4;

/* ---------------- O'yin ichi HUD (kalla bilan birga yuradi) ---------------- */

// Ogohlantirish endi ekranga emas, aynan xavf tug'dirayotgan stansiya
// (pres/shchit/gaz ombori) tepasiga osiladi — foydalanuvchi qaysi
// uskunadan xavf borligini aniq ko'radi. Har doim mount holida qoladi
// (faqat `visible`/matn almashadi) — sababi yuqorida: tez-tez
// mount/unmount GPU drayverini band qilib, WebGL kontekstini
// yo'qotishga olib kelishi mumkin.
function ZoneAlert({ zone, stationPosition }) {
  const groupRef = useRef(null);
  const alert = ZONE_ALERTS[zone] ?? ZONE_ALERTS.danger;
  const anchor = stationPosition ?? [0, 0, -6];

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.visible = zone !== "safe";
    if (zone === "danger") {
      const pulse = 1 + Math.sin(clock.getElapsedTime() * 7) * 0.08;
      groupRef.current.scale.setScalar(pulse);
    } else {
      groupRef.current.scale.setScalar(1);
    }
  });

  return (
    <Billboard ref={groupRef} position={[anchor[0], 2.6, anchor[2]]}>
      <RoundedBox args={[2, 0.55, 0.13]} radius={0.05} smoothness={4} raycast={() => null} renderOrder={997}>
        <meshBasicMaterial color={alert.color} transparent opacity={0.94} />
      </RoundedBox>
      <Text
        position={[0, 0, 0.075]}
        fontSize={0.1}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.85}
        textAlign="center"
        renderOrder={998}
        raycast={() => null}
      >
        {alert.label}
      </Text>
    </Billboard>
  );
}

function StatusPanel({ hazardsFound, hazardsTotal, violations, allFound, onFinish }) {
  // Panel balandligi doim bitta qiymatda qoladi (allFound bilan
  // o'zgarmaydi) — aks holda RoundedBox geometriyasi har safar qayta
  // yaratiladi. Buning o'rniga faqat "Yakunlash" tugmasi visible bilan
  // ko'rsatiladi/yashiriladi.
  const panelH = 0.48;
  return (
    <group position={[0.6, 0.3, 0]}>
      <RoundedBox args={[0.64, panelH, 0.11]} radius={0.03} smoothness={4} raycast={() => null} renderOrder={999}>
        <meshBasicMaterial color="#0f2134" transparent opacity={0.85} depthTest={false} />
      </RoundedBox>
      <Text
        position={[0, panelH / 2 - 0.09, 0.065]}
        fontSize={0.052}
        color="#cba86a"
        anchorX="center"
        anchorY="middle"
        maxWidth={0.58}
        material-depthTest={false}
        renderOrder={1000}
        raycast={() => null}
      >
        {`XAVFLAR ${hazardsFound}/${hazardsTotal}`}
      </Text>
      <Text
        position={[0, panelH / 2 - 0.19, 0.065]}
        fontSize={0.046}
        color={violations > 0 ? "#f87171" : "#86efac"}
        anchorX="center"
        anchorY="middle"
        maxWidth={0.58}
        material-depthTest={false}
        renderOrder={1000}
        raycast={() => null}
      >
        {`Qoidabuzarlik: ${violations}`}
      </Text>
      <group
        visible={allFound}
        position={[0, -panelH / 2 + 0.09, 0.065]}
        onClick={(e) => {
          e.stopPropagation();
          if (allFound) onFinish();
        }}
      >
        <RoundedBox
          args={[0.58, 0.14, 0.14]}
          radius={0.04}
          smoothness={4}
          renderOrder={999}
          raycast={allFound ? undefined : () => null}
        >
          <meshBasicMaterial color="#cba86a" depthTest={false} />
        </RoundedBox>
        <Text
          position={[0, 0, 0.08]}
          fontSize={0.046}
          color="#0f2134"
          anchorX="center"
          anchorY="middle"
          maxWidth={0.52}
          material-depthTest={false}
          renderOrder={1001}
          raycast={() => null}
        >
          MASHQNI YAKUNLASH
        </Text>
      </group>
    </group>
  );
}

/* ---------------- Yukni ko'tarish va joyiga qo'yish ---------------- */

function CrateStack({ onPick }) {
  const offsets = [
    [-0.2, 0.225, 0],
    [0.2, 0.225, 0.1],
    [0, 0.675, 0.05],
  ];
  return (
    <group
      position={PICKUP_POS}
      onClick={(e) => {
        e.stopPropagation();
        onPick();
      }}
    >
      {offsets.map((p, i) => (
        <RoundedBox key={i} args={[0.45, 0.45, 0.45]} radius={0.03} smoothness={2} position={p}>
          <meshStandardMaterial color="#a16207" roughness={0.8} />
        </RoundedBox>
      ))}
    </group>
  );
}

function DropPallet() {
  return (
    <group position={DROPZONE_POS}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <planeGeometry args={[1.5, 1.5]} />
        <meshStandardMaterial color="#facc15" roughness={0.7} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[0.55, 0.62, 4]} />
        <meshBasicMaterial color="#1f2937" />
      </mesh>
    </group>
  );
}

function CarriedCrate() {
  return (
    <RoundedBox args={[0.32, 0.32, 0.32]} radius={0.02} smoothness={2} position={[0.22, -0.34, -0.1]} rotation={[0.1, 0.35, 0]}>
      <meshStandardMaterial color="#a16207" roughness={0.8} />
    </RoundedBox>
  );
}

/* ---------------- O'yinchi boshqaruvi ---------------- */

function PlayerController({
  stations,
  moveTargetRef,
  onDangerEnter,
  onDangerTick,
  onStationNoticed,
  hazardsFound,
  hazardsTotal,
  violations,
  allFound,
  onFinish,
  carrying,
  onDrop,
}) {
  const { camera } = useThree();
  const isPresenting = useXR((s) => !!s.session);
  const controlsRef = useRef(null);
  const originRef = useRef(null);
  const rigPos = useRef(START_POSITION.clone());
  const lastOverallZone = useRef("safe");
  const stationZones = useRef({});
  const noticedStations = useRef(new Set());
  const hudAnchorRef = useRef(null);
  const carryAnchorRef = useRef(null);
  const forwardVec = useRef(new THREE.Vector3());
  const dangerSoundTimer = useRef(0);
  const droppedGuard = useRef(false);
  const [vrZone, setVrZone] = useState("safe");
  const [alertStationPos, setAlertStationPos] = useState(null);

  useEffect(() => {
    if (carrying) droppedGuard.current = false;
  }, [carrying]);

  useEffect(() => {
    if (!isPresenting) {
      camera.position.set(rigPos.current.x, rigPos.current.y + EYE_HEIGHT, rigPos.current.z);
      controlsRef.current?.target.set(rigPos.current.x, rigPos.current.y + EYE_HEIGHT, rigPos.current.z);
    }
  }, [isPresenting, camera]);

  useFrame((_, delta) => {
    const target = moveTargetRef.current;
    if (target) {
      const flatRig = new THREE.Vector3(rigPos.current.x, 0, rigPos.current.z);
      const dir = new THREE.Vector3(target.x, 0, target.z).sub(flatRig);
      const dist = dir.length();
      if (dist < 0.05) {
        moveTargetRef.current = null;
      } else {
        dir.normalize();
        const step = Math.min(dist, MOVE_SPEED * delta);
        const deltaVec = dir.multiplyScalar(step);
        rigPos.current.add(deltaVec);

        if (isPresenting) {
          originRef.current?.position.copy(rigPos.current);
        } else {
          camera.position.add(deltaVec);
          controlsRef.current?.target.add(deltaVec);
        }
      }
    }

    let worstZone = "safe";
    let worstStation = null;
    stations.forEach((station) => {
      const dx = rigPos.current.x - station.position[0];
      const dz = rigPos.current.z - station.position[2];
      const distance = Math.sqrt(dx * dx + dz * dz);
      const zone = getZoneState(distance, station.warningRadius, station.dangerRadius);
      const prevZone = stationZones.current[station.id] ?? "safe";
      if (zone !== prevZone) {
        if (zone === "danger" && prevZone !== "danger") onDangerEnter();
        stationZones.current[station.id] = zone;
      }
      if (zone !== "safe" && !noticedStations.current.has(station.id)) {
        noticedStations.current.add(station.id);
        onStationNoticed(station.hazard.id);
      }
      if (ZONE_RANK[zone] > ZONE_RANK[worstZone]) {
        worstZone = zone;
        worstStation = station;
      }
    });
    if (worstZone !== lastOverallZone.current) {
      lastOverallZone.current = worstZone;
      setVrZone(worstZone);
      if (worstStation) setAlertStationPos(worstStation.position);
    }

    if (worstZone === "danger") {
      dangerSoundTimer.current += delta;
      if (dangerSoundTimer.current >= DANGER_SOUND_INTERVAL) {
        dangerSoundTimer.current = 0;
        onDangerTick();
      }
    } else {
      dangerSoundTimer.current = 0;
    }

    if (carrying && !droppedGuard.current) {
      const dx = rigPos.current.x - DROPZONE_POS[0];
      const dz = rigPos.current.z - DROPZONE_POS[2];
      if (Math.sqrt(dx * dx + dz * dz) < DROP_RADIUS) {
        droppedGuard.current = true;
        onDrop();
      }
    }

    camera.getWorldDirection(forwardVec.current);
    if (hudAnchorRef.current) {
      hudAnchorRef.current.position.copy(camera.position).addScaledVector(forwardVec.current, 1.4);
      hudAnchorRef.current.quaternion.copy(camera.quaternion);
    }
    if (carryAnchorRef.current) {
      carryAnchorRef.current.position.copy(camera.position).addScaledVector(forwardVec.current, 0.55);
      carryAnchorRef.current.quaternion.copy(camera.quaternion);
    }

    if (!isPresenting) controlsRef.current?.update();
  });

  return (
    <>
      <XROrigin ref={originRef} position={[START_POSITION.x, START_POSITION.y, START_POSITION.z]} />
      {!isPresenting && (
        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          minDistance={2.5}
          maxDistance={9}
          maxPolarAngle={Math.PI / 2.05}
        />
      )}
      <ZoneAlert zone={vrZone} stationPosition={alertStationPos} />
      <group ref={hudAnchorRef}>
        <StatusPanel
          hazardsFound={hazardsFound}
          hazardsTotal={hazardsTotal}
          violations={violations}
          allFound={allFound}
          onFinish={onFinish}
        />
      </group>
      <group ref={carryAnchorRef} visible={carrying}>
        <CarriedCrate />
      </group>
    </>
  );
}

/* ---------------- Xavf haqida suzuvchi ma'lumot ---------------- */

// Xuddi ViewportAlert kabi: har xavf bosilganda/yopilganda qayta-qayta
// mount/unmount bo'lmasligi uchun doim mount holida qoladi, faqat
// ko'rinishi va matni almashtiriladi.
function HazardTooltip({ hazard, onClose }) {
  const visible = Boolean(hazard);
  const anchorPos = hazard ? [hazard.position[0], hazard.position[1] + 0.75, hazard.position[2]] : [0, 1.6, 0];
  const title = hazard?.title ?? "";
  const description = hazard?.description ?? "";

  function handleClose(e) {
    e.stopPropagation();
    if (hazard) onClose();
  }

  return (
    <Billboard position={anchorPos} visible={visible}>
      <RoundedBox
        args={[1.7, 1.0, 0.14]}
        radius={0.04}
        smoothness={4}
        renderOrder={998}
        raycast={() => null}
      >
        <meshBasicMaterial color="#0f2134" transparent opacity={0.94} depthTest={false} />
      </RoundedBox>
      <Text
        position={[0, 0.37, 0.08]}
        fontSize={0.08}
        color="#cba86a"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.5}
        textAlign="center"
        material-depthTest={false}
        renderOrder={999}
        raycast={() => null}
      >
        {title}
      </Text>
      <Text
        position={[0, 0.25, 0.08]}
        fontSize={0.052}
        color="#ffffff"
        anchorX="center"
        anchorY="top"
        maxWidth={1.55}
        textAlign="center"
        lineHeight={1.4}
        material-depthTest={false}
        renderOrder={999}
        raycast={() => null}
      >
        {description}
      </Text>
      <group position={[0.75, 0.42, 0.08]} onClick={handleClose}>
        <mesh renderOrder={999} raycast={visible ? undefined : () => null}>
          <circleGeometry args={[0.06, 16]} />
          <meshBasicMaterial color="#e5342a" depthTest={false} />
        </mesh>
        <Text
          position={[0, 0, 0.002]}
          fontSize={0.07}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          material-depthTest={false}
          renderOrder={1000}
          raycast={() => null}
        >
          X
        </Text>
      </group>
    </Billboard>
  );
}

/* ---------------- Asosiy komponent ---------------- */

export default function Experience({
  theme,
  stations,
  hazards,
  foundIds,
  onHazardSelect,
  onHazardAutoFound,
  onDangerEnter,
  onDangerTick,
  activeHazard,
  onCloseHazardInfo,
  onFinish,
  violations,
  hazardsTotal,
  xrStore,
}) {
  const moveTargetRef = useRef(null);
  const xrSupported = useXRSupport();
  const allFound = foundIds.length >= hazardsTotal;
  const [carrying, setCarrying] = useState(false);
  const liftingDone = foundIds.includes(LIFTING_ID);
  const [fatalError, setFatalError] = useState(null);

  // Diagnostika: keyingi safar qora ekran chiqsa, taxmin qilmasdan aniq
  // xato xabarini ko'rish uchun (WebGL kontekst yo'qolishi ham shu yerda ushlanadi).
  useEffect(() => {
    function handleError(e) {
      setFatalError(`JS xatosi: ${e?.error?.message ?? e?.message ?? "noma'lum"}`);
    }
    function handleRejection(e) {
      setFatalError(`Promise xatosi: ${e?.reason?.message ?? e?.reason ?? "noma'lum"}`);
    }
    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);
    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);

  function handleCanvasCreated({ gl }) {
    gl.domElement.addEventListener("webglcontextlost", (e) => {
      e.preventDefault();
      setFatalError("WebGL konteksti yo'qoldi (GPU/drayver muammosi).");
    });
  }

  useEffect(() => {
    if (!xrSupported) return;
    let cancelled = false;
    let attempts = 0;
    function tryEnter() {
      if (cancelled) return;
      xrStore.enterVR().catch((err) => {
        attempts += 1;
        if (!cancelled && attempts < 10) {
          setTimeout(tryEnter, 200);
        } else if (!cancelled) {
          console.error("VR sessiyasini avtomatik ochib bo'lmadi:", err);
        }
      });
    }
    tryEnter();
    return () => {
      cancelled = true;
    };
  }, [xrSupported, xrStore]);

  function handleFloorClick(e) {
    e.stopPropagation();
    moveTargetRef.current = e.point.clone();
  }

  function handleCratePick() {
    if (carrying || liftingDone) return;
    setCarrying(true);
  }

  function handleCrateDrop() {
    setCarrying(false);
    onHazardSelect(LIFTING_ID);
  }

  return (
    <div className="relative h-dvh w-full">
      {fatalError && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/90 px-6 text-center text-white">
          <p className="text-sm font-semibold uppercase tracking-widest text-red-400">
            Sahna nosozligi aniqlandi
          </p>
          <p className="mt-3 max-w-lg text-sm text-slate-300">{fatalError}</p>
          <p className="mt-2 text-xs text-slate-500">
            Iltimos, shu xabarni suratga oling yoki nusxa ko&apos;chiring.
          </p>
        </div>
      )}
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, EYE_HEIGHT, 8], fov: 60 }}
        style={{ touchAction: "none" }}
        onCreated={handleCanvasCreated}
      >
        <XR store={xrStore}>
          <color attach="background" args={[theme.fogColor]} />
          <fog attach="fog" args={[theme.fogColor, 12, 32]} />
          <hemisphereLight args={["#ffffff", "#41494f", 0.9]} />
          <directionalLight position={[6, 8, 4]} intensity={1.1} />
          <directionalLight position={[-5, 4, 6]} intensity={0.25} color="#bcd4ff" />

          <Factory theme={theme} stations={stations} foundIds={foundIds} onFloorClick={handleFloorClick} />

          {hazards.map((hazard) => (
            <HazardMarker
              key={hazard.id}
              position={hazard.position}
              found={foundIds.includes(hazard.id)}
              onSelect={() => onHazardSelect(hazard.id)}
            />
          ))}

          {!carrying && !liftingDone && <CrateStack onPick={handleCratePick} />}
          <DropPallet />

          <HazardTooltip hazard={activeHazard} onClose={onCloseHazardInfo} />

          <PlayerController
            stations={stations}
            moveTargetRef={moveTargetRef}
            onDangerEnter={onDangerEnter}
            onDangerTick={onDangerTick}
            onStationNoticed={onHazardAutoFound}
            hazardsFound={foundIds.length}
            hazardsTotal={hazardsTotal}
            violations={violations}
            allFound={allFound}
            onFinish={onFinish}
            carrying={carrying}
            onDrop={handleCrateDrop}
          />
        </XR>
      </Canvas>
    </div>
  );
}
