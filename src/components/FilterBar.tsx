import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  SlidersHorizontal,
  Volume2,
  VolumeX,
  PlusCircle,
  Database,
  User,
  Building,
  GraduationCap,
  X,
  Check,
  ChevronDown,
  LayoutGrid,
  Sparkles,
  Zap,
  BookOpen,
  RefreshCw,
  Sliders
} from 'lucide-react';
import { FilterState, UserProfile, EnerHubTab } from '../types';
import { KENYAN_CAMPUSES } from '../data/campuses';
import { ENERMIND_LOGO_URL } from '../data/enerHubData';
import { CampusSelectorModal } from './CampusSelectorModal';

interface FilterBarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  filterState: FilterState;
  onUpdateFilter: (filter: Partial<FilterState>) => void;
  onOpenPostRental: () => void;
  onOpenCloudSync: () => void;
  onOpenGoogleAuth: () => void;
  onOpenEnerHub: (tab?: EnerHubTab) => void;
  currentUser: UserProfile;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
  totalResults: number;
  onOpenCampusModal?: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  activeTab,
  onSelectTab,
  filterState,
  onUpdateFilter,
  onOpenPostRental,
  onOpenCloudSync,
  onOpenGoogleAuth,
  onOpenEnerHub,
  currentUser,
  isAudioPlaying,
  onToggleAudio,
  totalResults
}) => {
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [showCampusModal, setShowCampusModal] = useState(false);

  const currentMode = filterState.mode || 'general';
  const selectedUni = filterState.selectedUniversity || 'all';
  const activeCampusMeta = KENYAN_CAMPUSES.find((c) => c.id === selectedUni);

  const generalTabs = [
    { id: 'for_you', label: 'For You' },
    { id: 'following', label: 'Following' },
    { id: 'kilimani', label: 'Kilimani & Westlands' },
    { id: '1br', label: '1BR & Studios' },
    { id: '2br', label: '2-3 Bedroom' },
    { id: 'luxury', label: 'Luxury' }
  ];

  const handleModeChange = (mode: 'general' | 'campus') => {
    onUpdateFilter({
      mode,
      selectedUniversity: mode === 'campus' ? filterState.selectedUniversity || 'all' : undefined
    });
    if (mode === 'campus') {
      onSelectTab('campus_all');
    } else {
      onSelectTab('for_you');
    }
  };

  const handleSelectCampus = (campusId: string) => {
    onUpdateFilter({
      mode: 'campus',
      selectedUniversity: campusId
    });
    onSelectTab('campus_all');
  };

  return (
    <>
      <header className="absolute top-0 inset-x-0 z-40 px-2 sm:px-3 pt-1.5 pointer-events-auto select-none flex flex-col gap-1 max-w-full">
        {/* ========================================================================= */}
        {/* ROW 1: 3 ENERMIND CIRCLES (Kenya Flag, Campus, EnerMind Hub) */}
        {/* ========================================================================= */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 py-0.5 bg-black/80 backdrop-blur-xl rounded-xl border border-white/10 px-2.5 shadow-xl">
          {/* Circle 1: Kenyan Flag Circle (General Kenya Mode) */}
          <button
            onClick={() => handleModeChange('general')}
            id="nav-circle-kenya"
            className="flex flex-col items-center group cursor-pointer"
            title="Kenya Wide House & Apartment Hunt"
          >
            <div
              className={`relative w-8 h-8 sm:w-9 sm:h-9 rounded-full p-0.5 transition-all duration-300 flex items-center justify-center ${
                currentMode === 'general'
                  ? 'ring-2 ring-[#FFD700] ring-offset-1 ring-offset-black scale-105 shadow-md shadow-[#FFD700]/30'
                  : 'opacity-70 group-hover:opacity-100 group-hover:scale-105 border border-white/20'
              }`}
            >
              <div className="w-full h-full rounded-full overflow-hidden shadow-inner relative flex flex-col">
                <svg viewBox="0 0 60 40" className="w-full h-full object-cover">
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
                  <ellipse cx="30" cy="20" rx="1.5" ry="4" fill="#ffffff" />
                  <line x1="22" y1="10" x2="38" y2="30" stroke="#ffffff" strokeWidth="0.8" />
                  <line x1="38" y1="10" x2="22" y2="30" stroke="#ffffff" strokeWidth="0.8" />
                </svg>
              </div>

              {currentMode === 'general' && (
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#FFD700] rounded-full border border-black flex items-center justify-center">
                  <Check className="w-1.5 h-1.5 text-black stroke-[4]" />
                </span>
              )}
            </div>
            <span
              className={`text-[9px] font-black uppercase tracking-wider transition-colors ${
                currentMode === 'general' ? 'text-[#FFD700]' : 'text-neutral-400 group-hover:text-white'
              }`}
            >
              Kenya
            </span>
          </button>

          {/* Circle 2: Campus Circle (Student Campus Mode) */}
          <button
            onClick={() => handleModeChange('campus')}
            id="nav-circle-campus"
            className="flex flex-col items-center group cursor-pointer"
            title="Kenyan Universities & Colleges Student Hostels"
          >
            <div
              className={`relative w-8 h-8 sm:w-9 sm:h-9 rounded-full p-0.5 transition-all duration-300 flex items-center justify-center ${
                currentMode === 'campus'
                  ? 'ring-2 ring-[#FFD700] ring-offset-1 ring-offset-black scale-105 shadow-md shadow-[#FFD700]/30'
                  : 'opacity-70 group-hover:opacity-100 group-hover:scale-105 border border-white/20'
              }`}
            >
              <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-700 to-amber-600 flex items-center justify-center shadow-inner relative">
                <GraduationCap className="w-4 h-4 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
              </div>

              {currentMode === 'campus' && (
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#FFD700] rounded-full border border-black flex items-center justify-center">
                  <Check className="w-1.5 h-1.5 text-black stroke-[4]" />
                </span>
              )}
            </div>
            <span
              className={`text-[9px] font-black uppercase tracking-wider transition-colors ${
                currentMode === 'campus' ? 'text-[#FFD700]' : 'text-neutral-400 group-hover:text-white'
              }`}
            >
              Campus
            </span>
          </button>

          {/* Circle 3: EnerMind Hub Circle (Notes, Exams, Projects, AI) */}
          <button
            onClick={() => onOpenEnerHub('notes')}
            id="nav-circle-enerhub"
            className="flex flex-col items-center group cursor-pointer"
            title="EnerHub - Student Notes, Past Papers, AI & Entertainment"
          >
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full p-0.5 transition-all duration-300 flex items-center justify-center border border-[#FFD700]/60 bg-neutral-950 shadow-md shadow-[#FFD700]/20 group-hover:scale-105">
              <div className="w-full h-full rounded-full overflow-hidden p-0.5 bg-neutral-900 flex items-center justify-center">
                <img
                  src={ENERMIND_LOGO_URL}
                  alt="EnerMind Hub"
                  className="w-full h-full object-contain rounded-full drop-shadow-sm"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>

              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#FFD700] rounded-full border border-black flex items-center justify-center shadow-sm">
                <Zap className="w-1.5 h-1.5 text-black fill-black" />
              </span>
            </div>
            <span className="text-[9px] font-black uppercase tracking-wider text-[#FFD700] group-hover:text-amber-300">
              EnerHub
            </span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* ROW 2: BELOW THEM -> FILTER, SYNC, TABS & AUDIO */}
        {/* ========================================================================= */}
        <div className="flex items-center justify-between gap-1 p-0.5 px-1 bg-black/80 backdrop-blur-xl border border-white/15 rounded-xl shadow-md">
          {/* Left Controls: Filter, Sync & Add Reel */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Post / Add Reel Button */}
            <button
              onClick={onOpenPostRental}
              id="post-rental-top-btn"
              className="flex items-center gap-0.5 px-2 py-0.5 rounded-lg bg-[#FFD700] hover:bg-[#ffe033] text-black border border-[#FFD700] text-[9.5px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-sm shadow-[#FFD700]/30 active:scale-95"
              title="Add / Post Rental Video Reel (TikTok, IG, FB, Files)"
            >
              <PlusCircle className="w-2.5 h-2.5 stroke-[2.5]" />
              <span>Add</span>
            </button>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilterDrawer(!showFilterDrawer)}
              id="filter-drawer-btn"
              className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                filterState.maxPrice < 250000 || filterState.bedrooms !== 'all'
                  ? 'bg-neutral-800 text-[#FFD700] border-[#FFD700] shadow-sm font-black'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/15'
              }`}
              title="Filter price, bedrooms, estates"
            >
              <SlidersHorizontal className="w-2.5 h-2.5" />
              <span>Filter</span>
              {filterState.maxPrice < 250000 && (
                <span className="w-1 h-1 rounded-full bg-[#FFD700]" />
              )}
            </button>

            {/* Sync Button */}
            <button
              onClick={onOpenCloudSync}
              id="sync-cloud-btn"
              className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-lg bg-white/10 hover:bg-pink-500/20 text-pink-300 hover:text-pink-200 border border-white/15 text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer"
              title="Sync TikTok Rental Feed & Cloud"
            >
              <span className="text-[10px]">🎵</span>
              <span>Sync</span>
            </button>
          </div>

          {/* Center Category Switcher */}
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5 max-w-[190px] sm:max-w-xs">
            {currentMode === 'general' ? (
              generalTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`px-1.5 py-0.5 rounded-md text-[8.5px] sm:text-[9.5px] font-bold whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? 'bg-white text-black shadow-xs font-black'
                      : 'text-neutral-300 hover:text-white bg-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              ))
            ) : (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleSelectCampus('all')}
                  className={`px-1.5 py-0.5 rounded-md text-[8.5px] font-bold transition-all ${
                    selectedUni === 'all'
                      ? 'bg-[#FFD700] text-black font-black'
                      : 'text-neutral-300 bg-white/5 hover:text-white'
                  }`}
                >
                  All Campuses
                </button>
                {activeCampusMeta && selectedUni !== 'all' && (
                  <span className="px-1.5 py-0.5 rounded-md text-[8.5px] font-black bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/50 truncate max-w-[90px]">
                    {activeCampusMeta.acronym}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Right Utility: Audio Toggle */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={onToggleAudio}
              className={`p-1 rounded-lg border transition-colors cursor-pointer ${
                isAudioPlaying
                  ? 'bg-[#FFD700]/20 text-[#FFD700] border-[#FFD700]/50'
                  : 'bg-white/10 text-neutral-400 border-white/10 hover:text-white'
              }`}
              title={isAudioPlaying ? 'Mute Music' : 'Play Music'}
            >
              {isAudioPlaying ? <Volume2 className="w-2.5 h-2.5" /> : <VolumeX className="w-2.5 h-2.5" />}
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ROW 3: BELOW THIS -> DEDICATED SEARCH BAR */}
        {/* ========================================================================= */}
        <div className="relative w-full flex items-center bg-black/85 backdrop-blur-xl border border-white/20 hover:border-[#FFD700]/60 focus-within:border-[#FFD700] rounded-xl px-2 py-1 shadow-md transition-colors">
          <Search className="w-3 h-3 text-[#FFD700] shrink-0 mr-1.5" />
          <input
            type="text"
            value={filterState.searchQuery}
            onChange={(e) => onUpdateFilter({ searchQuery: e.target.value })}
            placeholder={
              currentMode === 'campus'
                ? 'Search KU, UoN, Strathmore, bedsitters...'
                : 'Search Kilimani, Westlands, 1BR...'
            }
            className="w-full bg-transparent text-[11px] text-white placeholder-neutral-400 focus:outline-none font-medium"
          />

          {filterState.searchQuery ? (
            <button
              onClick={() => onUpdateFilter({ searchQuery: '' })}
              className="text-neutral-400 hover:text-white p-0.5 cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          ) : (
            <span className="text-[8.5px] font-mono text-neutral-400 shrink-0 uppercase tracking-wider pl-1">
              {totalResults} listings
            </span>
          )}
        </div>

        {/* Filter Drawer Popup (When Filter button is clicked) */}
        <AnimatePresence>
          {showFilterDrawer && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              className="bg-[#121212]/95 backdrop-blur-2xl border border-white/20 rounded-2xl p-3.5 shadow-2xl text-white space-y-3 mt-1"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#FFD700]" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Filters & Budget
                  </span>
                </div>
                <button
                  onClick={() => setShowFilterDrawer(false)}
                  className="text-neutral-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Price Range Slider */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-neutral-400">Max Rent Budget</span>
                  <span className="font-bold text-[#FFD700]">
                    KSh {filterState.maxPrice.toLocaleString()} / mo
                  </span>
                </div>
                <input
                  type="range"
                  min={5000}
                  max={250000}
                  step={2500}
                  value={filterState.maxPrice}
                  onChange={(e) => onUpdateFilter({ maxPrice: Number(e.target.value) })}
                  className="w-full accent-[#FFD700] bg-neutral-800 h-1.5 rounded-lg cursor-pointer"
                />
              </div>

              {/* Bedroom Selection */}
              <div>
                <span className="text-xs text-neutral-400 block mb-1">Bedrooms / Layout</span>
                <div className="grid grid-cols-4 gap-1">
                  {[
                    { id: 'all', label: 'All' },
                    { id: '0', label: 'Bedsitter' },
                    { id: '1', label: '1 BR' },
                    { id: '2', label: '2+ BR' }
                  ].map((bed) => (
                    <button
                      key={bed.id}
                      onClick={() =>
                        onUpdateFilter({
                          bedrooms: bed.id as 'all' | '0' | '1' | '2'
                        })
                      }
                      className={`py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                        filterState.bedrooms === bed.id
                          ? 'bg-[#FFD700] text-black font-extrabold'
                          : 'bg-white/10 text-neutral-300 hover:text-white'
                      }`}
                    >
                      {bed.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center justify-between pt-1 border-t border-white/10">
                <button
                  onClick={() =>
                    onUpdateFilter({
                      maxPrice: 250000,
                      bedrooms: 'all',
                      searchQuery: ''
                    })
                  }
                  className="text-[10px] text-neutral-400 hover:text-white underline cursor-pointer"
                >
                  Reset all filters
                </button>
                <button
                  onClick={() => setShowFilterDrawer(false)}
                  className="px-3 py-1 bg-[#FFD700] text-black text-xs font-bold rounded-lg cursor-pointer"
                >
                  Apply
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Campus Selector Directory Modal */}
      <CampusSelectorModal
        isOpen={showCampusModal}
        onClose={() => setShowCampusModal(false)}
        selectedUniversityId={selectedUni}
        onSelectCampus={handleSelectCampus}
      />
    </>
  );
};
