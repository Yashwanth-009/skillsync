import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Splash } from './components/auth/Splash';
import { Login } from './components/auth/Login';
import { Signup } from './components/auth/Signup';
import { Onboarding } from './components/auth/Onboarding';
import { ForgotPassword } from './components/auth/ForgotPassword';
import { HeaderBar } from './components/layout/HeaderBar';
import { BottomNav } from './components/layout/BottomNav';
import { Dashboard } from './components/dashboard/Dashboard';
import { ResumeBuilder } from './components/resume/ResumeBuilder';
import { StudyHubContainer } from './components/studyhub/StudyHubContainer';
import { StudentProfile } from './components/profile/StudentProfile';
import { CareerConnectContainer } from './components/careerconnect/CareerConnectContainer';
import { FloatingMetaAIChat } from './components/chat/FloatingMetaAIChat';
import { ChatWindow } from './components/chat/ChatWindow';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { ToastContainer } from './components/ui/Toast';
import { Offline404Page } from './components/ui/Offline404Page';
import { useAuthStore, getRegisteredAccounts } from './store/useAuthStore';
import { useChatStore } from './store/useChatStore';
import { usePracticeStore } from './store/usePracticeStore';
import { useTimetableStore } from './store/useTimetableStore';
import { supabase } from './services/supabase';

