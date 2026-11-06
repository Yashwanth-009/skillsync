import React, { useRef, useState } from 'react';
import {
  Eye,
  Save,
  Check,
  Copy,
  Edit3,
  Trash2,
  Plus,
  FileText
} from 'lucide-react';
import { TemplateGallery } from './TemplateGallery';
import { SectionAccordion } from './SectionAccordion';
import { ResumePreviewModal } from './ResumePreviewModal';
import { useResumeStore } from '../../store/useResumeStore';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export const ResumeBuilderTab = () => {
  const resumes = useResumeStore((state) => state.resumes);
  const activeResumeId = useResumeStore((state) => state.activeResumeId);
  const resumeData = useResumeStore((state) => state.resumeData);
  const switchResume = useResumeStore((state) => state.switchResume);
  const createNewResume = useResumeStore((state) => state.createNewResume);
  const duplicateResume = useResumeStore((state) => state.duplicateResume);
  const renameResume = useResumeStore((state) => state.renameResume);
  const deleteResume = useResumeStore((state) => state.deleteResume);
  const hasUnsavedChanges = useResumeStore((state) => state.hasUnsavedChanges);
  const saveDraft = useResumeStore((state) => state.saveDraft);

  const [showPreview, setShowPreview] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameInput, setRenameInput] = useState('');

  const templateCatalogRef = useRef(null);

  const handleSave = () => {
    saveDraft();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleNavigateToTemplates = () => {
    if (templateCatalogRef.current) {
      templateCatalogRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleStartRename = () => {
    setRenameInput(resumeData.name || 'Resume 1');
    setIsRenaming(true);
  };

  const handleConfirmRename = () => {
    renameResume(activeResumeId, renameInput);
    setIsRenaming(false);
  };

  return (
    <div className="space-y-5 pb-16">
      {/* Header & Resume Selector Card */}
      <Card variant="surface" className="p-4 sm:p-5 border shadow-sm space-y-4">
        {/* Title and Subtitle */}
        <div className="space-y-1">
          <h3 className="font-heading font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
            Resume Builder
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Create, edit, and organize your resume versions.
          </p>
        </div>

        {/* 1. Select Resume Dropdown Element */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
            Select Resume
          </label>
          <select
            value={activeResumeId}
            onChange={(e) => switchResume(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
          >
            {resumes.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} ({r.template || 'MultiColor'})
              </option>
            ))}
          </select>
        </div>

        {/* 2. Present Working Resume Status Banner & Perfectly Organized Action Controls */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-3">
          {/* Active Working Resume Info Header */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Currently Working On
                  </span>
                </div>
                <h4 className="font-heading font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                  {resumeData.name || 'Resume 1'}
                </h4>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="px-2 py-0.5 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-[10px] font-bold rounded-lg border border-slate-200 dark:border-slate-700">
                {resumeData.template || 'MultiColor'}
              </span>
            </div>
          </div>

          {/* Inline Rename Form OR Action Buttons Bar */}
          {isRenaming ? (
            <div className="flex items-center gap-1.5 pt-1 border-t border-slate-200 dark:border-slate-700">
              <input
                type="text"
                value={renameInput}
                onChange={(e) => setRenameInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleConfirmRename();
                  if (e.key === 'Escape') setIsRenaming(false);
                }}
                className="flex-1 px-3 py-1.5 bg-white dark:bg-slate-900 border rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Enter resume name"
                autoFocus
              />
              <button
                onClick={handleConfirmRename}
                className="px-3 py-1.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Save
              </button>
              <button
                onClick={() => setIsRenaming(false)}
                className="px-2.5 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ) : (
            /* Perfectly Organized Action Controls Grid */
            <div className="grid grid-cols-4 gap-1.5 pt-1 border-t border-slate-200/80 dark:border-slate-700/80">
              <button
                onClick={handleStartRename}
                className="py-2 px-1 bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-[11px] font-bold flex items-center justify-center space-x-1 transition-all cursor-pointer shadow-2xs active:scale-95"
                title="Rename current resume"
              >
                <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                <span>Rename</span>
              </button>

              <button
                onClick={() => duplicateResume(activeResumeId)}
                className="py-2 px-1 bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-[11px] font-bold flex items-center justify-center space-x-1 transition-all cursor-pointer shadow-2xs active:scale-95"
                title="Duplicate current resume"
              >
                <Copy className="w-3.5 h-3.5 text-sky-500" />
                <span>Duplicate</span>
              </button>

              <button
                onClick={() => deleteResume(activeResumeId)}
                className="py-2 px-1 bg-white hover:bg-rose-50 dark:bg-slate-900 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-slate-700 text-rose-600 dark:text-rose-400 rounded-xl text-[11px] font-bold flex items-center justify-center space-x-1 transition-all cursor-pointer shadow-2xs active:scale-95"
                title="Delete current resume"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                <span>Delete</span>
              </button>

              <button
                onClick={createNewResume}
                className="py-2 px-1 bg-primary hover:bg-primary/90 text-white rounded-xl text-[11px] font-bold flex items-center justify-center space-x-1 transition-all cursor-pointer shadow-xs active:scale-95"
                title="Create a new resume draft"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ New</span>
              </button>
            </div>
          )}
        </div>
      </Card>

      {/* Templates Catalog */}
      <div ref={templateCatalogRef}>
        <TemplateGallery onSelectTemplate={() => setShowPreview(true)} />
      </div>

      {/* Stepper Form Editor */}
      <div className="pt-1 space-y-3">
        <SectionAccordion onNavigateToTemplates={handleNavigateToTemplates} />
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="sticky bottom-20 z-20 pt-2 bg-gradient-to-t from-background dark:from-slate-900 to-transparent">
        <Card variant="surface" className="p-3 flex items-center justify-between border shadow-lg">
          <div className="flex items-center space-x-2">
            {hasUnsavedChanges && (
              <span className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse" title="Unsaved modifications" />
            )}
            <Button
              onClick={() => setShowPreview(true)}
              variant="outline"
              size="sm"
              icon={Eye}
            >
              Live Preview
            </Button>
          </div>

          <Button
            onClick={handleSave}
            variant="primary"
            size="sm"
            icon={savedSuccess ? Check : Save}
          >
            {savedSuccess ? 'Saved!' : 'Save Draft'}
          </Button>
        </Card>
      </div>

      {/* Full-Screen Live Preview Modal */}
      <ResumePreviewModal isOpen={showPreview} onClose={() => setShowPreview(false)} />
    </div>
  );
};
