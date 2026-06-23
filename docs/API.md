# API Reference

Base URL:

```text
http://localhost:8000/api/v1
```

## Auth

### POST `/auth/login`

Request:

```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

Response:

```json
{
  "access_token": "jwt-token",
  "token_type": "bearer",
  "user": {
    "user_id": "demo-user",
    "email": "admin@example.com",
    "roles": ["admin", "user"]
  }
}
```

## Assistant

### GET `/assistant/status`

Returns assistant state, locale, plugins, and uptime.

### POST `/assistant/commands`

Headers:

```text
Authorization: Bearer <token>
```

Request:

```json
{
  "text": "open youtube",
  "user_id": "demo-user",
  "locale": "en-IN",
  "mode": "text",
  "metadata": {
    "surface": "web-dashboard"
  }
}
```

Response:

```json
{
  "command_id": "cmd_123",
  "status": "completed",
  "transcript": "open youtube",
  "response_text": "Opening youtube.",
  "intent": "open_url",
  "confidence": 0.88,
  "actions": [
    {
      "type": "open_url",
      "target": "youtube",
      "url": "https://www.youtube.com"
    }
  ],
  "context": {},
  "metrics": {
    "duration_ms": 2.8,
    "engine_duration_ms": 0.6
  }
}
```

### GET `/assistant/commands/history`

Query parameters:

| Name | Default | Description |
| --- | --- | --- |
| `user_id` | `demo-user` | User command history owner |
| `limit` | `25` | Maximum rows, 1 to 100 |

## Dashboard

### GET `/dashboard/overview`

Returns assistant status, usage analytics, performance metrics, recent activities, notifications, and recommendations.

### GET `/dashboard/preferences`

Returns preferences for the authenticated user.

### PUT `/dashboard/preferences`

Request:

```json
{
  "theme": "dark",
  "voice": "professional_female",
  "speech_rate": 175,
  "wake_word": "Jarvis",
  "notifications_enabled": true,
  "command_confirmation": true
}
```
