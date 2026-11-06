import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase, supabaseAuthService } from '../services/supabase';
import { useToastStore } from './useToastStore';
import { useCareerGuideStore } from './useCareerGuideStore';
import { useResumeStore } from './useResumeStore';
import { usePracticeStore } from './usePracticeStore';
import { useChatStore } from './useChatStore';
import { useTimetableStore } from './useTimetableStore';
import { useDashboardStore } from './useDashboardStore';
import {
  hashPassword,
  verifyPassword,
  sanitizeInput,
  sanitizeEmail,
  isValidEmail,
  authRateLimiter
} from '../lib/security';

const initialUser = {
  id: '',
  studentId: '',
  name: '',
  email: '',
  phone: '',
  institution: '',
  course: '',
  year: '',
  academicYear: '',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka&backgroundColor=06b6d4',
  isOnboarded: false,
  darkMode: false,
  targetGpa: '',
  skills: [],
  createdAt: '',
  role: 'student' // 'student' | 'admin'
};

// Sanitizer for removing any legacy placeholder data
export const sanitizeUserData = (userObj) => {
  if (!userObj) return initialUser;
  const sanitized = { ...userObj };
  if (sanitized.institution === 'Stanford University' || sanitized.institution === 'Stanford') {
    sanitized.institution = '';
  }
  if (sanitized.course === 'Computer Science' && (!sanitized.institution || sanitized.institution === '')) {
    sanitized.course = '';
  }
  return sanitized;
};

// Auto-cleanup legacy mock values in browser localStorage on load
try {
  ['SkillSync_auth_storage', 'SkillSync_auth_storage_v1', 'SkillSync_auth_storage_v2', 'SkillSync_auth_storage_v3', 'SkillSync_auth_storage_v4', 'SkillSync_auth_storage_v5', 'SkillSync_auth_storage_v6', 'SkillSync_auth_storage_v7', 'SkillSync_auth_storage_v8'].forEach((key) => {
    localStorage.removeItem(key);
  });
} catch (e) {
  // Safe ignore in non-browser environments
}

// Persistent Account Registry with HASHED Passwords (No cleartext passwords stored)
export const getRegisteredAccounts = () => {
  try {
    const raw = JSON.parse(localStorage.getItem('SkillSync_accounts_registry') || '{}');
    let changed = false;
    Object.keys(raw).forEach((email) => {
      const acc = raw[email];
      if (acc.institution === 'Stanford University' || acc.institution === 'Stanford') {
        acc.institution = '';
        changed = true;
      }
      if (acc.course === 'Computer Science' && (!acc.institution || acc.institution === '')) {
        acc.course = '';
        changed = true;
      }
      // If legacy plain password exists, purge it
      if (acc.password) {
        delete acc.password;
        changed = true;
      }
    });
    if (changed) {
      localStorage.setItem('SkillSync_accounts_registry', JSON.stringify(raw));
    }
    return raw;
  } catch {
    return {};
  }
};

