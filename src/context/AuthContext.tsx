/**
 * AuthContext.tsx — Authentication & User Profile Context
 *
 * Supports Google OAuth via Supabase with automatic fallback to persistent Guest mode.
 * Auto-syncs and preserves learning progress in LocalStorage and Supabase PostgreSQL.
 */

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { IS_DEMO, getLocalProgress, saveLocalProgress } from '../hooks/useSupabase';

export interface AppUser {
  id: string;
  email?: string;
  name: string;
  avatarUrl?: string;
  isGuest: boolean;
  provider?: string;
}

interface AuthContextType {
  user: AppUser;
  loading: boolean;
  isConfigured: boolean;
  syncStatus: 'synced' | 'saving' | 'offline';
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateSyncStatus: (status: 'synced' | 'saving' | 'offline') => void;
}

const GUEST_ID_KEY = 'jumble_guest_uid';
const GUEST_NAME_KEY = 'jumble_guest_name';

function getOrCreateGuestUser(): AppUser {
  let guestId = localStorage.getItem(GUEST_ID_KEY);
  if (!guestId) {
    guestId = 'guest_' + Math.random().toString(36).substring(2, 11);
    localStorage.setItem(GUEST_ID_KEY, guestId);
  }
  const guestName = localStorage.getItem(GUEST_NAME_KEY) || 'Guest Learner';
  return {
    id: guestId,
    name: guestName,
    isGuest: true,
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser>(getOrCreateGuestUser);
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'saving' | 'offline'>('synced');
  const isConfigured = !IS_DEMO;

  // Auto-migrate local progress to Supabase after successful login
  const migrateGuestProgress = async (authenticatedUserId: string) => {
    if (IS_DEMO || !authenticatedUserId) return;
    try {
      setSyncStatus('saving');
      const local = getLocalProgress();
      const records = Object.values(local);
      if (records.length === 0) {
        setSyncStatus('synced');
        return;
      }

      for (const rec of records) {
        await supabase.from('user_progress').upsert(
          {
            user_id: authenticatedUserId,
            lesson_id: rec.lesson_id,
            stars_earned: rec.stars_earned,
          },
          { onConflict: 'user_id,lesson_id' }
        );
        saveLocalProgress(rec.lesson_id, rec.stars_earned, true);
      }
      setSyncStatus('synced');
    } catch (err) {
      console.warn('Could not migrate progress to cloud:', err);
      setSyncStatus('offline');
    }
  };

  useEffect(() => {
    if (IS_DEMO) {
      setLoading(false);
      return;
    }

    // Check existing Supabase auth session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const u = session.user;
        const meta = u.user_metadata || {};
        const appUser: AppUser = {
          id: u.id,
          email: u.email,
          name: meta.full_name || meta.name || u.email?.split('@')[0] || 'Learner',
          avatarUrl: meta.avatar_url || meta.picture,
          isGuest: false,
          provider: u.app_metadata?.provider || 'google',
        };
        setUser(appUser);
        migrateGuestProgress(u.id);
      } else {
        setUser(getOrCreateGuestUser());
      }
      setLoading(false);
    });

    // Listen to auth state transitions
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const u = session.user;
        const meta = u.user_metadata || {};
        const appUser: AppUser = {
          id: u.id,
          email: u.email,
          name: meta.full_name || meta.name || u.email?.split('@')[0] || 'Learner',
          avatarUrl: meta.avatar_url || meta.picture,
          isGuest: false,
          provider: u.app_metadata?.provider || 'google',
        };
        setUser(appUser);
        migrateGuestProgress(u.id);
      } else {
        setUser(getOrCreateGuestUser());
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    if (IS_DEMO) {
      // Demo simulated Google login for testing without Supabase credentials
      const demoUser: AppUser = {
        id: 'google_demo_' + Math.random().toString(36).substring(2, 8),
        name: 'Demo Google Learner',
        email: 'learner@gmail.com',
        avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=jumble-learner',
        isGuest: false,
        provider: 'google',
      };
      setUser(demoUser);
      setSyncStatus('synced');
      return;
    }

    try {
      setSyncStatus('saving');
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/lessons`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      alert(`Could not complete Google Sign-In: ${err.message || err}`);
      setSyncStatus('offline');
    }
  };

  const signOut = async () => {
    if (!IS_DEMO) {
      await supabase.auth.signOut();
    }
    const guest = getOrCreateGuestUser();
    setUser(guest);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isConfigured,
        syncStatus,
        signInWithGoogle,
        signOut,
        updateSyncStatus: setSyncStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
