import React from 'react';
import { Activity, Cpu, AlertTriangle, CheckCircle2, Radar, Compass } from 'lucide-react';
import { Card } from '../ui/Card';
import { SYSTEM_ACTIVITIES } from '../../data/mockData';
import { SonarSweepOverlay } from '../marine/SonarSweepOverlay';
import { cn } from '../../utils/cn';

export interface SystemActivityFeedProps {
  className?: string;
}

export const SystemActivityFeed: React.FC<SystemActivityFeedProps> = ({ className }) => {
  const getEventIcon = (type: string, severity?: string) => {
    switch (type) {
      case 'detection':
        return severity === 'high' ? (
          <AlertTriangle size={14} className="text-red-400" />
        ) : (
          <Activity size={14} className="text-amber-400" />
        );
      case 'model':
        return <Cpu size={14} className="text-cyan-400" />;
      case 'calibration':
        return <CheckCircle2 size={14} className="text-emerald-400" />;
      case 'coverage':
        return <Compass size={14} className="text-teal-400" />;
      default:
        return <Activity size={14} className="text-slate-400" />;
    }
  };

  return (
    <Card className={cn('flex flex-col h-full overflow-hidden', className)} cornerBrackets>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-marine-800 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-md bg-marine-850 border border-marine-750 text-cyan-400">
            <Activity size={16} />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-white">
              System Activity
            </h3>
            <div className="text-xs text-slate-400">
              Live hydrographic event telemetry
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-marine-850 border border-marine-750 text-xs text-cyan-300 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span>Synced</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 flex-1 items-center overflow-hidden">
        {/* Left: Timeline Feed (8 cols) */}
        <div className="md:col-span-8 space-y-2.5 max-h-[210px] overflow-y-auto pr-1">
          {SYSTEM_ACTIVITIES.map((act) => (
            <div
              key={act.id}
              className="flex items-start gap-3 p-2.5 rounded-lg bg-marine-950/70 border border-marine-800/80 hover:border-cyan-500/30 transition-colors"
            >
              <div className="p-1.5 rounded-md bg-marine-900 border border-white/5 shrink-0 mt-0.5">
                {getEventIcon(act.type, act.severity)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs sm:text-sm font-semibold text-white truncate">
                    {act.title}
                  </span>
                  <span className="text-xs font-semibold text-cyan-400 shrink-0">
                    {act.timeString}
                  </span>
                </div>
                {act.description && (
                  <p className="text-xs text-slate-300 truncate mt-0.5">
                    {act.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Right: Small Animated Radar HUD Widget (4 cols) */}
        <div className="md:col-span-4 flex flex-col items-center justify-center p-3 rounded-lg bg-marine-950/80 border border-marine-800">
          <div className="text-xs text-cyan-400 font-semibold mb-1 flex items-center gap-1.5">
            <Radar size={13} className="animate-spin" /> Transducer Radar
          </div>
          <div className="w-28 h-28 sm:w-32 sm:h-32">
            <SonarSweepOverlay showRangeRings={true} showGrid={false} />
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            450/900 kHz Synchronized
          </div>
        </div>
      </div>
    </Card>
  );
};
