import React from 'react';
import { cn } from '../../utils/cn';

export interface SonarSweepOverlayProps {
  className?: string;
  size?: number; // width/height in px
  activeBlips?: Array<{
    id: string;
    x: number; // percentage (0-100)
    y: number; // percentage (0-100)
    severity: 'low' | 'medium' | 'high' | 'anomaly';
    label?: string;
  }>;
  showGrid?: boolean;
  showRangeRings?: boolean;
}

export const SonarSweepOverlay: React.FC<SonarSweepOverlayProps> = ({
  className,
  activeBlips = [
    { id: 'b1', x: 68, y: 35, severity: 'high', label: 'DET-0941' },
    { id: 'b2', x: 42, y: 72, severity: 'anomaly', label: 'ANOM-02' },
    { id: 'b3', x: 25, y: 45, severity: 'medium', label: 'DET-0944' },
    { id: 'b4', x: 80, y: 65, severity: 'low', label: 'DET-0945' },
  ],
  showGrid = true,
  showRangeRings = true,
}) => {
  const blipColors = {
    low: 'bg-emerald-400 border-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.8)]',
    medium: 'bg-amber-400 border-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.8)]',
    high: 'bg-red-400 border-red-300 shadow-[0_0_8px_rgba(239,68,68,0.9)]',
    anomaly: 'bg-purple-400 border-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.9)]',
  };

  return (
    <div
      className={cn(
        'relative aspect-square w-full max-w-[320px] rounded-full bg-marine-950 border border-cyan-500/30 overflow-hidden shadow-2xl shadow-cyan-950/40 select-none',
        className
      )}
    >
      {/* Range Rings */}
      {showRangeRings && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[85%] h-[85%] rounded-full border border-cyan-500/15" />
          <div className="absolute w-[60%] h-[60%] rounded-full border border-cyan-500/20" />
          <div className="absolute w-[35%] h-[35%] rounded-full border border-cyan-500/25" />
          <div className="absolute w-[10%] h-[10%] rounded-full border border-cyan-400/40" />

          {/* Crosshairs */}
          <div className="absolute w-full h-[1px] bg-cyan-500/15" />
          <div className="absolute h-full w-[1px] bg-cyan-500/15" />
          <div className="absolute w-full h-[1px] bg-cyan-500/10 rotate-45" />
          <div className="absolute w-full h-[1px] bg-cyan-500/10 -rotate-45" />
        </div>
      )}

      {/* Grid Pattern overlay */}
      {showGrid && (
        <div className="absolute inset-0 sonar-grid-bg opacity-40 pointer-events-none" />
      )}

      {/* Rotating Radar Sweep Beam */}
      <div className="absolute inset-0 pointer-events-none animate-sonar-sweep origin-center">
        <div className="w-full h-full radar-sweep-gradient rounded-full" />
      </div>

      {/* Center Transducer Node */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-cyan-400 border border-white shadow-[0_0_8px_rgba(6,182,212,1)] z-20" />

      {/* Target Blips */}
      {activeBlips.map((blip) => (
        <div
          key={blip.id}
          className="absolute group z-20 -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${blip.x}%`, top: `${blip.y}%` }}
        >
          <div
            className={cn(
              'w-2.5 h-2.5 rounded-full border animate-pulse cursor-pointer transition-transform hover:scale-150',
              blipColors[blip.severity]
            )}
          />
          {blip.label && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 hidden group-hover:block whitespace-nowrap text-[10px] font-mono font-bold bg-marine-900/90 border border-marine-700 px-1.5 py-0.5 rounded text-white z-30 pointer-events-none">
              {blip.label}
            </div>
          )}
        </div>
      ))}

      {/* HUD Telemetry text markers */}
      <div className="absolute top-2 left-3 text-[10px] font-mono text-cyan-400/80 pointer-events-none font-semibold">
        RNG: 250m
      </div>
      <div className="absolute top-2 right-3 text-[10px] font-mono text-cyan-400/80 pointer-events-none font-semibold">
        900 kHz
      </div>
      <div className="absolute bottom-2 left-3 text-[10px] font-mono text-slate-400 pointer-events-none">
        SWATH: 125m STBD
      </div>
      <div className="absolute bottom-2 right-3 text-[10px] font-mono text-emerald-400 pointer-events-none flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
        LIVE SCAN
      </div>
    </div>
  );
};