export const saveRegisteredAccount = async (account) => {
  try {
    const accounts = getRegisteredAccounts();
    const cleanEmail = sanitizeEmail(account.email);
    if (!cleanEmail) return;

    const cleanInst = (account.institution === 'Stanford University' || account.institution === 'Stanford') ? '' : sanitizeInput(account.institution || '');
    const cleanCourse = (account.course === 'Computer Science' && !cleanInst) ? '' : sanitizeInput(account.course || '');
    const createdAt = account.createdAt || accounts[cleanEmail]?.createdAt || new Date().toISOString();

    let passwordHash = account.passwordHash || accounts[cleanEmail]?.passwordHash || '';
    if (account.password) {
      passwordHash = await hashPassword(account.password, cleanEmail);
    }

    accounts[cleanEmail] = {
      ...accounts[cleanEmail],
      id: account.id || accounts[cleanEmail]?.id || ('student_' + Math.random().toString(36).substr(2, 9)),
      name: sanitizeInput(account.name || accounts[cleanEmail]?.name || 'Student'),
      email: cleanEmail,
      passwordHash,
      institution: cleanInst,
      course: cleanCourse,
      role: account.role || accounts[cleanEmail]?.role || 'student',
      createdAt,
      updated_at: new Date().toISOString()
    };
    // Ensure plaintext password is never saved
    delete accounts[cleanEmail].password;

    localStorage.setItem('SkillSync_accounts_registry', JSON.stringify(accounts));
  } catch (e) {
    console.warn('Account registry storage notice:', e);
  }
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: initialUser,
      isAuthenticated: false,
      authLoading: false,

      // Synchronize verified Supabase session & database profile
      syncSession: async (session) => {
        if (!session?.user) {
          set({ isAuthenticated: false, user: initialUser, authLoading: false });
          return null;
        }

        const authUser = session.user;
        const metadata = authUser.user_metadata || {};

        // 1. Extract verified Google OAuth / Supabase Auth identity
        const verifiedEmail = sanitizeEmail(authUser.email);
        const verifiedName = sanitizeInput(metadata.full_name || metadata.name || (verifiedEmail ? verifiedEmail.split('@')[0] : 'Student'));
        const verifiedAvatar = metadata.avatar_url || metadata.picture || initialUser.avatar;
        const accountCreatedAt = authUser.created_at || new Date().toISOString();
        const role = metadata.role || 'student';

        let userState = {
          ...get().user,
          id: authUser.id,
          email: verifiedEmail,
          name: verifiedName,
          avatar: verifiedAvatar,
          createdAt: accountCreatedAt,
          role,
          isOnboarded: true
        };

        // 2. Fetch or create database profile in Supabase profiles table
        if (supabase) {
          try {
            const existingProfile = await supabaseAuthService.getUserProfile(authUser.id);
            if (existingProfile) {
              userState = {
                ...userState,
                name: existingProfile.full_name || existingProfile.name || verifiedName,
                email: verifiedEmail,
                avatar: existingProfile.avatar_url || verifiedAvatar,
                phone: existingProfile.phone || userState.phone,
                institution: existingProfile.institution || userState.institution,
                course: existingProfile.course || userState.course,
                studentId: existingProfile.student_id || userState.studentId,
                academicYear: existingProfile.academic_year || userState.academicYear,
                targetGpa: existingProfile.target_gpa || userState.targetGpa,
                skills: existingProfile.skills || userState.skills,
                role: existingProfile.role || role
              };
            } else {
              await supabaseAuthService.saveUserProfile(authUser.id, {
                name: verifiedName,
                email: verifiedEmail,
                avatar: verifiedAvatar,
                institution: metadata.institution || '',
                course: metadata.course || '',
                role
              });
            }
          } catch (e) {
            console.warn('Profile sync notice:', e);
          }
        }

        set({
          isAuthenticated: true,
          authLoading: false,
          user: userState
        });

        // Isolate and sync user-specific data across all stores
        try {
          usePracticeStore.getState().setUser(authUser.id, verifiedEmail, accountCreatedAt);
          useChatStore.getState().setUser(authUser.id, verifiedEmail, accountCreatedAt);
          useTimetableStore.getState().setUser(authUser.id, verifiedEmail);
          useDashboardStore.getState().setUser(authUser.id, verifiedEmail);
        } catch (e) {
          console.warn('Store user sync notice:', e);
        }

        return userState;
      },

      // 1. Google OAuth Authentication
      loginWithGoogle: async () => {
        set({ authLoading: true });
        try {
          await supabaseAuthService.signInWithGoogle();
          return true;
        } catch (error) {
          set({ authLoading: false });
          const message = error?.message || 'Google authentication failed';
          useToastStore.getState().addToast(message, 'error');
          throw error;
        }
      },

      // 2. Email & Password Login with Rate Limiting & Hashed Password Verification
      login: async (email, password) => {
        const cleanEmail = sanitizeEmail(email);

        if (!isValidEmail(cleanEmail)) {
          const message = 'Please enter a valid email address.';
          useToastStore.getState().addToast(message, 'error');
          throw new Error(message);
        }

        // Apply rate limiting (Max 5 attempts / minute per email)
        const rateCheck = authRateLimiter.isAllowed(cleanEmail);
        if (!rateCheck.allowed) {
          const message = `Too many failed attempts. Please wait ${rateCheck.waitSeconds}s before trying again.`;
          useToastStore.getState().addToast(message, 'error');
          throw new Error(message);
        }

        set({ authLoading: true });

        // Step A: Attempt Supabase online authentication
        try {
          const res = await supabaseAuthService.signInWithEmail(cleanEmail, password);
          if (res?.session) {
            await get().syncSession(res.session);
            await saveRegisteredAccount({ email: cleanEmail, password: password });
            authRateLimiter.reset(cleanEmail);
            useToastStore.getState().addToast(`Welcome back! 🎓`, 'success');
            return true;
          }
        } catch (supabaseError) {
          console.warn('Supabase login fallback:', supabaseError?.message);
        }

        // Step B: Direct credential comparison against PBKDF2/SHA-256 hashed registry
        const accounts = getRegisteredAccounts();
        const savedAccount = accounts[cleanEmail];

        if (savedAccount) {
          const storedHash = savedAccount.passwordHash || savedAccount.password;
          const isMatch = await verifyPassword(password, storedHash, cleanEmail);

          if (isMatch) {
            // Upgrade legacy unhashed password if needed
            if (!savedAccount.passwordHash) {
              await saveRegisteredAccount({ email: cleanEmail, password });
            }

            authRateLimiter.reset(cleanEmail);
            const accountCreatedAt = savedAccount.createdAt || new Date().toISOString();
            const userProfile = {
              ...initialUser,
              id: savedAccount.id || ('student_' + Math.random().toString(36).substr(2, 9)),
              name: savedAccount.name || 'Student',
              email: cleanEmail,
              institution: savedAccount.institution || '',
              course: savedAccount.course || '',
              role: savedAccount.role || 'student',
              createdAt: accountCreatedAt,
              isOnboarded: true
            };

            set({
              user: userProfile,
              isAuthenticated: true,
              authLoading: false
            });

            try {
              useCareerGuideStore.getState().resetGoal();
              useResumeStore.getState().resetResumeAnalysis();
              usePracticeStore.getState().setUser(userProfile.id, cleanEmail, accountCreatedAt);
              useChatStore.getState().setUser(userProfile.id, cleanEmail, accountCreatedAt);
              useTimetableStore.getState().setUser(userProfile.id, cleanEmail);
              useDashboardStore.getState().setUser(userProfile.id, cleanEmail);
              usePracticeStore.getState().setCareerConnectTab('hub');
            } catch (e) {
              console.warn('Store reset notice:', e);
            }

            useToastStore.getState().addToast(`Welcome back, ${savedAccount.name || 'Student'}! 🎓`, 'success');
            return true;
          } else {
            set({ authLoading: false });
            const message = 'Incorrect password. Please verify and try again.';
            useToastStore.getState().addToast(message, 'error');
            throw new Error(message);
          }
        }

        set({ authLoading: false });
        const message = 'Invalid email or password. Please check your credentials or click Sign Up.';
        useToastStore.getState().addToast(message, 'error');
        throw new Error(message);
      },

      // 3. Email & Password Registration (Securely hashed PBKDF2 password)
      signup: async (name, email, password, institution = '', course = '') => {
        const cleanEmail = sanitizeEmail(email);

        if (!isValidEmail(cleanEmail)) {
          const message = 'Please provide a valid email address.';
          useToastStore.getState().addToast(message, 'error');
          throw new Error(message);
        }

        if (!password || password.length < 6) {
          const message = 'Password must be at least 6 characters.';
          useToastStore.getState().addToast(message, 'error');
          throw new Error(message);
        }

        const rateCheck = authRateLimiter.isAllowed(cleanEmail);
        if (!rateCheck.allowed) {
          const message = `Too many attempts. Please wait ${rateCheck.waitSeconds}s.`;
          useToastStore.getState().addToast(message, 'error');
          throw new Error(message);
        }

        set({ authLoading: true });
        const cleanName = sanitizeInput(name) || 'Student';
        const cleanInst = sanitizeInput(institution);
        const cleanCourse = sanitizeInput(course);
        const newUid = 'student_' + Math.random().toString(36).substr(2, 9);
        const accountCreatedAt = new Date().toISOString();

        // Step A: Hash password with user-specific salt
        const passwordHash = await hashPassword(password, cleanEmail);

        await saveRegisteredAccount({
          id: newUid,
          name: cleanName,
          email: cleanEmail,
          passwordHash,
          institution: cleanInst,
          course: cleanCourse,
          role: 'student',
          createdAt: accountCreatedAt
        });

        // Step B: Register with Supabase if configured
        let supabaseSession = null;
        try {
          const res = await supabaseAuthService.signUpWithEmail(cleanEmail, password, {
            name: cleanName,
            institution: cleanInst,
            course: cleanCourse
          });
          if (res?.session) {
            supabaseSession = res.session;
          }
        } catch (supabaseErr) {
          console.warn('Supabase remote registration notice:', supabaseErr?.message);
        }

        if (supabaseSession) {
          await get().syncSession(supabaseSession);
        } else {
          set({
            user: {
              ...initialUser,
              id: newUid,
              name: cleanName,
              email: cleanEmail,
              institution: cleanInst,
              course: cleanCourse,
              role: 'student',
              createdAt: accountCreatedAt,
              isOnboarded: true
            },
            isAuthenticated: true,
            authLoading: false
          });
        }

        try {
          useCareerGuideStore.getState().resetGoal();
          useResumeStore.getState().resetResumeAnalysis();
          usePracticeStore.getState().resetPracticeHistory(newUid, cleanEmail, accountCreatedAt);
          useChatStore.getState().resetChatHistory(newUid, cleanEmail, accountCreatedAt);
          useTimetableStore.getState().setUser(newUid, cleanEmail);
          useDashboardStore.getState().setUser(newUid, cleanEmail);
          usePracticeStore.getState().setCareerConnectTab('hub');
        } catch (e) {
          console.warn('Store reset notice:', e);
        }

        useToastStore.getState().addToast('Account created! Welcome to SkillSync 🎓', 'success');
        return true;
      },

      // 4. Update Profile
      updateProfile: async (updatedFields) => {
        const currentUser = get().user;
        const sanitizedFields = {};
        for (const [k, v] of Object.entries(updatedFields)) {
          sanitizedFields[k] = typeof v === 'string' ? sanitizeInput(v) : v;
        }

        const updatedUser = {
          ...currentUser,
          ...sanitizedFields
        };

        set({ user: updatedUser });

        if (supabase && currentUser.id) {
          await supabaseAuthService.saveUserProfile(currentUser.id, updatedUser);
        }
      },

      // 5. Complete Onboarding
      completeOnboarding: async (onboardingData) => {
        const currentUser = get().user;
        const sanitizedData = {};
        for (const [k, v] of Object.entries(onboardingData)) {
          sanitizedData[k] = typeof v === 'string' ? sanitizeInput(v) : v;
        }

        const updatedUser = {
          ...currentUser,
          ...sanitizedData,
          isOnboarded: true
        };

        set({ user: updatedUser });

        if (supabase && currentUser.id) {
          await supabaseAuthService.saveUserProfile(currentUser.id, updatedUser);
        }
      },

      // 6. Toggle Dark Mode
      toggleDarkMode: () => {
        set((state) => {
          const newMode = !state.user.darkMode;
          if (newMode) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
          return {
            user: { ...state.user, darkMode: newMode }
          };
        });
      },

      // 7. Reset Auth State
      resetAuth: () => {
        set({ isAuthenticated: false, user: initialUser, authLoading: false });
      },

      // 8. Sign Out (Wipes active user session and resets user-scoped data across all stores)
      logout: async () => {
        await supabaseAuthService.signOut();
        get().resetAuth();
        try {
          useCareerGuideStore.getState().resetGoal();
          useResumeStore.getState().resetResumeAnalysis();
          usePracticeStore.getState().resetPracticeHistory('', '', '');
          useChatStore.getState().resetChatHistory('', '', '');
          useTimetableStore.getState().resetTimetable();
          useDashboardStore.getState().resetDashboard();
          usePracticeStore.getState().setCareerConnectTab('hub');
        } catch (e) {
          console.warn('Store reset notice:', e);
        }
        useToastStore.getState().addToast('Signed out successfully', 'info');
      }
    }),
    {
      name: 'SkillSync_auth_storage_v10',
      onRehydrateStorage: () => (state) => {
        if (state && state.user) {
          state.user = sanitizeUserData(state.user);
          if (state.isAuthenticated && state.user.email) {
            const uId = state.user.id || state.user.email;
            const uEmail = state.user.email;
            const uCreatedAt = state.user.createdAt || '';
            try {
              usePracticeStore.getState().setUser(uId, uEmail, uCreatedAt);
              useChatStore.getState().setUser(uId, uEmail, uCreatedAt);
              useTimetableStore.getState().setUser(uId, uEmail);
              useDashboardStore.getState().setUser(uId, uEmail);
            } catch (e) {}
          }
        }
      }
    }
  )
);
