LEAD_FIELDS = (
    ("Имя", "name", ("Имя",)),
    ("Контакты", "contact", ("Контакты",)),
    ("Уровень", "level", ("Уровень",)),
    ("Цель", "goal", ("Цель",)),
    ("Сообщение", "message", ("Сообщение",)),
)


def get_form_value(data, key, aliases=()):
    for candidate in (key, *aliases):
        value = (data.get(candidate) or "").strip()
        if value:
            return value

    return ""


def get_missing_required_fields(data):
    missing = []

    for label, key, aliases in LEAD_FIELDS[:4]:
        if not get_form_value(data, key, aliases):
            missing.append(label)

    return missing


def build_lead_message(data, has_audio):
    lines = ["НОВАЯ ЗАЯВКА НА МЕНТОРСТВО", ""]

    for label, key, aliases in LEAD_FIELDS:
        value = get_form_value(data, key, aliases)
        if value:
            lines.append(f"{label}: {value}")

    if has_audio:
        lines.extend(["", "Голосовое сообщение будет отправлено отдельным сообщением."])

    return "\n".join(lines)
