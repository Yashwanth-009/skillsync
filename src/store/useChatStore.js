import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { askGemini, DEFAULT_GEMINI_KEY } from '../services/gemini';
import { useToastStore } from './useToastStore';

const initialWelcomeMsg = {
  id: 'msg-welcome',
  sender: 'ai',
  text: "Hello! I'm Skillo 🎓. I'm here to help you solve math step-by-step, explain programming & code, answer academic questions accurately, and manage your study goals. What would you like to learn or solve today?",
  timestamp: 'Just now'
};

const createDefaultSession = (createdAtIso = null) => {
  const id = `session-${Date.now()}`;
  const now = new Date();
  return {
    id,
    tag: 'General Discussion',
    createdAt: now.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }),
    createdAtIso: createdAtIso || now.toISOString(),
    messages: [initialWelcomeMsg]
  };
};

const defaultInitialSession = createDefaultSession();

function summarizeQuestion(text, hasImage = false) {
  if (!text || !text.trim()) {
    return hasImage ? 'Photo Problem' : 'Study Question';
  }

  let clean = text
    .replace(/\[Uploaded Document:[^\]]+\]/gi, '')
    .replace(/\[ACTION:[^\]]+\]/gi, '')
    .replace(/^(?:hello|hi|hey|please|can you please|can you|could you|help me with|explain to me|tell me about|what is|how to)\s+/i, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!clean) {
    clean = text.trim();
  }

  clean = clean.charAt(0).toUpperCase() + clean.slice(1);

  if (clean.length > 36) {
    const truncated = clean.slice(0, 36);
    const lastSpace = truncated.lastIndexOf(' ');
    clean = (lastSpace > 20 ? truncated.slice(0, lastSpace) : truncated) + '...';
  }

  return clean || 'Study Question';
}

