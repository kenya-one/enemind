import React, { useState } from 'react';
import {
  Home,
  ShieldCheck,
  Video,
  Radio,
  Calendar,
  DollarSign,
  Plus,
  CheckCircle,
  ExternalLink,
  MapPin,
  Users,
  Clock,
  FolderSync
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { HostelProperty } from '../types';

export const LandlordChannelPage: React.FC = () => {
  const { user } = useAuth();
  const {
    hostels,
    addHostel,
    openLiveSession,
    openCheckout,
    openDriveModal,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'properties' | 'walkthroughs' | 'kyc' | 'payments'>('properties');
  const [showAddProperty, setShowAddProperty] = useState(false);

  // Property Form states
  const [propTitle, setPropTitle] = useState('');
  const [propCampus, setPropCampus] = useState('JKUAT Main Campus (Gate C)');
  const [propRent, setPropRent] = useState(9500);
  const [propType, setPropType] = useState<'Bedsitter' | '1-Bedroom' | 'Hostel' | 'Studio'>('Bedsitter');
  const [propAddress, setPropAddress] = useState('Juja, Kiambu');

  const landlordProperties = hostels.filter(
    (h) => h.landlordId === user?.id || h.landlordName.toLowerCase().includes('juja')
  );

  const handleCreateProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!propTitle.trim()) return;

    addHostel({
      landlordId: user?.id || 'user_landlord_1',
      landlordName: user?.name || 'Juja Student Havens',
      landlordTier: 'premium',
      isVerified: user?.kycStatus === 'verified',
      title: propTitle,
      campusAffiliation: propCampus,
      propertyType: propType,
      address: propAddress,
      location: 'Juja, Kiambu County',
      coordinates: { lat: -1.0998, lng: 37.0144 },
      distanceToCampusKm: 0.5,
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80'
      ],
      youtubeVideoTourId: 'SampleJujaVirtualTour',
      rentKes: Number(propRent),
      rentPeriod: 'per month',
      amenities: ['Wi-Fi Included', 'Borehole Water', 'CCTV Security', 'Biometric Gate Access'],
      vacantUnits: 3,
      totalUnits: 24
    });

    setPropTitle('');
    setShowAddProperty(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Landlord Header */}
      <div className="p-6 rounded-3xl bg-teal-950 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-600 flex items-center justify-center font-bold text-2xl shadow-lg shadow-teal-600/30 shrink-0">
            <Home className="w-8 h-8 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold font-display">
                {user?.name || 'Juja Student Havens & Heights'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 text-[10px] font-bold">
                {user?.kycStatus === 'verified' ? '✓ Verified Landlord' : 'KYC Pending'}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Campus Hostels & Rentals • Multi-Property Management & YouTube Live Walkthroughs
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() =>
              openLiveSession({
                title: 'Live Juja Havens Bedsitters Walkthrough (JKUAT Gate C)',
                hostName: user?.name || 'Juja Student Havens',
                youtubeUrl: 'https://www.youtube.com/watch?v=live_juja_hostel_tour',
                propertyId: 'hostel_juja_havens'
              })
            }
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-600/30 transition cursor-pointer"
          >
            <Radio className="w-4 h-4 animate-pulse" />
            <span>Go Live for Walkthrough</span>
          </button>

          <button
            onClick={openDriveModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
          >
            <FolderSync className="w-4 h-4 text-teal-400" />
            <span>Drive Sheets</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-slate-200 pb-2">
        {[
          { id: 'properties', label: 'My Hostels & Units', icon: <Home className="w-4 h-4" /> },
          { id: 'walkthroughs', label: '1:1 & Group Walkthrough Sessions', icon: <Video className="w-4 h-4" /> },
          { id: 'payments', label: 'Rent & Holding Deposit Ledger', icon: <DollarSign className="w-4 h-4" /> },
          { id: 'kyc', label: 'KYC Document Verification', icon: <ShieldCheck className="w-4 h-4" /> }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Properties */}
      {activeTab === 'properties' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Registered Hostel Properties</h2>
              <p className="text-xs text-slate-500">
                Native photo carousels from Google Drive + YouTube video tour links.
              </p>
            </div>

            <button
              onClick={() => setShowAddProperty(!showAddProperty)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Property</span>
            </button>
          </div>

          {showAddProperty && (
            <form onSubmit={handleCreateProperty} className="p-5 bg-teal-50 rounded-3xl border border-teal-200 space-y-3">
              <h3 className="text-xs font-bold text-teal-900">Add Property Listing</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Property Title (e.g. Juja Havens Bedsitters)"
                  value={propTitle}
                  onChange={(e) => setPropTitle(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-teal-300 text-xs bg-white outline-none"
                />
                <input
                  type="text"
                  required
                  placeholder="Campus Affiliation (e.g. JKUAT Gate C)"
                  value={propCampus}
                  onChange={(e) => setPropCampus(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-teal-300 text-xs bg-white outline-none"
                />
                <input
                  type="number"
                  required
                  placeholder="Monthly Rent (KES)"
                  value={propRent}
                  onChange={(e) => setPropRent(Number(e.target.value))}
                  className="px-3 py-2 rounded-xl border border-teal-300 text-xs bg-white outline-none"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold shadow-xs"
              >
                Save Property & Sync to Properties Sheet
              </button>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {landlordProperties.map((h) => (
              <div
                key={h.id}
                className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-16/9 rounded-2xl overflow-hidden mb-4">
                    <img
                      src={h.images[0]}
                      alt={h.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[10px] font-bold text-slate-800">
                      {h.propertyType}
                    </div>
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-teal-600 text-white text-[10px] font-bold">
                      {h.vacantUnits} Units Vacant
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">{h.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{h.campusAffiliation}</span>
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {h.amenities.map((a) => (
                      <span
                        key={a}
                        className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] rounded-md font-medium"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-400">Monthly Rent</p>
                    <p className="text-base font-extrabold text-teal-700">
                      KES {h.rentKes.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href="https://youtube.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
                    >
                      <Video className="w-3.5 h-3.5 text-red-600" />
                      <span>Watch Tour</span>
                    </a>

                    <button
                      onClick={() =>
                        openCheckout({
                          orderId: `DEP-${Date.now()}`,
                          itemTitle: `Deposit: ${h.title}`,
                          amountKes: Math.round(h.rentKes * 0.5),
                          customerName: user ? user.name : 'Student Tenant',
                          customerEmail: user ? user.email : 'student@enemind.co.ke',
                          customerPhone: user?.phone || '+254700000000',
                          sellerId: h.landlordId,
                          sellerName: h.landlordName,
                          sellerType: 'landlord'
                        })
                      }
                      className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                    >
                      Deposit Escrow
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Walkthrough Sessions */}
      {activeTab === 'walkthroughs' && (
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Virtual Walkthrough Live Sessions</h3>
              <p className="text-xs text-slate-500">
                1:1 Private appointments and Group live tours scheduled via your connected YouTube Live channel.
              </p>
            </div>
            <button
              onClick={() => showToast('Walkthrough slot added to Sessions sheet!')}
              className="px-3.5 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 transition"
            >
              + Schedule Walkthrough
            </button>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold">
                    Group Live Tour
                  </span>
                  <span className="text-xs font-bold text-slate-800">Juja Havens Bedsitter Tour</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Scheduled: <b>Today at 4:30 PM EAT</b> • 18 students booked out of 25 capacity
                </p>
              </div>

              <button
                onClick={() =>
                  openLiveSession({
                    title: 'Live Juja Havens Bedsitters Walkthrough (JKUAT Gate C)',
                    hostName: user?.name || 'Juja Student Havens',
                    youtubeUrl: 'https://www.youtube.com/watch?v=live_juja_hostel_tour',
                    propertyId: 'hostel_juja_havens'
                  })
                }
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition flex items-center gap-1.5 self-start"
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Start Stream</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Payments */}
      {activeTab === 'payments' && (
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Double-Confirmation Rent & Holding Deposits</h3>
          <p className="text-xs text-slate-500">
            Funds are paid via Pesapal and double-confirmed by tenant and landlord in your "Payments" sheet.
          </p>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-slate-900">Holding Deposit: Faith Muthoni (JKUAT)</p>
              <p className="text-slate-500">Juja Havens Bedsitter Unit 3B • Ref: PP-443</p>
            </div>
            <span className="font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
              Confirmed (KES 4,750)
            </span>
          </div>
        </div>
      )}

      {/* Tab 4: KYC */}
      {activeTab === 'kyc' && (
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-teal-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Landlord Verification & Ownership KYC</h3>
              <p className="text-xs text-slate-500">
                Ministry of Housing registration or University Hostel Approval certificate.
              </p>
            </div>
          </div>

          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
            <span>Status: <b>Verified & Approved for In-App Booking</b></span>
            <span className="font-mono text-[10px] text-emerald-700">DOC-ID: KE-MOE-2025-JUJA</span>
          </div>
        </div>
      )}

    </div>
  );
};
