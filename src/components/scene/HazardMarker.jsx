"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";

export default function HazardMarker({ position, found, onSelect }) {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.position.y = position[1] + Math.sin(t * 2) * 0.08;
    ref.current.rotation.y = t;
  });

  const color = found ? "#3fae5a" : hovered ? "#ffd23f" : "#ff9800";

  return (
    <group position={position}>
      <mesh
        ref={ref}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
        scale={hovered && !found ? 1.2 : 1}
      >
        <octahedronGeometry args={[0.28, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={found ? 0.9 : 1.6}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
