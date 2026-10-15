import React, { useState } from 'react';
import { X, ArrowUpRight, ShieldAlert, CheckCircle2, AlertCircle, Info, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CryptoNetwork } from '../types';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessToast: (title: string, message: string) => void;
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isOpen,
  onClose,
  onSuccessToast,
}) => {
  const { user, profile, updateLocalBalance, refreshProfile } = useAuth();
  const [network, setNetwork] = useState<CryptoNetwork>('TRC20');
  const [amount, setAmount] = useState<string>('5.00');
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentBalance = profile?.balance || 0;
  const numAmount = parseFloat(amount) || 0;
  const fee = Number((numAmount * 0.02).toFixed(2));
  const netAmount = Math.max(0, Number((numAmount - fee).toFixed(2)));

  const handleMax = () => {
    setAmount(currentBalance.toFixed(2));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setError(null);

    if (numAmount < 5.0) {
      setError('Minimum withdrawal threshold is 5.00 USDT.');
      return;
    }

    if (numAmount > currentBalance) {
      setError(`Insufficient balance. You only have ${currentBalance.toFixed(2)} USDT available.`);
      return;
    }

    const cleanAddress = walletAddress.trim();
    if (!cleanAddress) {
      setError('Please provide a valid destination wallet address.');
      return;
    }

    if (network === 'TRC20' && (!cleanAddress.startsWith('T') || cleanAddress.length !== 34)) {
      setError('Invalid TRC20 address. Tron USDT addresses start with "T" and are exactly 34 characters.');
      return;
    }

    if ((network === 'BEP20' || network === 'ERC20') && (!cleanAddress.startsWith('0x') || cleanAddress.length !== 42)) {
      setError(`Invalid ${network} address. Ethereum/BSC addresses start with "0x" and are 42 characters.`);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid,
          amount: numAmount,
          network,
          walletAddress: cleanAddress,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to submit withdrawal.');
        return;
      }

      updateLocalBalance(data.newBalance);
      await refreshProfile();

      onSuccessToast(
        'Withdrawal Request Submitted!',
        `${numAmount.toFixed(2)} USDT queued for manual admin security audit. Net amount: ${netAmount.toFixed(2)} USDT.`
      );
      onClose();
    } catch (err: any) {
      setError(err.message || 'Network error processing withdrawal request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-[#24113e] to-[#120722] border border-pink-500/30 rounded-2xl shadow-2xl p-6 overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-pink-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-600 to-purple-600 flex items-center justify-center text-white shadow-md">
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Withdraw USDT</h3>
              <p className="text-xs text-slate-300">Fast crypto payout to your self-custody wallet</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Balance overview banner */}
          <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-800/40 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Available Balance</span>
              <span className="text-lg font-bold text-white tracking-tight">
                {currentBalance.toFixed(2)} <span className="text-xs text-amber-400 font-normal">USDT</span>
              </span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block font-medium">Min. Payout</span>
              <span className="text-sm font-semibold text-pink-400">5.00 USDT</span>
            </div>
          </div>

          {/* Network Selection */}
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
              Select Blockchain Network
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {(['TRC20', 'BEP20', 'ERC20'] as CryptoNetwork[]).map((net) => (
                <button
                  key={net}
                  type="button"
                  onClick={() => setNetwork(net)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    network === net
                      ? 'bg-gradient-to-b from-pink-600/30 to-purple-600/30 border-pink-500 text-white shadow-md shadow-pink-500/20'
                      : 'bg-[#180a2c] border-purple-900/50 text-slate-400 hover:border-purple-700'
                  }`}
                >
                  <div className="font-bold text-sm">{net}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {net === 'TRC20' ? 'Tron (Lowest Fee)' : net === 'BEP20' ? 'BNB Chain' : 'Ethereum'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Withdrawal Amount (USDT)
              </label>
              <button
                type="button"
                onClick={handleMax}
                className="text-xs font-bold text-pink-400 hover:text-pink-300 transition-colors cursor-pointer"
              >
                Use MAX Balance
              </button>
            </div>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="5"
                max={currentBalance}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="5.00"
                className="w-full bg-[#130623] border border-purple-800/80 rounded-xl px-4 py-3 text-white font-mono font-bold text-base focus:outline-none focus:border-pink-500 transition-colors pr-16"
              />
              <span className="absolute right-4 top-3.5 text-xs font-bold text-amber-400">USDT</span>
            </div>
          </div>

          {/* Wallet Address Input */}
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
              Destination {network} Wallet Address
            </label>
            <input
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder={network === 'TRC20' ? 'T...' : '0x...'}
              className="w-full bg-[#130623] border border-purple-800/80 rounded-xl px-4 py-3 text-white font-mono text-xs focus:outline-none focus:border-pink-500 transition-colors"
            />
            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <Info className="w-3 h-3 text-purple-400 shrink-0" />
              Double check your address. Transactions to incorrect addresses cannot be refunded.
            </p>
          </div>

          {/* Breakdown summary */}
          <div className="p-3 rounded-xl bg-[#140824] border border-purple-900/40 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Gross Amount:</span>
              <span className="font-mono text-white">{numAmount.toFixed(2)} USDT</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Network & Processing Fee (2%):</span>
              <span className="font-mono text-rose-400">-{fee.toFixed(2)} USDT</span>
            </div>
            <div className="pt-1.5 border-t border-purple-900/60 flex justify-between font-bold">
              <span className="text-white">Net Payout to Your Wallet:</span>
              <span className="font-mono text-emerald-400 text-sm">{netAmount.toFixed(2)} USDT</span>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          {/* Security notice complying with security requirements */}
          <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/50 text-[11px] text-slate-300 flex items-start gap-2 leading-relaxed">
            <Lock className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Security Guarantee:</strong> We never request private keys or seed phrases. Payouts undergo administrative anti-fraud verification before blockchain broadcast.
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || currentBalance < 5.0}
            className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
              currentBalance >= 5.0 && !loading
                ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-600 hover:to-amber-600 text-white shadow-pink-500/25 cursor-pointer transform active:scale-98'
                : 'bg-purple-900/40 border border-purple-800/60 text-slate-400 cursor-not-allowed opacity-70'
            }`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting Withdrawal Request...
              </span>
            ) : currentBalance < 5.0 ? (
              <span>Balance Below Minimum 5.00 USDT</span>
            ) : (
              <>
                <ArrowUpRight className="w-4 h-4" />
                Request Withdrawal ({netAmount.toFixed(2)} USDT)
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
