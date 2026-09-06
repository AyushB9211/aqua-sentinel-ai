import os
import cv2
import numpy as np
import torch
from ultralytics import YOLO
from backend_main import generate_tiles, compute_overlap, deduplicate_detections

model_path = 'C:/SeaSentinelAI/model/seasentinel_shipwreck.pt'
model = YOLO(model_path)

os.makedirs('C:/SeaSentinelAI/test', exist_ok=True)

for img_name in ['DM_Wilson_02.png', 'DM_Wilson_03.png']:
    img_path = 'C:/SeaSentinelAI/dataset/AI4Shipwrecks/train/images/' + img_name
    if not os.path.exists(img_path):
        continue

    img = cv2.imread(img_path)
    h, w = img.shape[:2]
    print('==================================================')
    print('EVALUATING IMAGE: ' + img_name + ' (' + str(w) + 'x' + str(h) + ')')
    print('==================================================')

    # STEP 1 — Baseline Current Pipeline
    current_preds = []
    r_full = model.predict(source=img, conf=0.10, imgsz=1280, device='cpu', verbose=False)
    for b in r_full[0].boxes:
        conf = float(b.conf[0])
        x1, y1, x2, y2 = b.xyxy[0].tolist()
        current_preds.append({'class_id': 0, 'class': 'shipwreck', 'confidence': conf, 'bbox': [x1, y1, x2, y2], 'source': 'current_full1280'})

    tiles = generate_tiles(w, h, tile_size=640, overlap=0.25)
    for t_idx, (tx1, ty1, tx2, ty2) in enumerate(tiles):
        tile_crop = img[ty1:ty2, tx1:tx2]
        r_tile = model.predict(source=tile_crop, imgsz=640, conf=0.10, device='cpu', verbose=False)
        for b in r_tile[0].boxes:
            conf = float(b.conf[0])
            bx1, by1, bx2, by2 = b.xyxy[0].tolist()
            current_preds.append({'class_id': 0, 'class': 'shipwreck', 'confidence': conf, 'bbox': [tx1+bx1, ty1+by1, tx1+bx2, ty1+by2], 'source': 'current_tile_' + str(t_idx)})

    # Save baseline image
    baseline_img = img.copy()
    baseline_dedup = deduplicate_detections(current_preds, iou_threshold=0.50, ios_threshold=0.50)[:5]
    for d in baseline_dedup:
        bx = [int(v) for v in d['bbox']]
        cv2.rectangle(baseline_img, (bx[0], bx[1]), (bx[2], bx[3]), (0, 255, 255), 3)
        cv2.putText(baseline_img, d['class'] + ' ' + str(round(d['confidence']*100, 1)) + '%', (bx[0], max(30, bx[1]-10)), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 255), 2)
    cv2.imwrite('C:/SeaSentinelAI/test/baseline_large_target.jpg', baseline_img)

    # STEP 2 — High-Res Full Image (1536px, augment=True, conf=0.05)
    highres_preds = []
    r_highres = model.predict(source=img, conf=0.05, imgsz=1536, device='cpu', max_det=20, augment=True, verbose=False)
    for b in r_highres[0].boxes:
        conf = float(b.conf[0])
        x1, y1, x2, y2 = b.xyxy[0].tolist()
        highres_preds.append({'class_id': 0, 'class': 'shipwreck', 'confidence': conf, 'bbox': [x1, y1, x2, y2], 'source': 'highres_1536_aug'})

    # STEP 3 — Tiled pass with conf=0.05
    tiled_preds = []
    for t_idx, (tx1, ty1, tx2, ty2) in enumerate(tiles):
        tile_crop = img[ty1:ty2, tx1:tx2]
        r_tile = model.predict(source=tile_crop, imgsz=640, conf=0.05, device='cpu', verbose=False)
        for b in r_tile[0].boxes:
            conf = float(b.conf[0])
            bx1, by1, bx2, by2 = b.xyxy[0].tolist()
            tiled_preds.append({'class_id': 0, 'class': 'shipwreck', 'confidence': conf, 'bbox': [tx1+bx1, ty1+by1, tx1+bx2, ty1+by2], 'source': 'tile_conf0.05_' + str(t_idx)})

    # STEP 4 — Combine and Print
    print('CURRENT DETECTIONS: ' + str(len(current_preds)))
    print('HIGH-RES DETECTIONS: ' + str(len(highres_preds)))
    print('TILED DETECTIONS: ' + str(len(tiled_preds)))

    all_raw = current_preds + highres_preds + tiled_preds
    all_raw.sort(key=lambda x: x['confidence'], reverse=True)

    print('\nTop Predictions from all passes:')
    for idx, p in enumerate(all_raw[:15]):
        bx = [round(v, 1) for v in p['bbox']]
        pct_x = round((p['bbox'][0]/w)*100, 1)
        pct_y = round((p['bbox'][1]/h)*100, 1)
        print('  #' + str(idx+1) + ': ' + p['class'] + ' conf=' + str(round(p['confidence']*100, 2)) + '% | bbox=' + str(bx) + ' (x=' + str(pct_x) + '%, y=' + str(pct_y) + '%) | source=' + p['source'])

    # STEP 5 — Diagnostic Image
    diag_img = img.copy()
    for p in all_raw:
        bx = [int(v) for v in p['bbox']]
        color = (255, 255, 0) if 'current' in p['source'] else ((255, 0, 255) if 'highres' in p['source'] else (0, 255, 0))
        cv2.rectangle(diag_img, (bx[0], bx[1]), (bx[2], bx[3]), color, 2)
        cv2.putText(diag_img, str(round(p['confidence']*100, 1)) + '% (' + p['source'][:7] + ')', (bx[0], max(20, bx[1]-5)), cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)
    cv2.imwrite('C:/SeaSentinelAI/test/large_target_diagnostic.jpg', diag_img)

    # STEP 6 — Check if any prediction overlaps the lower-left / center area
    lower_left_preds = [p for p in all_raw if (p['bbox'][0]/w <= 0.50) and (p['bbox'][1]/h >= 0.40)]
    print('\nPredictions in Lower-Left/Center region: ' + str(len(lower_left_preds)))
    if lower_left_preds:
        top_ll = max(lower_left_preds, key=lambda x: x['confidence'])
        pct_x = round((top_ll['bbox'][0]/w)*100, 1)
        pct_y = round((top_ll['bbox'][1]/h)*100, 1)
        print('LARGE_TARGET_FOUND = YES')
        print('  Confidence: ' + str(round(top_ll['confidence']*100, 2)) + '%')
        print('  Source:     ' + top_ll['source'])
        print('  BBox:       ' + str([round(v, 1) for v in top_ll['bbox']]) + ' (x=' + str(pct_x) + '%, y=' + str(pct_y) + '%)')
    else:
        print('LARGE_TARGET_FOUND = NO')
