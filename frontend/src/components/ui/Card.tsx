import React from 'react';
import { cn } from '../../utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'sunken' | 'highlight' | 'danger' | 'anomaly';
  cornerBrackets?: boolean;
  headerBorder?: boolean;
  isInteractive?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'default',
  cornerBrackets = false,
  headerBorder = true,
  isInteractive = false,
  padding = 'md',
  ...props
}) => {
  const variantStyles = {
    default: 'bg-marine-900/80 border-marine-750/80 text-slate-100',
    elevated: 'bg-marine-850/90 border-cyan-500/20 shadow-xl shadow-black/40 text-slate-100',
    sunken: 'bg-marine-950/70 border-marine-800/60 text-slate-200',
    highlight: 'bg-marine-900/90 border-cyan-500/40 shadow-lg shadow-cyan-950/30 text-white',
    danger: 'bg-marine-900/90 border-red-500/40 shadow-lg shadow-red-950/20 text-white',
    anomaly: 'bg-marine-900/90 border-purple-500/40 shadow-lg shadow-purple-950/20 text-white',
  };

  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4 sm:p-5',
    lg: 'p-6 sm:p-7',
  };

  return (
    <div
      className={cn(
        'relative border rounded-md backdrop-blur-md transition-all duration-200',
        variantStyles[variant],
        cornerBrackets && 'corner-brackets',
        isInteractive && 'hover:border-cyan-500/50 hover:shadow-cyan-950/40 cursor-pointer',
        paddingStyles[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  icon?: React.ElementType;
  className?: string;
  badge?: React.ReactNode;
}> = ({ title, subtitle, action, icon: Icon, className, badge }) => {
  return (
    <div className={cn('flex items-start justify-between gap-3 pb-3 mb-3 border-b border-marine-800/80', className)}>
      <div className="flex items-center gap-2.5 min-w-0">
        {Icon && (
          <div className="p-1.5 rounded bg-marine-800 border border-marine-700 text-cyan-400 shrink-0">
            <Icon size={16} />
          </div>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {typeof title === 'string' ? (
              <h3 className="text-sm font-semibold tracking-wide text-slate-100 uppercase truncate">
                {title}
              </h3>
            ) : (
              title
            )}
            {badge}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-400 truncate mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {action && <div className="shrink-0 flex items-center gap-2">{action}</div>}
    </div>
  );
};

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn('pt-3 mt-3 border-t border-marine-800/80 flex items-center justify-between text-xs text-slate-400', className)}
      {...props}
    >
      {children}
    </div>
  );
};
