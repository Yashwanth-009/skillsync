import React from 'react';
import { FileEdit, Sparkles } from 'lucide-react';
import { ResumeBuilderTab } from './ResumeBuilderTab';
import { ResumeAnalyserTab } from './ResumeAnalyserTab';
import { useResumeStore } from '../../store/useResumeStore';

export const ResumeBuilder = () => {
  const activeTab = useResumeStore((state) => state.activeTab);
  const setActiveTab = useResumeStore((state) => state.setActiveTab);

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto">
      {/* Top Segmented Tab Switcher */}
      <div className="bg-slate-200/80 dark:bg-slate-800/80 p-1 rounded-2xl flex items-center shadow-inner">
        <button
          onClick={() => setActiveTab('build')}
          className={`flex-1 py-2.5 rounded-xl font-heading font-semibold text-xs transition-all flex items-center justify-center space-x-1.5 ${
            activeTab === 'build'
              ? 'bg-white dark:bg-slate-900 text-primary shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <FileEdit className="w-4 h-4" />
          <span>Build Resume</span>
        </button>

        <button
          onClick={() => setActiveTab('analyse')}
          className={`flex-1 py-2.5 rounded-xl font-heading font-semibold text-xs transition-all flex items-center justify-center space-x-1.5 ${
            activeTab === 'analyse'
              ? 'bg-white dark:bg-slate-900 text-primary shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4 text-accent" />
          <span>Analyse Resume</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'build' ? <ResumeBuilderTab /> : <ResumeAnalyserTab />}
    </div>
  );
};
