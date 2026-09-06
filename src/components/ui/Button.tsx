import React from 'react';
import { LucideIcon, Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'anomaly' | 'ai';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  isIconOnly?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  isLoading = false,
  isIconOnly = false,
  disabled,
  ...props
}) => {
  const baseStyles =
    'relative inline-flex items-center justify-center font-medium transition-all duration-150 select-none focus:outline-none focus:ring-2 focus:ring-cyan-500/40 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98]';

  const sizeStyles = {
    xs: isIconOnly ? 'p-1 text-xs rounded' : 'px-2.5 py-1 text-xs rounded',
    sm: isIconOnly ? 'p-1.5 text-xs rounded-md' : 'px-3 py-1.5 text-xs rounded-md gap-1.5',
    md: isIconOnly ? 'p-2 text-sm rounded-md' : 'px-4 py-2 text-sm rounded-md gap-2',
    lg: isIconOnly ? 'p-3 text-base rounded-lg' : 'px-5 py-2.5 text-base rounded-lg gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-semibold shadow-md shadow-cyan-950/40 border border-cyan-400/40 hover:shadow-cyan-500/25',
    secondary:
      'bg-marine-800 hover:bg-marine-750 text-slate-200 border border-marine-700 hover:border-cyan-500/40 hover:text-white',
    outline:
      'bg-transparent hover:bg-cyan-500/10 text-cyan-400 hover:text-cyan-300 border border-cyan-500/40 hover:border-cyan-400',
    ghost:
      'bg-transparent hover:bg-marine-800/80 text-slate-300 hover:text-white border border-transparent',
    danger:
      'bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 hover:border-red-400 hover:text-red-200',
    anomaly:
      'bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 hover:border-purple-400 hover:text-purple-200',
    ai:
      'bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-500/50 shadow-inner shadow-cyan-500/20 hover:shadow-cyan-500/30',
  };

  const iconSizes = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
  };

  return (
    <button
      className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 size={iconSizes[size]} className="animate-spin text-current" />
      ) : (
        Icon && iconPosition === 'left' && <Icon size={iconSizes[size]} className="shrink-0" />
      )}

      {!isIconOnly && children}

      {!isLoading && Icon && iconPosition === 'right' && (
        <Icon size={iconSizes[size]} className="shrink-0" />
      )}
    </button>
  );
};
