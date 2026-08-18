/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AccountStatus, UserProfile, UserRole } from '../../src/types/index.js';
import { config } from '../config.js';

// Default initial user for development seed/preview
const INITIAL_DEMO_USER: UserProfile = {
  id: 'usr-enermind-lead',
  googleId: 'google-109283746592837465',
  googleSubjectId: '109283746592837465',
  email: 'joicebarasa7@gmail.com',
  displayName: 'Joice Barasa',
  photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  countryCode: 'KE',
  preferredCurrency: 'USD',
  institutionId: 'inst-uon-ke',
  institutionName: 'University of Nairobi',
  campusId: 'camp-uon-main',
  campusName: 'Main Campus (Nairobi CBD)',
  collegeId: 'col-uon-cbet',
  collegeName: 'Faculty of Science and Technology',
  departmentId: 'dept-uon-sci',
  departmentName: 'Department of Computing and Informatics',
  courseId: 'course-uon-bsc-cs',
  courseName: 'BSc Computer Science',
  yearLevelId: 'yr-3',
  yearLevelLabel: 'Year 3',
  role: UserRole.SUPER_ADMIN,
  accountStatus: AccountStatus.ACTIVE,
  onboardingStatus: 'COMPLETED',
  googleDriveConnected: true,
  googleSheetsConnected: true,
  googleCalendarConnected: false,
  onboardingCompleted: true,
  createdDate: new Date('2025-01-15').toISOString(),
  updatedDate: new Date().toISOString(),
};

// Preset Demo Accounts for fast role testing & seamless sign-in
const DEMO_ACCOUNTS: UserProfile[] = [
  INITIAL_DEMO_USER,
  {
    id: 'usr-admin-uon',
    googleId: 'google-987123654123456789',
    googleSubjectId: '987123654123456789',
    email: 'admin.moderator@uonbi.ac.ke',
    displayName: 'Dr. Allan Ochieng',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    countryCode: 'KE',
    preferredCurrency: 'USD',
    institutionId: 'inst-uon-ke',
    institutionName: 'University of Nairobi',
    campusId: 'camp-uon-main',
    campusName: 'Main Campus (Nairobi CBD)',
    collegeId: 'col-uon-cbet',
    collegeName: 'Faculty of Science and Technology',
    departmentId: 'dept-uon-sci',
    departmentName: 'Department of Computing and Informatics',
    courseId: 'course-uon-bsc-cs',
    courseName: 'Faculty Administration',
    yearLevelId: 'yr-grad',
    yearLevelLabel: 'Faculty Moderator',
    role: UserRole.ADMIN,
    accountStatus: AccountStatus.ACTIVE,
    onboardingStatus: 'COMPLETED',
    googleDriveConnected: true,
    googleSheetsConnected: true,
    googleCalendarConnected: false,
    onboardingCompleted: true,
    createdDate: new Date('2025-01-10').toISOString(),
    updatedDate: new Date().toISOString(),
  },
  {
    id: 'usr-creator-sarah',
    googleId: 'google-554433221100998877',
    googleSubjectId: '554433221100998877',
    email: 'sarah.jenkins@student.ku.ac.ke',
    displayName: 'Sarah Jenkins',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    countryCode: 'KE',
    preferredCurrency: 'USD',
    institutionId: 'inst-ku-ke',
    institutionName: 'Kenyatta University',
    campusId: 'camp-ku-main',
    campusName: 'Main Campus (Thika Road)',
    collegeId: 'col-ku-eng',
    collegeName: 'School of Engineering and Architecture',
    departmentId: 'dept-ku-soft',
    departmentName: 'Department of Software Engineering',
    courseId: 'course-ku-soft-eng',
    courseName: 'BSc Software Engineering',
    yearLevelId: 'yr-2',
    yearLevelLabel: 'Year 2 / Sophomore',
    role: UserRole.STUDENT,
    accountStatus: AccountStatus.ACTIVE,
    onboardingStatus: 'COMPLETED',
    googleDriveConnected: true,
    googleSheetsConnected: true,
    googleCalendarConnected: false,
    onboardingCompleted: true,
    createdDate: new Date('2025-02-01').toISOString(),
    updatedDate: new Date().toISOString(),
  }
];

class AuthService {
  private usersById: Map<string, UserProfile> = new Map();
  private usersByGoogleSub: Map<string, UserProfile> = new Map();
  private usersByEmail: Map<string, UserProfile> = new Map();
  private sessions: Map<string, string> = new Map(); // sessionId -> userId
  private activeSessionUserId: string | null = INITIAL_DEMO_USER.id;

  constructor() {
    DEMO_ACCOUNTS.forEach((demo) => this.saveUser(demo));
  }

  private saveUser(user: UserProfile) {
    this.usersById.set(user.id, user);
    this.usersByEmail.set(user.email.toLowerCase(), user);
    if (user.googleSubjectId) {
      this.usersByGoogleSub.set(user.googleSubjectId, user);
    }
  }

  getUserById(id: string): UserProfile | undefined {
    return this.usersById.get(id);
  }

