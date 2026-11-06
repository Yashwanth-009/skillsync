import React, { useState, useEffect } from 'react';
import { Zap, Sparkles, CheckCircle2, ArrowLeft, GraduationCap, BookOpen, Layers, X, Target, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePracticeStore, BRANCH_CURRICULUM } from '../../store/usePracticeStore';
import { getPracticeQuestions } from '../../services/aiPracticeService';

export const QuizConfigView = ({ onBack, onStartTest }) => {
  const selectedBranch = usePracticeStore((state) => state.selectedBranch);
  const selectedSubject = usePracticeStore((state) => state.selectedSubject);
  const selectedTopic = usePracticeStore((state) => state.selectedTopic);
  const customBranch = usePracticeStore((state) => state.customBranch);
  const customTopic = usePracticeStore((state) => state.customTopic);
  const quizConfig = usePracticeStore((state) => state.quizConfig);

  const setBranch = usePracticeStore((state) => state.setBranch);
  const setCustomBranch = usePracticeStore((state) => state.setCustomBranch);
  const setSubject = usePracticeStore((state) => state.setSubject);
  const setTopic = usePracticeStore((state) => state.setTopic);
  const setCustomTopic = usePracticeStore((state) => state.setCustomTopic);
  const setQuizConfig = usePracticeStore((state) => state.setQuizConfig);
  const startPracticeSession = usePracticeStore((state) => state.startPracticeSession);

  // Local controlled inputs for the edittext bars
  const [branchText, setBranchText] = useState(customBranch || selectedBranch || '');
  const [subjectText, setSubjectText] = useState(selectedSubject || '');
  const [topicText, setTopicText] = useState(customTopic || selectedTopic || '');
  const [validationError, setValidationError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Preset curriculum options for instant suggestions
  const presetBranches = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'AI & Data Science', 'Aeronautical', 'Biotech'];
  const availableSubjects = (BRANCH_CURRICULUM[branchText] && Object.keys(BRANCH_CURRICULUM[branchText])) || 
                            (BRANCH_CURRICULUM[selectedBranch] && Object.keys(BRANCH_CURRICULUM[selectedBranch])) || 
                            ['Core Concepts', 'Applied Engineering', 'System Design'];

  const availableTopics = (BRANCH_CURRICULUM[branchText] && BRANCH_CURRICULUM[branchText][subjectText]) || 
                          (BRANCH_CURRICULUM[selectedBranch] && BRANCH_CURRICULUM[selectedBranch][subjectText]) || 
                          ['Fundamentals', 'System Architecture', 'Design Optimization', 'Problem Analysis'];

  const handleSelectBranchPreset = (preset) => {
    setBranchText(preset);
    setBranch(preset);
    const subjs = BRANCH_CURRICULUM[preset] ? Object.keys(BRANCH_CURRICULUM[preset]) : [];
    if (subjs.length > 0) {
      setSubjectText(subjs[0]);
      const tops = BRANCH_CURRICULUM[preset][subjs[0]] || [];
      if (tops.length > 0) {
        setTopicText(tops[0]);
      }
    }
    setValidationError('');
  };

  const handleSelectSubjectPreset = (subj) => {
    setSubjectText(subj);
    setSubject(subj);
    const currBranch = BRANCH_CURRICULUM[branchText] || BRANCH_CURRICULUM[selectedBranch];
    if (currBranch && currBranch[subj]) {
      setTopicText(currBranch[subj][0]);
    }
    setValidationError('');
  };

  const handleSelectTopicPreset = (top) => {
    setTopicText(top);
    setTopic(top);
    setValidationError('');
  };

  const handleStartQuiz = async () => {
    const cleanBranch = branchText.trim();
    const cleanTopic = topicText.trim();
    const cleanSubject = subjectText.trim() || cleanBranch;

    if (!cleanBranch) {
      setValidationError('Please enter your branch or discipline in the edit bar.');
      return;
    }
    if (!cleanTopic) {
      setValidationError('Please enter the exact topic you want to be quizzed on.');
      return;
    }

    setValidationError('');
    setIsLoading(true);

    // Sync into global store
    setCustomBranch(cleanBranch);
    setCustomTopic(cleanTopic);
    setSubject(cleanSubject);

    try {
      const questions = await getPracticeQuestions({
        branch: cleanBranch,
        subject: cleanSubject,
        topic: cleanTopic,
        difficulty: quizConfig.difficulty,
        count: quizConfig.numQuestions
      });

      startPracticeSession(questions, 'quiz', 5, {
        branch: cleanBranch,
        subject: cleanSubject,
        topic: cleanTopic
      });

      onStartTest();
    } catch (err) {
      console.error('Quiz start error:', err);
      setValidationError('Failed to generate questions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center space-x-1 hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Hub</span>
        </button>

        <span className="px-2.5 py-0.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-800 dark:text-amber-300 rounded-full text-[11px] font-extrabold border border-amber-300/40 flex items-center space-x-1 shadow-sm">
          <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
          <span>Custom Topic Rapid Quiz</span>
        </span>
      </div>

      {/* Validation Banner */}
      <AnimatePresence>
        {validationError && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 rounded-2xl flex items-center justify-between text-xs text-rose-700 dark:text-rose-300"
          >
            <span>⚠️ {validationError}</span>
            <button onClick={() => setValidationError('')} className="p-1 hover:bg-rose-200/50 rounded-lg">
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. BRANCH EDITTEXT BAR */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-heading font-extrabold text-slate-900 dark:text-white flex items-center space-x-1.5">
            <GraduationCap className="w-4 h-4 text-amber-500" />
            <span>1. Branch / Academic Discipline</span>
          </label>
          <span className="text-[10px] text-slate-400 font-semibold">Editable Input</span>
        </div>

        {/* Branch Edittext Input Bar */}
        <div className="relative">
          <input
            type="text"
            id="quiz-branch-input"
            value={branchText}
            onChange={(e) => {
              setBranchText(e.target.value);
              setValidationError('');
            }}
            placeholder="Type your branch (e.g. Computer Science, Mechanical, Aerospace, Biotechnology)..."
            className="w-full pl-3.5 pr-8 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all placeholder:text-slate-400"
          />
          {branchText && (
            <button
              onClick={() => setBranchText('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              title="Clear branch"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Quick Suggestion Pills for Branch */}
        <div>
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1.5">
            Quick Suggestions (Click to fill):
          </span>
          <div className="flex flex-wrap gap-1.5">
            {presetBranches.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => handleSelectBranchPreset(b)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all border ${
                  branchText.toLowerCase() === b.toLowerCase()
                    ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-900/90 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-amber-400'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. SUBJECT / DOMAIN EDITTEXT BAR */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-heading font-extrabold text-slate-900 dark:text-white flex items-center space-x-1.5">
            <BookOpen className="w-4 h-4 text-orange-500" />
            <span>2. Subject / Course Domain</span>
          </label>
          <span className="text-[10px] text-slate-400 font-semibold">Editable Input</span>
        </div>

        {/* Subject Edittext Input Bar */}
        <div className="relative">
          <input
            type="text"
            id="quiz-subject-input"
            value={subjectText}
            onChange={(e) => {
              setSubjectText(e.target.value);
              setValidationError('');
            }}
            placeholder="Type your subject (e.g. Data Structures, Thermodynamics, Aerodynamics, Digital Signals)..."
            className="w-full pl-3.5 pr-8 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-all placeholder:text-slate-400"
          />
          {subjectText && (
            <button
              onClick={() => setSubjectText('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              title="Clear subject"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Quick Subject Suggestions */}
        {availableSubjects.length > 0 && (
          <div>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1.5">
              Suggestions for {branchText}:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {availableSubjects.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleSelectSubjectPreset(s)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all border ${
                    subjectText.toLowerCase() === s.toLowerCase()
                      ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-900/90 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-orange-400'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. EXACT TOPIC EDITTEXT BAR */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-4 sm:p-5 border-2 border-amber-500/30 dark:border-amber-500/30 shadow-md space-y-3 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <label className="text-xs font-heading font-extrabold text-slate-900 dark:text-white flex items-center space-x-1.5">
            <Target className="w-4 h-4 text-amber-500" />
            <span>3. Exact Quiz Topic</span>
            <span className="ml-1.5 px-2 py-0.5 bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 rounded-md text-[9px] font-black uppercase tracking-wider">
              Required
            </span>
          </label>
          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">100% Topic-Specific</span>
        </div>

        {/* Topic Edittext Input Bar */}
        <div className="relative">
          <input
            type="text"
            id="quiz-topic-input"
            value={topicText}
            onChange={(e) => {
              setTopicText(e.target.value);
              setValidationError('');
            }}
            placeholder="Type the exact topic (e.g. Supersonic Airfoils, Binary Search Trees, Rankine Cycle with Reheat)..."
            className="w-full pl-3.5 pr-8 py-3 bg-amber-50/40 dark:bg-slate-900 border-2 border-amber-400 dark:border-amber-600/70 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all placeholder:text-slate-400"
          />
          {topicText && (
            <button
              onClick={() => setTopicText('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              title="Clear topic"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Quick Topic Suggestion Pills */}
        {availableTopics.length > 0 && (
          <div>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1.5">
              Popular Topic Presets in {subjectText}:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {availableTopics.map((top) => (
                <button
                  key={top}
                  type="button"
                  onClick={() => handleSelectTopicPreset(top)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all border ${
                    topicText.toLowerCase() === top.toLowerCase()
                      ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-amber-400'
                  }`}
                >
                  {top}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Live Topic Focus Guarantee Card */}
        <div className="mt-3 p-3 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-400/30 rounded-2xl flex items-start space-x-2.5">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div className="text-[11px] leading-relaxed">
            <span className="font-bold text-slate-900 dark:text-white">Strict Topic Guarantee: </span>
            <span className="text-slate-600 dark:text-slate-300">
              All questions will be strictly focused on{' '}
              <span className="font-extrabold text-amber-600 dark:text-amber-400 underline decoration-amber-400/50">
                "{topicText || 'Your Specified Topic'}"
              </span>{' '}
              under <span className="font-bold text-slate-800 dark:text-slate-200">{branchText || 'Your Branch'}</span>.
            </span>
          </div>
        </div>
      </div>

      {/* 4. QUIZ CONFIG CONTROLS */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
        <label className="block text-xs font-heading font-extrabold text-slate-900 dark:text-white mb-2.5">
          4. Quiz Settings
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1">Number of Questions</label>
            <select
              value={quizConfig.numQuestions}
              onChange={(e) => setQuizConfig({ numQuestions: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
            >
              <option value={5}>⚡ 5 Questions (Rapid)</option>
              <option value={10}>⏱️ 10 Questions (Standard)</option>
              <option value={15}>🎯 15 Questions (Deep Dive)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1">Difficulty Level</label>
            <select
              value={quizConfig.difficulty}
              onChange={(e) => setQuizConfig({ difficulty: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
            >
              <option value="Easy">🟢 Easy (Conceptual)</option>
              <option value="Medium">🟡 Medium (Application)</option>
              <option value="Hard">🔴 Hard (Advanced Analytical)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 5. START QUIZ BUTTON */}
      <motion.button
        whileHover={{ scale: isLoading ? 1 : 1.02 }}
        whileTap={{ scale: isLoading ? 1 : 0.98 }}
        onClick={handleStartQuiz}
        disabled={isLoading}
        className={`w-full py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-heading font-extrabold text-xs sm:text-sm rounded-2xl shadow-xl shadow-amber-500/25 flex items-center justify-center space-x-2.5 border border-white/20 cursor-pointer ${
          isLoading ? 'opacity-80 cursor-not-allowed' : 'hover:brightness-105'
        }`}
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Generating Quizzes on "{topicText}"...</span>
          </div>
        ) : (
          <>
            <Zap className="w-4 h-4 fill-white text-white" />
            <span>Start Rapid Quiz ({quizConfig.numQuestions} Qs on {topicText || 'Topic'})</span>
          </>
        )}
      </motion.button>
    </div>
  );
};
