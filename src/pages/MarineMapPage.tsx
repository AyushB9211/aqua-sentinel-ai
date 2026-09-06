import React, { useState } from 'react';
import {
  Map,
  Compass,
  Ship,
  CheckCircle2,
  AlertOctagon,
  Eye,
  ShieldCheck,
  Check,
  ArrowRight,
  Crosshair,
  Layers,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { TechnicalCoords } from '../components/marine/TechnicalCoords';
import { useDemo } from '../context/DemoContext';
import { SonarDetection } from '../types/marine';
import { cn } from '../utils/cn';

export interface MarineMapPageProps {
  onNavigate?: (routeId: string) => void;
}

export const MarineMapPage: React.FC<MarineMapPageProps> = ({ onNavigate }) => {
  const {
    detections,
    selectedDetectionId,
    selectDetection,
    toggleVerifyDetection,
  } = useDemo();

  const [showContours, setShowContours] = useState(true);
  const [showSwathTrack, setShowSwathTrack] = useState(true);
  const [showHazards, setShowHazards] = useState(true);

  // Default to selected detection or first detection (Shipwreck)
  const activeTarget =
    detections.find((d) => d.id === selectedDetectionId) || detections[0];

  const getMarkerStyle = (priority: string, isSelected: boolean) => {
    switch (priority) {
      case 'HIGH':
        return isSelected
          ? 'border-red-400 bg-red-500/40 ring-4 ring-red-400/50 shadow-[0_0_20px_rgba(239,68,68,0.9)] scale-125'
          : 'border-red-400 bg-red-500/40 shadow-[0_0_12px_rgba(239,68,68,0.7)]';
      case 'MEDIUM':
        return isSelected
          ? 'border-amber-400 bg-amber-500/40 ring-4 ring-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.9)] scale-125'
          : 'border-amber-400 bg-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.7)]';
      case 'LOW':
      default:
        return isSelected
          ? 'border-emerald-400 bg-emerald-500/40 ring-4 ring-emerald-400/50 shadow-[0_0_20px_rgba(16,185,129,0.9)] scale-125'
          : 'border-emerald-400 bg-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.7)]';
    }
  };

  return (
    <div className="space-y-4 pb-12 select-none">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-lg bg-marine-900/90 border border-cyan-500/30 backdrop-blur-md corner-brackets">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono font-bold">
              POSTGIS GEOSPATIAL MAP
            </span>
            <span className="text-xs font-mono text-slate-400">SECTOR 4 • 18.2456°N 72.8614°E</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight uppercase">
            Bathymetric & GIS Marine Map
          </h1>
          <p className="text-xs text-slate-300 mt-0.5 font-normal">
            Real-time georeferenced Side-Scan Sonar detection targets & vessel trackline.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <TechnicalCoords latitude={18.2456} longitude={72.8614} depth={142.6} />
        </div>
      </div>

      {/* 2. Map Screen Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Main Map Canvas (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <Card className="p-3.5 sm:p-4 bg-marine-900/90 border-marine-800" cornerBrackets>
            {/* Map Layer Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-marine-800 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">LAYERS:</span>
                <button
                  onClick={() => setShowContours(!showContours)}
                  className={cn(
                    'px-2 py-0.5 rounded border text-[11px] font-bold transition-colors',
                    showContours ? 'bg-cyan-950 text-cyan-300 border-cyan-500/40' : 'bg-marine-900 text-slate-400 border-marine-750'
                  )}
                >
                  Bathymetry Contours
                </button>
                <button
                  onClick={() => setShowSwathTrack(!showSwathTrack)}
                  className={cn(
                    'px-2 py-0.5 rounded border text-[11px] font-bold transition-colors',
                    showSwathTrack ? 'bg-cyan-950 text-cyan-300 border-cyan-500/40' : 'bg-marine-900 text-slate-400 border-marine-750'
                  )}
                >
                  Sonar Swath Track
                </button>
                <button
                  onClick={() => setShowHazards(!showHazards)}
                  className={cn(
                    'px-2 py-0.5 rounded border text-[11px] font-bold transition-colors',
                    showHazards ? 'bg-red-950 text-red-300 border-red-500/40' : 'bg-marine-900 text-slate-400 border-marine-750'
                  )}
                >
                  Hazards ({detections.length})
                </button>
              </div>

              <span className="text-cyan-400 font-bold">1:25,000 SPATIAL SCALE</span>
            </div>

            {/* GIS Map Vector Canvas */}
            <div className="relative aspect-[16/10] min-h-[460px] w-full rounded-md bg-[#040a14] border border-marine-750 overflow-hidden select-none">
              {/* Map Grid Background */}
              <div className="absolute inset-0 sonar-grid-bg opacity-35 pointer-events-none" />

              {/* Bathymetric Contours SVG */}
              {showContours && (
                <svg className="absolute inset-0 w-full h-full opacity-40 pointer-events-none">
                  {/* Depth lines */}
                  <path d="M0,80 Q150,60 300,90 T600,70" stroke="#0284c7" strokeWidth="1" fill="none" />
                  <text x="20" y="75" fill="#0284c7" fontSize="9" fontFamily="Inter, sans-serif">-50m</text>

                  <path d="M0,180 Q200,150 400,200 T800,160" stroke="#0369a1" strokeWidth="1.2" fill="none" />
                  <text x="20" y="175" fill="#0369a1" fontSize="9" fontFamily="Inter, sans-serif">-100m</text>

                  <path d="M0,280 Q250,260 500,310 T900,270" stroke="#075985" strokeWidth="1.5" fill="none" />
                  <text x="20" y="275" fill="#075985" fontSize="9" fontFamily="Inter, sans-serif">-150m</text>
                </svg>
              )}

              {/* Sonar Swath Coverage Corridor */}
              {showSwathTrack && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {/* Swath bounding polygon */}
                  <polygon
                    points="80,120 480,260 460,310 60,170"
                    fill="rgba(6, 182, 212, 0.12)"
                    stroke="rgba(6, 182, 212, 0.5)"
                    strokeWidth="1.2"
                    strokeDasharray="4 2"
                  />
                  {/* Towfish flight path centerline */}
                  <line x1="70" y1="145" x2="470" y2="285" stroke="#00e5ff" strokeWidth="2" />
                </svg>
              )}

              {/* Research Vessel Position Marker */}
              <div
                className="absolute z-30 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center cursor-pointer group"
                style={{ left: '72%', top: '65%' }}
              >
                <div className="w-8 h-8 rounded-full bg-cyan-950/90 border-2 border-cyan-400 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.8)]">
                  <Ship size={16} className="animate-pulse" />
                </div>
                <div className="absolute left-9 whitespace-nowrap bg-marine-950/90 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-marine-750 shadow-lg">
                  RV Samudra Nidhi (3.1 kts)
                </div>
              </div>

              {/* Georeferenced Detection Target Markers (3 Targets) */}
              {showHazards &&
                detections.map((det) => {
                  const isSelected = activeTarget?.id === det.id;
                  const mapPos =
                    det.id === 'det-demo-01'
                      ? { x: 68, y: 38 }
                      : det.id === 'det-demo-02'
                      ? { x: 35, y: 62 }
                      : { x: 52, y: 74 };

                  return (
                    <div
                      key={det.id}
                      onClick={() => selectDetection(det.id)}
                      className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                      style={{ left: `${mapPos.x}%`, top: `${mapPos.y}%` }}
                    >
                      {/* Marker Node */}
                      <div
                        className={cn(
                          'w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-200',
                          getMarkerStyle(det.priority, isSelected)
                        )}
                      />

                      {/* Tooltip Label */}
                      <div
                        className={cn(
                          'absolute left-5 top-1/2 -translate-y-1/2 whitespace-nowrap text-[10px] font-mono font-bold px-2 py-1 rounded shadow-xl flex items-center gap-1.5 transition-opacity',
                          isSelected
                            ? 'bg-[#0f1f38] text-cyan-300 border border-cyan-400 ring-1 ring-cyan-400/40 opacity-100'
                            : 'bg-marine-900/90 border border-marine-700 text-white opacity-80 group-hover:opacity-100'
                        )}
                      >
                        <span>{det.classification}</span>
                        <span className="text-white">{(det.confidence * 100).toFixed(0)}%</span>
                        {det.isVerified && (
                          <span className="text-emerald-400 text-[9px]">✓ VERIFIED</span>
                        )}
                      </div>
                    </div>
                  );
                })}

              {/* Compass Rose on Map */}
              <div className="absolute top-4 right-4 p-2 rounded-full bg-marine-950/80 border border-marine-750 text-cyan-400 pointer-events-none">
                <Compass size={24} className="animate-spin-slow" />
              </div>
            </div>
          </Card>
        </div>

        {/* Selected Target Detail & Spatial Summary Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Active Target Inspector Card */}
          {activeTarget && (
            <Card className="p-4 bg-marine-900/90 border-cyan-500/40 space-y-3.5" cornerBrackets>
              <div className="flex items-center justify-between border-b border-marine-800 pb-2">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">
                    Selected Marine Target
                  </span>
                  <div className="text-base font-bold text-white font-mono uppercase">
                    {activeTarget.classification}
                  </div>
                </div>

                <span
                  className={cn(
                    'text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase flex items-center gap-1',
                    activeTarget.isVerified
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                      : 'bg-cyan-950 text-cyan-300 border-cyan-500/50'
                  )}
                >
                  {activeTarget.isVerified ? (
                    <>
                      <Check size={11} /> VERIFIED
                    </>
                  ) : (
                    'AI DETECTED'
                  )}
                </span>
              </div>

              {/* Target Geodetic Telemetry */}
              <div className="space-y-2 text-xs font-mono text-slate-300">
                <div className="p-2 rounded bg-marine-950 border border-marine-800 flex justify-between">
                  <span className="text-slate-400">Confidence:</span>
                  <span className="text-emerald-400 font-bold">
                    {(activeTarget.confidence * 100).toFixed(1)}% Match
                  </span>
                </div>
                <div className="p-2 rounded bg-marine-950 border border-marine-800 flex justify-between">
                  <span className="text-slate-400">Severity Level:</span>
                  <span
                    className={cn(
                      'font-bold uppercase',
                      activeTarget.priority === 'HIGH'
                        ? 'text-red-400'
                        : activeTarget.priority === 'MEDIUM'
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    )}
                  >
                    {activeTarget.priority}
                  </span>
                </div>
                <div className="p-2 rounded bg-marine-950 border border-marine-800 flex justify-between">
                  <span className="text-slate-400">Latitude / Longitude:</span>
                  <span className="text-cyan-300">
                    {activeTarget.latitude.toFixed(4)}°, {activeTarget.longitude.toFixed(4)}°
                  </span>
                </div>
                <div className="p-2 rounded bg-marine-950 border border-marine-800 flex justify-between">
                  <span className="text-slate-400">Seafloor Depth:</span>
                  <span className="text-teal-300 font-bold">
                    -{activeTarget.waterDepth.toFixed(1)} m
                  </span>
                </div>
                <div className="p-2 rounded bg-marine-950 border border-marine-800 flex justify-between">
                  <span className="text-slate-400">Estimated Dimensions:</span>
                  <span className="text-white">
                    {activeTarget.estimatedDimensions.length}m × {activeTarget.estimatedDimensions.width}m
                  </span>
                </div>
              </div>

              {/* Actions: Verify & Return to Sonar Analysis */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Button
                  variant={activeTarget.isVerified ? 'outline' : 'primary'}
                  size="sm"
                  icon={CheckCircle2}
                  onClick={() => toggleVerifyDetection(activeTarget.id)}
                  className="text-xs font-semibold"
                >
                  {activeTarget.isVerified ? '✓ VERIFIED' : 'VERIFY'}
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onNavigate?.('sonar-analysis')}
                  className="text-xs font-semibold text-cyan-300 hover:text-white"
                >
                  Sonar Deck <ArrowRight size={13} className="ml-1" />
                </Button>
              </div>
            </Card>
          )}

          {/* Spatial Summary Card */}
          <Card className="p-4 space-y-3 bg-marine-900/90 border-marine-800" cornerBrackets>
            <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              Survey Spatial Summary
            </div>

            <div className="space-y-1.5 text-xs font-mono text-slate-300">
              <div className="p-2 rounded bg-marine-950 border border-marine-800 flex justify-between">
                <span className="text-slate-400">Survey Code:</span>
                <span className="text-white font-bold">MS-0048</span>
              </div>
              <div className="p-2 rounded bg-marine-950 border border-marine-800 flex justify-between">
                <span className="text-slate-400">Vessel:</span>
                <span className="text-teal-300">RV Samudra Nidhi</span>
              </div>
              <div className="p-2 rounded bg-marine-950 border border-marine-800 flex justify-between">
                <span className="text-slate-400">Active Scan ID:</span>
                <span className="text-cyan-300">SSS-DEMO-001</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
