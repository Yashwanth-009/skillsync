import React, { useRef, useState } from 'react';
import {
  Layout,
  User,
  Briefcase,
  GraduationCap,
  Sparkles,
  FileText,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Type,
  Minus,
  Image as ImageIcon
} from 'lucide-react';
import { useResumeStore } from '../../store/useResumeStore';
import { useToastStore } from '../../store/useToastStore';

export const SectionAccordion = ({ onNavigateToTemplates }) => {
  const resumeData = useResumeStore((state) => state.resumeData);
  const fontSize = useResumeStore((state) => state.fontSize) || 10;
  const setFontSize = useResumeStore((state) => state.setFontSize);
  const updatePersonalInfo = useResumeStore((state) => state.updatePersonalInfo);
  const updateEducation = useResumeStore((state) => state.updateEducation);
  const updateExperience = useResumeStore((state) => state.updateExperience);
  const updateSkills = useResumeStore((state) => state.updateSkills);

  const [activeStep, setActiveStep] = useState('contact');
  const [skillInput, setSkillInput] = useState('');
  const photoInputRef = useRef(null);

  const navItems = [
    { id: 'contact', label: 'Contact', icon: User },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills', icon: Sparkles },
    { id: 'summary', label: 'Summary', icon: FileText },
    { id: 'template', label: 'Templates', icon: Layout }
  ];

  const stepsOrder = ['contact', 'experience', 'education', 'skills', 'summary'];

  const handleNavClick = (id) => {
    if (id === 'template') {
      if (onNavigateToTemplates) onNavigateToTemplates();
      return;
    }
    setActiveStep(id);
  };

  const handleNextStep = () => {
    const idx = stepsOrder.indexOf(activeStep);
    if (idx < stepsOrder.length - 1) {
      setActiveStep(stepsOrder[idx + 1]);
      useToastStore.getState().addToast('Section saved', 'success');
    }
  };

  const handlePrevStep = () => {
    const idx = stepsOrder.indexOf(activeStep);
    if (idx > 0) {
      setActiveStep(stepsOrder[idx - 1]);
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updatePersonalInfo('photo', reader.result);
        useToastStore.getState().addToast('Photo updated', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSkill = (skillToAdd) => {
    const val = (skillToAdd || skillInput).trim();
    if (!val) return;
    if (resumeData.skills.includes(val)) return;
    updateSkills([...resumeData.skills, val]);
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    updateSkills(resumeData.skills.filter((s) => s !== skillToRemove));
  };

  const handleAddEducation = () => {
    const newEdu = {
      id: `edu-${Date.now()}`,
      institution: '',
      degree: '',
      specialization: '',
      city: '',
      state: '',
      endDate: '',
      gpa: ''
    };
    updateEducation([...resumeData.education, newEdu]);
  };

  const handleAddExperience = () => {
    const newExp = {
      id: `exp-${Date.now()}`,
      company: '',
      position: '',
      city: '',
      state: '',
      startDate: '',
      endDate: '',
      description: ''
    };
    updateExperience([...resumeData.experience, newExp]);
  };

  return (
    <div className="space-y-4">
      {/* Horizontal Scrollable Section Navigation Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeStep === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`px-3 py-2 rounded-xl font-bold text-xs transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Step Form Content Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        {/* Font Size Adjustment Bar */}
        <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-2">
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <Type className="w-3.5 h-3.5 text-primary" />
            <span>Document Font Size:</span>
          </div>

          <div className="flex items-center space-x-2 bg-white dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setFontSize(Math.max(6, fontSize - 1))}
              className="text-slate-500 hover:text-primary p-0.5 cursor-pointer"
              title="Decrease Font Size"
            >
              <Minus className="w-3 h-3" />
            </button>
            <input
              type="range"
              min="6"
              max="20"
              step="1"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-16 sm:w-24 accent-primary cursor-pointer h-1.5 rounded-lg bg-slate-200 dark:bg-slate-700"
            />
            <button
              onClick={() => setFontSize(Math.min(20, fontSize + 1))}
              className="text-slate-500 hover:text-primary p-0.5 cursor-pointer"
              title="Increase Font Size"
            >
              <Plus className="w-3 h-3" />
            </button>
            <span className="text-xs font-bold text-primary min-w-[32px] text-center">
              {fontSize}pt
            </span>
          </div>
        </div>

        {/* STEP 1: CONTACT INFO */}
        {activeStep === 'contact' && (
          <div className="space-y-4">
            <div>
              <h4 className="font-heading font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                Contact Details
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Add your contact and personal information for employers.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={resumeData.personalInfo.fullName}
                  onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={resumeData.personalInfo.email}
                  onChange={(e) => updatePersonalInfo('email', e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  value={resumeData.personalInfo.phone}
                  onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Location (City, Country)
                </label>
                <input
                  type="text"
                  value={resumeData.personalInfo.location}
                  onChange={(e) => updatePersonalInfo('location', e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Photo Upload (Optional) */}
            <div className="pt-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Profile Photo (Optional)
              </label>
              <div className="relative w-full">
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex items-center justify-center space-x-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer transition-colors"
                >
                  {resumeData.personalInfo.photo ? (
                    <img src={resumeData.personalInfo.photo} alt="Photo" className="w-6 h-6 rounded-full object-cover border" />
                  ) : (
                    <ImageIcon className="w-4 h-4 text-primary" />
                  )}
                  <span>{resumeData.personalInfo.photo ? 'Change Photo' : 'Upload Photo'}</span>

                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: EXPERIENCE */}
        {activeStep === 'experience' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-heading font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                  Work Experience
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Add your past or current job roles and internships.
                </p>
              </div>
              <button
                onClick={handleAddExperience}
                className="px-3 py-1.5 bg-primary text-white text-xs font-semibold rounded-xl flex items-center space-x-1 hover:bg-primary/90 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Role</span>
              </button>
            </div>

            {resumeData.experience.length === 0 ? (
              <div className="p-6 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                <Briefcase className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                <p className="text-xs text-slate-500">No experience entries added yet.</p>
                <button
                  onClick={handleAddExperience}
                  className="mt-2 text-xs text-primary font-semibold hover:underline cursor-pointer"
                >
                  + Add your first position
                </button>
              </div>
            ) : (
              resumeData.experience.map((exp, idx) => (
                <div key={exp.id || idx} className="p-3.5 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-slate-200 dark:border-slate-700/80 space-y-3 relative">
                  <button
                    onClick={() => updateExperience(resumeData.experience.filter((_, i) => i !== idx))}
                    className="absolute top-3 right-3 p-1 text-slate-400 hover:text-rose-500 transition-colors"
                    title="Remove Entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pr-8">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                        Company / Employer
                      </label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => {
                          const updated = [...resumeData.experience];
                          updated[idx].company = e.target.value;
                          updateExperience(updated);
                        }}
                        className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                        Job Title
                      </label>
                      <input
                        type="text"
                        value={exp.position || exp.title || ''}
                        onChange={(e) => {
                          const updated = [...resumeData.experience];
                          updated[idx].position = e.target.value;
                          updated[idx].title = e.target.value;
                          updateExperience(updated);
                        }}
                        className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                        Start Date
                      </label>
                      <input
                        type="text"
                        value={exp.startDate || ''}
                        onChange={(e) => {
                          const updated = [...resumeData.experience];
                          updated[idx].startDate = e.target.value;
                          updateExperience(updated);
                        }}
                        className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                        End Date
                      </label>
                      <input
                        type="text"
                        value={exp.endDate || ''}
                        onChange={(e) => {
                          const updated = [...resumeData.experience];
                          updated[idx].endDate = e.target.value;
                          updateExperience(updated);
                        }}
                        className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Responsibilities & Achievements
                    </label>
                    <textarea
                      rows={2}
                      value={exp.description || ''}
                      onChange={(e) => {
                        const updated = [...resumeData.experience];
                        updated[idx].description = e.target.value;
                        updateExperience(updated);
                      }}
                      className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* STEP 3: EDUCATION */}
        {activeStep === 'education' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-heading font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                  Education
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Add details about your degree, university, or certifications.
                </p>
              </div>
              <button
                onClick={handleAddEducation}
                className="px-3 py-1.5 bg-primary text-white text-xs font-semibold rounded-xl flex items-center space-x-1 hover:bg-primary/90 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Education</span>
              </button>
            </div>

            {resumeData.education.length === 0 ? (
              <div className="p-6 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                <GraduationCap className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                <p className="text-xs text-slate-500">No education entries added yet.</p>
                <button
                  onClick={handleAddEducation}
                  className="mt-2 text-xs text-primary font-semibold hover:underline cursor-pointer"
                >
                  + Add your school or university
                </button>
              </div>
            ) : (
              resumeData.education.map((edu, idx) => (
                <div key={edu.id || idx} className="p-3.5 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-slate-200 dark:border-slate-700/80 space-y-3 relative">
                  <button
                    onClick={() => updateEducation(resumeData.education.filter((_, i) => i !== idx))}
                    className="absolute top-3 right-3 p-1 text-slate-400 hover:text-rose-500 transition-colors"
                    title="Remove Entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pr-8">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                        Institution / University
                      </label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => {
                          const updated = [...resumeData.education];
                          updated[idx].institution = e.target.value;
                          updateEducation(updated);
                        }}
                        className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                        Degree / Major
                      </label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => {
                          const updated = [...resumeData.education];
                          updated[idx].degree = e.target.value;
                          updateEducation(updated);
                        }}
                        className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                        Graduation Year / Dates
                      </label>
                      <input
                        type="text"
                        value={edu.endDate || ''}
                        onChange={(e) => {
                          const updated = [...resumeData.education];
                          updated[idx].endDate = e.target.value;
                          updateEducation(updated);
                        }}
                        className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                        GPA / Grade (Optional)
                      </label>
                      <input
                        type="text"
                        value={edu.gpa || ''}
                        onChange={(e) => {
                          const updated = [...resumeData.education];
                          updated[idx].gpa = e.target.value;
                          updateEducation(updated);
                        }}
                        className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* STEP 4: SKILLS */}
        {activeStep === 'skills' && (
          <div className="space-y-4">
            <div>
              <h4 className="font-heading font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                Skills
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Add relevant technical, functional, or soft skills.
              </p>
            </div>

            <div className="flex space-x-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                className="flex-1 p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button
                onClick={() => handleAddSkill()}
                className="px-4 py-2.5 bg-primary text-white font-semibold text-xs rounded-xl hover:bg-primary/90 transition-colors cursor-pointer"
              >
                Add
              </button>
            </div>

            {resumeData.skills.length > 0 ? (
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex flex-wrap gap-1.5">
                  {resumeData.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 bg-primary/10 text-primary dark:text-primary-light text-xs font-semibold rounded-lg flex items-center space-x-1"
                    >
                      <span>{skill}</span>
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        className="hover:text-rose-500 ml-1 cursor-pointer"
                        title="Remove skill"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No skills added yet.</p>
            )}
          </div>
        )}

        {/* STEP 5: SUMMARY */}
        {activeStep === 'summary' && (
          <div className="space-y-4">
            <div>
              <h4 className="font-heading font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                Professional Summary
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Briefly introduce your expertise, background, and career goals.
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Headline / Current Role (Optional)
              </label>
              <input
                type="text"
                value={resumeData.personalInfo.headline || ''}
                onChange={(e) => updatePersonalInfo('headline', e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Summary Text
              </label>
              <textarea
                rows={4}
                value={resumeData.personalInfo.summary || ''}
                onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        )}

        {/* Stepper Navigation Buttons */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={handlePrevStep}
            disabled={activeStep === 'contact'}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center space-x-1 transition-colors ${
              activeStep === 'contact'
                ? 'opacity-30 border-slate-200 text-slate-400 cursor-not-allowed'
                : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <button
            onClick={handleNextStep}
            disabled={activeStep === 'summary'}
            className={`px-4 py-2 bg-primary hover:bg-primary/90 text-white font-semibold text-xs rounded-xl flex items-center space-x-1.5 shadow-sm transition-all ${
              activeStep === 'summary' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95'
            }`}
          >
            <span>Save & Next</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
