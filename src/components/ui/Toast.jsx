import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useToastStore } from '../../store/useToastStore';

export const ToastContainer = () => {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />,
    info: <Info className="w-4 h-4 text-secondary shrink-0" />
  };

  const borders = {
    success: 'border-emerald-500/30 bg-white dark:bg-slate-800 text-slate-900 dark:text-white',
    error: 'border-rose-500/30 bg-white dark:bg-slate-800 text-slate-900 dark:text-white',
    info: 'border-teal-500/30 bg-white dark:bg-slate-800 text-slate-900 dark:text-white'
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-xs px-3 space-y-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className={`pointer-events-auto p-3.5 rounded-2xl border shadow-xl flex items-center justify-between space-x-3 backdrop-blur-md ${borders[toast.type] || borders.info}`}
          >
            <div className="flex items-center space-x-2.5 min-w-0">
              {icons[toast.type] || icons.info}
              <p className="text-xs font-semibold truncate leading-tight">
                {toast.message}
              </p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 shrink-0 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
