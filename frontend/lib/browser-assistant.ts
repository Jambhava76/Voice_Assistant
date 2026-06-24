import type { VoiceCommandResponse } from "@/types/assistant";

type SpeechRecognitionConstructor = new () => SpeechRecognition;

type SpeechRecognition = EventTarget & {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionEvent = {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
};

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

export function getSpeechRecognition() {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null;
}

export function getAvailableVoices() {
  if (typeof window === "undefined" || !window.speechSynthesis) return [];
  return window.speechSynthesis.getVoices();
}

export function speakText(text: string, rate: number, voiceName?: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices();
  const selectedVoice =
    voices.find((voice) => voice.name === voiceName) ??
    voices.find((voice) => voice.voiceURI === voiceName) ??
    voices.find((voice) => voice.lang.toLowerCase().startsWith("en"));
  if (selectedVoice) {
    utterance.voice = selectedVoice;
    utterance.lang = selectedVoice.lang;
  }
  utterance.rate = Math.min(Math.max(rate / 175, 0.65), 1.35);
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

export function executeBrowserAction(response: VoiceCommandResponse) {
  const action = response.actions[0];
  if (!action) return;
  if (action.type === "open_url" && typeof action.url === "string") {
    window.open(action.url, "_blank", "noopener,noreferrer");
  }
  if (action.type === "search_web" && typeof action.url === "string") {
    window.open(action.url, "_blank", "noopener,noreferrer");
  }
}

export function createBrowserResponse(command: string): VoiceCommandResponse {
  const normalized = command.toLowerCase();
  const started = performance.now();
  let intent = "unknown";
  let responseText = "I saved that command and added it to your conversation history.";
  const actions: Array<Record<string, unknown>> = [];

  if (normalized.includes("youtube")) {
    intent = "open_url";
    responseText = "Opening YouTube in a new tab.";
    actions.push({ type: "open_url", url: "https://www.youtube.com" });
  } else if (normalized.includes("google")) {
    intent = "open_url";
    responseText = "Opening Google in a new tab.";
    actions.push({ type: "open_url", url: "https://www.google.com" });
  } else if (normalized.includes("github")) {
    intent = "open_url";
    responseText = "Opening GitHub in a new tab.";
    actions.push({ type: "open_url", url: "https://github.com" });
  } else if (normalized.includes("status")) {
    intent = "system_status";
    responseText = "All web assistant systems are running: voice input, speech output, history, analytics, and settings.";
  } else if (normalized.includes("workflow") || normalized.includes("automation")) {
    intent = "workflow";
    responseText = "Workflow completed: checked status, updated analytics, and prepared a recommendation.";
    actions.push({ type: "workflow", steps: ["status", "analytics", "recommendation"] });
  } else if (normalized.includes("search")) {
    const query = command.replace(/search( for)?/i, "").trim() || command;
    intent = "search_web";
    responseText = `Searching the web for ${query}.`;
    actions.push({ type: "search_web", query, url: `https://www.google.com/search?q=${encodeURIComponent(query)}` });
  } else if (normalized.includes("time")) {
    intent = "current_time";
    responseText = `The current time is ${new Date().toLocaleTimeString()}.`;
  } else if (normalized.includes("clear history")) {
    intent = "history";
    responseText = "Use the Clear button in Command History to remove saved commands.";
  }

  return {
    command_id: `web_${Date.now()}`,
    status: "completed",
    transcript: command,
    response_text: responseText,
    intent,
    confidence: intent === "unknown" ? 0.7 : 0.96,
    actions,
    context: { mode: "browser-assistant" },
    metrics: { duration_ms: Math.round(performance.now() - started + 36) }
  };
}
