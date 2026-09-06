import React from 'react';
import { AlertOctagon, ArrowRight, Eye, ShieldAlert, Layers } from 'lucide-react';
import { Card } from '../ui/Card';
import { RECENT_DETECTIONS } from '../../data/mockData';
import { SonarDetection } from '../../types/marine';
import { cn } from '../../utils/cn';

export interface RecentDetectionsFeedProps {
  selectedDetectionId?: string;
  onSelectDetection?: (detection: SonarDetection) => void;
  onViewAllDetections?: () => void;
  className?: string;
}

export const RecentDetectionsFeed: React.FC<RecentDetectionsFeedProps> = ({
  selectedDetectionId = 'det-shipwreck',
  onSelectDetection,
  onViewAllDetections,
  className,
}) => {
  const getBadgeStyle = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-950/80 text-red-300 border-red-500/50';
      case 'MEDIUM':
        return 'bg-amber-950/80 text-amber-300 border-amber-500/50';
      case 'LOW':
      case 'ANOMALY':
      default:
        return 'bg-purple-950/80 text-purple-300 border-purple-500/50';
    }
  };

  const getThumbnailColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'border-red-400 bg-red-500/30';
      case 'MEDIUM':
        return 'border-amber-400 bg-amber-500/30';
      case 'LOW':
      case 'ANOMALY':
      default:
        return 'border-purple-400 bg-purple-500/30';
    }
  };

  return (
    <Card className={cn('flex flex-col h-full overflow-hidden bg-marine-900/90 border-marine-800', className)} cornerBrackets>
      {/* Header */}
      <div className="flex items-center justify-between p-3 sm:px-4 border-b border-marine-800 shrink-0 bg-marine-950/70">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-marine-850 border border-marine-750 text-red-400">
            <AlertOctagon size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-tight">
              Recent Detections
            </h3>
            <div className="text-[11px] text-slate-400">
              Live AI inference stream • 5 unverified
            </div>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-red-300 bg-red-950/80 px-2.5 py-0.5 rounded-full border border-red-500/40">
          27 High Priority
        </span>
      </div>

      {/* Dense Detections List */}
      <div className="space-y-2 p-3 flex-1 overflow-y-auto max-h-[380px] pr-1">
        {RECENT_DETECTIONS.map((det) => {
          const isSelected = selectedDetectionId === det.id;

          return (
            <div
              key={det.id}
              onClick={() => onSelectDetection?.(det)}
              className={cn(
                'p-2.5 rounded-lg border transition-all cursor-pointer group flex items-center justify-between gap-3',
                isSelected
                  ? 'bg-[#0f1f3d] border-cyan-500/70 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                  : 'bg-marine-950/60 border-marine-800/80 hover:border-cyan-500/40 hover:bg-marine-900/80'
              )}
            >
              {/* Left: Sonar Thumbnail & Meta */}
              <div className="flex items-center gap-3 min-w-0">
                {/* Acoustic Vector Thumbnail */}
                <div className="w-9 h-9 rounded-md bg-[#040810] border border-marine-750 flex items-center justify-center shrink-0 relative overflow-hidden">
                  <div className="absolute inset-0 sonar-grid-bg opacity-30" />
                  <div className={cn('w-3.5 h-3.5 rounded-sm border', getThumbnailColor(det.priority))} />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                      {det.classification}
                    </span>
                    <span className="text-[11px] font-mono text-cyan-300 font-semibold">
                      {(det.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 mt-0.5">
                    <span>{det.latitude.toFixed(4)}°N, {det.longitude.toFixed(4)}°E</span>
                    <span>•</span>
                    <span>{det.timeString}</span>
                  </div>
                </div>
              </div>

              {/* Right: Priority Pill */}
              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={cn(
                    'text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase',
                    getBadgeStyle(det.priority)
                  )}
                >
                  {det.priority}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer CTA */}
      <div className="p-3 border-t border-marine-800 shrink-0 bg-marine-950/50">
        <button
          onClick={onViewAllDetections}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-md bg-marine-900 border border-marine-750 hover:border-cyan-500/50 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
        >
          <span>VIEW ALL 243 DETECTIONS</span>
          <ArrowRight size={13} className="text-cyan-400" />
        </button>
      </div>
    </Card>
  );
};
