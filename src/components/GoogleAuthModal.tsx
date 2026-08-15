import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  User,
  Heart,
  Bookmark,
  Calendar,
  LogOut,
  ShieldCheck,
  CheckCircle2,
  Building,
  GraduationCap,
  Sparkles,
  Search,
  Check,
  MapPin,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  RefreshCw,
  Mail,
  Zap,
  SlidersHorizontal,
  Compass,
  Phone,
  BookOpen,
  FileText,
  Clock,
  Briefcase,
  FileSpreadsheet,
  HardDrive
} from 'lucide-react';
import { UserProfile, RentalListing, EnerHubTab } from '../types';
import { KENYAN_CAMPUSES, CampusMetadata } from '../data/campuses';
import { ENERMIND_LOGO_URL } from '../data/enerHubData';
import { googleWorkspace } from '../utils/googleWorkspace';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  listings: RentalListing[];
  currentMode: 'general' | 'campus';
  selectedUniversity?: string;
  onLogin: (user: Partial<UserProfile>) => void;
  onLogout: () => void;
  onSelectListing: (listingId: string) => void;
  onSelectMode: (mode: 'general' | 'campus', universityId?: string) => void;
  onOpenEnerHub?: (tab?: EnerHubTab) => void;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  listings,
  currentMode,
  selectedUniversity = 'all',
  onLogin,
  onLogout,
  onSelectListing,
  onSelectMode,
  onOpenEnerHub
}) => {
  const [modalStep, setModalStep] = useState<'signin' | 'mode_select' | 'campus_select' | 'profile'>(() => {
    return currentUser.isLoggedIn ? 'profile' : 'signin';
  });

  const [activeProfileTab, setActiveProfileTab] = useState<'overview' | 'saved' | 'tours' | 'activity'>('overview');
  const [customEmail, setCustomEmail] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [campusSearchQuery, setCampusSearchQuery] = useState('');
  const [selectedCampusRegion, setSelectedCampusRegion] = useState('all');

  // If user state changes to logged out, reset to signin
  React.useEffect(() => {
    if (!currentUser.isLoggedIn) {
      setModalStep('signin');
    } else {
      setModalStep('profile');
    }
  }, [currentUser.isLoggedIn]);

  const regionTabs = useMemo(
    () => [
      { id: 'all', label: 'All Regions' },
      { id: 'Nairobi', label: 'Nairobi & Metro' },
      { id: 'Kiambu & Central', label: 'Kiambu & Central' },
      { id: 'Rift Valley', label: 'Rift Valley' },
      { id: 'Western & Nyanza', label: 'Western & Nyanza' },
      { id: 'Coast', label: 'Coast / Mombasa' },
      { id: 'Eastern & Mt. Kenya', label: 'Mt. Kenya & Eastern' }
    ],
    []
  );

  const filteredCampuses = useMemo(() => {
    return KENYAN_CAMPUSES.filter((campus) => {
      const q = campusSearchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        campus.name.toLowerCase().includes(q) ||
        campus.shortName.toLowerCase().includes(q) ||
        campus.acronym.toLowerCase().includes(q) ||
        campus.location.toLowerCase().includes(q) ||
        campus.county.toLowerCase().includes(q) ||
        campus.region.toLowerCase().includes(q) ||
        campus.studentHubs.some((hub) => hub.toLowerCase().includes(q)) ||
        campus.mainGates.some((gate) => gate.toLowerCase().includes(q));

      const matchesRegion =
        selectedCampusRegion === 'all' ||
        campus.region === selectedCampusRegion ||
        campus.county.toLowerCase().includes(selectedCampusRegion.toLowerCase());

      return matchesSearch && matchesRegion;
    });
  }, [campusSearchQuery, selectedCampusRegion]);

  if (!isOpen) return null;

  const handleGoogleSignIn = async (email = 'sidneywafula30@gmail.com', name = 'Sidney Wafula') => {
    setIsSigningIn(true);
    try {
      await googleWorkspace.syncUserToGoogleSheet({
        fullName: name,
        email,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        authProvider: 'google_oauth'
      });
    } catch (e) {
      console.warn('GoogleAuthModal sheets sync notice:', e);
    }

    setTimeout(() => {
      onLogin({
        name,
        email,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        isLoggedIn: true
      });
      setIsSigningIn(false);
      setModalStep('mode_select');
    }, 500);
  };

  const handlePickUniversity = (uniId: string) => {
    onSelectMode('campus', uniId);
    onClose();
  };

  const savedListings = listings.filter((l) => currentUser.savedListingIds.includes(l.id));
  const likedListings = listings.filter((l) => currentUser.likedListingIds.includes(l.id));
  const activeCampusData = KENYAN_CAMPUSES.find((c) => c.id === selectedUniversity);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/90 backdrop-blur-xl animate-in fade-in">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="relative w-full max-w-2xl bg-neutral-950 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-neutral-100 max-h-[92vh]"
        >
          {/* Top Glass Header Bar */}
          <div className="p-4 sm:p-5 border-b border-neutral-800/80 bg-neutral-900/80 backdrop-blur-xl flex items-center justify-between z-10 shrink-0">
            <div className="flex items-center gap-3">
              {modalStep === 'campus_select' ? (
                <button
                  onClick={() => setModalStep('mode_select')}
                  className="p-2 rounded-full hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                  title="Back to Mode Selection"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              ) : modalStep === 'mode_select' && currentUser.isLoggedIn ? (
                <button
                  onClick={() => setModalStep('profile')}
                  className="p-2 rounded-full hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                  title="Back to Profile"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              ) : (
                /* Circular EnerMind Logo in Header */
                <div className="w-10 h-10 rounded-full bg-neutral-950 border-2 border-[#FFD700] p-1 flex items-center justify-center shadow-md shadow-[#FFD700]/20 shrink-0 overflow-hidden relative">
                  <img
                    src={ENERMIND_LOGO_URL}
                    alt="EnerMind"
                    className="w-full h-full object-contain rounded-full"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#FFD700] rounded-full border border-black flex items-center justify-center">
                    <Zap className="w-1.5 h-1.5 text-black fill-black" />
                  </span>
                </div>
              )}

              <div>
                <h3 className="font-black text-base sm:text-lg text-white font-display tracking-tight flex items-center gap-1.5">
                  {modalStep === 'signin' && 'Sign in to EnerMind Kenya'}
                  {modalStep === 'mode_select' && 'Select Your Hunting Mode'}
                  {modalStep === 'campus_select' && 'Select Campus / University'}
                  {modalStep === 'profile' && 'Kenyan Student & Hunter Profile'}
                </h3>
                <p className="text-[11px] text-neutral-400 font-medium">
                  {modalStep === 'signin' && 'Google OAuth & Verified Tenant Profile'}
                  {modalStep === 'mode_select' && 'Kenya General Mode vs. Campus Student Mode'}
                  {modalStep === 'campus_select' && 'Filter student hostels & bedsitters by your university'}
                  {modalStep === 'profile' && 'Verified Identity • Shortlists • Viewing Passes'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              id="close-google-auth-modal-btn"
              className="p-2 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-all cursor-pointer border border-neutral-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Body Container */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 bg-neutral-950 scrollbar-thin">
            {/* ========================================================================= */}
            {/* STEP 1: SIGN IN SCREEN */}
            {/* ========================================================================= */}
            {modalStep === 'signin' && (
              <div className="text-center py-2 space-y-4 max-w-md mx-auto">
                {/* Circular EnerMind Logo in Center */}
                <div className="relative mx-auto flex items-center justify-center my-2">
                  <div className="absolute w-28 h-28 rounded-full bg-[#FFD700]/15 blur-lg animate-pulse" />
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-neutral-950 border-2 border-[#FFD700] shadow-2xl shadow-[#FFD700]/30 p-1.5 flex items-center justify-center overflow-hidden">
                    <img
                      src={ENERMIND_LOGO_URL}
                      alt="EnerMind Kenya"
                      className="w-full h-full object-contain rounded-full drop-shadow-md"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-[#FFD700] text-black rounded-full p-1.5 shadow-md border-2 border-neutral-950">
                    <Zap className="w-3.5 h-3.5 fill-black" />
                  </div>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-black uppercase font-display bg-gradient-to-r from-white via-[#FFD700] to-amber-400 bg-clip-text text-transparent">
                    Welcome to EnerMind Kenya
                  </h3>
                  <p className="text-xs text-neutral-300 mt-1 max-w-sm mx-auto leading-relaxed">
                    Kenya's Premier Student Knowledge Hub, Campus Hostels & EnerMind AI
                  </p>
                </div>

                {/* Primary Google Sign In Button */}
                <button
                  onClick={() => handleGoogleSignIn('sidneywafula30@gmail.com', 'Sidney Wafula')}
                  disabled={isSigningIn}
                  id="sign-in-google-primary-btn"
                  className="w-full py-4 px-4 rounded-2xl bg-white hover:bg-neutral-100 text-neutral-900 font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer border border-neutral-200"
                >
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
                  <span>{isSigningIn ? 'Authenticating with Google...' : 'Sign in with Google'}</span>
                </button>

                {/* Quick 1-Tap Profiles */}
                <div className="grid grid-cols-2 gap-2 text-left pt-1">
                  <button
                    onClick={() => handleGoogleSignIn('sidneywafula30@gmail.com', 'Sidney Wafula')}
                    className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80"
                      alt="Sidney"
                      className="w-7 h-7 rounded-full object-cover border border-neutral-700"
                    />
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-white truncate">Sidney Wafula</p>
                      <p className="text-[9px] text-neutral-500 truncate">sidneywafula30@gmail.com</p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleGoogleSignIn('joicebarasa7@gmail.com', 'Joice Barasa')}
                    className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                      alt="Joice"
                      className="w-7 h-7 rounded-full object-cover border border-neutral-700"
                    />
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-white truncate">Joice Barasa</p>
                      <p className="text-[9px] text-neutral-500 truncate">joicebarasa7@gmail.com</p>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* STEP 2: MODE SELECTION (Kenya General vs Campus Mode) */}
            {/* ========================================================================= */}
            {modalStep === 'mode_select' && (
              <div className="space-y-4">
                <div className="text-center max-w-md mx-auto">
                  <h4 className="text-lg font-black text-white font-display uppercase tracking-wide">
                    Choose Your Hunting Experience
                  </h4>
                  <p className="text-xs text-neutral-400 mt-1">
                    You can switch modes anytime with the top navigation circles.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Mode Card 1: Kenya General Mode */}
                  <div
                    onClick={() => {
                      onSelectMode('general');
                      onClose();
                    }}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between group ${
                      currentMode === 'general'
                        ? 'bg-neutral-900 border-[#FFD700] ring-1 ring-[#FFD700] shadow-xl shadow-[#FFD700]/10'
                        : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      {/* Circular Kenya Flag */}
                      <div className="w-12 h-12 rounded-full border-2 border-white/20 p-0.5 overflow-hidden shadow-lg">
                        <svg viewBox="0 0 60 40" className="w-full h-full object-cover rounded-full">
                          <rect width="60" height="13.3" fill="#000000" />
                          <rect y="12" width="60" height="2" fill="#ffffff" />
                          <rect y="13.3" width="60" height="13.4" fill="#BB0000" />
                          <rect y="26" width="60" height="2" fill="#ffffff" />
                          <rect y="26.7" width="60" height="13.3" fill="#006600" />
                          <path
                            d="M30,8 C26,8 25,13 25,20 C25,27 26,32 30,32 C34,32 35,27 35,20 C35,13 34,8 30,8 Z"
                            fill="#BB0000"
                            stroke="#ffffff"
                            strokeWidth="1"
                          />
                        </svg>
                      </div>
                      {currentMode === 'general' && (
                        <span className="w-6 h-6 rounded-full bg-[#FFD700] text-black flex items-center justify-center font-bold text-xs">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <div className="mt-4">
                      <h5 className="font-bold text-white text-sm group-hover:text-[#FFD700] transition-colors">
                        Kenya General Mode
                      </h5>
                      <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                        Explore apartments, 1BRs, studios, luxury suites, and family houses in Kilimani, Westlands, Ruaka, and across Kenya.
                      </p>
                    </div>
                  </div>

                  {/* Mode Card 2: Campus Student Mode */}
                  <div
                    onClick={() => setModalStep('campus_select')}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between group ${
                      currentMode === 'campus'
                        ? 'bg-neutral-900 border-[#FFD700] ring-1 ring-[#FFD700] shadow-xl shadow-[#FFD700]/10'
                        : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      {/* Circular Campus Graduation Logo */}
                      <div className="w-12 h-12 rounded-full border-2 border-[#FFD700] bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center shadow-lg">
                        <GraduationCap className="w-6 h-6 text-white" />
                      </div>
                      {currentMode === 'campus' && (
                        <span className="w-6 h-6 rounded-full bg-[#FFD700] text-black flex items-center justify-center font-bold text-xs">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <div className="mt-4">
                      <h5 className="font-bold text-white text-sm group-hover:text-[#FFD700] transition-colors">
                        Campus Student Mode
                      </h5>
                      <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                        Find verified bedsitters, student hostels, roommates, notes, past papers, and walking distance rentals near your university.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* STEP 3: CAMPUS / UNIVERSITY PICKER */}
            {/* ========================================================================= */}
            {modalStep === 'campus_select' && (
              <div className="space-y-3.5">
                <div className="relative">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={campusSearchQuery}
                    onChange={(e) => setCampusSearchQuery(e.target.value)}
                    placeholder="Search university name, acronym (UoN, KU, JKUAT)..."
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#FFD700]"
                  />
                </div>

                {/* Campus Selection Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[48vh] overflow-y-auto pr-1">
                  <div
                    onClick={() => handlePickUniversity('all')}
                    className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                      selectedUniversity === 'all' && currentMode === 'campus'
                        ? 'bg-neutral-900 border-[#FFD700] ring-1 ring-[#FFD700]'
                        : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-[#FFD700] text-black flex items-center justify-center font-black text-xs">
                        ALL
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-white">All Kenya Campuses</h5>
                        <p className="text-[10px] text-neutral-400">Countrywide student housing feed</p>
                      </div>
                    </div>
                    {selectedUniversity === 'all' && currentMode === 'campus' && (
                      <Check className="w-4 h-4 text-[#FFD700]" />
                    )}
                  </div>

                  {filteredCampuses.map((campus) => {
                    const isSelected = selectedUniversity === campus.id && currentMode === 'campus';
                    return (
                      <div
                        key={campus.id}
                        onClick={() => handlePickUniversity(campus.id)}
                        className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-neutral-900 border-[#FFD700] ring-1 ring-[#FFD700]'
                            : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {/* Circular Acronym Emblem */}
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white shadow border border-white/20 relative overflow-hidden shrink-0"
                            style={{
                              background: `linear-gradient(135deg, ${campus.primaryColor}, ${campus.secondaryColor})`
                            }}
                          >
                            <span className="font-black text-[10px] font-mono">
                              {campus.acronym.slice(0, 4)}
                            </span>
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-xs font-bold text-[#FFD700]">
                                {campus.acronym}
                              </span>
                              <span className="text-[10px] text-neutral-400 truncate">• {campus.county}</span>
                            </div>
                            <h5 className="text-xs text-white font-medium truncate">
                              {campus.name}
                            </h5>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-[#FFD700] text-black flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* STEP 4: SIGNED-IN PROFILE DASHBOARD & SHORTLISTS */}
            {/* ========================================================================= */}
            {modalStep === 'profile' && currentUser.isLoggedIn && (
              <div className="space-y-4">
                {/* Hero User Profile Card */}
                <div className="relative overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-900 to-amber-950/30 border border-neutral-800 rounded-3xl p-5 shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {/* Circular User Avatar with Gold Double-Ring */}
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-[#FFD700] p-1 bg-neutral-950 shadow-xl overflow-hidden shrink-0">
                        <img
                          src={currentUser.avatar}
                          alt={currentUser.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                        <span className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-2 border-neutral-950 flex items-center justify-center shadow">
                          <Check className="w-3 h-3 text-black stroke-[3]" />
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-black text-lg sm:text-xl text-white font-display">
                            {currentUser.name}
                          </h4>
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/40">
                            Verified Member
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400 flex items-center gap-1.5 mt-0.5 font-medium">
                          <Mail className="w-3.5 h-3.5 text-[#FFD700]" />
                          <span>{currentUser.email}</span>
                        </p>
                        <p className="text-[11px] text-neutral-400 mt-1 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
                          <span>Verified Kenyan Student & Tenant Pass #EM-{Date.now().toString().slice(-5)}</span>
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onLogout();
                        setModalStep('signin');
                      }}
                      className="self-start sm:self-center px-3.5 py-2 rounded-xl bg-neutral-800/80 hover:bg-red-500/20 text-neutral-300 hover:text-red-400 transition-all border border-neutral-700 hover:border-red-500/50 flex items-center gap-2 text-xs font-bold cursor-pointer"
                      title="Sign Out"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>

                {/* Active Mode Quick Switcher Card */}
                <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Circular Mode Indicator */}
                    <div className="w-10 h-10 rounded-full border border-[#FFD700]/60 bg-neutral-950 p-1 flex items-center justify-center shadow-md">
                      {currentMode === 'campus' ? (
                        <GraduationCap className="w-5 h-5 text-[#FFD700]" />
                      ) : (
                        <Building className="w-5 h-5 text-[#FFD700]" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-black uppercase text-white tracking-wider">
                        {currentMode === 'campus' ? 'Campus Student Mode' : 'Kenya General Mode'}
                      </div>
                      <div className="text-[11px] text-neutral-400">
                        {currentMode === 'campus'
                          ? activeCampusData
                            ? `${activeCampusData.name} (${activeCampusData.acronym})`
                            : 'All Kenyan Universities'
                          : 'Countrywide Luxury & Residential Rentals'}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setModalStep('mode_select')}
                    className="px-3 py-1.5 bg-[#FFD700] hover:bg-amber-400 text-black text-xs font-black rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Change</span>
                  </button>
                </div>

                {/* Profile Navigation Tabs */}
                <div className="flex border-b border-neutral-800 gap-2 pt-1">
                  {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'saved', label: `Saved (${savedListings.length})` },
                    { id: 'tours', label: `Tours (${currentUser.bookedTours.length})` },
                    { id: 'activity', label: `Liked (${likedListings.length})` }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveProfileTab(tab.id as any)}
                      className={`pb-2.5 text-xs font-extrabold uppercase tracking-wider px-3 transition-colors border-b-2 cursor-pointer ${
                        activeProfileTab === tab.id
                          ? 'border-[#FFD700] text-[#FFD700]'
                          : 'border-transparent text-neutral-400 hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab: Overview */}
                {activeProfileTab === 'overview' && (
                  <div className="space-y-3.5">
                    {/* Stats Metrics 3-Grid */}
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-neutral-900/90 p-3.5 rounded-2xl border border-neutral-800">
                        <div className="text-[#FFD700] font-black text-xl font-mono">
                          {currentUser.likedListingIds.length}
                        </div>
                        <div className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 mt-0.5">
                          Liked Reels
                        </div>
                      </div>
                      <div className="bg-neutral-900/90 p-3.5 rounded-2xl border border-neutral-800">
                        <div className="text-[#FFD700] font-black text-xl font-mono">
                          {currentUser.savedListingIds.length}
                        </div>
                        <div className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 mt-0.5">
                          Saved Hostels
                        </div>
                      </div>
                      <div className="bg-neutral-900/90 p-3.5 rounded-2xl border border-neutral-800">
                        <div className="text-[#FFD700] font-black text-xl font-mono">
                          {currentUser.bookedTours.length}
                        </div>
                        <div className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 mt-0.5">
                          Viewing Tours
                        </div>
                      </div>
                    </div>

                    {/* Circular EnerHub Portal Promotion Banner */}
                    <div className="p-4 bg-gradient-to-r from-neutral-900 via-amber-950/40 to-neutral-900 border border-[#FFD700]/40 rounded-2xl flex items-center justify-between gap-3 shadow-lg">
                      <div className="flex items-center gap-3">
                        {/* Circular Logo */}
                        <div className="w-11 h-11 rounded-full bg-neutral-950 border-2 border-[#FFD700] p-1 flex items-center justify-center font-bold shadow-md shadow-[#FFD700]/30 shrink-0 overflow-hidden">
                          <img
                            src={ENERMIND_LOGO_URL}
                            alt="EnerMind"
                            className="w-full h-full object-contain rounded-full"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-black uppercase text-white tracking-wider font-display">
                              EnerHub Student Super-App
                            </span>
                            <span className="px-1.5 py-0.2 bg-[#FFD700]/20 text-[#FFD700] text-[9px] font-extrabold rounded">
                              Active
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-400 mt-0.5">
                            Study Notes • Past Papers • Project Lab • Attachments • Beats
                          </p>
                        </div>
                      </div>

                      {onOpenEnerHub && (
                        <button
                          onClick={() => {
                            onClose();
                            onOpenEnerHub('notes');
                          }}
                          className="px-3.5 py-2 bg-[#FFD700] hover:bg-[#ffe033] text-black text-xs font-black rounded-xl transition-all shadow-md shrink-0 flex items-center gap-1 cursor-pointer"
                        >
                          <span>Open Hub</span>
                          <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Tab: Saved Listings */}
                {activeProfileTab === 'saved' && (
                  <div className="space-y-2 max-h-[42vh] overflow-y-auto pr-1">
                    {savedListings.length === 0 ? (
                      <div className="text-center py-8 text-neutral-400">
                        <Bookmark className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
                        <p className="text-xs">No saved rentals yet. Tap the bookmark on any reel to save it.</p>
                      </div>
                    ) : (
                      savedListings.map((listing) => (
                        <div
                          key={listing.id}
                          onClick={() => {
                            onSelectListing(listing.id);
                            onClose();
                          }}
                          className="p-3 rounded-2xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 flex items-center justify-between gap-3 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={listing.mediaUrls[0]}
                              alt={listing.title}
                              className="w-12 h-12 rounded-xl object-cover border border-neutral-700 shrink-0"
                            />
                            <div className="min-w-0">
                              <h5 className="text-xs font-bold text-white truncate">{listing.title}</h5>
                              <p className="text-[10px] text-neutral-400 truncate">📍 {listing.location.estate}, {listing.location.county}</p>
                              <p className="text-xs font-black text-[#FFD700] mt-0.5">KSh {listing.price.toLocaleString()} / mo</p>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-neutral-500 shrink-0" />
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Tab: Booked Tours */}
                {activeProfileTab === 'tours' && (
                  <div className="space-y-2 max-h-[42vh] overflow-y-auto pr-1">
                    {currentUser.bookedTours.length === 0 ? (
                      <div className="text-center py-8 text-neutral-400">
                        <Calendar className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
                        <p className="text-xs">No booked viewing passes yet. Tap "Book Tour" on any rental listing.</p>
                      </div>
                    ) : (
                      currentUser.bookedTours.map((tour) => (
                        <div
                          key={tour.id}
                          className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <h5 className="text-xs font-black text-white">{tour.rentalTitle}</h5>
                            <span className="px-2 py-0.5 bg-green-500/20 text-green-400 border border-green-500/30 text-[9px] font-bold rounded-full uppercase">
                              {tour.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-[11px] text-neutral-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-[#FFD700]" />
                              <span>{tour.date}</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-[#FFD700]" />
                              <span>{tour.timeSlot}</span>
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Tab: Liked Activity */}
                {activeProfileTab === 'activity' && (
                  <div className="space-y-2 max-h-[42vh] overflow-y-auto pr-1">
                    {likedListings.length === 0 ? (
                      <div className="text-center py-8 text-neutral-400">
                        <Heart className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
                        <p className="text-xs">No liked reels yet.</p>
                      </div>
                    ) : (
                      likedListings.map((listing) => (
                        <div
                          key={listing.id}
                          onClick={() => {
                            onSelectListing(listing.id);
                            onClose();
                          }}
                          className="p-3 rounded-2xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 flex items-center justify-between gap-3 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={listing.mediaUrls[0]}
                              alt={listing.title}
                              className="w-12 h-12 rounded-xl object-cover border border-neutral-700 shrink-0"
                            />
                            <div className="min-w-0">
                              <h5 className="text-xs font-bold text-white truncate">{listing.title}</h5>
                              <p className="text-[10px] text-neutral-400 truncate">📍 {listing.location.estate}</p>
                              <p className="text-xs font-black text-[#FFD700] mt-0.5">KSh {listing.price.toLocaleString()} / mo</p>
                            </div>
                          </div>
                          <Heart className="w-4 h-4 text-red-500 fill-red-500 shrink-0" />
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
