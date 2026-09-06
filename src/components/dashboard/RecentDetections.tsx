import React from 'react';
import { AlertOctagon, ArrowRight, Eye } from 'lucide-react';
import { Card } from '../ui/Card';
import { StatusBadge } from '../ui/StatusBadge';
import { Button } from '../ui/Button';
import { RECENT_DETECTIONS } from '../../data/mockData';
import { SonarDetection } from '../../types/marine';
import { cn } from '../../utils/cn';

export interface RecentDetectionsProps {
  onViewAllDetections: () => void;
  onSelectDetection?: (detection: SonarDetection) => void;
  selectedDetectionId?: string | null;
  className?: string;
}

export const RecentDetections: React.FC<RecentDetectionsProps> = ({
  onViewAllDetections,
  onSelectDetection,
  selectedDetectionId,
  className,
}) => {
  return (
    <Card className={cn('flex flex-col h-full overflow-hidden bg-[#040813] border-marine-800', className)} cornerBrackets>
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-marine-800 shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-marine-850 border border-marine-750 text-cyan-400">
            <AlertOctagon size={14} />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white">
              RECENT DETECTIONS
            </h3>
            <div className="text-[10px] text-slate-400 font-mono">
              Live AI inference feed • Side-Scan Stream
            </div>
          </div>
        </div>

        <span className="text-[10px] font-mono font-bold text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/40">
          243 TOTAL
        </span>
      </div>

      {/* Detections List */}
      <div className="space-y-1.5 flex-1 overflow-y-auto pr-1">
        {RECENT_DETECTIONS.map((det) => {
          const isSelected = selectedDetectionId === det.id || (!selectedDetectionId && det.id === 'det-01');

          return (
            <div
              key={det.id}
              onClick={() => onSelectDetection?.(det)}
              className={cn(
                'p-2 rounded-md border transition-all cursor-pointer group flex items-center justify-between gap-2.5 select-none',
                isSelected
                  ? 'bg-cyan-950/40 border-cyan-500/60 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                  : 'bg-[#02050b]/90 border-marine-800 hover:border-cyan-500/40 hover:bg-[#071120]'
              )}
            >
              {/* Left: Sonar Thumbnail & Meta */}
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Sonar Thumbnail simulation */}
                <div className="w-10 h-10 rounded bg-[#03060c] border border-amber-500/30 flex items-center justify-center shrink-0 relative overflow-hidden shadow-inner">
                  {/* Acoustic gold noise pattern */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-amber-950/70 via-black to-amber-900/40" />
                  <div
                    className={cn(
                      'w-4 h-4 rounded-sm border relative z-10',
                      det.severity === 'high' && 'border-red-400 bg-red-500/40 shadow-[0_0_8px_rgba(239,68,68,0.7)]',
                      det.severity === 'anomaly' && 'border-purple-400 bg-purple-500/40 shadow-[0_0_8px_rgba(168,85,247,0.7)]',
                      det.severity === 'medium' && 'border-amber-400 bg-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.7)]',
                      det.severity === 'low' && 'border-emerald-400 bg-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.7)]'
                    )}
                  />
                  {/* Acoustic shadow vector */}
                  <div className="absolute right-0 top-1 bottom-1 w-2.5 bg-black/80 pointer-events-none" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 leading-tight">
                    <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                      {det.classification}
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400 font-semibold">
                      {(det.confidence * 100).toFixed(0)}%
                    </span>
                  </div>

                  <div className="text-[10px] font-mono text-slate-400 mt-0.5 flex flex-wrap items-center gap-1.5 leading-none">
                    <span>Lat: {det.latitude.toFixed(4)}</span>
                    <span>Lon: {det.longitude.toFixed(4)}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-300">{det.timeString}</span>
                  </div>
                </div>
              </div>

              {/* Right: Severity Badge */}
              <div className="flex items-center gap-1.5 shrink-0">
                <span
                  className={cn(
                    'text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase',
                    det.priority === 'HIGH' || det.severity === 'high'
                      ? 'bg-red-950/80 text-red-300 border-red-500/50 shadow-[0_0_6px_rgba(239,68,68,0.3)]'
                      : det.severity === 'anomaly'
                      ? 'bg-purple-950/80 text-purple-300 border-purple-500/50'
                      : det.priority === 'MEDIUM' || det.severity === 'medium'
                      ? 'bg-amber-950/80 text-amber-300 border-amber-500/50'
                      : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
                  )}
                >
                  {det.priority || (det.severity === 'anomaly' ? 'LOW' : det.severity.toUpperCase())}
                </span>
                <Eye size={13} className={cn('transition-colors', isSelected ? 'text-cyan-300' : 'text-slate-500 group-hover:text-cyan-300')} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer CTA */}
      <div className="pt-2 mt-2 border-t border-marine-800 shrink-0">
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-center text-xs font-semibold py-1.5"
          onClick={onViewAllDetections}
        >
          View All Detections ({RECENT_DETECTIONS.length} Active) <ArrowRight size={13} className="ml-1" />
        </Button>
      </div>
    </Card>
  );
};
