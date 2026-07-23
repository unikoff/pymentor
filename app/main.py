import hashlib
import logging
import os
from pathlib import Path

from flask import Flask, jsonify, render_template, request

if __package__:
    from app.lead_delivery import (
        LeadDeliveryError,
        deliver_lead,
        is_lead_delivery_configured,
    )
    from app.lead_form import get_missing_required_fields
    from app.lead_idempotency import LeadIdempotencyStore, LeadIdempotencyStoreError
else:
    from lead_delivery import (
        LeadDeliveryError,
        deliver_lead,
        is_lead_delivery_configured,
    )
    from lead_form import get_missing_required_fields
    from lead_idempotency import LeadIdempotencyStore, LeadIdempotencyStoreError


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


def get_lead_submission_key(data, audio_file):
    client_key = request.headers.get("X-Idempotency-Key", "").strip()
    if client_key:
        return client_key

    digest = hashlib.sha256()
    for key in sorted(data):
        digest.update(key.encode("utf-8"))
        digest.update(b"\0")
        digest.update((data.get(key) or "").encode("utf-8"))
        digest.update(b"\0")

    if audio_file:
        stream = audio_file.stream
        position = stream.tell()
        stream.seek(0)
        for chunk in iter(lambda: stream.read(64 * 1024), b""):
            digest.update(chunk)
        stream.seek(position)

    return f"legacy-{digest.hexdigest()}"


def release_lead_submission(store, key):
    try:
        store.release(key)
    except LeadIdempotencyStoreError:
        LOGGER.exception("Lead idempotency store failed while releasing a submission.")


def create_app():
    load_local_env()
    app = Flask(__name__, static_folder='static', template_folder='templates')
    app.config["MAX_CONTENT_LENGTH"] = MAX_FORM_BYTES
    app.config["SEND_FILE_MAX_AGE_DEFAULT"] = 0
    app.config["TEMPLATES_AUTO_RELOAD"] = True
    database_path = os.environ.get("LEAD_IDEMPOTENCY_DB")
    app.extensions["lead_idempotency_store"] = LeadIdempotencyStore(
        database_path or Path(app.instance_path) / "lead_idempotency.sqlite3"
    )

    @app.context_processor
    def inject_asset_version():
        def asset_version(filename):
            asset_path = Path(app.static_folder) / filename

            try:
                return str(int(asset_path.stat().st_mtime))
            except OSError:
                return "1"

        return {"asset_version": asset_version}

    # /platform обслуживает сама платформа (FastAPI), смонтированная в
    # passenger_wsgi.py через DispatcherMiddleware — до Flask этот путь не доходит.


    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def index(path):
        return render_template('index.html', current_page='home')

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

        submission_key = get_lead_submission_key(data, audio_file)
        submission_store = app.extensions["lead_idempotency_store"]

        try:
            submission_state = submission_store.claim(submission_key)
        except LeadIdempotencyStoreError:
            LOGGER.exception("Lead idempotency store failed while claiming a submission.")
            return jsonify({
                "ok": False,
                "message": "\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u043f\u0440\u0438\u043d\u044f\u0442\u044c \u0437\u0430\u044f\u0432\u043a\u0443. \u041f\u043e\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u0435\u0449\u0451 \u0440\u0430\u0437.",
            }), 503

        if submission_state == "completed":
            return jsonify({
                "ok": True,
                "duplicate": True,
                "message": "\u0417\u0430\u044f\u0432\u043a\u0430 \u0443\u0436\u0435 \u043f\u0440\u0438\u043d\u044f\u0442\u0430.",
            }), 200

        if submission_state == "processing":
            return jsonify({
                "ok": True,
                "pending": True,
                "message": "\u0417\u0430\u044f\u0432\u043a\u0430 \u0443\u0436\u0435 \u043e\u0442\u043f\u0440\u0430\u0432\u043b\u044f\u0435\u0442\u0441\u044f.",
            }), 202

        try:
            delivered = deliver_lead(data, audio_file)
        except LeadDeliveryError:
            release_lead_submission(submission_store, submission_key)
            LOGGER.exception("Lead delivery failed.")
            return jsonify({
                "ok": False,
                "message": "Не удалось отправить заявку. Попробуйте ещё раз или напишите напрямую.",
            }), 502

        if delivered:
            try:
                submission_store.complete(submission_key)
            except LeadIdempotencyStoreError:
                LOGGER.exception("Lead was delivered but idempotency state could not be completed.")
            LOGGER.info("Mentorship lead delivered.")
            return jsonify({"ok": True, "message": "Форма успешно отправлена."}), 201

        release_lead_submission(submission_store, submission_key)
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
