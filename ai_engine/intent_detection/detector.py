from __future__ import annotations

from ai_engine.nlp.processor import NLPProcessor
from backend.app.models.domain import CommandIntent, IntentType


class IntentDetector:
    def __init__(self, nlp_processor: NLPProcessor) -> None:
        self.nlp_processor = nlp_processor
        self._site_aliases = {
            "youtube": "https://www.youtube.com",
            "google": "https://www.google.com",
            "spotify": "https://open.spotify.com",
            "stackoverflow": "https://stackoverflow.com",
            "stack overflow": "https://stackoverflow.com",
            "github": "https://github.com",
        }

    def detect(self, text: str, *, context: dict | None = None, locale: str = "en-IN") -> CommandIntent:
        document = self.nlp_processor.process(text)
        normalized = document.normalized_text

        if "wikipedia" in normalized:
            topic = document.entities.get("topic") or normalized.replace("wikipedia", "").strip()
            return CommandIntent(
                intent_type=IntentType.WIKIPEDIA_LOOKUP,
                confidence=0.91,
                raw_text=text,
                slots={"topic": topic},
            )

        if normalized.startswith("open "):
            target = normalized.removeprefix("open ").strip()
            return CommandIntent(
                intent_type=IntentType.OPEN_URL,
                confidence=0.88,
                raw_text=text,
                slots={"target": target, "url": self._site_aliases.get(target)},
            )

        if normalized.startswith("search ") or "search for " in normalized:
            query = normalized.replace("search for", "", 1).replace("search", "", 1).strip()
            return CommandIntent(
                intent_type=IntentType.SEARCH_WEB,
                confidence=0.89,
                raw_text=text,
                slots={"query": query},
            )

        if "play music" in normalized or "start music" in normalized:
            return CommandIntent(IntentType.PLAY_MUSIC, 0.84, text, slots={})

        if "time" in normalized:
            return CommandIntent(IntentType.CURRENT_TIME, 0.82, text, slots={"locale": locale})

        if "send email" in normalized or "email to" in normalized:
            return CommandIntent(IntentType.SEND_EMAIL, 0.79, text, slots={"requires_confirmation": True})

        if "status" in normalized or "health" in normalized or "performance" in normalized:
            return CommandIntent(IntentType.SYSTEM_STATUS, 0.78, text, slots={})

        if "workflow" in normalized or "routine" in normalized or "automation" in normalized:
            return CommandIntent(IntentType.WORKFLOW, 0.76, text, slots={"workflow": "custom"})

        if "remember" in normalized and context is not None:
            return CommandIntent(IntentType.PREFERENCES, 0.73, text, slots={"memory": normalized})

        return CommandIntent(IntentType.UNKNOWN, 0.25, text, slots={"tokens": document.tokens})
