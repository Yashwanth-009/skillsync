import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Send, Bot, User, Compass, ArrowRight, Lightbulb } from 'lucide-react';
import { useCareerGuideStore } from '../../store/useCareerGuideStore';
import { useAuthStore } from '../../store/useAuthStore';

export const CareerAIMentorModal = ({ isOpen, onClose }) => {
  const user = useAuthStore((state) => state.user);
  const currentStage = useCareerGuideStore((state) => state.currentStage);
  const branch = useCareerGuideStore((state) => state.branch);
  const careerGoal = useCareerGuideStore((state) => state.careerGoal);
  const careerProfiles = useCareerGuideStore((state) => state.careerProfiles);
  const knownSkills = useCareerGuideStore((state) => state.knownSkills);
  const getActiveProfile = useCareerGuideStore((state) => state.getActiveProfile);
  const getRoadmapStats = useCareerGuideStore((state) => state.getRoadmapStats);
  const getPlacementReadiness = useCareerGuideStore((state) => state.getPlacementReadiness);

  const cleanGoal = careerGoal?.trim() || '';
  const profile = (cleanGoal && careerProfiles[cleanGoal]) || getActiveProfile();
  const stats = getRoadmapStats();
  const readiness = getPlacementReadiness();

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Hello ${(user?.name ? user.name.split(' ')[0] : 'Student')}! 👋 I am your CareerGuide AI Mentor.\n\nI'm tracking your journey from **${currentStage || 'Your stage'} (${branch || 'Engineering'})** to **${careerGoal || 'Your Target Goal'}** (${stats.percentage}% roadmap complete, ${readiness.score}% placement ready).\n\nAsk me anything about your next step, skills, projects, or placement strategy!`,
      time: 'Just now'
    }
  ]);

  const quickQuestions = [
    'What should I learn next?',
    'Am I ready for internships?',
    'Which project should I build?',
    'What skills am I missing?',
    'How can I prepare for placements?'
  ];

  if (!isOpen) return null;

  const generateAIResponse = (query) => {
    const q = query.toLowerCase();

    if (q.includes('learn next') || q.includes('next step')) {
      return `Based on your **${careerGoal}** roadmap, your next highest priority is: **${profile.nextStep.title}**.\n\n💡 **Why:** ${profile.nextStep.why}\n\nEstimated study time: **${profile.nextStep.estimatedHours}**. Focus on practical problem-solving rather than just video tutorials!`;
    }

    if (q.includes('internship') || q.includes('ready')) {
      if (readiness.score >= 60) {
        return `🎯 **Internship Assessment: Ready to apply!**\n\nYou currently have **${readiness.score}%** readiness score. You have strong programming and database foundations.\n\n**Action Plan:**\n1. Polish your GitHub repository for "${profile.projects[0]?.title}".\n2. Highlight your known skills (${knownSkills.slice(0, 4).join(', ')}).\n3. Start applying for summer intern roles on LinkedIn, Wellfound, and campus career portals!`;
      } else {
        return `⏳ **Internship Assessment: Build 1 more project first!**\n\nYour current readiness score is **${readiness.score}%**. To guarantee interview shortlists:\n\n1. Complete "${profile.projects[1]?.title}".\n2. Add live deployment links and clean README architecture diagrams.\n3. Master DSA Arrays & HashMaps basics.`;
      }
    }

    if (q.includes('project') || q.includes('build')) {
      const activeProj = profile.projects.find((p) => p.status === 'in_progress') || profile.projects[1];
      return `🚀 **Recommended Project:**\n\n**${activeProj.title}** (${activeProj.level} level)\n\n• **Skills used:** ${activeProj.skills.join(', ')}\n• **Description:** ${activeProj.description}\n• **Portfolio takeaway:** ${activeProj.outcome}\n\nShipping this project will boost your placement readiness by +20%!`;
    }

    if (q.includes('missing') || q.includes('skills')) {
      const missing = profile.requiredSkills.filter(
        (r) => !knownSkills.some((k) => r.name.toLowerCase().includes(k.toLowerCase()))
      );
      const list = missing.map((m) => `• **${m.name}** (${m.priority} Priority) — ${m.reason}`).join('\n');
      return `📊 **Skill Gap for ${careerGoal}:**\n\nYou currently know ${knownSkills.length} skills. Here are the top missing competencies to acquire:\n\n${list || 'You have foundational coverage of all required skills!'}`;
    }

    if (q.includes('placement') || q.includes('prepare')) {
      return `🎓 **Placement Strategy for ${currentStage}:**\n\n1. **DSA Core:** Practice 2 LeetCode problems daily focusing on Two Pointers, Trees, and Dynamic Programming.\n2. **Projects:** Deploy 2 full-stack/AI applications with live URLs and GitHub badges.\n3. **Core CS:** Revise Operating Systems (Processes/Threads) and DBMS (SQL Indexing).\n4. **Mock Interviews:** Practice verbal code walk-throughs using the STAR format.`;
    }

    return `For **${currentStage}** aiming for **${careerGoal}**, the best approach is to follow the 5-phase roadmap step-by-step. Focus on ${profile.nextStep.title} and verify your code with concrete projects!`;
  };

  const handleSend = (textToSend) => {
    const text = textToSend || inputQuery;
    if (!text.trim()) return;

    const userMsg = { sender: 'user', text, time: 'Just now' };
    const aiText = generateAIResponse(text);
    const aiMsg = { sender: 'ai', text: aiText, time: 'Just now' };

    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setInputQuery('');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-4 sm:p-5 shadow-2xl border border-emerald-100 dark:border-emerald-900/50 h-[85vh] flex flex-col relative overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-base text-slate-900 dark:text-white flex items-center space-x-1.5">
                  <span>CareerGuide AI Mentor</span>
                  <span className="px-2 py-0.2 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[9px] font-extrabold rounded-full">
                    Context Aware
                  </span>
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Target: {careerGoal} • {currentStage}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto py-3 space-y-3.5 pr-1 custom-scrollbar">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex items-start space-x-2 ${
                  m.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {m.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200 dark:border-emerald-800">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-tr-xs shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 rounded-tl-xs border border-slate-200/80 dark:border-slate-700/80'
                  }`}
                >
                  <div className="whitespace-pre-line font-medium">{m.text}</div>
                </div>

                {m.sender === 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0 mt-0.5 text-slate-700 dark:text-slate-200">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quick Context Prompt Chips */}
          <div className="py-2 border-t border-slate-100 dark:border-slate-800">
            <div className="text-[10px] font-bold text-slate-400 mb-1.5 flex items-center space-x-1">
              <Lightbulb className="w-3 h-3 text-amber-500" />
              <span>Suggested quick questions:</span>
            </div>
            <div className="flex space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(q)}
                  className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold rounded-xl whitespace-nowrap hover:bg-emerald-100 transition-colors cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Message Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="pt-2 flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={`Ask CareerGuide about ${careerGoal}...`}
              className="flex-1 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim()}
              className="p-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white rounded-2xl shadow-md transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
