import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  User,
  Radio,
  Activity,
  PlayCircle,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { MAIN_NAV_ITEMS } from '../../types/navigation';
import { TelemetryState } from '../../types/marine';
import { cn } from '../../utils/cn';
import seasentinelLogo from '../../assets/seasentinel-logo.png';

export interface SidebarProps {
  currentRoute: string;
  onRouteChange: (routeId: string) => void;
  telemetry: TelemetryState;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  onReplayLaunch?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRoute,
  onRouteChange,
  telemetry,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
  onReplayLaunch,
}) => {
  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        className={cn(
          'fixed lg:static top-0 left-0 bottom-0 z-50 flex flex-col bg-marine-950 border-r border-marine-800 transition-all duration-300 ease-in-out shrink-0 select-none overflow-hidden shadow-2xl',
          isCollapsed ? 'w-16' : 'w-64',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Brand Header with Official SeaSentinel AI Logo */}
        <div className="h-16 flex items-center justify-between px-3.5 border-b border-marine-800/90 bg-marine-950/95">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Logo Emblem */}
            <div className="relative w-9 h-9 rounded-lg bg-marine-900 border border-cyan-500/40 p-1 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(6,182,212,0.3)] overflow-hidden">
              <img
                src={seasentinelLogo}
                alt="SeaSentinel AI"
                className="w-full h-full object-contain"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            </div>

            {!isCollapsed && (
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold tracking-tight text-white text-sm truncate uppercase font-mono">
                    SeaSentinel <span className="text-cyan-400">AI</span>
                  </span>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                    26057
                  </span>
                </div>
                <div className="text-[10px] text-cyan-400/90 font-medium truncate tracking-tight">
                  SEE BENEATH. DETECT BEYOND.
                </div>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1 rounded-md bg-marine-900 border border-marine-750 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/50 transition-colors"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* Navigation Items (Dense Compact List) */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1 scrollbar-thin">
          {MAIN_NAV_ITEMS.map((item) => {
            const isActive = currentRoute === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onRouteChange(item.id);
                  onCloseMobile();
                }}
                className={cn(
                  'w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-semibold transition-all duration-150 group relative',
                  isActive
                    ? 'bg-gradient-to-r from-cyan-950/90 to-marine-900 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                    : 'text-slate-300 hover:text-white hover:bg-marine-900/80 border border-transparent'
                )}
                title={isCollapsed ? item.label : undefined}
              >
                {/* Active Indicator Bar */}
                {isActive && (
                  <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-cyan-400 rounded-r-full shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                )}

                <Icon
                  size={16}
                  className={cn(
                    'shrink-0 transition-colors',
                    isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-cyan-300'
                  )}
                />

                {!isCollapsed && (
                  <span className="truncate flex-1 text-left font-sans text-xs">
                    {item.label}
                  </span>
                )}

                {!isCollapsed && item.badge && (
                  <span
                    className={cn(
                      'text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border uppercase shrink-0',
                      item.badgeVariant === 'red'
                        ? 'bg-red-950 text-red-300 border-red-500/40'
                        : 'bg-cyan-950 text-cyan-300 border-cyan-500/40'
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Status & Real-Time Telemetry Section */}
        {!isCollapsed && (
          <div className="p-2.5 border-t border-marine-800 bg-marine-950/90 space-y-2 shrink-0">
            {/* System Status Banner */}
            <div className="p-2 rounded-lg bg-marine-900/80 border border-marine-800 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase text-slate-400">
                  SYSTEM STATUS
                </span>
                <span className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  OPERATIONAL
                </span>
              </div>
              <div className="text-[11px] text-slate-300 font-medium mt-0.5">
                All Systems Online
              </div>
            </div>

            {/* Real-Time Telemetry List */}
            <div className="p-2 rounded-lg bg-marine-900/80 border border-marine-800 font-mono text-[10px] space-y-1">
              <div className="text-[9px] font-bold text-cyan-400 uppercase tracking-wider mb-1">
                REAL-TIME TELEMETRY
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Ping Rate:</span>
                <span className="text-white font-bold">{telemetry.sonarPingRate} Hz</span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Tow Speed:</span>
                <span className="text-white font-bold">{telemetry.vesselSpeedKnots} kts</span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Heading:</span>
                <span className="text-white font-bold">{telemetry.headingText || '126.5° SE'}</span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Depth:</span>
                <span className="text-teal-300 font-bold">-{telemetry.towfishDepth.toFixed(1)} m</span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">AI Inference:</span>
                <span className="text-emerald-400 font-bold">{telemetry.aiInferenceFps} FPS</span>
              </div>
            </div>

            {/* Operator Card at the Very Bottom */}
            <div className="flex items-center gap-2 p-1.5 rounded-lg bg-marine-900/60 border border-marine-800">
              <div className="w-7 h-7 rounded-full bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shrink-0">
                <User size={13} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-bold text-white truncate font-sans">
                  Dr. V. Ramanathan
                </div>
                <div className="text-[9px] text-slate-400 truncate">
                  Chief Oceanographer • NIOT
                </div>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
