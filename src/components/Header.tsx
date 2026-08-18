/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import {
  Search,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  GraduationCap,
  ChevronDown,
  User,
  LogOut,
  Shield,
  Bell,
  Building,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { useCurrency } from '../context/CurrencyContext.js';
import { useConfig } from '../context/ConfigContext.js';
import { ENERMIND_LOGO_URL } from './Preloader.js';
import { UserRole } from '../types/index.js';

interface HeaderProps {
  onOpenAI: () => void;
  onNavigate: (view: string) => void;
  onOpenProfile?: () => void;
  activeView: string;
}

export function Header({ onOpenAI, onNavigate, onOpenProfile, activeView }: HeaderProps) {
  const { user, openOnboarding, openAuthModal, signOut, switchRole } = useAuth();
  const { activeRate, openCurrencyModal } = useCurrency();
  const { unconfiguredCount, openStatusModal } = useConfig();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="sticky top-0 z-30 w-full bg-[#0A0B10]/95 border-b border-white/5 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand & Campus Identity */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 group text-left focus:outline-none"
          >
            {/* Guaranteed Strictly Circular Logo */}
            <div className="w-9 h-9 rounded-full bg-[#0A0B10] border border-[#50E3C2]/40 p-0.5 overflow-hidden flex items-center justify-center group-hover:border-[#50E3C2] transition-all shrink-0 shadow-[0_0_14px_rgba(80,227,194,0.25)]">
              <img
                src={ENERMIND_LOGO_URL}
                alt="Enermind Logo"
                className="w-full h-full rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold tracking-tight text-base text-white">ENERMIND</span>
                <span className="text-[9px] bg-[#50E3C2]/10 text-[#50E3C2] border border-[#50E3C2]/30 px-1.5 py-0.2 rounded font-mono uppercase tracking-wider">
                  Global
                </span>
              </div>
              <p className="text-[11px] text-white/40 truncate max-w-[140px] sm:max-w-[200px]">
                {user?.institutionName || 'Select Campus'}
              </p>
            </div>
          </button>

          {/* Quick Campus Switcher Pill */}
          <button
            onClick={openOnboarding}
            className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 hover:border-[#50E3C2]/40 text-white/70 text-xs transition-colors"
            title="Change University, Campus, or Course"
          >
            <GraduationCap className="w-3.5 h-3.5 text-[#50E3C2]" />
            <span className="truncate max-w-[140px] font-medium text-white/90">
              {user?.courseName ? `${user.courseName}` : 'Configure Campus'}
            </span>
            <ChevronDown className="w-3 h-3 text-white/40" />
          </button>
        </div>

        {/* Global Editorial Pill Search */}
        <div className="hidden lg:flex flex-1 max-w-md mx-2">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-white/30 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search universities, past papers, sheets, gigs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-1.5 pl-10 pr-8 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#50E3C2]/50 transition-colors"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-white/30 bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          
          {/* Currency Pill */}
          <button
            onClick={openCurrencyModal}
            className="flex items-center gap-1.5 sm:gap-2 bg-white/5 px-2.5 sm:px-3 py-1 rounded-full border border-white/10 hover:border-white/20 text-xs transition-colors"
            title="Switch display currency"
          >
            <span className="text-[10px] font-bold text-white/40">{activeRate.code}</span>
            <span className="text-xs text-white font-medium">
              {activeRate.flag} {activeRate.symbol}
            </span>
            <ChevronDown className="w-3 h-3 text-white/30" />
          </button>

          {/* Integration Status Pill */}
          <button
            onClick={openStatusModal}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium transition-colors ${
              unconfiguredCount === 0
                ? 'bg-[#50E3C2]/10 border-[#50E3C2]/30 text-[#50E3C2] hover:bg-[#50E3C2]/20'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
            }`}
            title="View integration readiness status"
          >
            {unconfiguredCount === 0 ? (
              <ShieldCheck className="w-3.5 h-3.5 text-[#50E3C2]" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span className="hidden xl:inline text-[11px]">
              {unconfiguredCount === 0 ? 'Systems Active' : `${unconfiguredCount} Setup Req`}
            </span>
          </button>

          {/* Campus AI Trigger Icon */}
          <button
            onClick={onOpenAI}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#50E3C2]/10 text-[#50E3C2] hover:bg-[#50E3C2]/20 border border-[#50E3C2]/20 transition-colors cursor-pointer"
            title="Open Campus AI Assistant"
          >
            <Sparkles className="w-4 h-4" />
          </button>

          {/* User Menu / Explicit Log In & Sign Up Controls */}
          <div className="relative flex items-center gap-2">
            {user ? (
              <>
                <button
                  id="btn-user-avatar-menu"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1 pl-1.5 rounded-full bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
                >
                  <img
                    src={user.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                    alt={user.displayName}
                    className="w-7 h-7 rounded-full object-cover border border-white/10"
                  />
                  <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-[#50E3C2]/10 text-[#50E3C2] border border-[#50E3C2]/20 hidden md:inline font-mono">
                    {user.role}
                  </span>
                  <ChevronDown className="w-3 h-3 text-white/40 mr-1" />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  id="btn-header-login"
                  onClick={() => openAuthModal('login')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-semibold transition-colors"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Log In</span>
                </button>
                <button
                  id="btn-header-signup"
                  onClick={() => openAuthModal('signup')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#50E3C2] text-black hover:bg-[#50E3C2]/90 text-xs font-bold transition-all shadow-md shadow-[#50E3C2]/20"
                >
                  <span>Sign Up</span>
                </button>
              </div>
            )}

            {/* Dropdown Menu */}
            {isUserMenuOpen && user && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-[#12141D] border border-white/10 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in">
                <div className="p-3 border-b border-white/5">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={user.photoUrl}
                      alt={user.displayName}
                      className="w-8 h-8 rounded-full object-cover border border-white/10"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-white truncate">{user.displayName}</p>
                      <p className="text-[11px] text-white/40 truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[10px] bg-[#50E3C2]/10 text-[#50E3C2] border border-[#50E3C2]/20 px-1.5 py-0.5 rounded">
                      Google Workspace Active
                    </span>
                    <span className="text-[10px] text-white/40">{user.yearLevelLabel}</span>
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      openAuthModal('login');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#50E3C2] hover:bg-[#50E3C2]/10 rounded-lg text-left font-medium"
                  >
                    <User className="w-4 h-4" />
                    <span>Switch Account / Sign In</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      openAuthModal('signup');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-white/70 hover:text-white hover:bg-white/5 rounded-lg text-left"
                  >
                    <Sparkles className="w-4 h-4 text-[#50E3C2]" />
                    <span>Create New Student Account</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      if (onOpenProfile) onOpenProfile();
                      else openOnboarding();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-white/70 hover:text-white hover:bg-white/5 rounded-lg text-left"
                  >
                    <GraduationCap className="w-4 h-4 text-[#50E3C2]" />
                    <span>My Campus Profile & Settings</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      openOnboarding();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-white/70 hover:text-white hover:bg-white/5 rounded-lg text-left"
                  >
                    <Building className="w-4 h-4 text-[#50E3C2]" />
                    <span>Rerun Campus Onboarding</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onNavigate('vault');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-white/70 hover:text-white hover:bg-white/5 rounded-lg text-left"
                  >
                    <Shield className="w-4 h-4 text-[#50E3C2]" />
                    <span>Private Vault & Drive</span>
                  </button>

                  {/* RBAC Role Switcher */}
                  <div className="p-2 my-1 rounded-xl bg-[#0A0B10] border border-white/5 space-y-1.5">
                    <p className="text-[9px] font-semibold uppercase tracking-wider text-white/40">
                      RBAC Role Simulator
                    </p>
                    <div className="grid grid-cols-2 gap-1 text-[11px]">
                      <button
                        onClick={() => switchRole(UserRole.STUDENT)}
                        className={`p-1 rounded text-center font-medium ${
                          user.role === UserRole.STUDENT
                            ? 'bg-[#50E3C2] text-black font-bold'
                            : 'bg-white/5 text-white/50'
                        }`}
                      >
                        Student
                      </button>
                      <button
                        onClick={() => switchRole(UserRole.ADMIN)}
                        className={`p-1 rounded text-center font-medium ${
                          user.role === UserRole.ADMIN
                            ? 'bg-[#50E3C2] text-black font-bold'
                            : 'bg-white/5 text-white/50'
                        }`}
                      >
                        Admin
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      signOut();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-lg text-left transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
