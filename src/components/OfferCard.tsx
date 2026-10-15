import React, { useState } from 'react';
import { Clock, ShieldCheck, PlayCircle, ExternalLink, Sparkles, CheckCircle2 } from 'lucide-react';
import { Offer } from '../types';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';

interface OfferCardProps {
  offer: Offer;
  onSuccessToast: (title: string, message: string) => void;
}

export const OfferCard: React.FC<OfferCardProps> = ({ offer, onSuccessToast }) => {
  const { user, updateLocalBalance, refreshProfile } = useAuth();
  const [completing, setCompleting] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(false);

  const categoryIcons: Record<string, string> = {
    survey: '📋',
    app: '📱',
    signup: '✨',
    quiz: '🧠',
    task: '⚡',
  };

  const difficultyColors: Record<string, string> = {
    Easy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    Hard: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  };

  const handleSimulateCompletion = async () => {
    if (!user) {
      onSuccessToast('Sign In Required', 'Please create an account or sign in to complete offers and earn USDT.');
      return;
    }

    setCompleting(true);
    try {
      const res = await fetch('/api/offers/complete-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid,
          offerId: offer.id,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setCompleted(true);
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
        updateLocalBalance(data.newBalance);
        await refreshProfile();
        onSuccessToast(
          'Offer Verified (Demo)',
          `+${offer.rewardAmount} USDT credited to your balance via ${offer.provider} simulator.`
        );
      } else {
        alert(data.error || 'Failed to complete demo offer.');
      }
    } catch (err: any) {
      console.error('Demo completion error:', err);
    } finally {
      setCompleting(false);
    }
  };

  return (
    <div className="group relative bg-[#170a2a] border border-purple-800/40 hover:border-pink-500/40 rounded-2xl p-5 transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/10 flex flex-col justify-between">
      {/* Top badges */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl p-2 rounded-xl bg-purple-950/60 border border-purple-800/40">
              {categoryIcons[offer.category] || '🎁'}
            </span>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block">
                {offer.provider}
              </span>
              <h4 className="text-base font-bold text-white group-hover:text-pink-300 transition-colors line-clamp-1">
                {offer.title}
              </h4>
            </div>
          </div>

          <div className="flex flex-col items-end shrink-0">
            <span className="text-sm font-extrabold text-amber-400 bg-amber-400/10 border border-amber-400/30 px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-sm">
              <span className="text-xs text-amber-300">$</span>
              {offer.rewardAmount.toFixed(2)}
              <span className="text-[10px] font-medium text-amber-300/80">USDT</span>
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 mb-3">
          {offer.description}
        </p>

        {/* Requirements Box */}
        <div className="p-2.5 rounded-xl bg-[#110521] border border-purple-900/40 text-[11px] text-slate-400 mb-4">
          <span className="font-semibold text-slate-300 block mb-0.5">Requirement:</span>
          {offer.requirements}
        </div>
      </div>

      {/* Meta & Actions */}
      <div>
        <div className="flex items-center justify-between text-xs text-slate-400 mb-4 pb-3 border-b border-purple-900/40">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-purple-400" />
            <span>~{offer.timeEstimate}</span>
          </div>

          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${difficultyColors[offer.difficulty] || ''}`}>
            {offer.difficulty}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {completed ? (
            <button
              disabled
              className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 font-bold text-xs flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              Completed
            </button>
          ) : (
            <button
              onClick={handleSimulateCompletion}
              disabled={completing}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-pink-500/20 active:scale-98 cursor-pointer disabled:opacity-60"
            >
              {completing ? (
                <span className="flex items-center gap-1.5">
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Verifying...
                </span>
              ) : (
                <>
                  <PlayCircle className="w-4 h-4" />
                  Simulate Demo Task
                </>
              )}
            </button>
          )}

          <div
            title="Demo environment task. Postback integration verified on backend."
            className="p-2 rounded-xl bg-purple-950/60 border border-purple-800/40 text-slate-400 text-[10px] flex items-center justify-center font-bold"
          >
            DEMO
          </div>
        </div>
      </div>
    </div>
  );
};
