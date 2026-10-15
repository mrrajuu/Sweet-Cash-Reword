import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../lib/firebase';
import { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  loginWithGoogle: () => Promise<void>;
  loginDemoUser: (asAdmin?: boolean) => void;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateLocalBalance: (newBalance: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const BOOTSTRAP_ADMIN_EMAIL = 'mdfarukhossain8573@gmail.com';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [demoUserActive, setDemoUserActive] = useState<boolean>(false);

  // Sync profile from Cloud Firestore or create upon first sign-in
  const syncOrCreateUserProfile = async (currentUser: User) => {
    const userDocRef = doc(db, 'users', currentUser.uid);

    try {
      const snap = await getDoc(userDocRef);
      if (snap.exists()) {
        const data = snap.data() as UserProfile;
        // Verify admin boost
        if (currentUser.email === BOOTSTRAP_ADMIN_EMAIL && data.role !== 'admin') {
          data.role = 'admin';
        }
        setProfile(data);
      } else {
        // Initial user registration document
        const initialProfile: UserProfile = {
          uid: currentUser.uid,
          email: currentUser.email || '',
          displayName: currentUser.displayName || 'Sweet Earner',
          photoURL: currentUser.photoURL || '',
          balance: 0,
          pendingBalance: 0,
          totalEarned: 0,
          referralCode: currentUser.uid.substring(0, 8).toUpperCase(),
          referralCount: 0,
          dailyStreak: 0,
          lastDailyBonusClaim: undefined,
          role: currentUser.email === BOOTSTRAP_ADMIN_EMAIL ? 'admin' : 'user',
          status: 'active',
          createdAt: new Date().toISOString(),
        };

        await setDoc(userDocRef, initialProfile);
        setProfile(initialProfile);
      }
    } catch (err) {
      console.warn('Initial Firestore user fetch error:', err);
      // Fallback local profile if offline or rules waiting
      setProfile({
        uid: currentUser.uid,
        email: currentUser.email || '',
        displayName: currentUser.displayName || 'Sweet Earner',
        balance: 1.5,
        pendingBalance: 0,
        totalEarned: 1.5,
        referralCode: currentUser.uid.substring(0, 8).toUpperCase(),
        referralCount: 0,
        dailyStreak: 1,
        role: currentUser.email === BOOTSTRAP_ADMIN_EMAIL ? 'admin' : 'user',
        status: 'active',
        createdAt: new Date().toISOString(),
      });
    }
  };

  useEffect(() => {
    let unsubscribeFirestore: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setDemoUserActive(false);

        // Fetch or create profile
        await syncOrCreateUserProfile(currentUser);

        // Set up real-time listener on user profile
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          unsubscribeFirestore = onSnapshot(
            userDocRef,
            (docSnap) => {
              if (docSnap.exists()) {
                const updatedData = docSnap.data() as UserProfile;
                if (currentUser.email === BOOTSTRAP_ADMIN_EMAIL) {
                  updatedData.role = 'admin';
                }
                setProfile(updatedData);
              }
            },
            (error) => {
              handleFirestoreError(error, OperationType.GET, `users/${currentUser.uid}`);
            }
          );
        } catch (error) {
          console.warn('Firestore snapshot setup warning:', error);
        }
      } else if (!demoUserActive) {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeFirestore) {
        unsubscribeFirestore();
      }
    };
  }, [demoUserActive]);

  const handleLoginWithGoogle = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Google Sign In Failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Demo user helper to test the complete platform without mandatory Google popup
  const loginDemoUser = (asAdmin: boolean = false) => {
    const demoUid = asAdmin ? 'admin-super-uid-777' : 'user-demo-uid-101';
    const demoEmail = asAdmin ? BOOTSTRAP_ADMIN_EMAIL : 'demo.earner@sweetcash.com';
    const demoName = asAdmin ? 'Master Admin' : 'Alex Rivera';

    const mockFirebaseUser = {
      uid: demoUid,
      email: demoEmail,
      displayName: demoName,
      photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=${demoUid}`,
      emailVerified: true,
      isAnonymous: false,
    } as unknown as User;

    const mockProfile: UserProfile = {
      uid: demoUid,
      email: demoEmail,
      displayName: demoName,
      photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=${demoUid}`,
      balance: asAdmin ? 45.20 : 6.50,
      pendingBalance: 2.50,
      totalEarned: asAdmin ? 180.50 : 24.00,
      referralCode: 'SWEET77',
      referralCount: 4,
      dailyStreak: 3,
      role: asAdmin ? 'admin' : 'user',
      status: 'active',
      createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    };

    setDemoUserActive(true);
    setUser(mockFirebaseUser);
    setProfile(mockProfile);
    setLoading(false);
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('Sign out warning:', err);
    }
    setUser(null);
    setProfile(null);
    setDemoUserActive(false);
    setLoading(false);
  };

  const refreshProfile = async () => {
    if (user) {
      await syncOrCreateUserProfile(user);
    }
  };

  const updateLocalBalance = (newBalance: number) => {
    if (profile) {
      setProfile({
        ...profile,
        balance: Number(newBalance.toFixed(2)),
      });
    }
  };

  const isAdmin = Boolean(
    profile?.role === 'admin' ||
    user?.email === BOOTSTRAP_ADMIN_EMAIL ||
    profile?.email === BOOTSTRAP_ADMIN_EMAIL
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isAdmin,
        loginWithGoogle: handleLoginWithGoogle,
        loginDemoUser,
        logout: handleLogout,
        refreshProfile,
        updateLocalBalance,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
