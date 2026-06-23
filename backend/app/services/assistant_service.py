from __future__ import annotations

import time
from dataclasses import asdict

from ai_engine.command_execution.executor import CommandExecutionEngine
from ai_engine.context_management.manager import ConversationContextManager
from ai_engine.intent_detection.detector import IntentDetector
from ai_engine.plugins.registry import PluginRegistry
from backend.app.configurations.settings import AppSettings
from backend.app.models.domain import AssistantState, ConversationTurn
from backend.app.repositories.base import CommandRepository
from backend.app.utilities.ids import make_id
from backend.app.utilities.time import greeting_for, now_utc


class AssistantService:
    def __init__(
        self,
        *,
        settings: AppSettings,
        command_repository: CommandRepository,
        intent_detector: IntentDetector,
        command_engine: CommandExecutionEngine,
        context_manager: ConversationContextManager,
        plugin_registry: PluginRegistry,
    ) -> None:
        self.settings = settings
        self.command_repository = command_repository
        self.intent_detector = intent_detector
        self.command_engine = command_engine
        self.context_manager = context_manager
        self.plugin_registry = plugin_registry
        self.started_at = time.monotonic()
        self.state = AssistantState.IDLE

    def welcome_message(self) -> str:
        return f"{greeting_for()}. I am {self.settings.assistant_name}. How may I help you?"

    def handle_text_command(
        self,
        *,
        text: str,
        user_id: str,
        locale: str,
        metadata: dict,
    ) -> dict:
        command_id = make_id("cmd")
        start = time.perf_counter()
        self.state = AssistantState.THINKING

        recent_context = self.context_manager.get_context(user_id)
        intent = self.intent_detector.detect(text, context=recent_context, locale=locale)
        result = self.command_engine.execute(intent, user_id=user_id, locale=locale)

        elapsed_ms = (time.perf_counter() - start) * 1000
        self.state = AssistantState.SPEAKING if result.response_text else AssistantState.IDLE

        turn = ConversationTurn(
            command_id=command_id,
            user_id=user_id,
            transcript=text,
            response_text=result.response_text,
            intent=intent.intent_type,
            confidence=intent.confidence,
            created_at=now_utc(),
            metadata={
                **metadata,
                "locale": locale,
                "duration_ms": round(elapsed_ms, 2),
                "slots": intent.slots,
                "source": intent.source,
            },
        )
        self.command_repository.save_turn(turn)
        self.context_manager.add_turn(turn)
        self.state = AssistantState.IDLE

        return {
            "command_id": command_id,
            "status": result.status.value,
            "transcript": text,
            "response_text": result.response_text,
            "intent": intent.intent_type.value,
            "confidence": intent.confidence,
            "actions": result.actions,
            "context": self.context_manager.summary(user_id),
            "metrics": {
                "duration_ms": round(elapsed_ms, 2),
                "engine_duration_ms": round(result.duration_ms, 2),
            },
        }

    def history(self, user_id: str, *, limit: int = 50) -> list[dict]:
        return [asdict(turn) for turn in self.command_repository.list_turns(user_id, limit=limit)]

    def status(self) -> dict:
        return {
            "state": self.state.value,
            "assistant_name": self.settings.assistant_name,
            "locale": self.settings.default_locale,
            "active_plugins": self.plugin_registry.enabled_plugin_names(),
            "uptime_seconds": round(time.monotonic() - self.started_at, 2),
        }
