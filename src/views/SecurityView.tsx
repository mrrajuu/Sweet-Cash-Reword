import React from 'react';
import {
  ShieldCheck,
  Lock,
  Server,
  KeyRound,
  FileCode,
  AlertTriangle,
  CheckCircle2,
  Database,
  Coins,
} from 'lucide-react';

export const SecurityView: React.FC = () => {
  const securityPillars = [
    {
      title: 'Zero Frontend Balance Manipulation',
      rule: 'Never allow users to edit balance or role in Firestore',
      desc: 'Security rules strictly block client writes to balance, pendingBalance, totalEarned, and role fields. Profile updates only permit safe fields like displayName.',
      status: 'Enforced via firestore.rules',
    },
    {
      title: 'Server-Side Reward Validation',
      rule: 'Never credit rewards from frontend-only actions',
      desc: 'All increments for Daily Bonus, Offerwalls, and Referrals are verified through atomic server endpoints (/api/claim-daily-bonus, /api/postback/offerwall).',
      status: 'Enforced in server.ts',
    },
    {
      title: 'Provider Secret Protection',
      rule: 'Never expose API keys or provider secrets on client',
      desc: 'OFFERWALL_POSTBACK_SECRET and ADMIN_SECRET_KEY reside strictly in server environment variables. Client bundles contain zero provider secrets.',
      status: 'Protected via .env & backend',
    },
    {
      title: 'Atomic Financial Transactions',
      rule: 'Atomicity and duplicate transaction prevention',
      desc: 'Unique transaction ID hashing rejects duplicate callbacks from offerwalls, and withdrawal deductions are coupled with ledger creations synchronously.',
      status: 'Active Deduplication Guard',
    },
    {
      title: 'Mandatory Admin Review for Payouts',
      rule: 'Require human review before manual USDT payouts',
      desc: 'Withdrawal requests enter a pending state and must be audited and verified by an authorized administrator before on-chain broadcast.',
      status: 'RBAC Admin Review Queue',
    },
    {
      title: 'Non-Custodial Architecture',
      rule: 'Never request private keys or seed phrases',
      desc: 'Users provide only public wallet addresses (TRC20, BEP20, ERC20). Sweet Cash Rewards never holds user keys or demands seed phrases.',
      status: 'Strict Non-Custodial Policy',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Hero Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/70 via-[#1f0b35] to-[#120524] border border-sky-400/30 shadow-xl">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold text-sky-400 uppercase tracking-widest flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Security Architecture &amp; Audit
          </span>
        </div>
        <h2 className="text-2xl font-extrabold text-white">
          Fintech Defense &amp; Security Invariants
        </h2>
        <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
          Sweet Cash Rewards is engineered with Zero-Trust principles: all balance mutations are server-authoritative, Firestore rules deny arbitrary writes, and crypto payouts require multi-step verification.
        </p>
      </div>

      {/* 6 Security Mandates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {securityPillars.map((pillar, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-[#160a2b] border border-purple-900/60 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20">
                  Requirement 0{idx + 1}
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1">{pillar.title}</h4>
              <p className="text-[11px] text-pink-300 font-semibold mb-2">{pillar.rule}</p>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">{pillar.desc}</p>
            </div>

            <div className="pt-3 border-t border-purple-900/40 text-[10px] font-mono text-emerald-400">
              ✓ {pillar.status}
            </div>
          </div>
        ))}
      </div>

      {/* Deployment & Environment Setup Guide */}
      <div className="p-6 rounded-2xl bg-[#140824] border border-purple-800/60 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Server className="w-4 h-4 text-amber-400" />
          Environment Configuration &amp; Deployment Instructions
        </h3>

        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <div className="p-3.5 rounded-xl bg-[#0f041b] border border-purple-900/60">
            <h5 className="font-bold text-white mb-1">1. Environment Variables (.env)</h5>
            <p className="text-slate-400 mb-2">
              Set the following keys in your hosting environment (Cloud Run, Vercel, or VPS):
            </p>
            <pre className="p-2.5 rounded-lg bg-black/60 text-pink-300 font-mono text-[11px] overflow-x-auto">
              ADMIN_SECRET_KEY=&quot;your_strong_admin_secret_key&quot;{'\n'}
              OFFERWALL_POSTBACK_SECRET=&quot;partner_shared_postback_secret&quot;{'\n'}
              BOOTSTRAP_ADMIN_EMAIL=&quot;mdfarukhossain8573@gmail.com&quot;
            </pre>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0f041b] border border-purple-900/60">
            <h5 className="font-bold text-white mb-1">2. First Admin Configuration</h5>
            <p className="text-slate-400">
              The user with email <strong className="text-white">mdfarukhossain8573@gmail.com</strong> is configured as the bootstrapped superuser in both Firestore Security Rules and backend routes. To grant admin access to additional team members, add their UID to the <code className="text-amber-300">admins/{'{adminId}'}</code> collection in Cloud Firestore.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0f041b] border border-purple-900/60">
            <h5 className="font-bold text-white mb-1">3. Connecting Live Offerwall Networks</h5>
            <p className="text-slate-400">
              In your AdGem, OfferToro, CPAGrip, or Lootably publisher portal, set the postback URL to:
              <br />
              <code className="text-emerald-300 font-mono text-[11px]">
                https://your-domain.com/api/postback/offerwall?userId={'{user_id}'}&amp;txId={'{tx_id}'}&amp;payout={'{payout}'}&amp;secret=YOUR_SECRET
              </code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
