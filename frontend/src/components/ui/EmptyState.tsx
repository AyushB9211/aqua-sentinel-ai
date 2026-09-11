import React from 'react';
import { Radar, LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Button } from './Button';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
  actionNode?: React.ReactNode;
  variant?: 'radar' | 'minimal' | 'anomaly';
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Acoustic Targets Detected',
  description = 'The side-scan sonar waterfall and anomaly classifier have not recorded any matching targets in this swath segment.',
  icon: Icon = Radar,
  actionLabel,
  onAction,
  actionNode,
  variant = 'radar',
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-md border border-marine-800/80 bg-marine-950/40 relative overflow-hidden',
        className
      )}
    >
      {/* Background subtle radar circles */}
      {variant === 'radar' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="w-48 h-48 rounded-full border border-cyan-500/30 animate-pulse-slow" />
          <div className="absolute w-32 h-32 rounded-full border border-cyan-500/20" />
          <div className="absolute w-16 h-16 rounded-full border border-cyan-500/20" />
        </div>
      )}

      <div className="relative z-10 p-3 rounded-full bg-marine-900 border border-marine-700 text-cyan-400 mb-4 shadow-lg shadow-cyan-950/20">
        <Icon size={28} className="animate-pulse" />
      </div>

      <h3 className="relative z-10 text-sm sm:text-base font-semibold text-white uppercase tracking-wider mb-1.5">
        {title}
      </h3>

      <p className="relative z-10 text-xs sm:text-sm text-slate-400 max-w-md mb-5 leading-relaxed">
        {description}
      </p>

      <div className="relative z-10 flex items-center gap-3">
        {actionNode}
        {actionLabel && onAction && (
          <Button variant="primary" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};
