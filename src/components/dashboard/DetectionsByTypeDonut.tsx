import React, { useState } from 'react';
import { PieChart } from 'lucide-react';
import { Card } from '../ui/Card';
import { DEBRIS_TYPE_STATS } from '../../data/mockData';
import { DebrisTypeStat } from '../../types/marine';
import { cn } from '../../utils/cn';

export interface DetectionsByTypeDonutProps {
  className?: string;
}

export const DetectionsByTypeDonut: React.FC<DetectionsByTypeDonutProps> = ({ className }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const totalDetections = 243;
  const radius = 38;
  const circumference = 2 * Math.PI * radius;

  // Compute strokeDashoffset for each segment
  let accumulatedPercent = 0;
  const segments = DEBRIS_TYPE_STATS.map((stat: DebrisTypeStat, idx: number) => {
    const strokeDasharray = `${(stat.percentage / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
    accumulatedPercent += stat.percentage;

    return {
      ...stat,
      strokeDasharray,
      strokeDashoffset,
      index: idx,
    };
  });

  return (
    <Card className={cn('flex flex-col h-full overflow-hidden bg-marine-900/90 border-marine-800', className)} cornerBrackets>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-marine-800 shrink-0 bg-marine-950/70">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-marine-850 border border-marine-750 text-cyan-400">
            <PieChart size={15} />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-tight font-mono">
              Detections by Type
            </h3>
            <div className="text-[10px] text-slate-400">
              Categorical AI Classification
            </div>
          </div>
        </div>

        <span className="text-[11px] font-mono font-bold text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
          243 TOTAL
        </span>
      </div>

      {/* Donut & Legend Container */}
      <div className="p-3 flex-1 flex flex-col sm:flex-row items-center justify-center gap-4">
        {/* SVG Donut Graphic */}
        <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 transform">
            {/* Background ring */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="#081426"
              strokeWidth="12"
            />

            {/* Colored Segment Rings */}
            {segments.map((seg) => (
              <circle
                key={seg.category}
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke={seg.color}
                strokeWidth={hoveredIdx === seg.index ? '14' : '11'}
                strokeDasharray={seg.strokeDasharray}
                strokeDashoffset={seg.strokeDashoffset}
                className="transition-all duration-200 cursor-pointer"
                onMouseEnter={() => setHoveredIdx(seg.index)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            ))}
          </svg>

          {/* Center Value */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-base sm:text-lg font-extrabold text-white font-mono leading-none">
              {hoveredIdx !== null ? DEBRIS_TYPE_STATS[hoveredIdx].count : totalDetections}
            </span>
            <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
              {hoveredIdx !== null ? DEBRIS_TYPE_STATS[hoveredIdx].category : 'Total'}
            </span>
          </div>
        </div>

        {/* Compact Legend Grid */}
        <div className="grid grid-cols-2 gap-x-2.5 gap-y-1 w-full text-[10px] font-mono">
          {DEBRIS_TYPE_STATS.map((stat: DebrisTypeStat, idx: number) => (
            <div
              key={stat.category}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className={cn(
                'flex items-center justify-between gap-1 p-1 rounded transition-colors cursor-pointer',
                hoveredIdx === idx ? 'bg-marine-800' : 'hover:bg-marine-950/60'
              )}
            >
              <div className="flex items-center gap-1.5 truncate">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: stat.color }} />
                <span className="text-slate-300 truncate font-sans text-[11px] font-medium">
                  {stat.category}
                </span>
              </div>
              <span className="text-white font-bold shrink-0">{stat.count}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
