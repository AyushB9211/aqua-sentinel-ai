import React from 'react';
import { HelpCircle, AlertOctagon } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface AnomalyIndicatorProps {
  score: number; // 0.00 to 1.00
  title?: string;
  shadowLengthMeters?: number;
  className?: string;
}

export const AnomalyIndicator: React.FC<AnomalyIndicatorProps> = ({
  score,
  title = 'Unclassified Acoustic Anomaly',
  shadowLengthMeters,
  className,
}) => {
  const percentage = (score <= 1 ? score * 100 : score).toFixed(1);

  return (
    <div
      className={cn(
        'p-3 rounded-md bg-purple-950/40 border border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.15)] flex items-start gap-3 backdrop-blur-md',
        className
      )}
    >
      <div className="p-2 rounded bg-purple-900/60 border border-purple-500/40 text-purple-300 shrink-0 mt-0.5 animate-pulse">
        <HelpCircle size={16} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-xs font-semibold text-purple-200 uppercase tracking-wider truncate">
            {title}
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 bg-purple-900/80 border border-purple-400 text-purple-200 rounded font-bold">
            {percentage}% ANOMALY
          </span>
        </div>

        <p className="text-[11px] text-purple-300/80 leading-tight mb-2">
          Geometric acoustic return deviates from standard seafloor signature database.
        </p>

        {shadowLengthMeters && (
          <div className="flex items-center gap-2 text-[10px] font-mono text-purple-300">
            <AlertOctagon size={12} className="text-purple-400" />
            <span>Acoustic Shadow: {shadowLengthMeters.toFixed(1)}m</span>
          </div>
        )}
      </div>
    </div>
  );
};
