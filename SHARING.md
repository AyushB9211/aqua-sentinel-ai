# SeaSentinel AI — LAN & Public Sharing Guide

**Project:** SeaSentinel AI (SIH 26057) — AI-Powered Automated Underwater Marine Debris and Anomaly Detection System using Side-Scan Sonar Imagery  
**Organization:** Ministry of Earth Sciences (MoES) / National Institute of Ocean Technology (NIOT)  
**Port:** `3000`  
**Host Binding:** `0.0.0.0` (All Network Interfaces)

---

## 1. Start the Application Locally

1. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

2. Launch the Vite development server:
   ```bash
   npm run dev
   ```

3. The application will start and listen on all local interfaces on port **3000**:
   ```
     VITE v5.4.21  ready in 260 ms

     ➜  Local:   http://localhost:3000/
     ➜  Network: http://<LOCAL-IP>:3000/
   ```

---

## 2. Accessing from Other Devices on the Same Wi-Fi / Local Network (LAN)

You can view and interact with the SeaSentinel AI dashboard from any phone, tablet, or secondary laptop on the same local network:

### Step 1: Find your computer's local IP address

- **Windows (PowerShell / Command Prompt):**
  ```powershell
  ipconfig
  ```
  Look for **IPv4 Address** under your active Wi-Fi or Ethernet adapter (e.g., `192.168.1.16`).

- **macOS:**
  ```bash
  ipconfig getifaddr en0
  ```

- **Linux:**
  ```bash
  hostname -I
  ```

### Step 2: Open the URL on your mobile/tablet browser

Enter the local network URL in your browser:
```
http://<YOUR-LOCAL-IP>:3000
```
*Example:* `http://192.168.1.16:3000/`

---

## 3. Remote Public Preview via ngrok Tunneling

To share a live, secure HTTPS preview with evaluators or remote team members across the internet:

1. Ensure your local server is running on port `3000` (`npm run dev`).

2. In a separate terminal, start an ngrok HTTP tunnel:
   ```bash
   ngrok http 3000
   ```

3. ngrok will output a public HTTPS forwarding address:
   ```
   Forwarding: https://<your-subdomain>.ngrok-free.app -> http://localhost:3000
   ```

4. Share the `https://...` link. All routes, assets, launch sequences, and interactive modules will load seamlessly over the secure tunnel.

---

## 4. Environment Variables Configuration

To customize API endpoints, ports, or telemetry parameters, create a `.env` or `.env.local` file based on `.env.example`:

```env
# Port & Network
VITE_PORT=3000
VITE_HOST=0.0.0.0

# Backend Inference & GIS Datastore Endpoints
VITE_API_URL=http://localhost:8000/api/v1/sonar/infer
VITE_DB_URL=postgresql://niot:oceanpass@localhost:5432/marinex_db
```

---

## 5. Supported Routes & Responsive Views

All routes are fully supported across desktop, laptop, tablet, and mobile browsers:

- **Operational Dashboard:** `/` (or `#dashboard`)
- **Survey Missions:** `#missions`
- **Sonar Waterfall Analysis:** `#sonar`
- **Detections Pool:** `#detections`
- **Bathymetric & GIS Marine Map:** `#map`
- **AI Analytics:** `#analytics`
- **Hydrographic Reports:** `#reports`
- **System Parameters:** `#settings`
- **Design System UI Kit:** `#preview`

---

## 6. Security & Safety

- No sensitive API keys or private credentials are hardcoded into client bundles.
- All mock datasets and hydrographic telemetry parameters are safely contained.
