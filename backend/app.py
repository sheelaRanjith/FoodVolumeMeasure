import os
from datetime import datetime

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename

from config import PROCESSED_FOLDER, UPLOAD_FOLDER
from cv_service import CVService
from database import MongoService

app = Flask(__name__)
CORS(app)

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)

cv_service = CVService()
db_service = MongoService()


def save_uploaded_file(file_storage):
    filename = secure_filename(file_storage.filename)
    if not filename:
        raise ValueError('Invalid filename')
    timestamp = datetime.utcnow().strftime('%Y%m%d%H%M%S%f')
    final_name = f'{timestamp}_{filename}'
    path = os.path.join(UPLOAD_FOLDER, final_name)
    file_storage.save(path)
    return path


@app.route('/api/upload', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    file_storage = request.files['image']
    try:
        input_path = save_uploaded_file(file_storage)
        result = cv_service.process_image(input_path, PROCESSED_FOLDER)
        db_service.save_result(result)
        return jsonify(result)
    except Exception as exc:
        return jsonify({'error': str(exc)}), 500


@app.route('/api/capture', methods=['POST'])
def capture_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No captured image provided'}), 400

    file_storage = request.files['image']
    try:
        input_path = save_uploaded_file(file_storage)
        result = cv_service.process_image(input_path, PROCESSED_FOLDER)
        db_service.save_result(result)
        return jsonify(result)
    except Exception as exc:
        return jsonify({'error': str(exc)}), 500


@app.route('/api/history', methods=['GET'])
def history():
    try:
        history_data = db_service.fetch_history()
        return jsonify({'history': history_data})
    except Exception as exc:
        return jsonify({'error': str(exc)}), 500


@app.route('/processed/<path:filename>')
def processed_file(filename):
    return send_from_directory(PROCESSED_FOLDER, filename)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
