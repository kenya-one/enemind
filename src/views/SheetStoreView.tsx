/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import {
  Table,
  Check,
  Download,
  CreditCard,
  CheckCircle2,
  Star,
  Info,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { useCurrency } from '../context/CurrencyContext.js';
import { api } from '../services/api.js';
import { SheetProduct, EnermindOrder } from '../types/index.js';

export function SheetStoreView() {
  const { user } = useAuth();
  const { formatPrice, convertPrice, preferredCurrency, activeRate } = useCurrency();
  const [products, setProducts] = useState<SheetProduct[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeProduct, setActiveProduct] = useState<SheetProduct | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeOrder, setActiveOrder] = useState<EnermindOrder | null>(null);
  const [checkoutMessage, setCheckoutMessage] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const data = await api.getSheetProducts();
      setProducts(data.products || []);
    } catch (err) {
      console.error('Failed to load sheet products:', err);
    }
  }

  async function handleInitiatePurchase(product: SheetProduct) {
    if (!user) {
      alert('Please sign in first to purchase or save templates to your Google Drive.');
      return;
    }

    setActiveProduct(product);
    setIsCheckoutOpen(true);
    setCheckoutMessage(null);

    try {
      setIsProcessing(true);
      const res = await api.createOrder({
        userId: user.id,
        userEmail: user.email,
        productId: product.id,
        productTitle: product.name,
        productType: 'SHEET_PRODUCT',
        amount: product.price,
        currency: product.currency,
        displayCurrency: preferredCurrency,
        paymentProvider: 'PESAPAL',
      });

      setActiveOrder(res.order);
    } catch (err: any) {
      setCheckoutMessage(`Order error: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  }

  async function handlePayWithPesaPal() {
    if (!activeOrder) return;
    try {
      setIsProcessing(true);
      const res = await api.submitPesaPalOrder(activeOrder.id);
      if (res.success && res.redirectUrl) {
        window.location.href = res.redirectUrl;
      } else {
        setCheckoutMessage(
          res.error || 'PesaPal credentials required in server config. Marking order as sandbox simulation.'
        );
      }
    } catch (err: any) {
      setCheckoutMessage(`PesaPal connection error: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  }

  const filtered = products.filter(
    (p) => selectedCategory === 'ALL' || p.category === selectedCategory
  );

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#12141D] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#50E3C2]/10 text-[#50E3C2] flex items-center justify-center border border-[#50E3C2]/20">
              <Table className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">Google Sheet Store & Productivity Kits</h2>
          </div>
          <p className="text-xs text-white/40">
            Automated spreadsheets with built-in formulas, dashboards, and Google Drive export.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-white/5 px-3 py-1.5 rounded-full border border-white/5 text-white/70">
          <Info className="w-3.5 h-3.5 text-[#50E3C2] shrink-0" />
          <span>Local pricing converted to {activeRate.code}</span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {['ALL', 'STUDENT', 'BUSINESS', 'PROPERTY', 'AGRICULTURE'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-white text-black font-bold'
                : 'bg-white/5 text-white/50 hover:text-white border border-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Sheet Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((prod) => {
          const conversion = convertPrice(prod.price, prod.currency);
          return (
            <div
              key={prod.id}
              className="rounded-2xl bg-[#12141D] border border-white/5 hover:border-white/15 transition-all flex flex-col justify-between p-6 space-y-4 shadow-lg"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#50E3C2]/10 text-[#50E3C2] border border-[#50E3C2]/20 font-mono">
                    {prod.category}
                  </span>
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{prod.rating}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white leading-snug">{prod.name}</h3>
                  <p className="text-xs text-white/40 mt-1 leading-relaxed">{prod.tagline}</p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-white/5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/30">
                    Included Spreadsheets ({prod.tabCount} Tabs)
                  </span>
                  {prod.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-white/70">
                      <Check className="w-3.5 h-3.5 text-[#50E3C2] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price & Action */}
              <div className="pt-4 border-t border-white/5 space-y-3">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-lg font-extrabold text-[#50E3C2]">
                      {prod.isFree ? 'FREE' : formatPrice(prod.price, prod.currency)}
                    </span>
                    {!prod.isFree && conversion.isEstimate && (
                      <span className="text-[10px] text-white/40 block font-mono">
                        Base: {prod.currency} {prod.price}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-white/40">{prod.downloadsCount.toLocaleString()} downloads</span>
                </div>

                <button
                  onClick={() => handleInitiatePurchase(prod)}
                  className="w-full py-2.5 px-4 bg-[#50E3C2] hover:bg-[#40d0b0] text-black text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-[#50E3C2]/20 cursor-pointer"
                >
                  <Download className="w-4 h-4 stroke-[2.5]" />
                  <span>{prod.isFree ? 'Get Free Template' : 'Purchase with PesaPal'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* PesaPal Checkout & Google Sheet Modal */}
      {isCheckoutOpen && activeProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0B10]/85 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-[#12141D] border border-white/10 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#50E3C2]/10 text-[#50E3C2] flex items-center justify-center border border-[#50E3C2]/20">
                  <Table className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white">Google Sheet Store Checkout</h3>
              </div>
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="text-white/40 hover:text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                <p className="text-xs font-bold text-white">{activeProduct.name}</p>
                <p className="text-xs text-white/40">{activeProduct.description}</p>
                <div className="pt-2 flex items-center justify-between text-xs font-bold text-[#50E3C2]">
                  <span>Total Due:</span>
                  <span>{activeProduct.isFree ? 'FREE' : formatPrice(activeProduct.price, activeProduct.currency)}</span>
                </div>
              </div>

              {checkoutMessage && (
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white/80">
                  {checkoutMessage}
                </div>
              )}

              <div className="space-y-2 text-xs text-white/50">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#50E3C2] shrink-0" />
                  <span>Secure 256-bit payment processing via PesaPal Gateway</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#50E3C2] shrink-0" />
                  <span>Automatically creates spreadsheet directly in your Google Drive</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handlePayWithPesaPal}
                disabled={isProcessing}
                className="w-full py-3 bg-[#50E3C2] hover:bg-[#40d0b0] text-black font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#50E3C2]/20 cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                <span>{isProcessing ? 'Connecting Gateway...' : 'Proceed to PesaPal Payment'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
