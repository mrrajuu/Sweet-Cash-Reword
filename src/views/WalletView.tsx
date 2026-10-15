import React, { useState, useEffect } from 'react';
import {
  Wallet,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Lock,
  Coins,
  Filter,
  ExternalLink,
  Info,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Transaction } from '../types';

interface WalletViewProps {
  onOpenWithdraw: () => void;
  onSuccessToast: (title: string, message: string) => void;
}

export const WalletView: React.FC<WalletViewProps> = ({ onOpenWithdraw }) => {
  const { user, profile } = useAuth();
  const [filterType, setFilterType] = useState<string>('all');
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    // Build ledger entries from user data
    const list: Transaction[] = [
      {
        id: 'tx-init-bonus',
        userId: user?.uid || 'user',
        type: 'daily_bonus',
        amount: 0.10,
        status: 'completed',
        title: 'Initial Daily Check-In Bonus',
        description: 'Server validated streak reward.',
        createdAt: profile?.createdAt || new Date().toISOString(),
      },
    ];

    if (profile?.pendingBalance && profile.pendingBalance > 0) {
      list.unshift({
        id: 'tx-pending-wdr',
        userId: user?.uid || 'user',
        type: 'withdrawal',
        amount: -profile.pendingBalance,
        status: 'pending',
        title: 'USDT (TRC20) Withdrawal Request',
        description: 'Under administrator review and manual payout dispatch.',
        network: 'TRC20',
        walletAddress: 'TY18zW87J9vD...k92P',
        createdAt: new Date().toISOString(),
      });
    }

    setTransactions(list);
  }, [user?.uid, profile?.pendingBalance, profile?.createdAt]);

  const filteredTransactions = transactions.filter((tx) => {
    if (filterType === 'all') return true;
    if (filterType === 'withdrawals') return tx.type === 'withdrawal';
    if (filterType === 'earnings') return tx.type === 'offer' || tx.type === 'survey' || tx.type === 'task';
    if (filterType === 'bonuses') return tx.type === 'daily_bonus';
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Wallet Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#210c3b] via-[#1a0a30] to-[#120524] border border-amber-400/30 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-widest flex items-center gap-1">
              <Coins className="w-3.5 h-3.5" /> Crypto Wallet &amp; Payouts
            </span>
          </div>
          <h2 className="text-3xl font-extrabold text-white flex items-baseline gap-2">
            {(profile?.balance || 0).toFixed(2)}
            <span className="text-base text-amber-400 font-bold">USDT</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-lg">
            Available non-custodial balance. Withdraw directly to self-custody wallets over Tron, BNB Chain, or Ethereum.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenWithdraw}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-600 hover:to-amber-600 text-white font-extrabold text-sm flex items-center gap-2 shadow-xl shadow-pink-500/25 transition-all transform active:scale-95 cursor-pointer"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Withdraw USDT</span>
          </button>
        </div>
      </div>

      {/* Network Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#160a2b] border border-purple-900/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-white">TRC20 (Tron)</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-extrabold">
              LOWEST GAS
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Fastest confirmation time with minimal network fees. Recommended for wallets like Trust Wallet and TronLink.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#160a2b] border border-purple-900/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-white">BEP20 (BNB Chain)</span>
            <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded font-extrabold">
              POPULAR
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Convenient for Binance, MetaMask, and decentralized exchange liquidity.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#160a2b] border border-purple-900/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-white">ERC20 (Ethereum)</span>
            <span className="text-[10px] bg-purple-400/20 text-purple-300 px-2 py-0.5 rounded font-extrabold">
              STANDARD
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Native Ethereum USDT. Suitable for cold storage hardware devices and institutional custody.
          </p>
        </div>
      </div>

      {/* Security notice regarding crypto payouts */}
      <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-800/60 flex items-start gap-3 text-xs text-slate-300">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-white">Anti-Fraud &amp; Non-Custodial Security Policy:</strong>
          <p className="text-slate-400 mt-0.5 leading-relaxed">
            Sweet Cash Rewards never requests private keys or seed phrases. To ensure compliance and prevent bot fraud, withdrawal requests are audited by administrators before transaction broadcast.
          </p>
        </div>
      </div>

      {/* Transaction History */}
      <div className="p-6 rounded-2xl bg-[#150926] border border-purple-900/50 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-purple-900/40 mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-pink-400" />
            <h3 className="text-base font-bold text-white">Wallet Ledger History</h3>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 bg-[#1a0a30] p-1 rounded-xl border border-purple-900/60">
            {['all', 'withdrawals', 'earnings', 'bonuses'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterType(tab)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-colors ${
                  filterType === tab
                    ? 'bg-pink-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            No transactions match the selected filter.
          </div>
        ) : (
          <div className="divide-y divide-purple-900/40">
            {filteredTransactions.map((tx) => (
              <div
                key={tx.id}
                className="py-3.5 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      tx.type === 'withdrawal'
                        ? 'bg-amber-500/20 text-amber-400'
                        : tx.type === 'daily_bonus'
                        ? 'bg-pink-500/20 text-pink-400'
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}
                  >
                    {tx.type === 'withdrawal' ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <Coins className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <h5 className="font-bold text-white">{tx.title}</h5>
                    <p className="text-[11px] text-slate-400">{tx.description}</p>
                    {tx.walletAddress && (
                      <span className="font-mono text-[10px] text-purple-300 block">
                        Wallet: {tx.walletAddress}
                      </span>
                    )}
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
