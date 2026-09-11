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

## 6. How to Install

### Prerequisites
- **Node.js** (v18.0 or higher) & **npm**
- **Python** (v3.10 or higher) with `pip`
- **Git**

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AyushB9211/aqua-sentinel-ai.git
   cd aqua-sentinel-ai
   ```

2. **Install Frontend Dependencies:**
   ```bash
   npm install
   ```

3. **Install Backend Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

---

## 7. How to Run the Frontend

Start the Vite development server:
```bash
npm run dev
```
The application will be accessible at `http://localhost:3000` (or `http://localhost:5173`).

To build for production:
```bash
npm run build
```

---

## 8. How to Run the Backend

Start the FastAPI inference backend server:
```bash
python backend_main.py
```
Or via Uvicorn directly:
```bash
uvicorn backend_main:app --host 127.0.0.1 --port 8000 --reload
```
Interactive API documentation will be available at `http://127.0.0.1:8000/docs`.

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
