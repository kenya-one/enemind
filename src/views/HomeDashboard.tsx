/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import {
  Sparkles,
  BookOpen,
  Building,
  Briefcase,
  Table,
  Users,
  Calendar,
  ChevronRight,
  ShieldCheck,
  GraduationCap,
  MapPin,
  ExternalLink,
  ShoppingBag,
  ArrowUpRight,
  HardDrive,
  FileText,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { useCurrency } from '../context/CurrencyContext.js';
import { api } from '../services/api.js';
import { AccommodationListing, CampusEvent, OpportunityListing, SheetProduct } from '../types/index.js';

interface HomeDashboardProps {
  onNavigate: (view: string) => void;
  onOpenAI: () => void;
}

export function HomeDashboard({ onNavigate, onOpenAI }: HomeDashboardProps) {
  const { user, openOnboarding } = useAuth();
  const { formatPrice, activeRate } = useCurrency();

  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [opportunities, setOpportunities] = useState<OpportunityListing[]>([]);
  const [accommodation, setAccommodation] = useState<AccommodationListing[]>([]);
  const [sheetProducts, setSheetProducts] = useState<SheetProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user?.institutionId]);

  async function loadDashboardData() {
    try {
      setIsLoading(true);
      const [evtData, oppData, accData, shtData] = await Promise.all([
        api.getEvents(user?.institutionId),
        api.getOpportunities(),
        api.getAccommodation(user?.institutionId),
        api.getSheetProducts(),
      ]);

      setEvents(evtData.events || []);
      setOpportunities(oppData.listings || []);
      setAccommodation(accData.listings || []);
      setSheetProducts(shtData.products || []);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6 pb-12">
      
      {/* Editorial Welcome Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 pb-2 border-b border-white/5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
            Welcome to <span className="font-bold italic text-[#50E3C2]">Enermind</span>
          </h1>
          <p className="text-xs sm:text-sm text-white/40 mt-1">
            Your global campus operating system is active.
          </p>
        </div>

        <div className="sm:text-right">
          <div className="text-[10px] text-white/30 uppercase tracking-widest font-bold">
            Current Institution
          </div>
          <div className="text-base sm:text-lg font-serif italic text-white">
            {user?.institutionName || 'University of Nairobi'}, {user?.campusName || 'Main Campus'}
          </div>
        </div>
      </div>

      {/* Grid Row 1: Google Ecosystem Integration & Financial Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Google Ecosystem Integration (8 Cols) */}
        <div className="lg:col-span-8 bg-[#12141D] border border-white/5 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#50E3C2]/5 blur-3xl rounded-full pointer-events-none" />
          
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-white/30 uppercase tracking-widest">
              Google Ecosystem Integration
            </h3>
            <span className="text-[10px] font-mono text-[#50E3C2] bg-[#50E3C2]/10 border border-[#50E3C2]/20 px-2 py-0.5 rounded">
              OAuth 2.0 Connected
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Google Drive Space */}
            <div
              onClick={() => onNavigate('vault')}
              className="bg-white/5 p-4 rounded-xl border border-white/5 hover:border-[#50E3C2]/30 transition-colors cursor-pointer group"
            >
              <div className="text-[10px] text-[#50E3C2] font-bold tracking-wider mb-1 flex items-center justify-between">
                <span>GOOGLE DRIVE</span>
                <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="text-xl font-bold text-white">124.5 GB</div>
              <div className="text-[10px] text-white/40 mt-0.5">Private Vault Space</div>
            </div>

            {/* Sheets API */}
            <div
              onClick={() => onNavigate('sheets')}
              className="bg-white/5 p-4 rounded-xl border border-white/5 hover:border-[#50E3C2]/30 transition-colors cursor-pointer group"
            >
              <div className="text-[10px] text-[#50E3C2] font-bold tracking-wider mb-1 flex items-center justify-between">
                <span>SHEETS API</span>
                <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="text-xl font-bold text-white">12 Active</div>
              <div className="text-[10px] text-white/40 mt-0.5">Academic Trackers</div>
            </div>

            {/* Gemini AI */}
            <div
              onClick={onOpenAI}
              className="bg-white/5 p-4 rounded-xl border border-white/5 hover:border-[#50E3C2]/30 transition-colors cursor-pointer group"
            >
              <div className="text-[10px] text-[#50E3C2] font-bold tracking-wider mb-1 flex items-center justify-between">
                <span>GEMINI AI</span>
                <Sparkles className="w-3 h-3 text-[#50E3C2]" />
              </div>
              <div className="text-xl font-bold text-white">Ready</div>
              <div className="text-[10px] text-white/40 mt-0.5">Context: Academic 3.7</div>
            </div>

          </div>
        </div>

        {/* Financial Status (4 Cols) */}
        <div className="lg:col-span-4 bg-gradient-to-br from-[#1A1C23] to-[#0A0B10] border border-white/10 rounded-2xl p-6 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-4">
              Financial Status
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span className="text-xs text-white/60">Wallet Balance</span>
                <span className="text-sm font-bold text-[#50E3C2]">$142.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-white/60">PesaPal Status</span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono">
                  SANDBOX_OK
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('sheets')}
            className="w-full py-2 bg-white hover:bg-white/90 text-black text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            TOP UP WALLET / SHEET STORE
          </button>
        </div>

      </div>

      {/* Grid Row 2: Upcoming Gigs, Sheet Marketplace, and Academic Vault */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Upcoming Gigs */}
        <div className="bg-[#12141D] border border-white/5 rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <div className="text-xs font-bold tracking-widest text-white/30 uppercase">
                Upcoming Gigs
              </div>
              <button
                onClick={() => onNavigate('gigs')}
                className="text-[10px] font-semibold text-[#50E3C2] hover:underline"
              >
                View All
              </button>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 bg-white/5 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                <div className="text-xs font-medium text-white">Mobile App Testing & Feedback</div>
                <div className="text-[10px] text-white/40 mt-0.5">UI Research Lab • $45.00</div>
              </div>

              <div className="p-3 bg-white/5 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                <div className="text-xs font-medium text-white">Research Survey Transcription</div>
                <div className="text-[10px] text-white/40 mt-0.5">Sociology Dept • $12.50</div>
              </div>

              <div className="p-3 bg-white/5 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                <div className="text-xs font-medium text-white">Calculus II Exam Peer Tutoring</div>
                <div className="text-[10px] text-white/40 mt-0.5">Engineering Faculty • $25.00</div>
              </div>
            </div>
          </div>
        </div>

        {/* Sheet Marketplace */}
        <div className="bg-[#12141D] border border-white/5 rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <div className="text-xs font-bold tracking-widest text-white/30 uppercase">
                Sheet Marketplace
              </div>
              <button
                onClick={() => onNavigate('sheets')}
                className="text-[10px] font-semibold text-[#50E3C2] hover:underline"
              >
                New Arrivals
              </button>
            </div>

            <div className="space-y-2.5">
              <div
                onClick={() => onNavigate('sheets')}
                className="p-3 bg-[#50E3C2]/5 rounded-lg border border-[#50E3C2]/20 hover:border-[#50E3C2]/40 transition-colors cursor-pointer"
              >
                <div className="text-xs font-medium text-[#50E3C2]">Student Budget & Allowance Planner</div>
                <div className="text-[10px] text-white/40 mt-0.5">Google Sheets v4 • Free Template</div>
              </div>

              <div
                onClick={() => onNavigate('sheets')}
                className="p-3 bg-white/5 rounded-lg border border-white/5 hover:border-white/10 transition-colors cursor-pointer"
              >
                <div className="text-xs font-medium text-white">University GPA & Honours Calculator</div>
                <div className="text-[10px] text-white/40 mt-0.5">Automatic Weighted Mean • Free</div>
              </div>

              <div
                onClick={() => onNavigate('sheets')}
                className="p-3 bg-white/5 rounded-lg border border-white/5 hover:border-white/10 transition-colors cursor-pointer"
              >
                <div className="text-xs font-medium text-white">Farm & Agri-Business Manager v4.2</div>
                <div className="text-[10px] text-white/40 mt-0.5">Agriculture Tools • $3.50</div>
              </div>
            </div>
          </div>
        </div>

        {/* Academic Vault */}
        <div className="bg-[#12141D] border border-white/5 rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <div className="text-xs font-bold tracking-widest text-white/30 uppercase">
                Academic Vault
              </div>
              <button
                onClick={() => onNavigate('vault')}
                className="text-[10px] font-semibold text-[#50E3C2] hover:underline"
              >
                7 Folders
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div
                onClick={() => onNavigate('vault')}
                className="aspect-square bg-white/5 rounded-lg border border-white/5 hover:border-white/10 flex flex-col items-center justify-center p-3 text-center transition-colors cursor-pointer"
              >
                <FileText className="w-6 h-6 text-[#50E3C2] mb-1" />
                <span className="text-[9px] font-bold tracking-wider text-white/70 uppercase">
                  TRANSCRIPTS
                </span>
                <span className="text-[8px] text-white/30">Google Drive</span>
              </div>

              <div
                onClick={() => onNavigate('academic')}
                className="aspect-square bg-white/5 rounded-lg border border-white/5 hover:border-white/10 flex flex-col items-center justify-center p-3 text-center transition-colors cursor-pointer"
              >
                <BookOpen className="w-6 h-6 text-[#50E3C2] mb-1" />
                <span className="text-[9px] font-bold tracking-wider text-white/70 uppercase">
                  PAST PAPERS
                </span>
                <span className="text-[8px] text-white/30">Exam Archive</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Row 3: Verified Accommodation & Scholarships */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        
        {/* Accommodation Preview */}
        <div className="p-6 rounded-2xl bg-[#12141D] border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-[#50E3C2]" />
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">
                Student Housing Near Campus
              </h3>
            </div>
            <button
              onClick={() => onNavigate('accommodation')}
              className="text-[10px] font-semibold text-[#50E3C2] hover:underline flex items-center gap-0.5"
            >
              <span>Explore All</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {accommodation.slice(0, 2).map((acc) => (
              <div
                key={acc.id}
                onClick={() => onNavigate('accommodation')}
                className="p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors flex items-center justify-between cursor-pointer"
              >
                <div>
                  <h4 className="text-xs font-bold text-white">{acc.title}</h4>
                  <p className="text-[10px] text-white/40 mt-0.5">
                    {acc.distanceFromCampusKm} km from campus • {acc.roomType.replace('_', ' ')}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-[#50E3C2]">
                    {formatPrice(acc.pricePerMonth, acc.currency)}/mo
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scholarships & Opportunities */}
        <div className="p-6 rounded-2xl bg-[#12141D] border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#50E3C2]" />
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">
                Global Opportunities
              </h3>
            </div>
            <button
              onClick={() => onNavigate('opportunities')}
              className="text-[10px] font-semibold text-[#50E3C2] hover:underline flex items-center gap-0.5"
            >
              <span>View All</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {opportunities.slice(0, 2).map((opp) => (
              <div
                key={opp.id}
                onClick={() => onNavigate('opportunities')}
                className="p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors flex items-center justify-between cursor-pointer"
              >
                <div>
                  <h4 className="text-xs font-bold text-white">{opp.title}</h4>
                  <p className="text-[10px] text-white/40 mt-0.5">
                    {opp.organization} • {opp.location}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                    {opp.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
