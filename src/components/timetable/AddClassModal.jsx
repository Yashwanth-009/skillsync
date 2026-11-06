import React, { useState, useEffect } from 'react';
import { X, Trash2, Check, Clock, User, DoorOpen, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTimetableStore } from '../../store/useTimetableStore';
import { sanitizeInput } from '../../lib/security';

export const AddClassModal = ({ isOpen, onClose, initialData }) => {
  const addClass = useTimetableStore((state) => state.addClass);
  const updateClass = useTimetableStore((state) => state.updateClass);
  const deleteClass = useTimetableStore((state) => state.deleteClass);

  const colors = [
    '#4F46E5', '#06B6D4', '#F59E0B', '#10B981',
    '#8B5CF6', '#EC4899', '#EF4444', '#3B82F6'
  ];

  const [subject, setSubject] = useState('');
  const [professor, setProfessor] = useState('');
  const [room, setRoom] = useState('');
  const [day, setDay] = useState('Mon');
  const [timeSlot, setTimeSlot] = useState('09:00');
  const [duration, setDuration] = useState(1);
  const [selectedColor, setSelectedColor] = useState('#4F46E5');

  useEffect(() => {
    if (initialData) {
      setSubject(initialData.subject || '');
      setProfessor(initialData.professor || '');
      setRoom(initialData.room || '');
      setDay(initialData.day || 'Mon');
      setTimeSlot(initialData.timeSlot || '09:00');
      setDuration(initialData.duration || 1);
      setSelectedColor(initialData.color || '#4F46E5');
    } else {
      setSubject('');
      setProfessor('');
      setRoom('');
      setSelectedColor('#4F46E5');
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject.trim()) return;

    if (initialData?.id) {
      updateClass(initialData.id, {
        subject: sanitizeInput(subject),
        professor: sanitizeInput(professor),
        room: sanitizeInput(room),
        day,
        timeSlot,
        duration: Number(duration),
        color: selectedColor
      });
    } else {
      addClass({
        subject: sanitizeInput(subject),
        professor: sanitizeInput(professor),
        room: sanitizeInput(room),
        day,
        timeSlot,
        duration: Number(duration),
        color: selectedColor
      });
    }
    onClose();
  };

  const handleDelete = () => {
    if (initialData?.id) {
      deleteClass(initialData.id);
      onClose();
    }
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
              <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
                {initialData?.id ? 'Edit Class Entry' : 'Add New Class'}
              </h3>
              <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Subject Name
                </label>
                <div className="relative">
                  <BookOpen className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Data Structures"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Professor Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={professor}
                      onChange={(e) => setProfessor(e.target.value)}
                      placeholder="Prof. Rao"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Room / Hall
                  </label>
                  <div className="relative">
                    <DoorOpen className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={room}
                      onChange={(e) => setRoom(e.target.value)}
                      placeholder="Room 204"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Day</label>
                  <select
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-900 border rounded-xl text-xs"
                  >
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Start Time</label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-900 border rounded-xl text-xs"
                  >
                    {['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Duration</label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-900 border rounded-xl text-xs"
                  >
                    <option value={1}>1 Hour</option>
                    <option value={2}>2 Hours</option>
                    <option value={3}>3 Hours</option>
                  </select>
                </div>
              </div>

              {/* Color Tag Swatches */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Color Tag Accent
                </label>
                <div className="flex space-x-2">
                  {colors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSelectedColor(c)}
                      className={`w-7 h-7 rounded-full transition-transform flex items-center justify-center ${
                        selectedColor === c ? 'scale-110 ring-2 ring-slate-900 dark:ring-white' : ''
                      }`}
                      style={{ backgroundColor: c }}
                    >
                      {selectedColor === c && <Check className="w-4 h-4 text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                {initialData?.id && (
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
                  Save Class Entry
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
