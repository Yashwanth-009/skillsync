import React, { useRef, useState } from 'react';
import { X, Sparkles, Image, Code, FileText, Send, AlertCircle, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePeerSolveStore } from '../../store/usePeerSolveStore';
import { validateAndClassifyDoubt } from '../../services/gemini';
import { sanitizeInput } from '../../lib/security';

export const AskDoubtModal = ({ isOpen, onClose }) => {
  const askQuestion = usePeerSolveStore((state) => state.askQuestion);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [branch, setBranch] = useState('CSE');
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [isClassifying, setIsClassifying] = useState(false);
  const [validationError, setValidationError] = useState(null);

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const branches = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'AI/ML', 'Others'];

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAttachment(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsClassifying(true);
    setValidationError(null);

    const actualDescription = description.trim() || title.trim();

    try {
      const result = await Promise.race([
        validateAndClassifyDoubt(title.trim(), actualDescription),
        new Promise((resolve) =>
          setTimeout(() => resolve({ is_genuine_doubt: true, is_credit_seeking: false }), 3500)
        )
      ]);

      if (result && (result.is_credit_seeking || result.is_genuine_doubt === false)) {
        setIsClassifying(false);
        setValidationError(
          result.rejection_reason ||
          "⚠️ This section is for asking genuine academic doubts. Please describe the concept or problem you're having difficulty with."
        );
        return;
      }
    } catch (err) {
      console.warn('Validation check fallback:', err);
    }

    askQuestion({
      title: sanitizeInput(title),
      description: sanitizeInput(actualDescription),
      branch,
      subject: sanitizeInput(subject) || `${branch} Core`,
      topic: sanitizeInput(topic) || 'Academic Concept',
      attachments: attachment ? [attachment] : []
    });

    setIsClassifying(false);
    setTitle('');
    setDescription('');
    setSubject('');
    setTopic('');
    setAttachment(null);
    setValidationError(null);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/90 dark:border-slate-800 flex flex-col max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="px-5 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <div>
                <h3 className="font-heading font-extrabold text-sm text-white">Ask an Academic Doubt</h3>
                <p className="text-[10px] text-emerald-100">AI automatically classifies difficulty & credit limits</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1 text-white/80 hover:text-white rounded-full hover:bg-white/10">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
            {validationError && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700/80 rounded-2xl flex items-start space-x-2 text-amber-900 dark:text-amber-200"
              >
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">
                  <p className="font-extrabold text-amber-800 dark:text-amber-300">Invalid Submission Detected</p>
                  <p className="mt-0.5 font-medium">{validationError}</p>
                </div>
              </motion.div>
            )}

            {/* Title */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Question Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. How does TCP 3-way handshake handle sequence synchronization?"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Describe Your Doubt <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide complete context, specific formula, error messages, or questions..."
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* Grid for Branch, Subject, Topic */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Branch</label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {branches.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Operating Systems"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Topic</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Process Sync"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* AI Auto Difficulty Card */}
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-2xl flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-[11px] text-emerald-800 dark:text-emerald-300">
                <span className="font-bold">Automatic Credit Allocation:</span> Difficulty level & reward limit (5 to 30 credits 🪙) will be assigned automatically by AI based on doubt complexity.
              </div>
            </div>

            {/* Mobile Touch-Accessible Attachment Upload */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Attach Image / Screenshot</label>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer flex items-center space-x-1.5 transition-colors relative overflow-hidden"
                >
                  <Image className="w-4 h-4 text-emerald-600" />
                  <span>Choose Photo</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,image/heic,image/heif"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                </button>

                {attachment && (
                  <div className="relative inline-block">
                    <img src={attachment} alt="Preview" className="w-12 h-12 object-cover rounded-xl border-2 border-emerald-500" />
                    <button
                      type="button"
                      onClick={() => setAttachment(null)}
                      className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-500 text-white rounded-full flex items-center justify-center text-[9px]"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isClassifying || !title.trim()}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-heading font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/20 hover:opacity-90 active:scale-98 transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                {isClassifying ? (
                  <span>AI Classifying Difficulty...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Post Doubt to PeerSolve</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
