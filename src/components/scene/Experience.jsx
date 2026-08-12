"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Text, Billboard } from "@react-three/drei";
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
  danger: { color: "#e5342a", label: "XAVFLI HUDUD\nZudlik bilan orqaga qayting!" },
};
const REACH_DURATION = 0.5;

/* ---------------- O'yin ichi HUD (kalla bilan birga yuradi) ---------------- */

function ViewportAlert({ zone }) {
  if (zone === "safe") return null;
  const alert = ZONE_ALERTS[zone];
  return (
    <group position={[0, 0.3, 0]}>
      <mesh raycast={() => null} renderOrder={999}>
        <planeGeometry args={[1.1, 0.34]} />
        <meshBasicMaterial color={alert.color} transparent opacity={0.9} depthTest={false} />
      </mesh>
      <Text
        position={[0, 0, 0.005]}
        fontSize={0.062}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={1}
        textAlign="center"
        material-depthTest={false}
        renderOrder={1000}
        raycast={() => null}
      >
        {alert.label}
      </Text>
    </group>
  );
}

function StatusPanel({ hazardsFound, hazardsTotal, violations, allFound, onFinish }) {
  const panelH = allFound ? 0.46 : 0.32;
  return (
    <group position={[-0.58, -0.3, 0]}>
      <mesh raycast={() => null} renderOrder={999}>
        <planeGeometry args={[0.6, panelH]} />
        <meshBasicMaterial color="#0f2134" transparent opacity={0.85} depthTest={false} />
      </mesh>
      <Text
        position={[0, panelH / 2 - 0.075, 0.003]}
        fontSize={0.044}
        color="#cba86a"
        anchorX="center"
        anchorY="middle"
        material-depthTest={false}
        renderOrder={1000}
        raycast={() => null}
      >
        {`XAVFLAR ${hazardsFound}/${hazardsTotal}`}
      </Text>
      <Text
        position={[0, panelH / 2 - 0.16, 0.003]}
        fontSize={0.038}
        color={violations > 0 ? "#f87171" : "#86efac"}
        anchorX="center"
        anchorY="middle"
        material-depthTest={false}
        renderOrder={1000}
        raycast={() => null}
      >
        {`Qoidabuzarlik: ${violations}`}
      </Text>
      {allFound && (
        <group
          position={[0, -panelH / 2 + 0.08, 0.003]}
          onClick={(e) => {
            e.stopPropagation();
            onFinish();
          }}
        >
          <mesh renderOrder={999}>
            <planeGeometry args={[0.54, 0.13]} />
            <meshBasicMaterial color="#cba86a" depthTest={false} />
          </mesh>
          <Text
            position={[0, 0, 0.003]}
            fontSize={0.038}
            color="#0f2134"
            anchorX="center"
            anchorY="middle"
            material-depthTest={false}
            renderOrder={1001}
            raycast={() => null}
          >
            MASHQNI YAKUNLASH
          </Text>
        </group>
      )}
    </group>
  );
}

function FirstPersonHand({ reachRef }) {
  const groupRef = useRef(null);
  useFrame(() => {
    if (!groupRef.current) return;
    const hump = Math.sin(Math.min(reachRef.current, 1) * Math.PI) * (reachRef.current > 0 ? 1 : 0);
    groupRef.current.position.set(0.3 - hump * 0.18, -0.36 + hump * 0.1, -0.15 - hump * 0.32);
    groupRef.current.rotation.set(-0.3 - hump * 0.5, 0.15, -0.2);
  });
  return (
    <group ref={groupRef}>
      {/* bilak */}
      <mesh raycast={() => null}>
        <capsuleGeometry args={[0.055, 0.32, 4, 8]} />
        <meshStandardMaterial color="#d8a878" roughness={0.7} />
      </mesh>
      {/* kaft */}
      <mesh position={[0, 0.19, 0]} raycast={() => null}>
        <boxGeometry args={[0.1, 0.11, 0.045]} />
        <meshStandardMaterial color="#d8a878" roughness={0.7} />
      </mesh>
      {/* barmoqlar */}
      {[-0.03, -0.01, 0.01, 0.03].map((x, i) => (
        <mesh key={i} position={[x, 0.25, 0.005]} raycast={() => null}>
          <capsuleGeometry args={[0.011, 0.05, 4, 6]} />
          <meshStandardMaterial color="#d8a878" roughness={0.7} />
        </mesh>
      ))}
      {/* qo'lqop manjeti */}
      <mesh position={[0, 0.08, 0]} raycast={() => null}>
        <cylinderGeometry args={[0.062, 0.058, 0.09, 12]} />
        <meshStandardMaterial color="#1f2937" roughness={0.6} />
      </mesh>
    </group>
  );
}

/* ---------------- O'yinchi boshqaruvi ---------------- */

