from flask import Flask, jsonify, render_template
import threading
import time

app = Flask(__name__)

# Zamanlayıcı değişkenleri
work_time = 25 * 60  # 25 dakika
is_running = False
progress = 0
tree_count = 0  # Fidan sayacı

def start_timer():
    global is_running, progress, tree_count
    is_running = True
    total_time = work_time

    while total_time > 0 and is_running:
        time.sleep(1)
        total_time -= 1
        progress = 100 * (work_time - total_time) / work_time

    if is_running:
        tree_count += 1  # Her tamamlanan seans için fidan sayısını artır
    is_running = False

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/start', methods=['POST'])
def start_pomodoro():
    global is_running
    if not is_running:
        threading.Thread(target=start_timer).start()
    return jsonify({'status': 'Zamanlayıcı başlatıldı', 'trees': tree_count})

@app.route('/stop', methods=['POST'])
def stop_pomodoro():
    global is_running
    is_running = False
    return jsonify({'status': 'Zamanlayıcı durduruldu'})

@app.route('/progress', methods=['GET'])
def get_progress():
    return jsonify({'progress': progress, 'is_running': is_running, 'trees': tree_count})

if __name__ == '__main__':
    # Port numarasını burada belirleyebilirsin
    PORT = 5005  # İstediğin portu buraya yaz
    app.run(host='192.168.43.227', port=PORT)

