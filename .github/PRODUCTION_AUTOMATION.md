# Автоматический production-деплой лендинга

Workflow `release-production.yml` запускается при каждом push в `main`.
Он устанавливает зависимости Python 3.12, проверяет Flask factory и публикует
проверенный commit в ветку `production`.

Хостинг раз в минуту сравнивает текущий commit репозитория лендинга с
`origin/production`. Только при появлении нового commit он выполняет
`git reset --hard origin/production` и касается `tmp/restart.txt` для
перезапуска Passenger.

## Одноразовая настройка Cron в ISPmanager

В разделе «Планировщик CRON» создать отдельную задачу для лендинга:

| Field | Value |
| --- | --- |
| Schedule | `* * * * *` |
| Command | `cd /var/www/u3343606/data/www/pymentor.ru && git fetch origin -q && target_sha=$(git rev-parse --verify origin/production 2>/dev/null) && current_sha=$(git rev-parse HEAD) && if [ "$current_sha" != "$target_sha" ]; then git reset --hard origin/production && touch /var/www/u3343606/data/www/pymentor.ru/tmp/restart.txt; fi` |

До создания ветки `production` задача не обновляет сайт. Когда commit уже
совпадает с `production`, она тоже ничего не делает и не перезапускает Passenger.

## Редкое ручное действие

При изменении `requirements.txt` workflow намеренно не продвигает релиз:
сначала вручную обновить общую venv Passenger, затем повторно запустить workflow.
