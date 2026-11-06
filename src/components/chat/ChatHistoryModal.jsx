import React, { useState } from 'react';
import {
  X,
  Plus,
  Download,
  Tag,
  Calendar,
  ChevronRight,
  Trash2,
  Edit3,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '../../store/useChatStore';

export const ChatHistoryModal = ({ isOpen, onClose }) => {
  const sessions = useChatStore((state) => state.sessions);
  const activeSessionId = useChatStore((state) => state.activeSessionId);
  const switchSession = useChatStore((state) => state.switchSession);
  const deleteSession = useChatStore((state) => state.deleteSession);
  const renameSession = useChatStore((state) => state.renameSession);
  const startNewSession = useChatStore((state) => state.startNewSession);
  const downloadChat = useChatStore((state) => state.downloadChat);

  const [editingSessionId, setEditingSessionId] = useState(null);
  const [renameInput, setRenameInput] = useState('');

  if (!isOpen) return null;

  const safeSessions = Array.isArray(sessions) ? sessions : [];

  const handleStartRename = (session, e) => {
    e.stopPropagation();
    setEditingSessionId(session.id);
    setRenameInput(session.tag || 'Chat');
  };

  const handleConfirmRename = (sessionId, e) => {
    e.stopPropagation();
    renameSession(sessionId, renameInput);
    setEditingSessionId(null);
  };

  return (
    <AnimatePresence>
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 flex flex-col max-h-[84vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-sm font-bold shadow-xs">
                AI
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-sm text-slate-900 dark:text-white">
                  Chat History
                </h3>
                <p className="text-[10px] text-slate-400 font-medium">Saved conversations</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* New Chat Button */}
          <div className="py-2.5 shrink-0">
            <button
              onClick={() => {
                startNewSession();
                onClose();
              }}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Start New Chat</span>
            </button>
          </div>

          {/* Sessions List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 my-1 custom-scrollbar">
            {safeSessions.length === 0 ? (
              <div className="text-center text-xs text-slate-400 py-8 space-y-1">
                <p className="font-semibold">No conversations saved yet</p>
                <p className="text-[10px]">Start a new chat to ask a question!</p>
              </div>
            ) : (
              safeSessions.map((session) => {
                const isActive = session.id === activeSessionId;
                const msgCount = (session.messages || []).length;
                const isEditing = editingSessionId === session.id;

                return (
                  <div
                    key={session.id}
                    className={`p-3 rounded-2xl border transition-all flex items-center justify-between space-x-2 ${
                      isActive
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700 shadow-2xs'
                        : 'bg-slate-50/70 dark:bg-slate-850 border-slate-200/80 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700'
                    }`}
                  >
                    <div
                      onClick={() => {
                        if (!isEditing) {
                          switchSession(session.id);
                          onClose();
                        }
                      }}
                      className="flex-1 text-left min-w-0 cursor-pointer"
                    >
                      {isEditing ? (
                        <div className="flex items-center space-x-1 mb-1">
                          <input
                            type="text"
                            value={renameInput}
                            onChange={(e) => setRenameInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleConfirmRename(session.id, e);
                            }}
                            className="flex-1 px-2 py-1 bg-white dark:bg-slate-900 border border-emerald-400 rounded-lg text-xs font-semibold"
                            autoFocus
                          />
                          <button
                            onClick={(e) => handleConfirmRename(session.id, e)}
                            className="p-1 bg-emerald-600 text-white rounded-lg text-xs cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1.5 mb-1">
                          <Tag className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span className="font-heading font-extrabold text-xs text-slate-900 dark:text-white truncate">
                            {session.tag || 'Chat'}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-medium">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-2.5 h-2.5" />
                          <span>{session.createdAt || 'Today'}</span>
                        </span>
                        <span>•</span>
                        <span>{msgCount} message{msgCount !== 1 ? 's' : ''}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 shrink-0">
                      <button
                        onClick={(e) => handleStartRename(session, e)}
                        className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Rename conversation"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadChat(session.id);
                        }}
                        className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Export session"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm('Delete this conversation history?')) {
                            deleteSession(session.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors cursor-pointer"
                        title="Delete conversation"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          switchSession(session.id);
                          onClose();
                        }}
                        className="p-1 text-emerald-600 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
