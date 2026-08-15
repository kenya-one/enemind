import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  FileCheck,
  Lightbulb,
  Briefcase,
  Film,
  Music,
  Zap,
  ArrowRight,
  ChevronUp,
  ChevronDown,
  Sparkles
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

export interface CirclePortalItem {
  id: EnerHubTab;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  badge: string;
  description: string;
  glowColor: string;
  isSpecial?: boolean;
}

interface EnerHub7CirclesLauncherProps {
  onSelectTab: (tab: EnerHubTab) => void;
}

export const EnerHub7CirclesLauncher: React.FC<EnerHub7CirclesLauncherProps> = ({
  onSelectTab
}) => {
  // Center is index 3 (EnerMind AI)
  const [selectedIndex, setSelectedIndex] = useState<number>(3);
  const [rotatingTabId, setRotatingTabId] = useState<EnerHubTab | null>(null);
  const [isEntering, setIsEntering] = useState(false);

  // 7 pure circular portals ordered vertically in a straight line from top to bottom
  const portals: CirclePortalItem[] = [
    {
      id: 'notes',
      title: 'Study Notes',
      subtitle: 'Kenyan University Modules & Units',
      icon: BookOpen,
      color: 'from-blue-500 to-indigo-600',
      glowColor: 'rgba(59, 130, 246, 0.4)',
      badge: `${SAMPLE_STUDY_NOTES.length} Units`,
      description: 'Structured revision modules for CS, Engineering, Business, Law, Medicine & KCSE.'
    },
    {
      id: 'past_papers',
      title: 'Past Papers',
      subtitle: 'Exams & Step-by-Step Solutions',
      icon: FileCheck,
      color: 'from-emerald-500 to-teal-600',
      glowColor: 'rgba(16, 185, 129, 0.4)',
      badge: `${SAMPLE_PAST_PAPERS.length} Exams`,
      description: 'Past papers from UoN, KU, JKUAT & KASNEB with verified marking schemes.'
    },
    {
      id: 'projects',
      title: 'Project Lab',
      subtitle: 'Final Year Capstones & System Blueprints',
      icon: Lightbulb,
      color: 'from-purple-500 to-violet-600',
      glowColor: 'rgba(168, 85, 247, 0.4)',
      badge: `${SAMPLE_PROJECT_IDEAS.length} Projects`,
      description: 'Production-grade project blueprints with M-Pesa integration & viva preparation.'
    },
    {
      id: 'enemind_ai',
      title: 'EnerMind AI',
      subtitle: 'Antigravity Neural Copilot',
      icon: Zap,
      color: 'from-[#FFD700] via-amber-400 to-yellow-500',
      glowColor: 'rgba(255, 215, 0, 0.65)',
      badge: 'AI Engine',
      description: 'Real-time university neural copilot for past papers, lecture notes & career prep.',
      isSpecial: true
    },
    {
      id: 'attachments',
      title: 'Attachments',
      subtitle: 'Verified Paid Industrial Attachments',
      icon: Briefcase,
      color: 'from-amber-500 to-orange-600',
      glowColor: 'rgba(245, 158, 11, 0.4)',
      badge: `${SAMPLE_INDUSTRIAL_ATTACHMENTS.length} Openings`,
      description: 'Corporate attachments at Safaricom, KCB, KenGen, KEMRI with AI cover letters.'
    },
    {
      id: 'movies',
      title: 'Movies & Cinema',
      subtitle: 'Kenyan Cinema, Documentaries & Series',
      icon: Film,
      color: 'from-rose-500 to-pink-600',
      glowColor: 'rgba(244, 63, 94, 0.4)',
      badge: `${SAMPLE_MOVIES.length} Movies`,
      description: 'Curated technical documentaries, Kenyan indie cinema & campus entertainment.'
    },
    {
      id: 'music',
      title: 'Study Beats',
      subtitle: 'Deep Focus Lo-Fi & Arbantone Beats',
      icon: Music,
      color: 'from-teal-500 to-cyan-600',
      glowColor: 'rgba(20, 184, 166, 0.4)',
      badge: `${SAMPLE_MUSIC_TRACKS.length} Tracks`,
      description: 'Cognitive focus lo-fi & energetic Kenyan instrumental beats for long coding sessions.'
    }
  ];

  const currentActivePortal = portals[selectedIndex];

  // Up/Down keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : portals.length - 1));
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < portals.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleEnterPortal(currentActivePortal.id);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, currentActivePortal.id]);

  const handleSelectCircle = (index: number, tabId: EnerHubTab) => {
    setRotatingTabId(tabId);
    setSelectedIndex(index);
    // If clicking the active circle, enter portal immediately
    if (selectedIndex === index) {
      handleEnterPortal(tabId);
    } else {
      setTimeout(() => {
        setRotatingTabId(null);
      }, 400);
    }
  };

  const handleEnterPortal = (tabId: EnerHubTab) => {
    setIsEntering(true);
    setRotatingTabId(tabId);
    setTimeout(() => {
      onSelectTab(tabId);
      setIsEntering(false);
    }, 450);
  };

  return (
    <div className="relative w-full h-full min-h-[560px] flex flex-col items-center justify-between select-none py-2 px-3">
      {/* Top Header Hint */}
      <div className="relative z-10 text-center shrink-0 mb-1">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-neutral-900/90 border border-[#FFD700]/30 rounded-full text-xs text-neutral-300 shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-[#FFD700]" />
          <span className="font-mono font-bold uppercase tracking-wider text-white text-[11px]">
            7-Circle Vertical Rail
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFD700] animate-pulse" />
        </div>
        <p className="text-[11px] text-neutral-400 mt-1">
          Click or use ↑ / ↓ arrows to cycle circles • Tap active circle to enter portal
        </p>
      </div>

      {/* Vertical Rail of 7 Pure Circles */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto py-1">
        {/* Glow rail backbone */}
        <div className="absolute top-2 bottom-2 w-1 bg-gradient-to-b from-blue-500/20 via-[#FFD700]/40 to-teal-500/20 rounded-full blur-[1px] pointer-events-none" />

        {/* Up Arrow */}
        <button
          onClick={() => setSelectedIndex((prev) => (prev > 0 ? prev - 1 : portals.length - 1))}
          className="mb-1.5 p-1.5 rounded-full bg-neutral-900/90 hover:bg-[#FFD700] hover:text-black text-neutral-400 border border-neutral-800 transition-colors cursor-pointer shadow-lg"
          title="Previous Circle (Arrow Up)"
        >
          <ChevronUp className="w-3.5 h-3.5 stroke-[3]" />
        </button>

        {/* The 7 Vertical Circles */}
        <div className="flex flex-col items-center justify-center gap-2.5 relative z-10">
          {portals.map((portal, index) => {
            const Icon = portal.icon;
            const isSelected = selectedIndex === index;
            const isSpinning = rotatingTabId === portal.id;
            const distanceFromCenter = Math.abs(selectedIndex - index);

            // Sizing: Selected Center Circle is Massive, neighboring are medium, edges are compact
            let circleSize = 'w-10 h-10 sm:w-11 sm:h-11';
            let iconSize = 'w-4 h-4 sm:w-5 sm:h-5';

            if (isSelected) {
              circleSize = 'w-24 h-24 sm:w-28 sm:h-28';
              iconSize = 'w-10 h-10 sm:w-12 sm:h-12';
            } else if (distanceFromCenter === 1) {
              circleSize = 'w-12 h-12 sm:w-13 sm:h-13';
              iconSize = 'w-5 h-5 sm:w-6 sm:h-6';
            }

            return (
              <motion.div
                key={portal.id}
                layout
                onClick={() => handleSelectCircle(index, portal.id)}
                whileHover={{ scale: isSelected ? 1.05 : 1.15 }}
                whileTap={{ scale: 0.92 }}
                className="relative flex items-center justify-center cursor-pointer group"
              >
                {/* The Pure Circle */}
                <motion.div
                  animate={
                    isSpinning
                      ? { rotate: 360, scale: [1, 1.25, 1] }
                      : { rotate: 0 }
                  }
                  transition={{ duration: 0.45, ease: 'easeInOut' }}
                  className={`${circleSize} rounded-full p-1 border-2 flex items-center justify-center relative transition-all duration-300 ${
                    isSelected
                      ? 'border-[#FFD700] bg-neutral-900 ring-4 ring-[#FFD700]/30 shadow-2xl shadow-[#FFD700]/40'
                      : 'border-neutral-700/80 bg-neutral-900/90 hover:border-neutral-400 opacity-70 hover:opacity-100 shadow-md'
                  }`}
                  style={{
                    boxShadow: isSelected
                      ? `0 0 30px ${portal.glowColor}, 0 0 60px ${portal.glowColor}`
                      : undefined
                  }}
                >
                  {/* Inner Circular Gradient Fill */}
                  <div
                    className={`w-full h-full rounded-full flex items-center justify-center overflow-hidden ${
                      portal.isSpecial
                        ? 'bg-neutral-950 p-1'
                        : isSelected
                        ? `bg-gradient-to-br ${portal.color} text-white`
                        : 'bg-neutral-800 text-neutral-300 group-hover:text-white'
                    }`}
                  >
                    {portal.isSpecial ? (
                      <img
                        src={ENERMIND_LOGO_URL}
                        alt={portal.title}
                        className="w-full h-full object-contain rounded-full drop-shadow-md"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <Icon className={`${iconSize} stroke-[2.2] ${isSelected ? 'text-white' : 'text-neutral-300'}`} />
                    )}
                  </div>

                  {/* Enter Indicator Arrow on Center Selected Circle */}
                  {isSelected && (
                    <span className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 bg-[#FFD700] text-black rounded-full border-2 border-neutral-950 flex items-center justify-center shadow-lg font-bold">
                      <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                  )}
                </motion.div>

                {/* Floating Title Label on Right Side */}
                <div
                  className={`absolute left-full ml-4 whitespace-nowrap z-30 transition-all duration-200 ${
                    isSelected
                      ? 'opacity-100 translate-x-0 pointer-events-auto'
                      : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 pointer-events-none'
                  }`}
                >
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEnterPortal(portal.id);
                    }}
                    className={`px-3.5 py-1.5 rounded-2xl border shadow-xl backdrop-blur-md flex items-center gap-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#FFD700] border-white text-black font-black hover:scale-105'
                        : 'bg-neutral-900/90 border-neutral-700 text-white hover:border-[#FFD700]'
                    }`}
                  >
                    <span className="text-xs font-black uppercase tracking-wider font-display">
                      {portal.title}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                        isSelected ? 'bg-black text-[#FFD700]' : 'bg-neutral-800 text-neutral-300'
                      }`}
                    >
                      {portal.badge}
                    </span>
                    {isSelected && (
                      <ArrowRight className="w-3.5 h-3.5 stroke-[3] text-black" />
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Down Arrow */}
        <button
          onClick={() => setSelectedIndex((prev) => (prev < portals.length - 1 ? prev + 1 : 0))}
          className="mt-1.5 p-1.5 rounded-full bg-neutral-900/90 hover:bg-[#FFD700] hover:text-black text-neutral-400 border border-neutral-800 transition-colors cursor-pointer shadow-lg"
          title="Next Circle (Arrow Down)"
        >
          <ChevronDown className="w-3.5 h-3.5 stroke-[3]" />
        </button>
      </div>

      {/* Bottom Center Click to Enter Prompt */}
      <div className="relative z-10 shrink-0 text-center space-y-2 mt-1">
        <button
          onClick={() => handleEnterPortal(currentActivePortal.id)}
          disabled={isEntering}
          className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#FFD700] via-amber-400 to-yellow-300 hover:from-white hover:to-[#FFD700] text-black text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-[#FFD700]/30 hover:scale-105 active:scale-95 transition-all cursor-pointer mx-auto"
        >
          {isEntering ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              <span>Launching {currentActivePortal.title}...</span>
            </>
          ) : (
            <>
              <span>Enter {currentActivePortal.title}</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
            </>
          )}
        </button>

        <p className="text-[11px] text-neutral-400 max-w-md mx-auto">
          {currentActivePortal.description}
        </p>
      </div>
    </div>
  );
};
