from __future__ import annotations

from abc import ABC, abstractmethod

from backend.app.models.domain import CommandIntent, CommandResult


class AssistantPlugin(ABC):
    name: str
    enabled: bool = True

    @abstractmethod
    def can_handle(self, intent: CommandIntent) -> bool:
        raise NotImplementedError

    @abstractmethod
    def handle(self, intent: CommandIntent) -> CommandResult:
        raise NotImplementedError
