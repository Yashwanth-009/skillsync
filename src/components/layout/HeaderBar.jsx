import React, { useState } from 'react';
import { Bell, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useDashboardStore } from '../../store/useDashboardStore';
import { NotificationModal } from './NotificationModal';

export const HeaderBar = ({ title, subtitle, onAvatarClick, currentScreen = 'home', onBack }) => {
  const user = useAuthStore((state) => state.user);
  const notifications = useDashboardStore((state) => state.notifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const [showNotifications, setShowNotifications] = useState(false);
  const avatarUrl = user?.avatar || 'https://api.dicebear.com/7.x/open-peeps/svg?seed=Student';

  const showBackButton = currentScreen !== 'home' && onBack;

  return (
    <>
      <header className="sticky top-0 z-30 bg-surface/90 dark:bg-slate-900/90 backdrop-blur-xl px-4 py-3 border-b border-emerald-100/80 dark:border-emerald-900/40 flex items-center justify-between shadow-card transition-all duration-200">
        <div className="flex items-center space-x-2.5 min-w-0">
          {showBackButton ? (
            <button
              type="button"
              onClick={onBack}
              className="p-2 -ml-1 rounded-xl text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white hover:bg-emerald-100/60 dark:hover:bg-slate-800 transition-all active:scale-95 cursor-pointer shrink-0 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs"
              title="Back to previous screen"
              aria-label="Back to previous screen"
            >
              <ArrowLeft className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </button>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-700 p-0.5 shadow-sm hover:scale-105 transition-transform cursor-pointer shrink-0">
              <img
                src="/logo.svg"
                alt="SkillSync"
                className="w-full h-full object-cover rounded-[10px]"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/duck-logo.svg';
                }}
              />
            </div>
          )}

          <div className="min-w-0">
            <h1 className="font-heading font-extrabold text-base text-slate-900 dark:text-white leading-tight tracking-tight truncate">
              {title || `Good Morning, ${user.name ? user.name.split(' ')[0] : 'Student'} 👋`}
            </h1>
            <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300/90 truncate">
              {subtitle || [user.course, user.institution].filter(Boolean).join(' • ') || 'Student Workspace'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          {/* Notification Bell */}
          <button
            onClick={() => setShowNotifications(true)}
            className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-200 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/50 transition-all duration-200 active:scale-95 cursor-pointer"
            aria-label="View Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-error rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse" />
            )}
          </button>

          {/* Profile Avatar */}
          <button
            onClick={onAvatarClick}
            className="w-9 h-9 rounded-full ring-2 ring-primary/60 hover:ring-primary overflow-hidden hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer shadow-xs bg-emerald-900/40"
            aria-label="View Profile"
          >
            <img
              src={avatarUrl}
              alt={user.name || 'Student Avatar'}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://api.dicebear.com/7.x/open-peeps/svg?seed=Student';
              }}
            />
          </button>
        </div>
      </header>

      <NotificationModal isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
    </>
  );
};
