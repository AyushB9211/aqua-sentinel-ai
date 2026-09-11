import React, { useState } from 'react';
import {
  MousePointer,
  ZoomIn,
  ZoomOut,
  Ruler,
  Sun,
  Sliders,
  Filter,
  Maximize2,
  Scan,
  Radio,
  Eye,
  Crosshair,
  Sparkles,
} from 'lucide-react';
import { Card } from '../ui/Card';
import { SONAR_VIEWER_OBJECTS } from '../../data/mockData';
import { BoundingBox } from '../../types/marine';
import { cn } from '../../utils/cn';

export interface SonarImageViewerProps {
  selectedObjectId?: string;
  onSelectObject?: (box: BoundingBox) => void;
  className?: string;
}

export const SonarImageViewer: React.FC<SonarImageViewerProps> = ({
  selectedObjectId = 'box-shipwreck',
  onSelectObject,
  className,
}) => {
  const [activeTool, setActiveTool] = useState<'select' | 'measure' | 'crosshair'>('select');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [brightness, setBrightness] = useState<'normal' | 'high' | 'contrast'>('normal');
  const [activePalette, setActivePalette] = useState<'golden' | 'cyan' | 'mono'>('golden');
  const [showMeasurements, setShowMeasurements] = useState(true);

  const getPriorityStyle = (priority?: string, isSelected?: boolean) => {
    switch (priority) {
      case 'HIGH':
        return isSelected
          ? 'border-red-400 bg-red-500/25 ring-2 ring-red-400 shadow-[0_0_15px_rgba(239,68,68,0.7)]'
          : 'border-red-500 bg-red-500/15 hover:border-red-400';
      case 'MEDIUM':
        return isSelected
          ? 'border-amber-400 bg-amber-500/25 ring-2 ring-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.7)]'
          : 'border-amber-500 bg-amber-500/15 hover:border-amber-400';
      case 'LOW':
      case 'ANOMALY':
      default:
        return isSelected
          ? 'border-purple-400 bg-purple-500/25 ring-2 ring-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.7)]'
          : 'border-purple-500 bg-purple-500/15 hover:border-purple-400';
    }
  };

  const getBadgeStyle = (priority?: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-950 text-red-300 border-red-500/60';
      case 'MEDIUM':
        return 'bg-amber-950 text-amber-300 border-amber-500/60';
      case 'LOW':
      case 'ANOMALY':
      default:
        return 'bg-purple-950 text-purple-300 border-purple-500/60';
    }
  };

  return (
    <Card className={cn('flex flex-col h-full overflow-hidden select-none bg-marine-900/90 border-marine-800', className)} cornerBrackets>
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:px-4 border-b border-marine-800 shrink-0 bg-marine-950/70">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-md bg-marine-850 border border-marine-750 text-amber-400">
            <Scan size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-tight font-mono">
                Sonar Image Viewer
              </h3>
              <span className="text-[11px] font-mono text-cyan-300 font-semibold px-2 py-0.2 rounded bg-cyan-950/80 border border-cyan-500/40">
                Scan ID: SSS_2025_05_21_001
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-medium">
              EdgeTech 4200 Dual-Channel • 900 kHz High-Res Side-Scan Waterfall
            </div>
          </div>
        </div>

        {/* Live Feed Status & Palette Toggle */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center rounded bg-marine-950 border border-marine-750 p-0.5 text-xs">
            <button
              onClick={() => setActivePalette('golden')}
              className={cn(
                'px-2 py-0.5 rounded text-[11px] font-semibold transition-colors',
                activePalette === 'golden' ? 'bg-amber-950 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:text-white'
              )}
            >
              Golden Sonar
            </button>
            <button
              onClick={() => setActivePalette('cyan')}
              className={cn(
                'px-2 py-0.5 rounded text-[11px] font-semibold transition-colors',
                activePalette === 'cyan' ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
              )}
            >
              Ocean Cyan
            </button>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>LIVE FEED</span>
          </div>
        </div>
      </div>

      {/* Main Sonar Display Container */}
      <div className="relative flex-1 min-h-[360px] lg:min-h-[420px] w-full bg-[#040810] overflow-hidden flex">
        {/* Left Tactical Tools Column */}
        <div className="absolute left-2.5 top-3 z-30 flex flex-col gap-1.5 bg-marine-950/90 border border-marine-750 p-1 rounded-lg backdrop-blur-md shadow-xl">
          <button
            onClick={() => setActiveTool('select')}
            className={cn(
              'p-1.5 rounded text-xs transition-colors flex items-center justify-center',
              activeTool === 'select' ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white hover:bg-marine-800'
            )}
            title="Select Target"
          >
            <MousePointer size={14} />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.min(1.6, z + 0.2))}
            className="p-1.5 rounded text-xs text-slate-400 hover:text-cyan-300 hover:bg-marine-800 transition-colors"
            title="Zoom In"
          >
            <ZoomIn size={14} />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.2))}
            className="p-1.5 rounded text-xs text-slate-400 hover:text-cyan-300 hover:bg-marine-800 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut size={14} />
          </button>
          <button
            onClick={() => {
              setActiveTool('measure');
              setShowMeasurements(!showMeasurements);
            }}
            className={cn(
              'p-1.5 rounded text-xs transition-colors',
              activeTool === 'measure' ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white hover:bg-marine-800'
            )}
            title="Measure Acoustic Shadow"
          >
            <Ruler size={14} />
          </button>
          <button
            onClick={() => setBrightness((b) => (b === 'normal' ? 'high' : b === 'high' ? 'contrast' : 'normal'))}
            className={cn(
              'p-1.5 rounded text-xs transition-colors',
              brightness !== 'normal' ? 'bg-amber-950 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:text-white hover:bg-marine-800'
            )}
            title={`Brightness/Contrast (${brightness})`}
          >
            <Sun size={14} />
          </button>
        </div>

        {/* Right Range & Scale Indicator */}
        <div className="absolute right-2.5 top-3 z-30 flex flex-col items-end gap-1 text-[10px] font-mono text-slate-300 bg-marine-950/80 px-2 py-1 rounded border border-marine-750 backdrop-blur-md">
          <span className="text-cyan-400 font-bold">ALT: 13.8 m</span>
          <span>DEPTH: -142.6 m</span>
          <span>SWATH: 250 m</span>
        </div>

        {/* Sonar Acoustic Texture Canvas */}
        <div
          className={cn(
            'w-full h-full relative transition-transform duration-300 ease-out origin-center overflow-hidden',
            brightness === 'high' && 'brightness-125 contrast-110',
            brightness === 'contrast' && 'contrast-150 brightness-95'
          )}
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* Golden or Cyan Sonar Acoustic Background */}
          <div
            className={cn(
              'w-full h-full relative overflow-hidden',
              activePalette === 'golden'
                ? 'bg-gradient-to-b from-[#140f06] via-[#241a0a] to-[#0e0a03]'
                : 'bg-gradient-to-b from-[#060c18] via-[#09152b] to-[#040810]'
            )}
          >
            {/* Center Nadir Line (Towfish Path) */}
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-5 bg-black border-x border-amber-500/30 flex items-center justify-center pointer-events-none">
              <div className="w-[1px] h-full bg-amber-400/50" />
            </div>

            {/* Port & Starboard Swath Markers */}
            <div className="absolute top-2 left-14 text-[10px] font-mono font-bold text-amber-300/80 pointer-events-none">
              PORT CHANNEL (125m)
            </div>
            <div className="absolute top-2 right-24 text-[10px] font-mono font-bold text-amber-300/80 pointer-events-none">
              STARBOARD CHANNEL (125m)
            </div>

            {/* Acoustic Seabed Texture Ripple Lines */}
            <svg className="absolute inset-0 w-full h-full opacity-50 pointer-events-none">
              <defs>
                <pattern id="acousticTextureGolden" width="120" height="24" patternUnits="userSpaceOnUse">
                  <path d="M0 12 Q 30 6, 60 12 T 120 12" fill="none" stroke={activePalette === 'golden' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(56, 189, 248, 0.2)'} strokeWidth="0.8" />
                  <path d="M0 20 Q 30 15, 60 20 T 120 20" fill="none" stroke={activePalette === 'golden' ? 'rgba(217, 119, 6, 0.15)' : 'rgba(20, 184, 166, 0.15)'} strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#acousticTextureGolden)" />
            </svg>

            {/* Continuous Acoustic Scanline Sweep Line */}
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-300 to-transparent opacity-60 shadow-[0_0_12px_rgba(245,158,11,0.9)] animate-radar-line pointer-events-none" />

            {/* Detected Bounding Boxes */}
            {SONAR_VIEWER_OBJECTS.map((obj) => {
              const isSelected = selectedObjectId === obj.id;

              return (
                <div
                  key={obj.id}
                  onClick={() => onSelectObject?.(obj)}
                  className={cn(
                    'absolute border-2 rounded-sm cursor-pointer transition-all duration-150 group z-20',
                    getPriorityStyle(obj.priority, isSelected)
                  )}
                  style={{
                    left: `${obj.x}%`,
                    top: `${obj.y}%`,
                    width: `${obj.width}%`,
                    height: `${obj.height}%`,
                  }}
                >
                  {/* Acoustic Shadow Representation */}
                  <div
                    className="absolute left-full top-1/2 -translate-y-1/2 bg-black/90 rounded-r border-r border-black pointer-events-none"
                    style={{
                      width: `${obj.shadowLength * 3.5}px`,
                      height: '75%',
                    }}
                  />

                  {/* Target Label Tag */}
                  <div
                    className={cn(
                      'absolute -top-6 left-0 whitespace-nowrap text-[10px] font-bold px-1.5 py-0.5 rounded border shadow-lg flex items-center gap-1',
                      getBadgeStyle(obj.priority)
                    )}
                  >
                    <span>{obj.label}</span>
                    <span className="font-mono text-white">{(obj.confidence * 100).toFixed(0)}%</span>
                  </div>

                  {/* Corner Crosshairs */}
                  <div className="absolute -top-1 -left-1 w-1.5 h-1.5 bg-white rounded-full" />
                  <div className="absolute -bottom-1 -right-1 w-1.5 h-1.5 bg-white rounded-full" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Range (m) Distance Scale Bar */}
        <div className="absolute bottom-2 inset-x-4 z-30 flex items-center justify-between text-[10px] font-mono text-slate-300 bg-marine-950/85 px-3 py-1 rounded border border-marine-750 backdrop-blur-md">
          <span>-125m</span>
          <span>-75m</span>
          <span>-25m</span>
          <span className="text-amber-400 font-bold">0m (NADIR)</span>
          <span>+25m</span>
          <span>+75m</span>
          <span>+125m</span>
        </div>
      </div>
    </Card>
  );
};
