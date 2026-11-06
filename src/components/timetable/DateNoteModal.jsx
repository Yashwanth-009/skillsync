import React, { useState, useEffect } from 'react';
import { X, Trash2, Calendar, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTimetableStore } from '../../store/useTimetableStore';
import { sanitizeInput } from '../../lib/security';

export const DateNoteModal = ({ isOpen, onClose, selectedDate, existingNote }) => {
  const addOrUpdateCalendarNote = useTimetableStore((state) => state.addOrUpdateCalendarNote);
  const deleteCalendarNote = useTimetableStore((state) => state.deleteCalendarNote);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (existingNote) {
      setTitle(existingNote.title || '');
      setContent(existingNote.content || '');
    } else {
      setTitle('');
      setContent('');
    }
  }, [existingNote, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() && !content.trim()) return;

    addOrUpdateCalendarNote(selectedDate, sanitizeInput(title) || 'Calendar Note', sanitizeInput(content));
    onClose();
  };

  const handleDelete = () => {
    deleteCalendarNote(selectedDate);
    onClose();
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
            className="w-full max-w-md bg-white dark:bg-slate-800 rounded-t-3xl shadow-2xl p-6 border-t border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-primary" />
                <h3 className="font-heading font-bold text-sm text-slate-900 dark:text-white">
                  Note for {selectedDate}
                </h3>
              </div>
              <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Note Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Midterm Exam / Project Deadline"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Details & Notes
                </label>
                <textarea
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Type important reminders, room numbers, topics to revise..."
                  className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                {existingNote && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="px-4 py-2.5 bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400 font-semibold text-xs rounded-xl flex items-center space-x-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-primary text-white font-heading font-semibold text-xs rounded-xl shadow hover:bg-primary-light"
                >
                  Save Note
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
