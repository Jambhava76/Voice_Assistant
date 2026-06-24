"use client";

import { cn } from "@/lib/utils";
import type { AssistantState } from "@/types/assistant";

export function Waveform({ state }: { state: AssistantState }) {
  const bars = Array.from({ length: 32 }, (_, index) => index);
  const active = state === "listening" || state === "speaking";

  return (
    <div className="flex h-14 items-center justify-center gap-1 rounded-lg border border-border/70 bg-background/34 px-3" aria-label="Voice waveform">
      {bars.map((bar) => (
        <span
          key={bar}
          className={cn(
            "block w-1 rounded-full",
            active ? "animate-waveform bg-primary" : state === "thinking" ? "bg-secondary" : "bg-muted-foreground/35"
          )}
          style={{
            height: `${10 + ((bar * 7) % 34)}px`,
            animationDelay: `${bar * 34}ms`,
            opacity: active ? 0.52 + ((bar % 5) * 0.09) : 0.42
          }}
        />
      ))}
    </div>
  );
}
