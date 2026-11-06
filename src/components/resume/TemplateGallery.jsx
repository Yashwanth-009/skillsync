import React, { useState } from 'react';
import { Layout, Check, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useResumeStore } from '../../store/useResumeStore';

const TEMPLATES_CATALOG = [
  {
    id: 'multicolor',
    name: 'MultiColor',
    category: 'Modern',
    description: 'Clean modern layout with color accent highlights.',
    badge: 'Popular'
  },
  {
    id: 'visionary',
    name: 'Visionary',
    category: 'Photo Ready',
    description: 'Split sidebar layout designed for profile photos and quick scanning.',
    badge: 'Sidebar'
  },
  {
    id: 'artistic',
    name: 'Artistic',
    category: 'Classic',
    description: 'Elegant serif typography with centered header styling.',
    badge: 'Classic'
  },
  {
    id: 'vertex',
    name: 'Vertex',
    category: 'Modern',
    description: 'Structured two-column layout with visual timeline indicators.',
    badge: 'Timeline'
  }
];

export const TemplateGallery = ({ onSelectTemplate }) => {
  const selectedTemplate = useResumeStore((state) => state.selectedTemplate);
  const setSelectedTemplate = useResumeStore((state) => state.setSelectedTemplate);

  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Modern', 'Photo Ready', 'Classic'];

  const filteredTemplates = TEMPLATES_CATALOG.filter((tpl) => {
    if (activeCategory === 'All') return true;
    return tpl.category === activeCategory;
  });

  const handlePickTemplate = (id) => {
    setSelectedTemplate(id);
    if (onSelectTemplate) {
      onSelectTemplate(id);
    }
  };

  return (
    <div className="space-y-3">
      {/* Category Pills */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
          <Layout className="w-4 h-4 text-primary" />
          <span>Templates</span>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto text-xs no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-all shrink-0 cursor-pointer ${
                activeCategory === cat
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredTemplates.map((template) => {
          const isSelected = selectedTemplate === template.id;

          return (
            <div
              key={template.id}
              onClick={() => handlePickTemplate(template.id)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer bg-white dark:bg-slate-900 space-y-2 relative ${
                isSelected
                  ? 'border-primary ring-2 ring-primary/20 shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <span className="font-heading font-bold text-xs text-slate-900 dark:text-white">
                    {template.name}
                  </span>
                  <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-medium rounded">
                    {template.badge}
                  </span>
                </div>

                {isSelected ? (
                  <span className="px-2 py-0.5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center space-x-0.5">
                    <Check className="w-3 h-3 stroke-[3]" />
                    <span>Active</span>
                  </span>
                ) : (
                  <span className="text-[11px] text-primary font-medium hover:underline">
                    Select
                  </span>
                )}
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                {template.description}
              </p>

              {/* Simplified Minimal Layout Preview Representation */}
              <div className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1.5">
                {template.id === 'multicolor' && (
                  <div className="space-y-1">
                    <div className="h-1.5 w-1/3 bg-emerald-500 rounded" />
                    <div className="h-1 w-full bg-slate-200 dark:bg-slate-700 rounded" />
                    <div className="h-1 w-3/4 bg-slate-200 dark:bg-slate-700 rounded" />
                  </div>
                )}

                {template.id === 'visionary' && (
                  <div className="flex gap-1.5">
                    <div className="w-1/3 bg-slate-800 dark:bg-slate-950 rounded p-1 space-y-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 mx-auto" />
                      <div className="h-0.5 w-full bg-slate-700 rounded" />
                    </div>
                    <div className="w-2/3 space-y-1">
                      <div className="h-1 w-1/2 bg-slate-300 dark:bg-slate-600 rounded" />
                      <div className="h-1 w-full bg-slate-200 dark:bg-slate-700 rounded" />
                    </div>
                  </div>
                )}

                {template.id === 'artistic' && (
                  <div className="space-y-1 text-center">
                    <div className="h-1.5 w-1/2 bg-rose-400 mx-auto rounded" />
                    <div className="h-1 w-3/4 bg-slate-200 dark:bg-slate-700 mx-auto rounded" />
                  </div>
                )}

                {template.id === 'vertex' && (
                  <div className="flex gap-1.5">
                    <div className="w-1/3 bg-rose-100 dark:bg-rose-950/80 rounded p-1 space-y-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-400 mx-auto" />
                      <div className="h-0.5 w-full bg-rose-300 dark:bg-rose-800 rounded" />
                    </div>
                    <div className="w-2/3 space-y-1">
                      <div className="h-1 w-1/2 bg-slate-300 dark:bg-slate-600 rounded" />
                      <div className="h-1 w-full bg-slate-200 dark:bg-slate-700 rounded" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
