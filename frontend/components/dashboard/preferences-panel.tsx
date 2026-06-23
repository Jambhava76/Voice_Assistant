"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Bell, Palette, SlidersHorizontal, Volume2 } from "lucide-react";
import { Panel } from "@/components/ui/panel";
import { assistantApi } from "@/services/api-client";
import { useAssistantStore } from "@/store/assistant-store";
import type { UserPreferences } from "@/types/assistant";

export function PreferencesPanel() {
  const { token, preferences, updatePreference, setApiStatus } = useAssistantStore();

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
    <Panel>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <SlidersHorizontal size={18} className="text-primary" aria-hidden />
          User Preferences
        </h2>
        <span className="rounded-md bg-primary/12 px-2 py-1 text-xs font-semibold text-primary">
          {saveMutation.isPending ? "Saving" : "Saved"}
        </span>
      </div>

      <div className="grid gap-3 text-sm">
        <label className="grid gap-2 rounded-lg border border-border/70 p-3">
          <span className="flex items-center gap-2 text-muted-foreground">
            <Palette size={16} aria-hidden />
            Theme
          </span>
          <select
            className="h-9 rounded-md border border-border bg-background px-2"
            value={preferences.theme}
            onChange={(event) => savePreference("theme", event.target.value as "system" | "dark" | "light")}
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
            <option value="system">System</option>
          </select>
        </label>
        <label className="grid gap-2 rounded-lg border border-border/70 p-3">
          <span className="flex items-center gap-2 text-muted-foreground">
            <Volume2 size={16} aria-hidden />
            Voice
          </span>
          <select
            className="h-9 rounded-md border border-border bg-background px-2"
            value={preferences.voice}
            onChange={(event) => savePreference("voice", event.target.value)}
          >
            <option value="professional_female">Professional Female</option>
            <option value="deep_male">Deep Male</option>
            <option value="neutral_fast">Neutral Fast</option>
          </select>
        </label>
        <button
          className="flex items-center justify-between rounded-lg border border-border/70 p-3 text-left hover:bg-muted"
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
