/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';

export const ENERMIND_LOGO_URL =
  'https://cdn.oreateai.com/agentskill/c33477c488d4b7613c1e591f/multimedia/84205c8a6ffcd3b761e91635.png';

interface PreloaderProps {
  isLoading: boolean;
  onFinished?: () => void;
}

export function Preloader({ isLoading, onFinished }: PreloaderProps) {
  const [shouldRender, setShouldRender] = useState(isLoading);
  const [fadeState, setFadeState] = useState<'visible' | 'fading' | 'hidden'>('visible');

  useEffect(() => {
    if (!isLoading) {
      setFadeState('fading');
      const timer = setTimeout(() => {
        setFadeState('hidden');
        setShouldRender(false);
        if (onFinished) onFinished();
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setShouldRender(true);
      setFadeState('visible');
    }
  }, [isLoading, onFinished]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#0A0B10]/95 backdrop-blur-md transition-opacity duration-500 ${
        fadeState === 'fading' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="relative flex flex-col items-center">
        
        {/* Stationary Centered Logo with Orbiting Light Ring */}
        <div className="relative w-48 h-48 flex items-center justify-center">
          
          {/* Subtle Outer Track */}
          <div className="absolute inset-0 rounded-full border border-white/10" />

          {/* Orbiting Mint Light Ring */}
          <div className="absolute inset-0 rounded-full border-t-2 border-[#50E3C2] shadow-[0_0_15px_rgba(80,227,194,0.4)] animate-spin [animation-duration:2.5s]" />

          {/* Orbiting Light Particle */}
          <div className="absolute inset-0 rounded-full animate-spin [animation-duration:2.5s]">
            <div className="absolute top-0 left-1/2 -ml-1.5 w-3 h-3 bg-[#50E3C2] rounded-full shadow-[0_0_12px_#50E3C2]" />
          </div>

          {/* Stationary, Non-Rotating Circular Center Logo */}
          <div className="relative z-10 w-24 h-24 rounded-full overflow-hidden flex items-center justify-center p-2 bg-[#0A0B10]/60 border border-white/10 shadow-[0_0_20px_rgba(80,227,194,0.15)]">
            <img
              src={ENERMIND_LOGO_URL}
              alt="Enermind Logo"
              className="w-full h-full rounded-full object-cover filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Editorial Typography & System Status */}
        <div className="mt-8 text-center space-y-1.5">
          <div className="text-xs tracking-[0.4em] uppercase text-[#50E3C2] font-semibold">
            System Initializing
          </div>
          <div className="text-[10px] text-white/40 uppercase tracking-widest font-mono">
            Connecting Google Workspace & Campus Ecosystem...
          </div>
        </div>
      </div>
    </div>
  );
}
