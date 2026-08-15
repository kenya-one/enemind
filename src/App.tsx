/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Building, GraduationCap, Check } from 'lucide-react';
import {
  RentalListing,
  UserProfile,
  FilterState,
  CommentItem,
  LandlordProfile
} from './types';
import { INITIAL_RENTAL_LISTINGS } from './data/mockRentals';
import { ReelFeed } from './components/ReelFeed';
import { FilterBar } from './components/FilterBar';
import { CommentsModal } from './components/CommentsModal';
import { CertifiedDocsModal } from './components/CertifiedDocsModal';
import { PropertyFullDetailsModal } from './components/PropertyFullDetailsModal';
import { ShareModal } from './components/ShareModal';
import { GoogleAuthModal } from './components/GoogleAuthModal';
import { PostRentalModal } from './components/PostRentalModal';
import { CloudSyncModal } from './components/CloudSyncModal';
import { LandlordProfileModal } from './components/LandlordProfileModal';
import { EnerHubModal } from './components/enerhub/EnerHubModal';
import { AuthLandingPage } from './components/AuthLandingPage';
import { GoogleDatabaseViewerModal } from './components/GoogleDatabaseViewerModal';
import { kenyanAudio } from './utils/audio';
import { KENYAN_CAMPUSES } from './data/campuses';
import { EnerHubTab } from './types';

const STORAGE_LISTINGS_KEY = 'kenya_house_hunt_listings_v5';
const STORAGE_USER_KEY = 'kenya_house_hunt_user_v2';

