# SeaSentinel AI — Production Vercel Deployment Guide

**Project:** SeaSentinel AI (SIH 26057) — AI-Powered Automated Underwater Marine Debris and Anomaly Detection System using Side-Scan Sonar Imagery  
**Organization:** Ministry of Earth Sciences (MoES) / National Institute of Ocean Technology (NIOT)  
**Target Platform:** [Vercel](https://vercel.com) (Frontend Single-Page Application)  
**Expected Outcome:** A public, shareable HTTPS URL (e.g., `https://seasentinel.vercel.app`) with rich WhatsApp link previews.

---

## 📋 Pre-Deployment Verification

Before deploying, ensure the production build succeeds locally:

```bash
npm run build
```
The output will be bundled into the `dist/` directory with zero errors.

---

## 🚀 Option 1: One-Command Deployment via Vercel CLI (Fastest)

If you have Node.js installed on your machine:

1. Open your terminal in the project directory (`D:\MarineX`):
   ```bash
   npx vercel
   ```

2. Follow the interactive prompts:
   - **Set up and deploy?** `Y`
   - **Which scope?** *(Select your Vercel account)*
   - **Link to existing project?** `N`
   - **What's your project's name?** `seasentinel` (or your preferred name)
   - **In which directory is your code located?** `./`
   - **Want to modify these settings?** `N` (Vercel automatically detects Vite)

3. Deploy to production:
   ```bash
   npx vercel --prod
   ```

4. Vercel will output your public live production link:
   ```
   ✅  Production: https://seasentinel.vercel.app [copied to clipboard]
   ```

---

## 🌐 Option 2: Deploy via GitHub (Continuous Deployment)

1. Push your code to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial SeaSentinel AI production build"
   git remote add origin https://github.com/YOUR_USERNAME/seasentinel-ai.git
   git branch -M main
   git push -u origin main
   ```

2. Go to [vercel.com](https://vercel.com) and click **"Add New..." > "Project"**.

3. Select your `seasentinel-ai` repository and click **Import**.

4. Configure Project Settings:
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

5. Click **Deploy**. In under 60 seconds, your site will be live at `https://<your-project-name>.vercel.app`.

---

## 📂 Option 3: Manual Drag & Drop Deployment (No Git / CLI Needed)

1. Run the build command locally:
   ```bash
   npm run build
   ```

2. Go to [vercel.com/new](https://vercel.com/new) and navigate to **Vercel Drop** (or import local directory).

3. Drag and drop the `dist/` folder into the browser window.

4. Your project will be instantly deployed and given a public URL.

---

## 📱 WhatsApp & Social Sharing

The project includes full OpenGraph metadata in `index.html`. When you paste your public Vercel link (`https://seasentinel.vercel.app`) into **WhatsApp**, **Telegram**, **LinkedIn**, or **X (Twitter)**, it automatically displays:

- **Title:** `SeaSentinel AI — SEE BENEATH. DETECT BEYOND.`
- **Description:** `AI-Powered Automated Underwater Marine Debris & Sonar Anomaly Detection System. SIH 26057 • MoES / NIOT.`
- **Image:** Official SeaSentinel AI Logo Emblem
- **Theme Color:** Deep Ocean Navy (`#02050a`)

---

## 🛠️ Vercel Routing Configuration (`vercel.json`)

The project includes a pre-configured [`vercel.json`](file:///d:/MarineX/vercel.json) file:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```
This guarantees:
1. **Direct URL Navigation:** Refreshing or directly opening any view (e.g., `#missions`, `#sonar`, `#detections`, `#map`, `#analytics`, `#reports`, `#settings`) works seamlessly without 404 errors.
2. **High-Performance Caching:** Static JavaScript, CSS, and image assets are cached with immutable headers for instant load times across all mobile and desktop devices.
