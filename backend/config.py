import os

MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017')
DB_NAME = os.getenv('DB_NAME', 'food_volume_db')
COLLECTION_NAME = os.getenv('COLLECTION_NAME', 'results')
UPLOAD_FOLDER = os.getenv('UPLOAD_FOLDER', 'uploads')
PROCESSED_FOLDER = os.getenv('PROCESSED_FOLDER', 'processed')
PIXELS_PER_CM = float(os.getenv('PIXELS_PER_CM', '37.8'))
MODEL_PATH = os.getenv('MODEL_PATH', 'yolov8n.pt')
MODEL_TRUSTED_SOURCE = os.getenv('MODEL_TRUSTED_SOURCE', 'true').lower() == 'true'
