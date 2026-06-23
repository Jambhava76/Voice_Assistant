from __future__ import annotations


class AppException(Exception):
    status_code = 500
    error_code = "app_error"

    def __init__(self, message: str, *, details: dict | None = None) -> None:
        super().__init__(message)
        self.message = message
        self.details = details or {}


class ValidationAppError(AppException):
    status_code = 422
    error_code = "validation_error"


class NotFoundError(AppException):
    status_code = 404
    error_code = "not_found"


class IntegrationError(AppException):
    status_code = 502
    error_code = "integration_error"


class AuthorizationError(AppException):
    status_code = 403
    error_code = "authorization_error"
