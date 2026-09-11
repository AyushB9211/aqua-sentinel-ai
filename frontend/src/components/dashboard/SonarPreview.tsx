import React, { useState } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Grid,
  Sun,
  ArrowRight,
  Scan,
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { SONAR_PREVIEW_OBJECTS } from '../../data/mockData';
import { BoundingBox } from '../../types/marine';
import { cn } from '../../utils/cn';

export interface SonarPreviewProps {
  onOpenSonarAnalysis: () => void;
  onSelectObject?: (box: BoundingBox) => void;
  className?: string;
}

export const SonarPreview: React.FC<SonarPreviewProps> = ({
  onOpenSonarAnalysis,
  onSelectObject,
  className,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [brightnessFilter, setBrightnessFilter] = useState<'normal' | 'high' | 'contrast'>('normal');
  const [hoveredObject, setHoveredObject] = useState<BoundingBox | null>(null);

  const toggleBrightness = () => {
    if (brightnessFilter === 'normal') setBrightnessFilter('high');
    else if (brightnessFilter === 'high') setBrightnessFilter('contrast');
    else setBrightnessFilter('normal');
  };

  const getSeverityBorder = (sev: BoundingBox['severity']) => {
    switch (sev) {
      case 'high':
        return 'border-red-500 bg-red-500/15 shadow-[0_0_12px_rgba(239,68,68,0.5)]';
      case 'anomaly':
        return 'border-purple-500 bg-purple-500/15 shadow-[0_0_12px_rgba(168,85,247,0.5)]';
      case 'medium':
        return 'border-amber-500 bg-amber-500/15 shadow-[0_0_12px_rgba(245,158,11,0.5)]';
      case 'low':
        return 'border-emerald-500 bg-emerald-500/15 shadow-[0_0_12px_rgba(16,185,129,0.5)]';
      default:
        return 'border-cyan-500 bg-cyan-500/15';
    }
  };

  const getSeverityTagBg = (sev: BoundingBox['severity']) => {
    switch (sev) {
      case 'high':
        return 'bg-red-950 text-red-200 border-red-500/60';
      case 'anomaly':
        return 'bg-purple-950 text-purple-200 border-purple-500/60';
      case 'medium':
        return 'bg-amber-950 text-amber-200 border-amber-500/60';
      case 'low':
        return 'bg-emerald-950 text-emerald-200 border-emerald-500/60';
      default:
        return 'bg-cyan-950 text-cyan-200 border-cyan-500/60';
    }
  };

  return (
    <Card className={cn('flex flex-col h-full overflow-hidden', className)} cornerBrackets>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-marine-800 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-md bg-marine-850 border border-marine-750 text-cyan-400">
            <Scan size={16} />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-white">
              Sonar Live Waterfall
            </h3>
            <div className="text-xs text-slate-400">
              EdgeTech Dual-Channel • 900 kHz High-Res
            </div>
          </div>
        </div>

        {/* Live Feed Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>Live Feed</span>
        </div>
      </div>

      {/* Waterfall Acoustic Canvas Screen */}
      <div className="relative flex-1 min-h-[300px] w-full rounded-md bg-[#050b14] border border-marine-750 overflow-hidden select-none">
        {/* Simulated Side-Scan Sonar Texture / Waterfall Layers */}
        <div
          className={cn(
            'absolute inset-0 transition-transform duration-300 ease-out origin-center',
            brightnessFilter === 'high' && 'brightness-125 contrast-110',
            brightnessFilter === 'contrast' && 'contrast-150 brightness-95'
          )}
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* Sonar Acoustic Waterfall Background Graphic */}
          <div className="w-full h-full relative overflow-hidden bg-gradient-to-b from-[#060c18] via-[#09152b] to-[#040810]">
            {/* Center Nadir Line (Towfish Flight Path) */}
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-4 bg-[#020509] border-x border-cyan-500/30 flex items-center justify-center pointer-events-none">
              <div className="w-[1px] h-full bg-cyan-400/40" />
            </div>

            {/* Port & Starboard Swath Markers */}
            <div className="absolute top-2.5 left-3 text-xs text-cyan-300/80 font-medium pointer-events-none">
              Port Swath (125m)
            </div>
            <div className="absolute top-2.5 right-3 text-xs text-cyan-300/80 font-medium pointer-events-none">
              Starboard Swath (125m)
            </div>

            {/* Acoustic Seabed Texture Ripple Lines */}
            <svg className="absolute inset-0 w-full h-full opacity-40 pointer-events-none">
              <defs>
                <pattern id="sonarTextureClean" width="100" height="20" patternUnits="userSpaceOnUse">
                  <path d="M0 10 Q 25 5, 50 10 T 100 10" fill="none" stroke="rgba(56, 189, 248, 0.15)" strokeWidth="0.8" />
                  <path d="M0 18 Q 25 14, 50 18 T 100 18" fill="none" stroke="rgba(20, 184, 166, 0.12)" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#sonarTextureClean)" />
            </svg>

            {/* Scanning Moving Sweep Line */}
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50 shadow-[0_0_8px_rgba(6,182,212,0.8)] animate-radar-line pointer-events-none" />

            {/* Sonar Detected Bounding Boxes */}
            {SONAR_PREVIEW_OBJECTS.map((obj) => (
              <div
                key={obj.id}
                onClick={() => onSelectObject?.(obj)}
                onMouseEnter={() => setHoveredObject(obj)}
                onMouseLeave={() => setHoveredObject(null)}
                className={cn(
                  'absolute border-2 rounded-sm cursor-pointer transition-colors duration-150 group z-20',
                  getSeverityBorder(obj.severity),
                  hoveredObject?.id === obj.id && 'ring-2 ring-white/90 shadow-lg shadow-white/20'
                )}
                style={{
                  left: `${obj.x}%`,
                  top: `${obj.y}%`,
                  width: `${obj.width}%`,
                  height: `${obj.height}%`,
                }}
              >
                {/* Acoustic Shadow vector representation */}
                <div
                  className="absolute left-full top-1/2 -translate-y-1/2 bg-black/80 rounded-r border-r border-black pointer-events-none"
                  style={{
                    width: `${obj.shadowLength * 2.5}px`,
                    height: '70%',
                  }}
                />

                {/* Target Label Tag */}
                <div
                  className={cn(
                    'absolute -top-6 left-0 whitespace-nowrap text-xs font-semibold px-2 py-0.5 rounded border shadow-md',
                    getSeverityTagBg(obj.severity)
                  )}
                >
                  {obj.label} ({(obj.confidence * 100).toFixed(0)}%)
                </div>

                {/* Corner Crosshairs */}
                <div className="absolute -top-1 -left-1 w-1.5 h-1.5 bg-white rounded-full" />
                <div className="absolute -bottom-1 -right-1 w-1.5 h-1.5 bg-white rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Grid Overlay */}
        {showGrid && (
          <div className="absolute inset-0 sonar-grid-bg opacity-30 pointer-events-none" />
        )}

        {/* Tactical Screen Control Toolbar */}
        <div className="absolute top-2 right-2 z-30 flex items-center gap-1 bg-marine-950/90 border border-marine-750 p-1 rounded-md backdrop-blur-md">
          <button
            onClick={() => setZoomLevel((z) => Math.min(1.6, z + 0.2))}
            className="p-1.5 rounded text-slate-300 hover:text-cyan-300 hover:bg-marine-800 transition-colors"
            title="Zoom In"
            aria-label="Zoom In"
          >
            <ZoomIn size={14} />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.2))}
            className="p-1.5 rounded text-slate-300 hover:text-cyan-300 hover:bg-marine-800 transition-colors"
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            <ZoomOut size={14} />
          </button>
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={cn(
              'p-1.5 rounded transition-colors',
              showGrid ? 'text-cyan-300 bg-marine-800' : 'text-slate-400 hover:text-white'
            )}
            title="Toggle Grid"
            aria-label="Toggle Grid"
          >
            <Grid size={14} />
          </button>
          <button
            onClick={toggleBrightness}
            className={cn(
              'p-1.5 rounded transition-colors',
              brightnessFilter !== 'normal' ? 'text-cyan-300 bg-marine-800' : 'text-slate-400 hover:text-white'
            )}
            title={`Brightness Filter: ${brightnessFilter}`}
            aria-label="Toggle Brightness"
          >
            <Sun size={14} />
          </button>
        </div>

        {/* Telemetry Scale Footer on Waterfall */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-xs text-slate-300 pointer-events-none z-30 bg-marine-950/85 px-3 py-1 rounded border border-marine-800">
          <span>Altitude: 13.8m</span>
          <span>Ping: #1,248</span>
          <span className="text-cyan-300 font-medium">Swath: 250m</span>
          <span>Speed: 3.1 kts</span>
        </div>
      </div>

      {/* Legend & Action Bar */}
      <div className="pt-3 mt-3 border-t border-marine-800 space-y-3 shrink-0">
        {/* Severity Legend */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300 font-normal">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.8)]" />
            <span>High Severity</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_6px_rgba(168,85,247,0.8)]" />
            <span>Unknown Anomaly</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.8)]" />
            <span>Net / Rope</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(168,85,247,0.8)]" />
            <span>Debris</span>
          </div>
        </div>

        {/* CTA Button */}
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-center text-xs font-semibold"
          onClick={onOpenSonarAnalysis}
        >
          Open in Sonar Analysis <ArrowRight size={14} className="ml-1" />
        </Button>
      </div>
    </Card>
  );
};
