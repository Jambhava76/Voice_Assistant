from __future__ import annotations

from fastapi import APIRouter

from backend.app.utilities.time import now_utc

router = APIRouter(prefix="/health", tags=["health"])


@router.get("")
def health() -> dict:
    return {"status": "ok", "timestamp": now_utc().isoformat()}
