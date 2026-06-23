"use client";

import { create } from "zustand";
import type { AssistantState, CommandHistoryItem, VoiceCommandResponse } from "@/types/assistant";

type AssistantStore = {
  token?: string;
  user?: Record<string, unknown>;
  apiStatus: "connecting" | "online" | "offline";
  state: AssistantState;
  transcript: string;
  response?: VoiceCommandResponse;
  history: CommandHistoryItem[];
  preferences: {
    theme: "system" | "dark" | "light";
    voice: string;
    speechRate: number;
    wakeWord: string;
    notificationsEnabled: boolean;
    commandConfirmation: boolean;
    vadThreshold: number;
    noiseSuppression: boolean;
    echoCancellation: boolean;
    vadEnabled: boolean;
  };
  theme: "system" | "dark" | "light";
  setToken: (token: string) => void;
  setSession: (token: string, user: Record<string, unknown>) => void;
  setApiStatus: (status: "connecting" | "online" | "offline") => void;
  setState: (state: AssistantState) => void;
  setTranscript: (transcript: string) => void;
  setResponse: (response: VoiceCommandResponse) => void;
  addLocalTurn: (response: VoiceCommandResponse) => void;
  clearHistory: () => void;
  updatePreference: <K extends keyof AssistantStore["preferences"]>(
    key: K,
    value: AssistantStore["preferences"][K]
  ) => void;
  setTheme: (theme: "system" | "dark" | "light") => void;
};

const defaultPreferences: AssistantStore["preferences"] = {
  theme: "dark",
  voice: "professional_female",
  speechRate: 175,
  wakeWord: "Jarvis",
  notificationsEnabled: true,
  commandConfirmation: true,
  vadThreshold: 68,
  noiseSuppression: true,
  echoCancellation: true,
  vadEnabled: true
};

function loadStoredState() {
  if (typeof window === "undefined") {
    return { history: [], preferences: defaultPreferences };
  }
  try {
    const history = JSON.parse(window.localStorage.getItem("jarvis.history") ?? "[]") as CommandHistoryItem[];
    const preferences = {
      ...defaultPreferences,
      ...(JSON.parse(window.localStorage.getItem("jarvis.preferences") ?? "{}") as Partial<typeof defaultPreferences>)
    };
    return { history, preferences };
  } catch {
    return { history: [], preferences: defaultPreferences };
  }
}

function persist(history: CommandHistoryItem[], preferences: AssistantStore["preferences"]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("jarvis.history", JSON.stringify(history));
  window.localStorage.setItem("jarvis.preferences", JSON.stringify(preferences));
}

export const useAssistantStore = create<AssistantStore>((set, get) => {
  const stored = loadStoredState();
  return {
    state: "idle",
    transcript: "",
    history: stored.history,
    preferences: stored.preferences,
    theme: stored.preferences.theme,
    apiStatus: "connecting",
    setToken: (token) => set({ token }),
    setSession: (token, user) => set({ token, user, apiStatus: "online" }),
    setApiStatus: (apiStatus) => set({ apiStatus }),
    setState: (state) => set({ state }),
    setTranscript: (transcript) => set({ transcript }),
    setResponse: (response) => set({ response, state: "speaking" }),
    addLocalTurn: (response) =>
      set((store) => {
        const history = [
          {
            command_id: response.command_id,
            user_id: "demo-user",
            transcript: response.transcript,
            response_text: response.response_text,
            intent: response.intent,
            confidence: response.confidence,
            created_at: new Date().toISOString(),
            metadata: { source: "frontend-demo" }
          },
          ...store.history
        ].slice(0, 30);
        persist(history, store.preferences);
        return { response, state: "speaking", history };
      }),
    clearHistory: () =>
      set((store) => {
        persist([], store.preferences);
        return { history: [], response: undefined, transcript: "" };
      }),
    updatePreference: (key, value) =>
      set((store) => {
        const preferences = { ...store.preferences, [key]: value };
        persist(store.history, preferences);
        return { preferences, theme: preferences.theme };
      }),
    setTheme: (theme) => {
      const preferences = { ...get().preferences, theme };
      persist(get().history, preferences);
      set({ theme, preferences });
    }
  };
});
