import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface TabItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  badge?: string | number;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: 'underline' | 'pills' | 'segmented';
  size?: 'sm' | 'md';
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'underline',
  size = 'md',
  className,
}) => {
  const sizeStyles = {
    sm: 'text-xs py-1.5 px-3 gap-1.5',
    md: 'text-sm py-2 px-4 gap-2',
  };

  if (variant === 'segmented') {
    return (
      <div
        className={cn(
          'inline-flex p-1 bg-marine-950 border border-marine-800 rounded-md gap-1',
          className
        )}
        role="tablist"
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              disabled={tab.disabled}
              onClick={() => onChange(tab.id)}
              className={cn(
                'inline-flex items-center justify-center font-medium rounded transition-all duration-150',
                sizeStyles[size],
                isActive
                  ? 'bg-marine-800 text-cyan-300 shadow-sm border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-marine-900',
                tab.disabled && 'opacity-40 cursor-not-allowed'
              )}
            >
              {Icon && <Icon size={size === 'sm' ? 13 : 15} className={isActive ? 'text-cyan-400' : 'text-slate-400'} />}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={cn(
                    'text-[10px] font-mono px-1.5 py-0.5 rounded-full',
                    isActive ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40' : 'bg-marine-850 text-slate-400'
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  if (variant === 'pills') {
    return (
      <div className={cn('flex flex-wrap gap-2', className)} role="tablist">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              disabled={tab.disabled}
              onClick={() => onChange(tab.id)}
              className={cn(
                'inline-flex items-center font-medium rounded-md border transition-all duration-150',
                sizeStyles[size],
                isActive
                  ? 'bg-cyan-950/70 border-cyan-500/50 text-cyan-300 shadow-md shadow-cyan-950/20'
                  : 'bg-marine-900 border-marine-800 text-slate-400 hover:text-slate-200 hover:border-marine-700',
                tab.disabled && 'opacity-40 cursor-not-allowed'
              )}
            >
              {Icon && <Icon size={size === 'sm' ? 13 : 15} className={isActive ? 'text-cyan-400' : 'text-slate-400'} />}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={cn(
                    'text-[10px] font-mono px-1.5 py-0.5 rounded',
                    isActive ? 'bg-cyan-900/80 text-cyan-200' : 'bg-marine-800 text-slate-400'
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Underline (Default)
  return (
    <div className={cn('border-b border-marine-800 flex flex-wrap gap-1', className)} role="tablist">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            disabled={tab.disabled}
            onClick={() => onChange(tab.id)}
            className={cn(
              'inline-flex items-center font-medium border-b-2 -mb-px transition-all duration-150',
              sizeStyles[size],
              isActive
                ? 'border-cyan-400 text-cyan-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-marine-700',
              tab.disabled && 'opacity-40 cursor-not-allowed'
            )}
          >
            {Icon && <Icon size={size === 'sm' ? 14 : 16} className={isActive ? 'text-cyan-400' : 'text-slate-400'} />}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={cn(
                  'text-[10px] font-mono px-1.5 py-0.5 rounded',
                  isActive ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40' : 'bg-marine-850 text-slate-400'
                )}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
