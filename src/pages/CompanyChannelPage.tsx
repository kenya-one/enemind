import React, { useState } from 'react';
import {
  Building2,
  Radio,
  ShoppingBag,
  Briefcase,
  FileText,
  TrendingUp,
  Plus,
  Video,
  CheckCircle,
  ExternalLink,
  Shield,
  Truck,
  FolderSync
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

export const CompanyChannelPage: React.FC = () => {
  const { user } = useAuth();
  const {
    products,
    jobs,
    orders,
    addProduct,
    addJob,
    openLiveSession,
    openDriveModal,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'catalogue' | 'adverts' | 'jobs' | 'notices' | 'sales'>('catalogue');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddJob, setShowAddJob] = useState(false);

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState(15000);
  const [newCategory, setNewCategory] = useState<'Solar & Energy' | 'Building Materials' | 'Electronics' | 'Farm Produce'>('Solar & Energy');
  const [newDesc, setNewDesc] = useState('');

  const [jobTitle, setJobTitle] = useState('');
  const [jobSalary, setJobSalary] = useState('KES 45,000 / month');
  const [jobDesc, setJobDesc] = useState('');

  const companyProducts = products.filter(
    (p) => p.sellerId === user?.id || p.sellerName.toLowerCase().includes('sunking')
  );

  const companyJobs = jobs.filter(
    (j) => j.posterId === user?.id || j.posterName.toLowerCase().includes('sunking')
  );

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addProduct({
      sellerId: user?.id || 'user_company_1',
      sellerName: user?.name || 'SunKing Solar Kenya',
      sellerType: user?.accountType === 'dealer' ? 'dealer' : 'company',
      sellerTier: user?.planTier || 'premium',
      title: newTitle,
      category: newCategory,
      description: newDesc || 'High performance solar equipment with warranty.',
      priceKes: Number(newPrice),
      images: [
        'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop&q=80'
      ],
      location: user?.location || 'Industrial Area, Nairobi',
      coordinates: user?.coordinates || { lat: -1.3098, lng: 36.8523 },
      inStock: true,
      deliveryAvailable: true
    });

    setNewTitle('');
    setNewDesc('');
    setShowAddProduct(false);
  };

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle.trim()) return;

    addJob({
      posterId: user?.id || 'user_company_1',
      posterName: user?.name || 'SunKing Solar Kenya',
      posterType: 'Company',
      title: jobTitle,
      companyName: user?.name || 'SunKing Solar Kenya',
      category: 'Full-time',
      location: user?.location || 'Nairobi Hub',
      salaryRangeKes: jobSalary,
      deadline: '2026-09-30',
      description: jobDesc || 'Key technical and field engineering responsibility.',
      requirements: ['Diploma or Degree in relevant field', 'EPRA licensed or hands-on experience'],
      contactEmail: user?.email || 'careers@sunkingsolar.co.ke'
    });

    setJobTitle('');
    setJobDesc('');
    setShowAddJob(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* YouTube Channel Style Banner & Profile Header */}
      <div className="rounded-3xl bg-slate-900 text-white overflow-hidden shadow-xl border border-slate-800">
        
        {/* Banner */}
        <div
          className="h-44 sm:h-52 w-full bg-cover bg-center relative"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1509391365360-2e959784a276?w=1200&auto=format&fit=crop&q=80)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
          
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500 text-slate-950 font-bold text-xs">
              Premium Storefront
            </span>
          </div>
        </div>

        {/* Channel Details */}
        <div className="p-6 pt-0 relative flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12">
          
          <div className="flex items-end gap-4">
            <img
              src={
                user?.avatarUrl ||
                'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=150&auto=format&fit=crop&q=80'
              }
              alt={user?.name || 'Company Profile'}
              className="w-24 h-24 rounded-3xl object-cover border-4 border-slate-900 shadow-xl bg-slate-800"
            />

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold font-display">
                  {user?.name || 'SunKing Solar Kenya'}
                </h1>
                <CheckCircle className="w-4 h-4 text-blue-400 fill-blue-400 text-slate-900" />
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {user?.location || 'Industrial Area, Enterprise Road, Nairobi'} • 12.4k Subscribers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() =>
                openLiveSession({
                  title: 'Live Product Showcase & Q&A Stream',
                  hostName: user?.name || 'SunKing Solar Kenya',
                  youtubeUrl: 'https://www.youtube.com/watch?v=live_solar_demo_kenya',
                  productId: 'prod_solar_home_pro'
                })
              }
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-600/30 transition cursor-pointer"
            >
              <Radio className="w-4 h-4 animate-pulse" />
              <span>Go Live on YouTube</span>
            </button>

            <button
              onClick={openDriveModal}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
            >
              <FolderSync className="w-4 h-4 text-blue-400" />
              <span>Drive Sheets</span>
            </button>
          </div>

        </div>

      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-slate-200 pb-2">
        {[
          { id: 'catalogue', label: 'Product Catalogue', icon: <ShoppingBag className="w-4 h-4" /> },
          { id: 'adverts', label: 'Video Adverts & Shorts', icon: <Video className="w-4 h-4" /> },
          { id: 'jobs', label: 'Jobs & Attachments', icon: <Briefcase className="w-4 h-4" /> },
          { id: 'sales', label: 'Sales & Orders Ledger', icon: <TrendingUp className="w-4 h-4" /> },
          { id: 'notices', label: 'Notices & Policies', icon: <FileText className="w-4 h-4" /> }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Catalogue */}
      {activeTab === 'catalogue' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Your Product Catalogue</h2>
              <p className="text-xs text-slate-500">Auto-synced with your "Catalogue" Google Sheet</p>
            </div>

            <button
              onClick={() => setShowAddProduct(!showAddProduct)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>
          </div>

          {showAddProduct && (
            <form onSubmit={handleCreateProduct} className="p-5 bg-blue-50 rounded-3xl border border-blue-200 space-y-3">
              <h3 className="text-xs font-bold text-blue-900">New Product Listing Setup</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Product Title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-blue-300 text-xs bg-white outline-none"
                />
                <input
                  type="number"
                  required
                  placeholder="Price (KES)"
                  value={newPrice}
                  onChange={(e) => setNewPrice(Number(e.target.value))}
                  className="px-3 py-2 rounded-xl border border-blue-300 text-xs bg-white outline-none"
                />
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="px-3 py-2 rounded-xl border border-blue-300 text-xs bg-white outline-none"
                >
                  <option value="Solar & Energy">Solar & Energy</option>
                  <option value="Building Materials">Building Materials</option>
                  <option value="Farm Produce">Farm Produce</option>
                  <option value="Electronics">Electronics</option>
                </select>
              </div>
              <textarea
                placeholder="Product description..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 rounded-xl border border-blue-300 text-xs bg-white outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-xs"
              >
                Save & Auto-Write to Google Sheet
              </button>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {companyProducts.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs p-5 flex flex-col justify-between"
              >
                <div>
                  <img
                    src={p.images[0]}
                    alt={p.title}
                    className="w-full h-36 rounded-2xl object-cover border border-slate-100"
                  />
                  <h3 className="text-sm font-bold text-slate-900 mt-3 line-clamp-1">{p.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{p.description}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-base font-extrabold text-blue-600">
                    KES {p.priceKes.toLocaleString()}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    In Stock
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Jobs & Attachments */}
      {activeTab === 'jobs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Centralized Jobs & Attachments</h2>
              <p className="text-xs text-slate-500">
                Jobs sync hourly from your Drive Sheet into the platform-wide Supabase discoverability index.
              </p>
            </div>

            <button
              onClick={() => setShowAddJob(!showAddJob)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>Post New Job</span>
            </button>
          </div>

          {showAddJob && (
            <form onSubmit={handleCreateJob} className="p-5 bg-slate-50 rounded-3xl border border-slate-200 space-y-3">
              <h3 className="text-xs font-bold text-slate-900">Post Job to Centralized Supabase Table</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Job Title (e.g. Solar Field Technician)"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white outline-none"
                />
                <input
                  type="text"
                  placeholder="Salary Range (e.g. KES 45,000 - 65,000 / month)"
                  value={jobSalary}
                  onChange={(e) => setJobSalary(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white outline-none"
                />
              </div>
              <textarea
                placeholder="Job description and requirements..."
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-xs"
              >
                Publish Job to Platform
              </button>
            </form>
          )}

          <div className="space-y-3">
            {companyJobs.map((j) => (
              <div
                key={j.id}
                className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">
                      {j.category}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">{j.location}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-1">{j.title}</h3>
                  <p className="text-xs text-emerald-700 font-bold mt-0.5">{j.salaryRangeKes}</p>
                </div>
                <span className="text-xs text-slate-400">Deadline: {j.deadline}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Sales Ledger */}
      {activeTab === 'sales' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs space-y-2 p-5">
          <h3 className="text-sm font-bold text-slate-900">In-App Sales & Pesapal Transactions</h3>
          <p className="text-xs text-slate-500">
            Automatically logged to your "Sales" Sheet in Google Drive.
          </p>

          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                  <th className="py-2.5 px-3 font-semibold">Order ID</th>
                  <th className="py-2.5 px-3 font-semibold">Customer</th>
                  <th className="py-2.5 px-3 font-semibold">Item</th>
                  <th className="py-2.5 px-3 font-semibold">Amount (KES)</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                  <th className="py-2.5 px-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-700">{o.id}</td>
                    <td className="py-2.5 px-3">{o.buyerName}</td>
                    <td className="py-2.5 px-3 max-w-xs truncate">{o.itemTitle}</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-600">
                      KES {o.totalPriceKes.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        {o.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">{o.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Adverts */}
      {activeTab === 'adverts' && (
        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Video Adverts for Main Feed</h3>
          <p className="text-xs text-slate-500">
            Attach YouTube video links to surface promotional shorts on the main vertical swipe feed.
          </p>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-900">SunKing Home 500X Inverter Test Promo</h4>
              <p className="text-[11px] text-slate-500">YouTube ID: SunkingSolarDemo2025</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              Active on Feed
            </span>
          </div>
        </div>
      )}

      {/* Tab 5: Notices / Policies */}
      {activeTab === 'notices' && (
        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Warranty & Customer Policies</h3>
          <p className="text-xs text-slate-500">
            Static documentation visible on your company channel profile.
          </p>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <h4 className="text-xs font-bold text-slate-900">2-Year Replacement & Free Inverter Servicing</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              All solar kits purchased through Enemind enjoy 24-month replacement coverage and free battery diagnostic checks at our Industrial Area workshop.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
