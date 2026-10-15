import React, { useState } from 'react';
import {
  Code2,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Copy,
  Check,
  AlertTriangle,
  Play,
  Terminal,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface PostbackViewProps {
  onSuccessToast: (title: string, message: string) => void;
}

export const PostbackView: React.FC<PostbackViewProps> = ({ onSuccessToast }) => {
  const { user, profile, updateLocalBalance, refreshProfile } = useAuth();
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);
  const [copiedSnippet, setCopiedSnippet] = useState<boolean>(false);

  // Simulator Form State
  const [simUserId, setSimUserId] = useState<string>(user?.uid || 'user-demo-uid-101');
  const [simTxId, setSimTxId] = useState<string>(`tx-test-${Date.now().toString().slice(-6)}`);
  const [simPayout, setSimPayout] = useState<string>('2.50');
  const [simProvider, setSimProvider] = useState<string>('AdGem Network');
  const [simSecret, setSimSecret] = useState<string>('sweetcash_postback_secret_key_prod');
  const [simStatus, setSimStatus] = useState<string>('credit');
  const [simLoading, setSimLoading] = useState<boolean>(false);
  const [simResult, setSimResult] = useState<any>(null);

  const postbackTemplate = `${window.location.origin}/api/postback/offerwall?userId={user_id}&txId={transaction_id}&payout={payout_amount}&secret=YOUR_OFFERWALL_SECRET&provider=AdGem`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(postbackTemplate);
    setCopiedUrl(true);
    onSuccessToast('Postback URL Template Copied!', 'Paste this into your Offerwall partner dashboard (AdGem, OfferToro, etc.)');
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  const handleRunSimulator = async () => {
    setSimLoading(true);
    setSimResult(null);

    try {
      const res = await fetch('/api/postback/offerwall', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: simUserId,
          txId: simTxId,
          payout: parseFloat(simPayout) || 0,
          provider: simProvider,
          secret: simSecret,
          status: simStatus,
          offerName: `Test ${simProvider} Offer`,
        }),
      });

      const text = await res.text();
      let parsed = null;
      try {
        parsed = JSON.parse(text);
      } catch {
        parsed = { rawResponse: text, status: res.status };
      }

      setSimResult({
        httpStatus: res.status,
        body: parsed,
      });

      if (res.ok) {
        onSuccessToast(
          'Postback Webhook Verified!',
          `Server processed the callback with HTTP 200 (${typeof parsed === 'object' ? JSON.stringify(parsed) : parsed})`
        );
        await refreshProfile();
        setSimTxId(`tx-test-${Date.now().toString().slice(-6)}`);
      }
    } catch (err: any) {
      setSimResult({
        error: err.message,
      });
    } finally {
      setSimLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/60 via-[#200d38] to-[#140624] border border-purple-800/50 shadow-xl">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold text-pink-400 uppercase tracking-widest flex items-center gap-1">
            <Code2 className="w-3.5 h-3.5" /> Developer &amp; Partner Integration
          </span>
        </div>
        <h2 className="text-2xl font-extrabold text-white">
          Secure Offerwall Postback Webhook Engine
        </h2>
        <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
          Production-grade postback receiver equipped with HMAC-SHA256 signature verification, duplicate transaction protection, and atomic database balance credits.
        </p>
      </div>

      {/* 3 Pillars of Postback Security */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#160a2b] border border-purple-900/50">
          <div className="w-9 h-9 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold mb-3">
            01
          </div>
          <h4 className="text-sm font-bold text-white mb-1">Signature Verification</h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Requests must supply either the pre-shared secret key or an HMAC-SHA256 digest calculated over <code className="text-pink-300 bg-pink-950/60 px-1 py-0.5 rounded">userId:txId:payout</code>.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#160a2b] border border-purple-900/50">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold mb-3">
            02
          </div>
          <h4 className="text-sm font-bold text-white mb-1">Deduplication Protection</h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Every transaction ID is locked in the ledger. Repeated webhook attempts respond with HTTP 200 acknowledge without double crediting.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#160a2b] border border-purple-900/50">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold mb-3">
            03
          </div>
          <h4 className="text-sm font-bold text-white mb-1">Reversal &amp; Chargebacks</h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            If a network reports fraud or qualification rollback via <code className="text-emerald-300 bg-emerald-950/60 px-1 py-0.5 rounded">status=reversal</code>, the balance adjustment is logged safely.
          </p>
        </div>
      </div>

      {/* Postback URL Configuration Box */}
      <div className="p-6 rounded-2xl bg-[#170a2c] border border-purple-800/50 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            Your Postback Webhook URL Template
          </h3>
          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            HTTP GET &amp; POST SUPPORTED
          </span>
        </div>

        <p className="text-xs text-slate-300">
          Configure this URL in your partner dashboards (AdGem, OfferToro, Lootably, CPAGrip, Pollfish):
        </p>

        <div className="relative">
          <input
            type="text"
            readOnly
            value={postbackTemplate}
            className="w-full bg-[#110521] border border-purple-800/80 rounded-xl px-4 py-3 text-xs text-emerald-400 font-mono focus:outline-none select-all pr-24"
          />
          <button
            onClick={handleCopyUrl}
            className="absolute right-2 top-2 px-3 py-1.5 rounded-lg bg-purple-900/60 hover:bg-purple-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copiedUrl ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Supported Parameters Reference Table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs border border-purple-900/50 rounded-xl overflow-hidden">
            <thead className="bg-[#120524] text-slate-300 uppercase font-bold text-[10px]">
              <tr>
                <th className="p-2.5">Parameter</th>
                <th className="p-2.5">Type</th>
                <th className="p-2.5">Description</th>
                <th className="p-2.5">Example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-900/40 text-slate-300">
              <tr>
                <td className="p-2.5 font-mono text-pink-400">userId</td>
                <td className="p-2.5">String</td>
                <td className="p-2.5">User identifier in Sweet Cash Rewards</td>
                <td className="p-2.5 font-mono text-slate-400">{user?.uid || 'user-123'}</td>
              </tr>
              <tr>
                <td className="p-2.5 font-mono text-pink-400">txId</td>
                <td className="p-2.5">String</td>
                <td className="p-2.5">Unique transaction ID from offerwall</td>
                <td className="p-2.5 font-mono text-slate-400">adg_9823481</td>
              </tr>
              <tr>
                <td className="p-2.5 font-mono text-pink-400">payout</td>
                <td className="p-2.5">Number</td>
                <td className="p-2.5">Reward in USDT to credit to user</td>
                <td className="p-2.5 font-mono text-slate-400">2.50</td>
              </tr>
              <tr>
                <td className="p-2.5 font-mono text-pink-400">secret</td>
                <td className="p-2.5">String</td>
                <td className="p-2.5">Pre-shared secret configured in env</td>
                <td className="p-2.5 font-mono text-slate-400">sweetcash_postback_secret...</td>
              </tr>
              <tr>
                <td className="p-2.5 font-mono text-pink-400">status</td>
                <td className="p-2.5">String</td>
                <td className="p-2.5">&apos;credit&apos; or &apos;reversal&apos; for chargebacks</td>
                <td className="p-2.5 font-mono text-slate-400">credit</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Webhook Simulator */}
      <div className="p-6 rounded-2xl bg-[#150826] border border-amber-400/40 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-purple-900/40">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center">
              <Play className="w-4 h-4 fill-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Interactive Webhook Simulator</h3>
              <p className="text-xs text-slate-400">
                Test the live server endpoint directly with simulated parameters
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold bg-amber-400/10 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full">
            REAL SERVER TEST
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
              Target User ID
            </label>
            <input
              type="text"
              value={simUserId}
              onChange={(e) => setSimUserId(e.target.value)}
              className="w-full bg-[#100520] border border-purple-800 rounded-xl p-2.5 text-white font-mono"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
              Transaction ID
            </label>
            <input
              type="text"
              value={simTxId}
              onChange={(e) => setSimTxId(e.target.value)}
              className="w-full bg-[#100520] border border-purple-800 rounded-xl p-2.5 text-white font-mono"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
              Payout (USDT)
            </label>
            <input
              type="number"
              step="0.05"
              value={simPayout}
              onChange={(e) => setSimPayout(e.target.value)}
              className="w-full bg-[#100520] border border-purple-800 rounded-xl p-2.5 text-white font-mono"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
              Provider Name
            </label>
            <input
              type="text"
              value={simProvider}
              onChange={(e) => setSimProvider(e.target.value)}
              className="w-full bg-[#100520] border border-purple-800 rounded-xl p-2.5 text-white"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
              Secret Key
            </label>
            <input
              type="text"
              value={simSecret}
              onChange={(e) => setSimSecret(e.target.value)}
              className="w-full bg-[#100520] border border-purple-800 rounded-xl p-2.5 text-white font-mono"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
              Action Status
            </label>
            <select
              value={simStatus}
              onChange={(e) => setSimStatus(e.target.value)}
              className="w-full bg-[#100520] border border-purple-800 rounded-xl p-2.5 text-white"
            >
              <option value="credit">Credit User (Normal)</option>
              <option value="reversal">Reversal (Chargeback)</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleRunSimulator}
          disabled={simLoading}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
        >
          {simLoading ? (
            <span className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Sending Callback...
            </span>
          ) : (
            <>
              <Terminal className="w-4 h-4" />
              <span>Simulate Partner Postback Call</span>
            </>
          )}
        </button>

        {simResult && (
          <div className="mt-3 p-4 rounded-xl bg-[#0e041c] border border-purple-900/80 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-purple-900/60">
              <span className="text-slate-400">Server Response Status:</span>
              <span
                className={`font-bold px-2 py-0.5 rounded ${
                  simResult.httpStatus === 200
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-rose-500/20 text-rose-400'
                }`}
              >
                HTTP {simResult.httpStatus || 'ERROR'}
              </span>
            </div>
            <pre className="text-emerald-300 overflow-x-auto whitespace-pre-wrap">
              {JSON.stringify(simResult.body || simResult, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
