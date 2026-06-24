"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Bell, Palette, Play, SlidersHorizontal, Volume2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Panel } from "@/components/ui/panel";
import { Button } from "@/components/ui/button";
import { getAvailableVoices, speakText } from "@/lib/browser-assistant";
import { assistantApi } from "@/services/api-client";
import { useAssistantStore } from "@/store/assistant-store";
import type { UserPreferences } from "@/types/assistant";

export function PreferencesPanel() {
  const { token, preferences, updatePreference, setApiStatus } = useAssistantStore();
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    function loadVoices() {
      setVoices(getAvailableVoices());
    }
    loadVoices();
    window.speechSynthesis?.addEventListener("voiceschanged", loadVoices);
    return () => window.speechSynthesis?.removeEventListener("voiceschanged", loadVoices);
  }, []);

  useQuery({
    queryKey: ["preferences", token],
    queryFn: async () => {
      const data = await assistantApi.preferences(token);
      updatePreference("theme", data.theme);
      updatePreference("voice", data.voice);
      updatePreference("speechRate", data.speech_rate);
      updatePreference("wakeWord", data.wake_word);
      updatePreference("notificationsEnabled", data.notifications_enabled);
      updatePreference("commandConfirmation", data.command_confirmation);
      setApiStatus("online");
      return data;
    },
    enabled: Boolean(token),
    retry: 1
  });

  const saveMutation = useMutation({
    mutationFn: (next: UserPreferences) => assistantApi.savePreferences(next, token),
    onSuccess: () => setApiStatus("online"),
    onError: () => setApiStatus("offline")
  });

  function savePreference<K extends keyof typeof preferences>(key: K, value: (typeof preferences)[K]) {
    const next = { ...preferences, [key]: value };
    updatePreference(key, value);
    if (!token) return;
    saveMutation.mutate({
      theme: next.theme,
      voice: next.voice,
      speech_rate: next.speechRate,
      wake_word: next.wakeWord,
      notifications_enabled: next.notificationsEnabled,
      command_confirmation: next.commandConfirmation
    });
  }

  return (
    <Panel className="min-w-0 max-w-full p-3">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <SlidersHorizontal size={18} className="text-primary" aria-hidden />
          User Preferences
        </h2>
        <span className="rounded-md bg-primary/12 px-2 py-1 text-xs font-semibold text-primary">
          {saveMutation.isPending ? "Saving" : "Saved"}
        </span>
      </div>

      <div className="grid min-w-0 gap-2 text-sm">
        <label className="grid min-w-0 gap-1.5 rounded-md border border-border/70 p-2.5">
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            <Palette size={16} aria-hidden />
            Theme
          </span>
          <select
            className="h-8 w-full min-w-0 max-w-full rounded-md border border-border bg-background px-2 text-sm"
            value={preferences.theme}
            onChange={(event) => savePreference("theme", event.target.value as "system" | "dark" | "light")}
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
            <option value="system">System</option>
          </select>
        </label>
        <label className="grid min-w-0 gap-1.5 rounded-md border border-border/70 p-2.5">
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            <Volume2 size={16} aria-hidden />
            Voice
          </span>
          <div className="flex min-w-0 max-w-full gap-2">
            <select
              className="h-8 min-w-0 max-w-full flex-1 truncate rounded-md border border-border bg-background px-2 text-sm"
              value={preferences.voice}
              onChange={(event) => savePreference("voice", event.target.value)}
            >
              {voices.length === 0 ? (
                <option value={preferences.voice}>System default</option>
              ) : (
                voices.map((voice) => (
                  <option key={voice.voiceURI} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))
              )}
            </select>
            <Button
              type="button"
              variant="ghost"
              className="h-8 w-8 shrink-0 px-0"
              onClick={() => speakText("This is the selected assistant voice.", preferences.speechRate, preferences.voice)}
              aria-label="Test selected voice"
            >
              <Play size={15} aria-hidden />
            </Button>
          </div>
        </label>
        <button
          className="flex min-w-0 items-center justify-between rounded-md border border-border/70 p-2.5 text-left text-sm hover:bg-muted"
          onClick={() => savePreference("commandConfirmation", !preferences.commandConfirmation)}
        >
          <span className="flex items-center gap-2 text-muted-foreground">
            <Bell size={16} aria-hidden />
            Confirmation
          </span>
          <strong>{preferences.commandConfirmation ? "On" : "Off"}</strong>
        </button>
      </div>
    </Panel>
  );
}
