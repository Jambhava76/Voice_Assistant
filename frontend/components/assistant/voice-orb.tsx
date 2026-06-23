"use client";

import { motion } from "framer-motion";
import { BrainCircuit, Mic2, Radio, Volume2 } from "lucide-react";
import { ParticleField } from "@/components/assistant/particle-field";
import type { AssistantState } from "@/types/assistant";
import { cn } from "@/lib/utils";

const stateCopy: Record<AssistantState, { label: string; icon: typeof Mic2; tone: string }> = {
  idle: { label: "Ready", icon: Mic2, tone: "from-primary/20 via-primary/8 to-secondary/16" },
  listening: { label: "Listening", icon: Radio, tone: "from-primary/30 via-cyan-300/18 to-emerald-300/18" },
  thinking: { label: "Thinking", icon: BrainCircuit, tone: "from-accent/24 via-primary/12 to-secondary/18" },
  speaking: { label: "Speaking", icon: Volume2, tone: "from-secondary/30 via-accent/14 to-primary/14" },
  error: { label: "Needs attention", icon: Mic2, tone: "from-destructive/24 via-accent/12 to-background" }
};

export function VoiceOrb({ state }: { state: AssistantState }) {
  const Icon = stateCopy[state].icon;

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[300px] sm:max-w-[360px] xl:max-w-[430px]">
      <div className="absolute inset-0">
        <ParticleField state={state} />
      </div>
      <motion.div
        className={cn(
          "absolute left-1/2 top-1/2 grid h-[54%] w-[54%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/18 bg-gradient-to-br shadow-glow backdrop-blur-xl",
          stateCopy[state].tone
        )}
        animate={{
          scale: state === "listening" ? [1, 1.045, 1] : state === "thinking" ? [1, 0.98, 1.035, 1] : [1, 1.02, 1],
          rotate: state === "thinking" ? [0, 8, -8, 0] : 0
        }}
        transition={{ duration: state === "thinking" ? 2.4 : 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="grid h-[72%] w-[72%] place-items-center rounded-full border border-white/20 bg-background/56">
          <Icon size={44} className="text-primary" aria-hidden />
          <span className="sr-only">{stateCopy[state].label}</span>
        </div>
      </motion.div>
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full border border-border/70 bg-card/80 px-4 py-2 text-sm font-semibold shadow-panel backdrop-blur">
        {stateCopy[state].label}
      </div>
    </div>
  );
}
