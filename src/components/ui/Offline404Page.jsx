import React, { useState } from 'react';
import { WifiOff, RefreshCw, AlertTriangle, ShieldAlert } from 'lucide-react';

export const Offline404Page = ({ onRetry }) => {
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState('');

  const handleRetry = async () => {
    setChecking(true);
    setMessage('');

    // Wait a brief moment to check online status
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (navigator.onLine) {
      if (onRetry) onRetry();
    } else {
      setMessage('Still offline. Please check your network connection.');
      setChecking(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white flex items-center justify-center p-6 relative overflow-hidden select-none">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full text-center space-y-6 relative z-10">
        {/* Animated Offline Icon */}
        <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 rounded-3xl bg-rose-500/20 animate-ping opacity-30" />
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-rose-600 to-red-500 flex items-center justify-center shadow-2xl shadow-rose-600/40 border border-rose-400/30">
            <WifiOff className="w-12 h-12 text-white animate-pulse" />
          </div>
        </div>

        {/* 404 Headline */}
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-800/60 text-rose-300 text-xs font-mono font-bold">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>ERROR 404: NETWORK OFFLINE</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black font-heading tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Offline Mode Blocked
          </h1>
          <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
            SkillSync requires an active internet connection to protect your credentials, verify authentication, and securely synchronize your academic records. The application cannot run offline.
          </p>
        </div>

        {/* Security Alert Note */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-left space-y-1.5 shadow-inner">
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Connection Guard Active</span>
          </div>
          <p className="text-xs text-slate-400 leading-normal">
            Local caching is disabled to prevent unauthorized data exposure while offline. Please connect to Wi-Fi or mobile data to resume your session.
          </p>
        </div>

        {message && (
          <p className="text-xs text-rose-400 font-semibold animate-shake">
            {message}
          </p>
        )}

        {/* Action Button */}
        <button
          onClick={handleRetry}
          disabled={checking}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 active:scale-[0.98] transition-all text-white font-bold text-sm shadow-lg shadow-rose-600/30 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`} />
          <span>{checking ? 'Checking Connection...' : 'Retry Connection'}</span>
        </button>

        <p className="text-[11px] text-slate-500">
          Status: <span className="font-mono text-rose-400 font-bold">DISCONNECTED</span>
        </p>
      </div>
    </div>
  );
};
export default Offline404Page;

