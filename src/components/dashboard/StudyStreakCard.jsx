import React from 'react';
import { Flame, Trophy, Award, Sparkles } from 'lucide-react';
import { useDashboardStore } from '../../store/useDashboardStore';
import { useProfileStore } from '../../store/useProfileStore';

export const StudyStreakCard = () => {
  const streakCount = useDashboardStore((state) => state.streakCount);
  const badges = useProfileStore((state) => state.badges);
  const unlockedBadges = badges.filter((b) => b.unlocked);

  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <div className="bg-surface/90 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-5 border border-emerald-100/80 dark:border-emerald-900/40 shadow-card space-y-3 transition-all duration-200 hover:shadow-card-hover">
      <div className="flex items-center justify-between">
        <h3 className="font-heading font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
          <Flame className="w-4.5 h-4.5 text-amber-500 fill-amber-500/30 animate-pulse" />
          <span className="tracking-tight">Study Streak & Achievements</span>
        </h3>
        <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center space-x-1 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-200/60 dark:border-amber-800/40">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{unlockedBadges.length} Badges Earned</span>
        </span>
      </div>

      <div className="p-3.5 bg-gradient-to-r from-amber-500/15 via-amber-400/10 to-orange-500/15 dark:from-amber-950/40 dark:to-orange-950/40 rounded-2xl border border-amber-200/70 dark:border-amber-800/50 flex items-center justify-between shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-glow hover:scale-105 transition-transform cursor-pointer">
            <Flame className="w-7 h-7 fill-white" />
          </div>
          <div>
            <h4 className="font-heading font-extrabold text-base text-slate-900 dark:text-white">
              {streakCount} Days Active Streak! 🔥
            </h4>
            <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300">Log in daily to keep your flame burning</p>
          </div>
        </div>

        {/* Weekly Activity Dots */}
        <div className="flex space-x-1.5">
          {days.map((d, i) => (
            <div key={i} className="flex flex-col items-center space-y-1">
              <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400">{d}</span>
              <div
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  i < streakCount ? 'bg-amber-500 ring-2 ring-amber-400/30' : 'bg-slate-200 dark:bg-slate-700/80'
                }`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Unlocked Badges Showcase Bar */}
      <div className="flex space-x-2 overflow-x-auto pt-1 pb-1 scrollbar-none">
        {badges.map((b) => (
          <div
            key={b.id}
            className={`px-3 py-2 rounded-2xl border flex items-center space-x-2 shrink-0 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 ${
              b.unlocked
                ? 'bg-slate-50/90 dark:bg-slate-800/90 border-emerald-200 dark:border-emerald-800/60 shadow-xs'
                : 'bg-slate-100/50 dark:bg-slate-900/40 border-slate-200/80 opacity-60 grayscale'
            }`}
          >
            <span className="text-base">{b.icon}</span>
            <div>
              <span className="font-bold text-xs text-slate-900 dark:text-slate-100 block truncate max-w-[100px]">
                {b.title}
              </span>
              <span className="text-[9px] font-medium text-slate-500 dark:text-slate-400">{b.unlocked ? 'Unlocked' : 'Locked'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

