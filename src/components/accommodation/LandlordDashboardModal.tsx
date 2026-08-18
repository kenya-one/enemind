/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Building2,
  BedDouble,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  Plus,
  Minus,
  CheckCircle2,
  AlertCircle,
  Clock,
  Send,
  Lock,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { AccommodationListing, PropertyInquiry } from '../../types/index.js';
import { useAuth } from '../../context/AuthContext.js';
import { useCurrency } from '../../context/CurrencyContext.js';
import { api } from '../../services/api.js';

interface LandlordDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenListProperty: () => void;
}

export function LandlordDashboardModal({ isOpen, onClose, onOpenListProperty }: LandlordDashboardModalProps) {
  const { user } = useAuth();
  const { formatPrice } = useCurrency();

  const [activeTab, setActiveTab] = useState<'PROPERTIES' | 'INQUIRIES'>('PROPERTIES');
  const [properties, setProperties] = useState<AccommodationListing[]>([]);
  const [inquiries, setInquiries] = useState<PropertyInquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [replyingInquiryId, setReplyingInquiryId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadLandlordData();
    }
  }, [isOpen]);

  async function loadLandlordData() {
    try {
      setIsLoading(true);
      const [propRes, inqRes] = await Promise.all([
        api.getOwnerProperties(user?.id),
        api.getOwnerInquiries(user?.id),
      ]);
      setProperties(propRes.properties || []);
      setInquiries(inqRes.inquiries || []);
    } catch (err) {
      console.error('Failed to load landlord dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAdjustAvailability(propertyId: string, currentTotal: number, currentAvailable: number, delta: number) {
    const nextAvailable = Math.max(0, Math.min(currentTotal, currentAvailable + delta));
    try {
      await api.updatePropertyAvailability(propertyId, currentTotal, nextAvailable);
      setActionMessage('Availability updated successfully.');
      loadLandlordData();
      setTimeout(() => setActionMessage(null), 2500);
    } catch (err: any) {
      setActionMessage(`Update error: ${err.message}`);
    }
  }

  async function handleToggleStatus(propertyId: string, currentStatus: string) {
    const action = currentStatus === 'PUBLISHED' ? 'PAUSE' : 'RESUME';
    try {
      await api.updatePropertyStatus(propertyId, action);
      setActionMessage(`Listing status changed to ${action === 'PAUSE' ? 'PAUSED' : 'ACTIVE'}.`);
      loadLandlordData();
      setTimeout(() => setActionMessage(null), 2500);
    } catch (err: any) {
      setActionMessage(`Status change error: ${err.message}`);
    }
  }

  async function handleRenew(propertyId: string) {
    try {
      await api.renewPropertyListing(propertyId);
      setActionMessage('Listing renewed for another 60 days!');
      loadLandlordData();
      setTimeout(() => setActionMessage(null), 2500);
    } catch (err: any) {
      setActionMessage(`Renewal error: ${err.message}`);
    }
  }

  async function handleSendReply(inquiryId: string) {
    if (!replyText.trim()) return;
    try {
      await api.respondToPropertyInquiry(inquiryId, replyText.trim());
      setActionMessage('Reply sent to student successfully.');
      setReplyingInquiryId(null);
      setReplyText('');
      loadLandlordData();
      setTimeout(() => setActionMessage(null), 2500);
    } catch (err: any) {
      setActionMessage(`Reply error: ${err.message}`);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div
        id="landlord-dashboard-modal"
        className="relative w-full max-w-4xl bg-[#12141D] border border-white/10 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#171923]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#50E3C2]/10 text-[#50E3C2] flex items-center justify-center border border-[#50E3C2]/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Property Owner & Landlord Portal</h2>
              <p className="text-xs text-white/40">Manage your active units, update available beds, and reply to student inquiries</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenListProperty();
              }}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#50E3C2] text-black hover:bg-[#38cbb0] transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Listing</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-4 px-6 border-b border-white/5 bg-black/20 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('PROPERTIES')}
            className={`py-3 font-mono border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'PROPERTIES'
                ? 'border-[#50E3C2] text-[#50E3C2] font-bold'
                : 'border-transparent text-white/50 hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>My Listings ({properties.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('INQUIRIES')}
            className={`py-3 font-mono border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'INQUIRIES'
                ? 'border-[#50E3C2] text-[#50E3C2] font-bold'
                : 'border-transparent text-white/50 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Student Inquiries ({inquiries.length})</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {actionMessage && (
            <div className="p-3 bg-[#50E3C2]/10 border border-[#50E3C2]/30 rounded-xl text-xs text-[#50E3C2] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{actionMessage}</span>
            </div>
          )}

          {activeTab === 'PROPERTIES' && (
            <div className="space-y-4">
              {properties.length === 0 ? (
                <div className="p-12 text-center space-y-3 bg-white/[0.02] border border-white/5 rounded-2xl">
                  <Building2 className="w-10 h-10 text-white/20 mx-auto" />
                  <h3 className="text-sm font-bold text-white">No properties listed yet</h3>
                  <p className="text-xs text-white/40 max-w-sm mx-auto">
                    List your campus residence, studio, or hostel to start receiving verified student inquiries.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenListProperty();
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-[#50E3C2] text-black hover:bg-[#38cbb0] transition-colors inline-flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Your First Listing</span>
                  </button>
                </div>
              ) : (
                properties.map((prop) => (
                  <div
                    key={prop.id}
                    className="p-5 rounded-2xl bg-white/5 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono ${
                            prop.listingStatus === 'PUBLISHED'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {prop.listingStatus}
                        </span>
                        {prop.verificationBadge && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#50E3C2]/15 text-[#50E3C2] border border-[#50E3C2]/30 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" />
                            Verified
                          </span>
                        )}
                        <span className="text-xs text-white/40 font-mono">
                          Expires: {new Date(prop.expiresAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white">{prop.title}</h3>
                      <div className="text-xs text-white/60">
                        {prop.address}, {prop.city} • <span className="text-[#50E3C2] font-mono">{prop.currency} {prop.price.toLocaleString()}/mo</span>
                      </div>
                    </div>

                    {/* Quick Availability Stepper */}
                    <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-white/5 pt-3 md:pt-0 md:pl-4">
                      <div className="space-y-1">
                        <div className="text-[10px] text-white/40 uppercase font-mono">Available Beds</div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleAdjustAvailability(prop.id, prop.totalUnits, prop.availableUnits, -1)}
                            disabled={prop.availableUnits <= 0}
                            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center disabled:opacity-30"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-sm font-bold text-white font-mono w-10 text-center">
                            {prop.availableUnits} / {prop.totalUnits}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleAdjustAvailability(prop.id, prop.totalUnits, prop.availableUnits, 1)}
                            disabled={prop.availableUnits >= prop.totalUnits}
                            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center disabled:opacity-30"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(prop.id, prop.listingStatus)}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors"
                        >
                          {prop.listingStatus === 'PUBLISHED' ? 'Pause' : 'Resume'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRenew(prop.id)}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-[#50E3C2] transition-colors flex items-center gap-1"
                          title="Renew listing expiration for 60 days"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Renew</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'INQUIRIES' && (
            <div className="space-y-4">
              {inquiries.length === 0 ? (
                <div className="p-12 text-center space-y-2 bg-white/[0.02] border border-white/5 rounded-2xl">
                  <MessageSquare className="w-10 h-10 text-white/20 mx-auto" />
                  <h3 className="text-sm font-bold text-white">No inquiries yet</h3>
                  <p className="text-xs text-white/40">When campus students inquire about your properties, messages will appear here.</p>
                </div>
              ) : (
                inquiries.map((inq) => (
                  <div key={inq.id} className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{inq.studentName}</span>
                        <span className="text-xs text-white/40">({inq.studentEmail})</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            inq.status === 'RESPONDED'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {inq.status}
                        </span>
                      </div>
                      <span className="text-[10px] text-white/40 font-mono">
                        {new Date(inq.createdDate).toLocaleString()}
                      </span>
                    </div>

                    <div className="p-3 bg-black/40 border border-white/5 rounded-xl text-xs text-white/80 leading-relaxed">
                      "{inq.message}"
                    </div>

                    {inq.moveInDate && (
                      <div className="text-xs text-white/50 flex items-center gap-4">
                        <span>Expected Move-In: <strong className="text-white">{inq.moveInDate}</strong></span>
                        {inq.durationMonths && <span>Stay: <strong className="text-white">{inq.durationMonths} Months</strong></span>}
                      </div>
                    )}

                    {inq.responseMessage ? (
                      <div className="p-3 bg-[#50E3C2]/5 border border-[#50E3C2]/20 rounded-xl text-xs text-white/90 space-y-1">
                        <div className="text-[10px] font-bold text-[#50E3C2] uppercase font-mono">Your Response:</div>
                        <div>{inq.responseMessage}</div>
                      </div>
                    ) : replyingInquiryId === inq.id ? (
                      <div className="space-y-2 pt-2">
                        <textarea
                          rows={2}
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Type your response to the student..."
                          className="w-full p-2.5 bg-black/60 border border-white/10 rounded-xl text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#50E3C2]"
                        />
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleSendReply(inq.id)}
                            className="px-4 py-1.5 rounded-xl text-xs font-bold bg-[#50E3C2] text-black hover:bg-[#38cbb0]"
                          >
                            Send Reply
                          </button>
                          <button
                            type="button"
                            onClick={() => setReplyingInquiryId(null)}
                            className="px-3 py-1.5 rounded-xl text-xs bg-white/5 text-white/60 hover:text-white"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setReplyingInquiryId(inq.id);
                          setReplyText('');
                        }}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-[#50E3C2] border border-[#50E3C2]/30 flex items-center gap-1.5 transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Reply to Student</span>
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
