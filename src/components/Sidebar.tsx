/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Home,
  BookOpen,
  Building,
  Briefcase,
  ShoppingBag,
  Users,
  Calendar,
  Table,
  Lock,
  Shield,
  Sparkles,
  User,
  LogIn,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { SocialLinks } from './SocialLinks.js';
import { UserRole } from '../types/index.js';

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
  onOpenAI: () => void;
}

export function Sidebar({ activeView, onNavigate, onOpenAI }: SidebarProps) {
  const { user, openAuthModal } = useAuth();
  const isAdmin =
    user?.role === UserRole.ADMIN ||
    user?.role === UserRole.SUPER_ADMIN ||
    user?.role === UserRole.MODERATOR ||
    user?.role === UserRole.INSTITUTION_ADMIN;

  const mainNav = [
    { id: 'home', label: 'HOME', icon: Home },
    { id: 'academic', label: 'ACADEMIC', icon: BookOpen },
  ];

  const resourceNav = [
    { id: 'accommodation', label: 'ACCOMMODATION', icon: Building },
    { id: 'opportunities', label: 'OPPORTUNITIES', icon: Briefcase },
    { id: 'gigs', label: 'GIGS & TASKS', icon: ShoppingBag },
    { id: 'communities', label: 'COMMUNITIES', icon: Users },
    { id: 'events', label: 'EVENTS & TIMETABLE', icon: Calendar },
  ];

  const workspaceNav = [
    { id: 'sheets', label: 'SHEET STORE', icon: Table },
    { id: 'vault', label: 'PRIVATE VAULT', icon: Lock },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-[#12141D] border-r border-white/5 p-4 space-y-5 shrink-0 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto custom-scrollbar">
      
      {/* AI Assistant Quick Pill */}
      <button
        onClick={onOpenAI}
        className="w-full flex items-center justify-between p-3 rounded-xl bg-[#50E3C2]/5 border border-[#50E3C2]/20 hover:border-[#50E3C2]/50 text-left transition-all group"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-[#50E3C2]/10 text-[#50E3C2] flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#50E3C2] tracking-wide block">AI ASSISTANT</span>
            <span className="text-[10px] text-white/40 block">Exam & Campus Advisor</span>
          </div>
        </div>
        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#50E3C2]/10 text-[#50E3C2]">
          Ready
        </span>
      </button>

      {/* Main Hub Section */}
      <div className="space-y-1">
        <div className="text-[10px] uppercase text-white/30 tracking-[0.2em] font-bold px-3 mb-2">
          Main Hub
        </div>
        {mainNav.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold tracking-wider transition-colors text-left ${
                isActive
                  ? 'bg-white/5 text-white border-l-2 border-[#50E3C2]'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#50E3C2]' : 'text-white/40'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Resources Section */}
      <div className="space-y-1">
        <div className="text-[10px] uppercase text-white/30 tracking-[0.2em] font-bold px-3 mb-2">
          Resources
        </div>
        {resourceNav.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold tracking-wider transition-colors text-left ${
                isActive
                  ? 'bg-white/5 text-white border-l-2 border-[#50E3C2]'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#50E3C2]' : 'text-white/40'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Workspace Section */}
      <div className="space-y-1">
        <div className="text-[10px] uppercase text-white/30 tracking-[0.2em] font-bold px-3 mb-2">
          Workspace
        </div>
        {workspaceNav.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold tracking-wider transition-colors text-left ${
                isActive
                  ? 'bg-white/5 text-white border-l-2 border-[#50E3C2]'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#50E3C2]' : 'text-white/40'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Admin / Moderator Portal */}
      {isAdmin && (
        <div className="space-y-1 pt-2 border-t border-white/5">
          <div className="text-[10px] uppercase text-amber-400/70 tracking-[0.2em] font-bold px-3 mb-2 flex items-center gap-1.5">
            <Shield className="w-3 h-3 text-amber-400" />
            <span>Moderator</span>
          </div>
          <button
            onClick={() => onNavigate('admin')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold tracking-wider transition-colors text-left ${
              activeView === 'admin'
                ? 'bg-amber-500/10 text-amber-300 border-l-2 border-amber-400'
                : 'text-amber-300/70 hover:text-amber-200 hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 text-amber-400" />
              <span>ADMIN QUEUE</span>
            </div>
            <span className="text-[9px] font-mono bg-amber-950 text-amber-400 border border-amber-800 px-1 py-0.5 rounded">
              RBAC
            </span>
          </button>
        </div>
      )}

      {/* Social Communities */}
      <div className="pt-2">
        <SocialLinks />
      </div>

      {/* Bottom Profile Summary Card / Auth Controls */}
      <div className="pt-3 border-t border-white/5 mt-auto">
        {user ? (
          <button
            onClick={() => openAuthModal('login')}
            className="w-full flex items-center justify-between p-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 hover:border-[#50E3C2]/30 transition-all text-left group"
            title="Click to switch account or manage profile"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-[#50E3C2]/40 bg-[#0A0B10] shrink-0 flex items-center justify-center">
                <img
                  src={user.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={user.displayName}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div className="overflow-hidden min-w-0">
                <div className="text-xs font-semibold text-white truncate group-hover:text-[#50E3C2] transition-colors">
                  {user.displayName}
                </div>
                <div className="text-[10px] text-white/40 truncate">
                  {user.institutionName || 'Global Campus'}
                </div>
              </div>
            </div>
            <span className="text-[9px] font-mono text-white/40 group-hover:text-[#50E3C2] shrink-0 ml-1">
              Switch
            </span>
          </button>
        ) : (
          <div className="space-y-2">
            <button
              onClick={() => openAuthModal('login')}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-semibold text-white transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Log In</span>
            </button>
            <button
              onClick={() => openAuthModal('signup')}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#50E3C2] hover:bg-[#50E3C2]/90 text-black text-xs font-bold transition-all shadow-md shadow-[#50E3C2]/20"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign Up Free</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
