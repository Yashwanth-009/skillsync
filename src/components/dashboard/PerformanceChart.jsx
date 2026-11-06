import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Award, CheckCircle, Clock } from 'lucide-react';
import { useDashboardStore } from '../../store/useDashboardStore';
import { usePracticeStore } from '../../store/usePracticeStore';
import { EmptyState } from '../ui/EmptyState';

export const PerformanceChart = () => {
  const customData = useDashboardStore((state) => state.performanceData);
  const subjectScores = useDashboardStore((state) => state.subjectScores) || [];
  const attendance = useDashboardStore((state) => state.attendance);
  const goals = useDashboardStore((state) => state.goals) || [];
  const attemptHistory = usePracticeStore((state) => state.attemptHistory) || [];

  const [selectedSegment, setSelectedSegment] = useState(null);

  // Dynamically compute performance segments strictly from real student data
  let performanceData = [];

  if (customData && customData.length > 0) {
    performanceData = customData;
  } else {
    // 1. Subject Exams
    if (subjectScores.length > 0) {
      const avgScore = Math.round(
        subjectScores.reduce((acc, s) => acc + (Number(s.score) || 0), 0) / subjectScores.length
      );
      performanceData.push({ name: 'Subject Exams', value: avgScore, color: '#10B981' });
    }

    // 2. Attendance
    if (typeof attendance === 'number' && attendance > 0) {
      performanceData.push({ name: 'Attendance', value: attendance, color: '#F59E0B' });
    }

    // 3. Practice Tests
    if (attemptHistory.length > 0) {
      const avgPractice = Math.round(
        attemptHistory.reduce((acc, a) => {
          const pct = a.totalQuestions > 0 ? (a.score / a.totalQuestions) * 100 : 0;
          return acc + pct;
        }, 0) / attemptHistory.length
      );
      performanceData.push({ name: 'Practice Tests', value: avgPractice, color: '#06B6D4' });
    }

    // 4. Academic Goals
    if (goals.length > 0) {
      const completedGoals = goals.filter((g) => g.completed).length;
      const goalsPct = Math.round((completedGoals / goals.length) * 100);
      performanceData.push({ name: 'Weekly Goals', value: goalsPct, color: '#6366F1' });
    }
  }

  const hasData = performanceData.length > 0;
  const overallScore = hasData
    ? Math.round(performanceData.reduce((acc, curr) => acc + curr.value, 0) / performanceData.length)
    : 0;

  const handleClickSegment = (entry) => {
    setSelectedSegment(entry);
  };

  return (
    <div className="bg-surface/90 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-5 shadow-card border border-emerald-100/80 dark:border-emerald-900/40 transition-all duration-200 hover:shadow-card-hover space-y-2">
      <div className="flex items-center justify-between mb-1">
        <div>
          <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white flex items-center space-x-2">
            <Award className="w-5 h-5 text-amber-500 fill-amber-500/20" />
            <span className="tracking-tight">Academic Performance</span>
          </h3>
          <p className="text-xs font-medium text-slate-600 dark:text-slate-300">Live progress breakdown for current term</p>
        </div>
        {hasData && (
          <span className="px-3 py-1 bg-emerald-100/80 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 text-xs font-extrabold rounded-full border border-emerald-200 dark:border-emerald-800/60 shadow-2xs font-mono">
            Overall: {overallScore}%
          </span>
        )}
      </div>

      {!hasData ? (
        <EmptyState
          icon={Award}
          title="No Performance Data Yet"
          description="Add your course scores, track daily goals, or complete practice tests to generate your academic performance breakdown."
        />
      ) : (
        <>
          {/* Pie Chart Viewport */}
          <div className="h-44 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={performanceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                  onClick={handleClickSegment}
                  cursor="pointer"
                >
                  {performanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" className="hover:opacity-80 transition-opacity" />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900/95 backdrop-blur-md text-white text-xs px-3.5 py-2 rounded-xl shadow-xl border border-emerald-500/30">
                          <p className="font-bold">{data.name}</p>
                          <p className="text-emerald-400 font-extrabold font-mono text-sm">{data.value}%</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Center Overall Gauge Badge */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-extrabold font-heading text-slate-900 dark:text-white font-mono">
                {overallScore}%
              </span>
              <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">Score</span>
            </div>
          </div>

          {/* Segment Legend Sub-Labels */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
            {performanceData.map((item) => (
              <button
                key={item.name}
                onClick={() => setSelectedSegment(item)}
                className="flex flex-col items-center p-2 rounded-xl hover:bg-emerald-50/80 dark:hover:bg-slate-800/80 transition-all duration-200 cursor-pointer active:scale-95 border border-transparent hover:border-emerald-200 dark:hover:border-emerald-800"
              >
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-slate-900 shadow-xs" style={{ backgroundColor: item.color }} />
                  <span className="text-[11px] font-bold text-slate-900 dark:text-slate-100 font-mono">{item.value}%</span>
                </div>
                <span className="text-[10px] font-medium text-slate-600 dark:text-slate-300 truncate w-full mt-0.5">{item.name}</span>
              </button>
            ))}
          </div>

          {/* Selected Details Popover */}
          {selectedSegment && (
            <div className="mt-3 p-3.5 bg-emerald-50/80 dark:bg-slate-900/90 rounded-2xl flex items-center justify-between border border-emerald-200/80 dark:border-emerald-800/60 shadow-xs">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">{selectedSegment.name}</p>
                <p className="text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
                  Standing: {selectedSegment.value >= 85 ? 'Excellent 🌟' : selectedSegment.value >= 70 ? 'On Track 👍' : 'Needs Review ⚠️'}
                </p>
              </div>
              <button
                onClick={() => setSelectedSegment(null)}
                className="text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 dark:hover:text-emerald-100 cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
