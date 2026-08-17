import React, { useState, useEffect } from 'react';
import {
  Compass,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
  X,
  MapPin,
  CheckCircle2,
  Phone,
  ShieldCheck,
  Award,
  Zap,
  ShoppingBag,
  ExternalLink,
  Navigation
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export interface TourStop {
  id: string;
  type: 'dealer' | 'company' | 'job' | 'hostel';
  title: string;
  track: string;
  category: string;
  location: string;
  distanceKm: number;
  phone: string;
  rating: number;
  image: string;
  tagline: string;
  whyBest: string;
  keyFeature: string;
  description: string;
  coordinates: { x: number; y: number };
  badgeText: string;
  typicalSavingsOrPrice: string;
}

export const TOUR_STOPS: TourStop[] = [
  {
    id: 'fl_bamburi_kamakis',
    type: 'dealer',
    title: 'Bamburi & Blue Triangle Building Supplies',
    track: 'Builders & Construction',
    category: 'Building Materials',
    location: 'Eastern Bypass, Kamakis, Ruiru',
    distanceKm: 4.2,
    phone: '+254 720 334 455',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80',
    tagline: 'Best Wholesale Cement & Steel Depot',
    whyBest: 'Direct ex-factory pricing: save up to KES 70 per bag of Bamburi Nguvu 50kg with verified on-site tipper dispatch.',
    keyFeature: 'Wholesale KES 650/bag • Instant site delivery in Kiambu & Nairobi',
    description: 'Bamburi Nguvu 50kg Cement, Box profile Mabati (gauge 28 & 30), River Sand and Machine Cut stones direct to site.',
    coordinates: { x: 65, y: 38 },
    badgeText: '🏆 #1 Rated Depot in Ruiru',
    typicalSavingsOrPrice: 'KES 650 / bag (Bulk Rate)'
  },
  {
    id: 'fl_sunking_industrial',
    type: 'company',
    title: 'SunKing Solar Microgrid & Backup Depot',
    track: 'Solar & Clean Energy',
    category: 'Solar & Energy',
    location: 'Enterprise Road, Industrial Area, Nairobi',
    distanceKm: 3.2,
    phone: '+254 700 888 999',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&auto=format&fit=crop&q=80',
    tagline: 'Top EPRA-Certified Solar Hub',
    whyBest: 'Certified technicians and guaranteed 2-year warranty on all 5kW lithium inverter backups and solar farm kits.',
    keyFeature: 'EPRA Class T3 Certified • Pay-As-You-Go solar options',
    description: 'Complete Home 500X lighting kits, hybrid solar pumps, commercial backup batteries, and technician booking.',
    coordinates: { x: 55, y: 68 },
    badgeText: '⚡ Certified Energy Partner',
    typicalSavingsOrPrice: 'Pay-As-You-Go from KES 85/day'
  },
  {
    id: 'fl_mamamboga_westlands',
    type: 'dealer',
    title: 'Mama Mboga Fresh Greens (Kiosk 14)',
    track: 'Farm Produce & Food',
    category: 'Farm Produce / Mama Mboga',
    location: 'Westlands Market, Woodvale Grove, Nairobi',
    distanceKm: 1.8,
    phone: '+254 712 998 877',
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=600&auto=format&fit=crop&q=80',
    tagline: 'Fresh Limuru Greens & Organic Produce',
    whyBest: 'Harvested daily at 5:00 AM in Limuru; zero intermediary markup, packaged hygienically for urban doorstep delivery.',
    keyFeature: 'Same-day motorbike delivery • 100% fresh guarantee',
    description: 'Fresh Sukuma Wiki, Managu, Spinach, Terere, sweet potatoes, onions, Dhania, and ripe avocados.',
    coordinates: { x: 42, y: 52 },
    badgeText: '🥬 100% Fresh Limuru Greens',
    typicalSavingsOrPrice: 'KES 250 Curated Veggie Basket'
  },
  {
    id: 'fl_juja_haven_hostel',
    type: 'hostel',
    title: 'Juja Student Havens & Executive Bedsitters',
    track: 'Student Living & Hostels',
    category: 'Hostels & Rentals',
    location: 'JKUAT Gate C, Juja',
    distanceKm: 8.9,
    phone: '+254 722 778 899',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=80',
    tagline: 'Safest Gated Student Community',
    whyBest: 'Zero broker fees, continuous borehole water supply, high-speed fiber Wi-Fi, and biometric facial access.',
    keyFeature: 'Biometric security • Unlimited Wi-Fi included',
    description: 'Spacious executive bedsitters and 1-bedrooms with private balconies, study desks, and CCTV surveillance.',
    coordinates: { x: 78, y: 25 },
    badgeText: '🎓 Top JKUAT Campus Pick',
    typicalSavingsOrPrice: 'KES 9,500 / month (No Broker Fee)'
  },
  {
    id: 'fl_job_solar_tech',
    type: 'job',
    title: 'Solar Field Installation Technician & Inspector',
    track: 'Jobs & Attachments',
    category: 'Jobs & Attachments',
    location: 'Nairobi & Central Region Hubs',
    distanceKm: 3.2,
    phone: '+254 700 888 999',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
    tagline: 'Verified High-Growth Technical Role',
    whyBest: 'Direct employer posting with prompt interview scheduling, transport allowances, and monthly performance bonuses.',
    keyFeature: 'Immediate hiring • NITA-accredited internship available',
    description: 'Perform solar panel installations, battery inverter testing, and client system orientations across commercial sites.',
    coordinates: { x: 58, y: 70 },
    badgeText: '💼 Verified Employer',
    typicalSavingsOrPrice: 'KES 45,000 - 65,000 / mo'
  }
];

interface FindlocalTourProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStop?: (stop: TourStop) => void;
}

