import sqlite3
import time
from contextlib import contextmanager
from pathlib import Path


IDEMPOTENCY_TTL_SECONDS = 15 * 60
MAX_IDEMPOTENCY_KEY_LENGTH = 128


class LeadIdempotencyStoreError(RuntimeError):
    """Raised when the idempotency store cannot be used safely."""


class LeadIdempotencyStore:
    def __init__(self, database_path):
        self.database_path = Path(database_path)

    def claim(self, key):
        key = self._validate_key(key)
        now = int(time.time())
        expires_at = now + IDEMPOTENCY_TTL_SECONDS

        try:
            with self._connect() as connection:
                connection.execute("BEGIN IMMEDIATE")
                connection.execute(
                    "DELETE FROM lead_idempotency WHERE expires_at <= ?", (now,)
                )
                inserted = connection.execute(
                    """
                    INSERT OR IGNORE INTO lead_idempotency (request_key, status, expires_at)
                    VALUES (?, 'processing', ?)
                    """,
                    (key, expires_at),
                )
                if inserted.rowcount:
                    return "new"

                row = connection.execute(
                    "SELECT status FROM lead_idempotency WHERE request_key = ?", (key,)
                ).fetchone()
        except (OSError, sqlite3.Error) as exc:
            raise LeadIdempotencyStoreError("Unable to claim lead submission.") from exc

        return row[0] if row else "new"

    def complete(self, key):
        self._set_status(key, "completed")

    def release(self, key):
        key = self._validate_key(key)

        try:
            with self._connect() as connection:
                connection.execute(
                    "DELETE FROM lead_idempotency WHERE request_key = ? AND status = 'processing'",
                    (key,),
                )
        except (OSError, sqlite3.Error) as exc:
            raise LeadIdempotencyStoreError("Unable to release lead submission.") from exc

    def _set_status(self, key, status):
        key = self._validate_key(key)
        expires_at = int(time.time()) + IDEMPOTENCY_TTL_SECONDS

        try:
            with self._connect() as connection:
                connection.execute(
                    """
                    UPDATE lead_idempotency
                    SET status = ?, expires_at = ?
                    WHERE request_key = ?
                    """,
                    (status, expires_at, key),
                )
        except (OSError, sqlite3.Error) as exc:
            raise LeadIdempotencyStoreError("Unable to update lead submission.") from exc

    @contextmanager
    def _connect(self):
        self.database_path.parent.mkdir(parents=True, exist_ok=True)
        connection = sqlite3.connect(self.database_path, timeout=5)
        try:
            connection.execute("PRAGMA busy_timeout = 5000")
            connection.execute(
                """
                CREATE TABLE IF NOT EXISTS lead_idempotency (
                    request_key TEXT PRIMARY KEY,
                    status TEXT NOT NULL,
                    expires_at INTEGER NOT NULL
                )
                """
            )
            connection.execute(
                "CREATE INDEX IF NOT EXISTS lead_idempotency_expires_at ON lead_idempotency (expires_at)"
            )
            yield connection
            connection.commit()
        except Exception:
            connection.rollback()
            raise
        finally:
            connection.close()

    @staticmethod
    def _validate_key(key):
        key = (key or "").strip()
        if not key or len(key) > MAX_IDEMPOTENCY_KEY_LENGTH:
            raise LeadIdempotencyStoreError("Invalid idempotency key.")
        return key
