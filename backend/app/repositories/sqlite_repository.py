from __future__ import annotations

import json
import sqlite3
from collections.abc import Sequence
from datetime import datetime
from pathlib import Path
from threading import Lock

from backend.app.models.domain import ConversationTurn, IntentType
from backend.app.repositories.base import CommandRepository, PreferencesRepository, UserRepository


class SQLiteRepository(CommandRepository, PreferencesRepository, UserRepository):
    def __init__(self, database_path: Path) -> None:
        self.database_path = database_path
        self._lock = Lock()
        self._ensure_schema()

    def _connect(self) -> sqlite3.Connection:
        connection = sqlite3.connect(self.database_path)
        connection.row_factory = sqlite3.Row
        return connection

    def _ensure_schema(self) -> None:
        with self._lock, self._connect() as connection:
            connection.executescript(
                """
                CREATE TABLE IF NOT EXISTS command_history (
                    command_id TEXT PRIMARY KEY,
                    user_id TEXT NOT NULL,
                    transcript TEXT NOT NULL,
                    response_text TEXT NOT NULL,
                    intent TEXT NOT NULL,
                    confidence REAL NOT NULL,
                    created_at TEXT NOT NULL,
                    metadata TEXT NOT NULL
                );

                CREATE INDEX IF NOT EXISTS idx_command_history_user_created
                    ON command_history(user_id, created_at DESC);

                CREATE TABLE IF NOT EXISTS user_preferences (
                    user_id TEXT PRIMARY KEY,
                    preferences TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                );

                CREATE TABLE IF NOT EXISTS users (
                    user_id TEXT PRIMARY KEY,
                    email TEXT NOT NULL UNIQUE,
                    password_hash TEXT NOT NULL,
                    roles TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                );
                """
            )

    def save_turn(self, turn: ConversationTurn) -> None:
        with self._lock, self._connect() as connection:
            connection.execute(
                """
                INSERT OR REPLACE INTO command_history (
                    command_id, user_id, transcript, response_text, intent,
                    confidence, created_at, metadata
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    turn.command_id,
                    turn.user_id,
                    turn.transcript,
                    turn.response_text,
                    turn.intent.value,
                    turn.confidence,
                    turn.created_at.isoformat(),
                    json.dumps(turn.metadata),
                ),
            )

    def list_turns(self, user_id: str, *, limit: int = 50) -> Sequence[ConversationTurn]:
        with self._lock, self._connect() as connection:
            rows = connection.execute(
                """
                SELECT * FROM command_history
                WHERE user_id = ?
                ORDER BY created_at DESC
                LIMIT ?
                """,
                (user_id, limit),
            ).fetchall()
        return [self._row_to_turn(row) for row in rows]

    def count_by_intent(self) -> dict[str, int]:
        with self._lock, self._connect() as connection:
            rows = connection.execute(
                "SELECT intent, COUNT(*) as total FROM command_history GROUP BY intent"
            ).fetchall()
        return {row["intent"]: int(row["total"]) for row in rows}

    def total_commands(self) -> int:
        with self._lock, self._connect() as connection:
            row = connection.execute("SELECT COUNT(*) as total FROM command_history").fetchone()
        return int(row["total"] if row else 0)

    def get_preferences(self, user_id: str) -> dict:
        with self._lock, self._connect() as connection:
            row = connection.execute(
                "SELECT preferences FROM user_preferences WHERE user_id = ?",
                (user_id,),
            ).fetchone()
        if row is None:
            return {
                "theme": "system",
                "voice": "professional_female",
                "speech_rate": 175,
                "wake_word": "Jarvis",
                "notifications_enabled": True,
                "command_confirmation": True,
            }
        return json.loads(row["preferences"])

    def save_preferences(self, user_id: str, preferences: dict) -> dict:
        with self._lock, self._connect() as connection:
            connection.execute(
                """
                INSERT OR REPLACE INTO user_preferences (user_id, preferences, updated_at)
                VALUES (?, ?, ?)
                """,
                (user_id, json.dumps(preferences), datetime.utcnow().isoformat()),
            )
        return preferences

    def ensure_user(self, *, user_id: str, email: str, password_hash: str, roles: list[str]) -> None:
        timestamp = datetime.utcnow().isoformat()
        with self._lock, self._connect() as connection:
            connection.execute(
                """
                INSERT INTO users (user_id, email, password_hash, roles, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?)
                ON CONFLICT(email) DO UPDATE SET
                    password_hash = excluded.password_hash,
                    roles = excluded.roles,
                    updated_at = excluded.updated_at
                """,
                (user_id, email.lower(), password_hash, json.dumps(roles), timestamp, timestamp),
            )

    def get_user_by_email(self, email: str) -> dict | None:
        with self._lock, self._connect() as connection:
            row = connection.execute(
                "SELECT user_id, email, password_hash, roles FROM users WHERE email = ?",
                (email.lower(),),
            ).fetchone()
        if row is None:
            return None
        return {
            "user_id": row["user_id"],
            "email": row["email"],
            "password_hash": row["password_hash"],
            "roles": json.loads(row["roles"]),
        }

    def _row_to_turn(self, row: sqlite3.Row) -> ConversationTurn:
        return ConversationTurn(
            command_id=row["command_id"],
            user_id=row["user_id"],
            transcript=row["transcript"],
            response_text=row["response_text"],
            intent=IntentType(row["intent"]),
            confidence=float(row["confidence"]),
            created_at=datetime.fromisoformat(row["created_at"]),
            metadata=json.loads(row["metadata"]),
        )
