import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCcw, Zap, Sparkles } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (base64: string) => void;
  onClose: () => void;
  facingMode?: 'user' | 'environment';
  guideType?: 'face' | 'shelf' | 'product';
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ 
  onCapture, 
  onClose, 
  facingMode = 'user',
  guideType = 'face'
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(true);
  const [currentFacingMode, setCurrentFacingMode] = useState<'user' | 'environment'>(facingMode);
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [currentFacingMode]);

  const startCamera = async () => {
    setIsStarting(true);
    setError(null);
    stopCamera();

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: currentFacingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      };

      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (err: any) {
      console.error('Error accessing camera:', err);
      setError('Could not access camera. Please allow camera permissions in your browser or use file upload.');
    } finally {
      setIsStarting(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const toggleCamera = () => {
    setCurrentFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const triggerCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const base64 = canvas.toDataURL('image/jpeg', 0.9);
        onCapture(base64);
        stopCamera();
        onClose();
      }
    }
  };

  const startCountdown = () => {
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          triggerCapture();
          return null;
        }
        return prev ? prev - 1 : null;
      });
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4">
      <div className="relative w-full max-w-3xl aspect-[3/4] md:aspect-video bg-zinc-950 rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex items-center justify-center">
        
        {isStarting && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white gap-3 z-20">
            <RefreshCcw className="w-8 h-8 animate-spin text-rose-400" />
            <p className="text-sm font-medium">Initializing camera sensor...</p>
          </div>
        )}

        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8 text-center gap-4 z-20">
            <div className="w-16 h-16 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400">
              <X className="w-8 h-8" />
            </div>
            <p className="text-sm font-medium max-w-md text-zinc-300">{error}</p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-white text-zinc-950 rounded-full text-xs font-bold shadow-lg hover:bg-zinc-200"
            >
              Close & Upload File
            </button>
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        )}

        {/* Framing Guides Overlay */}
        {!isStarting && !error && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {guideType === 'face' ? (
              <div className="relative w-56 h-72 md:w-64 md:h-80 border-2 border-dashed border-rose-300/70 rounded-[50%] shadow-[0_0_40px_rgba(244,63,94,0.15)] flex flex-col items-center justify-end pb-4">
                <span className="text-[11px] font-bold text-white bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
                  Align Face in Oval
                </span>
              </div>
            ) : (
              <div className="relative w-[80%] h-[70%] border-2 border-dashed border-sky-300/60 rounded-2xl flex flex-col items-center justify-end pb-3">
                <span className="text-[11px] font-bold text-white bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
                  Frame Cosmetic Bottle / Shelf
                </span>
              </div>
            )}
            {/* Pulsing scanning radar line */}
            <div className="animate-scan-line" />
          </div>
        )}

        {/* Countdown overlay */}
        {countdown !== null && (
          <div className="absolute inset-0 z-30 bg-black/40 backdrop-blur-xs flex items-center justify-center">
            <span className="text-7xl font-black text-white animate-ping">
              {countdown}
            </span>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />

        {/* Top Controls: Flip Camera & Close */}
        <div className="absolute top-4 right-4 flex gap-3 z-20">
          <button
            onClick={toggleCamera}
            className="p-3 bg-zinc-900/70 hover:bg-zinc-900 backdrop-blur-md text-white rounded-full transition-all border border-white/10 active:scale-95"
            title="Switch Front/Rear Camera"
          >
            <RefreshCcw className="w-5 h-5" />
          </button>
          <button
            onClick={onClose}
            className="p-3 bg-zinc-900/70 hover:bg-zinc-900 backdrop-blur-md text-white rounded-full transition-all border border-white/10 active:scale-95"
            title="Cancel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Bottom Shutter Action Button */}
        <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center justify-center gap-3 z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={startCountdown}
              disabled={isStarting || !!error}
              className="px-4 py-2 bg-zinc-900/70 hover:bg-zinc-900 backdrop-blur-md text-white rounded-full text-xs font-semibold border border-white/10 transition-all flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>3s Timer</span>
            </button>

            <button
              onClick={triggerCapture}
              disabled={isStarting || !!error}
              className="w-18 h-18 rounded-full border-4 border-white flex items-center justify-center group disabled:opacity-50 transition-transform active:scale-90"
              title="Take Photo"
            >
              <div className="w-14 h-14 rounded-full bg-rose-500 group-hover:bg-rose-400 transition-colors shadow-lg" />
            </button>
          </div>

          <span className="text-[10px] font-bold tracking-widest text-white/70 uppercase">
            {currentFacingMode === 'user' ? 'Front Camera' : 'Rear Camera'}
          </span>
        </div>

      </div>
    </div>
  );
};
