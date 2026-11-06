import React, { useState } from 'react';
import { User, Code, Trophy } from 'lucide-react';
import { ProfileHero } from './ProfileHero';
import { PersonalDetailsCard } from './PersonalDetailsCard';
import { SkillsSection } from './SkillsSection';
import { CertificationsSection } from './CertificationsSection';
import { BadgesGrid } from './BadgesGrid';
import { SettingsAccordion } from './SettingsAccordion';

export const StudentProfile = ({ onLogout }) => {
  const [activeSubTab, setActiveSubTab] = useState('overview'); // 'overview' | 'skills' | 'settings'

  const subTabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'skills', label: 'Skills & Certs', icon: Code },
    { id: 'settings', label: 'Badges & Settings', icon: Trophy },
  ];

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto">
      {/* 1. Compact Student ID Passport Card */}
      <ProfileHero />

      {/* 2. Segmented Sub-Tab Switcher to Reduce Clutter */}
      <div className="bg-slate-200/80 dark:bg-slate-800/80 p-1 rounded-2xl flex items-center shadow-inner">
        {subTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex-1 py-2 rounded-xl font-heading font-semibold text-xs transition-all flex items-center justify-center space-x-1.5 ${
                isActive
                  ? 'bg-white dark:bg-slate-900 text-primary shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Render Selected Sub-Tab View */}
      {activeSubTab === 'overview' && (
        <div className="space-y-4 animate-fade-in">
          <PersonalDetailsCard />
        </div>
      )}

      {activeSubTab === 'skills' && (
        <div className="space-y-4 animate-fade-in">
          <SkillsSection />
          <CertificationsSection />
        </div>
      )}

      {activeSubTab === 'settings' && (
        <div className="space-y-4 animate-fade-in">
          <BadgesGrid />
          <SettingsAccordion onLogout={onLogout} />
        </div>
      )}
    </div>
  );
};

