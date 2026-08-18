/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import {
  Users,
  MessageCircle,
  PlusCircle,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { api } from '../services/api.js';
import { CommunityCategory, CommunityGroup } from '../types/index.js';

export function CommunitiesView() {
  const { user } = useAuth();
  const [communities, setCommunities] = useState<CommunityGroup[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  const [groupName, setGroupName] = useState('');
  const [groupCategory, setGroupCategory] = useState<CommunityCategory>(CommunityCategory.COURSE);
  const [joinUrl, setJoinUrl] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadCommunities();
  }, [user?.institutionId]);

  async function loadCommunities() {
    try {
      const data = await api.getCommunities(user?.institutionId);
      setCommunities(data.communities || []);
    } catch (err) {
      console.error('Failed to load communities:', err);
    }
  }

  async function handleSubmitGroup(e: FormEvent) {
    e.preventDefault();
    if (!groupName.trim() || !joinUrl.trim()) return;

    try {
      setIsSubmitting(true);
      const res = await api.submitCommunity({
        name: groupName.trim(),
        institutionId: user?.institutionId || 'inst-uon-ke',
        institutionName: user?.institutionName || 'University of Nairobi',
        campusId: user?.campusId,
        campusName: user?.campusName,
        courseName: user?.courseName,
        yearLevel: user?.yearLevelLabel,
        category: groupCategory,
        description: description.trim(),
        joinUrl: joinUrl.trim(),
        platform: 'WHATSAPP',
        submittedByUserId: user?.id,
      });

      setCommunities((prev) => [res.community, ...prev]);
      setIsSubmitModalOpen(false);
      setGroupName('');
      setJoinUrl('');
      setDescription('');
    } catch (err) {
      console.error('Failed to submit community group:', err);
    } finally {
      setIsSubmitting(false);
    }
  }

  const filtered = communities.filter((c) => {
    const matchesCat = categoryFilter === 'ALL' || c.category === categoryFilter;
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#12141D] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#50E3C2]/10 text-[#50E3C2] flex items-center justify-center border border-[#50E3C2]/20">
              <Users className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">Student WhatsApp & Campus Communities</h2>
          </div>
          <p className="text-xs text-white/40">
            Official and peer course discussion groups, faculty networks, and campus clubs.
          </p>
        </div>

        <button
          onClick={() => setIsSubmitModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-white/90 text-black rounded-xl text-xs font-bold transition-colors shrink-0 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Submit WhatsApp Group</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-white/30 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search communities by course, club, or faculty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#50E3C2]/50"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {['ALL', 'COURSE', 'ACADEMIC', 'CAMPUS', 'ACCOMMODATION', 'JOBS', 'SOCIAL'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors ${
                categoryFilter === cat
                  ? 'bg-white text-black font-bold'
                  : 'bg-white/5 text-white/50 hover:text-white border border-white/5'
              }`}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Communities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((comm) => (
          <div
            key={comm.id}
            className="p-5 rounded-2xl bg-[#12141D] border border-white/5 hover:border-white/15 transition-all flex flex-col justify-between space-y-3 shadow-lg"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 text-white/60 border border-white/5">
                  {comm.category.replace('_', ' ')}
                </span>
                {comm.isOfficial && (
                  <span className="text-[10px] font-bold text-[#50E3C2] flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Official Class
                  </span>
                )}
              </div>

              <h3 className="text-sm font-bold text-white">{comm.name}</h3>
              <p className="text-xs text-white/50">{comm.description}</p>
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs text-white/30 font-mono">~{comm.memberCountEstimate} members</span>
              <a
                href={comm.joinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-md shadow-emerald-900/20"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Join WhatsApp</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Submit Group Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0B10]/85 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#12141D] border border-white/10 rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white">Submit WhatsApp Student Group</h3>
            <form onSubmit={handleSubmitGroup} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-1">Group Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. UoN Mechanical Engineering Class 2026"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-1">Category</label>
                <select
                  value={groupCategory}
                  onChange={(e) => setGroupCategory(e.target.value as CommunityCategory)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                >
                  <option value={CommunityCategory.COURSE} className="bg-[#12141D]">Course / Major Class Group</option>
                  <option value={CommunityCategory.ACADEMIC} className="bg-[#12141D]">Academic Society</option>
                  <option value={CommunityCategory.CAMPUS} className="bg-[#12141D]">Campus Wide Group</option>
                  <option value={CommunityCategory.ACCOMMODATION} className="bg-[#12141D]">Hostel / Housing Network</option>
                  <option value={CommunityCategory.SOCIAL} className="bg-[#12141D]">Student Club / Social</option>
                  <option value={CommunityCategory.OTHER} className="bg-[#12141D]">General Discussion</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-1">WhatsApp Invite Link</label>
                <input
                  type="url"
                  required
                  placeholder="https://chat.whatsapp.com/..."
                  value={joinUrl}
                  onChange={(e) => setJoinUrl(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-1">Group Description</label>
                <textarea
                  rows={2}
                  placeholder="Brief description for classmates..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-white resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 bg-white/5 text-white/60 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-[#50E3C2] hover:bg-[#40d0b0] text-black text-xs font-bold rounded-xl"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Group'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
