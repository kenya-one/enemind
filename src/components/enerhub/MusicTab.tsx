import React, { useState } from 'react';
import {
  Music,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Download,
  CheckCircle,
  Radio,
  Headphones,
  Sparkles
} from 'lucide-react';
import { EntertainmentMusic } from '../../types';
import confetti from 'canvas-confetti';

interface MusicTabProps {
  tracks: EntertainmentMusic[];
  searchQuery: string;
}

export const MusicTab: React.FC<MusicTabProps> = ({ tracks, searchQuery }) => {
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [progressPercent, setProgressPercent] = useState<number>(35);
  const [downloadSuccessId, setDownloadSuccessId] = useState<string | null>(null);

  const genres = [
    { id: 'all', label: 'All Beats' },
    { id: 'lofi_study', label: 'Study & Lo-Fi' },
    { id: 'gengetone_arbantone', label: 'Arbantone Beats' },
    { id: 'afrobeats', label: 'Afrobeats & Vibes' },
    { id: 'gospel', label: 'Kenyan Gospel & Ambient' }
  ];

  const filteredTracks = tracks.filter((t) => {
    if (selectedGenre !== 'all' && t.genre !== selectedGenre) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        t.artist.toLowerCase().includes(q) ||
        t.genreName.toLowerCase().includes(q) ||
        t.mood.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const activeTrack = filteredTracks[currentTrackIndex] || filteredTracks[0] || tracks[0];

  const togglePlay = (index?: number) => {
    if (typeof index === 'number') {
      setCurrentTrackIndex(index);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % filteredTracks.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + filteredTracks.length) % filteredTracks.length);
    setIsPlaying(true);
  };

  const handleDownload = (track: EntertainmentMusic, e: React.MouseEvent) => {
    e.stopPropagation();
    setDownloadSuccessId(track.id);
    try {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.7 }
      });
    } catch {}
    setTimeout(() => setDownloadSuccessId(null), 3000);
  };

  return (
    <div className="space-y-4">
      {/* Genre Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {genres.map((g) => (
          <button
            key={g.id}
            onClick={() => {
              setSelectedGenre(g.id);
              setCurrentTrackIndex(0);
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedGenre === g.id
                ? 'bg-[#FFD700] text-black shadow-lg shadow-[#FFD700]/20 font-bold'
                : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800'
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>

      {/* Main Music Player Card */}
      {activeTrack && (
        <div className="bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-950 border border-[#FFD700]/40 rounded-3xl p-4 sm:p-5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#FFD700]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10">
            {/* Album Art */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-2xl overflow-hidden shadow-xl border border-neutral-700">
              <img
                src={activeTrack.coverUrl}
                alt={activeTrack.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20" />
            </div>

            {/* Track Info & Progress */}
            <div className="flex-1 w-full text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-between gap-2 mb-1">
                <span className="px-2 py-0.5 bg-[#FFD700]/20 text-[#FFD700] text-[10px] font-mono font-bold rounded-full">
                  {activeTrack.genreName}
                </span>
                <span className="text-xs text-neutral-400 font-mono hidden sm:inline">
                  {activeTrack.bpm} BPM • {activeTrack.mood}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-white mb-0.5 truncate">
                {activeTrack.title}
              </h3>
              <p className="text-xs text-neutral-400 mb-3">
                {activeTrack.artist}
              </p>

              {/* Progress Slider */}
              <div className="space-y-1">
                <div
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    setProgressPercent(Math.min(100, Math.max(0, (clickX / rect.width) * 100)));
                  }}
                  className="h-1.5 bg-neutral-800 rounded-full cursor-pointer relative overflow-hidden"
                >
                  <div
                    className="h-full bg-gradient-to-r from-[#FFD700] to-yellow-300 rounded-full transition-all duration-150"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-neutral-500">
                  <span>01:14</span>
                  <span>{activeTrack.duration}</span>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex sm:flex-col items-center justify-center gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  className="p-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-full transition-colors"
                  title="Previous"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  onClick={() => togglePlay()}
                  className="p-3 bg-[#FFD700] hover:bg-yellow-300 text-black rounded-full transition-all shadow-lg shadow-[#FFD700]/30 hover:scale-105 active:scale-95"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current translate-x-0.5" />}
                </button>

                <button
                  onClick={handleNext}
                  className="p-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-full transition-colors"
                  title="Next"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-1.5 text-neutral-400 hover:text-white transition-colors"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Track List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-neutral-400 py-1">
          <span>Showing {filteredTracks.length} tracks</span>
          <span className="font-mono text-neutral-500">High-Fidelity Audio</span>
        </div>

        <div className="space-y-1.5">
          {filteredTracks.map((track, idx) => {
            const isCurrent = activeTrack?.id === track.id;
            const isDownloaded = downloadSuccessId === track.id;

            return (
              <div
                key={track.id}
                onClick={() => togglePlay(idx)}
                className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                  isCurrent
                    ? 'bg-neutral-900 border-[#FFD700] shadow-md shadow-[#FFD700]/10'
                    : 'bg-neutral-900/60 hover:bg-neutral-900 border-neutral-800'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-neutral-800 flex items-center justify-center shrink-0">
                    {isCurrent && isPlaying ? (
                      <div className="flex items-end gap-0.5 h-4">
                        <span className="w-1 bg-[#FFD700] animate-[bounce_0.6s_infinite]" />
                        <span className="w-1 bg-[#FFD700] animate-[bounce_0.8s_infinite]" />
                        <span className="w-1 bg-[#FFD700] animate-[bounce_0.5s_infinite]" />
                      </div>
                    ) : (
                      <span className="text-xs font-mono text-neutral-400">
                        {idx + 1}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                      {track.title}
                    </h4>
                    <p className="text-[11px] text-neutral-400 truncate">
                      {track.artist} • <span className="text-neutral-500">{track.genreName}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-mono text-neutral-500 hidden sm:inline">
                    {track.duration}
                  </span>

                  <button
                    onClick={(e) => handleDownload(track, e)}
                    className={`p-1.5 rounded-xl border transition-colors ${
                      isDownloaded
                        ? 'bg-emerald-500 text-black border-emerald-400'
                        : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border-neutral-700'
                    }`}
                    title="Download Track"
                  >
                    {isDownloaded ? <CheckCircle className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
