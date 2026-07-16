import logging
import os
from pathlib import Path

from flask import Flask, jsonify, redirect, render_template, request

if __package__:
    from app.lead_delivery import (
        LeadDeliveryError,
        deliver_lead,
        is_lead_delivery_configured,
    )
    from app.lead_form import get_missing_required_fields
else:
    from lead_delivery import (
        LeadDeliveryError,
        deliver_lead,
        is_lead_delivery_configured,
    )
    from lead_form import get_missing_required_fields


LOGGER = logging.getLogger(__name__)
MAX_FORM_BYTES = 4 * 1024 * 1024
MAX_AUDIO_BYTES = 3 * 1024 * 1024
ALLOWED_AUDIO_MIME_TYPES = {
    "audio/mp4",
    "audio/mpeg",
    "audio/ogg",
    "audio/wav",
    "audio/webm",
}


def load_local_env():
    project_root = Path(__file__).resolve().parent.parent
    candidates = (project_root / ".env", Path.cwd() / ".env")

    for env_path in dict.fromkeys(candidates):
        if not env_path.exists():
            continue

        for raw_line in env_path.read_text(encoding="utf-8").splitlines():
            line = raw_line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue

            key, value = line.split("=", 1)
            key = key.strip()
            value = value.strip().strip("\"'")
            if key:
                os.environ.setdefault(key, value)


def get_stream_size(file_storage):
    stream = file_storage.stream
    current_position = stream.tell()
    stream.seek(0, os.SEEK_END)
    size = stream.tell()
    stream.seek(current_position)
    return size


def validate_audio_file(audio_file):
    if not audio_file:
        return None

    if audio_file.mimetype not in ALLOWED_AUDIO_MIME_TYPES:
        return "Поддерживаются только аудиофайлы."

    if get_stream_size(audio_file) > MAX_AUDIO_BYTES:
        return "Голосовое сообщение слишком большое."

    return None


def create_app():
    load_local_env()
    app = Flask(__name__, static_folder='static', template_folder='templates')
    app.config["MAX_CONTENT_LENGTH"] = MAX_FORM_BYTES
    app.config["SEND_FILE_MAX_AGE_DEFAULT"] = 0
    app.config["TEMPLATES_AUTO_RELOAD"] = True

    @app.context_processor
    def inject_asset_version():
        def asset_version(filename):
            asset_path = Path(app.static_folder) / filename

            try:
                return str(int(asset_path.stat().st_mtime))
            except OSError:
                return "1"

        return {"asset_version": asset_version}

    @app.route('/platform')
    def platform():
        return redirect('http://127.0.0.1:5173/')

    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def index(path):
        return render_template('index.html')

    @app.route('/api/form', methods=['POST'])
    def form_submit():
        if not is_lead_delivery_configured():
            return jsonify({
                "ok": False,
                "message": "Форма временно недоступна: не настроена отправка заявок.",
            }), 503

        data = request.form.to_dict()
        audio_file = request.files.get("voice_message")
        audio_error = validate_audio_file(audio_file)

        if audio_error:
            return jsonify({"ok": False, "message": audio_error}), 400

        missing_fields = get_missing_required_fields(data)
        if missing_fields:
            return jsonify({
                "ok": False,
                "message": f"Заполните обязательные поля: {', '.join(missing_fields)}.",
            }), 400

        try:
            delivered = deliver_lead(data, audio_file)
        except LeadDeliveryError:
            LOGGER.exception("Lead delivery failed.")
            return jsonify({
                "ok": False,
                "message": "Не удалось отправить заявку. Попробуйте ещё раз или напишите напрямую.",
            }), 502

        if delivered:
            LOGGER.info("Mentorship lead delivered.")
            return jsonify({"ok": True, "message": "Форма успешно отправлена."}), 201

        LOGGER.warning("Lead delivery returned an unsuccessful response.")
        return jsonify({
            "ok": False,
            "message": "Не удалось отправить заявку. Попробуйте ещё раз или напишите напрямую.",
        }), 502

    @app.route('/api/data', methods=['GET'])
    def get_data():
        return jsonify({"ok": True, "msg": "Hello from Flask"})

    return app

if __name__ == "__main__":
    load_local_env()
    debug = os.environ.get("FLASK_DEBUG", "").lower() in {"1", "true", "yes", "on"}
    host = os.environ.get("HOST", "127.0.0.1")
    port = int(os.environ.get("PORT", "8000"))
    create_app().run(debug=debug, host=host, port=port)
