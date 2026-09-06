import React, { useState } from 'react';
import {
  Compass,
  Ship,
  PlusCircle,
  Clock,
  MapPin,
  Waves,
  Radio,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { StatusBadge } from '../components/ui/StatusBadge';
import { StartMissionModal } from '../components/dashboard/StartMissionModal';
import { ACTIVE_MISSION } from '../data/mockData';

export const MissionsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const pastMissions = [
    {
      code: 'MS-0047',
      name: 'Gulf of Mannar Coral Hazard Survey',
      vessel: 'ORV Sagar Kanya',
      location: 'Gulf of Mannar Sector 2',
      areaSqKm: 18.6,
      detections: 48,
      status: 'completed',
      date: '02 May 2025',
      duration: '08h 15m',
    },
    {
      code: 'MS-0046',
      name: 'Palk Strait Shallow-Water Wreckage Sweep',
      vessel: 'RV Samudra Nidhi',
      location: 'Palk Strait Corridor 04',
      areaSqKm: 9.4,
      detections: 24,
      status: 'completed',
      date: '24 Apr 2025',
      duration: '05h 40m',
    },
    {
      code: 'MS-0045',
      name: 'Chennai Port Approach Shipping Lane Sweep',
      vessel: 'RV Samudra Nidhi',
      location: 'Chennai Offshore Sector 1',
      areaSqKm: 22.0,
      detections: 62,
      status: 'completed',
      date: '12 Apr 2025',
      duration: '11h 20m',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-lg bg-marine-900/90 border border-cyan-500/30 backdrop-blur-md corner-brackets">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono font-bold">
              SURVEY MISSIONS
            </span>
            <span className="text-xs font-mono text-slate-400">4 MISSIONS RECORDED</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight uppercase">
            Oceanographic Survey Missions Management
          </h1>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={PlusCircle}
          onClick={() => setIsModalOpen(true)}
        >
          Start New Mission
        </Button>
      </div>

      {/* Active Mission Spotlight Card */}
      <Card className="p-6 border-cyan-500/50 bg-gradient-to-r from-marine-950 via-marine-900 to-marine-950" cornerBrackets>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-4 mb-4 border-b border-marine-800">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                ACTIVE SURVEY MISSION
              </span>
              <span className="text-xs font-mono text-cyan-300 font-bold">{ACTIVE_MISSION.code}</span>
            </div>
            <h2 className="text-xl font-extrabold text-white font-mono">{ACTIVE_MISSION.name}</h2>
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-300 pt-1">
              <span className="flex items-center gap-1.5"><Ship size={14} className="text-cyan-400" /> {ACTIVE_MISSION.vessel}</span>
              <span className="flex items-center gap-1.5"><MapPin size={14} className="text-teal-400" /> {ACTIVE_MISSION.location}</span>
              <span className="flex items-center gap-1.5"><Clock size={14} className="text-slate-400" /> Elapsed: {ACTIVE_MISSION.elapsedTime}</span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="text-right font-mono">
              <div className="text-xs text-slate-400 uppercase">Detections Logged</div>
              <div className="text-2xl font-bold text-cyan-300">{ACTIVE_MISSION.detectionsCount} Targets</div>
            </div>
          </div>
        </div>

        {/* Live Mission Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300">Acoustic Transect Area: 12.48 km²</span>
            <span className="text-cyan-300 font-bold">{ACTIVE_MISSION.coveragePercentage}% Completed</span>
          </div>
          <ProgressBar value={ACTIVE_MISSION.coveragePercentage} variant="cyan" size="md" showValue={false} />
        </div>
      </Card>

      {/* Historical Missions Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
          Past Hydrographic Missions
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pastMissions.map((m) => (
            <Card key={m.code} className="p-4 space-y-3" cornerBrackets>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-cyan-300">{m.code}</span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-500/30">
                  COMPLETED
                </span>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-white font-mono">{m.name}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{m.location}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-300 pt-2 border-t border-marine-800">
                <div>Area: <span className="text-white font-bold">{m.areaSqKm} km²</span></div>
                <div>Targets: <span className="text-cyan-300 font-bold">{m.detections}</span></div>
                <div>Date: <span className="text-slate-400">{m.date}</span></div>
                <div>Time: <span className="text-slate-400">{m.duration}</span></div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Mission Creation Modal */}
      <StartMissionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLaunch={(data) => alert(`Launched mission ${data.missionCode} on ${data.sector}!`)}
      />
    </div>
  );
};
