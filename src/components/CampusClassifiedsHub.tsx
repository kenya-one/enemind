import React, { useState } from 'react';
import {
  Package,
  Plus,
  Search,
  MapPin,
  Phone,
  MessageCircle,
  Tag,
  Clock,
  Sparkles,
  X,
  Filter,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { StudentClassifiedItem } from '../types';

export const CampusClassifiedsHub: React.FC = () => {
  const { studentClassifieds, addStudentClassified, updateClassifiedStatus, showToast } = useApp();
  const { user } = useAuth();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedUniversity, setSelectedUniversity] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showPostModal, setShowPostModal] = useState<boolean>(false);
  const [selectedItemDetails, setSelectedItemDetails] = useState<StudentClassifiedItem | null>(null);

  // Post new item form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<StudentClassifiedItem['category']>('Furniture & Beds');
  const [condition, setCondition] = useState<StudentClassifiedItem['condition']>('Gently Used');
  const [priceKes, setPriceKes] = useState(3500);
  const [isNegotiable, setIsNegotiable] = useState(true);
  const [campusGate, setCampusGate] = useState('JKUAT Gate C');
  const [sellerUni, setSellerUni] = useState(user?.schoolName || 'JKUAT Main Campus');
  const [sellerPhone, setSellerPhone] = useState(user?.phone || '+254 712 345 678');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1540518614846-7ede433c4550?w=800&auto=format&fit=crop&q=80');

  const categories = [
    'All',
    'Furniture & Beds',
    'Cooking & Gas',
    'Laptops & Tech',
    'Textbooks & Calculators',
    'Hostel Appliances',
    'Stationery & Study Gear'
  ];

  const universities = [
    'All',
    'JKUAT Main Campus',
    'Kenyatta University (KU Main)',
    'University of Nairobi (UoN)',
    'Strathmore University / Daystar',
    'USIU / MKU'
  ];

  const filteredItems = studentClassifieds.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesUni = selectedUniversity === 'All' || item.sellerUniversity.toLowerCase().includes(selectedUniversity.toLowerCase());
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.campusGate.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesUni && matchesSearch;
  });

  const handlePostItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addStudentClassified({
      sellerId: user?.id || 'student_guest',
      sellerName: user?.name || 'Graduating Student',
      sellerPhone: sellerPhone.trim(),
      sellerUniversity: sellerUni.trim(),
      campusGate: campusGate.trim(),
      title: title.trim(),
      category,
      condition,
      priceKes: Number(priceKes),
      isNegotiable,
      images: [
        imageUrl || 'https://images.unsplash.com/photo-1540518614846-7ede433c4550?w=800&auto=format&fit=crop&q=80'
      ],
      description: description.trim() || 'Student gear in great working condition. Available for direct campus pickup.'
    });

    setTitle('');
    setDescription('');
    setShowPostModal(false);
    showToast('Your item has been posted to Campus Peer-to-Peer Classifieds!');
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold uppercase tracking-wider">
              Zero-Commission Peer-to-Peer
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 text-[10px] font-bold">
              Direct Student-to-Student
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display">
            Campus Gear & Hostel Classifieds
          </h2>
          <p className="text-xs text-slate-300">
            Graduating or moving hostels? Sell your bed, gas cylinder, mini-fridge, or textbooks directly to incoming students at your campus gate.
          </p>
        </div>

        <button
          onClick={() => setShowPostModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-600/30 self-start md:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Sell Your Campus Gear</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search beds, gas cylinders, scientific calculators, desks, electronics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div className="w-full md:w-64">
            <select
              value={selectedUniversity}
              onChange={(e) => setSelectedUniversity(e.target.value)}
              className="w-full px-3 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 outline-none focus:bg-white"
            >
              {universities.map((u) => (
                <option key={u} value={u}>
                  {u === 'All' ? 'All Kenyan Universities' : u}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Classifieds Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="p-4 bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden mb-3 bg-slate-100">
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-xs text-[10px] font-bold text-slate-800">
                  {item.category}
                </div>
                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                  {item.condition}
                </div>
              </div>

              <div className="flex items-center justify-between gap-1 mb-1">
                <p className="text-base font-extrabold text-emerald-800">
                  KES {item.priceKes.toLocaleString()}
                  {item.isNegotiable && (
                    <span className="text-[10px] text-slate-400 font-normal ml-1">Negotiable</span>
                  )}
                </p>
                <span className="text-[10px] text-slate-400">
                  {item.postedDate}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                {item.title}
              </h3>

              <div className="mt-2 space-y-1 text-xs text-slate-500">
                <p className="flex items-center gap-1 font-medium text-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">{item.sellerUniversity} • {item.campusGate}</span>
                </p>
                <p className="text-[11px] text-slate-500">
                  Seller: <b>{item.sellerName}</b>
                </p>
              </div>

              <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Direct Connect Buttons */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
              <a
                href={`tel:${item.sellerPhone.replace(/\s+/g, '')}`}
                className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Seller</span>
              </a>

              <a
                href={`https://wa.me/${item.sellerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${item.sellerName}, I am interested in your ${item.title} listed on Enemind Campus Gear (${item.campusGate}) for KES ${item.priceKes.toLocaleString()}. Is it still available?`)}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>

          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 text-xs">
          No items found in this category or campus. Be the first student to list your gear!
        </div>
      )}

      {/* Post Classified Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
            <div className="p-5 bg-emerald-950 text-white flex items-center justify-between">
              <h3 className="text-base font-bold font-display">Sell Your Campus Gear (Zero Fee)</h3>
              <button
                onClick={() => setShowPostModal(false)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePostItem} className="p-6 space-y-3 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Item Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 4x6 Wooden Bed + Foam Mattress, 6kg ProGas Cylinder"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none"
                  >
                    {categories.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Item Condition</label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none"
                  >
                    <option value="Like New">Like New</option>
                    <option value="Gently Used">Gently Used</option>
                    <option value="Good Condition">Good Condition</option>
                    <option value="Well Used">Well Used</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Asking Price (KES)</label>
                  <input
                    type="number"
                    required
                    min={100}
                    value={priceKes}
                    onChange={(e) => setPriceKes(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none"
                  />
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isNegotiable}
                      onChange={(e) => setIsNegotiable(e.target.checked)}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Price is Negotiable</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">University / College</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. JKUAT Main Campus, KU"
                    value={sellerUni}
                    onChange={(e) => setSellerUni(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Campus Gate / Pickup Area</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Gate C, KM Gate, Chiromo"
                    value={campusGate}
                    onChange={(e) => setCampusGate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Seller Phone (Call & WhatsApp)</label>
                <input
                  type="text"
                  required
                  placeholder="+254 7XX XXX XXX"
                  value={sellerPhone}
                  onChange={(e) => setSellerPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Photo Image URL</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Short Description</label>
                <textarea
                  rows={3}
                  placeholder="Reason for selling (graduation/moving), dimensions, accessories included..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Post Free Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
