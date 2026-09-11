import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, HelpCircle, Cpu, Radio } from 'lucide-react';
import { SeverityLevel } from '../../types/marine';
import { cn } from '../../utils/cn';

export interface StatusBadgeProps {
  status: SeverityLevel | 'active' | 'standby' | 'processing';
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  pulse?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  size = 'md',
  showIcon = true,
  pulse = false,
  className,
}) => {
  const configs: Record<
    StatusBadgeProps['status'],
    {
      bg: string;
      border: string;
      text: string;
      dot: string;
      defaultLabel: string;
      icon: React.ElementType;
    }
  > = {
    low: {
      bg: 'bg-emerald-950/70',
      border: 'border-emerald-500/40',
      text: 'text-emerald-300',
      dot: 'bg-emerald-400',
      defaultLabel: 'Low Severity',
      icon: CheckCircle2,
    },
    medium: {
      bg: 'bg-amber-950/70',
      border: 'border-amber-500/40',
      text: 'text-amber-300',
      dot: 'bg-amber-400',
      defaultLabel: 'Medium Severity',
      icon: AlertTriangle,
    },
    high: {
      bg: 'bg-red-950/70',
      border: 'border-red-500/40',
      text: 'text-red-300',
      dot: 'bg-red-400',
      defaultLabel: 'High Severity',
      icon: AlertCircle,
    },
    anomaly: {
      bg: 'bg-purple-950/70',
      border: 'border-purple-500/40',
      text: 'text-purple-300',
      dot: 'bg-purple-400',
      defaultLabel: 'Unknown Anomaly',
      icon: HelpCircle,
    },
    ai: {
      bg: 'bg-cyan-950/70',
      border: 'border-cyan-500/40',
      text: 'text-cyan-300',
      dot: 'bg-cyan-400',
      defaultLabel: 'AI Processing',
      icon: Cpu,
    },
    active: {
      bg: 'bg-emerald-950/70',
      border: 'border-emerald-500/40',
      text: 'text-emerald-300',
      dot: 'bg-emerald-400',
      defaultLabel: 'Mission Active',
      icon: Radio,
    },
    standby: {
      bg: 'bg-slate-900/70',
      border: 'border-slate-700/50',
      text: 'text-slate-300',
      dot: 'bg-slate-500',
      defaultLabel: 'Standby',
      icon: Radio,
    },
    processing: {
      bg: 'bg-cyan-950/70',
      border: 'border-cyan-500/40',
      text: 'text-cyan-300',
      dot: 'bg-cyan-400',
      defaultLabel: 'Processing',
      icon: Cpu,
    },
  };

  const config = configs[status] || configs.low;
  const Icon = config.icon;

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-0.5 gap-1.5',
    lg: 'text-sm px-3 py-1 gap-2',
  };

  const iconSizes = {
    sm: 12,
    md: 13,
    lg: 15,
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-semibold rounded-full border shadow-sm select-none',
        config.bg,
        config.border,
        config.text,
        sizeStyles[size],
        className
      )}
    >
      {showIcon ? (
        <Icon size={iconSizes[size]} className={cn('shrink-0', pulse && 'animate-pulse')} />
      ) : (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full shrink-0',
            config.dot,
            pulse && 'animate-ping'
          )}
        />
      )}
      <span>{label || config.defaultLabel}</span>
    </span>
  );
};
