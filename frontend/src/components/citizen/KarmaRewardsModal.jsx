import React from 'react';
import { X, Award, Sparkles, Trophy, ShieldCheck, Zap, Gift, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CITIZEN_LEADERBOARD } from '../../data/mockData';

export function KarmaRewardsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-gradient-to-r from-amber-950/40 via-slate-900 to-emerald-950/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-lg shadow-amber-500/20">
              <Trophy size={24} />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-white">Citizen Green Karma Rewards</h3>
              <p className="text-xs text-slate-400">Earn points & municipal rebates for verified reports</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* User Score Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/60 via-slate-900 to-slate-950 border border-amber-500/30 relative overflow-hidden shadow-xl">
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                  Current Level: Tier 4
                </span>
                <h4 className="font-heading font-extrabold text-2xl text-white">Green Sentinel 🛡️</h4>
              </div>
              <div className="text-right">
                <span className="text-3xl font-heading font-black text-amber-400">840</span>
                <span className="text-xs text-slate-400 block font-medium">Karma XP</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5 mt-2">
              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span>Next Rank: Eco Ambassador (1000 XP)</span>
                <span>84%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
                <div className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full" style={{ width: '84%' }}></div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs text-slate-300 flex items-center gap-1.5">
                <Gift size={14} className="text-amber-400" />
                <span>5% Rebate on Municipal Property Tax</span>
              </span>
              <button
                onClick={triggerConfetti}
                className="text-xs px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all cursor-pointer shadow-md shadow-amber-500/20"
              >
                Claim Perk 🎉
              </button>
            </div>
          </div>

          {/* Badges Earned */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Your Earned Badges:
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-slate-950/70 border border-emerald-500/30 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  🌟
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-200">Eco Champion</p>
                  <p className="text-[10px] text-slate-400">10+ Verified Reports</p>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-blue-500/30 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                  🛡️
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-200">Verified Reporter</p>
                  <p className="text-[10px] text-slate-400">100% Legit Accuracy</p>
                </div>
              </div>
            </div>
          </div>

          {/* City Leaderboard */}
          <div>
            <div className="flex justify-between items-center mb-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                City Cleanliness Leaderboard:
              </span>
              <span className="text-[11px] text-emerald-400 font-bold">Ward 4 Top Ranked</span>
            </div>
            <div className="space-y-2">
              {CITIZEN_LEADERBOARD.map((user) => (
                <div
                  key={user.rank}
                  className={`p-3 rounded-xl flex items-center justify-between border ${
                    user.rank === 1
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                      : 'bg-slate-950/50 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                        user.rank === 1
                          ? 'bg-amber-400 text-slate-950'
                          : user.rank === 2
                          ? 'bg-slate-400 text-slate-950'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {user.rank}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-white flex items-center gap-1.5">
                        {user.name}
                        {user.rank === 1 && <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1 rounded">You</span>}
                      </p>
                      <p className="text-[10px] text-slate-400">{user.badges.join(' • ')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-extrabold font-mono text-emerald-400">{user.points} XP</span>
                    <span className="text-[10px] text-slate-500 block">{user.resolvedCount} cleaned</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
