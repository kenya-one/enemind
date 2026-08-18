/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Users,
  ShieldCheck,
  Search,
  ExternalLink,
  Plus,
  Mail,
  Heart,
  Globe,
} from 'lucide-react';
import { Club } from '../../types/index.js';
import { api } from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.js';

interface ClubsListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectClubFilter: (clubName: string) => void;
}

export function ClubsListModal({ isOpen, onClose, onSelectClubFilter }: ClubsListModalProps) {
  const { user } = useAuth();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [search, setSearch] = useState('');
  const [followedClubIds, setFollowedClubIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadClubs();
    }
  }, [isOpen, user?.institutionId]);

  async function loadClubs() {
    try {
      setIsLoading(true);
      const res = await api.getCampusClubs({
        institutionId: user?.institutionId || 'inst-uon-ke',
      });
      setClubs(res.clubs || []);
    } catch (err) {
      console.error('Failed to load clubs:', err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleToggleFollow(clubId: string) {
    try {
      const res = await api.toggleFollowCampusClub(clubId);
      const nextFollowed = new Set(followedClubIds);
      if (res.isFollowed) {
        nextFollowed.add(clubId);
      } else {
        nextFollowed.delete(clubId);
      }
      setFollowedClubIds(nextFollowed);

      setClubs(
        clubs.map((c) =>
          c.id === clubId ? { ...c, followersCount: res.followersCount } : c
        )
      );
    } catch (err) {
      console.error('Failed to toggle follow club:', err);
    }
  }

  if (!isOpen) return null;

  const filteredClubs = clubs.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div
        id="campus-clubs-modal"
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-950 text-teal-400 border border-teal-900">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Student Clubs & Societies</h2>
              <p className="text-xs text-slate-400">
                Discover registered student organizations, chapters, and societies.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 border border-slate-700 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/20">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search club name, category or tech society..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        {/* Clubs Grid */}
        <div className="p-6 space-y-3.5 max-h-[65vh] overflow-y-auto no-scrollbar">
          {filteredClubs.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">
              No registered campus clubs found matching your search.
            </p>
          ) : (
            filteredClubs.map((club) => {
              const isFollowed = followedClubIds.has(club.id);
              return (
                <div
                  key={club.id}
                  className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800">
                        {club.category}
                      </span>
                      {club.isOfficial && (
                        <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> Verified Chapter
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-white">{club.name}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{club.description}</p>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1">
                      <span>Lead: <strong className="text-white">{club.leadName}</strong></span>
                      <span>•</span>
                      <span>Members: <strong className="text-teal-400">{club.followersCount || 0}</strong></span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                    <button
                      onClick={() => handleToggleFollow(club.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                        isFollowed
                          ? 'bg-teal-600/20 text-teal-400 border border-teal-600/40'
                          : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFollowed ? 'fill-teal-400' : ''}`} />
                      <span>{isFollowed ? 'Following' : 'Follow Club'}</span>
                    </button>

                    <button
                      onClick={() => {
                        onSelectClubFilter(club.name);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs border border-slate-800 transition-colors"
                    >
                      View Events
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
