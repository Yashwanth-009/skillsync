import React, { useState } from 'react';
import { useCareerGuideStore } from '../../store/useCareerGuideStore';
import { CareerRoadmapView } from './CareerRoadmapView';
import { ProjectsAndCertsView } from './ProjectsAndCertsView';
import { PlacementReadinessView } from './PlacementReadinessView';
import { CareerGoalSetupModal } from './CareerGoalSetupModal';

export const CareerGuideContainer = () => {
  const currentStage = useCareerGuideStore((state) => state.currentStage);
  const branch = useCareerGuideStore((state) => state.branch);
  const careerGoal = useCareerGuideStore((state) => state.careerGoal);
  const careerProfiles = useCareerGuideStore((state) => state.careerProfiles);
  const activeSubView = useCareerGuideStore((state) => state.activeSubView);
  const setActiveSubView = useCareerGuideStore((state) => state.setActiveSubView);
  const getRoadmapStats = useCareerGuideStore((state) => state.getRoadmapStats);
  const getPlacementReadiness = useCareerGuideStore((state) => state.getPlacementReadiness);
  const isGoalConfigured = useCareerGuideStore((state) => state.isGoalConfigured);
  const configureGoal = useCareerGuideStore((state) => state.configureGoal);

  const [showGoalModal, setShowGoalModal] = useState(false);

  // Setup landing state (no default entries)
  const [inputStage, setInputStage] = useState('');
  const [inputGoal, setInputGoal] = useState('');
  const [inputBranch, setInputBranch] = useState('');
  const [inputSkills, setInputSkills] = useState('');

  const stats = getRoadmapStats();
  const readiness = getPlacementReadiness();

  const subTabs = [
    { id: 'overview', label: 'Roadmap', badge: `${stats.percentage}%` },
    { id: 'projects', label: 'Projects & Certs', badge: `${stats.completedProjectsCount}/${stats.totalProjectsCount}` },
    { id: 'readiness', label: 'Readiness', badge: `${readiness.score}%` }
  ];

  const handleLandingSubmit = (e) => {
    e.preventDefault();
    if (!inputStage.trim() || !inputGoal.trim()) return;

    const parsedSkills = inputSkills
      ? inputSkills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    configureGoal({
      stage: inputStage.trim(),
      branch: inputBranch.trim(),
      goal: inputGoal.trim(),
      skillLevel: 'Beginner',
      skills: parsedSkills
    });
  };

  // If goal is not yet configured, show clean direct text bar inputs
  if (!isGoalConfigured()) {
    return (
      <div className="p-4 space-y-4 max-w-md mx-auto relative pb-20 text-left">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div>
            <h2 className="font-bold text-lg text-slate-900 dark:text-white">
              Career Pathway Setup
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Enter your current state and target career goal to generate your roadmap.
            </p>
          </div>

          <form onSubmit={handleLandingSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Current State *
              </label>
              <input
                type="text"
                value={inputStage}
                onChange={(e) => setInputStage(e.target.value)}
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
                value={inputGoal}
                onChange={(e) => setInputGoal(e.target.value)}
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
                value={inputBranch}
                onChange={(e) => setInputBranch(e.target.value)}
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
                value={inputSkills}
                onChange={(e) => setInputSkills(e.target.value)}
                placeholder="Enter known skills (separated by comma)"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={!inputStage.trim() || !inputGoal.trim()}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-sm rounded-lg transition-colors cursor-pointer mt-2"
            >
              Generate Career Pathway
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Once configured, render clean dashboard
  return (
    <div className="space-y-4">
      {/* 1. Simple Summary Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Career Pathway
          </span>

          <button
            type="button"
            onClick={() => setShowGoalModal(true)}
            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Edit
          </button>
        </div>

        {/* Current State -> Target Goal */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Current State</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {currentStage}
            </span>
            {branch && (
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                {branch}
              </span>
            )}
          </div>

          <div className="px-3 text-slate-400 font-bold">
            →
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Target Goal</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {careerGoal}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Sub-Tab Switcher */}
      <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl grid grid-cols-3 gap-1">
        {subTabs.map((tab) => {
          const isActive = activeSubView === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubView(tab.id)}
              className={`py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                isActive
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="text-[10px] ml-1 text-slate-400">
                  ({tab.badge})
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 3. Sub-View Body */}
      <div>
        {activeSubView === 'overview' && <CareerRoadmapView />}
        {activeSubView === 'projects' && <ProjectsAndCertsView />}
        {activeSubView === 'readiness' && <PlacementReadinessView />}
      </div>

      {/* Modals */}
      <CareerGoalSetupModal
        isOpen={showGoalModal}
        onClose={() => setShowGoalModal(false)}
      />
    </div>
  );
};
