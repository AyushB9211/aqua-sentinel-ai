import React from 'react';
import { Radio } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface SonarLoaderProps {
  label?: string;
  sublabel?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const SonarPingLoader: React.FC<SonarLoaderProps> = ({
  label = 'AI Inference & Sonar Scan in Progress...',
  sublabel = 'Analyzing 900 kHz acoustic waterfall swath data',
  size = 'md',
  className,
}) => {
  const sizeMap = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center p-8 text-center', className)}>
      <div className={cn('relative flex items-center justify-center mb-4', sizeMap[size])}>
        {/* Animated expanding sonar waves */}
        <div className="absolute inset-0 rounded-full border border-cyan-400/60 animate-sonar-ping" />
        <div className="absolute inset-2 rounded-full border border-cyan-400/40 animate-sonar-ping [animation-delay:0.6s]" />
        <div className="absolute inset-4 rounded-full border border-cyan-400/20 animate-sonar-ping [animation-delay:1.2s]" />

        {/* Center Towfish / Transducer beacon */}
        <div className="relative z-10 w-8 h-8 rounded-full bg-cyan-950 border border-cyan-400 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.6)]">
          <Radio size={14} className="animate-pulse" />
        </div>
      </div>

      {label && (
        <div className="text-xs sm:text-sm font-semibold tracking-wider text-slate-100 uppercase font-mono mb-1">
          {label}
        </div>
      )}
      {sublabel && (
        <div className="text-[11px] text-slate-400 font-mono">{sublabel}</div>
      )}
    </div>
  );
};

export const Skeleton: React.FC<{
  className?: string;
  lines?: number;
}> = ({ className, lines = 1 }) => {
  if (lines > 1) {
    return (
      <div className="space-y-2 w-full">
        {Array.from({ length: lines }).map((_, idx) => (
          <div
            key={idx}
            className={cn(
              'h-4 bg-marine-800/60 rounded animate-pulse border border-marine-700/30',
              idx === lines - 1 && 'w-3/4',
              className
            )}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'bg-marine-800/60 rounded animate-pulse border border-marine-700/30',
        className
      )}
    />
  );
};
