import React, { useState } from 'react';
import {
  BookOpen,
  Download,
  FileText,
  Search,
  Star,
  CheckCircle,
  Eye,
  X,
  ExternalLink,
  GraduationCap,
  Sparkles,
  Building,
  Calendar,
  Layers
} from 'lucide-react';
import { StudyNote } from '../../types';
import confetti from 'canvas-confetti';

interface StudyNotesTabProps {
  notes: StudyNote[];
  searchQuery: string;
}

export const StudyNotesTab: React.FC<StudyNotesTabProps> = ({ notes, searchQuery }) => {
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('all');
  const [readingNote, setReadingNote] = useState<StudyNote | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadSuccessId, setDownloadSuccessId] = useState<string | null>(null);

  const disciplines = [
    { id: 'all', label: 'All Units' },
    { id: 'cs_it', label: 'CS & Software' },
    { id: 'business', label: 'Business & CPA' },
    { id: 'engineering', label: 'Engineering' },
    { id: 'health', label: 'Medicine & Health' },
    { id: 'law', label: 'Kenyan Law' },
    { id: 'kcse', label: 'KCSE Revision' }
  ];

  const filteredNotes = notes.filter((note) => {
    if (selectedDiscipline !== 'all' && note.discipline !== selectedDiscipline) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        note.title.toLowerCase().includes(q) ||
        note.courseCode.toLowerCase().includes(q) ||
        note.university.toLowerCase().includes(q) ||
        note.topics.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleDownload = (note: StudyNote, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDownloadingId(note.id);
    setTimeout(() => {
      setDownloadingId(null);
      setDownloadSuccessId(note.id);
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {}
      // Simulate file download by creating a blob
      const blob = new Blob(
        [
          `--- ENERHUB KENYA STUDY NOTES ---\n\nTitle: ${note.title}\nCourse Code: ${note.courseCode}\nUniversity: ${note.university}\nSemester: ${note.semester}\nAuthor: ${note.author}\n\nTopics Covered:\n${note.topics.map(t => `- ${t}`).join('\n')}\n\nSummary:\n${note.summary}\n\nSample Content:\n${note.sampleContent}\n\nDownloaded via EnerHub Kenya.`
        ],
        { type: 'text/plain;charset=utf-8' }
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${note.courseCode.replace(/[^a-z0-9]/gi, '_')}_${note.title.slice(0, 20).replace(/[^a-z0-9]/gi, '_')}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setTimeout(() => setDownloadSuccessId(null), 3000);
    }, 800);
  };

  return (
    <div className="space-y-4">
      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {disciplines.map((d) => (
          <button
            key={d.id}
            onClick={() => setSelectedDiscipline(d.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedDiscipline === d.id
                ? 'bg-[#FFD700] text-black shadow-lg shadow-[#FFD700]/20 font-bold'
                : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800'
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-neutral-400">
        <span>Showing {filteredNotes.length} study note packages</span>
        <span className="flex items-center gap-1 text-[#FFD700]">
          <Sparkles className="w-3 h-3" /> Verified University Units
        </span>
      </div>

      {/* Grid of Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {filteredNotes.map((note) => {
          const isDownloading = downloadingId === note.id;
          const isDownloaded = downloadSuccessId === note.id;

          return (
            <div
              key={note.id}
              onClick={() => setReadingNote(note)}
              className="bg-neutral-900/80 hover:bg-neutral-900 border border-neutral-800 hover:border-[#FFD700]/50 rounded-2xl p-4 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
            >
              <div>
                {/* Header with Course Code & Rating */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-[#FFD700]/15 text-[#FFD700] border border-[#FFD700]/30 rounded-md text-xs font-mono font-bold">
                      {note.courseCode}
                    </span>
                    <span className="px-2 py-0.5 bg-neutral-800 text-neutral-300 rounded-md text-[11px] font-mono">
                      {note.semester}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[#FFD700] text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-[#FFD700]" />
                    <span>{note.rating.toFixed(1)}</span>
                    <span className="text-neutral-500 font-normal text-[10px]">
                      ({note.downloadCount})
                    </span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-[#FFD700] transition-colors line-clamp-2 mb-1">
                  {note.title}
                </h3>

                <p className="text-xs text-neutral-400 mb-3 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                  <span className="truncate">{note.university} • {note.author}</span>
                </p>

                <p className="text-xs text-neutral-400 line-clamp-2 mb-3">
                  {note.summary}
                </p>

                {/* Topics badges */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {note.topics.slice(0, 3).map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-neutral-800/80 text-[11px] text-neutral-300 rounded-md"
                    >
                      {t}
                    </span>
                  ))}
                  {note.topics.length > 3 && (
                    <span className="px-1.5 py-0.5 bg-neutral-800 text-[10px] text-neutral-400 rounded-md">
                      +{note.topics.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2 pt-3 border-t border-neutral-800/80">
                <span className="text-[11px] text-neutral-500 font-mono">
                  {note.fileSize} • {note.pages} pgs
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setReadingNote(note);
                    }}
                    className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-xl flex items-center gap-1 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Read</span>
                  </button>

                  <button
                    onClick={(e) => handleDownload(note, e)}
                    disabled={isDownloading}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                      isDownloaded
                        ? 'bg-emerald-500 text-black'
                        : 'bg-[#FFD700] hover:bg-yellow-300 text-black shadow-md shadow-[#FFD700]/20'
                    }`}
                  >
                    {isDownloading ? (
                      <>
                        <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : isDownloaded ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Saved</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Document Reading Modal */}
      {readingNote && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 animate-in fade-in">
          <div className="bg-neutral-900 border border-neutral-700 rounded-3xl w-full max-w-3xl h-[85vh] flex flex-col shadow-2xl overflow-hidden text-neutral-100">
            {/* Modal Header */}
            <div className="p-4 border-b border-neutral-800 bg-neutral-950 flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-[#FFD700]/20 text-[#FFD700] text-xs font-mono font-bold rounded-md">
                    {readingNote.courseCode}
                  </span>
                  <span className="text-xs text-neutral-400 font-mono">
                    {readingNote.university} • {readingNote.semester}
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-white">
                  {readingNote.title}
                </h2>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleDownload(readingNote)}
                  className="px-3 py-1.5 bg-[#FFD700] hover:bg-yellow-300 text-black text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
                <button
                  onClick={() => setReadingNote(null)}
                  className="p-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-full text-neutral-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 font-mono text-xs text-neutral-300 leading-relaxed">
              <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 space-y-1 font-sans">
                <strong className="text-white block text-xs">Summary:</strong>
                <p className="text-neutral-400">{readingNote.summary}</p>
                <div className="pt-2 text-neutral-500 flex gap-3 text-[11px]">
                  <span>Author: {readingNote.author}</span>
                  <span>•</span>
                  <span>Pages: {readingNote.pages}</span>
                  <span>•</span>
                  <span>Rating: {readingNote.rating}/5.0</span>
                </div>
              </div>

              <div className="border border-neutral-800 rounded-xl p-4 bg-neutral-950 font-sans">
                <h4 className="font-bold text-white uppercase text-xs tracking-wider mb-2">
                  Module Syllabus Breakdown:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {readingNote.topics.map((t, i) => (
                    <div key={i} className="flex items-center gap-2 text-neutral-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FFD700]" />
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-neutral-800 rounded-xl p-4 bg-neutral-950 font-mono text-neutral-200 whitespace-pre-line leading-relaxed">
                {readingNote.sampleContent}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
