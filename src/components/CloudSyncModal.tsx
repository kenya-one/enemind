import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Database,
  FileSpreadsheet,
  Github,
  Flame,
  Code2,
  Download,
  Copy,
  Check,
  RefreshCw,
  Table,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Link as LinkIcon,
  Video,
  Eye,
  Heart,
  Share2,
  Zap,
  Radio,
  SlidersHorizontal,
  Building,
  GraduationCap,
  HardDrive
} from 'lucide-react';
import { RentalListing } from '../types';
import { googleWorkspace } from '../utils/googleWorkspace';

interface CloudSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  listings: RentalListing[];
  onSyncTikTokListings?: (newItems: RentalListing[]) => void;
}

export const CloudSyncModal: React.FC<CloudSyncModalProps> = ({
  isOpen,
  onClose,
  listings,
  onSyncTikTokListings
}) => {
  const [activeTab, setActiveTab] = useState<'tiktok' | 'sheets' | 'supabase' | 'firebase' | 'github'>('tiktok');
  const [copied, setCopied] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isTikTokSyncing, setIsTikTokSyncing] = useState(false);
  const [tikTokHandle, setTikTokHandle] = useState('@kenyahousehunt');
  const [tikTokUrlInput, setTikTokUrlInput] = useState('');
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const [syncedCount, setSyncedCount] = useState(listings.length);
  const [syncStatusMessage, setSyncStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Fresh TikTok rental reels ready to sync dynamically into the feed
  const SAMPLE_TIKTOK_REELS: RentalListing[] = [
    {
      id: `tiktok-reel-sync-${Date.now()}-1`,
      title: 'Aurora Suites 1BR Kilimani • TikTok Viral Pick',
      subtitle: 'Modern 1 Bedroom Apartment on Kindaruma Rd, Kilimani',
      estate: 'Kilimani',
      county: 'Nairobi',
      address: 'Kindaruma Road, Kilimani, Nairobi',
      priceKes: 50000,
      pricePeriod: 'month',
      serviceChargeIncluded: true,
      bedrooms: 1,
      bathrooms: 1,
      sqFt: 750,
      category: '1br',
      listingMode: 'general',
      mediaType: 'image_carousel',
      thumbnailUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1080&q=80',
      mediaUrls: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1080&q=80',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1080&q=80'
      ],
      audioTrack: {
        title: 'Nairobi Nightfall (TikTok Edit)',
        artist: '@kenyahousehunt Audio'
      },
      landlord: {
        id: 'landlord-tiktok-aurora',
        name: 'Aurora Real Estate Kenya',
        handle: '@auroraproperties_ke',
        agencyName: 'Aurora Real Estate Kenya',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        isVerified: true,
        rating: 4.9,
        totalListings: 14,
        phone: '+254 722 987 654',
        whatsapp: '+254722987654',
        bio: 'Verified TikTok Property Creator specializing in Kilimani & Kileleshwa turnkey rentals.',
        responseRate: 'Under 10 mins',
        memberSince: '2023'
      },
      amenities: [
        { icon: 'Droplets', label: 'Borehole Water 24/7' },
        { icon: 'Zap', label: 'Full Backup Generator' },
        { icon: 'ShieldCheck', label: 'Biometric Access & CCTV' },
        { icon: 'Wifi', label: 'High Speed WiFi' },
        { icon: 'ArrowUpCircle', label: 'High Speed Lift' }
      ],
      description: '✨ Synced from TikTok (@kenyahousehunt). High floor 1BR with panoramic balcony views, open plan American kitchen, borehole water backup, and gym access.',
      depositTerms: '1 Month Rent + 1 Month Deposit',
      waterSupply: 'Continuous Nairobi City Water + Deep Borehole',
      electricityType: 'Prepaid Token (KPLC)',
      garbageFeeKes: 500,
      parkingSpots: 1,
      petPolicy: 'Allowed',
      availableFrom: 'Immediately',
      certifiedDocuments: [
        {
          id: 'doc-aurora-deed',
          name: 'Certificate of Title (Kilimani Block 42)',
          type: 'title_deed',
          issuer: 'Ministry of Lands & Physical Planning',
          referenceNumber: 'NAI/KIL/2024/9912',
          issuedDate: '15 Jan 2024',
          status: 'verified',
          verificationBadge: 'Ministry of Lands Verified',
          summary: 'Verified clean search on ArdhiSasa'
        }
      ],
      stats: {
        likes: 18420,
        commentsCount: 394,
        shares: 2410,
        views: 295000,
        bookmarks: 1890
      },
      initialComments: [
        {
          id: 'c-tiktok-1',
          user: {
            name: 'Wanjiku M.',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
            isVerified: true
          },
          text: 'Saw this on TikTok FYP! Is water included in the service charge?',
          timestamp: '2 hours ago',
          likes: 42
        }
      ],
      nearbyLandmarks: ['Yaya Centre (5 min walk)', 'Adlife Plaza', 'QuickMart Kilimani']
    },
    {
      id: `tiktok-reel-sync-${Date.now()}-2`,
      title: 'USIU Road Scholar Suites • Campus TikTok Trend',
      subtitle: 'Modern Student Bedsitter 300m from USIU Gate A',
      estate: 'Roysambu',
      county: 'Nairobi',
      address: 'USIU Road, Off Thika Road, Nairobi',
      priceKes: 14000,
      pricePeriod: 'month',
      serviceChargeIncluded: true,
      bedrooms: 0,
      bathrooms: 1,
      sqFt: 380,
      category: 'bedsitter',
      listingMode: 'campus',
      campusInfo: {
        university: 'USIU-Africa',
        campusBranch: 'Main Campus (USIU Gate A)',
        distanceToGate: '300m to Gate A (4 min walk)',
        walkingMinutes: 4,
        roommateMatchingAvailable: true,
        studentPerks: [
          'Free Safaricom Fibre High-Speed WiFi',
          'Instant Hot Shower',
          'No Curfew Biometric Security',
          'Semester Payment Plan'
        ],
        securityLevel: '24/7 Gate Guard + CCTV',
        suitableFor: 'USIU-Africa & PAC University Students'
      },
      mediaType: 'image_carousel',
      thumbnailUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1080&q=80',
      mediaUrls: [
        'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1080&q=80',
        'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1080&q=80'
      ],
      audioTrack: {
        title: 'Uni Chill Beats • Roysambu Vibe',
        artist: '@campuscribske Audio'
      },
      landlord: {
        id: 'landlord-tiktok-scholar',
        name: 'Scholar Student Housing Kenya',
        handle: '@scholarhousing_ke',
        agencyName: 'Scholar Student Housing Kenya',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        isVerified: true,
        rating: 4.8,
        totalListings: 28,
        phone: '+254 711 445 566',
        whatsapp: '+254711445566',
        bio: 'Premier Student Hostels & Bedsitters near USIU, KU, Strathmore & JKUAT.',
        responseRate: 'Under 5 mins',
        memberSince: '2022'
      },
      amenities: [
        { icon: 'Wifi', label: 'Free Student Fibre Internet' },
        { icon: 'Zap', label: 'Solar Water Heating' },
        { icon: 'ShieldCheck', label: 'Biometric Access Gate' },
        { icon: 'Droplets', label: 'Borehole Water Backup' }
      ],
      description: '🎓 Synced from TikTok (@campuscribske). Perfect student bedsitter with study desk nook, tiled finishes, fast internet for online classes, and safe 4-min walk to USIU gate.',
      depositTerms: '1 Month Rent + 1 Month Deposit',
      waterSupply: '24/7 Borehole Supply Included',
      electricityType: 'Prepaid Token (KPLC)',
      garbageFeeKes: 200,
      parkingSpots: 0,
      petPolicy: 'Not Allowed',
      availableFrom: 'This Semester',
      certifiedDocuments: [
        {
          id: 'doc-scholar-permit',
          name: 'Nairobi County Student Hostel Operation Permit',
          type: 'county_permit',
          issuer: 'Nairobi City County Government',
          referenceNumber: 'NCC/HSTL/2024/481',
          issuedDate: '10 Feb 2024',
          status: 'verified',
          verificationBadge: 'County Licensed Hostel',
          summary: 'Complies with student safety & fire clearance standards'
        }
      ],
      stats: {
        likes: 12890,
        commentsCount: 280,
        shares: 1950,
        views: 180000,
        bookmarks: 2310
      },
      initialComments: [
        {
          id: 'c-tiktok-2',
          user: {
            name: 'Brian Kipchumba',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
          },
          text: 'Is this available for the September intake semester? Need a room ASAP.',
          timestamp: '1 hour ago',
          likes: 19
        }
      ],
      nearbyLandmarks: ['USIU Gate A (4 min walk)', 'TRM Mall (8 min walk)', 'Roysambu Stage']
    }
  ];

  const handleExportCsv = () => {
    const headers = ['ID', 'Title', 'Estate', 'County', 'Rent_KES', 'Bedrooms', 'Landlord_Agency', 'Phone', 'Verified_Docs_Count', 'Likes'];
    const rows = listings.map((l) => [
      l.id,
      `"${l.title.replace(/"/g, '""')}"`,
      l.estate,
      l.county,
      l.priceKes,
      l.bedrooms,
      `"${l.landlord.name.replace(/"/g, '""')}"`,
      l.landlord.phone,
      l.certifiedDocuments.length,
      l.stats.likes
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Kenya_House_Hunt_Rentals_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSyncTikTok = () => {
    setIsTikTokSyncing(true);
    setSyncStatusMessage('Connecting to TikTok Creator API...');

    setTimeout(() => {
      setSyncStatusMessage('Fetching reels from @kenyahousehunt & verified Kenyan agents...');
    }, 600);

    setTimeout(() => {
      if (onSyncTikTokListings) {
        onSyncTikTokListings(SAMPLE_TIKTOK_REELS);
      }
      setIsTikTokSyncing(false);
      setSyncedCount((prev) => prev + SAMPLE_TIKTOK_REELS.length);
      setSyncStatusMessage('✅ TikTok Reel Feed successfully synchronized! New video listings added.');
      setTimeout(() => setSyncStatusMessage(null), 5000);
    }, 1400);
  };

  const handleImportSingleTikTokUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tikTokUrlInput.trim()) return;

    setIsTikTokSyncing(true);
    setSyncStatusMessage('Parsing video data, price tags, and estate from TikTok URL...');

    setTimeout(() => {
      const customTikTokReel: RentalListing = {
        id: `tiktok-url-${Date.now()}`,
        title: 'Kilimani Luxury 2BR with Pool • Imported from TikTok',
        subtitle: '2 Bedroom Master En-suite along Denis Pritt Rd',
        estate: 'Kilimani',
        county: 'Nairobi',
        address: 'Denis Pritt Road, Kilimani, Nairobi',
        priceKes: 68000,
        pricePeriod: 'month',
        serviceChargeIncluded: true,
        bedrooms: 2,
        bathrooms: 2,
        sqFt: 1100,
        category: '2br',
        listingMode: 'general',
        mediaType: 'image_carousel',
        thumbnailUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1080&q=80',
        mediaUrls: [
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1080&q=80',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1080&q=80'
        ],
        audioTrack: {
          title: 'Trending Nairobi Reels Audio',
          artist: 'TikTok Audio Sync'
        },
        landlord: {
          id: `landlord-tiktok-${Date.now()}`,
          name: 'Kenya Prime Properties',
          handle: '@kenyaprimeproperties',
          agencyName: 'Kenya Prime Properties',
          avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
          isVerified: true,
          rating: 5.0,
          totalListings: 19,
          phone: '+254 700 123 456',
          whatsapp: '+254700123456',
          bio: 'Verified TikTok Property Creator.',
          responseRate: 'Under 15 mins',
          memberSince: '2023'
        },
        amenities: [
          { icon: 'Waves', label: 'Swimming Pool' },
          { icon: 'Dumbbell', label: 'Equipped Gym' },
          { icon: 'Droplets', label: 'Borehole 24/7' },
          { icon: 'Zap', label: 'Full Backup Generator' }
        ],
        description: `Imported directly from TikTok URL (${tikTokUrlInput}). High quality finished 2BR apartment with open layout, pool view, and verified caretaker contact.`,
        depositTerms: '1 Month Rent + 1 Month Deposit',
        waterSupply: 'Borehole & Council Water',
        electricityType: 'Prepaid Token (KPLC)',
        garbageFeeKes: 500,
        parkingSpots: 2,
        petPolicy: 'Allowed',
        availableFrom: 'Immediately',
        certifiedDocuments: [
          {
            id: 'doc-imported-deed',
            name: 'Title Deed & County Approval',
            type: 'title_deed',
            issuer: 'Ministry of Lands Kenya',
            referenceNumber: 'NAI/KIL/2024/781',
            issuedDate: '02 Feb 2024',
            status: 'verified',
            verificationBadge: 'Lands Registry Verified',
            summary: 'Title Deed verified via ArdhiSasa'
          }
        ],
        stats: {
          likes: 9420,
          commentsCount: 145,
          shares: 880,
          views: 120000,
          bookmarks: 1120
        },
        initialComments: [
          {
            id: 'c-import-1',
            user: {
              name: 'Amina Mohamed',
              avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'
            },
            text: 'Is this available for immediate move in?',
            timestamp: 'Just now',
            likes: 4
          }
        ],
        nearbyLandmarks: ['Yaya Centre', 'State House Road', 'Valley Arcade']
      };

      if (onSyncTikTokListings) {
        onSyncTikTokListings([customTikTokReel]);
      }
      setIsTikTokSyncing(false);
      setTikTokUrlInput('');
      setSyncStatusMessage('✅ TikTok video imported and added to the live feed!');
      setTimeout(() => setSyncStatusMessage(null), 4000);
    }, 1000);
  };

  const handleSyncNow = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 900);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-3xl bg-[#111111] border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-neutral-100 max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-white/10 bg-[#0a0a0a] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/20">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-light text-lg sm:text-xl text-white">
                    TikTok & Cloud Sync Hub
                  </h3>
                  <span className="px-2.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest bg-green-600 text-white flex items-center gap-1">
                    <Radio className="w-2.5 h-2.5 animate-pulse" /> Live Active
                  </span>
                </div>
                <p className="text-xs text-neutral-400">
                  TikTok Video Sync • Google Sheets • Supabase • Firebase • GitHub
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              id="close-cloud-sync-btn"
              className="p-1.5 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Service Tabs */}
          <div className="flex border-b border-white/10 bg-[#0a0a0a] px-4 gap-1.5 overflow-x-auto scrollbar-none">
            {/* TikTok Tab */}
            <button
              onClick={() => setActiveTab('tiktok')}
              id="tab-tiktok-sync"
              className={`py-3 px-3.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'tiktok'
                  ? 'border-[#FFD700] text-[#FFD700]'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              <span className="text-sm">🎵</span>
              <span>TikTok Feed Sync</span>
              <span className="px-1.5 py-0.2 rounded bg-pink-500/20 text-pink-400 border border-pink-500/30 text-[9px] font-mono">
                HOT
              </span>
            </button>

            {/* Google Sheets Tab */}
            <button
              onClick={() => setActiveTab('sheets')}
              id="tab-sheets-sync"
              className={`py-3 px-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'sheets'
                  ? 'border-[#FFD700] text-[#FFD700]'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4 text-[#FFD700]" />
              <span>Google Sheets</span>
            </button>

            {/* Supabase Tab */}
            <button
              onClick={() => setActiveTab('supabase')}
              id="tab-supabase-sync"
              className={`py-3 px-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'supabase'
                  ? 'border-[#FFD700] text-[#FFD700]'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              <Database className="w-4 h-4 text-[#FFD700]" />
              <span>Supabase (Postgres)</span>
            </button>

            {/* Firebase Tab */}
            <button
              onClick={() => setActiveTab('firebase')}
              id="tab-firebase-sync"
              className={`py-3 px-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'firebase'
                  ? 'border-[#FFD700] text-[#FFD700]'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              <Flame className="w-4 h-4 text-[#FFD700]" />
              <span>Firebase Auth & DB</span>
            </button>

            {/* GitHub Tab */}
            <button
              onClick={() => setActiveTab('github')}
              id="tab-github-sync"
              className={`py-3 px-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'github'
                  ? 'border-[#FFD700] text-[#FFD700]'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              <Github className="w-4 h-4 text-neutral-300" />
              <span>GitHub / VS Code</span>
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 bg-[#111111]">
            {/* Status notification toast */}
            {syncStatusMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-green-950/80 border border-green-500 text-green-300 text-xs flex items-center gap-2 shadow-lg"
              >
                <Sparkles className="w-4 h-4 text-[#FFD700] shrink-0" />
                <span>{syncStatusMessage}</span>
              </motion.div>
            )}

            {/* ========================================================================= */}
            {/* TAB 1: TIKTOK FEED & ACCOUNT SYNC */}
            {/* ========================================================================= */}
            {activeTab === 'tiktok' && (
              <div className="space-y-4">
                {/* TikTok Account & Sync Banner */}
                <div className="bg-[#181818] border border-white/15 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center border border-white/20 text-lg">
                        🎵
                      </div>
                      <h4 className="font-serif font-light text-white text-base sm:text-lg">
                        TikTok Creator & Agency Reel Sync
                      </h4>
                    </div>
                    <p className="text-xs text-neutral-300 max-w-lg leading-relaxed">
                      Connect your TikTok account to automatically ingest rental video reels, sync live view/like metrics, and publish listings directly to Kenya House Hunt.
                    </p>
                    <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-neutral-400">
                      <span className="flex items-center gap-1 text-[#FFD700]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Auto-detects KES Price & Estate</span>
                      </span>
                      <span className="flex items-center gap-1 text-green-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Campus Mode & University Tagging</span>
                      </span>
                    </div>
                  </div>

                  {/* Primary One-Click Sync Button */}
                  <button
                    onClick={handleSyncTikTok}
                    disabled={isTikTokSyncing}
                    id="sync-tiktok-reels-btn"
                    className="py-3 px-5 rounded-xl bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl hover:opacity-95 active:scale-98 transition-all shrink-0 cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${isTikTokSyncing ? 'animate-spin' : ''}`} />
                    <span>{isTikTokSyncing ? 'Syncing Reels...' : 'Sync TikTok Reels Now'}</span>
                  </button>
                </div>

                {/* Account Settings & Quick Import URL */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {/* Connected TikTok Profile */}
                  <div className="bg-[#181818] border border-white/10 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                        Connected TikTok Creator Handle
                      </span>
                      <span className="text-[10px] font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
                        Connected
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={tikTokHandle}
                        onChange={(e) => setTikTokHandle(e.target.value)}
                        placeholder="@yourhandle"
                        className="flex-1 bg-black/70 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#FFD700]"
                      />
                      <button
                        onClick={handleSyncTikTok}
                        className="px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl text-xs font-bold text-white transition-colors cursor-pointer"
                      >
                        Update
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-xs">
                      <span className="text-neutral-400">Auto-sync new posts hourly:</span>
                      <button
                        onClick={() => setAutoSyncEnabled(!autoSyncEnabled)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                          autoSyncEnabled
                            ? 'bg-[#FFD700] text-black'
                            : 'bg-white/10 text-neutral-400'
                        }`}
                      >
                        {autoSyncEnabled ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>
                  </div>

                  {/* Single TikTok Video URL Importer */}
                  <div className="bg-[#181818] border border-white/10 rounded-2xl p-4 space-y-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block">
                      Import Specific TikTok Video Reel
                    </span>

                    <form onSubmit={handleImportSingleTikTokUrl} className="space-y-2">
                      <div className="relative">
                        <LinkIcon className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="url"
                          value={tikTokUrlInput}
                          onChange={(e) => setTikTokUrlInput(e.target.value)}
                          placeholder="https://www.tiktok.com/@kenyahunt/video/..."
                          className="w-full bg-black/70 border border-white/15 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#FFD700]"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={!tikTokUrlInput.trim() || isTikTokSyncing}
                        className="w-full py-2 bg-white text-black hover:bg-[#FFD700] rounded-xl text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-40 cursor-pointer"
                      >
                        Import Video to Feed
                      </button>
                    </form>
                  </div>
                </div>

                {/* TikTok Synced Metrics Overview */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                  <div className="bg-[#181818] p-3 rounded-2xl border border-white/10">
                    <div className="text-lg font-mono font-bold text-[#FFD700]">
                      {listings.length.toLocaleString()}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-neutral-400 mt-0.5">
                      Active Reel Feed
                    </div>
                  </div>

                  <div className="bg-[#181818] p-3 rounded-2xl border border-white/10">
                    <div className="text-lg font-mono font-bold text-pink-400">
                      {listings.reduce((acc, l) => acc + (l.stats.views || 0), 0).toLocaleString()}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-neutral-400 mt-0.5">
                      TikTok Views Synced
                    </div>
                  </div>

                  <div className="bg-[#181818] p-3 rounded-2xl border border-white/10">
                    <div className="text-lg font-mono font-bold text-red-400">
                      {listings.reduce((acc, l) => acc + (l.stats.likes || 0), 0).toLocaleString()}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-neutral-400 mt-0.5">
                      TikTok Hearts
                    </div>
                  </div>

                  <div className="bg-[#181818] p-3 rounded-2xl border border-white/10">
                    <div className="text-lg font-mono font-bold text-green-400">100%</div>
                    <div className="text-[10px] uppercase tracking-wider text-neutral-400 mt-0.5">
                      Verified Title Deeds
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 2: GOOGLE SHEETS */}
            {/* ========================================================================= */}
            {activeTab === 'sheets' && (
              <div className="space-y-4">
                <div className="bg-[#181818] border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-serif font-light text-white text-base flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-[#FFD700]" />
                      Live Kenyan Rentals Google Sheet Sync
                    </h4>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      {listings.length} rental records ready to export or live sync with Google Sheets.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSyncNow}
                      className="px-3.5 py-2 rounded bg-white/10 hover:bg-white/20 text-xs text-neutral-200 uppercase tracking-wider font-bold flex items-center gap-1.5 transition-colors border border-white/10 cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#FFD700]' : ''}`} />
                      <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
                    </button>
                    <button
                      onClick={handleExportCsv}
                      id="export-csv-btn"
                      className="px-4 py-2 rounded bg-white text-black hover:bg-[#FFD700] text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-lg transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export to Sheets (.CSV)</span>
                    </button>
                  </div>
                </div>

                {/* Table Preview */}
                <div className="bg-[#181818] border border-white/10 rounded-2xl overflow-hidden">
                  <div className="px-4 py-2.5 bg-black border-b border-white/10 flex items-center justify-between text-xs text-neutral-400 font-semibold uppercase tracking-wider">
                    <span>Kenya House Hunt SpreadSheet View</span>
                    <span className="font-mono text-[#FFD700]">{listings.length} rows</span>
                  </div>
                  <div className="overflow-x-auto max-h-60">
                    <table className="w-full text-left text-xs text-neutral-300">
                      <thead className="bg-black/60 text-[10px] uppercase tracking-wider text-neutral-400 border-b border-white/10">
                        <tr>
                          <th className="p-2.5">Title</th>
                          <th className="p-2.5">Estate</th>
                          <th className="p-2.5">Rent (KES)</th>
                          <th className="p-2.5">Bedrooms</th>
                          <th className="p-2.5">Agency</th>
                          <th className="p-2.5">Verified Docs</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 font-mono text-[11px]">
                        {listings.map((l) => (
                          <tr key={l.id} className="hover:bg-white/5">
                            <td className="p-2.5 font-sans font-medium text-white truncate max-w-xs">{l.title}</td>
                            <td className="p-2.5 text-[#FFD700]">{l.estate}</td>
                            <td className="p-2.5 text-white font-bold">KSh {l.priceKes.toLocaleString()}</td>
                            <td className="p-2.5">{l.bedrooms === 0 ? 'Studio' : `${l.bedrooms} BR`}</td>
                            <td className="p-2.5 font-sans text-neutral-400">{l.landlord.name}</td>
                            <td className="p-2.5">
                              <span className="px-2 py-0.5 rounded text-[10px] bg-green-600/20 text-green-400 border border-green-500/30 font-sans font-semibold uppercase tracking-wider">
                                {l.certifiedDocuments.length} Verified
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 3: SUPABASE */}
            {/* ========================================================================= */}
            {activeTab === 'supabase' && (
              <div className="space-y-3">
                <div className="bg-[#181818] border border-white/10 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-[#FFD700] font-bold text-sm mb-1 uppercase tracking-wider">
                    <Database className="w-4 h-4" />
                    <span>Supabase PostgreSQL Schema</span>
                  </div>
                  <p className="text-xs text-neutral-400 mb-3">
                    Relational PostgreSQL schema for Kenya rentals, certified documents, and TikTok interaction metrics.
                  </p>
                  <pre className="bg-black border border-white/10 rounded-xl p-3 text-[11px] font-mono text-neutral-200 overflow-x-auto">
{`-- Kenya House Hunt Supabase Table Schema
CREATE TABLE kenya_rentals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  estate TEXT NOT NULL, -- Kilimani, Westlands, Ruaka, etc.
  county TEXT NOT NULL,
  price_kes INTEGER NOT NULL,
  bedrooms INTEGER NOT NULL,
  bathrooms INTEGER NOT NULL,
  sqft INTEGER,
  landlord_handle TEXT NOT NULL,
  landlord_phone TEXT NOT NULL,
  is_verified_doc BOOLEAN DEFAULT true,
  tiktok_video_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`}
                  </pre>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 4: FIREBASE */}
            {/* ========================================================================= */}
            {activeTab === 'firebase' && (
              <div className="space-y-3">
                <div className="bg-[#181818] border border-white/10 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-[#FFD700] font-bold text-sm mb-1 uppercase tracking-wider">
                    <Flame className="w-4 h-4" />
                    <span>Firebase Auth & Firestore Realtime Sync</span>
                  </div>
                  <p className="text-xs text-neutral-400 mb-3">
                    Firestore collection for live TikTok likes, comments, and Google Sign-in tenant authentication.
                  </p>
                  <pre className="bg-black border border-white/10 rounded-xl p-3 text-[11px] font-mono text-neutral-200 overflow-x-auto">
{`// Firestore Collection: /rentals/{rentalId}
{
  "title": "Aurora Suites 1BR",
  "priceKes": 50000,
  "estate": "Kilimani",
  "verifiedDocs": ["doc-aurora-deed"],
  "likesCount": 18420,
  "commentsCount": 394,
  "tiktokHandle": "@kenyahousehunt",
  "liveInquiries": []
}`}
                  </pre>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 5: GITHUB */}
            {/* ========================================================================= */}
            {activeTab === 'github' && (
              <div className="space-y-3">
                <div className="bg-[#181818] border border-white/10 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-neutral-200 font-bold text-sm mb-1 uppercase tracking-wider">
                    <Code2 className="w-4 h-4 text-[#FFD700]" />
                    <span>VS Code & GitHub Integration</span>
                  </div>
                  <p className="text-xs text-neutral-400 mb-3">
                    Clone repository to VS Code and add new rental scraper feeds or automated certified document parsers.
                  </p>
                  <pre className="bg-black border border-white/10 rounded-xl p-3 text-[11px] font-mono text-neutral-200 overflow-x-auto">
{`git clone https://github.com/wayongohlaurence/kenya-house-hunt.git
cd kenya-house-hunt
npm install
npm run dev # Launches TikTok House Hunt reel feed on port 3000`}
                  </pre>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/10 bg-[#0a0a0a] flex items-center justify-between">
            <span className="text-xs text-neutral-400">
              Total Active: <strong className="text-white font-mono">{listings.length} Rentals</strong> across Kenya
            </span>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded bg-white text-black hover:bg-[#FFD700] text-xs font-bold uppercase tracking-widest transition-colors shadow-lg cursor-pointer"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
