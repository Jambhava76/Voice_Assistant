from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from enum import StrEnum
from typing import Any


class AssistantState(StrEnum):
    IDLE = "idle"
    LISTENING = "listening"
    THINKING = "thinking"
    SPEAKING = "speaking"
    ERROR = "error"


class IntentType(StrEnum):
    OPEN_URL = "open_url"
    SEARCH_WEB = "search_web"
    WIKIPEDIA_LOOKUP = "wikipedia_lookup"
    PLAY_MUSIC = "play_music"
    CURRENT_TIME = "current_time"
    SEND_EMAIL = "send_email"
    SYSTEM_STATUS = "system_status"
    WORKFLOW = "workflow"
    PROFILE = "profile"
    PREFERENCES = "preferences"
    UNKNOWN = "unknown"


class CommandStatus(StrEnum):
    COMPLETED = "completed"
    NEEDS_CONFIRMATION = "needs_confirmation"
    FAILED = "failed"


@dataclass(frozen=True)
class CommandIntent:
    intent_type: IntentType
    confidence: float
    raw_text: str
    slots: dict[str, Any] = field(default_factory=dict)
    source: str = "rule_based"


@dataclass(frozen=True)
class CommandResult:
    status: CommandStatus
    response_text: str
    actions: list[dict[str, Any]] = field(default_factory=list)
    data: dict[str, Any] = field(default_factory=dict)
    duration_ms: float = 0.0


@dataclass(frozen=True)
class ConversationTurn:
    command_id: str
    user_id: str
    transcript: str
    response_text: str
    intent: IntentType
    confidence: float
    created_at: datetime
    metadata: dict[str, Any] = field(default_factory=dict)
