import React, { useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  Package,
  Layers,
  Sparkles,
  Zap,
  TrendingDown,
  Building2,
  Calculator,
  MessageCircle,
  Phone,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { ProductItem } from '../types';

export const MarketplacePage: React.FC = () => {
  const { products, showToast } = useApp();
  const { user } = useAuth();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price_low' | 'price_high'>('featured');
  const [bulkQuantity, setBulkQuantity] = useState<{ [id: string]: number }>({});

  const categories = [
    'All',
    'Solar & Clean Energy',
    'Hardware & Construction',
    'Student Essentials',
    'Laptops & Electronics',
    'Services & Labor'
  ];

  const handleWhatsAppOrder = (prod: ProductItem, qty: number, price: number) => {
    const sellerPhone = prod.contactPhone?.replace(/\s+/g, '') || '+254712345678';
    const text = encodeURIComponent(
      `Hello ${prod.sellerName}, I found your listing "${prod.title}" on Enemind. I am interested in buying ${qty} ${prod.unitType || 'unit(s)'} for KES ${price.toLocaleString()}. Is this item available in ${prod.location}?`
    );
    window.open(`https://wa.me/${sellerPhone.replace('+', '')}?text=${text}`, '_blank');
    showToast(`Connecting directly to ${prod.sellerName} on WhatsApp...`);
  };

  const handleDirectCall = (prod: ProductItem) => {
    const sellerPhone = prod.contactPhone?.replace(/\s+/g, '') || '+254712345678';
    window.location.href = `tel:${sellerPhone}`;
  };

  const filteredProducts = products.filter((prod) => {
    const matchesCategory = selectedCategory === 'All' || prod.category === selectedCategory;
    const matchesSearch =
      prod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.sellerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getEffectivePrice = (prod: ProductItem, qty: number): number => {
    const base = prod.priceKes || prod.basePriceKes || 0;
    if (!prod.bulkPricing || prod.bulkPricing.length === 0) {
      return base * qty;
    }
    const matchedTier = [...prod.bulkPricing]
      .sort((a, b) => (b.minUnits || b.minQty || 0) - (a.minUnits || a.minQty || 0))
      .find((t) => qty >= (t.minUnits || t.minQty || 0));
    
    const unitPrice = matchedTier ? (matchedTier.discountedPriceKes || matchedTier.unitPriceKes || base) : base;
    return unitPrice * qty;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900">
            Direct Merchant & Student Marketplace
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Connect directly with verified hardware stores, solar engineers, and student sellers in Kenya. Zero platform commission or intermediary fund holding.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Direct-to-Seller Connection • Zero Custody</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-3xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search solar panels, cement, laptops, study desks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium outline-none cursor-pointer"
          >
            <option value="featured">Featured First</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((prod) => {
          const currentQty = bulkQuantity[prod.id] || 1;
          const totalPrice = getEffectivePrice(prod, currentQty);
          const unitRate = Math.round(totalPrice / currentQty);

          return (
            <div
              key={prod.id}
              className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                  <img
                    src={prod.images[0]}
                    alt={prod.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[10px] font-bold text-slate-800 shadow-xs">
                    {prod.category}
                  </span>

                  {prod.sellerTier === 'premium' && (
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-blue-600 text-white text-[10px] font-bold">
                      Verified Store
                    </span>
                  )}
                </div>

                <div className="p-5">
                  <p className="text-xs text-slate-400 font-medium">{prod.sellerName} • {prod.location}</p>
                  
                  <h3 className="text-sm font-bold text-slate-900 mt-1 line-clamp-2 leading-snug">
                    {prod.title}
                  </h3>

                  <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                    {prod.description}
                  </p>

                  {/* Bulk Quantity Calculator for Building Materials */}
                  {prod.bulkPricing && (
                    <div className="mt-4 p-3 rounded-2xl bg-amber-50/70 border border-amber-200/70 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                        <span className="flex items-center gap-1">
                          <Calculator className="w-3.5 h-3.5 text-amber-600" />
                          Bulk Calculator
                        </span>
                        <span className="text-[10px] bg-amber-200/70 px-1.5 py-0.5 rounded">
                          Tier Rates Available
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="1"
                          max="1000"
                          value={currentQty}
                          onChange={(e) =>
                            setBulkQuantity({ ...bulkQuantity, [prod.id]: Math.max(1, Number(e.target.value)) })
                          }
                          className="w-20 px-2 py-1 text-xs bg-white rounded-lg border border-amber-300 outline-none font-bold"
                        />
                        <span className="text-xs text-slate-700 font-medium">{prod.unitType || 'units'}</span>
                        <span className="text-xs font-bold text-emerald-700 ml-auto">
                          @ KES {unitRate.toLocaleString()}/unit
                        </span>
                      </div>
                    </div>
                  )}

                </div>
              </div>

              {/* Bottom Card Footer with Direct WhatsApp & Call */}
              <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-100 mt-2">
                <div>
                  <p className="text-[10px] text-slate-400 font-medium">Direct Price</p>
                  <p className="text-base font-extrabold text-blue-600">
                    KES {totalPrice.toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleDirectCall(prod)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
                    title="Call Merchant Directly"
                  >
                    <Phone className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleWhatsAppOrder(prod, currentQty, totalPrice)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp Seller</span>
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
