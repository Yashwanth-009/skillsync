import React, { useRef, useState } from 'react';
import { X, Download, FileText, Lock, Image as ImageIcon, Mail, Phone, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useResumeStore } from '../../store/useResumeStore';
import { useAuthStore } from '../../store/useAuthStore';

export const ResumePreviewModal = ({ isOpen, onClose, uploadedFile = null, readOnly = false }) => {
  const user = useAuthStore((state) => state.user);
  const resumeData = useResumeStore((state) => state.resumeData);
  const selectedTemplate = useResumeStore((state) => state.selectedTemplate);
  const setSelectedTemplate = useResumeStore((state) => state.setSelectedTemplate);
  const fontSize = useResumeStore((state) => state.fontSize) || 10;
  const setFontSize = useResumeStore((state) => state.setFontSize);

  const printRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const fullName = resumeData.personalInfo.fullName || user.name || 'Your Name';
  const email = resumeData.personalInfo.email || user.email || '';
  const phone = resumeData.personalInfo.phone || user.phone || '';
  const location = resumeData.personalInfo.location || user.institution || '';
  const headline = resumeData.personalInfo.headline || '';
  const summary = resumeData.personalInfo.summary || '';
  const photo = resumeData.personalInfo.photo || user.avatar;

  const isImageData = uploadedFile?.data && (
    uploadedFile.data.startsWith('data:image/') ||
    (uploadedFile.type && uploadedFile.type.startsWith('image/'))
  );

  const isPdfData = uploadedFile?.data && (
    uploadedFile.data.startsWith('data:application/pdf') ||
    (uploadedFile.type && uploadedFile.type.includes('pdf'))
  );

  const handleExportPDF = async () => {
    if (!printRef.current && !uploadedFile) return;
    setIsExporting(true);

    try {
      if (isPdfData) {
        const link = document.createElement('a');
        link.href = uploadedFile.data;
        link.download = uploadedFile.name || 'Resume.pdf';
        link.click();
        return;
      }

      if (isImageData) {
        const link = document.createElement('a');
        link.href = uploadedFile.data;
        link.download = uploadedFile.name || 'Resume_Photo.png';
        link.click();
        return;
      }

      const element = printRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${(uploadedFile?.name || fullName).replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      console.error('PDF export failed', err);
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  const templatesList = [
    { id: 'multicolor', label: 'MultiColor' },
    { id: 'visionary', label: 'Visionary' },
    { id: 'artistic', label: 'Artistic' },
    { id: 'vertex', label: 'Vertex' }
  ];

  const baseSize = fontSize;
  const titleSize = Math.round(fontSize * 1.8);
  const headingSize = Math.round(fontSize * 1.2);
  const subSize = Math.round(fontSize * 0.85);

  const contactPieces = [email, phone, location].filter(Boolean);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-slate-900/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          className="w-full h-[100dvh] sm:h-auto sm:max-h-[92vh] sm:max-w-3xl bg-white dark:bg-slate-900 rounded-none sm:rounded-2xl shadow-2xl border-0 sm:border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden"
        >
          {/* Header Toolbar */}
          <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between gap-2 shrink-0 border-b border-slate-800">
            <div className="flex items-center space-x-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center font-bold shrink-0">
                {isImageData ? <ImageIcon className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
              </div>
              <div className="min-w-0">
                <h3 className="font-heading font-bold text-xs sm:text-sm text-white truncate">
                  {uploadedFile ? uploadedFile.name : `Preview (${selectedTemplate})`}
                </h3>
              </div>
            </div>

            {/* Toolbar Actions */}
            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={handleExportPDF}
                disabled={isExporting}
                className="px-3 py-1.5 bg-primary hover:bg-primary/90 text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center space-x-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isExporting ? 'Exporting...' : 'Download PDF'}</span>
              </button>

              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Template Selector Bar */}
          {!uploadedFile && (
            <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-2 overflow-x-auto text-xs shrink-0 no-scrollbar">
              <span className="text-[11px] font-semibold text-slate-500 shrink-0">Layout:</span>
              {templatesList.map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => setSelectedTemplate(tmpl.id)}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all text-xs shrink-0 cursor-pointer ${
                    selectedTemplate === tmpl.id
                      ? 'bg-primary text-white shadow-xs'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {tmpl.label}
                </button>
              ))}
            </div>
          )}

          {/* Main Document Body */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-slate-100 dark:bg-slate-950 flex justify-center items-start">
            {uploadedFile ? (
              <div className="w-full bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col min-h-full">
                {isPdfData ? (
                  <iframe
                    src={uploadedFile.data}
                    title={uploadedFile.name}
                    className="w-full h-[calc(100dvh-100px)] sm:h-[600px] border-0"
                  />
                ) : isImageData ? (
                  <div className="p-4 flex flex-col items-center justify-center">
                    <img
                      src={uploadedFile.data}
                      alt={uploadedFile.name}
                      className="w-full max-w-xl h-auto max-h-[calc(100dvh-120px)] sm:max-h-[580px] object-contain rounded-lg border shadow-sm"
                    />
                  </div>
                ) : (
                  <div className="p-5 font-mono text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap max-h-[calc(100dvh-120px)] sm:max-h-[580px] overflow-y-auto">
                    {typeof uploadedFile.data === 'string' && !uploadedFile.data.startsWith('data:')
                      ? uploadedFile.data
                      : `File: ${uploadedFile.name}\nSize: ${uploadedFile.size || ''}`}
                  </div>
                )}
              </div>
            ) : (
              <div
                ref={printRef}
                style={{ fontSize: `${baseSize}px` }}
                className="w-full max-w-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden min-h-full"
              >
                {/* 1. MultiColor Template */}
                {(selectedTemplate === 'multicolor' || !['visionary', 'artistic', 'vertex'].includes(selectedTemplate)) && (
                  <div className="p-5 sm:p-7 space-y-4">
                    <div className="flex items-center space-x-3 border-b-2 border-primary pb-3.5">
                      {photo && (
                        <img src={photo} alt="Photo" className="w-12 h-12 rounded-full object-cover border-2 border-primary shadow-xs shrink-0" />
                      )}
                      <div>
                        <h1 style={{ fontSize: `${titleSize}px` }} className="font-heading font-black text-slate-900 dark:text-white leading-tight">
                          {fullName}
                        </h1>
                        {headline && (
                          <p style={{ fontSize: `${headingSize}px` }} className="font-semibold text-primary">
                            {headline}
                          </p>
                        )}
                        {contactPieces.length > 0 && (
                          <p style={{ fontSize: `${subSize}px` }} className="text-slate-500 mt-0.5">
                            {contactPieces.join(' • ')}
                          </p>
                        )}
                      </div>
                    </div>

                    {summary && (
                      <div className="space-y-1.5">
                        <h2 style={{ fontSize: `${headingSize}px` }} className="font-bold text-slate-900 dark:text-white uppercase tracking-wider border-l-4 border-primary pl-2">
                          Summary
                        </h2>
                        <p style={{ fontSize: `${baseSize}px` }} className="text-slate-700 dark:text-slate-300 leading-relaxed">
                          {summary}
                        </p>
                      </div>
                    )}

                    {resumeData.experience?.length > 0 && (
                      <div className="space-y-2.5">
                        <h2 style={{ fontSize: `${headingSize}px` }} className="font-bold text-slate-900 dark:text-white uppercase tracking-wider border-l-4 border-sky-500 pl-2">
                          Experience
                        </h2>
                        {resumeData.experience.map((exp) => (
                          <div key={exp.id} className="space-y-0.5">
                            <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                              <span>{exp.position || exp.title} — {exp.company}</span>
                              <span className="text-slate-400 text-xs font-normal">{exp.startDate} – {exp.endDate}</span>
                            </div>
                            {exp.description && (
                              <p style={{ fontSize: `${baseSize}px` }} className="text-slate-600 dark:text-slate-300">{exp.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {resumeData.education?.length > 0 && (
                      <div className="space-y-2.5">
                        <h2 style={{ fontSize: `${headingSize}px` }} className="font-bold text-slate-900 dark:text-white uppercase tracking-wider border-l-4 border-indigo-500 pl-2">
                          Education
                        </h2>
                        {resumeData.education.map((edu) => (
                          <div key={edu.id} className="space-y-0.5">
                            <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                              <span>{edu.degree} — {edu.institution}</span>
                              <span className="text-slate-400 text-xs font-normal">{edu.endDate}</span>
                            </div>
                            {edu.gpa && <p style={{ fontSize: `${subSize}px` }} className="text-slate-500">GPA: {edu.gpa}</p>}
                          </div>
                        ))}
                      </div>
                    )}

                    {resumeData.skills?.length > 0 && (
                      <div className="space-y-1.5">
                        <h2 style={{ fontSize: `${headingSize}px` }} className="font-bold text-slate-900 dark:text-white uppercase tracking-wider border-l-4 border-amber-500 pl-2">
                          Skills
                        </h2>
                        <div className="flex flex-wrap gap-1">
                          {resumeData.skills.map((skill, i) => (
                            <span key={i} style={{ fontSize: `${subSize}px` }} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium rounded">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. Visionary Template */}
                {selectedTemplate === 'visionary' && (
                  <div className="flex flex-col sm:flex-row min-h-[500px]">
                    <div className="w-full sm:w-1/3 bg-slate-900 text-white p-4 space-y-4">
                      <div className="text-center space-y-1.5">
                        {photo && (
                          <img src={photo} alt="Photo" className="w-16 h-16 rounded-full object-cover border-2 border-primary mx-auto" />
                        )}
                        <h2 style={{ fontSize: `${headingSize}px` }} className="font-bold text-white">{fullName}</h2>
                        {headline && (
                          <span className="px-2 py-0.5 bg-primary/20 text-primary-light text-[10px] font-semibold rounded-full inline-block">
                            {headline}
                          </span>
                        )}
                      </div>

                      {contactPieces.length > 0 && (
                        <div className="space-y-1 text-xs text-slate-300 border-t border-slate-800 pt-2.5">
                          {email && <p className="flex items-center space-x-1.5 truncate"><Mail className="w-3 h-3 text-primary shrink-0" /><span className="truncate">{email}</span></p>}
                          {phone && <p className="flex items-center space-x-1.5"><Phone className="w-3 h-3 text-primary shrink-0" /><span>{phone}</span></p>}
                          {location && <p className="flex items-center space-x-1.5 truncate"><MapPin className="w-3 h-3 text-primary shrink-0" /><span className="truncate">{location}</span></p>}
                        </div>
                      )}

                      {resumeData.skills?.length > 0 && (
                        <div className="space-y-1.5 border-t border-slate-800 pt-2.5">
                          <h3 style={{ fontSize: `${subSize}px` }} className="font-bold uppercase tracking-wider text-slate-400">Skills</h3>
                          <div className="flex flex-wrap gap-1">
                            {resumeData.skills.map((skill, i) => (
                              <span key={i} style={{ fontSize: `${subSize}px` }} className="px-1.5 py-0.5 bg-slate-800 text-slate-200 rounded">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="w-full sm:w-2/3 p-4 sm:p-5 space-y-4 bg-white dark:bg-slate-900">
                      {summary && (
                        <div className="space-y-1">
                          <h3 style={{ fontSize: `${headingSize}px` }} className="font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b pb-1">
                            Profile
                          </h3>
                          <p style={{ fontSize: `${baseSize}px` }} className="text-slate-700 dark:text-slate-300 leading-relaxed">{summary}</p>
                        </div>
                      )}

                      {resumeData.experience?.length > 0 && (
                        <div className="space-y-2">
                          <h3 style={{ fontSize: `${headingSize}px` }} className="font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b pb-1">
                            Experience
                          </h3>
                          {resumeData.experience.map((exp) => (
                            <div key={exp.id} className="space-y-0.5 border-l-2 border-primary pl-2.5">
                              <div className="font-bold text-slate-900 dark:text-white">{exp.position || exp.title} — {exp.company}</div>
                              <div className="text-[10px] text-primary">{exp.startDate} – {exp.endDate}</div>
                              {exp.description && <p style={{ fontSize: `${baseSize}px` }} className="text-slate-600 dark:text-slate-300">{exp.description}</p>}
                            </div>
                          ))}
                        </div>
                      )}

                      {resumeData.education?.length > 0 && (
                        <div className="space-y-2">
                          <h3 style={{ fontSize: `${headingSize}px` }} className="font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b pb-1">
                            Education
                          </h3>
                          {resumeData.education.map((edu) => (
                            <div key={edu.id} className="space-y-0.5">
                              <div className="font-bold text-slate-900 dark:text-white">{edu.degree} — {edu.institution}</div>
                              <div className="text-[10px] text-slate-400">{edu.endDate}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 3. Artistic Template */}
                {selectedTemplate === 'artistic' && (
                  <div className="space-y-4">
                    <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/60 text-center border-b space-y-1">
                      {photo && (
                        <img src={photo} alt="Photo" className="w-14 h-14 rounded-full object-cover mx-auto shadow-xs" />
                      )}
                      <h1 style={{ fontSize: `${titleSize}px` }} className="font-serif font-bold text-slate-900 dark:text-white">{fullName}</h1>
                      {headline && <p style={{ fontSize: `${headingSize}px` }} className="text-slate-600 dark:text-slate-300 italic">{headline}</p>}
                      {contactPieces.length > 0 && <p style={{ fontSize: `${subSize}px` }} className="text-slate-500">{contactPieces.join(' • ')}</p>}
                    </div>

                    <div className="p-4 sm:p-5 space-y-4">
                      {summary && (
                        <div className="space-y-1">
                          <h3 style={{ fontSize: `${headingSize}px` }} className="font-serif font-bold text-slate-900 dark:text-white border-b pb-0.5">
                            Overview
                          </h3>
                          <p style={{ fontSize: `${baseSize}px` }} className="text-slate-700 dark:text-slate-300 italic">{summary}</p>
                        </div>
                      )}

                      {resumeData.experience?.length > 0 && (
                        <div className="space-y-2">
                          <h3 style={{ fontSize: `${headingSize}px` }} className="font-serif font-bold text-slate-900 dark:text-white border-b pb-0.5">
                            Experience
                          </h3>
                          {resumeData.experience.map((exp) => (
                            <div key={exp.id} className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg space-y-0.5">
                              <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                                <span>{exp.position || exp.title}</span>
                                <span className="text-slate-400 text-xs font-normal">{exp.company}</span>
                              </div>
                              {exp.description && <p style={{ fontSize: `${baseSize}px` }} className="text-slate-600 dark:text-slate-300">{exp.description}</p>}
                            </div>
                          ))}
                        </div>
                      )}

                      {resumeData.education?.length > 0 && (
                        <div className="space-y-2">
                          <h3 style={{ fontSize: `${headingSize}px` }} className="font-serif font-bold text-slate-900 dark:text-white border-b pb-0.5">
                            Education
                          </h3>
                          {resumeData.education.map((edu) => (
                            <div key={edu.id} className="space-y-0.5">
                              <div className="font-bold text-slate-900 dark:text-white">{edu.degree} — {edu.institution}</div>
                              <span className="text-slate-400 text-xs">{edu.endDate}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 4. Vertex Template */}
                {selectedTemplate === 'vertex' && (
                  <div className="flex flex-col sm:flex-row min-h-[500px]">
                    <div className="w-full sm:w-1/3 bg-slate-50 dark:bg-slate-800/60 p-4 space-y-4 border-r border-slate-200 dark:border-slate-800">
                      <div className="text-center space-y-1.5">
                        {photo && (
                          <img src={photo} alt="Photo" className="w-16 h-16 rounded-full object-cover mx-auto shadow-xs" />
                        )}
                        <h2 style={{ fontSize: `${headingSize}px` }} className="font-bold text-slate-900 dark:text-white">{fullName}</h2>
                        {headline && (
                          <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-[10px] font-semibold rounded-full inline-block">
                            {headline}
                          </span>
                        )}
                      </div>

                      {contactPieces.length > 0 && (
                        <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-200 dark:border-slate-700 pt-2.5">
                          {email && <p className="truncate"><strong>Email:</strong> {email}</p>}
                          {phone && <p><strong>Phone:</strong> {phone}</p>}
                          {location && <p className="truncate"><strong>Location:</strong> {location}</p>}
                        </div>
                      )}

                      {resumeData.skills?.length > 0 && (
                        <div className="space-y-1.5 border-t border-slate-200 dark:border-slate-700 pt-2.5">
                          <h3 style={{ fontSize: `${subSize}px` }} className="font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Skills</h3>
                          <div className="flex flex-wrap gap-1">
                            {resumeData.skills.map((skill, i) => (
                              <span key={i} style={{ fontSize: `${subSize}px` }} className="px-1.5 py-0.5 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border rounded">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="w-full sm:w-2/3 p-4 sm:p-5 space-y-4 bg-white dark:bg-slate-900">
                      {summary && (
                        <div className="space-y-1">
                          <h3 style={{ fontSize: `${headingSize}px` }} className="font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b pb-1">
                            Profile
                          </h3>
                          <p style={{ fontSize: `${baseSize}px` }} className="text-slate-700 dark:text-slate-300 leading-relaxed">{summary}</p>
                        </div>
                      )}

                      {resumeData.experience?.length > 0 && (
                        <div className="space-y-3">
                          <h3 style={{ fontSize: `${headingSize}px` }} className="font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b pb-1">
                            Experience
                          </h3>
                          <div className="space-y-3 relative pl-3.5 border-l-2 border-primary/40">
                            {resumeData.experience.map((exp) => (
                              <div key={exp.id} className="relative space-y-0.5">
                                <div className="absolute -left-[19px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary" />
                                <div className="font-bold text-slate-900 dark:text-white">{exp.position || exp.title} — {exp.company}</div>
                                <div className="text-[10px] text-slate-400">{exp.startDate} – {exp.endDate}</div>
                                {exp.description && <p style={{ fontSize: `${baseSize}px` }} className="text-slate-600 dark:text-slate-300">{exp.description}</p>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {resumeData.education?.length > 0 && (
                        <div className="space-y-2">
                          <h3 style={{ fontSize: `${headingSize}px` }} className="font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b pb-1">
                            Education
                          </h3>
                          {resumeData.education.map((edu) => (
                            <div key={edu.id} className="space-y-0.5">
                              <div className="font-bold text-slate-900 dark:text-white">{edu.degree} — {edu.institution}</div>
                              <span className="text-slate-400 text-xs">{edu.endDate}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
