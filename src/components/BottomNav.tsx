import React from 'react';
import { LayoutDashboard, Coins, Gift, Wallet, Users, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface BottomNavProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  onOpenDailyBonus: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentView,
  setCurrentView,
  onOpenDailyBonus,
}) => {
  const { user, isAdmin } = useAuth();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#120724]/95 backdrop-blur-xl border-t border-purple-900/60 px-2 py-2 flex items-center justify-around">
      <button
        onClick={() => setCurrentView(user ? 'dashboard' : 'landing')}
        className={`flex flex-col items-center gap-1 p-1.5 transition-colors ${
          currentView === 'dashboard' || currentView === 'landing'
            ? 'text-pink-400 font-bold'
            : 'text-slate-400 hover:text-white'
        }`}
      >
        <LayoutDashboard className="w-5 h-5" />
        <span className="text-[10px]">Home</span>
      </button>

      <button
        onClick={() => setCurrentView('earn')}
        className={`flex flex-col items-center gap-1 p-1.5 transition-colors ${
          currentView === 'earn' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-white'
        }`}
      >
        <Coins className="w-5 h-5" />
        <span className="text-[10px]">Earn</span>
      </button>

      {/* Floating center Daily Bonus */}
      <button
        onClick={onOpenDailyBonus}
        className="flex flex-col items-center gap-1 -mt-5"
      >
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-pink-500/30 border-2 border-[#120724] active:scale-95 transition-transform">
          <Gift className="w-6 h-6" />
        </div>
        <span className="text-[10px] font-bold text-amber-300">Bonus</span>
      </button>

      <button
        onClick={() => setCurrentView('wallet')}
        className={`flex flex-col items-center gap-1 p-1.5 transition-colors ${
          currentView === 'wallet' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-white'
        }`}
      >
        <Wallet className="w-5 h-5" />
        <span className="text-[10px]">Wallet</span>
      </button>

      {isAdmin ? (
        <button
          onClick={() => setCurrentView('admin')}
          className={`flex flex-col items-center gap-1 p-1.5 transition-colors ${
            currentView === 'admin' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Shield className="w-5 h-5" />
          <span className="text-[10px]">Admin</span>
        </button>
      ) : (
        <button
          onClick={() => setCurrentView('referrals')}
          className={`flex flex-col items-center gap-1 p-1.5 transition-colors ${
            currentView === 'referrals' ? 'text-pink-400 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px]">Referrals</span>
        </button>
      )}
    </nav>
  );
};
