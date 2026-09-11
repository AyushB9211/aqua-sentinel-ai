import React from 'react';
import { Scan, Compass, Ship, FileText, Image as ImageIcon } from 'lucide-react';
import { SonarScanMetadata } from '../../types/marine';
import { cn } from '../../utils/cn';

export interface ScanInfoBarProps {
  metadata: SonarScanMetadata;
  className?: string;
}

export const ScanInfoBar: React.FC<ScanInfoBarProps> = ({ metadata, className }) => {
  return (
    <div
      className={cn(
        'w-full p-2.5 sm:px-4 rounded-lg bg-marine-900/90 border border-marine-800 text-xs font-mono select-none flex flex-wrap items-center justify-between gap-3 shadow-md corner-brackets',
        className
      )}
    >
      {/* Left Scan ID, File Name & Survey */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-1.5">
          <Scan size={14} className="text-cyan-400 shrink-0" />
          <span className="text-slate-400 font-medium">Scan ID:</span>
          <span className="text-white font-bold font-mono">{metadata.scanId}</span>
        </div>

        {metadata.fileName && (
          <>
            <div className="hidden sm:block w-[1px] h-3 bg-marine-800" />
            <div className="flex items-center gap-1.5 max-w-[200px] sm:max-w-xs truncate">
              <ImageIcon size={13} className="text-cyan-300 shrink-0" />
              <span className="text-slate-400 font-medium">File:</span>
              <span className="text-cyan-200 font-mono truncate" title={metadata.fileName}>
                {metadata.fileName}
              </span>
            </div>
          </>
        )}

        <div className="hidden sm:block w-[1px] h-3 bg-marine-800" />

        <div className="flex items-center gap-1.5">
          <Compass size={14} className="text-teal-400 shrink-0" />
          <span className="text-slate-400 font-medium">Survey:</span>
          <span className="text-cyan-300 font-semibold">{metadata.surveyCode}</span>
        </div>
      </div>

      {/* Right Acoustic & File Parameters */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[11px] text-slate-300">
        <div className="flex items-center gap-1">
          <span className="text-slate-400">Depth:</span>
          <span className="text-teal-300 font-bold">-{metadata.waterDepth.toFixed(1)} m</span>
        </div>

        <div className="hidden sm:block w-[1px] h-3 bg-marine-800" />

        <div className="flex items-center gap-1">
          <span className="text-slate-400">Resolution:</span>
          <span className="text-slate-300 font-bold">{metadata.resolution}</span>
        </div>

        {metadata.fileSizeMb && (
          <>
            <div className="hidden sm:block w-[1px] h-3 bg-marine-800" />
            <div className="flex items-center gap-1">
              <span className="text-slate-400">Size:</span>
              <span className="text-slate-300">{metadata.fileSizeMb.toFixed(1)} MB</span>
            </div>
          </>
        )}

        <div className="hidden sm:block w-[1px] h-3 bg-marine-800" />

        <div className="flex items-center gap-1">
          <span className="text-slate-400">Range:</span>
          <span className="text-cyan-300 font-bold">{metadata.rangeMeters} m</span>
        </div>
      </div>
    </div>
  );
};
