from __future__ import annotations

import re
from dataclasses import dataclass


@dataclass(frozen=True)
class NLPDocument:
    original_text: str
    normalized_text: str
    tokens: list[str]
    entities: dict[str, str]


class NLPProcessor:
    def process(self, text: str) -> NLPDocument:
        normalized = re.sub(r"\s+", " ", text.strip().lower())
        tokens = re.findall(r"[a-z0-9]+", normalized)
        entities = self._extract_entities(normalized)
        return NLPDocument(
            original_text=text,
            normalized_text=normalized,
            tokens=tokens,
            entities=entities,
        )

    def _extract_entities(self, normalized: str) -> dict[str, str]:
        entities: dict[str, str] = {}
        if "search for " in normalized:
            entities["query"] = normalized.split("search for ", 1)[1].strip()
        if "wikipedia" in normalized:
            entities["topic"] = normalized.replace("wikipedia", "").replace("search", "").strip()
        if "email" in normalized:
            entities["channel"] = "email"
        return entities
