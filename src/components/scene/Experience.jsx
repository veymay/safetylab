"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
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

function ViewportAlert({ zone }) {
  if (zone === "safe") return null;
  const alert = ZONE_ALERTS[zone];
  return (
    <>
      <mesh raycast={() => null} renderOrder={999}>
        <planeGeometry args={[1.1, 0.34]} />
        <meshBasicMaterial color={alert.color} transparent opacity={0.88} depthTest={false} />
      </mesh>
      <Text
        position={[0, 0, 0.005]}
        fontSize={0.065}
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
    </>
  );
}

function PlayerController({ stations, moveTargetRef, onZoneChange, onDangerEnter, onStationNoticed }) {
  const { camera } = useThree();
  const isPresenting = useXR((s) => !!s.session);
  const controlsRef = useRef(null);
  const originRef = useRef(null);
  const rigPos = useRef(START_POSITION.clone());
  const lastOverallZone = useRef("safe");
  const stationZones = useRef({});
  const noticedStations = useRef(new Set());
  const alertGroupRef = useRef(null);
  const forwardVec = useRef(new THREE.Vector3());
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
      onZoneChange(worstZone);
      setVrZone(worstZone);
    }

    if (alertGroupRef.current) {
      camera.getWorldDirection(forwardVec.current);
      alertGroupRef.current.position.copy(camera.position).addScaledVector(forwardVec.current, 1.4);
      alertGroupRef.current.quaternion.copy(camera.quaternion);
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
      <group ref={alertGroupRef} visible={isPresenting}>
        <ViewportAlert zone={vrZone} />
      </group>
    </>
  );
}

export default function Experience({
  theme,
  stations,
  hazards,
  foundIds,
  onHazardSelect,
  onHazardAutoFound,
  onZoneChange,
  onDangerEnter,
  xrStore,
}) {
  const moveTargetRef = useRef(null);
  const xrSupported = useXRSupport();

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

  return (
    <div className="relative h-dvh w-full">
      <Canvas
        shadows
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
            shadow-mapSize={[2048, 2048]}
            shadow-radius={4}
            shadow-camera-left={-16}
            shadow-camera-right={16}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />
          <directionalLight position={[-5, 4, 6]} intensity={0.25} color="#bcd4ff" />

          <Factory theme={theme} stations={stations} onFloorClick={handleFloorClick} />

          {hazards.map((hazard) => (
            <HazardMarker
              key={hazard.id}
              position={hazard.position}
              found={foundIds.includes(hazard.id)}
              onSelect={() => onHazardSelect(hazard.id)}
            />
          ))}

          <PlayerController
            stations={stations}
            moveTargetRef={moveTargetRef}
            onZoneChange={onZoneChange}
            onDangerEnter={onDangerEnter}
            onStationNoticed={onHazardAutoFound}
          />
        </XR>
      </Canvas>
    </div>
  );
}
