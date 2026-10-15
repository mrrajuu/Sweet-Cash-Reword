import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Gift,
  Coins,
  Wallet,
  Users,
  ChevronDown,
  CheckCircle2,
  Lock,
  Globe,
  TrendingUp,
  Star,
} from 'lucide-react';
import { Logo } from '../components/Logo';
import { useAuth } from '../context/AuthContext';

interface LandingViewProps {
  setCurrentView: (view: string) => void;
  onOpenDailyBonus: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  setCurrentView,
  onOpenDailyBonus,
}) => {
  const { loginWithGoogle, loginDemoUser } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const stats = [
    { label: 'Total Paid Out', value: '$248,500+', sub: 'in direct USDT payouts' },
    { label: 'Active Earners', value: '38,200+', sub: 'worldwide members' },
    { label: 'Average Daily Earn', value: '$8.50 - $25', sub: 'with high-reward surveys' },
    { label: 'Minimum Payout', value: '$5.00', sub: 'TRC20, BEP20, ERC20' },
  ];

  const features = [
    {
      icon: <Coins className="w-6 h-6 text-amber-400" />,
      title: 'High-Reward Offerwalls',
      desc: 'Earn up to 25.00 USDT per task with verified global surveys, gaming achievements, and mobile app trials.',
    },
    {
      icon: <Gift className="w-6 h-6 text-pink-400" />,
      title: 'Daily Streak Bonus',
      desc: 'Claim free USDT every 24 hours. Keep your daily login streak active to unlock higher bonus tiers and surprise multiplier chests.',
    },
    {
      icon: <Wallet className="w-6 h-6 text-emerald-400" />,
      title: 'Instant USDT Payouts',
      desc: 'Withdraw your rewards directly to your self-custody wallet over Tron (TRC20), BNB Chain (BEP20), or Ethereum (ERC20).',
    },
    {
      icon: <Users className="w-6 h-6 text-purple-400" />,
      title: '10% Lifetime Referrals',
      desc: 'Invite friends using your custom referral link and earn a guaranteed 10% commission on every offer they complete forever.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-sky-400" />,
      title: 'Bank-Grade Security',
      desc: 'Server-side atomic ledger validation, zero frontend balance tampering, and strict HMAC postback verification protect every cent.',
    },
    {
      icon: <Globe className="w-6 h-6 text-rose-400" />,
      title: 'Worldwide Accessibility',
      desc: 'Accessible across all smartphones and desktops. No complicated registration forms or intrusive personal document requests.',
    },
  ];

  const faqs = [
    {
      q: 'What is Sweet Cash Rewards?',
      a: 'Sweet Cash Rewards is a modern fintech GPT (Get-Paid-To) platform where users earn real cryptocurrency rewards (USDT) by completing tasks, taking market research surveys, installing mobile apps, and checking in daily.',
    },
    {
      q: 'How do I withdraw my earnings?',
      a: 'Once your available balance reaches 5.00 USDT, navigate to your Wallet, select your preferred network (TRC20, BEP20, or ERC20), enter your destination crypto address, and submit. All payouts are reviewed and sent directly on-chain.',
    },
    {
      q: 'Are there any fees or hidden costs?',
      a: 'Joining and earning on Sweet Cash Rewards is 100% free. We charge a flat 2% network fee on withdrawals to cover blockchain gas transactions.',
    },
    {
      q: 'How does the Daily Bonus work?',
      a: 'Every 24 hours, you can claim free USDT from the Daily Bonus vault. Each consecutive day you log in, your daily reward increases up to 1.00 USDT per day!',
    },
    {
      q: 'How does the Referral Program work?',
      a: 'Share your unique referral link with friends. Whenever someone signs up with your link and completes offers, you receive a 10% commission credited automatically to your account.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0d0617] text-white">
      {/* Live Payout Ticker */}
      <div className="bg-purple-950/60 border-b border-purple-900/40 py-2 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-bold text-emerald-400 uppercase tracking-wider text-[10px]">
              Live Payout Feed:
            </span>
            <span className="hidden sm:inline text-slate-300">
              User <strong className="text-white">@tomi_92</strong> received{' '}
              <strong className="text-amber-300 font-mono">14.50 USDT</strong> (TRC20)
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-purple-300">
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" /> Average Payout: <strong>&lt; 2 hrs</strong>
            </span>
            <span className="hidden md:inline flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-400" /> Non-Custodial USDT
            </span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 px-4 overflow-hidden">
        {/* Glow effects */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-r from-pink-600/20 via-purple-600/20 to-amber-500/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-900/40 border border-pink-500/30 text-pink-300 text-xs font-semibold mb-6 shadow-lg shadow-pink-500/10">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Next-Gen Rewards Platform</span>
            <span className="w-1 h-1 rounded-full bg-pink-400" />
            <span className="text-amber-300">Instant USDT Crypto Withdrawals</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-6">
            Complete Offers.{' '}
            <span className="bg-gradient-to-r from-pink-400 via-rose-300 to-amber-300 bg-clip-text text-transparent">
              Earn Rewards.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed mb-8">
            Get paid in real USDT for answering surveys, testing games, and completing high-reward tasks. Low $5 minimum withdrawal and transparent server-side verification.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto mb-12">
            <button
              onClick={loginWithGoogle}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-600 hover:to-amber-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-pink-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => loginDemoUser(false)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#1d0b38] border border-purple-700/60 hover:border-pink-500 text-slate-200 hover:text-white font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Explore Demo Session</span>
            </button>
          </div>

          {/* Social Proof Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <div className="flex -space-x-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <span className="font-semibold text-white ml-1">4.9/5 Rating</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Zero Account Lockouts</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-amber-400" />
              <span>Min. Payout $5.00 USDT</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Bar */}
      <section className="py-12 border-y border-purple-900/40 bg-[#120724]/70 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((s, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-purple-950/20 border border-purple-900/30">
              <div className="text-2xl sm:text-3xl font-extrabold text-white mb-1 font-mono">
                {s.value}
              </div>
              <div className="text-xs font-bold text-pink-300 uppercase tracking-wider mb-0.5">
                {s.label}
              </div>
              <div className="text-[11px] text-slate-400">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-pink-400 block mb-2">
            Simple 3-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            How Sweet Cash Rewards Works
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-[#160a2b] border border-purple-800/40 relative">
            <div className="w-12 h-12 rounded-xl bg-pink-500/20 border border-pink-500/40 text-pink-400 font-extrabold text-xl flex items-center justify-center mb-5">
              01
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Choose High-Paying Tasks</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Browse top verified offerwalls, consumer surveys, gaming milestones, and daily quizzes. Filter by difficulty and payout.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#160a2b] border border-purple-800/40 relative">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-400 font-extrabold text-xl flex items-center justify-center mb-5">
              02
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Instant Server Credit</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Upon task completion, partner postbacks verify the submission. Your balance updates instantly through secure server transactions.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#160a2b] border border-purple-800/40 relative">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 font-extrabold text-xl flex items-center justify-center mb-5">
              03
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Withdraw USDT Crypto</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Reach 5.00 USDT and withdraw directly to your Tron (TRC20), BNB Chain, or Ethereum wallet with transparent on-chain tracking.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-[#110522]/60 border-t border-purple-900/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block mb-2">
              Premium Fintech Standard
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Built for Maximum Earnings &amp; Security
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-[#180a2f] border border-purple-800/40 hover:border-pink-500/40 transition-all hover:shadow-xl hover:shadow-pink-500/10"
              >
                <div className="w-12 h-12 rounded-xl bg-purple-950/60 border border-purple-800/60 flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-pink-400 block mb-2">
            Got Questions?
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#160a2b] border border-purple-800/40 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-white hover:text-pink-300 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-purple-400 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-purple-900/40 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-purple-900/60 bg-[#0d0617] text-xs text-slate-400">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo size="md" />

          <div className="flex flex-wrap items-center gap-6">
            <button
              onClick={() => setCurrentView('earn')}
              className="hover:text-white transition-colors"
            >
              Earn Offers
            </button>
            <button
              onClick={() => setCurrentView('postbacks')}
              className="hover:text-white transition-colors"
            >
              Postback Integration
            </button>
            <button
              onClick={() => setCurrentView('security')}
              className="hover:text-white transition-colors"
            >
              Security Rules
            </button>
            <button
              onClick={() => setCurrentView('legal')}
              className="hover:text-white transition-colors"
            >
              Privacy &amp; Terms
            </button>
          </div>

          <div className="text-center md:text-right text-[11px] text-slate-400">
            © 2026 Sweet Cash Rewards. All rights reserved.
            <br />
            Designed for transparent, secure digital rewards.
          </div>
        </div>
      </footer>
    </div>
  );
};
