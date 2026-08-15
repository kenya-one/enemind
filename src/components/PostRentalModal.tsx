import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  PlusCircle,
  ShieldCheck,
  Building,
  CheckCircle2,
  GraduationCap,
  Sparkles,
  Link as LinkIcon,
  RefreshCw,
  Upload,
  Video,
  Image as ImageIcon,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Film,
  Music,
  User,
  Check,
  Share2,
  FileText,
  Trash2,
  Layers,
  Smartphone,
  Info,
  ChevronRight,
  ChevronLeft,
  LogIn,
  ExternalLink,
  ArrowRight,
  HardDrive,
  FileSpreadsheet
} from 'lucide-react';
import { RentalListing, UserProfile } from '../types';
import {
  TIKTOK_MOCK_CREATORS,
  TIKTOK_VIDEOS,
  INSTAGRAM_POSTS,
  FACEBOOK_POSTS,
  YOUTUBE_CHANNELS,
  YOUTUBE_VIDEOS,
  SocialVideoItem
} from '../data/socialImportsData';
import confetti from 'canvas-confetti';
import { googleWorkspace } from '../utils/googleWorkspace';
import {
  TikTokLogo,
  InstagramLogo,
  FacebookLogo,
  GoogleDriveLogo,
  GoogleSheetsLogo,
  WhatsAppLogo,
  YouTubeLogo
} from './SocialLogos';

interface PostRentalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddListing: (newListing: RentalListing) => void;
  currentUser: UserProfile;
}

type SourceTab = 'tiktok' | 'instagram' | 'facebook' | 'youtube' | 'gdrive' | 'files';

