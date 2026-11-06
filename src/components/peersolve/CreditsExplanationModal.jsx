import React from 'react';
import { X, Award, CheckCircle, ShieldAlert, Sparkles, HeartHandshake, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CreditsExplanationModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/90 dark:border-slate-800 flex flex-col max-h-[85vh] overflow-hidden"
        >
          {/* Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-amber-200">
                🪙
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-sm text-white">How Credits Work</h3>
                <p className="text-[10px] text-amber-100 font-medium">Student Community Reputation System</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1 text-white/80 hover:text-white rounded-full hover:bg-white/10">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content Body */}
          <div className="p-5 space-y-4 overflow-y-auto text-xs text-slate-700 dark:text-slate-300">
            {/* Core Rule Highlight Box */}
            <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 border border-amber-300 dark:border-amber-700/60 rounded-2xl">
              <div className="flex items-center space-x-2 mb-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span className="font-heading font-extrabold text-xs text-amber-900 dark:text-amber-300 uppercase tracking-wider">
                  The Core Rule
                </span>
              </div>
              <p className="font-bold text-xs text-amber-950 dark:text-amber-100 leading-relaxed italic">
                “You don't earn credits by asking for them. You earn credits by helping someone learn.”
              </p>
            </div>

            {/* Explanation Bullets */}
            <div className="space-y-2.5">
              <div className="flex items-start space-x-2.5 p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">Asking doubts:</span>
                  <span className="text-slate-600 dark:text-slate-400"> No credits required! Asking questions is 100% free for all students.</span>
                </div>
              </div>

              <div className="flex items-start space-x-2.5 p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                <HeartHandshake className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">Answering doubts:</span>
                  <span className="text-slate-600 dark:text-slate-400"> Opportunity to earn reputation credits by sharing your knowledge.</span>
                </div>
              </div>

              <div className="flex items-start space-x-2.5 p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                <Award className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">Helpful answer:</span>
                  <span className="text-slate-600 dark:text-slate-400"> Earn quality credits (+1 per helpful vote, +3 bonus for 3+ votes).</span>
                </div>
              </div>

              <div className="flex items-start space-x-2.5 p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                <Sparkles className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">Accepted answer:</span>
                  <span className="text-slate-600 dark:text-slate-400"> Earn +5 bonus credits when the asker marks your answer as the best solution.</span>
                </div>
              </div>

              <div className="flex items-start space-x-2.5 p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl">
                <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-rose-900 dark:text-rose-300">Spam & Abuse Protection:</span>
                  <span className="text-rose-700 dark:text-rose-400"> Daily cap of 100 credits & 20 answers prevents credit farming. Begging for credits is blocked by AI.</span>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-extrabold rounded-xl shadow-md transition-all mt-2"
            >
              Got It, Thanks!
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
