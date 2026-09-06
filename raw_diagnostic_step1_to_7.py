"""
SeaSentinel AI - Raw Model & Inference Pipeline Diagnostic Script (Step 1 to Step 7)
"""

import os
import glob
import cv2
import numpy as np
import torch
import torchvision.ops as ops
from ultralytics import YOLO

MODEL_PATH = "C:/SeaSentinelAI/model/seasentinel_shipwreck.pt"
RAW_FULL_OUT = "C:/SeaSentinelAI/test/raw_full_result.jpg"
RAW_TILE_OUT = "C:/SeaSentinelAI/test/raw_tile_result.jpg"
TEST_IMG_DIR = "C:/SeaSentinelAI/dataset/AI4Shipwrecks/train/images"

def run_nms(boxes, scores, iou_threshold=0.50):
    if len(boxes) == 0:
        return []
    boxes_tensor = torch.tensor(boxes, dtype=torch.float32)
    scores_tensor = torch.tensor(scores, dtype=torch.float32)
    keep_indices = ops.nms(boxes_tensor, scores_tensor, iou_threshold)
    return keep_indices.cpu().numpy().tolist()

def generate_tiles(img_w, img_h, tile_size=640, overlap=0.25):
    stride = int(tile_size * (1.0 - overlap)) # 480 px
    tiles = []
    y_points = list(range(0, max(1, img_h - tile_size + 1), stride))
    if len(y_points) == 0 or y_points[-1] + tile_size < img_h:
        y_points.append(max(0, img_h - tile_size))
    x_points = list(range(0, max(1, img_w - tile_size + 1), stride))
    if len(x_points) == 0 or x_points[-1] + tile_size < img_w:
        x_points.append(max(0, img_w - tile_size))

    for y in y_points:
        for x in x_points:
            x2 = min(img_w, x + tile_size)
            y2 = min(img_h, y + tile_size)
            x1 = max(0, x2 - tile_size)
            y1 = max(0, y2 - tile_size)
            tiles.append((x1, y1, x2, y2))
    return tiles

