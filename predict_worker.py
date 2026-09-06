"""
SeaSentinel AI - Model Prediction / Inference Script
SIH 26057: AI-Powered Automated Underwater Marine Debris and Anomaly Detection System
"""

import sys
import os
import json
import argparse
from ultralytics import YOLO
import cv2

DEFAULT_MODEL_PATH = "C:/SeaSentinelAI/model/seasentinel_shipwreck.pt"

def predict_image(image_path, model_path=DEFAULT_MODEL_PATH, conf_threshold=0.25):
    if not os.path.exists(image_path):
        print(f"Error: Image not found at {image_path}")
        return []

    if not os.path.exists(model_path):
        print(f"Error: Model weights not found at {model_path}")
        return []

    # Read image dimensions
    img = cv2.imread(image_path)
    if img is None:
        print(f"Error: Unable to load image at {image_path}")
        return []
    
    img_h, img_w = img.shape[:2]

    # Load trained YOLO model
    model = YOLO(model_path)
    results = model.predict(source=image_path, conf=conf_threshold, imgsz=640, device="cpu", verbose=False)

    detections = []
    for r in results:
        for box in r.boxes:
            cls_id = int(box.cls[0])
            cls_name = model.names.get(cls_id, "shipwreck")
            confidence = float(box.conf[0])
            x1, y1, x2, y2 = box.xyxy[0].tolist()

            # Normalized / percentage coordinates
            x_pct = (x1 / img_w) * 100.0
            y_pct = (y1 / img_h) * 100.0
            width_pct = ((x2 - x1) / img_w) * 100.0
            height_pct = ((y2 - y1) / img_h) * 100.0

            det = {
                "class_id": cls_id,
                "class_name": cls_name,
                "confidence": round(confidence, 4),
                "box_pixels": {
                    "x1": round(x1, 2),
                    "y1": round(y1, 2),
                    "x2": round(x2, 2),
                    "y2": round(y2, 2),
                },
                "box_percentages": {
                    "x": round(x_pct, 2),
                    "y": round(y_pct, 2),
                    "width": round(width_pct, 2),
                    "height": round(height_pct, 2),
                },
                "image_dimensions": {
                    "width": img_w,
                    "height": img_h,
                }
            }
            detections.append(det)

    print(f"\nInference Results for: {os.path.basename(image_path)}")
    print(f"Image Resolution: {img_w}x{img_h}")
    print(f"Detections Found: {len(detections)}")
    for i, d in enumerate(detections, 1):
        print(f"  [{i}] Class: {d['class_name']} | Conf: {d['confidence']*100:.1f}% | "
              f"Pixels: ({d['box_pixels']['x1']}, {d['box_pixels']['y1']}, {d['box_pixels']['x2']}, {d['box_pixels']['y2']}) | "
              f"Swath Pos: x={d['box_percentages']['x']:.1f}%, y={d['box_percentages']['y']:.1f}%")

    return detections

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="SeaSentinel AI Sonar Shipwreck Inference")
    parser.add_argument("image", nargs="?", default="", help="Path to input sonar image")
    parser.add_argument("--model", default=DEFAULT_MODEL_PATH, help="Path to trained .pt model")
    parser.add_argument("--conf", type=float, default=0.25, help="Confidence threshold (0.0 to 1.0)")

    args = parser.parse_args()

    if not args.image:
        print("Usage: python predict.py <path_to_sonar_image> [--conf 0.25]")
        sys.exit(0)

    predict_image(args.image, model_path=args.model, conf_threshold=args.conf)
