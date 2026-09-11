import os
import glob
import shutil
import random
import cv2
import numpy as np
import yaml

random.seed(42)

DATASET_ROOT = "C:/SeaSentinelAI/dataset/AI4Shipwrecks"
OUTPUT_ROOT = "C:/SeaSentinelAI/training/dataset"
YAML_PATH = "C:/SeaSentinelAI/training/data.yaml"
TARGET_SCRIPT = "C:/SeaSentinelAI/training/prepare_dataset.py"

def prepare_dataset():
    print("=" * 60)
    print("SeaSentinel AI: Preparing YOLO Dataset from AI4Shipwrecks")
    print("=" * 60)

    train_images_dir = os.path.join(DATASET_ROOT, "train", "images")
    train_labels_dir = os.path.join(DATASET_ROOT, "train", "labels")

    out_img_train = os.path.join(OUTPUT_ROOT, "images", "train")
    out_img_val = os.path.join(OUTPUT_ROOT, "images", "val")
    out_lbl_train = os.path.join(OUTPUT_ROOT, "labels", "train")
    out_lbl_val = os.path.join(OUTPUT_ROOT, "labels", "val")

    for d in [out_img_train, out_img_val, out_lbl_train, out_lbl_val]:
        os.makedirs(d, exist_ok=True)

    image_files = sorted(glob.glob(os.path.join(train_images_dir, "*.png")))
    print(f"Total raw training images scanned: {len(image_files)}")

    processed_samples = []
    empty_masks_count = 0
    total_bboxes_count = 0

    for img_path in image_files:
        base_name = os.path.basename(img_path)
        lbl_path = os.path.join(train_labels_dir, base_name)

        if not os.path.exists(lbl_path):
            continue

        mask = cv2.imread(lbl_path, cv2.IMREAD_GRAYSCALE)
        if mask is None:
            continue

        img_h, img_w = mask.shape[:2]

        if np.count_nonzero(mask) == 0:
            empty_masks_count += 1
            continue

        binary = (mask > 0).astype(np.uint8) * 255
        contours, _ = cv2.findContours(binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        yolo_annotations = []
        for c in contours:
            x, y, w, h = cv2.boundingRect(c)
            if w < 3 or h < 3:
                continue

            x_center = (x + w / 2.0) / img_w
            y_center = (y + h / 2.0) / img_h
            norm_w = w / img_w
            norm_h = h / img_h

            x_center = max(0.0, min(1.0, x_center))
            y_center = max(0.0, min(1.0, y_center))
            norm_w = max(0.0, min(1.0, norm_w))
            norm_h = max(0.0, min(1.0, norm_h))

            yolo_annotations.append(f"0 {x_center:.6f} {y_center:.6f} {norm_w:.6f} {norm_h:.6f}")

        if len(yolo_annotations) == 0:
            empty_masks_count += 1
            continue

        total_bboxes_count += len(yolo_annotations)
        processed_samples.append((img_path, base_name, yolo_annotations))

    print(f"Usable images with shipwreck targets: {len(processed_samples)}")
    print(f"Empty/zero-target masks skipped: {empty_masks_count}")
    print(f"Total shipwreck bounding boxes extracted: {total_bboxes_count}")

    random.shuffle(processed_samples)
    val_size = max(1, int(len(processed_samples) * 0.20))
    val_samples = processed_samples[:val_size]
    train_samples = processed_samples[val_size:]

    print(f"\nSplit Distribution:")
    print(f"  - Train Set: {len(train_samples)} images")
    print(f"  - Val Set:   {len(val_samples)} images")

    for samples, img_dest_dir, lbl_dest_dir in [
        (train_samples, out_img_train, out_lbl_train),
        (val_samples, out_img_val, out_lbl_val),
    ]:
        for img_src, filename, annotations in samples:
            dest_img_path = os.path.join(img_dest_dir, filename)
            shutil.copy2(img_src, dest_img_path)

            txt_filename = os.path.splitext(filename)[0] + ".txt"
            dest_lbl_path = os.path.join(lbl_dest_dir, txt_filename)
            with open(dest_lbl_path, "w", encoding="utf-8") as f:
                f.write("\n".join(annotations) + "\n")

    data_yaml_dict = {
        "path": "C:/SeaSentinelAI/training/dataset",
        "train": "images/train",
        "val": "images/val",
        "names": {
            0: "shipwreck"
        },
        "nc": 1
    }

    with open(YAML_PATH, "w", encoding="utf-8") as f:
        yaml.dump(data_yaml_dict, f, default_flow_style=False)

    print(f"\nGenerated YOLO data config at: {YAML_PATH}")
    
    # Also save a copy of this script to C:\SeaSentinelAI\training\prepare_dataset.py
    shutil.copy2(__file__, TARGET_SCRIPT)
    print(f"Saved script copy to: {TARGET_SCRIPT}")
    print("Dataset preparation complete!")

if __name__ == "__main__":
    prepare_dataset()