def run_deep_diagnostics():
    print("=" * 75)
    print("SEASENTINEL AI: DEEP RAW MODEL & POST-PROCESSING DIAGNOSTIC")
    print("=" * 75)

    # 1. Check Model and Class Names (STEP 4)
    print("\n--- STEP 4: MODEL VERIFICATION & CLASS NAMES ---")
    if not os.path.exists(MODEL_PATH):
        print(f"CRITICAL ERROR: Model not found at {MODEL_PATH}")
        return

    model = YOLO(MODEL_PATH)
    print(f"Loaded Model Path:  {MODEL_PATH}")
    print(f"Model Task:         {model.task}")
    print(f"Model Class Names:  {model.names}")
    
    # 2. Select Test Image
    # Test DM_Wilson_01, DM_Wilson_02, DM_Wilson_03
    test_images = [
        os.path.join(TEST_IMG_DIR, "DM_Wilson_03.png"),
        os.path.join(TEST_IMG_DIR, "DM_Wilson_01.png"),
        os.path.join(TEST_IMG_DIR, "DM_Wilson_02.png")
    ]
    # Filter to existing
    test_images = [p for p in test_images if os.path.exists(p)]
    if not test_images:
        test_images = glob.glob(f"{TEST_IMG_DIR}/*.png")[:2]

    for img_path in test_images[:2]:
        img_name = os.path.basename(img_path)
        img = cv2.imread(img_path)
        img_h, img_w = img.shape[:2]

        print("\n" + "#" * 75)
        print(f"TESTING ON IMAGE: {img_name} ({img_w} x {img_h})")
        print("#" * 75)

        # -------------------------------------------------------------
        # STEP 1: BYPASS ALL CUSTOM POST-PROCESSING (DIRECT YOLOV8 INFERENCE)
        # -------------------------------------------------------------
        print("\n--- STEP 1: DIRECT ULTRALYTICS YOLO INFERENCE ACROSS CONFIDENCE THRESHOLDS ---")
        thresholds = [0.40, 0.20, 0.10, 0.05, 0.01]

        max_raw_conf = 0.0
        best_box_info = None

        for conf in thresholds:
            res = model.predict(source=img, imgsz=1280, conf=conf, iou=0.50, device="cpu", max_det=50, verbose=False)
            boxes = res[0].boxes
            num_dets = len(boxes)
            print(f"\n[Threshold conf={conf:.2f}] -> {num_dets} raw detections returned by YOLO:")
            for idx, b in enumerate(boxes):
                c = float(b.conf[0])
                cls_id = int(b.cls[0])
                xyxy = [round(v, 1) for v in b.xyxy[0].tolist()]
                cls_name = model.names.get(cls_id, str(cls_id))
                print(f"  ({idx+1}) [{cls_name}] confidence={c*100:.2f}% | bbox=({xyxy[0]}, {xyxy[1]}, {xyxy[2]}, {xyxy[3]})")
                if c > max_raw_conf:
                    max_raw_conf = c
                    best_box_info = (cls_name, c, xyxy)

        print(f"\nHighest Confidence on Full Image: {max_raw_conf*100:.2f}% ({best_box_info})")

        # -------------------------------------------------------------
        # STEP 2: TEST FULL IMAGE ONLY & SAVE RAW RESULT
        # -------------------------------------------------------------
        print("\n--- STEP 2: FULL IMAGE PREDICTION AT conf=0.01 (NO TILING) ---")
        res_full_raw = model.predict(source=img, imgsz=1280, conf=0.01, iou=0.50, device="cpu", max_det=50, verbose=False)
        annotated_full = res_full_raw[0].plot()
        os.makedirs(os.path.dirname(RAW_FULL_OUT), exist_ok=True)
        cv2.imwrite(RAW_FULL_OUT, annotated_full)
        print(f"Saved raw full-image annotated result ({len(res_full_raw[0].boxes)} boxes) to: {RAW_FULL_OUT}")

        # -------------------------------------------------------------
        # STEP 3: TEST ONE TILE DIRECTLY AROUND WRECK (imgsz=640, conf=0.01)
        # -------------------------------------------------------------
        print("\n--- STEP 3: TEST ONE 640x640 TILE DIRECTLY AROUND TARGET ---")
        # Crop a 640x640 patch around the starboard area (e.g. x=1088..1728, y=3900..4540)
        tile_tx1 = max(0, img_w - 640)
        tile_ty1 = 4000 if img_h > 4640 else max(0, img_h - 640)
        tile_tx2 = tile_tx1 + 640
        tile_ty2 = tile_ty1 + 640
        crop_target = img[tile_ty1:tile_ty2, tile_tx1:tile_tx2]

        res_tile_single = model.predict(source=crop_target, imgsz=640, conf=0.01, iou=0.50, device="cpu", max_det=50, verbose=False)
        boxes_tile = res_tile_single[0].boxes
        print(f"Direct tile ({tile_tx1}:{tile_tx2}, {tile_ty1}:{tile_ty2}) -> {len(boxes_tile)} predictions at conf=0.01:")
        for idx, b in enumerate(boxes_tile):
            c = float(b.conf[0])
            cls_id = int(b.cls[0])
            xyxy = [round(v, 1) for v in b.xyxy[0].tolist()]
            cls_name = model.names.get(cls_id, str(cls_id))
            print(f"  ({idx+1}) [{cls_name}] confidence={c*100:.2f}% | tile_bbox=({xyxy[0]}, {xyxy[1]}, {xyxy[2]}, {xyxy[3]})")

        annotated_tile = res_tile_single[0].plot()
        cv2.imwrite(RAW_TILE_OUT, annotated_tile)
        print(f"Saved raw tile annotated result to: {RAW_TILE_OUT}")

        # -------------------------------------------------------------
        # STEP 5 & 6: TRACE EXACT FILTER PIPELINE STEP-BY-STEP
        # -------------------------------------------------------------
        print("\n--- STEP 5 & 6: STEP-BY-STEP FILTER TRACING ---")
        tiles = generate_tiles(img_w, img_h, tile_size=640, overlap=0.25)
        print(f"Total tiles generated: {len(tiles)}")

        raw_tile_dets = []
        for t_idx, (tx1, ty1, tx2, ty2) in enumerate(tiles):
            tile_crop = img[ty1:ty2, tx1:tx2]
            res_t = model.predict(source=tile_crop, imgsz=640, conf=0.01, device="cpu", verbose=False)
            for b in res_t[0].boxes:
                c = float(b.conf[0])
                cls_id = int(b.cls[0])
                bx1, by1, bx2, by2 = b.xyxy[0].tolist()
                raw_tile_dets.append({
                    "conf": c,
                    "class": model.names.get(cls_id, "shipwreck"),
                    "local_box": [bx1, by1, bx2, by2],
                    "tile_offset": (tx1, ty1),
                    "tile_idx": t_idx
                })

        print(f"RAW TILE DETECTIONS (conf >= 0.01):       {len(raw_tile_dets)}")

        # A. Coordinate mapping & clamping
        mapped_dets = []
        discarded_clamp = 0
        for d in raw_tile_dets:
            tx1, ty1 = d["tile_offset"]
            bx1, by1, bx2, by2 = d["local_box"]
            gx1 = max(0.0, min(float(img_w), tx1 + bx1))
            gy1 = max(0.0, min(float(img_h), ty1 + by1))
            gx2 = max(0.0, min(float(img_w), tx1 + bx2))
            gy2 = max(0.0, min(float(img_h), ty1 + by2))

            if gx2 > gx1 and gy2 > gy1:
                mapped_dets.append({
                    "conf": d["conf"],
                    "class": d["class"],
                    "bbox": [gx1, gy1, gx2, gy2],
                    "local_box": d["local_box"]
                })
            else:
                discarded_clamp += 1

        print(f"AFTER COORDINATE MAPPING & CLAMP:        {len(mapped_dets)} (Discarded invalid: {discarded_clamp})")

        # B. Test Confidence Filtering at 0.40 vs 0.30 vs 0.20 vs 0.10
        for test_thresh in [0.40, 0.30, 0.20, 0.10]:
            pass_conf = [d for d in mapped_dets if d["conf"] >= test_thresh]
            discarded_conf = len(mapped_dets) - len(pass_conf)
            print(f"  -> Threshold {test_thresh:.2f}: {len(pass_conf)} pass (Discarded {discarded_conf} below {test_thresh:.2f})")

        # C. Size Filter at 0.40
        conf_40 = [d for d in mapped_dets if d["conf"] >= 0.40]
        min_w = 0.02 * img_w
        min_h = 0.015 * img_h
        size_pass = []
        discarded_size = []
        for d in conf_40:
            bw = d["bbox"][2] - d["bbox"][0]
            bh = d["bbox"][3] - d["bbox"][1]
            if bw >= min_w or bh >= min_h:
                size_pass.append(d)
            else:
                discarded_size.append(f"Box {d['bbox']} size {bw:.1f}x{bh:.1f} < min {min_w:.1f}x{min_h:.1f}")

        print(f"AFTER SIZE FILTER (on conf >= 0.40):      {len(size_pass)} (Discarded {len(discarded_size)})")
        for r in discarded_size:
            print(f"    - Discard reason: {r}")

        # D. NMS
        if size_pass:
            b_np = np.array([d["bbox"] for d in size_pass])
            s_np = np.array([d["conf"] for d in size_pass])
            keep = run_nms(b_np, s_np, iou_threshold=0.50)
            after_nms = [size_pass[k] for k in keep]
        else:
            after_nms = []

        print(f"AFTER NMS (IoU=0.50):                     {len(after_nms)}")

    # -------------------------------------------------------------
    # STEP 7: ROOT CAUSE CLASSIFICATION
    # -------------------------------------------------------------
    print("\n" + "=" * 75)
    print("STEP 7: ROOT CAUSE CLASSIFICATION & DIAGNOSTIC SUMMARY")
    print("=" * 75)
    print(f"Model Path Loaded:             {MODEL_PATH}")
    print(f"Model Class Names:             {model.names}")
    print(f"Max Raw Confidence Produced:   {max_raw_conf*100:.2f}%")

if __name__ == "__main__":
    run_deep_diagnostics()
