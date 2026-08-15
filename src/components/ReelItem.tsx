import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  Play,
  ChevronLeft,
  ChevronRight,
  Video,
  Image as ImageIcon,
  Loader2,
  Eye,
  EyeOff
} from 'lucide-react';
import { RentalListing, UserProfile } from '../types';
import { RightActionMenu } from './RightActionMenu';
import { PropertyDetailsOverlay } from './PropertyDetailsOverlay';
import confetti from 'canvas-confetti';

interface ReelItemProps {
  listing: RentalListing;
  isActive: boolean;
  currentUser: UserProfile;
  isAudioPlaying: boolean;
  onToggleLike: () => void;
  onToggleSave: () => void;
  onToggleFollow: () => void;
  onOpenComments: () => void;
  onOpenCertifiedDocs: () => void;
  onOpenFullDetails: () => void;
  onOpenLandlordProfile?: () => void;
  onOpenShare: () => void;
  onToggleAudio: () => void;
}

export const ReelItem: React.FC<ReelItemProps> = ({
  listing,
  isActive,
  currentUser,
  isAudioPlaying,
  onToggleLike,
  onToggleSave,
  onToggleFollow,
  onOpenComments,
  onOpenCertifiedDocs,
  onOpenFullDetails,
  onOpenLandlordProfile,
  onOpenShare,
  onToggleAudio
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [hasVideoError, setHasVideoError] = useState(false);
  const [isClearMode, setIsClearMode] = useState(false);
  const [viewMode, setViewMode] = useState<'video' | 'photos'>(
    listing.mediaType === 'video' ? 'video' : 'photos'
  );
  const [videoProgress, setVideoProgress] = useState(0);
  const [activeMediaIdx, setActiveMediaIdx] = useState(0);
  const [doubleTapHearts, setDoubleTapHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const lastTapRef = useRef<number>(0);

  // Sync viewMode when listing changes
  useEffect(() => {
    setViewMode(listing.mediaType === 'video' && !hasVideoError ? 'video' : 'photos');
  }, [listing.id, listing.mediaType, hasVideoError]);

  // Robust video playback management
  useEffect(() => {
    const video = videoRef.current;
    if (!video || viewMode !== 'video') return;

    if (isActive) {
      video.muted = !isAudioPlaying;
      video.playsInline = true;

      const attemptPlay = async () => {
        try {
          await video.play();
          setIsVideoPlaying(true);
        } catch {
          // Autoplay fallback: force muted play
          try {
            video.muted = true;
            await video.play();
            setIsVideoPlaying(true);
          } catch {
            setIsVideoPlaying(false);
          }
        }
      };

      attemptPlay();
    } else {
      video.pause();
      setIsVideoPlaying(false);
    }
  }, [isActive, viewMode, isAudioPlaying]);

  // For image carousels: auto-play slide transitions
  useEffect(() => {
    if (viewMode === 'photos' && isActive && listing.mediaUrls.length > 1) {
      const interval = setInterval(() => {
        setActiveMediaIdx((prev) => (prev + 1) % listing.mediaUrls.length);
      }, 3800);
      return () => clearInterval(interval);
    }
  }, [viewMode, isActive, listing.mediaUrls.length]);

  // Video progress updater
  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const prog = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setVideoProgress(prog);
    }
  };

  // Double tap heart burst or single tap toggle play/pause
  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const now = Date.now();
    const timeDiff = now - lastTapRef.current;
    lastTapRef.current = now;

    if (timeDiff < 320) {
      // Double tap detected!
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const heartId = Date.now();

      setDoubleTapHearts((prev) => [...prev, { id: heartId, x, y }]);
      setTimeout(() => {
        setDoubleTapHearts((prev) => prev.filter((h) => h.id !== heartId));
      }, 1000);

      if (!currentUser.likedListingIds.includes(listing.id)) {
        onToggleLike();
        try {
          confetti({
            particleCount: 24,
            spread: 65,
            origin: {
              x: e.clientX / window.innerWidth,
              y: e.clientY / window.innerHeight
            },
            colors: ['#FFD700', '#ef4444', '#10b981', '#ffffff']
          });
        } catch {}
      }
    } else {
      // Single tap toggle video playback if in video mode
      if (viewMode === 'video' && videoRef.current) {
        if (videoRef.current.paused) {
          videoRef.current
            .play()
            .then(() => setIsVideoPlaying(true))
            .catch(() => {});
        } else {
          videoRef.current.pause();
          setIsVideoPlaying(false);
        }
      }
    }
  };

  const isShowingVideo = viewMode === 'video' && listing.videoUrl && !hasVideoError;

  return (
    <div
      className="relative w-full h-full bg-neutral-950 flex items-center justify-center overflow-hidden select-none cursor-pointer"
      onClick={handleContainerClick}
    >
      {/* Background Media: Video or High-res Photo Carousel */}
      {isShowingVideo ? (
        <div className="relative w-full h-full flex items-center justify-center bg-black">
          <video
            ref={videoRef}
            src={listing.videoUrl}
            poster={listing.thumbnailUrl}
            autoPlay
            loop
            muted={!isAudioPlaying}
            playsInline
            preload="auto"
            onTimeUpdate={handleTimeUpdate}
            onPlaying={() => {
              setIsBuffering(false);
              setIsVideoPlaying(true);
            }}
            onWaiting={() => setIsBuffering(true)}
            onPlay={() => setIsVideoPlaying(true)}
            onPause={() => setIsVideoPlaying(false)}
            onError={() => {
              setHasVideoError(true);
              setViewMode('photos');
            }}
            className="w-full h-full object-cover sm:object-contain md:object-cover"
          />

          {/* Buffering Spinner */}
          {isBuffering && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none z-20">
              <div className="p-3 rounded-full bg-black/70 backdrop-blur border border-white/20 text-[#FFD700] animate-spin">
                <Loader2 className="w-6 h-6" />
              </div>
            </div>
          )}

          {/* Pause overlay icon if paused */}
          {!isVideoPlaying && !isBuffering && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none z-20"
            >
              <div className="p-3.5 rounded-full bg-black/75 border border-white/20 text-[#FFD700] backdrop-blur-md shadow-2xl">
                <Play className="w-8 h-8 fill-[#FFD700] ml-1" />
              </div>
            </motion.div>
          )}
        </div>
      ) : (
        <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden">
          <img
            src={listing.mediaUrls[activeMediaIdx] || listing.thumbnailUrl}
            alt={listing.title}
            className="w-full h-full object-cover sm:object-contain md:object-cover transition-all duration-700 ease-in-out"
          />

          {/* Multi-image indicators and navigation */}
          {listing.mediaUrls.length > 1 && (
            <>
              {/* Progress bars at top of image reel */}
              <div className="absolute top-14 left-3 right-3 z-20 flex gap-1 pointer-events-none">
                {listing.mediaUrls.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-0.5 flex-1 rounded-full transition-all duration-300 ${
                      activeMediaIdx === idx ? 'bg-[#FFD700]' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>

              {/* Prev / Next click zones */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveMediaIdx((prev) =>
                    prev === 0 ? listing.mediaUrls.length - 1 : prev - 1
                  );
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white backdrop-blur hover:bg-black/80 transition-all z-20 border border-white/15"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveMediaIdx((prev) =>
                    prev === listing.mediaUrls.length - 1 ? 0 : prev + 1
                  );
                }}
                className="absolute right-14 sm:right-16 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white backdrop-blur hover:bg-black/80 transition-all z-20 border border-white/15"
                aria-label="Next photo"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      )}

      {/* Video vs Photo Tour Switcher Pill (Below top navigation) */}
      {!isClearMode && listing.videoUrl && (
        <div className="absolute top-[112px] left-2.5 sm:left-3 z-20 flex items-center gap-1 p-0.5 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-xs shadow-md">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setHasVideoError(false);
              setViewMode('video');
            }}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold transition-all ${
              viewMode === 'video'
                ? 'bg-[#FFD700] text-black shadow-sm'
                : 'text-neutral-300 hover:text-white'
            }`}
          >
            <Video className="w-2.5 h-2.5" />
            <span>Video</span>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setViewMode('photos');
            }}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold transition-all ${
              viewMode === 'photos'
                ? 'bg-[#FFD700] text-black shadow-sm'
                : 'text-neutral-300 hover:text-white'
            }`}
          >
            <ImageIcon className="w-2.5 h-2.5" />
            <span>Photos ({listing.mediaUrls.length})</span>
          </button>
        </div>
      )}

      {/* Subtle Top Gradient (for header contrast) & Minimal Bottom Gradient */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/80 via-black/30 to-transparent pointer-events-none z-10" />
      {!isClearMode && (
        <div className="absolute inset-x-0 bottom-0 h-44 sm:h-52 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none z-10 transition-opacity duration-300" />
      )}

      {/* Bottom Luxury Progress Bar line with live video time scrubber */}
      <div className="absolute bottom-0 inset-x-0 h-[2.5px] bg-white/15 z-30 pointer-events-none">
        <div
          className="h-full bg-[#FFD700] transition-all duration-150"
          style={{
            width:
              isShowingVideo
                ? `${videoProgress}%`
                : `${((activeMediaIdx + 1) / Math.max(1, listing.mediaUrls.length)) * 100}%`
          }}
        />
      </div>

      {/* Floating Double Tap Heart Bursts */}
      <AnimatePresence>
        {doubleTapHearts.map((heart) => (
          <motion.div
            key={heart.id}
            initial={{ opacity: 0, scale: 0, x: heart.x - 40, y: heart.y - 40 }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0.5, 1.2, 1, 0.8],
              y: heart.y - 100
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
            className="absolute pointer-events-none z-40 text-red-500 drop-shadow-[0_4px_12px_rgba(239,68,68,0.8)]"
          >
            <Heart className="w-20 h-20 fill-red-500 stroke-white stroke-[1.5]" />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Right Side Action Menu */}
      <RightActionMenu
        listing={listing}
        currentUser={currentUser}
        isClearMode={isClearMode}
        onToggleClearMode={() => setIsClearMode((prev) => !prev)}
        onToggleLike={onToggleLike}
        onToggleSave={onToggleSave}
        onToggleFollow={onToggleFollow}
        onOpenComments={onOpenComments}
        onOpenCertifiedDocs={onOpenCertifiedDocs}
        onOpenFullDetails={onOpenFullDetails}
        onOpenLandlordProfile={onOpenLandlordProfile}
        onOpenShare={onOpenShare}
        onToggleAudio={onToggleAudio}
        isAudioPlaying={isAudioPlaying}
      />

      {/* Bottom Property Details Overlay */}
      <PropertyDetailsOverlay
        listing={listing}
        isClearMode={isClearMode}
        onToggleClearMode={() => setIsClearMode((prev) => !prev)}
        onOpenFullDetails={onOpenFullDetails}
        onOpenCertifiedDocs={onOpenCertifiedDocs}
        onOpenLandlordProfile={onOpenLandlordProfile}
      />
    </div>
  );
};
