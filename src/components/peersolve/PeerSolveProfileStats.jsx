import React from 'react';
import { Award, Star, MessageSquare, HelpCircle, CheckCircle, Flame, ShieldCheck } from 'lucide-react';
import { usePeerSolveStore } from '../../store/usePeerSolveStore';

export const PeerSolveProfileStats = () => {
  const userStats = usePeerSolveStore((state) => state.userStats);

  return (
    <div className="bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 rounded-3xl p-5 text-white shadow-xl space-y-4">
      {/* Top Banner */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
            <Award className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-sm text-white">PeerSolve Reputation</h3>
            <p className="text-[10px] text-emerald-200">Academic P2P Doubt Solver Profile</p>
          </div>
        </div>

        <span className="px-3 py-1 bg-amber-400 text-slate-950 font-extrabold text-[10px] rounded-full shadow-sm flex items-center space-x-1">
          <Flame className="w-3 h-3 fill-slate-950 text-slate-950" />
          <span>{userStats.contributorLevel || 'Trusted Helper'}</span>
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 flex flex-col items-center">
          <span className="text-[10px] text-emerald-200 font-bold">Credits</span>
          <span className="text-base font-extrabold text-amber-300 mt-0.5">🪙 {userStats.credits}</span>
        </div>

        <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 flex flex-col items-center">
          <span className="text-[10px] text-emerald-200 font-bold">Reputation</span>
          <span className="text-base font-extrabold text-amber-300 mt-0.5 flex items-center">
            <Star className="w-4 h-4 fill-amber-300 mr-0.5" />
            {userStats.reputation}
          </span>
        </div>

        <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 flex flex-col items-center">
          <span className="text-[10px] text-emerald-200 font-bold">Questions Asked</span>
          <span className="text-base font-extrabold text-white mt-0.5">❓ {userStats.questionsAsked}</span>
        </div>

        <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 flex flex-col items-center">
          <span className="text-[10px] text-emerald-200 font-bold">Best Answers</span>
          <span className="text-base font-extrabold text-emerald-300 mt-0.5">🏆 {userStats.bestAnswersCount}</span>
        </div>
      </div>

      {/* Subject Expertise Badges */}
      <div className="pt-2 border-t border-white/10">
        <span className="text-[10px] font-bold text-emerald-200 uppercase tracking-wider block mb-2">
          Verified Subject Expertise
        </span>
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(userStats.subjectExpertise || {}).map(([sub, score]) => (
            <span key={sub} className="px-2.5 py-1 bg-white/15 backdrop-blur-md text-[10px] font-semibold rounded-xl text-white flex items-center space-x-1 border border-white/10">
              <ShieldCheck className="w-3 h-3 text-cyan-300" />
              <span>{sub}</span>
              <span className="text-amber-300 font-bold ml-0.5">⭐ {score}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
