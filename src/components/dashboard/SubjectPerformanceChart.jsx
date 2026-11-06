import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BarChart3, Sliders, Sparkles, Award } from 'lucide-react';
import { CustomizePerformanceModal } from './CustomizePerformanceModal';
import { useDashboardStore } from '../../store/useDashboardStore';
import { EmptyState } from '../ui/EmptyState';

const SUBJECT_GRADIENTS = [
  { id: 'grad-emerald', start: '#10B981', end: '#047857', border: '#34D399', badgeBg: 'bg-emerald-50 dark:bg-emerald-950/60', badgeText: 'text-emerald-600 dark:text-emerald-400' },
  { id: 'grad-indigo', start: '#6366F1', end: '#4338CA', border: '#818CF8', badgeBg: 'bg-indigo-50 dark:bg-indigo-950/60', badgeText: 'text-indigo-600 dark:text-indigo-400' },
  { id: 'grad-amber', start: '#F59E0B', end: '#B45309', border: '#FBBF24', badgeBg: 'bg-amber-50 dark:bg-amber-950/60', badgeText: 'text-amber-600 dark:text-amber-400' },
  { id: 'grad-cyan', start: '#06B6D4', end: '#0E7490', border: '#22D3EE', badgeBg: 'bg-cyan-50 dark:bg-cyan-950/60', badgeText: 'text-cyan-600 dark:text-cyan-400' },
  { id: 'grad-purple', start: '#8B5CF6', end: '#6D28D9', border: '#A78BFA', badgeBg: 'bg-purple-50 dark:bg-purple-950/60', badgeText: 'text-purple-600 dark:text-purple-400' },
  { id: 'grad-rose', start: '#F43F5E', end: '#BE123C', border: '#FB7185', badgeBg: 'bg-rose-50 dark:bg-rose-950/60', badgeText: 'text-rose-600 dark:text-rose-400' },
  { id: 'grad-orange', start: '#F97316', end: '#C2410C', border: '#FB923C', badgeBg: 'bg-orange-50 dark:bg-orange-950/60', badgeText: 'text-orange-600 dark:text-orange-400' },
  { id: 'grad-teal', start: '#14B8A6', end: '#0F766E', border: '#2DD4BF', badgeBg: 'bg-teal-50 dark:bg-teal-950/60', badgeText: 'text-teal-600 dark:text-teal-400' },
];

