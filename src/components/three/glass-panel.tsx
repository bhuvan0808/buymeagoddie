"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import type { Group } from "three";

/**
 * A floating frosted-glass card that echoes the site's glassmorphism.
 */
export function GlassPanel({
  position,
  rotation = [0, 0, 0],
  size = [1.6, 1, 0.06],
  driftSpeed = 0.5,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  size?: [number, number, number];
  driftSpeed?: number;
}) {
  const group = useRef<Group>(null);
  const seed = useRef(position[0] * 2.1 - position[2]);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime + seed.current;
    group.current.position.y =
      position[1] + Math.sin(t * driftSpeed) * 0.12;
    group.current.rotation.z = rotation[2] + Math.sin(t * 0.3) * 0.04;
  });

  return (
    <group ref={group} position={position} rotation={rotation}>
      <RoundedBox args={size} radius={0.08} smoothness={4}>
        <meshPhysicalMaterial
          color="#b9a6ff"
          transmission={0.75}
          thickness={0.4}
          roughness={0.15}
          metalness={0}
          transparent
          opacity={0.85}
        />
      </RoundedBox>
    </group>
  );
}
