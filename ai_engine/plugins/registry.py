from __future__ import annotations

from ai_engine.plugins.base import AssistantPlugin
from backend.app.models.domain import CommandIntent, CommandResult


class PluginRegistry:
    def __init__(self) -> None:
        self._plugins: list[AssistantPlugin] = []

    def register(self, plugin: AssistantPlugin) -> None:
        self._plugins.append(plugin)

    def enabled_plugin_names(self) -> list[str]:
        return [plugin.name for plugin in self._plugins if plugin.enabled]

    def try_handle(self, intent: CommandIntent) -> CommandResult | None:
        for plugin in self._plugins:
            if plugin.enabled and plugin.can_handle(intent):
                return plugin.handle(intent)
        return None
