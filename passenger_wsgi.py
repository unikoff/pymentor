import sys
import os

# ИСПРАВЛЕННЫЙ ПУТЬ: используется виртуальное окружение '.venv'
INTERP = os.path.expanduser("/var/www/u3343606/data/www/pymentor.ru/.venv/bin/python")
if sys.executable != INTERP:
   os.execl(INTERP, INTERP, *sys.argv)

# Добавляем корневой каталог проекта в пути
sys.path.append(os.getcwd())

from app.main import create_app
application = create_app()
