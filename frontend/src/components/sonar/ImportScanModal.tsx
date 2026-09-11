import React, { useState } from 'react';
import { Upload, FileText, Image as ImageIcon, Video, CheckCircle2, ShieldCheck, Check, Play, Sparkles } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { SonarScanMetadata } from '../../types/marine';

export interface ImportScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadScan: (metadata: SonarScanMetadata, file?: File) => void;
}

export const ImportScanModal: React.FC<ImportScanModalProps> = ({
  isOpen,
  onClose,
  onLoadScan,
}) => {
  const [selectedFile, setSelectedFile] = useState<{
    file?: File;
    name: string;
    size: string;
    resolution: string;
    scanId: string;
    mediaType: 'image' | 'video';
    objectUrl?: string;
    durationSeconds?: number;
  }>({
    name: '20260903_222603.mp4',
    size: '14.8 MB',
    resolution: '1920 × 1080 px',
    scanId: 'SSS-SHIPWRECK-001',
    mediaType: 'video',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      const sizeStr = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;
      const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|mov|mkv)$/i.test(file.name);

      if (isVideo) {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
          const resStr = `${video.videoWidth || 1920} × ${video.videoHeight || 1080} px`;
          setSelectedFile({
            file,
            name: file.name,
            size: sizeStr,
            resolution: resStr,
            scanId: `SSS_${file.name.replace(/\.[^/.]+$/, '').slice(0, 16)}`,
            mediaType: 'video',
            objectUrl: url,
            durationSeconds: Math.round(video.duration) || 12,
          });
          setPreviewUrl(url);
        };
        video.src = url;
      } else {
        const img = new Image();
        img.onload = () => {
          const resStr = `${img.naturalWidth || 1024} × ${img.naturalHeight || 2048} px`;
          setSelectedFile({
            file,
            name: file.name,
            size: sizeStr,
            resolution: resStr,
            scanId: `SSS_${file.name.replace(/\.[^/.]+$/, '').slice(0, 16)}`,
            mediaType: 'image',
            objectUrl: url,
          });
          setPreviewUrl(url);
        };
        img.src = url;
      }
    }
  };

  const handlePresetSelect = (presetType: 'shipwreck' | 'debris' | 'pipe') => {
    if (presetType === 'shipwreck') {
      setSelectedFile({
        name: 'SSS_Demo1_Shipwreck_RightSwath.mp4',
        size: '14.8 MB',
        resolution: '1920 × 1080 px',
        scanId: 'SSS-DEMO1-SHIPWRECK',
        mediaType: 'video',
      });
      setPreviewUrl(null);
    } else if (presetType === 'debris') {
      setSelectedFile({
        name: 'SSS_Demo2_SubmergedDebris_PortSwath.png',
        size: '8.2 MB',
        resolution: '1920 × 1080 px',
        scanId: 'SSS-DEMO2-DEBRIS',
        mediaType: 'image',
      });
      setPreviewUrl(null);
    } else if (presetType === 'pipe') {
      setSelectedFile({
        name: 'SSS_Demo3_Pipeline_StarboardSwath.png',
        size: '6.4 MB',
        resolution: '1920 × 1080 px',
        scanId: 'SSS-DEMO3-PIPE',
        mediaType: 'image',
      });
      setPreviewUrl(null);
    }
  };

  const handleLoad = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoadScan(
        {
          id: `scan-${Date.now()}`,
          scanId: selectedFile.scanId,
          fileName: selectedFile.name,
          imageUrl: selectedFile.objectUrl || previewUrl || undefined,
          mediaType: selectedFile.mediaType,
          durationSeconds: selectedFile.durationSeconds,
          surveyCode: 'MS-0048',
          vessel: 'RV Samudra Nidhi',
          waterDepth: 142.6,
          sonarFrequencyKhz: 900,
          rangeMeters: 150,
          resolution: selectedFile.resolution,
          fileSizeMb: parseFloat(selectedFile.size) || 14.8,
          dateCreated: '21 May 2025, 10:24 AM',
        },
        selectedFile.file
      );
      onClose();
    }, 350);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Import Side-Scan Sonar Imagery / Video"
      subtitle="Upload your custom sonar file (PNG/JPG/TIFF/MP4) or select a demo benchmark scan"
      icon={Upload}
      size="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="text-[11px] font-mono text-cyan-400 flex items-center gap-1.5">
            <ShieldCheck size={14} /> MoES / NIOT Geodetic Standard
          </span>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={CheckCircle2}
              onClick={handleLoad}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Load into Workspace'}
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4 select-none">
        {/* Quick Demo Preset Selection Toolbar */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1">
            <Sparkles size={12} /> Quick Demo Target Profiles:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handlePresetSelect('shipwreck')}
              className="p-2 rounded-lg bg-marine-950 border border-marine-800 hover:border-red-500/60 hover:bg-red-950/20 text-left transition-all group"
            >
              <div className="text-xs font-bold text-red-300 group-hover:text-red-200 font-mono">
                Demo 1: Shipwreck
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                Right Swath • 97% Conf
              </div>
            </button>

            <button
              type="button"
              onClick={() => handlePresetSelect('debris')}
              className="p-2 rounded-lg bg-marine-950 border border-marine-800 hover:border-amber-500/60 hover:bg-amber-950/20 text-left transition-all group"
            >
              <div className="text-xs font-bold text-amber-300 group-hover:text-amber-200 font-mono">
                Demo 2: Submerged Debris
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                Center-Left • 92% Conf
              </div>
            </button>

            <button
              type="button"
              onClick={() => handlePresetSelect('pipe')}
              className="p-2 rounded-lg bg-marine-950 border border-marine-800 hover:border-emerald-500/60 hover:bg-emerald-950/20 text-left transition-all group"
            >
              <div className="text-xs font-bold text-emerald-300 group-hover:text-emerald-200 font-mono">
                Demo 3: Pipe / Obstruction
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                Starboard • 87% Conf
              </div>
            </button>
          </div>
        </div>

        {/* Drag & Drop Upload Zone */}
        <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-marine-750 hover:border-cyan-500/60 rounded-xl bg-marine-950/70 transition-colors cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-marine-900 border border-marine-750 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform mb-1.5">
            <Upload size={20} />
          </div>
          <span className="text-xs font-bold text-white uppercase font-mono">
            Or upload your own sonar file (Image or Video)
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5">
            Drag & drop or <span className="text-cyan-400 font-semibold underline">Browse Files</span>
          </span>
          <span className="text-[10px] font-mono text-slate-500 mt-1.5">
            Supported: MP4, WebM, PNG, JPG, JPEG, TIFF, TIF
          </span>
          <input
            type="file"
            accept=".png,.jpg,.jpeg,.tiff,.tif,.webp,.mp4,.webm,.mov,.mkv"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {/* Selected File Card with Video / Image preview */}
        <div className="p-3 rounded-lg bg-marine-950 border border-marine-800 space-y-2">
          <div className="flex items-center gap-3">
            {selectedFile.mediaType === 'video' && previewUrl ? (
              <div className="relative w-14 h-12 rounded overflow-hidden border border-cyan-500/40 bg-black shrink-0 flex items-center justify-center">
                <video src={previewUrl} className="w-full h-full object-cover" muted />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Play size={12} className="text-cyan-300" fill="currentColor" />
                </div>
              </div>
            ) : previewUrl ? (
              <img
                src={previewUrl}
                alt="Sonar Scan Preview"
                className="w-14 h-12 rounded object-cover border border-cyan-500/40 bg-black shrink-0"
              />
            ) : (
              <div className="w-14 h-12 rounded bg-marine-900 border border-marine-750 flex items-center justify-center text-cyan-400 shrink-0">
                {selectedFile.mediaType === 'video' ? <Video size={20} /> : <ImageIcon size={20} />}
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-white font-mono truncate">
                {selectedFile.name}
              </div>
              <div className="text-[10px] font-mono text-slate-400 flex items-center gap-2 mt-0.5">
                <span className="text-cyan-300 font-bold uppercase">{selectedFile.mediaType}</span>
                <span>•</span>
                <span>{selectedFile.size}</span>
                <span>•</span>
                <span className="text-slate-300">{selectedFile.resolution}</span>
              </div>
            </div>

            <span className="text-emerald-400 text-xs font-mono font-bold flex items-center gap-1 shrink-0">
              <Check size={13} /> Selected
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
};
