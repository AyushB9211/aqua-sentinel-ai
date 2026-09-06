"""
SeaSentinel AI - Patch-Based YOLOv8n Model Trainer
SIH 26057: AI-Powered Automated Underwater Marine Debris and Anomaly Detection System
"""

import os
import shutil
from ultralytics import YOLO

YAML_PATH = "C:/SeaSentinelAI/training/patch_dataset/data.yaml"
OUTPUT_MODEL_PATH = "C:/SeaSentinelAI/model/seasentinel_shipwreck.pt"
PROJECT_RUNS_DIR = "C:/SeaSentinelAI/training/runs_patch"

def train():
    print("=" * 70)
    print("STEP 5: TRAINING YOLOV8N ON 640x640 SONAR PATCH DATASET")
    print("=" * 70)

    os.makedirs(os.path.dirname(OUTPUT_MODEL_PATH), exist_ok=True)
    os.makedirs(PROJECT_RUNS_DIR, exist_ok=True)

    # Initialize YOLOv8n with pretrained weights
    model = YOLO("yolov8n.pt")

    results = model.train(
        data=YAML_PATH,
        epochs=30,
        imgsz=640,
        batch=4,
        device="cpu",
        patience=8,
        workers=0,
        project=PROJECT_RUNS_DIR,
        name="seasentinel_patch_yolov8n",
        exist_ok=True,
        verbose=True
    )

    best_pt = os.path.join(PROJECT_RUNS_DIR, "seasentinel_patch_yolov8n", "weights", "best.pt")
    if os.path.exists(best_pt):
        shutil.copy2(best_pt, OUTPUT_MODEL_PATH)
        print(f"\nSuccessfully saved trained best model to: {OUTPUT_MODEL_PATH}")
    else:
        print(f"Warning: best.pt not found at {best_pt}")

if __name__ == "__main__":
    train()
