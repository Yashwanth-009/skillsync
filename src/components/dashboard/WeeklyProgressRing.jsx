import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, CheckCircle } from 'lucide-react';
import { useDashboardStore } from '../../store/useDashboardStore';

export const WeeklyProgressRing = () => {
  const weeklyGoalPercentage = useDashboardStore((state) => state.weeklyGoalPercentage);
  const goals = useDashboardStore((state) => state.goals);
  const completedGoalsCount = goals.filter((g) => g.completed).length;

  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (weeklyGoalPercentage / 100) * circumference;

  return (
    <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white rounded-3xl p-5 shadow-card-hover relative overflow-hidden flex items-center justify-between transition-all duration-200 hover:shadow-glow cursor-pointer">
      {/* Background Orbs */}
      <div className="absolute -top-10 -right-10 w-36 h-36 bg-white/15 rounded-full blur-2xl pointer-events-none" />

      <div className="space-y-2 max-w-[60%] z-10">
        <div className="flex items-center space-x-1.5 bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full w-max text-[10px] font-extrabold border border-white/20 shadow-2xs">
          <Sparkles className="w-3 h-3 text-amber-300 fill-amber-300 animate-pulse" />
          <span>Weekly Momentum</span>
        </div>

        <h3 className="font-heading font-extrabold text-base leading-tight tracking-tight">
          Your Progress This Week
        </h3>

        <p className="text-xs text-emerald-100 font-medium leading-relaxed">
          You've completed <strong className="text-white font-bold">{completedGoalsCount} of {goals.length} daily goals</strong> and 84% of scheduled lectures!
        </p>

        <div className="flex items-center space-x-2 text-[11px] font-bold text-amber-300 pt-1">
          <TrendingUp className="w-4 h-4" />
          <span>+12% higher than last week</span>
        </div>
      </div>

      {/* Animated Circular Gauge Ring */}
      <div className="relative w-28 h-28 flex items-center justify-center shrink-0 z-10">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="8"
            fill="none"
          />
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            stroke="#34D399"
            strokeWidth="8"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            strokeLinecap="round"
            fill="none"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-heading font-extrabold text-white leading-none font-mono">
            {weeklyGoalPercentage}%
          </span>
          <span className="text-[9px] font-extrabold uppercase text-emerald-200 tracking-wider mt-1">This Week</span>
        </div>
      </div>
    </div>
  );
};

