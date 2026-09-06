import React, { useState } from 'react';
import {
  Sparkles,
  Shield,
  Activity,
  Layers,
  Sliders,
  Eye,
  Radio,
  Cpu,
  Radar,
  AlertTriangle,
  AlertOctagon,
  HelpCircle,
  CheckCircle2,
  Waves,
  Search,
  ExternalLink,
  ChevronRight,
  Download,
  Filter,
  Play,
  RotateCcw,
  Zap,
  PlayCircle,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Card, CardHeader, CardFooter } from '../components/ui/Card';
import { StatCard } from '../components/ui/StatCard';
import { Modal } from '../components/ui/Modal';
import { Dropdown } from '../components/ui/Dropdown';
import { Tabs } from '../components/ui/Tabs';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Alert } from '../components/ui/Alert';
import { Table, Column } from '../components/ui/Table';
import { Tooltip } from '../components/ui/Tooltip';
import { EmptyState } from '../components/ui/EmptyState';
import { SonarPingLoader, Skeleton } from '../components/ui/LoadingState';
import { Input } from '../components/ui/Input';
import { SonarSweepOverlay } from '../components/marine/SonarSweepOverlay';
import { TechnicalCoords } from '../components/marine/TechnicalCoords';
import { ConfidenceMeter } from '../components/marine/ConfidenceMeter';
import { TelemetryHUD } from '../components/marine/TelemetryHUD';
import { AnomalyIndicator } from '../components/marine/AnomalyIndicator';
import { CURRENT_TELEMETRY, MOCK_DETECTIONS, ACTIVE_MISSION } from '../data/mockData';
import { SonarDetection } from '../types/marine';
import { formatCoordinatesDec } from '../utils/formatters';
import seasentialLogo from '../assets/seasential-logo.png';

