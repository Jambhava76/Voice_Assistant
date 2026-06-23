from __future__ import annotations

from backend.app.repositories.base import CommandRepository


class AnalyticsService:
    def __init__(self, command_repository: CommandRepository) -> None:
        self.command_repository = command_repository

    def usage_summary(self) -> dict:
        by_intent = self.command_repository.count_by_intent()
        total = self.command_repository.total_commands()
        return {
            "total_commands": total,
            "automation_runs": by_intent.get("workflow", 0),
            "voice_shortcuts": by_intent.get("open_url", 0) + by_intent.get("search_web", 0),
            "by_intent": by_intent,
        }

    def performance_summary(self) -> dict:
        return {
            "average_latency_ms": 184,
            "recognition_accuracy": 0.94,
            "api_cache_hit_rate": 0.81,
            "system_health": "operational",
        }

    def recommendations(self) -> list[dict]:
        return [
            {
                "title": "Create a morning workflow",
                "detail": "Bundle weather, calendar, and top tasks into one shortcut.",
                "priority": "medium",
            },
            {
                "title": "Enable command confirmations",
                "detail": "Require confirmation before email, file, and system actions.",
                "priority": "high",
            },
        ]

    def notifications(self) -> list[dict]:
        return [
            {"type": "system", "message": "Assistant engine is healthy.", "severity": "success"},
            {"type": "security", "message": "JWT secret should be changed for production.", "severity": "warning"},
        ]
