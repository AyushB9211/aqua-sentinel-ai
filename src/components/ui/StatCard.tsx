import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  change?: {
    value: string | number;
    trend: 'up' | 'down' | 'neutral';
    label?: string;
  };
  icon?: LucideIcon;
  variant?: 'cyan' | 'teal' | 'emerald' | 'amber' | 'red' | 'purple' | 'default';
  telemetryTag?: string;
  subtext?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  unit,
  change,
  icon: Icon,
  variant = 'cyan',
  telemetryTag,
  subtext,
  className,
}) => {
  const variantBorderStyles = {
    default: 'border-marine-750 hover:border-marine-600',
    cyan: 'border-marine-750 hover:border-cyan-500/50',
    teal: 'border-marine-750 hover:border-teal-500/50',
    emerald: 'border-marine-750 hover:border-emerald-500/50',
    amber: 'border-marine-750 hover:border-amber-500/50',
    red: 'border-marine-750 hover:border-red-500/50',
    purple: 'border-marine-750 hover:border-purple-500/50',
  };

  const iconColorStyles = {
    default: 'text-slate-400 bg-marine-800 border-marine-700',
    cyan: 'text-cyan-400 bg-cyan-950/60 border-cyan-500/30',
    teal: 'text-teal-400 bg-teal-950/60 border-teal-500/30',
    emerald: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30',
    amber: 'text-amber-400 bg-amber-950/60 border-amber-500/30',
    red: 'text-red-400 bg-red-950/60 border-red-500/30',
    purple: 'text-purple-400 bg-purple-950/60 border-purple-500/30',
  };

  return (
    <div
      className={cn(
        'relative bg-marine-900/80 backdrop-blur-md rounded-md p-4 sm:p-5 border transition-all duration-200 corner-brackets group',
        variantBorderStyles[variant],
        className
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400 truncate">
              {label}
            </span>
            {telemetryTag && (
              <span className="text-[10px] px-1.5 py-0.5 bg-marine-800 text-cyan-400 border border-marine-700 rounded font-mono">
                {telemetryTag}
              </span>
            )}
          </div>
        </div>
        {Icon && (
          <div
            className={cn(
              'p-2 rounded-md border shrink-0 transition-transform duration-200 group-hover:scale-105',
              iconColorStyles[variant]
            )}
          >
            <Icon size={18} />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-1.5 mb-1.5">
        <span className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-white">
          {value}
        </span>
        {unit && (
          <span className="text-xs sm:text-sm font-medium text-slate-400 font-mono">
            {unit}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between text-xs pt-1 border-t border-marine-800/60">
        {change ? (
          <div className="flex items-center gap-1">
            {change.trend === 'up' && (
              <span className="flex items-center text-emerald-400 font-mono text-[11px] font-medium">
                <TrendingUp size={13} className="mr-0.5" />
                {change.value}
              </span>
            )}
            {change.trend === 'down' && (
              <span className="flex items-center text-amber-400 font-mono text-[11px] font-medium">
                <TrendingDown size={13} className="mr-0.5" />
                {change.value}
              </span>
            )}
            {change.trend === 'neutral' && (
              <span className="flex items-center text-slate-400 font-mono text-[11px]">
                <Minus size={13} className="mr-0.5" />
                {change.value}
              </span>
            )}
            {change.label && (
              <span className="text-slate-400 text-[11px] ml-1">{change.label}</span>
            )}
          </div>
        ) : subtext ? (
          <span className="text-slate-400 text-[11px] truncate">{subtext}</span>
        ) : (
          <span className="text-slate-500 text-[10px] font-mono">TELEMETRY SYNCED</span>
        )}

        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/40 shrink-0" />
      </div>
    </div>
  );
};
