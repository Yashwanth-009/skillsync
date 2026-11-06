import React, { useState } from 'react';
import { Camera, Edit3, Check, GraduationCap, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useProfileStore } from '../../store/useProfileStore';
import { useCareerGuideStore } from '../../store/useCareerGuideStore';
import { AvatarSelectorModal } from './AvatarSelectorModal';

export const ProfileHero = () => {
  const user = useAuthStore((state) => state.user);
  const isEditing = useProfileStore((state) => state.isEditing);
  const toggleEditMode = useProfileStore((state) => state.toggleEditMode);
  const careerGoal = useCareerGuideStore((state) => state.careerGoal);
  const getRoadmapStats = useCareerGuideStore((state) => state.getRoadmapStats);

  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const stats = getRoadmapStats();
  const avatarUrl = user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka&backgroundColor=06b6d4';

  return (
    <>
      <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white rounded-3xl p-5 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <GraduationCap className="w-40 h-40" />
        </div>

        <div className="flex items-center space-x-4 relative z-10">
          <div className="flex flex-col items-center shrink-0">
            {/* Tappable Avatar with Glowing Selection Ring */}
            <button
              onClick={() => setShowAvatarModal(true)}
              className="relative w-20 h-20 group cursor-pointer active:scale-95 transition-transform"
              title="Change Profile Photo"
            >
              <img
                src={avatarUrl}
                alt={user.name || 'Student Avatar'}
                className="w-full h-full object-cover rounded-2xl ring-4 ring-white/40 group-hover:ring-emerald-300 shadow-md bg-emerald-900/40 transition-all"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka&backgroundColor=06b6d4';
                }}
              />
              <div className="absolute -bottom-1 -right-1 p-1.5 bg-white text-emerald-700 rounded-full shadow-md z-20 group-hover:scale-110 transition-transform">
                <Camera className="w-3.5 h-3.5" />
              </div>
            </button>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-1.5">
              <span className="px-2 py-0.5 bg-white/20 backdrop-blur-md text-[10px] font-extrabold rounded-full text-emerald-100 flex items-center space-x-1">
                <ShieldCheck className="w-3 h-3 text-emerald-300" />
                <span>Verified Student ID</span>
              </span>
            </div>

            <h2 className="font-heading font-extrabold text-lg text-white truncate mt-1">
              {user.name || 'Student Profile'}
            </h2>
            {user.course && (
              <p className="text-xs text-emerald-100 font-medium truncate">
                {user.course}
              </p>
            )}
            {(user.institution || user.academicYear) && (
              <p className="text-[11px] text-emerald-200/80 truncate">
                {[user.institution, user.academicYear].filter(Boolean).join(' • ')}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between relative z-10">
          <button
            onClick={() => setShowAvatarModal(true)}
            className="text-[10px] text-emerald-200 font-bold tracking-wide hover:underline flex items-center space-x-1 cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-emerald-300" />
            <span>Change Avatar</span>
          </button>

          <button
            onClick={toggleEditMode}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all flex items-center space-x-1 shadow-sm active:scale-95 cursor-pointer ${
              isEditing
                ? 'bg-amber-400 text-slate-900 font-bold'
                : 'bg-white/20 backdrop-blur-md text-white hover:bg-white/30'
            }`}
          >
            {isEditing ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Done Editing</span>
              </>
            ) : (
              <>
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Details</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 16 Avatar Selector Modal */}
      <AvatarSelectorModal
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
      />
    </>
  );
};
