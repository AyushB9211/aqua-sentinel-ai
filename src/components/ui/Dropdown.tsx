import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface DropdownOption<T = string> {
  value: T;
  label: string;
  sublabel?: string;
  icon?: LucideIcon;
  badge?: string;
  disabled?: boolean;
}

export interface DropdownProps<T = string> {
  options: DropdownOption<T>[];
  value?: T;
  onChange: (value: T) => void;
  placeholder?: string;
  label?: string;
  icon?: LucideIcon;
  disabled?: boolean;
  align?: 'left' | 'right';
  className?: string;
  size?: 'sm' | 'md';
}

export const Dropdown = <T extends string | number>({
  options,
  value,
  onChange,
  placeholder = 'Select option...',
  label,
  icon: TriggerIcon,
  disabled = false,
  align = 'left',
  className,
  size = 'md',
}: DropdownProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sizeStyles = {
    sm: 'text-xs py-1.5 px-3',
    md: 'text-sm py-2 px-3.5',
  };

  return (
    <div className={cn('relative inline-block w-full', className)} ref={dropdownRef}>
      {label && (
        <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
          {label}
        </label>
      )}

      {/* Button Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between gap-2 bg-marine-900 border border-marine-750 hover:border-cyan-500/40 rounded-md text-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed',
          sizeStyles[size],
          isOpen && 'border-cyan-500 ring-1 ring-cyan-500/30'
        )}
      >
        <div className="flex items-center gap-2 truncate">
          {TriggerIcon ? (
            <TriggerIcon size={15} className="text-cyan-400 shrink-0" />
          ) : selectedOption?.icon ? (
            <selectedOption.icon size={15} className="text-cyan-400 shrink-0" />
          ) : null}
          <span className={cn('truncate', !selectedOption && 'text-slate-500')}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown
          size={14}
          className={cn('text-slate-400 transition-transform duration-150 shrink-0', isOpen && 'rotate-180 text-cyan-400')}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={cn(
            'absolute z-50 mt-1.5 w-full min-w-[200px] bg-marine-900 border border-marine-700 rounded-md shadow-xl shadow-black/80 py-1 max-h-60 overflow-y-auto backdrop-blur-md animate-in fade-in zoom-in-95 duration-100',
            align === 'right' ? 'right-0' : 'left-0'
          )}
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            const Icon = option.icon;

            return (
              <button
                key={String(option.value)}
                type="button"
                disabled={option.disabled}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full flex items-center justify-between px-3.5 py-2 text-left text-xs transition-colors',
                  isSelected
                    ? 'bg-cyan-950/70 text-cyan-300 font-medium'
                    : 'text-slate-300 hover:bg-marine-800 hover:text-white',
                  option.disabled && 'opacity-40 cursor-not-allowed hover:bg-transparent'
                )}
              >
                <div className="flex items-center gap-2.5 truncate">
                  {Icon && <Icon size={14} className={isSelected ? 'text-cyan-400' : 'text-slate-400'} />}
                  <div className="truncate">
                    <div className="truncate font-medium">{option.label}</div>
                    {option.sublabel && (
                      <div className="text-[11px] text-slate-400 truncate mt-0.5">
                        {option.sublabel}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  {option.badge && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 bg-marine-800 border border-marine-700 text-slate-300 rounded">
                      {option.badge}
                    </span>
                  )}
                  {isSelected && <Check size={14} className="text-cyan-400" />}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
