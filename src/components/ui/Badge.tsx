import React from 'react';
import { cn } from '../../utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'cyan' | 'teal' | 'slate' | 'outline';
  size?: 'sm' | 'md';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'default',
  size = 'md',
  dot = false,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center font-medium select-none tracking-wide';
  
  const sizeStyles = {
    sm: 'text-[10px] px-1.5 py-0.5 rounded gap-1 font-mono uppercase',
    md: 'text-xs px-2.5 py-0.5 rounded-md gap-1.5',
  };

  const variantStyles = {
    default: 'bg-marine-800 text-slate-300 border border-marine-700',
    cyan: 'bg-cyan-950/70 text-cyan-300 border border-cyan-500/30',
    teal: 'bg-teal-950/70 text-teal-300 border border-teal-500/30',
    slate: 'bg-slate-800/80 text-slate-400 border border-slate-700/50',
    outline: 'bg-transparent text-slate-300 border border-slate-700',
  };

  return (
    <span className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)} {...props}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0 animate-pulse" />}
      {children}
    </span>
  );
};
