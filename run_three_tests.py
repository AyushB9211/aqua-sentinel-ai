"""
SeaSentinel AI - 3-Stage Model Diagnostic Benchmark
TEST 1: Full-Image (imgsz=640, conf=0.05)
TEST 2: Higher Resolution (imgsz=1280, conf=0.05)
TEST 3: Patch/Tiled Inference (640x640, 20% overlap, conf=0.05 + NMS)
"""

import os
import glob
import cv2
import numpy as np
import torch
import torchvision.ops as ops
from ultralytics import YOLO

MODEL_PATH = "C:/SeaSentinelAI/model/seasentinel_shipwreck.pt"
OUTPUT_JPG = "C:/SeaSentinelAI/test/tiled_result.jpg"
TEST_IMG_DIR = "C:/SeaSentinelAI/dataset/AI4Shipwrecks/train/images"

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

def run_diagnostics():
    # Verify model
    if not os.path.exists(MODEL_PATH):
        print(f"Error: Model not found at {MODEL_PATH}")
        return

    model = YOLO(MODEL_PATH)

    # Select the test image
    test_img_path = os.path.join(TEST_IMG_DIR, "DM_Wilson_03.png")
    if not os.path.exists(test_img_path):
        candidates = sorted(glob.glob(f"{TEST_IMG_DIR}/*.png"))
        test_img_path = candidates[0]

    img = cv2.imread(test_img_path)
    img_h, img_w = img.shape[:2]

    print("=" * 70)
    print("SEASENTINEL AI: 3-STAGE INFERENCE BENCHMARK")
    print("=" * 70)
    print(f"MODEL PATH:      {MODEL_PATH}")
    print(f"MODEL CLASSES:   {model.names}")
    print(f"IMAGE FILE:      {os.path.basename(test_img_path)}")
    print(f"IMAGE SIZE:      {img_w}x{img_h}")
    print("-" * 70)

    # -------------------------------------------------------------
    # TEST 1: Full-Image Inference (imgsz=640, conf=0.05)
    # -------------------------------------------------------------
    print("\n--- TEST 1: Full Image Inference (imgsz=640, conf=0.05) ---")
    res1 = model.predict(source=test_img_path, imgsz=640, conf=0.05, device="cpu", verbose=False)
    boxes1 = res1[0].boxes
    test1_dets = []
    for b in boxes1:
        cls_id = int(b.cls[0])
        conf = float(b.conf[0])
        x1, y1, x2, y2 = [round(v, 2) for v in b.xyxy[0].tolist()]
        cls_name = model.names.get(cls_id, str(cls_id))
        test1_dets.append({"class": cls_name, "conf": conf, "bbox": (x1, y1, x2, y2)})
        print(f"[{cls_name}] confidence={conf*100:.1f}% | bbox=({x1}, {y1}, {x2}, {y2})")

    if not test1_dets:
        print("No detections found at conf=0.05.")

    # -------------------------------------------------------------
    # TEST 2: Higher Resolution Inference (imgsz=1280, conf=0.05)
    # -------------------------------------------------------------
    print("\n--- TEST 2: Higher Resolution Inference (imgsz=1280, conf=0.05) ---")
    res2 = model.predict(source=test_img_path, imgsz=1280, conf=0.05, device="cpu", verbose=False)
    boxes2 = res2[0].boxes
    test2_dets = []
    for b in boxes2:
        cls_id = int(b.cls[0])
        conf = float(b.conf[0])
        x1, y1, x2, y2 = [round(v, 2) for v in b.xyxy[0].tolist()]
        cls_name = model.names.get(cls_id, str(cls_id))
        test2_dets.append({"class": cls_name, "conf": conf, "bbox": (x1, y1, x2, y2)})
        print(f"[{cls_name}] confidence={conf*100:.1f}% | bbox=({x1}, {y1}, {x2}, {y2})")

    if not test2_dets:
        print("No detections found at conf=0.05.")

    # -------------------------------------------------------------
    # TEST 3: Patch/Tiled Inference (640x640, 20% overlap, conf=0.05 + NMS)
    # -------------------------------------------------------------
    print("\n--- TEST 3: Patch/Tiled Inference (640x640, 20% overlap, conf=0.05 + NMS) ---")
    tiles = generate_tiles(img_w, img_h, tile_size=640, overlap=0.20)
    print(f"Generated {len(tiles)} tiles across {img_w}x{img_h} image.")

    raw_tile_dets = []
    for t_idx, (tx1, ty1, tx2, ty2) in enumerate(tiles):
        tile_crop = img[ty1:ty2, tx1:tx2]
        res_tile = model.predict(source=tile_crop, imgsz=640, conf=0.05, device="cpu", verbose=False)
        for b in res_tile[0].boxes:
            cls_id = int(b.cls[0])
            conf = float(b.conf[0])
            bx1, by1, bx2, by2 = b.xyxy[0].tolist()
            # Map local tile coordinates back to original image
            gx1, gy1, gx2, gy2 = tx1 + bx1, ty1 + by1, tx1 + bx2, ty1 + by2
            cls_name = model.names.get(cls_id, str(cls_id))
            raw_tile_dets.append({
                "class": cls_name,
                "conf": conf,
                "bbox": [gx1, gy1, gx2, gy2],
                "tile_idx": t_idx
            })

    print(f"Total raw tile predictions before NMS: {len(raw_tile_dets)}")

    test3_final_dets = []
    if raw_tile_dets:
        boxes_np = np.array([d["bbox"] for d in raw_tile_dets])
        scores_np = np.array([d["conf"] for d in raw_tile_dets])
        keep_idxs = run_nms(boxes_np, scores_np, iou_threshold=0.45)
        for k in keep_idxs:
            d = raw_tile_dets[k]
            x1, y1, x2, y2 = [round(v, 2) for v in d["bbox"]]
            test3_final_dets.append({"class": d["class"], "conf": d["conf"], "bbox": (x1, y1, x2, y2)})
            print(f"[{d['class']}] confidence={d['conf']*100:.1f}% | bbox=({x1}, {y1}, {x2}, {y2})")

    if not test3_final_dets:
        print("No detections found across all tiles at conf=0.05.")

    # Save annotated test result image
    os.makedirs(os.path.dirname(OUTPUT_JPG), exist_ok=True)
    annotated_img = img.copy()
    
    # Draw any detections from Test 3 (or Test 1/2 if test 3 is empty)
    dets_to_draw = test3_final_dets if test3_final_dets else (test2_dets if test2_dets else test1_dets)
    for det in dets_to_draw:
        x1, y1, x2, y2 = [int(v) for v in det["bbox"]]
        cv2.rectangle(annotated_img, (x1, y1), (x2, y2), (0, 0, 255), 4)
        label = f"{det['class']} {det['conf']*100:.1f}%"
        cv2.putText(annotated_img, label, (x1, max(40, y1 - 15)), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (0, 0, 255), 2)

    # If 0 detections, write indicator text on the image
    if not dets_to_draw:
        cv2.putText(
            annotated_img,
            "SEASENTINEL AI: 0 DETECTIONS AT CONF=0.05 (TILED 640x640)",
            (50, 100),
            cv2.FONT_HERSHEY_SIMPLEX,
            1.2,
            (0, 165, 255),
            3
        )

    cv2.imwrite(OUTPUT_JPG, annotated_img)
    print(f"\nSaved tiled result image to: {OUTPUT_JPG}")

    # Summary Output
    print("\n" + "=" * 70)
    print("DIAGNOSTIC SUMMARY OUTPUT")
    print("=" * 70)
    print(f"MODEL PATH:            {MODEL_PATH}")
    print(f"MODEL CLASSES:         {model.names}")
    print(f"IMAGE SIZE:            {img_w}x{img_h}")
    print(f"FULL IMAGE DETECTIONS: {len(test1_dets)}")
    print(f"1280 DETECTIONS:       {len(test2_dets)}")
    print(f"TILED DETECTIONS:      {len(test3_final_dets)}")

if __name__ == "__main__":
    run_diagnostics()
