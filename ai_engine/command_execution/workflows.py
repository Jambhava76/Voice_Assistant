from __future__ import annotations

from collections.abc import Callable
from dataclasses import dataclass


@dataclass(frozen=True)
class WorkflowStep:
    name: str
    action: Callable[[], dict]


class WorkflowAutomationEngine:
    def run(self, name: str, steps: list[WorkflowStep]) -> list[dict]:
        results: list[dict] = []
        for step in steps:
            results.append({"step": step.name, "result": step.action()})
        return [{"workflow": name, "steps": results}]
