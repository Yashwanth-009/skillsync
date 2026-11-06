import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Plus,
  History,
  Download,
  Sparkles,
  Tag,
  ArrowLeft,
  Cpu,
  Key
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '../../store/useChatStore';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { CameraModal } from './CameraModal';
import { ChatHistoryModal } from './ChatHistoryModal';

export const FloatingMetaAIChat = ({ forceOpen = false, onBack = null }) => {
  const [showCamera, setShowCamera] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const messagesEndRef = useRef(null);

  const messages = useChatStore((state) => state.messages);
  const isTyping = useChatStore((state) => state.isTyping);
  const aiState = useChatStore((state) => state.aiState);
  const progressStep = useChatStore((state) => state.progressStep);
  const sendMessage = useChatStore((state) => state.sendMessage);
  const downloadChat = useChatStore((state) => state.downloadChat);
  const sessions = useChatStore((state) => state.sessions);
  const activeSessionId = useChatStore((state) => state.activeSessionId);
  const startNewSession = useChatStore((state) => state.startNewSession);

  const isFloatingOpen = useChatStore((state) => state.isFloatingOpen);
  const setFloatingOpen = useChatStore((state) => state.setFloatingOpen);
  const toggleFloatingOpen = useChatStore((state) => state.toggleFloatingOpen);

  const isOpen = forceOpen || isFloatingOpen;

  const safeSessions = Array.isArray(sessions) ? sessions : [];
  const currentSession = safeSessions.find((s) => s?.id === activeSessionId) || safeSessions[0] || null;
  const currentTag = currentSession?.tag || 'Academic Assistant';

  const hasPushedStateRef = useRef(false);

  // Mobile Back Button / Popstate Handler (Single entry guard to prevent infinite loops)
  useEffect(() => {
    if (isOpen && !forceOpen) {
      if (!hasPushedStateRef.current) {
        hasPushedStateRef.current = true;
        window.history.pushState({ modal: 'ai_chat_modal' }, '');
      }

      const handlePopState = () => {
        hasPushedStateRef.current = false;
        setShowCamera(false);
        setShowHistoryModal(false);
        setFloatingOpen(false);
      };

      window.addEventListener('popstate', handlePopState);
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    } else {
      hasPushedStateRef.current = false;
    }
  }, [isOpen, forceOpen, setFloatingOpen]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleCloseFloating = () => {
    setFloatingOpen(false);
    if (hasPushedStateRef.current) {
      hasPushedStateRef.current = false;
      if (window.history.state?.modal === 'ai_chat_modal') {
        window.history.back();
      }
    }
  };

  const sampleQuestions = [
    "📐 Solve 2x + 5 = 15",
    "💻 Python Binary Search",
    "📅 What's my next class?",
    "🎯 How is my attendance & GPA?",
    "🔬 Newton's Laws of Motion"
  ];

  const safeMessages = Array.isArray(messages) ? messages : [];

  const lastAiIndex = (() => {
    for (let i = safeMessages.length - 1; i >= 0; i--) {
      if (safeMessages[i]?.sender === 'ai') return i;
    }
    return -1;
  })();

  return (
    <>
      {/* Floating Action Button (FAB) - Compact & Elegant */}
      {!forceOpen && (
        <div className="fixed bottom-[110px] sm:bottom-24 right-4 sm:right-6 z-40 flex items-center">
          <button
            onClick={() => toggleFloatingOpen()}
            className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/30 hover:shadow-xl hover:shadow-emerald-600/40 flex items-center justify-center text-xl sm:text-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer border-2 border-white/30 ring-2 ring-emerald-500/20"
            title="Ask AI Study Assistant 🎓"
            aria-label="Open AI Study Assistant"
          >
            <span className="relative flex items-center justify-center">
              🎓
              <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 border border-white dark:border-slate-900"></span>
              </span>
            </span>
          </button>
        </div>
      )}

      {/* AI Chat Window Container */}
      <AnimatePresence>
        {isOpen && (
          <div className={forceOpen ? 'relative w-full h-[calc(100vh-140px)] max-w-md mx-auto' : 'fixed inset-0 z-50 flex items-stretch sm:items-center justify-center p-0 sm:p-4 bg-white dark:bg-slate-900 sm:bg-transparent'}>
            {!forceOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleCloseFloating}
                className="hidden sm:block absolute inset-0 bg-slate-900/40 backdrop-blur-xs cursor-pointer"
              />
            )}

            <motion.div
              initial={forceOpen ? {} : { opacity: 0, y: 20 }}
              animate={forceOpen ? {} : { opacity: 1, y: 0 }}
              exit={forceOpen ? {} : { opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 28, stiffness: 350 }}
              className="relative z-10 bg-white dark:bg-slate-900 border-0 sm:border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden w-full h-full sm:max-w-lg sm:h-[88vh] rounded-none sm:rounded-3xl"
            >
              {/* Header with Back Button */}
              <div className="px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white flex items-center justify-between shadow-xs shrink-0">
                <div className="flex items-center space-x-2.5 min-w-0">
                  {/* Dedicated Back Button */}
                  <button
                    type="button"
                    onClick={() => {
                      if (forceOpen && onBack) {
                        onBack();
                      } else {
                        handleCloseFloating();
                      }
                    }}
                    className="p-1.5 -ml-1 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer shrink-0"
                    title="Return to existing screen"
                  >
                    <ArrowLeft className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </button>

                  <div className="relative shrink-0">
                    <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-600 to-emerald-700 text-white flex items-center justify-center text-lg shadow-sm font-black shrink-0 border border-white/20">
                      🎓
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                  </div>

                  <div className="min-w-0 flex items-center space-x-2">
                    <h2 className="font-heading font-black text-base sm:text-lg text-slate-900 dark:text-white tracking-tight leading-none whitespace-nowrap">
                      Skillo AI
                    </h2>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.6)]" title="Online" />
                    {isTyping && (
                      <Cpu className="w-4 h-4 text-emerald-500 animate-pulse shrink-0" />
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-1 shrink-0">
                  <button
                    onClick={() => startNewSession()}
                    className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                    title="New Chat"
                  >
                    <Plus className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </button>

                  <button
                    onClick={() => setShowHistoryModal(true)}
                    className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                    title="Chat History"
                  >
                    <History className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  </button>

                  <button
                    onClick={() => downloadChat()}
                    className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                    title="Export Chat"
                  >
                    <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </button>

                  {!forceOpen && (
                    <button
                      onClick={handleCloseFloating}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
                      title="Close Chat"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Progress Step Banner */}
              {isTyping && progressStep && (
                <div className="px-4 py-1.5 bg-emerald-50 dark:bg-emerald-950/50 border-b border-emerald-100 dark:border-emerald-900/60 flex items-center justify-between text-[11px] text-emerald-800 dark:text-emerald-300 font-semibold shrink-0 animate-pulse">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{progressStep}</span>
                  </div>
                  <span className="text-[9px] uppercase font-bold text-emerald-700 dark:text-emerald-300 px-2 py-0.5 bg-emerald-200/60 dark:bg-emerald-900/80 rounded-full">
                    {aiState}
                  </span>
                </div>
              )}

              {/* Message Stream */}
              <div className="flex-1 min-h-0 overflow-y-auto px-3.5 py-3 space-y-2 bg-slate-50/60 dark:bg-slate-900 overscroll-contain">
                {safeMessages.map((msg, idx) => (
                  <MessageBubble
                    key={msg.id}
                    message={msg}
                    isLatestAi={idx === lastAiIndex && !isTyping}
                  />
                ))}

                {isTyping && (
                  <div className="flex items-center space-x-2 my-2 p-2.5 bg-white dark:bg-slate-800 w-36 rounded-2xl rounded-tl-xs border border-slate-200 dark:border-slate-700 shadow-2xs">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-teal-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium ml-1">Thinking...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Sample Questions Chips */}
              {safeMessages.length <= 2 && (
                <div className="px-3.5 py-2 bg-white dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex space-x-1.5 overflow-x-auto scrollbar-none">
                  {sampleQuestions.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="px-3 py-1.5 bg-slate-100/80 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[10px] font-semibold rounded-full transition-all shrink-0 border border-slate-200 dark:border-slate-700 shadow-2xs hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {/* Chat Input Bar */}
              <ChatInput
                onSend={(text, img) => sendMessage(text, img)}
                onOpenCamera={() => setShowCamera(true)}
                isTyping={isTyping}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <CameraModal
        isOpen={showCamera}
        onClose={() => setShowCamera(false)}
        onCapturePhoto={(photoData) => sendMessage("Please help solve this:", photoData)}
      />

      <ChatHistoryModal isOpen={showHistoryModal} onClose={() => setShowHistoryModal(false)} />
    </>
  );
};