export default function App() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const syncSession = useAuthStore((state) => state.syncSession);
  const resetAuth = useAuthStore((state) => state.resetAuth);

  const [currentScreen, setCurrentScreen] = useState('splash');
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  // Strict Offline Protection: App blocked from running offline, displays only 404 page
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Supabase Auth State Lifecycle & Session Listener
  useEffect(() => {
    if (!supabase) return;

    // Check initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (session?.user) {
        syncSession(session);
      }
    });

    // Listen for OAuth callbacks (Google Redirect) and Auth State Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') && session?.user) {
        await syncSession(session);
        import('./store/useDashboardStore').then(module => {
          module.useDashboardStore.getState().checkAndUpdateStreak();
        });
        setCurrentScreen((prev) => (prev === 'login' || prev === 'signup' || prev === 'splash' ? 'home' : prev));
      } else if (event === 'SIGNED_OUT') {
        resetAuth();
        setCurrentScreen('login');
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [syncSession, resetAuth]);

  useEffect(() => {
    if (user.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [user.darkMode]);

  // Initialize browser history entry on fresh app load
  useEffect(() => {
    if (!window.history.state || !window.history.state.screen) {
      window.history.replaceState({ screen: 'home', subTab: 'hub' }, '');
    }
  }, []);

  // Navigate with browser history tracking so phone back button and gestures work hierarchically
  const navigateTo = (screen, subTab = 'hub', replace = false) => {
    const isSameScreen = screen === currentScreen;
    const currentSubTab = screen === 'timetable'
      ? (useTimetableStore.getState().studyHubSubTab || 'hub')
      : (screen === 'careerconnect' || screen === 'careerguide' || screen === 'doubtmate')
      ? (usePracticeStore.getState().careerConnectTab || 'hub')
      : 'hub';

    if (isSameScreen && currentSubTab === subTab) return;

    if (replace) {
      window.history.replaceState({ screen, subTab }, '');
    } else {
      window.history.pushState({ screen, subTab }, '');
    }
    setCurrentScreen(screen);
    useChatStore.getState().setActiveScreen(screen);

    if (screen === 'timetable') {
      useTimetableStore.getState().setStudyHubSubTab(subTab);
    } else if (screen === 'careerconnect' || screen === 'careerguide' || screen === 'doubtmate') {
      usePracticeStore.getState().setCareerConnectTab(subTab);
    }
  };

  // Popstate listener for phone / browser back buttons and mobile swipe gestures
  useEffect(() => {
    const handlePopState = (e) => {
      // If a modal (like floating chat or camera) handled the popstate, do not change screen
      if (e.state?.modal) return;

      const targetScreen = e.state?.screen;
      const targetSubTab = e.state?.subTab || 'hub';

      if (targetScreen) {
        setCurrentScreen(targetScreen);
        useChatStore.getState().setActiveScreen(targetScreen);

        if (targetScreen === 'timetable') {
          useTimetableStore.getState().setStudyHubSubTab(targetSubTab);
        } else if (targetScreen === 'careerconnect' || targetScreen === 'careerguide' || targetScreen === 'doubtmate') {
          usePracticeStore.getState().setCareerConnectTab(targetSubTab);
        }
      } else if (isAuthenticated && user.isOnboarded) {
        setCurrentScreen('home');
        useChatStore.getState().setActiveScreen('home');
        useTimetableStore.getState().setStudyHubSubTab('hub');
        usePracticeStore.getState().setCareerConnectTab('hub');
      }
    };

    const handleSkilloNavigate = (e) => {
      const targetScreen = e.detail?.screen;
      const targetSubTab = e.detail?.subTab || 'hub';
      if (targetScreen) {
        navigateTo(targetScreen, targetSubTab);
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('skillo_navigate', handleSkilloNavigate);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('skillo_navigate', handleSkilloNavigate);
    };
  }, [isAuthenticated, user.isOnboarded]);

  const careerConnectTab = usePracticeStore((state) => state.careerConnectTab || 'hub');
  const studyHubSubTab = useTimetableStore((state) => state.studyHubSubTab || 'hub');

  const handleBack = () => {
    if (window.history.state?.modal) {
      window.history.back();
      return;
    }

    // 1. If inside Study Hub and on a sub-tab, go back to Study Hub main page
    if (currentScreen === 'timetable') {
      const timetableStore = useTimetableStore.getState();
      if (timetableStore.studyHubSubTab && timetableStore.studyHubSubTab !== 'hub') {
        if (window.history.state?.subTab && window.history.state?.subTab !== 'hub') {
          window.history.back();
        } else {
          timetableStore.setStudyHubSubTab('hub');
        }
        return;
      }
    }

    // 2. If inside Career Connect and on a sub-tab, go back to Career Connect main page
    if (currentScreen === 'careerconnect' || currentScreen === 'careerguide' || currentScreen === 'doubtmate') {
      const practiceStore = usePracticeStore.getState();
      if (practiceStore.careerConnectTab && practiceStore.careerConnectTab !== 'hub') {
        if (window.history.state?.subTab && window.history.state?.subTab !== 'hub') {
          window.history.back();
        } else {
          practiceStore.setCareerConnectTab('hub');
        }
        return;
      }
    }

    // 3. From main pages of tabs, navigate back to previous screen or home
    if (window.history.length > 1 && window.history.state && window.history.state.screen !== 'home') {
      window.history.back();
    } else {
      navigateTo('home', 'hub', false);
    }
  };

  const handleSplashComplete = () => {
    if (isAuthenticated && user.isOnboarded) {
      navigateTo('home', 'hub', true);
    } else {
      // First-time users see Sign Up page first so they can create an account easily;
      // Returning users with existing accounts see Sign In (login).
      const registeredAccounts = getRegisteredAccounts();
      const hasAccount = (registeredAccounts && Object.keys(registeredAccounts).length > 0) || localStorage.getItem('SkillSync_has_account') === 'true';
      if (hasAccount) {
        navigateTo('login', 'hub', true);
      } else {
        navigateTo('signup', 'hub', true);
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigateTo('login', 'hub', true);
  };

  // 1. Mandatory Offline Guard: Display only 404 Error page when offline
  if (!isOnline) {
    return <Offline404Page onRetry={() => setIsOnline(navigator.onLine)} />;
  }

  // 2. Authentication Route Protection Guard
  const PUBLIC_SCREENS = ['splash', 'login', 'signup', 'forgot-password'];
  if (!isAuthenticated && !PUBLIC_SCREENS.includes(currentScreen)) {
    return <Login onNavigate={(screen) => navigateTo(screen)} />;
  }

  // 3. Admin Route Protection Guard (Role-Based Access Control)
  if (currentScreen === 'admin') {
    if (user?.role !== 'admin') {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
            <span className="text-2xl font-bold font-mono">403</span>
          </div>
          <h2 className="text-xl font-bold">Access Denied</h2>
          <p className="text-xs text-slate-400 max-w-xs">
            Administrator privileges required. You do not have permission to view or manage the admin portal.
          </p>
          <button
            onClick={() => navigateTo('home')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl cursor-pointer"
          >
            Return to Dashboard
          </button>
        </div>
      );
    }
  }

  if (currentScreen === 'splash') {
    return <Splash onComplete={handleSplashComplete} />;
  }

  if (currentScreen === 'login') {
    return <Login onNavigate={(screen) => navigateTo(screen)} />;
  }

  if (currentScreen === 'signup') {
    return <Signup onNavigate={(screen) => navigateTo(screen)} />;
  }

  if (currentScreen === 'onboarding') {
    return <Onboarding onComplete={() => navigateTo('home', true)} />;
  }

  if (currentScreen === 'forgot-password') {
    return <ForgotPassword onNavigate={(screen) => navigateTo(screen)} />;
  }

  const studentHeaderSubtitle = [user?.course, user?.institution].filter(Boolean).join(' • ') || 'Student Workspace';

  let careerTitle = 'Career Connect 🧭';
  let careerSubtitle = 'Roadmaps, Projects & Placement Readiness';

  if (careerConnectTab === 'careerguide') {
    careerTitle = 'Career Pathway 🧭';
    careerSubtitle = 'Personalized roadmaps & placement milestones';
  } else if (careerConnectTab === 'jobnotifications') {
    careerTitle = 'Job Notifications 📢';
    careerSubtitle = 'Opportunities tailored to your profile';
  }

  let studyHubTitle = 'Study Hub 📚';
  let studyHubSubtitle = 'Schedule, Practice & Visualizations';

  if (studyHubSubTab === 'timetable') {
    studyHubTitle = 'Weekly Timetable 📅';
    studyHubSubtitle = 'Class matrix & monthly calendar notes';
  } else if (studyHubSubTab === 'mocktests') {
    studyHubTitle = 'Mock Tests 📋';
    studyHubSubtitle = 'Full-length timed exam practice & evaluation';
  } else if (studyHubSubTab === 'quizzes') {
    studyHubTitle = 'Rapid Quizzes ⚡';
    studyHubSubtitle = '5-minute topic practice & instant explanations';
  } else if (studyHubSubTab === 'visualization') {
    studyHubTitle = 'Academic Visualization 📊';
    studyHubSubtitle = 'Subject metrics, CGPA & performance analytics';
  }

  const screenTitles = {
    home: { title: `Good Morning, ${(user?.name && user.name.trim()) ? user.name.trim().split(' ')[0] : 'Student'} 👋`, subtitle: studentHeaderSubtitle },
    careerconnect: { title: careerTitle, subtitle: careerSubtitle },
    careerguide: { title: careerTitle, subtitle: careerSubtitle },
    doubtmate: { title: careerTitle, subtitle: careerSubtitle },
    resume: { title: 'Resume Builder & AI ATS', subtitle: 'Craft templates & get AI feedback' },
    chat: { title: 'Skillo AI Assistant 🎓', subtitle: 'Ask any academic question or study concept' },
    timetable: { title: studyHubTitle, subtitle: studyHubSubtitle },
    profile: { title: 'Student Profile & Badges', subtitle: 'Personal details, skills & achievements' }
  };

  const activeHeader = screenTitles[currentScreen] || screenTitles.home;

  const pageVariants = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
    exit: { opacity: 0, y: -12, transition: { duration: 0.18, ease: 'easeIn' } }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-body antialiased pb-[110px] sm:pb-28 relative">
      {/* Global Toast Notifications Banner */}
      <ToastContainer />

      <HeaderBar
        title={activeHeader.title}
        subtitle={activeHeader.subtitle}
        currentScreen={currentScreen}
        onBack={handleBack}
        onAvatarClick={() => navigateTo('profile')}
      />

      <ErrorBoundary onReset={() => navigateTo('home')}>
        <main className="max-w-md mx-auto px-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentScreen}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
            >
              {currentScreen === 'home' && <Dashboard onNavigate={(tab, subTab = 'hub') => navigateTo(tab, subTab)} />}
              {(currentScreen === 'careerconnect' || currentScreen === 'careerguide' || currentScreen === 'doubtmate') && <CareerConnectContainer />}
              {currentScreen === 'resume' && <ResumeBuilder />}
              {currentScreen === 'timetable' && <StudyHubContainer />}
              {currentScreen === 'chat' && <ChatWindow onBack={() => handleBack()} />}
              {currentScreen === 'profile' && <StudentProfile onLogout={handleLogout} />}
            </motion.div>
          </AnimatePresence>
        </main>
      </ErrorBoundary>

      {/* Persistent Floating Skillo AI Assistant */}
      <ErrorBoundary onReset={() => useChatStore.getState().setFloatingOpen(false)}>
        {currentScreen !== 'chat' && <FloatingMetaAIChat />}
      </ErrorBoundary>

      <BottomNav
        activeTab={currentScreen}
        onTabChange={(tab) => navigateTo(tab, 'hub')}
      />
    </div>
  );
}

