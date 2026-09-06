import React from 'react';
import { Waves, Activity, Radio, Compass, Navigation, Cpu } from 'lucide-react';
import { TelemetryState } from '../../types/marine';
import { cn } from '../../utils/cn';

export interface TelemetryHUDProps {
  telemetry: TelemetryState;
  className?: string;
}

export const TelemetryHUD: React.FC<TelemetryHUDProps> = ({ telemetry, className }) => {
  return (
    <div
      className={cn(
        'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 p-3 rounded-md bg-marine-950/90 border border-marine-750 backdrop-blur-md',
        className
      )}
    >
      {/* 1. Towfish Depth */}
      <div className="flex items-center gap-2.5 p-2 rounded bg-marine-900/80 border border-marine-800">
        <div className="p-1.5 rounded bg-marine-850 text-cyan-400 border border-marine-750 shrink-0">
          <Waves size={14} />
        </div>
        <div className="min-w-0">
          <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Depth / Alt</div>
          <div className="text-xs font-mono font-bold text-white truncate">
            -{telemetry.towfishDepth.toFixed(1)}m <span className="text-[10px] text-slate-400 font-normal">({telemetry.altitudeAboveSeafloor.toFixed(1)}m)</span>
          </div>
        </div>
      </div>

      {/* 2. Sonar Frequency */}
      <div className="flex items-center gap-2.5 p-2 rounded bg-marine-900/80 border border-marine-800">
        <div className="p-1.5 rounded bg-marine-850 text-cyan-400 border border-marine-750 shrink-0">
          <Radio size={14} />
        </div>
        <div className="min-w-0">
          <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Frequency</div>
          <div className="text-xs font-mono font-bold text-cyan-300 truncate">
            {telemetry.activeFrequencyKhz} kHz <span className="text-[10px] text-slate-400 font-normal">CH-1</span>
          </div>
        </div>
      </div>

      {/* 3. Ping Rate */}
      <div className="flex items-center gap-2.5 p-2 rounded bg-marine-900/80 border border-marine-800">
        <div className="p-1.5 rounded bg-marine-850 text-teal-400 border border-marine-750 shrink-0">
          <Activity size={14} />
        </div>
        <div className="min-w-0">
          <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Ping Rate</div>
          <div className="text-xs font-mono font-bold text-teal-300 truncate">
            {telemetry.sonarPingRate} <span className="text-[10px] text-slate-400 font-normal">Hz</span>
          </div>
        </div>
      </div>

      {/* 4. Vessel Speed & Swath */}
      <div className="flex items-center gap-2.5 p-2 rounded bg-marine-900/80 border border-marine-800">
        <div className="p-1.5 rounded bg-marine-850 text-amber-400 border border-marine-750 shrink-0">
          <Navigation size={14} />
        </div>
        <div className="min-w-0">
          <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Tow Speed</div>
          <div className="text-xs font-mono font-bold text-amber-300 truncate">
            {telemetry.vesselSpeedKnots} <span className="text-[10px] text-slate-400 font-normal">kts ({telemetry.swathRange * 2}m)</span>
          </div>
        </div>
      </div>

      {/* 5. Heading */}
      <div className="flex items-center gap-2.5 p-2 rounded bg-marine-900/80 border border-marine-800">
        <div className="p-1.5 rounded bg-marine-850 text-blue-400 border border-marine-750 shrink-0">
          <Compass size={14} />
        </div>
        <div className="min-w-0">
          <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Heading</div>
          <div className="text-xs font-mono font-bold text-blue-300 truncate">
            {telemetry.headingDegrees.toFixed(1)}° <span className="text-[10px] text-slate-400 font-normal">SE</span>
          </div>
        </div>
      </div>

      {/* 6. AI Inference Engine */}
      <div className="flex items-center gap-2.5 p-2 rounded bg-marine-900/80 border border-marine-800">
        <div className="p-1.5 rounded bg-marine-850 text-emerald-400 border border-marine-750 shrink-0">
          <Cpu size={14} />
        </div>
        <div className="min-w-0">
          <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">AI Inference</div>
          <div className="text-xs font-mono font-bold text-emerald-300 truncate">
            {telemetry.aiInferenceFps} <span className="text-[10px] text-slate-400 font-normal">FPS</span>
          </div>
        </div>
      </div>
    </div>
  );
};
