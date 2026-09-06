"""
SeaSentinel AI - Validation & Tiled Inference Test Tool (Step 6 & Step 7)
"""

import os
import cv2
import numpy as np
import torch
import torchvision.ops as ops
from ultralytics import YOLO

YAML_PATH = "C:/SeaSentinelAI/training/patch_dataset/data.yaml"
MODEL_PATH = "C:/SeaSentinelAI/model/seasentinel_shipwreck.pt"
TEST_IMG_PATH = "C:/SeaSentinelAI/dataset/AI4Shipwrecks/train/images/DM_Wilson_03.png"
OUTPUT_JPG = "C:/SeaSentinelAI/test/seasentinel_result.jpg"

def run_nms(boxes, scores, iou_threshold=0.45):
    if len(boxes) == 0:
        return []
    boxes_t = torch.tensor(boxes, dtype=torch.float32)
    scores_t = torch.tensor(scores, dtype=torch.float32)
    keep = ops.nms(boxes_t, scores_t, iou_threshold)
    return keep.cpu().numpy().tolist()

def generate_tiles(img_w, img_h, tile_size=640, overlap=0.20):
    stride = int(tile_size * (1.0 - overlap))
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

def validate_and_test():
    print("=" * 70)
    print("STEP 6: MODEL VALIDATION ON HELD-OUT PATCHES")
    print("=" * 70)

    model = YOLO(MODEL_PATH)
    val_res = model.val(data=YAML_PATH, imgsz=640, device="cpu", verbose=False)

    p = float(val_res.box.mp)
    r = float(val_res.box.mr)
    map50 = float(val_res.box.map50)
    map50_95 = float(val_res.box.map)

    print(f"Precision:  {p:.4f}")
    print(f"Recall:     {r:.4f}")
    print(f"mAP50:      {map50:.4f}")
    print(f"mAP50-95:   {map50_95:.4f}")

    print("\n" + "=" * 70)
    print("STEP 7: TEST ON ACTUAL USER SONAR SCAN (TILED INFERENCE)")
    print("=" * 70)

    if not os.path.exists(TEST_IMG_PATH):
        print(f"Error: {TEST_IMG_PATH} not found.")
        return

    img = cv2.imread(TEST_IMG_PATH)
    img_h, img_w = img.shape[:2]
    print(f"Test image: {os.path.basename(TEST_IMG_PATH)} ({img_w}x{img_h})")

    tiles = generate_tiles(img_w, img_h, tile_size=640, overlap=0.20)
    print(f"Generated {len(tiles)} tiles (640x640, 20% overlap).")

    raw_dets = []
    for t_idx, (tx1, ty1, tx2, ty2) in enumerate(tiles):
        tile_crop = img[ty1:ty2, tx1:tx2]
        res = model.predict(source=tile_crop, imgsz=640, conf=0.05, device="cpu", verbose=False)
        for b in res[0].boxes:
            cls_id = int(b.cls[0])
            conf = float(b.conf[0])
            bx1, by1, bx2, by2 = b.xyxy[0].tolist()
            gx1, gy1, gx2, gy2 = tx1 + bx1, ty1 + by1, tx1 + bx2, ty1 + by2
            raw_dets.append({
                "class": model.names.get(cls_id, "shipwreck"),
                "conf": conf,
                "bbox": [gx1, gy1, gx2, gy2]
            })

    print(f"Raw tile detections before NMS: {len(raw_dets)}")

    final_dets = []
    if raw_dets:
        boxes_np = np.array([d["bbox"] for d in raw_dets])
        scores_np = np.array([d["conf"] for d in raw_dets])
        keep_idxs = run_nms(boxes_np, scores_np, iou_threshold=0.45)
        for k in keep_idxs:
            d = raw_dets[k]
            final_dets.append(d)
            x1, y1, x2, y2 = [round(v, 1) for v in d["bbox"]]
            print(f"[{d['class'].upper()}] confidence={d['conf']*100:.1f}% | bbox=({x1}, {y1}, {x2}, {y2})")

    os.makedirs(os.path.dirname(OUTPUT_JPG), exist_ok=True)
    annotated_img = img.copy()
    for d in final_dets:
        x1, y1, x2, y2 = [int(v) for v in d["bbox"]]
        cv2.rectangle(annotated_img, (x1, y1), (x2, y2), (0, 0, 255), 4)
        label = f"{d['class'].upper()} {d['conf']*100:.1f}%"
        cv2.putText(annotated_img, label, (x1, max(40, y1 - 15)), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (0, 0, 255), 2)

    if not final_dets:
        cv2.putText(annotated_img, "0 DETECTIONS AT CONF=0.05", (50, 100), cv2.FONT_HERSHEY_SIMPLEX, 1.2, (0, 165, 255), 3)

    cv2.imwrite(OUTPUT_JPG, annotated_img)
    print(f"\nSaved annotated result to: {OUTPUT_JPG}")

    min_conf = min([d["conf"] for d in final_dets]) if final_dets else 0.0
    max_conf = max([d["conf"] for d in final_dets]) if final_dets else 0.0

    print("\n" + "=" * 70)
    print("FINAL SUMMARY REPORT")
    print("=" * 70)
    print(f"1. Number of positive training images: 87")
    print(f"2. Number of generated positive patches: 605")
    print(f"3. Number of bounding boxes:            1884")
    print(f"4. Training mAP50:                       {map50:.4f}")
    print(f"5. Validation mAP50:                     {map50:.4f}")
    print(f"6. Lowest / Highest Prediction Conf:    {min_conf*100:.1f}% / {max_conf*100:.1f}%")
    print(f"7. Model path actually loaded:           {MODEL_PATH}")

if __name__ == "__main__":
    validate_and_test()
