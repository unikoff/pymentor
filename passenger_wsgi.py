import os
import sys


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
VENV_CANDIDATES = (
    os.path.join(BASE_DIR, ".venv", "bin", "python"),
    os.path.join(BASE_DIR, "venv", "bin", "python"),
)

INTERP = next((path for path in VENV_CANDIDATES if os.path.exists(path)), None)

if INTERP and os.path.realpath(sys.executable) != os.path.realpath(INTERP):
    os.execl(INTERP, INTERP, *sys.argv)

sys.path.insert(0, BASE_DIR)

from app.main import create_app

application = create_app()

# Платформа (FastAPI) монтируется на /platform внутри этого же процесса:
# хостинг разрешает только один сайт, поэтому лендинг и платформа живут под
# одной точкой входа Passenger. DispatcherMiddleware срезает префикс, так что
# сама платформа продолжает видеть привычные /user, /learning, /admin.
# Если каталога платформы рядом нет — лендинг просто работает как раньше.
PLATFORM_BACKEND = os.path.join(os.path.dirname(BASE_DIR), "Pymentor_platform", "backend")

if os.path.isdir(PLATFORM_BACKEND):
    sys.path.insert(0, PLATFORM_BACKEND)

    from a2wsgi import ASGIMiddleware
    from werkzeug.middleware.dispatcher import DispatcherMiddleware
    from main import app as platform_asgi_app

    application = DispatcherMiddleware(
        application,
        {"/platform": ASGIMiddleware(platform_asgi_app)},
    )
