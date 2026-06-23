from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends

from backend.app.configurations.container import get_user_service
from backend.app.models.schemas import AuthRequest, AuthResponse
from backend.app.security.auth import UserPrincipal, get_current_user
from backend.app.services.user_service import UserService

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=AuthResponse)
def login(payload: AuthRequest, user_service: Annotated[UserService, Depends(get_user_service)]) -> dict:
    return user_service.authenticate(payload.email, payload.password)


@router.get("/me")
def me(user: Annotated[UserPrincipal, Depends(get_current_user)]) -> dict:
    return {
        "user_id": user.user_id,
        "email": user.email,
        "roles": [role.value for role in user.roles],
    }
