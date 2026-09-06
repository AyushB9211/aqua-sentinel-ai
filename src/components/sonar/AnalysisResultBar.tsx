import React from 'react';
import { RotateCcw, Download } from 'lucide-react';
import { Button } from '../ui/Button';
import { SonarDetection } from '../../types/marine';
import { cn } from '../../utils/cn';

export interface AnalysisResultBarProps {
  detections: SonarDetection[];
  onReRunAnalysis: () => void;
  onExportResults: () => void;
  className?: string;
}

export const AnalysisResultBar: React.FC<AnalysisResultBarProps> = ({
  detections,
  onReRunAnalysis,
  onExportResults,
  className,
}) => {
  const highPriorityCount = detections.filter((d) => d.priority === 'HIGH').length;

  const avgConfidence =
    detections.length > 0
      ? (
          (detections.reduce((acc, curr) => acc + curr.confidence, 0) / detections.length) *
          100
        ).toFixed(0)
      : '0';

  const depthStr =
    detections.length > 0 && detections[0].waterDepth
      ? `-${detections[0].waterDepth.toFixed(1)} m`
      : '-142.6 m';

  return (
    <div
      className={cn(
        'w-full p-3 sm:px-5 rounded-lg bg-marine-900/90 border border-marine-800 text-xs font-mono select-none flex flex-wrap items-center justify-between gap-4 shadow-xl corner-brackets',
        className
      )}
    >
      {/* Left: Bottom Summary Metrics */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-slate-300">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-slate-400 font-medium">Objects Detected:</span>
          <span className="text-white font-bold">{detections.length}</span>
        </div>

        <div className="hidden sm:block w-[1px] h-3.5 bg-marine-800" />

        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 font-medium">High Priority:</span>
          <span className="text-red-400 font-bold">{highPriorityCount}</span>
        </div>

        <div className="hidden sm:block w-[1px] h-3.5 bg-marine-800" />

        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 font-medium">Average Confidence:</span>
          <span className="text-emerald-400 font-bold">{avgConfidence}%</span>
        </div>

        <div className="hidden sm:block w-[1px] h-3.5 bg-marine-800" />

        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 font-medium">Coverage Area:</span>
          <span className="text-cyan-300 font-bold">12.48 km²</span>
        </div>

        <div className="hidden sm:block w-[1px] h-3.5 bg-marine-800" />

        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 font-medium">Water Depth:</span>
          <span className="text-teal-300 font-bold">{depthStr}</span>
        </div>

        <div className="hidden sm:block w-[1px] h-3.5 bg-marine-800" />

        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 font-medium">Analysis Time:</span>
          <span className="text-slate-200 font-bold">2.80s</span>
        </div>
      </div>

      {/* Right: Action Buttons */}
      <div className="flex items-center gap-2">
        <Button variant="secondary" size="xs" icon={RotateCcw} onClick={onReRunAnalysis}>
          Re-run
        </Button>

        <Button variant="primary" size="xs" icon={Download} onClick={onExportResults}>
          Export JSON
        </Button>
      </div>
    </div>
  );
};