  getUserByEmail(email: string): UserProfile | undefined {
    return this.usersByEmail.get(email.toLowerCase());
  }

  getUserByGoogleSubject(sub: string): UserProfile | undefined {
    return this.usersByGoogleSub.get(sub);
  }

  getActiveUser(): UserProfile | null {
    if (!this.activeSessionUserId) return null;
    return this.usersById.get(this.activeSessionUserId) || null;
  }

  setActiveUser(userId: string | null) {
    this.activeSessionUserId = userId;
  }

  createSession(userId: string): string {
    const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    this.sessions.set(sessionId, userId);
    this.activeSessionUserId = userId;
    return sessionId;
  }

  destroySession(sessionId?: string) {
    if (sessionId) {
      this.sessions.delete(sessionId);
    }
    this.activeSessionUserId = null;
  }

  /**
   * Get Google OAuth 2.0 Authorization URL
   */
  getGoogleAuthUrl(redirectUri: string): { url: string; isConfigured: boolean } {
    const clientId = config.google.clientId;
    if (!clientId || clientId.trim().length === 0) {
      return {
        url: '',
        isConfigured: false,
      };
    }

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid email profile https://www.googleapis.com/auth/drive.file',
      access_type: 'offline',
      prompt: 'consent',
      state: `state_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    });

    return {
      url: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
      isConfigured: true,
    };
  }

  /**
   * Exchange Google authorization code for tokens and fetch user profile
   */
  async exchangeCodeForGoogleUser(code: string, redirectUri: string): Promise<{
    success: boolean;
    googleUser?: { sub: string; email: string; name: string; picture?: string };
    error?: string;
  }> {
    const clientId = config.google.clientId;
    const clientSecret = config.google.clientSecret;

    if (!clientId || !clientSecret) {
      return {
        success: false,
        error: 'GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are required on the server.',
      };
    }

    try {
      // 1. Exchange code with Google token endpoint
      const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code',
        }),
      });

      if (!tokenRes.ok) {
        const errData = await tokenRes.text();
        console.error('Google token exchange error:', errData);
        return { success: false, error: 'Failed to exchange authorization code with Google.' };
      }

      const tokenData = await tokenRes.json();
      const accessToken = tokenData.access_token;

      // 2. Fetch user profile with access token
      const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!userRes.ok) {
        return { success: false, error: 'Failed to fetch Google user profile.' };
      }

      const userInfo = await userRes.json();
      return {
        success: true,
        googleUser: {
          sub: userInfo.sub,
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture,
        },
      };
    } catch (err: any) {
      console.error('OAuth exchange exception:', err);
      return { success: false, error: err.message || 'OAuth network error.' };
    }
  }

  /**
   * Verify Google OAuth Bearer Token or GSI token
   */
  async verifyGoogleToken(token: string): Promise<{
    valid: boolean;
    email?: string;
    name?: string;
    sub?: string;
    picture?: string;
    error?: string;
  }> {
    if (!token) {
      return { valid: false, error: 'Token is required' };
    }

    try {
      // In production with real Google access token:
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const userInfo = await res.json();
        return {
          valid: true,
          email: userInfo.email,
          name: userInfo.name,
          sub: userInfo.sub,
          picture: userInfo.picture,
        };
      }
    } catch (err) {
      // Fallback
    }

    // Fallback verification for demo/development tokens
    if (token.startsWith('dev-token-') || token.startsWith('mock-') || token.startsWith('google-gsi-')) {
      return {
        valid: true,
        email: 'joicebarasa7@gmail.com',
        name: 'Joice Barasa',
        sub: '109283746592837465',
        picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      };
    }

    return { valid: false, error: 'Invalid Google token' };
  }

  /**
   * Authenticate or register a Google user using stable Google Subject ID (sub)
   */
  async getOrCreateUserFromGoogle(googleUser: {
    sub: string;
    email: string;
    name: string;
    picture?: string;
  }): Promise<{ user: UserProfile; isNewUser: boolean }> {
    // 1. Look up by stable Google subject ID
    let existing = this.getUserByGoogleSubject(googleUser.sub);

    // 2. Fallback look up by email
    if (!existing) {
      existing = this.getUserByEmail(googleUser.email);
    }

    if (existing) {
      existing.googleSubjectId = googleUser.sub;
      existing.googleId = `google-${googleUser.sub}`;
      existing.displayName = googleUser.name || existing.displayName;
      if (googleUser.picture) existing.photoUrl = googleUser.picture;
      existing.updatedDate = new Date().toISOString();
      this.saveUser(existing);
      this.setActiveUser(existing.id);
      return { user: existing, isNewUser: false };
    }

    // New user record creation
    const newUser: UserProfile = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      googleId: `google-${googleUser.sub}`,
      googleSubjectId: googleUser.sub,
      email: googleUser.email.toLowerCase(),
      displayName: googleUser.name || googleUser.email.split('@')[0],
      photoUrl: googleUser.picture,
      countryCode: 'KE',
      preferredCurrency: 'USD',
      role: UserRole.STUDENT,
      accountStatus: AccountStatus.ONBOARDING_REQUIRED,
      onboardingStatus: 'PENDING',
      googleDriveConnected: false,
      googleSheetsConnected: false,
      googleCalendarConnected: false,
      onboardingCompleted: false,
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
    };

    this.saveUser(newUser);
    this.setActiveUser(newUser.id);
    return { user: newUser, isNewUser: true };
  }

  /**
   * Update onboarding campus profile
   */
  updateUserProfile(userId: string, updates: Partial<UserProfile>): UserProfile | null {
    const user = this.getUserById(userId);
    if (!user) return null;

    Object.assign(user, updates);
    if (updates.onboardingCompleted) {
      user.onboardingStatus = 'COMPLETED';
      user.accountStatus = AccountStatus.ACTIVE;
    }
    user.updatedDate = new Date().toISOString();
    this.saveUser(user);
    return user;
  }

  /**
   * Traditional / Demo Login with Email, Student ID, or Username
   */
  loginWithCredentials(identifier: string, _password?: string): { success: boolean; user?: UserProfile; error?: string } {
    if (!identifier || identifier.trim().length === 0) {
      return { success: false, error: 'Email or Student ID is required' };
    }

    const cleanId = identifier.trim().toLowerCase();
    // 1. Check exact email
    let found = this.getUserByEmail(cleanId);

    // 2. Check if ID matches
    if (!found) {
      found = this.getUserById(cleanId);
    }

    // 3. Check demo accounts or user list match by name or sub
    if (!found) {
      for (const u of this.usersById.values()) {
        if (
          u.displayName.toLowerCase().includes(cleanId) ||
          u.email.toLowerCase().includes(cleanId) ||
          u.id.toLowerCase() === cleanId
        ) {
          found = u;
          break;
        }
      }
    }

    // 4. If user not found, create a seamless instant guest student session
    if (!found) {
      const newUser: UserProfile = {
        id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        email: cleanId.includes('@') ? cleanId : `${cleanId}@student.campus.ac.ke`,
        displayName: identifier.includes('@') ? identifier.split('@')[0] : identifier,
        photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        countryCode: 'KE',
        preferredCurrency: 'USD',
        role: UserRole.STUDENT,
        accountStatus: AccountStatus.ACTIVE,
        onboardingStatus: 'COMPLETED',
        googleDriveConnected: true,
        googleSheetsConnected: true,
        googleCalendarConnected: false,
        onboardingCompleted: true,
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
      };
      this.saveUser(newUser);
      found = newUser;
    }

    this.setActiveUser(found.id);
    return { success: true, user: found };
  }

  /**
   * Register a new user account
   */
  signupUser(data: {
    email: string;
    displayName: string;
    institutionId?: string;
    institutionName?: string;
    campusId?: string;
    campusName?: string;
    courseName?: string;
    role?: UserRole;
    countryCode?: string;
  }): { success: boolean; user?: UserProfile; error?: string } {
    if (!data.email || !data.email.trim()) {
      return { success: false, error: 'Email is required' };
    }
    if (!data.displayName || !data.displayName.trim()) {
      return { success: false, error: 'Full name is required' };
    }

    const cleanEmail = data.email.trim().toLowerCase();
    let existing = this.getUserByEmail(cleanEmail);
    if (existing) {
      this.setActiveUser(existing.id);
      return { success: true, user: existing };
    }

    const newUser: UserProfile = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      email: cleanEmail,
      displayName: data.displayName.trim(),
      photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      countryCode: data.countryCode || 'KE',
      preferredCurrency: 'USD',
      institutionId: data.institutionId || 'inst-uon-ke',
      institutionName: data.institutionName || 'University of Nairobi',
      campusId: data.campusId || 'camp-uon-main',
      campusName: data.campusName || 'Main Campus',
      courseName: data.courseName || 'General Studies',
      role: data.role || UserRole.STUDENT,
      accountStatus: AccountStatus.ACTIVE,
      onboardingStatus: 'COMPLETED',
      googleDriveConnected: true,
      googleSheetsConnected: true,
      googleCalendarConnected: false,
      onboardingCompleted: true,
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
    };

    this.saveUser(newUser);
    this.setActiveUser(newUser.id);
    return { success: true, user: newUser };
  }

  /**
   * Get all preset demo accounts for quick role switching
   */
  getDemoAccounts(): UserProfile[] {
    return DEMO_ACCOUNTS;
  }

  /**
   * Switch active user
   */
  switchUser(userId: string): UserProfile | null {
    const user = this.getUserById(userId);
    if (user) {
      this.setActiveUser(user.id);
      return user;
    }
    return null;
  }

  /**
   * Role check helper (RBAC)
   */
  hasRole(user: UserProfile, allowedRoles: UserRole[]): boolean {
    if (user.role === UserRole.SUPER_ADMIN) return true;
    return allowedRoles.includes(user.role);
  }
}

export const authService = new AuthService();
