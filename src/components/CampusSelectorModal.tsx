import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  GraduationCap,
  Search,
  X,
  Check,
  MapPin,
  Building2,
  Users,
  Compass,
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { KENYAN_CAMPUSES, CampusMetadata } from '../data/campuses';

interface CampusSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUniversityId: string;
  onSelectCampus: (campusId: string) => void;
}

export const CampusSelectorModal: React.FC<CampusSelectorModalProps> = ({
  isOpen,
  onClose,
  selectedUniversityId,
  onSelectCampus
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  const regionTabs = useMemo(
    () => [
      { id: 'all', label: 'All Kenya' },
      { id: 'Nairobi', label: 'Nairobi & Metro' },
      { id: 'Kiambu & Central', label: 'Kiambu & Central' },
      { id: 'Rift Valley', label: 'Rift Valley / Eldoret / Nakuru' },
      { id: 'Western & Nyanza', label: 'Western & Nyanza' },
      { id: 'Coast', label: 'Coast / Mombasa' },
      { id: 'Eastern & Mt. Kenya', label: 'Eastern & Mt. Kenya' },
      { id: 'Northern', label: 'Northern' }
    ],
    []
  );

  if (!isOpen) return null;

  const filteredCampuses = KENYAN_CAMPUSES.filter((campus) => {
    const q = searchQuery.toLowerCase().trim();
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
      selectedRegion === 'all' ||
      campus.region === selectedRegion ||
      campus.county.toLowerCase().includes(selectedRegion.toLowerCase());

    return matchesSearch && matchesRegion;
  });

  const handleSelect = (id: string) => {
    onSelectCampus(id);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-5xl bg-[#111111] border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-neutral-100 max-h-[92vh]"
        >
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-white/10 bg-[#0d0d0d] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FFD700]/10 border border-[#FFD700]/30 flex items-center justify-center text-[#FFD700]">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-light text-lg sm:text-2xl text-white flex items-center gap-2">
                  <span>All Kenya Campuses</span>
                  <span className="text-[10px] sm:text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#FFD700] text-black uppercase">
                    {KENYAN_CAMPUSES.length} Campuses & Colleges
                  </span>
                </h3>
                <p className="text-xs text-neutral-400">
                  Filter verified student hostels, bedsitters & apartments walking distance to your lecture halls
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              id="close-campus-selector-modal-btn"
              className="p-2 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search & Region Filter Bar */}
          <div className="p-4 border-b border-white/10 bg-[#141414] space-y-3">
            <div className="flex flex-col gap-2.5">
              {/* Search input */}
              <div className="relative">
                <Search className="w-4 h-4 text-[#FFD700] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search any university (KU, UoN, Strathmore, JKUAT, Maseno, MMUST, TUM, Moi, Egerton), campus, town, estate or gate..."
                  className="w-full bg-black/70 border border-white/15 focus:border-[#FFD700] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Region Quick Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {regionTabs.map((region) => (
                  <button
                    key={region.id}
                    onClick={() => setSelectedRegion(region.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border ${
                      selectedRegion === region.id
                        ? 'bg-[#FFD700] text-black border-[#FFD700] font-bold'
                        : 'bg-black/50 text-neutral-300 border-white/10 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    {region.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick stats & action */}
            <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
              <span>
                Showing <strong className="text-white">{filteredCampuses.length}</strong> of{' '}
                {KENYAN_CAMPUSES.length} campuses across Kenya
              </span>
              <button
                onClick={() => handleSelect('all')}
                className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-lg border transition-all ${
                  selectedUniversityId === 'all'
                    ? 'bg-white text-black border-white'
                    : 'text-[#FFD700] border-[#FFD700]/30 hover:bg-[#FFD700]/10'
                }`}
              >
                {selectedUniversityId === 'all' ? '✓ Showing All Campuses' : 'Show All Campuses'}
              </button>
            </div>
          </div>

          {/* Campus Grid */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 bg-[#0e0e0e]">
            {/* "All Campuses" Card */}
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ duration: 0.15 }}
              onClick={() => handleSelect('all')}
              className={`relative p-4 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ${
                selectedUniversityId === 'all'
                  ? 'bg-neutral-900 border-[#FFD700] ring-2 ring-[#FFD700]/30 shadow-xl'
                  : 'bg-[#151515] border-white/10 hover:border-white/30'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  {/* Circle Logo for All Kenya */}
                  <div className="w-12 h-12 rounded-full bg-[#FFD700] text-black flex items-center justify-center font-black font-mono text-sm shadow-lg ring-2 ring-[#FFD700]/50">
                    ALL
                  </div>
                  {selectedUniversityId === 'all' && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-[#FFD700] bg-[#FFD700]/15 px-2.5 py-0.5 rounded-full border border-[#FFD700]/30">
                      <Check className="w-3 h-3 stroke-[3]" /> Active
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="font-serif text-base text-white font-medium">All Universities & Colleges</h4>
                  <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">
                    Browse verified student hostels, bedsitters and shared apartments near all Kenyan campuses
                  </p>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-neutral-300 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
                  <span>500+ Student Rentals</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-[#FFD700] font-bold">
                <span>View All Feed</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </motion.div>

            {/* University Cards */}
            {filteredCampuses.map((campus) => {
              const isSelected = selectedUniversityId === campus.id;

              return (
                <motion.div
                  key={campus.id}
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => handleSelect(campus.id)}
                  id={`campus-card-${campus.id.toLowerCase()}`}
                  className={`relative p-3.5 sm:p-4 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ${
                    isSelected
                      ? 'bg-[#1a1705] border-[#FFD700] ring-2 ring-[#FFD700]/40 shadow-xl'
                      : 'bg-[#151515] border-white/10 hover:border-white/25 hover:bg-[#181818]'
                  }`}
                >
                  {/* Top Badge & Circle Logo */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        {/* Custom University Circle Logo */}
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shadow-lg border border-white/20 relative overflow-hidden shrink-0 ring-2 ring-white/10"
                          style={{
                            background: `linear-gradient(135deg, ${campus.primaryColor}, ${campus.secondaryColor})`
                          }}
                        >
                          <div className="absolute inset-0 bg-black/20" />
                          <span className="relative z-10 font-black text-xs sm:text-sm tracking-tight font-mono">
                            {campus.acronym.slice(0, 4)}
                          </span>
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-mono text-xs font-bold text-[#FFD700]">
                              {campus.acronym}
                            </span>
                            <span className="text-[10px] text-neutral-400 truncate">• {campus.county}</span>
                          </div>
                          <h4 className="font-serif text-sm sm:text-base text-white font-medium leading-snug truncate">
                            {campus.name}
                          </h4>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-[#FFD700] text-black flex items-center justify-center shrink-0 shadow-sm">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    {/* Location & Gates */}
                    <div className="space-y-1.5 text-xs text-neutral-300">
                      <div className="flex items-center gap-1.5 text-neutral-400 text-[11px]">
                        <MapPin className="w-3.5 h-3.5 text-[#FFD700] shrink-0" />
                        <span className="truncate">{campus.location}</span>
                      </div>

                      {/* Main Gates Pill */}
                      <div className="p-2 rounded-xl bg-black/40 border border-white/5 space-y-1">
                        <div className="text-[10px] uppercase font-bold text-neutral-400">Main Student Gates:</div>
                        <div className="flex flex-wrap gap-1">
                          {campus.mainGates.slice(0, 2).map((gate, i) => (
                            <span
                              key={i}
                              className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] text-neutral-300 truncate max-w-full"
                            >
                              {gate}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Stats & Selection Action */}
                  <div className="mt-3.5 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-neutral-400 font-mono text-[10px] sm:text-[11px] truncate mr-2">
                      {campus.popularPriceRange}
                    </span>

                    <button
                      type="button"
                      className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shrink-0 ${
                        isSelected
                          ? 'bg-[#FFD700] text-black'
                          : 'bg-white/10 text-neutral-200 hover:bg-[#FFD700] hover:text-black'
                      }`}
                    >
                      {isSelected ? 'Selected' : 'Select'}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
