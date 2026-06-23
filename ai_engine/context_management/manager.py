from __future__ import annotations

from collections import defaultdict, deque
from dataclasses import asdict

from backend.app.models.domain import ConversationTurn


class ConversationContextManager:
    def __init__(self, max_turns_per_user: int = 20) -> None:
        self.max_turns_per_user = max_turns_per_user
        self._turns: dict[str, deque[ConversationTurn]] = defaultdict(lambda: deque(maxlen=max_turns_per_user))

    def add_turn(self, turn: ConversationTurn) -> None:
        self._turns[turn.user_id].appendleft(turn)

    def get_context(self, user_id: str) -> dict:
        turns = list(self._turns[user_id])
        return {
            "turn_count": len(turns),
            "recent_intents": [turn.intent.value for turn in turns[:5]],
            "last_transcript": turns[0].transcript if turns else None,
        }

    def summary(self, user_id: str) -> dict:
        turns = list(self._turns[user_id])
        return {
            "memory_depth": len(turns),
            "last_turn": asdict(turns[0]) if turns else None,
        }
