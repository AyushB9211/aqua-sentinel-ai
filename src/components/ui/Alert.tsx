import React, { useState } from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, HelpCircle, Cpu, X } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'danger' | 'anomaly' | 'ai';
  title?: string;
  children: React.ReactNode;
  icon?: React.ElementType;
  dismissible?: boolean;
  onDismiss?: () => void;
  action?: React.ReactNode;
  tag?: string;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  icon: CustomIcon,
  dismissible = false,
  onDismiss,
  action,
  tag,
  className,
}) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const configs = {
    info: {
      bg: 'bg-marine-900/90',
      border: 'border-cyan-500/30',
      text: 'text-cyan-200',
      iconColor: 'text-cyan-400',
      icon: Info,
    },
    success: {
      bg: 'bg-emerald-950/40',
      border: 'border-emerald-500/35',
      text: 'text-emerald-200',
      iconColor: 'text-emerald-400',
      icon: CheckCircle2,
    },
    warning: {
      bg: 'bg-amber-950/40',
      border: 'border-amber-500/35',
      text: 'text-amber-200',
      iconColor: 'text-amber-400',
      icon: AlertTriangle,
    },
    danger: {
      bg: 'bg-red-950/40',
      border: 'border-red-500/40',
      text: 'text-red-200',
      iconColor: 'text-red-400',
      icon: AlertCircle,
    },
    anomaly: {
      bg: 'bg-purple-950/40',
      border: 'border-purple-500/40',
      text: 'text-purple-200',
      iconColor: 'text-purple-400',
      icon: HelpCircle,
    },
    ai: {
      bg: 'bg-cyan-950/40',
      border: 'border-cyan-500/40',
      text: 'text-cyan-200',
      iconColor: 'text-cyan-400',
      icon: Cpu,
    },
  };

  const config = configs[variant];
  const Icon = CustomIcon || config.icon;

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  return (
    <div
      role="alert"
      className={cn(
        'relative rounded-md border p-3.5 sm:p-4 backdrop-blur-md transition-all duration-200 flex items-start gap-3.5',
        config.bg,
        config.border,
        className
      )}
    >
      <div className={cn('p-1 rounded bg-marine-950/60 border border-white/5 shrink-0 mt-0.5', config.iconColor)}>
        <Icon size={16} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          {title && (
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              {title}
            </h4>
          )}
          {tag && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 bg-marine-950/80 border border-white/10 rounded text-slate-300">
              {tag}
            </span>
          )}
        </div>
        <div className={cn('text-xs leading-relaxed', config.text)}>{children}</div>
        {action && <div className="mt-2.5 flex items-center gap-2">{action}</div>}
      </div>

      {dismissible && (
        <button
          onClick={handleDismiss}
          className="text-slate-400 hover:text-white p-1 rounded hover:bg-marine-800 transition-colors shrink-0"
          aria-label="Dismiss alert"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};