export const useChatStore = create(
  persist(
    (set, get) => ({
      sessions: [defaultInitialSession],
      activeSessionId: defaultInitialSession.id,
      messages: defaultInitialSession.messages,
      isTyping: false,
      aiState: 'idle', // 'idle' | 'scanning' | 'thinking' | 'solving' | 'complete'
      progressStep: '',
      apiKey: DEFAULT_GEMINI_KEY,
      isFloatingOpen: false,
      isExpanded: false,
      activeScreen: 'home',

      // Account history isolation state
      currentAccountKey: '',
      accountCreatedAt: '',
      sessionsByAccount: {},

      setUser: (userId, userEmail, accountCreatedAt) => {
        const userKey = (userEmail || userId || '').trim().toLowerCase();
        const createdAt = accountCreatedAt || '';
        const byAccount = get().sessionsByAccount || {};
        let userSessions = byAccount[userKey];

        if (Array.isArray(userSessions) && userSessions.length > 0) {
          if (createdAt) {
            const accountTime = new Date(createdAt).getTime();
            userSessions = userSessions.filter((s) => {
              const sessionTime = new Date(s.createdAtIso || 0).getTime();
              return sessionTime >= accountTime - 5000;
            });
          }
        }

        if (!Array.isArray(userSessions) || userSessions.length === 0) {
          const fresh = createDefaultSession(createdAt || new Date().toISOString());
          userSessions = [fresh];
        }

        set({
          currentAccountKey: userKey,
          accountCreatedAt: createdAt,
          sessions: userSessions,
          activeSessionId: userSessions[0].id,
          messages: userSessions[0].messages || [],
          isTyping: false,
          aiState: 'idle',
          progressStep: '',
          sessionsByAccount: userKey ? { ...byAccount, [userKey]: userSessions } : byAccount
        });
      },

      resetChatHistory: (userId = '', userEmail = '', accountCreatedAt = '') => {
        const userKey = (userEmail || userId || '').trim().toLowerCase();
        const createdAt = accountCreatedAt || new Date().toISOString();
        const fresh = createDefaultSession(createdAt);
        const byAccount = { ...(get().sessionsByAccount || {}) };
        if (userKey) {
          byAccount[userKey] = [fresh];
        }

        set({
          currentAccountKey: userKey,
          accountCreatedAt: createdAt,
          sessions: [fresh],
          activeSessionId: fresh.id,
          messages: fresh.messages,
          isTyping: false,
          aiState: 'idle',
          progressStep: '',
          sessionsByAccount: byAccount
        });
      },

      setActiveScreen: (screen) => set({ activeScreen: screen }),
      setFloatingOpen: (open) => set({ isFloatingOpen: open }),
      toggleFloatingOpen: () => set((state) => ({ isFloatingOpen: !state.isFloatingOpen })),
      toggleExpanded: () => set((state) => ({ isExpanded: !state.isExpanded })),

      startNewSession: () => {
        const createdAtIso = new Date().toISOString();
        const newSession = {
          id: `session-${Date.now()}`,
          tag: 'New Discussion',
          createdAt: new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }),
          createdAtIso,
          messages: [
            {
              id: `msg-${Date.now()}`,
              sender: 'ai',
              text: "Hello! I'm Skillo 🎓. Share any math problem, programming question, or coursework topic to explore!",
              timestamp: 'Just now'
            }
          ]
        };

        const userKey = get().currentAccountKey;
        const updatedSessions = [newSession, ...get().sessions];
        const byAccount = {
          ...(get().sessionsByAccount || {}),
          ...(userKey ? { [userKey]: updatedSessions } : {})
        };

        set({
          sessions: updatedSessions,
          activeSessionId: newSession.id,
          messages: newSession.messages,
          sessionsByAccount: byAccount,
          aiState: 'idle',
          progressStep: ''
        });
        useToastStore.getState().addToast('Started New Chat', 'info');
      },

      switchSession: (sessionId) => {
        const session = get().sessions.find((s) => s.id === sessionId);
        if (session) {
          set({
            activeSessionId: session.id,
            messages: session.messages || [],
            aiState: 'idle',
            progressStep: ''
          });
        }
      },

      deleteSession: (sessionId) => {
        const currentSessions = get().sessions;
        const filtered = currentSessions.filter((s) => s.id !== sessionId);
        const userKey = get().currentAccountKey;
        const createdAt = get().accountCreatedAt;

        let newSessions;
        let newActive;
        let newMessages;

        if (filtered.length === 0) {
          const fresh = createDefaultSession(createdAt || new Date().toISOString());
          newSessions = [fresh];
          newActive = fresh.id;
          newMessages = fresh.messages;
        } else {
          newSessions = filtered;
          newActive = filtered[0].id;
          newMessages = filtered[0].messages || [];
        }

        const byAccount = {
          ...(get().sessionsByAccount || {}),
          ...(userKey ? { [userKey]: newSessions } : {})
        };

        set({
          sessions: newSessions,
          activeSessionId: newActive,
          messages: newMessages,
          sessionsByAccount: byAccount
        });
        useToastStore.getState().addToast('Chat Deleted', 'success');
      },

      renameSession: (sessionId, newTag) => {
        const userKey = get().currentAccountKey;
        const updated = get().sessions.map((s) =>
          s.id === sessionId ? { ...s, tag: newTag } : s
        );
        const byAccount = {
          ...(get().sessionsByAccount || {}),
          ...(userKey ? { [userKey]: updated } : {})
        };
        set({
          sessions: updated,
          sessionsByAccount: byAccount
        });
      },

      clearHistory: () => {
        const createdAt = get().accountCreatedAt;
        const fresh = createDefaultSession(createdAt || new Date().toISOString());
        const userKey = get().currentAccountKey;
        const byAccount = {
          ...(get().sessionsByAccount || {}),
          ...(userKey ? { [userKey]: [fresh] } : {})
        };
        set({
          sessions: [fresh],
          activeSessionId: fresh.id,
          messages: fresh.messages,
          sessionsByAccount: byAccount
        });
        useToastStore.getState().addToast('Chat History Cleared', 'info');
      },

      setApiKey: (key) => set({ apiKey: key }),

      sendMessage: async (text, image = null) => {
        if (!text?.trim() && !image) return;

        const userMsg = {
          id: `msg-${Date.now()}`,
          sender: 'user',
          text: text ? text.trim() : '',
          image: image || null,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        const currentMessages = get().messages;
        const updatedMessages = [...currentMessages, userMsg];
        const activeId = get().activeSessionId;
        const targetSession = get().sessions.find((s) => s.id === activeId);

        let updatedTag = targetSession?.tag || 'General';
        const isGenericTag = ['General', 'New Chat', 'New Study Session', 'Study Assistant'].includes(updatedTag);
        const isFirstUserMessage = (targetSession?.messages || []).filter((m) => m.sender === 'user').length === 0;

        if (isGenericTag || isFirstUserMessage) {
          updatedTag = summarizeQuestion(text, Boolean(image));
        }

        const userKey = get().currentAccountKey;
        set((state) => {
          const updatedSessions = state.sessions.map((s) =>
            s.id === activeId ? { ...s, tag: updatedTag, messages: updatedMessages } : s
          );
          const updatedByAccount = {
            ...state.sessionsByAccount,
            ...(userKey ? { [userKey]: updatedSessions } : {})
          };
          return {
            messages: updatedMessages,
            sessions: updatedSessions,
            sessionsByAccount: updatedByAccount,
            isTyping: true,
            aiState: 'thinking',
            progressStep: 'Thinking...'
          };
        });

        try {
          const activeScreen = get().activeScreen || 'home';
          const storedKey = get().apiKey;
          const keyToUse = storedKey || DEFAULT_GEMINI_KEY;
          const aiResponseText = await askGemini(updatedMessages, keyToUse, image, activeScreen);

          const aiMsg = {
            id: `msg-${Date.now() + 1}`,
            sender: 'ai',
            text: aiResponseText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };

          set((state) => {
            const finalMessages = [...state.messages, aiMsg];
            const finalSessions = state.sessions.map((s) =>
              s.id === activeId ? { ...s, messages: finalMessages } : s
            );
            const finalByAccount = {
              ...state.sessionsByAccount,
              ...(userKey ? { [userKey]: finalSessions } : {})
            };
            return {
              messages: finalMessages,
              sessions: finalSessions,
              sessionsByAccount: finalByAccount,
              isTyping: false,
              aiState: 'complete',
              progressStep: ''
            };
          });

          setTimeout(() => set({ aiState: 'idle' }), 300);
        } catch (err) {
          console.error('Chat error:', err);
          const errorMsg = {
            id: `msg-${Date.now() + 1}`,
            sender: 'ai',
            text: 'I apologize, but I encountered an issue generating a response. Please try again.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };

          set((state) => {
            const errMessages = [...state.messages, errorMsg];
            const errSessions = state.sessions.map((s) =>
              s.id === activeId ? { ...s, messages: errMessages } : s
            );
            const errByAccount = {
              ...state.sessionsByAccount,
              ...(userKey ? { [userKey]: errSessions } : {})
            };
            return {
              messages: errMessages,
              sessions: errSessions,
              sessionsByAccount: errByAccount,
              isTyping: false,
              aiState: 'idle',
              progressStep: ''
            };
          });
        }
      },

      regenerateResponse: async () => {
        const currentMessages = get().messages;
        if (currentMessages.length === 0) return;

        let lastUserIdx = -1;
        for (let i = currentMessages.length - 1; i >= 0; i--) {
          if (currentMessages[i].sender === 'user') {
            lastUserIdx = i;
            break;
          }
        }

        if (lastUserIdx === -1) return;

        const truncatedMessages = currentMessages.slice(0, lastUserIdx + 1);
        const lastUserMsg = currentMessages[lastUserIdx];
        const activeId = get().activeSessionId;
        const userKey = get().currentAccountKey;

        set((state) => {
          const updatedSessions = state.sessions.map((s) =>
            s.id === activeId ? { ...s, messages: truncatedMessages } : s
          );
          const updatedByAccount = {
            ...state.sessionsByAccount,
            ...(userKey ? { [userKey]: updatedSessions } : {})
          };
          return {
            messages: truncatedMessages,
            sessions: updatedSessions,
            sessionsByAccount: updatedByAccount,
            isTyping: true,
            aiState: 'thinking',
            progressStep: 'Regenerating answer...'
          };
        });

        try {
          const storedKey = get().apiKey;
          const keyToUse = storedKey || DEFAULT_GEMINI_KEY;
          const aiResponseText = await askGemini(truncatedMessages, keyToUse, lastUserMsg.image);

          const aiMsg = {
            id: `msg-${Date.now()}`,
            sender: 'ai',
            text: aiResponseText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };

          set((state) => {
            const finalMessages = [...state.messages, aiMsg];
            const finalSessions = state.sessions.map((s) =>
              s.id === activeId ? { ...s, messages: finalMessages } : s
            );
            const finalByAccount = {
              ...state.sessionsByAccount,
              ...(userKey ? { [userKey]: finalSessions } : {})
            };
            return {
              messages: finalMessages,
              sessions: finalSessions,
              sessionsByAccount: finalByAccount,
              isTyping: false,
              aiState: 'complete',
              progressStep: ''
            };
          });

          setTimeout(() => set({ aiState: 'idle' }), 300);
        } catch (err) {
          set({ isTyping: false, aiState: 'idle', progressStep: '' });
        }
      },

      downloadChat: (targetSessionId = null) => {
        let msgs = get().messages;
        if (targetSessionId) {
          const sessions = Array.isArray(get().sessions) ? get().sessions : [];
          const target = sessions.find((s) => s.id === targetSessionId);
          if (target && Array.isArray(target.messages)) {
            msgs = target.messages;
          }
        }

        if (!Array.isArray(msgs) || msgs.length === 0) {
          useToastStore.getState().addToast('No messages to export', 'warning');
          return;
        }

        let chatText = `# AI Chat Transcript\nExported on: ${new Date().toLocaleString()}\n\n---\n\n`;
        msgs.forEach((m) => {
          const sender = m.sender === 'user' ? '👤 User' : '🤖 AI';
          chatText += `### ${sender} (${m.timestamp})\n${m.text}\n\n`;
        });

        const blob = new Blob([chatText], { type: 'text/markdown;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `ai-chat-${Date.now()}.md`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        useToastStore.getState().addToast('Transcript Exported', 'success');
      }
    }),
    {
      name: 'SkillSync-ai-chat-storage-v2',
      partialize: (state) => ({
        sessionsByAccount: state.sessionsByAccount,
        currentAccountKey: state.currentAccountKey,
        accountCreatedAt: state.accountCreatedAt,
        sessions: state.sessions,
        activeSessionId: state.activeSessionId,
        messages: state.messages,
        apiKey: state.apiKey
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          if (state.currentAccountKey && state.accountCreatedAt) {
            const accountTime = new Date(state.accountCreatedAt).getTime();
            state.sessions = (state.sessions || []).filter((s) => {
              const sessionTime = new Date(s.createdAtIso || 0).getTime();
              return sessionTime >= accountTime - 5000;
            });
          }
          if (!Array.isArray(state.sessions) || state.sessions.length === 0) {
            const def = createDefaultSession(state.accountCreatedAt);
            state.sessions = [def];
            state.activeSessionId = def.id;
            state.messages = def.messages;
          } else {
            const active = state.sessions.find((s) => s.id === state.activeSessionId) || state.sessions[0];
            if (active) {
              state.activeSessionId = active.id;
              state.messages = Array.isArray(active.messages) && active.messages.length > 0 ? active.messages : createDefaultSession(state.accountCreatedAt).messages;
            }
          }
          state.isFloatingOpen = false;
          state.isTyping = false;
          state.aiState = 'idle';
          state.progressStep = '';
        }
      }
    }
  )
);
