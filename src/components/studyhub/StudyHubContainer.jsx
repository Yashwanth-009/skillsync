import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarDays,
  Calendar as CalendarIcon,
  BookOpen,
  FileText,
  Zap,
  BarChart3,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  Layers,
  GraduationCap
} from 'lucide-react';
import { TimetableGrid } from '../timetable/TimetableGrid';
import { CalendarGrid } from '../timetable/CalendarGrid';
import { MockTestConfigView } from '../practice/MockTestConfigView';
import { QuizConfigView } from '../practice/QuizConfigView';
import { PracticeTestRunnerModal } from '../practice/PracticeTestRunnerModal';
import { PracticeResultModal } from '../practice/PracticeResultModal';
import { InternalVisualizationView } from './InternalVisualizationView';
import { useTimetableStore } from '../../store/useTimetableStore';
import { usePracticeStore } from '../../store/usePracticeStore';
import { useDashboardStore } from '../../store/useDashboardStore';

export const StudyHubContainer = () => {
  // Store sub-tab navigation
  const activeSubTab = useTimetableStore((state) => state.studyHubSubTab || 'hub');
  const setActiveSubTab = useTimetableStore((state) => state.setStudyHubSubTab);

  // Timetable grid internal toggle ('timetable' vs 'calendar')
  const timetableGridTab = useTimetableStore((state) => state.activeTab);
  const setTimetableGridTab = useTimetableStore((state) => state.setActiveTab);
  const classes = useTimetableStore((state) => state.classes) || [];
  const calendarNotes = useTimetableStore((state) => state.calendarNotes) || [];

  // Practice state
  const resetPracticeSession = usePracticeStore((state) => state.resetPracticeSession);
  const attemptHistory = usePracticeStore((state) => state.attemptHistory) || [];

  // Dashboard metrics for cards
  const rawCgpa = useDashboardStore((state) => state.cgpa);
  const hasCgpa = rawCgpa && rawCgpa !== '0.00' && rawCgpa !== '0';
  const cgpa = hasCgpa ? rawCgpa : null;

  const [showRunnerModal, setShowRunnerModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);

  // Sub-tab navigation with browser history integration for mobile gesture and back buttons
  const handleOpenSubTab = (subTab) => {
    if (!window.history.state || window.history.state.subTab !== 'hub') {
      window.history.replaceState({ screen: 'timetable', subTab: 'hub' }, '');
    }
    window.history.pushState({ screen: 'timetable', subTab }, '');
    setActiveSubTab(subTab);
  };

  const handleBackToHub = () => {
    if (window.history.state?.subTab && window.history.state?.subTab !== 'hub') {
      window.history.back();
    } else {
      window.history.replaceState({ screen: 'timetable', subTab: 'hub' }, '');
      setActiveSubTab('hub');
    }
  };

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto relative pb-28">
      {/* 1. Dynamic Header Banner */}
      <div
        className={`rounded-3xl p-5 text-white shadow-xl relative overflow-hidden transition-all duration-300 ${
          activeSubTab === 'timetable'
            ? 'bg-gradient-to-r from-amber-600 via-orange-600 to-slate-900'
            : activeSubTab === 'mocktests'
            ? 'bg-gradient-to-r from-purple-700 via-indigo-800 to-slate-900'
            : activeSubTab === 'quizzes'
            ? 'bg-gradient-to-r from-amber-600 via-rose-600 to-slate-900'
            : activeSubTab === 'visualization'
            ? 'bg-gradient-to-r from-cyan-700 via-blue-800 to-slate-900'
            : 'bg-gradient-to-r from-amber-600 via-emerald-700 to-slate-900'
        }`}
      >
        <div className="relative z-10 space-y-2">
          <div className="flex items-center justify-between">
            {activeSubTab === 'hub' ? (
              <span className="px-2.5 py-0.5 bg-white/20 backdrop-blur-md text-[10px] font-extrabold rounded-full text-white uppercase tracking-wider flex items-center space-x-1">
                <BookOpen className="w-3 h-3 text-amber-300" />
                <span>Study Hub</span>
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

            <span className="px-2.5 py-0.5 bg-white/15 backdrop-blur-md text-[10px] font-extrabold rounded-full text-white/90">
              {activeSubTab === 'timetable'
                ? '📅 Full Schedule'
                : activeSubTab === 'mocktests'
                ? '📝 Mock Tests'
                : activeSubTab === 'quizzes'
                ? '⚡ 5-Min Rapid'
                : activeSubTab === 'visualization'
                ? '📊 Analytics'
                : '🎓 Academic Center'}
            </span>
          </div>

          <h1 className="font-heading font-extrabold text-xl text-white">
            {activeSubTab === 'timetable'
              ? 'Weekly Timetable & Schedule'
              : activeSubTab === 'mocktests'
              ? 'Mock Tests'
              : activeSubTab === 'quizzes'
              ? 'Rapid Quizzes'
              : activeSubTab === 'visualization'
              ? 'Academic Visualization'
              : 'Study Hub 📚'}
          </h1>
          <p className="text-xs text-white/80 font-medium">
            {activeSubTab === 'timetable'
              ? 'Color-coded weekly schedule, time slots & monthly calendar notes'
              : activeSubTab === 'mocktests'
              ? 'Full-length timed exam mode with detailed review & evaluation'
              : activeSubTab === 'quizzes'
              ? 'Rapid 5-minute topic assessments with instant AI explanations'
              : activeSubTab === 'visualization'
              ? 'Subject-wise performance, CGPA distribution & schedule analytics'
              : 'Timetable, mock tests, rapid quizzes & academic visualization in one hub'}
          </p>
        </div>

        <div className="absolute top-2 right-2 opacity-10 pointer-events-none">
          <Sparkles className="w-32 h-32 text-white" />
        </div>
      </div>

      {/* 2. VIEW 1: STUDY HUB OVERVIEW (4 Interactive Sub-Tab Feature Cards) */}
      {activeSubTab === 'hub' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between px-1">
            <h2 className="font-heading font-extrabold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
              <Layers className="w-4 h-4 text-amber-500" />
              <span>Select Study & Practice Sub-Tab</span>
            </h2>
          </div>

          <div className="space-y-3">
            {/* SUB-TAB CARD 1: TIME TABLE */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleOpenSubTab('timetable')}
              className="bg-white dark:bg-slate-800/90 rounded-[28px] p-4 border border-amber-200/90 dark:border-amber-800/80 shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between min-h-[145px] relative overflow-hidden group"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 text-[10px] font-extrabold rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300">
                  📅 Time Table Sub-Tab
                </span>
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 flex items-center">
                  <span>{classes.length > 0 ? `${classes.length} Classes Added` : 'View Routine'}</span>
                  <ChevronRight className="w-4 h-4 ml-0.5" />
                </span>
              </div>

              <div className="mt-2">
                <h3 className="font-heading font-extrabold text-base text-slate-900 dark:text-white leading-tight">
                  Full Time Table & Calendar
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Weekly class matrix with room & professor details, plus monthly calendar date notes.
                </p>
              </div>

              <div className="mt-3 flex items-end justify-between pt-2 border-t border-slate-100 dark:border-slate-700/50">
                <span className="px-2.5 py-0.5 border rounded-full text-[9px] font-extrabold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300">
                  {classes.length > 0 ? `⏰ ${classes.length} Classes Registered • Tap to Open` : '🗓️ Set Up Timetable • Tap to Open'}
                </span>
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-600 to-amber-700 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0">
                  <CalendarDays className="w-5 h-5" />
                </div>
              </div>
            </motion.div>

            {/* SUB-TAB CARD 2: MOCK TESTS */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleOpenSubTab('mocktests')}
              className="bg-white dark:bg-slate-800/90 rounded-[28px] p-4 border border-purple-200/90 dark:border-purple-800/80 shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between min-h-[145px] relative overflow-hidden group"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 text-[10px] font-extrabold rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
                  📝 Mock Tests Sub-Tab
                </span>
                <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 flex items-center">
                  <span>{attemptHistory.length > 0 ? `${attemptHistory.length} Taken` : 'Start Test'}</span>
                  <ChevronRight className="w-4 h-4 ml-0.5" />
                </span>
              </div>

              <div className="mt-2">
                <h3 className="font-heading font-extrabold text-base text-slate-900 dark:text-white leading-tight">
                  Mock Tests
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Full-length timed exams across engineering branches with AI score cards & solutions.
                </p>
              </div>

              <div className="mt-3 flex items-end justify-between pt-2 border-t border-slate-100 dark:border-slate-700/50">
                <span className="px-2.5 py-0.5 border rounded-full text-[9px] font-extrabold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-300">
                  {attemptHistory.length > 0 ? `📊 ${attemptHistory.length} Attempt(s) • Tap to Open` : '📝 Full Practice • Tap to Configure'}
                </span>
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-slate-900 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
              </div>
            </motion.div>

            {/* SUB-TAB CARD 3: RAPID QUIZZES */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleOpenSubTab('quizzes')}
              className="bg-white dark:bg-slate-800/90 rounded-[28px] p-4 border border-rose-200/90 dark:border-rose-800/80 shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between min-h-[145px] relative overflow-hidden group"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 text-[10px] font-extrabold rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300">
                  ⚡ Quizzes Sub-Tab
                </span>
                <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 flex items-center">
                  <span>5-Min Rapid</span>
                  <ChevronRight className="w-4 h-4 ml-0.5" />
                </span>
              </div>

              <div className="mt-2">
                <h3 className="font-heading font-extrabold text-base text-slate-900 dark:text-white leading-tight">
                  Rapid Topic Quizzes
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  5-minute bite-sized multiple choice drills with instant answers and concept explanations.
                </p>
              </div>

              <div className="mt-3 flex items-end justify-between pt-2 border-t border-slate-100 dark:border-slate-700/50">
                <span className="px-2.5 py-0.5 border rounded-full text-[9px] font-extrabold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-300">
                  🎯 Quick Practice • Instant Explanations • Tap to Start
                </span>
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 via-orange-500 to-amber-600 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
              </div>
            </motion.div>

            {/* SUB-TAB CARD 4: INTERNAL VISUALIZATION */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleOpenSubTab('visualization')}
              className="bg-white dark:bg-slate-800/90 rounded-[28px] p-4 border border-cyan-200/90 dark:border-cyan-800/80 shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between min-h-[145px] relative overflow-hidden group"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 text-[10px] font-extrabold rounded-full bg-cyan-100 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300">
                  📊 Visualization Sub-Tab
                </span>
                <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 flex items-center">
                  <span>{cgpa ? `CGPA ${cgpa}` : 'View Analytics'}</span>
                  <ChevronRight className="w-4 h-4 ml-0.5" />
                </span>
              </div>

              <div className="mt-2">
                <h3 className="font-heading font-extrabold text-base text-slate-900 dark:text-white leading-tight">
                  Academic Performance & Analytics
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Subject-wise grade bar charts, term breakdown donut scores, and schedule density analytics.
                </p>
              </div>

              <div className="mt-3 flex items-end justify-between pt-2 border-t border-slate-100 dark:border-slate-700/50">
                <span className="px-2.5 py-0.5 border rounded-full text-[9px] font-extrabold bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border-cyan-300">
                  {cgpa ? '📈 Interactive Charts • Grade Customizer' : '📈 Track Course Grades • Tap to View'}
                </span>
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0">
                  <BarChart3 className="w-5 h-5" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* 3. SUB-TAB VIEW 1: FULL TIME TABLE SECTION */}
      {activeSubTab === 'timetable' && (
        <div className="space-y-4 animate-fade-in">
          {/* Sub-Tab Top Navigation */}
          <div className="flex items-center justify-between px-1">
            <button
              onClick={handleBackToHub}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer border border-slate-200 dark:border-slate-700 active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Study Hub</span>
            </button>
            <span className="text-[11px] font-extrabold px-3 py-1 bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 rounded-full border border-amber-200 dark:border-amber-800/60">
              📅 Full Schedule & Calendar
            </span>
          </div>

          {/* Segmented Top Tab Bar: Weekly Timetable vs Monthly Calendar */}
          <div className="bg-slate-200/80 dark:bg-slate-800/80 p-1 rounded-2xl flex items-center shadow-inner">
            <button
              onClick={() => setTimetableGridTab('timetable')}
              className={`flex-1 py-2.5 rounded-xl font-heading font-semibold text-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                timetableGridTab === 'timetable'
                  ? 'bg-white dark:bg-slate-900 text-primary shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              <span>Weekly Timetable</span>
            </button>

            <button
              onClick={() => setTimetableGridTab('calendar')}
              className={`flex-1 py-2.5 rounded-xl font-heading font-semibold text-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                timetableGridTab === 'calendar'
                  ? 'bg-white dark:bg-slate-900 text-primary shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <CalendarIcon className="w-4 h-4 text-secondary" />
              <span>Monthly Calendar</span>
            </button>
          </div>

          {/* Grid Panels */}
          {timetableGridTab === 'timetable' ? <TimetableGrid /> : <CalendarGrid />}
        </div>
      )}

      {/* 4. SUB-TAB VIEW 2: MOCK TESTS */}
      {activeSubTab === 'mocktests' && (
        <MockTestConfigView
          onBack={handleBackToHub}
          onStartTest={() => setShowRunnerModal(true)}
        />
      )}

      {/* 5. SUB-TAB VIEW 3: QUIZZES */}
      {activeSubTab === 'quizzes' && (
        <QuizConfigView
          onBack={handleBackToHub}
          onStartTest={() => setShowRunnerModal(true)}
        />
      )}

      {/* 6. SUB-TAB VIEW 4: INTERNAL VISUALIZATION */}
      {activeSubTab === 'visualization' && (
        <InternalVisualizationView onBack={handleBackToHub} />
      )}

      {/* Test Runner & Result Modals for Mock Tests and Quizzes */}
      <PracticeTestRunnerModal
        isOpen={showRunnerModal}
        onClose={() => {
          setShowRunnerModal(false);
          resetPracticeSession();
        }}
        onFinish={() => {
          setShowRunnerModal(false);
          setShowResultModal(true);
        }}
      />

      <PracticeResultModal
        isOpen={showResultModal}
        onClose={() => {
          setShowResultModal(false);
          resetPracticeSession();
        }}
        onTryAgain={() => {
          setShowResultModal(false);
          resetPracticeSession();
          handleOpenSubTab(activeSubTab === 'quizzes' ? 'quizzes' : 'mocktests');
        }}
        onChooseAnother={() => {
          setShowResultModal(false);
          resetPracticeSession();
          handleBackToHub();
        }}
      />
    </div>
  );
};
