import React from 'react';
import { Map, Ship, Compass, Navigation, Maximize2, Layers } from 'lucide-react';
import { Card } from '../ui/Card';
import { SURVEY_MAP_POINTS } from '../../data/mockData';
import { SurveyMapPoint } from '../../types/marine';
import { cn } from '../../utils/cn';

export interface SurveyMapCardProps {
  onOpenFullMap?: () => void;
  onSelectMapPoint?: (detectionId: string) => void;
  className?: string;
}

export const SurveyMapCard: React.FC<SurveyMapCardProps> = ({
  onOpenFullMap,
  onSelectMapPoint,
  className,
}) => {
  const getPointColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'border-red-400 bg-red-500 text-red-300 shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-pulse';
      case 'MEDIUM':
        return 'border-amber-400 bg-amber-500 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.8)]';
      case 'LOW':
        return 'border-purple-400 bg-purple-500 text-purple-300 shadow-[0_0_8px_rgba(168,85,247,0.8)]';
      case 'NORMAL':
      default:
        return 'border-emerald-400 bg-emerald-500 text-emerald-300 shadow-[0_0_6px_rgba(16,185,129,0.7)]';
    }
  };

  return (
    <Card className={cn('flex flex-col h-full overflow-hidden bg-marine-900/90 border-marine-800', className)} cornerBrackets>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-marine-800 shrink-0 bg-marine-950/70">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-marine-850 border border-marine-750 text-cyan-400">
            <Map size={15} />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-tight font-mono">
              Survey Map
            </h3>
            <div className="text-[10px] font-mono text-slate-400">
              Coromandel Trench • Sector 4
            </div>
          </div>
        </div>

        <button
          onClick={onOpenFullMap}
          className="text-[10px] font-mono font-bold text-cyan-300 hover:text-white px-2 py-0.5 rounded bg-marine-950 border border-marine-750 flex items-center gap-1 transition-colors"
        >
          <span>EXPAND</span>
          <Maximize2 size={11} />
        </button>
      </div>

      {/* Map Graphic Canvas */}
      <div className="relative flex-1 min-h-[220px] bg-[#030914] overflow-hidden select-none">
        {/* Sonar Bathymetric Grid */}
        <div className="absolute inset-0 sonar-grid-bg opacity-40 pointer-events-none" />

        {/* Bathymetric Depth Contours */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
          <path d="M0,40 Q100,20 200,50 T400,30" stroke="#0284c7" strokeWidth="1" fill="none" />
          <path d="M0,100 Q120,80 250,110 T500,90" stroke="#0369a1" strokeWidth="1.2" fill="none" />
          <path d="M0,160 Q150,140 300,180 T600,150" stroke="#075985" strokeWidth="1.5" fill="none" />
        </svg>

        {/* Survey Transect Path Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {/* Transect polygon swath */}
          <polygon
            points="30,50 320,160 300,195 10,85"
            fill="rgba(6, 182, 212, 0.08)"
            stroke="rgba(6, 182, 212, 0.4)"
            strokeWidth="1"
            strokeDasharray="4 2"
          />
          {/* Centerline flight path */}
          <line x1="20" y1="67" x2="310" y2="177" stroke="#00e5ff" strokeWidth="1.8" />
        </svg>

        {/* Research Vessel Position Marker */}
        <div
          className="absolute z-30 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center cursor-pointer group"
          style={{ left: '68%', top: '65%' }}
        >
          <div className="w-6 h-6 rounded-full bg-cyan-950 border-2 border-cyan-400 flex items-center justify-center text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.9)]">
            <Ship size={12} className="animate-pulse" />
          </div>
          <div className="absolute left-7 whitespace-nowrap bg-marine-950/90 text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded border border-marine-750 pointer-events-none">
            RV Samudra Nidhi
          </div>
        </div>

        {/* Detection Markers */}
        {SURVEY_MAP_POINTS.map((pt: SurveyMapPoint) => (
          <div
            key={pt.id}
            onClick={() => onSelectMapPoint?.(pt.detectionId)}
            className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
          >
            <div className={cn('w-3 h-3 rounded-full border', getPointColor(pt.priority))} />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 hidden group-hover:block whitespace-nowrap text-[9px] font-mono font-bold bg-marine-900 border border-marine-700 px-1.5 py-0.5 rounded text-white shadow-xl">
              {pt.label}
            </div>
          </div>
        ))}
      </div>

      {/* Map Legend Footer */}
      <div className="p-2 border-t border-marine-800 shrink-0 bg-marine-950/80 flex flex-wrap items-center justify-between text-[10px] font-mono text-slate-400">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          <span>High Priority</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <span>Medium</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-purple-500" />
          <span>Low</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Normal</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-0.5 bg-cyan-400" />
          <span>Survey Path</span>
        </div>
      </div>
    </Card>
  );
};
