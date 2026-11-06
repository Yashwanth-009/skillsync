import React from 'react';
import { Calendar, CheckCircle2, Clock, Trash2, Plus } from 'lucide-react';
import { useDashboardStore } from '../../store/useDashboardStore';

export const RemindersSection = ({ onOpenAddModal }) => {
  const reminders = useDashboardStore((state) => state.reminders);
  const toggleReminderCompleted = useDashboardStore((state) => state.toggleReminderCompleted);
  const deleteReminder = useDashboardStore((state) => state.deleteReminder);

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-rose-100/90 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-200/80 dark:border-rose-800/60';
      case 'Medium':
        return 'bg-amber-100/90 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/60';
      default:
        return 'bg-emerald-100/90 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/60';
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white flex items-center space-x-2">
          <Clock className="w-5 h-5 text-primary" />
          <span className="tracking-tight">Upcoming Reminders</span>
        </h3>
        <button
          onClick={onOpenAddModal}
          className="text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:text-emerald-800 dark:hover:text-emerald-200 flex items-center space-x-1 cursor-pointer bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-xl border border-emerald-200/60 dark:border-emerald-800/40 hover:scale-105 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Reminder</span>
        </button>
      </div>

      {reminders.length === 0 ? (
        <div className="bg-surface/90 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-6 text-center border border-dashed border-slate-300 dark:border-slate-700">
          <Calendar className="w-10 h-10 text-emerald-400 dark:text-emerald-600 mx-auto mb-2 opacity-80" />
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">No reminders yet</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Tap "+ Add Reminder" to stay on top of deadlines!</p>
        </div>
      ) : (
        <div className="flex space-x-3 overflow-x-auto pb-2 pt-1 scrollbar-none">
          {reminders.map((item) => (
            <div
              key={item.id}
              className={`min-w-[240px] max-w-[260px] bg-surface/90 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-4 shadow-card border transition-all duration-200 flex flex-col justify-between cursor-pointer hover:-translate-y-1 hover:shadow-card-hover ${
                item.completed ? 'opacity-60 border-slate-200 dark:border-slate-800' : 'border-emerald-100/80 dark:border-emerald-900/40 hover:border-emerald-300 dark:hover:border-emerald-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded-full border ${getPriorityBadge(item.priority)}`}>
                    {item.priority} Priority
                  </span>
                  <button
                    onClick={() => deleteReminder(item.id)}
                    className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer transition-colors"
                    title="Delete reminder"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <h4 className={`font-semibold text-xs text-slate-900 dark:text-white line-clamp-2 leading-relaxed ${item.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''}`}>
                  {item.title}
                </h4>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300 flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{item.dueDate}</span>
                </span>
                <button
                  onClick={() => toggleReminderCompleted(item.id)}
                  className={`p-1.5 rounded-xl cursor-pointer transition-all duration-200 active:scale-90 ${
                    item.completed
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 ring-1 ring-emerald-300'
                      : 'bg-slate-100 text-slate-400 hover:text-emerald-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

