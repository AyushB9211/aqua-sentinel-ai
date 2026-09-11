import React from 'react';
import { AlertOctagon, CheckCircle2, HelpCircle } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/StatusBadge';
import { ConfidenceMeter } from '../marine/ConfidenceMeter';
import { TechnicalCoords } from '../marine/TechnicalCoords';
import { SonarDetection } from '../../types/marine';

export interface DetectionDetailModalProps {
  detection: SonarDetection | null;
  isOpen: boolean;
  onClose: () => void;
  onVerify?: (id: string) => void;
}

export const DetectionDetailModal: React.FC<DetectionDetailModalProps> = ({
  detection,
  isOpen,
  onClose,
  onVerify,
}) => {
  if (!detection) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Detection Record: ${detection.trackingId}`}
      subtitle={`${detection.classification} • Mission MS-0048 • MoES / NIOT Datastore`}
      icon={detection.severity === 'anomaly' ? HelpCircle : AlertOctagon}
      severity={detection.severity === 'anomaly' ? 'anomaly' : detection.severity === 'high' ? 'high' : 'default'}
      size="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="text-xs text-slate-400">
            Detected: {detection.timeString} • 900 kHz Sonar
          </span>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={onClose}>
              Dismiss
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={CheckCircle2}
              onClick={() => {
                onVerify?.(detection.id);
                onClose();
              }}
            >
              Verify Target & Log
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Classification & Confidence Header */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="p-3.5 rounded-lg bg-marine-950 border border-marine-800 space-y-1.5">
            <div className="text-xs text-slate-400 font-medium">Classification & Severity</div>
            <div className="text-base font-bold text-white">{detection.classification}</div>
            <StatusBadge status={detection.severity} size="sm" />
          </div>

          <div className="p-3.5 rounded-lg bg-marine-950 border border-marine-800 space-y-1.5">
            <div className="text-xs text-slate-400 font-medium">AI Confidence Rating</div>
            <ConfidenceMeter confidence={detection.confidence} size="md" />
          </div>
        </div>

        {/* Estimated Dimensions & Acoustic Shadow */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          <div className="p-2.5 rounded-lg bg-marine-950/80 border border-marine-800">
            <div className="text-[11px] text-slate-400 font-medium">Acoustic Shadow</div>
            <div className="text-cyan-300 font-bold mt-0.5">{detection.acousticShadowLength} m</div>
          </div>
          <div className="p-2.5 rounded-lg bg-marine-950/80 border border-marine-800">
            <div className="text-[11px] text-slate-400 font-medium">Est. Length</div>
            <div className="text-white font-bold mt-0.5">{detection.estimatedDimensions.length} m</div>
          </div>
          <div className="p-2.5 rounded-lg bg-marine-950/80 border border-marine-800">
            <div className="text-[11px] text-slate-400 font-medium">Est. Width</div>
            <div className="text-white font-bold mt-0.5">{detection.estimatedDimensions.width} m</div>
          </div>
          <div className="p-2.5 rounded-lg bg-marine-950/80 border border-marine-800">
            <div className="text-[11px] text-slate-400 font-medium">Tow Altitude</div>
            <div className="text-teal-300 font-bold mt-0.5">{detection.altitude} m</div>
          </div>
        </div>

        {/* Coordinates */}
        <div className="p-3.5 rounded-lg bg-marine-950 border border-marine-800 space-y-1.5">
          <div className="text-xs text-slate-400 font-medium">Target Georeferenced Coordinates</div>
          <TechnicalCoords
            latitude={detection.latitude}
            longitude={detection.longitude}
            depth={detection.waterDepth}
          />
        </div>

        {/* Analyst Notes */}
        <div className="p-3.5 rounded-lg bg-marine-950/70 border border-marine-800 text-xs space-y-1">
          <div className="font-semibold text-slate-300">AI Feature Segmentation Analysis:</div>
          <p className="text-slate-300 leading-relaxed">{detection.notes}</p>
        </div>
      </div>
    </Modal>
  );
};
