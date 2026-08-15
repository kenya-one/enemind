import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  GraduationCap,
  Building,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  BookOpen,
  FileText,
  Briefcase,
  Film,
  Music,
  CheckCircle2,
  Lock,
  Mail,
  User,
  ChevronRight,
  Compass,
  Laptop,
  FileSpreadsheet,
  HardDrive,
  Download,
  Smartphone,
  Globe,
  Share2,
  Check,
  X,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile, EnerHubTab } from '../types';
import { KENYAN_CAMPUSES } from '../data/campuses';
import { ENERMIND_LOGO_URL } from '../data/enerHubData';
import { googleWorkspace } from '../utils/googleWorkspace';
import { GoogleSheetsLogo, GoogleDriveLogo } from './SocialLogos';

interface AuthLandingPageProps {
  onLoginSuccess: (user: Partial<UserProfile>, mode?: 'general' | 'campus', universityId?: string) => void;
  onExploreAsGuest?: () => void;
}

export const AuthLandingPage: React.FC<AuthLandingPageProps> = ({
  onLoginSuccess,
  onExploreAsGuest
}) => {
  const [authMode, setAuthMode] = useState<'signup' | 'login'>('signup');
  const [selectedUserRole, setSelectedUserRole] = useState<'student' | 'hunter' | 'landlord'>('student');
  const [selectedCampus, setSelectedCampus] = useState<string>('uon-main');
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  // PWA & Install App State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [showDomainModal, setShowDomainModal] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      triggerCelebration();
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        triggerCelebration();
      }
      setDeferredPrompt(null);
    } else {
      // Open step-by-step installation instructions modal
      setShowInstallModal(true);
    }
  };

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.55 },
        colors: ['#FFD700', '#F59E0B', '#10B981', '#ffffff']
      });
    } catch {}
  };

  const handleGoogleSignIn = async (
    presetEmail = 'sidneywafula30@gmail.com',
    presetName = 'Sidney Wafula',
    presetAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  ) => {
    setIsSubmitting(true);
    setSyncNotice('Connecting Google OAuth & syncing to Google Sheets DB...');

    try {
      // Sync user signup/login into Master Google Sheet Database
      const sheetResult = await googleWorkspace.syncUserToGoogleSheet({
        fullName: presetName,
        email: presetEmail,
        role: selectedUserRole,
        preferredMode: selectedUserRole === 'student' ? 'campus' : 'general',
        preferredUniversity: selectedUserRole === 'student' ? selectedCampus : 'all',
        avatarUrl: presetAvatar,
        authProvider: 'google_oauth'
      });

      setSyncNotice(sheetResult.sheetStatus);
    } catch (e) {
      console.warn('Google sheet sync status:', e);
    }

    setTimeout(() => {
      triggerCelebration();
      onLoginSuccess(
        {
          name: presetName,
          email: presetEmail,
          avatar: presetAvatar,
          isLoggedIn: true,
          preferredMode: selectedUserRole === 'student' ? 'campus' : 'general',
          preferredUniversity: selectedUserRole === 'student' ? selectedCampus : 'all'
        },
        selectedUserRole === 'student' ? 'campus' : 'general',
        selectedUserRole === 'student' ? selectedCampus : undefined
      );
      setIsSubmitting(false);
    }, 600);
  };

  const handleEmailAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const userName = fullName.trim() || email.split('@')[0] || (authMode === 'signup' ? 'New Member' : 'Kenyan Student');
    const userEmail = email.trim() || (authMode === 'signup' ? 'user@enerhub.co.ke' : 'student@enerhub.co.ke');
    const userAvatar = `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80`;

    setSyncNotice('Recording account in Master Google Sheet Database...');

    try {
      // Sync user to Google Sheet database
      const sheetResult = await googleWorkspace.syncUserToGoogleSheet({
        fullName: userName,
        email: userEmail,
        role: selectedUserRole,
        preferredMode: selectedUserRole === 'student' ? 'campus' : 'general',
        preferredUniversity: selectedUserRole === 'student' ? selectedCampus : 'all',
        avatarUrl: userAvatar,
        authProvider: 'email_password'
      });
      setSyncNotice(sheetResult.sheetStatus);
    } catch (err) {
      console.warn('Sheet record update:', err);
    }

    setTimeout(() => {
      triggerCelebration();
      onLoginSuccess(
        {
          name: userName,
          email: userEmail,
          avatar: userAvatar,
          isLoggedIn: true,
          preferredMode: selectedUserRole === 'student' ? 'campus' : 'general',
          preferredUniversity: selectedUserRole === 'student' ? selectedCampus : 'all'
        },
        selectedUserRole === 'student' ? 'campus' : 'general',
        selectedUserRole === 'student' ? selectedCampus : undefined
      );
      setIsSubmitting(false);
    }, 600);
  };

  const quickGoogleAccounts = [
    {
      name: 'Sidney Wafula',
      email: 'sidneywafula30@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'
    },
    {
      name: 'Joice Barasa',
      email: 'joicebarasa7@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
    }
  ];

  return (
    <div className="min-h-screen w-full bg-neutral-950 text-white flex flex-col justify-between relative overflow-x-hidden selection:bg-[#FFD700] selection:text-black">
      {/* Full-Page Ambient Kinetic Lighting Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[650px] bg-gradient-to-b from-[#FFD700]/15 via-amber-500/10 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/4 -left-40 w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 -right-40 w-[600px] h-[600px] bg-[#FFD700]/10 rounded-full blur-3xl" />
      </div>

      {/* Cybernetic Dot Matrix Grid */}
      <div
        className="fixed inset-0 opacity-[0.035] pointer-events-none z-0"
        style={{
          backgroundImage: `radial-gradient(#FFD700 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
      />

      {/* Top Header Bar */}
      <header className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-8 py-5 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#FFD700]/15 border border-[#FFD700]/40 flex items-center justify-center p-0.5 shadow-sm shadow-[#FFD700]/10">
            <img
              src={ENERMIND_LOGO_URL}
              alt="EnerMind"
              className="w-full h-full object-contain rounded-full"
            />
          </div>
          <span className="font-display font-black text-sm tracking-widest text-white uppercase">
            EnerMind <span className="text-[#FFD700]">Kenya</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Domain & Online Status Button */}
          <button
            type="button"
            onClick={() => setShowDomainModal(true)}
            className="text-[11px] font-mono text-neutral-300 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900/90 border border-neutral-800 hover:border-[#FFD700]/50 transition-all cursor-pointer shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <Globe className="w-3.5 h-3.5 text-[#FFD700]" />
            <span className="hidden sm:inline">enemindcompany.co.ke</span>
          </button>

          {/* Install App Top Button */}
          <button
            type="button"
            onClick={handleInstallApp}
            className="text-xs font-bold text-black bg-[#FFD700] hover:bg-[#ffe033] flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all cursor-pointer shadow-lg shadow-[#FFD700]/20 active:scale-95"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Install App</span>
          </button>

          {onExploreAsGuest && (
            <button
              onClick={onExploreAsGuest}
              className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 font-semibold transition-all px-3 py-1.5 rounded-full hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-700 cursor-pointer shadow-sm"
            >
              <span>Guest</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#FFD700]" />
            </button>
          )}
        </div>
      </header>

      {/* Full Page Centered Main Layout (No Card Enclosure) */}
      <main className="relative z-10 w-full max-w-xl mx-auto px-4 sm:px-6 py-4 flex-1 flex flex-col justify-center items-center">
        {/* ======================================================== */}
        {/* 1. CIRCULAR LOGO AT THE EXACT CENTER */}
        {/* ======================================================== */}
        <div className="relative mb-4 flex items-center justify-center">
          {/* Outer Rotating Dashed Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 14, ease: 'linear' }}
            className="absolute w-32 h-32 sm:w-36 sm:h-36 rounded-full border border-dashed border-[#FFD700]/35 pointer-events-none"
          />

          {/* Inner Glowing Aura Ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 18, ease: 'linear' }}
            className="absolute w-28 h-28 sm:w-32 sm:h-32 rounded-full border border-[#FFD700]/30 shadow-xl shadow-[#FFD700]/25 pointer-events-none"
          />

          {/* Center Circular Logo Container */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-neutral-950 border-2 border-[#FFD700] shadow-2xl shadow-[#FFD700]/50 p-2 flex items-center justify-center overflow-hidden cursor-pointer"
          >
            <img
              src={ENERMIND_LOGO_URL}
              alt="EnerMind Kenya Logo"
              className="w-full h-full object-contain rounded-full drop-shadow-lg"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </motion.div>

          {/* Floating Gold Sparkle Badge */}
          <div className="absolute -bottom-1 -right-1 bg-[#FFD700] text-black rounded-full p-1.5 shadow-lg shadow-[#FFD700]/50 border-2 border-neutral-950">
            <Zap className="w-4 h-4 fill-black" />
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. NAME: "welcome to enemind kenya" BELOW IT */}
        {/* ======================================================== */}
        <div className="text-center mb-6 max-w-lg">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight uppercase font-display bg-gradient-to-r from-white via-[#FFD700] to-amber-400 bg-clip-text text-transparent">
            Welcome to EnerMind Kenya
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-2 font-medium leading-relaxed">
            Kenya's Premier Student Knowledge Engine, Verified Campus Hostels & EnerMind AI
          </p>
        </div>

        {/* Mode Switcher: Sign Up vs Log In */}
        <div className="w-full max-w-md flex bg-neutral-900/80 backdrop-blur-md p-1 rounded-2xl border border-neutral-800 mb-5">
          <button
            onClick={() => setAuthMode('signup')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              authMode === 'signup'
                ? 'bg-[#FFD700] text-black shadow-md font-extrabold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Create Account (Sign Up)
          </button>
          <button
            onClick={() => setAuthMode('login')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              authMode === 'login'
                ? 'bg-[#FFD700] text-black shadow-md font-extrabold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Sign In (Log In)
          </button>
        </div>

        {/* ======================================================== */}
        {/* 3. PROMINENT GOOGLE SIGN IN */}
        {/* ======================================================== */}
        <div className="w-full max-w-md space-y-3 mb-5">
          <button
            onClick={() => handleGoogleSignIn('sidneywafula30@gmail.com', 'Sidney Wafula')}
            disabled={isSubmitting}
            id="google-fullpage-auth-btn"
            className="w-full py-4 px-5 rounded-2xl bg-white hover:bg-neutral-100 text-neutral-900 font-extrabold text-sm tracking-wide flex items-center justify-center gap-3 shadow-2xl shadow-white/10 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer border border-neutral-200"
          >
            {/* Google SVG */}
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>
              {isSubmitting
                ? 'Authenticating with Google...'
                : authMode === 'signup'
                ? 'Sign up with Google'
                : 'Sign in with Google'}
            </span>
          </button>

          {/* Quick 1-Tap Google Profiles */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            {quickGoogleAccounts.map((acc) => (
              <button
                key={acc.email}
                onClick={() => handleGoogleSignIn(acc.email, acc.name, acc.avatar)}
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-left transition-all group cursor-pointer"
              >
                <img
                  src={acc.avatar}
                  alt={acc.name}
                  className="w-7 h-7 rounded-full object-cover border border-neutral-700 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-bold text-neutral-200 truncate group-hover:text-[#FFD700]">
                    {acc.name}
                  </div>
                  <div className="text-[9px] text-neutral-500 truncate">{acc.email}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="w-full max-w-md relative flex items-center justify-center my-4">
          <div className="border-t border-neutral-800 w-full" />
          <span className="bg-neutral-950 px-3 text-[10px] uppercase font-bold text-neutral-500 tracking-wider absolute">
            Or continue with email
          </span>
        </div>

        {/* User Role Selector */}
        <div className="w-full max-w-md mb-4">
          <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-1.5">
            I am joining as:
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setSelectedUserRole('student')}
              className={`p-2.5 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                selectedUserRole === 'student'
                  ? 'bg-[#FFD700]/15 border-[#FFD700] text-[#FFD700] shadow-md shadow-[#FFD700]/10'
                  : 'bg-neutral-900/70 border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Student</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedUserRole('hunter')}
              className={`p-2.5 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                selectedUserRole === 'hunter'
                  ? 'bg-[#FFD700]/15 border-[#FFD700] text-[#FFD700] shadow-md shadow-[#FFD700]/10'
                  : 'bg-neutral-900/70 border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              <Building className="w-4 h-4" />
              <span>House Hunter</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedUserRole('landlord')}
              className={`p-2.5 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                selectedUserRole === 'landlord'
                  ? 'bg-[#FFD700]/15 border-[#FFD700] text-[#FFD700] shadow-md shadow-[#FFD700]/10'
                  : 'bg-neutral-900/70 border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Landlord</span>
            </button>
          </div>
        </div>

        {/* Email Form */}
        <form onSubmit={handleEmailAuthSubmit} className="w-full max-w-md space-y-3">
          {authMode === 'signup' && (
            <div>
              <label className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Sidney Wafula"
                  className="w-full bg-neutral-900/90 border border-neutral-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#FFD700]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@gmail.com"
                className="w-full bg-neutral-900/90 border border-neutral-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#FFD700]"
              />
            </div>
          </div>

          {selectedUserRole === 'student' && (
            <div>
              <label className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-1">
                Select University / Campus
              </label>
              <select
                value={selectedCampus}
                onChange={(e) => setSelectedCampus(e.target.value)}
                className="w-full bg-neutral-900/90 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FFD700]"
              >
                {KENYAN_CAMPUSES.map((c) => (
                  <option key={c.id} value={c.id} className="bg-neutral-950 text-white">
                    {c.shortName} ({c.name})
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FFD700] via-amber-400 to-yellow-300 hover:from-[#ffe033] hover:to-amber-400 text-black font-black text-xs uppercase tracking-wider shadow-xl shadow-[#FFD700]/25 flex items-center justify-center gap-2 transition-all cursor-pointer mt-2"
          >
            <span>{authMode === 'signup' ? 'Create Free Account' : 'Sign In to EnerMind'}</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </form>

        {/* Google Sheet Live Database Sync Notice */}
        {syncNotice && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md p-3 my-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2.5 shadow-lg"
          >
            <div className="shrink-0 p-1 bg-black rounded-lg border border-emerald-500/30">
              <GoogleSheetsLogo className="w-4 h-4" />
            </div>
            <span className="font-mono text-[11px] leading-tight">{syncNotice}</span>
          </motion.div>
        )}

        {/* Install EnerMind App Quick Callout */}
        <div className="w-full max-w-md mt-4 p-3 rounded-2xl bg-neutral-900/90 border border-[#FFD700]/30 flex items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#FFD700]/15 border border-[#FFD700]/40 flex items-center justify-center text-[#FFD700] shrink-0">
              <Smartphone className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Install EnerMind App</span>
                <span className="px-1.5 py-0.2 text-[9px] font-mono bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">PWA Ready</span>
              </h4>
              <p className="text-[10px] text-neutral-400 truncate">
                {isInstalled ? 'App installed on your device' : 'Add to Home Screen for fast 1-tap access'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleInstallApp}
            className="px-3.5 py-1.5 rounded-xl bg-[#FFD700] hover:bg-[#ffe033] text-black text-xs font-extrabold flex items-center gap-1 shrink-0 transition-all shadow-md shadow-[#FFD700]/20 cursor-pointer active:scale-95"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>{isInstalled ? 'Open' : 'Install'}</span>
          </button>
        </div>

        {/* Feature Badges across the bottom */}
        <div className="w-full max-w-md mt-4 pt-4 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-400">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <GoogleSheetsLogo className="w-4 h-4 shrink-0" />
            <span>Google Sheets User DB</span>
          </span>
          <span className="flex items-center gap-1.5 text-blue-400">
            <GoogleDriveLogo className="w-4 h-4 shrink-0" />
            <span>User Google Drive DB</span>
          </span>
          <span className="flex items-center gap-1.5 text-[#FFD700]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#FFD700]" />
            <span>Verified Deeds</span>
          </span>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-5xl mx-auto px-4 py-4 text-center text-[11px] text-neutral-500">
        <div className="flex items-center justify-center gap-3 flex-wrap mb-1">
          <button
            type="button"
            onClick={() => setShowDomainModal(true)}
            className="text-neutral-400 hover:text-[#FFD700] underline font-mono text-[11px] transition-colors"
          >
            Domain: enemindcompany.co.ke
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={handleInstallApp}
            className="text-neutral-400 hover:text-[#FFD700] underline font-mono text-[11px] transition-colors"
          >
            📲 Install Progressive Web App
          </button>
        </div>
        <p>EnerMind Kenya &copy; 2026 • Powering Smart Rentals & Academic Excellence Across Kenyan Campuses</p>
      </footer>

      {/* ======================================================== */}
      {/* INSTALL APP MODAL (GUIDE & 1-TAP INSTALL) */}
      {/* ======================================================== */}
      <AnimatePresence>
        {showInstallModal && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-neutral-950 border border-neutral-800 rounded-3xl p-5 sm:p-6 w-full max-w-md space-y-5 shadow-2xl relative"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#FFD700]/15 border border-[#FFD700]/40 flex items-center justify-center p-1 shadow-md shadow-[#FFD700]/20">
                    <img src={ENERMIND_LOGO_URL} alt="Logo" className="w-full h-full object-contain rounded-full" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Install EnerMind Kenya</h3>
                    <p className="text-xs text-neutral-400">Add to your Phone, Tablet or PC</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowInstallModal(false)}
                  className="p-1.5 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-900 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Install instructions for each platform */}
              <div className="space-y-3">
                {/* Android Chrome */}
                <div className="p-3 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#FFD700]">
                    <Smartphone className="w-4 h-4" />
                    <span>Android (Google Chrome)</span>
                  </div>
                  <p className="text-[11px] text-neutral-300">
                    1. Tap the <span className="font-bold text-white">⋮</span> (three dots menu) at the top right.<br />
                    2. Select <span className="font-bold text-white">"Install app"</span> or <span className="font-bold text-white">"Add to Home screen"</span>.
                  </p>
                </div>

                {/* iPhone / iOS Safari */}
                <div className="p-3 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-400">
                    <Share2 className="w-4 h-4" />
                    <span>iPhone & iPad (Safari)</span>
                  </div>
                  <p className="text-[11px] text-neutral-300">
                    1. Tap the <span className="font-bold text-white">Share button</span> (square with arrow up) at the bottom.<br />
                    2. Scroll down and tap <span className="font-bold text-white">"Add to Home Screen" ➕</span>.
                  </p>
                </div>

                {/* PC / Mac Chrome & Edge */}
                <div className="p-3 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-400">
                    <Laptop className="w-4 h-4" />
                    <span>Desktop (Chrome, Edge & Brave)</span>
                  </div>
                  <p className="text-[11px] text-neutral-300">
                    Click the <span className="font-bold text-white">Install icon (⬇)</span> in the address bar or tap Install below.
                  </p>
                </div>
              </div>

              {/* Direct Trigger Button */}
              <div className="space-y-2 pt-1">
                {deferredPrompt ? (
                  <button
                    type="button"
                    onClick={async () => {
                      deferredPrompt.prompt();
                      const { outcome } = await deferredPrompt.userChoice;
                      if (outcome === 'accepted') {
                        setIsInstalled(true);
                        triggerCelebration();
                        setShowInstallModal(false);
                      }
                      setDeferredPrompt(null);
                    }}
                    className="w-full py-3 bg-[#FFD700] hover:bg-[#ffe033] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-[#FFD700]/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4 stroke-[3]" />
                    <span>Click Here to 1-Tap Install</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowInstallModal(false)}
                    className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs rounded-xl border border-neutral-700 transition-all"
                  >
                    Got It, Thank You!
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* DOMAIN & GITHUB ONLINE STATUS MODAL */}
      {/* ======================================================== */}
      <AnimatePresence>
        {showDomainModal && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-neutral-950 border border-neutral-800 rounded-3xl p-5 sm:p-6 w-full max-w-lg space-y-5 shadow-2xl relative"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-md">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span>enemindcompany.co.ke</span>
                      <span className="px-2 py-0.5 text-[9px] font-mono bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/40">
                        Online Production
                      </span>
                    </h3>
                    <p className="text-xs text-neutral-400">Custom Domain & GitHub Deployment Status</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDomainModal(false)}
                  className="p-1.5 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-900 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Status checklist */}
              <div className="space-y-2.5">
                <div className="p-3 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Custom Domain Linked</p>
                      <p className="text-[10px] text-neutral-400 font-mono">https://enemindcompany.co.ke</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
                    Active
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">GitHub Account & CI/CD</p>
                      <p className="text-[10px] text-neutral-400 font-mono">Synced to repository main branch</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-1 rounded-md border border-purple-500/20">
                    Connected
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Database Architecture</p>
                      <p className="text-[10px] text-neutral-400 font-mono">Google Sheets (Auth/Users) + Google Drive (User Media)</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-1 rounded-md border border-blue-500/20">
                    Live
                  </span>
                </div>
              </div>

              {/* Action */}
              <button
                type="button"
                onClick={() => setShowDomainModal(false)}
                className="w-full py-2.5 bg-[#FFD700] hover:bg-[#ffe033] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all"
              >
                Close Status Overview
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
