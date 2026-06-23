from __future__ import annotations

from ai_engine.speech_recognition.local import LocalSpeechRecognizer
from ai_engine.text_to_speech.pyttsx3_engine import Pyttsx3Speaker
from backend.app.configurations.container import get_assistant_service
from backend.app.configurations.settings import get_settings


def run_cli() -> None:
    settings = get_settings()
    assistant = get_assistant_service()
    recognizer = LocalSpeechRecognizer(locale=settings.default_locale)
    speaker = Pyttsx3Speaker()

    welcome = assistant.welcome_message()
    print(welcome)
    speaker.speak(welcome)

    while True:
        transcript = recognizer.listen()
        if not transcript:
            print("I did not catch that. Please try again.")
            continue
        if transcript.lower().strip() in {"exit", "quit", "stop assistant"}:
            speaker.speak("Goodbye.")
            break
        response = assistant.handle_text_command(
            text=transcript,
            user_id="demo-user",
            locale=settings.default_locale,
            metadata={"surface": "desktop-cli"},
        )
        print(f"User: {transcript}")
        print(f"Assistant: {response['response_text']}")
        speaker.speak(response["response_text"])
