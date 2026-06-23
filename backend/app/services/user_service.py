from __future__ import annotations

from backend.app.configurations.settings import AppSettings
from backend.app.models.schemas import UserPreferences
from backend.app.repositories.base import PreferencesRepository, UserRepository
from backend.app.security.auth import Role, UserPrincipal, create_access_token, hash_password, verify_password
from backend.app.utilities.exceptions import AuthorizationError


class UserService:
    def __init__(
        self,
        settings: AppSettings,
        preferences_repository: PreferencesRepository,
        user_repository: UserRepository,
    ) -> None:
        self.settings = settings
        self.preferences_repository = preferences_repository
        self.user_repository = user_repository
        self._admin_password_hash = hash_password(settings.default_user_password, settings.jwt_secret)
        self.user_repository.ensure_user(
            user_id="demo-user",
            email=settings.default_user_email,
            password_hash=self._admin_password_hash,
            roles=[Role.ADMIN.value, Role.USER.value],
        )

    def authenticate(self, email: str, password: str) -> dict:
        user_record = self.user_repository.get_user_by_email(email)
        if user_record is None:
            raise AuthorizationError("Invalid email or password")
        if not verify_password(password, user_record["password_hash"], self.settings.jwt_secret):
            raise AuthorizationError("Invalid email or password")

        principal = UserPrincipal(
            user_id=user_record["user_id"],
            email=user_record["email"],
            roles=tuple(Role(role) for role in user_record["roles"]),
        )
        return {
            "access_token": create_access_token(principal, self.settings),
            "user": {
                "user_id": principal.user_id,
                "email": principal.email,
                "roles": [role.value for role in principal.roles],
            },
        }

    def get_preferences(self, user_id: str) -> dict:
        return self.preferences_repository.get_preferences(user_id)

    def save_preferences(self, user_id: str, preferences: UserPreferences) -> dict:
        return self.preferences_repository.save_preferences(user_id, preferences.model_dump())
