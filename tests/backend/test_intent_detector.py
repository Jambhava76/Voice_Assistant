from ai_engine.intent_detection.detector import IntentDetector
from ai_engine.nlp.processor import NLPProcessor
from backend.app.models.domain import IntentType


def test_detects_open_url_intent() -> None:
    detector = IntentDetector(NLPProcessor())

    intent = detector.detect("open youtube", context={}, locale="en-IN")

    assert intent.intent_type == IntentType.OPEN_URL
    assert intent.slots["url"] == "https://www.youtube.com"


def test_detects_search_intent() -> None:
    detector = IntentDetector(NLPProcessor())

    intent = detector.detect("search for python tutorial", context={}, locale="en-IN")

    assert intent.intent_type == IntentType.SEARCH_WEB
    assert intent.slots["query"] == "python tutorial"
