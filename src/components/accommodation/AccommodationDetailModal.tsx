/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Building2,
  MapPin,
  ShieldCheck,
  Sparkles,
  BedDouble,
  Navigation,
  CheckCircle2,
  AlertTriangle,
  Heart,
  Share2,
  MessageSquare,
  Star,
  UserCheck,
  Calendar,
  DollarSign,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Info,
  Clock,
  Phone,
  Mail,
  Send,
} from 'lucide-react';
import { AccommodationListing, PropertyReview } from '../../types/index.js';
import { useCurrency } from '../../context/CurrencyContext.js';
import { useAuth } from '../../context/AuthContext.js';
import { api } from '../../services/api.js';

interface AccommodationDetailModalProps {
  property: AccommodationListing;
  isOpen: boolean;
  isSaved?: boolean;
  onClose: () => void;
  onToggleSave?: (propertyId: string) => void;
  onOpenInquiry: (property: AccommodationListing) => void;
  onOpenReport: (property: AccommodationListing) => void;
}

export function AccommodationDetailModal({
  property,
  isOpen,
  isSaved = false,
  onClose,
  onToggleSave,
  onOpenInquiry,
  onOpenReport,
}: AccommodationDetailModalProps) {
  const { activeRate, convertPrice } = useCurrency();
  const { user } = useAuth();
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [reviews, setReviews] = useState<PropertyReview[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const photos = property.photos && property.photos.length > 0
    ? property.photos
    : [
        'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1522770179533-24471fcdba45?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      ];

  useEffect(() => {
    if (isOpen) {
      loadReviews();
    }
  }, [isOpen, property.id]);

  async function loadReviews() {
    try {
      setIsLoadingReviews(true);
      const res = await api.getPropertyReviews(property.id);
      setReviews(res.reviews || []);
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setIsLoadingReviews(false);
    }
  }

  async function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setIsSubmittingReview(true);
      await api.submitPropertyReview({
        propertyId: property.id,
        rating: newRating,
        comment: newComment.trim(),
      });
      setReviewMessage('Your review has been submitted successfully!');
      setNewComment('');
      setShowReviewForm(false);
      loadReviews();
    } catch (err: any) {
      setReviewMessage(`Review submission error: ${err.message}`);
    } finally {
      setIsSubmittingReview(false);
    }
  }

  function handleCopyShare() {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  }

  if (!isOpen) return null;

  const convertedMonthly = convertPrice(property.price, property.currency);
  const convertedDeposit = property.deposit
    ? convertPrice(property.deposit, property.currency)
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div
        id="accommodation-detail-modal"
        className="relative w-full max-w-4xl bg-[#12141D] border border-white/10 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#171923]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#50E3C2]/10 text-[#50E3C2] flex items-center justify-center border border-[#50E3C2]/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-mono tracking-wider text-[#50E3C2]">
                  {property.propertyType.replace('_', ' ')}
                </span>
                {property.verificationBadge && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <ShieldCheck className="w-3 h-3" />
                    Verified Campus Accommodation
                  </span>
                )}
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight line-clamp-1">{property.title}</h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onToggleSave && (
              <button
                type="button"
                onClick={() => onToggleSave(property.id)}
                className={`p-2 rounded-xl border transition-colors ${
                  isSaved
                    ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                    : 'bg-white/5 border-white/10 text-white/70 hover:text-white'
                }`}
                title={isSaved ? 'Remove from Saved' : 'Save Property'}
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            )}
            <button
              type="button"
              onClick={handleCopyShare}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-colors"
              title="Share listing"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {copiedLink && (
            <div className="p-3 bg-[#50E3C2]/10 border border-[#50E3C2]/30 rounded-xl text-xs text-[#50E3C2] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Listing link copied to clipboard!
            </div>
          )}

          {/* Photo Gallery with Slider */}
          <div className="space-y-3">
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-black/60 border border-white/5">
              <img
                src={photos[activePhotoIdx]}
                alt={property.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />

              {photos.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setActivePhotoIdx((prev) => (prev === 0 ? photos.length - 1 : prev - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/10 backdrop-blur-md transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivePhotoIdx((prev) => (prev === photos.length - 1 ? 0 : prev + 1))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/10 backdrop-blur-md transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full text-xs font-mono bg-black/70 text-white/90 backdrop-blur-md border border-white/10">
                {activePhotoIdx + 1} / {photos.length}
              </div>
            </div>

            {/* Thumbnail Row */}
            {photos.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {photos.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActivePhotoIdx(idx)}
                    className={`relative w-20 aspect-video rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                      activePhotoIdx === idx ? 'border-[#50E3C2] scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={url} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Pricing & Quick Highlights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
              <div className="text-xs text-white/40 font-mono uppercase">Monthly Rent</div>
              <div className="text-2xl font-black text-white">
                {activeRate.symbol} {convertedMonthly.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                <span className="text-xs text-white/40 font-normal ml-1">/ month</span>
              </div>
              <div className="text-xs text-[#50E3C2] font-mono">
                Original: {property.currency} {property.price.toLocaleString()}
              </div>
              {convertedDeposit && (
                <div className="text-[11px] text-white/50 pt-1 border-t border-white/5">
                  Refundable Deposit: {activeRate.symbol} {convertedDeposit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
              )}
            </div>

            {/* Location & Proximity */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
              <div className="text-xs text-white/40 font-mono uppercase">Location & Campus</div>
              <div className="flex items-center gap-1.5 text-sm font-semibold text-white">
                <MapPin className="w-4 h-4 text-[#50E3C2] shrink-0" />
                <span className="truncate">{property.city}, {property.country}</span>
              </div>
              <div className="text-xs text-white/60 truncate">{property.address}</div>
              {property.distanceFromCampusKm !== undefined && (
                <div className="text-xs text-[#50E3C2] font-medium flex items-center gap-1 pt-1 border-t border-white/5">
                  <Navigation className="w-3.5 h-3.5" />
                  {property.distanceFromCampusKm} km from {property.primaryCampusName || 'Campus'}
                </div>
              )}
            </div>

            {/* Availability & Units */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
              <div className="text-xs text-white/40 font-mono uppercase">Availability</div>
              <div className="text-lg font-bold text-white flex items-center gap-2">
                <BedDouble className="w-4 h-4 text-[#50E3C2]" />
                <span>{property.availableUnits} of {property.totalUnits} Units Available</span>
              </div>
              <div className="text-xs text-white/50">
                Room Layout: <span className="text-white font-medium capitalize">{property.roomType.replace('_', ' ')}</span>
              </div>
              <div className="text-[11px] text-emerald-400 pt-1 border-t border-white/5">
                {property.availableUnits > 0 ? 'Ready for immediate booking / viewing' : 'Currently fully occupied'}
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">About This Accommodation</h3>
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed whitespace-pre-line bg-white/[0.02] p-4 rounded-xl border border-white/5">
              {property.description}
            </p>
          </div>

          {/* Granular Unit Table (If Present) */}
          {property.units && property.units.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Room & Unit Types</h3>
              <div className="overflow-x-auto border border-white/10 rounded-xl bg-white/[0.02]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/5 border-b border-white/10 text-white/60 font-mono uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Unit / Room</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Beds</th>
                      <th className="p-3">Rent</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-white/80">
                    {property.units.map((unit) => (
                      <tr key={unit.id} className="hover:bg-white/5">
                        <td className="p-3 font-semibold text-white">{unit.name}</td>
                        <td className="p-3 capitalize">{unit.roomType.replace('_', ' ')}</td>
                        <td className="p-3">{unit.totalBeds} ({unit.availableBeds} free)</td>
                        <td className="p-3 font-mono text-[#50E3C2]">
                          {unit.currency} {unit.price.toLocaleString()}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              unit.isAvailable ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                            }`}
                          >
                            {unit.isAvailable ? 'Available' : 'Occupied'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Amenities Grid */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Included Amenities & Services</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {property.amenities.map((amenity, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs text-white/80"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#50E3C2] shrink-0" />
                  <span className="truncate">{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* House Rules & Policies */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Policy & Rules</h4>
              <div className="space-y-1.5 text-xs text-white/70">
                <div className="flex items-center justify-between">
                  <span>Gender Policy:</span>
                  <span className="font-semibold text-white">
                    {property.genderPreference === 'MALE_ONLY'
                      ? 'Male Students Only'
                      : property.genderPreference === 'FEMALE_ONLY'
                      ? 'Female Students Only'
                      : 'Mixed / Co-ed'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Utilities / Bills:</span>
                  <span className="font-semibold text-white">
                    {property.utilitiesIncluded ? 'Included in Rent' : 'Billed Separately'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Furnished Status:</span>
                  <span className="font-semibold text-white">
                    {property.isFurnished ? 'Fully Furnished' : 'Unfurnished'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Landlord & Verification</h4>
              <div className="space-y-1.5 text-xs text-white/70">
                <div className="flex items-center justify-between">
                  <span>Property Owner:</span>
                  <span className="font-semibold text-white">{property.ownerName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Enermind Verification:</span>
                  <span className="font-semibold text-emerald-400">
                    {property.verificationBadge ? 'Verified Title Deed & ID' : 'Standard Unverified'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Listing Expiry:</span>
                  <span className="font-mono text-white/50">
                    {new Date(property.expiresAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Student Reviews & Ratings */}
          <div className="space-y-4 pt-4 border-t border-white/5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400 fill-current" />
                  Student Reviews & Feedback ({reviews.length})
                </h3>
                <p className="text-xs text-white/40">Real verified student experiences for this property.</p>
              </div>

              <button
                type="button"
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-[#50E3C2] border border-[#50E3C2]/30 transition-colors"
              >
                {showReviewForm ? 'Cancel Review' : 'Write a Review'}
              </button>
            </div>

            {reviewMessage && (
              <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white">
                {reviewMessage}
              </div>
            )}

            {/* Write Review Form */}
            {showReviewForm && (
              <form onSubmit={handleSubmitReview} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/60">Your Rating:</span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewRating(star)}
                      className="p-1 text-amber-400 transition-transform hover:scale-110"
                    >
                      <Star className={`w-4 h-4 ${star <= newRating ? 'fill-current' : 'text-white/20'}`} />
                    </button>
                  ))}
                  <span className="text-xs font-mono text-white/80 ml-2">{newRating} / 5 Stars</span>
                </div>

                <textarea
                  rows={3}
                  placeholder="Describe cleanliness, Wi-Fi speed, security, distance to campus, landlord responsiveness..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#50E3C2]"
                  required
                />

                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#50E3C2] text-black hover:bg-[#38cbb0] transition-colors disabled:opacity-50"
                >
                  {isSubmittingReview ? 'Submitting...' : 'Post Review'}
                </button>
              </form>
            )}

            {/* Reviews List */}
            <div className="space-y-3">
              {reviews.length === 0 ? (
                <div className="p-6 text-center text-xs text-white/40 bg-white/[0.02] rounded-xl border border-white/5">
                  No student reviews yet. Be the first campus resident to leave feedback!
                </div>
              ) : (
                reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{rev.userName}</span>
                        <div className="flex items-center text-amber-400">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current" />
                          ))}
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-white/40">
                        {new Date(rev.createdDate).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-white/70 leading-relaxed">{rev.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions Bar */}
        <div className="px-6 py-4 border-t border-white/5 bg-[#171923] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onOpenReport(property)}
            className="text-xs text-white/40 hover:text-rose-400 flex items-center gap-1.5 transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Report incorrect info or scam</span>
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              id="btn-modal-inquire"
              onClick={() => {
                onClose();
                onOpenInquiry(property);
              }}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-xs font-bold bg-[#50E3C2] hover:bg-[#38cbb0] text-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#50E3C2]/10"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Contact Landlord & Inquire</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
