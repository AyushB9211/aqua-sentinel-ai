import React, { useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { Card } from '../ui/Card';
import { CONFIDENCE_DISTRIBUTION } from '../../data/mockData';
import { cn } from '../../utils/cn';

export interface ConfidenceDistributionChartProps {
  className?: string;
}

export const ConfidenceDistributionChart: React.FC<ConfidenceDistributionChartProps> = ({
  className,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const maxVal = Math.max(...CONFIDENCE_DISTRIBUTION.map((d) => d.count));
  const total = CONFIDENCE_DISTRIBUTION.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <Card className={cn('flex flex-col h-full overflow-hidden bg-[#040813] border-marine-800 p-3 sm:p-3.5', className)} cornerBrackets>
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-marine-800 shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-marine-850 border border-marine-750 text-cyan-400">
            <BarChart3 size={14} />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white">
              CONFIDENCE DISTRIBUTION
            </h3>
            <div className="text-[10px] text-slate-400 font-mono">
              AI Confidence Spread
            </div>
          </div>
        </div>

        <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-1.5 py-0.5 rounded">
          Avg: 89.3%
        </span>
      </div>

      {/* Bar Chart Canvas */}
      <div className="flex-1 flex flex-col justify-end pt-3 pb-1">
        {/* Bars Container */}
        <div className="h-32 sm:h-36 flex items-end justify-between gap-2 px-1 relative">
          {/* Subtle Grid reference lines */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-marine-800/60" />
          <div className="absolute inset-x-0 top-1/2 h-[1px] bg-marine-800/40" />

          {CONFIDENCE_DISTRIBUTION.map((item, idx) => {
            const heightPercent = Math.max(8, (item.count / maxVal) * 100);
            const isHovered = hoveredIdx === idx;
            const pctOfTotal = ((item.count / total) * 100).toFixed(1);

            return (
              <div
                key={item.range}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Count tooltip / value label above bar */}
                <div
                  className={cn(
                    'text-[10px] font-mono font-bold transition-all mb-1',
                    isHovered ? 'text-cyan-300 scale-110' : 'text-slate-400'
                  )}
                >
                  {item.count}
                </div>

                {/* Vertical Bar */}
                <div
                  className={cn(
                    'w-full max-w-[34px] rounded-t transition-all duration-200 relative overflow-hidden',
                    idx >= 3
                      ? 'bg-gradient-to-t from-cyan-600 to-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.4)]'
                      : 'bg-gradient-to-t from-marine-700 to-teal-500/80',
                    isHovered && 'brightness-125 shadow-[0_0_12px_rgba(6,182,212,0.8)] ring-1 ring-white/50'
                  )}
                  style={{ height: `${heightPercent}%` }}
                >
                  {/* Subtle top reflection cap */}
                  <div className="absolute top-0 inset-x-0 h-1 bg-white/40" />
                </div>

                {/* Range label below bar */}
                <span
                  className={cn(
                    'text-[9px] font-mono mt-2 transition-colors whitespace-nowrap',
                    isHovered ? 'text-cyan-300 font-bold' : 'text-slate-400'
                  )}
                >
                  {item.range}
                </span>

                {/* Hover Popover */}
                {isHovered && (
                  <div className="absolute -top-7 whitespace-nowrap bg-black/95 text-white font-mono text-[9px] px-1.5 py-0.5 rounded border border-cyan-500/40 shadow-xl z-30 pointer-events-none">
                    {item.count} targets ({pctOfTotal}%)
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Metrics */}
      <div className="pt-2 mt-2 border-t border-marine-800 shrink-0 flex items-center justify-between text-[9px] font-mono text-slate-400">
        <span>High-Confidence (&gt;80%): <strong className="text-white">128 (52.7%)</strong></span>
        <span>Low-Confidence (&lt;40%): <strong className="text-amber-400">15 (6.2%)</strong></span>
      </div>
    </Card>
  );
};
