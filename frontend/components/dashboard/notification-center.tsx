"use client";

import { BellRing } from "lucide-react";
import { Panel } from "@/components/ui/panel";
import type { DashboardOverview } from "@/types/assistant";

export function NotificationCenter({ overview }: { overview: DashboardOverview }) {
  return (
    <Panel>
      <div className="mb-4 flex items-center gap-2">
        <BellRing size={18} className="text-accent" aria-hidden />
        <h2 className="text-sm font-semibold">Notification Center</h2>
      </div>
      <div className="space-y-3">
        {overview.notifications.map((notification) => (
          <div key={notification.message} className="rounded-lg border border-border/70 bg-background/38 p-3 text-sm">
            <div className="font-semibold">{notification.type}</div>
            <div className="mt-1 text-muted-foreground">{notification.message}</div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
