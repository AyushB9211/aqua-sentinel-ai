"""
SeaSentinel AI - Dataset Audit Tool
SIH 26057: AI-Powered Automated Underwater Marine Debris and Anomaly Detection System
"""

import os
import glob
import cv2
import numpy as np

DATASET_ROOT = "C:/SeaSentinelAI/dataset/AI4Shipwrecks"
AUDIT_OUT_DIR = "C:/SeaSentinelAI/training/audit_visuals"
os.makedirs(AUDIT_OUT_DIR, exist_ok=True)

def audit():
    print("=" * 70)
    print("STEP 1: AUDITING AI4SHIPWRECKS DATASET")
    print("=" * 70)

    train_img_dir = os.path.join(DATASET_ROOT, "train", "images")
    train_lbl_dir = os.path.join(DATASET_ROOT, "train", "labels")

    image_files = sorted(glob.glob(os.path.join(train_img_dir, "*.png")))
    print(f"Total train images found: {len(image_files)}")

    positive_images = 0
    empty_images = 0
    total_positive_pixels = 0
    all_box_widths = []
    all_box_heights = []
    all_box_areas = []
    samples_saved = 0

    for img_path in image_files:
        base_name = os.path.basename(img_path)
        lbl_path = os.path.join(train_lbl_dir, base_name)

        if not os.path.exists(lbl_path):
            print(f"Warning: Missing mask for {base_name}")
            continue

        mask = cv2.imread(lbl_path, cv2.IMREAD_GRAYSCALE)
        if mask is None:
            continue

        img_h, img_w = mask.shape[:2]
        num_pos_pixels = int(np.count_nonzero(mask > 0))

        if num_pos_pixels > 0:
            positive_images += 1
            total_positive_pixels += num_pos_pixels

            # Connected components / contours
            binary = (mask > 0).astype(np.uint8) * 255
            num_labels, labels_im, stats, centroids = cv2.connectedComponentsWithStats(binary, connectivity=8)

            boxes = []
            for i in range(1, num_labels):
                x = stats[i, cv2.CC_STAT_LEFT]
                y = stats[i, cv2.CC_STAT_TOP]
                w = stats[i, cv2.CC_STAT_WIDTH]
                h = stats[i, cv2.CC_STAT_HEIGHT]
                area = stats[i, cv2.CC_STAT_AREA]

                # Noise filter: ignore single isolated noise < 9 pixels
                if area < 9 or w < 3 or h < 3:
                    continue

                boxes.append((x, y, w, h, area))
                all_box_widths.append(w)
                all_box_heights.append(h)
                all_box_areas.append(area)

            # Save visual sample for the first 10 positive images
            if samples_saved < 10 and len(boxes) > 0:
                img = cv2.imread(img_path)
                vis_img = img.copy()

                # Highlight mask in green overlay
                mask_color = np.zeros_like(img)
                mask_color[mask > 0] = [0, 255, 0]
                vis_img = cv2.addWeighted(vis_img, 0.7, mask_color, 0.3, 0)

                # Draw bounding boxes in red
                for (bx, by, bw, bh, barea) in boxes:
                    cv2.rectangle(vis_img, (bx, by), (bx + bw, by + bh), (0, 0, 255), 4)
                    cv2.putText(
                        vis_img,
                        f"Shipwreck ({bw}x{bh})",
                        (bx, max(30, by - 10)),
                        cv2.FONT_HERSHEY_SIMPLEX,
                        0.8,
                        (0, 0, 255),
                        2
                    )

                # If image is very long, crop around the bounding box region for easy visual inspection
                min_y = max(0, min([b[1] for b in boxes]) - 200)
                max_y = min(img_h, max([b[1] + b[3] for b in boxes]) + 200)
                crop_sample = vis_img[min_y:max_y, :]

                out_sample_path = os.path.join(AUDIT_OUT_DIR, f"audit_sample_{samples_saved+1}_{base_name}")
                cv2.imwrite(out_sample_path, crop_sample)
                samples_saved += 1
        else:
            empty_images += 1

    print("\n--- AUDIT RESULTS ---")
    print(f"Total source images:        {len(image_files)}")
    print(f"Positive source images:     {positive_images}")
    print(f"Empty/negative images:      {empty_images}")
    print(f"Total positive pixels:      {total_positive_pixels:,}")
    print(f"Total connected targets:    {len(all_box_areas)}")
    if all_box_areas:
        print(f"Object Widths (pixels):     Min={min(all_box_widths)}, Max={max(all_box_widths)}, Mean={np.mean(all_box_widths):.1f}")
        print(f"Object Heights (pixels):    Min={min(all_box_heights)}, Max={max(all_box_heights)}, Mean={np.mean(all_box_heights):.1f}")
        print(f"Object Areas (pixels^2):    Min={min(all_box_areas)}, Max={max(all_box_areas)}, Mean={np.mean(all_box_areas):.1f}")
    print(f"Saved {samples_saved} visual audit samples to: {AUDIT_OUT_DIR}")

if __name__ == "__main__":
    audit()
