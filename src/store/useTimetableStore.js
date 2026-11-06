import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useTimetableStore = create(
  persist(
    (set, get) => ({
      activeTab: 'timetable',
      studyHubSubTab: 'hub', // 'hub' | 'timetable' | 'mocktests' | 'quizzes' | 'visualization'
      currentUserKey: '',
      classesByAccount: {},
      calendarNotesByAccount: {},
      classes: [],
      calendarNotes: [],
      hasUnsavedChanges: false,

      setActiveTab: (tab) => set({ activeTab: tab }),
      setStudyHubSubTab: (tab) => set({ studyHubSubTab: tab }),

      // User account isolation
      setUser: (userId, userEmail) => {
        const key = (userEmail || userId || '').trim().toLowerCase();
        if (!key) return;

        const currentByAccountClasses = get().classesByAccount || {};
        const currentByAccountNotes = get().calendarNotesByAccount || {};

        const userClasses = currentByAccountClasses[key] || get().classes || [];
        const userNotes = currentByAccountNotes[key] || get().calendarNotes || [];

        set({
          currentUserKey: key,
          classes: userClasses,
          calendarNotes: userNotes,
          classesByAccount: {
            ...currentByAccountClasses,
            [key]: userClasses
          },
          calendarNotesByAccount: {
            ...currentByAccountNotes,
            [key]: userNotes
          }
        });
      },

      resetTimetable: () => {
        set({
          currentUserKey: '',
          classes: [],
          calendarNotes: [],
          hasUnsavedChanges: false
        });
      },

      addClass: (cls) => {
        const newClass = {
          id: `cls-${Date.now()}`,
          duration: 1,
          color: '#10B981',
          ...cls
        };
        set((state) => {
          const updatedClasses = [...state.classes, newClass];
          const key = state.currentUserKey;
          return {
            hasUnsavedChanges: true,
            classes: updatedClasses,
            classesByAccount: key
              ? { ...state.classesByAccount, [key]: updatedClasses }
              : state.classesByAccount
          };
        });
      },

      updateClass: (id, updatedFields) => {
        set((state) => {
          const updatedClasses = state.classes.map((c) => (c.id === id ? { ...c, ...updatedFields } : c));
          const key = state.currentUserKey;
          return {
            hasUnsavedChanges: true,
            classes: updatedClasses,
            classesByAccount: key
              ? { ...state.classesByAccount, [key]: updatedClasses }
              : state.classesByAccount
          };
        });
      },

      deleteClass: (id) => {
        set((state) => {
          const updatedClasses = state.classes.filter((c) => c.id !== id);
          const key = state.currentUserKey;
          return {
            hasUnsavedChanges: true,
            classes: updatedClasses,
            classesByAccount: key
              ? { ...state.classesByAccount, [key]: updatedClasses }
              : state.classesByAccount
          };
        });
      },

      saveTimetableChanges: () => {
        set({ hasUnsavedChanges: false });
        return true;
      },

      addOrUpdateCalendarNote: (date, title, content) => {
        set((state) => {
          const existingIndex = state.calendarNotes.findIndex((n) => n.date === date);
          let updatedNotes;
          if (existingIndex >= 0) {
            updatedNotes = [...state.calendarNotes];
            updatedNotes[existingIndex] = { ...updatedNotes[existingIndex], title, content };
          } else {
            updatedNotes = [
              ...state.calendarNotes,
              { id: `note-${Date.now()}`, date, title, content }
            ];
          }
          const key = state.currentUserKey;
          return {
            calendarNotes: updatedNotes,
            calendarNotesByAccount: key
              ? { ...state.calendarNotesByAccount, [key]: updatedNotes }
              : state.calendarNotesByAccount
          };
        });
      },

      deleteCalendarNote: (date) => {
        set((state) => {
          const updatedNotes = state.calendarNotes.filter((n) => n.date !== date);
          const key = state.currentUserKey;
          return {
            calendarNotes: updatedNotes,
            calendarNotesByAccount: key
              ? { ...state.calendarNotesByAccount, [key]: updatedNotes }
              : state.calendarNotesByAccount
          };
        });
      }
    }),
    {
      name: 'SkillSync_timetable_storage_v2'
    }
  )
);
