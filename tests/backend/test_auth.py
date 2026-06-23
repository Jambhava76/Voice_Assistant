from backend.app.configurations.settings import AppSettings
from backend.app.security.auth import Role, UserPrincipal, create_access_token, decode_access_token


def test_access_token_roundtrip() -> None:
    settings = AppSettings(jwt_secret="unit-test-secret")
    user = UserPrincipal(user_id="demo-user", email="admin@example.com", roles=(Role.ADMIN,))

    token = create_access_token(user, settings)
    decoded = decode_access_token(token, settings)

    assert decoded.user_id == "demo-user"
    assert decoded.email == "admin@example.com"
    assert decoded.roles == (Role.ADMIN,)
