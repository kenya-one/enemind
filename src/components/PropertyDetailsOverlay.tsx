import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  ShieldCheck,
  Music,
  FileText,
  Calendar,
  GraduationCap,
  Eye,
  ChevronUp,
  ChevronDown,
  ArrowRight
} from 'lucide-react';
import { RentalListing } from '../types';
import { KENYAN_CAMPUSES } from '../data/campuses';

interface PropertyDetailsOverlayProps {
  listing: RentalListing;
  isClearMode: boolean;
  onToggleClearMode: () => void;
  onOpenFullDetails: () => void;
  onOpenCertifiedDocs: () => void;
  onOpenLandlordProfile?: () => void;
}

export const PropertyDetailsOverlay: React.FC<PropertyDetailsOverlayProps> = ({
  listing,
  isClearMode,
  onToggleClearMode,
  onOpenFullDetails,
  onOpenCertifiedDocs,
  onOpenLandlordProfile
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const matchedCampus = listing.campusInfo
    ? KENYAN_CAMPUSES.find(
        (c) =>
          c.name.toLowerCase().includes(listing.campusInfo!.university.toLowerCase()) ||
          listing.campusInfo!.university.toLowerCase().includes(c.acronym.toLowerCase())
      )
    : null;

  // If user turned on Clear Mode, show a small discreet pill to restore info
  if (isClearMode) {
    return (
      <div className="absolute left-3.5 bottom-3.5 z-30 pointer-events-auto select-none">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleClearMode();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 text-xs font-semibold shadow-xl transition-all"
          title="Show Text & Property Details"
        >
          <Eye className="w-3.5 h-3.5 text-[#FFD700]" />
          <span>Show Info</span>
        </button>
      </div>
    );
  }

  return (
    <div className="absolute left-0 right-14 sm:right-16 bottom-11 sm:bottom-12 z-20 px-3 sm:px-4 pointer-events-auto select-none">
      <div className="space-y-1 text-white max-w-lg">
        {/* Top Badges Row */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Campus Circle Logo & Distance Badge if applicable */}
          {listing.campusInfo && (
            <div className="px-2 py-0.5 bg-amber-500 text-black text-[9px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1 shadow-sm">
              {matchedCampus ? (
                <div
                  className="w-3.5 h-3.5 rounded-full flex items-center justify-center font-mono font-black text-[7px] text-white shadow-xs shrink-0 ring-1 ring-black/40"
                  style={{
                    background: `linear-gradient(135deg, ${matchedCampus.primaryColor}, ${matchedCampus.secondaryColor})`
                  }}
                >
                  {matchedCampus.acronym.slice(0, 3)}
                </div>
              ) : (
                <GraduationCap className="w-3 h-3 text-black shrink-0" />
              )}
              <span className="truncate max-w-[130px] sm:max-w-[180px]">
                {listing.campusInfo.distanceToGate || listing.campusInfo.university}
              </span>
            </div>
          )}

          {/* Certified Doc Badge */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenCertifiedDocs();
            }}
            className="px-2 py-0.5 bg-green-600/90 hover:bg-green-500 text-white text-[9px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1 transition-colors shadow-sm"
          >
            <ShieldCheck className="w-2.5 h-2.5 text-white" />
            <span>Certified</span>
          </button>

          {/* Location Estate Badge */}
          <div className="px-2 py-0.5 bg-black/60 backdrop-blur-md text-white text-[9px] font-semibold tracking-wide rounded-full border border-white/15">
            {listing.estate}
          </div>

          {/* Landlord Chip */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onOpenLandlordProfile) onOpenLandlordProfile();
              else onOpenFullDetails();
            }}
            className="px-2 py-0.5 bg-black/60 hover:bg-black/90 backdrop-blur-md rounded-full border border-white/15 hover:border-[#FFD700] text-[9px] text-gray-200 flex items-center gap-1 transition-all"
          >
            <img
              src={listing.landlord.avatarUrl}
              alt={listing.landlord.name}
              className="w-3 h-3 rounded-full object-cover border border-[#FFD700]"
            />
            <span className="font-semibold text-white truncate max-w-[90px]">
              {listing.landlord.name}
            </span>
            <CheckCircle2 className="w-2.5 h-2.5 text-[#FFD700]" />
          </button>
        </div>

        {/* Property Title */}
        <h2
          onClick={onOpenFullDetails}
          className="text-sm sm:text-base font-semibold text-white tracking-tight leading-tight cursor-pointer hover:text-[#FFD700] transition-colors drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] line-clamp-1"
        >
          {listing.title}
        </h2>

        {/* Price & Specs Strip */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <p className="text-sm sm:text-base text-[#FFD700] font-bold tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
            KSh {listing.priceKes.toLocaleString()}
            <span className="text-[9px] sm:text-[10px] text-gray-300 uppercase tracking-wider font-normal ml-0.5">/mo</span>
          </p>

          <span className="text-neutral-500 text-xs">•</span>

          <span className="text-[10px] sm:text-[11px] text-neutral-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
            {listing.bedrooms === 0 ? 'Studio' : `${listing.bedrooms} Bed`}
          </span>

          <span className="text-neutral-500 text-xs">•</span>

          <span className="text-[10px] sm:text-[11px] text-neutral-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
            {listing.sqFt.toLocaleString()} sqft
          </span>

          {/* Quick Details Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenFullDetails();
            }}
            className="px-2 py-0.5 rounded-full bg-white/15 hover:bg-white/30 text-white text-[9px] font-bold uppercase tracking-wider backdrop-blur-md border border-white/20 transition-all flex items-center gap-0.5 ml-1"
          >
            <span>Details</span>
            <ArrowRight className="w-2.5 h-2.5" />
          </button>

          {/* Toggle More/Less Details */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="text-[9px] text-[#FFD700] hover:underline font-bold flex items-center gap-0.5 ml-0.5"
          >
            <span>{isExpanded ? 'Less' : 'Amenities'}</span>
            {isExpanded ? <ChevronDown className="w-2.5 h-2.5" /> : <ChevronUp className="w-2.5 h-2.5" />}
          </button>
        </div>

        {/* Expandable Extra Details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden space-y-1.5 pt-1"
            >
              <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] text-neutral-200 bg-black/75 backdrop-blur-md p-2 rounded-xl border border-white/10">
                {listing.amenities.slice(0, 4).map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 truncate">
                    <span className="w-1 h-1 bg-[#FFD700] rounded-full shrink-0"></span>
                    <span className="truncate">{amenity.label}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-0.5">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenCertifiedDocs();
                  }}
                  className="bg-white text-black px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider hover:bg-[#FFD700] transition-colors rounded-full shadow-md flex items-center gap-1"
                >
                  <FileText className="w-2.5 h-2.5" />
                  <span>Docs</span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenFullDetails();
                  }}
                  className="bg-black/70 border border-[#FFD700] text-[#FFD700] px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider hover:bg-[#FFD700] hover:text-black transition-colors rounded-full backdrop-blur-sm flex items-center gap-1"
                >
                  <Calendar className="w-2.5 h-2.5" />
                  <span>Book Tour</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Minimal Audio Ticker */}
        <div className="flex items-center gap-1.5 text-[8.5px] text-neutral-400 pt-0.5">
          <Music className="w-2.5 h-2.5 text-[#FFD700] shrink-0" />
          <span className="font-mono tracking-wider text-neutral-300 truncate max-w-[180px] sm:max-w-[240px]">
            {listing.audioTrack.title}
          </span>
        </div>
      </div>
    </div>
  );
};
