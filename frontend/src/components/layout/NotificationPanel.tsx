import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, Trash2, HelpCircle, AlertTriangle, AlertCircle, Cpu, Info } from 'lucide-react';
import { SystemNotification } from '../../types/navigation';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';

export interface NotificationPanelProps {
  notifications: SystemNotification[];
  isOpen: boolean;
  onClose: () => void;
  onMarkAllRead?: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  notifications: initialNotifications,
  isOpen,
  onClose,
}) => {
  const [notifications, setNotifications] = useState<SystemNotification[]>(initialNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setNotifications(initialNotifications);
  }, [initialNotifications]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const filtered = notifications.filter((n) => (filter === 'unread' ? !n.read : true));
  const unreadCount = notifications.filter((n) => !n.read).length;

  const getSeverityIcon = (sev: SystemNotification['severity']) => {
    switch (sev) {
      case 'anomaly':
        return <HelpCircle size={14} className="text-purple-400" />;
      case 'high':
        return <AlertCircle size={14} className="text-red-400" />;
      case 'medium':
        return <AlertTriangle size={14} className="text-amber-400" />;
      case 'ai':
        return <Cpu size={14} className="text-cyan-400" />;
      default:
        return <Info size={14} className="text-emerald-400" />;
    }
  };

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-12 w-80 sm:w-96 bg-marine-900 border border-marine-700 rounded-lg shadow-2xl shadow-black/80 z-50 overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 corner-brackets"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3.5 border-b border-marine-800 bg-marine-950/60">
        <div className="flex items-center gap-2">
          <Bell size={15} className="text-cyan-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
            Telemetry Alerts
          </h3>
          {unreadCount > 0 && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 bg-cyan-950 text-cyan-300 border border-cyan-500/40 rounded-full font-bold">
              {unreadCount} NEW
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setFilter(filter === 'all' ? 'unread' : 'all')}
            className="text-[11px] text-slate-400 hover:text-cyan-300 px-2 py-0.5 rounded hover:bg-marine-800 transition-colors"
          >
            {filter === 'all' ? 'Unread only' : 'Show all'}
          </button>
        </div>
      </div>

      {/* List */}
      <div className="max-h-80 overflow-y-auto divide-y divide-marine-800/60">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No telemetry alerts or warnings recorded.
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className={cn(
                'p-3 transition-colors hover:bg-marine-850/60 flex items-start gap-3',
                !item.read && 'bg-cyan-950/20 border-l-2 border-l-cyan-400'
              )}
            >
              <div className="p-1 rounded bg-marine-950 border border-white/5 shrink-0 mt-0.5">
                {getSeverityIcon(item.severity)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <span className="text-xs font-medium text-slate-200 truncate">{item.title}</span>
                  <span className="text-[10px] font-mono text-slate-500 shrink-0">
                    {item.timestamp}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {item.message}
                </p>
                {item.tag && (
                  <span className="inline-block mt-1.5 text-[9px] font-mono uppercase px-1.5 py-0.5 bg-marine-950 border border-marine-800 rounded text-slate-400">
                    {item.tag}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between p-2.5 bg-marine-950/80 border-t border-marine-800 text-[11px]">
        <button
          onClick={markAllAsRead}
          disabled={unreadCount === 0}
          className="flex items-center gap-1 text-slate-400 hover:text-cyan-300 disabled:opacity-40 disabled:hover:text-slate-400 transition-colors"
        >
          <Check size={13} />
          <span>Mark all read</span>
        </button>

        <button
          onClick={clearAll}
          disabled={notifications.length === 0}
          className="flex items-center gap-1 text-slate-400 hover:text-red-400 disabled:opacity-40 disabled:hover:text-slate-400 transition-colors"
        >
          <Trash2 size={13} />
          <span>Clear</span>
        </button>
      </div>
    </div>
  );
};
