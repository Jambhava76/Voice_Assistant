"use client";

import { Bell, Moon, Search, ShieldCheck, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAssistantStore } from "@/store/assistant-store";
import { cn } from "@/lib/utils";

export function Topbar() {
  const { theme, apiStatus, setTheme } = useAssistantStore();
  const nextTheme = theme === "dark" ? "light" : "dark";

  function toggleTheme() {
    setTheme(nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  }

  return (
    <header className="sticky top-0 z-20 border-b border-border/60 bg-background/68 px-4 py-3 backdrop-blur-xl md:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold sm:text-xl md:text-2xl">AI Voice Assistant Platform</h1>
          <p className="mt-1 hidden text-sm text-muted-foreground sm:block">Operations dashboard for commands, voice state, analytics, and automation.</p>
        </div>

        <div className="flex items-center gap-2">
          <label className="hidden h-10 min-w-[260px] items-center gap-2 rounded-md border border-border/70 bg-card/70 px-3 md:flex">
            <Search size={17} className="text-muted-foreground" aria-hidden />
            <input
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              placeholder="Search commands"
              aria-label="Search commands"
            />
          </label>
          <div className="hidden items-center gap-2 rounded-md border border-border/70 bg-card/70 px-3 py-2 text-xs font-semibold sm:flex">
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                apiStatus === "online" ? "bg-emerald-400" : apiStatus === "connecting" ? "bg-secondary" : "bg-destructive"
              )}
            />
            API {apiStatus}
          </div>
          <Button variant="ghost" className="px-3" aria-label="Security status">
            <ShieldCheck size={18} aria-hidden />
          </Button>
          <Button variant="ghost" className="px-3" aria-label="Notifications">
            <Bell size={18} aria-hidden />
          </Button>
          <Button
            variant="ghost"
            className={cn("px-3", theme === "dark" && "text-secondary")}
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Moon size={18} aria-hidden /> : <Sun size={18} aria-hidden />}
          </Button>
        </div>
      </div>
    </header>
  );
}
