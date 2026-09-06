import React, { useState } from 'react';
import { Copy, Check, MapPin } from 'lucide-react';
import { formatCoordinatesDMS, formatCoordinatesDec } from '../../utils/formatters';
import { cn } from '../../utils/cn';

export interface TechnicalCoordsProps {
  latitude: number;
  longitude: number;
  depth?: number;
  showToggle?: boolean;
  className?: string;
}

export const TechnicalCoords: React.FC<TechnicalCoordsProps> = ({
  latitude,
  longitude,
  depth,
  showToggle = true,
  className,
}) => {
  const [format, setFormat] = useState<'dms' | 'dec'>('dms');
  const [copied, setCopied] = useState(false);

  const formattedStr =
    format === 'dms'
      ? formatCoordinatesDMS(latitude, longitude)
      : formatCoordinatesDec(latitude, longitude);

  const handleCopy = () => {
    navigator.clipboard.writeText(
      depth !== undefined ? `${formattedStr} | Depth: -${depth.toFixed(1)}m` : formattedStr
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-2.5 py-1.5 bg-marine-950/80 border border-marine-750 rounded text-xs font-mono select-all text-slate-200',
        className
      )}
    >
      <MapPin size={13} className="text-cyan-400 shrink-0" />
      <span className="tracking-tight text-cyan-200 font-semibold">{formattedStr}</span>

      {depth !== undefined && (
        <span className="text-slate-400 text-[11px] border-l border-marine-800 pl-2">
          -{depth.toFixed(1)}m
        </span>
      )}

      {showToggle && (
        <button
          onClick={() => setFormat((f) => (f === 'dms' ? 'dec' : 'dms'))}
          className="text-[10px] uppercase text-slate-400 hover:text-cyan-300 transition-colors border border-marine-700 px-1 py-0.5 rounded hover:bg-marine-850"
          title="Toggle coordinate format (DMS / Decimal)"
        >
          {format}
        </button>
      )}

      <button
        onClick={handleCopy}
        className="text-slate-400 hover:text-white p-0.5 rounded transition-colors"
        title="Copy coordinates"
        aria-label="Copy coordinates"
      >
        {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
      </button>
    </div>
  );
};