export const PostRentalModal: React.FC<PostRentalModalProps> = ({
  isOpen,
  onClose,
  onAddListing,
  currentUser
}) => {
  // Source Selection Tab
  const [activeSourceTab, setActiveSourceTab] = useState<SourceTab>('tiktok');

  // TikTok Login & Account State
  const [isTikTokLoggedIn, setIsTikTokLoggedIn] = useState(true);
  const [showTikTokLoginModal, setShowTikTokLoginModal] = useState(false);
  const [selectedTikTokCreator, setSelectedTikTokCreator] = useState(TIKTOK_MOCK_CREATORS[0]);
  const [customTikTokHandle, setCustomTikTokHandle] = useState('');
  const [isLoggingInTikTok, setIsLoggingInTikTok] = useState(false);
  const [selectedSocialItem, setSelectedSocialItem] = useState<SocialVideoItem | null>(TIKTOK_VIDEOS[0]);

  // Instagram Account State
  const [selectedIgHandle, setSelectedIgHandle] = useState('@joice_realestate_ke');
  const [customIgHandle, setCustomIgHandle] = useState('');
  const [showIgLoginModal, setShowIgLoginModal] = useState(false);

  // Facebook State
  const [selectedFbPage, setSelectedFbPage] = useState('Nairobi Rentals & Hostels Hub');
  const [showFbLoginModal, setShowFbLoginModal] = useState(false);

  // YouTube Channel & Shorts State
  const [selectedYtChannel, setSelectedYtChannel] = useState(YOUTUBE_CHANNELS[0]);
  const [showYtChannelModal, setShowYtChannelModal] = useState(false);
  const [customYtChannel, setCustomYtChannel] = useState('');

  // Direct Link Inputs
  const [directLinkInput, setDirectLinkInput] = useState('');
  const [isDirectSyncing, setIsDirectSyncing] = useState(false);

  // Local File Upload States
  const [uploadedVideoFile, setUploadedVideoFile] = useState<File | null>(null);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string | null>(null);
  const [uploadedImageFiles, setUploadedImageFiles] = useState<{ file: File; url: string; name: string }[]>([]);
  const [customAudioChoice, setCustomAudioChoice] = useState('Suzanna Acoustic Lo-Fi (Nairobi Groove)');
  const [customAudioArtist, setCustomAudioArtist] = useState('Sauti Sol & Kenyan House Vibes');
  const [isDriveUploading, setIsDriveUploading] = useState(false);
  const [driveUploadNotice, setDriveUploadNotice] = useState<string | null>(null);

  // Media preview state
  const [mediaType, setMediaType] = useState<'video' | 'image_carousel'>('video');
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string>(
    TIKTOK_VIDEOS[0].videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
  );
  const [previewThumbnailUrl, setPreviewThumbnailUrl] = useState<string>(TIKTOK_VIDEOS[0].thumbnailUrl);
  const [previewMediaUrls, setPreviewMediaUrls] = useState<string[]>(TIKTOK_VIDEOS[0].mediaUrls || [TIKTOK_VIDEOS[0].thumbnailUrl]);
  const [activePreviewImageIdx, setActivePreviewImageIdx] = useState<number>(0);
  const [isPlayingPreviewVideo, setIsPlayingPreviewVideo] = useState(false);

  // Form Fields
  const [listingMode, setListingMode] = useState<'general' | 'campus'>(TIKTOK_VIDEOS[0].suggestedData.listingMode);
  const [title, setTitle] = useState(TIKTOK_VIDEOS[0].title);
  const [estate, setEstate] = useState(TIKTOK_VIDEOS[0].suggestedData.estate);
  const [county, setCounty] = useState(TIKTOK_VIDEOS[0].suggestedData.county);
  const [address, setAddress] = useState(TIKTOK_VIDEOS[0].suggestedData.address);
  const [priceKes, setPriceKes] = useState(TIKTOK_VIDEOS[0].suggestedData.priceKes);
  const [bedrooms, setBedrooms] = useState(TIKTOK_VIDEOS[0].suggestedData.bedrooms);
  const [bathrooms, setBathrooms] = useState(TIKTOK_VIDEOS[0].suggestedData.bathrooms);
  const [sqFt, setSqFt] = useState(TIKTOK_VIDEOS[0].suggestedData.sqFt);
  const [category, setCategory] = useState<'bedsitter' | '1br' | '2br' | '3br' | 'luxury'>(TIKTOK_VIDEOS[0].suggestedData.category);
  const [agencyName, setAgencyName] = useState(currentUser.name || 'Nairobi Premier Rentals');
  const [phone, setPhone] = useState('+254 712 345 678');
  const [description, setDescription] = useState(TIKTOK_VIDEOS[0].suggestedData.description);
  const [docRef, setDocRef] = useState(TIKTOK_VIDEOS[0].suggestedData.docRef);

  // Campus mode specific state
  const [selectedUniversity, setSelectedUniversity] = useState('Kenyatta University (KU)');
  const [campusBranch, setCampusBranch] = useState('Main Campus (KM Gate)');
  const [distanceToGate, setDistanceToGate] = useState('400m to Main Gate (5 min walk)');
  const [walkingMinutes, setWalkingMinutes] = useState(5);
  const [roommateMatchingAvailable, setRoommateMatchingAvailable] = useState(true);
  const [studentPerks, setStudentPerks] = useState<string[]>([
    'Free High-Speed Student WiFi',
    'Instant Hot Shower',
    'Biometric Gate Access (No Curfew)',
    'Quiet Study Atmosphere'
  ]);

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(TIKTOK_VIDEOS[0].suggestedData.amenities);
  const [isSuccess, setIsSuccess] = useState(false);
  const [autoFilledBadge, setAutoFilledBadge] = useState<string | null>('TikTok Reel (@joicerentals)');

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileVideoInputRef = useRef<HTMLInputElement>(null);
  const fileImagesInputRef = useRef<HTMLInputElement>(null);
  const formSectionRef = useRef<HTMLDivElement>(null);

  const availableAmenities = [
    { id: 'Droplets', label: 'Borehole Water 24/7' },
    { id: 'Zap', label: 'Backup Generator' },
    { id: 'ShieldCheck', label: '24/7 Security & CCTV' },
    { id: 'ArrowUpCircle', label: 'High Speed Lift' },
    { id: 'Car', label: 'Dedicated Parking' },
    { id: 'Waves', label: 'Swimming Pool' },
    { id: 'Dumbbell', label: 'Modern Gym' },
    { id: 'Wifi', label: 'Fibre Internet Ready' },
    { id: 'Sun', label: 'Solar Water Heating' },
    { id: 'Trees', label: 'Compound Garden / DSQ' }
  ];

  const popularKenyanSounds = [
    { title: 'Suzanna Acoustic Lo-Fi (Nairobi Groove)', artist: 'Sauti Sol & Kenyan House Vibes' },
    { title: 'Kuna Kuna (Campus Sunset Remix)', artist: 'Vic West & Brandy Maina' },
    { title: 'Nairobi Urban Pulse (Afro-Chill)', artist: 'Matata & Nairobi House' },
    { title: 'Midnight in Nairobi (Saxophone Smooth)', artist: 'Kenyan Jazz Collective' },
    { title: 'Sishikiki (Gengetone Chill Beats)', artist: 'Mejja & Kenyan Vibes' },
    { title: 'Campus Chill Lo-Fi Beats', artist: 'Antigravity University Sounds' }
  ];

  // Apply social item data into form
  const applySocialItem = (item: SocialVideoItem) => {
    setSelectedSocialItem(item);
    setTitle(item.title);
    setDescription(item.suggestedData.description);
    setEstate(item.suggestedData.estate);
    setCounty(item.suggestedData.county);
    setAddress(item.suggestedData.address);
    setPriceKes(item.suggestedData.priceKes);
    setBedrooms(item.suggestedData.bedrooms);
    setBathrooms(item.suggestedData.bathrooms);
    setSqFt(item.suggestedData.sqFt);
    setCategory(item.suggestedData.category);
    setListingMode(item.suggestedData.listingMode);
    setSelectedAmenities(item.suggestedData.amenities);
    setDocRef(item.suggestedData.docRef);

    if (item.suggestedData.listingMode === 'campus' && item.suggestedData.university) {
      setSelectedUniversity(item.suggestedData.university);
      if (item.suggestedData.campusBranch) setCampusBranch(item.suggestedData.campusBranch);
      if (item.suggestedData.distanceToGate) setDistanceToGate(item.suggestedData.distanceToGate);
      if (item.suggestedData.walkingMinutes) setWalkingMinutes(item.suggestedData.walkingMinutes);
    }

    if (item.videoUrl) {
      setMediaType('video');
      setPreviewVideoUrl(item.videoUrl);
      setPreviewThumbnailUrl(item.thumbnailUrl);
      setPreviewMediaUrls(item.mediaUrls || [item.thumbnailUrl]);
    } else {
      setMediaType('image_carousel');
      setPreviewThumbnailUrl(item.thumbnailUrl);
      setPreviewMediaUrls(item.mediaUrls || [item.thumbnailUrl]);
    }

    setCustomAudioChoice(item.audioTrack.title);
    setCustomAudioArtist(item.audioTrack.artist);

    const sourceName =
      item.source === 'tiktok'
        ? 'TikTok'
        : item.source === 'instagram'
        ? 'Instagram'
        : item.source === 'facebook'
        ? 'Facebook'
        : 'YouTube';
    setAutoFilledBadge(`${sourceName} Reel (${item.creatorHandle})`);

    // Subtle celebration feedback
    try {
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { y: 0.6 }
      });
    } catch {}
  };

  // TikTok login simulation
  const handleTikTokLogin = (creatorHandleOrCustom: string) => {
    setIsLoggingInTikTok(true);
    setTimeout(() => {
      const found = TIKTOK_MOCK_CREATORS.find(
        (c) => c.handle.toLowerCase() === creatorHandleOrCustom.toLowerCase()
      );
      if (found) {
        setSelectedTikTokCreator(found);
        const matchedVideo = TIKTOK_VIDEOS.find((v) => v.creatorHandle === found.handle) || TIKTOK_VIDEOS[0];
        applySocialItem(matchedVideo);
      } else {
        const customCreator = {
          handle: creatorHandleOrCustom.startsWith('@') ? creatorHandleOrCustom : `@${creatorHandleOrCustom}`,
          name: `${creatorHandleOrCustom.replace('@', '')} Rentals`,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          followers: '12.5K',
          likesCount: '150K',
          bio: 'Kenyan Real Estate & House Hunt Creator'
        };
        setSelectedTikTokCreator(customCreator);
        applySocialItem(TIKTOK_VIDEOS[0]);
      }
      setIsTikTokLoggedIn(true);
      setIsLoggingInTikTok(false);
      setShowTikTokLoginModal(false);
    }, 600);
  };

  // Direct link import
  const handleDirectLinkImport = () => {
    if (!directLinkInput.trim()) return;
    setIsDirectSyncing(true);

    setTimeout(() => {
      const lower = directLinkInput.toLowerCase();
      let matchedItem: SocialVideoItem | undefined;

      if (lower.includes('youtube.com') || lower.includes('youtu.be') || lower.includes('shorts')) {
        matchedItem = YOUTUBE_VIDEOS[0];
      } else if (lower.includes('instagram') || lower.includes('ig.me')) {
        matchedItem = INSTAGRAM_POSTS[0];
      } else if (lower.includes('facebook') || lower.includes('fb.watch')) {
        matchedItem = FACEBOOK_POSTS[0];
      } else {
        matchedItem = TIKTOK_VIDEOS[0];
      }

      if (matchedItem) {
        applySocialItem(matchedItem);
      }
      setIsDirectSyncing(false);
      setDirectLinkInput('');
    }, 800);
  };

  // Handle Video file upload
  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setUploadedVideoFile(file);
    setUploadedVideoUrl(url);
    setMediaType('video');
    setPreviewVideoUrl(url);
    setPreviewThumbnailUrl('https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1080&q=80');
    setPreviewMediaUrls([url]);
    setAutoFilledBadge(`Local Video: ${file.name}`);

    // If title is empty, set default
    if (!title || title.includes('The Pearl') || title.includes('Scholar Haven')) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1) + ' Rental');
    }
  };

  // Handle Image files upload
  const handleImageFilesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newImages = Array.from(files).map((f: File) => ({
      file: f,
      url: URL.createObjectURL(f),
      name: f.name
    }));

    const combined = [...uploadedImageFiles, ...newImages];
    setUploadedImageFiles(combined);

    if (mediaType === 'image_carousel' || !uploadedVideoUrl) {
      setMediaType('image_carousel');
      setPreviewThumbnailUrl(combined[0].url);
      setPreviewMediaUrls(combined.map((img) => img.url));
      setAutoFilledBadge(`${combined.length} Uploaded Photos`);
    }
  };

  const removeUploadedImage = (index: number) => {
    const updated = uploadedImageFiles.filter((_, i) => i !== index);
    setUploadedImageFiles(updated);
    if (updated.length > 0) {
      setPreviewThumbnailUrl(updated[0].url);
      setPreviewMediaUrls(updated.map((img) => img.url));
    }
  };

  const toggleAmenity = (id: string) => {
    if (selectedAmenities.includes(id)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== id));
    } else {
      setSelectedAmenities([...selectedAmenities, id]);
    }
  };

  // Handle Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !priceKes) return;

    const userEmail = currentUser.email || 'sidneywafula30@gmail.com';
    let finalVideoUrl = previewVideoUrl;
    let finalThumbnailUrl = previewThumbnailUrl;
    let finalMediaUrls = previewMediaUrls.length > 0 ? previewMediaUrls : [previewThumbnailUrl];

    // Upload video file to User's Google Drive database if uploaded
    if (uploadedVideoFile) {
      setIsDriveUploading(true);
      setDriveUploadNotice(`Uploading video "${uploadedVideoFile.name}" to your Google Drive database...`);
      try {
        const driveResult = await googleWorkspace.uploadMediaToUserDrive(uploadedVideoFile, userEmail);
        finalVideoUrl = driveResult.directUrl;
        setDriveUploadNotice(`✅ Video saved to your Google Drive (${driveResult.name})`);
      } catch (err) {
        console.warn('Drive video upload note:', err);
      }
      setIsDriveUploading(false);
    }

    // Upload photo files to User's Google Drive database if uploaded
    if (uploadedImageFiles.length > 0) {
      setIsDriveUploading(true);
      setDriveUploadNotice(`Saving ${uploadedImageFiles.length} photos to your Google Drive database...`);
      try {
        const uploadedDriveUrls: string[] = [];
        for (const imgItem of uploadedImageFiles) {
          const driveImg = await googleWorkspace.uploadMediaToUserDrive(imgItem.file, userEmail);
          uploadedDriveUrls.push(driveImg.directUrl);
        }
        if (uploadedDriveUrls.length > 0) {
          finalMediaUrls = uploadedDriveUrls;
          finalThumbnailUrl = uploadedDriveUrls[0];
          setDriveUploadNotice(`✅ ${uploadedDriveUrls.length} photos stored in your Google Drive`);
        }
      } catch (err) {
        console.warn('Drive photos upload note:', err);
      }
      setIsDriveUploading(false);
    }

    const newListing: RentalListing = {
      id: `kenya-hunt-${Date.now()}`,
      title,
      subtitle:
        listingMode === 'campus'
          ? `${selectedUniversity} Housing • ${distanceToGate}`
          : `${bedrooms === 0 ? 'Studio' : `${bedrooms} Bedroom`} in ${estate}, ${county}`,
      estate,
      county,
      address: address || `${estate}, ${county}`,
      priceKes: Number(priceKes),
      pricePeriod: 'month',
      serviceChargeIncluded: true,
      serviceChargeKes: listingMode === 'campus' ? 0 : 4000,
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      sqFt: Number(sqFt),
      category,
      listingMode,
      campusInfo:
        listingMode === 'campus'
          ? {
              university: selectedUniversity,
              campusBranch: campusBranch || `${selectedUniversity} Campus`,
              distanceToGate: distanceToGate || 'Short walk to gate',
              walkingMinutes: Number(walkingMinutes) || 5,
              roommateMatchingAvailable,
              studentPerks,
              securityLevel: '24/7 Manned Gate & CCTV',
              suitableFor: `${selectedUniversity} Students`
            }
          : undefined,
      mediaType,
      videoUrl: mediaType === 'video' ? finalVideoUrl : undefined,
      thumbnailUrl: finalThumbnailUrl,
      mediaUrls: finalMediaUrls,
      audioTrack: {
        title: customAudioChoice,
        artist: customAudioArtist
      },
      landlord: {
        id: `landlord-${Date.now()}`,
        name: agencyName,
        handle: `@${agencyName.replace(/\s+/g, '')}Ke`,
        agencyName,
        avatarUrl:
          currentUser.avatar ||
          'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
        isVerified: true,
        rating: 5.0,
        totalListings: 1,
        phone,
        whatsapp: phone.replace(/[^0-9]/g, ''),
        bio: 'Verified Kenyan Property Manager & Landlord on Kenya House Hunt.',
        responseRate: '5 mins',
        memberSince: 'Today'
      },
      amenities: availableAmenities
        .filter((a) => selectedAmenities.includes(a.id))
        .map((a) => ({ icon: a.id, label: a.label })),
      description:
        description ||
        `Spacious and modern ${bedrooms === 0 ? 'bedsitter' : `${bedrooms} bedroom`} rental in ${estate}. Features constant water supply, secure access, and clean finishes.`,
      depositTerms: `1 Month Rent (KSh ${Number(priceKes).toLocaleString()}) + 1 Month Deposit + Water Deposit KSh 1,500.`,
      waterSupply: '24/7 Borehole + Council reserve supply.',
      electricityType: 'Prepaid Token (KPLC)',
      garbageFeeKes: 300,
      parkingSpots: listingMode === 'campus' ? 0 : 1,
      petPolicy: listingMode === 'campus' ? 'Not Allowed' : 'Allowed',
      availableFrom: 'Immediately',
      certifiedDocuments: [
        {
          id: `doc-${Date.now()}`,
          name: 'Verified Title Deed & Tenancy Permit',
          type: 'title_deed',
          issuer: 'Ministry of Lands / County Housing Registry',
          referenceNumber: docRef || 'KE/REG/2024/091',
          issuedDate: 'Verified 2024',
          status: 'certified',
          verificationBadge: 'Registry Verified',
          summary: 'Verified authentic property free of land boundary or ownership disputes.'
        }
      ],
      stats: {
        likes: 24,
        commentsCount: 2,
        shares: 7,
        views: 89,
        bookmarks: 14
      },
      initialComments: [
        {
          id: `comm-${Date.now()}-1`,
          user: {
            name: 'Kev Mwangi',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
            isVerified: true
          },
          text: 'Is this unit still available for viewing this weekend?',
          timestamp: 'Just now',
          likes: 1
        }
      ],
      nearbyLandmarks: [`${estate} Commercial Hub`, 'Matatu Stage / Main Road']
    };

    onAddListing(newListing);
    setIsSuccess(true);

    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.5 }
      });
    } catch {}

    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1800);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          className="relative w-full max-w-4xl bg-[#0f0f0f] border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-neutral-100 max-h-[94vh] my-auto"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-neutral-800 bg-[#0a0a0a] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FFD700]/10 border border-[#FFD700]/40 flex items-center justify-center text-[#FFD700] shadow-md shadow-[#FFD700]/10">
                <Film className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg sm:text-xl text-white flex items-center gap-2">
                  <span>Add Rental Video Reel</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#FFD700]/20 text-[#FFD700] text-[10px] font-mono font-semibold uppercase tracking-wider">
                    Multi-Source Studio
                  </span>
                </h3>
                <p className="text-xs text-neutral-400">
                  Log in to TikTok, switch to Instagram, Facebook, or upload local device videos & photos to complete the form
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              id="close-post-rental-modal-btn"
              className="p-2 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Success Banner */}
          {isSuccess ? (
            <div className="py-20 text-center space-y-4 px-6 flex-1 flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-[#FFD700]/20 border-2 border-[#FFD700] flex items-center justify-center text-[#FFD700] mx-auto shadow-2xl shadow-[#FFD700]/30 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-bold text-white">Rental Reel Live on Kenya House Hunt!</h4>
              <p className="text-sm text-neutral-400 max-w-md mx-auto">
                Your video listing has been successfully published to {listingMode === 'campus' ? 'Campus Mode (Students)' : 'General Kenyan Rentals'}.
              </p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto scrollbar-thin p-4 sm:p-6 space-y-6">
              {/* SOURCE SELECTOR TABS */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#FFD700]" />
                    <span>Step 1: Choose Media Source</span>
                  </span>
                  {autoFilledBadge && (
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3" /> {autoFilledBadge}
                    </span>
                  )}
                </div>

                {/* 6 Source Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                  {/* TikTok Tab */}
                  <button
                    type="button"
                    onClick={() => setActiveSourceTab('tiktok')}
                    className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden flex items-center gap-2.5 ${
                      activeSourceTab === 'tiktok'
                        ? 'bg-neutral-900 border-[#FFD700] shadow-lg shadow-[#FFD700]/15 ring-1 ring-[#FFD700]/30'
                        : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700 text-neutral-400'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-black border border-pink-500/40 flex items-center justify-center p-2 shrink-0">
                      <TikTokLogo className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white flex items-center gap-1">
                        <span>TikTok</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                      </div>
                      <p className="text-[10px] text-neutral-400 truncate">Reels & Sync</p>
                    </div>
                  </button>

                  {/* Instagram Tab */}
                  <button
                    type="button"
                    onClick={() => setActiveSourceTab('instagram')}
                    className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden flex items-center gap-2.5 ${
                      activeSourceTab === 'instagram'
                        ? 'bg-neutral-900 border-[#FFD700] shadow-lg shadow-[#FFD700]/15 ring-1 ring-[#FFD700]/30'
                        : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700 text-neutral-400'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-black border border-purple-500/40 flex items-center justify-center p-1.5 shrink-0">
                      <InstagramLogo className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white flex items-center gap-1">
                        <span>Instagram</span>
                      </div>
                      <p className="text-[10px] text-neutral-400 truncate">Reels & Carousels</p>
                    </div>
                  </button>

                  {/* Facebook Tab */}
                  <button
                    type="button"
                    onClick={() => setActiveSourceTab('facebook')}
                    className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden flex items-center gap-2.5 ${
                      activeSourceTab === 'facebook'
                        ? 'bg-neutral-900 border-[#FFD700] shadow-lg shadow-[#FFD700]/15 ring-1 ring-[#FFD700]/30'
                        : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700 text-neutral-400'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-black border border-blue-500/40 flex items-center justify-center p-1.5 shrink-0">
                      <FacebookLogo className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white flex items-center gap-1">
                        <span>Facebook</span>
                      </div>
                      <p className="text-[10px] text-neutral-400 truncate">Marketplace Feed</p>
                    </div>
                  </button>

                  {/* YouTube Tab */}
                  <button
                    type="button"
                    onClick={() => setActiveSourceTab('youtube')}
                    className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden flex items-center gap-2.5 ${
                      activeSourceTab === 'youtube'
                        ? 'bg-neutral-900 border-[#FFD700] shadow-lg shadow-[#FFD700]/15 ring-1 ring-[#FFD700]/30'
                        : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700 text-neutral-400'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-black border border-red-500/40 flex items-center justify-center p-1.5 shrink-0">
                      <YouTubeLogo className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white flex items-center gap-1">
                        <span>YouTube</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      </div>
                      <p className="text-[10px] text-neutral-400 truncate">Shorts & 4K Tours</p>
                    </div>
                  </button>

                  {/* Google Drive Storage DB Tab */}
                  <button
                    type="button"
                    onClick={() => setActiveSourceTab('gdrive')}
                    className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden flex items-center gap-2.5 ${
                      activeSourceTab === 'gdrive'
                        ? 'bg-neutral-900 border-[#FFD700] shadow-lg shadow-[#FFD700]/15 ring-1 ring-[#FFD700]/30'
                        : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700 text-neutral-400'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-black border border-blue-500/40 flex items-center justify-center p-2 shrink-0">
                      <GoogleDriveLogo className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white flex items-center gap-1">
                        <span>Google Drive</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      </div>
                      <p className="text-[10px] text-neutral-400 truncate">User Media DB</p>
                    </div>
                  </button>

                  {/* Files / Device Upload Tab */}
                  <button
                    type="button"
                    onClick={() => setActiveSourceTab('files')}
                    className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden flex items-center gap-2.5 ${
                      activeSourceTab === 'files'
                        ? 'bg-neutral-900 border-[#FFD700] shadow-lg shadow-[#FFD700]/15 ring-1 ring-[#FFD700]/30'
                        : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700 text-neutral-400'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-black border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 font-bold text-sm">
                      <Upload className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white flex items-center gap-1">
                        <span>Device Files</span>
                      </div>
                      <p className="text-[10px] text-neutral-400 truncate">Upload & Save DB</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* SOURCE TAB CONTENT PANELS */}
              <div className="bg-neutral-900/60 border border-neutral-800 rounded-3xl p-4 sm:p-5 space-y-4">
                {/* 1. TIKTOK PANEL */}
                {activeSourceTab === 'tiktok' && (
                  <div className="space-y-4">
                    {/* TikTok User Account Login / Switcher Banner */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={selectedTikTokCreator.avatar}
                            alt={selectedTikTokCreator.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-pink-500"
                          />
                          <div className="absolute -bottom-1 -right-1 p-1 bg-black rounded-full border border-pink-500 flex items-center justify-center">
                            <TikTokLogo className="w-3 h-3" />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold text-white">{selectedTikTokCreator.name}</span>
                            <span className="text-xs text-neutral-400 font-mono">{selectedTikTokCreator.handle}</span>
                          </div>
                          <p className="text-[11px] text-neutral-400">
                            {selectedTikTokCreator.followers} Followers • {selectedTikTokCreator.likesCount} Likes
                          </p>
                        </div>
                      </div>

                      {/* Log in with TikTok / Switch Account Button */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => setShowTikTokLoginModal(true)}
                          className="px-3.5 py-2 rounded-xl bg-pink-500 hover:bg-pink-400 text-black text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-pink-500/20 cursor-pointer"
                        >
                          <TikTokLogo className="w-3.5 h-3.5" />
                          <span>Switch TikTok Account</span>
                        </button>
                      </div>
                    </div>

                    {/* Quick Creator Account Selectors */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                      <span className="text-[11px] font-mono text-neutral-400 shrink-0">
                        Quick TikTok Profiles:
                      </span>
                      {TIKTOK_MOCK_CREATORS.map((creator) => (
                        <button
                          key={creator.handle}
                          type="button"
                          onClick={() => {
                            setSelectedTikTokCreator(creator);
                            const matched = TIKTOK_VIDEOS.find((v) => v.creatorHandle === creator.handle) || TIKTOK_VIDEOS[0];
                            applySocialItem(matched);
                          }}
                          className={`px-2.5 py-1 rounded-xl text-[11px] font-mono whitespace-nowrap transition-all flex items-center gap-1.5 ${
                            selectedTikTokCreator.handle === creator.handle
                              ? 'bg-[#FFD700] text-black font-bold shadow-md shadow-[#FFD700]/20'
                              : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800'
                          }`}
                        >
                          <TikTokLogo className="w-3 h-3" />
                          <span>{creator.handle}</span>
                        </button>
                      ))}
                    </div>

                    {/* TikTok Video Selection Grid */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                          <Play className="w-3 h-3 text-[#FFD700] fill-current" />
                          <span>Click on any TikTok Video to Select & Auto-Fill Form:</span>
                        </span>
                        <span className="text-[10px] text-neutral-500 font-mono">
                          {TIKTOK_VIDEOS.length} Verified Reels Ready
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {TIKTOK_VIDEOS.map((video) => {
                          const isSelected = selectedSocialItem?.id === video.id;

                          return (
                            <div
                              key={video.id}
                              onClick={() => applySocialItem(video)}
                              className={`group relative rounded-2xl overflow-hidden border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                                isSelected
                                  ? 'border-[#FFD700] ring-2 ring-[#FFD700]/60 bg-neutral-900 shadow-xl'
                                  : 'border-neutral-800 hover:border-neutral-700 bg-neutral-950/70 hover:bg-neutral-950'
                              }`}
                            >
                              {/* Thumbnail & Video Badge */}
                              <div className="relative aspect-[4/3] sm:aspect-video w-full overflow-hidden bg-black">
                                <img
                                  src={video.thumbnailUrl}
                                  alt={video.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80 group-hover:opacity-100"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                                {/* Duration & View Count */}
                                <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/75 rounded-md text-[10px] font-mono text-white backdrop-blur-sm flex items-center gap-1">
                                  <Play className="w-2.5 h-2.5 fill-current text-[#FFD700]" />
                                  <span>{video.duration}</span>
                                </div>

                                <div className="absolute top-2 right-2 px-2 py-0.5 bg-pink-500/90 rounded-md text-[10px] font-bold text-black backdrop-blur-sm flex items-center gap-1">
                                  <TikTokLogo className="w-2.5 h-2.5" />
                                  <span>{video.views}</span>
                                </div>

                                {isSelected && (
                                  <div className="absolute inset-0 bg-[#FFD700]/25 flex items-center justify-center backdrop-blur-[2px]">
                                    <div className="px-3 py-1 bg-[#FFD700] text-black font-bold text-xs rounded-full flex items-center gap-1 shadow-lg">
                                      <Check className="w-3.5 h-3.5" />
                                      <span>Selected & Loaded</span>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Title & Caption */}
                              <div className="p-3 space-y-1.5 flex-1 flex flex-col justify-between">
                                <div>
                                  <h4 className={`text-xs font-bold line-clamp-1 ${isSelected ? 'text-[#FFD700]' : 'text-white'}`}>
                                    {video.title}
                                  </h4>
                                  <p className="text-[11px] text-neutral-400 line-clamp-2 mt-0.5 leading-snug">
                                    {video.caption}
                                  </p>
                                </div>

                                <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[10px] font-mono text-neutral-400">
                                  <span className="text-[#FFD700] font-bold">
                                    KSh {video.suggestedData.priceKes.toLocaleString()}
                                  </span>
                                  <span className="truncate max-w-[100px]">{video.suggestedData.estate}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Or Paste Direct TikTok Link */}
                    <div className="pt-2 flex gap-2">
                      <div className="relative flex-1">
                        <LinkIcon className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="url"
                          value={directLinkInput}
                          onChange={(e) => setDirectLinkInput(e.target.value)}
                          placeholder="Or paste TikTok reel link (e.g. tiktok.com/@user/video/...)"
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#FFD700]"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleDirectLinkImport}
                        disabled={!directLinkInput.trim() || isDirectSyncing}
                        className="px-4 py-2 bg-pink-500 hover:bg-pink-400 text-black font-bold text-xs rounded-xl uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 disabled:opacity-40"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isDirectSyncing ? 'animate-spin' : ''}`} />
                        <span>{isDirectSyncing ? 'Syncing...' : 'Fetch Reel'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* 2. INSTAGRAM PANEL */}
                {activeSourceTab === 'instagram' && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12">
                          <img
                            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                            alt="Instagram Profile"
                            className="w-full h-full rounded-full object-cover border-2 border-neutral-700"
                          />
                          <div className="absolute -bottom-1 -right-1 p-0.5 bg-black rounded-full">
                            <InstagramLogo className="w-4 h-4" />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold text-white">Joice Real Estate KE</span>
                            <span className="text-xs text-purple-400 font-mono">{selectedIgHandle}</span>
                          </div>
                          <p className="text-[11px] text-neutral-400">Connected Instagram Business Account • 45.2K Followers</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowIgLoginModal(true)}
                        className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-90 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-md cursor-pointer"
                      >
                        <InstagramLogo className="w-4 h-4" />
                        <span>Switch Instagram Account</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                        Click on an Instagram Reel or Carousel to Import:
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {INSTAGRAM_POSTS.map((post) => {
                          const isSelected = selectedSocialItem?.id === post.id;

                          return (
                            <div
                              key={post.id}
                              onClick={() => applySocialItem(post)}
                              className={`group relative rounded-2xl overflow-hidden border cursor-pointer transition-all flex flex-col justify-between ${
                                isSelected
                                  ? 'border-[#FFD700] ring-2 ring-[#FFD700]/60 bg-neutral-900 shadow-xl'
                                  : 'border-neutral-800 hover:border-neutral-700 bg-neutral-950/70'
                              }`}
                            >
                              <div className="relative aspect-video w-full overflow-hidden bg-black">
                                <img
                                  src={post.thumbnailUrl}
                                  alt={post.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/75 rounded text-[10px] font-mono text-white">
                                  {post.duration}
                                </div>
                                <div className="absolute top-2 right-2 px-2 py-0.5 bg-purple-600/90 rounded text-[10px] font-bold text-white flex items-center gap-1">
                                  <InstagramLogo className="w-3 h-3" />
                                  <span>{post.likes}</span>
                                </div>
                                {isSelected && (
                                  <div className="absolute inset-0 bg-[#FFD700]/25 flex items-center justify-center backdrop-blur-[2px]">
                                    <div className="px-3 py-1 bg-[#FFD700] text-black font-bold text-xs rounded-full flex items-center gap-1">
                                      <Check className="w-3.5 h-3.5" />
                                      <span>Selected</span>
                                    </div>
                                  </div>
                                )}
                              </div>

                              <div className="p-3">
                                <h4 className="text-xs font-bold text-white truncate">{post.title}</h4>
                                <p className="text-[11px] text-neutral-400 line-clamp-2 mt-0.5">{post.caption}</p>
                                <div className="pt-2 mt-2 border-t border-neutral-800 flex justify-between text-[11px] font-mono text-neutral-300">
                                  <span className="text-[#FFD700] font-bold">KSh {post.suggestedData.priceKes.toLocaleString()}</span>
                                  <span>{post.suggestedData.estate}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. FACEBOOK PANEL */}
                {activeSourceTab === 'facebook' && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0">
                          <FacebookLogo className="w-12 h-12" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold text-white">{selectedFbPage}</span>
                            <span className="p-0.5 bg-blue-500 text-white rounded-full text-[9px] font-bold">✓</span>
                          </div>
                          <p className="text-[11px] text-neutral-400">Facebook Page & Marketplace Feed • 29.1K Members</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowFbLoginModal(true)}
                        className="px-3.5 py-2 rounded-xl bg-[#1877F2] hover:bg-blue-600 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-md shadow-blue-600/20 cursor-pointer"
                      >
                        <FacebookLogo className="w-4 h-4" />
                        <span>Switch Facebook Page</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                        Click on a Facebook Video Post or Listing:
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {FACEBOOK_POSTS.map((post) => {
                          const isSelected = selectedSocialItem?.id === post.id;

                          return (
                            <div
                              key={post.id}
                              onClick={() => applySocialItem(post)}
                              className={`group relative rounded-2xl overflow-hidden border cursor-pointer transition-all flex flex-col justify-between ${
                                isSelected
                                  ? 'border-[#FFD700] ring-2 ring-[#FFD700]/60 bg-neutral-900 shadow-xl'
                                  : 'border-neutral-800 hover:border-neutral-700 bg-neutral-950/70'
                              }`}
                            >
                              <div className="relative aspect-video w-full overflow-hidden bg-black">
                                <img
                                  src={post.thumbnailUrl}
                                  alt={post.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/75 rounded text-[10px] font-mono text-white">
                                  {post.duration}
                                </div>
                                <div className="absolute top-2 right-2 px-2 py-0.5 bg-[#1877F2]/90 rounded text-[10px] font-bold text-white flex items-center gap-1">
                                  <FacebookLogo className="w-3 h-3" />
                                  <span>{post.likes}</span>
                                </div>
                                {isSelected && (
                                  <div className="absolute inset-0 bg-[#FFD700]/25 flex items-center justify-center backdrop-blur-[2px]">
                                    <div className="px-3 py-1 bg-[#FFD700] text-black font-bold text-xs rounded-full flex items-center gap-1">
                                      <Check className="w-3.5 h-3.5" />
                                      <span>Selected</span>
                                    </div>
                                  </div>
                                )}
                              </div>

                              <div className="p-3">
                                <h4 className="text-xs font-bold text-white truncate">{post.title}</h4>
                                <p className="text-[11px] text-neutral-400 line-clamp-2 mt-0.5">{post.caption}</p>
                                <div className="pt-2 mt-2 border-t border-neutral-800 flex justify-between text-[11px] font-mono text-neutral-300">
                                  <span className="text-[#FFD700] font-bold">KSh {post.suggestedData.priceKes.toLocaleString()}</span>
                                  <span>{post.suggestedData.estate}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. YOUTUBE SHORTS & 4K TOURS PANEL */}
                {activeSourceTab === 'youtube' && (
                  <div className="space-y-4">
                    {/* YouTube Channel Account Switcher Banner */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={selectedYtChannel.avatar}
                            alt={selectedYtChannel.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-red-500"
                          />
                          <div className="absolute -bottom-1 -right-1 p-1 bg-black rounded-full border border-red-500 flex items-center justify-center">
                            <YouTubeLogo className="w-3 h-3" />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold text-white">{selectedYtChannel.name}</span>
                            <span className="text-xs text-neutral-400 font-mono">{selectedYtChannel.handle}</span>
                          </div>
                          <p className="text-[11px] text-neutral-400">
                            {selectedYtChannel.subscribers} • {selectedYtChannel.videosCount}
                          </p>
                        </div>
                      </div>

                      {/* Switch Channel Button */}
                      <button
                        type="button"
                        onClick={() => setShowYtChannelModal(true)}
                        className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-md shadow-red-600/20 cursor-pointer"
                      >
                        <YouTubeLogo className="w-4 h-4" />
                        <span>Switch YouTube Channel</span>
                      </button>
                    </div>

                    {/* Quick YouTube Channel Selectors */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                      <span className="text-[11px] font-mono text-neutral-400 shrink-0">
                        Top Kenyan Channels:
                      </span>
                      {YOUTUBE_CHANNELS.map((channel) => (
                        <button
                          key={channel.handle}
                          type="button"
                          onClick={() => {
                            setSelectedYtChannel(channel);
                            const matched = YOUTUBE_VIDEOS.find((v) => v.creatorHandle === channel.handle) || YOUTUBE_VIDEOS[0];
                            applySocialItem(matched);
                          }}
                          className={`px-2.5 py-1 rounded-xl text-[11px] font-mono whitespace-nowrap transition-all flex items-center gap-1.5 ${
                            selectedYtChannel.handle === channel.handle
                              ? 'bg-red-600 text-white font-bold shadow-md shadow-red-600/20'
                              : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800'
                          }`}
                        >
                          <YouTubeLogo className="w-3 h-3" />
                          <span>{channel.handle}</span>
                        </button>
                      ))}
                    </div>

                    {/* Direct YouTube Video Link Importer */}
                    <div className="p-3.5 rounded-2xl bg-neutral-950 border border-red-500/30 flex flex-col sm:flex-row items-center gap-2.5">
                      <div className="flex items-center gap-2 text-xs text-neutral-300 shrink-0">
                        <YouTubeLogo className="w-4 h-4" />
                        <span className="font-bold">Paste YouTube / Shorts URL:</span>
                      </div>
                      <div className="flex-1 flex items-center gap-2 w-full">
                        <input
                          type="url"
                          placeholder="https://youtube.com/shorts/xyz or https://youtu.be/..."
                          value={directLinkInput}
                          onChange={(e) => setDirectLinkInput(e.target.value)}
                          className="flex-1 px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500"
                        />
                        <button
                          type="button"
                          onClick={handleDirectLinkImport}
                          disabled={isDirectSyncing || !directLinkInput}
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1 shrink-0 cursor-pointer"
                        >
                          {isDirectSyncing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                          <span>Auto-Import</span>
                        </button>
                      </div>
                    </div>

                    {/* YouTube Video Selection Grid */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                          <Play className="w-3 h-3 text-red-500 fill-current" />
                          <span>Click on any YouTube Shorts or Tour to Select & Auto-Fill Form:</span>
                        </span>
                        <span className="text-[10px] text-neutral-500 font-mono">
                          {YOUTUBE_VIDEOS.length} YouTube Videos Ready
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {YOUTUBE_VIDEOS.map((ytVid) => {
                          const isSelected = selectedSocialItem?.id === ytVid.id;

                          return (
                            <div
                              key={ytVid.id}
                              onClick={() => applySocialItem(ytVid)}
                              className={`group relative rounded-2xl overflow-hidden border cursor-pointer transition-all flex flex-col justify-between ${
                                isSelected
                                  ? 'border-[#FFD700] ring-2 ring-[#FFD700]/60 bg-neutral-900 shadow-xl'
                                  : 'border-neutral-800 hover:border-red-500/50 bg-neutral-950/70'
                              }`}
                            >
                              <div className="relative aspect-video w-full overflow-hidden bg-black">
                                <img
                                  src={ytVid.thumbnailUrl}
                                  alt={ytVid.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 rounded text-[10px] font-mono text-white flex items-center gap-1">
                                  <YouTubeLogo className="w-3 h-3" />
                                  <span>{ytVid.duration}</span>
                                </div>
                                <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/80 rounded text-[10px] font-mono text-neutral-300">
                                  {ytVid.views} views
                                </div>
                                {isSelected && (
                                  <div className="absolute inset-0 bg-[#FFD700]/25 flex items-center justify-center backdrop-blur-[2px]">
                                    <div className="px-3 py-1 bg-[#FFD700] text-black font-bold text-xs rounded-full flex items-center gap-1">
                                      <Check className="w-3.5 h-3.5" />
                                      <span>Selected</span>
                                    </div>
                                  </div>
                                )}
                              </div>

                              <div className="p-3">
                                <h4 className="text-xs font-bold text-white truncate">{ytVid.title}</h4>
                                <p className="text-[11px] text-neutral-400 line-clamp-2 mt-0.5">{ytVid.caption}</p>
                                <div className="pt-2 mt-2 border-t border-neutral-800 flex justify-between text-[11px] font-mono text-neutral-300">
                                  <span className="text-[#FFD700] font-bold">KSh {ytVid.suggestedData.priceKes.toLocaleString()}</span>
                                  <span>{ytVid.suggestedData.estate}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. GOOGLE DRIVE USER MEDIA DATABASE PANEL */}
                {activeSourceTab === 'gdrive' && (
                  <div className="space-y-4">
                    {/* Google Drive User Storage Banner */}
                    <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-black border border-blue-500/30 flex items-center justify-center p-2 shrink-0 shadow-lg">
                          <GoogleDriveLogo className="w-7 h-7" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white flex items-center gap-2">
                            <span>User Google Drive Storage Database</span>
                            <span className="text-[9px] font-mono px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded-full border border-blue-500/30">
                              Connected
                            </span>
                          </h4>
                          <p className="text-xs text-neutral-400 mt-0.5">
                            Target Folder: <code className="text-blue-300 bg-black/50 px-1.5 py-0.5 rounded font-mono text-[10px]">KenyaHouseHunt_Reels_{(currentUser.email || 'sidneywafula30@gmail.com').replace(/[^a-zA-Z0-9]/g, '_')}</code>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => fileVideoInputRef.current?.click()}
                          className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload File to Drive DB</span>
                        </button>
                      </div>
                    </div>

                    {/* Stored Google Drive Files List for this user */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                          <GoogleDriveLogo className="w-3.5 h-3.5" />
                          <span>Your Stored Drive Files & Available Media:</span>
                        </span>
                        <span className="text-[10px] text-neutral-500 font-mono">
                          {googleWorkspace.getUserDriveFiles(currentUser.email || 'sidneywafula30@gmail.com').length} Files in Drive DB
                        </span>
                      </div>

                      {googleWorkspace.getUserDriveFiles(currentUser.email || 'sidneywafula30@gmail.com').length === 0 ? (
                        <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 text-center space-y-2">
                          <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto p-2">
                            <GoogleDriveLogo className="w-6 h-6" />
                          </div>
                          <p className="text-xs text-white font-bold">No files uploaded to your Google Drive yet</p>
                          <p className="text-[11px] text-neutral-400 max-w-sm mx-auto">
                            Upload a video or photo from your device below. It will automatically upload and index into your private Google Drive database folder.
                          </p>
                          <button
                            type="button"
                            onClick={() => fileVideoInputRef.current?.click()}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer mt-2"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Select Video / Image for Google Drive</span>
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {googleWorkspace.getUserDriveFiles(currentUser.email || 'sidneywafula30@gmail.com').map((df) => (
                            <div
                              key={df.id}
                              onClick={() => {
                                if (df.mimeType.startsWith('video/')) {
                                  setMediaType('video');
                                  setPreviewVideoUrl(df.directUrl);
                                } else {
                                  setMediaType('image_carousel');
                                  setPreviewThumbnailUrl(df.directUrl);
                                  setPreviewMediaUrls([df.directUrl]);
                                }
                                setAutoFilledBadge(`From Google Drive: ${df.name}`);
                              }}
                              className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-blue-500 cursor-pointer transition-all flex items-center justify-between gap-2 group"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center p-1.5 shrink-0">
                                  <GoogleDriveLogo className="w-5 h-5" />
                                </div>
                                <div className="min-w-0">
                                  <div className="text-xs font-bold text-white truncate group-hover:text-blue-300">
                                    {df.name}
                                  </div>
                                  <div className="text-[10px] text-neutral-500 font-mono truncate">{df.mimeType}</div>
                                </div>
                              </div>
                              <span className="text-[10px] text-blue-400 font-bold shrink-0">Select →</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 4. FILES & UPLOADS PANEL */}
                {activeSourceTab === 'files' && (
                  <div className="space-y-4">
                    {/* Google Drive Database Banner */}
                    <div className="p-3.5 rounded-2xl bg-blue-950/40 border border-blue-500/30 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                          <HardDrive className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white flex items-center gap-1.5">
                            <span>User Google Drive Storage Database</span>
                            <span className="text-[9px] font-mono px-1.5 py-0.2 bg-blue-500/20 text-blue-300 rounded border border-blue-500/30">
                              Auto-Saved
                            </span>
                          </p>
                          <p className="text-[10px] text-neutral-400">
                            Videos and photos will be stored directly inside <strong>{currentUser.email || 'your'}</strong> Google Drive.
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                          Drive DB Active
                        </span>
                      </div>
                    </div>

                    {driveUploadNotice && (
                      <div className="p-2.5 rounded-xl bg-neutral-900 border border-blue-500/50 text-blue-300 text-xs font-mono flex items-center gap-2 animate-pulse">
                        <Sparkles className="w-3.5 h-3.5 text-[#FFD700]" />
                        <span>{driveUploadNotice}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Video Upload Dropzone */}
                      <div
                        onClick={() => fileVideoInputRef.current?.click()}
                        className="p-5 border-2 border-dashed border-neutral-700 hover:border-[#FFD700] rounded-2xl bg-neutral-950/80 hover:bg-neutral-950 flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
                      >
                        <input
                          ref={fileVideoInputRef}
                          type="file"
                          accept="video/mp4,video/webm,video/quicktime"
                          onChange={handleVideoFileUpload}
                          className="hidden"
                        />
                        <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[#FFD700] mb-2 group-hover:scale-110 transition-transform">
                          <Video className="w-6 h-6" />
                        </div>
                        <h4 className="text-xs font-bold text-white">Upload Video File (.mp4, .mov)</h4>
                        <p className="text-[11px] text-neutral-400 mt-1">
                          {uploadedVideoFile ? `Selected: ${uploadedVideoFile.name}` : 'Drag & drop or browse device gallery'}
                        </p>
                        {uploadedVideoFile && (
                          <span className="mt-2 px-2.5 py-0.5 bg-blue-500/20 text-blue-400 rounded-full text-[10px] font-bold">
                            ✓ Ready to Save to Google Drive
                          </span>
                        )}
                      </div>

                      {/* Photo Upload Dropzone */}
                      <div
                        onClick={() => fileImagesInputRef.current?.click()}
                        className="p-5 border-2 border-dashed border-neutral-700 hover:border-[#FFD700] rounded-2xl bg-neutral-950/80 hover:bg-neutral-950 flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
                      >
                        <input
                          ref={fileImagesInputRef}
                          type="file"
                          multiple
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleImageFilesUpload}
                          className="hidden"
                        />
                        <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-emerald-400 mb-2 group-hover:scale-110 transition-transform">
                          <ImageIcon className="w-6 h-6" />
                        </div>
                        <h4 className="text-xs font-bold text-white">Upload Image Photos (Multi-select)</h4>
                        <p className="text-[11px] text-neutral-400 mt-1">
                          {uploadedImageFiles.length > 0 ? `${uploadedImageFiles.length} Photos Selected` : 'Front view, living room, bedroom, bathroom'}
                        </p>
                        {uploadedImageFiles.length > 0 && (
                          <span className="mt-2 px-2.5 py-0.5 bg-blue-500/20 text-blue-400 rounded-full text-[10px] font-bold">
                            ✓ {uploadedImageFiles.length} Images Ready for Drive
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Uploaded Photos Strip */}
                    {uploadedImageFiles.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-[11px] font-mono text-neutral-400 block">Uploaded Photo Carousel Gallery:</span>
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                          {uploadedImageFiles.map((img, idx) => (
                            <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-neutral-700 group">
                              <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeUploadedImage(idx);
                                }}
                                className="absolute top-1 right-1 p-1 bg-black/80 hover:bg-rose-600 rounded-full text-white text-xs transition-colors"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* LIVE MEDIA & AUDIO PREVIEW CARD */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 p-4 sm:p-5 rounded-3xl bg-neutral-950 border border-neutral-800">
                {/* Media Player Box (5 columns on desktop) */}
                <div className="md:col-span-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-[#FFD700]" />
                      <span>Live Reel Player</span>
                    </span>
                    <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-xl border border-neutral-800">
                      <button
                        type="button"
                        onClick={() => setMediaType('video')}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                          mediaType === 'video' ? 'bg-[#FFD700] text-black' : 'text-neutral-400'
                        }`}
                      >
                        Video
                      </button>
                      <button
                        type="button"
                        onClick={() => setMediaType('image_carousel')}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                          mediaType === 'image_carousel' ? 'bg-[#FFD700] text-black' : 'text-neutral-400'
                        }`}
                      >
                        Carousel
                      </button>
                    </div>
                  </div>

                  {/* Reel Player Screen */}
                  <div className="relative aspect-[9/14] max-h-[380px] w-full rounded-2xl overflow-hidden bg-black border border-neutral-800 mx-auto shadow-2xl flex items-center justify-center">
                    {mediaType === 'video' && previewVideoUrl ? (
                      <video
                        ref={videoRef}
                        src={previewVideoUrl}
                        poster={previewThumbnailUrl}
                        controls
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="relative w-full h-full">
                        <img
                          src={previewMediaUrls[activePreviewImageIdx] || previewThumbnailUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        {previewMediaUrls.length > 1 && (
                          <>
                            <button
                              type="button"
                              onClick={() => setActivePreviewImageIdx((prev) => (prev - 1 + previewMediaUrls.length) % previewMediaUrls.length)}
                              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/60 rounded-full text-white"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setActivePreviewImageIdx((prev) => (prev + 1) % previewMediaUrls.length)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/60 rounded-full text-white"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                              {previewMediaUrls.map((_, i) => (
                                <span
                                  key={i}
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    i === activePreviewImageIdx ? 'bg-[#FFD700]' : 'bg-white/40'
                                  }`}
                                />
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {/* Floating Overlay Pill */}
                    <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[#FFD700] text-[10px] font-bold border border-[#FFD700]/30">
                      KSh {Number(priceKes || 0).toLocaleString()} / mo
                    </div>
                  </div>

                  {/* Audio Track Selector */}
                  <div className="space-y-1.5 pt-1">
                    <label className="text-[11px] font-mono text-neutral-400 flex items-center gap-1">
                      <Music className="w-3.5 h-3.5 text-[#FFD700]" />
                      <span>Soundtrack / Audio Vibe:</span>
                    </label>
                    <select
                      value={customAudioChoice}
                      onChange={(e) => {
                        setCustomAudioChoice(e.target.value);
                        const matched = popularKenyanSounds.find((s) => s.title === e.target.value);
                        if (matched) setCustomAudioArtist(matched.artist);
                      }}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD700]"
                    >
                      {popularKenyanSounds.map((sound, i) => (
                        <option key={i} value={sound.title}>
                          🎵 {sound.title} — {sound.artist}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Quick Info & Form Jump (7 columns on desktop) */}
                <div className="md:col-span-7 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 bg-neutral-900/80 border border-neutral-800 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono text-[#FFD700] font-bold uppercase tracking-wider">
                          Auto-Extracted Property Summary
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                          Ready to Edit & Post
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{title || 'Untitled Rental'}</h4>
                      <p className="text-xs text-neutral-400 line-clamp-2">{description}</p>
                      <div className="flex flex-wrap gap-2 text-xs font-mono text-neutral-300 pt-1 border-t border-neutral-800">
                        <span>💰 KSh {Number(priceKes || 0).toLocaleString()}</span>
                        <span>•</span>
                        <span>📍 {estate}, {county}</span>
                        <span>•</span>
                        <span>🛏️ {bedrooms === 0 ? 'Bedsitter' : `${bedrooms} BR`}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-[#FFD700] shrink-0" />
                        <div>
                          <h5 className="text-xs font-bold text-white">Title Deed & Ownership Verified</h5>
                          <p className="text-[11px] text-neutral-400">Ref: {docRef || 'KE/REG/2024/091'}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => formSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
                        className="px-3 py-1.5 bg-[#FFD700] text-black font-bold text-xs rounded-xl flex items-center gap-1 shadow-md shadow-[#FFD700]/20 hover:bg-yellow-300 transition-colors shrink-0"
                      >
                        <span>Edit Form</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-[11px] text-neutral-500 italic">
                    Tip: Modify any form details below before publishing to ensure full compliance with Nairobi & campus tenant standards.
                  </p>
                </div>
              </div>

              {/* STEP 2: COMPLETE LISTING FORM */}
              <div ref={formSectionRef} className="space-y-4 pt-2">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#FFD700]" />
                    <span>Step 2: Complete Form Details & Amenities</span>
                  </span>
                  <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-xl border border-neutral-800">
                    <button
                      type="button"
                      onClick={() => setListingMode('general')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        listingMode === 'general'
                          ? 'bg-[#FFD700] text-black shadow-md'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      General Rental
                    </button>
                    <button
                      type="button"
                      onClick={() => setListingMode('campus')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                        listingMode === 'campus'
                          ? 'bg-[#FFD700] text-black shadow-md'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span>Campus Mode</span>
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Title & Category */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[11px] font-mono text-neutral-400">Listing Title *</label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        placeholder="e.g. The Pearl Executive 2BR Kilimani"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD700]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-neutral-400">Property Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as any)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD700]"
                      >
                        <option value="bedsitter">Bedsitter / Studio</option>
                        <option value="1br">1 Bedroom</option>
                        <option value="2br">2 Bedroom</option>
                        <option value="3br">3 Bedroom</option>
                        <option value="luxury">Luxury Penthouse</option>
                      </select>
                    </div>
                  </div>

                  {/* Campus Mode Fields */}
                  {listingMode === 'campus' && (
                    <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-2xl space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#FFD700]">
                        <GraduationCap className="w-4 h-4" />
                        <span>University Student Campus Housing Details</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-[11px] font-mono text-neutral-400">University</label>
                          <input
                            type="text"
                            value={selectedUniversity}
                            onChange={(e) => setSelectedUniversity(e.target.value)}
                            placeholder="e.g. Kenyatta University (KU)"
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD700]"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-mono text-neutral-400">Gate / Campus Branch</label>
                          <input
                            type="text"
                            value={campusBranch}
                            onChange={(e) => setCampusBranch(e.target.value)}
                            placeholder="e.g. Main Campus (KM Gate)"
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD700]"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-mono text-neutral-400">Walking Minutes to Class</label>
                          <input
                            type="number"
                            value={walkingMinutes}
                            onChange={(e) => {
                              setWalkingMinutes(Number(e.target.value));
                              setDistanceToGate(`${e.target.value} min walk to campus gate`);
                            }}
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD700]"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Price, Estate, County */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-neutral-400">Monthly Rent (KSh) *</label>
                      <input
                        type="number"
                        value={priceKes}
                        onChange={(e) => setPriceKes(Number(e.target.value))}
                        required
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-[#FFD700]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-neutral-400">Estate / Neighborhood *</label>
                      <input
                        type="text"
                        value={estate}
                        onChange={(e) => setEstate(e.target.value)}
                        required
                        placeholder="e.g. Kilimani, Roysambu, Juja"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD700]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-neutral-400">County *</label>
                      <input
                        type="text"
                        value={county}
                        onChange={(e) => setCounty(e.target.value)}
                        required
                        placeholder="e.g. Nairobi, Kiambu, Machakos"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD700]"
                      />
                    </div>
                  </div>

                  {/* Bedrooms, Bathrooms, SqFt, Landlord Agency */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-neutral-400">Bedrooms</label>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={bedrooms}
                        onChange={(e) => setBedrooms(Number(e.target.value))}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD700]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-neutral-400">Bathrooms</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={bathrooms}
                        onChange={(e) => setBathrooms(Number(e.target.value))}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD700]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-neutral-400">Size (Sq Ft)</label>
                      <input
                        type="number"
                        value={sqFt}
                        onChange={(e) => setSqFt(Number(e.target.value))}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD700]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-neutral-400">Landlord WhatsApp</label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+254 7..."
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD700]"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-neutral-400">Listing Description</label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Highlight water supply, token electricity, security, nearby malls..."
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#FFD700] resize-none"
                    />
                  </div>

                  {/* Amenities Checkboxes */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-mono text-neutral-400 block">
                      Amenities & Compound Features:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {availableAmenities.map((amenity) => {
                        const isChecked = selectedAmenities.includes(amenity.id);
                        return (
                          <button
                            key={amenity.id}
                            type="button"
                            onClick={() => toggleAmenity(amenity.id)}
                            className={`p-2 rounded-xl border text-xs font-semibold text-left transition-all flex items-center gap-2 ${
                              isChecked
                                ? 'bg-[#FFD700]/15 border-[#FFD700] text-white'
                                : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                            }`}
                          >
                            <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[10px] ${
                              isChecked ? 'bg-[#FFD700] border-[#FFD700] text-black font-bold' : 'border-neutral-700'
                            }`}>
                              {isChecked ? '✓' : ''}
                            </span>
                            <span className="truncate">{amenity.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 border-t border-neutral-800 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-bold rounded-xl transition-colors"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#FFD700] hover:bg-yellow-300 text-black text-xs font-black rounded-xl uppercase tracking-wider transition-all shadow-lg shadow-[#FFD700]/25 flex items-center gap-2 cursor-pointer"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Publish Rental Reel Live</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TIKTOK LOGIN MODAL */}
          {showTikTokLoginModal && (
            <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-neutral-950 border border-neutral-800 rounded-3xl p-5 sm:p-6 w-full max-w-md space-y-4 shadow-2xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-black border border-pink-500 flex items-center justify-center text-pink-400 font-bold text-lg">
                      🎵
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white">Log in to TikTok</h4>
                      <p className="text-[11px] text-neutral-400">Connect your TikTok profile to import reels</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowTikTokLoginModal(false)}
                    className="p-1.5 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-900"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Quick 1-Tap Login with Verified Creators */}
                <div className="space-y-2">
                  <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block">
                    Choose TikTok Profile to Connect:
                  </span>
                  <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                    {TIKTOK_MOCK_CREATORS.map((creator) => (
                      <div
                        key={creator.handle}
                        onClick={() => handleTikTokLogin(creator.handle)}
                        className="p-2.5 bg-neutral-900 hover:bg-neutral-800/80 border border-neutral-800 hover:border-pink-500 rounded-2xl flex items-center justify-between cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={creator.avatar}
                            alt={creator.name}
                            className="w-9 h-9 rounded-full object-cover border border-pink-500"
                          />
                          <div>
                            <div className="flex items-center gap-1">
                              <span className="text-xs font-bold text-white">{creator.name}</span>
                              <span className="text-[9px] bg-pink-500 text-black px-1 rounded font-bold">PRO</span>
                            </div>
                            <span className="text-[10px] text-neutral-400 font-mono">{creator.handle}</span>
                          </div>
                        </div>
                        <span className="text-[10px] text-pink-400 font-mono font-bold">Connect →</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Or enter custom handle */}
                <div className="pt-2 border-t border-neutral-800 space-y-2">
                  <label className="text-[11px] font-mono text-neutral-400">Or type custom @handle</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customTikTokHandle}
                      onChange={(e) => setCustomTikTokHandle(e.target.value)}
                      placeholder="@yourhandle"
                      className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-pink-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleTikTokLogin(customTikTokHandle || '@joicerentals')}
                      disabled={isLoggingInTikTok}
                      className="px-4 py-2 bg-pink-500 hover:bg-pink-400 text-black font-bold text-xs rounded-xl transition-all"
                    >
                      {isLoggingInTikTok ? 'Connecting...' : 'Authorize'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* INSTAGRAM LOGIN MODAL */}
          {showIgLoginModal && (
            <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-neutral-950 border border-neutral-800 rounded-3xl p-5 sm:p-6 w-full max-w-md space-y-4 shadow-2xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-white font-bold text-lg">
                      📸
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white">Instagram Business Connect</h4>
                      <p className="text-[11px] text-neutral-400">Sync reels from your Instagram account</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowIgLoginModal(false)}
                    className="p-1.5 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-900"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    value={customIgHandle}
                    onChange={(e) => setCustomIgHandle(e.target.value)}
                    placeholder="@your_instagram_handle"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customIgHandle) setSelectedIgHandle(customIgHandle);
                      setShowIgLoginModal(false);
                    }}
                    className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs rounded-xl"
                  >
                    Connect Instagram Profile
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {/* FACEBOOK LOGIN MODAL */}
          {showFbLoginModal && (
            <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-neutral-950 border border-neutral-800 rounded-3xl p-5 sm:p-6 w-full max-w-md space-y-4 shadow-2xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                      f
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white">Facebook Page Connect</h4>
                      <p className="text-[11px] text-neutral-400">Import from Facebook Marketplace / Pages</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowFbLoginModal(false)}
                    className="p-1.5 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-900"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFbPage('Nairobi Rentals & Hostels Hub');
                      setShowFbLoginModal(false);
                    }}
                    className="w-full p-3 bg-neutral-900 hover:bg-neutral-800 rounded-xl text-left border border-neutral-800 text-xs font-bold text-white"
                  >
                    Nairobi Rentals & Hostels Hub (29.1K Members)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFbPage('Kenya Real Estate Marketplace');
                      setShowFbLoginModal(false);
                    }}
                    className="w-full p-3 bg-neutral-900 hover:bg-neutral-800 rounded-xl text-left border border-neutral-800 text-xs font-bold text-white"
                  >
                    Kenya Real Estate Marketplace (110K Members)
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {/* YOUTUBE CHANNEL CONNECT MODAL */}
          {showYtChannelModal && (
            <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-neutral-950 border border-neutral-800 rounded-3xl p-5 sm:p-6 w-full max-w-md space-y-4 shadow-2xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white font-bold text-lg p-2">
                      <YouTubeLogo className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white">YouTube Channel Connect</h4>
                      <p className="text-[11px] text-neutral-400">Select or enter your YouTube Real Estate Channel</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowYtChannelModal(false)}
                    className="p-1.5 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-900"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-mono text-neutral-400">Featured Kenyan Channels:</span>
                    {YOUTUBE_CHANNELS.map((ch) => (
                      <button
                        key={ch.handle}
                        type="button"
                        onClick={() => {
                          setSelectedYtChannel(ch);
                          const matched = YOUTUBE_VIDEOS.find((v) => v.creatorHandle === ch.handle) || YOUTUBE_VIDEOS[0];
                          applySocialItem(matched);
                          setShowYtChannelModal(false);
                        }}
                        className={`w-full p-2.5 rounded-xl border flex items-center justify-between gap-3 text-left transition-all ${
                          selectedYtChannel.handle === ch.handle
                            ? 'border-red-500 bg-red-500/10'
                            : 'border-neutral-800 hover:border-neutral-700 bg-neutral-900'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <img src={ch.avatar} alt={ch.name} className="w-8 h-8 rounded-full object-cover" />
                          <div>
                            <p className="text-xs font-bold text-white">{ch.name}</p>
                            <p className="text-[10px] text-neutral-400 font-mono">{ch.handle} • {ch.subscribers}</p>
                          </div>
                        </div>
                        <span className="text-[10px] text-red-400 font-bold">Select</span>
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-neutral-800 space-y-2">
                    <span className="text-[11px] font-mono text-neutral-400">Or Enter Custom Channel Handle:</span>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customYtChannel}
                        onChange={(e) => setCustomYtChannel(e.target.value)}
                        placeholder="@YourYouTubeChannel"
                        className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (customYtChannel) {
                            const newCh = {
                              handle: customYtChannel.startsWith('@') ? customYtChannel : `@${customYtChannel}`,
                              name: `${customYtChannel.replace('@', '')} Kenya`,
                              avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
                              subscribers: '10.5K subscribers',
                              videosCount: '45 videos',
                              bio: 'Kenyan Real Estate & House Hunts'
                            };
                            setSelectedYtChannel(newCh);
                            applySocialItem(YOUTUBE_VIDEOS[0]);
                            setShowYtChannelModal(false);
                          }
                        }}
                        className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl"
                      >
                        Connect
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
