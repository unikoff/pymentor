from flask import Flask, render_template, jsonify, request
import requests
import io

# КОНФИГУРАЦИЯ TELEGRAM
TELEGRAM_BOT_TOKEN = "ЗАМЕНИТЕ_НА_ВАШ_ТОКЕН_БОТА"  
TELEGRAM_CHAT_ID = "ЗАМЕНИТЕ_НА_ВАШ_CHAT_ID"  

def send_telegram_message(text):
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID or TELEGRAM_BOT_TOKEN.startswith("ЗАМЕНИТЕ"):
        print("❌ ОШИБКА: TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID не настроены. Отправка пропущена.")
        return False

    api_url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    
    payload = {
        'chat_id': TELEGRAM_CHAT_ID,
        'text': text,
        'parse_mode': 'Markdown' 
    }

    try:
        response = requests.post(api_url, data=payload)
        response.raise_for_status() 
        
        if response.json().get("ok"):
            print("✅ Уведомление в Telegram отправлено успешно.")
            return True
        else:
            print(f"❌ Ошибка API Telegram при отправке текста: {response.text}")
            return False

    except requests.exceptions.RequestException as e:
        print(f"❌ Ошибка отправки запроса в Telegram (текст): {e}")
        return False

def send_telegram_audio(audio_stream):
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID or TELEGRAM_BOT_TOKEN.startswith("ЗАМЕНИТЕ"):
        return False

    api_url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendAudio"
    
    files = {
        'audio': ('voice_recording.wav', audio_stream, 'audio/wav')
    }
    
    payload = {
        'chat_id': TELEGRAM_CHAT_ID
    }

    try:
        response = requests.post(api_url, data=payload, files=files)
        response.raise_for_status() 
        
        if response.json().get("ok"):
            print("✅ Аудиофайл в Telegram отправлен успешно.")
            return True
        else:
            print(f"❌ Ошибка API Telegram при отправке аудио: {response.text}")
            return False

    except requests.exceptions.RequestException as e:
        print(f"❌ Ошибка отправки запроса в Telegram (аудио): {e}")
        return False

# FLASK ПРИЛОЖЕНИЕ
def create_app():
    app = Flask(__name__, static_folder='static', template_folder='templates')

    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def index(path):
        return render_template('index.html')

    @app.route('/api/form', methods=['POST'])
    def form_submit():
        data = request.form.to_dict() 
        audio_file = request.files.get('voice_message') 
        
        print(f"✅ Получены текстовые данные формы: {data}")

        message = "✨*НОВАЯ ЗАЯВКА НА МЕНТОРСТВО*✨\n\n"
        
        for key, value in data.items():
            title = key.replace('_', ' ').title()
            message += f"*{title}:* `{value}`\n"
            
        if audio_file:
            message += "\n*Голосовое сообщение:* _(файл будет отправлен отдельным сообщением)_"

        telegram_text_sent = send_telegram_message(message)
        
        telegram_audio_sent = True
        if audio_file:
            telegram_audio_sent = send_telegram_audio(audio_file.stream)
        
        if telegram_text_sent and telegram_audio_sent:
            return jsonify({"ok": True, "message": "Форма успешно принята и отправлена в Telegram"}), 201
        else:
            return jsonify({"ok": False, "message": "Форма принята, но произошла ошибка при отправке в Telegram (Проверьте токены или файл!)"}), 500 

    @app.route('/api/data', methods=['GET'])
    def get_data():
        return jsonify({"ok": True, "msg": "Hello from Flask"})

    return app

if __name__ == "__main__":
    create_app().run(debug=True, host='0.0.0.0', port=8000)