export const SubjectPerformanceChart = () => {
  const storeScores = useDashboardStore((state) => state.subjectScores);
  const cgpa = useDashboardStore((state) => state.cgpa);

  const displayScores = storeScores || [];

  const [activeSubject, setActiveSubject] = useState(null);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);

  return (
    <div className="bg-surface/90 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-5 border border-emerald-100/80 dark:border-emerald-900/40 shadow-card space-y-3 transition-all duration-200 hover:shadow-card-hover">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
            <BarChart3 className="w-4.5 h-4.5 text-primary" />
            <span className="tracking-tight">Subject-Wise Performance</span>
          </h3>
          <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300">Course grade assessment & metrics</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowCustomizeModal(true)}
            className="p-1.5 bg-emerald-100/80 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 rounded-xl hover:bg-emerald-200 dark:hover:bg-emerald-900 transition-all cursor-pointer border border-emerald-200/60 dark:border-emerald-800/40 active:scale-95 flex items-center space-x-1 text-xs font-bold"
            title="Add & Customize Subject Scores"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Customize</span>
          </button>
          <span className="px-2.5 py-0.5 bg-emerald-100/80 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 text-[10px] font-extrabold rounded-full border border-emerald-200 dark:border-emerald-800/60 shadow-2xs">
            CGPA {cgpa}
          </span>
        </div>
      </div>

      {displayScores.length === 0 ? (
        <EmptyState
          icon={BarChart3}
          title="No Subject Scores Added"
          description="Add your courses and exam scores to generate your subject-wise performance chart."
          actionLabel="Add Subject Scores"
          onAction={() => setShowCustomizeModal(true)}
        />
      ) : (
        <>
          <div className="h-44 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={displayScores} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  {SUBJECT_GRADIENTS.map((grad) => (
                    <linearGradient key={grad.id} id={grad.id} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={grad.start} stopOpacity={0.95} />
                      <stop offset="100%" stopColor={grad.end} stopOpacity={0.85} />
                    </linearGradient>
                  ))}
                </defs>
                <XAxis
                  dataKey="subject"
                  tick={{ fontSize: 10, fill: '#059669', fontWeight: 700 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 10, fill: '#059669', fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      const idx = displayScores.findIndex(s => s.subject === data.subject);
                      const grad = SUBJECT_GRADIENTS[idx % SUBJECT_GRADIENTS.length];
                      return (
                        <div className="bg-slate-900/95 backdrop-blur-md text-white text-xs px-3.5 py-2 rounded-xl shadow-xl border border-slate-700 space-y-0.5">
                          <div className="flex items-center space-x-1.5">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: grad.start }} />
                            <p className="font-bold">{data.subject}</p>
                          </div>
                          <p className="font-extrabold font-mono text-sm" style={{ color: grad.start }}>{data.score}% / 100%</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="score"
                  radius={[8, 8, 0, 0]}
                  onClick={(data) => setActiveSubject(data)}
                  cursor="pointer"
                >
                  {displayScores.map((entry, index) => {
                    const grad = SUBJECT_GRADIENTS[index % SUBJECT_GRADIENTS.length];
                    const isSelected = activeSubject?.subject === entry.subject;
                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={`url(#${grad.id})`}
                        stroke={isSelected ? '#FFFFFF' : grad.border}
                        strokeWidth={isSelected ? 2.5 : 1}
                        className="hover:opacity-90 transition-opacity cursor-pointer"
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-1.5 pt-1 border-t border-slate-100 dark:border-slate-800 text-center">
            {displayScores.map((item, index) => {
              const grad = SUBJECT_GRADIENTS[index % SUBJECT_GRADIENTS.length];
              const isSelected = activeSubject?.subject === item.subject;
              return (
                <button
                  key={item.subject}
                  onClick={() => setActiveSubject(item)}
                  className={`p-2 rounded-xl transition-all duration-200 flex flex-col items-center cursor-pointer border active:scale-95 ${
                    isSelected
                      ? `${grad.badgeBg} border-2 border-emerald-500 shadow-sm scale-105`
                      : 'bg-slate-50/90 dark:bg-slate-900/90 border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full shadow-xs ring-1 ring-white dark:ring-slate-900" style={{ backgroundColor: grad.start }} />
                    <span className={`text-[11px] font-extrabold font-mono ${grad.badgeText}`}>{item.score}%</span>
                  </div>
                  <span className="text-[9px] font-semibold text-slate-700 dark:text-slate-300 truncate w-full mt-0.5">{item.subject}</span>
                </button>
              );
            })}
          </div>
        </>
      )}

      {activeSubject && (
        <div className="p-3.5 bg-gradient-to-r from-slate-900 to-slate-950 text-white rounded-2xl flex items-center justify-between border border-slate-700 shadow-md animate-fade-in">
          <div className="flex items-center space-x-2.5">
            <Award className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-white">{activeSubject.subject}</p>
              <p className="text-[10px] font-medium text-emerald-400">Score: {activeSubject.score}% • Status: {activeSubject.score >= 85 ? 'Excellent 🌟' : 'Good Progress 👍'}</p>
            </div>
          </div>
          <button onClick={() => setActiveSubject(null)} className="text-xs font-bold text-slate-400 hover:text-white cursor-pointer px-2 py-1 bg-slate-800 rounded-lg">
            Dismiss
          </button>
        </div>
      )}

      <CustomizePerformanceModal
        isOpen={showCustomizeModal}
        onClose={() => setShowCustomizeModal(false)}
      />
    </div>
  );
};
