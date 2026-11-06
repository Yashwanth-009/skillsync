import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { analyzeResumeWithGemini } from '../services/aiResumeService';
import { useToastStore } from './useToastStore';

const createEmptyResume = (id = 'resume-1', name = 'Resume 1') => ({
  id,
  name,
  lastModified: new Date().toLocaleDateString(),
  template: 'multicolor',
  fontSize: 10, // Integer range 6 to 20
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    summary: '',
    headline: ''
  },
  education: [],
  experience: [],
  skills: [],
  languages: [],
  certifications: [],
  achievements: [],
  projects: []
});

export const useResumeStore = create(
  persist(
    (set, get) => ({
      resumes: [createEmptyResume('resume-1', 'Resume 1')],
      activeResumeId: 'resume-1',
      resumeData: createEmptyResume('resume-1', 'Resume 1'),
      activeTab: 'build',
      selectedTemplate: 'multicolor',
      fontSize: 10,
      analysisResult: null,
      isAnalyzing: false,
      hasUnsavedChanges: false,
      uploadedFile: null, // Persistent chosen target file object
      auditHistory: [], // Persistent array of historical ATS audits
      lastClosedTimestamp: null,

      setActiveTab: (tab) => set({ activeTab: tab }),

      setUploadedFile: (fileObj) => set({ uploadedFile: fileObj }),
      clearUploadedFile: () => set({ uploadedFile: null, analysisResult: null }),

      resetResumeAnalysis: () => set({
        uploadedFile: null,
        analysisResult: null,
        auditHistory: [],
        isAnalyzing: false
      }),

      saveAuditToHistory: (record) => set((state) => {
        const historyList = Array.isArray(state.auditHistory) ? state.auditHistory : [];
        const exists = historyList.some((h) => h.id === record.id || (h.title === record.title && h.date === record.date));
        if (exists) return state;
        return { auditHistory: [record, ...historyList] };
      }),

      deleteAuditHistoryItem: (id) => set((state) => ({
        auditHistory: (Array.isArray(state.auditHistory) ? state.auditHistory : []).filter((h) => h.id !== id)
      })),

      clearAuditHistory: () => set({ auditHistory: [] }),

      restoreAuditFromHistory: (id) => {
        const target = get().auditHistory.find((h) => h.id === id);
        if (target && target.result) {
          set({ analysisResult: target.result });
          useToastStore.getState().addToast(`Restored ATS Audit History: ${target.title} (${target.overallScore}/100)`, 'info');
        }
      },

      setSelectedTemplate: (template) => set((state) => {
        const updatedResume = { ...state.resumeData, template };
        const updatedResumes = state.resumes.map((r) =>
          r.id === state.activeResumeId ? updatedResume : r
        );
        return {
          selectedTemplate: template,
          resumeData: updatedResume,
          resumes: updatedResumes
        };
      }),

      setFontSize: (fontSize) => set((state) => {
        const numSize = Math.max(6, Math.min(20, Number(fontSize) || 10));
        const updatedResume = { ...state.resumeData, fontSize: numSize };
        const updatedResumes = state.resumes.map((r) =>
          r.id === state.activeResumeId ? updatedResume : r
        );
        return {
          fontSize: numSize,
          resumeData: updatedResume,
          resumes: updatedResumes
        };
      }),

      switchResume: (resumeId) => {
        const target = get().resumes.find((r) => r.id === resumeId);
        if (target) {
          set({
            activeResumeId: resumeId,
            resumeData: target,
            selectedTemplate: target.template || 'multicolor',
            fontSize: target.fontSize || 10
          });
          useToastStore.getState().addToast(`Switched to ${target.name}`, 'info');
        }
      },

      createNewResume: () => {
        const newId = `resume-${Date.now()}`;
        const newName = `Resume ${get().resumes.length + 1}`;
        const newResume = createEmptyResume(newId, newName);

        set((state) => ({
          resumes: [...state.resumes, newResume],
          activeResumeId: newId,
          resumeData: newResume,
          selectedTemplate: 'multicolor',
          fontSize: 10
        }));

        useToastStore.getState().addToast(`Created New Resume: ${newName}`, 'success');
      },

      duplicateResume: (resumeId) => {
        const target = get().resumes.find((r) => r.id === resumeId);
        if (!target) return;

        const newId = `resume-${Date.now()}`;
        const newName = `${target.name} (Copy)`;
        const duplicated = {
          ...target,
          id: newId,
          name: newName,
          lastModified: new Date().toLocaleDateString()
        };

        set((state) => ({
          resumes: [...state.resumes, duplicated],
          activeResumeId: newId,
          resumeData: duplicated,
          selectedTemplate: duplicated.template || 'multicolor',
          fontSize: duplicated.fontSize || 10
        }));

        useToastStore.getState().addToast(`Duplicated: ${newName}`, 'success');
      },

      renameResume: (resumeId, newName) => {
        if (!newName.trim()) return;
        set((state) => ({
          resumes: state.resumes.map((r) =>
            r.id === resumeId ? { ...r, name: newName.trim() } : r
          ),
          resumeData: state.resumeData.id === resumeId
            ? { ...state.resumeData, name: newName.trim() }
            : state.resumeData
        }));
        useToastStore.getState().addToast('Resume Renamed', 'success');
      },

      deleteResume: (resumeId) => {
        const currentResumes = get().resumes;
        if (currentResumes.length <= 1) {
          useToastStore.getState().addToast('Cannot delete your only resume draft!', 'warning');
          return;
        }

        const filtered = currentResumes.filter((r) => r.id !== resumeId);
        const nextActive = filtered[0];

        set({
          resumes: filtered,
          activeResumeId: nextActive.id,
          resumeData: nextActive,
          selectedTemplate: nextActive.template || 'multicolor',
          fontSize: nextActive.fontSize || 10
        });

        useToastStore.getState().addToast('Resume Draft Deleted', 'info');
      },

      updatePersonalInfo: (field, value) => set((state) => {
        const updatedInfo = { ...state.resumeData.personalInfo, [field]: value };
        const updatedResume = {
          ...state.resumeData,
          personalInfo: updatedInfo,
          lastModified: new Date().toLocaleDateString()
        };
        const updatedResumes = state.resumes.map((r) =>
          r.id === state.activeResumeId ? updatedResume : r
        );
        return {
          hasUnsavedChanges: true,
          resumeData: updatedResume,
          resumes: updatedResumes
        };
      }),

      updateEducation: (educationList) => set((state) => {
        const updatedResume = { ...state.resumeData, education: educationList };
        const updatedResumes = state.resumes.map((r) =>
          r.id === state.activeResumeId ? updatedResume : r
        );
        return {
          hasUnsavedChanges: true,
          resumeData: updatedResume,
          resumes: updatedResumes
        };
      }),

      updateExperience: (experienceList) => set((state) => {
        const updatedResume = { ...state.resumeData, experience: experienceList };
        const updatedResumes = state.resumes.map((r) =>
          r.id === state.activeResumeId ? updatedResume : r
        );
        return {
          hasUnsavedChanges: true,
          resumeData: updatedResume,
          resumes: updatedResumes
        };
      }),

      updateSkills: (skillsList) => set((state) => {
        const updatedResume = { ...state.resumeData, skills: skillsList };
        const updatedResumes = state.resumes.map((r) =>
          r.id === state.activeResumeId ? updatedResume : r
        );
        return {
          hasUnsavedChanges: true,
          resumeData: updatedResume,
          resumes: updatedResumes
        };
      }),

      saveDraft: () => {
        set({ hasUnsavedChanges: false });
        useToastStore.getState().addToast('Resume draft saved successfully!', 'success');
        return true;
      },

      generateLinkedInSummary: () => {
        const data = get().resumeData;
        const name = data.personalInfo.fullName || 'Professional Scholar';
        const headline = data.personalInfo.headline || 'Student Leader';
        const skillsText = (data.skills || []).slice(0, 5).join(', ');

        const summaryText = `🎯 ${headline} | Driven by innovation, technical problem-solving, and excellence.\n\nKey Competencies: ${skillsText || 'Software Development, Project Management, Systems Design'}.\n\nPassionate about building high-impact solutions and collaborating with industry leaders. Let's connect!`;

        get().updatePersonalInfo('summary', summaryText);
        useToastStore.getState().addToast('LinkedIn Summary Generated & Applied! 🚀', 'success');
      },

      analyzeCurrentResume: async (apiKey = null, targetFile = null) => {
        set({ isAnalyzing: true });
        try {
          const fileToAnalyze = targetFile || get().uploadedFile;
          const result = await analyzeResumeWithGemini(fileToAnalyze, get().resumeData, apiKey);
          set({ analysisResult: result, isAnalyzing: false });

          // Automatically record to audit history
          const activeName = fileToAnalyze?.name || `${get().resumeData.name || 'Resume_Draft_1'}.pdf`;
          const score = result.overallScore || 75;
          const grade = score >= 85 ? 'A+' : score >= 70 ? 'B' : score >= 60 ? 'C' : 'D';

          const record = {
            id: `audit-${Date.now()}`,
            title: activeName,
            overallScore: score,
            grade,
            keywordScore: result.keywordScore || 75,
            formattingScore: result.formattingScore || 80,
            grammarScore: result.grammarScore || 85,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
            result
          };

          get().saveAuditToHistory(record);
          useToastStore.getState().addToast(`Resume Audit Completed! Score: ${score}/100`, 'success');
        } catch (error) {
          console.error('Resume Analysis Error:', error);
          set({ isAnalyzing: false });
          useToastStore.getState().addToast('Failed to analyze resume. Please check your network.', 'error');
        }
      }
    }),
    {
      name: 'SkillSync_resume_storage_v9',
      onRehydrateStorage: () => (state) => {
        if (state) {
          if (!Array.isArray(state.auditHistory)) {
            state.auditHistory = [];
          }
        }
      }
    }
  )
);
