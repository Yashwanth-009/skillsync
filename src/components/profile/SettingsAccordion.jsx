import React, { useState } from 'react';
import { Settings, Moon, Sun, Bell, Lock, LogOut, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export const SettingsAccordion = ({ onLogout }) => {
  const user = useAuthStore((state) => state.user);
  const toggleDarkMode = useAuthStore((state) => state.toggleDarkMode);
  const updateProfile = useAuthStore((state) => state.updateProfile);

  const [isOpen, setIsOpen] = useState(false);

  const handleDeleteAccount = () => {
    if (window.confirm('CAUTION: Are you sure you want to permanently delete your SkillSync student account? All data will be deleted.')) {
      onLogout();
    }
  };

  return (
    <div className="bg-surface dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-card overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-5 flex items-center justify-between font-heading font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider"
      >
        <div className="flex items-center space-x-2">
          <Settings className="w-4 h-4 text-primary" />
          <span>App Preferences & Account Settings</span>
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {isOpen && (
        <div className="p-5 pt-0 space-y-4 border-t border-slate-100 dark:border-slate-700/60">
          {/* Dark Mode Switch */}
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center space-x-2">
              {user.darkMode ? <Moon className="w-4 h-4 text-accent" /> : <Sun className="w-4 h-4 text-amber-500" />}
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Dark Theme Mode</span>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`w-11 h-6 rounded-full transition-colors p-0.5 relative ${
                user.darkMode ? 'bg-primary' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  user.darkMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Notifications Toggle */}
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center space-x-2">
              <Bell className="w-4 h-4 text-secondary" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Push Notifications</span>
            </div>
            <button
              onClick={() => updateProfile({ notificationsEnabled: !user.notificationsEnabled })}
              className={`w-11 h-6 rounded-full transition-colors p-0.5 relative ${
                user.notificationsEnabled ? 'bg-emerald-500' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  user.notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Change Password */}
          <button
            onClick={() => alert('Password reset email sent to your address!')}
            className="w-full text-left py-2 text-xs font-semibold text-primary hover:underline flex items-center space-x-2"
          >
            <Lock className="w-4 h-4" />
            <span>Change Account Password</span>
          </button>

          {/* Log Out */}
          <button
            onClick={onLogout}
            className="w-full py-2.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-semibold text-xs rounded-xl flex items-center justify-center space-x-1.5 hover:bg-rose-100"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out of SkillSync</span>
          </button>

          {/* Delete Account */}
          <button
            onClick={handleDeleteAccount}
            className="w-full text-center text-[11px] font-medium text-rose-400 hover:text-rose-600 hover:underline pt-2"
          >
            Delete Account Permanently
          </button>
        </div>
      )}
    </div>
  );
};
