import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  Layers,
  Target,
  FileText,
  Briefcase,
  Bell
} from 'lucide-react';
import { usePracticeStore } from '../../store/usePracticeStore';
import { useCareerGuideStore } from '../../store/useCareerGuideStore';
import { CareerRoadmapView } from '../careerguide/CareerRoadmapView';
import { ProjectsAndCertsView } from '../careerguide/ProjectsAndCertsView';
import { PlacementReadinessView } from '../careerguide/PlacementReadinessView';
import { CareerGoalSetupModal } from '../careerguide/CareerGoalSetupModal';
import { JobNotificationsView } from './JobNotificationsView';

export const CareerConnectContainer = () => {
  const currentStage = useCareerGuideStore((state) => state.currentStage);
  const branch = useCareerGuideStore((state) => state.branch);
  const careerGoal = useCareerGuideStore((state) => state.careerGoal);
  const careerProfiles = useCareerGuideStore((state) => state.careerProfiles);
  const activeSubView = useCareerGuideStore((state) => state.activeSubView);
  const setActiveSubView = useCareerGuideStore((state) => state.setActiveSubView);
  const getRoadmapStats = useCareerGuideStore((state) => state.getRoadmapStats);
  const getPlacementReadiness = useCareerGuideStore((state) => state.getPlacementReadiness);
  const isGoalConfigured = useCareerGuideStore((state) => state.isGoalConfigured);

  const activeMainTab = usePracticeStore((state) => state.careerConnectTab || 'hub');
  const setActiveMainTab = usePracticeStore((state) => state.setCareerConnectTab);

  const [showGoalModal, setShowGoalModal] = useState(false);

  // Sub-tab navigation with browser history integration for mobile gesture and back buttons
  const handleOpenSubTab = (subTab) => {
    if (!window.history.state || window.history.state.subTab !== 'hub') {
      window.history.replaceState({ screen: 'careerconnect', subTab: 'hub' }, '');
    }
    window.history.pushState({ screen: 'careerconnect', subTab }, '');
    setActiveMainTab(subTab);
  };

  const handleBackToHub = () => {
    if (window.history.state?.subTab && window.history.state?.subTab !== 'hub') {
      window.history.back();
    } else {
      window.history.replaceState({ screen: 'careerconnect', subTab: 'hub' }, '');
      setActiveMainTab('hub');
    }
  };

  const stats = getRoadmapStats();
  const readiness = getPlacementReadiness();
  const hasGoal = Boolean(careerGoal?.trim() && currentStage?.trim() && isGoalConfigured());

  const careerSubTabs = [
    { id: 'overview', label: 'Roadmap', icon: Layers, badge: hasGoal ? `${stats.percentage}%` : null },
    { id: 'projects', label: 'Projects & Certs', icon: FileText, badge: hasGoal ? `${stats.completedProjectsCount}/${stats.totalProjectsCount}` : null },
    { id: 'readiness', label: 'Readiness', icon: Briefcase, badge: hasGoal ? `${readiness.score}%` : null }
  ];

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto relative pb-28">
      {/* 1. Dynamic Header Banner */}
      <div
        className={`rounded-3xl p-5 text-white shadow-xl relative overflow-hidden transition-all duration-300 ${
          activeMainTab === 'careerguide'
            ? 'bg-gradient-to-r from-teal-700 via-emerald-800 to-slate-900'
            : activeMainTab === 'jobnotifications'
            ? 'bg-gradient-to-r from-emerald-600 via-teal-700 to-cyan-900'
            : 'bg-gradient-to-r from-emerald-600 via-teal-700 to-slate-900'
        }`}
      >
        <div className="relative z-10 space-y-2">
          <div className="flex items-center justify-between">
            {activeMainTab === 'hub' ? (
              <span className="px-2.5 py-0.5 bg-white/20 backdrop-blur-md text-[10px] font-extrabold rounded-full text-white uppercase tracking-wider flex items-center space-x-1">
                <Compass className="w-3 h-3 text-emerald-300" />
                <span>Career Connect Hub</span>
              </span>
            ) : (
              <button
                onClick={handleBackToHub}
                className="px-2.5 py-1 bg-white/15 hover:bg-white/25 backdrop-blur-md text-[11px] font-extrabold rounded-full text-white transition-all flex items-center space-x-1 cursor-pointer border border-white/20 active:scale-95"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Hub</span>
              </button>
            )}

            {/* Target Goal Pill or Discovery Pill */}
            {activeMainTab === 'hub' ? (
              <button
                onClick={() => setShowGoalModal(true)}
                className="text-[11px] font-extrabold text-emerald-200 hover:text-white bg-emerald-500/20 hover:bg-emerald-500/30 px-2.5 py-0.5 rounded-full backdrop-blur-md transition-all flex items-center space-x-1 border border-emerald-300/30 cursor-pointer"
              >
                <Target className="w-3 h-3 text-emerald-300" />
                <span>{hasGoal ? `🎯 ${careerGoal}` : '+ Set Career Goal'}</span>
              </button>
            ) : activeMainTab === 'jobnotifications' ? (
              <span className="px-2.5 py-0.5 bg-white/15 backdrop-blur-md text-[10px] font-extrabold rounded-full text-white/90">
                📢 Discovery
              </span>
            ) : (
              <span className="px-2.5 py-0.5 bg-white/15 backdrop-blur-md text-[10px] font-extrabold rounded-full text-white/90">
                🧭 Guided
              </span>
            )}
          </div>

          <h1 className="font-heading font-extrabold text-xl text-white">
            {activeMainTab === 'careerguide'
              ? 'Career Pathway'
              : activeMainTab === 'jobnotifications'
              ? 'Job Notifications'
              : 'Career Connect'}
          </h1>
          <p className="text-xs text-white/80 font-medium">
            {activeMainTab === 'careerguide'
              ? 'Personalized roadmaps, projects & placement readiness milestones'
              : activeMainTab === 'jobnotifications'
              ? 'Discover opportunities tailored to your educational profile'
              : 'Personalized career roadmaps & job opportunity discovery'}
          </p>
        </div>

        <div className="absolute top-2 right-2 opacity-10 pointer-events-none">
          <Sparkles className="w-32 h-32 text-white" />
        </div>
      </div>

      {/* VIEW 1: MAIN CAREER CONNECT HUB (Career Pathway & Job Notifications Sub-Tabs) */}
      {activeMainTab === 'hub' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between px-1">
            <h2 className="font-heading font-extrabold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
              <Layers className="w-4 h-4 text-emerald-500" />
              <span>Select Career & Opportunity Feature</span>
            </h2>
          </div>

          <div className="space-y-3">
            {/* SUB-TAB 1: CAREER PATHWAY */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleOpenSubTab('careerguide')}
              className="bg-white dark:bg-slate-800/90 rounded-[28px] p-4 border border-emerald-200/90 dark:border-emerald-800/80 shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between min-h-[145px] relative overflow-hidden group"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 text-[10px] font-extrabold rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                  🧭 Career Pathway Sub-Tab
                </span>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
                  <span>{hasGoal ? `${stats.percentage}% Done` : 'Start Roadmap'}</span>
                  <ChevronRight className="w-4 h-4 ml-0.5" />
                </span>
              </div>

              <div className="mt-2">
                <h3 className="font-heading font-extrabold text-base text-slate-900 dark:text-white leading-tight">
                  Career Pathway
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {hasGoal
                    ? `${currentStage} → ${careerGoal} milestones, projects & readiness.`
                    : 'Enter your current state and goal to generate your personalized action plan.'}
                </p>
              </div>

              <div className="mt-3 flex items-end justify-between pt-2 border-t border-slate-100 dark:border-slate-700/50">
                <span className="px-2.5 py-0.5 border rounded-full text-[9px] font-extrabold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300">
                  {hasGoal ? `🎯 Readiness: ${readiness.score}% • Tap to Open` : '🔍 Enter Goal • Tap to Start'}
                </span>
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-600 to-cyan-600 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0">
                  <Compass className="w-5 h-5" />
                </div>
              </div>
            </motion.div>

            {/* SUB-TAB 2: JOB NOTIFICATIONS */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleOpenSubTab('jobnotifications')}
              className="bg-white dark:bg-slate-800/90 rounded-[28px] p-4 border border-teal-200/90 dark:border-teal-800/80 shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between min-h-[145px] relative overflow-hidden group"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 text-[10px] font-extrabold rounded-full bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300">
                  📢 Job Notifications Sub-Tab
                </span>
                <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 flex items-center">
                  <span>Discover Opportunities</span>
                  <ChevronRight className="w-4 h-4 ml-0.5" />
                </span>
              </div>

              <div className="mt-2">
                <h3 className="font-heading font-extrabold text-base text-slate-900 dark:text-white leading-tight">
                  Job Notifications
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Personalized discovery for government jobs, private jobs, internships, apprenticeships & official recruitment portals.
                </p>
              </div>

              <div className="mt-3 flex items-end justify-between pt-2 border-t border-slate-100 dark:border-slate-700/50">
                <span className="px-2.5 py-0.5 border rounded-full text-[9px] font-extrabold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-300">
                  🎯 Profile Matched • Official Portals • Tap to Open
                </span>
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-500 via-emerald-600 to-cyan-600 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0">
                  <Briefcase className="w-5 h-5" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* VIEW 2: JOB NOTIFICATIONS SUB-VIEW */}
      {activeMainTab === 'jobnotifications' && (
        <JobNotificationsView onBack={handleBackToHub} />
      )}

      {/* VIEW 2: CAREER PATHWAY SUB-VIEW */}
      {activeMainTab === 'careerguide' && (
        <div className="space-y-4 animate-fade-in">
          {/* Back to Hub Header */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleBackToHub}
              className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center space-x-1 hover:underline cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Career Connect Hub</span>
            </button>

            <button
              onClick={() => setShowGoalModal(true)}
              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-bold rounded-xl transition-colors cursor-pointer"
            >
              Change Goal
            </button>
          </div>

          {/* 3-Segmented Sub-Tab Switcher */}
          <div className="bg-slate-200/80 dark:bg-slate-800/80 p-1 rounded-2xl grid grid-cols-3 gap-1 shadow-inner">
            {careerSubTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSubView === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubView(tab.id)}
                  className={`py-2 rounded-xl font-heading font-semibold text-[11px] transition-all flex flex-col sm:flex-row items-center justify-center space-y-0.5 sm:space-y-0 sm:space-x-1 cursor-pointer ${
                    isActive
                      ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm font-extrabold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Sub-View Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSubView}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {activeSubView === 'overview' && <CareerRoadmapView />}
              {activeSubView === 'projects' && <ProjectsAndCertsView />}
              {activeSubView === 'readiness' && <PlacementReadinessView />}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Modals */}
      <CareerGoalSetupModal
        isOpen={showGoalModal}
        onClose={() => setShowGoalModal(false)}
        onComplete={() => handleOpenSubTab('careerguide')}
      />
    </div>
  );
};
