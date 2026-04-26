'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth';
import { getFirebaseAuth, getGoogleProvider } from '../lib/firebase';

interface AuthContextValue {
  user: { uid: string; email: string | null; displayName: string | null } | null;
  loading: boolean;
  authError: string | null;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthContextValue['user']>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const authInstance = getFirebaseAuth();
    const unsubscribe = onAuthStateChanged(authInstance, (currentUser) => {
      if (currentUser) {
        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  async function signUp(email: string, password: string, name: string) {
    setAuthError(null);
    try {
      const authInstance = getFirebaseAuth();
      const result = await createUserWithEmailAndPassword(authInstance, email, password);
      if (result.user) {
        await updateProfile(result.user, { displayName: name });
        setUser({ uid: result.user.uid, email: result.user.email, displayName: name });
      }
    } catch (error) {
      setAuthError((error as Error).message);
      throw error;
    }
  }

  async function signIn(email: string, password: string) {
    setAuthError(null);
    try {
      const authInstance = getFirebaseAuth();
      await signInWithEmailAndPassword(authInstance, email, password);
    } catch (error) {
      setAuthError((error as Error).message);
      throw error;
    }
  }

  async function signInWithGoogle() {
    setAuthError(null);
    try {
      const authInstance = getFirebaseAuth();
      const provider = getGoogleProvider();
      await signInWithPopup(authInstance, provider);
    } catch (error) {
      setAuthError((error as Error).message);
      throw error;
    }
  }

  async function signOut() {
    await firebaseSignOut(getFirebaseAuth());
  }

  const value = useMemo(
    () => ({ user, loading, authError, signUp, signIn, signOut, signInWithGoogle }),
    [user, loading, authError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
