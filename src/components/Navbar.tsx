import React, { useState } from 'react';
import {
  Wallet,
  Gift,
  Flame,
  User as UserIcon,
  LogOut,
  Shield,
  LogIn,
  ChevronDown,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { Logo } from './Logo';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  onOpenDailyBonus: () => void;
  onOpenWithdraw: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  onOpenDailyBonus,
  onOpenWithdraw,
}) => {
  const { user, profile, isAdmin, loginWithGoogle, loginDemoUser, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#120724]/90 backdrop-blur-xl border-b border-purple-900/40 px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div
          onClick={() => setCurrentView(user ? 'dashboard' : 'landing')}
          className="cursor-pointer"
        >
          <Logo size="md" />
        </div>

        {/* Center/Right Nav Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* Daily Bonus Quick Button */}
              <button
                onClick={onOpenDailyBonus}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-600/20 to-purple-600/20 border border-pink-500/40 text-pink-300 hover:text-white hover:border-pink-500 transition-all text-xs font-bold cursor-pointer"
              >
                <Gift className="w-3.5 h-3.5 text-pink-400" />
                <span>Daily Bonus</span>
                {profile?.dailyStreak ? (
                  <span className="flex items-center gap-0.5 text-[10px] text-amber-400 font-extrabold bg-amber-400/20 px-1.5 py-0.5 rounded-md">
                    <Flame className="w-2.5 h-2.5 fill-amber-400" />
                    {profile.dailyStreak}d
                  </span>
                ) : null}
              </button>

              {/* Wallet Balance Pill */}
              <div
                onClick={onOpenWithdraw}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1d0b36] border border-amber-400/40 hover:border-amber-400 text-white transition-all cursor-pointer shadow-sm group"
                title="Click to withdraw USDT"
              >
                <div className="w-5 h-5 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                  <Wallet className="w-3 h-3" />
                </div>
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-mono font-extrabold text-amber-300">
                      {(profile?.balance || 0).toFixed(2)}
                    </span>
                    <span className="text-[10px] font-bold text-amber-400/90">USDT</span>
                  </div>
                </div>
              </div>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl bg-[#1d0b36] border border-purple-800/60 hover:border-purple-600 text-white transition-all"
                >
                  {profile?.photoURL ? (
                    <img
                      src={profile.photoURL}
                      alt={profile.displayName}
                      className="w-7 h-7 rounded-lg object-cover border border-purple-500/30"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-lg bg-pink-600/30 border border-pink-500/40 flex items-center justify-center text-pink-300">
                      <UserIcon className="w-4 h-4" />
                    </div>
                  )}
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#1a0c32] border border-purple-800/80 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="p-2 border-b border-purple-900/60 mb-1">
                      <p className="text-xs font-bold text-white truncate">{profile?.displayName}</p>
                      <p className="text-[10px] text-slate-400 truncate">{profile?.email}</p>
                      <div className="mt-1 flex items-center gap-1">
                        <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-300 uppercase tracking-wider">
                          {profile?.role || 'user'}
                        </span>
                        {isAdmin && (
                          <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 uppercase tracking-wider flex items-center gap-1">
                            <Shield className="w-2.5 h-2.5" />
                            Admin
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setCurrentView('dashboard');
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-purple-900/40 hover:text-white flex items-center gap-2"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-pink-400" />
                      Dashboard
                    </button>

                    <button
                      onClick={() => {
                        setCurrentView('wallet');
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-purple-900/40 hover:text-white flex items-center gap-2"
                    >
                      <Wallet className="w-3.5 h-3.5 text-amber-400" />
                      Wallet & Withdrawals
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => {
                          setCurrentView('admin');
                          setDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs text-amber-300 hover:bg-amber-400/10 flex items-center gap-2 font-bold"
                      >
                        <Shield className="w-3.5 h-3.5 text-amber-400" />
                        Admin Review Panel
                      </button>
                    )}

                    <div className="my-1 border-t border-purple-900/60" />

                    <button
                      onClick={() => {
                        logout();
                        setDropdownOpen(false);
                        setCurrentView('landing');
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs text-rose-300 hover:bg-rose-950/40 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-400" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Logged Out Controls */
            <div className="flex items-center gap-2">
              <button
                onClick={() => loginDemoUser(false)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-900/40 border border-purple-800 text-slate-300 hover:text-white hover:border-purple-600 transition-all text-xs font-semibold"
                title="Instant test session without Google popup"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Demo User
              </button>

              <button
                onClick={() => loginDemoUser(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition-all text-xs font-semibold"
                title="Test platform as Admin with payout review powers"
              >
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                Admin Demo
              </button>

              <button
                onClick={loginWithGoogle}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-600 hover:to-amber-600 text-white font-bold text-xs shadow-lg shadow-pink-500/20 transition-all cursor-pointer transform active:scale-95"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In with Google</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
