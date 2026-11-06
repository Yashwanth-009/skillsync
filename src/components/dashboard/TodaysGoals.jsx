import React, { useState } from 'react';
import { Target, CheckCircle2, Circle, Plus, Trash2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboardStore } from '../../store/useDashboardStore';
import { EmptyState } from '../ui/EmptyState';

export const TodaysGoals = () => {
  const goals = useDashboardStore((state) => state.goals);
  const toggleGoal = useDashboardStore((state) => state.toggleGoal);
  const addGoal = useDashboardStore((state) => state.addGoal);
  const deleteGoal = useDashboardStore((state) => state.deleteGoal);

  const [newGoalText, setNewGoalText] = useState('');
  const [showAddInput, setShowAddInput] = useState(false);

  const completedCount = goals.filter((g) => g.completed).length;
  const progressPercentage = goals.length > 0 ? Math.round((completedCount / goals.length) * 100) : 0;

  const handleAddGoalSubmit = (e) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;
    addGoal(newGoalText);
    setNewGoalText('');
    setShowAddInput(false);
  };

  return (
    <div className="bg-surface/90 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-5 border border-emerald-100/80 dark:border-emerald-900/40 shadow-card space-y-3 transition-all duration-200 hover:shadow-card-hover">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
            <Target className="w-4.5 h-4.5 text-emerald-500" />
            <span className="tracking-tight">Today's Academic Goals</span>
          </h3>
          <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300">Track daily focus tasks & earn credits</p>
        </div>
        <button
          onClick={() => setShowAddInput(!showAddInput)}
          className="text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:text-emerald-800 dark:hover:text-emerald-200 flex items-center space-x-1 cursor-pointer bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-xl border border-emerald-200/60 dark:border-emerald-800/40 hover:scale-105 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Goal</span>
        </button>
      </div>

      {/* Dynamic Progress Bar */}
      {goals.length > 0 && (
        <div className="space-y-1.5 bg-emerald-50/60 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-emerald-100/70 dark:border-slate-700/60">
          <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
            <span>Completion Progress</span>
            <span className="text-emerald-700 dark:text-emerald-300">{completedCount} of {goals.length} ({progressPercentage}%)</span>
          </div>
          <div className="h-2.5 bg-slate-200/80 dark:bg-slate-700/80 rounded-full overflow-hidden p-0.5">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full shadow-glow"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>
      )}

      {/* Add Goal Input */}
      {showAddInput && (
        <form onSubmit={handleAddGoalSubmit} className="flex space-x-2">
          <input
            type="text"
            value={newGoalText}
            onChange={(e) => setNewGoalText(e.target.value)}
            placeholder="Type new goal (e.g. Complete Chapter 3 Notes)"
            className="flex-1 px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40"
            autoFocus
          />
          <button type="submit" className="px-4 py-2.5 bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold rounded-xl hover:opacity-90 active:scale-95 cursor-pointer shadow-xs">
            Add
          </button>
        </form>
      )}

      {goals.length === 0 ? (
        <EmptyState
          icon={Target}
          title="No Daily Goals Created"
          description="Create daily focus tasks to organize your study session and earn student credits."
          actionLabel="Create First Goal"
          onAction={() => setShowAddInput(true)}
        />
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {goals.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className={`p-3 rounded-2xl border transition-all duration-200 flex items-center justify-between cursor-pointer ${
                  item.completed
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/50 dark:border-emerald-900/40 text-slate-400'
                    : 'bg-white/90 dark:bg-slate-900/90 border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white shadow-xs hover:border-emerald-300 dark:hover:border-emerald-700'
                }`}
              >
                <button
                  onClick={() => toggleGoal(item.id)}
                  className="flex items-start space-x-2.5 text-left flex-1 cursor-pointer"
                >
                  {item.completed ? (
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="w-4.5 h-4.5 text-slate-400 hover:text-emerald-500 shrink-0 mt-0.5 transition-colors" />
                  )}
                  <span className={`text-xs font-medium leading-relaxed ${item.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-100'}`}>
                    {item.title}
                  </span>
                </button>

                <button
                  onClick={() => deleteGoal(item.id)}
                  className="text-slate-400 hover:text-rose-500 p-1 shrink-0 ml-2 cursor-pointer transition-colors"
                  title="Delete goal"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
