import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const BRANCH_CURRICULUM = {
  CSE: {
    'Data Structures': ['Trees & Graphs', 'Arrays & Linked Lists', 'Hashing & Heaps', 'Sorting & Searching'],
    'DBMS': ['SQL Queries', 'Normalization & ER Diagrams', 'Transactions & ACID Properties', 'Indexing & B-Trees'],
    'Operating Systems': ['Process & Threads', 'Memory Management & Paging', 'CPU Scheduling', 'Deadlocks & Synchronization'],
    'Computer Networks': ['TCP/IP 3-Way Handshake', 'OSI Model Layers', 'IP Addressing & Subnetting', 'Routing Algorithms'],
    'AI/ML': ['Neural Networks', 'Supervised Learning', 'Decision Trees & Random Forest', 'Natural Language Processing']
  },
  ECE: {
    'Digital Circuits': ['Logic Gates & Boolean Algebra', 'Combinational Circuits', 'Flip Flops & Counters', 'K-Maps & Logic Minimization'],
    'Signals & Systems': ['Fourier Transform', 'Laplace & Z-Transform', 'Convolution & LTI Systems', 'Sampling Theorem'],
    'Microwave Engineering': ['S-Parameters', 'Waveguides & Cavities', 'Antenna Radiation Patterns', 'Transmission Lines']
  },
  EEE: {
    'Circuit Theory': ['Kirchhoff Laws', 'Mesh & Nodal Analysis', 'Thevenin & Norton Theorems', 'AC Transient Circuits'],
    'Power Systems': ['Power Factor Correction', 'Transformers', 'Transmission Line Parameters', 'Fault Analysis']
  },
  MECH: {
    'Thermodynamics': ['Laws of Thermodynamics', 'Carnot & Otto Cycles', 'Entropy & Enthalpy', 'Steam Turbines & Boilers'],
    'Fluid Mechanics': ['Bernoulli Equation', 'Viscosity & Laminar Flow', 'Pipe Flow & Friction', 'Hydraulic Turbines']
  },
  CIVIL: {
    'Structural Engineering': ['Bending Moment & Shear Force', 'Trusses & Frames', 'Reinforced Concrete Design', 'Stress & Strain Analysis'],
    'Geotechnical Engineering': ['Soil Mechanics & Classification', 'Foundation Load Capacity', 'Permeability & Seepage', 'Shear Strength']
  }
};

