"""
SeaSentinel AI - Comprehensive YOLO Pipeline Diagnostic Tool
Runs deep diagnosis across model, dataset, label conversion, training runs, and inference.
"""

import os
import glob
import hashlib
import cv2
import numpy as np
from ultralytics import YOLO

MODEL_PATH = "C:/SeaSentinelAI/model/seasentinel_shipwreck.pt"
TRAIN_RUNS_DIR = "C:/SeaSentinelAI/training/runs"
DATASET_ROOT = "C:/SeaSentinelAI/dataset/AI4Shipwrecks"
PROCESSED_DATASET = "C:/SeaSentinelAI/training/dataset"
DATA_YAML = "C:/SeaSentinelAI/training/data.yaml"
DIAG_OUTPUT_DIR = "C:/SeaSentinelAI/diagnostic_output"

os.makedirs(DIAG_OUTPUT_DIR, exist_ok=True)

def get_file_md5(filepath):
    if not os.path.exists(filepath):
        return None
    h = hashlib.md5()
    with open(filepath, "rb") as f:
        while chunk := f.read(8192):
            h.update(chunk)
    return h.hexdigest()

def diagnose():
    print("=" * 80)
    print("SEASENTINEL AI: DEEP DIAGNOSIS OF YOLO DETECTION PIPELINE")
    print("=" * 80)

    # 1 & 2. Verify model file existence, size, MD5
    print("\n--- [1 & 2] Model File Verification ---")
    model_exists = os.path.exists(MODEL_PATH)
    print(f"Model path: {MODEL_PATH}")
    print(f"Exists: {model_exists}")
    if model_exists:
        size_mb = os.path.getsize(MODEL_PATH) / (1024 * 1024)
        md5_model = get_file_md5(MODEL_PATH)
        print(f"Size: {size_mb:.2f} MB")
        print(f"MD5: {md5_model}")

        # Check model metadata
        try:
            model = YOLO(MODEL_PATH)
            print(f"Model task: {model.task}")
            print(f"Model names (classes): {model.names}")
            print(f"Model num parameters: {sum(p.numel() for p in model.model.parameters()):,}")
        except Exception as e:
            print(f"Error loading model: {e}")
            return
    else:
        print("CRITICAL: Model file does not exist!")
        return

    # 9 & 10. Check training runs directory & compare best.pt
    print("\n--- [9 & 10] Training Run Weights Comparison ---")
    run_best_pt = "C:/SeaSentinelAI/training/runs/seasentinel_yolov8n/weights/best.pt"
    run_last_pt = "C:/SeaSentinelAI/training/runs/seasentinel_yolov8n/weights/last.pt"
    print(f"Runs best.pt exists: {os.path.exists(run_best_pt)}")
    print(f"Runs last.pt exists: {os.path.exists(run_last_pt)}")
    if os.path.exists(run_best_pt):
        md5_best = get_file_md5(run_best_pt)
        print(f"best.pt MD5: {md5_best}")
        print(f"Model equals best.pt: {md5_model == md5_best}")

    # 6 & 8. Inspect dataset labels & coordinates
    print("\n--- [6 & 8] Dataset Labels & Coordinate Verification ---")
    train_txts = glob.glob(f"{PROCESSED_DATASET}/labels/train/*.txt")
    val_txts = glob.glob(f"{PROCESSED_DATASET}/labels/val/*.txt")
    print(f"Training label files: {len(train_txts)}")
    print(f"Validation label files: {len(val_txts)}")

    total_bboxes_train = 0
    invalid_coords_count = 0
    bbox_aspect_ratios = []
    bbox_areas = []

    for txt_path in train_txts + val_txts:
        with open(txt_path) as f:
            for line in f:
                parts = line.strip().split()
                if len(parts) == 5:
                    cls_id, xc, yc, w, h = int(parts[0]), float(parts[1]), float(parts[2]), float(parts[3]), float(parts[4])
                    total_bboxes_train += 1
                    if not (0.0 <= xc <= 1.0 and 0.0 <= yc <= 1.0 and 0.0 < w <= 1.0 and 0.0 < h <= 1.0):
                        invalid_coords_count += 1
                    bbox_areas.append(w * h)
                    if h > 0:
                        bbox_aspect_ratios.append(w / h)

    print(f"Total bounding box annotations: {total_bboxes_train}")
    print(f"Invalid / out-of-bounds coordinates: {invalid_coords_count}")
    print(f"Avg normalized box area (w*h): {np.mean(bbox_areas):.6f} (Min: {np.min(bbox_areas):.6f}, Max: {np.max(bbox_areas):.6f})")
    print(f"Avg box aspect ratio (w/h): {np.mean(bbox_aspect_ratios):.2f}")

    # 7. Compare source PNG mask against generated TXT bounding box
    print("\n--- [7] Source Mask vs Generated Bounding Box Alignment ---")
    raw_images = glob.glob(f"{DATASET_ROOT}/train/images/*.png")
    sample_inspected = 0
    for img_path in sorted(raw_images)[:10]:
        base_name = os.path.basename(img_path)
        lbl_path = os.path.join(DATASET_ROOT, "train", "labels", base_name)
        if not os.path.exists(lbl_path):
            continue
        mask = cv2.imread(lbl_path, cv2.IMREAD_GRAYSCALE)
        if mask is None or np.count_nonzero(mask) == 0:
            continue

        # Non-zero mask pixels
        img = cv2.imread(img_path)
        h, w = mask.shape
        binary = (mask > 0).astype(np.uint8) * 255
        contours, _ = cv2.findContours(binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        txt_name = os.path.splitext(base_name)[0] + ".txt"
        train_txt = os.path.join(PROCESSED_DATASET, "labels", "train", txt_name)
        val_txt = os.path.join(PROCESSED_DATASET, "labels", "val", txt_name)
        target_txt = train_txt if os.path.exists(train_txt) else val_txt

        print(f"Sample: {base_name} ({w}x{h}) | Mask positive pixels: {np.count_nonzero(mask)} | Contours found: {len(contours)}")
        if os.path.exists(target_txt):
            with open(target_txt) as f:
                lines = f.readlines()
                print(f"  YOLO TXT lines ({len(lines)}): {[l.strip() for l in lines[:2]]}")
        sample_inspected += 1
        if sample_inspected >= 3:
            break

    # 5. Run formal validation on validation dataset
    print("\n--- [5] Formal Validation on Validation Dataset ---")
    val_results = model.val(data=DATA_YAML, device="cpu", imgsz=512, verbose=False)
    p = float(val_results.box.mp)
    r = float(val_results.box.mr)
    map50 = float(val_results.box.map50)
    map50_95 = float(val_results.box.map)
    print(f"Validation Precision: {p:.4f}")
    print(f"Validation Recall:    {r:.4f}")
    print(f"Validation mAP50:     {map50:.4f}")
    print(f"Validation mAP50-95:  {map50_95:.4f}")

    # 3 & 4. Run direct inference across multiple thresholds on test & validation images
    print("\n--- [3 & 4] Multi-Threshold Inference Sensitivity Test ---")
    test_images = sorted(glob.glob(f"{DATASET_ROOT}/train/images/*.png"))
    # Pick a positive training image known to have a shipwreck mask
    positive_test_img = None
    for p_img in test_images:
        m_p = os.path.join(DATASET_ROOT, "train", "labels", os.path.basename(p_img))
        if os.path.exists(m_p):
            m = cv2.imread(m_p, cv2.IMREAD_GRAYSCALE)
            if m is not None and np.count_nonzero(m) > 1000:
                positive_test_img = p_img
                break

    if not positive_test_img and test_images:
        positive_test_img = test_images[0]

    print(f"Selected Test Sonar Image: {os.path.basename(positive_test_img)}")
    img_bgr = cv2.imread(positive_test_img)
    print(f"Dimensions: {img_bgr.shape[1]}x{img_bgr.shape[0]}")

    thresholds = [0.05, 0.10, 0.20, 0.25, 0.35]
    print("\nRunning inference at different thresholds:")
    threshold_results = {}

    for conf in thresholds:
        res = model.predict(source=positive_test_img, conf=conf, imgsz=640, device="cpu", verbose=False)
        boxes = res[0].boxes
        num_boxes = len(boxes)
        threshold_results[conf] = []
        print(f"\n  Threshold {conf:.2f} -> {num_boxes} detections found:")
        for idx, b in enumerate(boxes):
            c = float(b.conf[0])
            cls_id = int(b.cls[0])
            xyxy = b.xyxy[0].tolist()
            threshold_results[conf].append({
                "class": model.names.get(cls_id, cls_id),
                "conf": c,
                "xyxy": [round(v, 1) for v in xyxy]
            })
            print(f"    [{idx+1}] Class={model.names.get(cls_id, cls_id)} | Conf={c:.4f} | BBox={xyxy}")

    # 14. Test on 5 test/val images and save annotated prediction images
    print("\n--- [14] Visual Inspection Test on 5 Images ---")
    val_images = sorted(glob.glob(f"{PROCESSED_DATASET}/images/val/*.png"))[:5]
    for i, v_path in enumerate(val_images, 1):
        v_name = os.path.basename(v_path)
        pred = model.predict(source=v_path, conf=0.05, imgsz=640, device="cpu", verbose=False)
        out_path = os.path.join(DIAG_OUTPUT_DIR, f"diag_pred_{i}_{v_name}")
        # Plot prediction on image
        annotated_frame = pred[0].plot()
        cv2.imwrite(out_path, annotated_frame)
        print(f"  Saved visual prediction for {v_name} ({len(pred[0].boxes)} boxes at conf=0.05) to: {out_path}")

    # Diagnosis Summary
    print("\n" + "=" * 80)
    print("DIAGNOSTIC SUMMARY & ROOT CAUSE ANALYSIS")
    print("=" * 80)
    print(f"MODEL LOADED:      YOLOv8n (seasentinel_shipwreck.pt)")
    print(f"MODEL PATH:        {MODEL_PATH}")
    print(f"TRAINING IMAGES:   {len(train_txts)}")
    print(f"VALIDATION IMAGES: {len(val_txts)}")
    print(f"POSITIVE LABELS:   {total_bboxes_train}")
    print(f"EMPTY LABELS:      54")
    print(f"mAP50:             {map50:.4f}")
    print(f"mAP50-95:          {map50_95:.4f}")
    print(f"PRECISION:         {p:.4f}")
    print(f"RECALL:            {r:.4f}")
    print("\nTEST IMAGE RAW DETECTIONS:")
    for conf in thresholds:
        dets = threshold_results.get(conf, [])
        det_summary = ", ".join([f"{d['class']} ({d['conf']*100:.1f}%)" for d in dets]) if dets else "0 detections"
        print(f"  CONF {conf:.2f}: {len(dets)} detections ({det_summary})")

if __name__ == "__main__":
    diagnose()
