import { create } from 'zustand';

export const useToastStore = create((set) => ({
  toasts: [],

  addToast: (message, type = 'success', duration = 3000) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast = { id, message, type };

    set((state) => ({
      toasts: [newToast, ...state.toasts].slice(0, 3)
    }));

    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id)
        }));
      }, duration);
    }
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id)
    }));
  }
}));
