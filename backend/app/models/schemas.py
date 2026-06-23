from __future__ import annotations

from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class ErrorResponse(BaseModel):
    error_code: str
    message: str
    details: dict[str, Any] = Field(default_factory=dict)


class VoiceCommandRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=2000)
    user_id: str = Field(default="demo-user", min_length=1)
    locale: str = Field(default="en-IN")
    mode: Literal["text", "voice"] = "text"
    metadata: dict[str, Any] = Field(default_factory=dict)


class VoiceCommandResponse(BaseModel):
    command_id: str
    status: str
    transcript: str
    response_text: str
    intent: str
    confidence: float
    actions: list[dict[str, Any]]
    context: dict[str, Any]
    metrics: dict[str, Any]


class AssistantStatusResponse(BaseModel):
    state: str
    assistant_name: str
    locale: str
    active_plugins: list[str]
    uptime_seconds: float


class CommandHistoryItem(BaseModel):
    command_id: str
    user_id: str
    transcript: str
    response_text: str
    intent: str
    confidence: float
    created_at: datetime
    metadata: dict[str, Any] = Field(default_factory=dict)
    model_config = ConfigDict(from_attributes=True)


class DashboardOverview(BaseModel):
    assistant: AssistantStatusResponse
    usage: dict[str, Any]
    performance: dict[str, Any]
    recent_activities: list[CommandHistoryItem]
    notifications: list[dict[str, Any]]
    recommendations: list[dict[str, Any]]


class AuthRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=4)


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict[str, Any]


class UserPreferences(BaseModel):
    theme: Literal["system", "light", "dark"] = "system"
    voice: str = "professional_female"
    speech_rate: int = Field(default=175, ge=80, le=260)
    wake_word: str = "Jarvis"
    notifications_enabled: bool = True
    command_confirmation: bool = True
