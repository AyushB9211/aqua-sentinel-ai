---
title: SeaSentinel AI Multi-Scale Sonar Intelligence
emoji: 🚢
colorFrom: blue
colorTo: cyan
sdk: docker
app_port: 7860
pinned: false
license: mit
---

# Aqua Sentinel AI

> **AI-Powered Automated Underwater Marine Debris and Anomaly Detection System using Side-Scan Sonar Imagery**

---

## 1. Project Overview

**Aqua Sentinel AI** is an intelligent maritime inspection platform designed to assist hydrographers, marine researchers, defense personnel, and coastal authorities in detecting underwater structures, marine debris, shipwrecks, seabed anomalies, and navigation hazards from high-resolution Side-Scan Sonar (SSS) imagery.

Traditional side-scan sonar interpretation is labor-intensive, subject to operator fatigue, and slow over large hydrographic surveys. Aqua Sentinel AI accelerates acoustic data analysis with an automated AI detection pipeline, responsive visualization, interactive bounding-box overlays, and dynamic report export capabilities.

---

## 2. Smart India Hackathon (SIH) Problem Statement

- **Problem Statement ID:** `SIH26057`
- **Category:** Software / Maritime AI / Hydrography & Ocean Technology
- **Domain:** Underwater Marine Debris, Hazard Detection, and Hydrographic Survey Automation

---

## 3. Key Features

- 🛰️ **Multi-Scale Sonar Inference:** Combines full-image analysis (1280px) with overlapping patch-based tiling (640x640 with 25% overlap) to capture both macro-structures and localized anomalies.
- 🎯 **SVG Detection Overlay:** Native resolution-preserving SVG overlays that follow image aspect ratio without coordinate distortion or label truncation.
- ⚡ **Real-Time Acoustic Telemetry:** Displays signal-to-noise ratio (SNR), ping frequencies, acoustic gain, depth profiling, and confidence metrics.
- 📊 **Dynamic Multi-Format Reporting:** Instant export of survey detections into **JSON** and **CSV** formats conforming to standardized 10-column schema.
- 🌐 **Cross-Platform Responsive Interface:** Accessible across desktop workstations (Windows/Linux/macOS) and mobile devices (iOS/Android) with standalone cloud fallback.
- 🛡️ **Edge & Cloud Resilient:** Gracefully falls back to browser-side acoustic simulation if disconnected from local inference edge servers.

---

## 4. Technology Stack

### Frontend & Visualization
- **React 18** with **TypeScript**
- **Vite** (Next-generation frontend tooling)
- **Tailwind CSS** (Mission-grade maritime dark interface)
- **Lucide Icons**
- **Canvas / SVG Vector Rendering**

### Backend & AI Inference
- **Python 3.10+**
- **FastAPI** (High-performance asynchronous API framework)
- **Uvicorn** (ASGI server)
- **PyTorch** & **Torchvision** (Deep learning inference & Non-Maximum Suppression)
- **Ultralytics YOLO** (Object detection architecture)
- **OpenCV (cv2)** & **NumPy** (Acoustic image preprocessing & multi-scale slicing)

### Deployment & Hosting
- **Frontend / Cloud Client:** Vercel
- **Inference Server:** Local Edge FastAPI Server (127.0.0.1:8000)

---

## 5. Project Structure

```
MarineX/
├── backend_main.py              # FastAPI backend with multi-scale YOLO inference & NMS
├── requirements.txt             # Python backend dependencies
├── package.json                 # Frontend dependencies and scripts
├── vite.config.ts               # Vite bundler configuration
├── tsconfig.json                # TypeScript compiler configuration
├── vercel.json                  # Vercel SPA routing & rewrite rules
├── model/
│   └── seasentinel_shipwreck.pt # YOLO acoustic detection model weights
├── public/                      # Static assets & branding icons
├── src/
│   ├── assets/                  # Brand assets & emblems
│   ├── components/              # UI components (UploadZone, AnalysisResultBar, etc.)
│   ├── pages/                   # App pages (SonarAnalysisPage, ReportsPage, etc.)
│   ├── services/                # API and detection services (sonarDetectorService.ts)
│   ├── utils/                   # Report generators & export utilities (exportUtils.ts)
│   ├── types/                   # TypeScript interfaces and data models
│   ├── App.tsx                  # Main application component
│   └── main.tsx                 # Application entry point
├── runs/                        # Model validation curves & performance metrics
└── README.md                    # Project documentation
```

