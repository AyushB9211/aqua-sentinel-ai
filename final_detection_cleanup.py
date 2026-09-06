"""
SeaSentinel AI - Final Detection Cleanup Engine
Implements Multi-Scale Fusion, Strict Filtering, Coherent Large-Wreck Merging, and Clean Coordinate Clamping.
"""

import os
import glob
import cv2
import numpy as np
import torch
import torchvision.ops as ops
from ultralytics import YOLO

MODEL_PATH = "C:/SeaSentinelAI/model/seasentinel_shipwreck.pt"
OUTPUT_CLEAN_IMAGE = "C:/SeaSentinelAI/test/clean_result.jpg"
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

def compute_iou(boxA, boxB):
    xA = max(boxA[0], boxB[0])
    yA = max(boxA[1], boxB[1])
    xB = min(boxA[2], boxB[2])
    yB = min(boxA[3], boxB[3])

    interArea = max(0.0, xB - xA) * max(0.0, yB - yA)
    boxAArea = (boxA[2] - boxA[0]) * (boxA[3] - boxA[1])
    boxBArea = (boxB[2] - boxB[0]) * (boxB[3] - boxB[1])

    if boxAArea + boxBArea - interArea <= 0:
        return 0.0
    return interArea / float(boxAArea + boxBArea - interArea)

def compute_ios(boxA, boxB):
    """Intersection over smaller box (useful for fragment containment)"""
    xA = max(boxA[0], boxB[0])
    yA = max(boxA[1], boxB[1])
    xB = min(boxA[2], boxB[2])
    yB = min(boxA[3], boxB[3])

    interArea = max(0.0, xB - xA) * max(0.0, yB - yA)
    boxAArea = (boxA[2] - boxA[0]) * (boxA[3] - boxA[1])
    boxBArea = (boxB[2] - boxB[0]) * (boxB[3] - boxB[1])

    minArea = min(boxAArea, boxBArea)
    if minArea <= 0:
        return 0.0
    return interArea / float(minArea)

def merge_large_wrecks(detections, img_w, img_h, iou_thresh=0.25, ios_thresh=0.45):
    """
    Merges overlapping boxes or adjacent fragments belonging to the same large shipwreck structure.
    Spatially separate shipwrecks remain independent.
    """
    if len(detections) <= 1:
        return detections

    merged = []
    used = [False] * len(detections)

    for i in range(len(detections)):
        if used[i]:
            continue

        cur_box = list(detections[i]["bbox"])
        cur_conf = detections[i]["conf"]
        cur_class = detections[i]["class"]
        used[i] = True

        merged_any = True
        while merged_any:
            merged_any = False
            for j in range(len(detections)):
                if used[j]:
                    continue

                other_box = detections[j]["bbox"]
                other_conf = detections[j]["conf"]

                iou = compute_iou(cur_box, other_box)
                ios = compute_ios(cur_box, other_box)

                # Check if boxes overlap significantly or one is a fragment inside/touching the main hull
                # Also check if they are directly adjacent within 2% distance along the same swath
                dist_x = max(0, max(cur_box[0], other_box[0]) - min(cur_box[2], other_box[2]))
                dist_y = max(0, max(cur_box[1], other_box[1]) - min(cur_box[3], other_box[3]))

                is_adjacent = (dist_x < 0.03 * img_w) and (dist_y < 0.03 * img_h) and (iou > 0.15 or ios > 0.40)

                if iou >= iou_thresh or ios >= ios_thresh or is_adjacent:
                    # Enclose the larger structure
                    cur_box[0] = min(cur_box[0], other_box[0])
                    cur_box[1] = min(cur_box[1], other_box[1])
                    cur_box[2] = max(cur_box[2], other_box[2])
                    cur_box[3] = max(cur_box[3], other_box[3])
                    cur_conf = max(cur_conf, other_conf)
                    used[j] = True
                    merged_any = True

        # Clamp merged box
        cur_box[0] = max(0.0, min(float(img_w), cur_box[0]))
        cur_box[1] = max(0.0, min(float(img_h), cur_box[1]))
        cur_box[2] = max(0.0, min(float(img_w), cur_box[2]))
        cur_box[3] = max(0.0, min(float(img_h), cur_box[3]))

        merged.append({
            "class": cur_class,
            "conf": cur_conf,
            "bbox": cur_box
        })

    return merged

