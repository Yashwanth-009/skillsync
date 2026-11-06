import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw, Zap, Check, Sparkles, Scan, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CameraModal = ({ isOpen, onClose, onCapturePhoto }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [torchOn, setTorchOn] = useState(false);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    setCapturedImage(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsCameraActive(true);
    } catch (err) {
      console.warn('Camera access fallback to simulated capture:', err);
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };

  const handleCapture = () => {
    if (isCameraActive && videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const photoData = canvas.toDataURL('image/jpeg');
      setCapturedImage(photoData);
      stopCamera();
    } else {
      // Simulated problem capture
      const simCanvas = document.createElement('canvas');
      simCanvas.width = 600;
      simCanvas.height = 400;
      const ctx = simCanvas.getContext('2d');
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(0, 0, 600, 400);
      ctx.fillStyle = '#10B981';
      ctx.font = 'bold 24px monospace';
      ctx.fillText('Solve: 2x + 5 = 15', 50, 180);
      ctx.fillStyle = '#94A3B8';
      ctx.font = '16px sans-serif';
      ctx.fillText('Textbook Chapter 4 • Problem #12', 50, 220);
      setCapturedImage(simCanvas.toDataURL('image/jpeg'));
    }
  };

  const handleConfirm = () => {
    if (capturedImage) {
      onCapturePhoto(capturedImage);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-4">
        {/* Header */}
        <div className="flex items-center justify-between text-white z-10">
          <div className="flex items-center space-x-2">
            <Scan className="w-5 h-5 text-emerald-400 animate-pulse" />
            <h3 className="font-heading font-extrabold text-sm text-white">
              AI Problem Scanner & Viewfinder
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder Container with Laser Scan Line & Grid */}
        <div className="relative flex-1 my-4 rounded-3xl overflow-hidden bg-slate-950 border-2 border-emerald-500/40 flex items-center justify-center shadow-2xl">
          {capturedImage ? (
            <img src={capturedImage} alt="Captured Problem" className="w-full h-full object-contain" />
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {/* Laser Scanning Overlay Line */}
              <div className="absolute inset-0 pointer-events-none">
                <motion.div
                  animate={{ y: ['0%', '100%', '0%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  className="w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10B981]"
                />
              </div>

              {/* Viewfinder Target Frame Corners */}
              <div className="absolute inset-8 border-2 border-emerald-400/50 rounded-2xl pointer-events-none flex flex-col justify-between p-2">
                <div className="flex justify-between text-emerald-400">
                  <Target className="w-6 h-6" />
                  <Target className="w-6 h-6 rotate-90" />
                </div>
                <div className="text-center">
                  <span className="px-3 py-1 bg-slate-900/80 text-emerald-300 text-[10px] font-bold rounded-full border border-emerald-500/40 backdrop-blur-md">
                    Align Problem / Equation inside Frame
                  </span>
                </div>
                <div className="flex justify-between text-emerald-400">
                  <Target className="w-6 h-6 -rotate-90" />
                  <Target className="w-6 h-6 rotate-180" />
                </div>
              </div>
            </>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-around py-2 z-10">
          {capturedImage ? (
            <>
              <button
                onClick={() => startCamera()}
                className="px-5 py-2.5 bg-slate-800 text-slate-200 text-xs font-semibold rounded-2xl flex items-center space-x-2 border border-slate-700 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retake</span>
              </button>

              <button
                onClick={handleConfirm}
                className="px-6 py-2.5 bg-primary text-white text-xs font-bold rounded-2xl flex items-center space-x-2 shadow-lg shadow-emerald-500/30 cursor-pointer active:scale-95 transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Scan & Solve</span>
              </button>
            </>
          ) : (
            <div className="flex items-center space-x-6">
              <button
                onClick={() => setTorchOn(!torchOn)}
                className={`p-3 rounded-2xl border transition-colors cursor-pointer ${
                  torchOn ? 'bg-amber-500 text-slate-900 border-amber-400' : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
                title="Toggle Flash"
              >
                <Zap className="w-5 h-5" />
              </button>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleCapture}
                className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-secondary p-1 shadow-glow cursor-pointer"
              >
                <div className="w-full h-full rounded-full border-4 border-white bg-emerald-500/20 flex items-center justify-center">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </AnimatePresence>
  );
};
