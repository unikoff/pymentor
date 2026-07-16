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
