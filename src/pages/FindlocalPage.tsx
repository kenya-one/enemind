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
  Flame
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { FindlocalTour, TourStop, TOUR_STOPS } from '../components/FindlocalTour';

export const FindlocalPage: React.FC = () => {
  const { products, jobs, hostels, openCheckout, showToast } = useApp();
  const { user } = useAuth();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('Nairobi & Central Corridor');
  const [maxDistanceKm, setMaxDistanceKm] = useState<number>(25);
  const [isTourOpen, setIsTourOpen] = useState<boolean>(false);
  const [selectedTourStop, setSelectedTourStop] = useState<TourStop | null>(null);

  const categories = [
    'All',
    'Building Materials',
    'Solar & Energy',
    'Farm Produce / Mama Mboga',
    'Jobs & Attachments',
    'Hostels & Rentals'
  ];

  // Combined Findlocal listings (Dealers, Building Materials, Informal Sellers, Jobs, Hostels)
  const combinedListings = [
    {
      id: 'fl_bamburi_kamakis',
      type: 'dealer',
      title: 'Bamburi & Blue Triangle Building Supplies',
      category: 'Building Materials',
      location: 'Eastern Bypass, Kamakis, Ruiru',
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
      location: 'Westlands Market, Woodvale Grove, Nairobi',
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
      location: 'Enterprise Road, Industrial Area, Nairobi',
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

  const filtered = combinedListings.filter((item) => {
    const matchesCat = activeCategory === 'All' || item.category.toLowerCase().includes(activeCategory.toLowerCase().split(' ')[0]);
    const matchesDist = item.distanceKm <= maxDistanceKm;
    return matchesCat && matchesDist;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header & Proximity Engine Intro */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
              PostGIS Geo-Indexed Engine
            </span>
            <span className="text-xs text-slate-500">Live Radius Search</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">
            Findlocal Discovery Radar
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Discover nearby building supplies, informal dealers (Mama Mboga, Bodaboda), solar installers, hostels, and local job openings.
          </p>
        </div>

        {/* Right CTA Actions: Tour Button + Distance Slider */}
        <div className="flex flex-wrap items-center gap-3">
          
          <button
            id="start-findlocal-tour-btn"
            onClick={() => setIsTourOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-transform active:scale-95 cursor-pointer"
          >
            <Compass className="w-4 h-4 animate-spin" style={{ animationDuration: '10s' }} />
            <span>Start Best Findlocals Tour</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          </button>

          {/* Distance Slider Filter */}
          <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-200 text-xs">
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
      </div>

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
              Get an interactive guided walkthrough of the best-value building supplies, freshest organic produce, EPRA solar microgrids, and verified student hostels in Kenya.
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

      {/* Category Pills */}
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

      {/* Interactive Kenyan Radar Map & Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Interactive Simulated Kenyan PostGIS Radar Map */}
        <div className="lg:col-span-5 bg-slate-950 rounded-3xl border border-slate-800 p-5 text-white flex flex-col justify-between relative overflow-hidden min-h-[380px] shadow-xl">
          
          {/* Radar Background Grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
          
          {/* Radar Concentric Rings */}
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

                  {/* Hover Pin Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-[11px] shadow-2xl z-30 pointer-events-none">
                    <p className="font-bold truncate">{item.title}</p>
                    <p className="text-emerald-400 text-[10px]">{item.distanceKm} km • {item.category}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="relative z-10 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
            <span>Center: <b>Westlands / Nairobi Hub</b></span>
            <span className="text-emerald-400 font-bold">● Live GPS Active</span>
          </div>

        </div>

        {/* Right: Detailed Nearby Listings List */}
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
                        <a
                          href={`tel:${item.phone.replace(/\s+/g, '')}`}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition"
                        >
                          Call / WhatsApp
                        </a>

                        <button
                          onClick={() =>
                            openCheckout({
                              orderId: `FL-${Date.now()}`,
                              itemTitle: item.title,
                              amountKes: 1000,
                              customerName: user ? user.name : 'Customer',
                              customerEmail: user ? user.email : 'customer@enemind.co.ke',
                              customerPhone: user?.phone || '+254700000000',
                              sellerId: 'user_dealer_1',
                              sellerName: item.title,
                              sellerType: 'dealer'
                            })
                          }
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                        >
                          Order / Book
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 text-slate-500 text-xs">
              No dealers or jobs found within {maxDistanceKm}km. Increase radius slider above to expand search.
            </div>
          )}
        </div>

      </div>

      {/* Guided Discovery Tour Modal */}
      <FindlocalTour
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        onSelectStop={(stop) => setSelectedTourStop(stop)}
      />

    </div>
  );
};
