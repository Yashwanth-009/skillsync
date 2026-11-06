import React, { useEffect, useRef, useState } from 'react';
import {
  UploadCloud,
  RefreshCw,
  AlertCircle,
  Wand2,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Info,
  RotateCcw,
  Eye,
  FileUp,
  Image as ImageIcon,
  History,
  Trash2,
  ExternalLink,
  Briefcase,
  ShieldCheck,
  Sparkles,
  Check
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useResumeStore } from '../../store/useResumeStore';
import { useChatStore } from '../../store/useChatStore';
import { useToastStore } from '../../store/useToastStore';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Skeleton } from '../ui/Skeleton';
import { ResumePreviewModal } from './ResumePreviewModal';

export const ResumeAnalyserTab = () => {
  const analysisResult = useResumeStore((state) => state.analysisResult);
  const isAnalyzing = useResumeStore((state) => state.isAnalyzing);
  const analyzeCurrentResume = useResumeStore((state) => state.analyzeCurrentResume);
  const resumeData = useResumeStore((state) => state.resumeData);
  const uploadedFile = useResumeStore((state) => state.uploadedFile);
  const setUploadedFile = useResumeStore((state) => state.setUploadedFile);
  const clearUploadedFile = useResumeStore((state) => state.clearUploadedFile);
  const auditHistory = useResumeStore((state) => state.auditHistory) || [];
  const saveAuditToHistory = useResumeStore((state) => state.saveAuditToHistory);
  const deleteAuditHistoryItem = useResumeStore((state) => state.deleteAuditHistoryItem);
  const restoreAuditFromHistory = useResumeStore((state) => state.restoreAuditFromHistory);
  const clearAuditHistory = useResumeStore((state) => state.clearAuditHistory);

  const apiKey = useChatStore((state) => state.apiKey);

  const [dragActive, setDragActive] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const fileInputRef = useRef(null);
  const swapFileInputRef = useRef(null);

  // Inactivity & App Reopen Handler (2-3 Minutes Exit Rule)
  useEffect(() => {
    const LAST_CLOSED_KEY = 'SkillSync_last_closed_timestamp';
    const lastClosed = localStorage.getItem(LAST_CLOSED_KEY);
    const now = Date.now();

    if (lastClosed && uploadedFile && analysisResult) {
      const elapsedMs = now - Number(lastClosed);
      const TWO_MINUTES_MS = 2 * 60 * 1000;

      if (elapsedMs >= TWO_MINUTES_MS) {
        const activeName = uploadedFile?.name || `${resumeData.name || 'Resume Draft'}.pdf`;
        const score = analysisResult.overallScore || 75;
        const grade = score >= 85 ? 'A+' : score >= 70 ? 'B' : score >= 60 ? 'C' : 'D';

        saveAuditToHistory({
          id: `audit-${now}`,
          title: activeName,
          overallScore: score,
          grade,
          keywordScore: analysisResult.keywordScore || 75,
          formattingScore: analysisResult.formattingScore || 80,
          grammarScore: analysisResult.grammarScore || 85,
          date: new Date(Number(lastClosed)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
          result: analysisResult
        });
      }
    }

    const handleVisibilityOrUnload = () => {
      localStorage.setItem(LAST_CLOSED_KEY, Date.now().toString());
    };

    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        handleVisibilityOrUnload();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('beforeunload', handleVisibilityOrUnload);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [uploadedFile, analysisResult]);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0] || e.dataTransfer?.files?.[0];
    if (file) {
      const formattedSize = (file.size / 1024).toFixed(1) + ' KB';

      const reader = new FileReader();
      reader.onload = (event) => {
        const fileObj = {
          name: file.name,
          size: formattedSize,
          type: file.type || 'application/pdf',
          data: event.target.result,
          timestamp: new Date().toLocaleTimeString()
        };

        setUploadedFile(fileObj);
        analyzeCurrentResume(apiKey, fileObj);
        useToastStore.getState().addToast(`Analyzing: ${file.name}`, 'info');
      };

      if (file.type.includes('pdf') || file.type.includes('image') || file.type.includes('heic')) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFileUpload(e);
  };

  const score = analysisResult?.overallScore || 85;
  const grade = score >= 85 ? 'A+' : score >= 70 ? 'B' : 'C';
  const activeDisplayName = uploadedFile?.name || `${resumeData.name || 'Resume Draft'}.pdf`;
  const isImageFile = uploadedFile?.type?.includes('image');

  return (
    <div className="space-y-4 pb-8">
      {/* Upload Box */}
      <Card
        variant="surface"
        className={`p-5 text-center transition-all ${
          dragActive ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : 'border-dashed border-2'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary mx-auto mb-2 flex items-center justify-center">
          <UploadCloud className="w-5 h-5" />
        </div>

        <h3 className="font-heading font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
          Upload Resume for ATS Analysis
        </h3>
        <p className="text-[11px] text-slate-500 mt-0.5">
          Supports PDF, DOCX, TXT, or image files.
        </p>

        <div className="mt-3 flex items-center justify-center">
          <div className="relative">
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              variant="primary"
              size="sm"
              icon={UploadCloud}
              className="cursor-pointer"
            >
              Choose File
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,application/pdf,.pdf,.docx,.doc,.txt,image/heic,image/heif"
                onChange={handleFileUpload}
                className="hidden"
              />
            </Button>
          </div>
        </div>
      </Card>

      {/* Loading State */}
      {isAnalyzing && (
        <Card variant="surface" className="text-center space-y-3 p-5">
          <RefreshCw className="w-8 h-8 text-primary animate-spin mx-auto" />
          <div>
            <h4 className="font-heading font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
              Analyzing Resume...
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Checking ATS compatibility, keywords, and readability.</p>
          </div>
          <div className="space-y-1.5 max-w-xs mx-auto">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-4/5 mx-auto" />
          </div>
        </Card>
      )}

      {/* Initial Empty Guidance when no resume is uploaded yet */}
      {!uploadedFile && !analysisResult && !isAnalyzing && (
        <div className="p-5 bg-slate-50 dark:bg-slate-800/60 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700 text-center space-y-2">
          <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
            <Info className="w-4.5 h-4.5" />
          </div>
          <h4 className="font-heading font-extrabold text-xs text-slate-800 dark:text-slate-200">
            Awaiting Your Resume Upload
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
            Upload your resume above in PDF, DOCX, TXT, or Image format to unlock your live ATS compatibility score, detailed section checks, and tailored suggestions.
          </p>
        </div>
      )}

      {/* Results Section - Only shown after user uploads a resume */}
      {uploadedFile && analysisResult && !isAnalyzing && (
        <div className="space-y-4">
          {/* Overall ATS Score */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Overall ATS Score
                </span>
                <div className="flex items-baseline space-x-1.5 mt-0.5">
                  <span className="font-heading font-black text-3xl sm:text-4xl text-white">
                    {score}
                  </span>
                  <span className="text-xs text-slate-400">/ 100</span>
                </div>
              </div>

              <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-heading font-black text-xl shrink-0 shadow-sm">
                {grade}
              </div>
            </div>

            <div className="space-y-1">
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div
                  style={{ width: `${score}%` }}
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800 text-xs">
              <p className="text-slate-300 leading-relaxed flex-1 min-w-[200px]">
                {analysisResult.summary || 'Resume evaluated against common ATS screening standards.'}
              </p>
              {analysisResult.detectedRole && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                  <Briefcase className="w-3 h-3 text-emerald-400" />
                  <span>{analysisResult.detectedRole}</span>
                </span>
              )}
            </div>
          </div>

          {/* Active File Card */}
          <Card variant="surface" className="p-3 border flex items-center justify-between gap-2">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                {isImageFile ? <ImageIcon className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
              </div>
              <div className="min-w-0">
                <h5 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                  {activeDisplayName}
                </h5>
                <span className="text-[10px] text-slate-500">
                  {uploadedFile?.size ? `Size: ${uploadedFile.size}` : 'Current Document'}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-1.5 shrink-0">
              <button
                onClick={() => setShowPreviewModal(true)}
                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-lg flex items-center space-x-1 transition-colors cursor-pointer"
                title="Preview"
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Preview</span>
              </button>

              <button
                onClick={() => analyzeCurrentResume(apiKey, uploadedFile)}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg transition-colors cursor-pointer"
                title="Re-analyze"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <div className="relative">
                <button
                  onClick={() => swapFileInputRef.current?.click()}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg transition-colors cursor-pointer"
                  title="Upload different file"
                >
                  <FileUp className="w-3.5 h-3.5" />
                  <input
                    ref={swapFileInputRef}
                    type="file"
                    accept="image/*,application/pdf,.pdf,.docx,.doc,.txt,image/heic,image/heif"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </button>
              </div>

              <button
                onClick={() => {
                  clearUploadedFile();
                  useToastStore.getState().addToast('Resume removed. You can now upload a different resume.', 'info');
                }}
                className="p-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-600 rounded-lg transition-colors cursor-pointer"
                title="Remove resume"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </Card>

          {/* Metric Sub-scores Grid */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-tight">Keywords</span>
              <span className="font-heading font-black text-sm text-sky-600 dark:text-sky-400">{analysisResult.keywordScore || 75}%</span>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-tight">Formatting</span>
              <span className="font-heading font-black text-sm text-emerald-600 dark:text-emerald-400">{analysisResult.formattingScore || 80}%</span>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-tight">Grammar</span>
              <span className="font-heading font-black text-sm text-amber-600 dark:text-amber-400">{analysisResult.grammarScore || 85}%</span>
            </div>
          </div>

          {/* Key Strengths Section */}
          {Array.isArray(analysisResult.strengths) && analysisResult.strengths.length > 0 && (
            <div className="p-3.5 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/60 space-y-2">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Resume Highlights & Strengths</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-slate-700 dark:text-slate-200">
                {analysisResult.strengths.map((str, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Missing ATS Keywords */}
          {Array.isArray(analysisResult.missingKeywords) && analysisResult.missingKeywords.length > 0 && (
            <div className="p-3.5 bg-sky-50/70 dark:bg-sky-950/30 rounded-2xl border border-sky-200/80 dark:border-sky-800/60 space-y-2">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-sky-800 dark:text-sky-300">
                <Sparkles className="w-4 h-4 text-sky-600" />
                <span>Missing Industry Keywords for {analysisResult.detectedRole || 'Target Role'}</span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Consider naturally integrating these recognized competencies into your project bullets:
              </p>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {analysisResult.missingKeywords.map((kw, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-white dark:bg-slate-900 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 text-[10px] font-bold rounded-lg shadow-2xs">
                    + {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations List */}
          {analysisResult.suggestions?.length > 0 && (
            <div className="space-y-2 pt-1">
              <h4 className="font-heading font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center space-x-1.5">
                <Wand2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Tailored ATS Improvements</span>
              </h4>

              {analysisResult.suggestions.map((sug, idx) => {
                const severity = sug.severity || 'Medium';
                const titleText = sug.title || sug.category || `Suggestion ${idx + 1}`;
                const detailText = sug.fix || sug.description || sug.issue || '';

                let badgeStyle = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
                let Icon = Info;

                if (severity === 'High') {
                  badgeStyle = 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300';
                  Icon = AlertTriangle;
                } else if (severity === 'Medium') {
                  badgeStyle = 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300';
                  Icon = AlertCircle;
                } else {
                  badgeStyle = 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300';
                  Icon = CheckCircle2;
                }

                return (
                  <div
                    key={idx}
                    className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center space-x-1.5">
                        <Icon className="w-3.5 h-3.5 text-slate-400" />
                        <span>{titleText}</span>
                      </span>

                      <span className={`px-2 py-0.5 font-bold text-[10px] rounded-md ${badgeStyle}`}>
                        {severity}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {detailText}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Saved History */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <History className="w-3.5 h-3.5 text-slate-500" />
                <h4 className="font-heading font-bold text-xs text-slate-900 dark:text-white">
                  Analysis History
                </h4>
              </div>

              {auditHistory.length > 0 && (
                <button
                  onClick={clearAuditHistory}
                  className="text-[11px] font-medium text-rose-500 hover:text-rose-600 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {auditHistory.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-1">No previous analyses saved.</p>
            ) : (
              <div className="space-y-1.5">
                {auditHistory.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold text-slate-900 dark:text-white truncate">
                          {item.title}
                        </span>
                        <span className="px-1.5 py-0.2 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold rounded">
                          {item.overallScore}/100
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {item.date}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1 shrink-0">
                      <button
                        onClick={() => restoreAuditFromHistory(item.id)}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-[10px] font-semibold flex items-center space-x-0.5 cursor-pointer"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>View</span>
                      </button>

                      <button
                        onClick={() => deleteAuditHistoryItem(item.id)}
                        className="p-1 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Preview Modal */}
      <ResumePreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        uploadedFile={uploadedFile}
        readOnly={true}
      />
    </div>
  );
};
