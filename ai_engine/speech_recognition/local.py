from __future__ import annotations

from ai_engine.speech_recognition.base import SpeechRecognizer


class LocalSpeechRecognizer(SpeechRecognizer):
    def __init__(self, *, locale: str = "en-IN", pause_threshold: float = 1.0) -> None:
        self.locale = locale
        self.pause_threshold = pause_threshold

    def listen(self) -> str:
        try:
            import speech_recognition as sr
        except ImportError:
            return input("Type a command: ").strip()

        recognizer = sr.Recognizer()
        recognizer.pause_threshold = self.pause_threshold
        with sr.Microphone() as source:
            print("Listening...")
            audio = recognizer.listen(source)
        try:
            print("Recognizing...")
            return str(recognizer.recognize_google(audio, language=self.locale))
        except Exception:
            return ""
