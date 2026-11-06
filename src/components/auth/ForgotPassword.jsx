import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle2, ArrowRight, Lock, Eye, EyeOff, KeyRound, ShieldCheck, RefreshCw } from 'lucide-react';
import { supabaseAuthService } from '../../services/supabase';
import { useToastStore } from '../../store/useToastStore';
import { credentialManager } from '../../services/credentialManager';
import { saveRegisteredAccount } from '../../store/useAuthStore';

export const ForgotPassword = ({ onNavigate }) => {
  // Step 1: 'email', Step 2: 'otp', Step 3: 'new_password', Step 4: 'success'
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [countdown, setCountdown] = useState(0);

  const addToast = useToastStore((state) => state.addToast);
  const otpInputRefs = useRef([]);

  // Countdown timer for Resend OTP
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const getPasswordStrength = (pass) => {
    if (!pass) return { label: 'None', width: '0%', color: 'bg-slate-200 dark:bg-slate-700' };
    if (pass.length < 6) return { label: 'Weak', width: '33%', color: 'bg-rose-500' };
    if (pass.length < 10) return { label: 'Medium', width: '66%', color: 'bg-amber-500' };
    return { label: 'Strong', width: '100%', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(newPassword);

  // Step 1: Send OTP to Email
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      await supabaseAuthService.sendPasswordResetOtp(email.trim());
      addToast('6-digit OTP sent to your email!', 'success');
      setStep(2);
      setCountdown(60);
    } catch (err) {
      setErrorMessage(err?.message || 'Failed to send OTP. Please check your email address.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Handle OTP input typing and pasting
  const handleOtpChange = (index, value) => {
    const val = value.replace(/[^0-9]/g, '');
    const newOtp = [...otp];

    if (val.length > 1) {
      // Pasted full 6-digit code
      const pasted = val.slice(0, 6).split('');
      pasted.forEach((char, idx) => {
        if (idx < 6) newOtp[idx] = char;
      });
      setOtp(newOtp);
      const nextIdx = Math.min(pasted.length, 5);
      otpInputRefs.current[nextIdx]?.focus();
      return;
    }

    newOtp[index] = val;
    setOtp(newOtp);

    // Auto advance to next input
    if (val && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    const token = otp.join('');
    if (token.length !== 6) {
      setErrorMessage('Please enter the complete 6-digit OTP code.');
      return;
    }

    setIsLoading(true);
    try {
      await supabaseAuthService.verifyOtp(email.trim(), token);
      addToast('OTP verified successfully! Now set your new password.', 'success');
      setStep(3);
    } catch (err) {
      setErrorMessage('Invalid or expired OTP code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Update Password
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    const formElement = e.currentTarget;
    setErrorMessage('');

    if (newPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      try {
        await supabaseAuthService.updatePassword(newPassword);
      } catch (remoteErr) {
        console.warn('Remote password update note:', remoteErr?.message);
      }
      // Save password update into persistent registry with PBKDF2 hash
      await saveRegisteredAccount({ email: email.trim(), password: newPassword });
      // Trigger Google Password Manager update/save prompt for changed password
      await credentialManager.saveCredentials(email.trim(), newPassword, '', formElement);
      addToast('Password updated successfully!', 'success');
      setStep(4);
    } catch (err) {
      setErrorMessage(err?.message || 'Failed to update password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-emerald-50/80 via-slate-50 to-teal-50/60 dark:from-slate-900 dark:via-slate-950 dark:to-emerald-950/30 relative flex items-center justify-center p-4 sm:p-6 transition-colors">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full max-w-2xl h-80 rounded-b-[50%] bg-emerald-400/15 dark:bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-teal-300/20 dark:bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10 my-auto"
      >
        <div className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-emerald-100 dark:border-emerald-900/40 shadow-2xl shadow-emerald-600/10">
          {/* Back button */}
          {step !== 4 && (
            <button
              onClick={() => {
                if (step > 1) {
                  setStep((prev) => prev - 1);
                  setErrorMessage('');
                } else {
                  onNavigate('login');
                }
              }}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline transition-colors mb-4 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" />
              <span>{step === 1 ? 'Back to Sign In' : 'Go Back'}</span>
            </button>
          )}

          {/* Header Icon */}
          <div className="text-center space-y-2 mb-6">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-emerald-600 p-0.5 shadow-lg shadow-emerald-500/25 flex items-center justify-center relative overflow-hidden">
              <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] p-2.5 flex items-center justify-center">
                {step === 1 && <img src="/logo.svg" alt="SkillSync" className="w-full h-full object-contain" onError={(e) => { e.currentTarget.src = '/duck-logo.svg'; }} />}
                {step === 2 && <KeyRound className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />}
                {step === 3 && <Lock className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />}
                {step === 4 && <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />}
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight pt-1">
              {step === 1 && 'Reset Password 🔑'}
              {step === 2 && 'Enter 6-Digit OTP 📩'}
              {step === 3 && 'Set New Password 🔒'}
              {step === 4 && 'Password Changed! 🎉'}
            </h1>

            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">
              {step === 1 && 'Enter your registered email to receive a 6-digit OTP verification code'}
              {step === 2 && `We sent a 6-digit verification code to ${email}`}
              {step === 3 && 'Create and confirm your strong new account password'}
              {step === 4 && 'Your password has been securely updated. You can now sign in.'}
            </p>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-300 text-sm text-center font-medium"
            >
              {errorMessage}
            </motion.div>
          )}

          {/* STEP 1: Enter Email */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} method="post" action="#" autoComplete="on" className="space-y-4 sm:space-y-5">
              <div className="space-y-1.5 text-left">
                <label htmlFor="reset-email" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none shrink-0" />
                  <input
                    id="reset-email"
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

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-heading font-bold text-base rounded-2xl shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60 mt-4 active:scale-[0.99]"
              >
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span className="text-base font-bold text-white">Sending OTP...</span>
                    </div>
                  ) : (
                    <span className="flex items-center justify-center gap-2 text-base font-bold tracking-wide text-white">
                      <span>Send 6-Digit OTP</span>
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  )}
                </AnimatePresence>
              </button>
            </form>
          )}

          {/* STEP 2: Enter & Verify 6-Digit OTP */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="space-y-2 text-left">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    6-Digit Verification Code
                  </label>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-semibold cursor-pointer"
                  >
                    Change Email
                  </button>
                </div>

                {/* 6 OTP Boxes */}
                <div className="grid grid-cols-6 gap-2 sm:gap-2.5">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => (otpInputRefs.current[idx] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className="w-full h-14 text-center text-xl sm:text-2xl font-extrabold bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-emerald-500/15 transition-all shadow-inner"
                    />
                  ))}
                </div>
              </div>

              {/* Resend Code */}
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-500 dark:text-slate-400">
                  Didn't receive the code?
                </span>
                {countdown > 0 ? (
                  <span className="font-semibold text-slate-400">
                    Resend in {countdown}s
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSendOtp()}
                    className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Resend OTP</span>
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || otp.join('').length !== 6}
                className="w-full h-14 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-heading font-bold text-base rounded-2xl shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60 mt-4 active:scale-[0.99]"
              >
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span className="text-base font-bold text-white">Verifying...</span>
                    </div>
                  ) : (
                    <span className="flex items-center justify-center gap-2 text-base font-bold tracking-wide text-white">
                      <span>Verify OTP Code</span>
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  )}
                </AnimatePresence>
              </button>
            </form>
          )}

          {/* STEP 3: Set New Password */}
          {step === 3 && (
            <form onSubmit={handleUpdatePassword} method="post" action="#" autoComplete="on" className="space-y-4 sm:space-y-5">
              {/* Hidden Email field for browser keychain association */}
              <input type="hidden" name="username" autoComplete="username" value={email} />

              {/* New Password */}
              <div className="space-y-1.5 text-left">
                <label htmlFor="reset-new-password" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  New Password
                </label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none shrink-0" />
                  <input
                    id="reset-new-password"
                    name="new-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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
              {newPassword && (
                <div className="flex items-center space-x-2 px-1">
                  <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className={`h-full ${strength.color} transition-all`} style={{ width: strength.width }} />
                  </div>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{strength.label}</span>
                </div>
              )}

              {/* Confirm Password */}
              <div className="space-y-1.5 text-left">
                <label htmlFor="reset-confirm-password" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Confirm New Password
                </label>
                <div className="relative flex items-center">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none shrink-0" />
                  <input
                    id="reset-confirm-password"
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

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-heading font-bold text-base rounded-2xl shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60 mt-4 active:scale-[0.99]"
              >
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span className="text-base font-bold text-white">Updating Password...</span>
                    </div>
                  ) : (
                    <span className="flex items-center justify-center gap-2 text-base font-bold tracking-wide text-white">
                      <span>Update Password</span>
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  )}
                </AnimatePresence>
              </button>
            </form>
          )}

          {/* STEP 4: Success Screen */}
          {step === 4 && (
            <div className="text-center space-y-5 pt-2">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xs mx-auto leading-relaxed">
                Your account password has been updated. You can now sign in with your new password.
              </p>
              <button
                onClick={() => onNavigate('login')}
                className="w-full h-14 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-heading font-bold text-base rounded-2xl shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-[0.99]"
              >
                <span>Sign In to Your Account</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
