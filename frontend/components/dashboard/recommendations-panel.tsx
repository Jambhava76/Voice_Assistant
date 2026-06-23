"use client";

import { Lightbulb } from "lucide-react";
import { Panel } from "@/components/ui/panel";
import type { DashboardOverview } from "@/types/assistant";

export function RecommendationsPanel({ overview }: { overview: DashboardOverview }) {
  return (
    <Panel>
      <div className="mb-4 flex items-center gap-2">
        <Lightbulb size={18} className="text-secondary" aria-hidden />
        <h2 className="text-sm font-semibold">Smart Recommendations</h2>
      </div>
      <div className="space-y-3">
        {overview.recommendations.map((recommendation) => (
          <article key={recommendation.title} className="rounded-lg border border-border/70 bg-background/38 p-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold">{recommendation.title}</h3>
              <span className="rounded-md bg-secondary/16 px-2 py-1 text-xs font-semibold text-secondary">{recommendation.priority}</span>
            </div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{recommendation.detail}</p>
          </article>
        ))}
      </div>
    </Panel>
  );
}
