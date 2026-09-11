import React, { useState, useRef, useCallback } from 'react';
import { BarChart3 } from 'lucide-react';
import { Card } from '../ui/Card';
import { DETECTION_ACTIVITY_24H } from '../../data/mockData';
import { cn } from '../../utils/cn';

export interface DetectionActivityChartProps {
  className?: string;
}

export const DetectionActivityChart: React.FC<DetectionActivityChartProps> = ({ className }) => {
  const [activeFilter, setActiveFilter] = useState<'24h' | '12h'>('24h');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const data = activeFilter === '12h'
    ? DETECTION_ACTIVITY_24H.slice(3)
    : DETECTION_ACTIVITY_24H;

  // Chart Coordinate Space
  const svgWidth = 600;
  const svgHeight = 220;
  const padding = { top: 20, right: 24, bottom: 32, left: 36 };
  const graphWidth = svgWidth - padding.left - padding.right;
  const graphHeight = svgHeight - padding.top - padding.bottom;
  const maxY = 100;

  // Coordinates calculation
  const pointsDebris = data.map((d, index) => {
    const x = padding.left + (index / (data.length - 1)) * graphWidth;
    const y = padding.top + graphHeight - (d.debris / maxY) * graphHeight;
    return { x, y, val: d.debris };
  });

  const pointsAnomalies = data.map((d, index) => {
    const x = padding.left + (index / (data.length - 1)) * graphWidth;
    const y = padding.top + graphHeight - (d.anomalies / maxY) * graphHeight;
    return { x, y, val: d.anomalies };
  });

  const pointsHigh = data.map((d, index) => {
    const x = padding.left + (index / (data.length - 1)) * graphWidth;
    const y = padding.top + graphHeight - (d.highSeverity / maxY) * graphHeight;
    return { x, y, val: d.highSeverity };
  });

  const makeSmoothPath = (pts: { x: number; y: number }[]) => {
    return pts.reduce((acc, curr, idx) => {
      if (idx === 0) return `M ${curr.x} ${curr.y}`;
      const prev = pts[idx - 1];
      const cp1x = prev.x + (curr.x - prev.x) / 2;
      const cp1y = prev.y;
      const cp2x = prev.x + (curr.x - prev.x) / 2;
      const cp2y = curr.y;
      return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
    }, '');
  };

  const pathDebris = makeSmoothPath(pointsDebris);
  const pathAnomalies = makeSmoothPath(pointsAnomalies);
  const pathHigh = makeSmoothPath(pointsHigh);
  const areaDebris = `${pathDebris} L ${pointsDebris[pointsDebris.length - 1].x} ${padding.top + graphHeight} L ${pointsDebris[0].x} ${padding.top + graphHeight} Z`;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.width <= 0) return;

      const mouseX = e.clientX - rect.left;
      const padLeftRatio = padding.left / svgWidth;
      const padRightRatio = padding.right / svgWidth;
      const innerRatio = 1 - padLeftRatio - padRightRatio;

      const rawFraction = (mouseX / rect.width - padLeftRatio) / innerRatio;
      const clampedFraction = Math.max(0, Math.min(1, rawFraction));
      const closestIndex = Math.round(clampedFraction * (data.length - 1));

      setActiveIndex(closestIndex);
    },
    [data.length, padding.left, padding.right, svgWidth]
  );

  const handleMouseLeave = useCallback(() => {
    setActiveIndex(null);
  }, []);

  const activePoint = activeIndex !== null ? data[activeIndex] : null;
  const activeX = activeIndex !== null ? pointsDebris[activeIndex].x : null;

  return (
    <Card className={cn('flex flex-col h-full overflow-hidden select-none', className)} cornerBrackets>
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-2 border-b border-marine-800 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-md bg-marine-850 border border-marine-750 text-cyan-400">
            <BarChart3 size={16} />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-white">
              Detection Activity
            </h3>
            <div className="text-xs text-slate-400">
              Detection trends across the current mission
            </div>
          </div>
        </div>

        {/* Legend & Filter Controls */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          {/* Series Legend */}
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-1 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.8)]" />
              <span className="text-slate-300 font-medium">Debris</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-1 rounded-full bg-purple-400 shadow-[0_0_6px_rgba(168,85,247,0.8)]" />
              <span className="text-slate-300 font-medium">Anomalies</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-1 rounded-full bg-red-400 shadow-[0_0_6px_rgba(239,68,68,0.8)]" />
              <span className="text-slate-300 font-medium">High Severity</span>
            </div>
          </div>

          {/* Time Filter Toggle */}
          <div className="flex items-center rounded-md bg-marine-950 border border-marine-750 p-0.5 text-xs">
            <button
              onClick={() => {
                setActiveFilter('24h');
                setActiveIndex(null);
              }}
              className={cn(
                'px-2.5 py-0.5 rounded text-xs font-medium transition-colors',
                activeFilter === '24h'
                  ? 'bg-cyan-950 text-cyan-300 font-semibold border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              )}
            >
              24 Hours
            </button>
            <button
              onClick={() => {
                setActiveFilter('12h');
                setActiveIndex(null);
              }}
              className={cn(
                'px-2.5 py-0.5 rounded text-xs font-medium transition-colors',
                activeFilter === '12h'
                  ? 'bg-cyan-950 text-cyan-300 font-semibold border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              )}
            >
              12 Hours
            </button>
          </div>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full h-52 sm:h-56 md:h-60 overflow-hidden flex-1 cursor-crosshair"
      >
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full block"
          preserveAspectRatio="none"
        >
          {/* Gradient definitions */}
          <defs>
            <linearGradient id="debrisAreaGradRefined" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines & Y-axis labels */}
          {[0, 25, 50, 75, 100].map((val) => {
            const y = padding.top + graphHeight - (val / maxY) * graphHeight;
            return (
              <g key={val}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={svgWidth - padding.right}
                  y2={y}
                  stroke="rgba(56, 189, 248, 0.08)"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <text
                  x={padding.left - 8}
                  y={y + 3.5}
                  fill="#94a3b8"
                  fontSize="10"
                  fontFamily="Inter, sans-serif"
                  fontWeight="500"
                  textAnchor="end"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* X-axis labels */}
          {data.map((d, idx) => {
            const x = padding.left + (idx / (data.length - 1)) * graphWidth;
            const isSelected = activeIndex === idx;
            return (
              <text
                key={d.hour}
                x={x}
                y={svgHeight - 10}
                fill={isSelected ? '#00e5ff' : '#94a3b8'}
                fontWeight={isSelected ? '600' : '400'}
                fontSize="10"
                fontFamily="Inter, sans-serif"
                textAnchor="middle"
              >
                {d.hour}
              </text>
            );
          })}

          {/* Area Fill */}
          <path d={areaDebris} fill="url(#debrisAreaGradRefined)" />

          {/* Series Lines */}
          {/* 1. Debris (Cyan) */}
          <path
            d={pathDebris}
            fill="none"
            stroke="#06b6d4"
            strokeWidth="2.5"
            className="filter drop-shadow-[0_0_6px_rgba(6,182,212,0.6)]"
          />

          {/* 2. Anomalies (Purple) */}
          <path
            d={pathAnomalies}
            fill="none"
            stroke="#a855f7"
            strokeWidth="2"
            strokeDasharray="4 2"
            className="filter drop-shadow-[0_0_6px_rgba(168,85,247,0.6)]"
          />

          {/* 3. High Severity (Red) */}
          <path
            d={pathHigh}
            fill="none"
            stroke="#ef4444"
            strokeWidth="2"
            className="filter drop-shadow-[0_0_6px_rgba(239,68,68,0.6)]"
          />

          {/* Active Vertical Crosshair & Highlighted Points */}
          {activeIndex !== null && activeX !== null && (
            <g pointerEvents="none">
              {/* Vertical Scanning Line */}
              <line
                x1={activeX}
                y1={padding.top}
                x2={activeX}
                y2={padding.top + graphHeight}
                stroke="rgba(0, 229, 255, 0.6)"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />

              {/* High Severity Point */}
              <circle
                cx={activeX}
                cy={pointsHigh[activeIndex].y}
                r="4.5"
                fill="#070d18"
                stroke="#ef4444"
                strokeWidth="2"
              />

              {/* Anomalies Point */}
              <circle
                cx={activeX}
                cy={pointsAnomalies[activeIndex].y}
                r="4.5"
                fill="#070d18"
                stroke="#a855f7"
                strokeWidth="2"
              />

              {/* Debris Point */}
              <circle
                cx={activeX}
                cy={pointsDebris[activeIndex].y}
                r="5"
                fill="#00e5ff"
                stroke="#070d18"
                strokeWidth="2"
                className="filter drop-shadow-[0_0_8px_rgba(0,229,255,1)]"
              />
            </g>
          )}
        </svg>

        {/* Clean, Readable Custom Tooltip */}
        {activePoint && activeIndex !== null && (
          <div
            className={cn(
              'absolute top-2 z-30 p-3 rounded-lg bg-[#071326]/95 border border-cyan-500/50 shadow-2xl shadow-black/90 pointer-events-none text-xs font-sans backdrop-blur-md transition-all duration-75',
              activeIndex > data.length / 2 ? 'right-auto' : 'left-auto'
            )}
            style={{
              left:
                activeIndex > data.length / 2
                  ? `${Math.max(8, ((pointsDebris[activeIndex].x - 170) / svgWidth) * 100)}%`
                  : `${Math.min(72, ((pointsDebris[activeIndex].x + 15) / svgWidth) * 100)}%`,
            }}
          >
            <div className="text-xs text-slate-300 font-semibold border-b border-marine-800 pb-1.5 mb-2 flex items-center justify-between gap-4">
              <span>Time: {activePoint.hour}</span>
              <span className="text-cyan-400 font-medium">MS-0048</span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" /> Debris
                </span>
                <span className="text-white font-bold">{activePoint.debris}</span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-purple-400" /> Anomalies
                </span>
                <span className="text-purple-300 font-bold">{activePoint.anomalies}</span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-red-400" /> High Severity
                </span>
                <span className="text-red-400 font-bold">{activePoint.highSeverity}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
