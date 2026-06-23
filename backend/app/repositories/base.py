from __future__ import annotations

from abc import ABC, abstractmethod
from collections.abc import Sequence

from backend.app.models.domain import ConversationTurn


class CommandRepository(ABC):
    @abstractmethod
    def save_turn(self, turn: ConversationTurn) -> None:
        raise NotImplementedError

    @abstractmethod
    def list_turns(self, user_id: str, *, limit: int = 50) -> Sequence[ConversationTurn]:
        raise NotImplementedError

    @abstractmethod
    def count_by_intent(self) -> dict[str, int]:
        raise NotImplementedError

    @abstractmethod
    def total_commands(self) -> int:
        raise NotImplementedError


class PreferencesRepository(ABC):
    @abstractmethod
    def get_preferences(self, user_id: str) -> dict:
        raise NotImplementedError

    @abstractmethod
    def save_preferences(self, user_id: str, preferences: dict) -> dict:
        raise NotImplementedError


class UserRepository(ABC):
    @abstractmethod
    def ensure_user(self, *, user_id: str, email: str, password_hash: str, roles: list[str]) -> None:
        raise NotImplementedError

    @abstractmethod
    def get_user_by_email(self, email: str) -> dict | None:
        raise NotImplementedError
