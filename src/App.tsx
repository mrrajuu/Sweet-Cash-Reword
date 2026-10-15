/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { ToastContainer, ToastMessage } from './components/Toast';
import { DailyBonusModal } from './components/DailyBonusModal';
import { WithdrawModal } from './components/WithdrawModal';

// Views
import { LandingView } from './views/LandingView';
import { DashboardView } from './views/DashboardView';
import { EarnView } from './views/EarnView';
import { WalletView } from './views/WalletView';
import { ReferralView } from './views/ReferralView';
import { PostbackView } from './views/PostbackView';
import { AdminView } from './views/AdminView';
import { SecurityView } from './views/SecurityView';
import { LegalView } from './views/LegalView';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<string>('landing');
  const [dailyBonusOpen, setDailyBonusOpen] = useState<boolean>(false);
  const [withdrawOpen, setWithdrawOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // If user is logged in and still on landing, auto-transition to dashboard
  React.useEffect(() => {
    if (user && currentView === 'landing') {
      setCurrentView('dashboard');
    }
  }, [user, currentView]);

  const addToast = (title: string, message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0617] flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-3 border-pink-500 border-t-transparent rounded-full animate-spin mb-4" />
        <h3 className="font-extrabold text-lg tracking-tight">Sweet Cash Rewards</h3>
        <p className="text-xs text-slate-400 mt-1">Connecting to secure financial ledger...</p>
      </div>
    );
  }

  // Render appropriate view based on state
  const renderView = () => {
    if (!user && currentView === 'landing') {
      return (
        <LandingView
          setCurrentView={setCurrentView}
          onOpenDailyBonus={() => setDailyBonusOpen(true)}
        />
      );
    }

    switch (currentView) {
      case 'dashboard':
        return (
          <DashboardView
            setCurrentView={setCurrentView}
            onOpenDailyBonus={() => setDailyBonusOpen(true)}
            onOpenWithdraw={() => setWithdrawOpen(true)}
            onSuccessToast={(title, msg) => addToast(title, msg, 'success')}
          />
        );
      case 'earn':
        return (
          <EarnView
            onSuccessToast={(title, msg) => addToast(title, msg, 'success')}
            setCurrentView={setCurrentView}
          />
        );
      case 'wallet':
        return (
          <WalletView
            onOpenWithdraw={() => setWithdrawOpen(true)}
            onSuccessToast={(title, msg) => addToast(title, msg, 'success')}
          />
        );
      case 'referrals':
        return (
          <ReferralView
            onSuccessToast={(title, msg) => addToast(title, msg, 'success')}
          />
        );
      case 'postbacks':
        return (
          <PostbackView
            onSuccessToast={(title, msg) => addToast(title, msg, 'success')}
          />
        );
      case 'admin':
        return (
          <AdminView
            onSuccessToast={(title, msg) => addToast(title, msg, 'success')}
          />
        );
      case 'security':
        return <SecurityView />;
      case 'legal':
        return <LegalView />;
      default:
        return (
          <DashboardView
            setCurrentView={setCurrentView}
            onOpenDailyBonus={() => setDailyBonusOpen(true)}
            onOpenWithdraw={() => setWithdrawOpen(true)}
            onSuccessToast={(title, msg) => addToast(title, msg, 'success')}
          />
        );
    }
  };

  const isFullLanding = !user && currentView === 'landing';

  return (
    <div className="min-h-screen bg-[#0d0617] text-white flex flex-col font-sans selection:bg-pink-500 selection:text-white">
      {/* Top Header */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenDailyBonus={() => setDailyBonusOpen(true)}
        onOpenWithdraw={() => setWithdrawOpen(true)}
      />

      {isFullLanding ? (
        // Full width landing view
        <main className="flex-1 pb-16 md:pb-0">{renderView()}</main>
      ) : (
        // App Layout with Sidebar on Desktop
        <div className="flex-1 flex max-w-7xl w-full mx-auto pb-20 md:pb-8">
          <Sidebar
            currentView={currentView}
            setCurrentView={setCurrentView}
            onOpenDailyBonus={() => setDailyBonusOpen(true)}
          />

          <main className="flex-1 p-4 md:p-6 lg:p-8 min-w-0 overflow-x-hidden">
            {renderView()}
          </main>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <BottomNav
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenDailyBonus={() => setDailyBonusOpen(true)}
      />

      {/* Daily Bonus Modal */}
      <DailyBonusModal
        isOpen={dailyBonusOpen}
        onClose={() => setDailyBonusOpen(false)}
        onSuccessToast={(title, msg) => addToast(title, msg, 'success')}
      />

      {/* Withdraw Modal */}
      <WithdrawModal
        isOpen={withdrawOpen}
        onClose={() => setWithdrawOpen(false)}
        onSuccessToast={(title, msg) => addToast(title, msg, 'success')}
      />

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
