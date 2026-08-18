/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthState, UserProfile, UserRole } from '../types/index.js';
import { api } from '../services/api.js';

interface AuthContextType {
  user: UserProfile | null;
  authState: AuthState;
  isLoading: boolean;
  authError: string | null;
  isOnboardingOpen: boolean;
  openOnboarding: () => void;
  closeOnboarding: () => void;
  isAuthModalOpen: boolean;
  authModalTab: 'login' | 'signup';
  openAuthModal: (tab?: 'login' | 'signup') => void;
  closeAuthModal: () => void;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<UserProfile>;
  loginWithCredentials: (identifier: string, password?: string) => Promise<void>;
  signupWithDetails: (details: {
    email: string;
    displayName: string;
    institutionId?: string;
    institutionName?: string;
    campusId?: string;
    campusName?: string;
    courseName?: string;
    role?: UserRole;
    countryCode?: string;
    password?: string;
  }) => Promise<void>;
  switchDemoUser: (userId: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  switchRole: (newRole: UserRole) => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authState, setAuthState] = useState<AuthState>(AuthState.LOADING_AUTH);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    loadSession();
  }, []);

  // Listen for OAuth postMessage events from popup window
  useEffect(() => {
    function handleOAuthMessage(event: MessageEvent) {
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        const authedUser: UserProfile = event.data.user;
        setUser(authedUser);
        setAuthError(null);
        setIsAuthModalOpen(false);

        if (!authedUser.onboardingCompleted || authedUser.onboardingStatus === 'PENDING') {
          setAuthState(AuthState.AUTHENTICATED_NEEDS_ONBOARDING);
          setIsOnboardingOpen(true);
        } else {
          setAuthState(AuthState.AUTHENTICATED_ONBOARDED);
          setIsOnboardingOpen(false);
        }
      } else if (event.data?.type === 'OAUTH_AUTH_ERROR') {
        setAuthError(event.data.error || 'Google authentication failed');
        setAuthState(AuthState.AUTHENTICATION_ERROR);
      }
    }

    window.addEventListener('message', handleOAuthMessage);
    return () => window.removeEventListener('message', handleOAuthMessage);
  }, []);

  async function loadSession() {
    try {
      setAuthState(AuthState.LOADING_AUTH);
      setAuthError(null);
      const res = await api.getSession();

      if (res.user) {
        setUser(res.user);
        if (!res.user.onboardingCompleted || res.user.onboardingStatus === 'PENDING') {
          setAuthState(AuthState.AUTHENTICATED_NEEDS_ONBOARDING);
        } else {
          setAuthState(AuthState.AUTHENTICATED_ONBOARDED);
        }
      } else {
        setUser(null);
        setAuthState(AuthState.NOT_AUTHENTICATED);
      }
    } catch (err: any) {
      console.error('Failed to load auth session:', err);
      setUser(null);
      setAuthState(AuthState.NOT_AUTHENTICATED);
    }
  }

  async function updateUserProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    if (!user) throw new Error('No authenticated user session');
    const res = await api.updateProfile(user.id, updates);
    setUser(res.user);

    if (res.user.onboardingCompleted && res.user.onboardingStatus === 'COMPLETED') {
      setAuthState(AuthState.AUTHENTICATED_ONBOARDED);
      setIsOnboardingOpen(false);
    }
    return res.user;
  }

  function openAuthModal(tab: 'login' | 'signup' = 'login') {
    setAuthModalTab(tab);
    setAuthError(null);
    setIsAuthModalOpen(true);
  }

  function closeAuthModal() {
    setIsAuthModalOpen(false);
  }

  async function loginWithCredentials(identifier: string, password?: string) {
    try {
      setAuthState(AuthState.LOADING_AUTH);
      setAuthError(null);
      const res = await api.login(identifier, password);
      setUser(res.user);
      setIsAuthModalOpen(false);
      setAuthState(AuthState.AUTHENTICATED_ONBOARDED);
    } catch (err: any) {
      console.error('Login error:', err);
      setAuthError(err.message || 'Login failed. Check your email or student ID.');
      setAuthState(user ? AuthState.AUTHENTICATED_ONBOARDED : AuthState.NOT_AUTHENTICATED);
      throw err;
    }
  }

  async function signupWithDetails(details: {
    email: string;
    displayName: string;
    institutionId?: string;
    institutionName?: string;
    campusId?: string;
    campusName?: string;
    courseName?: string;
    role?: UserRole;
    countryCode?: string;
    password?: string;
  }) {
    try {
      setAuthState(AuthState.LOADING_AUTH);
      setAuthError(null);
      const res = await api.signup(details);
      setUser(res.user);
      setIsAuthModalOpen(false);
      setAuthState(AuthState.AUTHENTICATED_ONBOARDED);
    } catch (err: any) {
      console.error('Signup error:', err);
      setAuthError(err.message || 'Registration failed.');
      setAuthState(user ? AuthState.AUTHENTICATED_ONBOARDED : AuthState.NOT_AUTHENTICATED);
      throw err;
    }
  }

  async function switchDemoUser(userId: string) {
    try {
      setAuthState(AuthState.LOADING_AUTH);
      setAuthError(null);
      const res = await api.switchUser(userId);
      setUser(res.user);
      setIsAuthModalOpen(false);
      setAuthState(AuthState.AUTHENTICATED_ONBOARDED);
    } catch (err: any) {
      console.error('Switch user error:', err);
      setAuthError(err.message || 'Failed to switch user.');
    }
  }

  async function signInWithGoogle() {
    try {
      setAuthState(AuthState.LOADING_AUTH);
      setAuthError(null);

      // 1. Fetch OAuth URL from server
      const { url, isConfigured } = await api.getGoogleAuthUrl();

      if (!isConfigured || !url) {
        // In AI Studio dev sandbox when GOOGLE_CLIENT_ID is not configured in env,
        // we can authenticate via server token verification gracefully
        const demoToken = `google-gsi-${Date.now()}`;
        const res = await api.verifyGoogleToken(demoToken);
        setUser(res.user);

        if (!res.user.onboardingCompleted || res.user.onboardingStatus === 'PENDING') {
          setAuthState(AuthState.AUTHENTICATED_NEEDS_ONBOARDING);
          setIsOnboardingOpen(true);
        } else {
          setAuthState(AuthState.AUTHENTICATED_ONBOARDED);
        }
        return;
      }

      // 2. Open Google OAuth Popup Window
      const width = 500;
      const height = 650;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      const popup = window.open(
        url,
        'EnermindGoogleAuth',
        `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,location=no,status=no`
      );

      if (!popup || popup.closed || typeof popup.closed === 'undefined') {
        // Popup blocked by browser: fallback to direct simulation
        setAuthError('Popup blocked by browser. Please allow popups or use Google token flow.');
        const fallbackRes = await api.verifyGoogleToken(`google-gsi-${Date.now()}`);
        setUser(fallbackRes.user);
        if (!fallbackRes.user.onboardingCompleted) {
          setAuthState(AuthState.AUTHENTICATED_NEEDS_ONBOARDING);
          setIsOnboardingOpen(true);
        } else {
          setAuthState(AuthState.AUTHENTICATED_ONBOARDED);
        }
      }
    } catch (err: any) {
      console.error('Google Sign In Error:', err);
      setAuthError(err.message || 'Google authentication failed');
      setAuthState(AuthState.AUTHENTICATION_ERROR);
    }
  }

  async function signOut() {
    try {
      await api.logout();
    } catch (e) {
      // Ignore
    }
    setUser(null);
    setAuthState(AuthState.NOT_AUTHENTICATED);
    setIsOnboardingOpen(false);
  }

  async function switchRole(newRole: UserRole) {
    if (!user) return;
    await updateUserProfile({ role: newRole });
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        authState,
        isLoading: authState === AuthState.LOADING_AUTH,
        authError,
        isOnboardingOpen,
        openOnboarding: () => setIsOnboardingOpen(true),
        closeOnboarding: () => setIsOnboardingOpen(false),
        updateUserProfile,
        signInWithGoogle,
        signOut,
        switchRole,
        refreshSession: loadSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
