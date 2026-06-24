"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { AnalyticsPanel } from "@/components/dashboard/analytics-panel";
import { NotificationCenter } from "@/components/dashboard/notification-center";
import { PreferencesPanel } from "@/components/dashboard/preferences-panel";
import { RecommendationsPanel } from "@/components/dashboard/recommendations-panel";
import { StatusStrip } from "@/components/dashboard/status-strip";
import { VoiceSettingsPanel } from "@/components/dashboard/voice-settings-panel";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { CommandConsole } from "@/components/assistant/command-console";
import { VoiceOrb } from "@/components/assistant/voice-orb";
import { Waveform } from "@/components/assistant/waveform";
import { Panel } from "@/components/ui/panel";
import { assistantApi, getApiBaseUrl } from "@/services/api-client";
import { useAssistantStore } from "@/store/assistant-store";
import { AmbientGradient } from "@/components/layout/ambient-gradient";
import { cn } from "@/lib/utils";

const fallbackOverview = {
  assistant: {
    state: "idle" as const,
    assistant_name: "Jarvis",
    locale: "en-IN",
    active_plugins: ["smart_recommendations"],
    uptime_seconds: 0
  },
  usage: {
    total_commands: 0,
    automation_runs: 0,
    voice_shortcuts: 0,
    by_intent: {}
  },
  performance: {
    average_latency_ms: 184,
    recognition_accuracy: 0.94,
    api_cache_hit_rate: 0.81,
    system_health: "operational"
  },
  recent_activities: [],
  notifications: [
    { type: "system", message: "Connect the backend to activate live telemetry.", severity: "warning" }
  ],
  recommendations: [
    {
      title: "Try a command",
      detail: "Run a search, website launch, workflow, or status command from the console.",
      priority: "medium"
    }
  ]
};

export function DashboardShell() {
  const { token, state, transcript, theme, history, apiStatus, setApiStatus, setSession } = useAssistantStore();

  useEffect(() => {
    if (token) return;
    setApiStatus("connecting");
    assistantApi
      .health()
      .then(() => assistantApi.login("admin@example.com", "admin123"))
      .then((session) => setSession(session.access_token, session.user))
      .catch(() => setApiStatus("offline"));
  }, [setApiStatus, setSession, token]);

  const overviewQuery = useQuery({
    queryKey: ["dashboard-overview", token],
    queryFn: async () => {
      const overview = await assistantApi.overview(token);
      setApiStatus("online");
      return overview;
    },
    enabled: Boolean(token),
    refetchInterval: 8_000,
    retry: 1
  });

  const localIntentCounts = history.reduce<Record<string, number>>((counts, item) => {
    counts[item.intent] = (counts[item.intent] ?? 0) + 1;
    return counts;
  }, {});
  const overview = {
    ...(overviewQuery.data ?? fallbackOverview),
    usage: {
      ...(overviewQuery.data ?? fallbackOverview).usage,
      total_commands: Math.max((overviewQuery.data ?? fallbackOverview).usage.total_commands, history.length),
      voice_shortcuts: Math.max((overviewQuery.data ?? fallbackOverview).usage.voice_shortcuts, history.length),
      by_intent: {
        ...(overviewQuery.data ?? fallbackOverview).usage.by_intent,
        ...localIntentCounts
      }
    },
    recent_activities: history.length ? history : (overviewQuery.data ?? fallbackOverview).recent_activities
  };

  return (
    <main className={cn("min-h-screen overflow-x-hidden bg-background text-foreground", theme === "dark" && "dark")}>
      <AmbientGradient />
      <div className="mesh-grid flex min-h-screen min-w-0">
        <Sidebar />
        <div className="min-w-0 flex-1 overflow-x-hidden">
          <Topbar />
          <div className="mx-auto w-full max-w-[1500px] space-y-4 p-3 sm:p-4 lg:p-5">
            <StatusStrip overview={overview} />

            <div className="grid min-w-0 gap-4 2xl:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
              <Panel className="gradient-border overflow-hidden p-0">
                <div className="grid min-w-0 gap-4 p-3 sm:p-4 lg:grid-cols-[minmax(320px,1fr)_minmax(280px,0.75fr)] 2xl:min-h-[480px]">
                  <div className="flex flex-col justify-between gap-5">
                    <div>
                      <div className="inline-flex items-center rounded-full border border-border/70 bg-card/70 px-3 py-1 text-xs font-semibold text-primary">
                        {overview.assistant.assistant_name} | {overview.assistant.locale}
                      </div>
                      <h2 className="mt-3 text-xl font-semibold tracking-normal sm:text-2xl">Voice Command Center</h2>
                      <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                        Control voice input, backend commands, SQLite history, preferences, analytics, and browser actions from one console.
                      </p>
                      <div className="mt-3 inline-flex rounded-md border border-border/70 bg-background/42 px-3 py-2 text-xs font-semibold">
                        Backend: {apiStatus === "online" ? "Connected to SQLite API" : "Offline fallback active"}
                      </div>
                      <div className="mt-2 break-all text-xs text-muted-foreground">API URL: {getApiBaseUrl()}</div>
                    </div>
                    <Waveform state={state} />
                    <CommandConsole />
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-lg border border-border/70 bg-background/42 p-3 text-sm text-muted-foreground"
                    >
                      Transcript: <span className="font-semibold text-foreground">{transcript || "Waiting for input"}</span>
                    </motion.div>
                  </div>

                  <div className="order-first grid min-h-[260px] place-items-center rounded-lg border border-border/60 bg-background/22 p-2 lg:order-none lg:min-h-0">
                    <VoiceOrb state={state} />
                  </div>
                </div>
              </Panel>

              <div className="grid min-w-0 gap-3 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] 2xl:grid-cols-1">
                <PreferencesPanel />
                <VoiceSettingsPanel />
              </div>
            </div>

            <div className="grid min-w-0 gap-4 2xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.48fr)]">
              <ActivityFeed items={overview.recent_activities} />
              <div className="grid min-w-0 gap-4 lg:grid-cols-3 2xl:grid-cols-1">
                <AnalyticsPanel overview={overview} />
                <NotificationCenter overview={overview} />
                <RecommendationsPanel overview={overview} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
