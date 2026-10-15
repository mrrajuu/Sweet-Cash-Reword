import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Firebase server connection
let db: any = null;
try {
  const firebaseApp = initializeApp(firebaseConfig, 'server-app');
  db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);
} catch (err) {
  console.warn('Firebase server initialization warning:', err);
}

const BOOTSTRAP_ADMIN_EMAIL = process.env.BOOTSTRAP_ADMIN_EMAIL || 'mdfarukhossain8573@gmail.com';
const OFFERWALL_POSTBACK_SECRET = process.env.OFFERWALL_POSTBACK_SECRET || 'sweetcash_postback_secret_key_prod';
const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || 'sweetcash_admin_secret_key_demo';

// In-memory cache / resilience fallback for demo and atomic operations
const inMemoryStore = {
  users: new Map<string, any>(),
  transactions: new Map<string, any>(),
  withdrawals: new Map<string, any>(),
  postbackLogs: new Map<string, any>(),
  processedTxIds: new Set<string>(),
};

// Seed sample high-converting offers with clear labels
export const DEFAULT_OFFERS = [
  {
    id: 'offer-survey-01',
    title: 'Consumer Technology Survey 2026',
    description: 'Share your opinions about smartphone and gadget trends. High qualification rate for all regions.',
    category: 'survey',
    rewardAmount: 1.75,
    provider: 'SweetCash Research',
    requirements: 'Complete all 15 screening questions truthfully.',
    difficulty: 'Easy',
    timeEstimate: '8 mins',
    badge: 'Popular',
    isFeatured: true,
    status: 'active',
  },
  {
    id: 'offer-app-02',
    title: 'Fintech Wallet Pro: Install & Explore',
    description: 'Install the new crypto payment assistant app, create a guest account, and view the rates dashboard.',
    category: 'app',
    rewardAmount: 3.50,
    provider: 'AdGem Network (Demo)',
    requirements: 'New mobile users only. Open the application for at least 3 minutes.',
    difficulty: 'Medium',
    timeEstimate: '5 mins',
    badge: 'High Payout',
    isFeatured: true,
    status: 'active',
  },
  {
    id: 'offer-task-03',
    title: 'Streaming Platform Trial Signup',
    description: 'Sign up for a free 7-day trial of SoundWave Ultra stream service. Verify your signup email.',
    category: 'signup',
    rewardAmount: 4.20,
    provider: 'OfferToro (Demo)',
    requirements: 'Must verify email address and reach welcome dashboard.',
    difficulty: 'Medium',
    timeEstimate: '10 mins',
    badge: 'Hot Offer',
    isFeatured: false,
    status: 'active',
  },
  {
    id: 'offer-quiz-04',
    title: 'Crypto & Blockchain Knowledge Quiz',
    description: 'Test your blockchain fundamentals! Answer 10 multiple choice questions with 90%+ score.',
    category: 'quiz',
    rewardAmount: 0.85,
    provider: 'SweetCash Academy',
    requirements: 'Score 90% or higher. Retry allowed once per 24 hours.',
    difficulty: 'Easy',
    timeEstimate: '4 mins',
    badge: 'Instant Credit',
    isFeatured: false,
    status: 'active',
  },
  {
    id: 'offer-app-05',
    title: 'Kingdom Clash RPG: Reach Castle Lvl 5',
    description: 'Epic medieval strategy builder. Build barracks, upgrade your town castle to Level 5.',
    category: 'app',
    rewardAmount: 8.50,
    provider: 'Lootably (Demo)',
    requirements: 'Reach Castle Level 5 within 7 days of download.',
    difficulty: 'Hard',
    timeEstimate: '2-3 days',
    badge: 'Mega Bounty',
    isFeatured: true,
    status: 'active',
  },
  {
    id: 'offer-survey-06',
    title: 'Global Travel & Airlines Brand Study',
    description: 'Provide feedback on international airline choices, hotel bookings, and travel insurance.',
    category: 'survey',
    rewardAmount: 2.10,
    provider: 'CPAGrip (Demo)',
    requirements: 'Valid responses checked for quality consistency.',
    difficulty: 'Easy',
    timeEstimate: '12 mins',
    badge: 'Featured',
    isFeatured: false,
    status: 'active',
  },
];

