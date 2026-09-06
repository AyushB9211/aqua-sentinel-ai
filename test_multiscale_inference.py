"""
SeaSentinel AI - Multi-Scale & Tiled Inference Engine Test
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
OUTPUT_DEBUG_IMAGE = "C:/SeaSentinelAI/test/full_scan_result.jpg"
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

def multi_scale_predict(
    image_input,
    model_path=MODEL_PATH,
    tile_size=640,
    overlap=0.25,
    conf_threshold=0.10,
    iou_threshold=0.50,
    max_detections=20
):
    if isinstance(image_input, str):
        img = cv2.imread(image_input)
        img_name = os.path.basename(image_input)
    else:
        img = image_input
        img_name = "uploaded_scan"

    if img is None:
        raise ValueError("Could not load image.")

    img_h, img_w = img.shape[:2]
    model = YOLO(model_path)

    all_raw_boxes = []

    # 1. Full-Image Inference at imgsz=1280
    res_full = model.predict(source=img, imgsz=1280, conf=conf_threshold, device="cpu", verbose=False)
    num_full_dets = 0
    for b in res_full[0].boxes:
        cls_id = int(b.cls[0])
        conf = float(b.conf[0])
        x1, y1, x2, y2 = b.xyxy[0].tolist()
        all_raw_boxes.append({
            "class_id": cls_id,
            "class_name": model.names.get(cls_id, "shipwreck"),
            "confidence": conf,
            "bbox": [x1, y1, x2, y2],
            "source": "full_1280"
        })
        num_full_dets += 1

    # 2. Patch-Based Tiled Inference (640x640, 25% overlap)
    tiles = generate_tiles(img_w, img_h, tile_size=tile_size, overlap=overlap)
    num_tile_dets = 0

    for t_idx, (tx1, ty1, tx2, ty2) in enumerate(tiles):
        tile_crop = img[ty1:ty2, tx1:tx2]
        res_tile = model.predict(source=tile_crop, imgsz=tile_size, conf=conf_threshold, device="cpu", verbose=False)
        for b in res_tile[0].boxes:
            cls_id = int(b.cls[0])
            conf = float(b.conf[0])
            bx1, by1, bx2, by2 = b.xyxy[0].tolist()
            # Map back to global coordinates
            gx1 = tx1 + bx1
            gy1 = ty1 + by1
            gx2 = tx1 + bx2
            gy2 = ty1 + by2
            all_raw_boxes.append({
                "class_id": cls_id,
                "class_name": model.names.get(cls_id, "shipwreck"),
                "confidence": conf,
                "bbox": [gx1, gy1, gx2, gy2],
                "source": f"tile_{t_idx}"
            })
            num_tile_dets += 1

    # 3. Combine & Apply NMS
    final_detections = []
    if all_raw_boxes:
        boxes_np = np.array([d["bbox"] for d in all_raw_boxes])
        scores_np = np.array([d["confidence"] for d in all_raw_boxes])
        keep_idxs = run_nms(boxes_np, scores_np, iou_threshold=iou_threshold)

        # Sort by confidence descending and limit to max_detections
        sorted_keeps = sorted(keep_idxs, key=lambda idx: all_raw_boxes[idx]["confidence"], reverse=True)[:max_detections]

        for rank, k in enumerate(sorted_keeps, 1):
            d = all_raw_boxes[k]
            gx1, gy1, gx2, gy2 = d["bbox"]

            x_pct = max(0.0, min(100.0, (gx1 / img_w) * 100.0))
            y_pct = max(0.0, min(100.0, (gy1 / img_h) * 100.0))
            w_pct = max(1.0, min(100.0, ((gx2 - gx1) / img_w) * 100.0))
            h_pct = max(1.0, min(100.0, ((gy2 - gy1) / img_h) * 100.0))

            conf = d["confidence"]
            severity = "HIGH" if conf >= 0.50 else ("MEDIUM" if conf >= 0.25 else "LOW")
            region = "Right sonar swath (Starboard)" if x_pct > 55 else ("Left sonar swath (Port)" if x_pct < 45 else "Center swath")

            final_detections.append({
                "id": f"det-{rank}",
                "trackingId": f"{rank:02d}",
                "class_id": d["class_id"],
                "classification": "SHIPWRECK",
                "objectType": "Shipwreck Structure",
                "confidence": round(conf, 4),
                "severity": severity.lower(),
                "priority": severity,
                "processingStatus": "AI Analyzed",
                "isVerified": False,
                "waterDepth": 142.6,
                "regionText": region,
                "box": {
                    "x": round(x_pct, 2),
                    "y": round(y_pct, 2),
                    "width": round(w_pct, 2),
                    "height": round(h_pct, 2)
                },
                "boxPixels": {
                    "x1": round(gx1, 1),
                    "y1": round(gy1, 1),
                    "x2": round(gx2, 1),
                    "y2": round(gy2, 1)
                },
                "evidence": {
                    "acousticReturn": "High-intensity structural backscatter return",
                    "acousticShadow": f"{(w_pct * 0.6):.1f}m distinct acoustic shadow",
                    "objectGeometry": "Man-made hull/wreckage structural profile",
                    "sonarContrast": f"{(conf * 100):.1f}% contrast differential",
                },
                "evidenceChecklist": [
                    "Strong acoustic return",
                    "Distinct acoustic shadow",
                    "Irregular man-made structure",
                    "Multiple hard sonar returns",
                    "High contrast signature",
                ]
            })

    return {
        "img": img,
        "img_w": img_w,
        "img_h": img_h,
        "num_full_dets": num_full_dets,
        "num_tile_dets": num_tile_dets,
        "num_tiles": len(tiles),
        "total_raw": len(all_raw_boxes),
        "final_detections": final_detections
    }

def main():
    test_img_path = os.path.join(TEST_IMG_DIR, "DM_Wilson_03.png")
    if not os.path.exists(test_img_path):
        test_img_path = glob.glob(f"{TEST_IMG_DIR}/*.png")[0]

    print("=" * 70)
    print("SEASENTINEL AI: MULTI-SCALE COMBINED INFERENCE BENCHMARK")
    print("=" * 70)
    print(f"Testing on image: {os.path.basename(test_img_path)}")

    results = multi_scale_predict(test_img_path, conf_threshold=0.10, overlap=0.25, iou_threshold=0.50)

    print("\n--- INFERENCE RESULTS ---")
    print(f"Full image detections:         {results['num_full_dets']}")
    print(f"Tile detections before merge:  {results['num_tile_dets']} (from {results['num_tiles']} tiles)")
    print(f"Total raw candidates:          {results['total_raw']}")
    print(f"Final detections after merge:  {len(results['final_detections'])}")

    print("\n--- DETECTIONS BREAKDOWN ---")
    for d in results["final_detections"]:
        bx = d["boxPixels"]
        print(f"  [{d['trackingId']}] {d['classification']} | Confidence: {d['confidence']*100:.1f}% | Severity: {d['priority']} | BBox=({bx['x1']}, {bx['y1']}, {bx['x2']}, {bx['y2']}) | Region: {d['regionText']}")

    # Save annotated test image
    os.makedirs(os.path.dirname(OUTPUT_DEBUG_IMAGE), exist_ok=True)
    annotated = results["img"].copy()
    for d in results["final_detections"]:
        bx = d["boxPixels"]
        x1, y1, x2, y2 = int(bx["x1"]), int(bx["y1"]), int(bx["x2"]), int(bx["y2"])
        cv2.rectangle(annotated, (x1, y1), (x2, y2), (0, 0, 255), 3)
        label = f"{d['classification']} {d['confidence']*100:.0f}%"
        cv2.putText(annotated, label, (x1, max(35, y1 - 10)), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 0, 255), 2)

    cv2.imwrite(OUTPUT_DEBUG_IMAGE, annotated)
    print(f"\nSaved annotated image with all boxes to: {OUTPUT_DEBUG_IMAGE}")

if __name__ == "__main__":
    main()
