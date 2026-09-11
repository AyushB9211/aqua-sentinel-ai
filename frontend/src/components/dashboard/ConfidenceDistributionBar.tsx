import React, { useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { Card } from '../ui/Card';
import { CONFIDENCE_DISTRIBUTION } from '../../data/mockData';
import { cn } from '../../utils/cn';

export interface ConfidenceDistributionBarProps {
  className?: string;
}

export const ConfidenceDistributionBar: React.FC<ConfidenceDistributionBarProps> = ({ className }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const maxCount = 140;

  return (
    <Card className={cn('flex flex-col h-full overflow-hidden bg-marine-900/90 border-marine-800', className)} cornerBrackets>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-marine-800 shrink-0 bg-marine-950/70">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-marine-850 border border-marine-750 text-cyan-400">
            <BarChart3 size={15} />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-tight">
              Confidence Distribution
            </h3>
            <div className="text-[10px] text-slate-400">
              YOLO-Sonar Model Score Range
            </div>
          </div>
        </div>

        <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
          89.3% AVG
        </span>
      </div>

      {/* Bar Chart Area */}
      <div className="p-3 flex-1 flex flex-col justify-end">
        {/* Bars Grid */}
        <div className="grid grid-cols-5 gap-2 items-end h-28 pt-2 pb-1 px-1 border-b border-marine-800">
          {CONFIDENCE_DISTRIBUTION.map((item, idx) => {
            const heightPercent = (item.count / maxCount) * 100;
            const isHovered = hoveredIdx === idx;

            return (
              <div
                key={item.range}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="flex flex-col items-center gap-1 h-full justify-end cursor-pointer group"
              >
                {/* Value on top of bar */}
                <span
                  className={cn(
                    'text-[10px] font-mono font-bold transition-opacity',
                    isHovered ? 'text-cyan-300 opacity-100' : 'text-slate-400 opacity-80'
                  )}
                >
                  {item.count}
                </span>

                {/* Bar Column */}
                <div className="w-full max-w-[28px] bg-marine-950 rounded-t overflow-hidden flex flex-col justify-end h-full">
                  <div
                    className={cn(
                      'w-full rounded-t transition-all duration-300',
                      idx >= 3
                        ? 'bg-gradient-to-t from-cyan-600 to-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.5)]'
                        : idx === 2
                        ? 'bg-gradient-to-t from-teal-600 to-teal-400'
                        : 'bg-gradient-to-t from-slate-700 to-slate-500',
                      isHovered && 'brightness-125'
                    )}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* X-axis Range Labels */}
        <div className="grid grid-cols-5 gap-2 text-center pt-1.5 text-[9px] font-mono text-slate-400 font-medium">
          {CONFIDENCE_DISTRIBUTION.map((item, idx) => (
            <span
              key={item.range}
              className={cn(
                'truncate',
                hoveredIdx === idx ? 'text-cyan-300 font-bold' : 'text-slate-400'
              )}
            >
              {item.range}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
};
