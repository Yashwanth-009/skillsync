import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { credentialManager } from '../../services/credentialManager';

export interface SignInCardProps {
  onNavigate?: (screen: string) => void;
  onLogin?: (credentials: { email: string; password: string; rememberMe: boolean }) => Promise<boolean | void> | boolean | void;
  defaultEmail?: string;
  defaultPassword?: string;
  appName?: string;
}

export function SignInCard({
  onNavigate,
  onLogin,
  defaultEmail = "",
  defaultPassword = "",
  appName = "SkillSync"
}: SignInCardProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState(defaultPassword);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formElement = event.currentTarget as HTMLFormElement;
    setErrorMessage("");
    if (!email.trim() || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setIsLoading(true);
    try {
      if (onLogin) {
        await onLogin({ email: email.trim(), password, rememberMe });
      }
      // Trigger Google Password Manager save prompt
      await credentialManager.saveCredentials(email.trim(), password, '', formElement);
    } catch (err: any) {
      setErrorMessage(err?.message || "Invalid login credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-emerald-50/80 via-slate-50 to-teal-50/60 dark:from-slate-900 dark:via-slate-950 dark:to-emerald-950/30 relative flex items-center justify-center p-4 sm:p-6 transition-colors">
      {/* Soft radial background glows */}
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
          <div className="text-center space-y-2 mb-6 sm:mb-8">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-emerald-600 p-0.5 shadow-lg shadow-emerald-500/25 flex items-center justify-center relative overflow-hidden">
              <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] p-2.5 flex items-center justify-center">
                <img
                  src="/logo.svg"
                  alt={appName}
                  className="w-full h-full object-contain"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/duck-logo.svg'; }}
                />
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight pt-1">
              Welcome Back 👋
            </h1>
            
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              Sign in with your email and password
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-300 text-sm text-center font-medium"
            >
              {errorMessage}
            </motion.div>
          )}

          {/* Login form */}
          <form onSubmit={handleSubmit} method="post" action="#" autoComplete="on" className="space-y-4 sm:space-y-5">
            {/* Email field */}
            <div className="space-y-1.5 text-left">
              <label htmlFor="login-email-ts" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none shrink-0" />
                <input
                  id="login-email-ts"
                  name="username"
                  type="email"
                  autoComplete="username"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-base font-medium text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-emerald-500/15 transition-all"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1.5 text-left">
              <div className="flex items-center justify-between">
                <label htmlFor="login-password-ts" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => onNavigate ? onNavigate('forgot-password') : null}
                  className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-semibold cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative flex items-center">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none shrink-0" />
                <input
                  id="login-password-ts"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-14 pl-12 pr-12 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-base font-medium text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-emerald-500/15 transition-all"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember me checkbox */}
            <div className="flex items-center pt-0.5">
              <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="w-4.5 h-4.5 rounded-md border-slate-300 dark:border-slate-600 text-emerald-600 focus:ring-emerald-500/30 cursor-pointer"
                />
                <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                  Remember me on this device
                </span>
              </label>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-heading font-bold text-base rounded-2xl shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60 mt-4 active:scale-[0.99]"
            >
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span className="text-base font-bold text-white">Signing In...</span>
                  </div>
                ) : (
                  <span className="flex items-center justify-center gap-2 text-base font-bold tracking-wide text-white">
                    <span>Sign In</span>
                    <ArrowRight className="w-5 h-5" />
                  </span>
                )}
              </AnimatePresence>
            </button>

            {/* Sign up link */}
            <p className="text-center text-sm text-slate-500 dark:text-slate-400 pt-2">
              Don't have an account?{' '}
              <button 
                type="button"
                onClick={() => onNavigate ? onNavigate('signup') : null}
                className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer ml-1"
              >
                Sign Up
              </button>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

export const Component = SignInCard;
export default SignInCard;
