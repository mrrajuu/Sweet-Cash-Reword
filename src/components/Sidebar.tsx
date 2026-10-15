import React from 'react';
import {
  LayoutDashboard,
  Gift,
  Coins,
  Wallet,
  Users,
  Code2,
  Shield,
  ShieldCheck,
  FileText,
  Flame,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  onOpenDailyBonus: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  setCurrentView,
  onOpenDailyBonus,
}) => {
  const { user, profile, isAdmin } = useAuth();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
      requiresAuth: true,
    },
    {
      id: 'earn',
      label: 'Earn Rewards',
      icon: <Coins className="w-4 h-4 text-amber-400" />,
      badge: 'HOT',
      requiresAuth: false,
    },
    {
      id: 'wallet',
      label: 'Wallet & Payouts',
      icon: <Wallet className="w-4 h-4 text-emerald-400" />,
      requiresAuth: true,
    },
    {
      id: 'referrals',
      label: 'Referrals (10%)',
      icon: <Users className="w-4 h-4 text-pink-400" />,
      requiresAuth: true,
    },
    {
      id: 'postbacks',
      label: 'Postback API Docs',
      icon: <Code2 className="w-4 h-4 text-purple-400" />,
      requiresAuth: false,
    },
    {
      id: 'security',
      label: 'Security & Rules',
      icon: <ShieldCheck className="w-4 h-4 text-sky-400" />,
      requiresAuth: false,
    },
    {
      id: 'legal',
      label: 'Terms & Privacy',
      icon: <FileText className="w-4 h-4 text-slate-400" />,
      requiresAuth: false,
    },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 bg-[#120724]/60 border-r border-purple-900/40 p-4 min-h-[calc(100vh-61px)]">
      {/* Daily Bonus Quick Promo Banner */}
      {user && (
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-pink-600/20 via-purple-900/30 to-amber-500/10 border border-pink-500/30 shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-1">
              <Flame className="w-3 h-3 fill-amber-400" />
              Streak Day {profile?.dailyStreak || 1}
            </span>
            <span className="text-[10px] text-pink-300 font-bold bg-pink-500/20 px-2 py-0.5 rounded-full">
              Free USDT
            </span>
          </div>
          <h4 className="text-sm font-bold text-white mb-1">Daily Check-In</h4>
          <p className="text-[11px] text-slate-300 mb-3">
            Claim your daily bonus to keep your consecutive reward streak alive!
          </p>
          <button
            onClick={onOpenDailyBonus}
            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-pink-500 to-amber-500 hover:from-pink-600 hover:to-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer active:scale-98"
          >
            <Gift className="w-3.5 h-3.5" />
            Claim Bonus
          </button>
        </div>
      )}

      {/* Main Navigation links */}
      <div className="space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 px-3 mb-2 block">
          Menu
        </span>

        {navItems.map((item) => {
          if (item.requiresAuth && !user) return null;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-pink-600/30 to-purple-600/30 border border-pink-500/50 text-white shadow-md shadow-pink-500/10 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-purple-950/40'
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-pink-500/20 text-pink-300 border border-pink-500/30">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Admin Panel Link */}
      {isAdmin && (
        <div className="mt-6 pt-6 border-t border-purple-900/40">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 px-3 mb-2 block flex items-center gap-1">
            <Shield className="w-3 h-3" />
            Administration
          </span>
          <button
            onClick={() => setCurrentView('admin')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              currentView === 'admin'
                ? 'bg-amber-400/20 border border-amber-400/50 text-amber-300'
                : 'text-amber-400 hover:bg-amber-400/10'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Shield className="w-4 h-4 text-amber-400" />
              <span>Admin Console</span>
            </div>
            <span className="text-[9px] bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded font-extrabold">
              SECURE
            </span>
          </button>
        </div>
      )}

      {/* Trust & Guarantee Footer in sidebar */}
      <div className="mt-auto pt-6 text-[11px] text-slate-400 space-y-2">
        <div className="flex items-center gap-1.5 text-slate-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Zero Frontend Balance Tampering</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-300">
          <Coins className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Min. Payout: 5.00 USDT</span>
        </div>
      </div>
    </aside>
  );
};
