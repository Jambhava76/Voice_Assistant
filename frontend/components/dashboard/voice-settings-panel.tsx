"use client";

import { Mic2, RadioTower } from "lucide-react";
import { Panel } from "@/components/ui/panel";
import { useAssistantStore } from "@/store/assistant-store";

export function VoiceSettingsPanel() {
  const { preferences, updatePreference } = useAssistantStore();

  return (
    <Panel>
      <div className="mb-4 flex items-center gap-2">
        <RadioTower size={18} className="text-primary" aria-hidden />
        <h2 className="text-sm font-semibold">Voice Settings</h2>
      </div>
      <div className="space-y-4">
        <label className="block">
          <span className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
            <Mic2 size={16} aria-hidden />
            Voice activity threshold: {preferences.vadThreshold}
          </span>
          <input
            className="w-full accent-primary"
            type="range"
            min="0"
            max="100"
            value={preferences.vadThreshold}
            onChange={(event) => updatePreference("vadThreshold", Number(event.target.value))}
            aria-label="Voice activity threshold"
          />
        </label>
        <label className="block">
          <span className="mb-2 text-sm text-muted-foreground">Speech rate: {preferences.speechRate}</span>
          <input
            className="w-full accent-secondary"
            type="range"
            min="80"
            max="260"
            value={preferences.speechRate}
            onChange={(event) => updatePreference("speechRate", Number(event.target.value))}
            aria-label="Speech rate"
          />
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            ["Noise", "noiseSuppression"],
            ["Echo", "echoCancellation"],
            ["VAD", "vadEnabled"]
          ].map(([item, key]) => (
            <button
              key={item}
              className="rounded-md border border-border/70 px-3 py-2 text-sm font-semibold hover:bg-muted data-[active=true]:bg-primary/14 data-[active=true]:text-primary"
              data-active={preferences[key as "noiseSuppression" | "echoCancellation" | "vadEnabled"]}
              onClick={() =>
                updatePreference(
                  key as "noiseSuppression" | "echoCancellation" | "vadEnabled",
                  !preferences[key as "noiseSuppression" | "echoCancellation" | "vadEnabled"]
                )
              }
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </Panel>
  );
}
