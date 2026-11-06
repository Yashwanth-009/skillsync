import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target,
  Sparkles,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  BookOpen,
  Zap,
  Info
} from 'lucide-react';
import { useCareerGuideStore } from '../../store/useCareerGuideStore';

export const SkillGapAnalysisView = ({ onStartLearning }) => {
  const careerGoal = useCareerGuideStore((state) => state.careerGoal);
  const careerProfiles = useCareerGuideStore((state) => state.careerProfiles);
  const knownSkills = useCareerGuideStore((state) => state.knownSkills);
  const getActiveProfile = useCareerGuideStore((state) => state.getActiveProfile);

  const cleanGoal = careerGoal?.trim() || '';
  const profile = (cleanGoal && careerProfiles[cleanGoal]) || getActiveProfile();

  if (!profile) {
    return (
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-3">
        <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center font-bold text-lg">
          🎯
        </div>
        <h4 className="font-heading font-extrabold text-sm text-slate-900 dark:text-white">
          Career Goal Not Set Yet
        </h4>
        <p className="text-xs text-slate-500 max-w-xs mx-auto">
          Please choose your target career role in the Roadmap tab to view skill gap analysis.
        </p>
      </div>
    );
  }

  const requiredSkills = profile.requiredSkills || [];
  const nextStep = profile.nextStep;

  // Filter skills into Acquired vs. Missing
  const missingSkills = requiredSkills.filter((req) => {
    // Check if skill is in knownSkills (loose substring match)
    return !knownSkills.some((known) =>
      req.name.toLowerCase().includes(known.toLowerCase()) ||
      known.toLowerCase().includes(req.name.toLowerCase())
    );
  });

  const [activeTab, setActiveTab] = useState('gap'); // 'gap' | 'all'

  return (
    <div className="space-y-4">
      {/* 🎯 Signature Component: Your Next Best Step */}
      {nextStep && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-700 text-white rounded-3xl p-5 shadow-lg relative overflow-hidden"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 p-4 opacity-15 pointer-events-none">
            <Zap className="w-32 h-32" />
          </div>

          <div className="relative z-10 space-y-3">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-extrabold uppercase tracking-wider text-emerald-100 flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>AI Recommended Action</span>
              </span>
              <span className="text-[11px] font-mono text-emerald-200">
                ⏱ {nextStep.estimatedHours}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-bold text-emerald-100 uppercase tracking-wide">
                🎯 Your Next Best Step
              </span>
              <h3 className="font-heading font-extrabold text-base sm:text-lg text-white mt-0.5">
                {nextStep.title}
              </h3>
            </div>

            <div className="bg-black/20 backdrop-blur-xs p-3 rounded-2xl border border-white/10 text-xs text-emerald-50 leading-relaxed">
              <div className="font-bold text-emerald-200 text-[10px] uppercase mb-0.5">Why this matters:</div>
              {nextStep.why}
            </div>

            <button
              onClick={() => onStartLearning && onStartLearning(nextStep.title)}
              className="w-full py-2.5 bg-white text-emerald-800 hover:bg-emerald-50 active:scale-98 rounded-xl font-heading font-extrabold text-xs shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>{nextStep.actionText || 'Start Learning →'}</span>
              <ArrowRight className="w-4 h-4 text-emerald-700" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Skill Gap Visualizer Card */}
      <div className="bg-white dark:bg-slate-900/90 rounded-3xl p-5 border border-emerald-100/90 dark:border-emerald-900/40 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-heading font-extrabold text-base text-slate-900 dark:text-white">
              Skill Gap Analysis
            </h3>
          </div>

          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
            {requiredSkills.length - missingSkills.length}/{requiredSkills.length} Acquired
          </span>
        </div>

        {/* Missing Skills Warning Banner */}
        {missingSkills.length > 0 ? (
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 rounded-2xl flex items-start space-x-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
            <div className="text-xs text-amber-900 dark:text-amber-200 leading-snug">
              <span className="font-bold">Missing {missingSkills.length} High-Impact Skills:</span> Complete these topics to become placement ready for <span className="font-extrabold">{careerGoal}</span>.
            </div>
          </div>
        ) : (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 rounded-2xl flex items-start space-x-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
            <div className="text-xs text-emerald-900 dark:text-emerald-200">
              <span className="font-bold">Awesome!</span> You have foundational coverage across all required skills for this role.
            </div>
          </div>
        )}

        {/* Required Skills Grid */}
        <div className="space-y-3 pt-1">
          {requiredSkills.map((skill) => {
            const isAcquired = !missingSkills.includes(skill);
            const priorityBadgeColor =
              skill.priority === 'High'
                ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                : skill.priority === 'Medium'
                ? 'bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400';

            return (
              <div
                key={skill.name}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isAcquired
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-800/40'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700/60'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2 min-w-0">
                    {isAcquired ? (
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-slate-600 shrink-0" />
                    )}
                    <span className="font-heading font-extrabold text-xs text-slate-900 dark:text-white truncate">
                      {skill.name}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5 shrink-0">
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${priorityBadgeColor}`}>
                      {skill.priority}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400">
                      {skill.level}%
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-200 dark:bg-slate-700/80 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      isAcquired
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                        : 'bg-slate-400 dark:bg-slate-500'
                    }`}
                    style={{ width: `${skill.level}%` }}
                  />
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 leading-tight">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Why required: </span>
                  {skill.reason}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
