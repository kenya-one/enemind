import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  X,
  FileText,
  CheckCircle,
  ExternalLink,
  Award,
  Lock,
  Building,
  Scale,
  Download,
  Copy,
  Check
} from 'lucide-react';
import { RentalListing, CertifiedDoc } from '../types';

interface CertifiedDocsModalProps {
  listing: RentalListing;
  isOpen: boolean;
  onClose: () => void;
}

export const CertifiedDocsModal: React.FC<CertifiedDocsModalProps> = ({ listing, isOpen, onClose }) => {
  const [selectedDoc, setSelectedDoc] = useState<CertifiedDoc>(listing.certifiedDocuments[0] || null);
  const [copiedRef, setCopiedRef] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRef(text);
    setTimeout(() => setCopiedRef(null), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-[#111111] border border-white/15 rounded-2xl shadow-2xl overflow-hidden text-neutral-100 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-[#0a0a0a]">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#FFD700]/10 border border-[#FFD700]/30 text-[#FFD700]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-light text-xl text-white">Kenya Certified Documents</h3>
                  <span className="px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded bg-green-600 text-white">
                    100% Verified
                  </span>
                </div>
                <p className="text-xs text-neutral-400">Official Title Deed & County Planning Verification for {listing.estate}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              id="close-certified-docs-btn"
              className="p-2 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Anti-Scam Banner */}
          <div className="bg-[#181818] border-b border-white/10 px-4 py-2.5 flex items-center gap-2 text-xs text-neutral-300">
            <Lock className="w-4 h-4 text-[#FFD700] shrink-0" />
            <span>
              <strong className="text-white">Kenya House Hunt Escrow Protection:</strong> Title, structural permits & landlord IDs have undergone government registry checks (Ardhi House & County Registry).
            </span>
          </div>

          <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 bg-[#111111]">
            {/* Document Selector Pills */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {listing.certifiedDocuments.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 border ${
                    selectedDoc?.id === doc.id
                      ? 'bg-[#FFD700]/15 border-[#FFD700] text-[#FFD700] shadow-sm'
                      : 'bg-[#181818] border-white/10 text-neutral-300 hover:bg-white/5'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{doc.name}</span>
                  <CheckCircle className="w-3 h-3 text-[#FFD700]" />
                </button>
              ))}
            </div>

            {/* Selected Document Details Card */}
            {selectedDoc && (
              <div className="bg-[#181818] border border-white/10 rounded-xl p-4 sm:p-5 space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/10 pb-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#FFD700] font-bold">
                      {selectedDoc.type.replace('_', ' ')}
                    </span>
                    <h4 className="text-lg font-serif font-light text-white mt-0.5">{selectedDoc.name}</h4>
                    <p className="text-xs text-neutral-400 flex items-center gap-1.5 mt-1">
                      <Building className="w-3.5 h-3.5 text-neutral-500" />
                      Issuer: <span className="text-neutral-200">{selectedDoc.issuer}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-green-600/20 text-green-400 border border-green-500/30">
                      <Award className="w-3.5 h-3.5" />
                      {selectedDoc.verificationBadge}
                    </span>
                    <p className="text-[11px] text-neutral-500 mt-1">Issued: {selectedDoc.issuedDate}</p>
                  </div>
                </div>

                {/* Reference Number with Copy */}
                <div className="bg-black rounded-lg p-3 border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400">Official Registry File Reference</div>
                    <div className="font-mono text-sm font-semibold text-[#FFD700] mt-0.5">{selectedDoc.referenceNumber}</div>
                  </div>
                  <button
                    onClick={() => handleCopy(selectedDoc.referenceNumber)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-xs text-neutral-200 uppercase tracking-wider font-bold transition-colors border border-white/10"
                  >
                    {copiedRef === selectedDoc.referenceNumber ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#FFD700]" />
                        <span className="text-[#FFD700]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Ref</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Summary */}
                <div className="text-xs sm:text-sm text-neutral-300 bg-black/60 rounded-lg p-3 border border-white/10 leading-relaxed">
                  <p className="font-semibold text-white mb-1 uppercase tracking-wider text-[11px]">Verification Audit Statement:</p>
                  <p>{selectedDoc.summary}</p>
                </div>

                {/* Stamp preview */}
                <div className="relative rounded-lg border border-[#FFD700]/40 bg-black p-4 text-center">
                  <div className="inline-flex flex-col items-center justify-center p-3 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/40 mb-2">
                    <Scale className="w-8 h-8 text-[#FFD700]" />
                  </div>
                  <div className="text-sm font-serif font-light text-white tracking-wider">REPUBLIC OF KENYA - VERIFIED DIGITAL ENTRY</div>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Authorized and checked against the National Housing & Ardhi Registry Database
                  </p>
                  <div className="mt-3 flex items-center justify-center gap-4 text-xs text-[#FFD700] font-mono">
                    <span>SECURITY HASH: #KE-AUTH-{selectedDoc.id.toUpperCase()}-2024</span>
                  </div>
                </div>
              </div>
            )}

            {/* Landlord Trust Badge */}
            <div className="bg-[#181818] border border-white/10 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={listing.landlord.avatarUrl}
                  alt={listing.landlord.name}
                  className="w-11 h-11 rounded-full object-cover border border-[#FFD700]"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-white text-sm">{listing.landlord.name}</span>
                    <CheckCircle className="w-4 h-4 text-[#FFD700]" />
                  </div>
                  <p className="text-xs text-neutral-400">
                    KRA Tax Compliance & Estate Agents Registration Board (EARB) Active
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-[#FFD700]">★ {listing.landlord.rating} Rating</span>
                <p className="text-[11px] text-neutral-500">{listing.landlord.totalListings} Active Listings</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/10 bg-[#0a0a0a] flex items-center justify-between gap-3">
            <span className="text-xs text-neutral-400">
              Listing ID: <span className="font-mono text-neutral-200">{listing.id}</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(window.location.href)}
                className="px-3.5 py-2 rounded bg-white/10 hover:bg-white/20 text-xs text-neutral-200 uppercase tracking-wider font-bold transition-colors flex items-center gap-1.5 border border-white/10"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Share Cert</span>
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 rounded bg-white text-black hover:bg-[#FFD700] text-xs font-bold uppercase tracking-widest transition-colors shadow-lg"
              >
                Done
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
