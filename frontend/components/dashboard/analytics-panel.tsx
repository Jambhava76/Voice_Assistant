"use client";

import { BarChart3 } from "lucide-react";
import { Panel } from "@/components/ui/panel";
import type { DashboardOverview } from "@/types/assistant";

export function AnalyticsPanel({ overview }: { overview: DashboardOverview }) {
  const entries = Object.entries(overview.usage.by_intent);
  const max = Math.max(...entries.map(([, total]) => total), 1);

  return (
    <Panel>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <BarChart3 size={18} className="text-secondary" aria-hidden />
          Usage Analytics
        </h2>
        <span className="text-xs text-muted-foreground">API cache {Math.round(overview.performance.api_cache_hit_rate * 100)}%</span>
      </div>

      <div className="space-y-3">
        {entries.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-5 text-sm text-muted-foreground">
            Analytics will appear as commands are processed.
          </div>
        ) : (
          entries.map(([intent, total]) => (
            <div key={intent}>
              <div className="mb-1 flex justify-between text-xs">
                <span className="font-medium">{intent}</span>
                <span className="text-muted-foreground">{total}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-gradient-to-r from-primary via-secondary to-accent" style={{ width: `${(total / max) * 100}%` }} />
              </div>
            </div>
          ))
        )}
      </div>
    </Panel>
  );
}
