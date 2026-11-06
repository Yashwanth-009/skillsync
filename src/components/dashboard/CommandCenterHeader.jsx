import React, { useState } from 'react';
import { Flame, Sparkles, Zap, Radio, Target, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/useAuthStore';
import { useDashboardStore } from '../../store/useDashboardStore';

export const CommandCenterHeader = () => {
  const user = useAuthStore((state) => state.user);
  const streakCount = useDashboardStore((state) => state.streakCount);

  const statusModes = [
    {
      id: 'active',
      icon: Radio,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800',
      textColor: 'text-emerald-700 dark:text-emerald-300',
      label: 'Active Study Sprint',
      sub: 'Career Pathway'
    },
    {
      id: 'focus',
      icon: Zap,
      color: 'text-amber-500',
      bg: 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800',
      textColor: 'text-amber-700 dark:text-amber-300',
      label: 'High Focus Mode',
      sub: 'Zero Distractions'
    },
    {
      id: 'schedule',
      icon: Sparkles,
      color: 'text-sky-500',
      bg: 'bg-sky-50 dark:bg-sky-950/60 border-sky-200 dark:border-sky-800',
      textColor: 'text-sky-700 dark:text-sky-300',
      label: 'Academic Schedule Synced',
      sub: 'Lectures Up-to-Date'
    },
    {
      id: 'target',
      icon: Target,
      color: 'text-purple-500',
      bg: 'bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800',
      textColor: 'text-purple-700 dark:text-purple-300',
      label: '91.3% Academic Target',
      sub: 'Top 5% Class Rank'
    }
  ];

  const [activeStatusIndex, setActiveStatusIndex] = useState(0);

  const currentStatus = statusModes[activeStatusIndex];
  const IconComponent = currentStatus.icon;

  const handleNextStatus = () => {
    setActiveStatusIndex((prev) => (prev + 1) % statusModes.length);
  };

  return (
    <div className="bg-surface/90 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-5 border border-emerald-100/80 dark:border-emerald-900/40 shadow-card relative overflow-hidden transition-all duration-200 hover:shadow-card-hover">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute -top-6 -right-6 w-40 h-40 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-2xl pointer-events-none" />

      {/* Header Banner */}
      <div className="flex items-center justify-between relative z-10">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 bg-amber-100/80 dark:bg-amber-950/80 text-amber-800 dark:text-amber-200 text-[10px] font-extrabold rounded-full flex items-center space-x-1 border border-amber-200 dark:border-amber-800/60 shadow-2xs">
              <Flame className="w-3 h-3 text-amber-500 fill-amber-500 animate-pulse" />
              <span>{streakCount} Day Streak</span>
            </span>
          </div>

          <h2 className="font-heading font-extrabold text-xl text-slate-900 dark:text-white mt-2 leading-snug tracking-tight">
            Good morning, {user.name.split(' ')[0]} 👋
          </h2>

          {/* INTERACTIVE ANIMATED STATUS TICKER (Replaces static text) */}
          <div className="mt-2.5 flex items-center space-x-2">
            <motion.button
              onClick={handleNextStatus}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              className={`px-3 py-1.5 rounded-2xl border ${currentStatus.bg} shadow-sm flex items-center space-x-2 cursor-pointer transition-all relative overflow-hidden group`}
              title="Click to toggle active status mode"
            >
              {/* Pulse Radar Dot */}
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${currentStatus.color.replace('text-', 'bg-')}`} />
                <span className={`relative inline-flex rounded-full h-2 w-2 ${currentStatus.color.replace('text-', 'bg-')}`} />
              </span>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStatus.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center space-x-1.5"
                >
                  <IconComponent className={`w-3.5 h-3.5 ${currentStatus.color} animate-bounce`} />
                  <span className={`text-xs font-extrabold ${currentStatus.textColor}`}>
                    {currentStatus.label}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold hidden sm:inline">
                    • {currentStatus.sub}
                  </span>
                </motion.div>
              </AnimatePresence>

              <RefreshCw className="w-3 h-3 text-slate-400 opacity-60 group-hover:opacity-100 group-hover:rotate-180 transition-all duration-300" />
            </motion.button>
          </div>
        </div>

        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-secondary p-0.5 shadow-md shrink-0 hover:scale-105 transition-transform cursor-pointer">
          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-xl" />
        </div>
      </div>
    </div>
  );
};
