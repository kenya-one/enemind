import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Phone,
  MessageSquare,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Info,
  Car,
  ChevronLeft,
  ChevronRight,
  Send,
  Zap,
  Droplets,
  Award,
  GraduationCap,
  Users2,
  Sparkles,
  Lock
} from 'lucide-react';
import { RentalListing, UserProfile, LandlordProfile } from '../types';
import { KENYAN_CAMPUSES } from '../data/campuses';
import { AmenityIcon } from './AmenityIcon';

interface PropertyFullDetailsModalProps {
  listing: RentalListing;
  isOpen: boolean;
  onClose: () => void;
  onOpenCertifiedDocs: () => void;
  onOpenLandlordProfile?: (landlord: LandlordProfile) => void;
  currentUser: UserProfile;
  onBookTour: (tourData: { date: string; time: string; notes: string }) => void;
}

export const PropertyFullDetailsModal: React.FC<PropertyFullDetailsModalProps> = ({
  listing,
  isOpen,
  onClose,
  onOpenCertifiedDocs,
  onOpenLandlordProfile,
  currentUser,
  onBookTour
}) => {
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [tourDate, setTourDate] = useState('');
  const [tourTime, setTourTime] = useState('10:00 AM');
  const [tourNotes, setTourNotes] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  if (!isOpen) return null;

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tourDate) return;
    onBookTour({
      date: tourDate,
      time: tourTime,
      notes: tourNotes
    });
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setShowBookingForm(false);
    }, 2200);
  };

  const handleWhatsAppCaretaker = () => {
    const text = encodeURIComponent(
      `Hello ${listing.landlord.name}, I am interested in viewing "${listing.title}" in ${listing.estate} (KSh ${listing.priceKes.toLocaleString()}/mo) found on Kenya House Hunt.`
    );
    window.open(`https://wa.me/${listing.landlord.whatsapp.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  const handleCallCaretaker = () => {
    window.open(`tel:${listing.landlord.phone}`, '_self');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="relative w-full max-w-3xl bg-[#111111] border border-white/15 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-neutral-100"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#0a0a0a] z-10">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-green-600 text-white">
                Certified
              </span>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-white/10 text-white border border-white/20">
                {listing.category.toUpperCase()} • {listing.estate}
              </span>
              <span className="text-[10px] text-neutral-400 font-mono">ID: {listing.id}</span>
            </div>
            <button
              onClick={onClose}
              id="close-full-details-modal-btn"
              className="p-1.5 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="overflow-y-auto p-4 sm:p-6 space-y-6 flex-1 bg-[#111111]">
            {/* Image Gallery Carousel */}
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-video group border border-white/10">
              <img
                src={listing.mediaUrls[activeImageIdx] || listing.thumbnailUrl}
                alt={listing.title}
                className="w-full h-full object-cover transition-all duration-300"
              />
              {/* Prev / Next buttons */}
              {listing.mediaUrls.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setActiveImageIdx((prev) => (prev === 0 ? listing.mediaUrls.length - 1 : prev - 1))
                    }
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black text-white backdrop-blur transition-all border border-white/10"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      setActiveImageIdx((prev) => (prev === listing.mediaUrls.length - 1 ? 0 : prev + 1))
                    }
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black text-white backdrop-blur transition-all border border-white/10"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  {/* Dots / Thumbnail bar */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/70 px-3 py-1.5 rounded-full backdrop-blur border border-white/10">
                    {listing.mediaUrls.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImageIdx(i)}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${
                          activeImageIdx === i ? 'bg-[#FFD700] w-6' : 'bg-white/40 hover:bg-white'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Title & Pricing Block */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-serif font-light text-white leading-tight">{listing.title}</h2>
                <p className="text-xs sm:text-sm text-neutral-400 mt-1 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#FFD700] shrink-0" />
                  {listing.address}
                </p>
              </div>
              <div className="sm:text-right">
                <div className="text-2xl sm:text-3xl font-light text-[#FFD700]">
                  KSh {listing.priceKes.toLocaleString()}
                  <span className="text-xs text-neutral-400 font-normal uppercase tracking-wider"> / {listing.pricePeriod}</span>
                </div>
                <div className="text-xs text-neutral-400 mt-0.5">
                  {listing.serviceChargeIncluded ? (
                    <span className="text-[#FFD700] font-medium">✓ Service Charge Included</span>
                  ) : (
                    <span>+ KSh {listing.serviceChargeKes?.toLocaleString()} Service Charge</span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#181818] border border-white/10 rounded-xl p-3 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/5 text-[#FFD700]">
                  <Bed className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase text-neutral-400 font-semibold tracking-wider">Bedrooms</span>
                  <div className="text-sm font-bold text-white">
                    {listing.bedrooms === 0 ? 'Studio Suite' : `${listing.bedrooms} Bedroom`}
                  </div>
                </div>
              </div>

              <div className="bg-[#181818] border border-white/10 rounded-xl p-3 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/5 text-[#FFD700]">
                  <Bath className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase text-neutral-400 font-semibold tracking-wider">Bathrooms</span>
                  <div className="text-sm font-bold text-white">{listing.bathrooms} Baths</div>
                </div>
              </div>

              <div className="bg-[#181818] border border-white/10 rounded-xl p-3 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/5 text-[#FFD700]">
                  <Maximize2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase text-neutral-400 font-semibold tracking-wider">Floor Area</span>
                  <div className="text-sm font-bold text-white">{listing.sqFt.toLocaleString()} sq.ft</div>
                </div>
              </div>

              <div className="bg-[#181818] border border-white/10 rounded-xl p-3 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/5 text-[#FFD700]">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase text-neutral-400 font-semibold tracking-wider">Parking</span>
                  <div className="text-sm font-bold text-white">{listing.parkingSpots} Allocated Spot</div>
                </div>
              </div>
            </div>

            {/* Campus & Student Perks Section */}
            {listing.campusInfo && (() => {
              const matchedCampus = KENYAN_CAMPUSES.find(
                (c) =>
                  c.name.toLowerCase().includes(listing.campusInfo!.university.toLowerCase()) ||
                  listing.campusInfo!.university.toLowerCase().includes(c.acronym.toLowerCase())
              );
              return (
                <div className="bg-gradient-to-br from-[#1c1800] via-[#161616] to-[#0f0f0f] border border-[#FFD700]/30 rounded-2xl p-4 sm:p-5 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-[#FFD700]/20">
                    <div className="flex items-center gap-3">
                      {matchedCampus ? (
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-lg border border-white/20 relative overflow-hidden shrink-0 ring-2 ring-[#FFD700]/40"
                          style={{
                            background: `linear-gradient(135deg, ${matchedCampus.primaryColor}, ${matchedCampus.secondaryColor})`
                          }}
                        >
                          <div className="absolute inset-0 bg-black/20" />
                          <span className="relative z-10 font-mono font-black text-xs">
                            {matchedCampus.acronym.slice(0, 4)}
                          </span>
                        </div>
                      ) : (
                        <div className="p-2 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/30 text-[#FFD700]">
                          <GraduationCap className="w-5 h-5" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-serif font-light text-base text-white">Campus Student Housing Details</h3>
                        <p className="text-xs text-[#FFD700] font-medium">{listing.campusInfo.university} • {listing.campusInfo.campusBranch}</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FFD700] text-black">
                      {listing.campusInfo.distanceToGate}
                    </span>
                  </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-black/40 p-3 rounded-xl border border-white/10 space-y-1">
                    <div className="flex items-center gap-1.5 text-[#FFD700] font-semibold">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Commute & Walking Time</span>
                    </div>
                    <p className="text-neutral-300">~{listing.campusInfo.walkingMinutes} min walk to lecture halls & main gate</p>
                  </div>

                  <div className="bg-black/40 p-3 rounded-xl border border-white/10 space-y-1">
                    <div className="flex items-center gap-1.5 text-[#FFD700] font-semibold">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Student Compound Security</span>
                    </div>
                    <p className="text-neutral-300">{listing.campusInfo.securityLevel}</p>
                  </div>

                  {listing.campusInfo.roommateMatchingAvailable && (
                    <div className="bg-black/40 p-3 rounded-xl border border-white/10 space-y-1 sm:col-span-2">
                      <div className="flex items-center gap-1.5 text-green-400 font-semibold">
                        <Users2 className="w-3.5 h-3.5" />
                        <span>Roommate Sharing Supported</span>
                      </div>
                      <p className="text-neutral-300">
                        Splits rent to approximately <span className="text-[#FFD700] font-semibold">KSh {Math.round(listing.priceKes / 2).toLocaleString()} / person</span>. Connect with verified campus students.
                      </p>
                    </div>
                  )}
                </div>

                {listing.campusInfo.studentPerks && listing.campusInfo.studentPerks.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Student Included Perks</span>
                    <div className="flex flex-wrap gap-1.5">
                      {listing.campusInfo.studentPerks.map((perk, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-neutral-200 text-xs flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3 text-[#FFD700]" />
                          {perk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

            {/* Description */}
            <div className="space-y-2">
              <h3 className="font-serif font-light text-base sm:text-lg text-white">Property Description</h3>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed bg-[#181818] p-4 rounded-xl border border-white/10">
                {listing.description}
              </p>
            </div>

            {/* Kenyan Utilities & Terms */}
            <div className="space-y-3">
              <h3 className="font-serif font-light text-base sm:text-lg text-white">Move-in Terms & Utilities</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-[#181818] p-3 rounded-xl border border-white/10 space-y-1">
                  <div className="flex items-center gap-1.5 text-[#FFD700] font-semibold">
                    <Droplets className="w-4 h-4" />
                    <span>Water Supply</span>
                  </div>
                  <p className="text-neutral-300">{listing.waterSupply}</p>
                </div>

                <div className="bg-[#181818] p-3 rounded-xl border border-white/10 space-y-1">
                  <div className="flex items-center gap-1.5 text-[#FFD700] font-semibold">
                    <Zap className="w-4 h-4" />
                    <span>Electricity Type</span>
                  </div>
                  <p className="text-neutral-300">{listing.electricityType}</p>
                </div>

                <div className="bg-[#181818] p-3 rounded-xl border border-white/10 space-y-1 sm:col-span-2">
                  <div className="flex items-center gap-1.5 text-[#FFD700] font-semibold">
                    <Info className="w-4 h-4" />
                    <span>Deposit & Financial Terms</span>
                  </div>
                  <p className="text-neutral-300">{listing.depositTerms}</p>
                </div>
              </div>
            </div>

            {/* All Features & Amenities Matrix */}
            <div className="space-y-3">
              <h3 className="font-serif font-light text-base sm:text-lg text-white">Full Features & Compound Amenities</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {listing.amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-[#181818] border border-white/10 text-neutral-200 text-xs"
                  >
                    <span className="w-1.5 h-1.5 bg-[#FFD700] rounded-full shrink-0"></span>
                    <span className="font-medium">{amenity.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Certified Docs Quick Trigger */}
            <div className="bg-gradient-to-r from-black via-[#161616] to-black border border-white/20 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-green-600/20 text-green-400 border border-green-500/30">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-serif font-light text-white text-base">Certified Legal Documents Attached</h4>
                  <p className="text-xs text-neutral-400">
                    Title deed, County occupancy permit & NCA structural certificates verified.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenCertifiedDocs();
                }}
                className="px-5 py-2.5 rounded bg-white text-black hover:bg-[#FFD700] text-xs font-bold uppercase tracking-widest shadow-lg transition-all whitespace-nowrap"
              >
                Inspect Official Documents
              </button>
            </div>

            {/* Physical Tour Booking Scheduler */}
            <div className="bg-[#181818] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#FFD700]" />
                  <h3 className="font-serif font-light text-base sm:text-lg text-white">Book a Physical Viewing Tour</h3>
                </div>
                {!showBookingForm && (
                  <button
                    onClick={() => setShowBookingForm(true)}
                    className="px-3.5 py-1.5 rounded bg-[#FFD700] text-black font-bold uppercase text-[10px] tracking-wider hover:bg-[#ffe033] transition-colors"
                  >
                    Schedule Slot
                  </button>
                )}
              </div>

              {showBookingForm ? (
                <form onSubmit={handleBookingSubmit} className="space-y-3 pt-2">
                  {bookingSuccess ? (
                    <div className="p-4 rounded-xl bg-[#FFD700]/20 border border-[#FFD700] text-[#FFD700] text-xs text-center flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-[#FFD700]" />
                      <span>Physical Viewing Booked! Caretaker notified on WhatsApp.</span>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-1">Select Viewing Date</label>
                          <input
                            type="date"
                            required
                            value={tourDate}
                            onChange={(e) => setTourDate(e.target.value)}
                            className="w-full bg-black border border-white/20 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD700]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-1">Preferred Time</label>
                          <select
                            value={tourTime}
                            onChange={(e) => setTourTime(e.target.value)}
                            className="w-full bg-black border border-white/20 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD700]"
                          >
                            <option value="09:00 AM">09:00 AM (Morning)</option>
                            <option value="11:00 AM">11:00 AM (Late Morning)</option>
                            <option value="02:00 PM">02:00 PM (Afternoon)</option>
                            <option value="04:30 PM">04:30 PM (Evening)</option>
                            <option value="Saturday 10:00 AM">Saturday 10:00 AM (Weekend)</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-1">Notes for Caretaker (Optional)</label>
                        <input
                          type="text"
                          value={tourNotes}
                          onChange={(e) => setTourNotes(e.target.value)}
                          placeholder="e.g. Coming with my family, want to inspect master bedroom closet"
                          className="w-full bg-black border border-white/20 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD700]"
                        />
                      </div>
                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setShowBookingForm(false)}
                          className="px-4 py-2 rounded bg-white/10 text-neutral-300 text-xs uppercase tracking-wider font-semibold hover:bg-white/20"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded bg-[#FFD700] hover:bg-[#ffe033] text-black text-xs font-bold uppercase tracking-wider shadow"
                        >
                          Confirm Viewing Slot
                        </button>
                      </div>
                    </>
                  )}
                </form>
              ) : (
                <p className="text-xs text-neutral-400">
                  Free guided physical inspection with verified caretaker on site. Pick your preferred weekday or weekend slot.
                </p>
              )}
            </div>

            {/* Landlord Profile Card */}
            <div className="bg-[#181818] border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={listing.landlord.avatarUrl}
                  alt={listing.landlord.name}
                  className="w-13 h-13 rounded-full object-cover border-2 border-[#FFD700] shadow-md"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-white text-sm sm:text-base">{listing.landlord.name}</h4>
                    <CheckCircle2 className="w-4 h-4 text-[#FFD700]" />
                  </div>
                  <p className="text-xs text-[#FFD700] font-medium">{listing.landlord.handle}</p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">{listing.landlord.bio}</p>
                </div>
              </div>

              {onOpenLandlordProfile && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenLandlordProfile(listing.landlord);
                  }}
                  className="px-4 py-2 rounded bg-white/10 hover:bg-[#FFD700] hover:text-black border border-white/20 text-white text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap"
                >
                  View Agency Profile
                </button>
              )}
            </div>
          </div>

          {/* Sticky Bottom Actions */}
          <div className="p-4 border-t border-white/10 bg-[#0a0a0a] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={handleCallCaretaker}
                className="px-4 py-2.5 rounded bg-white/10 hover:bg-white/20 text-neutral-200 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors border border-white/10"
              >
                <Phone className="w-4 h-4 text-[#FFD700]" />
                <span>Call Caretaker</span>
              </button>
              <button
                onClick={handleWhatsAppCaretaker}
                className="px-5 py-2.5 rounded bg-white text-black hover:bg-[#FFD700] text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Caretaker</span>
              </button>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded border border-white/20 text-xs text-neutral-300 font-bold uppercase tracking-wider hover:bg-white/10 transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
