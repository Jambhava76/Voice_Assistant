from __future__ import annotations

from datetime import UTC, datetime


def now_utc() -> datetime:
    return datetime.now(tz=UTC)


def greeting_for(hour: int | None = None) -> str:
    current_hour = hour if hour is not None else datetime.now().hour
    if current_hour < 12:
        return "Good morning"
    if current_hour < 18:
        return "Good afternoon"
    return "Good evening"
