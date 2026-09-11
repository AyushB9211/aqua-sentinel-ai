import React, { useState } from 'react';
import {
  Bell,
  Settings,
  Menu,
  Shield,
  Activity,
  Radio,
} from 'lucide-react';
import { BreadcrumbItem, SystemNotification } from '../../types/navigation';
import { TelemetryState, SurveyMission } from '../../types/marine';
import { NotificationPanel } from './NotificationPanel';

export interface TopHeaderProps {
  breadcrumbs: BreadcrumbItem[];
  telemetry: TelemetryState;
  mission: SurveyMission;
  notifications: SystemNotification[];
  onOpenSettings: () => void;
  onToggleSidebar: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  telemetry,
  mission,
  notifications,
  onOpenSettings,
  onToggleSidebar,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 h-13 sm:h-14 w-full bg-[#03060d]/95 border-b border-marine-800/90 backdrop-blur-md px-3 sm:px-4 flex items-center justify-between gap-3 select-none">
      {/* LEFT: MISSION MS-0048 ● ACTIVE */}
      <div className="flex items-center gap-2.5 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-1.5 rounded bg-marine-900 border border-marine-750 text-slate-300 hover:text-white"
          aria-label="Toggle navigation menu"
        >
          <Menu size={16} />
        </button>

        <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-marine-900/90 border border-marine-750 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              MISSION
            </span>
            <span className="font-mono font-bold text-white tracking-tight">
              {mission.code || 'MS-0048'}
            </span>
          </div>

          <div className="border-l border-marine-800 pl-2 flex items-center gap-1.5 text-emerald-400 font-semibold text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.9)]" />
            <span className="text-[11px] font-mono font-bold">ACTIVE</span>
          </div>
        </div>
      </div>

      {/* CENTER: GPS & DEPTH */}
      <div className="hidden md:flex items-center gap-3 text-xs bg-marine-950/90 border border-marine-800 px-3 py-1 rounded shadow-inner font-mono">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 text-[10px] font-semibold">GPS:</span>
          <span className="text-cyan-300 font-bold tracking-tight">
            19°04'67.7"N 69°54'54.5"E
          </span>
        </div>

        <div className="w-[1px] h-3 bg-marine-800" />

        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 text-[10px] font-semibold">DEPTH:</span>
          <span className="text-teal-300 font-bold">
            -142.6 m
          </span>
        </div>
      </div>

      {/* RIGHT: SONAR LINK ● CONNECTED, Notifications, Settings, Operator Avatar */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* SONAR LINK */}
        <div className="flex items-center gap-2 px-2.5 py-1 bg-marine-900/90 border border-marine-750 rounded text-xs">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 hidden sm:inline">
            SONAR LINK
          </span>
          <div className="flex items-center gap-1.5 text-cyan-300 font-semibold font-mono text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-bold">CONNECTED</span>
          </div>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-1.5 rounded bg-marine-900 border border-marine-750 hover:border-cyan-500/40 text-slate-300 hover:text-white transition-colors"
            aria-label="View notifications"
          >
            <Bell size={15} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-cyan-400 text-slate-950 text-[9px] font-bold flex items-center justify-center font-mono shadow-[0_0_6px_rgba(6,182,212,0.8)]">
                {unreadCount}
              </span>
            )}
          </button>

          <NotificationPanel
            notifications={notifications}
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
          />
        </div>

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          className="p-1.5 rounded bg-marine-900 border border-marine-750 hover:border-cyan-500/40 text-slate-300 hover:text-white transition-colors"
          title="System Settings"
          aria-label="System Settings"
        >
          <Settings size={15} />
        </button>

        {/* Operator Avatar */}
        <div className="flex items-center gap-2 pl-1.5 border-l border-marine-800">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-marine-800 to-cyan-900 border border-cyan-500/50 flex items-center justify-center text-cyan-300 font-bold text-xs shadow-[0_0_6px_rgba(6,182,212,0.3)]">
            <Shield size={13} />
          </div>
          <div className="hidden xl:block text-left">
            <div className="text-[11px] font-semibold text-white tracking-tight leading-tight">
              Dr. V. Ramanathan
            </div>
            <div className="text-[9px] text-slate-400 font-mono leading-tight">
              NIOT Lead
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
