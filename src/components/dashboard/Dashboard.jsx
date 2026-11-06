import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { CommandCenterHeader } from './CommandCenterHeader';
import { WeeklyProgressRing } from './WeeklyProgressRing';
import { TodaysGoals } from './TodaysGoals';
import { SubjectPerformanceChart } from './SubjectPerformanceChart';
import { RemindersSection } from './RemindersSection';
import { AddReminderModal } from './AddReminderModal';
import { StudyStreakCard } from './StudyStreakCard';
import { OffersSection } from './OffersSection';
import { QuickAccessButtons } from './QuickAccessButtons';

export const Dashboard = ({ onNavigate }) => {
  const [showAddReminderModal, setShowAddReminderModal] = useState(false);

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto relative pb-20">
      {/* 1. Command Center Top Header */}
      <CommandCenterHeader />

      {/* 2. "Your Progress This Week" Live Animation Ring */}
      <WeeklyProgressRing />

      {/* 3. Today's Academic Goals (Interactive Checkboxes + Progress Bar) */}
      <TodaysGoals />

      {/* 4. Subject-Wise Performance Chart (with Customize Performance Modal) */}
      <SubjectPerformanceChart />

      {/* 5. Smart Reminders Section */}
      <RemindersSection onOpenAddModal={() => setShowAddReminderModal(true)} />

      {/* 5. Study Streak & Achievements Highlight */}
      <StudyStreakCard />

      {/* 6. Feature Shortcuts & What SkillSync Offers */}
      <QuickAccessButtons onNavigate={onNavigate} />
      <OffersSection onNavigate={onNavigate} />

      {/* Floating Action Button (+ Add Reminder) */}
      <button
        onClick={() => setShowAddReminderModal(true)}
        className="fixed bottom-[180px] sm:bottom-[160px] right-4 z-30 w-12 h-12 bg-gradient-to-tr from-emerald-500 to-teal-600 text-white rounded-full shadow-lg shadow-emerald-500/20 flex items-center justify-center hover:scale-105 active:scale-95 transition-all border border-white/20"
        title="Add Reminder"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Add Reminder Modal */}
      <AddReminderModal
        isOpen={showAddReminderModal}
        onClose={() => setShowAddReminderModal(false)}
      />
    </div>
  );
};
