import React from 'react';
import { Bell, CheckCheck, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboardStore } from '../../store/useDashboardStore';

export const NotificationModal = ({ isOpen, onClose }) => {
  const notifications = useDashboardStore((state) => state.notifications);
  const markNotificationsRead = useDashboardStore((state) => state.markNotificationsRead);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-slate-900/40 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-primary" />
                <h3 className="font-heading font-semibold text-slate-900 dark:text-white">Notifications</h3>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={markNotificationsRead}
                  className="text-xs font-medium text-primary hover:underline flex items-center space-x-1"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark read</span>
                </button>
                <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700">
              {notifications.map((item) => (
                <div
                  key={item.id}
                  className={`p-3.5 transition-colors ${
                    item.read ? 'bg-white dark:bg-slate-800' : 'bg-primary/5 dark:bg-primary/10'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{item.title}</h4>
                    <span className="text-[10px] text-slate-400">{item.time}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{item.message}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
