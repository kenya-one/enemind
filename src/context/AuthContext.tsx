import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, AccountType } from '../types';
import { INITIAL_USERS } from '../services/mockData';
import { DriveSheetsService } from '../services/driveSheetsService';

interface AuthContextType {
  user: UserProfile | null;
  allUsers: UserProfile[];
  loginWithGoogle: (accountType: AccountType, customData?: Partial<UserProfile>) => void;
  switchUser: (userId: string) => void;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  isFinanceOfficerMode: boolean;
  setFinanceOfficerMode: (val: boolean) => void;
  googleDriveConnected: boolean;
  youtubeConnected: boolean;
  connectYoutubeChannel: (url: string) => void;
  googleAccessToken: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_USER_KEY = 'enemind_current_user_v1';
const LOCAL_STORAGE_USERS_KEY = 'enemind_all_users_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allUsers, setAllUsers] = useState<UserProfile[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
      return stored ? JSON.parse(stored) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      if (stored) return JSON.parse(stored);
      // Default to the first user (SunKing or Campus or School)
      return INITIAL_USERS[2]; // SunKing Company
    } catch {
      return INITIAL_USERS[2];
    }
  });

  const [isFinanceOfficerMode, setFinanceOfficerMode] = useState<boolean>(false);
  const [googleAccessToken, setGoogleAccessToken] = useState<string | null>('mock_oauth_gdrive_enemind_token_2026');
  const [youtubeConnected, setYoutubeConnected] = useState<boolean>(true);

  useEffect(() => {
    if (user) {
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user));
      // Auto-ensure drive sheets exist
      DriveSheetsService.getSheetsForUser(user);
    } else {
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(allUsers));
  }, [allUsers]);

  const loginWithGoogle = (accountType: AccountType, customData?: Partial<UserProfile>) => {
    const randomId = `user_${Date.now().toString(36)}`;
    const name = customData?.name || `Enemind ${accountType.toUpperCase()} User`;
    const folderName = `${name} – Enemind Data`;
    
    const newUser: UserProfile = {
      id: randomId,
      name,
      email: customData?.email || `${accountType}_${Date.now().toString(36).slice(-4)}@enemind.co.ke`,
      avatarUrl: customData?.avatarUrl || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      accountType,
      studentStage: customData?.studentStage || (accountType === 'student' ? 'campus' : undefined),
      schoolName: customData?.schoolName,
      planTier: customData?.planTier || 'basic',
      kycStatus: accountType === 'landlord' || accountType === 'school' ? 'pending' : 'verified',
      phone: customData?.phone || '+254 700 000 000',
      location: customData?.location || 'Nairobi, Kenya',
      coordinates: customData?.coordinates || { lat: -1.286389, lng: 36.817223 },
      driveFolderId: `folder_${randomId}_enemind_data`,
      driveFolderName: folderName,
      createdAt: new Date().toISOString().split('T')[0],
      ...customData
    };

    setAllUsers((prev) => [newUser, ...prev]);
    setUser(newUser);
    setGoogleAccessToken(`token_gdrive_${randomId}`);
    localStorage.setItem('enemind_gauth_token', `token_gdrive_${randomId}`);
    DriveSheetsService.getSheetsForUser(newUser);
  };

  const switchUser = (userId: string) => {
    const found = allUsers.find((u) => u.id === userId);
    if (found) {
      setUser(found);
      setFinanceOfficerMode(false);
      DriveSheetsService.getSheetsForUser(found);
    }
  };

  const logout = () => {
    setUser(null);
    setFinanceOfficerMode(false);
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    localStorage.removeItem('enemind_gauth_token');
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    setAllUsers((prev) => prev.map((u) => (u.id === user.id ? updated : u)));
  };

  const connectYoutubeChannel = (url: string) => {
    if (!user) return;
    updateProfile({ youtubeChannelUrl: url });
    setYoutubeConnected(true);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        allUsers,
        loginWithGoogle,
        switchUser,
        logout,
        updateProfile,
        isFinanceOfficerMode,
        setFinanceOfficerMode,
        googleDriveConnected: !!googleAccessToken,
        youtubeConnected,
        connectYoutubeChannel,
        googleAccessToken
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
