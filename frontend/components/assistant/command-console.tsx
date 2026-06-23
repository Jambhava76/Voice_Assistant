"use client";

import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Mic, Play, Send, Square } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { createBrowserResponse, executeBrowserAction, getSpeechRecognition, speakText } from "@/lib/browser-assistant";
import { assistantApi } from "@/services/api-client";
import { useAssistantStore } from "@/store/assistant-store";

export function CommandConsole() {
  const queryClient = useQueryClient();
  const [text, setText] = useState("open youtube");
  const [isListening, setIsListening] = useState(false);
  const {
    token,
    preferences,
    setToken,
    setApiStatus,
    setState,
    setTranscript,
    setResponse,
    addLocalTurn,
    response
  } = useAssistantStore();

  const loginMutation = useMutation({
    mutationFn: () => assistantApi.login("admin@example.com", "admin123"),
    onSuccess: (data) => {
      setToken(data.access_token);
      setApiStatus("online");
    },
    onError: () => setApiStatus("offline")
  });

  useEffect(() => {
    if (!token && loginMutation.status === "idle") {
      loginMutation.mutate();
    }
  }, [loginMutation, token]);

  const commandMutation = useMutation({
    mutationFn: (command: string) => assistantApi.sendCommand(command, token),
    onMutate: (command) => {
      setTranscript(command);
      setState("thinking");
    },
    onSuccess: (data) => {
      setResponse(data);
      speakText(data.response_text, preferences.speechRate);
      executeBrowserAction(data);
      queryClient.invalidateQueries({ queryKey: ["dashboard-overview"] });
      setApiStatus("online");
      window.setTimeout(() => setState("idle"), 2200);
    },
    onError: (_error, command) => {
      setApiStatus("offline");
      runLocalCommand(command);
    }
  });

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!text.trim()) return;
    const command = text.trim();
    if (token) {
      commandMutation.mutate(command);
      return;
    }
    runLocalCommand(command);
  }

  function simulateListening() {
    const Recognition = getSpeechRecognition();
    if (!Recognition) {
      runLocalCommand(text || "system status");
      return;
    }
    const recognition = new Recognition();
    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;
    setIsListening(true);
    setState("listening");
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript ?? "";
      setText(transcript);
      runQuickAction(transcript);
    };
    recognition.onerror = () => {
      setIsListening(false);
      setState("error");
    };
    recognition.onend = () => {
      setIsListening(false);
      setState("idle");
    };
    recognition.start();
  }

  function runLocalCommand(command: string) {
    setTranscript(command);
    setState("thinking");
    window.setTimeout(() => {
      const response = createBrowserResponse(command);
      addLocalTurn(response);
      executeBrowserAction(response);
      speakText(response.response_text, preferences.speechRate);
      window.setTimeout(() => setState("idle"), 1800);
    }, 450);
  }

  function runQuickAction(command: string) {
    setText(command);
    if (token) {
      commandMutation.mutate(command);
      return;
    }
    runLocalCommand(command);
  }

  return (
    <div className="space-y-4">
      <form className="flex flex-col gap-3 sm:flex-row" onSubmit={submit}>
        <label className="flex min-h-12 flex-1 items-center rounded-lg border border-border/70 bg-card/70 px-4">
          <input
            value={text}
            onChange={(event) => setText(event.target.value)}
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            placeholder="Ask Jarvis to search, open, schedule, automate..."
            aria-label="Voice command"
          />
        </label>
        <div className="grid grid-cols-3 gap-2 sm:flex">
          <Button type="button" variant="secondary" className="px-3" onClick={simulateListening} aria-label="Start voice input">
            <Mic size={18} aria-hidden />
            <span className="sr-only">{isListening ? "Listening" : "Voice"}</span>
          </Button>
          <Button type="submit" className="col-span-1" disabled={commandMutation.isPending}>
            {commandMutation.isPending ? <Loader2 size={17} className="animate-spin" aria-hidden /> : <Send size={17} aria-hidden />}
            Run
          </Button>
          <Button type="button" variant="ghost" className="px-3" onClick={() => setState("idle")} aria-label="Stop">
            <Square size={17} aria-hidden />
          </Button>
        </div>
      </form>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {["open youtube", "system status", "run workflow", "search ai tools"].map((command) => (
          <Button
            key={command}
            type="button"
            variant="ghost"
            className="h-9 justify-start border border-border/70 px-3 text-xs"
            onClick={() => runQuickAction(command)}
          >
            <Play size={14} aria-hidden />
            {command}
          </Button>
        ))}
      </div>

      <AnimatePresence mode="popLayout">
        {response ? (
          <motion.div
            key={response.command_id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="rounded-lg border border-border/70 bg-background/48 p-4"
          >
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
              <span>{response.status}</span>
              <span>Intent: {response.intent}</span>
              <span>Confidence: {Math.round(response.confidence * 100)}%</span>
            </div>
            <p className="mt-2 text-sm leading-6">{response.response_text}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
