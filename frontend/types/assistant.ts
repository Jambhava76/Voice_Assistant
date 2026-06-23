export type AssistantState = "idle" | "listening" | "thinking" | "speaking" | "error";

export type CommandHistoryItem = {
  command_id: string;
  user_id: string;
  transcript: string;
  response_text: string;
  intent: string;
  confidence: number;
  created_at: string;
  metadata: Record<string, unknown>;
};

export type AssistantStatus = {
  state: AssistantState;
  assistant_name: string;
  locale: string;
  active_plugins: string[];
  uptime_seconds: number;
};

export type DashboardOverview = {
  assistant: AssistantStatus;
  usage: {
    total_commands: number;
    automation_runs: number;
    voice_shortcuts: number;
    by_intent: Record<string, number>;
  };
  performance: {
    average_latency_ms: number;
    recognition_accuracy: number;
    api_cache_hit_rate: number;
    system_health: string;
  };
  recent_activities: CommandHistoryItem[];
  notifications: Array<{ type: string; message: string; severity: string }>;
  recommendations: Array<{ title: string; detail: string; priority: string }>;
};

export type VoiceCommandResponse = {
  command_id: string;
  status: string;
  transcript: string;
  response_text: string;
  intent: string;
  confidence: number;
  actions: Array<Record<string, unknown>>;
  context: Record<string, unknown>;
  metrics: Record<string, unknown>;
};

export type UserPreferences = {
  theme: "system" | "light" | "dark";
  voice: string;
  speech_rate: number;
  wake_word: string;
  notifications_enabled: boolean;
  command_confirmation: boolean;
};
