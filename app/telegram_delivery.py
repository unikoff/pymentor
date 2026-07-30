import logging
import os

import requests


LOGGER = logging.getLogger(__name__)
TELEGRAM_TIMEOUT_SECONDS = 8
TELEGRAM_CAPTION_MAX_LENGTH = 1024
PLACEHOLDER_PREFIXES = ("your_", "your-", "your ", "замените")


class TelegramDeliveryError(Exception):
    """Raised when Telegram accepts the request layer but delivery fails."""


def get_telegram_config():
    token = os.environ.get("TELEGRAM_BOT_TOKEN", "").strip()
    chat_id = os.environ.get("TELEGRAM_CHAT_ID", "").strip()
    return token, chat_id


def is_telegram_configured():
    token, chat_id = get_telegram_config()
    token_lower = token.lower()
    chat_id_lower = chat_id.lower()
    return bool(
        token
        and chat_id
        and not token_lower.startswith(PLACEHOLDER_PREFIXES)
        and not chat_id_lower.startswith(PLACEHOLDER_PREFIXES)
    )


def send_telegram_message(text):
    token, chat_id = get_telegram_config()
    if not is_telegram_configured():
        LOGGER.warning("Telegram delivery is disabled: missing bot token or chat id.")
        return False

    try:
        response = requests.post(
            f"https://api.telegram.org/bot{token}/sendMessage",
            data={"chat_id": chat_id, "text": text},
            timeout=TELEGRAM_TIMEOUT_SECONDS,
        )
        response.raise_for_status()
    except requests.exceptions.RequestException as exc:
        raise TelegramDeliveryError("Telegram message delivery failed.") from exc

    return bool(response.json().get("ok"))


def send_telegram_audio(audio_file, caption=None):
    token, chat_id = get_telegram_config()
    if not is_telegram_configured():
        return False

    if caption is not None and len(caption) > TELEGRAM_CAPTION_MAX_LENGTH:
        raise TelegramDeliveryError("Telegram audio caption is too long.")

    audio_file.stream.seek(0)
    files = {
        "audio": (
            audio_file.filename or "voice_message.webm",
            audio_file.stream,
            audio_file.mimetype or "application/octet-stream",
        )
    }

    payload = {"chat_id": chat_id}
    if caption:
        payload["caption"] = caption

    try:
        response = requests.post(
            f"https://api.telegram.org/bot{token}/sendAudio",
            data=payload,
            files=files,
            timeout=TELEGRAM_TIMEOUT_SECONDS,
        )
        response.raise_for_status()
    except requests.exceptions.RequestException as exc:
        raise TelegramDeliveryError("Telegram audio delivery failed.") from exc

    return bool(response.json().get("ok"))
