import React, { useState } from 'react';
import { X, Share2, Copy, Check, Send, Mail, Twitter, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ShareModal = ({ isOpen, onClose, text = '', messageText = '' }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const actualText = typeof text === 'string' && text ? text : (typeof messageText === 'string' ? messageText : '');
  const shareTitle = "Skillo AI Study Solution 📚";
  const shareText = `Check out this study solution from Skillo AI:\n\n${actualText}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(actualText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: actualText
        });
      } catch (err) {
        console.log('Native share error/cancelled:', err);
      }
    } else {
      handleCopy();
    }
  };

  const shareTargets = [
    {
      name: 'WhatsApp',
      icon: MessageSquare,
      color: 'bg-emerald-500 hover:bg-emerald-600 text-white',
      action: () => {
        const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    },
    {
      name: 'Telegram',
      icon: Send,
      color: 'bg-sky-500 hover:bg-sky-600 text-white',
      action: () => {
        const url = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(shareText)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    },
    {
      name: 'X (Twitter)',
      icon: Twitter,
      color: 'bg-slate-900 dark:bg-slate-700 hover:bg-black text-white',
      action: () => {
        const tweetText = actualText.length > 240 ? actualText.slice(0, 240) + '...' : actualText;
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    },
    {
      name: 'Email',
      icon: Mail,
      color: 'bg-indigo-600 hover:bg-indigo-700 text-white',
      action: () => {
        const mailto = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareText)}`;
        window.location.href = mailto;
      }
    }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-sm bg-white dark:bg-slate-850 rounded-3xl shadow-2xl p-6 border border-slate-100 dark:border-slate-800 space-y-4"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-2">
              <Share2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="font-heading font-bold text-sm text-slate-900 dark:text-white">
                Share Solution
              </h3>
            </div>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Share this step-by-step AI answer directly via your favorite app or social media!
          </p>

          {/* Social Share Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {shareTargets.map((target) => {
              const Icon = target.icon;
              return (
                <button
                  key={target.name}
                  onClick={target.action}
                  className={`p-3 rounded-2xl font-semibold text-xs transition-all flex items-center justify-center space-x-2 shadow-xs active:scale-95 cursor-pointer ${target.color}`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{target.name}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Action Buttons: Native Share Sheet & Copy Link */}
          <div className="pt-2 space-y-2 border-t border-slate-100 dark:border-slate-800">
            {typeof navigator !== 'undefined' && navigator.share && (
              <button
                onClick={handleNativeShare}
                className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-semibold text-xs rounded-xl flex items-center justify-center space-x-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>More Share Options (System Sheet)</span>
              </button>
            )}

            <button
              onClick={handleCopy}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl flex items-center justify-center space-x-1.5 shadow-sm cursor-pointer active:scale-95 transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-200" />
                  <span>Solution Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Solution Text</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
