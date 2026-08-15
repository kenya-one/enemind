import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { ENERMIND_LOGO_URL } from '../../data/enerHubData';

interface EnerMindPreloaderProps {
  onComplete?: () => void;
  title?: string;
  subtitle?: string;
  durationMs?: number;
}

const LOADING_STEPS = [
  'Initializing Kenyan University Neural Core...',
  'Connecting UoN, KU, JKUAT & Strathmore Repositories...',
  'Synchronizing Solved Exam Papers & Marking Schemes...',
  'Indexing Safaricom, KCB & Corporate Attachment Feeds...',
  'Powering Up Antigravity Intelligence Matrix...',
  'EnerMind Super-App Ready'
];

export const EnerMindPreloader: React.FC<EnerMindPreloaderProps> = ({
  onComplete,
  title = 'ENERMIND AI',
  subtitle = 'Kenyan Student Neural Super-App & Knowledge Engine',
  durationMs = 1200
}) => {
  const [progress, setProgress] = useState(15);
  const [stepIndex, setStepIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / durationMs) * 100));
      setProgress(pct);

      const step = Math.min(
        LOADING_STEPS.length - 1,
        Math.floor((elapsed / durationMs) * LOADING_STEPS.length)
      );
      setStepIndex(step);

      if (elapsed >= durationMs) {
        clearInterval(interval);
        setIsFinished(true);
        setTimeout(() => {
          onComplete?.();
        }, 250);
      }
    }, 35);

    return () => clearInterval(interval);
  }, [durationMs, onComplete]);

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] bg-neutral-950/90 backdrop-blur-xl flex flex-col items-center justify-center p-4 select-none overflow-hidden"
        >
          {/* Ambient Glows */}
          <div className="absolute w-72 h-72 bg-[#FFD700]/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center max-w-sm w-full text-center">
            {/* Spinning Circular Logo Container */}
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.05, 1]
              }}
              transition={{
                rotate: { duration: 8, repeat: Infinity, ease: 'linear' },
                scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
              }}
              className="w-24 h-24 bg-neutral-950 border-2 border-[#FFD700] rounded-full flex items-center justify-center p-2 mb-6 shadow-2xl shadow-[#FFD700]/40 overflow-hidden"
            >
              <img
                src={ENERMIND_LOGO_URL}
                alt="EnerMind AI"
                className="w-full h-full object-contain rounded-full drop-shadow-md"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </motion.div>

            {/* Title & Subtitle */}
            <div className="space-y-1.5 mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFD700]/15 border border-[#FFD700]/30 text-[#FFD700] text-[11px] font-mono font-bold rounded-full uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Neural Academic Matrix</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black tracking-wider uppercase text-white font-display">
                {title}
              </h2>
              <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                {subtitle}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full space-y-2 mb-4">
              <div className="h-2 w-full bg-neutral-900 border border-neutral-800 rounded-full overflow-hidden relative">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#FFD700] via-amber-400 to-yellow-300 rounded-full shadow-lg shadow-[#FFD700]/50"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
                <span className="truncate">{LOADING_STEPS[stepIndex]}</span>
                <span className="text-[#FFD700] font-bold">{progress}%</span>
              </div>
            </div>

            {/* Powered By Footer */}
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified 2026 Kenyan Universities Repository</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
