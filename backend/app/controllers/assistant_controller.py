from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, Query

from backend.app.configurations.container import get_assistant_service
from backend.app.models.schemas import (
    AssistantStatusResponse,
    CommandHistoryItem,
    VoiceCommandRequest,
    VoiceCommandResponse,
)
from backend.app.security.auth import Role, UserPrincipal, require_roles
from backend.app.services.assistant_service import AssistantService

router = APIRouter(prefix="/assistant", tags=["assistant"])


@router.post("/commands", response_model=VoiceCommandResponse)
def run_command(
    payload: VoiceCommandRequest,
    assistant_service: Annotated[AssistantService, Depends(get_assistant_service)],
    _: Annotated[UserPrincipal, Depends(require_roles(Role.ADMIN, Role.USER))],
) -> dict:
    return assistant_service.handle_text_command(
        text=payload.text,
        user_id=payload.user_id,
        locale=payload.locale,
        metadata={**payload.metadata, "mode": payload.mode},
    )


@router.get("/commands/history", response_model=list[CommandHistoryItem])
def command_history(
    assistant_service: Annotated[AssistantService, Depends(get_assistant_service)],
    _: Annotated[UserPrincipal, Depends(require_roles(Role.ADMIN, Role.USER, Role.VIEWER))],
    user_id: str = "demo-user",
    limit: int = Query(default=25, ge=1, le=100),
) -> list[dict]:
    return assistant_service.history(user_id, limit=limit)


@router.get("/status", response_model=AssistantStatusResponse)
def assistant_status(
    assistant_service: Annotated[AssistantService, Depends(get_assistant_service)]
) -> dict:
    return assistant_service.status()
