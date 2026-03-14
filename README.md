# Computer Vision Based Food Volume Measurement System

A complete full-stack project for estimating food volume and calories from uploaded or camera-captured images.

## Tech Stack
- **Frontend:** React.js + Bootstrap + React Router
- **Backend:** Python Flask API
- **Computer Vision:** OpenCV + YOLOv8 (Ultralytics)
- **Database:** MongoDB (history storage)

## Folder Structure

```text
FoodVolumeMeasure/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   └── DashboardLayout.jsx
│   │   ├── pages/
│   │   │   ├── HistoryPage.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── ResultsPage.jsx
│   │   │   └── UploadPage.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── processed/
│   ├── uploads/
│   ├── app.py
│   ├── config.py
│   ├── cv_service.py
│   ├── database.py
│   ├── requirements.txt
│   └── .env.example
├── .gitignore
└── README.md
```

## Features

### Frontend
- Professional responsive dashboard with sidebar navigation (Home, Upload/Capture, Results, History)
- Upload image + camera capture support
- Image preview + loading animation
- Processed image display with bounding boxes
- Multiple detections with confidence scores
- Volume and calorie output cards
- Result report download (JSON)
- Dark mode toggle
- History table from backend

### Backend + CV
- `POST /api/upload`: upload image for detection
- `POST /api/capture`: camera-captured image processing
- `GET /api/history`: fetch stored history from MongoDB
- YOLOv8 object detection integration
- OpenCV annotation of detections
- Volume estimation from bounding box dimensions
- Calorie estimation based on food type density map
- Processed image static serving

## API Response Example
```json
{
  "detected_food": "apple",
  "volume": 145.31,
  "calories": 75.56,
  "processed_image": "/processed/processed_20260101010101.jpg",
  "items": [
    {
      "food": "apple",
      "confidence": 0.921,
      "bbox": [102, 88, 220, 240],
      "volume": 145.31,
      "calories": 75.56
    }
  ]
}
```

## Run Locally

### 1) Start MongoDB
Ensure MongoDB is running on `mongodb://localhost:27017` or update `.env` values.

### 2) Backend setup
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python app.py
```
Backend runs at: `http://localhost:5000`

### 3) Frontend setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at: `http://localhost:5173`

## Notes
- Default YOLO model is `yolov8n.pt`; update `MODEL_PATH` in `.env` for a custom food-tuned model.
- Better food detection accuracy requires training YOLOv8 with a food dataset.
- The volume formula is an approximation based on 2D bounding box and assumed depth.
