import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronUp,
  ChevronDown,
  Sparkles,
  Compass,
  Home,
  Building2,
  GraduationCap,
  PlusCircle,
  User,
  Zap,
  Search,
  LayoutGrid
} from 'lucide-react';
import { RentalListing, UserProfile, LandlordProfile, FilterState, EnerHubTab } from '../types';
import { ReelItem } from './ReelItem';
import { FilterBar } from './FilterBar';
import { CampusSelectorModal } from './CampusSelectorModal';
import { ENERMIND_LOGO_URL } from '../data/enerHubData';
import { KENYAN_CAMPUSES } from '../data/campuses';

interface ReelFeedProps {
  listings: RentalListing[];
  currentUser: UserProfile;
  isAudioPlaying: boolean;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  filterState: FilterState;
  onUpdateFilter: (filter: Partial<FilterState>) => void;
  onOpenPostRental: () => void;
  onOpenCloudSync: () => void;
  onOpenGoogleAuth: () => void;
  onOpenEnerHub: (tab?: EnerHubTab) => void;
  onToggleLike: (listingId: string) => void;
  onToggleSave: (listingId: string) => void;
  onToggleFollow: (landlordId: string) => void;
  onOpenComments: (listing: RentalListing) => void;
  onOpenCertifiedDocs: (listing: RentalListing) => void;
  onOpenFullDetails: (listing: RentalListing) => void;
  onOpenLandlordProfile: (landlord: LandlordProfile) => void;
  onOpenShare: (listing: RentalListing) => void;
  onToggleAudio: () => void;
  totalResults: number;
}

