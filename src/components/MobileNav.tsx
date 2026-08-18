/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Home,
  BookOpen,
  Building,
  Briefcase,
  Table,
  Menu,
  X,
  Sparkles,
  ShoppingBag,
  Users,
  Calendar,
  Lock,
  Shield,
  User,
  LogIn,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { SocialLinks } from './SocialLinks.js';
import { UserRole } from '../types/index.js';
import { ENERMIND_LOGO_URL } from './Preloader.js';

interface MobileNavProps {
  activeView: string;
  onNavigate: (view: string) => void;
  onOpenAI: () => void;
}

export function MobileNav({ activeView, onNavigate, onOpenAI }: MobileNavProps) {
  const { user, openAuthModal } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isAdmin = user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN;

  const quickNav = [
    { id: 'home', label: 'HOME', icon: Home },
    { id: 'academic', label: 'ACADEMIC', icon: BookOpen },
    { id: 'accommodation', label: 'HOUSING', icon: Building },
    { id: 'opportunities', label: 'JOBS', icon: Briefcase },
  ];

  return (
    <>
      {/* Bottom Sticky Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A0B10]/95 border-t border-white/5 backdrop-blur-lg px-2 py-2 flex items-center justify-around">
        {quickNav.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
                isActive ? 'text-[#50E3C2] font-bold' : 'text-white/40 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[9px] tracking-wider uppercase font-semibold">{item.label}</span>
            </button>
          );
        })}

        {/* AI Action button */}
        <button
          onClick={onOpenAI}
          className="flex flex-col items-center gap-1 py-1 px-2 text-[#50E3C2] font-semibold"
        >
          <div className="p-1 rounded-lg bg-[#50E3C2]/10 text-[#50E3C2] border border-[#50E3C2]/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-[9px] tracking-wider uppercase font-semibold">AI</span>
        </button>

        {/* Menu toggle */}
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="flex flex-col items-center gap-1 py-1 px-3 text-white/40 hover:text-white"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[9px] tracking-wider uppercase font-semibold">MORE</span>
        </button>
      </div>

      {/* Slide-out Full Mobile Menu Drawer */}
      {isDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-[#0A0B10]/90 backdrop-blur-sm flex justify-end animate-in fade-in">
          <div className="w-4/5 max-w-sm bg-[#12141D] h-full border-l border-white/5 p-5 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full overflow-hidden border border-[#50E3C2]/40 bg-[#0A0B10] flex items-center justify-center shadow-[0_0_8px_rgba(80,227,194,0.2)]">
                    <img
                      src={ENERMIND_LOGO_URL}
                      alt="Enermind Logo"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <span className="font-bold text-xs text-white uppercase tracking-[0.15em]">Enermind</span>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1.5 text-white/40 hover:text-white rounded-lg bg-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Auth Banner */}
              <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                {user ? (
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={user.photoUrl}
                        alt={user.displayName}
                        className="w-8 h-8 rounded-full object-cover border border-white/10"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">{user.displayName}</p>
                        <p className="text-[10px] text-[#50E3C2] font-mono">{user.role}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setIsDrawerOpen(false);
                        openAuthModal('login');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white/10 text-white text-[11px] font-medium hover:bg-white/20 transition-colors"
                    >
                      Switch
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setIsDrawerOpen(false);
                        openAuthModal('login');
                      }}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Log In</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsDrawerOpen(false);
                        openAuthModal('signup');
                      }}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#50E3C2] hover:bg-[#50E3C2]/90 text-black text-xs font-bold shadow-md shadow-[#50E3C2]/20"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Sign Up</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                {[
                  { id: 'home', label: 'HOME DASHBOARD', icon: Home },
                  { id: 'academic', label: 'ACADEMIC RESOURCES', icon: BookOpen },
                  { id: 'accommodation', label: 'ACCOMMODATION & HOSTELS', icon: Building },
                  { id: 'opportunities', label: 'JOBS & SCHOLARSHIPS', icon: Briefcase },
                  { id: 'gigs', label: 'GIGS & MARKETPLACE', icon: ShoppingBag },
                  { id: 'communities', label: 'WHATSAPP GROUPS', icon: Users },
                  { id: 'events', label: 'EVENTS & TIMETABLE', icon: Calendar },
                  { id: 'sheets', label: 'GOOGLE SHEET STORE', icon: Table },
                  { id: 'vault', label: 'PRIVATE VAULT (DRIVE)', icon: Lock },
                ].map((m) => {
                  const Icon = m.icon;
                  const isActive = activeView === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => {
                        onNavigate(m.id);
                        setIsDrawerOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg text-xs font-semibold tracking-wider transition-colors text-left ${
                        isActive
                          ? 'bg-white/5 text-white border-l-2 border-[#50E3C2]'
                          : 'text-white/60 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#50E3C2]' : 'text-white/40'}`} />
                      <span>{m.label}</span>
                    </button>
                  );
                })}

                {isAdmin && (
                  <button
                    onClick={() => {
                      onNavigate('admin');
                      setIsDrawerOpen(false);
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-lg text-xs font-semibold text-amber-300 bg-amber-500/10 border-l-2 border-amber-400 text-left mt-2"
                  >
                    <Shield className="w-4 h-4 text-amber-400" />
                    <span>ADMIN QUEUE</span>
                  </button>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 space-y-3">
              <SocialLinks />
              <p className="text-[10px] text-white/30 text-center uppercase tracking-widest font-mono">Enermind Ecosystem</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
