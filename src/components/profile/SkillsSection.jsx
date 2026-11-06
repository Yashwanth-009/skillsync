import React, { useState } from 'react';
import { Code, Plus, X } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useProfileStore } from '../../store/useProfileStore';

export const SkillsSection = () => {
  const user = useAuthStore((state) => state.user);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const isEditing = useProfileStore((state) => state.isEditing);

  const [newSkill, setNewSkill] = useState('');
  const skillsList = user.skills || [];

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    updateProfile({ skills: [...skillsList, newSkill.trim()] });
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    updateProfile({ skills: skillsList.filter((s) => s !== skillToRemove) });
  };

  return (
    <div className="bg-surface dark:bg-slate-800 rounded-3xl p-5 border border-slate-100 dark:border-slate-700 shadow-card space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-heading font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-1.5">
          <Code className="w-4 h-4 text-secondary" />
          <span>Skills & Endorsements ({skillsList.length})</span>
        </h3>
      </div>

      {isEditing && (
        <div className="flex space-x-2">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
            className="flex-1 p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
          />
          <button
            onClick={handleAddSkill}
            className="px-3 py-2 bg-primary text-white text-xs font-semibold rounded-xl"
          >
            Add
          </button>
        </div>
      )}

      {skillsList.length === 0 ? (
        <p className="text-xs text-slate-400 italic">No skills added yet. Click 'Edit Details' to add your top skills!</p>
      ) : (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {skillsList.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 text-xs font-semibold rounded-full border border-indigo-100 dark:border-indigo-800 flex items-center space-x-1.5"
            >
              <span>{skill}</span>
              {isEditing && (
                <button onClick={() => handleRemoveSkill(skill)} className="hover:text-rose-500">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
