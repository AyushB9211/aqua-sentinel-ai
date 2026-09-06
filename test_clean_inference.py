"""
SeaSentinel AI - Clean Coordinate Mapping & High-Confidence Benchmark
SIH 26057: AI-Powered Automated Underwater Marine Debris and Anomaly Detection System
"""

import os
import glob
import cv2
import numpy as np
import torch
import torchvision.ops as ops
from ultralytics import YOLO

MODEL_PATH = "C:/SeaSentinelAI/model/seasentinel_shipwreck.pt"
OUTPUT_DEBUG_IMAGE = "C:/SeaSentinelAI/test/debug_final.jpg"
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

def clean_inference(
    image_path,
    model_path=MODEL_PATH,
    conf_threshold=0.40,
    raw_eval_conf=0.10,
    iou_threshold=0.50,
    tile_size=640,
    overlap=0.25
):
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError(f"Could not load image from {image_path}")

    img_h, img_w = img.shape[:2]
    model = YOLO(model_path)

    # 1. Full image inference (1280px)
    res_full = model.predict(source=img, imgsz=1280, conf=raw_eval_conf, device="cpu", verbose=False)
    all_raw = []

    for b in res_full[0].boxes:
        cls_id = int(b.cls[0])
        conf = float(b.conf[0])
        x1, y1, x2, y2 = b.xyxy[0].tolist()

        # Clamp to image boundaries
        x1 = max(0.0, min(float(img_w), x1))
        y1 = max(0.0, min(float(img_h), y1))
        x2 = max(0.0, min(float(img_w), x2))
        y2 = max(0.0, min(float(img_h), y2))

        # Check valid box
        if (x2 - x1) >= 5 and (y2 - y1) >= 5 and (x2 - x1) * (y2 - y1) >= 100:
            all_raw.append({
                "class": model.names.get(cls_id, "shipwreck"),
                "class_id": cls_id,
                "conf": conf,
                "bbox": [x1, y1, x2, y2],
                "source": "full_image"
            })

    # 2. Tiled inference (640x640, 25% overlap)
    tiles = generate_tiles(img_w, img_h, tile_size=tile_size, overlap=overlap)
    raw_tile_count = 0

    for t_idx, (tx1, ty1, tx2, ty2) in enumerate(tiles):
        tile_crop = img[ty1:ty2, tx1:tx2]
        res_tile = model.predict(source=tile_crop, imgsz=tile_size, conf=raw_eval_conf, device="cpu", verbose=False)
        for b in res_tile[0].boxes:
            cls_id = int(b.cls[0])
            conf = float(b.conf[0])
            bx1, by1, bx2, by2 = b.xyxy[0].tolist()

            # Global image pixel coordinates
            gx1 = max(0.0, min(float(img_w), tx1 + bx1))
            gy1 = max(0.0, min(float(img_h), ty1 + by1))
            gx2 = max(0.0, min(float(img_w), tx1 + bx2))
            gy2 = max(0.0, min(float(img_h), ty1 + by2))

            if (gx2 - gx1) >= 5 and (gy2 - gy1) >= 5 and (gx2 - gx1) * (gy2 - gy1) >= 100:
                all_raw.append({
                    "class": model.names.get(cls_id, "shipwreck"),
                    "class_id": cls_id,
                    "conf": conf,
                    "bbox": [gx1, gy1, gx2, gy2],
                    "source": f"tile_{t_idx}"
                })
                raw_tile_count += 1

    # 3. Filter by final confidence threshold (conf >= 0.40)
    conf_filtered = [d for d in all_raw if d["conf"] >= conf_threshold]

    # 4. Apply NMS (IoU = 0.50)
    final_detections = []
    if conf_filtered:
        boxes_np = np.array([d["bbox"] for d in conf_filtered])
        scores_np = np.array([d["conf"] for d in conf_filtered])
        keep_idxs = run_nms(boxes_np, scores_np, iou_threshold=iou_threshold)

        # Sort descending by confidence
        sorted_keeps = sorted(keep_idxs, key=lambda idx: conf_filtered[idx]["conf"], reverse=True)
        for rank, k in enumerate(sorted_keeps, 1):
            d = conf_filtered[k]
            x1, y1, x2, y2 = d["bbox"]
            final_detections.append({
                "rank": rank,
                "class": d["class"].upper(),
                "confidence": d["conf"],
                "bbox": (round(x1, 1), round(y1, 1), round(x2, 1), round(y2, 1)),
                "x_pct": round((x1 / img_w) * 100.0, 2),
                "y_pct": round((y1 / img_h) * 100.0, 2),
                "w_pct": round(((x2 - x1) / img_w) * 100.0, 2),
                "h_pct": round(((y2 - y1) / img_h) * 100.0, 2),
            })

    # 5. Draw clean debug image (original sonar image ONLY)
    os.makedirs(os.path.dirname(OUTPUT_DEBUG_IMAGE), exist_ok=True)
    annotated = img.copy()

    for d in final_detections:
        x1, y1, x2, y2 = [int(v) for v in d["bbox"]]
        cv2.rectangle(annotated, (x1, y1), (x2, y2), (0, 0, 255), 4)
        label = f"{d['class']} {d['confidence']*100:.0f}%"
        cv2.putText(annotated, label, (x1, max(40, y1 - 15)), cv2.FONT_HERSHEY_SIMPLEX, 1.1, (0, 0, 255), 3)

    cv2.imwrite(OUTPUT_DEBUG_IMAGE, annotated)

    print("=" * 70)
    print("SEASENTINEL AI: CLEAN COORDINATE INFERENCE REPORT")
    print("=" * 70)
    print(f"Original image size:                  {img_w}x{img_h}")
    print(f"Tile count:                           {len(tiles)}")
    print(f"Raw tile detections:                  {raw_tile_count}")
    print(f"Detections after confidence filter:   {len(conf_filtered)} (threshold >= {conf_threshold*100:.0f}%)")
    print(f"Detections after NMS:                 {len(final_detections)}")
    print(f"Final detections:                     {len(final_detections)}")
    print("\n--- FINAL DETECTIONS BREAKDOWN ---")
    for d in final_detections:
        print(f"  [{d['class']}] confidence={d['confidence']*100:.1f}% | bbox={d['bbox']} | (x={d['x_pct']}%, y={d['y_pct']}%, w={d['w_pct']}%, h={d['h_pct']}%)")
    print(f"\nSaved raw debug image to: {OUTPUT_DEBUG_IMAGE}")

    return final_detections

if __name__ == "__main__":
    test_img = os.path.join(TEST_IMG_DIR, "DM_Wilson_03.png")
    clean_inference(test_img, conf_threshold=0.40)
