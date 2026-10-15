import React, { useState, useEffect } from 'react';
import { X, Gift, Sparkles, Clock, CheckCircle2, Flame, Award, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';

interface DailyBonusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessToast: (title: string, message: string) => void;
}

export const DailyBonusModal: React.FC<DailyBonusModalProps> = ({
  isOpen,
  onClose,
  onSuccessToast,
}) => {
  const { user, profile, updateLocalBalance, refreshProfile } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);
  const [canClaim, setCanClaim] = useState<boolean>(true);

  // Streak amounts
  const streakRewards = [0.10, 0.15, 0.20, 0.25, 0.30, 0.35, 0.50];
  const currentStreak = profile?.dailyStreak || 0;

  useEffect(() => {
    if (!profile?.lastDailyBonusClaim) {
      setCanClaim(true);
      setTimeRemaining(null);
      return;
    }

    const checkEligibility = () => {
      const lastClaimTime = new Date(profile.lastDailyBonusClaim!).getTime();
      const nextAvailableTime = lastClaimTime + 24 * 60 * 60 * 1000;
      const now = Date.now();

      if (now < nextAvailableTime) {
        setCanClaim(false);
        const diffMs = nextAvailableTime - now;
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
        setTimeRemaining(
          `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      } else {
        setCanClaim(true);
        setTimeRemaining(null);
      }
    };

    checkEligibility();
    const interval = setInterval(checkEligibility, 1000);
    return () => clearInterval(interval);
  }, [profile?.lastDailyBonusClaim]);

  if (!isOpen) return null;

  const handleClaim = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/claim-daily-bonus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid,
          userEmail: user.email,
          userDisplayName: user.displayName,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to claim daily bonus.');
        return;
      }

      // Celebrate with confetti!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#EC4899', '#F59E0B', '#8B5CF6', '#10B981'],
      });

      updateLocalBalance(data.newBalance);
      await refreshProfile();

      onSuccessToast(
        'Daily Bonus Claimed!',
        `+${data.amount} USDT added to your wallet! Streak is now Day ${data.streak} 🔥`
      );
      onClose();
    } catch (err: any) {
      setError(err.message || 'Network error claiming bonus.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-[#24113e] to-[#120722] border border-pink-500/30 rounded-2xl shadow-2xl p-6 overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-pink-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                Daily Check-In Reward
                <span className="flex items-center gap-1 text-xs font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/30">
                  <Flame className="w-3.5 h-3.5 fill-amber-400" />
                  Day {currentStreak}
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                Log in every 24 hours to claim increasing USDT rewards
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 7-Day Streak Timeline */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Streak Rewards Ladder
            </span>
            <span className="text-xs text-pink-400 font-medium">
              Max Level: 1.00 USDT / day
            </span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {streakRewards.map((reward, idx) => {
              const dayNum = idx + 1;
              const isPast = dayNum < currentStreak;
              const isCurrent = dayNum === currentStreak;

              return (
                <div
                  key={dayNum}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                    isCurrent
                      ? 'bg-gradient-to-b from-pink-600/30 to-purple-600/30 border-pink-500 text-white shadow-lg shadow-pink-500/20 scale-105'
                      : isPast
                      ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                      : 'bg-[#180a2c] border-purple-900/50 text-slate-400'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider mb-1">
                    Day {dayNum}
                  </span>
                  {isPast ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 my-0.5" />
                  ) : dayNum === 7 ? (
                    <Award className="w-4 h-4 text-amber-400 my-0.5" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-pink-400 my-0.5" />
                  )}
                  <span className="text-xs font-bold text-white mt-1">
                    +{reward.toFixed(2)}
                  </span>
                  <span className="text-[9px] text-amber-400/80 font-medium">USDT</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status or Cooldown Display */}
        <div className="mt-6 p-4 rounded-xl bg-purple-950/40 border border-purple-800/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Next Available Claim</p>
              <p className="text-xs text-slate-400">
                {canClaim ? 'Available right now!' : `Ready in ${timeRemaining}`}
              </p>
            </div>
          </div>
          {canClaim ? (
            <span className="px-2.5 py-1 text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full animate-pulse">
              Ready to Claim
            </span>
          ) : (
            <span className="font-mono text-sm font-bold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-lg border border-amber-400/30">
              {timeRemaining}
            </span>
          )}
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs leading-relaxed">
            {error}
          </div>
        )}

        {/* Claim Button */}
        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={handleClaim}
            disabled={!canClaim || loading}
            className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
              canClaim && !loading
                ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-600 hover:to-amber-600 text-white shadow-pink-500/25 cursor-pointer transform active:scale-98'
                : 'bg-purple-900/40 border border-purple-800/60 text-slate-400 cursor-not-allowed opacity-70'
            }`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Validating with Security Server...
              </span>
            ) : canClaim ? (
              <>
                <Gift className="w-4 h-4" />
                Claim Today&apos;s Bonus (+{streakRewards[Math.min(currentStreak, 6)].toFixed(2)} USDT)
              </>
            ) : (
              <>
                <Clock className="w-4 h-4" />
                Cooldown Active (Come back in {timeRemaining})
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Server-side eligibility validation prevents duplicate or frontend tampering.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
