import React from 'react';
import { Cpu, Zap, Activity, CheckCircle2, RefreshCw, Download, Sliders } from 'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const ModelsPage: React.FC = () => {
  const models = [
    {
      id: 'YOLO-SONAR-v4.2',
      name: 'YOLO-Sonar v4.2 Marine Debris Object Detector',
      architecture: 'Multi-Scale Feature Pyramid + CSPDarknet + Acoustic Shadow Head',
      fps: '32.4 FPS (RTX 4090 / CUDA 12.4)',
      mAP: '94.8% mAP@50',
      status: 'Active Deployment (Edge GPU)',
      weightsSize: '84.2 MB',
    },
    {
      id: 'DEEP-SHADOW-AE-v2',
      name: 'DeepShadow Autoencoder Unsupervised Anomaly Engine',
      architecture: 'Variational Latent Space Novelty Estimator',
      fps: '48.0 FPS',
      mAP: '96.2% ROC-AUC',
      status: 'Active (Anomaly Filter)',
      weightsSize: '42.6 MB',
    },
    {
      id: 'BATHY-SEG-v1.8',
      name: 'BathySeg Seabed Backscatter Semantic Segmenter',
      architecture: 'DeepLabV3+ with Seabed Roughness Texture Encoder',
      fps: '22.0 FPS',
      mAP: '91.4% mIoU',
      status: 'Standby Model',
      weightsSize: '124.0 MB',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-lg bg-marine-900/90 border border-cyan-500/30 backdrop-blur-md corner-brackets">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono font-bold">
              AI INFERENCE ENGINE
            </span>
            <span className="text-xs font-mono text-slate-400">YOLO-SONAR v4.2 • 32.4 FPS REAL-TIME</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight uppercase">
            AI Neural Detection Models & Benchmarks
          </h1>
        </div>

        <Button variant="primary" size="sm" icon={RefreshCw} onClick={() => alert('Calibrating neural weights with live sonar feed...')}>
          Calibrate Weights
        </Button>
      </div>

      {/* Models Grid */}
      <div className="space-y-4">
        {models.map((m) => (
          <Card key={m.id} className="p-4 sm:p-5 space-y-3 bg-marine-900/90 border-marine-800" cornerBrackets>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-marine-800/80 pb-2.5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded bg-marine-850 border border-marine-750 text-cyan-400">
                  <Cpu size={18} />
                </div>
                <div>
                  <span className="text-xs font-mono font-bold text-cyan-300">{m.id}</span>
                  <h3 className="text-sm sm:text-base font-bold text-white font-mono">{m.name}</h3>
                </div>
              </div>

              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded border border-emerald-500/40 shrink-0">
                {m.status}
              </span>
            </div>

            <div className="p-2.5 rounded bg-marine-950 border border-marine-800 text-xs font-mono text-slate-400">
              <span className="text-slate-500">ARCHITECTURE: </span>
              <span className="text-slate-300">{m.architecture}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-2 rounded bg-marine-950 border border-marine-800">
                <span className="text-slate-400 text-[10px]">INFERENCE SPEED</span>
                <div className="text-cyan-300 font-bold mt-0.5">{m.fps}</div>
              </div>

              <div className="p-2 rounded bg-marine-950 border border-marine-800">
                <span className="text-slate-400 text-[10px]">ACCURACY BENCHMARK</span>
                <div className="text-emerald-300 font-bold mt-0.5">{m.mAP}</div>
              </div>

              <div className="p-2 rounded bg-marine-950 border border-marine-800">
                <span className="text-slate-400 text-[10px]">WEIGHTS FILE SIZE</span>
                <div className="text-teal-300 font-bold mt-0.5">{m.weightsSize}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
