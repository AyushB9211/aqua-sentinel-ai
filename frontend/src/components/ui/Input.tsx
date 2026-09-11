import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  errorText?: string;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  unit?: string;
  shortcut?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      helperText,
      errorText,
      icon: Icon,
      iconPosition = 'left',
      unit,
      shortcut,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {Icon && iconPosition === 'left' && (
            <div className="absolute left-3 text-slate-400 pointer-events-none">
              <Icon size={15} />
            </div>
          )}

          <input
            ref={ref}
            disabled={disabled}
            className={cn(
              'w-full bg-marine-950/90 border border-marine-750 text-slate-100 placeholder:text-slate-500 text-xs sm:text-sm rounded-md py-2 px-3 transition-colors focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/40 disabled:opacity-50 disabled:cursor-not-allowed',
              Icon && iconPosition === 'left' && 'pl-9',
              Icon && iconPosition === 'right' && 'pr-9',
              unit && 'pr-12',
              shortcut && 'pr-12',
              errorText && 'border-red-500 focus:border-red-500 focus:ring-red-500/40',
              className
            )}
            {...props}
          />

          {unit && (
            <div className="absolute right-3 font-mono text-xs text-slate-400 pointer-events-none">
              {unit}
            </div>
          )}

          {shortcut && !unit && (
            <div className="absolute right-2.5">
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-marine-850 border border-marine-700 rounded text-slate-400">
                {shortcut}
              </kbd>
            </div>
          )}

          {Icon && iconPosition === 'right' && !unit && !shortcut && (
            <div className="absolute right-3 text-slate-400 pointer-events-none">
              <Icon size={15} />
            </div>
          )}
        </div>

        {errorText ? (
          <p className="text-[11px] text-red-400 mt-1">{errorText}</p>
        ) : helperText ? (
          <p className="text-[11px] text-slate-500 mt-1">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
