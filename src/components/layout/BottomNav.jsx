import React from 'react';
import { Compass, FileText, Home, BookOpen, UserCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDashboardStore } from '../../store/useDashboardStore';

export const BottomNav = ({ activeTab, onTabChange }) => {
  const reminders = useDashboardStore((state) => state.reminders);
  const pendingReminders = reminders.filter((r) => !r.completed).length;

  const tabs = [
    {
      id: 'careerconnect',
      label: 'Career Connect',
      shortLabel: 'Career',
      icon: Compass,
      activeColor: 'text-teal-600 dark:text-teal-300 font-bold',
      activeBg: 'bg-teal-50 dark:bg-teal-950/70 border-teal-200 dark:border-teal-800/80',
      glowBg: 'bg-teal-500/15 dark:bg-teal-400/20',
      indicatorColor: 'bg-teal-500'
    },
    {
      id: 'resume',
      label: 'Resume',
      shortLabel: 'Resume',
      icon: FileText,
      activeColor: 'text-indigo-600 dark:text-indigo-300 font-bold',
      activeBg: 'bg-indigo-50 dark:bg-indigo-950/70 border-indigo-200 dark:border-indigo-800/80',
      glowBg: 'bg-indigo-500/15 dark:bg-indigo-400/20',
      indicatorColor: 'bg-indigo-500'
    },
    {
      id: 'home',
      label: 'Home',
      shortLabel: 'Home',
      icon: Home,
      activeColor: 'text-emerald-600 dark:text-emerald-300 font-bold',
      activeBg: 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-200 dark:border-emerald-800/80',
      glowBg: 'bg-emerald-500/15 dark:bg-emerald-400/20',
      indicatorColor: 'bg-emerald-500',
      badge: pendingReminders > 0 ? pendingReminders : null
    },
    {
      id: 'timetable',
      label: 'Study Hub',
      shortLabel: 'Study Hub',
      icon: BookOpen,
      activeColor: 'text-amber-600 dark:text-amber-300 font-bold',
      activeBg: 'bg-amber-50 dark:bg-amber-950/70 border-amber-200 dark:border-amber-800/80',
      glowBg: 'bg-amber-500/15 dark:bg-amber-400/20',
      indicatorColor: 'bg-amber-500'
    },
    {
      id: 'profile',
      label: 'Profile',
      shortLabel: 'Profile',
      icon: UserCircle,
      activeColor: 'text-rose-600 dark:text-rose-300 font-bold',
      activeBg: 'bg-rose-50 dark:bg-rose-950/70 border-rose-200 dark:border-rose-800/80',
      glowBg: 'bg-rose-500/15 dark:bg-rose-400/20',
      indicatorColor: 'bg-rose-500'
    },
  ];

  return (
    <nav aria-label="Main Navigation" className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800 shadow-nav pb-safe transition-all duration-200">
      <div className="max-w-md mx-auto px-2 h-16 grid grid-cols-5 items-center gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center h-12.5 my-auto px-0.5 rounded-2xl cursor-pointer transition-all duration-200 focus:outline-none select-none ${
                isActive
                  ? `${tab.activeBg} border shadow-xs`
                  : 'hover:bg-slate-100/70 dark:hover:bg-slate-800/60 active:scale-95'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabGlow"
                  className={`absolute inset-0 rounded-2xl ${tab.glowBg} pointer-events-none`}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              <div className="relative flex items-center justify-center">
                <Icon
                  className={`w-4.5 h-4.5 sm:w-5 sm:h-5 transition-all duration-200 ${
                    isActive
                      ? `${tab.activeColor} scale-105`
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                />

                {tab.badge && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[17px] h-[17px] px-1 bg-rose-500 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center shadow-xs ring-2 ring-white dark:ring-slate-900">
                    {tab.badge}
                  </span>
                )}
              </div>

              <span
                className={`text-[8.5px] sm:text-[9.5px] font-semibold mt-0.5 tracking-tight leading-none text-center truncate max-w-full px-0.5 transition-colors ${
                  isActive
                    ? `${tab.activeColor}`
                    : 'text-slate-500 dark:text-slate-400 font-medium'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

