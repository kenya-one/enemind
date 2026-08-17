import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Radio,
  ExternalLink,
  Volume2,
  VolumeX,
  ShoppingBag,
  Home,
  CheckCircle,
  Play,
  Pause,
  Compass
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export const ShortsFeedPage: React.FC = () => {
  const { products, hostels, studyMaterials, openLiveSession, openCheckout, toggleFavorite, favorites, showToast } = useApp();
  const { user } = useAuth();
  
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  // Feed items combining video products, hostel tours, and study spotlights
  const feedItems = [
    {
      id: 'feed_sunking_solar',
      type: 'product',
      title: 'SunKing Home 500X Multi-Room Solar System + 32" Digital TV Live Demonstration',
      creator: 'SunKing Solar Kenya',
      creatorAvatar: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=150&auto=format&fit=crop&q=80',
      mediaUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=1000&auto=format&fit=crop&q=80',
      isLive: true,
      youtubeUrl: 'https://www.youtube.com/watch?v=live_solar_demo_kenya',
      category: 'Solar & Energy',
      priceKes: 34999,
      likes: '4.2k',
      comments: '184',
      shares: '512',
      description: 'See the 50W panel charge during rainy overcast days! Comes with 4 ceiling bulbs + digital TV. Free countrywide delivery.',
      actionLabel: 'Order via Pesapal',
      productId: 'prod_solar_home_pro'
    },
    {
      id: 'feed_juja_hostel_tour',
      type: 'hostel',
      title: 'Juja Student Havens: Modern Bedsitter Virtual Room Walkthrough (Gate C)',
      creator: 'Juja Student Havens',
      creatorAvatar: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=150&auto=format&fit=crop&q=80',
      mediaUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1000&auto=format&fit=crop&q=80',
      isLive: true,
      youtubeUrl: 'https://www.youtube.com/watch?v=live_juja_hostel_tour',
      category: 'Campus Hostels',
      priceKes: 9500,
      likes: '2.8k',
      comments: '96',
      shares: '340',
      description: 'Free Wi-Fi, constant borehole water, biometric security gate and study balcony. Book 1:1 walkthrough or reserve bed.',
      actionLabel: 'Reserve Unit (50% Deposit)',
      propertyId: 'hostel_juja_havens'
    },
    {
      id: 'feed_bamburi_cement_bulk',
      type: 'product',
      title: 'Bulk Bamburi Nguvu 32.5R Site Offloading at Ruiru Kamakis Bypass',
      creator: 'Bamburi & Blue Triangle Materials',
      creatorAvatar: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=150&auto=format&fit=crop&q=80',
      mediaUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=1000&auto=format&fit=crop&q=80',
      isLive: false,
      youtubeUrl: 'https://www.youtube.com/watch?v=bamburi_site_delivery',
      category: 'Building Materials',
      priceKes: 720,
      likes: '1.5k',
      comments: '42',
      shares: '120',
      description: 'Standard 50kg bag. Special bulk discount of KES 650/bag for orders above 500 bags with tipper offloading.',
      actionLabel: 'Order Bulk Bags',
      productId: 'prod_bamburi_cement'
    },
    {
      id: 'feed_calculus_notes',
      type: 'notes',
      title: 'UoN Calculus IV & Differential Equations Solved Predictions 2025',
      creator: 'Brian Mwangi (Campus Creator)',
      creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      mediaUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1000&auto=format&fit=crop&q=80',
      isLive: false,
      category: 'Campus Pastpapers',
      priceKes: 150,
      likes: '3.1k',
      comments: '110',
      shares: '480',
      description: 'Worked out solutions for Laplace Transforms and PDEs with exam formulas cheat sheet. Instant Google Drive access after payment.',
      actionLabel: 'Unlock Notes (KES 150)'
    }
  ];

  const currentItem = feedItems[activeIndex];

  const handleLike = (id: string) => {
    setLikedPosts((prev) => ({ ...prev, [id]: !prev[id] }));
    showToast(likedPosts[id] ? 'Unliked' : 'Added to your liked videos');
  };

  const handleNext = () => {
    if (activeIndex < feedItems.length - 1) setActiveIndex(activeIndex + 1);
  };

  const handlePrev = () => {
    if (activeIndex > 0) setActiveIndex(activeIndex - 1);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 min-h-[calc(100vh-5rem)] flex flex-col justify-center">
      
      {/* Top Feed Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
          <h2 className="text-lg font-bold text-slate-900 font-display">
            Enemind Shorts & Live Video Feed
          </h2>
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Swipe or Click Up/Down • Video {activeIndex + 1} of {feedItems.length}
        </div>
      </div>

      {/* Main TikTok & YouTube Shorts Video Container */}
      <div className="relative aspect-9/16 max-h-[75vh] w-full max-w-sm mx-auto rounded-3xl overflow-hidden bg-slate-950 shadow-2xl border border-slate-800 flex flex-col justify-between select-none">
        
        {/* Background Visual Video Simulation */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-500"
          style={{ backgroundImage: `url(${currentItem.mediaUrl})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90"></div>
        </div>

        {/* Top Header Bar inside Video */}
        <div className="relative z-20 p-4 flex items-center justify-between">
          
          {/* Live Status Pill */}
          {currentItem.isLive ? (
            <button
              onClick={() =>
                openLiveSession({
                  title: currentItem.title,
                  hostName: currentItem.creator,
                  youtubeUrl: currentItem.youtubeUrl,
                  productId: currentItem.productId,
                  propertyId: currentItem.propertyId
                })
              }
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/90 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg animate-pulse"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>YouTube Live</span>
            </button>
          ) : (
            <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-medium border border-white/10">
              {currentItem.category}
            </span>
          )}

          {/* Mute / Audio Toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70 transition"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>
        </div>

        {/* Middle Play / Pause Click Target */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="absolute inset-0 z-10 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/20"
        >
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center">
            {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 fill-white translate-x-0.5" />}
          </div>
        </button>

        {/* Right Side Social Actions Column (TikTok / Shorts Style) */}
        <div className="absolute right-3 bottom-24 z-20 flex flex-col items-center gap-4">
          
          {/* Creator Avatar with Follow Plus */}
          <div className="relative mb-1">
            <img
              src={currentItem.creatorAvatar}
              alt={currentItem.creator}
              className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-lg"
            />
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-rose-500 text-white text-xs font-bold flex items-center justify-center shadow-xs">
              +
            </div>
          </div>

          {/* Like */}
          <button
            onClick={() => handleLike(currentItem.id)}
            className="flex flex-col items-center gap-1 group cursor-pointer"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition ${
                likedPosts[currentItem.id]
                  ? 'bg-rose-500 text-white'
                  : 'bg-black/50 text-white hover:bg-black/70'
              }`}
            >
              <Heart className={`w-5 h-5 ${likedPosts[currentItem.id] ? 'fill-white' : ''}`} />
            </div>
            <span className="text-[11px] font-bold text-white shadow-sm">{currentItem.likes}</span>
          </button>

          {/* Comments */}
          <button
            onClick={() => showToast('Opening comments & inquiry thread')}
            className="flex flex-col items-center gap-1 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70 transition">
              <MessageCircle className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-white shadow-sm">{currentItem.comments}</span>
          </button>

          {/* Bookmark */}
          <button
            onClick={() => toggleFavorite(currentItem.id)}
            className="flex flex-col items-center gap-1 group cursor-pointer"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition ${
                favorites.includes(currentItem.id)
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-black/50 text-white hover:bg-black/70'
              }`}
            >
              <Bookmark className={`w-5 h-5 ${favorites.includes(currentItem.id) ? 'fill-current' : ''}`} />
            </div>
            <span className="text-[11px] font-bold text-white shadow-sm">Save</span>
          </button>

          {/* Share */}
          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
              }
              showToast('Link copied to clipboard!');
            }}
            className="flex flex-col items-center gap-1 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70 transition">
              <Share2 className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-white shadow-sm">{currentItem.shares}</span>
          </button>

        </div>

        {/* Bottom Details Overlay & Action Button */}
        <div className="relative z-20 p-5 pt-0 space-y-3 bg-gradient-to-t from-black via-black/80 to-transparent">
          <div>
            <p className="text-xs font-bold text-blue-400 flex items-center gap-1">
              <span>@{currentItem.creator}</span>
              <CheckCircle className="w-3 h-3 text-blue-400 fill-blue-400 text-slate-900" />
            </p>
            <h3 className="text-sm font-bold text-white line-clamp-2 mt-0.5 leading-snug">
              {currentItem.title}
            </h3>
            <p className="text-xs text-slate-300 line-clamp-2 mt-1 leading-relaxed">
              {currentItem.description}
            </p>
          </div>

          <div className="flex items-center justify-between gap-3 pt-1">
            <div className="text-white">
              <p className="text-[10px] text-slate-400 uppercase font-medium">Price</p>
              <p className="text-base font-extrabold text-amber-400">
                KES {currentItem.priceKes.toLocaleString()}
              </p>
            </div>

            <button
              onClick={() => {
                if (currentItem.isLive) {
                  openLiveSession({
                    title: currentItem.title,
                    hostName: currentItem.creator,
                    youtubeUrl: currentItem.youtubeUrl,
                    productId: currentItem.productId,
                    propertyId: currentItem.propertyId
                  });
                } else {
                  openCheckout({
                    orderId: `ORD-${Date.now()}`,
                    itemTitle: currentItem.title,
                    amountKes: currentItem.priceKes,
                    customerName: user ? user.name : 'Customer',
                    customerEmail: user ? user.email : 'customer@enemind.co.ke',
                    customerPhone: user?.phone || '+254700000000',
                    sellerId: 'user_company_1',
                    sellerName: currentItem.creator,
                    sellerType: 'company',
                    isStudentContent: currentItem.type === 'notes'
                  });
                }
              }}
              className="flex-1 py-2.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{currentItem.actionLabel}</span>
            </button>
          </div>

        </div>

      </div>

      {/* Up / Down Navigation Controls */}
      <div className="flex items-center justify-center gap-3 mt-4">
        <button
          onClick={handlePrev}
          disabled={activeIndex === 0}
          className="px-4 py-2 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold disabled:opacity-40 transition cursor-pointer"
        >
          ▲ Previous Short
        </button>
        <button
          onClick={handleNext}
          disabled={activeIndex === feedItems.length - 1}
          className="px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold disabled:opacity-40 transition cursor-pointer"
        >
          ▼ Next Short
        </button>
      </div>

    </div>
  );
};