---

## 6. How to Install & Configure for Teammates

### Prerequisites
- **Node.js** (v18.0 or higher) & **npm**
- **Python** (v3.10 or higher) with `pip`
- **Git**
- *(Optional)* **PostgreSQL** with PostGIS for telemetry persistence

### Step 1: Clone the Repository
```bash
git clone https://github.com/AyushB9211/aqua-sentinel-ai.git
cd aqua-sentinel-ai
```

### Step 2: Install Frontend Dependencies
```bash
npm install
```

### Step 3: Install Backend Dependencies
```bash
pip install -r requirements.txt
```

### Step 4: Environment Variables Setup
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Key configurable environment variables (values are documented in `.env.example`):
- `VITE_PORT`: Frontend port (defaults to `3000`).
- `VITE_HOST`: Host interface (`0.0.0.0` or `127.0.0.1`).
- `VITE_API_URL`: Backend endpoint URL (defaults to `http://localhost:8000/predict`).
- `VITE_DB_URL`: PostgreSQL connection string (defaults to `postgresql://niot:oceanpass@localhost:5432/marinex_db`).
- `SEASENTINEL_MODEL_PATH`: Absolute or relative path to your trained YOLOv8 weights (e.g. `weights/best.pt`).

### Step 5: Model Weights Setup
Trained model weights are kept out of ordinary Git commits to preserve repository speed.
1. Place the trained `best.pt` model file into the `weights/` folder:
   ```bash
   mkdir -p weights
   # Copy best.pt into weights/best.pt
   ```
2. The backend automatically searches in this order:
   - `SEASENTINEL_MODEL_PATH` environment variable
   - `./weights/best.pt`
   - `./model/seasentinel_shipwreck.pt`
   - `./model/best.pt`
   - Base `yolov8n.pt`

### Step 6: (Optional) PostgreSQL Database Setup
If using persistent telemetry logs:
```bash
# In PostgreSQL terminal:
CREATE USER niot WITH PASSWORD 'oceanpass';
CREATE DATABASE marinex_db OWNER niot;
```

---

## 7. How to Run the Application

### Option A: Running Both Concurrently
Start the backend first, then the frontend:

**Terminal 1 (FastAPI Backend):**
```bash
python backend_main.py
# or:
uvicorn backend_main:app --host 127.0.0.1 --port 8000 --reload
```
Interactive Swagger docs: `http://127.0.0.1:8000/docs`

**Terminal 2 (React / Vite Frontend):**
```bash
npm run dev
```
The website will open at `http://localhost:3000`.

---

## 8. Five-Class Marine Hazard Support

SeaSentinel AI supports automated detection and morphological verification of 5 distinct underwater hazard classes:
- **`0: CRAB_POT`** (`#f97316`, Orange) — Benthic rectilinear cage traps.
- **`1: SUBMARINE_PIPELINE`** (`#06b6d4`, Cyan) — Continuous linear conduit infrastructure with flange joints.
- **`2: SHIPWRECK`** (`#ef4444`, Red) — Large sunken vessel hulls and structural debris.
- **`3: GHOST_NET`** (`#10b981`, Emerald) — Tangled abandoned/lost derelict fishing gear (ALDFG).
- **`4: MINE_CYLINDER`** (`#d946ef`, Fuchsia) — Compact cylindrical ordnance and casing anomalies.

---

## 9. How to Use Sonar Image Upload

1. Navigate to the **Sonar Analysis** workspace on the sidebar.
2. Drag and drop any Side-Scan Sonar image (`.png`, `.jpg`, `.jpeg`, `.tiff`) into the central sonar stage or click **Browse Files**.
3. Adjust the confidence threshold or tile sensitivity sliders if needed.
4. Click **Run Sonar Analysis** to trigger the AI inference pipeline.
5. Inspect the highlighted detection boxes, confidence score, bounding-box coordinates, and object telemetry.

