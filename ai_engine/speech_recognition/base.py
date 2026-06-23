from __future__ import annotations

from abc import ABC, abstractmethod


class SpeechRecognizer(ABC):
    @abstractmethod
    def listen(self) -> str:
        raise NotImplementedError
