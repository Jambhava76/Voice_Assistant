"use client";

import {
  Activity,
  Bell,
  Bot,
  Gauge,
  History,
  Mic2,
  Settings,
  ShieldCheck,
  Sparkles,
  Workflow
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Assistant", icon: Bot, active: true },
  { label: "History", icon: History },
  { label: "Analytics", icon: Gauge },
  { label: "Workflows", icon: Workflow },
  { label: "Security", icon: ShieldCheck },
  { label: "Settings", icon: Settings }
];

export function Sidebar() {
  return (
    <aside className="hidden min-h-screen w-[264px] shrink-0 border-r border-border/60 bg-background/54 px-4 py-5 backdrop-blur-xl lg:block">
      <div className="flex items-center gap-3 px-2">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary text-primary-foreground shadow-glow">
          <Mic2 size={21} aria-hidden />
        </div>
        <div>
          <div className="text-sm font-semibold">Jarvis AI</div>
          <div className="text-xs text-muted-foreground">Enterprise Console</div>
        </div>
      </div>

      <nav className="mt-8 space-y-1" aria-label="Primary navigation">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={cn(
              "flex h-11 w-full items-center gap-3 rounded-md px-3 text-left text-sm font-medium transition",
              item.active ? "bg-primary/14 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon size={18} aria-hidden />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="mt-8 rounded-lg border border-border/70 bg-card/56 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Sparkles size={17} className="text-secondary" aria-hidden />
          Smart Layer
        </div>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Plugins, command memory, scheduling, and voice shortcuts are ready for extension.
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-md border border-border/70 p-3">
          <Activity size={16} className="mb-2 text-primary" aria-hidden />
          Live
        </div>
        <div className="rounded-md border border-border/70 p-3">
          <Bell size={16} className="mb-2 text-accent" aria-hidden />
          Alerts
        </div>
      </div>
    </aside>
  );
}
