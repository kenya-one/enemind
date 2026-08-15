import React, { useState } from 'react';
import {
  Film,
  Play,
  Star,
  ExternalLink,
  Download,
  CheckCircle,
  X,
  Sparkles,
  Info
} from 'lucide-react';
import { EntertainmentMovie } from '../../types';
import confetti from 'canvas-confetti';

interface MoviesTabProps {
  movies: EntertainmentMovie[];
  searchQuery: string;
}

export const MoviesTab: React.FC<MoviesTabProps> = ({ movies, searchQuery }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeMovieTrailer, setActiveMovieTrailer] = useState<EntertainmentMovie | null>(null);
  const [downloadSuccessId, setDownloadSuccessId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Media' },
    { id: 'kenyan', label: 'Kenyan Cinema' },
    { id: 'tech_doc', label: 'Tech Documentaries' },
    { id: 'blockbuster', label: 'Blockbusters' }
  ];

  const filteredMovies = movies.filter((m) => {
    if (selectedCategory !== 'all' && m.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        m.title.toLowerCase().includes(q) ||
        m.genres.some((g) => g.toLowerCase().includes(q)) ||
        m.director.toLowerCase().includes(q) ||
        m.synopsis.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleDownloadOffline = (movie: EntertainmentMovie) => {
    setDownloadSuccessId(movie.id);
    try {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.6 }
      });
    } catch {}
    setTimeout(() => setDownloadSuccessId(null), 3000);
  };

  return (
    <div className="space-y-4">
      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === c.id
                ? 'bg-[#FFD700] text-black shadow-lg shadow-[#FFD700]/20 font-bold'
                : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-neutral-400">
        <span>Showing {filteredMovies.length} movies & documentaries</span>
        <span className="text-[#FFD700] flex items-center gap-1 font-mono text-[11px]">
          <Film className="w-3.5 h-3.5" /> High-Def Streaming Ready
        </span>
      </div>

      {/* Grid of Movies */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredMovies.map((movie) => {
          const isDownloaded = downloadSuccessId === movie.id;

          return (
            <div
              key={movie.id}
              className="bg-neutral-900/80 border border-neutral-800 hover:border-[#FFD700]/50 rounded-2xl overflow-hidden transition-all duration-200 flex flex-col justify-between group"
            >
              {/* Media Thumbnail with Play Overlay */}
              <div className="relative aspect-video w-full overflow-hidden bg-neutral-950">
                <img
                  src={movie.backdropUrl}
                  alt={movie.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />

                {/* Rating Badge */}
                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[#FFD700] border border-[#FFD700]/30 text-xs font-bold flex items-center gap-1">
                  <Star className="w-3 h-3 fill-[#FFD700]" />
                  <span>{movie.rating}</span>
                </div>

                {/* Year and Duration */}
                <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 text-[11px] text-neutral-300 font-mono">
                  <span className="px-1.5 py-0.5 bg-black/60 rounded-md backdrop-blur-sm">{movie.year}</span>
                  <span className="px-1.5 py-0.5 bg-black/60 rounded-md backdrop-blur-sm">{movie.duration}</span>
                </div>

                {/* Center Play Button */}
                <button
                  onClick={() => setActiveMovieTrailer(movie)}
                  className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-[#FFD700] text-black flex items-center justify-center shadow-xl shadow-[#FFD700]/30 hover:scale-110 active:scale-95 transition-all"
                  title="Watch Trailer"
                >
                  <Play className="w-5 h-5 fill-current translate-x-0.5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-white mb-1 group-hover:text-[#FFD700] transition-colors">
                    {movie.title}
                  </h3>

                  <div className="flex flex-wrap gap-1 mb-2">
                    {movie.genres.map((g, i) => (
                      <span key={i} className="px-1.5 py-0.5 bg-neutral-800 text-[10px] text-neutral-400 rounded-md">
                        {g}
                      </span>
                    ))}
                  </div>

                  <p className="text-xs text-neutral-400 line-clamp-3 leading-relaxed mb-3">
                    {movie.synopsis}
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-neutral-500 font-mono">
                    Director: {movie.director}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveMovieTrailer(movie)}
                      className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-xl flex items-center gap-1 transition-colors"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Trailer</span>
                    </button>

                    <a
                      href={movie.streamUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 bg-[#FFD700] hover:bg-yellow-300 text-black text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-md shadow-[#FFD700]/20"
                    >
                      <span>Stream</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trailer Modal */}
      {activeMovieTrailer && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 animate-in fade-in">
          <div className="bg-neutral-900 border border-neutral-700 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-neutral-800 bg-neutral-950 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-[#FFD700] block">Official Trailer</span>
                <h3 className="text-base font-bold text-white">{activeMovieTrailer.title} ({activeMovieTrailer.year})</h3>
              </div>
              <button
                onClick={() => setActiveMovieTrailer(null)}
                className="p-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-full text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${activeMovieTrailer.trailerYouTubeId}?autoplay=1`}
                title={activeMovieTrailer.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="p-3 bg-neutral-950 flex items-center justify-between text-xs text-neutral-400">
              <span>Streaming in HD 1080p</span>
              <button
                onClick={() => handleDownloadOffline(activeMovieTrailer)}
                className="text-[#FFD700] hover:underline flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" /> Download Offline Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
