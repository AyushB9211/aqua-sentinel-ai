import React from 'react';
import { Sun, Wind, Waves, Eye, Compass } from 'lucide-react';
import { Card } from '../ui/Card';
import { WEATHER_CONDITIONS } from '../../data/mockData';
import { cn } from '../../utils/cn';

export interface WeatherCardProps {
  className?: string;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ className }) => {
  return (
    <Card className={cn('p-4 space-y-3', className)} cornerBrackets>
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-marine-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-marine-850 border border-marine-750 text-cyan-400">
            <Sun size={15} />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-semibold text-white">
              Weather & Ocean State
            </h4>
            <div className="text-[11px] text-slate-400">
              Arabian Sea • Sector 4 Surface Buoy
            </div>
          </div>
        </div>

        <span className="text-xs font-semibold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/30">
          {WEATHER_CONDITIONS.temperatureC}°C
        </span>
      </div>

      {/* Grid of Weather Metrics */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2.5 rounded-md bg-marine-950/80 border border-marine-800 flex items-center gap-2.5">
          <Wind size={15} className="text-cyan-400 shrink-0" />
          <div className="min-w-0">
            <div className="text-[11px] text-slate-400 font-medium">Wind Speed</div>
            <div className="text-xs font-semibold text-white truncate">
              {WEATHER_CONDITIONS.windSpeedKnots} kts (NE)
            </div>
          </div>
        </div>

        <div className="p-2.5 rounded-md bg-marine-950/80 border border-marine-800 flex items-center gap-2.5">
          <Waves size={15} className="text-teal-400 shrink-0" />
          <div className="min-w-0">
            <div className="text-[11px] text-slate-400 font-medium">Sea State</div>
            <div className="text-xs font-semibold text-emerald-300 truncate">
              {WEATHER_CONDITIONS.seaState}
            </div>
          </div>
        </div>

        <div className="p-2.5 rounded-md bg-marine-950/80 border border-marine-800 flex items-center gap-2.5">
          <Eye size={15} className="text-purple-400 shrink-0" />
          <div className="min-w-0">
            <div className="text-[11px] text-slate-400 font-medium">Visibility</div>
            <div className="text-xs font-semibold text-white truncate">
              {WEATHER_CONDITIONS.visibility}
            </div>
          </div>
        </div>

        <div className="p-2.5 rounded-md bg-marine-950/80 border border-marine-800 flex items-center gap-2.5">
          <Compass size={15} className="text-amber-400 shrink-0" />
          <div className="min-w-0">
            <div className="text-[11px] text-slate-400 font-medium">Condition</div>
            <div className="text-xs font-semibold text-white truncate">
              {WEATHER_CONDITIONS.condition}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
