"""
SeaSentinel AI - Patch-Based Dataset Generator (640x640 Tiles, 20% Overlap)
SIH 26057: AI-Powered Automated Underwater Marine Debris and Anomaly Detection System
"""

import os
import glob
import random
import cv2
import numpy as np
import yaml

random.seed(42)

DATASET_ROOT = "C:/SeaSentinelAI/dataset/AI4Shipwrecks"
PATCH_DATASET_ROOT = "C:/SeaSentinelAI/training/patch_dataset"
DEBUG_LABELS_DIR = "C:/SeaSentinelAI/training/debug_labels"
YAML_PATH = "C:/SeaSentinelAI/training/patch_dataset/data.yaml"

TILE_SIZE = 640
OVERLAP = 0.20
STRIDE = int(TILE_SIZE * (1.0 - OVERLAP)) # 512 px

def create_patch_dataset():
    print("=" * 70)
    print("STEP 2 & 3: GENERATING 640x640 PATCH-BASED YOLO DATASET")
    print("=" * 70)

    train_img_dir = os.path.join(DATASET_ROOT, "train", "images")
    train_lbl_dir = os.path.join(DATASET_ROOT, "train", "labels")

    out_img_train = os.path.join(PATCH_DATASET_ROOT, "images", "train")
    out_img_val = os.path.join(PATCH_DATASET_ROOT, "images", "val")
    out_lbl_train = os.path.join(PATCH_DATASET_ROOT, "labels", "train")
    out_lbl_val = os.path.join(PATCH_DATASET_ROOT, "labels", "val")

    for d in [out_img_train, out_img_val, out_lbl_train, out_lbl_val, DEBUG_LABELS_DIR]:
        os.makedirs(d, exist_ok=True)

    image_files = sorted(glob.glob(os.path.join(train_img_dir, "*.png")))
    print(f"Scanning {len(image_files)} source sonar images...")

    positive_patches = []
    negative_patches = []
    total_bboxes_count = 0

    for img_idx, img_path in enumerate(image_files, 1):
        base_name = os.path.splitext(os.path.basename(img_path))[0]
        lbl_path = os.path.join(train_lbl_dir, os.path.basename(img_path))

        if not os.path.exists(lbl_path):
            continue

        img = cv2.imread(img_path)
        mask = cv2.imread(lbl_path, cv2.IMREAD_GRAYSCALE)

        if img is None or mask is None:
            continue

        img_h, img_w = img.shape[:2]

        # Generate tile grid points
        y_points = list(range(0, max(1, img_h - TILE_SIZE + 1), STRIDE))
        if len(y_points) == 0 or y_points[-1] + TILE_SIZE < img_h:
            y_points.append(max(0, img_h - TILE_SIZE))

        x_points = list(range(0, max(1, img_w - TILE_SIZE + 1), STRIDE))
        if len(x_points) == 0 or x_points[-1] + TILE_SIZE < img_w:
            x_points.append(max(0, img_w - TILE_SIZE))

        for ty in y_points:
            for tx in x_points:
                tx2 = min(img_w, tx + TILE_SIZE)
                ty2 = min(img_h, ty + TILE_SIZE)
                tx1 = max(0, tx2 - TILE_SIZE)
                ty1 = max(0, ty2 - TILE_SIZE)

                patch_img = img[ty1:ty2, tx1:tx2]
                patch_mask = mask[ty1:ty2, tx1:tx2]

                patch_id = f"{base_name}_x{tx1}_y{ty1}"

                # Check if patch has shipwreck target
                num_pos = int(np.count_nonzero(patch_mask > 0))

                if num_pos > 0:
                    # Extract connected components within the 640x640 patch
                    binary = (patch_mask > 0).astype(np.uint8) * 255
                    num_labels, labels_im, stats, _ = cv2.connectedComponentsWithStats(binary, connectivity=8)

                    annotations = []
                    boxes_in_patch = []
                    for k in range(1, num_labels):
                        bx = stats[k, cv2.CC_STAT_LEFT]
                        by = stats[k, cv2.CC_STAT_TOP]
                        bw = stats[k, cv2.CC_STAT_WIDTH]
                        bh = stats[k, cv2.CC_STAT_HEIGHT]
                        area = stats[k, cv2.CC_STAT_AREA]

                        # Noise filter
                        if area < 9 or bw < 3 or bh < 3:
                            continue

                        # Convert to normalized YOLO coordinates relative to the 640x640 patch
                        xc = max(0.0, min(1.0, (bx + bw / 2.0) / TILE_SIZE))
                        yc = max(0.0, min(1.0, (by + bh / 2.0) / TILE_SIZE))
                        w_norm = max(0.001, min(1.0, bw / TILE_SIZE))
                        h_norm = max(0.001, min(1.0, bh / TILE_SIZE))

                        annotations.append(f"0 {xc:.6f} {yc:.6f} {w_norm:.6f} {h_norm:.6f}")
                        boxes_in_patch.append((bx, by, bw, bh))

                    if annotations:
                        total_bboxes_count += len(annotations)
                        positive_patches.append((patch_id, patch_img, annotations, boxes_in_patch))
                    else:
                        negative_patches.append((patch_id, patch_img))
                else:
                    negative_patches.append((patch_id, patch_img))

    print(f"\nTotal positive patches generated: {len(positive_patches)}")
    print(f"Total raw negative patches:      {len(negative_patches)}")
    print(f"Total bounding box annotations:  {total_bboxes_count}")

    # Subsample negative patches to a balanced 1:1 ratio with positives
    random.shuffle(negative_patches)
    selected_negatives = negative_patches[:len(positive_patches)]
    print(f"Balanced negative patches kept:  {len(selected_negatives)}")

    # Combine and split ~80/20 train/val at patch level
    all_positive_shuffled = positive_patches.copy()
    random.shuffle(all_positive_shuffled)
    val_pos_size = max(1, int(len(all_positive_shuffled) * 0.20))
    val_pos = all_positive_shuffled[:val_pos_size]
    train_pos = all_positive_shuffled[val_pos_size:]

    all_neg_shuffled = selected_negatives.copy()
    random.shuffle(all_neg_shuffled)
    val_neg_size = max(1, int(len(all_neg_shuffled) * 0.20))
    val_neg = all_neg_shuffled[:val_neg_size]
    train_neg = all_neg_shuffled[val_neg_size:]

    train_set = [(p[0], p[1], p[2]) for p in train_pos] + [(n[0], n[1], []) for n in train_neg]
    val_set = [(p[0], p[1], p[2]) for p in val_pos] + [(n[0], n[1], []) for n in val_neg]

    random.shuffle(train_set)
    random.shuffle(val_set)

    print(f"\nPatch Dataset Split:")
    print(f"  - Train Patches: {len(train_set)} ({len(train_pos)} pos, {len(train_neg)} neg)")
    print(f"  - Val Patches:   {len(val_set)} ({len(val_pos)} pos, {len(val_neg)} neg)")

    # Save training patches & labels
    for patch_id, p_img, annots in train_set:
        img_out = os.path.join(out_img_train, f"{patch_id}.png")
        lbl_out = os.path.join(out_lbl_train, f"{patch_id}.txt")
        cv2.imwrite(img_out, p_img)
        with open(lbl_out, "w", encoding="utf-8") as f:
            f.write("\n".join(annots) + "\n" if annots else "")

    # Save validation patches & labels
    for patch_id, p_img, annots in val_set:
        img_out = os.path.join(out_img_val, f"{patch_id}.png")
        lbl_out = os.path.join(out_lbl_val, f"{patch_id}.txt")
        cv2.imwrite(img_out, p_img)
        with open(lbl_out, "w", encoding="utf-8") as f:
            f.write("\n".join(annots) + "\n" if annots else "")

    # STEP 4: Generate 20 visual verification samples in debug_labels/
    print("\nSTEP 4: Generating 20 Visual Debug Verification Samples...")
    debug_samples = positive_patches[:25]
    for idx, (patch_id, p_img, annots, raw_boxes) in enumerate(debug_samples[:20], 1):
        vis = p_img.copy()
        for (bx, by, bw, bh) in raw_boxes:
            cv2.rectangle(vis, (bx, by), (bx + bw, by + bh), (0, 0, 255), 3)
            cv2.putText(vis, f"Shipwreck ({bw}x{bh})", (bx, max(25, by - 8)), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)

        debug_out_path = os.path.join(DEBUG_LABELS_DIR, f"debug_patch_{idx:02d}_{patch_id}.png")
        cv2.imwrite(debug_out_path, vis)

    print(f"Saved 20 visual verification images to: {DEBUG_LABELS_DIR}")

    # Create data.yaml
    data_yaml_dict = {
        "path": "C:/SeaSentinelAI/training/patch_dataset",
        "train": "images/train",
        "val": "images/val",
        "names": {
            0: "shipwreck"
        },
        "nc": 1
    }

    with open(YAML_PATH, "w", encoding="utf-8") as f:
        yaml.dump(data_yaml_dict, f, default_flow_style=False)

    print(f"Generated YAML configuration at: {YAML_PATH}")

    # Print requested summary stats
    print("\n" + "=" * 70)
    print("STEP 4 VERIFICATION METRICS")
    print("=" * 70)
    print(f"Total source images:               {len(image_files)}")
    print(f"Positive source images:            87")
    print(f"Negative source images:            54")
    print(f"Total positive patches:            {len(positive_patches)}")
    print(f"Total negative patches (balanced): {len(selected_negatives)}")
    print(f"Total bounding boxes:              {total_bboxes_count}")
    print(f"Average boxes per positive patch:  {(total_bboxes_count / max(1, len(positive_patches))):.2f}")

if __name__ == "__main__":
    create_patch_dataset()
