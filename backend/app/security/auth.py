from __future__ import annotations

import base64
import hashlib
import hmac
import json
from collections.abc import Callable
from dataclasses import dataclass
from datetime import timedelta
from enum import StrEnum
from typing import Annotated

from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from backend.app.configurations.settings import AppSettings, get_settings
from backend.app.utilities.exceptions import AuthorizationError
from backend.app.utilities.time import now_utc


class Role(StrEnum):
    ADMIN = "admin"
    USER = "user"
    VIEWER = "viewer"


@dataclass(frozen=True)
class UserPrincipal:
    user_id: str
    email: str
    roles: tuple[Role, ...]


bearer_scheme = HTTPBearer(auto_error=False)


def hash_password(password: str, secret: str) -> str:
    digest = hmac.new(secret.encode(), password.encode(), hashlib.sha256).hexdigest()
    return digest


def verify_password(password: str, password_hash: str, secret: str) -> bool:
    return hmac.compare_digest(hash_password(password, secret), password_hash)


def _b64_encode(payload: bytes) -> str:
    return base64.urlsafe_b64encode(payload).decode().rstrip("=")


def _b64_decode(payload: str) -> bytes:
    padding = "=" * (-len(payload) % 4)
    return base64.urlsafe_b64decode(payload + padding)


def create_access_token(user: UserPrincipal, settings: AppSettings | None = None) -> str:
    settings = settings or get_settings()
    issued_at = now_utc()
    expires_at = issued_at + timedelta(minutes=settings.access_token_minutes)
    header = {"alg": "HS256", "typ": "JWT"}
    payload = {
        "sub": user.user_id,
        "email": user.email,
        "roles": [role.value for role in user.roles],
        "iss": settings.jwt_issuer,
        "aud": settings.jwt_audience,
        "iat": int(issued_at.timestamp()),
        "exp": int(expires_at.timestamp()),
    }
    encoded_header = _b64_encode(json.dumps(header, separators=(",", ":")).encode())
    encoded_payload = _b64_encode(json.dumps(payload, separators=(",", ":")).encode())
    signature = _sign(f"{encoded_header}.{encoded_payload}", settings.jwt_secret)
    return f"{encoded_header}.{encoded_payload}.{signature}"


def decode_access_token(token: str, settings: AppSettings | None = None) -> UserPrincipal:
    settings = settings or get_settings()
    try:
        encoded_header, encoded_payload, signature = token.split(".")
    except ValueError as exc:
        raise AuthorizationError("Invalid access token") from exc

    expected_signature = _sign(f"{encoded_header}.{encoded_payload}", settings.jwt_secret)
    if not hmac.compare_digest(signature, expected_signature):
        raise AuthorizationError("Invalid access token signature")

    payload = json.loads(_b64_decode(encoded_payload))
    if payload.get("iss") != settings.jwt_issuer or payload.get("aud") != settings.jwt_audience:
        raise AuthorizationError("Invalid access token claims")
    if int(payload.get("exp", 0)) < int(now_utc().timestamp()):
        raise AuthorizationError("Access token has expired")
    return UserPrincipal(
        user_id=str(payload["sub"]),
        email=str(payload["email"]),
        roles=tuple(Role(role) for role in payload.get("roles", [])),
    )


def _sign(payload: str, secret: str) -> str:
    digest = hmac.new(secret.encode(), payload.encode(), hashlib.sha256).digest()
    return _b64_encode(digest)


def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer_scheme)],
) -> UserPrincipal:
    if credentials is None:
        raise AuthorizationError("Missing bearer token")
    return decode_access_token(credentials.credentials)


def require_roles(*allowed_roles: Role) -> Callable:
    def dependency(user: Annotated[UserPrincipal, Depends(get_current_user)]) -> UserPrincipal:
        if not set(user.roles).intersection(allowed_roles):
            raise AuthorizationError("You do not have permission to access this resource")
        return user

    return dependency
