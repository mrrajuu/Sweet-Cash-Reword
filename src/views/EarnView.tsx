import React, { useState, useEffect } from 'react';
import {
  Coins,
  Search,
  SlidersHorizontal,
  Flame,
  ShieldCheck,
  CheckCircle2,
  Info,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { OfferCard } from '../components/OfferCard';
import { Offer, OfferCategory } from '../types';

interface EarnViewProps {
  onSuccessToast: (title: string, message: string) => void;
  setCurrentView: (view: string) => void;
}

export const EarnView: React.FC<EarnViewProps> = ({ onSuccessToast, setCurrentView }) => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await fetch('/api/offers');
        const data = await res.json();
        if (data.offers) {
          setOffers(data.offers);
        }
      } catch (err) {
        console.warn('Failed to load offers from server:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  const categories = [
    { id: 'all', label: 'All Tasks', icon: '⚡' },
    { id: 'survey', label: 'Surveys', icon: '📋' },
    { id: 'app', label: 'Mobile Apps', icon: '📱' },
    { id: 'signup', label: 'Signups & Trials', icon: '✨' },
    { id: 'quiz', label: 'Quizzes', icon: '🧠' },
  ];

  const filteredOffers = offers.filter((offer) => {
    const matchesCategory = selectedCategory === 'all' || offer.category === selectedCategory;
    const matchesSearch =
      offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.provider.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-pink-950/40 via-[#26103e] to-[#160829] border border-pink-500/30 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> High-Reward Tasks
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            Available Offers &amp; Surveys
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Complete tasks, verify requirements, and receive server-validated USDT rewards. All rewards are guaranteed non-custodial payouts.
          </p>
        </div>

        {/* Demo environment disclosure per requirements */}
        <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-800/60 text-xs text-slate-300 shrink-0 max-w-sm">
          <div className="flex items-center gap-1.5 text-pink-300 font-bold mb-0.5">
            <Info className="w-4 h-4 text-pink-400" />
            <span>Developer Sandbox &amp; Demo Mode</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Offers below are configured with full server-side reward simulation. Real postback endpoints are also ready for external networks.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md shadow-pink-500/20'
                  : 'bg-[#180a2c] text-slate-300 hover:text-white border border-purple-900/60'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search offers or providers..."
            className="w-full bg-[#180a2c] border border-purple-900/60 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 transition-colors"
          />
        </div>
      </div>

      {/* Offers Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 rounded-2xl bg-purple-950/20 border border-purple-900/30 animate-pulse" />
          ))}
        </div>
      ) : filteredOffers.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#160a2b] border border-purple-900/40">
          <Coins className="w-10 h-10 text-purple-600 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-white mb-1">No Offers Found</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try choosing a different category or clearing your search term.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredOffers.map((offer) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              onSuccessToast={onSuccessToast}
            />
          ))}
        </div>
      )}

      {/* Partner Offerwalls Integrations Preview Banner */}
      <div className="p-6 rounded-2xl bg-[#130722] border border-purple-900/60 mt-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Connect External Offerwalls (AdGem, OfferToro, Lootably, CPAGrip)</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-extrabold px-2 py-0.5 rounded-full border border-emerald-500/30">
                READY
              </span>
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Sweet Cash Rewards has complete built-in support for partner postback webhooks with HMAC signatures, duplicate transaction deduplication, and reversals.
            </p>
          </div>

          <button
            onClick={() => setCurrentView('postbacks')}
            className="px-4 py-2.5 rounded-xl bg-purple-900/40 hover:bg-purple-900/70 border border-purple-700/60 text-white font-bold text-xs flex items-center gap-2 transition-colors shrink-0 cursor-pointer"
          >
            <span>View Postback Docs &amp; Simulator</span>
            <ExternalLink className="w-3.5 h-3.5 text-pink-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