export const FindlocalTour: React.FC<FindlocalTourProps> = ({
  isOpen,
  onClose,
  onSelectStop
}) => {
  const { openCheckout, showToast } = useApp();
  const { user } = useAuth();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedTrack, setSelectedTrack] = useState<string>('All');

  const tourTracks = ['All', 'Builders & Construction', 'Solar & Clean Energy', 'Farm Produce & Food', 'Student Living & Hostels', 'Jobs & Attachments'];

  const filteredStops = selectedTrack === 'All'
    ? TOUR_STOPS
    : TOUR_STOPS.filter(s => s.track === selectedTrack);

  const currentStop = filteredStops[currentIndex] || filteredStops[0];

  // Auto-advance if playing
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && isOpen) {
      timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % filteredStops.length);
      }, 5000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, isOpen, filteredStops.length]);

  // Sync selected stop with parent map radar if requested
  useEffect(() => {
    if (currentStop && onSelectStop) {
      onSelectStop(currentStop);
    }
  }, [currentIndex, selectedTrack]);

  if (!isOpen) return null;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredStops.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredStops.length) % filteredStops.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div
        id="findlocal-tour-modal"
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-slate-900 text-white p-5 sm:p-6 relative">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shadow-inner">
                <Compass className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                    Curated Discovery Tour
                  </span>
                  <span className="text-xs text-emerald-200/80 font-medium">
                    Verified Kenyan Best Finds
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold font-display text-white mt-0.5">
                  Best of Findlocals Showcase
                </h2>
              </div>
            </div>

            <button
              id="close-tour-btn"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Track Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar mt-4 pt-2 border-t border-white/10">
            {tourTracks.map((track) => (
              <button
                key={track}
                onClick={() => {
                  setSelectedTrack(track);
                  setCurrentIndex(0);
                }}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  selectedTrack === track
                    ? 'bg-emerald-400 text-slate-950 shadow-sm font-bold'
                    : 'bg-white/10 text-white/90 hover:bg-white/20'
                }`}
              >
                {track}
              </button>
            ))}
          </div>
        </div>

        {/* Tour Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          
          {/* Stop Header & Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center border border-emerald-200">
                #{currentIndex + 1}
              </span>
              <div>
                <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
                  Stop {currentIndex + 1} of {filteredStops.length} • {currentStop.track}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                  {currentStop.title}
                </h3>
              </div>
            </div>

            <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 self-start sm:self-auto shrink-0">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              {currentStop.badgeText}
            </span>
          </div>

          {/* Featured Visual & Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            
            {/* Image */}
            <div className="sm:col-span-5 relative rounded-2xl overflow-hidden border border-slate-200 shadow-xs h-48 sm:h-auto">
              <img
                src={currentStop.image}
                alt={currentStop.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
              
              <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                <p className="text-[11px] font-bold text-emerald-300 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {currentStop.location}
                </p>
                <p className="text-[10px] text-slate-300">
                  {currentStop.distanceKm} km from central hub • ★ {currentStop.rating}
                </p>
              </div>
            </div>

            {/* Why This is the Best Find Details */}
            <div className="sm:col-span-7 space-y-3 flex flex-col justify-between">
              
              {/* Highlight Box: Why It Gives You The Best Find */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/90 text-emerald-950 space-y-1.5">
                <div className="flex items-center gap-1.5 text-emerald-900 text-xs font-bold">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Why This Is The Best Local Pick</span>
                </div>
                <p className="text-xs text-emerald-900 leading-relaxed font-medium">
                  {currentStop.whyBest}
                </p>
              </div>

              {/* Pricing & Key Feature */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-semibold block">Best Value / Rate</span>
                  <span className="font-bold text-slate-900 text-xs truncate block">{currentStop.typicalSavingsOrPrice}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-semibold block">Key Advantage</span>
                  <span className="font-bold text-emerald-700 text-xs truncate block">{currentStop.keyFeature}</span>
                </div>
              </div>

              {/* Full Description snippet */}
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                {currentStop.description}
              </p>

            </div>

          </div>

          {/* Quick Direct Actions */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold">{currentStop.phone}</span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`tel:${currentStop.phone.replace(/\s+/g, '')}`}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition"
              >
                Call / WhatsApp
              </a>

              <button
                id="tour-order-btn"
                onClick={() => {
                  openCheckout({
                    orderId: `TOUR-${Date.now()}`,
                    itemTitle: currentStop.title,
                    amountKes: 1000,
                    customerName: user ? user.name : 'Customer',
                    customerEmail: user ? user.email : 'customer@enemind.co.ke',
                    customerPhone: user?.phone || '+254700000000',
                    sellerId: 'user_dealer_1',
                    sellerName: currentStop.title,
                    sellerType: currentStop.type === 'hostel' ? 'landlord' : (currentStop.type === 'job' ? 'company' : currentStop.type)
                  });
                  showToast(`Selected ${currentStop.title} for instant reservation!`);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Reserve / Order Now</span>
              </button>
            </div>
          </div>

        </div>

        {/* Modal Footer Controls */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 sm:px-6 flex items-center justify-between gap-3">
          
          {/* Auto-Play Toggle */}
          <button
            id="toggle-autoplay-tour-btn"
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition cursor-pointer"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 text-amber-600" />
                <span>Pause Auto-Tour</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-emerald-600" />
                <span>Auto-Play Tour</span>
              </>
            )}
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center gap-1.5">
            {filteredStops.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentIndex === i ? 'w-6 bg-emerald-600' : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
                title={`Stop ${i + 1}`}
              />
            ))}
          </div>

          {/* Prev / Next Buttons */}
          <div className="flex items-center gap-2">
            <button
              id="prev-tour-stop-btn"
              onClick={handlePrev}
              className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition cursor-pointer"
              title="Previous Stop"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              id="next-tour-stop-btn"
              onClick={handleNext}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <span>Next Stop</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
