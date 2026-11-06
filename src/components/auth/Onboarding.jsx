import React, { useState } from 'react';
import { Camera, Check, ArrowRight, BookOpen, GraduationCap, Sparkles } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export const Onboarding = ({ onComplete }) => {
  const user = useAuthStore((state) => state.user);
  const completeOnboarding = useAuthStore((state) => state.completeOnboarding);

  const cleanInst = (user.institution === 'Stanford University' || user.institution === 'Stanford') ? '' : (user.institution || '');
  const cleanCourse = (user.course === 'Computer Science' && (!cleanInst || cleanInst === '')) ? '' : (user.course || '');

  const [step, setStep] = useState(1);
  const [avatar, setAvatar] = useState(user.avatar);
  const [course, setCourse] = useState(cleanCourse);
  const [year, setYear] = useState(user.year || 'Year 1 (Freshman)');
  const [university, setUniversity] = useState(cleanInst);
  const [selectedInterests, setSelectedInterests] = useState(['Academics', 'Career', 'AI Help']);

  const interestsList = [
    'Academics', 'Career', 'Scheduling', 'AI Help',
    'Resume Building', 'Exam Prep', 'Coding', 'Networking'
  ];

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      completeOnboarding({
        avatar,
        course,
        year,
        institution: university,
        interests: selectedInterests
      });
      onComplete();
    }
  };

  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatar(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-slate-900 flex flex-col justify-between p-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <img src="/logo.svg" alt="SkillSync" className="w-full h-full object-contain rounded-md" onError={(e) => { e.currentTarget.src = '/duck-logo.svg'; }} />
          </div>
          <span className="font-heading font-bold text-slate-900 dark:text-white text-sm">Onboarding Setup</span>
        </div>
        <button
          onClick={onComplete}
          className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-white"
        >
          Skip
        </button>
      </div>

      {/* Progress Dots */}
      <div className="flex justify-center space-x-2 my-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === step ? 'w-8 bg-primary' : 'w-2 bg-slate-200 dark:bg-slate-700'
            }`}
          />
        ))}
      </div>

      {/* Wizard Step Content */}
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        {step === 1 && (
          <div className="text-center space-y-6">
            <div>
              <h3 className="font-heading font-extrabold text-2xl text-slate-900 dark:text-white">
                Customize Profile 📸
              </h3>
              <p className="text-xs text-slate-500 mt-1">Upload a photo so your classmates and AI tutor recognize you</p>
            </div>

            <div className="relative w-28 h-28 mx-auto">
              <img
                src={avatar}
                alt="Avatar Preview"
                className="w-full h-full object-cover rounded-full ring-4 ring-primary/20 shadow-md"
              />
              <label className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg cursor-pointer hover:bg-primary-light transition-colors">
                <Camera className="w-4 h-4" />
                <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={user.name}
                readOnly
                className="w-full text-center py-2 px-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm font-semibold text-slate-900 dark:text-white"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="font-heading font-extrabold text-2xl text-slate-900 dark:text-white">
                Academic Details 🎓
              </h3>
              <p className="text-xs text-slate-500 mt-1">Help us tailor your timetable and resume templates</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Course
              </label>
              <div className="relative">
                <BookOpen className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder=""
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Year of Study
              </label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option>Year 1 (Freshman)</option>
                <option>Year 2 (Sophomore)</option>
                <option>Year 3 (Junior)</option>
                <option>Year 4 (Senior)</option>
                <option>Postgraduate / Masters</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                University / College
              </label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder=""
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 text-center">
            <div>
              <h3 className="font-heading font-extrabold text-2xl text-slate-900 dark:text-white">
                Select Your Focus 🚀
              </h3>
              <p className="text-xs text-slate-500 mt-1">What are you most interested in exploring first?</p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-2">
              {interestsList.map((item) => {
                const selected = selectedInterests.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleInterest(item)}
                    className={`py-3 px-3 rounded-2xl text-xs font-semibold flex items-center justify-between border transition-all ${
                      selected
                        ? 'bg-primary text-white border-primary shadow-sm'
                        : 'bg-surface dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-primary'
                    }`}
                  >
                    <span>{item}</span>
                    {selected && <Check className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation Button */}
      <div className="pt-6 max-w-sm mx-auto w-full">
        <button
          onClick={handleNext}
          className="w-full py-3.5 bg-primary text-white font-heading font-semibold rounded-2xl shadow-lg hover:bg-primary-light active:scale-95 transition-all flex items-center justify-center space-x-2"
        >
          <span>{step === 3 ? 'Finish & Launch 🦆' : 'Next Step'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
