import React, { useState } from 'react';
import { useCareerGuideStore } from '../../store/useCareerGuideStore';

export const CareerGoalSetupModal = ({ isOpen, onClose, onComplete }) => {
  const currentStage = useCareerGuideStore((state) => state.currentStage);
  const branch = useCareerGuideStore((state) => state.branch);
  const careerGoal = useCareerGuideStore((state) => state.careerGoal);
  const knownSkills = useCareerGuideStore((state) => state.knownSkills);
  const configureGoal = useCareerGuideStore((state) => state.configureGoal);

  // Form State: zero default presets, cleanly initialized
  const [stageInput, setStageInput] = useState(currentStage || '');
  const [goalInput, setGoalInput] = useState(careerGoal || '');
  const [branchInput, setBranchInput] = useState(branch || '');
  const [skillsInput, setSkillsInput] = useState(
    Array.isArray(knownSkills) && knownSkills.length > 0 ? knownSkills.join(', ') : ''
  );

  if (!isOpen) return null;

  const handleSave = (e) => {
    if (e) e.preventDefault();
    if (!stageInput.trim() || !goalInput.trim()) return;

    const parsedSkills = skillsInput
      ? skillsInput
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    configureGoal({
      stage: stageInput.trim(),
      branch: branchInput.trim(),
      goal: goalInput.trim(),
      skillLevel: 'Beginner',
      skills: parsedSkills
    });

    if (onComplete) onComplete();
    if (onClose) onClose();
  };

  const isFormValid = Boolean(stageInput.trim() && goalInput.trim());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 dark:border-slate-800 text-left">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Career Pathway Setup
          </h3>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-semibold cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Form Body with simple entering text bars */}
        <form onSubmit={handleSave} className="py-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Current State *
            </label>
            <input
              type="text"
              value={stageInput}
              onChange={(e) => setStageInput(e.target.value)}
              placeholder="Enter your current state"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Target Career Goal *
            </label>
            <input
              type="text"
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              placeholder="Enter target career goal"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Branch / Field
            </label>
            <input
              type="text"
              value={branchInput}
              onChange={(e) => setBranchInput(e.target.value)}
              placeholder="Enter your branch or field"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Known Skills
            </label>
            <input
              type="text"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              placeholder="Enter known skills (separated by comma)"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end space-x-2">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={!isFormValid}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg cursor-pointer"
            >
              Save Pathway
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
