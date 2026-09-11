"""
SeaSentinel AI - Training Script for YOLOv8n Shipwreck Detector
SIH 26057: AI-Powered Automated Underwater Marine Debris and Anomaly Detection System
"""

import os
import shutil
from ultralytics import YOLO

DATA_YAML = "C:/SeaSentinelAI/training/data.yaml"
OUTPUT_MODEL_DIR = "C:/SeaSentinelAI/model"
FINAL_MODEL_PATH = "C:/SeaSentinelAI/model/seasentinel_shipwreck.pt"

def train():
    print("=" * 60)
    print("SeaSentinel AI: Starting YOLOv8n Training on AI4Shipwrecks")
    print("=" * 60)

    os.makedirs(OUTPUT_MODEL_DIR, exist_ok=True)

    # Initialize lightweight YOLOv8n
    model = YOLO("yolov8n.pt")

    # Train with lightweight settings suitable for CPU prototype
    results = model.train(
        data=DATA_YAML,
        epochs=15,
        imgsz=512,
        batch=8,
        device="cpu",
        workers=2,
        patience=5,
        save=True,
        project="C:/SeaSentinelAI/training/runs",
        name="seasentinel_yolov8n",
        exist_ok=True,
        verbose=True,
    )

    print("\n" + "=" * 60)
    print("Training Completed!")
    print("=" * 60)

    # Locate best.pt
    best_pt = "C:/SeaSentinelAI/training/runs/seasentinel_yolov8n/weights/best.pt"
    last_pt = "C:/SeaSentinelAI/training/runs/seasentinel_yolov8n/weights/last.pt"

    source_pt = best_pt if os.path.exists(best_pt) else last_pt

    if os.path.exists(source_pt):
        shutil.copy2(source_pt, FINAL_MODEL_PATH)
        print(f"Successfully copied trained model to: {FINAL_MODEL_PATH}")
    else:
        print(f"Warning: Could not find trained weights at {best_pt}")

    # Validate model
    print("\nRunning Validation Evaluation...")
    val_model = YOLO(FINAL_MODEL_PATH)
    metrics = val_model.val(data=DATA_YAML, device="cpu", imgsz=512)
    print("Validation metrics:")
    print(f"  - mAP50:     {metrics.box.map50:.4f}")
    print(f"  - mAP50-95:  {metrics.box.map:.4f}")
    print(f"  - Precision: {metrics.box.mp:.4f}")
    print(f"  - Recall:    {metrics.box.mr:.4f}")

    return metrics

if __name__ == "__main__":
    train()
