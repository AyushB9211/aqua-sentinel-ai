import React, { useState } from 'react';
import {
  Settings,
  Sliders,
  Cpu,
  Radio,
  Database,
  ShieldCheck,
  Save,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Dropdown } from '../components/ui/Dropdown';

export const SettingsPage: React.FC = () => {
  const [confidenceThreshold, setConfidenceThreshold] = useState('0.75');
  const [anomalySensitivity, setAnomalySensitivity] = useState('0.85');
  const [frequency, setFrequency] = useState('900');
  const [swathRange, setSwathRange] = useState('250');
  const [apiUrl, setApiUrl] = useState(
    import.meta.env.VITE_API_URL || 'https://api.seasentinel.niot.gov.in/v1/sonar/infer'
  );
  const [dbUrl, setDbUrl] = useState(
    import.meta.env.VITE_DB_URL || 'postgresql://niot:oceanpass@db.seasentinel.niot.gov.in:5432/marinex_db'
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-lg bg-marine-900/90 border border-cyan-500/30 backdrop-blur-md corner-brackets">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono font-bold">
              SYSTEM CONFIGURATION
            </span>
            <span className="text-xs font-mono text-slate-400">SIH 26057 • PARAMETER DECK</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight uppercase">
            System & AI Sensor Parameters
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="sm"
            icon={savedSuccess ? CheckCircle2 : Save}
            onClick={handleSave}
          >
            {savedSuccess ? 'Settings Saved!' : 'Save System Parameters'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. AI Inference Engine Parameters */}
        <Card className="p-5 space-y-4" cornerBrackets>
          <CardHeader
            title="AI Detection & Anomaly Model"
            subtitle="YOLO-Sonar Multi-Scale Feature Extractors"
            icon={Cpu}
          />

          <div className="space-y-4">
            <Input
              label="Minimum Detection Confidence"
              value={confidenceThreshold}
              onChange={(e) => setConfidenceThreshold(e.target.value)}
              helperText="Threshold for tagging detected targets as verified debris"
              unit="CONF"
            />

            <Input
              label="Anomaly Novelty Sensitivity"
              value={anomalySensitivity}
              onChange={(e) => setAnomalySensitivity(e.target.value)}
              helperText="Autoencoder latent vector deviation threshold for anomaly flag"
              unit="SENS"
            />

            <Dropdown
              label="Inference Precision Mode"
              options={[
                { value: 'fp16', label: 'FP16 Half-Precision (32.4 FPS - Optimal)' },
                { value: 'fp32', label: 'FP32 Full Precision (18.2 FPS - Ultra High-Res)' },
                { value: 'int8', label: 'INT8 Quantized (54.0 FPS - High Speed)' },
              ]}
              value="fp16"
              onChange={() => {}}
            />
          </div>
        </Card>

        {/* 2. Sonar Hardware & Transducer Configuration */}
        <Card className="p-5 space-y-4" cornerBrackets>
          <CardHeader
            title="Side-Scan Sonar Telemetry"
            subtitle="EdgeTech 4200 Dual-Frequency Channel Settings"
            icon={Radio}
          />

          <div className="space-y-4">
            <Input
              label="Active Operating Frequency"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              unit="kHz"
              helperText="Dual-frequency 450 kHz / 900 kHz transducer channel"
            />

            <Input
              label="Total Swath Range"
              value={swathRange}
              onChange={(e) => setSwathRange(e.target.value)}
              unit="m"
              helperText="125m Port + 125m Starboard acoustic coverage width"
            />

            <Dropdown
              label="Ping Synchronizer Source"
              options={[
                { value: 'orv', label: 'ORV Sagar Nidhi Databus (24 Hz)' },
                { value: 'internal', label: 'Internal Towfish Clock (30 Hz)' },
              ]}
              value="orv"
              onChange={() => {}}
            />
          </div>
        </Card>

        {/* 3. API & Database Endpoints */}
        <Card className="p-5 space-y-4 lg:col-span-2" cornerBrackets>
          <CardHeader
            title="FastAPI & PostGIS Endpoints"
            subtitle="Backend AI Engine & Geospatial Layer Connection"
            icon={Database}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="FastAPI Inference Engine URL"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              helperText="REST / WebSocket endpoint for streaming waterfall inference"
            />

            <Input
              label="PostGIS Geodatabase Connection"
              value={dbUrl}
              onChange={(e) => setDbUrl(e.target.value)}
              helperText="PostgreSQL / PostGIS connection URI for spatial storage"
            />
          </div>
        </Card>
      </div>
    </div>
  );
};