export const ReelFeed: React.FC<ReelFeedProps> = ({
  listings,
  currentUser,
  isAudioPlaying,
  activeTab,
  onSelectTab,
  filterState,
  onUpdateFilter,
  onOpenPostRental,
  onOpenCloudSync,
  onOpenGoogleAuth,
  onOpenEnerHub,
  onToggleLike,
  onToggleSave,
  onToggleFollow,
  onOpenComments,
  onOpenCertifiedDocs,
  onOpenFullDetails,
  onOpenLandlordProfile,
  onOpenShare,
  onToggleAudio,
  totalResults
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCampusModal, setShowCampusModal] = useState(false);
  const [isSpinningCampus, setIsSpinningCampus] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number>(0);
  const isScrollingRef = useRef<boolean>(false);

  // Clamp index if listings change
  useEffect(() => {
    if (currentIndex >= listings.length && listings.length > 0) {
      setCurrentIndex(listings.length - 1);
    }
  }, [listings.length, currentIndex]);

  const goToNext = useCallback(() => {
    if (currentIndex < listings.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, listings.length]);

  const goToPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  // Keyboard navigation (ArrowUp, ArrowDown, 'j', 'k', Space)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'ArrowDown' || e.key === 'j' || e.key === 'PageDown') {
        e.preventDefault();
        goToNext();
      } else if (e.key === 'ArrowUp' || e.key === 'k' || e.key === 'PageUp') {
        e.preventDefault();
        goToPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev]);

  // Wheel debounce for desktop
  const handleWheel = (e: React.WheelEvent) => {
    if (isScrollingRef.current) return;

    if (Math.abs(e.deltaY) > 35) {
      isScrollingRef.current = true;
      if (e.deltaY > 0) {
        goToNext();
      } else {
        goToPrev();
      }

      setTimeout(() => {
        isScrollingRef.current = false;
      }, 450);
    }
  };

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY;

    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
  };

  // Spinning Campus button click handler
  const handleCampusCircleClick = () => {
    setIsSpinningCampus(true);
    setTimeout(() => {
      setShowCampusModal(true);
      setTimeout(() => setIsSpinningCampus(false), 300);
    }, 400);
  };

  const handleSelectCampusFromModal = (campusId: string) => {
    onUpdateFilter({
      mode: 'campus',
      selectedUniversity: campusId
    });
    onSelectTab('campus_all');
  };

  const selectedCampusMeta = KENYAN_CAMPUSES.find(
    (c) => c.id === filterState.selectedUniversity
  );

  // If no listings match the current filters
  if (listings.length === 0) {
    return (
      <div className="relative w-full h-full flex items-center justify-center bg-neutral-950 text-white">
        <div className="w-full h-full sm:max-w-[480px] sm:h-[94vh] sm:rounded-3xl sm:border sm:border-neutral-800 sm:shadow-2xl overflow-hidden bg-black flex flex-col relative">
          <FilterBar
            activeTab={activeTab}
            onSelectTab={onSelectTab}
            filterState={filterState}
            onUpdateFilter={onUpdateFilter}
            onOpenPostRental={onOpenPostRental}
            onOpenCloudSync={onOpenCloudSync}
            onOpenGoogleAuth={onOpenGoogleAuth}
            onOpenEnerHub={onOpenEnerHub}
            currentUser={currentUser}
            isAudioPlaying={isAudioPlaying}
            onToggleAudio={onToggleAudio}
            totalResults={0}
          />

          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[#FFD700] mb-4">
              <Compass className="w-8 h-8 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">No rentals found</h3>
            <p className="text-xs text-neutral-400 max-w-xs leading-relaxed">
              No matching listings in this category or campus budget. Try widening your price range or switching categories.
            </p>
            <button
              onClick={() => {
                onUpdateFilter({
                  maxPrice: 250000,
                  bedrooms: 'all',
                  searchQuery: '',
                  selectedUniversity: 'all',
                  category: 'all'
                });
                onSelectTab('for_you');
              }}
              className="mt-4 px-4 py-2 rounded-full bg-[#FFD700] text-black text-xs font-bold uppercase tracking-wider shadow-lg hover:scale-105 transition-all cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full h-full flex items-center justify-center overflow-hidden bg-neutral-950"
    >
      {/* Mobile-first centered phone viewport frame on desktop screens */}
      <div className="relative w-full h-full sm:max-w-[480px] sm:h-[94vh] sm:max-h-[920px] sm:rounded-3xl sm:border sm:border-neutral-800 sm:shadow-2xl overflow-hidden bg-black flex flex-col">
        {/* Integrated Top Navigation Bar (3 EnerMind Circles, Filter/Sync row, Search row) */}
        <FilterBar
          activeTab={activeTab}
          onSelectTab={onSelectTab}
          filterState={filterState}
          onUpdateFilter={onUpdateFilter}
          onOpenPostRental={onOpenPostRental}
          onOpenCloudSync={onOpenCloudSync}
          onOpenGoogleAuth={onOpenGoogleAuth}
          onOpenEnerHub={onOpenEnerHub}
          currentUser={currentUser}
          isAudioPlaying={isAudioPlaying}
          onToggleAudio={onToggleAudio}
          totalResults={totalResults}
        />

        {/* Active Reel Item */}
        <div className="relative flex-1 w-full h-full overflow-hidden">
          <ReelItem
            key={listings[currentIndex]?.id || 'reel-item'}
            listing={listings[currentIndex]}
            isActive={true}
            currentUser={currentUser}
            isAudioPlaying={isAudioPlaying}
            onToggleLike={() => onToggleLike(listings[currentIndex].id)}
            onToggleSave={() => onToggleSave(listings[currentIndex].id)}
            onToggleFollow={() => onToggleFollow(listings[currentIndex].landlord.id)}
            onOpenComments={() => onOpenComments(listings[currentIndex])}
            onOpenCertifiedDocs={() => onOpenCertifiedDocs(listings[currentIndex])}
            onOpenFullDetails={() => onOpenFullDetails(listings[currentIndex])}
            onOpenLandlordProfile={() => onOpenLandlordProfile(listings[currentIndex].landlord)}
            onOpenShare={() => onOpenShare(listings[currentIndex])}
            onToggleAudio={onToggleAudio}
          />
        </div>

        {/* ========================================================================= */}
        {/* LEFT SIDE CENTER: ENERMIND CAMPUS CIRCULAR BUTTON (SPINS ON CLICK) */}
        {/* ========================================================================= */}
        <div className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-40 pointer-events-auto flex flex-col items-center gap-1">
          <motion.button
            onClick={handleCampusCircleClick}
            id="spinning-campus-selector-circle-btn"
            animate={{
              rotate: isSpinningCampus ? 720 : 0,
              scale: isSpinningCampus ? 1.15 : 1
            }}
            transition={{
              duration: 0.5,
              ease: 'easeInOut'
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.92 }}
            className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full p-0.5 bg-neutral-950 border-2 border-[#FFD700] shadow-2xl shadow-[#FFD700]/40 flex items-center justify-center cursor-pointer group"
            title="Search and Select Any Kenyan University / College Campus"
          >
            {/* Ambient Pulsing Aura */}
            <div className="absolute inset-0 rounded-full bg-[#FFD700]/20 blur-sm animate-pulse" />

            {/* Inner Graphic */}
            <div className="w-full h-full rounded-full bg-gradient-to-tr from-neutral-900 via-amber-950 to-neutral-900 flex items-center justify-center overflow-hidden relative">
              <img
                src={ENERMIND_LOGO_URL}
                alt="EnerMind Campus"
                className="w-full h-full object-contain rounded-full p-0.5"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-[#FFD700] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
              </div>
            </div>

            {/* Glowing Corner Badge */}
            <span className="absolute -bottom-1 -right-0.5 w-4 h-4 bg-[#FFD700] rounded-full border-2 border-black flex items-center justify-center shadow-md">
              <Sparkles className="w-2.5 h-2.5 text-black" />
            </span>
          </motion.button>

          {/* Subtitle Badge */}
          <span className="text-[9px] font-black uppercase tracking-wider text-[#FFD700] bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded-md border border-[#FFD700]/30 shadow-md">
            {selectedCampusMeta ? selectedCampusMeta.acronym : 'Campus'}
          </span>
        </div>

        {/* ========================================================================= */}
        {/* CENTER BOTTOM: USER PROFILE IMAGE & ADD POST (+) BUTTON */}
        {/* ========================================================================= */}
        <div className="absolute bottom-2 sm:bottom-3 inset-x-0 z-40 flex items-center justify-center pointer-events-auto select-none">
          <div className="flex items-center gap-3 px-3 py-1.5 bg-black/80 backdrop-blur-xl border border-white/20 hover:border-[#FFD700]/60 rounded-full shadow-2xl transition-all">
            {/* User Profile Avatar */}
            <button
              onClick={onOpenGoogleAuth}
              id="center-bottom-user-profile-btn"
              className="relative flex items-center gap-1.5 p-0.5 rounded-full hover:scale-105 transition-transform cursor-pointer group"
              title={currentUser.isLoggedIn ? `Logged in as ${currentUser.name}` : 'Sign In / Sign Up'}
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-[#FFD700] p-0.5 bg-neutral-900 overflow-hidden shadow-md flex items-center justify-center">
                {currentUser.isLoggedIn && currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-4 h-4 text-[#FFD700]" />
                )}
              </div>
              <span className="text-[10px] font-bold text-white group-hover:text-[#FFD700] max-w-[80px] truncate hidden xs:inline">
                {currentUser.isLoggedIn ? currentUser.name.split(' ')[0] : 'Sign In'}
              </span>
            </button>

            <div className="h-4 w-px bg-white/20" />

            {/* Add Post (+) Button */}
            <button
              onClick={onOpenPostRental}
              id="center-bottom-add-post-btn"
              className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-[#FFD700] via-amber-400 to-yellow-400 hover:from-[#ffe033] hover:to-amber-400 text-black rounded-full font-black text-[11px] uppercase tracking-wider shadow-lg shadow-[#FFD700]/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title="Post a Rental Reel or Hostel Listing"
            >
              <PlusCircle className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Post</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Desktop Next / Prev Navigation Buttons on the side */}
      <div className="hidden sm:flex flex-col gap-3 absolute right-6 top-1/2 -translate-y-1/2 z-30">
        <button
          onClick={goToPrev}
          disabled={currentIndex === 0}
          className="p-3 rounded-full bg-neutral-900/90 border border-neutral-700 text-white hover:bg-neutral-800 disabled:opacity-30 disabled:hover:bg-neutral-900 shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
          title="Previous Rental Reel (Up Arrow)"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
        <button
          onClick={goToNext}
          disabled={currentIndex === listings.length - 1}
          className="p-3 rounded-full bg-neutral-900/90 border border-neutral-700 text-white hover:bg-neutral-800 disabled:opacity-30 disabled:hover:bg-neutral-900 shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
          title="Next Rental Reel (Down Arrow)"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      {/* Desktop Helper Pill on bottom-left */}
      <div className="hidden lg:flex items-center gap-2 absolute left-6 bottom-6 z-30 bg-neutral-900/80 border border-neutral-800 px-3.5 py-2 rounded-2xl text-[11px] text-neutral-300 backdrop-blur-md shadow-xl">
        <span className="flex items-center gap-1 font-mono text-white">
          <kbd className="px-1.5 py-0.5 bg-neutral-800 rounded border border-neutral-700">↑</kbd>
          <kbd className="px-1.5 py-0.5 bg-neutral-800 rounded border border-neutral-700">↓</kbd>
        </span>
        <span>Scroll or swipe to explore rentals</span>
      </div>

      {/* Campus Selector Directory Modal (Triggered by left-side spinning button) */}
      <CampusSelectorModal
        isOpen={showCampusModal}
        onClose={() => setShowCampusModal(false)}
        selectedUniversityId={filterState.selectedUniversity || 'all'}
        onSelectCampus={handleSelectCampusFromModal}
      />
    </div>
  );
};
