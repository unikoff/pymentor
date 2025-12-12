from flask import Flask, render_template, jsonify, request, send_from_directory
import requests
import os # Используем для получения переменных окружения (опционально, но рекомендуется)

# ----------------------------------------------------------------------
# ❗ КОНФИГУРАЦИЯ TELEGRAM
# ----------------------------------------------------------------------
# ⚠️ ЗАМЕНИТЕ ЭТИ ЗНАЧЕНИЯ НА ВАШИ РЕАЛЬНЫЕ!
# 1. Получите токен от @BotFather в Telegram.
TELEGRAM_BOT_TOKEN = "8415824392:AAEj7hrIUj57SR_IQIWIcNP5FS28oFEu60g"  
# 2. Получите ваш ID чата (например, через @userinfobot или @get_id_bot).
TELEGRAM_CHAT_ID = "6246825376"  

def send_telegram_message(text):
    """
    Отправляет текстовое сообщение в указанный чат Telegram.
    
    :param text: Сообщение для отправки.
    :return: True в случае успеха, False в случае ошибки.
    """
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID or TELEGRAM_BOT_TOKEN.startswith("ЗАМЕНИТЕ"):
        print("❌ ОШИБКА: TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID не настроены. Отправка пропущена.")
        return False

    api_url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    
    payload = {
        'chat_id': TELEGRAM_CHAT_ID,
        'text': text,
        'parse_mode': 'Markdown'  # Используем Markdown для форматирования текста
    }

    try:
        response = requests.post(api_url, data=payload)
        response.raise_for_status()  # Вызовет исключение для ошибок HTTP (4xx или 5xx)
        
        if response.json().get("ok"):
            print("✅ Уведомление в Telegram отправлено успешно.")
            return True
        else:
            print(f"❌ Ошибка API Telegram: {response.text}")
            return False

    except requests.exceptions.RequestException as e:
        print(f"❌ Ошибка отправки запроса в Telegram: {e}")
        return False

# ----------------------------------------------------------------------
# 🌐 FLASK ПРИЛОЖЕНИЕ
# ----------------------------------------------------------------------

def create_app():
    app = Flask(__name__, static_folder='static', template_folder='templates')

    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def index(path):
        # Если SPA, всегда отдавать index.html
        return render_template('index.html')

    ## ✨ Роутер для приема данных формы и отправки в Telegram
    @app.route('/api/form', methods=['POST'])
    def form_submit():
        # Получаем данные из JSON-тела запроса (как мы отправляем из JS)
        data = request.get_json() 
        
        # Вывод данных в консоль сервера для проверки
        print(f"✅ Получены данные формы: {data}")

        # 1. Формируем сообщение для Telegram
        message = "✨*НОВАЯ ЗАЯВКА НА МЕНТОРСТВО*✨\n\n"
        
        # Перебираем все поля из формы для форматирования
        for key, value in data.items():
            # Преобразование ключа из snake_case в читаемый заголовок
            title = key.replace('_', ' ').title()
            message += f"*{title}:* `{value}`\n"

        # 2. Отправляем сообщение в Telegram
        telegram_sent = send_telegram_message(message)
        
        # 3. Возвращаем ответ клиенту (JS)
        if telegram_sent:
            return jsonify({"ok": True, "message": "Форма успешно принята и отправлена в Telegram"}), 201
        else:
            # Если отправка в Telegram не удалась, возвращаем ошибку 500,
            # чтобы JS показал соответствующее сообщение.
            return jsonify({"ok": False, "message": "Форма принята, но произошла ошибка при отправке в Telegram (Проверьте токены!)"}), 500 

    # Пример простого API для fetch из JS
    @app.route('/api/data', methods=['GET'])
    def get_data():
        return jsonify({"ok": True, "msg": "Hello from Flask"})


    return app

if __name__ == "__main__":
    create_app().run(debug=True, host='0.0.0.0', port=8000)