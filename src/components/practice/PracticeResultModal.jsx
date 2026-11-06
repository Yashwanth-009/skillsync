import React, { useState } from 'react';
import { X, Award, CheckCircle2, XCircle, AlertCircle, Clock, Sparkles, RefreshCw, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePracticeStore } from '../../store/usePracticeStore';

export const PracticeResultModal = ({ isOpen, onClose, onTryAgain, onChooseAnother }) => {
  const lastResult = usePracticeStore((state) => state.lastResult);

  if (!isOpen || !lastResult) return null;

  const { percentage, correctCount, incorrectCount, unansweredCount, totalQuestions, subject, topic, timeSpentSeconds, breakdown, recommendation } = lastResult;

  const mins = Math.floor(timeSpentSeconds / 60);
  const secs = timeSpentSeconds % 60;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] overflow-hidden"
        >
          {/* Header Banner */}
          <div className="px-5 py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-2">
              <Award className="w-6 h-6 text-amber-300" />
              <div>
                <h3 className="font-heading font-extrabold text-sm text-white">Test Results & Score Card</h3>
                <p className="text-[10px] text-emerald-100">{subject} • {topic}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1 text-white/80 hover:text-white rounded-full hover:bg-white/10">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
            {/* Score Ring / Card */}
            <div className="p-5 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl text-white text-center space-y-2 shadow-lg">
              <div className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-[10px] font-extrabold border border-emerald-400/30">
                {percentage >= 80 ? '🏆 Mastery Achieved!' : percentage >= 50 ? '👍 Good Effort!' : '💡 Practice Needed'}
              </div>

              <div className="font-heading font-extrabold text-4xl text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300">
                {percentage}%
              </div>

              <p className="text-xs text-slate-300">
                You answered <span className="font-bold text-white">{correctCount}</span> of <span className="font-bold text-white">{totalQuestions}</span> questions correctly.
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-2 pt-3 border-t border-slate-700/80 text-[10px]">
                <div className="p-2 bg-emerald-950/60 rounded-xl border border-emerald-800/80">
                  <div className="text-emerald-400 font-extrabold text-xs">{correctCount}</div>
                  <div className="text-slate-400">Correct</div>
                </div>

                <div className="p-2 bg-rose-950/60 rounded-xl border border-rose-800/80">
                  <div className="text-rose-400 font-extrabold text-xs">{incorrectCount}</div>
                  <div className="text-slate-400">Incorrect</div>
                </div>

                <div className="p-2 bg-slate-800 rounded-xl border border-slate-700">
                  <div className="text-slate-300 font-extrabold text-xs">{unansweredCount}</div>
                  <div className="text-slate-400">Unanswered</div>
                </div>

                <div className="p-2 bg-indigo-950/60 rounded-xl border border-indigo-800/80">
                  <div className="text-indigo-300 font-extrabold text-xs">{mins}m {secs}s</div>
                  <div className="text-slate-400">Time Spent</div>
                </div>
              </div>
            </div>

            {/* AI Recommendation Box */}
            <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 border border-indigo-200 dark:border-indigo-800/80 rounded-2xl flex items-start space-x-2.5">
              <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-heading font-extrabold text-xs text-indigo-900 dark:text-indigo-200">
                  AI Personalized Practice Recommendation
                </h4>
                <p className="text-[11px] text-indigo-800 dark:text-indigo-300 mt-0.5 leading-relaxed">
                  {recommendation}
                </p>
              </div>
            </div>

            {/* Question Review Section */}
            <div className="space-y-3 pt-2">
              <h4 className="font-heading font-extrabold text-xs text-slate-900 dark:text-white flex items-center justify-between">
                <span>Detailed Question Review</span>
                <span className="text-[10px] text-slate-400 font-medium">{breakdown.length} questions</span>
              </h4>

              <div className="space-y-3">
                {breakdown.map((item, idx) => (
                  <div
                    key={item.questionId}
                    className={`p-4 rounded-2xl border space-y-2 text-xs ${
                      item.isCorrect
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/60'
                        : 'bg-rose-50/50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/60'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">
                        Q{idx + 1}. {item.question}
                      </span>
                      {item.isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0 ml-2" />
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] font-bold">
                      <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <span className="text-slate-400 block text-[9px]">Your Answer:</span>
                        <span className={item.isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                          Option {item.userAnswer}
                        </span>
                      </div>

                      <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <span className="text-slate-400 block text-[9px]">Correct Answer:</span>
                        <span className="text-emerald-600 dark:text-emerald-400">
                          Option {item.correctAnswer}
                        </span>
                      </div>
                    </div>

                    {/* Explanation */}
                    <div className="p-2.5 bg-white/80 dark:bg-slate-800/80 rounded-xl text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed border border-slate-100 dark:border-slate-700/60">
                      <span className="font-bold text-slate-900 dark:text-white block mb-0.5">Explanation:</span>
                      {item.explanation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center space-x-3 shrink-0">
            <button
              onClick={onTryAgain}
              className="flex-1 py-2.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-extrabold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition-colors cursor-pointer active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Try Again</span>
            </button>

            <button
              onClick={onChooseAnother}
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl flex items-center justify-center space-x-1.5 shadow-md transition-colors cursor-pointer active:scale-95"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Choose Another Topic</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
