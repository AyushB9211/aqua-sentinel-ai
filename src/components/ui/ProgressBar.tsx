import React from 'react';
import { cn } from '../../utils/cn';

export interface ProgressBarProps {
  value: number; // 0 - 100
  max?: number;
  label?: string;
  sublabel?: string;
  showValue?: boolean;
  valueSuffix?: string;
  variant?: 'cyan' | 'teal' | 'emerald' | 'amber' | 'red' | 'purple';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isPulsing?: boolean;
  striped?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  sublabel,
  showValue = true,
  valueSuffix = '%',
  variant = 'cyan',
  size = 'md',
  isPulsing = false,
  striped = false,
  className,
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const sizeStyles = {
    xs: 'h-1 rounded-full',
    sm: 'h-1.5 rounded-full',
    md: 'h-2.5 rounded-md',
    lg: 'h-4 rounded-md',
  };

  const variantStyles = {
    cyan: 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]',
    teal: 'bg-teal-400 shadow-[0_0_10px_rgba(20,184,166,0.5)]',
    emerald: 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]',
    amber: 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]',
    red: 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]',
    purple: 'bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]',
  };

  return (
    <div className={cn('w-full', className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
          <div className="flex items-center gap-2">
            {label && <span className="text-slate-300 uppercase tracking-wider">{label}</span>}
            {sublabel && <span className="text-slate-500 text-[11px] font-normal">{sublabel}</span>}
          </div>
          {showValue && (
            <span className="font-mono text-cyan-300 font-semibold">
              {percentage.toFixed(0)}
              {valueSuffix}
            </span>
          )}
        </div>
      )}

      {/* Progress Track */}
      <div className={cn('w-full bg-marine-950 border border-marine-800 overflow-hidden relative', sizeStyles[size])}>
        <div
          className={cn(
            'h-full transition-all duration-300 ease-out relative',
            variantStyles[variant],
            isPulsing && 'animate-pulse'
          )}
          style={{ width: `${percentage}%` }}
        >
          {striped && (
            <div
              className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] animate-[progress_1s_linear_infinite]"
            />
          )}
        </div>
      </div>
    </div>
  );
};
