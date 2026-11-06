import React from 'react';
import { motion } from 'framer-motion';
import {
  Target,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  Briefcase,
  GraduationCap
} from 'lucide-react';
import { useCareerGuideStore } from '../../store/useCareerGuideStore';

export const PlacementReadinessView = () => {
  const currentStage = useCareerGuideStore((state) => state.currentStage);
  const careerGoal = useCareerGuideStore((state) => state.careerGoal);
  const careerProfiles = useCareerGuideStore((state) => state.careerProfiles);
  const getPlacementReadiness = useCareerGuideStore((state) => state.getPlacementReadiness);

  const readiness = getPlacementReadiness();

  if (!careerGoal) {
    return (
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-3">
        <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center font-bold text-lg">
          🎯
        </div>
        <h4 className="font-heading font-extrabold text-sm text-slate-900 dark:text-white">
          Career Goal Not Set Yet
        </h4>
        <p className="text-xs text-slate-500 max-w-xs mx-auto">
          Please select your target career goal in the Roadmap tab to evaluate your campus placement readiness score.
        </p>
      </div>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'from-emerald-500 to-teal-500';
    if (score >= 55) return 'from-teal-500 to-amber-500';
    return 'from-amber-500 to-rose-500';
  };

  return (
    <div className="space-y-4">
      {/* Top Readiness Score Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-5 shadow-lg relative overflow-hidden border border-emerald-900/40">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Briefcase className="w-36 h-36" />
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-[10px] font-extrabold uppercase tracking-wider flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>Campus Placement Evaluation</span>
            </span>

            <span className="text-[11px] font-bold text-slate-300">
              {currentStage}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-extrabold text-xl text-white">
                {careerGoal} Readiness
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Evaluated against campus hiring criteria
              </p>
            </div>

            {/* Score Ring / Badge */}
            <div className="text-right">
              <div className="text-3xl font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200 font-mono">
                {readiness.score}%
              </div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide">
                {readiness.score >= 75 ? '🔥 High Readiness' : readiness.score >= 50 ? '⚡ Good Progress' : '🌱 Needs Foundation'}
              </span>
            </div>
          </div>

          {/* Full Progress Bar */}
          <div className="w-full bg-slate-700/80 rounded-full h-2.5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${readiness.score}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className={`h-full bg-gradient-to-r ${getScoreColor(readiness.score)} rounded-full shadow-xs`}
            />
          </div>
        </div>
      </div>

      {/* 6 Placement Pillars Breakdown */}
      <div className="bg-white dark:bg-slate-900/90 rounded-3xl p-5 border border-emerald-100/90 dark:border-emerald-900/40 shadow-card space-y-3.5">
        <h4 className="font-heading font-extrabold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
          <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Core Evaluation Pillars</span>
        </h4>

        <div className="grid grid-cols-2 gap-2.5">
          {readiness.pillars.map((p) => (
            <div
              key={p.name}
              className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
                p.done
                  ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60'
                  : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/70'
              }`}
            >
              <div className="min-w-0 pr-2">
                <span className="font-heading font-bold text-xs text-slate-900 dark:text-white block truncate">
                  {p.name}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  Weight: {p.weight}%
                </span>
              </div>

              <div className="shrink-0">
                {p.done ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Clock className="w-5 h-5 text-amber-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* What You Need to Improve */}
      <div className="bg-white dark:bg-slate-900/90 rounded-3xl p-5 border border-emerald-100/90 dark:border-emerald-900/40 shadow-card space-y-3">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <h4 className="font-heading font-extrabold text-sm text-slate-900 dark:text-white">
            What You Need to Improve
          </h4>
        </div>

        <div className="space-y-2">
          {readiness.improvements.map((item, idx) => (
            <div
              key={idx}
              className="p-3 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 rounded-2xl text-xs text-slate-800 dark:text-slate-200 flex items-start space-x-2.5"
            >
              <span className="w-5 h-5 rounded-full bg-amber-500 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="leading-snug">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
