import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Sparkles, Upload } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useToastStore } from '../../store/useToastStore';

export const AVATAR_PRESETS = [
  { id: 'av-1', name: 'Student 1', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka&backgroundColor=06b6d4' },
  { id: 'av-2', name: 'Student 2', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=84cc16' },
  { id: 'av-3', name: 'Student 3', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chester&backgroundColor=eab308' },
  { id: 'av-4', name: 'Student 4', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya&backgroundColor=f43f5e' },
  { id: 'av-5', name: 'Student 5', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack&backgroundColor=ec4899' },
  { id: 'av-6', name: 'Student 6', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe&backgroundColor=06b6d4' },
  { id: 'av-7', name: 'Student 7', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nala&backgroundColor=10b981' },
  { id: 'av-8', name: 'Student 8', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Leo&backgroundColor=f59e0b' },
  { id: 'av-9', name: 'Student 9', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam&backgroundColor=8b5cf6' },
  { id: 'av-10', name: 'Student 10', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mia&backgroundColor=06b6d4' },
  { id: 'av-11', name: 'Student 11', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver&backgroundColor=eab308' },
  { id: 'av-12', name: 'Student 12', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chloe&backgroundColor=a855f7' },
  { id: 'av-13', name: 'Student 13', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alexander&backgroundColor=f59e0b' },
  { id: 'av-14', name: 'Student 14', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas&backgroundColor=f43f5e' },
  { id: 'av-15', name: 'Student 15', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia&backgroundColor=14b8a6' },
  { id: 'av-16', name: 'Student 16', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma&backgroundColor=84cc16' }
];

export const AvatarSelectorModal = ({ isOpen, onClose }) => {
  const user = useAuthStore((state) => state.user);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleSelectPreset = (presetUrl) => {
    updateProfile({ avatar: presetUrl });
    useToastStore.getState().addToast('Profile Photo Updated! 🎨', 'success');
    onClose();
  };

  const handleCustomUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProfile({ avatar: reader.result });
        useToastStore.getState().addToast('Custom Photo Uploaded! 📸', 'success');
        onClose();
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-end sm:items-center justify-center p-2 sm:p-4">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-emerald-100 dark:border-emerald-900/50 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="font-heading font-extrabold text-sm text-white">
                  Choose Profile Photo
                </h3>
                <p className="text-[10px] text-emerald-300 font-medium">Select a default vector avatar or upload your own</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 4x4 Grid of 16 Preset Avatars */}
          <div className="p-4 overflow-y-auto space-y-4">
            <div className="grid grid-cols-4 gap-3">
              {AVATAR_PRESETS.map((preset) => {
                const isSelected = user.avatar === preset.url;
                return (
                  <motion.button
                    key={preset.id}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => handleSelectPreset(preset.url)}
                    className={`relative w-full aspect-square rounded-2xl overflow-hidden transition-all duration-200 cursor-pointer shadow-md flex items-center justify-center ${
                      isSelected
                        ? 'ring-4 ring-emerald-400 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 scale-105 shadow-glow shadow-emerald-500/40 z-10'
                        : 'hover:ring-2 hover:ring-emerald-300/80 hover:scale-102 opacity-90 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.name}
                      className="w-full h-full object-cover rounded-2xl bg-slate-100 dark:bg-slate-800"
                    />

                    {isSelected && (
                      <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                        <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
                          <Check className="w-4 h-4" />
                        </span>
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Custom Photo Upload Section (Mobile Accessible Overlay & Ref Trigger) */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 relative">
              <button
                type="button"
                onClick={triggerFileInput}
                className="w-full py-3 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200 text-xs font-bold rounded-2xl border border-emerald-200 dark:border-emerald-800 flex items-center justify-center space-x-2 cursor-pointer transition-all active:scale-95 shadow-sm relative overflow-hidden"
              >
                <Upload className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Upload Custom Photo from Device</span>

                {/* Touch-accessible invisible input overlay for mobile browsers */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,image/heic,image/heif"
                  onChange={handleCustomUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
