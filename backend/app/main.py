from __future__ import annotations

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from backend.app.configurations.logging import configure_logging
from backend.app.configurations.settings import get_settings
from backend.app.controllers import assistant_controller, auth_controller, dashboard_controller, health_controller
from backend.app.models.schemas import ErrorResponse
from backend.app.utilities.exceptions import AppException

settings = get_settings()
configure_logging(settings)

app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    description="Enterprise AI Voice Assistant backend API.",
    openapi_url=f"{settings.api_prefix}/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_origin_regex=r"http://192\.168\.\d+\.\d+:3000" if settings.app_env == "development" else None,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(AppException)
async def app_exception_handler(_: Request, exc: AppException) -> JSONResponse:
    return JSONResponse(
        status_code=exc.status_code,
        content=ErrorResponse(
            error_code=exc.error_code,
            message=exc.message,
            details=exc.details,
        ).model_dump(),
    )


for router in (
    health_controller.router,
    auth_controller.router,
    assistant_controller.router,
    dashboard_controller.router,
):
    app.include_router(router, prefix=settings.api_prefix)