export default function App() {
  // Load listings from LocalStorage or initialize with mock Kenyan rentals
  const [listings, setListings] = useState<RentalListing[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_LISTINGS_KEY);
      if (saved) {
        const parsed: RentalListing[] = JSON.parse(saved);
        // Ensure no stale broken mixkit links from previous version
        const hasBrokenMixkit = parsed.some((item) => item.videoUrl?.includes('mixkit.co'));
        if (!hasBrokenMixkit && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // LocalStorage fallback
    }
    return INITIAL_RENTAL_LISTINGS;
  });

  // Current logged in user (defaults to Joice Barasa as specified by session)
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_USER_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    return {
      id: 'user-joice-01',
      name: 'Joice Barasa',
      email: 'joicebarasa7@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      isLoggedIn: true,
      likedListingIds: ['kenya-hunt-01'],
      savedListingIds: ['kenya-hunt-01', 'kenya-hunt-02'],
      followedLandlordIds: ['landlord-01'],
      bookedTours: [
        {
          id: 'tour-1',
          listingId: 'kenya-hunt-01',
          listingTitle: 'Emerald Heights 2BR Kilimani',
          date: 'Tomorrow',
          time: '11:00 AM',
          status: 'Confirmed',
          notes: 'Meeting caretaker at the reception gate'
        }
      ]
    };
  });

  // Audio playing state
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);

  // Controls if the Main Welcome / Sign Up & Login page is currently displayed
  const [showAuthLanding, setShowAuthLanding] = useState<boolean>(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_USER_KEY);
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed?.isLoggedIn && parsed?.name) {
          return false;
        }
      }
    } catch {}
    // Begin with the main page for user sign up or login as requested
    return true;
  });

  // Active top tab
  const [activeTab, setActiveTab] = useState<string>(() => {
    return currentUser.preferredMode === 'campus' ? 'campus_all' : 'for_you';
  });

  // Toast banner for feedback
  const [toastBanner, setToastBanner] = useState<string | null>(null);

  // Filter state
  const [filterState, setFilterState] = useState<FilterState>(() => ({
    mode: currentUser.preferredMode || 'general',
    category: 'all',
    county: 'all',
    maxPrice: 250000,
    bedrooms: 'all',
    verifiedOnly: false,
    searchQuery: '',
    selectedUniversity: currentUser.preferredUniversity || 'all'
  }));

  // Auto-dismiss toast banner
  useEffect(() => {
    if (toastBanner) {
      const timer = setTimeout(() => setToastBanner(null), 3800);
      return () => clearTimeout(timer);
    }
  }, [toastBanner]);

  // Active Modals state
  const [activeCommentsListing, setActiveCommentsListing] = useState<RentalListing | null>(null);
  const [activeCertifiedDocsListing, setActiveCertifiedDocsListing] = useState<RentalListing | null>(null);
  const [activeFullDetailsListing, setActiveFullDetailsListing] = useState<RentalListing | null>(null);
  const [activeLandlordProfile, setActiveLandlordProfile] = useState<LandlordProfile | null>(null);
  const [activeShareListing, setActiveShareListing] = useState<RentalListing | null>(null);
  const [isGoogleAuthOpen, setIsGoogleAuthOpen] = useState(false);
  const [isPostRentalOpen, setIsPostRentalOpen] = useState(false);
  const [isCloudSyncOpen, setIsCloudSyncOpen] = useState(false);
  const [isGoogleDatabaseOpen, setIsGoogleDatabaseOpen] = useState(false);
  const [isEnerHubOpen, setIsEnerHubOpen] = useState(false);
  const [enerHubInitialTab, setEnerHubInitialTab] = useState<EnerHubTab>('notes');

  const handleOpenEnerHub = (tab: EnerHubTab = 'notes') => {
    setEnerHubInitialTab(tab);
    setIsEnerHubOpen(true);
  };

  // Sync listings to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_LISTINGS_KEY, JSON.stringify(listings));
    } catch {}
  }, [listings]);

  // Sync user profile to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(currentUser));
    } catch {}
  }, [currentUser]);

  // Audio toggle
  const handleToggleAudio = () => {
    const playing = kenyanAudio.togglePlay();
    setIsAudioPlaying(playing);
  };

  // Like / Unlike listing
  const handleToggleLike = (listingId: string) => {
    const isLiked = currentUser.likedListingIds.includes(listingId);
    const updatedLikedIds = isLiked
      ? currentUser.likedListingIds.filter((id) => id !== listingId)
      : [...currentUser.likedListingIds, listingId];

    setCurrentUser({
      ...currentUser,
      likedListingIds: updatedLikedIds
    });

    setListings((prev) =>
      prev.map((l) =>
        l.id === listingId
          ? {
              ...l,
              stats: {
                ...l.stats,
                likes: l.stats.likes + (isLiked ? -1 : 1)
              }
            }
          : l
      )
    );
  };

  // Save / Bookmark shortlist
  const handleToggleSave = (listingId: string) => {
    const isSaved = currentUser.savedListingIds.includes(listingId);
    const updatedSavedIds = isSaved
      ? currentUser.savedListingIds.filter((id) => id !== listingId)
      : [...currentUser.savedListingIds, listingId];

    setCurrentUser({
      ...currentUser,
      savedListingIds: updatedSavedIds
    });

    setListings((prev) =>
      prev.map((l) =>
        l.id === listingId
          ? {
              ...l,
              stats: {
                ...l.stats,
                bookmarks: l.stats.bookmarks + (isSaved ? -1 : 1)
              }
            }
          : l
      )
    );
  };

  // Follow / Unfollow landlord
  const handleToggleFollow = (landlordId: string) => {
    const isFollowed = currentUser.followedLandlordIds.includes(landlordId);
    const updatedFollowed = isFollowed
      ? currentUser.followedLandlordIds.filter((id) => id !== landlordId)
      : [...currentUser.followedLandlordIds, landlordId];

    setCurrentUser({
      ...currentUser,
      followedLandlordIds: updatedFollowed
    });
  };

  // Add Comment to active listing
  const handleAddComment = (text: string, replyToId?: string) => {
    if (!activeCommentsListing) return;

    const newComment: CommentItem = {
      id: `c-${Date.now()}`,
      user: {
        name: currentUser.name,
        avatar: currentUser.avatar,
        isVerified: true
      },
      text,
      timestamp: 'Just now',
      likes: 0
    };

    setListings((prev) =>
      prev.map((l) => {
        if (l.id === activeCommentsListing.id) {
          let updatedComments = [...(l.initialComments || [])];
          if (replyToId) {
            updatedComments = updatedComments.map((c) =>
              c.id === replyToId
                ? {
                    ...c,
                    replies: [...(c.replies || []), newComment]
                  }
                : c
            );
          } else {
            updatedComments.unshift(newComment);
          }

          return {
            ...l,
            initialComments: updatedComments,
            stats: {
              ...l.stats,
              commentsCount: l.stats.commentsCount + 1
            }
          };
        }
        return l;
      })
    );

    // Update active comments modal view
    setActiveCommentsListing((prev) => {
      if (!prev) return null;
      let updatedComments = [...(prev.initialComments || [])];
      if (replyToId) {
        updatedComments = updatedComments.map((c) =>
          c.id === replyToId
            ? {
                ...c,
                replies: [...(c.replies || []), newComment]
              }
            : c
        );
      } else {
        updatedComments.unshift(newComment);
      }
      return {
        ...prev,
        initialComments: updatedComments,
        stats: {
          ...prev.stats,
          commentsCount: prev.stats.commentsCount + 1
        }
      };
    });
  };

  // Like a specific comment
  const handleLikeComment = (commentId: string) => {
    if (!activeCommentsListing) return;

    setListings((prev) =>
      prev.map((l) => {
        if (l.id === activeCommentsListing.id) {
          const updated = (l.initialComments || []).map((c) => {
            if (c.id === commentId) {
              const isLiked = c.isLiked;
              return {
                ...c,
                isLiked: !isLiked,
                likes: c.likes + (isLiked ? -1 : 1)
              };
            }
            return c;
          });
          return { ...l, initialComments: updated };
        }
        return l;
      })
    );

    setActiveCommentsListing((prev) => {
      if (!prev) return null;
      const updated = (prev.initialComments || []).map((c) => {
        if (c.id === commentId) {
          const isLiked = c.isLiked;
          return {
            ...c,
            isLiked: !isLiked,
            likes: c.likes + (isLiked ? -1 : 1)
          };
        }
        return c;
      });
      return { ...prev, initialComments: updated };
    });
  };

  // Book a physical tour
  const handleBookTour = (tourData: { date: string; time: string; notes: string }) => {
    if (!activeFullDetailsListing) return;

    const newTour = {
      id: `tour-${Date.now()}`,
      listingId: activeFullDetailsListing.id,
      listingTitle: activeFullDetailsListing.title,
      date: tourData.date,
      time: tourData.time,
      status: 'Confirmed' as const,
      notes: tourData.notes
    };

    setCurrentUser((prev) => ({
      ...prev,
      bookedTours: [newTour, ...prev.bookedTours]
    }));
  };

  // Add new listing from Landlord modal
  const handleAddListing = (newListing: RentalListing) => {
    setListings((prev) => [newListing, ...prev]);
  };

  // Sync incoming TikTok reels into feed
  const handleSyncTikTokListings = (newItems: RentalListing[]) => {
    setListings((prev) => {
      // Filter out any duplicates by ID
      const existingIds = new Set(prev.map((item) => item.id));
      const uniqueNew = newItems.filter((item) => !existingIds.has(item.id));
      return [...uniqueNew, ...prev];
    });
    setToastBanner(`🎵 Synced ${newItems.length} TikTok video reels to your feed!`);
  };

  // User auth login / logout
  const handleLogin = (userUpdates: Partial<UserProfile>) => {
    setCurrentUser((prev) => ({
      ...prev,
      ...userUpdates,
      isLoggedIn: true
    }));
  };

  const handleAuthLandingLogin = (
    userUpdates: Partial<UserProfile>,
    mode: 'general' | 'campus' = 'campus',
    universityId?: string
  ) => {
    const updatedUser: UserProfile = {
      ...currentUser,
      ...userUpdates,
      isLoggedIn: true,
      preferredMode: mode,
      preferredUniversity: universityId || 'all'
    };

    setCurrentUser(updatedUser);
    handleSelectMode(mode, universityId);
    setShowAuthLanding(false);
    setToastBanner(`✨ Welcome to EnerMind Kenya, ${userUpdates.name || 'Student'}!`);
  };

  // Mode and University selection handler
  const handleSelectMode = (mode: 'general' | 'campus', universityId?: string) => {
    const chosenUni = mode === 'campus' ? (universityId || 'all') : undefined;

    setFilterState((prev) => ({
      ...prev,
      mode,
      selectedUniversity: chosenUni
    }));

    setCurrentUser((prev) => ({
      ...prev,
      preferredMode: mode,
      preferredUniversity: chosenUni
    }));

    if (mode === 'campus') {
      setActiveTab('campus_all');
      const uniMeta = KENYAN_CAMPUSES.find((c) => c.id === chosenUni);
      setToastBanner(
        chosenUni && chosenUni !== 'all' && uniMeta
          ? `🎓 Mode: Campus Student Housing • ${uniMeta.name}`
          : '🎓 Mode: Campus Student Housing (All Campuses)'
      );
    } else {
      setActiveTab('for_you');
      setToastBanner('🇰🇪 Mode: Kenya General & Luxury Rentals');
    }
  };

  const handleLogout = () => {
    setCurrentUser((prev) => ({
      ...prev,
      isLoggedIn: false,
      name: 'Guest Hunter',
      email: '',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'
    }));
    setIsGoogleAuthOpen(false);
    setShowAuthLanding(true);
    setToastBanner('👋 Signed out. Welcome to EnerMind Kenya!');
  };

  // Filter and tab logic
  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      // 1. Audience / Mode filter (Kenya General vs Campus Mode)
      if (filterState.mode === 'campus') {
        if (item.listingMode !== 'campus') {
          return false;
        }
        // Filter by selected university if specific university is chosen
        if (filterState.selectedUniversity && filterState.selectedUniversity !== 'all') {
          const selectedId = filterState.selectedUniversity.toLowerCase();
          const campusMeta = KENYAN_CAMPUSES.find(
            (c) => c.id.toLowerCase() === selectedId || c.acronym.toLowerCase() === selectedId
          );

          const itemUni = (item.campusInfo?.university || '').toLowerCase();
          const itemTitle = (item.title || '').toLowerCase();
          const itemEstate = (item.estate || '').toLowerCase();
          const itemSuitable = (item.campusInfo?.suitableFor || '').toLowerCase();

          // Check direct ID or acronym match
          let matches =
            itemUni.includes(selectedId) ||
            itemTitle.includes(selectedId) ||
            itemEstate.includes(selectedId) ||
            itemSuitable.includes(selectedId);

          // If campus metadata exists, check full name, shortName, acronym, and student hubs
          if (!matches && campusMeta) {
            const acronym = campusMeta.acronym.toLowerCase();
            const shortName = campusMeta.shortName.toLowerCase();
            const name = campusMeta.name.toLowerCase();

            matches =
              itemUni.includes(acronym) ||
              itemUni.includes(shortName) ||
              itemUni.includes(name) ||
              itemTitle.includes(acronym) ||
              itemTitle.includes(shortName) ||
              campusMeta.studentHubs.some((hub) =>
                itemEstate.includes(hub.toLowerCase()) ||
                itemTitle.includes(hub.toLowerCase()) ||
                (item.campusInfo?.campusBranch || '').toLowerCase().includes(hub.toLowerCase())
              );
          }

          if (!matches) {
            return false;
          }
        }
      } else if (filterState.mode === 'general') {
        if (item.listingMode === 'campus') {
          return false;
        }
      }

      // 2. Top tab filter
      if (activeTab === 'following') {
        if (!currentUser.followedLandlordIds.includes(item.landlord.id)) {
          return false;
        }
      } else if (activeTab === 'kilimani') {
        const est = item.estate.toLowerCase();
        if (!est.includes('kilimani') && !est.includes('westlands') && !est.includes('kileleshwa')) {
          return false;
        }
      } else if (activeTab === '1br') {
        if (item.bedrooms > 1) return false;
      } else if (activeTab === '2br') {
        if (item.bedrooms < 2 || item.bedrooms > 3) return false;
      } else if (activeTab === 'luxury') {
        if (item.priceKes < 100000 && item.county.toLowerCase() !== 'mombasa') return false;
      }

      // 3. Max price filter
      if (item.priceKes > filterState.maxPrice) return false;

      // 4. Bedrooms filter
      if (filterState.bedrooms !== 'all') {
        if (filterState.bedrooms === '0' && item.bedrooms !== 0) return false;
        if (filterState.bedrooms === '1' && item.bedrooms !== 1) return false;
        if (filterState.bedrooms === '2+' && item.bedrooms < 2) return false;
      }

      // 5. Verified only filter
      if (filterState.verifiedOnly && (!item.certifiedDocuments || item.certifiedDocuments.length === 0)) {
        return false;
      }

      // 6. Search Query filter
      if (filterState.searchQuery.trim()) {
        const q = filterState.searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesEstate = item.estate.toLowerCase().includes(q);
        const matchesCounty = item.county.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesAgency = item.landlord.name.toLowerCase().includes(q);
        const matchesCampus = item.campusInfo?.university?.toLowerCase().includes(q);
        const matchesAmenity = item.amenities.some((a) => a.label.toLowerCase().includes(q));

        if (
          !matchesTitle &&
          !matchesEstate &&
          !matchesCounty &&
          !matchesDesc &&
          !matchesAgency &&
          !matchesCampus &&
          !matchesAmenity
        ) {
          return false;
        }
      }

      return true;
    });
  }, [listings, activeTab, currentUser.followedLandlordIds, filterState]);

  if (showAuthLanding) {
    return (
      <div className="relative w-screen min-h-screen bg-neutral-950 text-white overflow-y-auto">
        <AuthLandingPage
          onLoginSuccess={handleAuthLandingLogin}
          onExploreAsGuest={() => {
            setShowAuthLanding(false);
            setToastBanner('👀 Browsing EnerMind Kenya as Guest');
          }}
        />

        {/* Global Toast Banner */}
        {toastBanner && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-4 py-2 rounded-full bg-neutral-900 border border-[#FFD700]/60 text-white text-xs font-bold shadow-2xl shadow-[#FFD700]/20 flex items-center gap-2 animate-in fade-in">
            <span className="w-2 h-2 rounded-full bg-[#FFD700] animate-ping" />
            <span>{toastBanner}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen bg-neutral-950 text-white overflow-hidden flex flex-col select-none">
      {/* Main Full-Screen Vertical Reel Feed with integrated header navigation */}
      <main className="flex-1 w-full h-full flex items-center justify-center">
        <ReelFeed
          listings={filteredListings}
          currentUser={currentUser}
          isAudioPlaying={isAudioPlaying}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          filterState={filterState}
          onUpdateFilter={(updates) => setFilterState((prev) => ({ ...prev, ...updates }))}
          onOpenPostRental={() => setIsPostRentalOpen(true)}
          onOpenCloudSync={() => setIsCloudSyncOpen(true)}
          onOpenGoogleAuth={() => setIsGoogleAuthOpen(true)}
          onOpenEnerHub={handleOpenEnerHub}
          onToggleLike={handleToggleLike}
          onToggleSave={handleToggleSave}
          onToggleFollow={handleToggleFollow}
          onOpenComments={(listing) => setActiveCommentsListing(listing)}
          onOpenCertifiedDocs={(listing) => setActiveCertifiedDocsListing(listing)}
          onOpenFullDetails={(listing) => setActiveFullDetailsListing(listing)}
          onOpenLandlordProfile={(landlord) => setActiveLandlordProfile(landlord)}
          onOpenShare={(listing) => setActiveShareListing(listing)}
          onToggleAudio={handleToggleAudio}
          totalResults={filteredListings.length}
        />
      </main>

      {/* EnerHub Student Super-App Modal (Notes, Past Papers, Projects, Attachments, Movies & Music, EnerMind AI) */}
      <EnerHubModal
        isOpen={isEnerHubOpen}
        onClose={() => setIsEnerHubOpen(false)}
        initialTab={enerHubInitialTab}
      />

      {/* Verified Landlord / Agency Profile & Portfolio Modal */}
      {activeLandlordProfile && (
        <LandlordProfileModal
          landlord={activeLandlordProfile}
          isOpen={Boolean(activeLandlordProfile)}
          onClose={() => setActiveLandlordProfile(null)}
          allListings={listings}
          currentUser={currentUser}
          onToggleFollow={handleToggleFollow}
          onSelectListing={(listing) => {
            setActiveLandlordProfile(null);
            setActiveFullDetailsListing(listing);
          }}
        />
      )}

      {/* Comments Drawer / Modal */}
      {activeCommentsListing && (
        <CommentsModal
          isOpen={Boolean(activeCommentsListing)}
          onClose={() => setActiveCommentsListing(null)}
          comments={activeCommentsListing.initialComments || []}
          listingTitle={activeCommentsListing.title}
          currentUser={currentUser}
          onAddComment={handleAddComment}
          onLikeComment={handleLikeComment}
        />
      )}

      {/* Certified Documents Viewer Modal */}
      {activeCertifiedDocsListing && (
        <CertifiedDocsModal
          listing={activeCertifiedDocsListing}
          isOpen={Boolean(activeCertifiedDocsListing)}
          onClose={() => setActiveCertifiedDocsListing(null)}
        />
      )}

      {/* Full Rental Details & Tour Booking Modal */}
      {activeFullDetailsListing && (
        <PropertyFullDetailsModal
          listing={activeFullDetailsListing}
          isOpen={Boolean(activeFullDetailsListing)}
          onClose={() => setActiveFullDetailsListing(null)}
          onOpenCertifiedDocs={() => {
            setActiveCertifiedDocsListing(activeFullDetailsListing);
          }}
          onOpenLandlordProfile={(landlord) => {
            setActiveLandlordProfile(landlord);
          }}
          currentUser={currentUser}
          onBookTour={handleBookTour}
        />
      )}

      {/* Share Modal */}
      {activeShareListing && (
        <ShareModal
          listing={activeShareListing}
          isOpen={Boolean(activeShareListing)}
          onClose={() => setActiveShareListing(null)}
        />
      )}

      {/* Floating Mode Notification Toast */}
      <AnimatePresence>
        {toastBanner && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-black/90 border border-[#FFD700]/70 text-[#FFD700] rounded-full text-xs font-bold shadow-2xl backdrop-blur-xl flex items-center gap-2 pointer-events-none"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{toastBanner}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Google Auth, Mode Selection & User Profile Modal */}
      <GoogleAuthModal
        isOpen={isGoogleAuthOpen}
        onClose={() => setIsGoogleAuthOpen(false)}
        currentUser={currentUser}
        listings={listings}
        currentMode={filterState.mode}
        selectedUniversity={filterState.selectedUniversity}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onOpenEnerHub={handleOpenEnerHub}
        onSelectListing={(id) => {
          const target = listings.find((l) => l.id === id);
          if (target) {
            setActiveFullDetailsListing(target);
          }
        }}
        onSelectMode={handleSelectMode}
      />

      {/* Post Rental Modal (Landlord / Agency Upload Portal) */}
      <PostRentalModal
        isOpen={isPostRentalOpen}
        onClose={() => setIsPostRentalOpen(false)}
        onAddListing={handleAddListing}
        currentUser={currentUser}
      />

      {/* Cloud Sync & Developer Google Sheets / Supabase Inspector */}
      <CloudSyncModal
        isOpen={isCloudSyncOpen}
        onClose={() => setIsCloudSyncOpen(false)}
        listings={listings}
        onSyncTikTokListings={handleSyncTikTokListings}
      />

      {/* Google Sheets (Auth DB) & Google Drive (User Media DB) Live Viewer */}
      <GoogleDatabaseViewerModal
        isOpen={isGoogleDatabaseOpen}
        onClose={() => setIsGoogleDatabaseOpen(false)}
        currentUser={currentUser}
      />
    </div>
  );
}