def process_sonar_image(image_path, model_path=MODEL_PATH, user_conf_thresh=0.40, raw_eval_conf=0.10):
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError(f"Could not load image from {image_path}")

    img_h, img_w = img.shape[:2]
    model = YOLO(model_path)

    # 1. RAW PREDICTIONS (Keep conf >= 0.10)
    all_raw = []

    # A. Full Image Inference (1280px)
    res_full = model.predict(source=img, imgsz=1280, conf=raw_eval_conf, device="cpu", verbose=False)
    for b in res_full[0].boxes:
        cls_id = int(b.cls[0])
        conf = float(b.conf[0])
        x1, y1, x2, y2 = b.xyxy[0].tolist()
        x1 = max(0.0, min(float(img_w), x1))
        y1 = max(0.0, min(float(img_h), y1))
        x2 = max(0.0, min(float(img_w), x2))
        y2 = max(0.0, min(float(img_h), y2))
        if (x2 - x1) > 0 and (y2 - y1) > 0:
            all_raw.append({
                "class": model.names.get(cls_id, "shipwreck"),
                "conf": conf,
                "bbox": [x1, y1, x2, y2],
                "source": "full_image"
            })

    # B. Tiled Inference (640x640, 25% overlap)
    tiles = generate_tiles(img_w, img_h, tile_size=640, overlap=0.25)
    for t_idx, (tx1, ty1, tx2, ty2) in enumerate(tiles):
        tile_crop = img[ty1:ty2, tx1:tx2]
        res_tile = model.predict(source=tile_crop, imgsz=640, conf=raw_eval_conf, device="cpu", verbose=False)
        for b in res_tile[0].boxes:
            cls_id = int(b.cls[0])
            conf = float(b.conf[0])
            bx1, by1, bx2, by2 = b.xyxy[0].tolist()

            # Global coordinate mapping
            gx1 = max(0.0, min(float(img_w), tx1 + bx1))
            gy1 = max(0.0, min(float(img_h), ty1 + by1))
            gx2 = max(0.0, min(float(img_w), tx1 + bx2))
            gy2 = max(0.0, min(float(img_h), ty1 + by2))

            # Edge artifact filter: Discard tiny edge fragments with conf < 0.40
            is_tile_edge = (bx1 <= 2 or by1 <= 2 or bx2 >= 638 or by2 >= 638)
            bw = gx2 - gx1
            bh = gy2 - gy1
            if is_tile_edge and conf < user_conf_thresh and (bw < 30 or bh < 30):
                continue

            if bw > 0 and bh > 0:
                all_raw.append({
                    "class": model.names.get(cls_id, "shipwreck"),
                    "conf": conf,
                    "bbox": [gx1, gy1, gx2, gy2],
                    "source": f"tile_{t_idx}"
                })

    num_raw = len(all_raw)

    # 2. CONFIDENCE FILTER (conf >= 0.40)
    after_conf = [d for d in all_raw if d["conf"] >= user_conf_thresh]

    # 3. MINIMUM SIZE FILTER (Reject width < 2% or height < 1.5% of image)
    min_w = 0.02 * img_w # 34.5 px
    min_h = 0.015 * img_h # 84.2 px
    after_size = []
    for d in after_conf:
        bw = d["bbox"][2] - d["bbox"][0]
        bh = d["bbox"][3] - d["bbox"][1]
        if bw >= min_w or bh >= min_h:
            after_size.append(d)

    # 4. NMS (IoU = 0.50)
    after_nms = []
    if after_size:
        boxes_np = np.array([d["bbox"] for d in after_size])
        scores_np = np.array([d["conf"] for d in after_size])
        keep_idxs = run_nms(boxes_np, scores_np, iou_threshold=0.50)
        after_nms = [after_size[k] for k in keep_idxs]

    # 5. LARGE WRECK MERGING
    final_merged = merge_large_wrecks(after_nms, img_w, img_h, iou_thresh=0.25, ios_thresh=0.45)
    # Sort descending by confidence and limit to 10
    final_detections = sorted(final_merged, key=lambda x: x["conf"], reverse=True)[:10]

    # 6. Save Clean Debug Image
    os.makedirs(os.path.dirname(OUTPUT_CLEAN_IMAGE), exist_ok=True)
    annotated = img.copy()

    for d in final_detections:
        x1, y1, x2, y2 = [int(v) for v in d["bbox"]]
        cv2.rectangle(annotated, (x1, y1), (x2, y2), (0, 0, 255), 4)
        label = f"SHIPWRECK {d['conf']*100:.0f}%"
        cv2.putText(annotated, label, (x1, max(45, y1 - 15)), cv2.FONT_HERSHEY_SIMPLEX, 1.2, (0, 0, 255), 3)

    cv2.imwrite(OUTPUT_CLEAN_IMAGE, annotated)

    # 7. Print Required Debug Output
    print("=" * 70)
    print("SEASENTINEL AI: FINAL DETECTION CLEANUP BENCHMARK")
    print("=" * 70)
    print(f"Raw predictions:               {num_raw}")
    print(f"After confidence filter:       {len(after_conf)} (conf >= {user_conf_thresh*100:.0f}%)")
    print(f"After size filter:             {len(after_size)}")
    print(f"After NMS:                     {len(after_nms)}")
    print(f"After large-object merge:      {len(final_merged)}")
    print(f"FINAL DETECTIONS:              {len(final_detections)}")
    print("\n--- FINAL DETECTIONS BREAKDOWN ---")
    for d in final_detections:
        x1, y1, x2, y2 = [round(v, 1) for v in d["bbox"]]
        print("SHIPWRECK")
        print(f"Confidence: {d['conf']*100:.1f}%")
        print(f"x1: {x1}")
        print(f"y1: {y1}")
        print(f"x2: {x2}")
        print(f"y2: {y2}\n")

    print(f"Saved clean debug image to: {OUTPUT_CLEAN_IMAGE}")

    return final_detections

if __name__ == "__main__":
    test_img = os.path.join(TEST_IMG_DIR, "DM_Wilson_03.png")
    process_sonar_image(test_img, user_conf_thresh=0.40)
