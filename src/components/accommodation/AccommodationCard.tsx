/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  ShieldCheck,
  Sparkles,
  Heart,
  Eye,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Wifi,
  Shield,
  Zap,
  BedDouble,
  Navigation,
} from 'lucide-react';
import { AccommodationListing, PropertyType, RoomType } from '../../types/index.js';
import { useCurrency } from '../../context/CurrencyContext.js';

interface AccommodationCardProps {
  key?: React.Key | string;
  property: AccommodationListing;
  isSaved?: boolean;
  isSelectedForCompare?: boolean;
  onToggleSave?: (propertyId: string) => void;
  onToggleCompare?: (propertyId: string) => void;
  onViewDetails: (property: AccommodationListing) => void;
  onInquire: (property: AccommodationListing) => void;
}

export function AccommodationCard({
  property,
  isSaved = false,
  isSelectedForCompare = false,
  onToggleSave,
  onToggleCompare,
  onViewDetails,
  onInquire,
}: AccommodationCardProps) {
  const { activeRate, convertPrice } = useCurrency();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = property.photos && property.photos.length > 0
    ? property.photos
    : [
        'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1522770179533-24471fcdba45?auto=format&fit=crop&w=800&q=80',
      ];

  // Dynamic conversion for display
  const convertedMonthly = convertPrice(property.price, property.currency);
  const isDifferentCurrency = activeRate.code !== property.currency;

  const roomTypeLabel = property.roomType ? property.roomType.replace('_', ' ') : 'Room';
  const propertyTypeLabel = property.propertyType ? property.propertyType.replace('_', ' ') : 'Residence';

  return (
    <div
      id={`accommodation-card-${property.id}`}
      className={`group rounded-2xl bg-[#12141D] border transition-all duration-200 flex flex-col overflow-hidden ${
        property.isPromoted
          ? 'border-[#50E3C2]/40 shadow-lg shadow-[#50E3C2]/5'
          : 'border-white/5 hover:border-white/20'
      }`}
    >
      {/* Image Banner */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/40">
        <img
          src={images[currentImageIndex]}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Top Badges Overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
          <div className="flex flex-wrap items-center gap-1.5">
            {property.isPromoted && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#50E3C2] text-black shadow-sm">
                <Sparkles className="w-3 h-3 fill-current" />
                Featured
              </span>
            )}
            {property.verificationBadge && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/90 text-white backdrop-blur-md">
                <ShieldCheck className="w-3 h-3" />
                Verified
              </span>
            )}
            <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-mono tracking-wider bg-black/60 text-white/90 backdrop-blur-md border border-white/10">
              {propertyTypeLabel}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {onToggleCompare && (
              <button
                type="button"
                onClick={() => onToggleCompare(property.id)}
                title="Compare with other listings"
                className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-colors ${
                  isSelectedForCompare
                    ? 'bg-[#50E3C2] text-black'
                    : 'bg-black/60 text-white/70 hover:text-white border border-white/10'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
              </button>
            )}
            {onToggleSave && (
              <button
                type="button"
                onClick={() => onToggleSave(property.id)}
                title={isSaved ? 'Remove from saved' : 'Save listing'}
                className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-colors ${
                  isSaved
                    ? 'bg-rose-500 text-white'
                    : 'bg-black/60 text-white/70 hover:text-rose-400 border border-white/10'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            )}
          </div>
        </div>

        {/* Bottom Distance & Availability Bar on Image */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none">
          {property.distanceFromCampusKm !== undefined && property.distanceFromCampusKm !== null && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium bg-black/70 text-[#50E3C2] backdrop-blur-md border border-white/10">
              <Navigation className="w-3 h-3" />
              {property.distanceFromCampusKm === 0
                ? 'On Campus'
                : `${property.distanceFromCampusKm} km to ${property.primaryCampusName || 'Campus'}`}
            </span>
          )}

          <span
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold backdrop-blur-md border ${
              property.availableUnits > 0
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30'
                : 'bg-rose-950/80 text-rose-300 border-rose-500/30'
            }`}
          >
            <BedDouble className="w-3 h-3" />
            {property.availableUnits > 0 ? `${property.availableUnits} available` : 'Fully Occupied'}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Institution and Location */}
          <div className="flex items-center gap-1.5 text-xs text-white/50 mb-1">
            <MapPin className="w-3.5 h-3.5 text-[#50E3C2] shrink-0" />
            <span className="truncate">{property.address}, {property.city}</span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onViewDetails(property)}
            className="text-base font-bold text-white group-hover:text-[#50E3C2] transition-colors line-clamp-1 cursor-pointer"
          >
            {property.title}
          </h3>

          {/* Room Specs & Key Features */}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="px-2 py-0.5 rounded-md bg-white/5 text-white/80 text-[11px] border border-white/5 font-medium capitalize">
              {roomTypeLabel}
            </span>
            {property.isFurnished && (
              <span className="px-2 py-0.5 rounded-md bg-white/5 text-[#50E3C2] text-[11px] border border-[#50E3C2]/20 font-medium">
                Furnished
              </span>
            )}
            {property.utilitiesIncluded && (
              <span className="px-2 py-0.5 rounded-md bg-white/5 text-emerald-400 text-[11px] border border-emerald-500/20 font-medium">
                Bills Included
              </span>
            )}
            {property.genderPreference && property.genderPreference !== 'MIXED' && (
              <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 text-[11px] border border-purple-500/20 font-medium">
                {property.genderPreference === 'MALE_ONLY' ? 'Men Only' : 'Women Only'}
              </span>
            )}
          </div>

          {/* Amenity Icons Preview */}
          <div className="flex items-center gap-3 text-white/40 text-xs mt-3 pt-2.5 border-t border-white/5">
            {property.amenities.slice(0, 3).map((amenity, idx) => (
              <span key={idx} className="flex items-center gap-1 text-[11px]">
                <CheckCircle2 className="w-3 h-3 text-[#50E3C2]/70 shrink-0" />
                <span className="truncate max-w-[90px]">{amenity}</span>
              </span>
            ))}
            {property.amenities.length > 3 && (
              <span className="text-[10px] text-white/30">+{property.amenities.length - 3} more</span>
            )}
          </div>
        </div>

        {/* Price & Actions Footer */}
        <div className="pt-3 border-t border-white/5 flex items-end justify-between gap-3">
          <div>
            <div className="text-[10px] text-white/40 uppercase tracking-wider font-mono">Monthly Rent</div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-white tracking-tight">
                {activeRate.symbol} {convertedMonthly.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
              <span className="text-xs text-white/40 font-mono">/mo</span>
            </div>
            {isDifferentCurrency && (
              <div className="text-[10px] text-white/40 font-mono">
                Orig: {property.currency} {property.price.toLocaleString()}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id={`btn-view-details-${property.id}`}
              onClick={() => onViewDetails(property)}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Details</span>
            </button>
            <button
              type="button"
              id={`btn-inquire-${property.id}`}
              onClick={() => onInquire(property)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#50E3C2] hover:bg-[#38cbb0] text-black transition-all flex items-center gap-1.5 shadow-sm"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Inquire</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