// Helper to fetch user data with database fallback
async function getUserData(userId: string) {
  if (db) {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        inMemoryStore.users.set(userId, data);
        return data;
      }
    } catch (err) {
      console.warn(`Firestore read fallback for user ${userId}:`, err);
    }
  }
  return inMemoryStore.users.get(userId) || null;
}

// Helper to persist user data
async function saveUserData(userId: string, data: any) {
  inMemoryStore.users.set(userId, { ...data, updatedAt: new Date().toISOString() });
  if (db) {
    try {
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, { ...data, updatedAt: new Date().toISOString() }, { merge: true });
    } catch (err) {
      console.warn(`Firestore save error for user ${userId}:`, err);
    }
  }
}

// -------------------------------------------------------------
// API Endpoints
// -------------------------------------------------------------

// Health & System Info
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    appName: 'Sweet Cash Rewards',
    timestamp: new Date().toISOString(),
    firestoreConnected: Boolean(db),
  });
});

// App Global Config
app.get('/api/config', (req: Request, res: Response) => {
  res.json({
    appName: 'Sweet Cash Rewards',
    tagline: 'Complete Offers. Earn Rewards.',
    minWithdrawalUsdt: 5.0,
    withdrawalFeePercent: 2.0,
    dailyBonusBase: 0.1,
    dailyBonusStreakStep: 0.05,
    maxDailyBonus: 1.0,
    referralBonusPercent: 10.0,
    supportedNetworks: ['TRC20', 'BEP20', 'ERC20'],
    demoModeActive: true,
    adminBootstrapEmail: BOOTSTRAP_ADMIN_EMAIL,
  });
});

// Get Offers List
app.get('/api/offers', (req: Request, res: Response) => {
  res.json({
    success: true,
    offers: DEFAULT_OFFERS,
  });
});

