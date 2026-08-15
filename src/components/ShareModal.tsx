import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Share2,
  Copy,
  Check,
  QrCode,
  Calculator
} from 'lucide-react';
import { RentalListing } from '../types';
import { WhatsAppLogo, XLogo } from './SocialLogos';

interface ShareModalProps {
  listing: RentalListing;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ listing, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  if (!isOpen) return null;

  const currentUrl = window.location.href;
  const shareText = `Check out this ${listing.bedrooms > 0 ? `${listing.bedrooms} Bedroom` : 'Bedsitter'} in ${listing.estate}, ${listing.county} for KSh ${listing.priceKes.toLocaleString()}/mo on Kenya House Hunt!\n${currentUrl}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const encoded = encodeURIComponent(shareText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const handleTwitterShare = () => {
    const text = encodeURIComponent(`Hunting for a house in Kenya! Found ${listing.title} on Kenya House Hunt 🇰🇪🏡`);
    const url = encodeURIComponent(currentUrl);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          className="relative w-full max-w-md bg-[#111111] border border-white/15 rounded-t-3xl sm:rounded-2xl shadow-2xl p-5 text-neutral-100 flex flex-col space-y-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-[#FFD700]" />
              <h3 className="font-serif font-light text-lg text-white">Share Kenya Residence</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Property Preview */}
          <div className="flex items-center gap-3 bg-[#181818] p-3 rounded-xl border border-white/10">
            <img
              src={listing.thumbnailUrl}
              alt={listing.title}
              className="w-14 h-14 rounded-lg object-cover border border-white/10"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-serif font-light text-sm text-white truncate">{listing.title}</h4>
              <p className="text-xs text-[#FFD700] font-medium">KSh {listing.priceKes.toLocaleString()} / mo</p>
              <p className="text-[11px] text-neutral-400">📍 {listing.estate}, {listing.county}</p>
            </div>
          </div>

          {/* Share Channels */}
          <div className="grid grid-cols-4 gap-3 text-center">
            {/* WhatsApp (Main Kenyan channel) */}
            <button
              onClick={handleWhatsAppShare}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <WhatsAppLogo className="w-10 h-10" />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-300">WhatsApp</span>
            </button>

            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform border border-white/10">
                {copied ? <Check className="w-5 h-5 text-[#FFD700]" /> : <Copy className="w-5 h-5" />}
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-300">
                {copied ? 'Copied!' : 'Copy Link'}
              </span>
            </button>

            {/* QR Code */}
            <button
              onClick={() => setShowQr(!showQr)}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[#FFD700] shadow-md group-hover:scale-105 transition-transform border border-white/10">
                <QrCode className="w-5 h-5" />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-300">QR Code</span>
            </button>

            {/* Twitter / X */}
            <button
              onClick={handleTwitterShare}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform border border-white/20 p-2">
                <XLogo className="w-5 h-5" />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-300">X (Twitter)</span>
            </button>
          </div>

          {/* QR Code Dropdown */}
          {showQr && (
            <div className="bg-black p-4 rounded-xl text-neutral-100 flex flex-col items-center justify-center text-center space-y-2 border border-white/20">
              <div className="w-36 h-36 border border-white/20 p-2 rounded-lg flex flex-col items-center justify-center bg-[#181818] font-mono text-[10px] relative">
                <div className="grid grid-cols-6 gap-1 w-full h-full p-2 bg-neutral-900 rounded">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-xs ${
                        (i * 7) % 3 === 0 || i === 0 || i === 5 || i === 30 || i === 35
                          ? 'bg-[#FFD700]'
                          : 'bg-transparent'
                      }`}
                    />
                  ))}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black border border-[#FFD700] text-[#FFD700] font-serif font-light text-[9px] px-2 py-0.5 rounded shadow">
                    KENYA HUNT
                  </div>
                </div>
              </div>
              <p className="text-xs text-neutral-400">Scan to open this residence on mobile</p>
            </div>
          )}

          {/* M-Pesa Rental Cost Breakdown Estimator */}
          <div className="bg-[#181818] border border-white/10 rounded-xl p-3.5 text-xs space-y-2">
            <div className="flex items-center gap-2 text-[#FFD700] font-semibold uppercase tracking-wider text-[11px]">
              <Calculator className="w-4 h-4" />
              <span>Estimated First Month Move-in (KES)</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-neutral-300 text-[11px]">
              <div>1st Month Rent:</div>
              <div className="text-right font-mono text-white">KSh {listing.priceKes.toLocaleString()}</div>
              <div>Refundable Deposit:</div>
              <div className="text-right font-mono text-neutral-300">KSh {listing.priceKes.toLocaleString()}</div>
              <div>Water & Service Deposit:</div>
              <div className="text-right font-mono text-neutral-300">KSh 3,000</div>
              <div className="border-t border-white/10 pt-1 font-bold text-[#FFD700] uppercase tracking-wider">Total Move-In:</div>
              <div className="border-t border-white/10 pt-1 text-right font-mono font-bold text-[#FFD700]">
                KSh {(listing.priceKes * 2 + 3000).toLocaleString()}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
