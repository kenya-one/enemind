import React, { useState } from 'react';
import {
  Compass,
  Film,
  MapPin,
  ShoppingBag,
  GraduationCap,
  Building2,
  Home,
  UserCheck,
  FolderSync,
  Radio,
  Search,
  ChevronDown,
  Sparkles,
  Layers,
  Wrench,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp, ActivePage } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const { user, allUsers, switchUser, loginWithGoogle, logout, isFinanceOfficerMode, setFinanceOfficerMode } = useAuth();
  const { activePage, setActivePage, searchQuery, setSearchQuery, openDriveModal, openAuthModal, openLiveSession, products } = useApp();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  const liveProductsCount = products.filter((p) => p.isLiveSelling).length;

  const navItems: { id: ActivePage; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'home', label: 'Discover', icon: <Compass className="w-4 h-4" /> },
    { id: 'feed', label: 'Feed & Shorts', icon: <Film className="w-4 h-4 text-rose-500" />, badge: 'Live' },
    { id: 'findlocal', label: 'Findlocal', icon: <MapPin className="w-4 h-4 text-emerald-600" /> },
    { id: 'marketplace', label: 'Marketplace', icon: <ShoppingBag className="w-4 h-4 text-blue-600" /> },
    { id: 'schools', label: 'Schools & CBC', icon: <GraduationCap className="w-4 h-4 text-purple-600" /> },
    { id: 'companies', label: 'Companies', icon: <Building2 className="w-4 h-4 text-amber-600" /> },
    { id: 'landlords', label: 'Hostels & Rentals', icon: <Home className="w-4 h-4 text-teal-600" /> },
    { id: 'students', label: 'Student Hub', icon: <UserCheck className="w-4 h-4 text-indigo-600" /> },
    { id: 'services', label: 'Services', icon: <Wrench className="w-4 h-4 text-slate-700" /> }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              id="brand-logo-btn"
              onClick={() => setActivePage('home')}
              className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
            >
              <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-xs border border-slate-200 overflow-hidden group-hover:scale-105 transition-transform duration-200 p-1">
                <img
                  src="https://cdn.oreateai.com/agentskill/c33477c488d4b7613c1e591f/multimedia/84205c8a6ffcd3b761e91635.png"
                  alt="Enemind Kenya Logo"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xl tracking-tight text-slate-900 font-display">Enemind</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">KE</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium -mt-0.5">Marketplace & Discovery</p>
              </div>
            </button>
          </div>

          {/* Search Bar - Center Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="global-navbar-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search solar, building materials, hostels, jobs, notes..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-800 placeholder-slate-400 rounded-full border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Quick Actions & User Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Live Streams Badge */}
            {liveProductsCount > 0 && (
              <button
                id="live-streams-pill-btn"
                onClick={() => {
                  openLiveSession({
                    title: 'Live Solar & Equipment Demo — SunKing Kenya',
                    hostName: 'SunKing Solar Kenya',
                    youtubeUrl: 'https://www.youtube.com/watch?v=live_solar_demo_kenya',
                    productId: 'prod_solar_home_pro'
                  });
                }}
                className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold hover:bg-rose-100 transition shadow-xs animate-pulse cursor-pointer"
              >
                <Radio className="w-3.5 h-3.5 text-rose-600 animate-spin" style={{ animationDuration: '4s' }} />
                <span>Live Streams ({liveProductsCount})</span>
              </button>
            )}

            {/* Google Drive & Sheets Sync Button */}
            <button
              id="gdrive-sheets-sync-btn"
              onClick={openDriveModal}
              title="Google Drive Sheets Source of Truth & Supabase Cache"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition cursor-pointer"
            >
              <FolderSync className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Drive Sheets</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </button>

            {/* Role / Persona Selector Switcher */}
            <div className="relative">
              <button
                id="role-persona-switcher-btn"
                onClick={() => {
                  setShowRoleSwitcher(!showRoleSwitcher);
                  setShowUserMenu(false);
                }}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium shadow-xs cursor-pointer transition"
              >
                <Layers className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline capitalize font-semibold">
                  {user ? `${user.accountType} (${user.name.split(' ')[0]})` : 'Select Persona'}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {/* Role Dropdown */}
              {showRoleSwitcher && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3.5 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">Switch Account Persona</p>
                    <p className="text-[11px] text-slate-500">Simulate all 4 account tiers & stage features</p>
                  </div>
                  <div className="max-h-80 overflow-y-auto py-1">
                    {allUsers.map((u) => {
                      const isActive = user?.id === u.id;
                      return (
                        <button
                          key={u.id}
                          onClick={() => {
                            switchUser(u.id);
                            setShowRoleSwitcher(false);
                          }}
                          className={`w-full text-left px-3.5 py-2 flex items-center gap-3 hover:bg-slate-50 transition ${
                            isActive ? 'bg-blue-50/70 text-blue-900 font-semibold' : 'text-slate-700'
                          }`}
                        >
                          <img
                            src={u.avatarUrl}
                            alt={u.name}
                            className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs truncate font-medium">{u.name}</p>
                            <p className="text-[10px] text-slate-400 capitalize">
                              {u.accountType} {u.studentStage ? `• ${u.studentStage.replace('_', ' ')}` : ''}
                            </p>
                          </div>
                          {isActive && <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">Active</span>}
                        </button>
                      );
                    })}
                  </div>
                  <div className="p-2 border-t border-slate-100 bg-slate-50/50 flex flex-col gap-1.5">
                    <button
                      onClick={() => {
                        setShowRoleSwitcher(false);
                        openAuthModal('signup');
                      }}
                      className="w-full py-2 px-2 text-center text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition"
                    >
                      + Create New Account (Sign Up)
                    </button>
                    <button
                      onClick={() => {
                        setShowRoleSwitcher(false);
                        openAuthModal('login');
                      }}
                      className="w-full py-1.5 px-2 text-center text-xs font-medium text-slate-600 hover:text-slate-900 bg-white rounded-xl border border-slate-200 transition"
                    >
                      Sign In with Email / M-Pesa
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar / User Menu */}
            {user ? (
              <div className="relative">
                <button
                  id="user-profile-menu-btn"
                  onClick={() => {
                    setShowUserMenu(!showUserMenu);
                    setShowRoleSwitcher(false);
                  }}
                  className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-blue-400 transition cursor-pointer"
                >
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-blue-600/20"
                  />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in duration-150">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                          {user.accountType}
                        </span>
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {user.planTier}
                        </span>
                      </div>
                    </div>

                    <div className="py-1">
                      {user.accountType === 'school' && (
                        <button
                          onClick={() => {
                            setFinanceOfficerMode(!isFinanceOfficerMode);
                            setShowUserMenu(false);
                            setActivePage('schools');
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                          <span>{isFinanceOfficerMode ? 'Exit Finance Mode' : 'Switch to Finance Officer Mode'}</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setActivePage(
                            user.accountType === 'school'
                              ? 'schools'
                              : user.accountType === 'company' || user.accountType === 'dealer'
                              ? 'companies'
                              : user.accountType === 'landlord'
                              ? 'landlords'
                              : 'students'
                          );
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                        <span>Go to My Dashboard / Channel</span>
                      </button>

                      <button
                        onClick={() => {
                          openDriveModal();
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <FolderSync className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Inspect "Enemind Data" Sheets</span>
                      </button>
                    </div>

                    <div className="p-2 border-t border-slate-100 flex flex-col gap-1">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          openAuthModal('signup');
                        }}
                        className="w-full py-1.5 px-3 text-left text-xs text-emerald-700 hover:bg-emerald-50 rounded-lg transition font-medium"
                      >
                        + Switch or Create New Account
                      </button>
                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                        }}
                        className="w-full py-1.5 px-3 text-left text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition font-medium"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  id="navbar-login-btn"
                  onClick={() => openAuthModal('login')}
                  className="px-3.5 py-1.5 rounded-full text-slate-700 hover:bg-slate-100 text-xs font-semibold transition cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  id="navbar-signup-btn"
                  onClick={() => openAuthModal('signup')}
                  className="px-4 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-sm transition cursor-pointer"
                >
                  Join Free
                </button>
              </div>
            )}

          </div>
        </div>

        {/* Secondary Category & Tab Navigation Bar */}
        <nav className="flex items-center gap-1.5 overflow-x-auto py-2 no-scrollbar border-t border-slate-100/80">
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => setActivePage(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
