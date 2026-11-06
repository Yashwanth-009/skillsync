import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FolderGit2,
  Award,
  CheckCircle2,
  Clock,
  CircleDot,
  ExternalLink,
  Code,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useCareerGuideStore } from '../../store/useCareerGuideStore';

export const ProjectsAndCertsView = () => {
  const careerGoal = useCareerGuideStore((state) => state.careerGoal);
  const careerProfiles = useCareerGuideStore((state) => state.careerProfiles);
  const getActiveProfile = useCareerGuideStore((state) => state.getActiveProfile);
  const setProjectStatus = useCareerGuideStore((state) => state.setProjectStatus);

  const cleanGoal = careerGoal?.trim() || '';
  const profile = (cleanGoal && careerProfiles[cleanGoal]) || getActiveProfile();
  const projects = profile?.projects || [];
  const certs = profile?.certifications || [];

  const [activeSubTab, setActiveSubTab] = useState('projects'); // 'projects' | 'certs'

  if (!profile) {
    return (
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-3">
        <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center font-bold text-lg">
          🎯
        </div>
        <h4 className="font-heading font-extrabold text-sm text-slate-900 dark:text-white">
          Career Goal Not Set Yet
        </h4>
        <p className="text-xs text-slate-500 max-w-xs mx-auto">
          Please choose your target career role in the Roadmap tab to view recommended portfolio projects and certifications.
        </p>
      </div>
    );
  }

  const getLevelBadge = (level) => {
    switch (level) {
      case 'Beginner':
        return { color: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-300', dot: 'bg-emerald-500' };
      case 'Intermediate':
        return { color: 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-300', dot: 'bg-amber-500' };
      case 'Advanced':
      default:
        return { color: 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-300', dot: 'bg-rose-500' };
    }
  };

  return (
    <div className="space-y-4">
      {/* Sub-Switch: Projects vs Certifications */}
      <div className="bg-slate-200/80 dark:bg-slate-800/80 p-1 rounded-2xl flex items-center shadow-inner">
        <button
          onClick={() => setActiveSubTab('projects')}
          className={`flex-1 py-2 rounded-xl font-heading font-semibold text-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
            activeSubTab === 'projects'
              ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <FolderGit2 className="w-3.5 h-3.5" />
          <span>Recommended Projects ({projects.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('certs')}
          className={`flex-1 py-2 rounded-xl font-heading font-semibold text-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
            activeSubTab === 'certs'
              ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Certifications ({certs.length})</span>
        </button>
      </div>

      {/* Projects List */}
      {activeSubTab === 'projects' && (
        <div className="space-y-3.5">
          <div className="flex items-center justify-between px-1">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Ship 3 multi-tier projects to build an impressive portfolio.
            </p>
          </div>

          {projects.map((proj) => {
            const badge = getLevelBadge(proj.level);

            return (
              <div
                key={proj.id}
                className="bg-white dark:bg-slate-900/90 rounded-3xl p-5 border border-emerald-100/90 dark:border-emerald-900/40 shadow-card hover:shadow-card-hover transition-all duration-200 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border flex items-center space-x-1.5 ${badge.color}`}>
                      <span className={`w-2 h-2 rounded-full ${badge.dot}`} />
                      <span>{proj.level} Project</span>
                    </span>
                  </div>

                  {/* Status Dropdown / Toggles */}
                  <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700">
                    {[
                      { id: 'not_started', label: 'Todo', icon: CircleDot },
                      { id: 'in_progress', label: 'Active', icon: Clock },
                      { id: 'completed', label: 'Done', icon: CheckCircle2 }
                    ].map((st) => {
                      const isCurrent = proj.status === st.id;
                      const Icon = st.icon;
                      return (
                        <button
                          key={st.id}
                          onClick={() => setProjectStatus(careerGoal, proj.id, st.id)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center space-x-1 cursor-pointer ${
                            isCurrent
                              ? 'bg-emerald-500 text-white shadow-2xs'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          <Icon className="w-3 h-3" />
                          <span>{st.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h4 className="font-heading font-extrabold text-sm text-slate-900 dark:text-white">
                    {proj.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    {proj.description}
                  </p>
                </div>

                {/* Tech Stack Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {proj.skills.map((sk) => (
                    <span
                      key={sk}
                      className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold rounded-lg flex items-center space-x-1"
                    >
                      <Code className="w-2.5 h-2.5 text-emerald-500" />
                      <span>{sk}</span>
                    </span>
                  ))}
                </div>

                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
                  <span className="font-bold text-slate-800 dark:text-slate-200">Portfolio Value: </span>
                  {proj.outcome}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Certifications List */}
      {activeSubTab === 'certs' && (
        <div className="space-y-3.5">
          <div className="flex items-center justify-between px-1">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Curated industry certificates to substantiate resume claims.
            </p>
          </div>

          {certs.map((cert) => {
            const priorityStyle =
              cert.priority === 'Required'
                ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-200'
                : cert.priority === 'Recommended'
                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200';

            return (
              <div
                key={cert.id}
                className="bg-white dark:bg-slate-900/90 rounded-3xl p-5 border border-emerald-100/90 dark:border-emerald-900/40 shadow-card space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{cert.provider}</span>
                  </span>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${priorityStyle}`}>
                    {cert.priority}
                  </span>
                </div>

                <h4 className="font-heading font-extrabold text-sm text-slate-900 dark:text-white">
                  {cert.title}
                </h4>

                <div className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 leading-relaxed">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Why recommended: </span>
                  {cert.whyRecommended}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
