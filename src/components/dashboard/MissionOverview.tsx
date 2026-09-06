import React from 'react';
import { Compass, Ship, Clock, ArrowRight, MapPin } from 'lucide-react';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { Button } from '../ui/Button';
import { ACTIVE_MISSION } from '../../data/mockData';
import { cn } from '../../utils/cn';

export interface MissionOverviewProps {
  onViewMissions: () => void;
  className?: string;
}

export const MissionOverview: React.FC<MissionOverviewProps> = ({
  onViewMissions,
  className,
}) => {
  return (
    <Card className={cn('flex flex-col h-full', className)} cornerBrackets>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-marine-800 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-md bg-marine-850 border border-marine-750 text-cyan-400">
            <Compass size={16} />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-white">
              Mission Overview
            </h3>
            <div className="text-xs text-slate-400">
              Sector 4 Acoustic Transect Survey
            </div>
          </div>
        </div>

        <span className="text-xs font-semibold text-cyan-300 bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-cyan-500/40">
          {ACTIVE_MISSION.code}
        </span>
      </div>

      {/* Mission Key Parameters Grid */}
      <div className="space-y-3 flex-1 text-xs sm:text-sm">
        <div className="p-3 rounded-lg bg-marine-950/70 border border-marine-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium">Research Vessel</span>
            <span className="text-white font-semibold flex items-center gap-1.5">
              <Ship size={14} className="text-cyan-400" /> {ACTIVE_MISSION.vessel}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium">Target Sector</span>
            <span className="text-slate-200 font-medium flex items-center gap-1.5">
              <MapPin size={14} className="text-teal-400" /> {ACTIVE_MISSION.location}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium">Survey Area</span>
            <span className="text-white font-semibold">
              {ACTIVE_MISSION.areaCoverageSqKm} km²
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium">Elapsed Time</span>
            <span className="text-cyan-300 font-medium flex items-center gap-1.5">
              <Clock size={14} /> {ACTIVE_MISSION.elapsedTime}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium">Mission Status</span>
            <span className="text-emerald-400 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              In Progress
            </span>
          </div>
        </div>

        {/* Transect Progress Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium">Transect Area Coverage</span>
            <span className="text-cyan-300 font-bold">{ACTIVE_MISSION.coveragePercentage}%</span>
          </div>
          <ProgressBar
            value={ACTIVE_MISSION.coveragePercentage}
            variant="cyan"
            size="md"
            showValue={false}
          />
        </div>
      </div>

      {/* Footer CTA */}
      <div className="pt-3 mt-3 border-t border-marine-800 shrink-0">
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-center text-xs font-semibold"
          onClick={onViewMissions}
        >
          View Mission Details <ArrowRight size={14} className="ml-1" />
        </Button>
      </div>
    </Card>
  );
};
