"use client";

import { Download, History, Trash2 } from "lucide-react";
import { Panel } from "@/components/ui/panel";
import type { CommandHistoryItem } from "@/types/assistant";
import { Button } from "@/components/ui/button";
import { useAssistantStore } from "@/store/assistant-store";

export function ActivityFeed({ items }: { items: CommandHistoryItem[] }) {
  const { clearHistory } = useAssistantStore();

  function exportLogs() {
    const blob = new Blob([JSON.stringify(items, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "jarvis-command-history.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Panel className="min-h-[320px]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <History size={18} className="text-primary" aria-hidden />
          Command History
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{items.length} latest</span>
          <Button variant="ghost" className="h-8 px-2 text-xs" onClick={exportLogs} disabled={!items.length}>
            <Download size={14} aria-hidden />
            Export
          </Button>
          <Button variant="ghost" className="h-8 px-2 text-xs" onClick={clearHistory} disabled={!items.length}>
            <Trash2 size={14} aria-hidden />
            Clear
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-5 text-sm text-muted-foreground">
            No commands yet. Run one from the voice console to populate history.
          </div>
        ) : (
          items.map((item) => (
            <article key={item.command_id} className="rounded-lg border border-border/70 bg-background/38 p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold">{item.transcript}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.response_text}</p>
                </div>
                <span className="rounded-md bg-primary/12 px-2 py-1 text-xs font-semibold text-primary">{item.intent}</span>
              </div>
            </article>
          ))
        )}
      </div>
    </Panel>
  );
}
