export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  balance: number;
  pendingBalance: number;
  totalEarned: number;
  referralCode: string;
  referredBy?: string;
  referralCount: number;
  dailyStreak: number;
  lastDailyBonusClaim?: string;
  role: 'user' | 'admin';
  status: 'active' | 'suspended';
  createdAt: string;
  updatedAt?: string;
}

export type TransactionType =
  | 'daily_bonus'
  | 'offer'
  | 'survey'
  | 'task'
  | 'referral'
  | 'withdrawal'
  | 'adjustment';

export type TransactionStatus = 'pending' | 'completed' | 'rejected' | 'reversed';

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  title: string;
  description: string;
  offerId?: string;
  provider?: string;
  network?: string;
  walletAddress?: string;
  txHash?: string;
  createdAt: string;
  updatedAt?: string;
}

export type WithdrawalStatus = 'pending' | 'approved' | 'rejected' | 'processing';
export type CryptoNetwork = 'TRC20' | 'BEP20' | 'ERC20';

export interface Withdrawal {
  id: string;
  userId: string;
  userEmail: string;
  amount: number;
  fee: number;
  netAmount: number;
  cryptoCurrency: 'USDT';
  network: CryptoNetwork;
  walletAddress: string;
  status: WithdrawalStatus;
  adminNotes?: string;
  txHash?: string;
  createdAt: string;
  updatedAt?: string;
}

export type OfferCategory = 'survey' | 'app' | 'signup' | 'quiz' | 'task';
export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

export interface Offer {
  id: string;
  title: string;
  description: string;
  category: OfferCategory;
  rewardAmount: number;
  provider: string;
  requirements: string;
  difficulty: DifficultyLevel;
  timeEstimate: string;
  badge?: string;
  isFeatured?: boolean;
  status: 'active' | 'paused';
  externalUrl?: string;
  createdAt: string;
}

export interface PostbackLog {
  id: string;
  provider: string;
  transactionId: string;
  userId: string;
  payout: number;
  status: 'success' | 'duplicate' | 'invalid_signature' | 'reversed' | 'user_not_found';
  ip: string;
  payload: string;
  createdAt: string;
}

export interface PlatformSettings {
  minWithdrawalUsdt: number;
  withdrawalFeePercent: number;
  dailyBonusBase: number;
  dailyBonusStreakStep: number;
  referralBonusPercent: number;
  maintenanceMode: boolean;
  postbackSecretKey: string;
  updatedAt: string;
}
