import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';
import { BreadcrumbItem } from '../../types/navigation';
import { TelemetryState, SurveyMission } from '../../types/marine';
import { MOCK_NOTIFICATIONS } from '../../data/mockData';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Sliders, Database, Cpu, ShieldCheck, PlayCircle } from 'lucide-react';

export interface AppShellProps {
  children: React.ReactNode;
  currentRoute: string;
  onRouteChange: (route: string) => void;
  breadcrumbs: BreadcrumbItem[];
  telemetry: TelemetryState;
  mission: SurveyMission;
  onReplayLaunch?: () => void;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  currentRoute,
  onRouteChange,
  breadcrumbs,
  telemetry,
  mission,
  onReplayLaunch,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [confidenceThreshold, setConfidenceThreshold] = useState('0.75');
  const [swathWidth, setSwathWidth] = useState('250');
  const [activeFrequency, setActiveFrequency] = useState('900');

  return (
    <div className="flex h-screen w-full bg-marine-950 text-slate-100 overflow-hidden font-sans">
      {/* 1. Left Sidebar with SeaSentinel AI Branding */}
      <Sidebar
        currentRoute={currentRoute}
        onRouteChange={onRouteChange}
        telemetry={telemetry}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
        onReplayLaunch={onReplayLaunch}
      />

      {/* 2. Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Command Bar */}
        <TopHeader
          breadcrumbs={breadcrumbs}
          telemetry={telemetry}
          mission={mission}
          notifications={MOCK_NOTIFICATIONS}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onToggleSidebar={() => setIsMobileOpen(true)}
        />

        {/* Scrollable Main Area */}
        <main className="flex-1 overflow-y-auto bg-[#02050a] sonar-grid-bg p-2.5 sm:p-3.5 lg:p-4">
          <div className="w-full max-w-[1880px] mx-auto space-y-3.5">
            {children}
          </div>
        </main>
      </div>

      {/* Global Settings & AI Engine Configuration Modal */}
      <Modal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        title="SeaSentinel AI & Sonar Sensor Configuration"
        subtitle="SIH 26057 Inference Engine & Side-Scan Hydrographic Telemetry Parameters"
        icon={Sliders}
        size="lg"
        footer={
          <div className="flex items-center justify-between w-full">
            <span className="text-[11px] font-mono text-cyan-400 flex items-center gap-1.5">
              <ShieldCheck size={14} /> MoES / NIOT Protocol Verified
            </span>
            <div className="flex items-center gap-2">
              {onReplayLaunch && (
                <Button
                  variant="outline"
                  size="sm"
                  icon={PlayCircle}
                  onClick={() => {
                    setIsSettingsOpen(false);
                    onReplayLaunch();
                  }}
                >
                  Replay Launch Screen
                </Button>
              )}
              <Button variant="secondary" size="sm" onClick={() => setIsSettingsOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={() => setIsSettingsOpen(false)}>
                Save Parameters
              </Button>
            </div>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="p-3 rounded bg-marine-950 border border-marine-800 text-xs text-slate-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu size={16} className="text-cyan-400" />
              <div>
                <div className="font-semibold text-white">SeaSentinel AI Detection Pipeline: Active</div>
                <div className="text-[11px] text-slate-400">YOLOv11-MarineDebris + Deep Acoustic Shadow Segmenter</div>
              </div>
            </div>
            <span className="font-mono text-emerald-400 text-xs font-bold px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40">
              GPU CUDA 12.4
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Minimum Detection Confidence"
              value={confidenceThreshold}
              onChange={(e) => setConfidenceThreshold(e.target.value)}
              helperText="Detections below this score are sent to Unknown Anomaly pool"
              unit="CONF"
            />
            <Input
              label="Active Sonar Frequency"
              value={activeFrequency}
              onChange={(e) => setActiveFrequency(e.target.value)}
              helperText="Dual-frequency 450 kHz / 900 kHz EdgeTech Side-Scan"
              unit="kHz"
            />
            <Input
              label="Swath Range Width"
              value={swathWidth}
              onChange={(e) => setSwathWidth(e.target.value)}
              helperText="Total cross-track acoustic coverage (port + stbd)"
              unit="m"
            />
            <Input
              label="Towfish Telemetry Refresh"
              defaultValue="24"
              helperText="Ping packet update rate from NIOT ORV databus"
              unit="Hz"
            />
          </div>

          <div className="p-3 rounded bg-marine-950/60 border border-marine-800 text-xs space-y-1.5">
            <div className="flex items-center gap-2 text-slate-200 font-medium">
              <Database size={14} className="text-cyan-400" />
              <span>FastAPI & PostGIS Endpoint Integration Target</span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              {import.meta.env.VITE_API_URL || 'https://api.seasentinel.niot.gov.in/v1/sonar/infer'} (Ready for cloud backend integration)
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};
