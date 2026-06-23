from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends

from backend.app.configurations.container import (
    get_analytics_service,
    get_assistant_service,
    get_user_service,
)
from backend.app.models.schemas import DashboardOverview, UserPreferences
from backend.app.security.auth import Role, UserPrincipal, require_roles
from backend.app.services.analytics_service import AnalyticsService
from backend.app.services.assistant_service import AssistantService
from backend.app.services.user_service import UserService

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/overview", response_model=DashboardOverview)
def overview(
    assistant_service: Annotated[AssistantService, Depends(get_assistant_service)],
    analytics_service: Annotated[AnalyticsService, Depends(get_analytics_service)],
    user: Annotated[UserPrincipal, Depends(require_roles(Role.ADMIN, Role.USER, Role.VIEWER))],
) -> dict:
    return {
        "assistant": assistant_service.status(),
        "usage": analytics_service.usage_summary(),
        "performance": analytics_service.performance_summary(),
        "recent_activities": assistant_service.history(user.user_id, limit=8),
        "notifications": analytics_service.notifications(),
        "recommendations": analytics_service.recommendations(),
    }


@router.get("/preferences", response_model=UserPreferences)
def get_preferences(
    user_service: Annotated[UserService, Depends(get_user_service)],
    user: Annotated[UserPrincipal, Depends(require_roles(Role.ADMIN, Role.USER))],
) -> dict:
    return user_service.get_preferences(user.user_id)


@router.put("/preferences", response_model=UserPreferences)
def save_preferences(
    payload: UserPreferences,
    user_service: Annotated[UserService, Depends(get_user_service)],
    user: Annotated[UserPrincipal, Depends(require_roles(Role.ADMIN, Role.USER))],
) -> dict:
    return user_service.save_preferences(user.user_id, payload)
