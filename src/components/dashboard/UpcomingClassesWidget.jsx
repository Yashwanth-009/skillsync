import React from 'react';
import { BookOpen, Clock, MapPin, UserCheck } from 'lucide-react';
import { useTimetableStore } from '../../store/useTimetableStore';

export const UpcomingClassesWidget = () => {
  const classes = useTimetableStore((state) => state.classes);
  const todaysClasses = classes.filter((c) => c.day === 'Mon' || c.day === 'Tue');

  return (
    <div className="bg-surface/90 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-5 border border-emerald-100/80 dark:border-emerald-900/40 shadow-card space-y-3 transition-all duration-200 hover:shadow-card-hover">
      <div className="flex items-center justify-between">
        <h3 className="font-heading font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
          <BookOpen className="w-4.5 h-4.5 text-primary" />
          <span className="tracking-tight">Upcoming Classes Today</span>
        </h3>
        <span className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60 shadow-2xs">
          Live Schedule
        </span>
      </div>

      <div className="space-y-2.5">
        {todaysClasses.map((cls) => (
          <div
            key={cls.id}
            className="p-3.5 bg-white/90 dark:bg-slate-900/90 rounded-2xl border-l-4 border border-slate-100 dark:border-slate-800/80 flex items-center justify-between transition-all duration-200 hover:translate-x-1 cursor-pointer shadow-xs hover:border-emerald-200 dark:hover:border-emerald-800"
            style={{ borderLeftColor: cls.color }}
          >
            <div className="space-y-1">
              <h4 className="font-bold text-xs text-slate-900 dark:text-white">{cls.subject}</h4>
              <div className="flex items-center space-x-3 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-emerald-500" />
                  <span>{cls.room}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <UserCheck className="w-3 h-3 text-emerald-500" />
                  <span>{cls.professor}</span>
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block font-mono">{cls.timeSlot}</span>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold">{cls.duration} Hours</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

