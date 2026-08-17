import React from 'react';
import {
  Search,
  Sun,
  MapPin,
  GraduationCap,
  Sparkles,
  Radio,
  ChevronRight,
  ShoppingBag,
  Home as HomeIcon,
  Play,
  ArrowRight,
  Star,
  Truck,
  Building2,
  Phone,
  ShieldCheck,
  Zap,
  Users,
  Compass
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export const Home: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    setActivePage,
    products,
    hostels,
    studyMaterials,
    openLiveSession,
    openCheckout
  } = useApp();
  const { user } = useAuth();

  const heroCards = [
    {
      id: 'solar',
      title: 'Solar & Clean Energy',
      subtitle: 'Off-grid kits, lithium backups & certified installers',
      icon: <Sun className="w-5 h-5 text-amber-600" />,
      accentColor: 'border-amber-200/80 hover:border-amber-300 bg-gradient-to-b from-amber-50/60 to-white',
      badge: 'EPRA Certified',
      badgeStyle: 'bg-amber-100/80 text-amber-800 border-amber-200',
      actionText: 'Explore Solar',
      onClick: () => {
        setSearchQuery('Solar');
        setActivePage('marketplace');
      }
    },
    {
      id: 'findlocal',
      title: 'Local Supplies & Hardware',
      subtitle: 'Bamburi cement, mama mboga, sand & hardware radar',
      icon: <MapPin className="w-5 h-5 text-emerald-600" />,
      accentColor: 'border-emerald-200/80 hover:border-emerald-300 bg-gradient-to-b from-emerald-50/60 to-white',
      badge: 'GPS Radar',
      badgeStyle: 'bg-emerald-100/80 text-emerald-800 border-emerald-200',
      actionText: 'Find Nearby',
      onClick: () => {
        setActivePage('findlocal');
      }
    },
    {
      id: 'campus',
      title: 'Campus Hostels & Living',
      subtitle: 'Verified bedsitters near JKUAT, KU, UoN with video tours',
      icon: <HomeIcon className="w-5 h-5 text-teal-600" />,
      accentColor: 'border-teal-200/80 hover:border-teal-300 bg-gradient-to-b from-teal-50/60 to-white',
      badge: 'Zero Broker Fee',
      badgeStyle: 'bg-teal-100/80 text-teal-800 border-teal-200',
      actionText: 'Browse Hostels',
      onClick: () => {
        setActivePage('landlords');
      }
    },
    {
      id: 'education',
      title: 'CBC & KCSE Study Hub',
      subtitle: 'Past papers, competency trackers & university notes',
      icon: <GraduationCap className="w-5 h-5 text-indigo-600" />,
      accentColor: 'border-indigo-200/80 hover:border-indigo-300 bg-gradient-to-b from-indigo-50/60 to-white',
      badge: 'Verified Notes',
      badgeStyle: 'bg-indigo-100/80 text-indigo-800 border-indigo-200',
      actionText: 'Read Materials',
      onClick: () => {
        setActivePage('students');
      }
    }
  ];

  const liveStreams = [
    {
      title: 'SunKing Solar Inverter & 5kWh Lithium Backup Live Demo',
      host: 'SunKing Solar Kenya • Industrial Area Hub',
      viewers: '240 watching',
      image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&auto=format&fit=crop&q=80',
      url: 'https://www.youtube.com/watch?v=live_solar_demo_kenya',
      productId: 'prod_solar_home_pro'
    },
    {
      title: 'Juja Modern Bedsitters & 1-Bedroom Video Walkthrough',
      host: 'Juja Student Havens • JKUAT Gate C',
      viewers: '85 watching',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=80',
      url: 'https://www.youtube.com/watch?v=live_juja_hostel_tour',
      propertyId: 'hostel_juja_havens'
    }
  ];

  return (
    <div className="space-y-12 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      
      {/* Top Hero Section */}
      <section className="relative pt-6 pb-6 text-center max-w-4xl mx-auto">
        
        {/* Subtle Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 text-white text-xs font-semibold mb-5 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>Kenyan Multi-Sided Marketplace & Discovery Engine</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight font-display leading-[1.1]">
          Discover supplies, services & opportunities in Kenya
        </h1>

        <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Connect directly with verified local dealers, solar installers, campus landlords, schools, and student creators across Nairobi, Ruiru, Juja and countrywide corridors.
        </p>

        {/* Clean Centered Search Bar */}
        <div className="mt-8 max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-2 flex items-center gap-2 transition hover:border-slate-300 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-100">
            <div className="pl-3 text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              id="hero-discovery-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setActivePage('marketplace');
              }}
              placeholder="Search solar backups, cement bags, hostels, notes, jobs..."
              className="flex-1 py-2.5 px-2 text-sm sm:text-base text-slate-800 placeholder-slate-400 outline-none bg-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-slate-400 hover:text-slate-600 px-2"
              >
                Clear
              </button>
            )}
            <button
              id="hero-search-submit-btn"
              onClick={() => setActivePage('marketplace')}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-xs transition flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <span>Search</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Suggestion Pills & Tour Link */}
        <div className="mt-4 flex items-center justify-center gap-2 flex-wrap text-xs text-slate-500">
          <button
            id="hero-findlocal-tour-btn"
            onClick={() => setActivePage('findlocal')}
            className="px-3 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-200 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Take Best Findlocals Tour</span>
          </button>
          <span className="font-semibold text-slate-400">Popular:</span>
          {['SunKing Solar', 'Bamburi 50kg Cement', 'Juja Hostels', 'KCSE Past Papers', 'Mama Mboga'].map((tag) => (
            <button
              key={tag}
              onClick={() => {
                setSearchQuery(tag);
                setActivePage('marketplace');
              }}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer font-medium"
            >
              {tag}
            </button>
          ))}
        </div>

      </section>

      {/* 4 Core Pillars Grid */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {heroCards.map((card) => (
            <button
              key={card.id}
              onClick={card.onClick}
              className={`p-6 rounded-2xl border ${card.accentColor} text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex flex-col justify-between group cursor-pointer shadow-xs`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-2xs border border-slate-100 flex items-center justify-center">
                    {card.icon}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${card.badgeStyle}`}>
                    {card.badge}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 font-display group-hover:text-blue-600 transition">
                  {card.title}
                </h3>
                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                  {card.subtitle}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-900 group-hover:text-blue-600">
                <span>{card.actionText}</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-slate-400 group-hover:text-blue-600" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* YouTube Live Streams & Walkthroughs Section */}
      <section>
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white shadow-xl relative overflow-hidden border border-slate-800">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
                <span className="text-xs font-bold uppercase tracking-widest text-rose-400">
                  Live Demonstrations
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
                Live Video Demonstrations & Hostel Tours
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Watch live broadcasts from verified sellers, order supplies, or reserve beds in real time.
              </p>
            </div>

            <button
              onClick={() => setActivePage('feed')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition self-start border border-slate-700 cursor-pointer"
            >
              <span>View All Media Feed</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {liveStreams.map((stream, idx) => (
              <div
                key={idx}
                className="group relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition shadow-md"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={stream.image}
                    alt={stream.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30"></div>
                  
                  {/* Live Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-600 text-white text-[11px] font-bold uppercase tracking-wider shadow-sm">
                    <Radio className="w-3 h-3" />
                    <span>Live Stream</span>
                  </div>

                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-[10px] font-medium text-slate-200 border border-white/10">
                    {stream.viewers}
                  </div>

                  {/* Play Overlay */}
                  <button
                    onClick={() =>
                      openLiveSession({
                        title: stream.title,
                        hostName: stream.host,
                        youtubeUrl: stream.url,
                        productId: stream.productId,
                        propertyId: stream.propertyId
                      })
                    }
                    className="absolute inset-0 flex items-center justify-center cursor-pointer group-hover:bg-black/20 transition"
                  >
                    <div className="w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-white translate-x-0.5" />
                    </div>
                  </button>
                </div>

                <div className="p-4 flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-white truncate">{stream.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5 truncate">{stream.host}</p>
                  </div>

                  <button
                    onClick={() =>
                      openLiveSession({
                        title: stream.title,
                        hostName: stream.host,
                        youtubeUrl: stream.url,
                        productId: stream.productId,
                        propertyId: stream.propertyId
                      })
                    }
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shrink-0 cursor-pointer"
                  >
                    Join Live
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Featured Supplies & Hardware Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
              Featured Supplies & Hardware
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified local pricing with direct site delivery options in Nairobi and Kiambu
            </p>
          </div>
          <button
            onClick={() => setActivePage('marketplace')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
          >
            <span>View Full Market</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.slice(0, 3).map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                  <img
                    src={prod.images[0]}
                    alt={prod.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs text-[10px] font-bold text-slate-800 shadow-xs border border-slate-200">
                    {prod.category}
                  </span>
                  {prod.deliveryAvailable && (
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-bold flex items-center gap-1 shadow-xs">
                      <Truck className="w-3 h-3" /> Delivery
                    </span>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{prod.location}</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                    {prod.title}
                  </h3>

                  {prod.bulkPricing && (
                    <div className="mt-2.5 text-[11px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-lg">
                      Bulk rate: KES {prod.bulkPricing[0].discountedPriceKes.toLocaleString()}/bag (min {prod.bulkPricing[0].minUnits} units)
                    </div>
                  )}
                </div>
              </div>

              <div className="p-5 pt-3 flex items-center justify-between border-t border-slate-100 bg-slate-50/50">
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Price</p>
                  <p className="text-base font-extrabold text-blue-600">
                    KES {prod.priceKes.toLocaleString()}
                    {prod.unitType && <span className="text-xs font-normal text-slate-500"> / {prod.unitType}</span>}
                  </p>
                </div>

                <button
                  onClick={() =>
                    openCheckout({
                      orderId: `ORD-${Date.now()}`,
                      itemTitle: prod.title,
                      amountKes: prod.priceKes,
                      customerName: user ? user.name : 'Customer',
                      customerEmail: user ? user.email : 'customer@enemind.co.ke',
                      customerPhone: user?.phone || '+254700000000',
                      sellerId: prod.sellerId,
                      sellerName: prod.sellerName,
                      sellerType: prod.sellerType
                    })
                  }
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
                >
                  Order Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Verified Hostels & CBC Education Spotlight */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Hostels Box */}
        <div className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                Verified Hostels
              </span>
              <span className="text-xs font-semibold text-teal-700">Near Universities</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-display">
              Campus Hostels & Modern Bedsitters
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Virtual YouTube video tours, 1:1 live walkthrough appointments, and zero broker charges.
            </p>

            <div className="mt-4 space-y-3">
              {hostels.map((h) => (
                <div key={h.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{h.title}</h4>
                    <p className="text-[11px] text-slate-500 truncate">{h.campusAffiliation} • {h.propertyType}</p>
                    <p className="text-xs font-bold text-teal-700 mt-0.5">KES {h.rentKes.toLocaleString()} / mo</p>
                  </div>
                  <button
                    onClick={() => setActivePage('landlords')}
                    className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition shrink-0 cursor-pointer"
                  >
                    View Tour
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActivePage('landlords')}
            className="mt-5 w-full py-2.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold hover:bg-teal-100 transition cursor-pointer"
          >
            Explore All Campus Hostels
          </button>
        </div>

        {/* CBC Schools Box */}
        <div className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200">
                CBC & KCSE Hub
              </span>
              <span className="text-xs font-semibold text-indigo-700">Alliance High & Riara</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-display">
              Competency Ratings, Past Papers & Notes
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Curated study materials, official past papers, and term assessment reports.
            </p>

            <div className="mt-4 space-y-3">
              {studyMaterials.map((m) => (
                <div key={m.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{m.title}</h4>
                    <p className="text-[11px] text-slate-500 truncate">{m.gradeLevel} • {m.subject}</p>
                    <p className="text-xs font-bold text-indigo-700 mt-0.5">
                      {m.isPaid ? `KES ${m.priceKes.toLocaleString()}` : 'Free Note'}
                    </p>
                  </div>
                  <button
                    onClick={() => setActivePage('students')}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition shrink-0 cursor-pointer"
                  >
                    Read
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActivePage('schools')}
            className="mt-5 w-full py-2.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold hover:bg-indigo-100 transition cursor-pointer"
          >
            Access School Administration & Marks
          </button>
        </div>

      </section>

    </div>
  );
};
