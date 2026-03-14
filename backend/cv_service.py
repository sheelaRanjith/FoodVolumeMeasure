import os
from datetime import datetime

import cv2

from config import MODEL_PATH, PIXELS_PER_CM

CALORIE_DENSITY = {
    'apple': 0.52,
    'banana': 0.89,
    'orange': 0.47,
    'pizza': 2.66,
    'burger': 2.95,
    'cake': 3.9,
    'sandwich': 2.4
}


class CVService:
    def __init__(self):
        self.model = None
        self.model_error = None
        try:
            from ultralytics import YOLO
            self.model = YOLO(MODEL_PATH)
        except Exception as exc:  # pragma: no cover - runtime setup dependent
            self.model_error = str(exc)

    def estimate_volume(self, width_px, height_px):
        width_cm = width_px / PIXELS_PER_CM
        height_cm = height_px / PIXELS_PER_CM
        depth_cm = (width_cm + height_cm) / 2
        volume_cm3 = width_cm * height_cm * depth_cm
        return round(volume_cm3, 2)

    def estimate_calories(self, label, volume_cm3):
        density = CALORIE_DENSITY.get(label.lower(), 1.2)
        return round(volume_cm3 * density, 2)

    def process_image(self, image_path, processed_dir):
        image = cv2.imread(image_path)
        if image is None:
            raise ValueError('Invalid image file.')

        if self.model is None:
            raise RuntimeError(f'YOLO model unavailable: {self.model_error}')

        inference = self.model(image, verbose=False)
        result = inference[0]
        boxes = result.boxes
        names = result.names

        detected_items = []
        total_volume = 0.0
        total_calories = 0.0

        for box in boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())
            cls_id = int(box.cls[0].item())
            conf = float(box.conf[0].item())
            label = names.get(cls_id, f'class_{cls_id}')

            width_px = max(x2 - x1, 1)
            height_px = max(y2 - y1, 1)
            volume = self.estimate_volume(width_px, height_px)
            calories = self.estimate_calories(label, volume)

            total_volume += volume
            total_calories += calories

            detected_items.append({
                'food': label,
                'confidence': round(conf, 4),
                'bbox': [x1, y1, x2, y2],
                'volume': volume,
                'calories': calories
            })

            cv2.rectangle(image, (x1, y1), (x2, y2), (60, 180, 75), 2)
            cv2.putText(
                image,
                f'{label} {conf:.2f}',
                (x1, max(20, y1 - 8)),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.6,
                (255, 255, 255),
                2,
                cv2.LINE_AA
            )

        filename = f"processed_{datetime.utcnow().strftime('%Y%m%d%H%M%S%f')}.jpg"
        output_path = os.path.join(processed_dir, filename)
        cv2.imwrite(output_path, image)

        primary = detected_items[0]['food'] if detected_items else 'Unknown'

        return {
            'detected_food': primary,
            'volume': round(total_volume, 2),
            'calories': round(total_calories, 2),
            'items': detected_items,
            'processed_image': f'/processed/{filename}'
        }
