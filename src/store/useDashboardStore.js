import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useToastStore } from './useToastStore';

export const useDashboardStore = create(
  persist(
    (set, get) => ({
      currentUserKey: '',
      userDataByAccount: {},
      reminders: [],
      goals: [],
      subjectScores: [],
      activities: [],
      notifications: [
        {
          id: 'n-welcome',
          title: 'Welcome to SkillSync! 🎓',
          message: 'Your student management workspace is ready. Start by setting your daily goals or checking your weekly timetable!',
          time: 'Just now',
          read: false
        }
      ],
      streakCount: 0,
      lastLoginDate: null,
      cgpa: '0.00',
      attendance: 100,
      weeklyGoalPercentage: 0,

      // User account isolation
      setUser: (userId, userEmail) => {
        const key = (userEmail || userId || '').trim().toLowerCase();
        if (!key) return;

        const byAccount = get().userDataByAccount || {};
        const saved = byAccount[key] || {};

        set({
          currentUserKey: key,
          reminders: saved.reminders || [],
          goals: saved.goals || [],
          subjectScores: saved.subjectScores || [],
          activities: saved.activities || [],
          streakCount: saved.streakCount || 0,
          lastLoginDate: saved.lastLoginDate || null,
          cgpa: saved.cgpa || '0.00',
          attendance: saved.attendance !== undefined ? saved.attendance : 100,
          weeklyGoalPercentage: saved.weeklyGoalPercentage || 0,
          userDataByAccount: {
            ...byAccount,
            [key]: {
              reminders: saved.reminders || [],
              goals: saved.goals || [],
              subjectScores: saved.subjectScores || [],
              activities: saved.activities || [],
              streakCount: saved.streakCount || 0,
              lastLoginDate: saved.lastLoginDate || null,
              cgpa: saved.cgpa || '0.00',
              attendance: saved.attendance !== undefined ? saved.attendance : 100,
              weeklyGoalPercentage: saved.weeklyGoalPercentage || 0
            }
          }
        });
      },

      resetDashboard: () => {
        set({
          currentUserKey: '',
          reminders: [],
          goals: [],
          subjectScores: [],
          activities: [],
          streakCount: 0,
          lastLoginDate: null,
          cgpa: '0.00',
          attendance: 100,
          weeklyGoalPercentage: 0
        });
      },

      _persistCurrentUserData: () => {
        const key = get().currentUserKey;
        if (!key) return;
        set((state) => ({
          userDataByAccount: {
            ...state.userDataByAccount,
            [key]: {
              reminders: state.reminders,
              goals: state.goals,
              subjectScores: state.subjectScores,
              activities: state.activities,
              streakCount: state.streakCount,
              lastLoginDate: state.lastLoginDate,
              cgpa: state.cgpa,
              attendance: state.attendance,
              weeklyGoalPercentage: state.weeklyGoalPercentage
            }
          }
        }));
      },

      checkAndUpdateStreak: () => {
        set((state) => {
          const today = new Date().toDateString();
          if (state.lastLoginDate === today) return {};

          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);

          let newStreak = state.streakCount;
          if (state.lastLoginDate === yesterday.toDateString()) {
            newStreak += 1;
          } else {
            newStreak = 1;
          }

          return {
            streakCount: newStreak,
            lastLoginDate: today
          };
        });
        get()._persistCurrentUserData();
      },

      updateSubjectScores: (newScores) => {
        set({ subjectScores: newScores });
        get()._persistCurrentUserData();
      },

      updatePerformanceStanding: (attendance, cgpa) => {
        set({ attendance, cgpa });
        get()._persistCurrentUserData();
      },

      addGoal: (title) => {
        if (!title.trim()) return;
        const newGoal = { id: `g-${Date.now()}`, title: title.trim(), completed: false };
        set((state) => {
          const updatedGoals = [...state.goals, newGoal];
          const completedCount = updatedGoals.filter((g) => g.completed).length;
          const percentage = Math.round((completedCount / updatedGoals.length) * 100);
          return {
            goals: updatedGoals,
            weeklyGoalPercentage: percentage
          };
        });
        get()._persistCurrentUserData();
        useToastStore.getState().addToast('Goal Created!', 'success');
      },

      toggleGoal: (id) => {
        set((state) => {
          let newlyCompleted = false;
          const updatedGoals = state.goals.map((g) => {
            if (g.id === id) {
              if (!g.completed) newlyCompleted = true;
              return { ...g, completed: !g.completed };
            }
            return g;
          });
          const completedCount = updatedGoals.filter((g) => g.completed).length;
          const percentage = updatedGoals.length > 0 ? Math.round((completedCount / updatedGoals.length) * 100) : 0;

          if (newlyCompleted) {
            useToastStore.getState().addToast('Goal Completed! 🎉', 'success');
          }

          return {
            goals: updatedGoals,
            weeklyGoalPercentage: percentage
          };
        });
        get()._persistCurrentUserData();
      },

      deleteGoal: (id) => {
        set((state) => {
          const updatedGoals = state.goals.filter((g) => g.id !== id);
          const completedCount = updatedGoals.filter((g) => g.completed).length;
          const percentage = updatedGoals.length > 0 ? Math.round((completedCount / updatedGoals.length) * 100) : 0;
          return {
            goals: updatedGoals,
            weeklyGoalPercentage: percentage
          };
        });
        get()._persistCurrentUserData();
      },

      addReminder: (newReminder) => {
        const item = {
          id: `rem-${Date.now()}`,
          completed: false,
          ...newReminder
        };
        set((state) => ({
          reminders: [item, ...state.reminders]
        }));
        get()._persistCurrentUserData();
        useToastStore.getState().addToast('Class Reminder Added!', 'success');
      },

      toggleReminderCompleted: (id) => {
        set((state) => ({
          reminders: state.reminders.map((r) =>
            r.id === id ? { ...r, completed: !r.completed } : r
          )
        }));
        get()._persistCurrentUserData();
      },

      deleteReminder: (id) => {
        set((state) => ({
          reminders: state.reminders.filter((r) => r.id !== id)
        }));
        get()._persistCurrentUserData();
      },

      markNotificationsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true }))
        }));
      }
    }),
    {
      name: 'SkillSync_dashboard_storage_v3'
    }
  )
);
