import React from 'react';
import { Sparkles, Compass, FileText, MessageCircle, BookOpen, User, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const OffersSection = ({ onNavigate }) => {
  const features = [
    {
      id: 'careerconnect',
      title: 'Career Connect Hub',
      description: 'Personalized career roadmap, capstones, skill gap analysis & placement readiness.',
      icon: Compass,
      color: 'from-emerald-600 to-teal-700',
      badge: 'Featured'
    },
    {
      id: 'resume',
      title: 'Resume Builder & AI ATS',
      description: 'Craft ATS-ready modern resumes & get instant AI keyword optimization feedback.',
      icon: FileText,
      color: 'from-indigo-500 to-purple-600',
      badge: 'Popular'
    },
    {
      id: 'timetable',
      title: 'Study Hub & Schedule',
      description: 'Weekly timetable, mock tests, rapid quizzes & academic performance visualization.',
      icon: BookOpen,
      color: 'from-amber-500 to-orange-600',
      badge: 'Essential'
    },
    {
      id: 'chat',
      title: 'Skillo AI Study Assistant',
      description: 'Step-by-step problem solver, code explainer, and 24/7 academic tutor.',
      icon: MessageCircle,
      color: 'from-teal-600 to-emerald-700',
      badge: 'AI Assistant'
    },
    {
      id: 'profile',
      title: 'Student Badges & Skills',
      description: 'Track academic milestones, manage certifications, and showcase skills.',
      icon: User,
      color: 'from-emerald-500 to-teal-600',
      badge: 'Gamified'
    }
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-accent" />
          <span>What SkillSync Offers</span>
        </h3>
      </div>

      <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-none">
        {features.map((item) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.id}
              whileTap={{ scale: 0.96 }}
              onClick={() => onNavigate(item.id)}
              className={`min-w-[220px] max-w-[240px] bg-gradient-to-br ${item.color} rounded-3xl p-4 text-white shadow-lg cursor-pointer flex flex-col justify-between relative overflow-hidden`}
            >
              <div className="absolute top-0 right-0 p-3 opacity-20">
                <Icon className="w-16 h-16" />
              </div>

              <div>
                <span className="inline-block px-2.5 py-0.5 bg-white/20 backdrop-blur-md text-[10px] font-bold rounded-full mb-3">
                  {item.badge}
                </span>
                <h4 className="font-heading font-bold text-sm text-white mb-1 leading-snug">
                  {item.title}
                </h4>
                <p className="text-[11px] text-white/80 line-clamp-2">
                  {item.description}
                </p>
              </div>

              <div className="mt-4 flex items-center text-[11px] font-bold text-white/90 space-x-1">
                <span>Explore Feature</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
