import React from 'react';
import { Compass, FileText, BookOpen, User } from 'lucide-react';

export const QuickAccessButtons = ({ onNavigate }) => {
  const buttons = [
    { id: 'careerconnect', label: 'Career Connect', icon: Compass, bg: 'bg-emerald-50/90 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/60 hover:border-emerald-400' },
    { id: 'resume', label: 'Resume', icon: FileText, bg: 'bg-teal-50/90 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 border-teal-200/80 dark:border-teal-800/60 hover:border-teal-400' },
    { id: 'timetable', label: 'Study Hub', icon: BookOpen, bg: 'bg-amber-50/90 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/60 hover:border-amber-400' },
    { id: 'profile', label: 'Profile', icon: User, bg: 'bg-rose-50/90 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-200/80 dark:border-rose-800/60 hover:border-rose-400' },
  ];

  return (
    <div className="grid grid-cols-4 gap-2.5">
      {buttons.map((btn) => {
        const Icon = btn.icon;
        return (
          <button
            key={btn.id}
            onClick={() => onNavigate(btn.id)}
            className="flex flex-col items-center group cursor-pointer active:scale-95 transition-all duration-200"
          >
            <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center shadow-card ${btn.bg} group-hover:-translate-y-1 group-hover:shadow-card-hover transition-all duration-200`}>
              <Icon className="w-6 h-6 transition-transform group-hover:scale-110" />
            </div>
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 mt-1.5 transition-colors group-hover:text-primary">
              {btn.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

