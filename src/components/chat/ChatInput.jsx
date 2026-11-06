import React, { useState, useRef } from 'react';
import {
  Send,
  Camera,
  Image,
  Paperclip,
  X,
  FileText,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToastStore } from '../../store/useToastStore';

export const ChatInput = ({ onSend, onOpenCamera, isTyping = false }) => {
  const [text, setText] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [showAttachMenu, setShowAttachMenu] = useState(false);

  const galleryInputRef = useRef(null);
  const docInputRef = useRef(null);

  const addToast = useToastStore((state) => state.addToast);

  const handleGalleryUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast('Please select a valid image file', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result);
      setShowAttachMenu(false);
      addToast('Photo attached', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleDocumentUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedDoc({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
        text: event.target.result || ''
      });
      setShowAttachMenu(false);
      addToast(`Attached: ${file.name}`, 'success');
    };
    reader.readAsText(file);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if ((!text.trim() && !selectedImage && !selectedDoc) || isTyping) return;

    let fullText = text.trim();
    if (selectedDoc) {
      fullText = `[Uploaded Document: ${selectedDoc.name}]\n${selectedDoc.text.slice(0, 3000)}\n\n${fullText}`;
    }

    onSend(fullText, selectedImage);
    setText('');
    setSelectedImage(null);
    setSelectedDoc(null);
    setShowAttachMenu(false);
  };

  return (
    <div className="p-2.5 sm:p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 relative">
      {/* Selected Attachments Preview */}
      <div className="flex items-center space-x-2 mb-2 overflow-x-auto">
        {selectedImage && (
          <div className="relative inline-block shrink-0">
            <img src={selectedImage} alt="Selected" className="w-14 h-14 object-cover rounded-xl border border-emerald-500 shadow-sm" />
            <button
              onClick={() => setSelectedImage(null)}
              aria-label="Remove image"
              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center text-[10px] shadow-sm hover:scale-110 transition-transform cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {selectedDoc && (
          <div className="relative inline-flex items-center space-x-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 rounded-xl shadow-xs shrink-0">
            <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <div className="text-left max-w-[130px] truncate">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{selectedDoc.name}</p>
              <p className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold">Document Attached</p>
            </div>
            <button
              onClick={() => setSelectedDoc(null)}
              className="p-1 text-slate-400 hover:text-rose-500 cursor-pointer"
              title="Remove document"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Attachment Sub-Menu */}
      <AnimatePresence>
        {showAttachMenu && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            className="mb-2 p-2 bg-slate-50 dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-md flex items-center justify-around gap-1"
          >
            {/* Camera */}
            <button
              type="button"
              onClick={() => {
                onOpenCamera();
                setShowAttachMenu(false);
              }}
              className="flex-1 py-2 px-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-slate-700 dark:text-slate-200 hover:text-emerald-600 transition-all active:scale-95 cursor-pointer shadow-2xs"
            >
              <Camera className="w-4 h-4 text-emerald-500 mb-1" />
              <span className="text-[10px] font-bold">Camera</span>
            </button>

            {/* Photo Gallery */}
            <button
              type="button"
              onClick={() => galleryInputRef.current?.click()}
              className="flex-1 py-2 px-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-slate-700 dark:text-slate-200 hover:text-emerald-600 transition-all active:scale-95 cursor-pointer shadow-2xs relative overflow-hidden"
            >
              <Image className="w-4 h-4 text-teal-500 mb-1" />
              <span className="text-[10px] font-bold">Photo</span>
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*,image/heic,image/heif"
                onChange={handleGalleryUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
            </button>

            {/* Document */}
            <button
              type="button"
              onClick={() => docInputRef.current?.click()}
              className="flex-1 py-2 px-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-slate-700 dark:text-slate-200 hover:text-emerald-600 transition-all active:scale-95 cursor-pointer shadow-2xs relative overflow-hidden"
            >
              <Paperclip className="w-4 h-4 text-emerald-500 mb-1" />
              <span className="text-[10px] font-bold">Doc / PDF</span>
              <input
                ref={docInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt,.md,.json"
                onChange={handleDocumentUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Bar with Autofill / Password Manager suppression */}
      <form
        onSubmit={handleSend}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        data-lpignore="true"
        data-form-type="other"
        className="flex items-center space-x-1.5"
      >
        {/* Attachment Menu Toggle */}
        <button
          type="button"
          onClick={() => setShowAttachMenu(!showAttachMenu)}
          className={`p-2.5 rounded-2xl transition-all shrink-0 cursor-pointer ${
            showAttachMenu
              ? 'bg-emerald-600 text-white rotate-45 shadow-sm'
              : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
          }`}
          title="Attach Photo / Camera / PDF"
        >
          <Plus className="w-4.5 h-4.5" />
        </button>

        {/* Text Field */}
        <input
          type="text"
          name="ai_chat_query_field"
          id="ai_chat_query_field"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="sentences"
          spellCheck="false"
          data-lpignore="true"
          data-1p-ignore="true"
          data-bwignore="true"
          data-form-type="other"
          aria-autocomplete="none"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ask Skillo a question or paste problem..."
          className="flex-1 py-2.5 px-3.5 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:ring-1.5 focus:ring-emerald-500/40 font-body border border-slate-200/80 dark:border-slate-700/80"
        />

        {/* Send Button */}
        <button
          type="submit"
          disabled={(!text.trim() && !selectedImage && !selectedDoc) || isTyping}
          className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl transition-all disabled:opacity-40 shadow-xs cursor-pointer active:scale-95 shrink-0"
        >
          <Send className="w-4.5 h-4.5" />
        </button>
      </form>
    </div>
  );
};
