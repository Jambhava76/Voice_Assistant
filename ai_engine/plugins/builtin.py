from __future__ import annotations

from ai_engine.plugins.base import AssistantPlugin
from ai_engine.plugins.registry import PluginRegistry
from backend.app.models.domain import CommandIntent, CommandResult, CommandStatus, IntentType


class SmartRecommendationPlugin(AssistantPlugin):
    name = "smart_recommendations"

    def can_handle(self, intent: CommandIntent) -> bool:
        return intent.intent_type == IntentType.UNKNOWN and "recommend" in intent.raw_text.lower()

    def handle(self, intent: CommandIntent) -> CommandResult:
        return CommandResult(
            CommandStatus.COMPLETED,
            "Based on your recent activity, I recommend creating a shortcut for repeated daily tasks.",
            data={"recommendation": "daily_shortcut"},
        )


def register_builtin_plugins(registry: PluginRegistry) -> None:
    registry.register(SmartRecommendationPlugin())
