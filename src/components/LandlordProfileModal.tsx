import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  CheckCircle2,
  Star,
  Building,
  Phone,
  MessageSquare,
  Clock,
  MapPin,
  ShieldCheck,
  Award,
  Calendar,
  Share2,
  UserCheck,
  UserPlus,
  Send,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Zap,
  Check
} from 'lucide-react';
import { LandlordProfile, RentalListing, UserProfile, LandlordReview } from '../types';
import { ENERMIND_LOGO_URL } from '../data/enerHubData';

interface LandlordProfileModalProps {
  landlord: LandlordProfile | null;
  isOpen: boolean;
  onClose: () => void;
  allListings: RentalListing[];
  currentUser: UserProfile;
  onToggleFollow: (landlordId: string) => void;
  onSelectListing: (listing: RentalListing) => void;
}

export const LandlordProfileModal: React.FC<LandlordProfileModalProps> = ({
  landlord,
  isOpen,
  onClose,
  allListings,
  currentUser,
  onToggleFollow,
  onSelectListing
}) => {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'reviews' | 'about'>('portfolio');
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [reviewsList, setReviewsList] = useState<LandlordReview[]>([]);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Initialize or update reviews when landlord changes
  React.useEffect(() => {
    if (landlord) {
      if (landlord.reviews && landlord.reviews.length > 0) {
        setReviewsList(landlord.reviews);
      } else {
        // Default verified tenant reviews for this landlord
        setReviewsList([
          {
            id: 'rev-1',
            tenantName: 'Wanjiku Mwangi',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
            rating: 5,
            date: '2 weeks ago',
            comment: 'Very professional landlord! Water was never interrupted and our security deposit was refunded in full within 48 hours of vacating.',
            rentalTitle: 'Kilimani Executive 2BR'
          },
          {
            id: 'rev-2',
            tenantName: 'Otiende Amollo',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
            rating: 5,
            date: '1 month ago',
            comment: 'Clear tenancy agreement with no hidden charges. Caretaker responds to minor plumbing issues within 15 minutes on WhatsApp.',
            rentalTitle: 'Ruaka Skyline 1BR'
          },
          {
            id: 'rev-3',
            tenantName: 'Rachel Kimani',
            avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
            rating: 5,
            date: '2 months ago',
            comment: 'Legitimate property title deed verified. Safe compound with CCTV and generator power during KPLC blackouts.',
            rentalTitle: 'Westlands Residence'
          }
        ]);
      }
    }
  }, [landlord]);

  if (!isOpen || !landlord) return null;

  const isFollowed = currentUser.followedLandlordIds.includes(landlord.id);

  // Filter properties belonging to this landlord
  const landlordListings = allListings.filter(
    (l) => l.landlord.id === landlord.id || l.landlord.name === landlord.name
  );

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello ${landlord.name}! I found your verified agency profile on Kenya House Hunt and would like to inquire about your available rentals.`
    );
    window.open(`https://wa.me/${landlord.whatsapp.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  const handleCall = () => {
    window.open(`tel:${landlord.phone}`, '_self');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${landlord.name} - Verified Kenyan Real Estate Agency`,
          text: `Check out ${landlord.name}'s verified rental reels on Kenya House Hunt`,
          url: window.location.href
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Landlord profile link copied to clipboard!');
    }
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;

    const newRev: LandlordReview = {
      id: `rev-${Date.now()}`,
      tenantName: currentUser.name || 'Verified Tenant',
      avatar: currentUser.avatar,
      rating: newReviewRating,
      date: 'Just now',
      comment: newReviewText.trim(),
      rentalTitle: landlordListings[0]?.title || 'Kenyan Rental'
    };

    setReviewsList([newRev, ...reviewsList]);
    setNewReviewText('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/90 backdrop-blur-xl animate-in fade-in select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="relative w-full max-w-2xl bg-neutral-950 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-neutral-100"
        >
          {/* Header Banner */}
          <div className="relative h-32 sm:h-40 bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 overflow-hidden border-b border-neutral-800 shrink-0">
            <img
              src={
                landlord.coverImageUrl ||
                'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'
              }
              alt="Landlord Cover"
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-black/70" />

            {/* Top Close & Share Buttons */}
            <div className="absolute top-3.5 right-3.5 flex items-center gap-2 z-10">
              <button
                onClick={handleShare}
                className="p-2 rounded-full bg-black/70 hover:bg-neutral-900 text-white backdrop-blur-md border border-neutral-700 transition-all cursor-pointer shadow-md"
                title="Share Landlord Profile"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-black/70 hover:bg-neutral-900 text-white backdrop-blur-md border border-neutral-700 transition-all cursor-pointer shadow-md"
                title="Close Profile"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Verified Agency Badge on banner */}
            <div className="absolute top-3.5 left-4 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-green-600/90 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg backdrop-blur-md border border-green-400/40">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>EARB Verified Agency</span>
              </span>
            </div>
          </div>

          {/* Profile Identity Info Row */}
          <div className="px-5 sm:px-6 pt-0 pb-3 relative shrink-0">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-14 mb-3">
              {/* Circular Avatar with Gold Ring & Verified Shield */}
              <div className="flex items-end gap-3.5">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-neutral-950 bg-black shadow-2xl overflow-hidden shrink-0">
                  <img
                    src={landlord.avatarUrl}
                    alt={landlord.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                  <div className="absolute inset-0 ring-2 ring-[#FFD700] rounded-full pointer-events-none" />
                </div>

                <div className="pb-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl sm:text-2xl font-black text-white font-display leading-tight">
                      {landlord.name}
                    </h2>
                    <CheckCircle2 className="w-5 h-5 text-[#FFD700] fill-[#FFD700]/20 shrink-0" />
                  </div>
                  <p className="text-xs text-[#FFD700] font-mono font-bold">{landlord.handle}</p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">{landlord.agencyName}</p>
                </div>
              </div>

              {/* Follow / Direct WhatsApp CTA buttons */}
              <div className="flex items-center gap-2 sm:self-end">
                <button
                  onClick={() => onToggleFollow(landlord.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md cursor-pointer ${
                    isFollowed
                      ? 'bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700'
                      : 'bg-white hover:bg-[#FFD700] text-black'
                  }`}
                >
                  {isFollowed ? (
                    <>
                      <UserCheck className="w-3.5 h-3.5 text-[#FFD700]" />
                      <span>Following</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Follow</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleWhatsApp}
                  className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-500 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Key Metrics 4-Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-3 border-y border-neutral-800 bg-neutral-900/60 rounded-2xl px-3.5 my-2">
              <div className="text-center sm:text-left">
                <span className="text-[9px] text-neutral-400 uppercase tracking-wider block font-bold">
                  Rating
                </span>
                <div className="flex items-center justify-center sm:justify-start gap-1 mt-0.5">
                  <Star className="w-4 h-4 text-[#FFD700] fill-[#FFD700]" />
                  <span className="text-sm font-black text-white">{landlord.rating.toFixed(1)}</span>
                  <span className="text-[10px] text-neutral-400">({reviewsList.length + 18})</span>
                </div>
              </div>

              <div className="text-center sm:text-left">
                <span className="text-[9px] text-neutral-400 uppercase tracking-wider block font-bold">
                  Response Time
                </span>
                <div className="flex items-center justify-center sm:justify-start gap-1 mt-0.5 text-green-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-xs font-black">{landlord.responseRate || '< 10 mins'}</span>
                </div>
              </div>

              <div className="text-center sm:text-left">
                <span className="text-[9px] text-neutral-400 uppercase tracking-wider block font-bold">
                  Active Units
                </span>
                <div className="text-xs font-black text-white mt-0.5">
                  {Math.max(landlord.totalListings, landlordListings.length)} Properties
                </div>
              </div>

              <div className="text-center sm:text-left">
                <span className="text-[9px] text-neutral-400 uppercase tracking-wider block font-bold">
                  Experience
                </span>
                <div className="text-xs font-black text-[#FFD700] mt-0.5">
                  Since {landlord.memberSince || '2021'}
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-3 border-b border-neutral-800 mt-1">
              <button
                onClick={() => setActiveTab('portfolio')}
                className={`pb-2 text-xs font-extrabold uppercase tracking-wider transition-colors border-b-2 flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'portfolio'
                    ? 'border-[#FFD700] text-[#FFD700]'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                <Building className="w-3.5 h-3.5" />
                <span>Available Rentals ({landlordListings.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-2 text-xs font-extrabold uppercase tracking-wider transition-colors border-b-2 flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'reviews'
                    ? 'border-[#FFD700] text-[#FFD700]'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                <Star className="w-3.5 h-3.5" />
                <span>Tenant Reviews ({reviewsList.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('about')}
                className={`pb-2 text-xs font-extrabold uppercase tracking-wider transition-colors border-b-2 flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'about'
                    ? 'border-[#FFD700] text-[#FFD700]'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>Credentials</span>
              </button>
            </div>
          </div>

          {/* Modal Scrollable Content */}
          <div className="overflow-y-auto px-5 sm:px-6 py-3 space-y-4 flex-1 bg-neutral-950 scrollbar-thin">
            {activeTab === 'portfolio' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-neutral-300">
                    Verified Listings by {landlord.name}
                  </h3>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    All certified by Ardhi & County
                  </span>
                </div>

                {landlordListings.length === 0 ? (
                  <div className="p-8 text-center text-neutral-400 bg-neutral-900/60 rounded-2xl border border-neutral-800">
                    <Building className="w-8 h-8 mx-auto text-[#FFD700] mb-2 opacity-60" />
                    <p className="text-xs">No other listings currently active for this agency.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {landlordListings.map((listing) => (
                      <div
                        key={listing.id}
                        onClick={() => {
                          onSelectListing(listing);
                          onClose();
                        }}
                        className="group bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-[#FFD700]/50 rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 shadow-md flex flex-col"
                      >
                        <div className="relative aspect-video bg-black overflow-hidden">
                          <img
                            src={listing.thumbnailUrl || listing.mediaUrls[0]}
                            alt={listing.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-[9px] font-bold text-white uppercase tracking-wider border border-white/10">
                            {listing.location.estate}
                          </div>
                          <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-green-600 text-[9px] font-black text-white uppercase tracking-wider shadow">
                            Verified
                          </div>
                        </div>

                        <div className="p-3.5 flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="font-bold text-sm text-white group-hover:text-[#FFD700] transition-colors line-clamp-1">
                              {listing.title}
                            </h4>
                            <p className="text-xs text-[#FFD700] font-black font-mono mt-1">
                              KSh {listing.price.toLocaleString()}
                              <span className="text-[10px] text-neutral-400 font-sans font-normal"> / month</span>
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-2.5 border-t border-neutral-800 mt-2.5 text-[10px] text-neutral-400">
                            <span>
                              {listing.bedrooms === 0 ? 'Studio' : `${listing.bedrooms} Bedroom`} • {listing.bathrooms} Bath
                            </span>
                            <span className="text-white group-hover:text-[#FFD700] font-bold flex items-center gap-0.5">
                              Watch Reel <ChevronRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4">
                {/* Leave a review form */}
                <form
                  onSubmit={handleAddReview}
                  className="bg-neutral-900 p-4 rounded-2xl border border-neutral-800 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-white">
                      Leave Tenant Feedback for {landlord.name}
                    </span>
                    {/* Star selector */}
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setNewReviewRating(star)}
                          className="p-0.5 text-[#FFD700] hover:scale-125 transition-transform cursor-pointer"
                        >
                          <Star
                            className={`w-4 h-4 ${
                              star <= newReviewRating ? 'fill-[#FFD700]' : 'text-neutral-600'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newReviewText}
                      onChange={(e) => setNewReviewText(e.target.value)}
                      placeholder="Share your tenancy experience (e.g. water, deposit refund, caretaker service)..."
                      className="flex-1 bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#FFD700]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-[#FFD700] hover:bg-amber-400 text-black text-xs font-black uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer shadow-md"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Post</span>
                    </button>
                  </div>

                  {reviewSubmitted && (
                    <p className="text-[11px] text-green-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Thank you! Your review has been added to this landlord's verified feed.
                    </p>
                  )}
                </form>

                {/* Reviews List */}
                <div className="space-y-2.5">
                  {reviewsList.map((rev) => (
                    <div
                      key={rev.id}
                      className="bg-neutral-900/80 p-4 rounded-2xl border border-neutral-800 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          {/* Circular Reviewer Avatar */}
                          <img
                            src={
                              rev.avatar ||
                              'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'
                            }
                            alt={rev.tenantName}
                            className="w-8 h-8 rounded-full object-cover border border-neutral-700"
                          />
                          <div>
                            <span className="text-xs font-bold text-white block">{rev.tenantName}</span>
                            <span className="text-[10px] text-neutral-400">{rev.rentalTitle} • {rev.date}</span>
                          </div>
                        </div>

                        {/* Stars */}
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 text-[#FFD700] fill-[#FFD700]" />
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-neutral-300 leading-relaxed pl-10">
                        "{rev.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'about' && (
              <div className="space-y-4 text-xs text-neutral-300">
                {/* Agency Bio */}
                <div className="bg-neutral-900 p-4 rounded-2xl border border-neutral-800 space-y-2">
                  <h4 className="font-black text-white uppercase tracking-wider text-xs flex items-center gap-2">
                    <Building className="w-4 h-4 text-[#FFD700]" />
                    <span>Agency Bio & Operations</span>
                  </h4>
                  <p className="text-neutral-300 leading-relaxed">
                    {landlord.bio}
                  </p>
                </div>

                {/* Official Kenyan Compliance & Licences */}
                <div className="bg-neutral-900 p-4 rounded-2xl border border-neutral-800 space-y-3">
                  <h4 className="font-black text-white uppercase tracking-wider text-xs flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-green-400" />
                    <span>Official Registration & Compliance</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                      <span className="text-neutral-400 block font-mono text-[9px] uppercase">EARB License Reg</span>
                      <span className="font-bold text-white">EARB/KE/2024/0984</span>
                    </div>

                    <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                      <span className="text-neutral-400 block font-mono text-[9px] uppercase">KRA PIN Status</span>
                      <span className="font-bold text-green-400">P051892348A (Compliant)</span>
                    </div>

                    <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                      <span className="text-neutral-400 block font-mono text-[9px] uppercase">Office Location</span>
                      <span className="font-bold text-white">{landlord.officeLocation || 'Kilimani & Westlands, Nairobi'}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                      <span className="text-neutral-400 block font-mono text-[9px] uppercase">Working Hours</span>
                      <span className="font-bold text-white">{landlord.operatingHours || 'Mon - Sat: 8:00 AM - 6:00 PM'}</span>
                    </div>
                  </div>
                </div>

                {/* Deposit Refund & Escrow Guarantee */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-green-950/40 via-neutral-900 to-green-950/40 border border-green-500/30 space-y-1.5 shadow-lg">
                  <div className="flex items-center gap-2 text-green-400 font-bold text-xs">
                    <Award className="w-4 h-4" />
                    <span>Kenya House Hunt Landlord Guarantee</span>
                  </div>
                  <p className="text-[11px] text-neutral-300 leading-relaxed">
                    This agency has signed the Tenant Protection Escrow agreement guaranteeing 100% itemized transparency on utility deposits, clean title verification, and zero unannounced rental increment within the active lease year.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Direct Action Bar */}
          <div className="p-4 border-t border-neutral-800 bg-neutral-900/90 backdrop-blur-xl flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={handleCall}
                className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-[#FFD700]" />
                <span>Call Caretaker</span>
              </button>

              <button
                onClick={handleWhatsApp}
                className="px-5 py-2.5 rounded-xl bg-[#FFD700] text-black hover:bg-amber-400 text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg transition-colors cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Caretaker</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-neutral-700 text-xs text-neutral-300 font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
