"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";

/**
 * A stylized gold coin: cylinder body + raised rim, slowly tumbling.
 * Geometry is deliberately simple so a fleet of coins stays cheap.
 */
export function Coin({
  position,
  scale = 1,
  rotationSpeed = 0.4,
  tumble = 0.25,
}: {
  position: [number, number, number];
  scale?: number;
  rotationSpeed?: number;
  tumble?: number;
}) {
  const group = useRef<Group>(null);
  const seed = useRef(position[0] * 3.7 + position[1] * 1.3);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime + seed.current;
    group.current.rotation.y = t * rotationSpeed;
    group.current.rotation.x = Math.sin(t * 0.5) * tumble + Math.PI / 2;
    group.current.position.y =
      position[1] + Math.sin(t * 0.8 + seed.current) * 0.18;
  });

  return (
    <group ref={group} position={position} scale={scale}>
      {/* Coin face */}
      <mesh>
        <cylinderGeometry args={[0.5, 0.5, 0.07, 48]} />
        <meshStandardMaterial
          color="#f5c451"
          metalness={0.9}
          roughness={0.25}
          emissive="#8a5a00"
          emissiveIntensity={0.12}
        />
      </mesh>
      {/* Raised rim */}
      <mesh>
        <torusGeometry args={[0.5, 0.045, 16, 48]} />
        <meshStandardMaterial
          color="#ffd97a"
          metalness={0.95}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
}
