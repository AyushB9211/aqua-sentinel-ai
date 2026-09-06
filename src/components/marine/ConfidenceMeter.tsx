import React from 'react';
import { Cpu } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface ConfidenceMeterProps {
  confidence: number; // 0.00 to 1.00 or 0 to 100
  modelName?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({
  confidence,
  modelName = 'YOLO-Sonar v4.2',
  showLabel = true,
  size = 'md',
  className,
}) => {
  const score = confidence <= 1 ? confidence * 100 : confidence;

  const getColor = (val: number) => {
    if (val >= 90) return { bar: 'bg-emerald-400', text: 'text-emerald-300', glow: 'shadow-[0_0_8px_rgba(16,185,129,0.4)]' };
    if (val >= 75) return { bar: 'bg-cyan-400', text: 'text-cyan-300', glow: 'shadow-[0_0_8px_rgba(6,182,212,0.4)]' };
    if (val >= 50) return { bar: 'bg-amber-400', text: 'text-amber-300', glow: 'shadow-[0_0_8px_rgba(245,158,11,0.4)]' };
    return { bar: 'bg-red-400', text: 'text-red-300', glow: 'shadow-[0_0_8px_rgba(239,68,68,0.4)]' };
  };

  const theme = getColor(score);

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs mb-1 font-mono">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
            <Cpu size={12} className="text-cyan-400" />
            <span className="truncate">{modelName}</span>
          </div>
          <div className={cn('font-semibold font-mono', theme.text)}>
            {score.toFixed(1)}% <span className="text-[10px] text-slate-500 font-normal">CONF</span>
          </div>
        </div>
      )}

      <div className={cn('w-full bg-marine-950 rounded-sm border border-marine-800 p-0.5 flex gap-0.5', size === 'sm' ? 'h-2' : 'h-3')}>
        {Array.from({ length: 10 }).map((_, idx) => {
          const threshold = (idx + 1) * 10;
          const isFilled = score >= threshold - 5;

          return (
            <div
              key={idx}
              className={cn(
                'flex-1 rounded-[1px] transition-all duration-200',
                isFilled ? cn(theme.bar, theme.glow) : 'bg-marine-850/60'
              )}
            />
          );
        })}
      </div>
    </div>
  );
};