function PlayerController({
  stations,
  moveTargetRef,
  onDangerEnter,
  onStationNoticed,
  hazardsFound,
  hazardsTotal,
  violations,
  allFound,
  onFinish,
  reachTrigger,
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
  const handAnchorRef = useRef(null);
  const forwardVec = useRef(new THREE.Vector3());
  const reachTimer = useRef(-1);
  const lastSeenTrigger = useRef(0);
  const [vrZone, setVrZone] = useState("safe");

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
      if (ZONE_RANK[zone] > ZONE_RANK[worstZone]) worstZone = zone;
    });
    if (worstZone !== lastOverallZone.current) {
      lastOverallZone.current = worstZone;
      setVrZone(worstZone);
    }

    if (reachTrigger.current !== lastSeenTrigger.current) {
      lastSeenTrigger.current = reachTrigger.current;
      reachTimer.current = 0;
    }
    if (reachTimer.current >= 0) {
      reachTimer.current += delta / REACH_DURATION;
      if (reachTimer.current > 1) reachTimer.current = -1;
    }

    camera.getWorldDirection(forwardVec.current);
    if (hudAnchorRef.current) {
      hudAnchorRef.current.position.copy(camera.position).addScaledVector(forwardVec.current, 1.4);
      hudAnchorRef.current.quaternion.copy(camera.quaternion);
    }
    if (handAnchorRef.current) {
      handAnchorRef.current.position.copy(camera.position).addScaledVector(forwardVec.current, 0.55);
      handAnchorRef.current.quaternion.copy(camera.quaternion);
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
      <group ref={hudAnchorRef}>
        <ViewportAlert zone={vrZone} />
        <StatusPanel
          hazardsFound={hazardsFound}
          hazardsTotal={hazardsTotal}
          violations={violations}
          allFound={allFound}
          onFinish={onFinish}
        />
      </group>
      <group ref={handAnchorRef}>
        <FirstPersonHand reachRef={reachTimer} />
      </group>
    </>
  );
}

/* ---------------- Xavf haqida suzuvchi ma'lumot ---------------- */

function HazardTooltip({ hazard, onClose }) {
  if (!hazard) return null;
  const shortDescription = hazard.description.split(". ")[0] + ".";
  return (
    <Billboard position={[hazard.position[0], hazard.position[1] + 0.6, hazard.position[2]]}>
      <mesh renderOrder={998}>
        <planeGeometry args={[1.5, 0.55]} />
        <meshBasicMaterial color="#0f2134" transparent opacity={0.92} depthTest={false} />
      </mesh>
      <Text
        position={[0, 0.16, 0.003]}
        fontSize={0.075}
        color="#cba86a"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.35}
        textAlign="center"
        material-depthTest={false}
        renderOrder={999}
      >
        {hazard.title}
      </Text>
      <Text
        position={[0, -0.06, 0.003]}
        fontSize={0.058}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.35}
        textAlign="center"
        lineHeight={1.3}
        material-depthTest={false}
        renderOrder={999}
      >
        {shortDescription}
      </Text>
      <group position={[0.62, 0.2, 0.003]} onClick={(e) => { e.stopPropagation(); onClose(); }}>
        <mesh renderOrder={999}>
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
  activeHazard,
  onCloseHazardInfo,
  onFinish,
  violations,
  hazardsTotal,
  xrStore,
}) {
  const moveTargetRef = useRef(null);
  const reachTrigger = useRef(0);
  const xrSupported = useXRSupport();
  const allFound = foundIds.length >= hazardsTotal;

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

  function handleHazardClick(id) {
    reachTrigger.current += 1;
    onHazardSelect(id);
  }

  function handleFinishClick() {
    reachTrigger.current += 1;
    onFinish();
  }

  return (
    <div className="relative h-dvh w-full">
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [0, EYE_HEIGHT, 8], fov: 60 }}
        style={{ touchAction: "none" }}
      >
        <XR store={xrStore}>
          <color attach="background" args={[theme.fogColor]} />
          <fog attach="fog" args={[theme.fogColor, 12, 32]} />
          <hemisphereLight args={["#ffffff", "#41494f", 0.9]} />
          <directionalLight
            position={[6, 8, 4]}
            intensity={1.1}
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-camera-left={-16}
            shadow-camera-right={16}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />
          <directionalLight position={[-5, 4, 6]} intensity={0.25} color="#bcd4ff" />

          <Factory theme={theme} stations={stations} foundIds={foundIds} onFloorClick={handleFloorClick} />

          {hazards.map((hazard) => (
            <HazardMarker
              key={hazard.id}
              position={hazard.position}
              found={foundIds.includes(hazard.id)}
              onSelect={() => handleHazardClick(hazard.id)}
            />
          ))}

          <HazardTooltip hazard={activeHazard} onClose={onCloseHazardInfo} />

          <PlayerController
            stations={stations}
            moveTargetRef={moveTargetRef}
            onDangerEnter={onDangerEnter}
            onStationNoticed={onHazardAutoFound}
            hazardsFound={foundIds.length}
            hazardsTotal={hazardsTotal}
            violations={violations}
            allFound={allFound}
            onFinish={handleFinishClick}
            reachTrigger={reachTrigger}
          />
        </XR>
      </Canvas>
    </div>
  );
}
