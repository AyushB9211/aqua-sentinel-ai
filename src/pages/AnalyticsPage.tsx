import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Cpu,
  PieChart,
  Activity,
  Layers,
  ShieldCheck,
  Download,
} from 'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import { StatCard } from '../components/ui/StatCard';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Button } from '../components/ui/Button';

export const AnalyticsPage: React.FC = () => {
  const categories = [
    { label: 'Ghost Fishing Nets & Gear', count: 33, pct: 38, color: 'bg-red-500' },
    { label: 'Plastic & Polymer Sheets', count: 24, pct: 28, color: 'bg-teal-400' },
    { label: 'Industrial Rubber & Tires', count: 14, pct: 16, color: 'bg-amber-400' },
    { label: 'Metallic Shipping Containers', count: 9, pct: 10, color: 'bg-blue-400' },
    { label: 'Unclassified Anomaly Objects', count: 7, pct: 8, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-lg bg-marine-900/90 border border-cyan-500/30 backdrop-blur-md corner-brackets">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono font-bold">
              AI ANALYTICS ENGINE
            </span>
            <span className="text-xs font-mono text-slate-400">YOLO-SONAR v4.2 • CUDA ACCELERATED</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight uppercase">
            Oceanographic AI Analytics & Performance
          </h1>
        </div>

        <Button variant="secondary" size="sm" icon={Download} onClick={() => alert('Exporting Analytics Dataset...')}>
          Export PDF Analytics
        </Button>
      </div>

      {/* Model Performance Top Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Inference Frame Rate"
          value="32.4"
          unit="FPS"
          change={{ value: 'Real-time Edge GPU', trend: 'up' }}
          icon={Cpu}
          variant="cyan"
        />
        <StatCard
          label="Mean Average Precision"
          value="94.8"
          unit="mAP@50"
          change={{ value: '+2.4% vs v4.1', trend: 'up' }}
          icon={TrendingUp}
          variant="emerald"
        />
        <StatCard
          label="Anomaly Detection AUC"
          value="96.2"
          unit="%"
          change={{ value: 'DeepShadow Autoencoder', trend: 'up' }}
          icon={Activity}
          variant="purple"
        />
        <StatCard
          label="False Positive Rate"
          value="1.8"
          unit="%"
          change={{ value: 'Benthic Baseline Verified', trend: 'down' }}
          icon={ShieldCheck}
          variant="teal"
        />
      </div>

      {/* Category Breakdown & Depth Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Debris Composition */}
        <Card className="p-5 space-y-4" cornerBrackets>
          <CardHeader
            title="Debris Classification Breakdown"
            subtitle="Distribution of 87 Detected Seafloor Targets"
            icon={PieChart}
          />

          <div className="space-y-3 pt-2">
            {categories.map((cat) => (
              <div key={cat.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300">{cat.label}</span>
                  <span className="text-white font-bold">{cat.count} ({cat.pct}%)</span>
                </div>
                <div className="w-full bg-marine-950 h-2 rounded-full overflow-hidden border border-marine-800">
                  <div className={`h-full ${cat.color}`} style={{ width: `${cat.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Bathymetric Depth Correlation */}
        <Card className="p-5 space-y-4" cornerBrackets>
          <CardHeader
            title="Depth Distribution Profile"
            subtitle="Target Density vs Water Depth"
            icon={BarChart3}
          />

          <div className="space-y-3 pt-2 font-mono text-xs">
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">-50m to -100m (Shelf Zone)</span>
                <span className="text-teal-300 font-bold">18 Targets (21%)</span>
              </div>
              <ProgressBar value={21} variant="teal" size="sm" showValue={false} />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">-100m to -150m (Mid-Slope)</span>
                <span className="text-cyan-300 font-bold">54 Targets (62%)</span>
              </div>
              <ProgressBar value={62} variant="cyan" size="sm" showValue={false} />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">-150m to -250m (Deep Trench)</span>
                <span className="text-purple-300 font-bold">15 Targets (17%)</span>
              </div>
              <ProgressBar value={17} variant="purple" size="sm" showValue={false} />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
