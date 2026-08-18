/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import {
  Building2,
  MapPin,
  ShieldCheck,
  Search,
  SlidersHorizontal,
  Plus,
  Sparkles,
  Heart,
  RotateCcw,
  BedDouble,
  Navigation,
  ArrowUpDown,
  CheckCircle2,
  Lock,
  Layers,
  ChevronDown,
  ChevronUp,
  X,
  Bot,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { useCurrency } from '../context/CurrencyContext.js';
import { api } from '../services/api.js';
import {
  AccommodationListing,
  PropertyType,
  RoomType,
  GenderPreference,
} from '../types/index.js';

// Modular Components
import { AccommodationCard } from '../components/accommodation/AccommodationCard.js';
import { AccommodationDetailModal } from '../components/accommodation/AccommodationDetailModal.js';
import { ListPropertyModal } from '../components/accommodation/ListPropertyModal.js';
import { InquiryModal } from '../components/accommodation/InquiryModal.js';
import { LandlordDashboardModal } from '../components/accommodation/LandlordDashboardModal.js';
import { AccommodationComparisonModal } from '../components/accommodation/AccommodationComparisonModal.js';
import { ReportListingModal } from '../components/accommodation/ReportListingModal.js';
import { AccommodationAIModal } from '../components/accommodation/AccommodationAIModal.js';

export function AccommodationView() {
  const { user } = useAuth();
  const { activeRate, convertPrice } = useCurrency();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPropertyType, setSelectedPropertyType] = useState<string>('ALL');
  const [selectedRoomType, setSelectedRoomType] = useState<string>('ALL');
  const [selectedGender, setSelectedGender] = useState<string>('ALL');
  const [maxDistanceKm, setMaxDistanceKm] = useState<number>(15);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [isFurnishedOnly, setIsFurnishedOnly] = useState<boolean>(false);
  const [utilitiesIncludedOnly, setUtilitiesIncludedOnly] = useState<boolean>(false);
  const [isVerifiedOnly, setIsVerifiedOnly] = useState<boolean>(false);
  const [availableOnly, setAvailableOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'PRICE_ASC' | 'PRICE_DESC' | 'DISTANCE_ASC' | 'NEWEST'>('NEWEST');

  // UI Tabs & State
  const [activeTab, setActiveTab] = useState<'ALL' | 'VERIFIED' | 'SAVED'>('ALL');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [properties, setProperties] = useState<AccommodationListing[]>([]);

  // Saved / Compare State
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('enermind_saved_accommodations');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [compareIds, setCompareIds] = useState<string[]>([]);

  // Modals State
  const [detailProperty, setDetailProperty] = useState<AccommodationListing | null>(null);
  const [inquiryProperty, setInquiryProperty] = useState<AccommodationListing | null>(null);
  const [reportProperty, setReportProperty] = useState<AccommodationListing | null>(null);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [isLandlordModalOpen, setIsLandlordModalOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  useEffect(() => {
    loadProperties();
  }, [
    user?.institutionId,
    activeRate.code,
    selectedPropertyType,
    selectedRoomType,
    selectedGender,
    maxDistanceKm,
    isFurnishedOnly,
    utilitiesIncludedOnly,
    isVerifiedOnly,
    availableOnly,
    sortBy,
  ]);

  async function loadProperties() {
    try {
      setIsLoading(true);
      const res = await api.searchAccommodation({
        institutionId: user?.institutionId,
        propertyType: selectedPropertyType !== 'ALL' ? (selectedPropertyType as PropertyType) : undefined,
        roomType: selectedRoomType !== 'ALL' ? (selectedRoomType as RoomType) : undefined,
        genderPreference: selectedGender !== 'ALL' ? (selectedGender as GenderPreference) : undefined,
        maxDistanceKm: maxDistanceKm,
        isFurnished: isFurnishedOnly ? true : undefined,
        utilitiesIncluded: utilitiesIncludedOnly ? true : undefined,
        isVerifiedOnly: isVerifiedOnly ? true : undefined,
        availableOnly: availableOnly ? true : undefined,
        currency: activeRate.code,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        sortBy: sortBy,
      });

      setProperties(res.properties || []);
    } catch (err) {
      console.error('Failed to load accommodation:', err);
    } finally {
      setIsLoading(false);
    }
  }

  function handleToggleSave(propertyId: string) {
    let nextSaved: string[];
    if (savedIds.includes(propertyId)) {
      nextSaved = savedIds.filter((id) => id !== propertyId);
    } else {
      nextSaved = [...savedIds, propertyId];
    }
    setSavedIds(nextSaved);
    localStorage.setItem('enermind_saved_accommodations', JSON.stringify(nextSaved));
  }

  function handleToggleCompare(propertyId: string) {
    if (compareIds.includes(propertyId)) {
      setCompareIds(compareIds.filter((id) => id !== propertyId));
    } else {
      if (compareIds.length >= 4) {
        alert('You can compare up to 4 properties at a time.');
        return;
      }
      setCompareIds([...compareIds, propertyId]);
    }
  }

  function handleResetFilters() {
    setSearchQuery('');
    setSelectedPropertyType('ALL');
    setSelectedRoomType('ALL');
    setSelectedGender('ALL');
    setMaxDistanceKm(15);
    setMinPrice('');
    setMaxPrice('');
    setIsFurnishedOnly(false);
    setUtilitiesIncludedOnly(false);
    setIsVerifiedOnly(false);
    setAvailableOnly(false);
    setSortBy('NEWEST');
  }

  // Filtered by search text & view tabs
  const displayedProperties = useMemo(() => {
    return properties.filter((p) => {
      // Tab filter
      if (activeTab === 'VERIFIED' && !p.verificationBadge) return false;
      if (activeTab === 'SAVED' && !savedIds.includes(p.id)) return false;

      // Text query match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesCity = p.city.toLowerCase().includes(q);
        const matchesAddress = p.address.toLowerCase().includes(q);
        const matchesCampus = p.primaryCampusName?.toLowerCase().includes(q);
        const matchesAmenity = p.amenities.some((a) => a.toLowerCase().includes(q));
        if (!matchesTitle && !matchesCity && !matchesAddress && !matchesCampus && !matchesAmenity) {
          return false;
        }
      }

      return true;
    });
  }, [properties, activeTab, savedIds, searchQuery]);

  const compareProperties = useMemo(() => {
    return properties.filter((p) => compareIds.includes(p.id));
  }, [properties, compareIds]);

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      {/* Top Banner / Marketplace Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#12141D] via-[#151825] to-[#12141D] border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-[#50E3C2]/15 text-[#50E3C2] flex items-center justify-center border border-[#50E3C2]/30 shadow-inner">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#50E3C2] font-bold">
                Global Campus Real Estate
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Accommodation & Student Rentals
              </h1>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-white/60 max-w-2xl leading-relaxed">
            Verified student housing, hostels, bedsitters, and apartments near <span className="text-white font-semibold">{user?.institutionName || 'your university campus'}</span> with live distance calculation and verified owner moderation.
          </p>
        </div>

        {/* Top Action CTAs */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            id="btn-ask-housing-ai"
            onClick={() => setIsAIModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl text-xs font-bold bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-[#50E3C2]/40 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#50E3C2]" />
            <span>AI Housing Advisor</span>
          </button>

          <button
            type="button"
            id="btn-landlord-portal"
            onClick={() => setIsLandlordModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl text-xs font-bold bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all flex items-center gap-2"
          >
            <UserCheck className="w-4 h-4 text-[#50E3C2]" />
            <span>Landlord Portal</span>
          </button>

          <button
            type="button"
            id="btn-list-new-property"
            onClick={() => setIsListModalOpen(true)}
            className="px-5 py-2.5 rounded-2xl text-xs font-black bg-[#50E3C2] hover:bg-[#38cbb0] text-black transition-all flex items-center gap-2 shadow-lg shadow-[#50E3C2]/15"
          >
            <Plus className="w-4 h-4" />
            <span>List Property</span>
          </button>
        </div>
      </div>

      {/* Main Search & Category Pills Filter Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#12141D] border border-white/5 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Main Keyword Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by building name, campus, neighborhood, city, or amenities (e.g. Wi-Fi, Water)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-black/40 border border-white/10 rounded-2xl text-xs sm:text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#50E3C2] transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Property Type Selector */}
          <div className="flex items-center gap-2">
            <select
              value={selectedPropertyType}
              onChange={(e) => setSelectedPropertyType(e.target.value)}
              className="p-3 bg-black/40 border border-white/10 rounded-2xl text-xs text-white focus:outline-none focus:border-[#50E3C2] font-medium"
            >
              <option value="ALL">All Property Types</option>
              {Object.values(PropertyType).map((t) => (
                <option key={t} value={t} className="bg-[#12141D]">
                  {t.replace('_', ' ')}
                </option>
              ))}
            </select>

            {/* Sort Selector */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="p-3 bg-black/40 border border-white/10 rounded-2xl text-xs text-white focus:outline-none focus:border-[#50E3C2] font-medium"
            >
              <option value="NEWEST">Newest Listings</option>
              <option value="PRICE_ASC">Price: Low to High</option>
              <option value="PRICE_DESC">Price: High to Low</option>
              <option value="DISTANCE_ASC">Nearest to Campus</option>
            </select>

            {/* Toggle Advanced Filters Button */}
            <button
              type="button"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`p-3 rounded-2xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                showAdvancedFilters
                  ? 'bg-[#50E3C2]/15 border-[#50E3C2]/40 text-[#50E3C2]'
                  : 'bg-black/40 border-white/10 text-white/70 hover:text-white'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
              {showAdvancedFilters ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Secondary Category Pills */}
        <div className="flex items-center justify-between gap-4 pt-1 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2">
            {[
              { id: 'ALL', label: 'All Listings' },
              { id: 'VERIFIED', label: 'Verified Only' },
              { id: 'SAVED', label: `Saved (${savedIds.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-black shadow-md'
                    : 'bg-white/5 text-white/60 hover:text-white border border-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="text-xs font-mono text-white/40 whitespace-nowrap">
            Showing <strong className="text-white">{displayedProperties.length}</strong> listings
          </div>
        </div>

        {/* Advanced Filters Expandable Drawer */}
        {showAdvancedFilters && (
          <div className="pt-4 mt-4 border-t border-white/5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {/* Room Layout Type */}
              <div>
                <label className="block text-[11px] font-mono text-white/50 uppercase mb-1">Room Layout</label>
                <select
                  value={selectedRoomType}
                  onChange={(e) => setSelectedRoomType(e.target.value)}
                  className="w-full p-2.5 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#50E3C2]"
                >
                  <option value="ALL">Any Layout</option>
                  {Object.values(RoomType).map((r) => (
                    <option key={r} value={r} className="bg-[#12141D]">
                      {r.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              {/* Gender Preference */}
              <div>
                <label className="block text-[11px] font-mono text-white/50 uppercase mb-1">Gender Policy</label>
                <select
                  value={selectedGender}
                  onChange={(e) => setSelectedGender(e.target.value)}
                  className="w-full p-2.5 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#50E3C2]"
                >
                  <option value="ALL">All (Mixed & Single)</option>
                  <option value={GenderPreference.MIXED}>Mixed / Co-ed</option>
                  <option value={GenderPreference.MALE_ONLY}>Male Students Only</option>
                  <option value={GenderPreference.FEMALE_ONLY}>Female Students Only</option>
                </select>
              </div>

              {/* Distance Slider */}
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono text-white/50 uppercase mb-1">
                  <span>Max Campus Distance</span>
                  <span className="text-[#50E3C2] font-bold">{maxDistanceKm} km</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="20"
                  step="0.5"
                  value={maxDistanceKm}
                  onChange={(e) => setMaxDistanceKm(parseFloat(e.target.value))}
                  className="w-full accent-[#50E3C2] cursor-pointer"
                />
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="block text-[11px] font-mono text-white/50 uppercase mb-1">
                  Price Range ({activeRate.symbol})
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-1/2 p-2.5 bg-black/60 border border-white/10 rounded-xl text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#50E3C2]"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-1/2 p-2.5 bg-black/60 border border-white/10 rounded-xl text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#50E3C2]"
                  />
                </div>
              </div>
            </div>

            {/* Checkboxes Row */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 text-xs text-white/80 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFurnishedOnly}
                    onChange={(e) => setIsFurnishedOnly(e.target.checked)}
                    className="w-4 h-4 rounded text-[#50E3C2] focus:ring-0"
                  />
                  <span>Furnished Only</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-white/80 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={utilitiesIncludedOnly}
                    onChange={(e) => setUtilitiesIncludedOnly(e.target.checked)}
                    className="w-4 h-4 rounded text-[#50E3C2] focus:ring-0"
                  />
                  <span>Bills / Utilities Included</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-white/80 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={availableOnly}
                    onChange={(e) => setAvailableOnly(e.target.checked)}
                    className="w-4 h-4 rounded text-[#50E3C2] focus:ring-0"
                  />
                  <span>Available Beds Only</span>
                </label>
              </div>

              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-white/40 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Grid of Listings */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-[#12141D] border border-white/5 h-80 animate-pulse flex flex-col justify-between p-4"
            >
              <div className="h-44 bg-white/5 rounded-xl" />
              <div className="space-y-2">
                <div className="h-4 w-3/4 bg-white/5 rounded" />
                <div className="h-3 w-1/2 bg-white/5 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : displayedProperties.length === 0 ? (
        <div className="p-16 rounded-3xl bg-[#12141D] border border-white/5 text-center space-y-4">
          <Building2 className="w-12 h-12 text-white/20 mx-auto" />
          <h3 className="text-base font-bold text-white">No accommodation found matching your criteria</h3>
          <p className="text-xs text-white/50 max-w-md mx-auto">
            Try adjusting your search terms, campus distance slider, or clearing the filter options to see more listings.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-[#50E3C2] border border-[#50E3C2]/30 transition-colors inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedProperties.map((property) => (
            <AccommodationCard
              key={property.id}
              property={property}
              isSaved={savedIds.includes(property.id)}
              isSelectedForCompare={compareIds.includes(property.id)}
              onToggleSave={handleToggleSave}
              onToggleCompare={handleToggleCompare}
              onViewDetails={setDetailProperty}
              onInquire={setInquiryProperty}
            />
          ))}
        </div>
      )}

      {/* Floating Comparison Matrix Dock */}
      {compareIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#171923]/95 backdrop-blur-xl border border-white/15 px-5 py-3.5 rounded-full shadow-2xl flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#50E3C2]" />
            <span className="text-xs font-bold text-white">
              {compareIds.length} {compareIds.length === 1 ? 'Property' : 'Properties'} Selected
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCompareModalOpen(true)}
              className="px-4 py-1.5 rounded-full text-xs font-black bg-[#50E3C2] text-black hover:bg-[#38cbb0] transition-colors shadow-md shadow-[#50E3C2]/20"
            >
              Compare Matrix
            </button>
            <button
              type="button"
              onClick={() => setCompareIds([])}
              className="p-1.5 rounded-full bg-white/5 text-white/40 hover:text-white transition-colors"
              title="Clear comparison selection"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      {detailProperty && (
        <AccommodationDetailModal
          property={detailProperty}
          isOpen={!!detailProperty}
          isSaved={savedIds.includes(detailProperty.id)}
          onClose={() => setDetailProperty(null)}
          onToggleSave={handleToggleSave}
          onOpenInquiry={setInquiryProperty}
          onOpenReport={setReportProperty}
        />
      )}

      {inquiryProperty && (
        <InquiryModal
          property={inquiryProperty}
          isOpen={!!inquiryProperty}
          onClose={() => setInquiryProperty(null)}
          onSuccess={() => {
            // Optional feedback
          }}
        />
      )}

      {reportProperty && (
        <ReportListingModal
          property={reportProperty}
          isOpen={!!reportProperty}
          onClose={() => setReportProperty(null)}
        />
      )}

      <ListPropertyModal
        isOpen={isListModalOpen}
        onClose={() => setIsListModalOpen(false)}
        onSuccess={(newProp) => {
          loadProperties();
          setDetailProperty(newProp);
        }}
      />

      <LandlordDashboardModal
        isOpen={isLandlordModalOpen}
        onClose={() => setIsLandlordModalOpen(false)}
        onOpenListProperty={() => setIsListModalOpen(true)}
      />

      <AccommodationComparisonModal
        properties={compareProperties}
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        onRemove={(id) => setCompareIds(compareIds.filter((cid) => cid !== id))}
        onSelectProperty={(p) => {
          setIsCompareModalOpen(false);
          setDetailProperty(p);
        }}
      />

      <AccommodationAIModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onSelectProperty={(p) => {
          setIsAIModalOpen(false);
          setDetailProperty(p);
        }}
      />
    </div>
  );
}
