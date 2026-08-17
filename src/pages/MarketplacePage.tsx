import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  Truck,
  Star,
  Layers,
  ChevronDown,
  ExternalLink,
  CheckCircle,
  Calculator,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { ProductItem } from '../types';

export const MarketplacePage: React.FC = () => {
  const { products, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, openCheckout, showToast } = useApp();
  const { user } = useAuth();

  const [sortBy, setSortBy] = useState<'recommended' | 'price_low' | 'price_high'>('recommended');
  const [bulkQuantity, setBulkQuantity] = useState<Record<string, number>>({
    prod_bamburi_cement: 100
  });

  const categories = [
    'All',
    'Solar & Energy',
    'Building Materials',
    'Farm Produce',
    'Electronics',
    'Services'
  ];

  const filteredProducts = products
    .filter((p) => {
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchQuery =
        !searchQuery ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    })
    .sort((a, b) => {
      if (sortBy === 'price_low') return a.priceKes - b.priceKes;
      if (sortBy === 'price_high') return b.priceKes - a.priceKes;
      return 0;
    });

  const getEffectivePrice = (prod: ProductItem, qty: number) => {
    if (!prod.bulkPricing || prod.bulkPricing.length === 0) return prod.priceKes * qty;
    // Find highest threshold that qualifies
    const qualified = [...prod.bulkPricing]
      .sort((a, b) => b.minUnits - a.minUnits)
      .find((b) => qty >= b.minUnits);

    const unitPrice = qualified ? qualified.discountedPriceKes : prod.priceKes;
    return unitPrice * qty;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
            Enemind Marketplace
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Certified solar systems, building materials with bulk rates, farm produce, and local services.
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="pl-9 pr-4 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:border-blue-500 outline-none w-52"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
          >
            <option value="recommended">Sort: Recommended</option>
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
                          Bulk Quantity Calculator
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

              {/* Bottom Card Footer */}
              <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-100 mt-2">
                <div>
                  <p className="text-[10px] text-slate-400 font-medium">Total Price</p>
                  <p className="text-base font-extrabold text-blue-600">
                    KES {totalPrice.toLocaleString()}
                  </p>
                </div>

                <button
                  onClick={() =>
                    openCheckout({
                      orderId: `ORD-${Date.now()}`,
                      itemTitle: `${prod.title} (Qty: ${currentQty})`,
                      amountKes: totalPrice,
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
                  Order via Pesapal
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
