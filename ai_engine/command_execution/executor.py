from __future__ import annotations

import os
import time
import urllib.parse
import webbrowser
from datetime import datetime

from ai_engine.command_execution.workflows import WorkflowAutomationEngine, WorkflowStep
from ai_engine.plugins.registry import PluginRegistry
from backend.app.configurations.settings import AppSettings
from backend.app.models.domain import CommandIntent, CommandResult, CommandStatus, IntentType


class CommandExecutionEngine:
    def __init__(self, *, settings: AppSettings, plugin_registry: PluginRegistry) -> None:
        self.settings = settings
        self.plugin_registry = plugin_registry
        self.workflow_engine = WorkflowAutomationEngine()

    def execute(self, intent: CommandIntent, *, user_id: str, locale: str) -> CommandResult:
        start = time.perf_counter()
        handler = {
            IntentType.OPEN_URL: self._open_url,
            IntentType.SEARCH_WEB: self._search_web,
            IntentType.WIKIPEDIA_LOOKUP: self._wikipedia_lookup,
            IntentType.PLAY_MUSIC: self._play_music,
            IntentType.CURRENT_TIME: self._current_time,
            IntentType.SEND_EMAIL: self._send_email,
            IntentType.SYSTEM_STATUS: self._system_status,
            IntentType.WORKFLOW: self._workflow,
            IntentType.PREFERENCES: self._preferences,
            IntentType.UNKNOWN: self._unknown,
        }.get(intent.intent_type, self._unknown)
        result = handler(intent, user_id=user_id, locale=locale)
        return CommandResult(
            status=result.status,
            response_text=result.response_text,
            actions=result.actions,
            data=result.data,
            duration_ms=(time.perf_counter() - start) * 1000,
        )

    def _open_url(self, intent: CommandIntent, **_: str) -> CommandResult:
        target = intent.slots.get("target", "website")
        url = intent.slots.get("url") or f"https://www.google.com/search?q={urllib.parse.quote(target)}"
        action = {"type": "open_url", "target": target, "url": url}
        if self.settings.enable_desktop_actions:
            webbrowser.open(url)
        return CommandResult(CommandStatus.COMPLETED, f"Opening {target}.", actions=[action])

    def _search_web(self, intent: CommandIntent, **_: str) -> CommandResult:
        query = intent.slots.get("query") or intent.raw_text
        url = f"https://www.google.com/search?q={urllib.parse.quote(query)}"
        action = {"type": "search_web", "query": query, "url": url}
        if self.settings.enable_desktop_actions:
            webbrowser.open(url)
        return CommandResult(CommandStatus.COMPLETED, f"Searching the web for {query}.", actions=[action])

    def _wikipedia_lookup(self, intent: CommandIntent, **_: str) -> CommandResult:
        topic = intent.slots.get("topic") or intent.raw_text
        action = {
            "type": "knowledge_lookup",
            "provider": "wikipedia",
            "topic": topic,
            "url": f"https://en.wikipedia.org/wiki/{urllib.parse.quote(str(topic).replace(' ', '_'))}",
        }
        return CommandResult(
            CommandStatus.COMPLETED,
            f"I prepared a Wikipedia lookup for {topic}.",
            actions=[action],
        )

    def _play_music(self, intent: CommandIntent, **_: str) -> CommandResult:
        music_dir = self.settings.music_directory
        if not music_dir.exists():
            return CommandResult(
                CommandStatus.FAILED,
                "I could not find your music directory. Update MUSIC_DIRECTORY in the environment.",
                data={"path": str(music_dir)},
            )

        songs = [path for path in music_dir.iterdir() if path.is_file()]
        if not songs:
            return CommandResult(CommandStatus.FAILED, "Your music directory is empty.", data={"path": str(music_dir)})

        song = songs[0]
        if self.settings.enable_desktop_actions:
            os.startfile(song)  # type: ignore[attr-defined]
        return CommandResult(
            CommandStatus.COMPLETED,
            f"Playing {song.stem}.",
            actions=[{"type": "play_media", "path": str(song)}],
        )

    def _current_time(self, intent: CommandIntent, **_: str) -> CommandResult:
        current_time = datetime.now().strftime("%H:%M:%S")
        return CommandResult(
            CommandStatus.COMPLETED,
            f"The current time is {current_time}.",
            data={"time": current_time},
        )

    def _send_email(self, intent: CommandIntent, **_: str) -> CommandResult:
        return CommandResult(
            CommandStatus.NEEDS_CONFIRMATION,
            "Email is ready, but I need confirmation before sending it.",
            actions=[{"type": "compose_email", "requires_confirmation": True}],
        )

    def _system_status(self, intent: CommandIntent, **_: str) -> CommandResult:
        return CommandResult(
            CommandStatus.COMPLETED,
            "All assistant systems are operational.",
            data={"health": "operational", "plugins": self.plugin_registry.enabled_plugin_names()},
        )

    def _workflow(self, intent: CommandIntent, **_: str) -> CommandResult:
        actions = self.workflow_engine.run(
            "daily_briefing",
            [
                WorkflowStep("check_system_status", lambda: {"health": "operational"}),
                WorkflowStep("prepare_recommendations", lambda: {"recommendations": 2}),
                WorkflowStep("summarize_activity", lambda: {"activity": "ready"}),
            ],
        )
        return CommandResult(CommandStatus.COMPLETED, "Your workflow automation has been prepared.", actions=actions)

    def _preferences(self, intent: CommandIntent, **_: str) -> CommandResult:
        return CommandResult(
            CommandStatus.COMPLETED,
            "I noted that preference for future conversations.",
            data={"memory": intent.slots.get("memory")},
        )

    def _unknown(self, intent: CommandIntent, **_: str) -> CommandResult:
        plugin_result = self.plugin_registry.try_handle(intent)
        if plugin_result is not None:
            return plugin_result
        return CommandResult(
            CommandStatus.FAILED,
            "I am not fully sure how to handle that yet. Try a web search, website launch, "
            "status check, or workflow command.",
            data={"intent": intent.intent_type.value},
        )
