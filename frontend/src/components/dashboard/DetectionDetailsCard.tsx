import React, { useState } from 'react';
import {
  FileText,
  MapPin,
  PlusCircle,
  Info,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { SonarDetection } from '../../types/marine';
import { cn } from '../../utils/cn';

export interface DetectionDetailsCardProps {
  detection: SonarDetection | null;
  onViewOnMap?: (detection: SonarDetection) => void;
  onAddToReport?: (detection: SonarDetection) => void;
  onMoreInfo?: (detection: SonarDetection) => void;
  className?: string;
}

export const DetectionDetailsCard: React.FC<DetectionDetailsCardProps> = ({
  detection,
  onViewOnMap,
  onAddToReport,
  onMoreInfo,
  className,
}) => {
  const [reportAdded, setReportAdded] = useState(false);

  if (!detection) {
    return (
      <Card className={cn('p-4 flex items-center justify-center bg-[#040813] border-marine-800', className)} cornerBrackets>
        <span className="text-xs font-mono text-slate-500">Select a detection to view details</span>
      </Card>
    );
  }

  const handleAddReport = () => {
    setReportAdded(true);
    onAddToReport?.(detection);
    setTimeout(() => setReportAdded(false), 2500);
  };

  const priorityColor =
    detection.priority === 'HIGH' || detection.severity === 'high'
      ? 'text-red-400 bg-red-950/80 border-red-500/50'
      : detection.severity === 'anomaly'
      ? 'text-purple-400 bg-purple-950/80 border-purple-500/50'
      : 'text-amber-400 bg-amber-950/80 border-amber-500/50';

  return (
    <Card className={cn('flex flex-col h-full overflow-hidden bg-[#040813] border-marine-800 p-3 sm:p-3.5', className)} cornerBrackets>
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-marine-800 shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-marine-850 border border-marine-750 text-cyan-400">
            <ShieldAlert size={14} />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white">
              DETECTION DETAILS
            </h3>
            <div className="text-[10px] text-slate-400 font-mono">
              Survey ID: {detection.surveyId || 'SSS_2025_05_21_001'}
            </div>
          </div>
        </div>

        <span className={cn('text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase', priorityColor)}>
          {detection.priority || 'HIGH'} PRIORITY
        </span>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-2.5 overflow-y-auto pr-0.5">
        {/* Sonar Thumbnail simulation with target bounds */}
        <div className="relative w-full h-24 sm:h-28 rounded bg-[#02050b] border border-amber-500/30 overflow-hidden flex items-center justify-center shadow-inner select-none">
          {/* Sonar golden acoustic texture */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-950/60 via-[#0a0702] to-amber-950/70" />
          <svg className="absolute inset-0 w-full h-full opacity-60 pointer-events-none">
            <line x1="0" y1="30" x2="100%" y2="30" stroke="#f59e0b" strokeWidth="0.5" strokeDasharray="3 3" />
            <line x1="0" y1="70" x2="100%" y2="70" stroke="#d97706" strokeWidth="0.5" strokeDasharray="3 3" />
          </svg>

          {/* Nadir center marker */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-4 bg-black/90 border-x border-cyan-500/30 flex items-center justify-center">
            <div className="w-[1px] h-full bg-cyan-400/40" />
          </div>

          {/* Target highlight */}
          <div className="relative z-10 px-3 py-1.5 rounded border-2 border-red-400 bg-red-500/20 flex items-center gap-2 shadow-[0_0_12px_rgba(239,68,68,0.5)]">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
            <span className="text-xs font-mono font-bold text-white tracking-wide">
              {detection.classification}
            </span>
            <span className="text-[10px] font-mono text-cyan-300 font-bold">
              {(detection.confidence * 100).toFixed(0)}%
            </span>
          </div>

          {/* Acoustic Shadow vector */}
          <div className="absolute right-6 top-6 bottom-6 w-16 bg-gradient-to-r from-black via-black/80 to-transparent pointer-events-none" />

          {/* Stamp tag */}
          <div className="absolute bottom-1 right-2 text-[9px] font-mono text-amber-300/80 bg-black/70 px-1 rounded">
            900 kHz Sonar Crop
          </div>
        </div>

        {/* Detailed Attribute Grid */}
        <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
          <div className="p-1.5 rounded bg-[#02050c] border border-marine-800">
            <div className="text-[9px] uppercase tracking-wider text-slate-400">Object Type</div>
            <div className="text-white font-bold truncate mt-0.5">{detection.classification}</div>
          </div>

          <div className="p-1.5 rounded bg-[#02050c] border border-marine-800">
            <div className="text-[9px] uppercase tracking-wider text-slate-400">Confidence Score</div>
            <div className="text-cyan-300 font-bold truncate mt-0.5">{(detection.confidence * 100).toFixed(0)}%</div>
          </div>

          <div className="p-1.5 rounded bg-[#02050c] border border-marine-800">
            <div className="text-[9px] uppercase tracking-wider text-slate-400">Priority</div>
            <div className="text-white font-bold truncate mt-0.5">{detection.priority || 'HIGH'}</div>
          </div>

          <div className="p-1.5 rounded bg-[#02050c] border border-marine-800">
            <div className="text-[9px] uppercase tracking-wider text-slate-400">Depth</div>
            <div className="text-teal-300 font-bold truncate mt-0.5">-{detection.waterDepth.toFixed(1)} m</div>
          </div>

          <div className="p-1.5 rounded bg-[#02050c] border border-marine-800 col-span-2">
            <div className="text-[9px] uppercase tracking-wider text-slate-400">Location</div>
            <div className="text-white font-bold text-[11px] truncate mt-0.5">
              Lat: {detection.latitude.toFixed(4)}° • Lon: {detection.longitude.toFixed(4)}°
            </div>
          </div>

          <div className="p-1.5 rounded bg-[#02050c] border border-marine-800">
            <div className="text-[9px] uppercase tracking-wider text-slate-400">Date</div>
            <div className="text-white font-medium truncate mt-0.5">{detection.dateString || '21 May 2025'}</div>
          </div>

          <div className="p-1.5 rounded bg-[#02050c] border border-marine-800">
            <div className="text-[9px] uppercase tracking-wider text-slate-400">Time</div>
            <div className="text-white font-medium truncate mt-0.5">{detection.timeString || '10:24 AM'}</div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="pt-2 mt-2 border-t border-marine-800 shrink-0 grid grid-cols-3 gap-1.5">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewOnMap?.(detection)}
          className="text-[10px] font-mono font-bold px-1 py-1.5 justify-center"
        >
          <MapPin size={11} className="mr-1" /> View on Map
        </Button>

        <Button
          variant={reportAdded ? 'primary' : 'outline'}
          size="sm"
          onClick={handleAddReport}
          className="text-[10px] font-mono font-bold px-1 py-1.5 justify-center"
        >
          {reportAdded ? (
            <>
              <CheckCircle2 size={11} className="mr-1 text-emerald-300" /> Added
            </>
          ) : (
            <>
              <PlusCircle size={11} className="mr-1" /> Add to Report
            </>
          )}
        </Button>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => onMoreInfo?.(detection)}
          className="text-[10px] font-mono font-bold px-1 py-1.5 justify-center"
        >
          <Info size={11} className="mr-1" /> More Info
        </Button>
      </div>
    </Card>
  );
};
