import React, { useState } from 'react';
import {
  Compass,
  CheckCircle2,
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Layers,
  ArrowRight,
  Edit3,
  RotateCcw,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCareerGuideStore } from '../../store/useCareerGuideStore';
import { useAuthStore } from '../../store/useAuthStore';

const POPULAR_GOALS = [
  { id: 'Software Engineer', label: 'Software Engineer', icon: '💻' },
  { id: 'Full Stack Developer', label: 'Full Stack Developer', icon: '🌐' },
  { id: 'AI / ML Engineer', label: 'AI / ML Engineer', icon: '🤖' },
  { id: 'Data Scientist', label: 'Data Scientist', icon: '📊' },
  { id: 'DevOps & Cloud Engineer', label: 'Cloud / DevOps', icon: '☁️' },
  { id: 'Cybersecurity Analyst', label: 'Cybersecurity', icon: '🛡️' },
  { id: 'Mobile App Developer', label: 'Mobile App Dev', icon: '📱' }
];

const ACADEMIC_STAGES = [
  '1st Year (Foundations)',
  '2nd Year (Core CS / Engg)',
  '3rd Year (Specialization)',
  'Final Year (Placements)',
  'Graduate / Job Seeker'
];

const PRESET_BRANCHES = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'AI & DS', 'IT'];

