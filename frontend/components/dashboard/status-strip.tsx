"use client";

import { Activity, Bot, Cpu, Gauge, Zap } from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import type { DashboardOverview } from "@/types/assistant";

export function StatusStrip({ overview }: { overview: DashboardOverview }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        label="AI Assistant Status"
        value={overview.assistant.state}
        icon={<Bot size={18} aria-hidden />}
        trend={`${overview.assistant.active_plugins.length} plugins`}
      />
      <MetricCard
        label="Command Volume"
        value={overview.usage.total_commands}
        icon={<Zap size={18} aria-hidden />}
        trend={`${overview.usage.voice_shortcuts} shortcuts`}
      />
      <MetricCard
        label="Recognition Accuracy"
        value={`${Math.round(overview.performance.recognition_accuracy * 100)}%`}
        icon={<Gauge size={18} aria-hidden />}
        trend={`${overview.performance.average_latency_ms} ms`}
      />
      <MetricCard
        label="System Health"
        value={overview.performance.system_health}
        icon={<Cpu size={18} aria-hidden />}
        trend={<span className="inline-flex items-center gap-1"><Activity size={13} aria-hidden /> live</span>}
      />
    </div>
  );
}
