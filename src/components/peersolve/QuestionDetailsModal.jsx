import React, { useState } from 'react';
import { X, ThumbsUp, ThumbsDown, CheckCircle, Award, Star, MessageSquare, Send, Tag, ShieldCheck, Clock, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePeerSolveStore } from '../../store/usePeerSolveStore';

export const QuestionDetailsModal = ({ question, isOpen, onClose }) => {
  const addAnswer = usePeerSolveStore((state) => state.addAnswer);
  const voteAnswer = usePeerSolveStore((state) => state.voteAnswer);
  const acceptAnswer = usePeerSolveStore((state) => state.acceptAnswer);

  const [newAnswerText, setNewAnswerText] = useState('');

  if (!isOpen || !question) return null;

  const handlePostAnswer = (e) => {
    e.preventDefault();
    if (!newAnswerText.trim()) return;

    addAnswer(question.id, newAnswerText);
    setNewAnswerText('');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/90 dark:border-slate-800 flex flex-col max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-2 min-w-0">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border shrink-0 ${question.difficultyColor}`}>
                {question.difficulty}
              </span>
              <span className="font-heading font-bold text-xs text-slate-200 truncate">
                {question.subject} • {question.branch}
              </span>
            </div>

            <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-full hover:bg-white/10 shrink-0">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
            {/* Question Details Block */}
            <div className="space-y-2 pb-4 border-b border-slate-200 dark:border-slate-800">
              <h2 className="font-heading font-extrabold text-base text-slate-900 dark:text-white leading-snug">
                {question.title}
              </h2>

              <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line text-xs">
                {question.description}
              </p>

              {/* Attachments */}
              {question.attachments && question.attachments.length > 0 && (
                <div className="pt-2 flex flex-wrap gap-2">
                  {question.attachments.map((img, idx) => (
                    <img key={idx} src={img} alt="Attachment" className="max-h-48 rounded-xl border border-slate-200 shadow-sm" />
                  ))}
                </div>
              )}

              {/* Metadata row */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                <div className="flex items-center space-x-2">
                  <img src={question.author?.avatar} alt={question.author?.name} className="w-5 h-5 rounded-full object-cover border border-emerald-500" />
                  <span className="font-bold text-slate-800 dark:text-slate-200">{question.author?.name}</span>
                  <span className="flex items-center text-amber-500 font-bold">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-0.5" />
                    {question.author?.reputation || 4.8}
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="px-2 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full font-bold">
                    🪙 Up to {question.maxReward} Credits
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{question.createdAt}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Answers Section */}
            <div className="space-y-3">
              <h3 className="font-heading font-extrabold text-sm text-slate-900 dark:text-white flex items-center space-x-1.5">
                <MessageSquare className="w-4 h-4 text-emerald-500" />
                <span>Answers ({question.answers?.length || 0})</span>
              </h3>

              {(!question.answers || question.answers.length === 0) ? (
                <div className="p-6 text-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                  <p className="text-slate-500 dark:text-slate-400 font-medium text-xs mb-1">No answers yet!</p>
                  <p className="text-[11px] text-slate-400">Be the first student to help answer this doubt and earn up to {question.maxReward} credits!</p>
                </div>
              ) : (
                question.answers.map((ans) => {
                  const isAccepted = question.acceptedAnswerId === ans.id || ans.isAccepted;

                  return (
                    <div
                      key={ans.id}
                      className={`p-4 rounded-2xl border transition-all space-y-2.5 ${
                        isAccepted
                          ? 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-600 shadow-md shadow-emerald-500/10'
                          : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700'
                      }`}
                    >
                      {/* Best Answer Badge */}
                      {isAccepted && (
                        <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-emerald-500 text-white rounded-full text-[10px] font-extrabold shadow-xs">
                          <Award className="w-3 h-3" />
                          <span>🏆 Best Accepted Answer</span>
                        </div>
                      )}

                      {/* Author Header */}
                      <div className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center space-x-2">
                          <img src={ans.author?.avatar} alt={ans.author?.name} className="w-6 h-6 rounded-full object-cover border border-emerald-500" />
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white flex items-center space-x-1">
                              <span>{ans.author?.name}</span>
                              <span className="flex items-center text-amber-500 font-bold text-[10px] ml-1">
                                <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400 mr-0.5" />
                                {ans.author?.reputation || 4.8}
                              </span>
                            </div>
                            <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold">
                              {ans.author?.contributorLevel || 'Trusted Helper'}
                            </span>
                          </div>
                        </div>

                        <span className="text-slate-400 text-[10px]">{ans.createdAt}</span>
                      </div>

                      {/* Answer Body */}
                      <div className="text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line text-xs font-body">
                        {ans.answerText}
                      </div>

                      {/* Answer Actions */}
                      <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px]">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => voteAnswer(question.id, ans.id, 'helpful')}
                            className="flex items-center space-x-1 text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 font-semibold"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            <span>Helpful ({ans.helpfulCount || 0})</span>
                          </button>

                          <button
                            onClick={() => voteAnswer(question.id, ans.id, 'notHelpful')}
                            className="flex items-center space-x-1 text-slate-400 hover:text-rose-500 font-semibold"
                          >
                            <ThumbsDown className="w-3.5 h-3.5" />
                            <span>({ans.notHelpfulCount || 0})</span>
                          </button>
                        </div>

                        {!isAccepted && (
                          <button
                            onClick={() => acceptAnswer(question.id, ans.id)}
                            className="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-600 hover:text-white rounded-xl font-bold transition-colors flex items-center space-x-1 border border-emerald-500/30"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Accept Answer</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Answer Post Form */}
            <form onSubmit={handlePostAnswer} className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <label className="block font-bold text-slate-800 dark:text-slate-200 text-xs">
                Your Contribution / Solution:
              </label>
              <textarea
                required
                rows={3}
                value={newAnswerText}
                onChange={(e) => setNewAnswerText(e.target.value)}
                placeholder="Write step-by-step academic answer, formulas, or explanation..."
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none text-xs"
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-heading font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center space-x-1.5 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Answer & Earn Reputation</span>
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
