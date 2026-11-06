import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Building, BookOpen, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { credentialManager } from '../../services/credentialManager';

export const Signup = ({ onNavigate }) => {
  const signup = useAuthStore((state) => state.signup);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [course, setCourse] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [institution, setInstitution] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const getPasswordStrength = (pass) => {
    if (!pass) return { label: 'None', width: '0%', color: 'bg-slate-200 dark:bg-slate-700' };
    if (pass.length < 6) return { label: 'Weak', width: '33%', color: 'bg-rose-500' };
    if (pass.length < 10) return { label: 'Medium', width: '66%', color: 'bg-amber-500' };
    return { label: 'Strong', width: '100%', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formElement = e.currentTarget;
    setErrorMessage('');
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      const success = await signup(
        fullName.trim() || 'New Student',
        email.trim(),
        password,
        institution.trim(),
        course.trim()
      );
      if (success) {
        localStorage.setItem('SkillSync_has_account', 'true');
        // Trigger Google Password Manager save prompt for new account
        await credentialManager.saveCredentials(email.trim(), password, fullName.trim(), formElement);
        onNavigate('onboarding');
      }
    } catch (err) {
      setErrorMessage(err?.message || 'Failed to create account.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-emerald-50/80 via-slate-50 to-teal-50/60 dark:from-slate-900 dark:via-slate-950 dark:to-emerald-950/30 relative flex items-center justify-center p-4 sm:p-6 transition-colors">
      {/* Soft background glows */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full max-w-2xl h-80 rounded-b-[50%] bg-emerald-400/15 dark:bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-teal-300/20 dark:bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10 my-auto"
      >
        <div className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-emerald-100 dark:border-emerald-900/40 shadow-2xl shadow-emerald-600/10">
          {/* Header with App Logo */}
          <div className="text-center space-y-2 mb-6">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-emerald-600 p-0.5 shadow-lg shadow-emerald-500/25 flex items-center justify-center relative overflow-hidden">
              <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] p-2.5 flex items-center justify-center">
                <img
                  src="/logo.svg"
                  alt="SkillSync"
                  className="w-full h-full object-contain"
                  onError={(e) => { e.currentTarget.src = '/duck-logo.svg'; }}
                />
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight pt-1">
              Create Account 🎓
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              Enter your details to register as a student
            </p>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="mb-5 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-300 text-sm text-center font-medium">
              {errorMessage}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} method="post" action="#" autoComplete="on" className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5 text-left">
              <label htmlFor="signup-name" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Full Name
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none shrink-0" />
                <input
                  id="signup-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-base font-medium text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-emerald-500/15 transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5 text-left">
              <label htmlFor="signup-email" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none shrink-0" />
                <input
                  id="signup-email"
                  name="username"
                  type="email"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-base font-medium text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-emerald-500/15 transition-all"
                />
              </div>
            </div>

            {/* Institution */}
            <div className="space-y-1.5 text-left">
              <label htmlFor="signup-institution" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Institution / College Name
              </label>
              <div className="relative flex items-center">
                <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none shrink-0" />
                <input
                  id="signup-institution"
                  name="organization"
                  type="text"
                  autoComplete="organization"
                  required
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-base font-medium text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-emerald-500/15 transition-all"
                />
              </div>
            </div>

            {/* Course */}
            <div className="space-y-1.5 text-left">
              <label htmlFor="major" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Course
              </label>
              <div className="relative flex items-center">
                <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none shrink-0" />
                <input
                  id="signup-course"
                  name="course"
                  type="text"
                  required
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-base font-medium text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-emerald-500/15 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5 text-left">
              <label htmlFor="signup-password" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Create Password
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none shrink-0" />
                <input
                  id="signup-password"
                  name="new-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-14 pl-12 pr-12 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-base font-medium text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-emerald-500/15 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Password Strength Indicator */}
            {password && (
              <div className="flex items-center space-x-2 px-1">
                <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className={`h-full ${strength.color} transition-all`} style={{ width: strength.width }} />
                </div>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{strength.label}</span>
              </div>
            )}

            {/* Confirm Password */}
            <div className="space-y-1.5 text-left">
              <label htmlFor="signup-confirm-password" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Confirm Password
              </label>
              <div className="relative flex items-center">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none shrink-0" />
                <input
                  id="signup-confirm-password"
                  name="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-base font-medium text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-emerald-500/15 transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-heading font-bold text-base rounded-2xl shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60 mt-5 active:scale-[0.99]"
            >
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span className="text-base font-bold text-white">Creating Account...</span>
                  </div>
                ) : (
                  <span className="flex items-center justify-center gap-2 text-base font-bold tracking-wide text-white">
                    <span>Create Account & Start Learning</span>
                    <ArrowRight className="w-5 h-5" />
                  </span>
                )}
              </AnimatePresence>
            </button>

            {/* Login link */}
            <p className="text-center text-sm text-slate-500 dark:text-slate-400 pt-2">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer ml-1"
              >
                Log In
              </button>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
