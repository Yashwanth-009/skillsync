import React from 'react';
import { Trophy, Lock, CheckCircle } from 'lucide-react';
import { useProfileStore } from '../../store/useProfileStore';

export const BadgesGrid = () => {
  const badges = useProfileStore((state) => state.badges);

  return (
    <div className="bg-surface dark:bg-slate-800 rounded-3xl p-5 border border-slate-100 dark:border-slate-700 shadow-card space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-heading font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-1.5">
          <Trophy className="w-4 h-4 text-accent" />
          <span>Achievement Badges ({badges.filter((b) => b.unlocked).length}/{badges.length})</span>
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`p-3 rounded-2xl border transition-all flex flex-col justify-between relative overflow-hidden ${
              badge.unlocked
                ? 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700/80 shadow-xs'
                : 'bg-slate-100/60 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800 grayscale opacity-70'
            }`}
          >
            {!badge.unlocked && (
              <div className="absolute top-2 right-2 p-1 bg-slate-200 dark:bg-slate-800 rounded-full text-slate-500">
                <Lock className="w-3 h-3" />
              </div>
            )}

            <div>
              <div className="text-2xl mb-1">{badge.icon}</div>
              <h4 className="font-bold text-xs text-slate-900 dark:text-white leading-tight">
                {badge.title}
              </h4>
              <p className="text-[10px] text-slate-500 line-clamp-2 mt-0.5">
                {badge.description}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mt-3">
              <div className="flex justify-between text-[9px] font-semibold text-slate-400 mb-0.5">
                <span>{badge.unlocked ? 'Unlocked' : 'Progress'}</span>
                <span>{badge.progress}%</span>
              </div>
              <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    badge.unlocked ? 'bg-emerald-500' : 'bg-primary'
                  }`}
                  style={{ width: `${badge.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
