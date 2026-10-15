import React, { useState } from 'react';
import {
  Users,
  Copy,
  Check,
  Share2,
  Gift,
  Coins,
  ShieldCheck,
  TrendingUp,
  MessageCircle,
  Twitter,
  Send,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ReferralViewProps {
  onSuccessToast: (title: string, message: string) => void;
}

export const ReferralView: React.FC<ReferralViewProps> = ({ onSuccessToast }) => {
  const { user, profile } = useAuth();
  const [copied, setCopied] = useState<boolean>(false);

  const referralCode = profile?.referralCode || (user?.uid ? user.uid.substring(0, 8).toUpperCase() : 'SWEET77');
  const referralLink = `${window.location.origin}?ref=${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    onSuccessToast('Referral Link Copied!', 'Share on social media or with friends to start earning 10% commissions.');
    setTimeout(() => setCopied(false), 2500);
  };

  const shareText = encodeURIComponent(
    `Earn free USDT cryptocurrency with Sweet Cash Rewards! Complete surveys, app offers, and daily check-ins. Join using my VIP link: ${referralLink}`
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Referral Program Hero */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-pink-950/50 via-[#260f3d] to-[#160829] border border-pink-500/30 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-widest flex items-center gap-1">
              <Gift className="w-3.5 h-3.5" /> Lifetime Affiliate Program
            </span>
          </div>
          <h2 className="text-3xl font-extrabold text-white">
            Earn <span className="text-pink-400">10% Lifetime Commission</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
            Invite your friends to Sweet Cash Rewards. Whenever they finish an offer, survey, or quiz, you receive an automated 10% bonus instantly into your wallet.
          </p>
        </div>

        {/* Stats Pill */}
        <div className="p-4 rounded-xl bg-purple-950/60 border border-purple-800/60 flex items-center gap-5 shrink-0">
          <div>
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Total Referred</span>
            <span className="text-2xl font-extrabold text-white font-mono">
              {profile?.referralCount || 0}
            </span>
          </div>
          <div className="h-8 w-px bg-purple-800" />
          <div>
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Commission Rate</span>
            <span className="text-2xl font-extrabold text-emerald-400 font-mono">10%</span>
          </div>
        </div>
      </div>

      {/* Share Box */}
      <div className="p-6 rounded-2xl bg-[#170a2c] border border-purple-800/50 shadow-lg space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Share2 className="w-4 h-4 text-pink-400" />
          Your Unique Referral Link
        </h3>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="w-full relative flex-1">
            <input
              type="text"
              readOnly
              value={referralLink}
              className="w-full bg-[#110521] border border-purple-800/80 rounded-xl px-4 py-3 text-xs text-pink-300 font-mono focus:outline-none select-all"
            />
          </div>

          <button
            onClick={handleCopy}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shrink-0 cursor-pointer active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Social Sharing */}
        <div className="pt-3 border-t border-purple-900/40 flex flex-wrap items-center gap-3">
          <span className="text-xs text-slate-400 font-semibold">Share via:</span>

          <a
            href={`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${shareText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-lg bg-[#229ED9]/20 border border-[#229ED9]/40 text-[#229ED9] hover:bg-[#229ED9]/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Telegram</span>
          </a>

          <a
            href={`https://twitter.com/intent/tweet?text=${shareText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-lg bg-[#1DA1F2]/20 border border-[#1DA1F2]/40 text-[#1DA1F2] hover:bg-[#1DA1F2]/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Twitter className="w-3.5 h-3.5" />
            <span>X (Twitter)</span>
          </a>

          <a
            href={`https://api.whatsapp.com/send?text=${shareText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-lg bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Commission calculation explanation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#150926] border border-purple-900/50">
          <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold mb-3">
            01
          </div>
          <h4 className="text-sm font-bold text-white mb-1">Friend Signs Up</h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Your friend registers using your invitation link. Their account is permanently linked to your profile ID.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#150926] border border-purple-900/50">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold mb-3">
            02
          </div>
          <h4 className="text-sm font-bold text-white mb-1">Friend Completes Tasks</h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Your friend completes high-reward offers, surveys, or quizzes and receives 100% of their earned USDT.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#150926] border border-purple-900/50">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold mb-3">
            03
          </div>
          <h4 className="text-sm font-bold text-white mb-1">You Get 10% Extra</h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Our platform pays you an additional 10% match from platform reserves. Your friend loses zero earnings.
          </p>
        </div>
      </div>

      {/* Program Terms and Rules */}
      <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-800/60 text-xs text-slate-300 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-white">Fair Play &amp; Anti-Sybil Policy:</strong>
          <p className="text-slate-400 leading-relaxed">
            Self-referrals, automated bot accounts, or proxy clusters are strictly prohibited. Referrals must be genuine distinct individuals completing real partner tasks.
          </p>
        </div>
      </div>
    </div>
  );
};
