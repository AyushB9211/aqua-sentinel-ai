import React, { useState, useRef, useEffect } from 'react';
import {
  MousePointer,
  ZoomIn,
  ZoomOut,
  Hand,
  Ruler,
  Sun,
  RotateCcw,
  Maximize2,
  Scan,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Video,
  Image as ImageIcon,
  RotateCw,
} from 'lucide-react';
import { Card } from '../ui/Card';
import { BoundingBox, AnalysisState } from '../../types/marine';
import { cn } from '../../utils/cn';

export interface SonarAnalysisViewerProps {
  scanId: string;
  imageUrl?: string;
  mediaType?: 'image' | 'video' | 'procedural';
  analysisState: AnalysisState;
  boundingBoxes: BoundingBox[];
  selectedDetectionId: string | null;
  onSelectDetection: (id: string) => void;
  className?: string;
}

export const SonarAnalysisViewer: React.FC<SonarAnalysisViewerProps> = ({
  scanId,
  imageUrl,
  mediaType = 'procedural',
  analysisState,
  boundingBoxes,
  selectedDetectionId,
  onSelectDetection,
  className,
}) => {
  const [activeTool, setActiveTool] = useState<'select' | 'pan' | 'measure'>('select');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [brightness, setBrightness] = useState<'normal' | 'high' | 'contrast'>('normal');
  const [colorPalette, setColorPalette] = useState<'golden' | 'cyan' | 'mono'>('golden');
  const [showRuler, setShowRuler] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Video playback state
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  const isVideo =
    mediaType === 'video' ||
    (imageUrl && (imageUrl.includes('mp4') || imageUrl.includes('webm') || imageUrl.includes('video')));

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isVideo) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration || 0);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [isVideo, imageUrl]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const time = parseFloat(e.target.value);
    videoRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const handleReset = () => {
    setZoomLevel(1);
    setBrightness('normal');
    setActiveTool('select');
    setShowRuler(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, '0');
    const s = Math.floor(secs % 60)
      .toString()
      .padStart(2, '0');
    return `${m}:${s}`;
  };

  const getSeverityStyle = (priority?: string, isSelected?: boolean) => {
    switch (priority) {
      case 'HIGH':
        return isSelected
          ? 'border-red-400 bg-red-500/30 ring-2 ring-red-400 shadow-[0_0_18px_rgba(239,68,68,0.9)] scale-[1.02]'
          : 'border-red-500 bg-red-500/15 hover:border-red-400';
      case 'MEDIUM':
        return isSelected
          ? 'border-amber-400 bg-amber-500/30 ring-2 ring-amber-400 shadow-[0_0_18px_rgba(245,158,11,0.9)] scale-[1.02]'
          : 'border-amber-500 bg-amber-500/15 hover:border-amber-400';
      case 'LOW':
      case 'ANOMALY':
      default:
        return isSelected
          ? 'border-emerald-400 bg-emerald-500/30 ring-2 ring-emerald-400 shadow-[0_0_18px_rgba(16,185,129,0.9)] scale-[1.02]'
          : 'border-emerald-500 bg-emerald-500/15 hover:border-emerald-400';
    }
  };

  const getBadgeStyle = (priority?: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-950 text-red-300 border-red-500/80';
      case 'MEDIUM':
        return 'bg-amber-950 text-amber-300 border-amber-500/80';
      case 'LOW':
      case 'ANOMALY':
      default:
        return 'bg-emerald-950 text-emerald-300 border-emerald-500/80';
    }
  };

  return (
    <Card
      className={cn(
        'flex flex-col bg-[#030712] border-marine-800 overflow-hidden select-none',
        isFullscreen && 'fixed inset-0 z-50 rounded-none border-0',
        className
      )}
      cornerBrackets
    >
      {/* 1. Sonar Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-marine-900/90 border-b border-marine-800 text-xs font-mono">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-marine-950 border border-cyan-500/30 text-cyan-300 font-bold">
            <Scan size={13} className="animate-pulse text-cyan-400" />
            <span>SONAR VIEWPORT</span>
          </div>

          <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-marine-950 border border-marine-750 text-slate-300 text-[11px]">
            {isVideo ? (
              <>
                <Video size={12} className="text-amber-400" />
                <span>VIDEO SCAN</span>
              </>
            ) : imageUrl ? (
              <>
                <ImageIcon size={12} className="text-cyan-400" />
                <span>SONAR IMAGE</span>
              </>
            ) : (
              <span>READY</span>
            )}
          </div>
        </div>

        {/* Action Tool Group */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="flex items-center rounded-lg bg-marine-950 border border-marine-750 p-0.5">
            <button
              onClick={() => setActiveTool('select')}
              className={cn(
                'p-1.5 rounded text-xs transition-colors',
                activeTool === 'select'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              )}
              title="Select / Inspect Target"
            >
              <MousePointer size={13} />
            </button>
            <button
              onClick={() => setActiveTool('pan')}
              className={cn(
                'p-1.5 rounded text-xs transition-colors',
                activeTool === 'pan'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              )}
              title="Pan View"
            >
              <Hand size={13} />
            </button>
            <button
              onClick={() => setShowRuler(!showRuler)}
              className={cn(
                'p-1.5 rounded text-xs transition-colors',
                showRuler
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              )}
              title="Acoustic Ruler"
            >
              <Ruler size={13} />
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center rounded-lg bg-marine-950 border border-marine-750 p-0.5">
            <button
              onClick={() => setZoomLevel((z) => Math.min(3, z + 0.25))}
              className="p-1.5 rounded text-slate-400 hover:text-white transition-colors"
              title="Zoom In"
            >
              <ZoomIn size={13} />
            </button>
            <span className="px-1.5 text-[10px] text-cyan-300 font-bold min-w-[36px] text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.5, z - 0.25))}
              className="p-1.5 rounded text-slate-400 hover:text-white transition-colors"
              title="Zoom Out"
            >
              <ZoomOut size={13} />
            </button>
          </div>

          {/* Brightness Adjustment */}
          <div className="flex items-center rounded-lg bg-marine-950 border border-marine-750 p-0.5">
            <button
              onClick={() =>
                setBrightness((b) => (b === 'normal' ? 'high' : b === 'high' ? 'contrast' : 'normal'))
              }
              className={cn(
                'p-1.5 rounded text-xs transition-colors',
                brightness !== 'normal'
                  ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-white'
              )}
              title={`Brightness/Contrast (${brightness})`}
            >
              <Sun size={13} />
            </button>
          </div>

          {/* Color Palette Switcher */}
          <div className="flex items-center rounded-lg bg-marine-950 border border-marine-750 p-0.5 text-xs">
            <button
              onClick={() => setColorPalette('golden')}
              className={cn(
                'px-2 py-0.5 rounded text-[10px] font-semibold transition-colors',
                colorPalette === 'golden'
                  ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-white'
              )}
            >
              Golden
            </button>
            <button
              onClick={() => setColorPalette('cyan')}
              className={cn(
                'px-2 py-0.5 rounded text-[10px] font-semibold transition-colors',
                colorPalette === 'cyan'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              )}
            >
              Cyan
            </button>
            <button
              onClick={() => setColorPalette('mono')}
              className={cn(
                'px-2 py-0.5 rounded text-[10px] font-semibold transition-colors',
                colorPalette === 'mono'
                  ? 'bg-slate-800 text-white border border-slate-600'
                  : 'text-slate-400 hover:text-white'
              )}
            >
              Mono
            </button>
          </div>

          {/* Reset & Fullscreen */}
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg bg-marine-950 border border-marine-750 text-slate-400 hover:text-white hover:border-slate-600 transition-colors"
            title="Reset View"
          >
            <RotateCcw size={13} />
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg bg-marine-950 border border-marine-750 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/50 transition-colors"
            title="Toggle Fullscreen"
          >
            <Maximize2 size={13} />
          </button>
        </div>
      </div>

      {/* 2. Main Sonar Viewport (Centers the image and prevents bounding boxes from overflowing into black margins) */}
      <div className="relative flex-1 min-h-[460px] lg:min-h-[540px] w-full bg-[#02050a] overflow-hidden flex items-center justify-center p-2">
        <div
          className={cn(
            'relative transition-all duration-300 ease-out origin-center flex items-center justify-center',
            brightness === 'high' && 'brightness-125 contrast-110',
            brightness === 'contrast' && 'contrast-150 brightness-95',
            colorPalette === 'mono' && 'grayscale'
          )}
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* A. If user uploaded a VIDEO (MP4) */}
          {isVideo && imageUrl ? (
            <div className="relative inline-flex items-center justify-center max-w-full max-h-full">
              <video
                ref={videoRef}
                src={imageUrl}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                className="max-h-[calc(100vh-320px)] min-h-[460px] max-w-full w-auto h-auto object-contain select-none block shadow-2xl"
              />

              {/* Nadir Centerline Overlay */}
              <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-6 bg-black/50 border-x border-amber-500/30 flex items-center justify-center pointer-events-none">
                <div className="w-[1px] h-full bg-amber-400/50" />
              </div>

              {/* Scanning Laser Beam during Processing State */}
              {analysisState === 'processing' && (
                <div className="absolute inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-cyan-300 to-transparent opacity-95 shadow-[0_0_24px_rgba(6,182,212,1)] animate-radar-line pointer-events-none z-20" />
              )}

              {/* AI Detection Bounding Boxes Overlay */}
              {analysisState === 'complete' &&
                boundingBoxes.map((obj) => {
                  const isSelected = selectedDetectionId === obj.id;

                  return (
                    <div
                      key={obj.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectDetection(obj.id);
                      }}
                      className={cn(
                        'absolute border-2 rounded-sm cursor-pointer transition-all duration-150 group z-30',
                        getSeverityStyle(obj.priority, isSelected)
                      )}
                      style={{
                        left: `${obj.x}%`,
                        top: `${obj.y}%`,
                        width: `${obj.width}%`,
                        height: `${obj.height}%`,
                      }}
                    >
                      {/* Semantic Target Label Tag */}
                      <div
                        className={cn(
                          'absolute -top-6 left-0 whitespace-nowrap text-[10px] font-mono font-bold px-2 py-0.5 rounded border shadow-xl flex items-center gap-1.5',
                          getBadgeStyle(obj.priority)
                        )}
                      >
                        <span>{obj.label}</span>
                        <span className="font-mono text-white">{(obj.confidence * 100).toFixed(0)}%</span>
                      </div>

                      {/* Corner Crosshair Nodes */}
                      <div className="absolute -top-1 -left-1 w-1.5 h-1.5 bg-white rounded-full" />
                      <div className="absolute -bottom-1 -right-1 w-1.5 h-1.5 bg-white rounded-full" />
                    </div>
                  );
                })}
            </div>
          ) : imageUrl ? (
            /* B. If user uploaded an IMAGE (PNG/JPG/TIFF) */
            <div className="relative inline-flex items-center justify-center max-w-full max-h-full">
              <img
                src={imageUrl}
                alt="Uploaded Side-Scan Sonar Imagery"
                className="max-h-[calc(100vh-320px)] min-h-[460px] max-w-full w-auto h-auto object-contain select-none pointer-events-none block shadow-2xl"
              />

              {/* Nadir Centerline Overlay */}
              <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-6 bg-black/60 border-x border-amber-500/30 flex items-center justify-center pointer-events-none">
                <div className="w-[1px] h-full bg-amber-400/50" />
              </div>

              {/* Scanning Laser Beam during Processing State */}
              {analysisState === 'processing' && (
                <div className="absolute inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-cyan-300 to-transparent opacity-95 shadow-[0_0_24px_rgba(6,182,212,1)] animate-radar-line pointer-events-none z-20" />
              )}

              {/* AI Detection Bounding Boxes Overlay (Rendered strictly inside the displayed image container) */}
              {analysisState === 'complete' &&
                boundingBoxes.map((obj) => {
                  const isSelected = selectedDetectionId === obj.id;

                  return (
                    <div
                      key={obj.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectDetection(obj.id);
                      }}
                      className={cn(
                        'absolute border-2 rounded-sm cursor-pointer transition-all duration-150 group z-30',
                        getSeverityStyle(obj.priority, isSelected)
                      )}
                      style={{
                        left: `${obj.x}%`,
                        top: `${obj.y}%`,
                        width: `${obj.width}%`,
                        height: `${obj.height}%`,
                      }}
                    >
                      {/* Semantic Target Label Tag */}
                      <div
                        className={cn(
                          'absolute -top-6 left-0 whitespace-nowrap text-[10px] font-mono font-bold px-2 py-0.5 rounded border shadow-xl flex items-center gap-1.5',
                          getBadgeStyle(obj.priority)
                        )}
                      >
                        <span>{obj.label}</span>
                        <span className="font-mono text-white">{(obj.confidence * 100).toFixed(0)}%</span>
                      </div>

                      {/* Corner Crosshair Nodes */}
                      <div className="absolute -top-1 -left-1 w-1.5 h-1.5 bg-white rounded-full" />
                      <div className="absolute -bottom-1 -right-1 w-1.5 h-1.5 bg-white rounded-full" />
                    </div>
                  );
                })}
            </div>
          ) : (
            /* C. Default Procedural Scan (Shown ONLY when NO file has been uploaded) */
            <div
              className={cn(
                'w-full h-full relative overflow-hidden',
                colorPalette === 'golden'
                  ? 'bg-gradient-to-b from-[#140f06] via-[#241a0a] to-[#0e0a03]'
                  : colorPalette === 'cyan'
                  ? 'bg-gradient-to-b from-[#060c18] via-[#09152b] to-[#040810]'
                  : 'bg-gradient-to-b from-[#101010] via-[#1c1c1c] to-[#080808]'
              )}
            >
              <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-6 bg-black border-x border-amber-500/30 flex items-center justify-center pointer-events-none">
                <div className="w-[1px] h-full bg-amber-400/50" />
              </div>

              <div className="absolute top-3 left-4 text-[10px] font-mono font-bold text-amber-300/80 bg-marine-950/80 px-2 py-0.5 rounded border border-marine-750 pointer-events-none">
                PORT CHANNEL • 150m SWATH
              </div>
              <div className="absolute top-3 right-4 text-[10px] font-mono font-bold text-amber-300/80 bg-marine-950/80 px-2 py-0.5 rounded border border-marine-750 pointer-events-none">
                STARBOARD CHANNEL • 150m SWATH
              </div>

              <svg className="absolute inset-0 w-full h-full opacity-50 pointer-events-none">
                <defs>
                  <pattern id="sonarTexAnalysis" width="120" height="24" patternUnits="userSpaceOnUse">
                    <path
                      d="M0 12 Q 30 6, 60 12 T 120 12"
                      fill="none"
                      stroke={colorPalette === 'golden' ? 'rgba(245, 158, 11, 0.22)' : 'rgba(56, 189, 248, 0.22)'}
                      strokeWidth="0.8"
                    />
                    <path
                      d="M0 20 Q 30 15, 60 20 T 120 20"
                      fill="none"
                      stroke={colorPalette === 'golden' ? 'rgba(217, 119, 6, 0.16)' : 'rgba(20, 184, 166, 0.16)'}
                      strokeWidth="0.8"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#sonarTexAnalysis)" />
              </svg>
            </div>
          )}
        </div>

        {/* 3. Dedicated Interactive Video Player Controller Bar (Shown when video is loaded) */}
        {isVideo && imageUrl && (
          <div className="absolute bottom-11 inset-x-4 z-30 flex items-center justify-between gap-3 bg-marine-950/90 border border-cyan-500/40 p-2 rounded-lg backdrop-blur-md text-xs font-mono text-white">
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlay}
                className="p-1.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-900 transition-colors"
                title={isPlaying ? 'Pause Video' : 'Play Video'}
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              </button>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-1.5 rounded bg-marine-900 text-slate-400 hover:text-white transition-colors"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>
            </div>

            <div className="flex-1 flex items-center gap-2">
              <span className="text-[10px] text-slate-400 w-10 text-right">{formatTime(currentTime)}</span>
              <input
                type="range"
                min={0}
                max={duration || 100}
                step={0.1}
                value={currentTime}
                onChange={handleSeek}
                className="w-full accent-cyan-400 bg-marine-850 h-1.5 rounded cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 w-10">{formatTime(duration)}</span>
            </div>
          </div>
        )}

        {/* Dynamic Scale / Resolution Watermark */}
        <div className="absolute bottom-2.5 left-3 flex items-center gap-2 text-[10px] font-mono text-slate-400 bg-marine-950/80 px-2 py-0.5 rounded border border-marine-800 pointer-events-none z-10">
          <span>SCAN: {scanId}</span>
          <span>•</span>
          <span className="text-cyan-400">900 kHz HIGH-RES</span>
        </div>
      </div>
    </Card>
  );
};
