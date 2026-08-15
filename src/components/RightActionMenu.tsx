import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  ShieldCheck,
  Plus,
  Check,
  MessageSquare,
  Eye,
  EyeOff
} from 'lucide-react';
import { RentalListing, UserProfile } from '../types';
import confetti from 'canvas-confetti';
import { WhatsAppLogo } from './SocialLogos';

interface RightActionMenuProps {
  listing: RentalListing;
  currentUser: UserProfile;
  isClearMode: boolean;
  onToggleClearMode: () => void;
  onToggleLike: () => void;
  onToggleSave: () => void;
  onToggleFollow: () => void;
  onOpenComments: () => void;
  onOpenCertifiedDocs: () => void;
  onOpenFullDetails: () => void;
  onOpenLandlordProfile?: () => void;
  onOpenShare: () => void;
  onToggleAudio: () => void;
  isAudioPlaying: boolean;
}

export const RightActionMenu: React.FC<RightActionMenuProps> = ({
  listing,
  currentUser,
  isClearMode,
  onToggleClearMode,
  onToggleLike,
  onToggleSave,
  onToggleFollow,
  onOpenComments,
  onOpenCertifiedDocs,
  onOpenFullDetails,
  onOpenLandlordProfile,
  onOpenShare
}) => {
  const isLiked = currentUser.likedListingIds.includes(listing.id);
  const isSaved = currentUser.savedListingIds.includes(listing.id);
  const isFollowed = currentUser.followedLandlordIds.includes(listing.landlord.id);
  const [likeAnimate, setLikeAnimate] = useState(false);

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLikeAnimate(true);
    setTimeout(() => setLikeAnimate(false), 600);
    onToggleLike();

    if (!isLiked) {
      try {
        confetti({
          particleCount: 20,
          spread: 50,
          origin: {
            x: e.clientX / window.innerWidth,
            y: e.clientY / window.innerHeight
          },
          colors: ['#10b981', '#f43f5e', '#fbbf24']
        });
      } catch {}
    }
  };

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = encodeURIComponent(
      `Jambo ${listing.landlord.name}! I saw ${listing.title} in ${listing.estate} (KSh ${listing.priceKes.toLocaleString()}/mo) on Kenya House Hunt and would like to chat.`
    );
    window.open(`https://wa.me/${listing.landlord.whatsapp.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div className="absolute right-2 sm:right-3 bottom-10 sm:bottom-12 z-30 flex flex-col items-center gap-1 sm:gap-1.5 select-none pointer-events-auto">
      {/* Landlord / Agency Avatar with Follow (+) badge */}
      <div className="relative group flex flex-col items-center mb-0.5">
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onOpenLandlordProfile) {
              onOpenLandlordProfile();
            } else {
              onOpenFullDetails();
            }
          }}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-[#FFD700] p-0.5 bg-black shadow-xl overflow-hidden hover:scale-105 active:scale-95 transition-all"
          title={`View ${listing.landlord.name} Verified Profile & Portfolio`}
        >
          <img
            src={listing.landlord.avatarUrl}
            alt={listing.landlord.name}
            className="w-full h-full rounded-full object-cover"
          />
        </button>

        {/* Follow toggle badge */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFollow();
          }}
          className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full flex items-center justify-center text-black shadow-md transition-all ${
            isFollowed
              ? 'bg-[#FFD700] scale-90'
              : 'bg-white hover:bg-[#FFD700] hover:scale-110'
          }`}
          title={isFollowed ? 'Following Agency' : 'Follow Agency'}
        >
          {isFollowed ? <Check className="w-2 h-2 stroke-[3]" /> : <Plus className="w-2.5 h-2.5 stroke-[3]" />}
        </button>
      </div>

      {/* Like Heart Button */}
      <div className="flex flex-col items-center">
        <motion.button
          onClick={handleLikeClick}
          animate={likeAnimate ? { scale: [1, 1.35, 0.9, 1.15, 1] } : { scale: 1 }}
          transition={{ duration: 0.45 }}
          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center backdrop-blur-xl transition-all shadow-lg ${
            isLiked
              ? 'bg-[#FF4B4B]/20 text-[#FF4B4B] border border-[#FF4B4B]/50'
              : 'bg-black/60 hover:bg-black/80 text-white border border-white/20'
          }`}
        >
          <Heart
            className={`w-4 h-4 transition-transform ${
              isLiked ? 'fill-[#FF4B4B] text-[#FF4B4B] scale-110' : 'text-white'
            }`}
          />
        </motion.button>
        <span className="text-[8px] font-bold text-gray-200 mt-0.5">
          {(listing.stats.likes + (isLiked ? 1 : 0)).toLocaleString()}
        </span>
      </div>

      {/* Comments Button */}
      <div className="flex flex-col items-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenComments();
          }}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 text-white flex items-center justify-center backdrop-blur-xl shadow-lg transition-transform hover:scale-105 active:scale-95"
        >
          <MessageCircle className="w-4 h-4" />
        </button>
        <span className="text-[8px] font-bold text-gray-200 mt-0.5">
          {listing.stats.commentsCount.toLocaleString()}
        </span>
      </div>

      {/* Bookmark / Save Shortlist */}
      <div className="flex flex-col items-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave();
          }}
          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center backdrop-blur-xl transition-colors shadow-lg ${
            isSaved
              ? 'bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/60'
              : 'bg-black/60 hover:bg-black/80 text-white border border-white/20'
          }`}
        >
          <Bookmark
            className={`w-4 h-4 transition-transform ${
              isSaved ? 'fill-[#FFD700] text-[#FFD700] scale-105' : 'text-white'
            }`}
          />
        </button>
        <span className="text-[8px] font-bold text-gray-200 mt-0.5">
          {(listing.stats.bookmarks + (isSaved ? 1 : 0)).toLocaleString()}
        </span>
      </div>

      {/* Certified Document Shield Badge Button */}
      <div className="flex flex-col items-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenCertifiedDocs();
          }}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-green-950/80 hover:bg-green-900 border border-green-500/70 text-green-400 flex items-center justify-center backdrop-blur-xl shadow-lg hover:scale-105 active:scale-95 transition-all"
          title="Inspect Official Certified Documents"
        >
          <ShieldCheck className="w-4 h-4 text-green-400" />
        </button>
        <span className="text-[8px] font-bold uppercase tracking-wider text-green-400 mt-0.5">
          Docs
        </span>
      </div>

      {/* WhatsApp Caretaker Quick Button */}
      <div className="flex flex-col items-center">
        <button
          onClick={handleWhatsAppClick}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/60 hover:bg-green-600/30 border border-white/20 hover:border-green-500 text-white flex items-center justify-center backdrop-blur-xl shadow-lg hover:scale-105 active:scale-95 transition-all p-1.5"
          title="Chat directly with Caretaker on WhatsApp"
        >
          <WhatsAppLogo className="w-full h-full" />
        </button>
        <span className="text-[8px] uppercase tracking-wider font-semibold text-gray-200 mt-0.5">
          Chat
        </span>
      </div>

      {/* Share Button */}
      <div className="flex flex-col items-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenShare();
          }}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 text-white flex items-center justify-center backdrop-blur-xl shadow-lg hover:scale-105 active:scale-95 transition-transform"
        >
          <Share2 className="w-4 h-4" />
        </button>
        <span className="text-[8px] font-bold text-gray-200 mt-0.5">
          Share
        </span>
      </div>

      {/* Clear View / Hide Text Button */}
      <div className="flex flex-col items-center pt-0.5">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleClearMode();
          }}
          className={`w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full flex items-center justify-center backdrop-blur-xl transition-all shadow-md ${
            isClearMode
              ? 'bg-[#FFD700] text-black border border-[#FFD700]'
              : 'bg-black/50 hover:bg-black/80 text-neutral-300 border border-white/15'
          }`}
          title={isClearMode ? 'Show text & overlay' : 'Hide text for full video'}
        >
          {isClearMode ? <Eye className="w-3 h-3 stroke-[2.5]" /> : <EyeOff className="w-3 h-3" />}
        </button>
      </div>
    </div>
  );
};