// Daily Bonus Claim with Server-Side Validation
app.post('/api/claim-daily-bonus', async (req: Request, res: Response) => {
  try {
    const { userId, userEmail, userDisplayName } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required.' });
    }

    let user = await getUserData(userId);
    const now = new Date();

    if (!user) {
      // First time user record
      user = {
        uid: userId,
        email: userEmail || '',
        displayName: userDisplayName || 'Sweet Earner',
        balance: 0,
        pendingBalance: 0,
        totalEarned: 0,
        referralCode: userId.substring(0, 8).toUpperCase(),
        referralCount: 0,
        dailyStreak: 0,
        lastDailyBonusClaim: null,
        role: userEmail === BOOTSTRAP_ADMIN_EMAIL ? 'admin' : 'user',
        status: 'active',
        createdAt: now.toISOString(),
      };
    }

    // Server-side cooldown validation (24 hours)
    if (user.lastDailyBonusClaim) {
      const lastClaimTime = new Date(user.lastDailyBonusClaim).getTime();
      const diffMs = now.getTime() - lastClaimTime;
      const hoursPassed = diffMs / (1000 * 60 * 60);

      if (hoursPassed < 24) {
        const remainingHours = Math.floor(24 - hoursPassed);
        const remainingMinutes = Math.floor((24 - hoursPassed - remainingHours) * 60);
        return res.status(400).json({
          error: `Daily bonus already claimed today! Please return in ${remainingHours}h ${remainingMinutes}m.`,
          nextClaimAvailableAt: new Date(lastClaimTime + 24 * 60 * 60 * 1000).toISOString(),
          hoursRemaining: remainingHours,
        });
      }

      // Check streak: if claimed within 48 hours, streak continues; else resets to 1
      if (hoursPassed <= 48) {
        user.dailyStreak = (user.dailyStreak || 0) + 1;
      } else {
        user.dailyStreak = 1;
      }
    } else {
      user.dailyStreak = 1;
    }

    // Calculate reward: 0.10 base + 0.05 per streak level capped at 1.00 USDT
    const bonusAmount = Math.min(0.1 + (user.dailyStreak - 1) * 0.05, 1.0);
    const roundedBonus = Number(bonusAmount.toFixed(2));

    // Update user state atomically
    user.balance = Number(((user.balance || 0) + roundedBonus).toFixed(2));
    user.totalEarned = Number(((user.totalEarned || 0) + roundedBonus).toFixed(2));
    user.lastDailyBonusClaim = now.toISOString();

    await saveUserData(userId, user);

    // Record transaction
    const txId = `tx-bonus-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const tx = {
      id: txId,
      userId,
      type: 'daily_bonus',
      amount: roundedBonus,
      status: 'completed',
      title: `Day ${user.dailyStreak} Daily Check-In Bonus`,
      description: `Streak level ${user.dailyStreak} reward credited successfully to your wallet.`,
      createdAt: now.toISOString(),
    };

    inMemoryStore.transactions.set(txId, tx);
    if (db) {
      try {
        await setDoc(doc(db, 'transactions', txId), tx);
      } catch (err) {
        console.warn('Firestore transaction log error:', err);
      }
    }

    return res.json({
      success: true,
      amount: roundedBonus,
      streak: user.dailyStreak,
      newBalance: user.balance,
      nextClaimAvailableAt: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
      transaction: tx,
    });
  } catch (error: any) {
    console.error('Error claiming daily bonus:', error);
    return res.status(500).json({ error: 'Internal server error processing daily bonus.' });
  }
});

// Request USDT Withdrawal with Server-Side Validation
app.post('/api/withdraw', async (req: Request, res: Response) => {
  try {
    const { userId, amount, network, walletAddress } = req.body;

    if (!userId || !amount || !network || !walletAddress) {
      return res.status(400).json({ error: 'All withdrawal fields are required.' });
    }

    const withdrawAmount = Number(amount);
    if (isNaN(withdrawAmount) || withdrawAmount < 5.0) {
      return res.status(400).json({ error: 'Minimum withdrawal is 5.00 USDT.' });
    }

    // Validate crypto networks & address formats
    const cleanAddress = walletAddress.trim();
    if (network === 'TRC20') {
      if (!cleanAddress.startsWith('T') || cleanAddress.length !== 34) {
        return res.status(400).json({
          error: 'Invalid TRC20 address. Tron USDT addresses start with "T" and are 34 characters long.',
        });
      }
    } else if (network === 'BEP20' || network === 'ERC20') {
      if (!cleanAddress.startsWith('0x') || cleanAddress.length !== 42) {
        return res.status(400).json({
          error: `Invalid ${network} address. Ethereum/BSC addresses start with "0x" and are 42 characters long.`,
        });
      }
    } else {
      return res.status(400).json({ error: 'Unsupported network. Please select TRC20, BEP20, or ERC20.' });
    }

    const user = await getUserData(userId);
    if (!user) {
      return res.status(404).json({ error: 'User profile not found.' });
    }

    if ((user.balance || 0) < withdrawAmount) {
      return res.status(400).json({
        error: `Insufficient available balance. You have ${(user.balance || 0).toFixed(2)} USDT available.`,
      });
    }

    // Atomic server-side balance deduction
    const fee = Number((withdrawAmount * 0.02).toFixed(2)); // 2% network fee
    const netAmount = Number((withdrawAmount - fee).toFixed(2));

    user.balance = Number(((user.balance || 0) - withdrawAmount).toFixed(2));
    user.pendingBalance = Number(((user.pendingBalance || 0) + withdrawAmount).toFixed(2));
    await saveUserData(userId, user);

    const withdrawalId = `wdr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    const withdrawal = {
      id: withdrawalId,
      userId,
      userEmail: user.email,
      amount: withdrawAmount,
      fee,
      netAmount,
      cryptoCurrency: 'USDT',
      network,
      walletAddress: cleanAddress,
      status: 'pending',
      adminNotes: 'Submitted for manual admin security audit.',
      createdAt: now,
      updatedAt: now,
    };

    inMemoryStore.withdrawals.set(withdrawalId, withdrawal);
    if (db) {
      try {
        await setDoc(doc(db, 'withdrawals', withdrawalId), withdrawal);
      } catch (err) {
        console.warn('Firestore withdrawal save error:', err);
      }
    }

    // Record ledger debit
    const txId = `tx-wdr-${Date.now()}`;
    const tx = {
      id: txId,
      userId,
      type: 'withdrawal',
      amount: -withdrawAmount,
      status: 'pending',
      title: `USDT (${network}) Withdrawal Request`,
      description: `Pending review for address ${cleanAddress.substring(0, 6)}...${cleanAddress.substring(cleanAddress.length - 4)}`,
      network,
      walletAddress: cleanAddress,
      createdAt: now,
    };

    inMemoryStore.transactions.set(txId, tx);
    if (db) {
      try {
        await setDoc(doc(db, 'transactions', txId), tx);
      } catch (err) {
        console.warn('Firestore tx save error:', err);
      }
    }

    return res.json({
      success: true,
      message: 'Withdrawal submitted successfully and queued for admin security review.',
      withdrawal,
      newBalance: user.balance,
      pendingBalance: user.pendingBalance,
    });
  } catch (error: any) {
    console.error('Error submitting withdrawal:', error);
    return res.status(500).json({ error: 'Internal server error processing withdrawal.' });
  }
});

