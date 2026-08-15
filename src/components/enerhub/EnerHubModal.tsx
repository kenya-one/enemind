import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  FileCheck,
  Lightbulb,
  Briefcase,
  Film,
  Music,
  Zap,
  Search,
  X,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { EnerHubTab } from '../../types';
import {
  SAMPLE_STUDY_NOTES,
  SAMPLE_PAST_PAPERS,
  SAMPLE_PROJECT_IDEAS,
  SAMPLE_INDUSTRIAL_ATTACHMENTS,
  SAMPLE_MOVIES,
  SAMPLE_MUSIC_TRACKS,
  ENERMIND_LOGO_URL
} from '../../data/enerHubData';
import { StudyNotesTab } from './StudyNotesTab';
import { PastPapersTab } from './PastPapersTab';
import { ProjectIdeasTab } from './ProjectIdeasTab';
import { AttachmentsTab } from './AttachmentsTab';
import { MoviesTab } from './MoviesTab';
import { MusicTab } from './MusicTab';
import { EnerMindAITab } from './EnerMindAITab';
import { EnerMindPreloader } from './EnerMindPreloader';
import { EnerHub7CirclesLauncher } from './EnerHub7CirclesLauncher';

interface EnerHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: EnerHubTab;
}

export const EnerHubModal: React.FC<EnerHubModalProps> = ({
  isOpen,
  onClose,
  initialTab
}) => {
  // Always launches directly into the 7-circle vertical rail homepage!
  const [viewMode, setViewMode] = useState<'portal' | 'tab'>(() => {
    return initialTab ? 'tab' : 'portal';
  });
  const [activeTab, setActiveTab] = useState<EnerHubTab>(() => {
    return initialTab || 'enemind_ai';
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showPreloader, setShowPreloader] = useState<boolean>(true);

  if (!isOpen) return null;

  const tabInfoMap: Record<
    EnerHubTab,
    { title: string; subtitle: string; icon: React.ComponentType<{ className?: string }>; badge: string; isSpecial?: boolean }
  > = {
    enemind_ai: {
      title: 'EnerMind AI',
      subtitle: 'Antigravity Neural Copilot',
      icon: Zap,
      badge: 'AI Powered',
      isSpecial: true
    },
    notes: {
      title: 'Study Notes',
      subtitle: 'Kenyan University Modules & Units',
      icon: BookOpen,
      badge: `${SAMPLE_STUDY_NOTES.length} Units`
    },
    past_papers: {
      title: 'Past Papers',
      subtitle: 'Exams & Step-by-Step Worked Solutions',
      icon: FileCheck,
      badge: `${SAMPLE_PAST_PAPERS.length} Exams`
    },
    projects: {
      title: 'Project Lab',
      subtitle: 'Final Year Capstones & System Blueprints',
      icon: Lightbulb,
      badge: `${SAMPLE_PROJECT_IDEAS.length} Projects`
    },
    attachments: {
      title: 'Attachments',
      subtitle: 'Verified Paid Industrial Attachments',
      icon: Briefcase,
      badge: `${SAMPLE_INDUSTRIAL_ATTACHMENTS.length} Openings`
    },
    movies: {
      title: 'Movies & Cinema',
      subtitle: 'Kenyan Cinema, Documentaries & Series',
      icon: Film,
      badge: `${SAMPLE_MOVIES.length} Movies`
    },
    music: {
      title: 'Study Beats',
      subtitle: 'Deep Focus Lo-Fi & Arbantone Beats',
      icon: Music,
      badge: `${SAMPLE_MUSIC_TRACKS.length} Tracks`
    }
  };

  const currentTabInfo = tabInfoMap[activeTab];
  const CurrentIcon = currentTabInfo?.icon || Zap;

  const handleNavigateFromAI = (tab: EnerHubTab, query?: string) => {
    setActiveTab(tab);
    setViewMode('tab');
    if (query) setSearchQuery(query);
  };

  return (
    <>
      {/* EnerMind Preloader on Opening */}
      {showPreloader && (
        <EnerMindPreloader
          onComplete={() => setShowPreloader(false)}
          title="ENERMIND AI"
          subtitle="Kenyan Student Neural Super-App & Knowledge Engine"
          durationMs={1200}
        />
      )}

      <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="bg-neutral-950 border border-neutral-800 rounded-3xl w-full max-w-5xl h-[92vh] flex flex-col shadow-2xl overflow-hidden relative text-neutral-100"
        >
          {/* Ambient background glow effect */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FFD700]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />

          {/* Master Header */}
          <header className="p-3 sm:p-4 border-b border-neutral-800/90 bg-neutral-950/90 backdrop-blur-xl flex flex-col gap-2 relative z-10 shrink-0">
            <div className="flex items-center justify-between gap-3">
              {/* Left Section */}
              {viewMode === 'portal' ? (
                /* Homepage Title with Spinning Circular Logo */
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ rotate: 360 }}
                    className="w-10 h-10 bg-neutral-950 border-2 border-[#FFD700] rounded-full flex items-center justify-center p-1 shadow-xl shadow-[#FFD700]/25 overflow-hidden shrink-0"
                  >
                    <img
                      src={ENERMIND_LOGO_URL}
                      alt="EnerMind"
                      className="w-full h-full object-contain rounded-full drop-shadow-sm"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </motion.div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-sm sm:text-base font-black tracking-wider uppercase text-white flex items-center gap-1.5 font-display">
                        <span>ENERHUB KENYA</span>
                        <span className="text-[#FFD700]">⚡</span>
                      </h1>
                      <span className="px-2 py-0.5 bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/40 text-[10px] font-black rounded-full uppercase">
                        7 Portals Rail
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 hidden sm:block">
                      Notes • Past Papers • Capstones • Attachments • Movies • Beats • EnerMind AI
                    </p>
                  </div>
                </div>
              ) : (
                /* When in ANY Page: Prominent Back to 7 Circles Rail Button + Current Page Info */
                <div className="flex items-center gap-3 min-w-0">
                  {/* Back to 7 Circles Rail Button */}
                  <motion.button
                    whileHover={{ scale: 1.04, x: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSearchQuery('');
                      setViewMode('portal');
                    }}
                    className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-[#FFD700] via-amber-400 to-yellow-300 hover:from-white hover:to-[#FFD700] text-black text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#FFD700]/25 cursor-pointer shrink-0 transition-all"
                    title="Return to 7 Circles Rail Homepage"
                  >
                    <ArrowLeft className="w-4 h-4 stroke-[3]" />
                    <span>Back to 7 Circles</span>
                  </motion.button>

                  {/* Current Active Page Title & Circular Icon */}
                  <div className="hidden xs:flex items-center gap-2 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-neutral-900 border border-[#FFD700]/50 p-1 flex items-center justify-center shrink-0">
                      {currentTabInfo?.isSpecial ? (
                        <img
                          src={ENERMIND_LOGO_URL}
                          alt="AI"
                          className="w-full h-full object-contain rounded-full"
                        />
                      ) : (
                        <CurrentIcon className="w-4 h-4 text-[#FFD700]" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h2 className="text-xs sm:text-sm font-black text-white truncate">
                          {currentTabInfo?.title}
                        </h2>
                        <span className="text-[10px] px-2 py-0.2 bg-neutral-900 border border-neutral-800 text-neutral-300 rounded-full font-mono">
                          {currentTabInfo?.badge}
                        </span>
                      </div>
                      <p className="text-[10px] text-neutral-400 truncate hidden md:block">
                        {currentTabInfo?.subtitle}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Right Action Controls: Search & Close */}
              <div className="flex items-center gap-2 flex-1 max-w-xs justify-end">
                {/* Search Bar inside sub-pages */}
                {viewMode === 'tab' && activeTab !== 'enemind_ai' && (
                  <div className="relative w-full max-w-[140px] sm:max-w-[180px]">
                    <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search..."
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-full pl-8 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#FFD700]"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )}

                <button
                  onClick={onClose}
                  className="p-2 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white transition-colors shrink-0 cursor-pointer"
                  title="Close EnerHub"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </header>

          {/* Master Content Area */}
          <main className="flex-1 overflow-y-auto p-2 sm:p-4 relative z-10 scrollbar-thin">
            <AnimatePresence mode="wait">
              {viewMode === 'portal' ? (
                <motion.div
                  key="portal-vertical-rail-home"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.22 }}
                  className="h-full flex items-center justify-center"
                >
                  <EnerHub7CirclesLauncher
                    onSelectTab={(tab) => {
                      setActiveTab(tab);
                      setViewMode('tab');
                    }}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key={`tab-${activeTab}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  {activeTab === 'notes' && (
                    <StudyNotesTab notes={SAMPLE_STUDY_NOTES} searchQuery={searchQuery} />
                  )}

                  {activeTab === 'past_papers' && (
                    <PastPapersTab pastPapers={SAMPLE_PAST_PAPERS} searchQuery={searchQuery} />
                  )}

                  {activeTab === 'projects' && (
                    <ProjectIdeasTab projectIdeas={SAMPLE_PROJECT_IDEAS} searchQuery={searchQuery} />
                  )}

                  {activeTab === 'attachments' && (
                    <AttachmentsTab
                      attachments={SAMPLE_INDUSTRIAL_ATTACHMENTS}
                      searchQuery={searchQuery}
                    />
                  )}

                  {activeTab === 'movies' && (
                    <MoviesTab movies={SAMPLE_MOVIES} searchQuery={searchQuery} />
                  )}

                  {activeTab === 'music' && (
                    <MusicTab tracks={SAMPLE_MUSIC_TRACKS} searchQuery={searchQuery} />
                  )}

                  {activeTab === 'enemind_ai' && (
                    <EnerMindAITab onNavigateTab={handleNavigateFromAI} />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </motion.div>
      </div>
    </>
  );
};
