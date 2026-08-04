"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Box3, Vector3, type Group } from "three";

/**
 * Low-poly money models for the hero scene.
 * Credits (CC-BY via Poly Pizza): "Coin" by Quaternius, "Dollar" by J-Toastie.
 * Models are normalized to a target world size regardless of authored scale.
 */

function useNormalizedScene(url: string, targetSize: number) {
  const { scene } = useGLTF(url);
  return useMemo(() => {
    const cloned = scene.clone(true);
    const box = new Box3().setFromObject(cloned);
    const size = new Vector3();
    const center = new Vector3();
    box.getSize(size);
    box.getCenter(center);
    cloned.position.sub(center);
    const maxAxis = Math.max(size.x, size.y, size.z) || 1;
    const scale = targetSize / maxAxis;
    return { cloned, scale };
  }, [scene, targetSize]);
}

export function CoinModel({
  position,
  size = 1,
  spinSpeed = 0.5,
}: {
  position: [number, number, number];
  size?: number;
  spinSpeed?: number;
}) {
  const group = useRef<Group>(null);
  const seed = useRef(position[0] * 3.1 + position[1]);
  const { cloned, scale } = useNormalizedScene("/models/coin.glb", size);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime + seed.current;
    group.current.rotation.y = t * spinSpeed;
    group.current.rotation.x = Math.sin(t * 0.4) * 0.25;
  });

  return (
    <group ref={group} position={position}>
      <primitive object={cloned} scale={scale} />
    </group>
  );
}

export function NoteModel({
  position,
  size = 1.6,
  driftSpeed = 0.35,
}: {
  position: [number, number, number];
  size?: number;
  driftSpeed?: number;
}) {
  const group = useRef<Group>(null);
  const seed = useRef(position[0] * 1.7 - position[2]);
  const { cloned, scale } = useNormalizedScene("/models/note.glb", size);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime + seed.current;
    // Lazy falling-leaf tumble.
    group.current.rotation.z = Math.sin(t * driftSpeed) * 0.35;
    group.current.rotation.x = Math.PI / 3 + Math.sin(t * 0.25) * 0.2;
    group.current.rotation.y = t * 0.15;
    group.current.position.y = position[1] + Math.sin(t * 0.6) * 0.2;
  });

  return (
    <group ref={group} position={position}>
      <primitive object={cloned} scale={scale} />
    </group>
  );
}

useGLTF.preload("/models/coin.glb");
useGLTF.preload("/models/note.glb");
