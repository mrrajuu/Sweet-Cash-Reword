import React, { useState, useEffect } from 'react';
import {
  Shield,
  Clock,
  CheckCircle2,
  XCircle,
  Users,
  Wallet,
  Coins,
  ArrowUpRight,
  RefreshCw,
  Search,
  ExternalLink,
  Sliders,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Withdrawal, PostbackLog } from '../types';

interface AdminViewProps {
  onSuccessToast: (title: string, message: string) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ onSuccessToast }) => {
  const { user, profile, isAdmin } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [recentLogs, setRecentLogs] = useState<PostbackLog[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'withdrawals' | 'users' | 'postbacks'>('withdrawals');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/overview', {
        headers: {
          'x-admin-key': 'sweetcash_admin_secret_key_demo',
          'x-user-email': user?.email || '',
        },
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStats(data.stats);
        setWithdrawals(data.withdrawals || []);
        setRecentLogs(data.recentLogs || []);
        setUsersList(data.users || []);
      }
    } catch (err) {
      console.warn('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [user?.email]);

  const handleWithdrawalAction = async (withdrawalId: string, action: 'approve' | 'reject') => {
    setProcessingId(withdrawalId);
    try {
      const res = await fetch('/api/admin/withdrawal/action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': 'sweetcash_admin_secret_key_demo',
          'x-user-email': user?.email || '',
        },
        body: JSON.stringify({
          withdrawalId,
          action,
          txHash: action === 'approve' ? `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}` : undefined,
          adminNotes: action === 'approve' ? 'Approved & broadcast by Master Admin' : 'Rejected after KYC review. Balance refunded.',
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        onSuccessToast(
          action === 'approve' ? 'Withdrawal Approved!' : 'Withdrawal Rejected',
          data.message
        );
        await fetchAdminData();
      } else {
        alert(data.error || 'Failed to process withdrawal action.');
      }
    } catch (err: any) {
      alert(err.message || 'Error communicating with admin server.');
    } finally {
      setProcessingId(null);
    }
  };

  if (!isAdmin) {
    return (
      <div className="p-12 text-center rounded-2xl bg-[#160a2b] border border-rose-500/30">
        <AlertTriangle className="w-12 h-12 text-rose-400 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-white mb-2">Administrator Access Required</h3>
        <p className="text-xs text-slate-300 max-w-md mx-auto">
          You must be authenticated with the master email (mdfarukhossain8573@gmail.com) or hold an admin role in Cloud Firestore.
        </p>
      </div>
    );
  }

  const pendingWithdrawals = withdrawals.filter((w) => w.status === 'pending');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/40 via-[#26133a] to-[#140624] border border-amber-400/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" /> High Privilege Operations
            </span>
            <span className="text-[10px] bg-amber-400/20 text-amber-300 font-extrabold px-2 py-0.5 rounded-full border border-amber-400/40">
              BOOTSTRAP SUPERUSER
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            Sweet Cash Admin Management Console
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Audit user balances, approve or reject manual cryptocurrency withdrawals, and monitor real-time offerwall postback callbacks.
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          className="px-4 py-2.5 rounded-xl bg-purple-900/60 hover:bg-purple-900 border border-purple-700 text-white font-bold text-xs flex items-center gap-2 transition-colors shrink-0 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Records</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#160a2b] border border-purple-900/60">
          <span className="text-[11px] text-slate-400 font-semibold uppercase block mb-1">
            Pending Payouts
          </span>
          <div className="text-2xl font-extrabold text-amber-400 font-mono">
            {stats?.pendingWithdrawalsCount ?? pendingWithdrawals.length}
          </div>
          <span className="text-[10px] text-slate-400">
            ${stats?.totalPendingAmount ?? 0} USDT queued
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#160a2b] border border-purple-900/60">
          <span className="text-[11px] text-slate-400 font-semibold uppercase block mb-1">
            Total Paid Out
          </span>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono">
            ${stats?.totalPaidAmount ?? 0}
          </div>
          <span className="text-[10px] text-slate-400">in completed withdrawals</span>
        </div>

        <div className="p-4 rounded-xl bg-[#160a2b] border border-purple-900/60">
          <span className="text-[11px] text-slate-400 font-semibold uppercase block mb-1">
            Registered Users
          </span>
          <div className="text-2xl font-extrabold text-white font-mono">
            {stats?.totalUsersCount ?? usersList.length}
          </div>
          <span className="text-[10px] text-slate-400">active members</span>
        </div>

        <div className="p-4 rounded-xl bg-[#160a2b] border border-purple-900/60">
          <span className="text-[11px] text-slate-400 font-semibold uppercase block mb-1">
            Postback Logs
          </span>
          <div className="text-2xl font-extrabold text-purple-300 font-mono">
            {stats?.totalLogsCount ?? recentLogs.length}
          </div>
          <span className="text-[10px] text-slate-400">webhook events logged</span>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-purple-900/60 pb-2">
        <button
          onClick={() => setActiveTab('withdrawals')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'withdrawals'
              ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Withdrawal Requests ({pendingWithdrawals.length} Pending)
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'users'
              ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          User Accounts Directory
        </button>

        <button
          onClick={() => setActiveTab('postbacks')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'postbacks'
              ? 'bg-pink-600/30 text-pink-200 border border-pink-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Webhook Audit Logs
        </button>
      </div>

      {/* Withdrawals Management Tab */}
      {activeTab === 'withdrawals' && (
        <div className="p-6 rounded-2xl bg-[#150926] border border-purple-900/60 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center justify-between">
            <span>Pending Withdrawal Audit Queue</span>
            <span className="text-xs text-slate-400 font-normal">
              Review destination addresses before sending USDT on-chain
            </span>
          </h3>

          {withdrawals.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No withdrawal requests recorded yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-purple-900/50 rounded-xl overflow-hidden">
                <thead className="bg-[#10041f] text-slate-300 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="p-3">User &amp; Time</th>
                    <th className="p-3">Gross / Net</th>
                    <th className="p-3">Network &amp; Wallet</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-900/40 text-slate-300">
                  {withdrawals.map((w) => (
                    <tr key={w.id} className="hover:bg-purple-950/20">
                      <td className="p-3">
                        <div className="font-bold text-white">{w.userEmail || w.userId}</div>
                        <div className="text-[10px] text-slate-400">
                          {new Date(w.createdAt).toLocaleString()}
                        </div>
                      </td>
                      <td className="p-3 font-mono">
                        <div className="font-bold text-amber-300">{w.amount.toFixed(2)} USDT</div>
                        <div className="text-[10px] text-slate-400">Net: {w.netAmount.toFixed(2)} USDT</div>
                      </td>
                      <td className="p-3 font-mono">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-900/60 text-purple-300 mr-1.5">
                          {w.network}
                        </span>
                        <span className="text-[11px] text-slate-300">{w.walletAddress}</span>
                        {w.txHash && (
                          <div className="text-[10px] text-emerald-400 mt-0.5 truncate max-w-xs">
                            TX: {w.txHash}
                          </div>
                        )}
                      </td>
                      <td className="p-3">
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                            w.status === 'approved'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : w.status === 'pending'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-rose-500/20 text-rose-300'
                          }`}
                        >
                          {w.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {w.status === 'pending' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleWithdrawalAction(w.id, 'approve')}
                              disabled={processingId === w.id}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs transition-colors cursor-pointer"
                            >
                              Approve Payout
                            </button>
                            <button
                              onClick={() => handleWithdrawalAction(w.id, 'reject')}
                              disabled={processingId === w.id}
                              className="px-2.5 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-bold text-xs transition-colors cursor-pointer"
                            >
                              Reject &amp; Refund
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Processed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* User Directory Tab */}
      {activeTab === 'users' && (
        <div className="p-6 rounded-2xl bg-[#150926] border border-purple-900/60 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white">Registered Users &amp; Balances</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-purple-900/50 rounded-xl overflow-hidden">
              <thead className="bg-[#10041f] text-slate-300 uppercase font-bold text-[10px]">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Available Balance</th>
                  <th className="p-3">Lifetime Earned</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-900/40 text-slate-300">
                {usersList.map((u) => (
                  <tr key={u.uid} className="hover:bg-purple-950/20">
                    <td className="p-3">
                      <div className="font-bold text-white">{u.displayName || 'Sweet Earner'}</div>
                      <div className="text-[10px] text-slate-400">{u.email || u.uid}</div>
                    </td>
                    <td className="p-3 font-mono font-bold text-amber-300">
                      {(u.balance || 0).toFixed(2)} USDT
                    </td>
                    <td className="p-3 font-mono font-bold text-emerald-400">
                      {(u.totalEarned || 0).toFixed(2)} USDT
                    </td>
                    <td className="p-3">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-purple-900/60 text-purple-300">
                        {u.role || 'user'}
                      </span>
                    </td>
                    <td className="p-3 text-[10px] text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Webhook Audit Logs Tab */}
      {activeTab === 'postbacks' && (
        <div className="p-6 rounded-2xl bg-[#150926] border border-purple-900/60 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white">Postback Webhook Audit Records</h3>
          {recentLogs.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No webhook events recorded yet. Trigger one in the Postback API Docs tab!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-purple-900/50 rounded-xl overflow-hidden">
                <thead className="bg-[#10041f] text-slate-300 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="p-3">Provider</th>
                    <th className="p-3">Transaction ID</th>
                    <th className="p-3">User ID</th>
                    <th className="p-3">Payout</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">IP / Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-900/40 text-slate-300">
                  {recentLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-purple-950/20">
                      <td className="p-3 font-bold text-white">{log.provider}</td>
                      <td className="p-3 font-mono text-purple-300">{log.transactionId}</td>
                      <td className="p-3 font-mono text-[11px] text-slate-400">{log.userId}</td>
                      <td className="p-3 font-mono font-bold text-emerald-400">+{log.payout} USDT</td>
                      <td className="p-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            log.status === 'success'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-rose-500/20 text-rose-300'
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="p-3 text-[10px] text-slate-400">
                        {log.ip} · {new Date(log.createdAt).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
