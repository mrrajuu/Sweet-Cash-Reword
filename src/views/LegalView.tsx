import React, { useState } from 'react';
import { ShieldCheck, FileText, Mail, MessageSquare, Send } from 'lucide-react';

export const LegalView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'contact'>('terms');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center gap-2 border-b border-purple-900/60 pb-3">
        <button
          onClick={() => setActiveTab('terms')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'terms'
              ? 'bg-pink-600/30 text-white border border-pink-500/50'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Terms of Service
        </button>

        <button
          onClick={() => setActiveTab('privacy')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'privacy'
              ? 'bg-pink-600/30 text-white border border-pink-500/50'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Privacy Policy
        </button>

        <button
          onClick={() => setActiveTab('contact')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'contact'
              ? 'bg-pink-600/30 text-white border border-pink-500/50'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Contact &amp; Support
        </button>
      </div>

      {activeTab === 'terms' && (
        <div className="p-6 rounded-2xl bg-[#160a2b] border border-purple-900/60 space-y-4 text-xs text-slate-300 leading-relaxed">
          <h2 className="text-xl font-extrabold text-white">Terms of Service - Sweet Cash Rewards</h2>
          <p className="text-slate-400">Last updated: October 2026</p>

          <h4 className="font-bold text-white text-sm mt-4">1. Acceptance of Terms</h4>
          <p>
            By accessing or using Sweet Cash Rewards, you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use the platform.
          </p>

          <h4 className="font-bold text-white text-sm mt-4">2. Eligibility and Fair Play</h4>
          <p>
            Users must be at least 18 years of age. You agree to submit truthful responses in surveys and complete tasks legitimately. The use of automated scripts, bot farms, VPN spoofing, or fraudulent multiple accounts to game the reward system will result in permanent account termination and forfeiture of unpaid balances.
          </p>

          <h4 className="font-bold text-white text-sm mt-4">3. Rewards and Cryptocurrencies</h4>
          <p>
            All rewards are denominated in USDT cryptocurrency. Withdrawal requests require a minimum balance of 5.00 USDT and are subject to administrative anti-fraud verification before blockchain dispatch. A 2% network fee is deducted to cover on-chain gas costs.
          </p>

          <h4 className="font-bold text-white text-sm mt-4">4. Non-Custodial Policy</h4>
          <p>
            Sweet Cash Rewards will never solicit, collect, or store your private cryptographic keys, seed phrases, or wallet passwords. You are solely responsible for ensuring the accuracy of your destination wallet address.
          </p>
        </div>
      )}

      {activeTab === 'privacy' && (
        <div className="p-6 rounded-2xl bg-[#160a2b] border border-purple-900/60 space-y-4 text-xs text-slate-300 leading-relaxed">
          <h2 className="text-xl font-extrabold text-white">Privacy Policy</h2>
          <p className="text-slate-400">Last updated: October 2026</p>

          <h4 className="font-bold text-white text-sm mt-4">1. Information We Collect</h4>
          <p>
            We collect your email address, display name, and avatar image through Firebase Authentication (Google Sign-In) to manage your profile and ledger records. We do not sell your personal data to third parties.
          </p>

          <h4 className="font-bold text-white text-sm mt-4">2. Offerwall Partner Data Sharing</h4>
          <p>
            When engaging with third-party offerwalls (such as AdGem, OfferToro, CPAGrip), your anonymized user identifier is passed through tracking links solely to credit postback completions back to your account.
          </p>

          <h4 className="font-bold text-white text-sm mt-4">3. Data Security</h4>
          <p>
            All user data and balances are secured with Google Cloud Firestore security rules and server-side encryption. Financial balance updates can only be executed by verified backend microservices.
          </p>
        </div>
      )}

      {activeTab === 'contact' && (
        <div className="p-6 rounded-2xl bg-[#160a2b] border border-purple-900/60 space-y-6">
          <div>
            <h2 className="text-xl font-extrabold text-white">Contact &amp; Earner Support</h2>
            <p className="text-xs text-slate-300 mt-1">
              Have questions about an offer, withdrawal status, or partnership? Reach out to our 24/7 team.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#110521] border border-purple-900/40 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Official Email</span>
                <span className="text-sm font-bold text-white">support@sweetcashrewards.com</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#110521] border border-purple-900/40 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#229ED9]/20 text-[#229ED9] flex items-center justify-center">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Telegram Community</span>
                <span className="text-sm font-bold text-white">t.me/SweetCashRewardsOfficial</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
