import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Building2, BookOpen, Save, Check, AlertCircle, IdCard, Calendar } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useProfileStore } from '../../store/useProfileStore';

export const PersonalDetailsCard = () => {
  const user = useAuthStore((state) => state.user);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const isEditing = useProfileStore((state) => state.isEditing);
  const setEditMode = useProfileStore((state) => state.setEditMode);

  const cleanInst = (user.institution === 'Stanford University' || user.institution === 'Stanford') ? '' : (user.institution || '');
  const cleanCourse = (user.course === 'Computer Science' && (!cleanInst || cleanInst === '')) ? '' : (user.course || '');

  const nameParts = (user.name || '').split(' ');
  const [formData, setFormData] = useState({
    firstName: nameParts[0] || '',
    lastName: nameParts.slice(1).join(' ') || '',
    email: user.email || '',
    phone: user.phone || '',
    institution: cleanInst,
    course: cleanCourse,
    studentId: user.studentId || '',
    academicYear: user.academicYear || ''
  });

  const [errors, setErrors] = useState({});
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const cInst = (user.institution === 'Stanford University' || user.institution === 'Stanford') ? '' : (user.institution || '');
    const cCourse = (user.course === 'Computer Science' && (!cInst || cInst === '')) ? '' : (user.course || '');
    const nParts = (user.name || '').split(' ');
    setFormData({
      firstName: nParts[0] || '',
      lastName: nParts.slice(1).join(' ') || '',
      email: user.email || '',
      phone: user.phone || '',
      institution: cInst,
      course: cCourse,
      studentId: user.studentId || '',
      academicYear: user.academicYear || ''
    });
    setErrors({});
  }, [user, isEditing]);

  const validateField = (name, value) => {
    let errorMsg = '';
    const trimmed = (value || '').trim();

    if (name === 'email' && trimmed) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
        errorMsg = 'Please enter a valid email format';
      }
    }

    return errorMsg;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear field error on change if valid
    const err = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: err }));
  };

  const handleSave = (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const err = validateField(key, formData[key]);
      if (err) newErrors[key] = err;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Save profile details
    updateProfile({
      ...formData,
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      email: user.email || formData.email
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setEditMode(false);
    }, 800);
  };

  return (
    <div className="bg-surface dark:bg-slate-800 rounded-3xl p-5 border border-emerald-100 dark:border-slate-700 shadow-card space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700">
        <h3 className="font-heading font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
          <User className="w-4 h-4 text-primary" />
          <span>Personal & Academic Overview</span>
        </h3>
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="space-y-3">
          {/* Name & Surname */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full p-2.5 bg-slate-50 dark:bg-slate-900 border rounded-xl text-xs font-semibold ${
                  errors.firstName
                    ? 'border-rose-500 bg-rose-50/30 text-rose-900 dark:text-rose-200 focus:ring-rose-500'
                    : 'border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white'
                }`}
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Surname
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full p-2.5 bg-slate-50 dark:bg-slate-900 border rounded-xl text-xs font-semibold ${
                  errors.lastName
                    ? 'border-rose-500 bg-rose-50/30 text-rose-900 dark:text-rose-200 focus:ring-rose-500'
                    : 'border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white'
                }`}
              />
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  Email Address
                </label>
                {user.email && (
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    Primary Account
                  </span>
                )}
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                readOnly={Boolean(user.email)}
                onChange={handleChange}
                className={`w-full p-2.5 bg-slate-50 dark:bg-slate-900 border rounded-xl text-xs font-semibold ${
                  user.email ? 'opacity-80 cursor-not-allowed bg-slate-100 dark:bg-slate-850' : ''
                } ${
                  errors.email
                    ? 'border-rose-500 bg-rose-50/30 text-rose-900 dark:text-rose-200'
                    : 'border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white'
                }`}
              />
              {errors.email && (
                <span className="text-rose-500 dark:text-rose-400 text-[10px] font-bold flex items-center space-x-1 mt-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{errors.email}</span>
                </span>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full p-2.5 bg-slate-50 dark:bg-slate-900 border rounded-xl text-xs font-semibold ${
                  errors.phone
                    ? 'border-rose-500 bg-rose-50/30 text-rose-900 dark:text-rose-200'
                    : 'border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white'
                }`}
              />
              {errors.phone && (
                <span className="text-rose-500 dark:text-rose-400 text-[10px] font-bold flex items-center space-x-1 mt-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{errors.phone}</span>
                </span>
              )}
            </div>
          </div>

          {/* Student ID No & Academic Year */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Student ID No.
              </label>
              <input
                type="text"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                className={`w-full p-2.5 bg-slate-50 dark:bg-slate-900 border rounded-xl text-xs font-semibold ${
                  errors.studentId
                    ? 'border-rose-500 bg-rose-50/30 text-rose-900 dark:text-rose-200'
                    : 'border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white'
                }`}
              />
              {errors.studentId && (
                <span className="text-rose-500 dark:text-rose-400 text-[10px] font-bold flex items-center space-x-1 mt-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{errors.studentId}</span>
                </span>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Academic Year
              </label>
              <input
                type="text"
                name="academicYear"
                value={formData.academicYear}
                onChange={handleChange}
                className={`w-full p-2.5 bg-slate-50 dark:bg-slate-900 border rounded-xl text-xs font-semibold ${
                  errors.academicYear
                    ? 'border-rose-500 bg-rose-50/30 text-rose-900 dark:text-rose-200'
                    : 'border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white'
                }`}
              />
              {errors.academicYear && (
                <span className="text-rose-500 dark:text-rose-400 text-[10px] font-bold flex items-center space-x-1 mt-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{errors.academicYear}</span>
                </span>
              )}
            </div>
          </div>

          {/* Institution & Course */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                University / Institution
              </label>
              <input
                type="text"
                name="institution"
                value={formData.institution}
                onChange={handleChange}
                className={`w-full p-2.5 bg-slate-50 dark:bg-slate-900 border rounded-xl text-xs font-semibold ${
                  errors.institution
                    ? 'border-rose-500 bg-rose-50/30 text-rose-900 dark:text-rose-200'
                    : 'border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white'
                }`}
              />
              {errors.institution && (
                <span className="text-rose-500 dark:text-rose-400 text-[10px] font-bold flex items-center space-x-1 mt-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{errors.institution}</span>
                </span>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Course
              </label>
              <input
                type="text"
                name="course"
                value={formData.course}
                onChange={handleChange}
                className={`w-full p-2.5 bg-slate-50 dark:bg-slate-900 border rounded-xl text-xs font-semibold ${
                  errors.course
                    ? 'border-rose-500 bg-rose-50/30 text-rose-900 dark:text-rose-200'
                    : 'border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white'
                }`}
              />
              {errors.course && (
                <span className="text-rose-500 dark:text-rose-400 text-[10px] font-bold flex items-center space-x-1 mt-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{errors.course}</span>
                </span>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-primary text-white font-heading font-semibold text-xs rounded-xl shadow hover:bg-primary-light flex items-center justify-center space-x-1.5 mt-3"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>All Details Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Details</span>
              </>
            )}
          </button>
        </form>
      ) : (
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 font-semibold uppercase flex items-center space-x-1">
              <User className="w-3 h-3 text-primary" />
              <span>Full Name</span>
            </span>
            <span className="font-bold text-slate-900 dark:text-white truncate block mt-1">
              {user.name || <span className="text-slate-400 font-normal italic text-[11px]">Not set</span>}
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 font-semibold uppercase flex items-center space-x-1">
              <Mail className="w-3 h-3 text-primary" />
              <span>Email Address</span>
            </span>
            <span className="font-bold text-slate-900 dark:text-white truncate block mt-1">
              {user.email || <span className="text-slate-400 font-normal italic text-[11px]">Not set</span>}
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 font-semibold uppercase flex items-center space-x-1">
              <Phone className="w-3 h-3 text-primary" />
              <span>Phone Number</span>
            </span>
            <span className="font-bold text-slate-900 dark:text-white truncate block mt-1">
              {user.phone || <span className="text-slate-400 font-normal italic text-[11px]">Not set</span>}
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 font-semibold uppercase flex items-center space-x-1">
              <IdCard className="w-3 h-3 text-primary" />
              <span>Student ID No.</span>
            </span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 truncate block mt-1">
              {user.studentId || <span className="text-slate-400 font-normal italic text-[11px]">Not set</span>}
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 font-semibold uppercase flex items-center space-x-1">
              <Calendar className="w-3 h-3 text-primary" />
              <span>Academic Year</span>
            </span>
            <span className="font-bold text-slate-900 dark:text-white truncate block mt-1">
              {user.academicYear || <span className="text-slate-400 font-normal italic text-[11px]">Not set</span>}
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 font-semibold uppercase flex items-center space-x-1">
              <Building2 className="w-3 h-3 text-primary" />
              <span>University / Institution</span>
            </span>
            <span className="font-bold text-slate-900 dark:text-white truncate block mt-1">
              {user.institution || <span className="text-slate-400 font-normal italic text-[11px]">Not set</span>}
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-800 col-span-2">
            <span className="text-[10px] text-slate-400 font-semibold uppercase flex items-center space-x-1">
              <BookOpen className="w-3 h-3 text-primary" />
              <span>Course</span>
            </span>
            <span className="font-bold text-slate-900 dark:text-white truncate block mt-1">
              {user.course || <span className="text-slate-400 font-normal italic text-[11px]">Not set</span>}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
