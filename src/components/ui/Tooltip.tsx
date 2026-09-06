import React, { useState } from 'react';
import { cn } from '../../utils/cn';

export interface TooltipProps {
  content: React.ReactNode;
  shortcut?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  shortcut,
  position = 'top',
  children,
  className,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionStyles = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          role="tooltip"
          className={cn(
            'absolute z-50 px-2.5 py-1.5 text-xs text-slate-100 bg-marine-900 border border-cyan-500/40 rounded shadow-xl shadow-black/80 whitespace-nowrap pointer-events-none animate-in fade-in duration-100 flex items-center gap-1.5 backdrop-blur-md',
            positionStyles[position],
            className
          )}
        >
          <span>{content}</span>
          {shortcut && (
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-marine-950 border border-marine-700 rounded text-cyan-300">
              {shortcut}
            </kbd>
          )}
        </div>
      )}
    </div>
  );
};
