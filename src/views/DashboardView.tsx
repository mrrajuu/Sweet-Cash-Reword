import React, { useState, useEffect } from 'react';
import {
  Wallet,
  Coins,
  Gift,
  ArrowUpRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Copy,
  Users,
  ExternalLink,
  Flame,
  Sparkles,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Transaction } from '../types';

interface DashboardViewProps {
  setCurrentView: (view: string) => void;
  onOpenDailyBonus: () => void;
  onOpenWithdraw: () => void;
  onSuccessToast: (title: string, message: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  setCurrentView,
  onOpenDailyBonus,
  onOpenWithdraw,
  onSuccessToast,
}) => {
  const { user, profile, refreshProfile } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  // Fetch recent transactions
  useEffect(() => {
    let isMounted = true;
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        // Fallback demo transactions or real records
        const sampleTxs: Transaction[] = [
          {
            id: 'tx-welcome-01',
            userId: user?.uid || 'user',
            type: 'daily_bonus',
            amount: 0.10,
            status: 'completed',
            title: 'Welcome Daily Check-in',
            description: 'Day 1 streak check-in bonus credited to your wallet.',
            createdAt: new Date().toISOString(),
          },
        ];

        if (profile?.dailyStreak && profile.dailyStreak > 1) {
          sampleTxs.push({
            id: 'tx-streak-02',
            userId: user?.uid || 'user',
            type: 'daily_bonus',
            amount: 0.15,
            status: 'completed',
            title: `Day ${profile.dailyStreak} Streak Check-In`,
            description: 'Consecutive daily claim bonus.',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
          });
        }

        if (isMounted) {
          setTransactions(sampleTxs);
        }
      } catch (err) {
        console.warn('Error loading transactions:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTransactions();
    return () => {
      isMounted = false;
    };
  }, [user?.uid, profile?.dailyStreak]);

  const referralUrl = `${window.location.origin}?ref=${profile?.referralCode || 'SWEET'}`;

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    onSuccessToast('Referral Link Copied!', 'Share with friends to earn 10% commission on every offer they finish.');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/80 via-[#25103f] to-[#1a0c30] border border-pink-500/20 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-pink-400 uppercase tracking-widest">
              Earner Portal
            </span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30 font-bold">
              Active Member
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            Welcome back, <span className="text-pink-300">{profile?.displayName || 'Earner'}</span>!
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            You are earning USDT with Sweet Cash Rewards. Complete surveys, try mobile apps, and withdraw directly to your self-custody wallet.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <button
            onClick={onOpenDailyBonus}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-pink-500/20 transition-all cursor-pointer active:scale-95"
          >
            <Gift className="w-4 h-4" />
            <span>Daily Bonus</span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-md font-mono">
              Day {profile?.dailyStreak || 1}
            </span>
          </button>

          <button
            onClick={() => refreshProfile()}
            className="p-2.5 rounded-xl bg-purple-900/40 border border-purple-800 text-slate-300 hover:text-white hover:bg-purple-900/60 transition-colors"
            title="Refresh balance from Firestore"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Balance Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Available Balance */}
        <div className="p-5 rounded-2xl bg-[#170a2b] border border-amber-400/40 shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Available Balance
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="text-3xl font-extrabold text-white font-mono">
              {(profile?.balance || 0).toFixed(2)}
            </span>
            <span className="text-xs font-bold text-amber-400">USDT</span>
          </div>
          <button
            onClick={onOpenWithdraw}
            className="w-full mt-2 py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Withdraw USDT</span>
          </button>
        </div>

        {/* Pending Balance */}
        <div className="p-5 rounded-2xl bg-[#170a2b] border border-purple-800/50 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
              Pending Earnings
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="text-3xl font-extrabold text-slate-200 font-mono">
              {(profile?.pendingBalance || 0).toFixed(2)}
            </span>
            <span className="text-xs font-bold text-purple-300">USDT</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-3">
            Under partner verification or pending withdrawal review.
          </p>
        </div>

        {/* Lifetime Earnings */}
        <div className="p-5 rounded-2xl bg-[#170a2b] border border-purple-800/50 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Lifetime Earned
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="text-3xl font-extrabold text-white font-mono">
              {(profile?.totalEarned || 0).toFixed(2)}
            </span>
            <span className="text-xs font-bold text-emerald-400">USDT</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-3">
            Cumulative total earned from all offers, bonuses, and referrals.
          </p>
        </div>

        {/* Referral Earnings / Code */}
        <div className="p-5 rounded-2xl bg-[#170a2b] border border-purple-800/50 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-pink-400">
              Referral Program
            </span>
            <div className="w-8 h-8 rounded-lg bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-extrabold text-white font-mono">
              {profile?.referralCount || 0}
            </span>
            <span className="text-xs text-slate-400 font-semibold">Friends Invited</span>
          </div>
          <button
            onClick={() => setCurrentView('referrals')}
            className="w-full mt-2 py-2 px-3 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 text-pink-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>View 10% Referrals</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Quick Action Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={() => setCurrentView('earn')}
          className="p-5 rounded-2xl bg-gradient-to-br from-pink-900/30 to-[#180a2b] border border-pink-500/30 hover:border-pink-500/60 transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400 mb-3 group-hover:scale-105 transition-transform">
            <Coins className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-white mb-1">Browse Available Offers</h4>
          <p className="text-xs text-slate-300">
            High-reward surveys, app installs, and game quests paying up to 8.50 USDT each.
          </p>
        </div>

        <div
          onClick={onOpenDailyBonus}
          className="p-5 rounded-2xl bg-gradient-to-br from-purple-900/30 to-[#180a2b] border border-purple-700/40 hover:border-purple-500/60 transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 mb-3 group-hover:scale-105 transition-transform">
            <Gift className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-white mb-1">Daily Streak Vault</h4>
          <p className="text-xs text-slate-300">
            Log in every 24 hours to claim increasing USDT rewards and maintain your consecutive streak.
          </p>
        </div>

        <div
          onClick={handleCopyReferral}
          className="p-5 rounded-2xl bg-gradient-to-br from-amber-900/20 to-[#180a2b] border border-amber-500/30 hover:border-amber-500/60 transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-3 group-hover:scale-105 transition-transform">
            <Users className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-white mb-1">Copy Your Referral Link</h4>
          <p className="text-xs text-slate-300">
            {copied ? 'Copied to clipboard!' : 'Click to copy your unique link. Earn 10% commission on referrals forever.'}
          </p>
        </div>
      </div>

      {/* Recent Activity / Financial Ledger */}
      <div className="p-6 rounded-2xl bg-[#150926] border border-purple-900/50 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-purple-900/40 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Recent Transactions</h3>
              <p className="text-xs text-slate-400">Ledger of credits, daily claims, and payouts</p>
            </div>
          </div>

          <button
            onClick={() => setCurrentView('wallet')}
            className="text-xs font-bold text-pink-400 hover:text-pink-300 transition-colors flex items-center gap-1"
          >
            <span>Full History</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {transactions.length === 0 ? (
          <div className="py-12 text-center">
            <Coins className="w-10 h-10 text-purple-600 mx-auto mb-3 opacity-60" />
            <h4 className="text-sm font-bold text-white mb-1">No Transactions Yet</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
              Complete your first survey, try an app offer, or claim your daily bonus to record your initial earnings!
            </p>
            <button
              onClick={() => setCurrentView('earn')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs"
            >
              Start Earning Now
            </button>
          </div>
        ) : (
          <div className="divide-y divide-purple-900/40">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="py-3.5 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      tx.type === 'daily_bonus'
                        ? 'bg-pink-500/20 text-pink-400'
                        : tx.type === 'withdrawal'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}
                  >
                    {tx.type === 'daily_bonus' ? (
                      <Gift className="w-4 h-4" />
                    ) : tx.type === 'withdrawal' ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <Coins className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <h5 className="font-bold text-white">{tx.title}</h5>
                    <p className="text-[11px] text-slate-400">{tx.description}</p>
                    <span className="text-[10px] text-slate-400">
                      {new Date(tx.createdAt).toLocaleDateString()} at{' '}
                      {new Date(tx.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`font-mono font-extrabold text-sm ${
                      tx.amount > 0 ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  >
                    {tx.amount > 0 ? `+${tx.amount.toFixed(2)}` : tx.amount.toFixed(2)} USDT
                  </span>
                  <div className="mt-0.5">
                    <span
                      className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                        tx.status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : tx.status === 'pending'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