export const CareerRoadmapView = () => {
  const user = useAuthStore((state) => state.user);
  const careerGoal = useCareerGuideStore((state) => state.careerGoal);
  const currentStage = useCareerGuideStore((state) => state.currentStage);
  const branch = useCareerGuideStore((state) => state.branch);
  const careerProfiles = useCareerGuideStore((state) => state.careerProfiles);
  const getActiveProfile = useCareerGuideStore((state) => state.getActiveProfile);
  const toggleStepCompletion = useCareerGuideStore((state) => state.toggleStepCompletion);
  const getRoadmapStats = useCareerGuideStore((state) => state.getRoadmapStats);
  const configureGoal = useCareerGuideStore((state) => state.configureGoal);
  const resetGoal = useCareerGuideStore((state) => state.resetGoal);

  const cleanGoal = careerGoal?.trim() || '';
  const cleanStage = currentStage?.trim() || '';
  const profile = (cleanGoal && careerProfiles[cleanGoal]) || getActiveProfile();
  const hasGoal = Boolean(cleanGoal && cleanStage && profile);

  // Directly derive stats from the current reactive profile
  const stats = React.useMemo(() => {
    if (!profile?.phases) {
      return { totalSteps: 0, completedSteps: 0, percentage: 0 };
    }
    let total = 0;
    let completed = 0;
    (profile.phases || []).forEach((phase) => {
      (phase.steps || []).forEach((s) => {
        total++;
        if (s.completed) completed++;
      });
    });
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { totalSteps: total, completedSteps: completed, percentage: pct };
  }, [profile]);

  // Setup Form State: start completely clean with zero pre-selected options for new users
  const [selectedStage, setSelectedStage] = useState(currentStage || '');
  const [selectedGoal, setSelectedGoal] = useState(careerGoal || '');
  const [customGoal, setCustomGoal] = useState('');
  const [selectedBranch, setSelectedBranch] = useState(branch || user?.course || '');
  const [isEditingGoal, setIsEditingGoal] = useState(false);

  // Keep first phase open by default, track expanded status per phase
  const [expandedPhases, setExpandedPhases] = useState({});

  const isPhaseOpen = (phaseId, index) => {
    if (expandedPhases[phaseId] !== undefined) {
      return expandedPhases[phaseId];
    }
    return index === 0;
  };

  const togglePhase = (phaseId, index) => {
    setExpandedPhases((prev) => {
      const current = prev[phaseId] !== undefined ? prev[phaseId] : index === 0;
      return { ...prev, [phaseId]: !current };
    });
  };

  const handleGenerateRoadmap = (e) => {
    if (e) e.preventDefault();
    const finalGoal = customGoal.trim() || selectedGoal;
    const finalStage = selectedStage?.trim();
    if (!finalGoal || !finalStage) return;

    configureGoal({
      stage: finalStage,
      branch: selectedBranch?.trim() || 'General',
      goal: finalGoal,
      skillLevel: 'Beginner',
      skills: []
    });

    setIsEditingGoal(false);
  };

  // FIRST INTERACTION / GOAL NOT SET: Show the Goal Selection View directly!
  if (!hasGoal || isEditingGoal) {
    return (
      <div className="space-y-4 text-left animate-fade-in">
        {/* Banner Card */}
        <div className="bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 rounded-3xl p-5 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <span className="px-2.5 py-0.5 bg-white/20 backdrop-blur-md text-[10px] font-extrabold rounded-full uppercase tracking-wider inline-flex items-center space-x-1">
              <Compass className="w-3 h-3 text-emerald-300" />
              <span>Personalized Pathway Setup</span>
            </span>
            <h3 className="font-heading font-extrabold text-lg text-white">
              Choose Your Target Career Goal
            </h3>
            <p className="text-xs text-white/80 leading-relaxed font-medium">
              Select your current academic stage and career aspiration. We will instantly craft a step-by-step 5-phase learning roadmap with real milestones and proof-of-work projects.
            </p>
          </div>
          <div className="absolute top-1 right-2 opacity-10 pointer-events-none">
            <Sparkles className="w-28 h-28 text-white" />
          </div>
        </div>

        {/* Goal Selection Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          {/* 1. Academic Stage */}
          <div className="space-y-2">
            <label className="block text-xs font-heading font-extrabold text-slate-900 dark:text-white">
              1. Select Your Current Academic Stage
            </label>
            <div className="flex flex-wrap gap-2">
              {ACADEMIC_STAGES.map((stg) => (
                <button
                  key={stg}
                  type="button"
                  onClick={() => setSelectedStage(stg)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    selectedStage === stg
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-300'
                  }`}
                >
                  {stg}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Target Goal */}
          <div className="space-y-2">
            <label className="block text-xs font-heading font-extrabold text-slate-900 dark:text-white">
              2. Choose Target Career Role
            </label>
            <div className="grid grid-cols-2 gap-2">
              {POPULAR_GOALS.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => {
                    setSelectedGoal(g.id);
                    setCustomGoal('');
                  }}
                  className={`p-2.5 rounded-2xl text-xs font-bold text-left transition-all border flex items-center justify-between cursor-pointer ${
                    selectedGoal === g.id && !customGoal.trim()
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-emerald-500 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-400'
                  }`}
                >
                  <span className="truncate">
                    {g.icon} {g.label}
                  </span>
                  {selectedGoal === g.id && !customGoal.trim() && (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-white ml-1" />
                  )}
                </button>
              ))}
            </div>

            {/* Custom Goal Input */}
            <div className="pt-2">
              <input
                type="text"
                value={customGoal}
                onChange={(e) => setCustomGoal(e.target.value)}
                placeholder="Or enter custom role (e.g. Embedded Engineer, DevOps)..."
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
          </div>

          {/* 3. Academic Branch */}
          <div className="space-y-2">
            <label className="block text-xs font-heading font-extrabold text-slate-900 dark:text-white">
              3. Select Academic Branch
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESET_BRANCHES.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setSelectedBranch(b)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    selectedBranch === b
                      ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="button"
              disabled={!selectedStage?.trim() || !(customGoal.trim() || selectedGoal.trim())}
              onClick={handleGenerateRoadmap}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-heading font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg shadow-emerald-600/20 flex items-center justify-center space-x-2 transition-all active:scale-[0.98] cursor-pointer"
            >
              <span>Generate My Personalized Pathway</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // GENERATED ROADMAP VIEW (With interactive working checkboxes & dynamic progress)
  return (
    <div className="space-y-4 text-left animate-fade-in">
      {/* 1. Summary Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px]">
            Roadmap Progress
          </span>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs">
              {stats.completedSteps} / {stats.totalSteps} Completed ({stats.percentage}%)
            </span>
            <button
              type="button"
              onClick={() => setIsEditingGoal(true)}
              className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[10px] font-bold rounded-lg transition-colors cursor-pointer flex items-center space-x-1"
              title="Change Career Goal"
            >
              <Edit3 className="w-3 h-3" />
              <span>Change</span>
            </button>
          </div>
        </div>

        <div>
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
            <span>{currentStage}</span>
            {branch && <span>• {branch}</span>}
            <span className="text-emerald-500 font-bold">→</span>
            <span className="font-extrabold text-slate-900 dark:text-white">{careerGoal}</span>
          </div>
          <h3 className="font-heading font-black text-base text-slate-900 dark:text-white mt-1">
            {profile.title || careerGoal} Pathway
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
            {profile.description}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1 pt-1">
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-200 dark:border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-300"
              style={{ width: `${stats.percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. Interactive Phases & Working Checkboxes */}
      <div className="space-y-3">
        {(profile.phases || []).map((phase, index) => {
          const isExpanded = isPhaseOpen(phase.id, index);
          const totalPhaseSteps = (phase.steps || []).length;
          const completedPhaseSteps = (phase.steps || []).filter((s) => s.completed).length;
          const isPhaseComplete = totalPhaseSteps > 0 && completedPhaseSteps === totalPhaseSteps;

          return (
            <div
              key={phase.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs transition-all"
            >
              {/* Phase Header */}
              <div
                onClick={() => togglePhase(phase.id, index)}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors select-none"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                      Phase {phase.number}
                    </span>
                    {isPhaseComplete && (
                      <span className="text-[9px] px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-extrabold rounded-full border border-emerald-300">
                        ✓ Completed
                      </span>
                    )}
                  </div>
                  <h4 className="font-heading font-extrabold text-sm text-slate-900 dark:text-white mt-0.5">
                    {phase.title}
                  </h4>
                </div>

                <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                  <span>
                    {completedPhaseSteps}/{totalPhaseSteps}
                  </span>
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>

              {/* Phase Steps List */}
              {isExpanded && (
                <div className="border-t border-slate-100 dark:border-slate-800 p-3.5 bg-slate-50/60 dark:bg-slate-800/30 space-y-2.5">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium px-1">
                    {phase.description}
                  </p>

                  <div className="space-y-2">
                    {(phase.steps || []).map((step) => {
                      const isCompleted = Boolean(step.completed);
                      return (
                        <div
                          key={step.id}
                          role="checkbox"
                          aria-checked={isCompleted}
                          tabIndex={0}
                          onClick={() => {
                            toggleStepCompletion(careerGoal, phase.id, step.id);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === ' ' || e.key === 'Enter') {
                              e.preventDefault();
                              toggleStepCompletion(careerGoal, phase.id, step.id);
                            }
                          }}
                          className={`w-full p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all select-none group active:scale-[0.99] ${
                            isCompleted
                              ? 'bg-emerald-50/90 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-700 text-slate-700 dark:text-slate-300 shadow-2xs'
                              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:border-emerald-400 hover:bg-slate-50/80 dark:hover:bg-slate-750'
                          }`}
                        >
                          <div className="flex items-center space-x-3 min-w-0 flex-1">
                            <div
                              className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-200 shrink-0 ${
                                isCompleted
                                  ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs'
                                  : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 group-hover:border-emerald-500'
                              }`}
                            >
                              {isCompleted && (
                                <Check className="w-3.5 h-3.5 stroke-[3] text-white animate-in zoom-in-50 duration-150" />
                              )}
                            </div>
                            <span
                              className={`truncate flex-1 ${
                                isCompleted
                                  ? 'line-through text-slate-400 dark:text-slate-500 font-normal'
                                  : 'font-semibold text-slate-800 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-300'
                              }`}
                            >
                              {step.title}
                            </span>
                          </div>

                          {step.required && (
                            <span className="text-[10px] font-extrabold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded-full shrink-0 ml-2">
                              Required
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
