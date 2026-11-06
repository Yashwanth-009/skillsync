import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useToastStore } from './useToastStore';

const initialQuestions = [];
const DEFAULT_AVATAR = 'https://api.dicebear.com/7.x/open-peeps/svg?seed=Student';

export const usePeerSolveStore = create(
  persist(
    (set, get) => ({
      questions: initialQuestions,
      activeCategory: 'All',
      searchQuery: '',
      userStats: {
        credits: 0,
        reputation: 5.0,
        questionsAsked: 0,
        questionsAnswered: 0,
        bestAnswersCount: 0,
        helpfulVotesReceived: 0,
        contributorLevel: 'New Scholar',
        dailyCreditsEarned: 0,
        dailyLimit: 100,
        subjectExpertise: {}
      },

      setActiveCategory: (category) => set({ activeCategory: category }),
      setSearchQuery: (query) => set({ searchQuery: query }),

      earnCredits: (amount, reason = 'activity') => {
        if (amount <= 0) return;
        set((state) => {
          const newCredits = state.userStats.credits + amount;
          const newDaily = (state.userStats.dailyCreditsEarned || 0) + amount;
          return {
            userStats: {
              ...state.userStats,
              credits: newCredits,
              dailyCreditsEarned: newDaily
            }
          };
        });
        useToastStore.getState().addToast(`+${amount} Credits Earned for ${reason}! 🪙`, 'success');
      },

      askQuestion: ({ title, description, branch, subject, topic, attachments = [] }) => {
        const lowerDesc = (title + ' ' + description).toLowerCase();
        let difficulty = 'Basic';
        let maxReward = 5;
        let difficultyColor = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 border-emerald-300';

        if (lowerDesc.includes('derive') || lowerDesc.includes('proof') || lowerDesc.includes('s-parameter') || lowerDesc.includes('kernel')) {
          difficulty = 'Expert';
          maxReward = 30;
          difficultyColor = 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300 border-rose-300';
        } else if (lowerDesc.includes('memory') || lowerDesc.includes('thread') || lowerDesc.includes('complex') || lowerDesc.includes('algorithm')) {
          difficulty = 'Advanced';
          maxReward = 20;
          difficultyColor = 'bg-orange-100 text-orange-800 dark:bg-orange-900/60 dark:text-orange-300 border-orange-300';
        } else if (lowerDesc.includes('how') || lowerDesc.includes('why') || lowerDesc.includes('difference') || lowerDesc.includes('explain')) {
          difficulty = 'Intermediate';
          maxReward = 10;
          difficultyColor = 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300 border-amber-300';
        }

        const newQuestion = {
          id: `q-${Date.now()}`,
          title,
          description,
          branch: branch || 'CSE',
          subject: subject || 'General Academic',
          topic: topic || 'General Topic',
          difficulty,
          difficultyColor,
          maxReward,
          createdAt: 'Just now',
          attachments,
          author: {
            name: 'You (Student)',
            avatar: DEFAULT_AVATAR,
            reputation: get().userStats.reputation,
            contributorLevel: get().userStats.contributorLevel,
            credits: get().userStats.credits
          },
          status: 'Open',
          answers: [],
          acceptedAnswerId: null
        };

        set((state) => ({
          questions: [newQuestion, ...state.questions],
          userStats: {
            ...state.userStats,
            questionsAsked: state.userStats.questionsAsked + 1
          }
        }));

        useToastStore.getState().addToast('Question Posted! Earn credits when peers accept your answers.', 'info');
        return newQuestion;
      },

      addAnswer: (questionId, answerText, attachment = null) => {
        if (!answerText.trim()) return;

        const newAnswer = {
          id: `ans-${Date.now()}`,
          author: {
            name: 'You (Student)',
            avatar: DEFAULT_AVATAR,
            reputation: get().userStats.reputation,
            contributorLevel: get().userStats.contributorLevel,
            credits: get().userStats.credits
          },
          answerText: answerText.trim(),
          attachment,
          createdAt: 'Just now',
          helpfulCount: 0,
          notHelpfulCount: 0,
          rating: 0,
          isAccepted: false
        };

        set((state) => ({
          questions: state.questions.map((q) => {
            if (q.id === questionId) {
              return {
                ...q,
                answers: [...q.answers, newAnswer]
              };
            }
            return q;
          }),
          userStats: {
            ...state.userStats,
            questionsAnswered: state.userStats.questionsAnswered + 1
          }
        }));

        get().earnCredits(5, 'answering peer doubt');
      },

      voteAnswer: (questionId, answerId, type) => {
        set((state) => ({
          questions: state.questions.map((q) => {
            if (q.id === questionId) {
              return {
                ...q,
                answers: q.answers.map((ans) => {
                  if (ans.id === answerId) {
                    const isHelpful = type === 'helpful';
                    const newHelpful = isHelpful ? ans.helpfulCount + 1 : ans.helpfulCount;
                    const newNotHelpful = type === 'notHelpful' ? ans.notHelpfulCount + 1 : ans.notHelpfulCount;

                    if (isHelpful && ans.author?.name?.includes('You')) {
                      get().earnCredits(2, 'helpful vote');
                    }

                    return {
                      ...ans,
                      helpfulCount: newHelpful,
                      notHelpfulCount: newNotHelpful
                    };
                  }
                  return ans;
                })
              };
            }
            return q;
          })
        }));
      },

      acceptAnswer: (questionId, answerId) => {
        const question = get().questions.find((q) => q.id === questionId);
        if (!question) return;

        const targetAns = question.answers.find((a) => a.id === answerId);
        if (!targetAns) return;

        const isUser = targetAns.author?.name?.includes('You');
        let bonusCredits = 0;

        if (isUser) {
          bonusCredits = 10;
          if (targetAns.helpfulCount >= 3) {
            bonusCredits += 5;
          }
          get().earnCredits(bonusCredits, 'accepted answer');
        }

        set((state) => ({
          questions: state.questions.map((q) => {
            if (q.id === questionId) {
              return {
                ...q,
                status: 'Solved',
                acceptedAnswerId: answerId,
                answers: q.answers.map((ans) => ({
                  ...ans,
                  isAccepted: ans.id === answerId
                }))
              };
            }
            return q;
          }),
          userStats: {
            ...state.userStats,
            bestAnswersCount: isUser
              ? state.userStats.bestAnswersCount + 1
              : state.userStats.bestAnswersCount
          }
        }));
      }
    }),
    {
      name: 'SkillSync_peersolve_v3'
    }
  )
);
