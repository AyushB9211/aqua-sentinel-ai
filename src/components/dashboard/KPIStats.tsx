import React from 'react';
import {
  Scan,
  Trash2,
  AlertOctagon,
  Map,
  TrendingUp,
  Cpu,
  ShieldAlert,
} from 'lucide-react';
import { Card } from '../ui/Card';
import { REDESIGN_KPIS } from '../../data/mockData';
import { cn } from '../../utils/cn';

export interface KPIStatsProps {
  onNavigate?: (routeId: string) => void;
}

export const KPIStats: React.FC<KPIStatsProps> = ({ onNavigate }) => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'total-scans':
        return Scan;
      case 'detections':
        return Trash2;
      case 'high-priority':
        return AlertOctagon;
      case 'area-covered':
        return Map;
      case 'avg-confidence':
      default:
        return Cpu;
    }
  };

  const getAccent = (variant: string) => {
    switch (variant) {
      case 'red':
        return 'text-red-400 border-red-500/30 hover:border-red-500/60';
      case 'teal':
        return 'text-teal-400 border-teal-500/30 hover:border-teal-500/60';
      case 'purple':
        return 'text-purple-400 border-purple-500/30 hover:border-purple-500/60';
      case 'emerald':
        return 'text-emerald-400 border-emerald-500/30 hover:border-emerald-500/60';
      case 'cyan':
      default:
        return 'text-cyan-400 border-cyan-500/30 hover:border-cyan-500/60';
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {REDESIGN_KPIS.map((kpi) => {
        const Icon = getIcon(kpi.id);

        return (
          <Card
            key={kpi.id}
            onClick={() => onNavigate?.(kpi.route)}
            className={cn(
              'p-3 flex flex-col justify-between transition-all duration-200 cursor-pointer group bg-marine-900/90 border-marine-800/90',
              getAccent(kpi.variant)
            )}
            cornerBrackets
          >
            {/* Top row: Label & Icon */}
            <div className="flex items-center justify-between gap-1 pb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-white transition-colors truncate">
                {kpi.label}
              </span>
              <div className="p-1 rounded bg-marine-950/80 border border-marine-750 shrink-0">
                <Icon size={14} className={cn('shrink-0', kpi.variant === 'red' ? 'text-red-400' : 'text-cyan-400')} />
              </div>
            </div>

            {/* Middle: Visually Dominant Main Number */}
            <div className="py-0.5">
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-white font-mono">
                {kpi.value}
              </span>
            </div>

            {/* Bottom: Trend Indicator */}
            <div className="pt-1.5 border-t border-marine-800/80 flex items-center justify-between text-[11px] font-mono">
              <div className="flex items-center gap-1 font-semibold text-emerald-400 truncate">
                <TrendingUp size={11} className="shrink-0" />
                <span>{kpi.change}</span>
              </div>
              <span className="text-[10px] text-slate-400 hidden sm:inline truncate">
                {kpi.subtext}
              </span>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
