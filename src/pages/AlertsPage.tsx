import React from 'react';
import { Bell, AlertOctagon, AlertTriangle, ShieldCheck, CheckCircle2, MapPin, Eye } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { RECENT_DETECTIONS } from '../data/mockData';
import { StatusBadge } from '../components/ui/StatusBadge';
import { SonarDetection } from '../types/marine';

export const AlertsPage: React.FC = () => {
  const highPriorityAlerts: SonarDetection[] = RECENT_DETECTIONS.filter((d: SonarDetection) => d.priority === 'HIGH');

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-lg bg-marine-900/90 border border-red-500/40 backdrop-blur-md corner-brackets">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/40 text-[10px] font-mono font-bold">
              BENTHIC HAZARD ALERTS
            </span>
            <span className="text-xs font-mono text-slate-400">27 HIGH PRIORITY TARGETS RECORDED</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight uppercase">
            Critical Benthic Hazards & Sonar Alerts
          </h1>
        </div>

        <span className="text-xs font-mono font-bold text-red-400 bg-red-950 px-3 py-1.5 rounded-full border border-red-500/50 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
          5 Active This Mission
        </span>
      </div>

      {/* Critical Hazards Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
          Immediate Navigation & ROV Hazards
        </h3>

        <div className="space-y-3">
          {highPriorityAlerts.map((alt: SonarDetection) => (
            <Card key={alt.id} className="p-4 bg-marine-900/90 border-red-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4" cornerBrackets>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded bg-red-950/80 border border-red-500/40 text-red-400 shrink-0 mt-0.5">
                  <AlertOctagon size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-cyan-300">{alt.trackingId}</span>
                    <StatusBadge status="high" label="CRITICAL HAZARD" size="sm" />
                    <span className="text-xs font-mono text-slate-400">{alt.timeString}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white font-mono">{alt.classification} ({(alt.confidence * 100).toFixed(0)}% Confidence)</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{alt.notes}</p>
                  <div className="text-[11px] font-mono text-cyan-300 mt-1">
                    Coordinates: {alt.latitude.toFixed(4)}°N, {alt.longitude.toFixed(4)}°E • Depth: -{alt.waterDepth.toFixed(1)}m
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button variant="primary" size="xs" icon={ShieldCheck} onClick={() => alert(`Target ${alt.trackingId} acknowledged and logged to ROV collision-avoidance layer.`)}>
                  Acknowledge Hazard
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