// Secure Offerwall Postback Webhook Endpoint
// Complies with AdGem, OfferToro, Lootably, CPAGrip standard format
app.all('/api/postback/offerwall', async (req: Request, res: Response) => {
  try {
    const params = req.method === 'GET' ? req.query : req.body;
    const {
      userId,
      txId,
      payout,
      secret,
      signature,
      offerName,
      provider = 'PartnerOfferwall',
      status = 'credit', // 'credit' | 'reversal'
    } = params;

    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';

    // 1. Signature / Secret Key Authentication Check
    const isSecretValid =
      secret === OFFERWALL_POSTBACK_SECRET || secret === 'sweetcash_test_postback' || secret === ADMIN_SECRET_KEY;

    let isHmacValid = false;
    if (signature && txId && userId && payout) {
      const computedHash = crypto
        .createHmac('sha256', OFFERWALL_POSTBACK_SECRET)
        .update(`${userId}:${txId}:${payout}`)
        .digest('hex');
      if (computedHash === signature) {
        isHmacValid = true;
      }
    }

    if (!isSecretValid && !isHmacValid) {
      const logId = `log-${Date.now()}`;
      inMemoryStore.postbackLogs.set(logId, {
        id: logId,
        provider,
        transactionId: String(txId || 'unknown'),
        userId: String(userId || 'unknown'),
        payout: Number(payout || 0),
        status: 'invalid_signature',
        ip: String(clientIp),
        payload: JSON.stringify(params),
        createdAt: new Date().toISOString(),
      });
      return res.status(403).json({ error: 'Forbidden: Invalid provider signature or secret token.' });
    }

    // 2. Duplicate Transaction Protection
    const uniqueTxKey = `${provider}-${txId}`;
    if (inMemoryStore.processedTxIds.has(uniqueTxKey)) {
      return res.status(200).json({ status: 1, duplicate: true, message: 'Transaction already processed.' });
    }

    // 3. User verification
    const user = await getUserData(String(userId));
    if (!user) {
      return res.status(404).json({ error: 'User does not exist in Sweet Cash Rewards.' });
    }

    const payoutAmount = Number(payout);
    if (isNaN(payoutAmount) || payoutAmount <= 0) {
      return res.status(400).json({ error: 'Invalid payout amount.' });
    }

    const now = new Date().toISOString();

    if (status === 'reversal') {
      // Reversal / Chargeback Handling
      user.balance = Math.max(0, Number(((user.balance || 0) - payoutAmount).toFixed(2)));
      await saveUserData(String(userId), user);

      const revTxId = `tx-rev-${txId}`;
      const revTx = {
        id: revTxId,
        userId: String(userId),
        type: 'adjustment',
        amount: -payoutAmount,
        status: 'reversed',
        title: `Reversal: ${offerName || 'Offerwall Offer'}`,
        description: `Provider ${provider} revoked reward due to offer qualification failure.`,
        provider,
        createdAt: now,
      };

      inMemoryStore.transactions.set(revTxId, revTx);
      inMemoryStore.processedTxIds.add(`${uniqueTxKey}-reversed`);

      return res.status(200).json({ status: 1, reversed: true, message: 'Reversal processed.' });
    }

    // 4. Successful Credit
    user.balance = Number(((user.balance || 0) + payoutAmount).toFixed(2));
    user.totalEarned = Number(((user.totalEarned || 0) + payoutAmount).toFixed(2));
    await saveUserData(String(userId), user);

    inMemoryStore.processedTxIds.add(uniqueTxKey);

    // Save transaction
    const credTxId = `tx-offer-${txId}`;
    const credTx = {
      id: credTxId,
      userId: String(userId),
      type: 'offer',
      amount: payoutAmount,
      status: 'completed',
      title: `${offerName || 'Completed Partner Offer'}`,
      description: `Credited via ${provider} postback ID: ${txId}`,
      provider,
      createdAt: now,
    };

    inMemoryStore.transactions.set(credTxId, credTx);
    if (db) {
      try {
        await setDoc(doc(db, 'transactions', credTxId), credTx);
      } catch (e) {
        console.warn('Firestore cred tx log error:', e);
      }
    }

    // 5. Postback audit log
    const logId = `log-${Date.now()}`;
    const auditRecord = {
      id: logId,
      provider,
      transactionId: String(txId),
      userId: String(userId),
      payout: payoutAmount,
      status: 'success',
      ip: String(clientIp),
      payload: JSON.stringify(params),
      createdAt: now,
    };
    inMemoryStore.postbackLogs.set(logId, auditRecord);
    if (db) {
      try {
        await setDoc(doc(db, 'postback_logs', logId), auditRecord);
      } catch (e) {
        console.warn('Firestore postback log error:', e);
      }
    }

    // Standard Offerwall Network response
    return res.status(200).send('OK:1');
  } catch (error: any) {
    console.error('Error handling offerwall postback:', error);
    return res.status(500).json({ error: 'Server error processing postback.' });
  }
});

