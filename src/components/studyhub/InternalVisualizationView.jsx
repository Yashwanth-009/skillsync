import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Award,
  ArrowLeft,
  Calendar,
  Sparkles,
  CheckCircle2,
  Clock,
  TrendingUp,
  BookOpen
} from 'lucide-react';
import { SubjectPerformanceChart } from '../dashboard/SubjectPerformanceChart';
import { PerformanceChart } from '../dashboard/PerformanceChart';
import { useDashboardStore } from '../../store/useDashboardStore';
import { useTimetableStore } from '../../store/useTimetableStore';

export const InternalVisualizationView = ({ onBack }) => {
  const rawCgpa = useDashboardStore((state) => state.cgpa);
  const hasCgpa = rawCgpa && rawCgpa !== '0.00' && rawCgpa !== '0';
  const cgpa = hasCgpa ? rawCgpa : '0.00';
  const attendance = useDashboardStore((state) => state.attendance) ?? 0;
  const streakCount = useDashboardStore((state) => state.streakCount) ?? 0;
  const classes = useTimetableStore((state) => state.classes) || [];

  // Calculate schedule workload statistics from registered timetable classes
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const dayClassCounts = daysOfWeek.map((day) => ({
    day,
    count: classes.filter((c) => c.day === day).length
  }));

  // Find heaviest day
  const heaviestDayObj = [...dayClassCounts].sort((a, b) => b.count - a.count)[0];
  const totalClasses = classes.length;

  // Group classes by subject
  const subjectClassMap = classes.reduce((acc, c) => {
    const sub = c.subject || 'General';
    acc[sub] = (acc[sub] || 0) + 1;
    return acc;
  }, {});
  const subjectDistribution = Object.entries(subjectClassMap).map(([subject, count]) => ({
    subject,
    count,
    percentage: totalClasses > 0 ? Math.round((count / totalClasses) * 100) : 0
  }));

  return (
    <div className="space-y-4 animate-fade-in pb-12">
      {/* Top Breadcrumb & Controls */}
      <div className="flex items-center justify-between px-1">
        <button
          onClick={onBack}
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer border border-slate-200 dark:border-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Study Hub</span>
        </button>

        <span className="text-[11px] font-extrabold px-3 py-1 bg-cyan-100 dark:bg-cyan-950/80 text-cyan-800 dark:text-cyan-300 rounded-full border border-cyan-200 dark:border-cyan-800/60">
          📊 Academic Analytics
        </span>
      </div>

      {/* 1. Academic Performance Score Cards */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-surface/90 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-3 border border-emerald-100 dark:border-emerald-900/40 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Current CGPA</span>
            <Award className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="mt-2">
            <span className="text-xl font-extrabold font-heading text-slate-900 dark:text-white font-mono">{cgpa}</span>
            <span className="text-[10px] text-slate-400 font-medium"> / 4.0</span>
          </div>
          <span className="mt-1 text-[9px] font-bold text-slate-500 dark:text-slate-400 flex items-center">
            {hasCgpa ? (
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center">
                <TrendingUp className="w-2.5 h-2.5 mr-0.5" /> Standing: {Number(cgpa) >= 3.5 ? 'High' : Number(cgpa) >= 2.5 ? 'Good' : 'Needs Review'}
              </span>
            ) : (
              'Not configured yet'
            )}
          </span>
        </div>

        <div className="bg-surface/90 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-3 border border-indigo-100 dark:border-indigo-900/40 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Attendance</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
          </div>
          <div className="mt-2">
            <span className="text-xl font-extrabold font-heading text-slate-900 dark:text-white font-mono">{attendance}%</span>
          </div>
          <span className="mt-1 text-[9px] font-bold text-slate-500 dark:text-slate-400">
            {attendance >= 75 ? (
              <span className="text-indigo-600 dark:text-indigo-400">Above Minimum (75%)</span>
            ) : attendance > 0 ? (
              <span className="text-rose-600 dark:text-rose-400">Below Target</span>
            ) : (
              'Not logged'
            )}
          </span>
        </div>

        <div className="bg-surface/90 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-3 border border-amber-100 dark:border-amber-900/40 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Study Streak</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="mt-2">
            <span className="text-xl font-extrabold font-heading text-slate-900 dark:text-white font-mono">{streakCount}</span>
            <span className="text-[10px] text-slate-400 font-medium"> days 🔥</span>
          </div>
          <span className="mt-1 text-[9px] font-bold text-slate-500 dark:text-slate-400">
            {streakCount > 0 ? (
              <span className="text-amber-600 dark:text-amber-400">Keep it burning!</span>
            ) : (
              'Start streak today'
            )}
          </span>
        </div>
      </div>

      {/* 2. Primary Subject-Wise Performance Chart & Customizer */}
      <SubjectPerformanceChart />

      {/* 3. Term Assessment Breakdown (Donut Chart) */}
      <PerformanceChart />

      {/* 4. Timetable Schedule Load & Weekly Distribution */}
      <div className="bg-surface/90 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-5 shadow-card border border-slate-200/80 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
              <Calendar className="w-4.5 h-4.5 text-amber-500" />
              <span>Weekly Schedule Load</span>
            </h3>
            <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300">Class density across days of the week</p>
          </div>
          <span className="px-2.5 py-0.5 bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-200 text-[10px] font-extrabold rounded-full border border-amber-200 dark:border-amber-800/60">
            {totalClasses} Classes Registered
          </span>
        </div>

        {totalClasses === 0 ? (
          <div className="py-8 px-4 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-700 space-y-1.5">
            <Calendar className="w-8 h-8 text-slate-400 mx-auto opacity-50" />
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No Weekly Classes Added Yet</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Add your classes in the Weekly Timetable sub-tab to see your schedule load analytics.
            </p>
          </div>
        ) : (
          <>
            {/* Days of Week Workload Bar Graph */}
            <div className="grid grid-cols-7 gap-1 pt-2">
              {dayClassCounts.map((item) => {
                const maxCount = Math.max(...dayClassCounts.map((d) => d.count), 1);
                const heightPercent = item.count > 0 ? Math.max((item.count / maxCount) * 100, 20) : 10;
                const isHeaviest = item.count > 0 && item.count === heaviestDayObj?.count;

                return (
                  <div key={item.day} className="flex flex-col items-center space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 font-mono">
                      {item.count}
                    </span>
                    <div className="w-full h-24 bg-slate-100 dark:bg-slate-800 rounded-xl p-1 flex items-end">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${heightPercent}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className={`w-full rounded-lg transition-all ${
                          isHeaviest
                            ? 'bg-gradient-to-t from-amber-600 to-orange-500 shadow-sm'
                            : item.count > 0
                            ? 'bg-gradient-to-t from-emerald-600 to-teal-500'
                            : 'bg-slate-200 dark:bg-slate-700/50'
                        }`}
                      />
                    </div>
                    <span className={`text-[10px] font-bold ${isHeaviest ? 'text-amber-600 dark:text-amber-400' : 'text-slate-600 dark:text-slate-300'}`}>
                      {item.day}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Schedule Insights Footer */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl flex items-center justify-between text-xs border border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                  Busiest Academic Day: <strong className="text-slate-900 dark:text-white">{heaviestDayObj?.day} ({heaviestDayObj?.count} classes)</strong>
                </span>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                Active Routine
              </span>
            </div>

            {/* Subject Distribution Pills */}
            {subjectDistribution.length > 0 && (
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center space-x-1">
                  <BookOpen className="w-3 h-3 text-emerald-500" />
                  <span>Registered Subject Distribution</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {subjectDistribution.map((sub) => (
                    <span
                      key={sub.subject}
                      className="px-2.5 py-1 bg-white dark:bg-slate-800 rounded-xl text-[10px] font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center space-x-1"
                    >
                      <span className="font-bold">{sub.subject}:</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">{sub.count} classes ({sub.percentage}%)</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
