import React, { useState } from 'react';
import { Search, Plus, MessageSquare, Flame, Tag, Star, Award, Sparkles, Filter, ChevronRight, CheckCircle2, ArrowLeft, Layers, HelpCircle, FileText, Zap, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePeerSolveStore } from '../../store/usePeerSolveStore';
import { usePracticeStore } from '../../store/usePracticeStore';
import { AskDoubtModal } from './AskDoubtModal';
import { QuestionDetailsModal } from './QuestionDetailsModal';
import { CreditsExplanationModal } from './CreditsExplanationModal';
import { MockTestConfigView } from '../practice/MockTestConfigView';
import { QuizConfigView } from '../practice/QuizConfigView';
import { PracticeTestRunnerModal } from '../practice/PracticeTestRunnerModal';
import { PracticeResultModal } from '../practice/PracticeResultModal';

export const PeerSolveContainer = () => {
  const questions = usePeerSolveStore((state) => state.questions);
  const activeCategory = usePeerSolveStore((state) => state.activeCategory);
  const setActiveCategory = usePeerSolveStore((state) => state.setActiveCategory);
  const searchQuery = usePeerSolveStore((state) => state.searchQuery);
  const setSearchQuery = usePeerSolveStore((state) => state.setSearchQuery);
  const userStats = usePeerSolveStore((state) => state.userStats);

  const isTestRunning = usePracticeStore((state) => state.isTestRunning);
  const isSubmitted = usePracticeStore((state) => state.isSubmitted);
  const resetPracticeSession = usePracticeStore((state) => state.resetPracticeSession);
  const attemptHistory = usePracticeStore((state) => state.attemptHistory);

  const [activeSubTab, setActiveSubTab] = useState('hub'); // 'hub' | 'peersolve' | 'mocktests' | 'quizzes'
  const [showAskModal, setShowAskModal] = useState(false);
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const [showRunnerModal, setShowRunnerModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const categories = ['All', 'CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'AI/ML', 'Others'];

  const filteredQuestions = questions.filter((q) => {
    const matchesCategory = activeCategory === 'All' || q.branch === activeCategory;
    const matchesSearch =
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto relative pb-28">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 rounded-3xl p-5 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-1">
            <span className="px-2.5 py-0.5 bg-white/20 backdrop-blur-md text-[10px] font-extrabold rounded-full text-white uppercase tracking-wider flex items-center space-x-1">
              <span>Doubtmate Learning Hub</span>
            </span>

            {/* Clickable Credits Pill Badge */}
            <button
              onClick={() => setShowCreditsModal(true)}
              className="text-[11px] font-extrabold text-amber-300 hover:text-amber-200 bg-amber-400/20 hover:bg-amber-400/30 px-2.5 py-0.5 rounded-full backdrop-blur-md transition-all flex items-center space-x-1 border border-amber-300/30"
              title="Click to see How Credits Work"
            >
              <span>🪙 {userStats.credits} Credits</span>
              <HelpCircle className="w-3 h-3 text-amber-300 ml-0.5" />
            </button>
          </div>

          <h1 className="font-heading font-extrabold text-xl text-white mb-1">Doubtmate</h1>
          <p className="text-xs text-emerald-100 font-medium">P2P Doubts, AI Mock Tests & Practice Center</p>
        </div>

        <div className="absolute top-2 right-2 opacity-10">
          <Sparkles className="w-32 h-32 text-white" />
        </div>
      </div>

      {/* VIEW A: MAIN DOUBTMATE TAB HUB - Featuring 3 Curved Rectangle Sub-Tab Cards (matching photo reference!) */}
      {activeSubTab === 'hub' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between px-1">
            <h2 className="font-heading font-extrabold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
              <Layers className="w-4 h-4 text-emerald-500" />
              <span>Doubtmate Sub-Tab Features</span>
            </h2>
            <button
              onClick={() => setShowCreditsModal(true)}
              className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center space-x-1"
            >
              <HelpCircle className="w-3 h-3" />
              <span>How Credits Work?</span>
            </button>
          </div>

          {/* Sub-Tab Cards Stack (Curved Rectangles matching photo ref) */}
          <div className="space-y-3">
            {/* SUB-TAB 1: PEERSOLVE */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveSubTab('peersolve')}
              className="bg-white dark:bg-slate-800/90 rounded-[28px] p-4 border border-slate-200/90 dark:border-slate-700/80 shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between min-h-[145px] relative overflow-hidden group"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 text-[10px] font-extrabold rounded-full bg-cyan-100 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300">
                  Academic P2P Sub-Tab
                </span>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
                  <span>{questions.length} Active Doubts</span>
                  <ChevronRight className="w-4 h-4 ml-0.5" />
                </span>
              </div>

              <div className="mt-2">
                <h3 className="font-heading font-extrabold text-base text-slate-900 dark:text-white leading-tight">
                  PeerSolve
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Ask engineering doubts, post answers & earn reputation credits.
                </p>
              </div>

              <div className="mt-3 flex items-end justify-between pt-2 border-t border-slate-100 dark:border-slate-700/50">
                <span className="px-2.5 py-0.5 border rounded-full text-[9px] font-extrabold bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-300">
                  🪙 Earn Credits • Tap to Open
                </span>
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-400 via-teal-500 to-emerald-600 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
              </div>
            </motion.div>

            {/* SUB-TAB 2: MOCK TESTS */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveSubTab('mocktests')}
              className="bg-white dark:bg-slate-800/90 rounded-[28px] p-4 border border-slate-200/90 dark:border-slate-700/80 shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between min-h-[145px] relative overflow-hidden group"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 text-[10px] font-extrabold rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
                  Exam Simulation Sub-Tab
                </span>
                <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 flex items-center">
                  <span>10 to 50 Questions</span>
                  <ChevronRight className="w-4 h-4 ml-0.5" />
                </span>
              </div>

              <div className="mt-2">
                <h3 className="font-heading font-extrabold text-base text-slate-900 dark:text-white leading-tight">
                  Mock Tests
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Full-length exam mode with timer, score card & AI weak topic feedback.
                </p>
              </div>

              <div className="mt-3 flex items-end justify-between pt-2 border-t border-slate-100 dark:border-slate-700/50">
                <span className="px-2.5 py-0.5 border rounded-full text-[9px] font-extrabold bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-300">
                  ⏱️ Timed Mode • Tap to Open
                </span>
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-500 via-indigo-600 to-blue-600 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
              </div>
            </motion.div>

            {/* SUB-TAB 3: QUIZZES */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveSubTab('quizzes')}
              className="bg-white dark:bg-slate-800/90 rounded-[28px] p-4 border border-slate-200/90 dark:border-slate-700/80 shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between min-h-[145px] relative overflow-hidden group"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 text-[10px] font-extrabold rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                  Rapid Practice Sub-Tab
                </span>
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 flex items-center">
                  <span>5-Min Rapid Fire</span>
                  <ChevronRight className="w-4 h-4 ml-0.5" />
                </span>
              </div>

              <div className="mt-2">
                <h3 className="font-heading font-extrabold text-base text-slate-900 dark:text-white leading-tight">
                  Quizzes
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Quick 5 to 15 question practice with instant explanations & feedback.
                </p>
              </div>

              <div className="mt-3 flex items-end justify-between pt-2 border-t border-slate-100 dark:border-slate-700/50">
                <span className="px-2.5 py-0.5 border rounded-full text-[9px] font-extrabold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300">
                  ⚡ Rapid Fire • Tap to Open
                </span>
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-amber-600 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0">
                  <Zap className="w-5 h-5 fill-white" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Recent Activity Log (if any attempts stored) */}
          {attemptHistory.length > 0 && (
            <div className="p-4 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-2.5">
              <h3 className="font-heading font-extrabold text-xs text-slate-900 dark:text-white flex items-center justify-between">
                <span>Recent Practice Activity</span>
                <span className="text-[10px] text-slate-400 font-medium">{attemptHistory.length} completed</span>
              </h3>

              <div className="space-y-2">
                {attemptHistory.slice(0, 3).map((item) => (
                  <div key={item.id} className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{item.subject} • {item.topic}</div>
                      <div className="text-[10px] text-slate-500">{item.date} • {item.activityType === 'mocktest' ? 'Mock Test' : 'Quiz'}</div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full font-extrabold text-[10px] ${item.percentage >= 70 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'}`}>
                      {item.percentage}% ({item.correctCount}/{item.totalQuestions})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW B: PEERSOLVE SUB-TAB STREAM */}
      {activeSubTab === 'peersolve' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveSubTab('hub')}
              className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center space-x-1 hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Doubtmate Hub</span>
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowAskModal(true)}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[11px] rounded-full shadow-md transition-all flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ask Doubt</span>
              </button>

              <button
                onClick={() => setShowCreditsModal(true)}
                className="text-[11px] text-amber-600 dark:text-amber-400 font-extrabold flex items-center space-x-1 bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 px-2.5 py-1 rounded-full hover:bg-amber-100 transition-all"
              >
                <span>🪙 Credits</span>
              </button>
            </div>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search engineering doubts..."
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl text-xs text-slate-900 dark:text-white shadow-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 border ${
                    isActive
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/20'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-500'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between px-1 pt-1">
            <h2 className="font-heading font-extrabold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
              <span>🔥 PeerSolve Academic Doubts</span>
            </h2>

            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
              {filteredQuestions.length} doubt{filteredQuestions.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="space-y-3">
            {filteredQuestions.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-sm text-slate-900 dark:text-white mb-1">No Academic Doubts Posted Yet</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Ask your first doubt to start earning reputation credits!</p>
                </div>
                <button
                  onClick={() => setShowAskModal(true)}
                  className="px-5 py-2.5 bg-emerald-600 text-white text-xs font-extrabold rounded-xl shadow-md hover:bg-emerald-500 transition-colors inline-flex items-center space-x-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ask the First Doubt</span>
                </button>
              </div>
            ) : (
              filteredQuestions.map((q) => {
                const isSolved = q.status === 'Solved' || Boolean(q.acceptedAnswerId);

                return (
                  <motion.div
                    key={q.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedQuestion(q)}
                    className="bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 rounded-3xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-2.5"
                  >
                    <div className="flex items-center justify-between text-[10px] font-bold">
                      <div className="flex items-center space-x-1.5">
                        <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-500/20">
                          💻 {q.branch}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full border ${q.difficultyColor}`}>
                          {q.difficulty}
                        </span>
                        {isSolved && (
                          <span className="px-2 py-0.5 bg-emerald-500 text-white rounded-full flex items-center space-x-0.5">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            <span>Solved</span>
                          </span>
                        )}
                      </div>

                      <span className="text-amber-600 dark:text-amber-400 font-extrabold flex items-center">
                        🪙 Up to {q.maxReward} Credits
                      </span>
                    </div>

                    <h3 className="font-heading font-extrabold text-xs text-slate-900 dark:text-white leading-snug line-clamp-2">
                      {q.title}
                    </h3>

                    <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {q.description}
                    </p>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                      <div className="flex items-center space-x-1.5">
                        <img src={q.author?.avatar} alt={q.author?.name} className="w-4 h-4 rounded-full object-cover" />
                        <span className="text-slate-700 dark:text-slate-300 font-bold truncate max-w-[100px]">{q.author?.name}</span>
                        <span className="text-amber-500 font-bold flex items-center">
                          <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400 mr-0.5" />
                          {q.author?.reputation}
                        </span>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 font-bold">
                          <MessageSquare className="w-3 h-3" />
                          <span>{q.answers?.length || 0} Answer{q.answers?.length !== 1 ? 's' : ''}</span>
                        </span>
                        <span>{q.createdAt}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAskModal(true)}
            className="fixed bottom-22 left-4 z-40 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-heading font-extrabold text-xs rounded-full shadow-xl shadow-emerald-500/30 flex items-center space-x-1.5 border border-white/20"
            title="Ask Academic Doubt"
          >
            <Plus className="w-4 h-4" />
            <span>Ask Doubt</span>
          </motion.button>
        </div>
      )}

      {/* VIEW C: MOCK TESTS SUB-TAB CONFIGURATION */}
      {activeSubTab === 'mocktests' && (
        <MockTestConfigView
          onBack={() => setActiveSubTab('hub')}
          onStartTest={() => setShowRunnerModal(true)}
        />
      )}

      {/* VIEW D: QUIZZES SUB-TAB CONFIGURATION */}
      {activeSubTab === 'quizzes' && (
        <QuizConfigView
          onBack={() => setActiveSubTab('hub')}
          onStartTest={() => setShowRunnerModal(true)}
        />
      )}

      {/* Modals & Runners */}
      <AskDoubtModal isOpen={showAskModal} onClose={() => setShowAskModal(false)} />
      <CreditsExplanationModal isOpen={showCreditsModal} onClose={() => setShowCreditsModal(false)} />
      <QuestionDetailsModal
        question={selectedQuestion}
        isOpen={Boolean(selectedQuestion)}
        onClose={() => setSelectedQuestion(null)}
      />

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
          setActiveSubTab('mocktests');
        }}
        onChooseAnother={() => {
          setShowResultModal(false);
          resetPracticeSession();
          setActiveSubTab('hub');
        }}
      />
    </div>
  );
};
