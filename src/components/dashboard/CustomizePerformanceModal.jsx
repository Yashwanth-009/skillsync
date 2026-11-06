import React, { useState, useEffect } from 'react';
import { X, Sliders, Check, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboardStore } from '../../store/useDashboardStore';

export const CustomizePerformanceModal = ({ isOpen, onClose }) => {
  const subjectScores = useDashboardStore((state) => state.subjectScores);
  const updateSubjectScores = useDashboardStore((state) => state.updateSubjectScores);
  const attendance = useDashboardStore((state) => state.attendance);
  const cgpa = useDashboardStore((state) => state.cgpa);
  const updatePerformanceStanding = useDashboardStore((state) => state.updatePerformanceStanding);

  const [scores, setScores] = useState(subjectScores);
  const [att, setAtt] = useState(attendance);
  const [gpa, setGpa] = useState(cgpa);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setScores(subjectScores);
    setAtt(attendance);
    setGpa(cgpa);
  }, [subjectScores, attendance, cgpa, isOpen]);

  const handleScoreChange = (idx, value) => {
    const updated = [...scores];
    updated[idx].score = Math.min(100, Math.max(0, Number(value)));
    setScores(updated);
  };

  const handleSubjectNameChange = (idx, name) => {
    const updated = [...scores];
    updated[idx].subject = name;
    setScores(updated);
  };

  const handleAddSubject = () => {
    const palette = ['#10B981', '#6366F1', '#F59E0B', '#06B6D4', '#8B5CF6', '#F43F5E', '#F97316'];
    const chosenColor = palette[scores.length % palette.length];
    setScores([
      ...scores,
      { subject: 'New Subject', score: 85, fullMark: 100, color: chosenColor }
    ]);
  };


  const handleRemoveSubject = (idx) => {
    setScores(scores.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSubjectScores(scores);
    updatePerformanceStanding(Number(att), gpa);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 backdrop-blur-xs">
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="w-full max-w-md bg-white dark:bg-slate-800 rounded-t-3xl shadow-2xl p-6 border-t border-slate-200 dark:border-slate-700 max-h-[85vh] flex flex-col"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700 shrink-0">
              <div className="flex items-center space-x-2">
                <Sliders className="w-5 h-5 text-primary" />
                <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
                  Customize Performance Status
                </h3>
              </div>
              <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4 overflow-y-auto flex-1 pr-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Overall Attendance %
                  </label>
                  <input
                    type="number"
                    value={att}
                    onChange={(e) => setAtt(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    CGPA / Grade Score
                  </label>
                  <input
                    type="text"
                    value={gpa}
                    onChange={(e) => setGpa(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Subject-Wise Scores
                  </label>
                  <button
                    type="button"
                    onClick={handleAddSubject}
                    className="text-xs font-bold text-primary hover:underline flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Subject</span>
                  </button>
                </div>

                {scores.map((s, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl border flex items-center space-x-2">
                    <input
                      type="text"
                      value={s.subject}
                      onChange={(e) => handleSubjectNameChange(idx, e.target.value)}
                      className="flex-1 p-1.5 bg-white dark:bg-slate-800 border rounded-lg text-xs font-semibold"
                    />
                    <div className="w-20 flex items-center space-x-1">
                      <input
                        type="number"
                        value={s.score}
                        onChange={(e) => handleScoreChange(idx, e.target.value)}
                        className="w-full p-1.5 bg-white dark:bg-slate-800 border rounded-lg text-xs font-extrabold text-emerald-600 text-center"
                      />
                      <span className="text-xs text-slate-400">%</span>
                    </div>
                    {scores.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSubject(idx)}
                        className="text-slate-300 hover:text-rose-500 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-primary text-white font-heading font-semibold text-xs rounded-xl shadow hover:bg-primary-light flex items-center justify-center space-x-1.5"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Saved Performance Status!</span>
                  </>
                ) : (
                  <span>Save Performance Metrics</span>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
