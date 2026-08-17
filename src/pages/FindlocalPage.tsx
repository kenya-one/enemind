import React, { useState } from 'react';
import {
  MapPin,
  Search,
  Filter,
  Navigation,
  Phone,
  Truck,
  Star,
  Layers,
  ChevronRight,
  Briefcase,
  Store,
  Zap,
  ShoppingBag,
  ExternalLink,
  Compass,
  Sparkles,
  Award,
  Flame,
  GraduationCap,
  Building,
  Home,
  Users,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { FindlocalTour, TourStop, TOUR_STOPS } from '../components/FindlocalTour';
import { KENYAN_CAMPUSES_AND_COLLEGES, KenyanInstitution } from '../services/campusesKenya';
import { CampusInteractiveMap } from '../components/CampusInteractiveMap';
import { HostelBookingModal } from '../components/HostelBookingModal';
import { HostelProperty, HostelBooking } from '../types';

export const FindlocalPage: React.FC = () => {
  const { products, jobs, hostels, addHostelBooking, openCheckout, showToast } = useApp();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'campuses' | 'radar'>('campuses');
  const [selectedCampus, setSelectedCampus] = useState<KenyanInstitution>(KENYAN_CAMPUSES_AND_COLLEGES[0]);
  const [campusSearchQuery, setCampusSearchQuery] = useState<string>('');
  const [selectedCampusType, setSelectedCampusType] = useState<string>('All');
  const [selectedCounty, setSelectedCounty] = useState<string>('All');

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [maxDistanceKm, setMaxDistanceKm] = useState<number>(25);
  const [isTourOpen, setIsTourOpen] = useState<boolean>(false);
  const [selectedTourStop, setSelectedTourStop] = useState<TourStop | null>(null);
  const [selectedHostelForBooking, setSelectedHostelForBooking] = useState<HostelProperty | null>(null);

  const categories = [
    'All',
    'Building Materials',
    'Solar & Energy',
    'Farm Produce / Mama Mboga',
    'Jobs & Attachments',
    'Hostels & Rentals'
  ];

  // Combined Findlocal listings
  const combinedListings = [
    {
      id: 'fl_bamburi_kamakis',
      type: 'dealer',
      title: 'Bamburi & Blue Triangle Building Supplies',
      category: 'Building Materials',
      location: 'Eastern Bypass, Kamakis, Ruiru (Near KU / Zetech)',
      distanceKm: 4.2,
      phone: '+254 720 334 455',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80',
      description: 'Bulk Bamburi Nguvu 50kg Cement (KES 720 / KES 650 bulk), Box profile Mabati, Sand & Ballast tippers.',
      coordinates: { x: 65, y: 38 }
    },
    {
      id: 'fl_mamamboga_westlands',
      type: 'dealer',
      title: 'Mama Mboga Fresh Greens (Kiosk 14)',
      category: 'Farm Produce / Mama Mboga',
      location: 'Westlands Market, Woodvale Grove (Near UoN Chiromo)',
      distanceKm: 1.8,
      phone: '+254 712 998 877',
      rating: 5.0,
      image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=600&auto=format&fit=crop&q=80',
      description: 'Daily fresh Limuru Sukuma, Managu, Spinach, Terere, sweet potatoes, onions & tomatoes.',
      coordinates: { x: 42, y: 52 }
    },
    {
      id: 'fl_sunking_industrial',
      type: 'company',
      title: 'SunKing Solar Service & Microgrid Depot',
      category: 'Solar & Energy',
      location: 'Enterprise Road, Industrial Area, Nairobi (Near TUK)',
      distanceKm: 3.2,
      phone: '+254 700 888 999',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&auto=format&fit=crop&q=80',
      description: 'Home 500X kits, 5kW lithium inverter backup systems, EPRA licensed technician dispatch.',
      coordinates: { x: 55, y: 68 }
    },
    {
      id: 'fl_job_solar_tech',
      type: 'job',
      title: 'Solar Field Installation Technician & Inspector',
      category: 'Jobs & Attachments',
      location: 'Nairobi & Central Region Hubs',
      distanceKm: 3.2,
      phone: '+254 700 888 999',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
      description: 'Salary: KES 45,000 - 65,000 / mo. Lead solar installs and battery diagnostics.',
      coordinates: { x: 58, y: 70 }
    },
    {
      id: 'fl_juja_haven_hostel',
      type: 'hostel',
      title: 'Juja Student Havens & Executive Bedsitters',
      category: 'Hostels & Rentals',
      location: 'JKUAT Gate C, Juja',
      distanceKm: 8.9,
      phone: '+254 722 778 899',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=80',
      description: 'KES 9,500/mo. Wi-Fi, borehole water, biometric gate access, study balconies.',
      coordinates: { x: 78, y: 25 }
    }
  ];

  // Filtering campuses
  const filteredCampuses = KENYAN_CAMPUSES_AND_COLLEGES.filter((campus) => {
    const matchesSearch =
      campus.name.toLowerCase().includes(campusSearchQuery.toLowerCase()) ||
      campus.shortName.toLowerCase().includes(campusSearchQuery.toLowerCase()) ||
      campus.county.toLowerCase().includes(campusSearchQuery.toLowerCase()) ||
      campus.town.toLowerCase().includes(campusSearchQuery.toLowerCase());

    const matchesType = selectedCampusType === 'All' || campus.type === selectedCampusType;
    const matchesCounty = selectedCounty === 'All' || campus.county.includes(selectedCounty);

    return matchesSearch && matchesType && matchesCounty;
  });

  const countiesList = Array.from(new Set(KENYAN_CAMPUSES_AND_COLLEGES.map(c => c.county.split('/')[0].trim())));

  const filtered = combinedListings.filter((item) => {
    const matchesCat = activeCategory === 'All' || item.category.toLowerCase().includes(activeCategory.toLowerCase().split(' ')[0]);
    const matchesDist = item.distanceKm <= maxDistanceKm;
    return matchesCat && matchesDist;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header & View Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
              Kenya Nationwide Geospatial Directory
            </span>
            <span className="text-xs text-slate-500">25+ Universities, TVETs & KMTCs</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">
            Findlocal Campus & Community Radar
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Explore verified student hostels, tech repair kiosks, hardware supplies, and mama mbogas around every Kenyan college.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            id="tab-campuses-view"
            onClick={() => setActiveTab('campuses')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'campuses'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-emerald-400" />
            <span>All Campuses & Colleges</span>
          </button>
          <button
            id="tab-radar-view"
            onClick={() => setActiveTab('radar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'radar'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Navigation className="w-4 h-4 text-emerald-400" />
            <span>Proximity Radar</span>
          </button>
        </div>
      </div>

      {/* ===================== TAB 1: ALL CAMPUSES & COLLEGES IN KENYA ===================== */}
      {activeTab === 'campuses' && (
        <div className="space-y-6">
          
          {/* Interactive Leaflet Kenya Map */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>Interactive Geospatial Map of Kenyan Campuses</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Click any campus pin to view surrounding student hubs, average hostel rent, and active student services.
                </p>
              </div>
              <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
                📍 Showing {filteredCampuses.length} Indexed Campuses
              </div>
            </div>

            {/* Real Map Component */}
            <CampusInteractiveMap
              campuses={filteredCampuses}
              selectedCampus={selectedCampus}
              onSelectCampus={(campus) => {
                setSelectedCampus(campus);
                showToast(`Campus Selected: ${campus.name}`);
              }}
            />
          </div>

          {/* Search & Filter Strip */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={campusSearchQuery}
                onChange={(e) => setCampusSearchQuery(e.target.value)}
                placeholder="Search campus (e.g. KU, UoN, JKUAT, MMU, KMTC, Egerton, Kisii, TUM)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <select
                value={selectedCampusType}
                onChange={(e) => setSelectedCampusType(e.target.value)}
                className="px-3 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                <option value="All">All Institution Types</option>
                <option value="University">Universities</option>
                <option value="National Poly">National Polytechnics</option>
                <option value="Medical Training">Medical Colleges (KMTC)</option>
              </select>

              {/* County Filter */}
              <select
                value={selectedCounty}
                onChange={(e) => setSelectedCounty(e.target.value)}
                className="px-3 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                <option value="All">All Counties</option>
                {countiesList.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Detailed Selected Campus Card & Campus Directory Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Active Campus Deep-Dive View */}
            {selectedCampus && (
              <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 to-slate-950 text-white rounded-3xl p-6 border border-slate-800 shadow-xl space-y-5">
                <div className="relative h-44 rounded-2xl overflow-hidden border border-slate-700">
                  <img
                    src={selectedCampus.bannerImage}
                    alt={selectedCampus.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                      {selectedCampus.type}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1 leading-tight">
                      {selectedCampus.name}
                    </h3>
                  </div>
                </div>

                {/* Quick Campus Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs">
                    <span className="text-slate-400 block text-[10px]">Location</span>
                    <span className="font-bold text-white flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      {selectedCampus.town}, {selectedCampus.county}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs">
                    <span className="text-slate-400 block text-[10px]">Est. Student Body</span>
                    <span className="font-bold text-emerald-300 flex items-center gap-1 mt-0.5">
                      <Users className="w-3 h-3 text-emerald-400" />
                      ~{selectedCampus.studentPopulation.toLocaleString()} Students
                    </span>
                  </div>
                </div>

                {/* Average Rent Estimates */}
                <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-800/50">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-emerald-300 font-semibold flex items-center gap-1">
                      <Home className="w-3.5 h-3.5 text-emerald-400" /> Average Hostel Rent
                    </span>
                    <span className="text-xs font-black text-amber-300">
                      {selectedCampus.sampleHostelRentRange}
                    </span>
                  </div>
                </div>

                {/* Nearby Student Commercial Hubs */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5 text-emerald-400" />
                    Key Student Hubs & Hostels
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCampus.featuredHubs.map((hub, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-xl bg-slate-800 text-slate-200 text-[11px] font-medium border border-slate-700 flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" /> {hub}
                      </span>
                    ))}
                  </div>
                </div>

                {/* High Demand Services */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    High-Demand Campus Services
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCampus.popularServices.map((service, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-xl bg-amber-950/40 text-amber-200 text-[11px] font-semibold border border-amber-800/40"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      showToast(`Navigating to verified listings for ${selectedCampus.shortName}`);
                      setActiveTab('radar');
                    }}
                    className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Compass className="w-4 h-4" />
                    <span>Explore {selectedCampus.shortName} Nearby Merchants</span>
                  </button>
                </div>
              </div>
            )}

            {/* Right: Grid of All Campuses */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
                <span>Select a campus to inspect:</span>
                <span>{filteredCampuses.length} results</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[680px] overflow-y-auto pr-1">
                {filteredCampuses.map((campus) => {
                  const isSelected = selectedCampus?.id === campus.id;
                  return (
                    <div
                      key={campus.id}
                      onClick={() => setSelectedCampus(campus)}
                      className={`p-4 rounded-3xl border transition cursor-pointer flex flex-col justify-between group ${
                        isSelected
                          ? 'bg-emerald-50/80 border-emerald-400 ring-2 ring-emerald-300'
                          : 'bg-white border-slate-200/80 hover:border-emerald-300 hover:shadow-md'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase ${
                            campus.type === 'University'
                              ? 'bg-blue-100 text-blue-800'
                              : campus.type === 'National Poly'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {campus.type}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {campus.county}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-slate-900 mt-2 leading-tight group-hover:text-emerald-700">
                          {campus.name}
                        </h4>
                        
                        <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{campus.town}</span>
                        </p>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <span className="text-slate-600 font-semibold">Rent:</span>
                        <span className="text-emerald-700 font-bold">{campus.sampleHostelRentRange.split('/')[0]}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ===================== TAB 2: PROXIMITY RADAR & TOUR ===================== */}
      {activeTab === 'radar' && (
        <div className="space-y-6">
          
          {/* Interactive Curated Tour Highlight Strip */}
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-950 text-white border border-emerald-800/40 shadow-lg relative overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-emerald-500/10 to-transparent pointer-events-none"></div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <Flame className="w-3 h-3 text-amber-400" /> Curated Kenya Guide
                  </span>
                  <span className="text-xs text-emerald-200/80">5 Top-Rated Stops Available</span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold font-display text-white">
                  Take the Best of Findlocals Tour
                </h2>
                <p className="text-xs text-slate-300 max-w-xl">
                  Get an interactive guided walkthrough of verified building supplies, organic farm produce, EPRA solar microgrids, and verified student hostels across Kenya.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  id="open-tour-banner-btn"
                  onClick={() => setIsTourOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold transition shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Compass className="w-4 h-4" />
                  <span>Launch Interactive Tour</span>
                </button>
              </div>
            </div>

            {/* Quick Tour Stop Preview Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-4 pt-3 border-t border-white/10">
              {TOUR_STOPS.map((stop, idx) => (
                <button
                  key={stop.id}
                  onClick={() => {
                    setSelectedTourStop(stop);
                    setIsTourOpen(true);
                  }}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-left transition group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-400">Stop #{idx + 1}</span>
                    <span className="text-[9px] text-slate-400">{stop.distanceKm}km</span>
                  </div>
                  <p className="text-xs font-semibold text-white truncate mt-0.5 group-hover:text-emerald-300">
                    {stop.title.split(' ')[0]} {stop.title.split(' ')[1]}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">{stop.badgeText.replace(/^[^\w]+/, '')}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Category Pills & Radius Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 bg-white p-2.5 rounded-2xl border border-slate-200 text-xs shrink-0 self-start sm:self-auto">
              <div>
                <span className="font-semibold text-slate-700">Radius: </span>
                <span className="font-bold text-emerald-600">{maxDistanceKm} km</span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                value={maxDistanceKm}
                onChange={(e) => setMaxDistanceKm(Number(e.target.value))}
                className="accent-emerald-600 w-28 cursor-pointer"
              />
            </div>
          </div>

          {/* Interactive Kenyan Radar Map & Results Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Radar Visualizer */}
            <div className="lg:col-span-5 bg-slate-950 rounded-3xl border border-slate-800 p-5 text-white flex flex-col justify-between relative overflow-hidden min-h-[380px] shadow-xl">
              
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
              
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-72 h-72 rounded-full border border-emerald-500/20 animate-pulse"></div>
                <div className="w-48 h-48 rounded-full border border-emerald-500/30 absolute"></div>
                <div className="w-24 h-24 rounded-full border border-emerald-500/40 absolute"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute"></div>
              </div>

              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} />
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Active GPS Radar
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsTourOpen(true)}
                    className="text-[10px] text-amber-300 hover:text-white bg-slate-900/90 hover:bg-slate-800 px-2 py-1 rounded-md border border-amber-400/30 flex items-center gap-1 transition"
                  >
                    <Compass className="w-3 h-3" /> Tour Stops
                  </button>
                  <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-1 rounded-md border border-slate-800">
                    {filtered.length} points within {maxDistanceKm}km
                  </span>
                </div>
              </div>

              {/* Radar Pins */}
              <div className="relative z-10 h-64 w-full my-auto">
                {filtered.map((item) => {
                  const isSelectedTour = selectedTourStop && selectedTourStop.id === item.id;
                  return (
                    <div
                      key={item.id}
                      style={{ top: `${item.coordinates.y}%`, left: `${item.coordinates.x}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                      onClick={() => {
                        showToast(`Selected: ${item.title} (${item.distanceKm} km away)`);
                        const foundTour = TOUR_STOPS.find(s => s.id === item.id);
                        if (foundTour) setSelectedTourStop(foundTour);
                      }}
                    >
                      <div className="relative flex items-center justify-center">
                        <span className={`rounded-full animate-ping absolute ${isSelectedTour ? 'w-10 h-10 bg-amber-400/50' : 'w-6 h-6 bg-emerald-500/30'}`}></span>
                        <div className={`rounded-full text-slate-950 font-extrabold text-[11px] flex items-center justify-center shadow-lg border-2 border-white transition-transform ${
                          isSelectedTour ? 'w-9 h-9 bg-amber-400 scale-125 ring-4 ring-amber-300/40' : 'w-7 h-7 bg-emerald-500 group-hover:scale-110'
                        }`}>
                          <MapPin className="w-3.5 h-3.5" />
                        </div>
                      </div>

                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-[11px] shadow-2xl z-30 pointer-events-none">
                        <p className="font-bold truncate">{item.title}</p>
                        <p className="text-emerald-400 text-[10px]">{item.distanceKm} km • {item.category}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="relative z-10 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
                <span>Center: <b>Nairobi & Central Campus Corridors</b></span>
                <span className="text-emerald-400 font-bold">● Live GPS Active</span>
              </div>

            </div>

            {/* Right: Nearby Listings List */}
            <div className="lg:col-span-7 space-y-4">
              {filtered.length > 0 ? (
                filtered.map((item) => {
                  const matchingTour = TOUR_STOPS.find(s => s.id === item.id);
                  return (
                    <div
                      key={item.id}
                      className={`p-5 rounded-3xl bg-white border shadow-xs hover:shadow-md transition flex flex-col sm:flex-row gap-4 items-start group ${
                        matchingTour ? 'border-emerald-200/90 ring-1 ring-emerald-100' : 'border-slate-200/80'
                      }`}
                    >
                      <div className="relative w-full sm:w-32 h-28 shrink-0">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full rounded-2xl object-cover border border-slate-100"
                        />
                        {matchingTour && (
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[9px] font-extrabold shadow-sm">
                            Best Pick
                          </span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                            {item.category}
                          </span>
                          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {item.distanceKm} km away
                          </span>
                        </div>

                        <h3 className="text-sm font-bold text-slate-900 mt-1 line-clamp-1 group-hover:text-emerald-700 transition">
                          {item.title}
                        </h3>

                        {matchingTour && (
                          <p className="text-[11px] font-semibold text-emerald-700 mt-0.5 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-500" />
                            <span>{matchingTour.keyFeature}</span>
                          </p>
                        )}

                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>

                        <div className="mt-3 flex items-center justify-between gap-2 flex-wrap pt-2 border-t border-slate-100">
                          <span className="text-xs text-slate-600 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" /> {item.phone}
                          </span>

                          <div className="flex items-center gap-2">
                            {item.type === 'hostel' && (
                              <button
                                onClick={() => {
                                  const matchingHostel = hostels.find(
                                    (h) => h.id === 'hostel_juja_havens' || h.title.includes('Juja')
                                  ) || hostels[0];
                                  setSelectedHostelForBooking(matchingHostel);
                                }}
                                className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition shadow-xs flex items-center gap-1 cursor-pointer"
                              >
                                <Home className="w-3 h-3" /> Inquire / View
                              </button>
                            )}
                            <a
                              href={`tel:${item.phone.replace(/\s+/g, '')}`}
                              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition"
                            >
                              Call Seller
                            </a>
                            <button
                              onClick={() => {
                                showToast(`Direct routing to ${item.title} initialized`);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs flex items-center gap-1 cursor-pointer"
                            >
                              <Navigation className="w-3 h-3" /> Route
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-6">
                  <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                  <h3 className="text-sm font-bold text-slate-800">No points found in this radius</h3>
                  <p className="text-xs text-slate-500 mt-1">Try expanding the search radius slider.</p>
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* Guided Tour Modal */}
      {isTourOpen && (
        <FindlocalTour
          isOpen={isTourOpen}
          onClose={() => {
            setIsTourOpen(false);
            setSelectedTourStop(null);
          }}
        />
      )}

      {/* Hostel Booking Modal */}
      {selectedHostelForBooking && (
        <HostelBookingModal
          isOpen={!!selectedHostelForBooking}
          hostel={selectedHostelForBooking}
          onClose={() => setSelectedHostelForBooking(null)}
          onBookingSuccess={(booking) => {
            addHostelBooking(booking);
          }}
        />
      )}

    </div>
  );
};
