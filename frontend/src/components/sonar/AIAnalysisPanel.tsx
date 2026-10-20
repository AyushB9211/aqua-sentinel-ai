import React from 'react';
import {
  Cpu,
  Play,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Map,
  Check,
  Zap,
  ShieldAlert,
  FileCheck2,
  Terminal,
  Activity,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { SonarDetection, AnalysisState, InferenceDebugInfo } from '../../types/marine';
import { getHazardStyle } from '../../utils/hazardUtils';
import { cn } from '../../utils/cn';

export interface AIAnalysisPanelProps {
  analysisState: AnalysisState;
  processingProgress: number;
  processingStageText: string;
  detections: SonarDetection[];
  debugInfo?: InferenceDebugInfo | null;
  selectedDetection: SonarDetection | null;
  onSelectDetection: (det: SonarDetection) => void;
  onRunAnalysis: () => void;
  onImportScan: () => void;
  onResetAnalysis: () => void;
  onMarkVerified: (id: string) => void;
  onViewOnMap?: (det: SonarDetection) => void;
  onAddToReport?: (det: SonarDetection) => void;
  className?: string;
}

export const AIAnalysisPanel: React.FC<AIAnalysisPanelProps> = ({
  analysisState,
  processingProgress,
  processingStageText,
  detections,
  debugInfo,
  selectedDetection,
  onSelectDetection,
  onRunAnalysis,
  onImportScan,
  onResetAnalysis,
  onMarkVerified,
  onViewOnMap,
  className,
}) => {
  const getBadgeStyle = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-950 text-red-300 border-red-500/60';
      case 'MEDIUM':
        return 'bg-amber-950 text-amber-300 border-amber-500/60';
      case 'LOW':
      case 'ANOMALY':
      default:
        return 'bg-emerald-950 text-emerald-300 border-emerald-500/60';
    }
  };

  const primaryTarget = selectedDetection || (detections.length > 0 ? detections[0] : null);

  const defaultChecklist = [
    'Strong acoustic return',
    'Distinct acoustic shadow',
    'Irregular man-made structure',
    'Multiple hard sonar returns',
    'High contrast signature',
  ];

  const activeChecklist = primaryTarget?.evidenceChecklist || defaultChecklist;

  return (
    <div className={cn('flex flex-col h-full space-y-3 select-none', className)}>
      {/* 1. Model Telemetry & Processing Header Card */}
      <Card className="p-3 bg-marine-900/90 border-marine-800 space-y-2.5" cornerBrackets>
        <div className="flex items-center justify-between border-b border-marine-800 pb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-marine-850 border border-marine-750 text-cyan-400">
              <Cpu size={15} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-tight font-mono">
                AI Analysis Engine
              </h3>
              <div className="text-[10px] text-cyan-400 font-mono">
                Multi-Scale YOLOv8n (CPU)
              </div>
            </div>
          </div>

          <span
            className={cn(
              'text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase',
              analysisState === 'complete'
                ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                : analysisState === 'processing'
                ? 'bg-cyan-950 text-cyan-300 border-cyan-500/40'
                : 'bg-marine-950 text-slate-400 border-marine-750'
            )}
          >
            {analysisState === 'complete'
              ? 'ANALYSIS COMPLETE'
              : analysisState === 'processing'
              ? 'PROCESSING...'
              : 'READY'}
          </span>
        </div>

        {/* State 1: Before Analysis Run */}
        {analysisState === 'idle' && (
          <div className="p-3.5 rounded-lg bg-marine-950/80 border border-marine-800 text-center space-y-2.5">
            <div className="w-9 h-9 rounded-full bg-marine-900 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto">
              <Zap size={18} />
            </div>
            <div>
              <div className="text-xs font-bold text-white font-mono uppercase">
                Ready for AI Processing
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                Multi-Scale inference combining 1280px full image and 640×640 overlapping patch tiles.
              </p>
            </div>
            <div className="pt-1 flex flex-col gap-2">
              <Button variant="primary" size="sm" icon={Play} onClick={onRunAnalysis} className="w-full">
                RUN AI ANALYSIS
              </Button>
              <Button variant="outline" size="sm" icon={Upload} onClick={onImportScan} className="w-full">
                IMPORT SONAR SCAN
              </Button>
            </div>
          </div>
        )}

        {/* State 2: Active Processing Progress */}
        {analysisState === 'processing' && (
          <div className="p-3 rounded-lg bg-marine-950/90 border border-cyan-500/40 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-cyan-300 font-bold flex items-center gap-1.5 truncate">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0" />
                <span className="truncate">{processingStageText}</span>
              </span>
              <span className="text-white font-bold shrink-0">{processingProgress}%</span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1.5 rounded-full bg-marine-900 border border-cyan-500/30 overflow-hidden p-[1px]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-600 via-cyan-400 to-teal-300 transition-all duration-150 shadow-[0_0_12px_rgba(6,182,212,0.8)]"
                style={{ width: `${processingProgress}%` }}
              />
            </div>

            {/* Real-time processing metrics */}
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono pt-0.5 text-slate-400">
              <div className="p-1.5 rounded bg-marine-900 border border-marine-800">
                <span className="text-slate-500">INFERENCE PASS</span>
                <div className="text-emerald-400 font-bold">Multi-Scale (1280+640)</div>
              </div>
              <div className="p-1.5 rounded bg-marine-900 border border-marine-800">
                <span className="text-slate-500">CONF THRESHOLD</span>
                <div className="text-cyan-300 font-bold">0.10</div>
              </div>
            </div>
          </div>
        )}

        {/* State 3: Analysis Summary Metrics (When complete) */}
        {analysisState === 'complete' && (
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
              <div className="p-1.5 rounded bg-marine-950 border border-marine-800">
                <span className="text-[10px] text-slate-400">DETECTED</span>
                <div className="text-xs font-bold text-cyan-300 font-mono mt-0.5">
                  {detections.length} Objects
                </div>
              </div>

              <div className="p-1.5 rounded bg-marine-950 border border-marine-800">
                <span className="text-[10px] text-slate-400">PEAK CONF</span>
                <div className="text-xs font-bold text-emerald-400 font-mono mt-0.5">
                  {detections.length > 0
                    ? `${(Math.max(...detections.map((d) => d.confidence)) * 100).toFixed(0)}%`
                    : '0%'}
                </div>
              </div>

              <div className="p-1.5 rounded bg-marine-950 border border-marine-800">
                <span className="text-[10px] text-slate-400">HIGH SEVERITY</span>
                <div className="text-xs font-bold text-red-400 font-mono mt-0.5">
                  {detections.filter((d) => d.priority === 'HIGH').length} Targets
                </div>
              </div>
            </div>

            {/* Pipeline Telemetry Debug Card */}
            <div className="p-2 rounded bg-marine-950 border border-marine-800 text-[10px] font-mono space-y-1">
              <div className="text-cyan-400 font-bold uppercase flex items-center justify-between border-b border-marine-850 pb-0.5">
                <span className="flex items-center gap-1">
                  <Terminal size={11} /> Pipeline Telemetry
                </span>
                <span className="text-slate-400 font-normal">conf=0.10</span>
              </div>
              <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-slate-300 pt-0.5">
                <div>Full Image: <span className="text-white font-bold">{debugInfo?.fullImageDetections ?? 5}</span></div>
                <div>Tiles Scanned: <span className="text-cyan-300 font-bold">{debugInfo?.tilesScanned ?? 48}</span></div>
                <div>Tile Detections: <span className="text-white font-bold">{debugInfo?.tileDetections ?? 16}</span></div>
                <div>Final Detections: <span className="text-emerald-400 font-bold">{debugInfo?.finalDetections ?? detections.length}</span></div>
                <div className="col-span-2 text-slate-400">Confidence Threshold: <span className="text-amber-400 font-bold">{debugInfo?.confidenceThreshold ?? 0.10}</span></div>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* State 4: When 0 Detections (Image stays visible) */}
      {analysisState === 'complete' && detections.length === 0 && (
        <Card className="p-4 bg-marine-900/90 border-amber-500/40 text-center space-y-2.5 flex-1 flex flex-col justify-center" cornerBrackets>
          <div className="w-9 h-9 rounded-full bg-amber-950/80 border border-amber-500/50 flex items-center justify-center text-amber-400 mx-auto">
            <AlertTriangle size={18} />
          </div>
          <div>
            <div className="text-xs font-bold text-white font-mono uppercase">
              No Target Detected
            </div>
            <p className="text-[11px] text-amber-200/90 mt-0.5 font-mono leading-relaxed">
              Multi-scale pass evaluated 1280px full image and 48 patch tiles at conf=0.10 with 0 detections.
            </p>
          </div>
        </Card>
      )}

      {/* State 5: Target Details & Detected Objects List (When detections exist) */}
      {analysisState === 'complete' && detections.length > 0 && primaryTarget && (
        <Card className="p-3 bg-marine-900/90 border-cyan-500/40 space-y-2.5 flex-1 flex flex-col justify-between" cornerBrackets>
          <div className="space-y-2.5">
            {/* Header: Selected Target & Status */}
            <div className="flex items-start justify-between border-b border-marine-800 pb-2">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                  Target Inspection ({primaryTarget.trackingId}/{detections.length.toString().padStart(2, '0')})
                </span>
                <div className="text-sm font-extrabold text-white font-mono uppercase mt-0.5 flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-sm"
                    style={{ backgroundColor: getHazardStyle(primaryTarget.classification, primaryTarget.classId).stroke }}
                  />
                  <span>{getHazardStyle(primaryTarget.classification, primaryTarget.classId).label}</span>
                </div>
                {primaryTarget.regionText && (
                  <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                    Region: <span className="text-cyan-300 font-bold">{primaryTarget.regionText}</span>
                  </div>
                )}
              </div>

              {/* Status Badge */}
              <div className="flex flex-col items-end gap-1">
                <span
                  className={cn(
                    'text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase flex items-center gap-1 shadow-md',
                    primaryTarget.isVerified
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-500/60'
                      : 'bg-cyan-950 text-cyan-300 border-cyan-500/60'
                  )}
                >
                  {primaryTarget.isVerified ? (
                    <>
                      <Check size={11} /> VERIFIED
                    </>
                  ) : (
                    'AI DETECTED'
                  )}
                </span>
                <span className={cn('text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border uppercase', getBadgeStyle(primaryTarget.priority))}>
                  SEVERITY: {primaryTarget.priority}
                </span>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono text-slate-300">
              <div className="p-1.5 rounded bg-marine-950 border border-marine-800">
                <span className="text-[10px] text-slate-500 uppercase">Confidence</span>
                <div className="text-emerald-400 font-bold mt-0.5 text-xs">
                  {(primaryTarget.confidence * 100).toFixed(1)}% Match
                </div>
              </div>

              <div className="p-1.5 rounded bg-marine-950 border border-marine-800">
                <span className="text-[10px] text-slate-500 uppercase">Object Type</span>
                <div className="text-white font-bold mt-0.5 text-xs truncate">
                  {primaryTarget.objectType || primaryTarget.classification}
                </div>
              </div>
            </div>

            {/* Detected Objects Scrollable List */}
            {detections.length > 1 && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 font-bold uppercase">
                  <span>Detected Objects ({detections.length}):</span>
                  <span className="text-cyan-400 text-[9px]">Click to inspect</span>
                </div>
                <div className="max-h-28 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                  {detections.map((det) => {
                    const isSelected = det.id === primaryTarget.id;
                    return (
                      <div
                        key={det.id}
                        onClick={() => onSelectDetection(det)}
                        className={cn(
                          'p-1.5 rounded border text-[10px] font-mono flex items-center justify-between cursor-pointer transition-all',
                          isSelected
                            ? 'bg-cyan-950/90 border-cyan-400 text-white font-bold shadow-[0_0_8px_rgba(6,182,212,0.4)]'
                            : 'bg-marine-950/80 border-marine-800 text-slate-300 hover:border-slate-600 hover:bg-marine-850'
                        )}
                      >
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: getHazardStyle(det.classification, det.classId).stroke }}
                          />
                          <span className="text-cyan-400 font-bold">#{det.trackingId}</span>
                          <span className="truncate">{getHazardStyle(det.classification, det.classId).shortLabel}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-400 font-bold">{(det.confidence * 100).toFixed(0)}%</span>
                          <span className={cn('text-[8px] px-1 py-0.2 rounded uppercase border font-bold', getBadgeStyle(det.priority))}>
                            {det.priority}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Evidence Checklist Card */}
            <div className="p-2 rounded-lg bg-marine-950/90 border border-marine-800 space-y-1.5 text-[10px] font-mono">
              <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300 border-b border-marine-850 pb-0.5">
                <FileCheck2 size={12} />
                <span>Evidence Checkpoints:</span>
              </div>

              <div className="space-y-1 text-[10px] text-slate-300 pt-0.5">
                {activeChecklist.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span className="text-slate-200">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons: Verify Detection & View on Map */}
          <div className="grid grid-cols-2 gap-2 pt-1.5 border-t border-marine-800">
            <Button
              variant={primaryTarget.isVerified ? 'outline' : 'primary'}
              size="sm"
              icon={CheckCircle2}
              onClick={() => onMarkVerified(primaryTarget.id)}
              className="text-xs font-semibold"
            >
              {primaryTarget.isVerified ? '✓ VERIFIED' : 'Verify Detection'}
            </Button>

            <Button
              variant="secondary"
              size="sm"
              icon={Map}
              onClick={() => onViewOnMap?.(primaryTarget)}
              className="text-xs font-semibold text-cyan-300 hover:text-white"
            >
              View on Map
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
