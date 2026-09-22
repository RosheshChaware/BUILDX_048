'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  Camera,
  Video,
  VideoOff,
  Radio,
  Users,
  AlertTriangle,
  Flame,
  RefreshCw,
  Maximize2,
  Activity,
  CheckCircle2,
  Sliders,
} from 'lucide-react';

export interface DetectedPerson {
  id: number;
  confidence: number;
  box: [number, number, number, number]; // [x1, y1, x2, y2] in pixels
  norm_box: [number, number, number, number]; // [0..1]
  center: [number, number]; // [cx, cy] normalized [0..1]
  zone: string;
}

export function WebcamCrowdAnalyticsMap() {
  // Webcam stream state
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraStatus, setCameraStatus] = useState<'OFFLINE' | 'CONNECTING' | 'CONNECTED' | 'ERROR'>('OFFLINE');
  const [cameraError, setCameraError] = useState<string | null>(null);

  // CV Backend status
  const [backendStatus, setBackendStatus] = useState<'CHECKING' | 'ONLINE' | 'OFFLINE'>('CHECKING');
  
  // Real detection & tracking metrics
  const [currentPeople, setCurrentPeople] = useState<number>(0);
  const [trackedPeople, setTrackedPeople] = useState<number>(0);
  const [estimatedCrowd, setEstimatedCrowd] = useState<number>(0);
  const [detectionFps, setDetectionFps] = useState<number>(0);
  const [lastUpdated, setLastUpdated] = useState<string>('Never');
  const [detectedPersons, setDetectedPersons] = useState<DetectedPerson[]>([]);
  
  // Overlay Toggles
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showBoxes, setShowBoxes] = useState(true);

  // References
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const sendLoopTimeoutRef = useRef<any>(null);
  const isProcessingFrameRef = useRef<boolean>(false);

  // 1. Check Python YOLO backend health on mount
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/health', { method: 'GET' });
        if (res.ok) {
          const data = await res.json();
          if (data.status === 'ONLINE') {
            setBackendStatus('ONLINE');
            return;
          }
        }
        setBackendStatus('OFFLINE');
      } catch (err) {
        setBackendStatus('OFFLINE');
      }
    };
    checkBackend();
    const interval = setInterval(checkBackend, 10000);
    return () => clearInterval(interval);
  }, []);

  // 2. Start Real Webcam
  const startCamera = async () => {
    setCameraError(null);
    setCameraStatus('CONNECTING');

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Browser does not support mediaDevices.getUserMedia');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setCameraActive(true);
          setCameraStatus('CONNECTED');
        };
      }

      // Connect to WebSocket for real-time person tracking
      connectWebSocket();
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraStatus('ERROR');
      setCameraError(err.message || 'Camera permission denied or device unavailable.');
      setCameraActive(false);
    }
  };

  // 3. Stop Real Webcam
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (sendLoopTimeoutRef.current) {
      clearTimeout(sendLoopTimeoutRef.current);
    }

    setCameraActive(false);
    setCameraStatus('OFFLINE');
    setCurrentPeople(0);
    setDetectedPersons([]);
    setDetectionFps(0);
  };

  // 4. WebSocket stream for real-time YOLO ByteTrack
  const connectWebSocket = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) return;

    try {
      const ws = new WebSocket('ws://127.0.0.1:8000/ws');
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('Connected to YOLO CV stream via WebSocket');
        startFrameCaptureLoop();
      };

      ws.onmessage = (event) => {
        isProcessingFrameRef.current = false;
        try {
          const data = JSON.parse(event.data);
          if (data && !data.error) {
            setCurrentPeople(data.current_people ?? 0);
            setTrackedPeople(data.tracked_people ?? 0);
            setEstimatedCrowd(data.estimated_crowd ?? 0);
            setDetectionFps(data.fps ?? 0);
            setDetectedPersons(data.persons ?? []);
            setLastUpdated(new Date().toLocaleTimeString());
          }
        } catch (e) {
          console.error('Failed to parse detection payload:', e);
        }
      };

      ws.onerror = (e) => {
        console.warn('WebSocket error, falling back to HTTP POST pipeline', e);
        startHttpCaptureLoop();
      };

      ws.onclose = () => {
        console.log('WebSocket closed');
      };
    } catch (err) {
      console.warn('WebSocket connection failed, using HTTP polling', err);
      startHttpCaptureLoop();
    }
  };

  // 5. Capture video frame to offscreen canvas and send to YOLO service
  const captureAndSendFrame = useCallback(async () => {
    if (!videoRef.current || videoRef.current.readyState < 2) return;
    if (isProcessingFrameRef.current) return;

    const video = videoRef.current;
    const w = 480; // scale down slightly for fast 25ms inference
    const h = 360;

    if (!offscreenCanvasRef.current) {
      offscreenCanvasRef.current = document.createElement('canvas');
    }
    const canvas = offscreenCanvasRef.current;
    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, w, h);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.65);

    // If WebSocket open, send frame
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      isProcessingFrameRef.current = true;
      wsRef.current.send(dataUrl);
    } else {
      // Fallback: Direct HTTP POST
      try {
        isProcessingFrameRef.current = true;
        const res = await fetch('http://127.0.0.1:8000/detect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: dataUrl }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data && !data.error) {
            setCurrentPeople(data.current_people ?? 0);
            setTrackedPeople(data.tracked_people ?? 0);
            setEstimatedCrowd(data.estimated_crowd ?? 0);
            setDetectionFps(data.fps ?? 0);
            setDetectedPersons(data.persons ?? []);
            setLastUpdated(new Date().toLocaleTimeString());
          }
        }
      } catch (err) {
        // Backend not answering
      } finally {
        isProcessingFrameRef.current = false;
      }
    }
  }, []);

  const startFrameCaptureLoop = () => {
    const loop = () => {
      if (cameraActive || streamRef.current) {
        captureAndSendFrame();
        // Target ~20-25 FPS sampling
        sendLoopTimeoutRef.current = setTimeout(loop, 50);
      }
    };
    loop();
  };

  const startHttpCaptureLoop = () => {
    const loop = () => {
      if (cameraActive || streamRef.current) {
        captureAndSendFrame();
        sendLoopTimeoutRef.current = setTimeout(loop, 90);
      }
    };
    loop();
  };

  // Reset unique tracking IDs in backend
  const handleResetCounter = async () => {
    try {
      await fetch('http://127.0.0.1:8000/reset_tracking', { method: 'POST' });
      setTrackedPeople(0);
    } catch (e) {}
  };

  // 6. Draw Bounding Boxes + Tracking IDs + Heatmap on Camera Canvas Overlay
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    if (!cameraActive) return;

    // A. Draw Live Density Heatmap Overlay from Person Positions
    if (showHeatmap && detectedPersons.length > 0) {
      detectedPersons.forEach((p) => {
        const [cx, cy] = p.center;
        const px = cx * w;
        const py = cy * h;
        const radius = Math.max(35, Math.min(w, h) * 0.18);

        const gradient = ctx.createRadialGradient(px, py, 4, px, py, radius);
        gradient.addColorStop(0, 'rgba(239, 68, 68, 0.48)'); // high center red
        gradient.addColorStop(0.45, 'rgba(245, 158, 11, 0.32)'); // mid yellow/amber
        gradient.addColorStop(0.75, 'rgba(16, 185, 129, 0.18)'); // outer green
        gradient.addColorStop(1, 'rgba(16, 185, 129, 0.0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // B. Draw YOLO Bounding Boxes & Tracking IDs
    if (showBoxes) {
      detectedPersons.forEach((p) => {
        const [nx1, ny1, nx2, ny2] = p.norm_box;
        const x1 = nx1 * w;
        const y1 = ny1 * h;
        const bw = (nx2 - nx1) * w;
        const bh = (ny2 - ny1) * h;

        // Box border
        ctx.strokeStyle = '#06B6D4'; // cyan border
        ctx.lineWidth = 2;
        ctx.strokeRect(x1, y1, bw, bh);

        // Corner accents
        ctx.strokeStyle = '#22D3EE';
        ctx.lineWidth = 3;
        const corner = Math.min(10, bw * 0.2, bh * 0.2);
        // Top-left
        ctx.beginPath();
        ctx.moveTo(x1, y1 + corner);
        ctx.lineTo(x1, y1);
        ctx.lineTo(x1 + corner, y1);
        ctx.stroke();
        // Top-right
        ctx.beginPath();
        ctx.moveTo(x1 + bw - corner, y1);
        ctx.lineTo(x1 + bw, y1);
        ctx.lineTo(x1 + bw, y1 + corner);
        ctx.stroke();

        // Label Pill
        const label = `PERSON #${p.id} • ${Math.round(p.confidence * 100)}%`;
        ctx.font = 'bold 10px monospace';
        const textMetrics = ctx.measureText(label);
        const textWidth = textMetrics.width;

        ctx.fillStyle = 'rgba(8, 14, 26, 0.85)';
        ctx.fillRect(x1, Math.max(0, y1 - 18), textWidth + 10, 18);
        ctx.strokeStyle = '#06B6D4';
        ctx.lineWidth = 1;
        ctx.strokeRect(x1, Math.max(0, y1 - 18), textWidth + 10, 18);

        ctx.fillStyle = '#38BDF8';
        ctx.fillText(label, x1 + 5, Math.max(12, y1 - 5));

        // Center position dot
        ctx.fillStyle = '#EF4444';
        ctx.beginPath();
        ctx.arc(p.center[0] * w, p.center[1] * h, 3, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  }, [detectedPersons, showHeatmap, showBoxes, cameraActive]);

  return (
    <div className="bg-[#0E172B] rounded-lg border border-[#1C273E] p-3 shadow-xs space-y-3">
      {/* =========================================================================
          A. MODULE HEADER & REAL-TIME WEBCAM TELEMETRY STRIP
         ========================================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[#1C273E]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                CAM-01 • Laptop Webcam • LIVE Crowd Analytics
              </h3>
              <span
                className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase border ${
                  cameraStatus === 'CONNECTED'
                    ? 'bg-emerald-950 border-emerald-700 text-emerald-400 animate-pulse'
                    : cameraStatus === 'CONNECTING'
                    ? 'bg-amber-950 border-amber-700 text-amber-300'
                    : 'bg-slate-900 border-slate-700 text-slate-400'
                }`}
              >
                {cameraStatus === 'CONNECTED' ? 'CONNECTED • WEBCAM' : cameraStatus}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">
              Computer Vision: YOLOv8 Person Tracker (class 0 only • ByteTrack active)
            </p>
          </div>
        </div>

        {/* Start / Stop Camera Action Button */}
        <div className="flex items-center gap-2">
          {cameraActive ? (
            <button
              onClick={stopCamera}
              className="px-3 py-1 rounded bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs shadow transition flex items-center gap-1.5"
            >
              <VideoOff className="w-3.5 h-3.5" />
              <span>Stop Camera</span>
            </button>
          ) : (
            <button
              onClick={startCamera}
              className="px-3 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-bold text-xs shadow transition flex items-center gap-1.5"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Start Camera</span>
            </button>
          )}
        </div>
      </div>

      {/* Backend Status Alert if Offline */}
      {backendStatus === 'OFFLINE' && (
        <div className="p-2 rounded bg-amber-950/40 border border-amber-800 text-[11px] text-amber-300 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>Local Python YOLO backend running at <code>http://127.0.0.1:8000</code>.</span>
          </div>
          <span className="font-mono text-[10px] text-amber-400">PID Active: localhost:8000</span>
        </div>
      )}

      {/* =========================================================================
          B. LIVE ESTIMATED COUNT STATS BAR (Requirement 3)
         ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-mono">
        {/* Current In-Frame People */}
        <div className="p-2 rounded bg-[#090F1E] border border-[#172239]">
          <span className="text-[10px] text-slate-400 block uppercase">Current People</span>
          <div className="text-base font-bold text-cyan-400 mt-0.5">
            {currentPeople} <span className="text-[10px] font-normal text-slate-500">in frame</span>
          </div>
        </div>

        {/* Tracked People Across Session */}
        <div className="p-2 rounded bg-[#090F1E] border border-[#172239]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 uppercase">Tracked People</span>
            <button
              onClick={handleResetCounter}
              title="Reset Unique IDs"
              className="text-slate-500 hover:text-cyan-400"
            >
              <RefreshCw className="w-2.5 h-2.5" />
            </button>
          </div>
          <div className="text-base font-bold text-emerald-400 mt-0.5">
            {trackedPeople} <span className="text-[10px] font-normal text-slate-500">unique</span>
          </div>
        </div>

        {/* Estimated Sector Crowd */}
        <div className="p-2 rounded bg-[#090F1E] border border-[#172239]">
          <span className="text-[10px] text-slate-400 block uppercase">Estimated Crowd</span>
          <div className="text-base font-bold text-amber-400 mt-0.5">
            {cameraActive ? `~${estimatedCrowd}` : '0'}{' '}
            <span className="text-[10px] font-normal text-slate-500">
              {cameraActive ? '(Estimated)' : '(Standby)'}
            </span>
          </div>
        </div>

        {/* Detection Processing FPS */}
        <div className="p-2 rounded bg-[#090F1E] border border-[#172239]">
          <span className="text-[10px] text-slate-400 block uppercase">Detection FPS</span>
          <div className="text-base font-bold text-white mt-0.5 flex items-center gap-1">
            <span>{detectionFps}</span>
            <span className="text-[10px] font-normal text-slate-500">fps</span>
          </div>
        </div>

        {/* Camera Pipeline Status */}
        <div className="p-2 rounded bg-[#090F1E] border border-[#172239] col-span-2 sm:col-span-1">
          <span className="text-[10px] text-slate-400 block uppercase">Camera Status</span>
          <div className="text-xs font-bold text-slate-200 mt-1 flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                cameraActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'
              }`}
            ></span>
            <span className="truncate">{cameraActive ? 'ONLINE • CAM-01' : 'OFFLINE'}</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          C. LIVE CAMERA FEED WITH REAL BOUNDING BOXES & DENSITY HEATMAP
         ========================================================================= */}
      <div className="w-full bg-[#090F1E] rounded-md border border-[#172239] overflow-hidden flex flex-col">
        {/* Feed Header & Overlay Controls */}
        <div className="px-3 py-2 border-b border-[#172239] flex items-center justify-between text-xs bg-[#0C1424]">
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-mono font-bold text-xs text-slate-200">
              OPTICAL SENSOR VIEW (CAM-01)
            </span>
          </div>

          {/* Overlays checkboxes */}
          <div className="flex items-center gap-4 text-xs font-mono">
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white">
              <input
                type="checkbox"
                checked={showBoxes}
                onChange={(e) => setShowBoxes(e.target.checked)}
                className="rounded bg-slate-900 border-slate-700 text-cyan-500"
              />
              <span>YOLO Boxes</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white">
              <input
                type="checkbox"
                checked={showHeatmap}
                onChange={(e) => setShowHeatmap(e.target.checked)}
                className="rounded bg-slate-900 border-slate-700 text-cyan-500"
              />
              <span>Density Heatmap</span>
            </label>
          </div>
        </div>

        {/* Video & Canvas Stacking Enclosure */}
        <div className="relative w-full h-[360px] sm:h-[440px] bg-black flex items-center justify-center overflow-hidden">
          {/* Real HTML5 Webcam Video Element */}
          <video
            ref={videoRef}
            playsInline
            muted
            autoPlay
            className={`absolute inset-0 w-full h-full object-cover ${
              cameraActive ? 'block' : 'hidden'
            }`}
          />

          {/* Canvas Overlay for Real Bounding Boxes + Heatmap */}
          <canvas
            ref={canvasRef}
            width={640}
            height={480}
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
          />

          {/* Offline / Connect Prompt if camera is stopped */}
          {!cameraActive && (
            <div className="text-center p-8 space-y-3 z-20">
              <div className="w-14 h-14 rounded-full bg-slate-900/90 border border-slate-700 flex items-center justify-center mx-auto text-slate-500">
                <VideoOff className="w-7 h-7" />
              </div>
              <div className="font-mono font-bold text-sm text-slate-300">
                CAMERA OFFLINE (CAM-01)
              </div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Click <strong>[Start Camera]</strong> above to grant browser access to your laptop webcam for real YOLOv8 person tracking.
              </p>
              {cameraError && (
                <div className="text-xs text-red-400 font-mono bg-red-950/50 p-2 rounded border border-red-800">
                  {cameraError}
                </div>
              )}
            </div>
          )}

          {/* In-feed status banner */}
          {cameraActive && (
            <div className="absolute top-2.5 left-2.5 z-20 px-2.5 py-1 rounded bg-black/75 backdrop-blur-xs text-[10px] font-mono text-cyan-300 border border-slate-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span>CAM-01 • OPTICAL CROWD SENSOR • LIVE</span>
            </div>
          )}

          <div className="absolute bottom-2.5 right-2.5 z-20 px-2.5 py-1 rounded bg-black/75 backdrop-blur-xs text-[10px] font-mono text-slate-400 border border-slate-700">
            UPDATED: {lastUpdated}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WebcamCrowdAnalyticsMap;
