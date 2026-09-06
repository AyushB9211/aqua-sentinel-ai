"""
SeaSentinel AI - Patch-Based Tiling Verification & Evaluation Script
Tests inference before vs after tiling and saves annotated test images.
"""

import os
import glob
import cv2
from tiled_inference import predict_tiled
from ultralytics import YOLO

MODEL_PATH = "C:/SeaSentinelAI/model/seasentinel_shipwreck.pt"
TEST_IMG_DIR = "C:/SeaSentinelAI/dataset/AI4Shipwrecks/train/images"
OUT_DIR = "C:/SeaSentinelAI/tiling_diagnostic_output"

os.makedirs(OUT_DIR, exist_ok=True)

def evaluate_tiling():
    print("=" * 70)
    print("SEASENTINEL AI: PATCH-BASED TILING INFERENCE EVALUATION")
    print("=" * 70)

    model = YOLO(MODEL_PATH)
    test_image_path = os.path.join(TEST_IMG_DIR, "DM_Wilson_03.png")

    if not os.path.exists(test_image_path):
        all_imgs = glob.glob(f"{TEST_IMG_DIR}/*.png")
        test_image_path = all_imgs[0]

    img = cv2.imread(test_image_path)
    img_h, img_w = img.shape[:2]
    img_name = os.path.basename(test_image_path)

    print(f"\n1. Target Image: {img_name}")
    print(f"   Resolution: {img_w} x {img_h} pixels")

    # A. BEFORE TILING (Standard Single-Pass Inference)
    print("\n--- [A] BEFORE TILING (Standard 640x640 Resize) ---")
    standard_res = model.predict(source=test_image_path, conf=0.10, imgsz=640, device="cpu", verbose=False)
    num_standard = len(standard_res[0].boxes)
    print(f"Detections at conf=0.10: {num_standard}")

    # B. AFTER TILING (Patch-Based Tiling)
    print("\n--- [B] AFTER TILING (Patch-Based Tiling: 640x640, 20% overlap) ---")
    for conf in [0.20, 0.15, 0.10, 0.05]:
        print(f"\nTesting Tiling with Confidence Threshold = {conf:.2f}:")
        tiled_result = predict_tiled(
            test_image_path,
            model=model,
            tile_size=640,
            overlap=0.20,
            conf_threshold=conf
        )

        highest_conf = max([d["confidence"] for d in tiled_result["detections"]]) if tiled_result["detections"] else 0.0
        print(f"  Result -> Raw: {tiled_result['num_raw_detections']}, Final (after NMS): {tiled_result['num_final_detections']}, Max Conf: {highest_conf*100:.1f}%")

    # C. Run on 3 other sonar test images
    print("\n--- [C] Testing Tiling on Multiple Sonar Scans ---")
    sample_images = sorted(glob.glob(f"{TEST_IMG_DIR}/*.png"))[:4]
    
    for s_path in sample_images:
        s_name = os.path.basename(s_path)
        res = predict_tiled(s_path, model=model, tile_size=640, overlap=0.20, conf_threshold=0.10)
        
        # Save annotated image
        s_img = cv2.imread(s_path)
        for det in res["detections"]:
            bx = det["boxPixels"]
            x1, y1, x2, y2 = int(bx["x1"]), int(bx["y1"]), int(bx["x2"]), int(bx["y2"])
            cv2.rectangle(s_img, (x1, y1), (x2, y2), (0, 0, 255), 3)
            label_text = f"{det['classification']} {det['confidence']*100:.0f}%"
            cv2.putText(s_img, label_text, (x1, max(30, y1 - 10)), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 0, 255), 2)

        out_annotated = os.path.join(OUT_DIR, f"annotated_tiled_{s_name}")
        cv2.imwrite(out_annotated, s_img)
        print(f"  Saved annotated scan ({len(res['detections'])} detections) to: {out_annotated}")

if __name__ == "__main__":
    evaluate_tiling()
