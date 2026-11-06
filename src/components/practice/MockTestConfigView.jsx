import React, { useState } from 'react';
import { BookOpen, Sparkles, Clock, Layers, Award, Play, ChevronRight, CheckCircle2, Search, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePracticeStore, BRANCH_CURRICULUM } from '../../store/usePracticeStore';
import { getPracticeQuestions } from '../../services/aiPracticeService';

export const MockTestConfigView = ({ onBack, onStartTest }) => {
  const selectedBranch = usePracticeStore((state) => state.selectedBranch);
  const selectedSubject = usePracticeStore((state) => state.selectedSubject);
  const selectedTopic = usePracticeStore((state) => state.selectedTopic);
  const customTopic = usePracticeStore((state) => state.customTopic);
  const mockConfig = usePracticeStore((state) => state.mockConfig);

  const setBranch = usePracticeStore((state) => state.setBranch);
  const setSubject = usePracticeStore((state) => state.setSubject);
  const setTopic = usePracticeStore((state) => state.setTopic);
  const setCustomTopic = usePracticeStore((state) => state.setCustomTopic);
  const setMockConfig = usePracticeStore((state) => state.setMockConfig);
  const startPracticeSession = usePracticeStore((state) => state.startPracticeSession);

  const [isLoading, setIsLoading] = useState(false);
  const [subjectSearch, setSubjectSearch] = useState('');

  const branches = Object.keys(BRANCH_CURRICULUM);
  const availableSubjects = Object.keys(BRANCH_CURRICULUM[selectedBranch] || BRANCH_CURRICULUM.CSE);
  const availableTopics = (BRANCH_CURRICULUM[selectedBranch] && BRANCH_CURRICULUM[selectedBranch][selectedSubject]) || [];

  const filteredSubjects = availableSubjects.filter((s) =>
    s.toLowerCase().includes(subjectSearch.toLowerCase())
  );

  const handleStartMockTest = async () => {
    setIsLoading(true);
    try {
      const targetTopic = selectedTopic === 'Custom' ? customTopic || 'General Topic' : selectedTopic;

      const questions = await getPracticeQuestions({
        subject: selectedSubject,
        topic: targetTopic,
        branch: selectedBranch,
        difficulty: mockConfig.difficulty,
        count: mockConfig.numQuestions
      });

      startPracticeSession(questions, 'mocktest', mockConfig.timeLimitMinutes, {
        branch: selectedBranch,
        subject: selectedSubject,
        topic: targetTopic
      });
      onStartTest();
    } catch (err) {
      console.error('Mock test start error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-xs text-purple-600 dark:text-purple-400 font-bold flex items-center space-x-1 hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Hub</span>
        </button>

        <span className="px-2.5 py-0.5 bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 rounded-full text-[10px] font-extrabold border border-purple-300">
          📝 Mock Tests
        </span>
      </div>

      {/* 1. Branch Selector */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
        <label className="block text-xs font-heading font-extrabold text-slate-900 dark:text-white">
          1. Select Academic Branch
        </label>
        <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {branches.map((b) => (
            <button
              key={b}
              onClick={() => setBranch(b)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 border ${
                selectedBranch === b
                  ? 'bg-purple-600 text-white border-purple-600 shadow-md'
                  : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              💻 {b}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Subject & Topic Selection */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-heading font-extrabold text-slate-900 dark:text-white">
            2. Choose Subject & Topic
          </label>
          <span className="text-[10px] text-slate-400 font-semibold">{selectedBranch} Curriculum</span>
        </div>

        {/* Search Subject */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={subjectSearch}
            onChange={(e) => setSubjectSearch(e.target.value)}
            placeholder="Search subject..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
          />
        </div>

        {/* Subjects List */}
        <div className="grid grid-cols-2 gap-2">
          {filteredSubjects.map((subj) => (
            <button
              key={subj}
              onClick={() => setSubject(subj)}
              className={`p-2.5 rounded-2xl text-xs font-bold text-left transition-all border flex items-center justify-between ${
                selectedSubject === subj
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white border-purple-500 shadow-md'
                  : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-purple-300'
              }`}
            >
              <span className="truncate">{subj}</span>
              {selectedSubject === subj && <CheckCircle2 className="w-4 h-4 shrink-0 ml-1 text-white" />}
            </button>
          ))}
        </div>

        {/* Topics Chip Selector */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5">
            Topic in {selectedSubject}:
          </label>
          <div className="flex flex-wrap gap-1.5">
            {availableTopics.map((top) => (
              <button
                key={top}
                onClick={() => setTopic(top)}
                className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all border ${
                  selectedTopic === top
                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border-purple-400'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                }`}
              >
                {top}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Topic Input */}
        <div className="pt-1">
          <input
            type="text"
            value={customTopic}
            onChange={(e) => setCustomTopic(e.target.value)}
            placeholder="Or enter custom topic name..."
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
          />
        </div>
      </div>

      {/* 3. Test Configurations */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
        <label className="block text-xs font-heading font-extrabold text-slate-900 dark:text-white">
          3. Configure Test Settings
        </label>

        <div className="grid grid-cols-3 gap-2">
          {/* Question Count */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1">Questions</label>
            <select
              value={mockConfig.numQuestions}
              onChange={(e) => setMockConfig({ numQuestions: Number(e.target.value) })}
              className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
            >
              <option value={10}>10 Questions</option>
              <option value={20}>20 Questions</option>
              <option value={30}>30 Questions</option>
              <option value={50}>50 Questions</option>
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1">Difficulty</label>
            <select
              value={mockConfig.difficulty}
              onChange={(e) => setMockConfig({ difficulty: e.target.value })}
              className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
              <option value="Mixed">Mixed</option>
            </select>
          </div>

          {/* Timer */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1">Time Limit</label>
            <select
              value={mockConfig.timeLimitMinutes}
              onChange={(e) => setMockConfig({ timeLimitMinutes: Number(e.target.value) })}
              className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
            >
              <option value={15}>15 Mins</option>
              <option value={30}>30 Mins</option>
              <option value={45}>45 Mins</option>
              <option value={60}>60 Mins</option>
            </select>
          </div>
        </div>
      </div>

      {/* Start Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleStartMockTest}
        disabled={isLoading}
        className="w-full py-3.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white font-heading font-extrabold text-xs rounded-2xl shadow-xl shadow-purple-500/20 flex items-center justify-center space-x-2 border border-white/20 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? (
          <span>Retrieving & Validating AI Questions...</span>
        ) : (
          <>
            <Play className="w-4 h-4 fill-white" />
            <span>Start Mock Test ({mockConfig.numQuestions} Qs • {mockConfig.timeLimitMinutes} Mins)</span>
          </>
        )}
      </motion.button>
    </div>
  );
};
