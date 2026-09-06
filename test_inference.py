import os
import glob
from ultralytics import YOLO
import cv2

MODEL_PATH = "C:/SeaSentinelAI/model/seasentinel_shipwreck.pt"
TEST_IMG_DIR = "C:/SeaSentinelAI/dataset/AI4Shipwrecks/test/images"

def test_inference():
    print("=" * 60)
    print("SeaSentinel AI: Testing Inference on Unseen Test Dataset")
    print("=" * 60)

    test_imgs = sorted(glob.glob(os.path.join(TEST_IMG_DIR, "*.png")))
    print(f"Total unseen test images available: {len(test_imgs)}")

    model = YOLO(MODEL_PATH)

    for i, img_path in enumerate(test_imgs[:4], 1):
        filename = os.path.basename(img_path)
        img = cv2.imread(img_path)
        img_h, img_w = img.shape[:2]

        # Predict with threshold 0.15 - 0.25
        results = model.predict(source=img, conf=0.15, imgsz=640, device="cpu", verbose=False)

        boxes = results[0].boxes
        print(f"\n[Test Image {i}] {filename} ({img_w}x{img_h}) -> Detections: {len(boxes)}")
        for j, box in enumerate(boxes, 1):
            conf = float(box.conf[0])
            cls_id = int(box.cls[0])
            x1, y1, x2, y2 = box.xyxy[0].tolist()
            x_pct = (x1 / img_w) * 100.0
            y_pct = (y1 / img_h) * 100.0
            print(f"   Target #{j}: Class=SHIPWRECK | Conf={conf*100:.1f}% | "
                  f"Pos=(x={x_pct:.1f}%, y={y_pct:.1f}%) | "
                  f"Pixels=({int(x1)}, {int(y1)}, {int(x2)}, {int(y2)})")

if __name__ == "__main__":
    test_inference()