---

## 10. AI Detection Workflow

```
[Uploaded Sonar Image]
          │
          ├──► (1) Full Image Resized (1280px) ──► YOLO Inference ──┐
          │                                                          ├─► [Coordinate Remapping]
          └──► (2) 640x640 Patch Slicing (25% Overlap) ──► YOLO ────┘              │
                                                                                   ▼
                                                                        [Torchvision NMS Merge]
                                                                        (IoU Threshold: 0.50)
                                                                                   │
                                                                                   ▼
                                                                        [Refined Detections]
                                                                        (Shipwreck, Debris,
                                                                         Seabed Hazard)
                                                                                   │
                                                                                   ▼
                                                                        [Frontend SVG Overlay]
```

1. **Input Normalization:** Sonar imagery is converted to standard RGB acoustic channels.
2. **Dual-Scale Inference:** The image is processed at full context (1280px) to detect large vessel structures, and in 640x640 overlapping tiles for smaller debris.
3. **Bounding-Box Fusion:** Patch coordinates are mapped back to global image coordinates.
4. **NMS Filtering:** Overlapping redundant detections are merged using PyTorch Non-Maximum Suppression (NMS).
5. **Visual Feedback:** Coordinates and telemetry are rendered onto the UI stage with responsive SVG vectors.

---

## 11. JSON and CSV Report Export

Aqua Sentinel AI includes dynamic export capabilities for mission logs and hydrographic survey archives:

### CSV Report Format
Strictly conforms to the 10-column RFC 4180 format:
```csv
Detection ID,Timestamp,Class,Confidence,Severity,Object Type,X1,Y1,X2,Y2
DET-001,2026-09-11 23:10,SHIPWRECK,53.4,HIGH,Shipwreck Structure,120,340,580,920
```

### JSON Report Format
Contains detailed telemetry, bounding boxes, confidence values, SNR estimates, and survey metadata:
- Export filenames are dynamically generated:
  - `AquaSentinel_Report_<timestamp>.csv`
  - `AquaSentinel_Report_<timestamp>.json`

---

## 12. Model Information

- **Architecture:** Ultralytics YOLOv8 (Compact Custom Acoustic Detector)
- **Trained Classes:** `SHIPWRECK`, `MARINE_DEBRIS`, `SEABED_ANOMALY`
- **Inference Resolution:** 1280px (Macro Scale) + 640px (Micro Tiled Patches)
- **Weights File:** `model/seasentinel_shipwreck.pt` (~6.2 MB)

---

## 13. Current Prototype Limitations

- **Dataset Size:** Trained on an initial curated dataset of side-scan sonar samples; further diverse multi-beam sonar training is recommended for higher generalizability.
- **Acoustic Noise Sensitivity:** Heavy acoustic backscatter or multi-path surface reflections may occasionally produce false positives in complex seabed terrains.
- **Hardware Acceleration:** Inference currently runs efficiently on CPU; enabling CUDA GPU acceleration will reduce batch processing latency on large multibeam survey files.

---

## 14. Future Improvements

- [ ] **Bathymetric 3D Point Cloud Integration:** Overlay 2D sonar detections onto 3D seabed bathymetry.
- [ ] **Autonomous Underwater Vehicle (AUV) ROS2 Driver:** Real-time edge inference onboard AUV/ROV platforms via ROS2 nodes.
- [ ] **GeoTIFF / GeoJSON Export:** Embedded GIS coordinates (WGS84) for direct import into QGIS and Hydrographic charting software.
- [ ] **Multi-Beam & Synthetic Aperture Sonar (SAS) Support:** Extended support for advanced synthetic aperture acoustic sensors.

---

## 15. License & Disclaimer

This project is developed for the **Smart India Hackathon (SIH 26057)** as a functional working prototype for demonstration and evaluation. It is provided for academic, research, and prototype evaluation purposes.
