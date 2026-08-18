/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  User,
  Lock,
  Mail,
  GraduationCap,
  Sparkles,
  Shield,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  X,
  Building,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { ENERMIND_LOGO_URL } from './Preloader.js';
import { api } from '../services/api.js';
import { CountryInfo, Institution, UserRole, UserProfile } from '../types/index.js';

export function AuthModal() {
  const {
    isAuthModalOpen,
    authModalTab,
    closeAuthModal,
    openAuthModal,
    loginWithCredentials,
    signupWithDetails,
    signInWithGoogle,
    switchDemoUser,
    authError,
    isLoading,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [demoAccounts, setDemoAccounts] = useState<UserProfile[]>([]);

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Sign up form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupCountry, setSignupCountry] = useState('KE');
  const [signupInstitution, setSignupInstitution] = useState('');
  const [signupRole, setSignupRole] = useState<UserRole>(UserRole.STUDENT);

  const [countries, setCountries] = useState<CountryInfo[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (authModalTab) {
      setActiveTab(authModalTab);
    }
  }, [authModalTab]);

  useEffect(() => {
    if (isAuthModalOpen) {
      setLocalError(null);
      loadAuxiliaryData();
    }
  }, [isAuthModalOpen, signupCountry]);

  async function loadAuxiliaryData() {
    try {
      const [cRes, iRes, dRes] = await Promise.all([
        api.getCountries(),
        api.getInstitutions(signupCountry),
        api.getDemoAccounts(),
      ]);
      setCountries(cRes.countries || []);
      setInstitutions(iRes.institutions || []);
      setDemoAccounts(dRes.accounts || []);
      if (iRes.institutions?.length > 0 && !signupInstitution) {
        setSignupInstitution(iRes.institutions[0].id);
      }
    } catch (e) {
      // Fallback
    }
  }

  if (!isAuthModalOpen) return null;

  async function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!loginIdentifier.trim()) {
      setLocalError('Please enter your email or Student ID');
      return;
    }
    setLocalError(null);
    setIsSubmitting(true);
    try {
      await loginWithCredentials(loginIdentifier, loginPassword);
    } catch (err: any) {
      setLocalError(err.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSignupSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!signupName.trim()) {
      setLocalError('Please enter your full name');
      return;
    }
    if (!signupEmail.trim() || !signupEmail.includes('@')) {
      setLocalError('Please provide a valid campus or personal email');
      return;
    }
    setLocalError(null);
    setIsSubmitting(true);

    const selectedInst = institutions.find((i) => i.id === signupInstitution);
    try {
      await signupWithDetails({
        displayName: signupName,
        email: signupEmail,
        countryCode: signupCountry,
        institutionId: selectedInst?.id || 'inst-uon-ke',
        institutionName: selectedInst?.name || 'University of Nairobi',
        role: signupRole,
        password: signupPassword,
      });
    } catch (err: any) {
      setLocalError(err.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      id="auth-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0B10]/90 backdrop-blur-md animate-in fade-in"
    >
      <div
        id="auth-modal-container"
        className="w-full max-w-lg bg-[#12141D] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col max-h-[92vh] overflow-y-auto custom-scrollbar relative"
      >
        {/* Close Button */}
        <button
          id="auth-modal-close-btn"
          onClick={closeAuthModal}
          className="absolute top-5 right-5 p-2 text-white/40 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors"
          title="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Header with Circular Logo */}
        <div className="flex flex-col items-center text-center pb-5 border-b border-white/5">
          <div className="w-14 h-14 rounded-full overflow-hidden border border-[#50E3C2]/40 p-1 bg-[#0A0B10] flex items-center justify-center shadow-[0_0_20px_rgba(80,227,194,0.25)] mb-3">
            <img
              src={ENERMIND_LOGO_URL}
              alt="Enermind Logo"
              className="w-full h-full rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            {activeTab === 'login' ? 'Welcome Back to Enermind' : 'Join Enermind Campus Ecosystem'}
          </h2>
          <p className="text-xs text-white/50 mt-1 max-w-xs">
            {activeTab === 'login'
              ? 'Sign in to access your Private Drive Vault, Course Notes & Past Papers.'
              : 'Create your student or educator profile and connect your Google Workspace.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 bg-[#0A0B10] rounded-xl border border-white/10 my-5">
          <button
            id="auth-tab-login"
            onClick={() => {
              setActiveTab('login');
              setLocalError(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'login'
                ? 'bg-[#50E3C2] text-black shadow-md font-bold'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            id="auth-tab-signup"
            onClick={() => {
              setActiveTab('signup');
              setLocalError(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'signup'
                ? 'bg-[#50E3C2] text-black shadow-md font-bold'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Create Account / Sign Up
          </button>
        </div>

        {/* Error Alert */}
        {(localError || authError) && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2.5 text-red-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span className="flex-1">{localError || authError}</span>
          </div>
        )}

        {/* Google Workspace SSO Button */}
        <button
          id="btn-google-sso"
          type="button"
          onClick={signInWithGoogle}
          disabled={isLoading || isSubmitting}
          className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-white text-black font-semibold text-xs hover:bg-white/90 transition-all shadow-sm group disabled:opacity-50 cursor-pointer"
        >
          {/* Circular Google Icon */}
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.4 8.9 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
            />
            <path
              fill="#FBBC05"
              d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.6 7.4C.6 9.4 0 11.6 0 14s.6 4.6 1.6 6.6l3.7-2.9z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.4-6.7-5.3L1.6 16c1.9 3.8 5.8 6.4 10.4 6.4z"
            />
          </svg>
          <span>Continue with Google Workspace (Drive & SSO)</span>
        </button>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-1 border-t border-white/10" />
          <span className="px-3 text-[10px] uppercase text-white/30 tracking-widest font-mono">
            Or with Campus ID
          </span>
          <div className="flex-1 border-t border-white/10" />
        </div>

        {/* Sign In View */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1">
                Email or Student Registration Number
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="input-login-id"
                  type="text"
                  required
                  placeholder="e.g. joicebarasa7@gmail.com or P15/1234/2023"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  className="w-full bg-[#0A0B10] border border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#50E3C2]/60 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-white/70">Password</label>
                <span className="text-[10px] text-[#50E3C2] hover:underline cursor-pointer">
                  Forgot password?
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="input-login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-[#0A0B10] border border-white/10 rounded-xl py-2.5 pl-9 pr-10 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#50E3C2]/60 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <button
              id="btn-login-submit"
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#50E3C2] to-emerald-400 text-black font-bold text-xs hover:opacity-95 transition-opacity flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#50E3C2]/20 disabled:opacity-50"
            >
              <span>Sign In to Campus Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Quick Demo Switcher */}
            <div className="pt-3 border-t border-white/5 mt-4">
              <div className="text-[10px] uppercase tracking-wider text-white/40 font-mono mb-2 flex items-center justify-between">
                <span>One-Click Test Accounts</span>
                <span className="text-[#50E3C2]">Instant Access</span>
              </div>
              <div className="space-y-1.5">
                {demoAccounts.map((account) => (
                  <button
                    key={account.id}
                    type="button"
                    onClick={() => switchDemoUser(account.id)}
                    className="w-full flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#50E3C2]/30 transition-all text-left group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={account.photoUrl}
                        alt={account.displayName}
                        className="w-6 h-6 rounded-full object-cover border border-white/10 shrink-0"
                      />
                      <div className="truncate min-w-0">
                        <p className="text-xs font-medium text-white truncate group-hover:text-[#50E3C2] transition-colors">
                          {account.displayName}
                        </p>
                        <p className="text-[10px] text-white/40 truncate">
                          {account.institutionName} • {account.courseName}
                        </p>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/10 text-white/70 group-hover:bg-[#50E3C2]/20 group-hover:text-[#50E3C2] shrink-0 ml-2">
                      {account.role}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </form>
        )}

        {/* Sign Up View */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="input-signup-name"
                  type="text"
                  required
                  placeholder="e.g. Joice Barasa"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  className="w-full bg-[#0A0B10] border border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#50E3C2]/60 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-white/70 mb-1">Campus or Personal Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="input-signup-email"
                  type="email"
                  required
                  placeholder="e.g. yourname@student.uonbi.ac.ke"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  className="w-full bg-[#0A0B10] border border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#50E3C2]/60 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">Country</label>
                <select
                  id="select-signup-country"
                  value={signupCountry}
                  onChange={(e) => setSignupCountry(e.target.value)}
                  className="w-full bg-[#0A0B10] border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#50E3C2]/60"
                >
                  {countries.map((c) => (
                    <option key={c.code} value={c.code} className="bg-[#12141D]">
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">Primary Role</label>
                <select
                  id="select-signup-role"
                  value={signupRole}
                  onChange={(e) => setSignupRole(e.target.value as UserRole)}
                  className="w-full bg-[#0A0B10] border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#50E3C2]/60"
                >
                  <option value={UserRole.STUDENT} className="bg-[#12141D]">
                    Student
                  </option>
                  <option value={UserRole.ADMIN} className="bg-[#12141D]">
                    Campus Moderator / Admin
                  </option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-white/70 mb-1">Institution</label>
              <div className="relative">
                <Building className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  id="select-signup-institution"
                  value={signupInstitution}
                  onChange={(e) => setSignupInstitution(e.target.value)}
                  className="w-full bg-[#0A0B10] border border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-[#50E3C2]/60"
                >
                  {institutions.map((inst) => (
                    <option key={inst.id} value={inst.id} className="bg-[#12141D]">
                      {inst.name} ({inst.shortName})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-white/70 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="input-signup-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Choose a password (min 6 characters)"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  className="w-full bg-[#0A0B10] border border-white/10 rounded-xl py-2.5 pl-9 pr-10 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#50E3C2]/60 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <button
              id="btn-signup-submit"
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#50E3C2] to-emerald-400 text-black font-bold text-xs hover:opacity-95 transition-opacity flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#50E3C2]/20 disabled:opacity-50"
            >
              <span>Create Account & Start Exploring</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
