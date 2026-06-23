from __future__ import annotations

from ai_engine.text_to_speech.base import Speaker


class Pyttsx3Speaker(Speaker):
    def __init__(self, *, voice_index: int = 1, rate: int = 175) -> None:
        self._engine = None
        try:
            import pyttsx3

            self._engine = pyttsx3.init("sapi5")
            voices = self._engine.getProperty("voices")
            if voices and len(voices) > voice_index:
                self._engine.setProperty("voice", voices[voice_index].id)
            self._engine.setProperty("rate", rate)
        except Exception:
            self._engine = None

    def speak(self, text: str) -> None:
        if self._engine is None:
            print(text)
            return
        self._engine.say(text)
        self._engine.runAndWait()
