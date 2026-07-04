if __package__:
    from app.lead_form import build_lead_message
    from app.telegram_delivery import (
        TelegramDeliveryError,
        is_telegram_configured,
        send_telegram_audio,
        send_telegram_message,
    )
else:
    from lead_form import build_lead_message
    from telegram_delivery import (
        TelegramDeliveryError,
        is_telegram_configured,
        send_telegram_audio,
        send_telegram_message,
    )


class LeadDeliveryError(Exception):
    """Raised when a lead cannot be delivered to the configured destination."""


def is_lead_delivery_configured():
    return is_telegram_configured()


def deliver_lead(data, audio_file=None):
    try:
        message_sent = send_telegram_message(build_lead_message(data, bool(audio_file)))
        audio_sent = send_telegram_audio(audio_file) if audio_file else True
    except TelegramDeliveryError as exc:
        raise LeadDeliveryError("Lead delivery failed.") from exc

    return bool(message_sent and audio_sent)
