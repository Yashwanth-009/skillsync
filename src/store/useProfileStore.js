import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialBadges = [
  {
    id: 'badge-1',
    title: 'First Resume Built',
    description: 'Created and saved your first resume draft in SkillSync.',
    icon: '🏅',
    unlocked: false,
    progress: 0
  },
  {
    id: 'badge-2',
    title: 'Goal Achiever',
    description: 'Completed your first 5 daily study goals.',
    icon: '🎯',
    unlocked: false,
    progress: 0
  },
  {
    id: 'badge-3',
    title: 'Timetable Pro',
    description: 'Added 5 or more classes to your weekly timetable.',
    icon: '📅',
    unlocked: false,
    progress: 0
  },
  {
    id: 'badge-4',
    title: 'Vision Solver',
    description: 'Captured and solved a textbook problem using camera/image upload.',
    icon: '📸',
    unlocked: false,
    progress: 0
  },
  {
    id: 'badge-5',
    title: 'Master Scholar',
    description: 'Completed 20 reminders & maintained 90%+ attendance.',
    icon: '🎓',
    unlocked: false,
    progress: 0
  }
];

export const useProfileStore = create(
  persist(
    (set, get) => ({
      isEditing: false,
      certificates: [],
      badges: initialBadges,

      toggleEditMode: () => set((state) => ({ isEditing: !state.isEditing })),
      setEditMode: (editing) => set({ isEditing: editing }),

      addCertificate: (cert) => {
        const newCert = {
          id: `cert-${Date.now()}`,
          imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=300&auto=format&fit=crop&q=80',
          ...cert
        };
        set((state) => ({
          certificates: [newCert, ...state.certificates]
        }));
      },

      deleteCertificate: (id) => {
        set((state) => ({
          certificates: state.certificates.filter((c) => c.id !== id)
        }));
      },

      unlockBadge: (badgeId) => {
        set((state) => ({
          badges: state.badges.map((b) =>
            b.id === badgeId
              ? { ...b, unlocked: true, progress: 100, unlockedAt: 'Just now' }
              : b
          )
        }));
      }
    }),
    {
      name: 'SkillSync_profile_storage',
      version: 1,
      migrate: (persistedState, version) => {
        if (version === 0) {
          if (persistedState.badges) {
            persistedState.badges = persistedState.badges.map((b) => {
              const initBadge = initialBadges.find((ib) => ib.id === b.id);
              if (initBadge) {
                return { ...b, icon: initBadge.icon };
              }
              return b;
            });
          }
        }
        return persistedState;
      }
    }
  )
);
