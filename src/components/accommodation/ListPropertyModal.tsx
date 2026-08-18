/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Building2,
  MapPin,
  DollarSign,
  ShieldCheck,
  Upload,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  FileText,
  Lock,
  Sparkles,
  Info,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import {
  PropertyType,
  RoomType,
  GenderPreference,
  AccommodationListing,
} from '../../types/index.js';
import { useAuth } from '../../context/AuthContext.js';
import { useCurrency } from '../../context/CurrencyContext.js';
import { api } from '../../services/api.js';

interface ListPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (property: AccommodationListing) => void;
}

const COMMON_AMENITIES = [
  'High Speed Wi-Fi',
  '24/7 Security Guard',
  'Backup Water Tanks',
  'Hot Shower',
  'Study Desk & Chair',
  'CCTV Surveillance',
  'Shared Kitchen',
  'Private Kitchenette',
  'Token Electricity Meter',
  'Backup Power Inverter',
  'Laundry Facilities',
  'Balcony / Terrace',
  'Gated Compound',
  'Garbage Collection',
  'Free Parking',
  'Cleaning Service',
];

export function ListPropertyModal({ isOpen, onClose, onSuccess }: ListPropertyModalProps) {
  const { user } = useAuth();
  const { availableRates } = useCurrency();

  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyType>(PropertyType.STUDENT_RESIDENCE);
  const [roomType, setRoomType] = useState<RoomType>(RoomType.SINGLE_ROOM);
  const [country, setCountry] = useState(user?.countryCode || 'KE');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [primaryCampusName, setPrimaryCampusName] = useState(user?.campusName || '');
  const [distanceFromCampusKm, setDistanceFromCampusKm] = useState<string>('0.5');

  const [currency, setCurrency] = useState('USD');
  const [price, setPrice] = useState<string>('150');
  const [deposit, setDeposit] = useState<string>('150');
  const [totalUnits, setTotalUnits] = useState<string>('10');
  const [availableUnits, setAvailableUnits] = useState<string>('3');

  const [genderPreference, setGenderPreference] = useState<GenderPreference>(GenderPreference.MIXED);
  const [isFurnished, setIsFurnished] = useState(true);
  const [utilitiesIncluded, setUtilitiesIncluded] = useState(false);

  const [amenities, setAmenities] = useState<string[]>([
    'High Speed Wi-Fi',
    '24/7 Security Guard',
    'Backup Water Tanks',
  ]);
  const [customAmenity, setCustomAmenity] = useState('');

  const [photos, setPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1522770179533-24471fcdba45?auto=format&fit=crop&w=1200&q=80',
  ]);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');

  // Private Verification Documents State
  const [verificationDocs, setVerificationDocs] = useState<
    Array<{ documentType: string; fileName: string; fileSizeBytes: number }>
  >([
    {
      documentType: 'TITLE_DEED',
      fileName: 'Official_Ownership_Deed_Registry.pdf',
      fileSizeBytes: 1840000,
    },
  ]);
  const [newDocType, setNewDocType] = useState('UTILITY_BILL');
  const [newDocName, setNewDocName] = useState('');

  if (!isOpen) return null;

  function toggleAmenity(amenity: string) {
    if (amenities.includes(amenity)) {
      setAmenities(amenities.filter((a) => a !== amenity));
    } else {
      setAmenities([...amenities, amenity]);
    }
  }

  function handleAddCustomAmenity() {
    if (!customAmenity.trim()) return;
    if (!amenities.includes(customAmenity.trim())) {
      setAmenities([...amenities, customAmenity.trim()]);
    }
    setCustomAmenity('');
  }

  function handleAddPhoto() {
    if (!newPhotoUrl.trim()) return;
    setPhotos([...photos, newPhotoUrl.trim()]);
    setNewPhotoUrl('');
  }

  function handleAddDoc() {
    if (!newDocName.trim()) return;
    setVerificationDocs([
      ...verificationDocs,
      {
        documentType: newDocType,
        fileName: newDocName.trim(),
        fileSizeBytes: 1200000,
      },
    ]);
    setNewDocName('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    if (!title.trim() || !city.trim() || !address.trim() || !price) {
      setErrorMsg('Please complete all required fields (Title, City, Address, Price).');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.createProperty({
        title: title.trim(),
        description: description.trim() || 'Modern verified campus housing close to student transport and faculties.',
        propertyType,
        roomType,
        country,
        city: city.trim(),
        address: address.trim(),
        primaryCampusName: primaryCampusName.trim(),
        primaryInstitutionName: user?.institutionName || 'Global University',
        distanceFromCampusKm: parseFloat(distanceFromCampusKm) || 0.5,
        currency,
        price: parseFloat(price) || 100,
        deposit: deposit ? parseFloat(deposit) : undefined,
        totalUnits: parseInt(totalUnits, 10) || 1,
        availableUnits: parseInt(availableUnits, 10) || 1,
        genderPreference,
        isFurnished,
        utilitiesIncluded,
        amenities,
        photos,
        verificationDocuments: verificationDocs,
        submitForReview: true,
      });

      onSuccess(res.property);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit property listing');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div
        id="list-property-modal"
        className="relative w-full max-w-3xl bg-[#12141D] border border-white/10 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#171923]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#50E3C2]/10 text-[#50E3C2] flex items-center justify-center border border-[#50E3C2]/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">List Property / Campus Accommodation</h2>
              <p className="text-xs text-white/40">Step {step} of 4 — Create your global campus housing listing</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="grid grid-cols-4 border-b border-white/5 bg-black/20 text-xs">
          {[
            { n: 1, label: 'Basic Info' },
            { n: 2, label: 'Pricing & Units' },
            { n: 3, label: 'Amenities & Photos' },
            { n: 4, label: 'Private Verification' },
          ].map((s) => (
            <button
              key={s.n}
              type="button"
              onClick={() => setStep(s.n)}
              className={`p-3 text-center transition-colors border-b-2 font-mono flex items-center justify-center gap-1.5 ${
                step === s.n
                  ? 'border-[#50E3C2] text-[#50E3C2] bg-[#50E3C2]/5 font-bold'
                  : step > s.n
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-white/30'
              }`}
            >
              <span>{s.n}.</span>
              <span className="hidden sm:inline">{s.label}</span>
            </button>
          ))}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-5">
          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-white/60 uppercase mb-1">
                  Property Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Parkview Student Suites & Hostels"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#50E3C2]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-white/60 uppercase mb-1">Property Type</label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value as any)}
                    className="w-full p-3 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#50E3C2]"
                  >
                    {Object.values(PropertyType).map((t) => (
                      <option key={t} value={t} className="bg-[#12141D] text-white">
                        {t.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-white/60 uppercase mb-1">Room Layout</label>
                  <select
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value as any)}
                    className="w-full p-3 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#50E3C2]"
                  >
                    {Object.values(RoomType).map((r) => (
                      <option key={r} value={r} className="bg-[#12141D] text-white">
                        {r.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono text-white/60 uppercase mb-1">Country</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. KE, GB, US, ZA"
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white uppercase focus:outline-none focus:border-[#50E3C2]"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono text-white/60 uppercase mb-1">
                    City / Town <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Nairobi, Oxford, Boston"
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#50E3C2]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-white/60 uppercase mb-1">
                  Street Address & Neighborhood <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. 14 Riverside Drive, near Main Gate"
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#50E3C2]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-white/60 uppercase mb-1">Primary Campus Target</label>
                  <input
                    type="text"
                    value={primaryCampusName}
                    onChange={(e) => setPrimaryCampusName(e.target.value)}
                    placeholder="e.g. Main Campus / Science Hub"
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#50E3C2]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-white/60 uppercase mb-1">
                    Walking Distance (km)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={distanceFromCampusKm}
                    onChange={(e) => setDistanceFromCampusKm(e.target.value)}
                    placeholder="e.g. 0.4"
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#50E3C2]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Pricing & Units */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono text-white/60 uppercase mb-1">Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full p-3 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#50E3C2]"
                  >
                    {availableRates.map((r) => (
                      <option key={r.code} value={r.code} className="bg-[#12141D] text-white">
                        {r.code} ({r.symbol}) - {r.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-white/60 uppercase mb-1">
                    Monthly Rent <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 15000"
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#50E3C2]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-white/60 uppercase mb-1">Refundable Deposit</label>
                  <input
                    type="number"
                    value={deposit}
                    onChange={(e) => setDeposit(e.target.value)}
                    placeholder="e.g. 15000"
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#50E3C2]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-white/60 uppercase mb-1">Total Beds/Units</label>
                  <input
                    type="number"
                    value={totalUnits}
                    onChange={(e) => setTotalUnits(e.target.value)}
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#50E3C2]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-white/60 uppercase mb-1">Available Units Right Now</label>
                  <input
                    type="number"
                    value={availableUnits}
                    onChange={(e) => setAvailableUnits(e.target.value)}
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#50E3C2]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-white/60 uppercase mb-1">Gender Policy</label>
                <select
                  value={genderPreference}
                  onChange={(e) => setGenderPreference(e.target.value as any)}
                  className="w-full p-3 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#50E3C2]"
                >
                  <option value={GenderPreference.MIXED} className="bg-[#12141D] text-white">Mixed / Co-ed</option>
                  <option value={GenderPreference.MALE_ONLY} className="bg-[#12141D] text-white">Male Students Only</option>
                  <option value={GenderPreference.FEMALE_ONLY} className="bg-[#12141D] text-white">Female Students Only</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <label className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFurnished}
                    onChange={(e) => setIsFurnished(e.target.checked)}
                    className="w-4 h-4 rounded text-[#50E3C2] focus:ring-0"
                  />
                  <span className="text-xs text-white">Furnished (Bed, desk, wardrobe)</span>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={utilitiesIncluded}
                    onChange={(e) => setUtilitiesIncluded(e.target.checked)}
                    className="w-4 h-4 rounded text-[#50E3C2] focus:ring-0"
                  />
                  <span className="text-xs text-white">Utilities & Bills Included (Water, Wi-Fi, Trash)</span>
                </label>
              </div>
            </div>
          )}

          {/* STEP 3: Amenities & Photos */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-mono text-white/60 uppercase mb-2">
                  Select Included Amenities
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {COMMON_AMENITIES.map((amenity) => (
                    <button
                      type="button"
                      key={amenity}
                      onClick={() => toggleAmenity(amenity)}
                      className={`p-2.5 rounded-xl text-xs text-left transition-colors border flex items-center justify-between gap-1.5 ${
                        amenities.includes(amenity)
                          ? 'bg-[#50E3C2]/15 border-[#50E3C2]/40 text-[#50E3C2] font-semibold'
                          : 'bg-white/5 border-white/5 text-white/60 hover:text-white'
                      }`}
                    >
                      <span className="truncate">{amenity}</span>
                      {amenities.includes(amenity) && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="Add custom amenity..."
                    value={customAmenity}
                    onChange={(e) => setCustomAmenity(e.target.value)}
                    className="flex-1 p-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#50E3C2]"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomAmenity}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-white/60 uppercase mb-1">
                  Description & House Details
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe building security, proximity to campus gates, laundry area, quiet study hours, token meters..."
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#50E3C2]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-white/60 uppercase mb-2">Photo URLs</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="url"
                    placeholder="https://example.com/photo.jpg"
                    value={newPhotoUrl}
                    onChange={(e) => setNewPhotoUrl(e.target.value)}
                    className="flex-1 p-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#50E3C2]"
                  />
                  <button
                    type="button"
                    onClick={handleAddPhoto}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#50E3C2] text-black hover:bg-[#38cbb0]"
                  >
                    Add Photo
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {photos.map((p, idx) => (
                    <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-white/10 group">
                      <img src={p} alt={`Listing photo ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <button
                        type="button"
                        onClick={() => setPhotos(photos.filter((_, i) => i !== idx))}
                        className="absolute top-1 right-1 p-1 rounded-full bg-black/70 text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Private Verification Documents */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#50E3C2]/5 border border-[#50E3C2]/20 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#50E3C2]">
                  <Lock className="w-4 h-4" />
                  <span>Private Verification Documents Vault</span>
                </div>
                <p className="text-xs text-white/70 leading-relaxed">
                  Uploaded title deeds, utility bills, and tenancy agreements are stored in your encrypted Enermind Drive Vault.
                  They are <strong>NEVER visible to students or public search queries</strong> and are accessed exclusively by verified campus moderation staff to grant your listing the <span className="text-[#50E3C2] font-semibold">Verified Badge</span>.
                </p>
              </div>

              <div>
                <label className="block text-xs font-mono text-white/60 uppercase mb-2">
                  Add Verification Document
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
                  <select
                    value={newDocType}
                    onChange={(e) => setNewDocType(e.target.value)}
                    className="p-2.5 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#50E3C2]"
                  >
                    <option value="TITLE_DEED" className="bg-[#12141D]">Title Deed</option>
                    <option value="TENANCY_AGREEMENT" className="bg-[#12141D]">Tenancy Agreement</option>
                    <option value="UTILITY_BILL" className="bg-[#12141D]">Utility Bill</option>
                    <option value="ID_OR_BUSINESS_PERMIT" className="bg-[#12141D]">ID / Business Permit</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Document file name..."
                    value={newDocName}
                    onChange={(e) => setNewDocName(e.target.value)}
                    className="sm:col-span-2 p-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#50E3C2]"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAddDoc}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Attach Document
                </button>
              </div>

              {/* Document List */}
              <div className="space-y-2">
                {verificationDocs.map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-white/80"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#50E3C2]" />
                      <div>
                        <div className="font-semibold text-white">{doc.fileName}</div>
                        <div className="text-[10px] text-white/40 font-mono uppercase">{doc.documentType.replace('_', ' ')}</div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setVerificationDocs(verificationDocs.filter((_, i) => i !== idx))}
                      className="p-1 text-white/40 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </form>

        {/* Footer Navigation */}
        <div className="px-6 py-4 border-t border-white/5 bg-[#171923] flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-white border border-white/10 flex items-center gap-1.5 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-3">
            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#50E3C2] hover:bg-[#38cbb0] text-black transition-all flex items-center gap-1.5 shadow-sm"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                id="btn-submit-property-listing"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#50E3C2] hover:bg-[#38cbb0] text-black transition-all flex items-center gap-2 shadow-lg shadow-[#50E3C2]/10 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isSubmitting ? 'Publishing...' : 'Publish Listing for Review'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
