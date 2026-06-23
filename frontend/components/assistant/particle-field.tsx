"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Points } from "three";
import { AdditiveBlending, BufferAttribute, BufferGeometry, Color, PointsMaterial } from "three";
import type { AssistantState } from "@/types/assistant";

function Particles({ state }: { state: AssistantState }) {
  const ref = useRef<Points>(null);
  const count = 420;
  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const radius = 1.15 + Math.random() * 1.25;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    const buffer = new BufferGeometry();
    buffer.setAttribute("position", new BufferAttribute(positions, 3));
    return buffer;
  }, []);

  const material = useMemo(
    () =>
      new PointsMaterial({
        color: new Color(state === "speaking" ? "#f59e0b" : state === "listening" ? "#22d3ee" : "#34d399"),
        size: 0.018,
        transparent: true,
        opacity: 0.82,
        blending: AdditiveBlending,
        depthWrite: false
      }),
    [state]
  );

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const speed = state === "thinking" ? 0.45 : state === "listening" ? 0.32 : 0.18;
    ref.current.rotation.y = clock.elapsedTime * speed;
    ref.current.rotation.x = Math.sin(clock.elapsedTime * 0.36) * 0.16;
    ref.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * 2.4) * (state === "speaking" ? 0.075 : 0.035));
  });

  return <points ref={ref} geometry={geometry} material={material} />;
}

export function ParticleField({ state }: { state: AssistantState }) {
  return (
    <Canvas camera={{ position: [0, 0, 4], fov: 50 }} dpr={[1, 1.8]} aria-hidden>
      <ambientLight intensity={0.8} />
      <Particles state={state} />
    </Canvas>
  );
}
