"""
SeaSentinel AI - Direct Ground Truth Model Evaluation Script
Bypasses all custom pipelines, tiling, and post-processing.
Runs direct Ultralytics YOLO inference across conf thresholds [0.25, 0.10, 0.05, 0.01, 0.001].
"""

import os
import glob
import csv
import cv2
from ultralytics import YOLO

MODEL_PATH = "C:/SeaSentinelAI/model/seasentinel_shipwreck.pt"
DATASET_ROOT = "C:/SeaSentinelAI/dataset/AI4Shipwrecks"
TRAIN_PATCH_DIR = "C:/SeaSentinelAI/training/patch_dataset"
RUNS_DIR = "C:/SeaSentinelAI/training/runs_patch/seasentinel_patch_yolov8n"

OUT_DIR = "C:/SeaSentinelAI/test"
os.makedirs(OUT_DIR, exist_ok=True)

OUT_DIRECT_MODEL = os.path.join(OUT_DIR, "DIRECT_MODEL_RESULT.jpg")
OUT_DIRECT_DATASET = os.path.join(OUT_DIR, "DIRECT_DATASET_RESULT.jpg")

def run_direct_benchmark():
    print("=" * 80)
    print("SEASENTINEL AI: DIRECT GROUND TRUTH MODEL EVALUATION")
    print("=" * 80)

    # 1. FIND EXACT MODEL
    print("\n[SECTION 1] EXACT MODEL INFO:")
    exists = os.path.exists(MODEL_PATH)
    print(f"MODEL PATH: {MODEL_PATH}")
    print(f"MODEL FILE EXISTS: {exists}")
    if not exists:
        print("ERROR: Model file does not exist!")
        return

    size_mb = os.path.getsize(MODEL_PATH) / (1024 * 1024)
    print(f"MODEL FILE SIZE: {size_mb:.2f} MB")

    model = YOLO(MODEL_PATH)
    print(f"MODEL CLASS NAMES: {model.names}")
    print(f"MODEL TASK: {model.task}")

    # 2. SELECT IMAGES
    # A: Current user test image
    user_img_path = "C:/SeaSentinelAI/dataset/AI4Shipwrecks/train/images/DM_Wilson_03.png"
    # B: Another confirmed positive AI4Shipwrecks image
    pos_images = glob.glob(f"{DATASET_ROOT}/train/images/*.png")
    dataset_img_path = None
    for p in pos_images:
        lbl_p = os.path.join(DATASET_ROOT, "train", "labels", os.path.basename(p))
        if os.path.exists(lbl_p):
            m = cv2.imread(lbl_p, cv2.IMREAD_GRAYSCALE)
            if m is not None and (m > 0).sum() > 5000 and "DM_Wilson_03" not in p:
                dataset_img_path = p
                break
    if not dataset_img_path and pos_images:
        dataset_img_path = pos_images[0]

    print(f"\nCurrent User Image:    {user_img_path}")
    print(f"Dataset Positive Image: {dataset_img_path}")

    # 3. DIRECT TEST ON CURRENT USER IMAGE
    print("\n[SECTION 2 & 3] DIRECT MODEL TEST ON CURRENT IMAGE (imgsz=1280, conf=0.001, iou=0.70):")
    res_user = model.predict(
        source=user_img_path,
        imgsz=1280,
        conf=0.001,
        iou=0.70,
        device="cpu",
        max_det=100,
        verbose=False
    )

    user_boxes = res_user[0].boxes
    img_h, img_w = cv2.imread(user_img_path).shape[:2]
    print(f"IMAGE SIZE: {img_w}x{img_h}")
    print(f"MODEL CLASSES: {model.names}")
    print(f"NUMBER OF BOXES: {len(user_boxes)}")

    user_confs = []
    for idx, b in enumerate(user_boxes):
        cls_id = int(b.cls[0])
        cls_name = model.names.get(cls_id, str(cls_id))
        conf = float(b.conf[0])
        user_confs.append(conf)
        x1, y1, x2, y2 = [round(v, 1) for v in b.xyxy[0].tolist()]
        print(f"  Box #{idx+1}: class_id={cls_id}, class_name={cls_name}, conf={conf*100:.2f}%, bbox=({x1}, {y1}, {x2}, {y2})")

    if len(user_boxes) == 0:
        print("MODEL_RETURNED_ZERO_BOXES")
        max_user_conf = 0.0
        min_user_conf = 0.0
        avg_user_conf = 0.0
    else:
        max_user_conf = max(user_confs)
        min_user_conf = min(user_confs)
        avg_user_conf = sum(user_confs) / len(user_confs)

    print(f"MAX CONFIDENCE:     {max_user_conf*100:.2f}%")
    print(f"MIN CONFIDENCE:     {min_user_conf*100:.2f}%")
    print(f"AVERAGE CONFIDENCE: {avg_user_conf*100:.2f}%")
    print(f"TOTAL RAW BOXES:    {len(user_boxes)}")

    # 4. SAVE RAW RESULT
    annotated_user = res_user[0].plot(conf=True, labels=True, boxes=True)
    cv2.imwrite(OUT_DIRECT_MODEL, annotated_user)
    print(f"Saved direct model result to: {OUT_DIRECT_MODEL}")

    # 5. MULTIPLE CONFIDENCE LEVELS ON CURRENT IMAGE
    print("\n[SECTION 5] MULTIPLE CONFIDENCE LEVELS ON CURRENT IMAGE:")
    for conf_lvl in [0.25, 0.10, 0.05, 0.01, 0.001]:
        r = model.predict(source=user_img_path, imgsz=1280, conf=conf_lvl, iou=0.70, device="cpu", max_det=100, verbose=False)
        b_list = r[0].boxes
        mx = max([float(b.conf[0]) for b in b_list]) if len(b_list) > 0 else 0.0
        print(f"CONF={conf_lvl:<5} -> {len(b_list)} boxes, MAX={mx*100:.2f}%")

    # 6. DIRECT TEST ON POSITIVE AI4SHIPWRECKS DATASET IMAGE
    print("\n[SECTION 6] DIRECT TEST ON POSITIVE AI4SHIPWRECKS IMAGE:")
    print(f"TEST DATASET IMAGE: {os.path.basename(dataset_img_path)}")
    res_data = model.predict(
        source=dataset_img_path,
        imgsz=1280,
        conf=0.001,
        iou=0.70,
        device="cpu",
        max_det=100,
        verbose=False
    )
    data_boxes = res_data[0].boxes
    data_confs = [float(b.conf[0]) for b in data_boxes]
    max_data_conf = max(data_confs) if data_confs else 0.0
    print(f"NUMBER OF BOXES: {len(data_boxes)}")
    print(f"MAX CONFIDENCE:  {max_data_conf*100:.2f}%")
    print(f"CLASS:           {model.names}")
    for idx, b in enumerate(data_boxes[:10]):
        c = float(b.conf[0])
        cls_id = int(b.cls[0])
        xyxy = [round(v, 1) for v in b.xyxy[0].tolist()]
        print(f"  Box #{idx+1}: {model.names.get(cls_id, str(cls_id))} ({c*100:.2f}%) | bbox={xyxy}")

    annotated_data = res_data[0].plot(conf=True, labels=True, boxes=True)
    cv2.imwrite(OUT_DIRECT_DATASET, annotated_data)
    print(f"Saved direct dataset result to: {OUT_DIRECT_DATASET}")

    # 8. CHECK TRAINING DATA AND METRICS
    print("\n[SECTION 8] MODEL TRAINING DATA AND METRICS:")
    train_imgs = glob.glob(f"{TRAIN_PATCH_DIR}/images/train/*.png")
    train_lbls = glob.glob(f"{TRAIN_PATCH_DIR}/labels/train/*.txt")
    val_imgs = glob.glob(f"{TRAIN_PATCH_DIR}/images/val/*.png")
    val_lbls = glob.glob(f"{TRAIN_PATCH_DIR}/labels/val/*.txt")

    pos_lbl_count = 0
    empty_lbl_count = 0
    total_train_objs = 0
    for lf in train_lbls:
        with open(lf, "r", encoding="utf-8") as f:
            lines = [l.strip() for l in f.readlines() if l.strip()]
            if lines:
                pos_lbl_count += 1
                total_train_objs += len(lines)
            else:
                empty_lbl_count += 1

    total_val_objs = 0
    for lf in val_lbls:
        with open(lf, "r", encoding="utf-8") as f:
            lines = [l.strip() for l in f.readlines() if l.strip()]
            total_val_objs += len(lines)

    print(f"NUMBER OF TRAIN IMAGES:          {len(train_imgs)}")
    print(f"NUMBER OF TRAIN LABELS:          {len(train_lbls)}")
    print(f"NUMBER OF VALID YOLO LABEL FILES:{pos_lbl_count}")
    print(f"NUMBER OF EMPTY LABEL FILES:     {empty_lbl_count}")
    print(f"NUMBER OF POSITIVE OBJECTS:      {total_train_objs}")
    print(f"NUMBER OF VALIDATION IMAGES:     {len(val_imgs)}")
    print(f"NUMBER OF VALIDATION OBJECTS:    {total_val_objs}")
    print(f"TRAINING RESULTS PATH:           {RUNS_DIR}")

    csv_path = os.path.join(RUNS_DIR, "results.csv")
    if os.path.exists(csv_path):
        with open(csv_path, "r", encoding="utf-8") as f:
            reader = list(csv.DictReader(f))
            if reader:
                last_row = reader[-1]
                # Strip keys
                clean_row = {k.strip(): v.strip() for k, v in last_row.items()}
                print("\nFinal Epoch Training & Validation Metrics (results.csv):")
                print(f"  Precision: {float(clean_row.get('metrics/precision(B)', 0)):.4f}")
                print(f"  Recall:    {float(clean_row.get('metrics/recall(B)', 0)):.4f}")
                print(f"  mAP50:     {float(clean_row.get('metrics/mAP50(B)', 0)):.4f}")
                print(f"  mAP50-95:  {float(clean_row.get('metrics/mAP50-95(B)', 0)):.4f}")

    # SUMMARY REPORT
    print("\n" + "=" * 80)
    print("FINAL SUMMARY REPORT FOR USER")
    print("=" * 80)

    # Determine status
    if max_user_conf >= 0.50:
        status_str = "5. BACKEND POST-PROCESSING FAILURE"
    elif max_user_conf > 0.10:
        status_str = "2. MODEL WORKING BUT POOR GENERALIZATION"
    elif max_data_conf > 0.10 and max_user_conf <= 0.05:
        status_str = "2. MODEL WORKING BUT POOR GENERALIZATION"
    else:
        status_str = "3. MODEL TRAINING/DATASET FAILURE"

    print(f"MODEL_STATUS = {status_str}")
    print(f"CURRENT IMAGE MAX CONFIDENCE: {max_user_conf*100:.2f}%")
    print(f"CURRENT IMAGE RAW BOXES:      {len(user_boxes)} (at conf=0.001)")
    print(f"DATASET IMAGE MAX CONFIDENCE: {max_data_conf*100:.2f}%")
    print(f"DATASET IMAGE RAW BOXES:      {len(data_boxes)} (at conf=0.001)")
    print(f"MODEL CLASSES:                {model.names}")
    print(f"MODEL TASK:                   {model.task}")
    print(f"MODEL PATH:                   {MODEL_PATH}")

if __name__ == "__main__":
    run_direct_benchmark()
