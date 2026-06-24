"use client";

import type { AssistantState } from "@/types/assistant";
import { cn } from "@/lib/utils";

export function ParticleField({ state }: { state: AssistantState }) {
  const particles = Array.from({ length: 28 }, (_, index) => index);

  return (
    <div className="absolute inset-0 overflow-hidden rounded-full" aria-hidden>
      <div
        className={cn(
          "absolute inset-[12%] rounded-full blur-2xl",
          state === "speaking"
            ? "bg-secondary/25"
            : state === "listening"
              ? "bg-primary/25"
              : state === "thinking"
                ? "bg-accent/20"
                : "bg-emerald-400/16"
        )}
      />
      {particles.map((particle) => (
        <span
          key={particle}
          className="absolute h-1.5 w-1.5 rounded-full bg-primary/70 shadow-glow"
          style={{
            left: `${12 + ((particle * 23) % 76)}%`,
            top: `${10 + ((particle * 31) % 78)}%`,
            animation: `particleDrift ${5 + (particle % 7)}s ease-in-out ${particle * 90}ms infinite alternate`,
            opacity: 0.35 + (particle % 5) * 0.1
          }}
        />
      ))}
    </div>
  );
}
