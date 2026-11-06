import React, { useEffect } from 'react';
import { Clock, Bookmark, ChevronLeft, ChevronRight, Send, AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePracticeStore } from '../../store/usePracticeStore';

export const PracticeTestRunnerModal = ({ isOpen, onClose, onFinish }) => {
  const isTestRunning = usePracticeStore((state) => state.isTestRunning);
  const activeQuestions = usePracticeStore((state) => state.activeQuestions);
  const currentQuestionIndex = usePracticeStore((state) => state.currentQuestionIndex);
  const userAnswers = usePracticeStore((state) => state.userAnswers);
  const markedForReview = usePracticeStore((state) => state.markedForReview);
  const timeRemainingSeconds = usePracticeStore((state) => state.timeRemainingSeconds);
  const activityType = usePracticeStore((state) => state.activityType);
  const selectedSubject = usePracticeStore((state) => state.selectedSubject);
  const selectedTopic = usePracticeStore((state) => state.selectedTopic);
  const activeSubject = usePracticeStore((state) => state.activeSubject);
  const activeTopic = usePracticeStore((state) => state.activeTopic);
  const activeBranch = usePracticeStore((state) => state.activeBranch);

  const displaySubject = activeSubject || selectedSubject;
  const displayTopic = activeTopic || selectedTopic;

  const setCurrentQuestionIndex = usePracticeStore((state) => state.setCurrentQuestionIndex);
  const selectAnswer = usePracticeStore((state) => state.selectAnswer);
  const toggleMarkForReview = usePracticeStore((state) => state.toggleMarkForReview);
  const decrementTimer = usePracticeStore((state) => state.decrementTimer);
  const submitPracticeSession = usePracticeStore((state) => state.submitPracticeSession);

  // Timer interval
  useEffect(() => {
    if (!isOpen || !isTestRunning) return;
    const interval = setInterval(() => {
      decrementTimer();
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, isTestRunning, decrementTimer]);

  if (!isOpen || activeQuestions.length === 0) return null;

  const currentQ = activeQuestions[currentQuestionIndex] || activeQuestions[0];
  const total = activeQuestions.length;
  const mins = Math.floor(timeRemainingSeconds / 60);
  const secs = timeRemainingSeconds % 60;
  const isAnswered = Boolean(userAnswers[currentQ.id]);
  const isMarked = Boolean(markedForReview[currentQ.id]);

  const handleSubmit = () => {
    if (window.confirm('Are you sure you want to submit your test now?')) {
      submitPracticeSession();
      onFinish();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col h-[92vh] overflow-hidden"
        >
          {/* Header Bar: Timer & Counter */}
          <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
            <div>
              <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider">
                {activityType === 'mocktest' ? '📝 Mock Test' : '⚡ Quick Quiz'}
              </span>
              <h3 className="font-heading font-extrabold text-xs text-white truncate max-w-[240px]" title={`${displaySubject} • ${displayTopic}`}>
                {displaySubject} • {displayTopic}
              </h3>
            </div>

            {/* Timer Clock */}
            <div className="flex items-center space-x-2">
              <div className="px-3 py-1 bg-slate-800 rounded-full border border-slate-700 flex items-center space-x-1.5 text-xs font-mono font-bold text-amber-400">
                <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>{String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}</span>
              </div>

              <button onClick={handleSubmit} className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold rounded-full shadow-md cursor-pointer active:scale-95 transition-transform">
                Submit
              </button>
            </div>
          </div>

          {/* Progress Bar & Question Pills Bar */}
          <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between space-x-2 shrink-0">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Question {currentQuestionIndex + 1} of {total}
            </span>

            {/* Quick question pill jumper */}
            <div className="flex space-x-1 overflow-x-auto max-w-[200px] scrollbar-none">
              {activeQuestions.map((q, idx) => {
                const ans = userAnswers[q.id];
                const rev = markedForReview[q.id];
                const isCur = idx === currentQuestionIndex;

                let bg = 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400';
                if (isCur) bg = 'ring-2 ring-emerald-500 bg-emerald-600 text-white';
                else if (rev) bg = 'bg-amber-400 text-amber-950 font-bold';
                else if (ans) bg = 'bg-emerald-500 text-white';

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 transition-all cursor-pointer ${bg}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question & Options Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
            {/* Question Text */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] font-bold">
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-500/20">
                  {currentQ.difficulty || 'Medium'} Difficulty
                </span>

                <button
                  onClick={() => toggleMarkForReview(currentQ.id)}
                  className={`flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all cursor-pointer ${
                    isMarked
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <Bookmark className={`w-3 h-3 ${isMarked ? 'fill-amber-500 text-amber-500' : ''}`} />
                  <span>{isMarked ? 'Marked for Review' : 'Mark for Review'}</span>
                </button>
              </div>

              <h4 className="font-heading font-extrabold text-sm text-slate-900 dark:text-white leading-relaxed">
                {currentQ.question}
              </h4>
            </div>

            {/* Options List */}
            <div className="space-y-2.5 pt-2">
              {Object.entries(currentQ.options || {}).map(([key, text]) => {
                const isSelected = userAnswers[currentQ.id] === key;

                return (
                  <button
                    key={key}
                    onClick={() => selectAnswer(currentQ.id, key)}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-950 dark:text-emerald-100 font-bold shadow-sm ring-2 ring-emerald-500/20'
                        : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className={`w-6 h-6 rounded-full font-extrabold text-[11px] flex items-center justify-center border shrink-0 ${
                        isSelected
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white dark:bg-slate-700 text-slate-500 border-slate-300 dark:border-slate-600'
                      }`}>
                        {key}
                      </span>
                      <span className="text-xs leading-relaxed">{text}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Controls: Previous / Next / Submit */}
          <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
            <button
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
              className="px-4 py-2 bg-slate-200 dark:bg-slate-700 disabled:opacity-40 text-slate-800 dark:text-white text-xs font-bold rounded-xl flex items-center space-x-1 cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {currentQuestionIndex < total - 1 ? (
              <button
                onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold rounded-xl flex items-center space-x-1 shadow-md cursor-pointer active:scale-95"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-extrabold rounded-xl flex items-center space-x-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Finish & Submit</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
