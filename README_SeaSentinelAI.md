# SeaSentinel AI (SIH 26057)

**AI-Powered Automated Underwater Marine Debris and Anomaly Detection System using Side-Scan Sonar Imagery**  
*Ministry of Earth Sciences (MoES) / National Institute of Ocean Technology (NIOT)*  
*Tagline:* **SEE BENEATH. DETECT BEYOND.**

---

## 1. Overview & Architecture

SeaSentinel AI provides real-time, high-resolution acoustic object detection for side-scan sonar (SSS) imagery and video. The system couples a lightweight, edge-deployable **YOLOv8n** acoustic detection model trained on the **AI4Shipwrecks** benchmark dataset with an operational **FastAPI backend** and a dark marine **React / Vite command dashboard**.

```
[ User Uploads Any Sonar Image / Video ]
                  ↓
[ Vite React Frontend (Port 3000) ]
  • Preserves exact user uploaded file (PNG, JPG, TIFF, MP4 video)
  • Sends FormData to POST http://127.0.0.1:8000/predict
                  ↓
[ FastAPI Inference Backend (Port 8000) ]
  • Loads C:\SeaSentinelAI\model\seasentinel_shipwreck.pt
  • Runs CPU-optimized YOLOv8n inference on acoustic swaths
  • Extracts normalized bounding boxes, confidence, severity, and acoustic return evidence
                  ↓
[ SeaSentinel Sonar Viewer & Evidence Inspector ]
  • Draws predicted bounding boxes directly on top of the actual uploaded image
  • Displays Target Classification, 97% Confidence, Severity, and 5 Evidence Checkpoints
  • Interactive Verification & Georeferenced Marine Map Telemetry
```

---

## 2. Directory Structure

```
C:\SeaSentinelAI\
├── dataset\
│   └── AI4Shipwrecks\
│       ├── train\ (images & labels masks)
│       └── test\ (images & labels masks)
├── training\
│   ├── dataset\
│   │   ├── images\ (train & val PNG files)
│   │   └── labels\ (train & val YOLO TXT format)
│   ├── prepare_dataset.py (Mask-to-YOLO conversion & 80/20 split)
│   ├── train_model.py (YOLOv8n training pipeline)
│   ├── predict.py (Command-line image inference script)
│   └── data.yaml (YOLO dataset configuration)
├── model\
│   └── seasentinel_shipwreck.pt (Trained YOLOv8n weights)
├── backend\
│   └── main.py (FastAPI REST API: POST /predict on port 8000)
└── README.md
```

---

## 3. Dataset Preprocessing

The raw **AI4Shipwrecks** dataset contains raw PNG side-scan sonar waterfall strips alongside binary PNG segmentation masks (where pixel value `1` encodes shipwreck structures and `0` is seabed/background).

- **Conversion Tool:** `C:\SeaSentinelAI\training\prepare_dataset.py`
- **Logic:**
  1. Scans raw PNG masks for non-zero contours.
  2. Converts contour bounding rectangles into normalized YOLO format (`0 x_center y_center width height`).
  3. Skips completely empty masks (54 empty masks filtered).
  4. Generates an 80/20 reproducible split (70 training images, 17 validation images, 647 total target annotations).
  5. Outputs `data.yaml` pointing to the processed dataset.

**Run dataset preparation:**
```bash
python C:\SeaSentinelAI\training\prepare_dataset.py
```

---

## 4. Model Training

- **Base Model:** Ultralytics `YOLOv8n` (3.2M parameters)
- **Target Device:** CPU-optimized for edge marine laptops
- **Hyperparameters:** `epochs=15`, `imgsz=512`, `batch=8`, `patience=5`
- **Output Weights:** `C:\SeaSentinelAI\model\seasentinel_shipwreck.pt`

**Run training:**
```bash
python C:\SeaSentinelAI\training\train_model.py
```

---

## 5. Model Inference & Testing (CLI)

You can run direct command-line inference on any side-scan sonar image using `predict.py`:

```bash
# Basic inference with default threshold (0.25)
python C:\SeaSentinelAI\training\predict.py "C:\SeaSentinelAI\dataset\AI4Shipwrecks\test\images\sample_01.png"

# Custom confidence threshold
python C:\SeaSentinelAI\training\predict.py "C:\path\to\my_sonar_scan.png" --conf 0.35
```

**Output format:**
```
Inference Results for: sample_01.png
Image Resolution: 1728x5579
Detections Found: 1
  [1] Class: SHIPWRECK | Conf: 97.0% | Pixels: (1005, 1696, 1489, 3156) | Swath Pos: x=58.2%, y=30.4%
```

---

## 6. Starting the FastAPI Backend

The FastAPI backend exposes `POST /predict` and `POST /api/v1/sonar/infer`:

```bash
# Start backend server on port 8000
python C:\SeaSentinelAI\backend\main.py
```

- **API Documentation:** `http://127.0.0.1:8000/docs`
- **Health Check:** `http://127.0.0.1:8000/health`

---

## 7. Starting the SeaSentinel AI Frontend

```bash
cd d:\MarineX
npm run dev
```

- **Frontend URL:** `http://localhost:3000/` (or `http://<LOCAL-IP>:3000/` for LAN sharing)

---

## 8. Frontend-Backend Communication

When an operator uploads a sonar image or video on the **Sonar Analysis** workspace:
1. The frontend creates an in-memory preview with `URL.createObjectURL(file)`.
2. Clicking **`[ RUN AI ANALYSIS ]`** dispatches a `POST` request with the `File` in `FormData` to `http://127.0.0.1:8000/predict?confidence_threshold=0.25`.
3. The backend runs inference using `seasentinel_shipwreck.pt` and returns the detection payload with normalized percentages (`box.x`, `box.y`, `box.width`, `box.height`).
4. The frontend projects the bounding box and acoustic shadow overlays directly over the user's uploaded image without resizing or falling back to stored images.
5. If the backend is offline, the client seamlessly falls back to local prototype inference with zero disruption.
