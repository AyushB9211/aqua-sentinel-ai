import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { BreadcrumbItem } from '../../types/navigation';
import { cn } from '../../utils/cn';

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className }) => {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center space-x-1.5 text-xs', className)}>
      <div className="flex items-center text-slate-400 hover:text-cyan-300 transition-colors">
        <Home size={13} className="mr-1.5 text-cyan-400" />
        <span className="font-mono text-[11px] uppercase tracking-wider">MoES / NIOT</span>
      </div>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            <ChevronRight size={12} className="text-slate-600 shrink-0" />
            <span
              className={cn(
                'font-medium truncate',
                isLast
                  ? 'text-cyan-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 cursor-pointer'
              )}
              aria-current={isLast ? 'page' : undefined}
            >
              {item.label}
            </span>
          </React.Fragment>
        );
      })}
    </nav>
  );
};