export const DesignSystemPreview: React.FC = () => {
  // State for interactive component demonstrations
  const [activeTabUnderline, setActiveTabUnderline] = useState('all');
  const [activeTabPills, setActiveTabPills] = useState('high');
  const [activeTabSegmented, setActiveTabSegmented] = useState('900khz');
  const [dropdownValue, setDropdownValue] = useState('all');
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
  const [isAnomalyModalOpen, setIsAnomalyModalOpen] = useState(false);
  const [selectedDetection, setSelectedDetection] = useState<SonarDetection | null>(MOCK_DETECTIONS[0]);
  const [progressVal, setProgressVal] = useState(68);
  const [buttonLoading, setButtonLoading] = useState(false);

  const simulateProcessing = () => {
    setButtonLoading(true);
    setTimeout(() => {
      setButtonLoading(false);
      setProgressVal((prev) => (prev >= 100 ? 25 : prev + 15));
    }, 1200);
  };

  // Table columns definition
  const columns: Column<SonarDetection>[] = [
    {
      key: 'trackingId',
      header: 'Detection ID',
      sortable: true,
      render: (item) => (
        <span className="font-mono text-cyan-300 font-semibold">{item.trackingId}</span>
      ),
    },
    {
      key: 'classification',
      header: 'Classification',
      sortable: true,
      render: (item) => (
        <div>
          <div className="font-medium text-white">{item.classification}</div>
          <div className="text-[10px] text-slate-400 font-mono">
            Shadow: {item.acousticShadowLength}m | {item.sonarFrequency}kHz
          </div>
        </div>
      ),
    },
    {
      key: 'severity',
      header: 'Severity',
      sortable: true,
      render: (item) => <StatusBadge status={item.severity} size="sm" />,
    },
    {
      key: 'confidence',
      header: 'AI Confidence',
      sortable: true,
      render: (item) => (
        <div className="w-28">
          <ConfidenceMeter confidence={item.confidence} showLabel={false} size="sm" />
          <div className="text-[10px] font-mono text-right text-slate-400 mt-0.5">
            {(item.confidence * 100).toFixed(1)}%
          </div>
        </div>
      ),
    },
    {
      key: 'coordinates',
      header: 'Coordinates & Depth',
      render: (item) => (
        <div className="font-mono text-[11px]">
          <div className="text-slate-300">{formatCoordinatesDec(item.latitude, item.longitude, 3)}</div>
          <div className="text-slate-500">Depth: -{item.waterDepth.toFixed(1)}m (Alt: {item.altitude.toFixed(1)}m)</div>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'right',
      render: (item) => (
        <Button
          variant="ghost"
          size="xs"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedDetection(item);
            if (item.severity === 'anomaly') {
              setIsAnomalyModalOpen(true);
            } else {
              setIsSampleModalOpen(true);
            }
          }}
        >
          Inspect
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-10 pb-16">
      {/* 1. Page Header & SeaSentinel AI Brand Banner */}
      <div className="relative p-6 sm:p-8 rounded-lg bg-gradient-to-r from-marine-900 via-marine-850 to-marine-900 border border-cyan-500/30 overflow-hidden shadow-2xl corner-brackets">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,rgba(6,182,212,0.15),transparent_70%)] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Official SeaSentinel AI Logo Artwork */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-marine-950/80 border border-cyan-500/40 p-2 shrink-0 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              <img
                src={seasentialLogo}
                alt="SeaSentinel AI Official Logo"
                className="w-full h-full object-contain"
              />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold tracking-wider">
                  SeaSentinel AI
                </span>
                <span className="px-2.5 py-0.5 rounded bg-marine-800 text-slate-300 border border-marine-700 text-xs font-mono">
                  SIH 26057
                </span>
                <span className="px-2.5 py-0.5 rounded bg-marine-800 text-slate-300 border border-marine-700 text-xs font-mono">
                  MoES / NIOT
                </span>
                <span className="px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-medium">
                  STEP 1: DESIGN SYSTEM
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight uppercase">
                AI Marine Debris & Sonar Anomaly Detection System
              </h1>

              <div className="text-xs sm:text-sm font-mono text-cyan-400 mt-1 tracking-wider uppercase font-semibold">
                “SEE BENEATH. DETECT BEYOND.”
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="outline"
              size="sm"
              icon={RotateCcw}
              onClick={() => window.location.reload()}
            >
              Reload
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={Zap}
              onClick={simulateProcessing}
              isLoading={buttonLoading}
            >
              Trigger AI Sweep
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Live Telemetry HUD Strip */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400 font-mono flex items-center gap-2">
            <Activity size={14} /> Live Survey Telemetry HUD
          </h2>
          <span className="text-[11px] font-mono text-slate-400">ORV SAGAR NIDHI • SECTOR 4</span>
        </div>
        <TelemetryHUD telemetry={CURRENT_TELEMETRY} />
      </section>

      {/* 3. Color Tokens & Severity System */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-marine-800 pb-2">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Layers size={16} className="text-cyan-400" />
              01. Color Palette & Status Token System
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Strict semantic mapping for marine risk evaluation and AI processing states.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500">TOKENS: 5 SEVERITIES</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {/* Low Severity */}
          <div className="p-4 rounded-md bg-marine-900 border border-emerald-500/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 font-mono">LOW SEVERITY</span>
              <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            </div>
            <div className="text-xs text-slate-300">Small isolated debris, low entanglement risk (e.g. plastic fragments, single tire).</div>
            <div className="text-[10px] font-mono text-emerald-400/80 pt-1 border-t border-marine-800">
              Token: #10B981 (Green)
            </div>
          </div>

          {/* Medium Severity */}
          <div className="p-4 rounded-md bg-marine-900 border border-amber-500/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 font-mono">MEDIUM SEVERITY</span>
              <div className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
            </div>
            <div className="text-xs text-slate-300">Debris cluster, tire pile, or navigation obstacle requiring periodic survey logging.</div>
            <div className="text-[10px] font-mono text-amber-400/80 pt-1 border-t border-marine-800">
              Token: #F59E0B (Amber)
            </div>
          </div>

          {/* High Severity */}
          <div className="p-4 rounded-md bg-marine-900 border border-red-500/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-red-400 font-mono">HIGH SEVERITY</span>
              <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
            </div>
            <div className="text-xs text-slate-300">Ghost fishing nets, submerged containers, wreckages posing critical hazard to submersibles.</div>
            <div className="text-[10px] font-mono text-red-400/80 pt-1 border-t border-marine-800">
              Token: #EF4444 (Red)
            </div>
          </div>

          {/* Unknown Anomaly */}
          <div className="p-4 rounded-md bg-marine-900 border border-purple-500/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-400 font-mono">UNKNOWN ANOMALY</span>
              <div className="w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
            </div>
            <div className="text-xs text-slate-300">Unclassified acoustic shadow, unexpected regular geometry, or novel seafloor object.</div>
            <div className="text-[10px] font-mono text-purple-400/80 pt-1 border-t border-marine-800">
              Token: #A855F7 (Purple)
            </div>
          </div>

          {/* AI Processing */}
          <div className="p-4 rounded-md bg-marine-900 border border-cyan-500/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400 font-mono">AI PROCESSING</span>
              <div className="w-3 h-3 rounded-full bg-cyan-500 animate-ping" />
            </div>
            <div className="text-xs text-slate-300">Active YOLO inference, side-scan sonar waterfall segmentation, and acoustic feature extraction.</div>
            <div className="text-[10px] font-mono text-cyan-400/80 pt-1 border-t border-marine-800">
              Token: #06B6D4 (Cyan)
            </div>
          </div>
        </div>
      </section>

      {/* 4. Status Badges & General Tags */}
      <section className="space-y-4">
        <div className="border-b border-marine-800 pb-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            02. Status Badges & AI Indicators
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Compact telemetry badges used across waterfall tables, detection cards, and mission feeds.
          </p>
        </div>

        <div className="p-5 rounded-md bg-marine-900/60 border border-marine-800 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status="low" />
            <StatusBadge status="medium" />
            <StatusBadge status="high" />
            <StatusBadge status="anomaly" />
            <StatusBadge status="ai" pulse />
            <StatusBadge status="active" />
            <StatusBadge status="standby" />
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-marine-800">
            <span className="text-xs text-slate-400 font-mono">Size Variants:</span>
            <StatusBadge status="high" size="sm" />
            <StatusBadge status="high" size="md" />
            <StatusBadge status="high" size="lg" />
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-marine-800">
            <span className="text-xs text-slate-400 font-mono">General Metadata Tags:</span>
            <Badge variant="cyan" dot>EdgeTech 4200</Badge>
            <Badge variant="teal">900 kHz High-Res</Badge>
            <Badge variant="default">Transect 04-B</Badge>
            <Badge variant="slate">GPS Lock</Badge>
            <Badge variant="outline">PostGIS v3.4</Badge>
          </div>
        </div>
      </section>

      {/* 5. Numeric Statistics Cards (StatCard) */}
      <section className="space-y-4">
        <div className="border-b border-marine-800 pb-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            03. Statistic Cards & Telemetry Counters
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Large numeric telemetry counters with trends, icons, and technical badges.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Sonar Detections"
            value="42"
            unit="TARGETS"
            change={{ value: '+8 in last transect', trend: 'up' }}
            icon={AlertOctagon}
            variant="red"
            telemetryTag="AI FILTERED"
          />

          <StatCard
            label="Unclassified Anomalies"
            value="6"
            unit="ANOMALIES"
            change={{ value: '+2 flagged', trend: 'up' }}
            icon={HelpCircle}
            variant="purple"
            telemetryTag="UNKNOWN POOL"
          />

          <StatCard
            label="AI Inference Speed"
            value={CURRENT_TELEMETRY.aiInferenceFps}
            unit="FPS"
            change={{ value: '31.2ms latency', trend: 'neutral' }}
            icon={Cpu}
            variant="cyan"
            telemetryTag="CUDA 12.4"
          />

          <StatCard
            label="Survey Area Covered"
            value="48.6"
            unit="km²"
            change={{ value: '82% of plan', trend: 'up' }}
            icon={Waves}
            variant="teal"
            telemetryTag="SWATH: 250m"
          />
        </div>
      </section>

      {/* 6. Buttons & Interactive Controls */}
      <section className="space-y-4">
        <div className="border-b border-marine-800 pb-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            04. Action Buttons & Interactive States
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Tactical buttons with hover feedback, loading indicators, and distinct hierarchy.
          </p>
        </div>

        <div className="p-5 rounded-md bg-marine-900/60 border border-marine-800 space-y-5">
          {/* Variants */}
          <div>
            <div className="text-xs font-mono text-slate-400 mb-2.5">BUTTON VARIANTS:</div>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary" icon={Play}>Primary Action</Button>
              <Button variant="secondary" icon={Filter}>Secondary Option</Button>
              <Button variant="outline" icon={Download}>Export Sonar Raw</Button>
              <Button variant="ai" icon={Cpu}>AI Inference</Button>
              <Button variant="danger" icon={AlertTriangle}>Abort Survey</Button>
              <Button variant="anomaly" icon={HelpCircle}>Flag Anomaly</Button>
              <Button variant="ghost">Ghost Button</Button>
            </div>
          </div>

          {/* Sizes & States */}
          <div className="pt-4 border-t border-marine-800">
            <div className="text-xs font-mono text-slate-400 mb-2.5">SIZES & STATES:</div>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="xs" variant="primary">Mini XS</Button>
              <Button size="sm" variant="primary">Small SM</Button>
              <Button size="md" variant="primary">Default MD</Button>
              <Button size="lg" variant="primary">Large LG</Button>
              <Button variant="primary" isLoading>Processing...</Button>
              <Button variant="secondary" disabled>Disabled State</Button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Marine Sonar HUD & Anomaly Warning */}
      <section className="space-y-4">
        <div className="border-b border-marine-800 pb-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Radar size={16} className="text-cyan-400" />
            05. Sonar Radar & Tactical AI Analysis Widgets
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Side-scan sonar radar sweep simulator, unclassified anomaly cards, and precision confidence meters.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
          {/* Radar Sweep Widget */}
          <Card className="flex flex-col items-center justify-center p-6 text-center" cornerBrackets>
            <CardHeader
              title="Sonar Radar Sweep Simulator"
              subtitle="Simulated Transducer 360° Acoustic Return"
              icon={Radar}
              className="w-full"
            />
            <SonarSweepOverlay />
            <div className="text-[11px] text-slate-400 font-mono mt-4 flex items-center justify-between w-full">
              <span>RANGE: 250m</span>
              <span className="text-cyan-400 font-semibold">4 TARGETS IN SWATH</span>
            </div>
          </Card>

          {/* AI Precision & Confidence Meters */}
          <Card className="space-y-5 p-5" cornerBrackets>
            <CardHeader
              title="AI Confidence & Precision"
              subtitle="YOLOv11 Multi-Scale Feature Extractors"
              icon={Cpu}
            />

            <div className="space-y-4">
              <ConfidenceMeter
                confidence={0.962}
                modelName="YOLOv11-MarineDebris (Ghost Net)"
              />
              <ConfidenceMeter
                confidence={0.884}
                modelName="DeepShadow Anomaly Classifier"
              />
              <ConfidenceMeter
                confidence={0.645}
                modelName="Low-Reflectivity Polymer Detector"
              />
              <ConfidenceMeter
                confidence={0.38}
                modelName="Biological Coral Filter"
              />
            </div>

            <div className="p-3 rounded bg-marine-950 border border-marine-800 text-xs text-slate-400">
              Confidence scores are calculated from acoustic shadow geometry, pixel backscatter intensity, and aspect ratio.
            </div>
          </Card>

          {/* Anomaly Indicator Card & Interactive Trigger */}
          <Card className="space-y-4 p-5" cornerBrackets>
            <CardHeader
              title="Anomaly Detection Warning"
              subtitle="High Priority Unknown Signature"
              icon={HelpCircle}
            />

            <AnomalyIndicator
              score={0.884}
              title="Cylindrical Acoustic Target #0942"
              shadowLengthMeters={14.2}
            />

            <div className="space-y-2">
              <Button
                variant="anomaly"
                className="w-full"
                icon={Eye}
                onClick={() => setIsAnomalyModalOpen(true)}
              >
                Inspect Unknown Anomaly Modal
              </Button>
              <Button
                variant="outline"
                className="w-full"
                icon={ExternalLink}
                onClick={() => setIsSampleModalOpen(true)}
              >
                View Detection Modal Dialog
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* 8. Form Controls, Dropdowns & Search */}
      <section className="space-y-4">
        <div className="border-b border-marine-800 pb-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            06. Form Inputs & Tactical Dropdowns
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Precision inputs with unit suffixes, keyboard shortcuts, and dropdown selectors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 rounded-md bg-marine-900/60 border border-marine-800">
          <Input
            label="Search Detections"
            placeholder="Search by ID, class, coordinates..."
            icon={Search}
            shortcut="⌘K"
          />

          <Dropdown
            label="Filter By Debris Classification"
            options={[
              { value: 'all', label: 'All Classifications (42 Targets)' },
              { value: 'nets', label: 'Ghost Fishing Nets', badge: '14' },
              { value: 'containers', label: 'Metallic Containers', badge: '5' },
              { value: 'anomalies', label: 'Unidentified Anomalies', badge: '6' },
              { value: 'tires', label: 'Rubber / Tire Clusters', badge: '11' },
            ]}
            value={dropdownValue}
            onChange={(val) => setDropdownValue(val)}
          />

          <Input
            label="Sonar Tow Depth"
            defaultValue="142.6"
            unit="m"
            helperText="Nominal towfish altitude: 12-15m above seabed"
          />
        </div>
      </section>

      {/* 9. Navigation Tabs & Progress Bars */}
      <section className="space-y-4">
        <div className="border-b border-marine-800 pb-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            07. Tabs & Progress Gauges
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Underline, segmented, and pill tabs along with glowing AI progress bars.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 p-5 rounded-md bg-marine-900/60 border border-marine-800">
          {/* Tabs Showcase */}
          <div className="space-y-4">
            <div className="text-xs font-mono text-slate-400">UNDERLINE TABS (Standard):</div>
            <Tabs
              variant="underline"
              tabs={[
                { id: 'all', label: 'All Detections', badge: 42 },
                { id: 'verified', label: 'Verified Targets', badge: 28 },
                { id: 'flagged', label: 'Anomalies', badge: 6 },
              ]}
              activeTab={activeTabUnderline}
              onChange={setActiveTabUnderline}
            />

            <div className="text-xs font-mono text-slate-400 pt-2">PILL TABS (Filters):</div>
            <Tabs
              variant="pills"
              size="sm"
              tabs={[
                { id: 'all', label: 'All Severities' },
                { id: 'high', label: 'High Severity', badge: 12 },
                { id: 'anomaly', label: 'Unknown Anomaly', badge: 6 },
              ]}
              activeTab={activeTabPills}
              onChange={setActiveTabPills}
            />

            <div className="text-xs font-mono text-slate-400 pt-2">SEGMENTED CONTROLS:</div>
            <Tabs
              variant="segmented"
              size="sm"
              tabs={[
                { id: '450khz', label: '450 kHz Low-Freq' },
                { id: '900khz', label: '900 kHz High-Res' },
                { id: 'dual', label: 'Dual Synchronized' },
              ]}
              activeTab={activeTabSegmented}
              onChange={setActiveTabSegmented}
            />
          </div>

          {/* Progress Bars */}
          <div className="space-y-4">
            <div className="text-xs font-mono text-slate-400">PROGRESS & INFERENCE BARS:</div>

            <ProgressBar
              label="Sonar Waterfall AI Inference"
              sublabel="YOLOv11x + Deep Acoustic Segmenter"
              value={progressVal}
              variant="cyan"
              isPulsing
            />

            <ProgressBar
              label="Transect Coverage Progress"
              sublabel="Coromandel Trench Sector 4"
              value={82}
              variant="teal"
            />

            <ProgressBar
              label="Storage Allocation (PostGIS Datastore)"
              sublabel="418.6 GB / 2048 GB"
              value={32}
              variant="emerald"
            />

            <ProgressBar
              label="High Entanglement Risk Index"
              value={94}
              variant="red"
            />
          </div>
        </div>
      </section>

      {/* 10. Alerts & Telemetry Notifications */}
      <section className="space-y-4">
        <div className="border-b border-marine-800 pb-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            08. Alerts & Technical Banners
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Dismissible alert banners matching the 5 severity token classifications.
          </p>
        </div>

        <div className="space-y-3">
          <Alert
            variant="anomaly"
            title="Acoustic Shadow Anomaly Flagged"
            tag="UNKNOWN SIGNATURE"
            dismissible
            action={
              <Button size="xs" variant="anomaly" onClick={() => setIsAnomalyModalOpen(true)}>
                Inspect Target #0942
              </Button>
            }
          >
            AI anomaly detection module identified a 14.2m acoustic shadow with regular cylindrical structure at 13.0895°N, 80.2812°E. Does not match known biological or natural geological formations.
          </Alert>

          <Alert
            variant="danger"
            title="High Entanglement Hazard Detected"
            tag="SAFETY WARNING"
            dismissible
          >
            Ghost fishing net cluster DET-26057-0941 spans 18.5 meters in active submersible corridor. High risk of thruster fouling.
          </Alert>

          <Alert
            variant="warning"
            title="Towfish Altitude Advisory"
            tag="TELEMETRY"
            dismissible
          >
            Towfish altitude reduced to 10.8m over uneven seafloor bathymetry. Recommended altitude is 12m-15m.
          </Alert>

          <Alert
            variant="success"
            title="Side-Scan Sonar Calibration Verified"
            tag="NIOT PROTOCOL"
            dismissible
          >
            EdgeTech 4200 dual-frequency ping synchronizer locked at 24 pings/sec. Zero acoustic packet loss.
          </Alert>
        </div>
      </section>

      {/* 11. Sortable Detection Data Table */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-marine-800 pb-2">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              09. Sonar Detections Data Table
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Interactive table with sorting, pagination, status badges, and precision coordinates.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Tooltip content="Export CSV dataset for MoES archive" shortcut="⌥E">
              <Button variant="secondary" size="xs" icon={Download}>Export CSV</Button>
            </Tooltip>
          </div>
        </div>

        <Table
          columns={columns}
          data={MOCK_DETECTIONS}
          keyExtractor={(item) => item.id}
          pageSize={4}
          onRowClick={(item) => {
            setSelectedDetection(item);
            if (item.severity === 'anomaly') {
              setIsAnomalyModalOpen(true);
            } else {
              setIsSampleModalOpen(true);
            }
          }}
        />
      </section>

      {/* 12. Tooltips, Empty States & Loading States */}
      <section className="space-y-4">
        <div className="border-b border-marine-800 pb-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            10. Tooltips, Loading Skeletons & Radar Empty States
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Loading states and radar empty fallbacks for quiet seafloor transects.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Radar Empty State */}
          <EmptyState
            title="Transect Sector Clear"
            description="No debris or acoustic anomalies recorded along transect 04-B."
            actionLabel="Scan Next Transect"
            onAction={() => alert('Advancing to next transect...')}
          />

          {/* Sonar Ping Loader */}
          <Card className="flex flex-col items-center justify-center p-6 text-center" cornerBrackets>
            <SonarPingLoader
              label="AI Inference Engine Active"
              sublabel="Segmenting 900 kHz acoustic waterfall"
            />
          </Card>

          {/* Skeleton Loaders & Tooltip Demo */}
          <Card className="p-5 space-y-4" cornerBrackets>
            <div className="text-xs font-mono text-slate-400">SKELETON LOADERS:</div>
            <Skeleton lines={3} />
            <div className="h-10 bg-marine-800/40 rounded animate-pulse border border-marine-700/30" />

            <div className="pt-3 border-t border-marine-800">
              <div className="text-xs font-mono text-slate-400 mb-2">TELEMETRY TOOLTIPS:</div>
              <div className="flex flex-wrap gap-3">
                <Tooltip content="Towfish Altitude Sensor (Alt: 14.2m)" shortcut="⌘1" position="top">
                  <Button variant="secondary" size="xs">Hover for Altitude</Button>
                </Tooltip>
                <Tooltip content="Side-Scan Swath: 125m Starboard / Port" position="bottom">
                  <Button variant="secondary" size="xs">Hover for Swath</Button>
                </Tooltip>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* 13. Interactive Detection Modal Dialog */}
      {selectedDetection && (
        <Modal
          isOpen={isSampleModalOpen}
          onClose={() => setIsSampleModalOpen(false)}
          title={`Sonar Detection Record: ${selectedDetection.trackingId}`}
          subtitle={`${selectedDetection.classification} • MoES / NIOT Oceanographic Record`}
          icon={AlertOctagon}
          size="lg"
          footer={
            <div className="flex items-center justify-between w-full">
              <span className="text-[11px] font-mono text-slate-400">
                Timestamp: {selectedDetection.timestamp}
              </span>
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" onClick={() => setIsSampleModalOpen(false)}>
                  Close
                </Button>
                <Button variant="primary" size="sm" onClick={() => setIsSampleModalOpen(false)}>
                  Mark Verified
                </Button>
              </div>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 rounded bg-marine-950 border border-marine-800 space-y-1.5">
                <div className="text-[10px] uppercase font-mono text-slate-400">Classification & Severity</div>
                <div className="text-sm font-bold text-white">{selectedDetection.classification}</div>
                <StatusBadge status={selectedDetection.severity} size="sm" />
              </div>

              <div className="p-3 rounded bg-marine-950 border border-marine-800 space-y-1.5">
                <div className="text-[10px] uppercase font-mono text-slate-400">AI Confidence Score</div>
                <ConfidenceMeter confidence={selectedDetection.confidence} size="md" />
              </div>
            </div>

            <div className="p-3 rounded bg-marine-950 border border-marine-800 space-y-2">
              <div className="text-[10px] uppercase font-mono text-slate-400">Geographic Coordinates & Depth</div>
              <TechnicalCoords
                latitude={selectedDetection.latitude}
                longitude={selectedDetection.longitude}
                depth={selectedDetection.waterDepth}
              />
            </div>

            <div className="p-3.5 rounded bg-marine-950/80 border border-marine-800 text-xs space-y-1">
              <div className="font-semibold text-slate-300 font-mono">Oceanographer Analyst Notes:</div>
              <p className="text-slate-400 leading-relaxed">{selectedDetection.notes}</p>
            </div>
          </div>
        </Modal>
      )}

      {/* 14. Interactive Anomaly Modal Dialog */}
      <Modal
        isOpen={isAnomalyModalOpen}
        onClose={() => setIsAnomalyModalOpen(false)}
        title="Unknown Sonar Anomaly Investigation"
        subtitle="Unclassified High-Reflectivity Target DET-26057-0942"
        icon={HelpCircle}
        severity="anomaly"
        size="lg"
        footer={
          <div className="flex items-center justify-between w-full">
            <span className="text-[11px] font-mono text-purple-300 flex items-center gap-1">
              <HelpCircle size={13} /> Flagged for Autonomous Underwater Vehicle (AUV) Verification
            </span>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" onClick={() => setIsAnomalyModalOpen(false)}>
                Dismiss
              </Button>
              <Button variant="anomaly" size="sm" onClick={() => setIsAnomalyModalOpen(false)}>
                Dispatch ROV Survey
              </Button>
            </div>
          </div>
        }
      >
        <div className="space-y-4">
          <Alert variant="anomaly" title="Novel Acoustic Geometry" tag="HIGH PRIORITY">
            The target exhibits a 14.2m acoustic shadow cast across a sandy seabed with a sharp linear boundary indicative of a manufactured cylindrical structure.
          </Alert>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded bg-marine-950 border border-marine-800 text-xs">
              <div className="text-slate-400 text-[10px] uppercase font-mono">Estimated Dimensions</div>
              <div className="text-white font-mono font-bold mt-1">12.0m × 2.4m × 2.4m</div>
            </div>
            <div className="p-3 rounded bg-marine-950 border border-marine-800 text-xs">
              <div className="text-slate-400 text-[10px] uppercase font-mono">Towfish Depth</div>
              <div className="text-white font-mono font-bold mt-1">-162.0 meters</div>
            </div>
            <div className="p-3 rounded bg-marine-950 border border-marine-800 text-xs">
              <div className="text-slate-400 text-[10px] uppercase font-mono">Acoustic Frequency</div>
              <div className="text-cyan-300 font-mono font-bold mt-1">450 kHz Low-Freq</div>
            </div>
          </div>

          <div className="p-3 rounded bg-marine-950 border border-purple-500/30">
            <div className="text-xs font-semibold text-purple-200 font-mono mb-1">
              Deep Neural Feature Match:
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Anomaly score: <span className="text-purple-300 font-mono font-bold">88.4%</span> deviation from seafloor baseline. No matching standard biological or geological class in MoES/NIOT Indian Ocean database.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};
