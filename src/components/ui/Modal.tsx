import React, { useEffect } from 'react';
import { X, LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Button } from './Button';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  severity?: 'default' | 'high' | 'anomaly' | 'ai';
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon: Icon,
  children,
  footer,
  size = 'md',
  severity = 'default',
  className,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeStyles = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-6xl',
  };

  const severityBorderStyles = {
    default: 'border-marine-700',
    high: 'border-red-500/50 shadow-red-950/40',
    anomaly: 'border-purple-500/50 shadow-purple-950/40',
    ai: 'border-cyan-500/50 shadow-cyan-950/40',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-marine-950/85 backdrop-blur-md transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog container */}
      <div
        className={cn(
          'relative w-full bg-marine-900/95 border rounded-lg shadow-2xl shadow-black/80 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150 corner-brackets',
          sizeStyles[size],
          severityBorderStyles[severity],
          className
        )}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-start justify-between p-4 sm:p-5 border-b border-marine-800 bg-marine-900/80">
          <div className="flex items-start gap-3 min-w-0 pr-4">
            {Icon && (
              <div className="p-2 rounded bg-marine-800 border border-marine-700 text-cyan-400 shrink-0 mt-0.5">
                <Icon size={18} />
              </div>
            )}
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-white tracking-wide uppercase truncate">
                {title}
              </h2>
              {subtitle && (
                <p className="text-xs text-slate-400 mt-0.5 truncate">{subtitle}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-marine-800 transition-colors focus:outline-none focus:ring-1 focus:ring-cyan-500"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 max-h-[70vh] overflow-y-auto">{children}</div>

        {/* Footer */}
        {footer ? (
          <div className="flex items-center justify-end gap-3 p-4 sm:p-5 border-t border-marine-800 bg-marine-950/40">
            {footer}
          </div>
        ) : (
          <div className="flex items-center justify-end gap-3 p-4 sm:p-5 border-t border-marine-800 bg-marine-950/40">
            <Button variant="secondary" size="sm" onClick={onClose}>
              Dismiss
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
