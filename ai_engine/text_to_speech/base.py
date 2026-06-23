from __future__ import annotations

from abc import ABC, abstractmethod


class Speaker(ABC):
    @abstractmethod
    def speak(self, text: str) -> None:
        raise NotImplementedError
