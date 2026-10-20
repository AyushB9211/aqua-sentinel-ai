import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  Tag,
  Eye,
} from 'lucide-react';
import { Card } from '../ui/Card';
import { BoundingBox, AnalysisState } from '../../types/marine';
import { getHazardStyle } from '../../utils/hazardUtils';
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
  const [labelMode, setLabelMode] = useState<'compact' | 'full' | 'hidden'>('compact');
  const [hoveredDetectionId, setHoveredDetectionId] = useState<string | null>(null);

  // DOM Refs
  const imgRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Video playback state
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  // Original Media Dimensions (in source pixels)
  const [originalDimensions, setOriginalDimensions] = useState<{
    width: number;
    height: number;
  }>({
    width: 1728,
    height: 5616,
  });

  const isVideo =
    mediaType === 'video' ||
    (imageUrl && (imageUrl.includes('mp4') || imageUrl.includes('webm') || imageUrl.includes('video')));

  // Raw YOLO coordinate logging
  useEffect(() => {
    if (boundingBoxes && boundingBoxes.length > 0) {
      console.log('ORIGINAL IMAGE:');
      console.log('width =', originalDimensions.width);
      console.log('height =', originalDimensions.height);

      boundingBoxes.forEach((obj) => {
        const rawX1 = obj.boxPixels ? obj.boxPixels.x1 : (obj.x / 100) * originalDimensions.width;
        const rawY1 = obj.boxPixels ? obj.boxPixels.y1 : (obj.y / 100) * originalDimensions.height;
        const rawX2 = obj.boxPixels ? obj.boxPixels.x2 : ((obj.x + obj.width) / 100) * originalDimensions.width;
        const rawY2 = obj.boxPixels ? obj.boxPixels.y2 : ((obj.y + obj.height) / 100) * originalDimensions.height;

        console.log('DETECTION RAW:');
        console.log('class =', obj.label);
        console.log('confidence =', `${(obj.confidence * 100).toFixed(1)}%`);
        console.log('x1 =', rawX1);
        console.log('y1 =', rawY1);
        console.log('x2 =', rawX2);
        console.log('y2 =', rawY2);
      });
    }
  }, [boundingBoxes, originalDimensions]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isVideo) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => {
      setDuration(video.duration || 0);
      if (video.videoWidth && video.videoHeight) {
        setOriginalDimensions({
          width: video.videoWidth,
          height: video.videoHeight,
        });
      }
    };

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
            <button
              onClick={() => setLabelMode((m) => (m === 'compact' ? 'full' : m === 'full' ? 'hidden' : 'compact'))}
              className={cn(
                'px-1.5 py-1 rounded text-xs transition-colors flex items-center gap-1 font-mono text-[10px]',
                labelMode !== 'hidden'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'text-slate-500 hover:text-slate-300'
              )}
              title={`Target Badges: ${labelMode.toUpperCase()} (Click to toggle)`}
            >
              <Tag size={12} />
              <span className="uppercase">{labelMode}</span>
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

      {/* 2. Main Sonar Viewport */}
      <div className="relative flex-1 min-h-[460px] lg:min-h-[540px] w-full bg-[#02050a] overflow-hidden flex items-center justify-center p-2">
        <div
          className={cn(
            'sonar-stage relative w-full h-full flex items-center justify-center overflow-hidden',
            brightness === 'high' && 'brightness-125 contrast-110',
            brightness === 'contrast' && 'contrast-150 brightness-95',
            colorPalette === 'mono' && 'grayscale'
          )}
          style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', transform: `scale(${zoomLevel})` }}
        >
          {/* A. If user uploaded a Sonar Image or Video */}
          {imageUrl ? (
            <>
              {isVideo ? (
                <video
                  ref={videoRef}
                  src={imageUrl}
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    display: 'block',
                  }}
                />
              ) : (
                <img
                  ref={imgRef}
                  src={imageUrl}
                  alt="Uploaded Side-Scan Sonar Imagery"
                  onLoad={(e) => {
                    const img = e.currentTarget;
                    if (img.naturalWidth && img.naturalHeight) {
                      setOriginalDimensions({
                        width: img.naturalWidth,
                        height: img.naturalHeight,
                      });
                    }
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    display: 'block',
                    pointerEvents: 'none',
                  }}
                />
              )}

              {/* Scanning Laser Beam during Processing State */}
              {analysisState === 'processing' && (
                <div className="absolute inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-cyan-300 to-transparent opacity-95 shadow-[0_0_24px_rgba(6,182,212,1)] animate-radar-line pointer-events-none z-20" />
              )}

              {/* Shared SVG Overlay in Original Image Coordinates */}
              <svg
                viewBox={`0 0 ${originalDimensions.width} ${originalDimensions.height}`}
                preserveAspectRatio="xMidYMid meet"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  pointerEvents: 'none',
                }}
              >
                {/* Nadir Centerline in original image coordinates */}
                <line
                  x1={originalDimensions.width / 2}
                  y1={0}
                  x2={originalDimensions.width / 2}
                  y2={originalDimensions.height}
                  stroke="rgba(245, 158, 11, 0.45)"
                  strokeWidth={Math.max(2, originalDimensions.width * 0.0015)}
                  strokeDasharray={`${originalDimensions.width * 0.006} ${originalDimensions.width * 0.003}`}
                />

                {/* Sonar Image Boundary Rectangle */}
                <rect
                  x={0}
                  y={0}
                  width={originalDimensions.width}
                  height={originalDimensions.height}
                  fill="none"
                  stroke="rgba(6, 182, 212, 0.45)"
                  strokeWidth={Math.max(2, originalDimensions.width * 0.002)}
                />

                {/* Debug Center Red Cross at (width/2, height/2) */}
                <g stroke="#ef4444" strokeWidth={Math.max(3, originalDimensions.width * 0.002)}>
                  <line
                    x1={originalDimensions.width / 2 - originalDimensions.width * 0.025}
                    y1={originalDimensions.height / 2}
                    x2={originalDimensions.width / 2 + originalDimensions.width * 0.025}
                    y2={originalDimensions.height / 2}
                  />
                  <line
                    x1={originalDimensions.width / 2}
                    y1={originalDimensions.height / 2 - originalDimensions.width * 0.025}
                    x2={originalDimensions.width / 2}
                    y2={originalDimensions.height / 2 + originalDimensions.width * 0.025}
                  />
                  <circle
                    cx={originalDimensions.width / 2}
                    cy={originalDimensions.height / 2}
                    r={originalDimensions.width * 0.008}
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth={Math.max(2, originalDimensions.width * 0.0015)}
                  />
                </g>

                {/* AI Detection Bounding Boxes Overlay */}
                {analysisState === 'complete' &&
                  (() => {
                    // 1. Precalculate bounding box metrics
                    const renderedBoxes = boundingBoxes.map((obj, idx) => {
                      const isSelected = selectedDetectionId === obj.id;
                      const isHovered = hoveredDetectionId === obj.id;

                      const rawX1 = obj.boxPixels ? obj.boxPixels.x1 : (obj.x / 100) * originalDimensions.width;
                      const rawY1 = obj.boxPixels ? obj.boxPixels.y1 : (obj.y / 100) * originalDimensions.height;
                      const rawX2 = obj.boxPixels ? obj.boxPixels.x2 : ((obj.x + obj.width) / 100) * originalDimensions.width;
                      const rawY2 = obj.boxPixels ? obj.boxPixels.y2 : ((obj.y + obj.height) / 100) * originalDimensions.height;

                      const x1 = Math.max(0, Math.min(rawX1, originalDimensions.width));
                      const y1 = Math.max(0, Math.min(rawY1, originalDimensions.height));
                      const x2 = Math.max(0, Math.min(rawX2, originalDimensions.width));
                      const y2 = Math.max(0, Math.min(rawY2, originalDimensions.height));
                      const boxW = Math.max(1, x2 - x1);
                      const boxH = Math.max(1, y2 - y1);

                      // Compact font size scaled cleanly with image width
                      const fontSize = Math.max(10, Math.min(14, originalDimensions.width * 0.009));
                      const labelH = fontSize * 1.4;
                      const trackingNum = obj.trackingId ? obj.trackingId : (idx + 1).toString().padStart(2, '0');
                      const hazard = getHazardStyle(obj.label, obj.classId);
                      const shortClass = hazard.shortLabel;
                      const confText = `${(obj.confidence * 100).toFixed(0)}%`;

                      const labelText = `#${trackingNum} ${shortClass} ${confText}`;
                      const labelW = labelText.length * fontSize * 0.58 + fontSize * 1.1;

                      const strokeColor = isSelected ? '#38bdf8' : hazard.stroke;
                      const fillColor = isSelected
                        ? 'rgba(56, 189, 248, 0.20)'
                        : (isHovered ? hazard.fillHover : hazard.fill);
                      const strokeWidth = isSelected ? Math.max(2.5, originalDimensions.width * 0.0025) : Math.max(1.8, originalDimensions.width * 0.0018);

                      return {
                        obj,
                        idx,
                        isSelected,
                        isHovered,
                        x1,
                        y1,
                        x2,
                        y2,
                        boxW,
                        boxH,
                        fontSize,
                        labelH,
                        labelW,
                        labelText,
                        strokeColor,
                        fillColor,
                        strokeWidth,
                      };
                    });

                    // 2. Collision avoidance for label positioning
                    const placedRects: { x: number; y: number; w: number; h: number }[] = [];

                    const positionedItems = renderedBoxes.map((item) => {
                      let labelX = Math.max(4, Math.min(item.x1, originalDimensions.width - item.labelW - 4));
                      let labelY = item.y1 >= item.labelH + 4 ? item.y1 - item.labelH - 3 : item.y1 + 4;

                      // Multi-attempt collision avoidance
                      for (let attempt = 0; attempt < 5; attempt++) {
                        const collides = placedRects.some(
                          (p) =>
                            labelX < p.x + p.w + 4 &&
                            labelX + item.labelW > p.x - 4 &&
                            labelY < p.y + p.h + 2 &&
                            labelY + item.labelH > p.y - 2
                        );
                        if (!collides) break;

                        if (attempt === 0) {
                          labelY = item.y2 + 3;
                        } else if (attempt === 1) {
                          labelY = item.y1 + 4;
                        } else if (attempt === 2) {
                          labelX = Math.max(4, Math.min(item.x2 - item.labelW, originalDimensions.width - item.labelW - 4));
                        } else if (attempt === 3) {
                          labelY = Math.max(4, item.y2 - item.labelH - 4);
                        } else {
                          labelY += item.labelH + 3;
                        }

                        labelX = Math.max(4, Math.min(labelX, originalDimensions.width - item.labelW - 4));
                        labelY = Math.max(4, Math.min(labelY, originalDimensions.height - item.labelH - 4));
                      }

                      placedRects.push({ x: labelX, y: labelY, w: item.labelW, h: item.labelH });

                      return {
                        ...item,
                        labelX,
                        labelY,
                      };
                    });

                    // 3. Render SVG elements (sorted so selected item renders on top)
                    const sortedForRender = [...positionedItems].sort((a, b) => (a.isSelected ? 1 : b.isSelected ? -1 : 0));

                    return sortedForRender.map((item) => {
                      const showBadge = labelMode !== 'hidden' || item.isSelected || item.isHovered;
                      const cornerLen = Math.max(6, Math.min(20, item.boxW * 0.15, item.boxH * 0.15));

                      return (
                        <g
                          key={item.obj.id}
                          style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectDetection(item.obj.id);
                          }}
                          onMouseEnter={() => setHoveredDetectionId(item.obj.id)}
                          onMouseLeave={() => setHoveredDetectionId(null)}
                        >
                          {/* Main Bounding Box Rect */}
                          <rect
                            x={item.x1}
                            y={item.y1}
                            width={item.boxW}
                            height={item.boxH}
                            fill={item.fillColor}
                            stroke={item.strokeColor}
                            strokeWidth={item.strokeWidth}
                            strokeDasharray={item.isSelected ? `${originalDimensions.width * 0.006} ${originalDimensions.width * 0.003}` : 'none'}
                            rx={3}
                          />

                          {/* Selected High-Tech Corner Brackets */}
                          {item.isSelected && (
                            <g stroke="#38bdf8" strokeWidth={item.strokeWidth * 1.3} fill="none">
                              <path d={`M ${item.x1} ${item.y1 + cornerLen} L ${item.x1} ${item.y1} L ${item.x1 + cornerLen} ${item.y1}`} />
                              <path d={`M ${item.x2 - cornerLen} ${item.y1} L ${item.x2} ${item.y1} L ${item.x2} ${item.y1 + cornerLen}`} />
                              <path d={`M ${item.x1} ${item.y2 - cornerLen} L ${item.x1} ${item.y2} L ${item.x1 + cornerLen} ${item.y2}`} />
                              <path d={`M ${item.x2 - cornerLen} ${item.y2} L ${item.x2} ${item.y2} L ${item.x2} ${item.y2 - cornerLen}`} />
                            </g>
                          )}

                          {/* Sleek, Compact Semantic Badge */}
                          {showBadge && (
                            <g>
                              {/* Background Pill */}
                              <rect
                                x={item.labelX}
                                y={item.labelY}
                                width={item.labelW}
                                height={item.labelH}
                                fill={item.isSelected ? '#082f49' : '#070d18'}
                                stroke={item.strokeColor}
                                strokeWidth={Math.max(1, originalDimensions.width * 0.001)}
                                rx={Math.max(3, item.fontSize * 0.25)}
                                opacity={0.92}
                              />

                              {/* Status Dot */}
                              <circle
                                cx={item.labelX + item.fontSize * 0.45}
                                cy={item.labelY + item.labelH * 0.5}
                                r={Math.max(2, item.fontSize * 0.18)}
                                fill={item.strokeColor}
                              />

                              {/* Text */}
                              <text
                                x={item.labelX + item.fontSize * 0.85}
                                y={item.labelY + item.labelH * 0.72}
                                fill="#ffffff"
                                fontSize={item.fontSize}
                                fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
                                fontWeight="bold"
                                textAnchor="start"
                                style={{ userSelect: 'none' }}
                              >
                                {item.labelText}
                              </text>
                            </g>
                          )}

                          {/* Corner Anchors */}
                          <circle cx={item.x1} cy={item.y1} r={Math.max(2.5, originalDimensions.width * 0.002)} fill="#ffffff" />
                          <circle cx={item.x2} cy={item.y2} r={Math.max(2.5, originalDimensions.width * 0.002)} fill="#ffffff" />
                        </g>
                      );
                    });
                  })()}
              </svg>
            </>
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

        {/* Sonar Hazard Class Legend */}
        {imageUrl && (
          <div className="absolute bottom-2.5 right-3 hidden md:flex items-center gap-2.5 text-[10px] font-mono bg-marine-950/90 backdrop-blur-sm px-2.5 py-0.5 rounded border border-marine-800 pointer-events-none z-10 shadow-lg">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Legend:</span>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#ef4444]" />
              <span className="text-red-300 font-medium">Shipwreck</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#06b6d4]" />
              <span className="text-cyan-300 font-medium">Pipeline</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#10b981]" />
              <span className="text-emerald-300 font-medium">Ghost Net</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#d946ef]" />
              <span className="text-fuchsia-300 font-medium">Mine Cyl</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#f97316]" />
              <span className="text-orange-300 font-medium">Crab Pot</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
