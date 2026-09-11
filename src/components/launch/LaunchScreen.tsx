import React, { useState, useEffect, useRef } from 'react';
import { Cpu, Radio, ShieldCheck, SkipForward } from 'lucide-react';
import { cn } from '../../utils/cn';
import seasentinelLogo from '../../assets/seasentinel-logo.png';

export interface LaunchScreenProps {
  onComplete: () => void;
  durationMs?: number; // default ~3200ms
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  fadeSpeed: number;
}

export const LaunchScreen: React.FC<LaunchScreenProps> = ({
  onComplete,
  durationMs = 3200,
}) => {
  const [progress, setProgress] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);
  const [stage, setStage] = useState<'pulse' | 'rings' | 'logo' | 'tagline' | 'ready' | 'exit'>('pulse');
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const hasFinishedRef = useRef(false);

  const statusMessages = [
    'Initializing sonar intelligence...',
    'Loading detection engine...',
    'Preparing marine analysis...',
    'Initializing anomaly detection...',
    'System ready.',
  ];

  const finishLaunch = () => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    setIsFadingOut(true);
    setTimeout(() => {
      setIsDismissed(true);
      onCompleteRef.current();
    }, 400); // 400ms fade-out duration
  };

  // Particle background animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Create deep ocean marine particulate
    const particleCount = Math.min(50, Math.floor((width * height) / 30000));
    const particles: Particle[] = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.8 + 0.5,
      speedY: -(Math.random() * 0.35 + 0.1), // gently drifting upwards
      speedX: (Math.random() - 0.5) * 0.15,
      opacity: Math.random() * 0.5 + 0.1,
      fadeSpeed: (Math.random() * 0.005 + 0.002) * (Math.random() > 0.5 ? 1 : -1),
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Ambient ocean depth gradient
      const gradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        50,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.7
      );
      gradient.addColorStop(0, 'rgba(6, 25, 48, 0.4)');
      gradient.addColorStop(0.6, 'rgba(4, 13, 26, 0.85)');
      gradient.addColorStop(1, 'rgba(2, 5, 10, 0.98)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Render drifting particles
      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.opacity += p.fadeSpeed;

        if (p.opacity > 0.6 || p.opacity < 0.1) {
          p.fadeSpeed = -p.fadeSpeed;
        }

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56, 189, 248, ${Math.max(0, p.opacity)})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Main cinematic timing controller
  useEffect(() => {
    const startTime = Date.now();
    const interval = 30; // update progress every 30ms

    // Stage progression triggers
    const ringTimeout = setTimeout(() => setStage('rings'), 350);
    const logoTimeout = setTimeout(() => setStage('logo'), 800);
    const taglineTimeout = setTimeout(() => setStage('tagline'), 1400);

    const progressTimer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentPct = Math.min(100, Math.floor((elapsed / durationMs) * 100));
      setProgress(currentPct);

      // Map progress percentage to status messages
      if (currentPct < 25) {
        setStatusIndex(0);
      } else if (currentPct < 50) {
        setStatusIndex(1);
      } else if (currentPct < 75) {
        setStatusIndex(2);
      } else if (currentPct < 98) {
        setStatusIndex(3);
      } else {
        setStatusIndex(4);
        setStage('ready');
      }

      if (currentPct >= 100) {
        clearInterval(progressTimer);
        setTimeout(() => {
          finishLaunch();
        }, 400); // hold 'SYSTEM READY' briefly
      }
    }, interval);

    return () => {
      clearTimeout(ringTimeout);
      clearTimeout(logoTimeout);
      clearTimeout(taglineTimeout);
      clearInterval(progressTimer);
    };
  }, [durationMs]);

  if (isDismissed) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#02050a] text-slate-100 select-none overflow-hidden transition-opacity duration-400 ease-out',
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      )}
      role="region"
      aria-label="SeaSentinel AI Official Launch Screen"
    >
      {/* Background Canvas for subtle particles and ambient deep ocean */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Discrete Skip Intro Button */}
      <button
        onClick={finishLaunch}
        className="absolute top-6 right-6 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-marine-900/80 border border-marine-750 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 text-xs font-mono backdrop-blur-md transition-all duration-200 group focus:outline-none focus:ring-1 focus:ring-cyan-400 cursor-pointer"
        aria-label="Skip launch intro"
      >
        <span>Skip Intro</span>
        <SkipForward size={13} className="transition-transform group-hover:translate-x-0.5" />
      </button>

      {/* Top Organization Header */}
      <div className="absolute top-6 left-6 z-20 hidden sm:flex items-center gap-2 text-[11px] font-mono text-slate-400">
        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        <span>SIH 26057</span>
        <span className="text-slate-600">|</span>
        <span className="text-slate-300">MoES / NIOT</span>
      </div>

      {/* Center Sonar Pulse & Expandable Rings */}
      <div className="relative flex flex-col items-center justify-center max-w-2xl px-6 z-10">
        {/* Sonar Expanding Rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
          {/* Central Sonar Glow */}
          <div className="w-40 h-40 sm:w-60 sm:h-60 rounded-full bg-cyan-500/5 blur-3xl animate-pulse" />

          {/* Concentric Thin Rings */}
          <div
            className={cn(
              'absolute rounded-full border border-cyan-500/20 transition-all duration-1000 ease-out',
              stage === 'pulse' ? 'w-12 h-12 opacity-0 scale-50' : 'w-72 h-72 sm:w-96 sm:h-96 opacity-60 scale-100'
            )}
          />
          <div
            className={cn(
              'absolute rounded-full border border-cyan-400/15 transition-all duration-1000 delay-150 ease-out',
              stage === 'pulse' ? 'w-12 h-12 opacity-0 scale-50' : 'w-[26rem] h-[26rem] sm:w-[32rem] sm:h-[32rem] opacity-40 scale-100'
            )}
          />
          <div
            className={cn(
              'absolute rounded-full border border-teal-500/10 transition-all duration-1000 delay-300 ease-out',
              stage === 'pulse' ? 'w-12 h-12 opacity-0 scale-50' : 'w-[34rem] h-[34rem] sm:w-[42rem] sm:h-[42rem] opacity-20 scale-100'
            )}
          />

          {/* Scanning Sweep Needle */}
          <div className="absolute w-[32rem] h-[32rem] rounded-full border border-cyan-500/10 opacity-30 animate-sonar-sweep pointer-events-none">
            <div className="w-full h-full radar-sweep-gradient rounded-full" />
          </div>
        </div>

        {/* 1. Official SeaSentinel AI Logo Artwork (Pure, uncropped, clean proportions) */}
        <div
          className={cn(
            'relative mb-5 transition-all duration-1000 ease-out flex justify-center',
            stage === 'pulse'
              ? 'opacity-0 scale-95 blur-sm translate-y-3'
              : 'opacity-100 scale-100 blur-0 translate-y-0'
          )}
        >
          {/* Subtle Ambient Backlight Glow behind Logo */}
          <div className="absolute inset-0 bg-cyan-500/15 filter blur-2xl rounded-full scale-90 pointer-events-none animate-pulse-slow" />

          <img
            src={seasentinelLogo}
            alt="AquaSentinel AI - Official Project Logo (SIH 26057)"
            className="relative z-10 w-64 sm:w-80 md:w-96 h-auto object-contain drop-shadow-[0_0_25px_rgba(6,182,212,0.35)]"
          />
        </div>

        {/* 2. Tagline & Subtitles */}
        <div
          className={cn(
            'text-center transition-all duration-700 ease-out space-y-1.5 mb-8',
            stage === 'tagline' || stage === 'ready'
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-2 pointer-events-none'
          )}
        >
          {/* Official Tagline */}
          <div className="text-sm sm:text-base md:text-lg font-bold tracking-[0.25em] text-cyan-300 font-mono uppercase drop-shadow-[0_0_12px_rgba(6,182,212,0.6)]">
            DETECT • EXPLORE • PROTECT
          </div>

          {/* Subtitle */}
          <div className="text-[11px] sm:text-xs font-semibold tracking-widest text-slate-400 uppercase font-mono">
            AI FOR A SAFER OCEAN
          </div>
        </div>

        {/* 3. Loading Indicator & Real-Time Technical Status */}
        <div className="w-full max-w-sm sm:max-w-md space-y-3 px-2">
          {/* Status Message & Percentage */}
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 text-slate-300">
              {progress < 100 ? (
                <Radio size={13} className="text-cyan-400 animate-pulse shrink-0" />
              ) : (
                <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
              )}
              <span className={cn('tracking-wide transition-colors', progress === 100 ? 'text-emerald-400 font-bold' : 'text-slate-300')}>
                {progress === 100 ? 'SYSTEM READY' : statusMessages[statusIndex]}
              </span>
            </div>

            <span className="text-cyan-300 font-bold font-mono">
              {progress}%
            </span>
          </div>

          {/* Technical Progress Bar */}
          <div className="relative w-full h-1.5 sm:h-2 bg-marine-950/90 border border-cyan-500/30 rounded-full overflow-hidden p-[1px] shadow-inner shadow-black">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-150 ease-out relative',
                progress === 100
                  ? 'bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.8)]'
                  : 'bg-gradient-to-r from-cyan-600 via-cyan-400 to-teal-300 shadow-[0_0_10px_rgba(6,182,212,0.7)]'
              )}
              style={{ width: `${progress}%` }}
            >
              {/* Pulsing glow tip on progress bar */}
              {progress < 100 && (
                <div className="absolute right-0 top-0 bottom-0 w-3 bg-white/80 rounded-full blur-[1px] animate-pulse" />
              )}
            </div>
          </div>

          {/* Scientific Hardware & Algorithm Telemetry Ticker */}
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
            <span>EDGETECH 4200 • 900 kHz</span>
            <span className="flex items-center gap-1 text-cyan-400/80">
              <Cpu size={10} /> YOLO-SONAR v4.2
            </span>
            <span>POSTGIS SPATIAL DB</span>
          </div>
        </div>
      </div>

      {/* Bottom Footer Note */}
      <div className="absolute bottom-6 text-center text-[10px] font-mono text-slate-500 px-4">
        SIH 26057 • Ministry of Earth Sciences (MoES) • National Institute of Ocean Technology (NIOT)
      </div>
    </div>
  );
};
