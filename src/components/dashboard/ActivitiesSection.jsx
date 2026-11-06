import React from 'react';
import { CalendarDays, CheckCircle2, Clock, PlayCircle } from 'lucide-react';
import { useDashboardStore } from '../../store/useDashboardStore';
import { EmptyState } from '../ui/EmptyState';

export const ActivitiesSection = () => {
  const activities = useDashboardStore((state) => state.activities);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Done':
        return { text: 'Done', bg: 'bg-emerald-100/90 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border-emerald-200/80 dark:border-emerald-800/60', icon: CheckCircle2 };
      case 'In Progress':
        return { text: 'In Progress', bg: 'bg-teal-100/90 dark:bg-teal-950/80 text-teal-800 dark:text-teal-200 border-teal-200/80 dark:border-teal-800/60', icon: PlayCircle };
      default:
        return { text: 'Pending', bg: 'bg-amber-100/90 dark:bg-amber-950/80 text-amber-800 dark:text-amber-200 border-amber-200/80 dark:border-amber-800/60', icon: Clock };
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white flex items-center space-x-2">
          <CalendarDays className="w-5 h-5 text-secondary" />
          <span className="tracking-tight">Recent & Upcoming Activities</span>
        </h3>
        <span className="text-xs text-slate-600 dark:text-slate-300 font-bold">Today</span>
      </div>

      {activities.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No Recent Activities"
          description="Your scheduled activities and class events will appear here."
        />
      ) : (
        <div className="space-y-2.5">
          {activities.map((act) => {
            const badge = getStatusBadge(act.status);
            const Icon = badge.icon;

            return (
              <div
                key={act.id}
                className="bg-surface/90 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-3.5 shadow-card border-l-4 border border-slate-100 dark:border-slate-800 flex items-center justify-between transition-all duration-200 hover:translate-x-1 cursor-pointer hover:border-emerald-200 dark:hover:border-emerald-800"
                style={{ borderLeftColor: act.color }}
              >
                <div className="space-y-1 max-w-[70%]">
                  <h4 className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                    {act.title}
                  </h4>
                  <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300 flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="font-mono">{act.time}</span>
                  </p>
                </div>

                <span className={`px-2.5 py-1 text-[10px] font-extrabold rounded-full border flex items-center space-x-1.5 shadow-2xs ${badge.bg}`}>
                  <Icon className="w-3 h-3" />
                  <span>{badge.text}</span>
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
