"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import type { Group } from "three";

import { Coin } from "@/components/three/coin";
import { GlassPanel } from "@/components/three/glass-panel";

/**
 * Wraps scene content in a group that eases toward the mouse position for
 * a gentle parallax, and drifts with scroll.
 */
function ParallaxRig({ children }: { children: React.ReactNode }) {
  const group = useRef<Group>(null);
  const scrollY = useRef(0);

  useFrame((state, delta) => {
    if (!group.current) return;
    if (typeof window !== "undefined") {
      scrollY.current = window.scrollY;
    }
    const targetX = state.pointer.y * 0.12;
    const targetY = state.pointer.x * 0.2;
    const damp = 1 - Math.exp(-3 * delta);
    group.current.rotation.x += (targetX - group.current.rotation.x) * damp;
    group.current.rotation.y += (targetY - group.current.rotation.y) * damp;
    // Scroll gently lifts the whole scene.
    const targetPosY = Math.min(scrollY.current / 900, 1) * 1.2;
    group.current.position.y +=
      (targetPosY - group.current.position.y) * damp;
  });

  return <group ref={group}>{children}</group>;
}

function SceneContents() {
  return (
    <ParallaxRig>
      {/* Gradient lighting: violet key, fuchsia fill, warm gold accent */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 6, 5]} intensity={1.4} color="#e9e2ff" />
      <pointLight position={[-6, 2, -2]} intensity={12} color="#a855f7" />
      <pointLight position={[6, -3, 2]} intensity={10} color="#f0abfc" />
      <pointLight position={[0, 4, -4]} intensity={8} color="#fbbf24" />

      <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.6}>
        <Coin position={[2.6, 0.4, -0.5]} scale={1.15} />
      </Float>
      <Float speed={1.1} rotationIntensity={0.4} floatIntensity={0.8}>
        <Coin position={[-2.9, 1.2, -1]} scale={0.85} rotationSpeed={0.55} />
      </Float>
      <Float speed={1.7} rotationIntensity={0.35} floatIntensity={0.7}>
        <Coin position={[-1.8, -1.4, 0.2]} scale={0.6} rotationSpeed={0.7} />
      </Float>
      <Float speed={0.9} rotationIntensity={0.3} floatIntensity={0.5}>
        <Coin position={[3.4, -1.1, -1.6]} scale={0.7} rotationSpeed={0.35} />
      </Float>
      <Float speed={1.3} rotationIntensity={0.2} floatIntensity={0.9}>
        <Coin position={[0.4, 1.9, -2.2]} scale={0.5} rotationSpeed={0.6} />
      </Float>

      <GlassPanel
        position={[-3.4, -0.4, -1.8]}
        rotation={[0.1, 0.5, -0.08]}
        size={[1.8, 1.15, 0.07]}
      />
      <GlassPanel
        position={[3.2, 1.7, -2.6]}
        rotation={[-0.05, -0.4, 0.06]}
        size={[1.5, 0.95, 0.07]}
        driftSpeed={0.7}
      />
    </ParallaxRig>
  );
}

/**
 * The hero's 3D backdrop. Rendered behind the headline; pointer-events pass
 * through so the page stays fully interactive.
 */
export function HeroScene() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 42 }}
        dpr={[1, 1.8]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        eventSource={
          typeof document !== "undefined" ? document.body : undefined
        }
        eventPrefix="client"
      >
        <Suspense fallback={null}>
          <SceneContents />
        </Suspense>
      </Canvas>
    </div>
  );
}
