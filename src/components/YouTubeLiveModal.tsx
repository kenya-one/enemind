import React, { useState } from 'react';
import { Radio, ExternalLink, X, MessageSquare, ShoppingBag, Home, CheckCircle2, Shield, Play } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export const YouTubeLiveModal: React.FC = () => {
  const { activeLiveSession, closeLiveSession, openCheckout, products, hostels, showToast } = useApp();
  const { user } = useAuth();
  const [chatInput, setChatInput] = useState('');
  const [liveChatMessages, setLiveChatMessages] = useState([
    { sender: 'Otieno (Juja)', text: 'Is water included in the rent or metered separately?' },
    { sender: 'Wanjiku (Nairobi)', text: 'Can this solar inverter run a 300L fridge and water pump?' },
    { sender: 'Maina (Kikuyu)', text: 'Delivery fee to Ruiru bypass how much?' }
  ]);

  if (!activeLiveSession) return null;

  const linkedProduct = activeLiveSession.productId
    ? products.find((p) => p.id === activeLiveSession.productId)
    : null;

  const linkedHostel = activeLiveSession.propertyId
    ? hostels.find((h) => h.id === activeLiveSession.propertyId)
    : null;

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setLiveChatMessages((prev) => [
      ...prev,
      { sender: user ? user.name.split(' ')[0] : 'Guest', text: chatInput.trim() }
    ]);
    setChatInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 text-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-rose-600/20 text-rose-400 border border-rose-500/40 text-xs font-bold uppercase tracking-wider">
              <Radio className="w-3.5 h-3.5 animate-pulse text-rose-500" />
              <span>YouTube Live</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight truncate max-w-md">
                {activeLiveSession.title}
              </h3>
              <p className="text-xs text-slate-400">Host: {activeLiveSession.hostName}</p>
            </div>
          </div>
          
          <button
            onClick={closeLiveSession}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Video Deep Link Player + Enemind Action Companion */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 overflow-y-auto">
          
          {/* Left / Center: Live Player & YouTube Deep Link Banner */}
          <div className="lg:col-span-2 p-6 flex flex-col justify-between bg-slate-900 border-b lg:border-b-0 lg:border-r border-slate-800">
            
            {/* Live Video Stage */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-center p-6 shadow-inner group">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
              
              {/* Background Art */}
              <div className="absolute inset-0 opacity-30 bg-cover bg-center" style={{ backgroundImage: `url(${linkedProduct?.images[0] || linkedHostel?.images[0] || 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=1000'})` }}></div>

              <div className="relative z-10 flex flex-col items-center max-w-md">
                <div className="w-16 h-16 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg shadow-red-600/40 mb-4 group-hover:scale-110 transition-transform">
                  <Play className="w-7 h-7 fill-white translate-x-0.5" />
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-red-500 text-white text-[11px] font-bold uppercase tracking-wide">
                    Live On YouTube
                  </span>
                  <span className="text-xs text-slate-300">1080p 60fps Stream</span>
                </div>
                
                <h4 className="text-lg font-bold text-white mb-2">{activeLiveSession.title}</h4>
                <p className="text-xs text-slate-300 mb-5 leading-relaxed">
                  Streaming live via host's verified YouTube channel. Open in YouTube app or in-browser, while completing all orders and bookings right here on Enemind!
                </p>

                <a
                  href={activeLiveSession.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white font-semibold text-xs shadow-lg shadow-red-600/30 transition transform hover:-translate-y-0.5"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open Full Stream on YouTube</span>
                </a>
              </div>
            </div>

            {/* Platform Trust & Double-Confirmation Note */}
            <div className="mt-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3">
              <Shield className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-bold text-slate-200">Enemind Protected Escrow & Booking</h5>
                <p className="text-[11px] text-slate-400 leading-normal mt-0.5">
                  Payments are powered by Pesapal with double-confirmation: funds are logged directly to the seller's Google Sheets ledger upon verified delivery or tour confirmation.
                </p>
              </div>
            </div>

          </div>

          {/* Right: Interactive Action & Live Q&A Companion */}
          <div className="p-6 flex flex-col justify-between bg-slate-950">
            
            {/* Context-aware Action Box (Ordering or Booking) */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Live Action Desk
              </h4>

              {linkedProduct && (
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 mb-5">
                  <p className="text-xs text-blue-400 font-semibold mb-1">Featured Item on Stream</p>
                  <h5 className="text-sm font-bold text-white mb-1 line-clamp-2">{linkedProduct.title}</h5>
                  <p className="text-lg font-extrabold text-amber-400 mb-3">
                    KES {linkedProduct.priceKes.toLocaleString()}
                  </p>
                  <button
                    onClick={() => {
                      openCheckout({
                        orderId: `ORD-${Date.now()}`,
                        itemTitle: linkedProduct.title,
                        amountKes: linkedProduct.priceKes,
                        customerName: user ? user.name : 'Customer',
                        customerEmail: user ? user.email : 'customer@enemind.co.ke',
                        customerPhone: user?.phone || '+254700000000',
                        sellerId: linkedProduct.sellerId,
                        sellerName: linkedProduct.sellerName,
                        sellerType: linkedProduct.sellerType
                      });
                      closeLiveSession();
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-600/30 transition"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Order Now via Pesapal</span>
                  </button>
                </div>
              )}

              {linkedHostel && (
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 mb-5">
                  <p className="text-xs text-teal-400 font-semibold mb-1">Live Walkthrough Unit</p>
                  <h5 className="text-sm font-bold text-white mb-1">{linkedHostel.title}</h5>
                  <p className="text-xs text-slate-400 mb-2">{linkedHostel.campusAffiliation}</p>
                  <p className="text-lg font-extrabold text-amber-400 mb-3">
                    KES {linkedHostel.rentKes.toLocaleString()} <span className="text-xs text-slate-400 font-normal">{linkedHostel.rentPeriod}</span>
                  </p>
                  <button
                    onClick={() => {
                      openCheckout({
                        orderId: `DEPOSIT-${Date.now()}`,
                        itemTitle: `Holding Deposit: ${linkedHostel.title}`,
                        amountKes: Math.round(linkedHostel.rentKes * 0.5),
                        customerName: user ? user.name : 'Student Tenant',
                        customerEmail: user ? user.email : 'tenant@students.enemind.co.ke',
                        customerPhone: user?.phone || '+254700000000',
                        sellerId: linkedHostel.landlordId,
                        sellerName: linkedHostel.landlordName,
                        sellerType: 'landlord'
                      });
                      closeLiveSession();
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-teal-600/30 transition"
                  >
                    <Home className="w-4 h-4" />
                    <span>Reserve Unit (50% Deposit)</span>
                  </button>
                </div>
              )}

              {/* Live Chat Stream */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" /> Live Q&A Stream
                  </span>
                  <span className="text-[10px] text-emerald-400">Live</span>
                </div>
                
                <div className="h-40 overflow-y-auto space-y-2 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                  {liveChatMessages.map((msg, idx) => (
                    <div key={idx} className="leading-snug">
                      <span className="font-semibold text-blue-400 mr-1.5">{msg.sender}:</span>
                      <span className="text-slate-300">{msg.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendChat} className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask host a question..."
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-semibold text-white transition"
              >
                Send
              </button>
            </form>

          </div>

        </div>

      </div>
    </div>
  );
};