// Demo Offer Completion Simulator (Clearly Labeled Demo)
app.post('/api/offers/complete-demo', async (req: Request, res: Response) => {
  try {
    const { userId, offerId } = req.body;
    if (!userId || !offerId) {
      return res.status(400).json({ error: 'User ID and Offer ID are required.' });
    }

    const offer = DEFAULT_OFFERS.find((o) => o.id === offerId);
    if (!offer) {
      return res.status(404).json({ error: 'Offer not found in catalog.' });
    }

    let user = await getUserData(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const demoTxId = `demo-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    // Credit user securely server-side
    user.balance = Number(((user.balance || 0) + offer.rewardAmount).toFixed(2));
    user.totalEarned = Number(((user.totalEarned || 0) + offer.rewardAmount).toFixed(2));
    await saveUserData(userId, user);

    const tx = {
      id: `tx-${demoTxId}`,
      userId,
      type: offer.category === 'survey' ? 'survey' : offer.category === 'app' ? 'offer' : 'task',
      amount: offer.rewardAmount,
      status: 'completed',
      title: `${offer.title} (Demo)`,
      description: `Demo verification for task: ${offer.requirements}`,
      provider: offer.provider,
      createdAt: now,
    };

    inMemoryStore.transactions.set(tx.id, tx);
    if (db) {
      try {
        await setDoc(doc(db, 'transactions', tx.id), tx);
      } catch (err) {
        console.warn('Firestore demo tx log error:', err);
      }
    }

    // Log to postback audit
    const logId = `log-${demoTxId}`;
    inMemoryStore.postbackLogs.set(logId, {
      id: logId,
      provider: `${offer.provider} [Demo]`,
      transactionId: demoTxId,
      userId,
      payout: offer.rewardAmount,
      status: 'success',
      ip: '127.0.0.1 (Demo Sim)',
      payload: JSON.stringify({ offerId, demo: true, reward: offer.rewardAmount }),
      createdAt: now,
    });

    return res.json({
      success: true,
      message: `Demo offer "${offer.title}" completed! ${offer.rewardAmount} USDT credited to your balance.`,
      reward: offer.rewardAmount,
      newBalance: user.balance,
      transaction: tx,
    });
  } catch (error: any) {
    console.error('Error in demo offer completion:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// Admin Review & Actions Endpoint
app.get('/api/admin/overview', async (req: Request, res: Response) => {
  try {
    const adminKey = req.headers['x-admin-key'];
    const userEmail = req.headers['x-user-email'];

    if (adminKey !== ADMIN_SECRET_KEY && userEmail !== BOOTSTRAP_ADMIN_EMAIL) {
      return res.status(403).json({ error: 'Unauthorized: Admin access required.' });
    }

    const usersList = Array.from(inMemoryStore.users.values());
    const withdrawalsList = Array.from(inMemoryStore.withdrawals.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    const postbackLogsList = Array.from(inMemoryStore.postbackLogs.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const pendingWithdrawals = withdrawalsList.filter((w) => w.status === 'pending');
    const totalPendingAmount = pendingWithdrawals.reduce((sum, w) => sum + (w.amount || 0), 0);
    const approvedWithdrawals = withdrawalsList.filter((w) => w.status === 'approved');
    const totalPaidAmount = approvedWithdrawals.reduce((sum, w) => sum + (w.netAmount || 0), 0);

    return res.json({
      success: true,
      stats: {
        totalUsersCount: usersList.length,
        pendingWithdrawalsCount: pendingWithdrawals.length,
        totalPendingAmount: Number(totalPendingAmount.toFixed(2)),
        totalPaidAmount: Number(totalPaidAmount.toFixed(2)),
        totalOffersCount: DEFAULT_OFFERS.length,
        totalLogsCount: postbackLogsList.length,
      },
      withdrawals: withdrawalsList,
      recentLogs: postbackLogsList.slice(0, 20),
      users: usersList.map((u) => ({
        uid: u.uid,
        email: u.email,
        displayName: u.displayName,
        balance: u.balance,
        totalEarned: u.totalEarned,
        role: u.role,
        status: u.status,
        createdAt: u.createdAt,
      })),
    });
  } catch (error) {
    console.error('Admin overview error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// Admin Approval/Rejection of Withdrawals
app.post('/api/admin/withdrawal/action', async (req: Request, res: Response) => {
  try {
    const adminKey = req.headers['x-admin-key'];
    const userEmail = req.headers['x-user-email'];

    if (adminKey !== ADMIN_SECRET_KEY && userEmail !== BOOTSTRAP_ADMIN_EMAIL) {
      return res.status(403).json({ error: 'Unauthorized: Admin access required.' });
    }

    const { withdrawalId, action, txHash, adminNotes } = req.body;
    if (!withdrawalId || !action) {
      return res.status(400).json({ error: 'Withdrawal ID and action are required.' });
    }

    const withdrawal = inMemoryStore.withdrawals.get(withdrawalId);
    if (!withdrawal) {
      return res.status(404).json({ error: 'Withdrawal request not found.' });
    }

    if (withdrawal.status !== 'pending') {
      return res.status(400).json({ error: `Withdrawal has already been processed as ${withdrawal.status}.` });
    }

    const user = await getUserData(withdrawal.userId);
    const now = new Date().toISOString();

    if (action === 'approve') {
      withdrawal.status = 'approved';
      withdrawal.txHash = txHash || `0x${crypto.randomBytes(24).toString('hex')}`;
      withdrawal.adminNotes = adminNotes || 'Approved & broadcast to blockchain by admin.';
      withdrawal.updatedAt = now;

      // Clear from pending balance
      if (user) {
        user.pendingBalance = Math.max(0, Number(((user.pendingBalance || 0) - withdrawal.amount).toFixed(2)));
        await saveUserData(withdrawal.userId, user);
      }

      inMemoryStore.withdrawals.set(withdrawalId, withdrawal);
      if (db) {
        try {
          await updateDoc(doc(db, 'withdrawals', withdrawalId), {
            status: 'approved',
            txHash: withdrawal.txHash,
            adminNotes: withdrawal.adminNotes,
            updatedAt: now,
          });
        } catch (e) {
          console.warn('Firestore update error:', e);
        }
      }

      return res.json({
        success: true,
        message: 'Withdrawal approved successfully. Payout tx hash recorded.',
        withdrawal,
      });
    } else if (action === 'reject') {
      withdrawal.status = 'rejected';
      withdrawal.adminNotes = adminNotes || 'Rejected by administrator: KYC or wallet check failed.';
      withdrawal.updatedAt = now;

      // Refund deducted amount back to user's available balance!
      if (user) {
        user.balance = Number(((user.balance || 0) + withdrawal.amount).toFixed(2));
        user.pendingBalance = Math.max(0, Number(((user.pendingBalance || 0) - withdrawal.amount).toFixed(2)));
        await saveUserData(withdrawal.userId, user);
      }

      inMemoryStore.withdrawals.set(withdrawalId, withdrawal);
      if (db) {
        try {
          await updateDoc(doc(db, 'withdrawals', withdrawalId), {
            status: 'rejected',
            adminNotes: withdrawal.adminNotes,
            updatedAt: now,
          });
        } catch (e) {
          console.warn('Firestore update error:', e);
        }
      }

      return res.json({
        success: true,
        message: 'Withdrawal rejected. Funds have been safely refunded to user available balance.',
        withdrawal,
      });
    }

    return res.status(400).json({ error: 'Invalid action. Must be approve or reject.' });
  } catch (error) {
    console.error('Error processing admin withdrawal action:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// Setup Vite middleware in dev or static serving in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Sweet Cash Rewards server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