export const usePracticeStore = create(
  persist(
    (set, get) => ({
      // Selected career connect sub-tab
      careerConnectTab: 'hub', // 'hub' | 'careerguide'
      setCareerConnectTab: (tab) => set({ careerConnectTab: tab }),
      selectedBranch: 'CSE',
      customBranch: '',
      selectedSubject: 'Data Structures',
      selectedTopic: 'Trees & Graphs',
      customTopic: '',
      activityType: 'mocktest', // 'mocktest' | 'quiz'

      // Mock test configuration
      mockConfig: {
        numQuestions: 10, // 10, 20, 30, 50
        difficulty: 'Medium', // Easy, Medium, Hard, Mixed
        timeLimitMinutes: 15 // 15, 30, 45, 60
      },

      // Quiz configuration
      quizConfig: {
        numQuestions: 5, // 5, 10, 15
        difficulty: 'Easy' // Easy, Medium, Hard, Mixed
      },

      // Active practice runner state
      activeQuestions: [],
      activeBranch: 'CSE',
      activeSubject: 'Data Structures',
      activeTopic: 'Trees & Graphs',
      userAnswers: {}, // { [questionId]: 'A' | 'B' | 'C' | 'D' }
      markedForReview: {}, // { [questionId]: boolean }
      currentQuestionIndex: 0,
      timeRemainingSeconds: 900,
      isTestRunning: false,
      isSubmitted: false,
      lastResult: null,

      // Attempt history (stored attempts per account)
      currentAccountKey: '',
      accountCreatedAt: '',
      attemptsByAccount: {},
      attemptHistory: [],

      // Actions
      setUser: (userId, userEmail, accountCreatedAt) => {
        const userKey = (userEmail || userId || '').trim().toLowerCase();
        const createdAt = accountCreatedAt || '';
        const byAccount = get().attemptsByAccount || {};
        let userAttempts = byAccount[userKey] || [];

        if (createdAt && userAttempts.length > 0) {
          const accountTime = new Date(createdAt).getTime();
          userAttempts = userAttempts.filter((a) => {
            const itemTime = new Date(a.createdAtIso || a.timestamp || 0).getTime();
            return itemTime >= accountTime - 5000;
          });
        }

        set({
          currentAccountKey: userKey,
          accountCreatedAt: createdAt,
          attemptHistory: userAttempts,
          lastResult: userAttempts[0] || null,
          isTestRunning: false,
          isSubmitted: false
        });
      },

      resetPracticeHistory: (userId = '', userEmail = '', accountCreatedAt = '') => {
        const userKey = (userEmail || userId || '').trim().toLowerCase();
        const createdAt = accountCreatedAt || new Date().toISOString();
        const byAccount = { ...(get().attemptsByAccount || {}) };
        if (userKey) {
          byAccount[userKey] = [];
        }

        set({
          currentAccountKey: userKey,
          accountCreatedAt: createdAt,
          attemptHistory: [],
          lastResult: null,
          isTestRunning: false,
          isSubmitted: false,
          activeQuestions: [],
          userAnswers: {},
          markedForReview: {},
          currentQuestionIndex: 0,
          attemptsByAccount: byAccount
        });
      },

      setBranch: (branch) => {
        const isPredefined = Boolean(BRANCH_CURRICULUM[branch]);
        const subjects = isPredefined ? Object.keys(BRANCH_CURRICULUM[branch]) : ['General Fundamentals'];
        const defaultSubject = subjects[0];
        const defaultTopic = isPredefined && BRANCH_CURRICULUM[branch][defaultSubject] ? BRANCH_CURRICULUM[branch][defaultSubject][0] : 'Core Concepts';
        set({
          selectedBranch: branch,
          customBranch: branch,
          selectedSubject: defaultSubject,
          selectedTopic: defaultTopic,
          customTopic: ''
        });
      },

      setCustomBranch: (custom) => set({ customBranch: custom, selectedBranch: custom }),

      setSubject: (subject) => {
        const branch = get().selectedBranch;
        const topics = (BRANCH_CURRICULUM[branch] && BRANCH_CURRICULUM[branch][subject]) || ['Core Concepts'];
        set({
          selectedSubject: subject,
          selectedTopic: topics[0],
          customTopic: ''
        });
      },

      setTopic: (topic) => set({ selectedTopic: topic, customTopic: '' }),
      setCustomTopic: (custom) => set({ customTopic: custom, selectedTopic: custom }),

      setMockConfig: (config) => set((state) => ({ mockConfig: { ...state.mockConfig, ...config } })),
      setQuizConfig: (config) => set((state) => ({ quizConfig: { ...state.quizConfig, ...config } })),

      startPracticeSession: (questions, activityType, timeLimitMinutes = 15, sessionMeta = {}) => {
        const current = get();
        const effectiveBranch = sessionMeta.branch || current.customBranch || current.selectedBranch || 'General Engineering';
        const effectiveSubject = sessionMeta.subject || current.selectedSubject || 'Technical Domain';
        const effectiveTopic = sessionMeta.topic || (current.selectedTopic === 'Custom' ? current.customTopic : current.selectedTopic) || 'Topic Assessment';

        set({
          activeQuestions: questions,
          activityType,
          activeBranch: effectiveBranch,
          activeSubject: effectiveSubject,
          activeTopic: effectiveTopic,
          userAnswers: {},
          markedForReview: {},
          currentQuestionIndex: 0,
          timeRemainingSeconds: timeLimitMinutes * 60,
          isTestRunning: true,
          isSubmitted: false,
          lastResult: null
        });
      },

      selectAnswer: (questionId, optionKey) => {
        set((state) => ({
          userAnswers: {
            ...state.userAnswers,
            [questionId]: optionKey
          }
        }));
      },

      toggleMarkForReview: (questionId) => {
        set((state) => ({
          markedForReview: {
            ...state.markedForReview,
            [questionId]: !state.markedForReview[questionId]
          }
        }));
      },

      setCurrentQuestionIndex: (idx) => set({ currentQuestionIndex: idx }),
      decrementTimer: () => {
        const remaining = get().timeRemainingSeconds;
        if (remaining <= 1) {
          get().submitPracticeSession();
        } else {
          set({ timeRemainingSeconds: remaining - 1 });
        }
      },

      submitPracticeSession: () => {
        const { activeQuestions, userAnswers, activeBranch, activeSubject, activeTopic, selectedBranch, selectedSubject, selectedTopic, customTopic, activityType, timeRemainingSeconds, mockConfig } = get();

        if (activeQuestions.length === 0) {
          set({ isTestRunning: false, isSubmitted: true });
          return;
        }

        let correctCount = 0;
        let incorrectCount = 0;
        let unansweredCount = 0;

        const breakdown = activeQuestions.map((q) => {
          const userAns = userAnswers[q.id];
          const isCorrect = userAns === q.correctAnswer;
          const isUnanswered = !userAns;

          if (isCorrect) correctCount++;
          else if (isUnanswered) unansweredCount++;
          else incorrectCount++;

          return {
            questionId: q.id,
            question: q.question,
            options: q.options,
            userAnswer: userAns || 'Unanswered',
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            isCorrect,
            isUnanswered
          };
        });

        const total = activeQuestions.length;
        const percentage = Math.round((correctCount / total) * 100);
        const timeSpentSeconds = (activityType === 'mocktest' ? mockConfig.timeLimitMinutes * 60 : 300) - timeRemainingSeconds;

        const effectiveTopic = activeTopic || (selectedTopic === 'Custom' ? customTopic || 'Custom Concept' : selectedTopic);
        const effectiveBranch = activeBranch || selectedBranch;
        const effectiveSubject = activeSubject || selectedSubject;

        // Recommendations based on weakness
        let recommendation = '';
        if (percentage >= 80) {
          recommendation = `🌟 Excellent Mastery! Try Harder challenges in ${effectiveSubject}.`;
        } else if (percentage >= 50) {
          recommendation = `👍 Good Progress! Review ${effectiveTopic} explanations to reach 90%+.`;
        } else {
          recommendation = `💡 Target Weak Topic: Practice ${effectiveTopic} fundamentals on Easy mode.`;
        }

        const now = new Date();
        const userKey = get().currentAccountKey || '';
        const result = {
          id: `attempt-${Date.now()}`,
          accountKey: userKey,
          createdAtIso: now.toISOString(),
          timestamp: now.getTime(),
          date: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
          branch: effectiveBranch,
          subject: effectiveSubject,
          topic: effectiveTopic,
          activityType,
          totalQuestions: total,
          correctCount,
          incorrectCount,
          unansweredCount,
          percentage,
          timeSpentSeconds: Math.max(timeSpentSeconds, 10),
          breakdown,
          recommendation
        };

        set((state) => {
          const updatedHistory = [result, ...state.attemptHistory.slice(0, 19)];
          const updatedByAccount = {
            ...state.attemptsByAccount,
            ...(userKey ? { [userKey]: [result, ...((state.attemptsByAccount && state.attemptsByAccount[userKey]) || []).slice(0, 19)] } : {})
          };

          return {
            isTestRunning: false,
            isSubmitted: true,
            lastResult: result,
            attemptHistory: updatedHistory,
            attemptsByAccount: updatedByAccount
          };
        });

        return result;
      },

      resetPracticeSession: () => {
        set({
          isTestRunning: false,
          isSubmitted: false,
          activeQuestions: [],
          userAnswers: {},
          markedForReview: {},
          currentQuestionIndex: 0,
          lastResult: null
        });
      }
    }),
    {
      name: 'SkillSync_practice_store_v2',
      partialize: (state) => ({
        attemptsByAccount: state.attemptsByAccount,
        currentAccountKey: state.currentAccountKey,
        accountCreatedAt: state.accountCreatedAt,
        attemptHistory: state.attemptHistory
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isTestRunning = false;
          state.isSubmitted = false;
          state.activeQuestions = [];
          if (state.currentAccountKey && state.accountCreatedAt) {
            const accountTime = new Date(state.accountCreatedAt).getTime();
            state.attemptHistory = (state.attemptHistory || []).filter((a) => {
              const itemTime = new Date(a.createdAtIso || a.timestamp || 0).getTime();
              return itemTime >= accountTime - 5000;
            });
          }
        }
      }
    }
  )
);
