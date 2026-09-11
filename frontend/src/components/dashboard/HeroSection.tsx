import React from 'react';
import { PlusCircle, ArrowRight, Compass, Waves } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';

export interface HeroSectionProps {
  onStartMission: () => void;
  onViewMissions: () => void;
  className?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartMission,
  onViewMissions,
  className,
}) => {
  return (
    <div
      className={cn(
        'relative w-full rounded-lg bg-gradient-to-r from-[#030712] via-[#071328] to-[#040a17] border border-cyan-500/30 overflow-hidden shadow-xl p-4 sm:p-5 corner-brackets',
        className
      )}
    >
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        {/* Left Content (7 cols) */}
        <div className="lg:col-span-7 space-y-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/90 text-cyan-300 border border-cyan-500/40 text-[11px] font-mono font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              SeaSentinel AI • SIH 26057
            </span>
            <span className="px-2 py-0.5 rounded-full bg-marine-900 text-slate-300 border border-marine-750 text-[11px] font-mono">
              MoES / NIOT
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-xs font-semibold text-cyan-400">
              Good afternoon, Operator
            </div>
            <h1 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-white tracking-tight leading-tight uppercase">
              AI-Powered Underwater Marine<br className="hidden sm:inline" />
              Debris & Anomaly Detection System
            </h1>
          </div>

          <p className="text-xs text-slate-300 max-w-xl leading-relaxed font-normal">
            Advanced AI-powered intelligence for cleaner oceans. Continuous acoustic waterfall inspection, deep neural classification, and real-time benthic hazard mapping.
          </p>

          {/* Action Buttons */}
          <div className="pt-1 flex flex-wrap items-center gap-2.5">
            <Button
              variant="primary"
              size="sm"
              icon={PlusCircle}
              onClick={onStartMission}
              className="text-xs font-semibold shadow-[0_0_15px_rgba(6,182,212,0.4)]"
            >
              START SONAR ANALYSIS <ArrowRight size={13} className="ml-1" />
            </Button>

            <Button
              variant="secondary"
              size="sm"
              icon={Compass}
              onClick={onViewMissions}
              className="text-xs font-medium"
            >
              View All Missions <ArrowRight size={13} className="ml-1" />
            </Button>
          </div>
        </div>

        {/* Right Sonar Acoustic Ray-Tracing Illustration (5 cols) */}
        <div className="lg:col-span-5 flex items-center justify-center">
          <div className="relative w-full max-w-sm aspect-[16/9] rounded-md bg-[#02060e] border border-cyan-500/25 p-2 overflow-hidden shadow-inner shadow-black">
            {/* Grid background */}
            <div className="absolute inset-0 sonar-grid-bg opacity-30 pointer-events-none" />

            {/* Depth Markers */}
            <div className="absolute left-2 top-2 bottom-2 flex flex-col justify-between text-[9px] font-mono text-slate-500 pointer-events-none select-none">
              <span>0m</span>
              <span>-50m</span>
              <span>-100m</span>
              <span className="text-cyan-300 font-bold">-142.6m</span>
            </div>

            {/* Vector Sonar Graphic */}
            <svg
              viewBox="0 0 400 220"
              className="w-full h-full text-cyan-400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Sea Surface */}
              <line x1="35" y1="28" x2="385" y2="28" stroke="rgba(56, 189, 248, 0.4)" strokeWidth="1.2" strokeDasharray="4 2" />

              {/* Research Vessel Silhouette */}
              <g transform="translate(165, 12)">
                <path d="M0,14 L12,18 L55,18 L68,14 L58,6 L16,6 Z" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.2" />
                <rect x="22" y="0" width="20" height="6" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
                <line x1="32" y1="0" x2="32" y2="-5" stroke="#00e5ff" strokeWidth="1.2" />
                <circle cx="32" cy="18" r="2.5" fill="#00e5ff" className="animate-pulse" />
              </g>

              {/* Sonar Acoustic Conical Beams */}
              <path
                d="M197,28 L50,185 L350,185 Z"
                fill="url(#sonarBeamGradientDense)"
                opacity="0.6"
              />
              <line x1="197" y1="28" x2="50" y2="185" stroke="rgba(6, 182, 212, 0.6)" strokeWidth="1.2" strokeDasharray="3 3" />
              <line x1="197" y1="28" x2="350" y2="185" stroke="rgba(6, 182, 212, 0.6)" strokeWidth="1.2" strokeDasharray="3 3" />

              {/* Acoustic Wavefront Arcs */}
              <path d="M165,70 Q197,82 230,70" stroke="rgba(6, 182, 212, 0.5)" strokeWidth="1" fill="none" />
              <path d="M135,115 Q197,135 260,115" stroke="rgba(6, 182, 212, 0.6)" strokeWidth="1" fill="none" />
              <path d="M100,160 Q197,185 295,160" stroke="rgba(6, 182, 212, 0.7)" strokeWidth="1" fill="none" />

              {/* Seafloor Bathymetry Contour */}
              <path
                d="M35,190 Q120,175 200,185 T385,180 L385,215 L35,215 Z"
                fill="#050a14"
                stroke="#1e3a5f"
                strokeWidth="1.2"
              />

              {/* Detected Debris Targets */}
              <g transform="translate(100, 168)">
                <ellipse cx="12" cy="10" rx="14" ry="6" fill="rgba(239, 68, 68, 0.25)" stroke="#ef4444" strokeWidth="1" />
                <rect x="-4" y="-2" width="34" height="24" fill="none" stroke="#ef4444" strokeWidth="1" strokeDasharray="2 2" />
                <text x="-4" y="-5" fill="#ef4444" fontSize="8" fontFamily="Inter, sans-serif" fontWeight="700">Shipwreck 94%</text>
              </g>

              <g transform="translate(260, 165)">
                <rect x="0" y="6" width="24" height="6" rx="2" fill="rgba(168, 85, 247, 0.3)" stroke="#a855f7" strokeWidth="1" />
                <rect x="-3" y="0" width="36" height="18" fill="none" stroke="#a855f7" strokeWidth="1" strokeDasharray="2 2" />
                <text x="-2" y="-4" fill="#a855f7" fontSize="8" fontFamily="Inter, sans-serif" fontWeight="700">Anomaly 73%</text>
              </g>

              {/* Gradient Defs */}
              <defs>
                <linearGradient id="sonarBeamGradientDense" x1="197" y1="28" x2="197" y2="185" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.45" />
                  <stop offset="60%" stopColor="#06b6d4" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.04" />
                </linearGradient>
              </defs>
            </svg>

            {/* Bottom HUD Tag */}
            <div className="absolute bottom-1.5 right-2 flex items-center gap-1 text-[9px] font-mono font-bold text-cyan-300 bg-marine-950/90 px-2 py-0.5 rounded border border-cyan-500/30">
              <span className="w-1 h-1 rounded-full bg-cyan-400 animate-ping" />
              <span>Acoustic Ray-Trace • Live</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
