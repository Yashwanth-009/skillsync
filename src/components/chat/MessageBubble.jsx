import React, { useState } from 'react';
import {
  Copy,
  Check,
  Share2,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Lightbulb,
  CheckCircle2,
  ThumbsUp,
  ThumbsDown,
  Calendar,
  Bell,
  Target,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { ShareModal } from './ShareModal';
import { CodeBlock } from '../ui/CodeBlock';
import { useChatStore } from '../../store/useChatStore';
import { useToastStore } from '../../store/useToastStore';
import { copyToMobileClipboard } from '../../lib/utils';

export const MessageBubble = ({ message, isLatestAi = false }) => {
  if (!message) return null;

  const isUser = message.sender === 'user';
  const msgText = typeof message.text === 'string' ? message.text : '';
  const [copied, setCopied] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [feedback, setFeedback] = useState(null); // 'up' | 'down' | null

  const sendMessage = useChatStore((state) => state.sendMessage);
  const regenerateResponse = useChatStore((state) => state.regenerateResponse);
  const setFloatingOpen = useChatStore((state) => state.setFloatingOpen);
  const addToast = useToastStore((state) => state.addToast);

  const handleCopy = async () => {
    const cleanCopyText = msgText
      .replace(/\*\*/g, '')
      .replace(/\[ACTION:[^\]]+\]/g, '')
      .trim();

    const ok = await copyToMobileClipboard(cleanCopyText);
    if (ok) {
      setCopied(true);
      addToast('Copied to clipboard! 📋', 'success');
      setTimeout(() => setCopied(false), 1800);
    } else {
      addToast('Failed to copy to clipboard', 'warning');
    }
  };

  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      addToast('Text-to-speech not supported in browser', 'warning');
      return;
    }
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const cleanText = msgText.replace(/\*\*/g, '').replace(/\[ACTION:[^\]]+\]/g, '').replace(/\|/g, ' ');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleFeedback = (type) => {
    setFeedback(type);
    addToast(type === 'up' ? 'Thanks for the positive feedback!' : 'Thanks, feedback recorded', 'info');
  };

  const handleQuickFollowUp = (query) => {
    sendMessage(query);
  };

  const handleExecuteCardAction = (type, target) => {
    if (type === 'navigate' || type === 'timetable' || type === 'resume' || type === 'careerconnect' || type === 'profile' || type === 'home') {
      const screen = target || (type === 'navigate' ? 'home' : type);
      window.dispatchEvent(new CustomEvent('skillo_navigate', { detail: { screen } }));
      setFloatingOpen(false);
      addToast(`Navigating to ${screen.toUpperCase()}`, 'info');
      return;
    }
    if (type === 'reminder' || type === 'goal') {
      window.dispatchEvent(new CustomEvent('skillo_navigate', { detail: { screen: 'home' } }));
      setFloatingOpen(false);
      addToast(`Opened ${type === 'reminder' ? 'Reminders' : 'Goals'} on Dashboard`, 'success');
      return;
    }
    if (type === 'calendar') {
      window.dispatchEvent(new CustomEvent('skillo_navigate', { detail: { screen: 'timetable' } }));
      setFloatingOpen(false);
      addToast('Opened Calendar View', 'info');
    }
  };

  const quickFollowUps = [
    { label: 'Explain simply', icon: Lightbulb, query: 'Can you explain this in even simpler terms?' },
    { label: 'Give an example', icon: Sparkles, query: 'Can you provide a practical example of this?' },
    { label: 'Summarize key points', icon: CheckCircle2, query: 'Please summarize this in 3 concise bullet points.' }
  ];

  const formatInlineText = (str) => {
    const parts = str.split(/(\*\*.*?\*\*|\`.*?\`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700/60 font-mono text-[11px] text-emerald-600 dark:text-emerald-400 border border-slate-200/60 dark:border-slate-700">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  // Parses and renders interactive Action Cards
  const renderActionCard = (actionStr, key) => {
    // Format: [ACTION:type:param1:param2]
    const content = actionStr.slice(8, -1);
    const parts = content.split(':');
    const type = parts[0];
    const param1 = parts[1] || '';
    const param2 = parts[2] || '';

    if (type === 'reminder') {
      return (
        <div key={key} className="my-2.5 p-3 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/5 dark:from-emerald-950/50 dark:to-slate-800 border border-emerald-500/30 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-xs shrink-0">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">{param1 || 'Study Reminder'}</p>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">{param2 || 'Scheduled'}</p>
              </div>
            </div>
            <button
              onClick={() => handleExecuteCardAction('reminder', 'home')}
              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-xl shadow-xs flex items-center space-x-1 cursor-pointer transition-transform active:scale-95"
            >
              <span>View</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      );
    }

    if (type === 'timetable') {
      return (
        <div key={key} className="my-2.5 p-3 bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-teal-500/5 dark:from-teal-950/50 dark:to-slate-800 border border-teal-500/30 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">{param1 || 'Class Schedule'}</p>
                <p className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold">{param2 || 'Added to Timetable'}</p>
              </div>
            </div>
            <button
              onClick={() => handleExecuteCardAction('timetable', 'timetable')}
              className="px-2.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-bold rounded-xl shadow-xs flex items-center space-x-1 cursor-pointer transition-transform active:scale-95"
            >
              <span>Open</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      );
    }

    if (type === 'navigate') {
      return (
        <div key={key} className="my-2.5 p-3 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/5 dark:from-indigo-950/50 dark:to-slate-800 border border-indigo-500/30 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs shrink-0">
                <ArrowRight className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">{param2 || `Open ${param1.toUpperCase()}`}</p>
                <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">Direct App Navigation</p>
              </div>
            </div>
            <button
              onClick={() => handleExecuteCardAction('navigate', param1)}
              className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold rounded-xl shadow-xs flex items-center space-x-1 cursor-pointer transition-transform active:scale-95"
            >
              <span>Go</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      );
    }

    if (type === 'goal') {
      return (
        <div key={key} className="my-2.5 p-3 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 dark:from-amber-950/50 dark:to-slate-800 border border-amber-500/30 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs shrink-0">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">{param1 || 'Academic Goal'}</p>
                <p className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">Tracked on Dashboard</p>
              </div>
            </div>
            <button
              onClick={() => handleExecuteCardAction('goal', 'home')}
              className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold rounded-xl shadow-xs flex items-center space-x-1 cursor-pointer transition-transform active:scale-95"
            >
              <span>Goals</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      );
    }

    return null;
  };

  // Parses and renders markdown tables cleanly
  const renderMarkdownTable = (tableLines, key) => {
    const headerLine = tableLines[0];
    const dataLines = tableLines.slice(2);

    const headers = headerLine.split('|').map((s) => s.trim()).filter(Boolean);

    return (
      <div key={key} className="my-2.5 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 font-semibold">
              {headers.map((h, idx) => (
                <th key={idx} className="px-3 py-2 whitespace-nowrap">
                  {formatInlineText(h)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {dataLines.map((row, rIdx) => {
              const cells = row.split('|').map((s) => s.trim()).filter(Boolean);
              if (cells.length === 0) return null;
              return (
                <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  {cells.map((cell, cIdx) => (
                    <td key={cIdx} className="px-3 py-2 text-slate-700 dark:text-slate-300">
                      {formatInlineText(cell)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const renderMessageContent = () => {
    if (isUser) {
      return <div className="whitespace-pre-wrap font-body leading-relaxed">{message.text}</div>;
    }

    const text = message.text || '';

    // Code block parser
    const codeMatch = text.match(/```(\w+)?\n([\s\S]*?)```/);
    if (codeMatch) {
      const language = codeMatch[1] || 'python';
      const codeSnippet = codeMatch[2];
      const parts = text.split(/```(?:\w+)?\n[\s\S]*?```/);

      return (
        <div className="space-y-2 font-body">
          {parts[0] && renderTextBlocks(parts[0])}
          <CodeBlock code={codeSnippet} language={language} />
          {parts[1] && renderTextBlocks(parts[1])}
        </div>
      );
    }

    return renderTextBlocks(text);
  };

  const renderTextBlocks = (rawContent) => {
    const lines = rawContent.split('\n');
    const elements = [];
    let currentTable = [];
    let inTable = false;

    lines.forEach((line, idx) => {
      const trimmed = line.trim();

      // Action Tag detection [ACTION:type:param1:param2]
      if (trimmed.startsWith('[ACTION:') && trimmed.endsWith(']')) {
        elements.push(renderActionCard(trimmed, `action-${idx}`));
        return;
      }

      // Table line detection
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        inTable = true;
        currentTable.push(trimmed);
        return;
      } else if (inTable) {
        elements.push(renderMarkdownTable(currentTable, `table-${idx}`));
        currentTable = [];
        inTable = false;
      }

      if (!trimmed) {
        elements.push(<div key={`spacer-${idx}`} className="h-1" />);
        return;
      }

      // Headings
      if (trimmed.startsWith('### ')) {
        elements.push(
          <h4 key={`h3-${idx}`} className="font-heading font-bold text-xs text-slate-900 dark:text-white pt-1">
            {formatInlineText(trimmed.replace('### ', ''))}
          </h4>
        );
        return;
      }
      if (trimmed.startsWith('## ')) {
        elements.push(
          <h3 key={`h2-${idx}`} className="font-heading font-extrabold text-sm text-slate-900 dark:text-white pt-1.5 pb-0.5">
            {formatInlineText(trimmed.replace('## ', ''))}
          </h3>
        );
        return;
      }

      // Bullet points
      if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*')) {
        const content = trimmed.replace(/^[\•\-\*]\s*/, '');
        elements.push(
          <div key={`bullet-${idx}`} className="flex items-start space-x-2 pl-1 my-0.5">
            <span className="text-emerald-500 font-bold text-xs shrink-0 mt-0.5">•</span>
            <span className="flex-1 leading-relaxed text-slate-800 dark:text-slate-100">{formatInlineText(content)}</span>
          </div>
        );
        return;
      }

      // Numbered lists / steps
      const numMatch = trimmed.match(/^(\d+)\.\s*(.*)/);
      if (numMatch) {
        const num = numMatch[1];
        const content = numMatch[2];
        elements.push(
          <div key={`num-${idx}`} className="flex items-start space-x-2 pl-1 my-1">
            <span className="w-4 h-4 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
              {num}
            </span>
            <span className="flex-1 leading-relaxed text-slate-800 dark:text-slate-100">{formatInlineText(content)}</span>
          </div>
        );
        return;
      }

      // Regular paragraph
      elements.push(
        <p key={`p-${idx}`} className="leading-relaxed whitespace-pre-wrap text-slate-800 dark:text-slate-100">
          {formatInlineText(trimmed)}
        </p>
      );
    });

    if (inTable && currentTable.length > 0) {
      elements.push(renderMarkdownTable(currentTable, `table-end`));
    }

    return <div className="space-y-1.5 font-body">{elements}</div>;
  };

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} my-2 max-w-full`}>
      {/* Sender & Timestamp */}
      <div className="flex items-center space-x-1.5 mb-1 px-1">
        {!isUser && (
          <div className="relative w-4.5 h-4.5 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center text-[10px] shadow-2xs shrink-0 font-bold">
            🎓
          </div>
        )}
        <span className="text-[10px] text-slate-400 font-medium">
          {isUser ? 'You' : 'Skillo'} • {message.timestamp}
        </span>
      </div>

      {/* Message Bubble Container */}
      <div
        className={`relative p-3 rounded-2xl text-xs sm:text-[13px] leading-relaxed transition-all ${
          isUser
            ? 'bg-emerald-600 text-white rounded-tr-xs max-w-[85%] shadow-xs'
            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/70 dark:border-slate-700/70 rounded-tl-xs max-w-[92%] shadow-xs'
        }`}
      >
        {message.image && (
          <div className="mb-2.5 rounded-xl overflow-hidden max-h-48 border border-slate-200 dark:border-slate-700 shadow-2xs">
            <img src={message.image} alt="Uploaded problem" className="w-full h-full object-cover" />
          </div>
        )}

        {renderMessageContent()}

        {/* Action Toolbar for Skillo responses */}
        {!isUser && (
          <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700/50 flex flex-wrap items-center justify-between gap-1 text-slate-400">
            <div className="flex items-center space-x-1">
              <button
                onClick={handleCopy}
                className="p-1 hover:text-slate-600 dark:hover:text-slate-200 rounded-md transition-colors cursor-pointer"
                title="Copy text"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={handleToggleSpeech}
                className={`p-1 hover:text-slate-600 dark:hover:text-slate-200 rounded-md transition-colors cursor-pointer ${
                  isSpeaking ? 'text-emerald-500' : ''
                }`}
                title="Read aloud"
              >
                {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => setShareModalOpen(true)}
                className="p-1 hover:text-slate-600 dark:hover:text-slate-200 rounded-md transition-colors cursor-pointer"
                title="Share response"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>

              {isLatestAi && (
                <button
                  onClick={() => regenerateResponse()}
                  className="p-1 hover:text-slate-600 dark:hover:text-slate-200 rounded-md transition-colors cursor-pointer"
                  title="Regenerate response"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Thumbs Feedback */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => handleFeedback('up')}
                className={`p-1 rounded-md transition-colors cursor-pointer ${
                  feedback === 'up' ? 'text-emerald-500' : 'hover:text-slate-600 dark:hover:text-slate-200'
                }`}
                title="Helpful"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleFeedback('down')}
                className={`p-1 rounded-md transition-colors cursor-pointer ${
                  feedback === 'down' ? 'text-rose-500' : 'hover:text-slate-600 dark:hover:text-slate-200'
                }`}
                title="Not helpful"
              >
                <ThumbsDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Action Suggestion Chips for Latest Skillo response */}
      {!isUser && isLatestAi && (
        <div className="flex flex-wrap gap-1.5 mt-2 pl-1">
          {quickFollowUps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={() => handleQuickFollowUp(item.query)}
                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 text-[10px] font-medium border border-slate-200/80 dark:border-slate-700 transition-all cursor-pointer shadow-2xs"
              >
                <Icon className="w-3 h-3 text-emerald-500" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Share Modal */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        text={msgText}
        messageText={msgText}
      />
    </div>
  );
};
