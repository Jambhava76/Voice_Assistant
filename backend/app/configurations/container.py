from __future__ import annotations

from functools import lru_cache

from ai_engine.command_execution.executor import CommandExecutionEngine
from ai_engine.context_management.manager import ConversationContextManager
from ai_engine.intent_detection.detector import IntentDetector
from ai_engine.nlp.processor import NLPProcessor
from ai_engine.plugins.builtin import register_builtin_plugins
from ai_engine.plugins.registry import PluginRegistry
from backend.app.configurations.settings import get_settings
from backend.app.repositories.sqlite_repository import SQLiteRepository
from backend.app.services.analytics_service import AnalyticsService
from backend.app.services.assistant_service import AssistantService
from backend.app.services.user_service import UserService


@lru_cache(maxsize=1)
def get_repository() -> SQLiteRepository:
    return SQLiteRepository(get_settings().database_path)


@lru_cache(maxsize=1)
def get_plugin_registry() -> PluginRegistry:
    registry = PluginRegistry()
    register_builtin_plugins(registry)
    return registry


@lru_cache(maxsize=1)
def get_context_manager() -> ConversationContextManager:
    return ConversationContextManager(max_turns_per_user=20)


@lru_cache(maxsize=1)
def get_intent_detector() -> IntentDetector:
    return IntentDetector(NLPProcessor())


@lru_cache(maxsize=1)
def get_command_engine() -> CommandExecutionEngine:
    return CommandExecutionEngine(settings=get_settings(), plugin_registry=get_plugin_registry())


def get_assistant_service() -> AssistantService:
    return AssistantService(
        settings=get_settings(),
        command_repository=get_repository(),
        intent_detector=get_intent_detector(),
        command_engine=get_command_engine(),
        context_manager=get_context_manager(),
        plugin_registry=get_plugin_registry(),
    )


def get_analytics_service() -> AnalyticsService:
    return AnalyticsService(get_repository())


def get_user_service() -> UserService:
    repository = get_repository()
    return UserService(get_settings(), repository, repository)
