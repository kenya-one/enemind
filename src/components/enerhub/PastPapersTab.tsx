import React, { useState } from 'react';
import {
  FileCheck,
  Download,
  Search,
  CheckCircle,
  Eye,
  X,
  HelpCircle,
  GraduationCap,
  Award,
  BookOpen
} from 'lucide-react';
import { PastPaper } from '../../types';
import confetti from 'canvas-confetti';

interface PastPapersTabProps {
  pastPapers: PastPaper[];
  searchQuery: string;
}

export const PastPapersTab: React.FC<PastPapersTabProps> = ({ pastPapers, searchQuery }) => {
  const [selectedUniversity, setSelectedUniversity] = useState<string>('all');
  const [activePaper, setActivePaper] = useState<PastPaper | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadSuccessId, setDownloadSuccessId] = useState<string | null>(null);

  const universities = [
    { id: 'all', label: 'All Universities' },
    { id: 'uon', label: 'Univ of Nairobi (UoN)' },
    { id: 'ku', label: 'Kenyatta Univ (KU)' },
    { id: 'jkuat', label: 'JKUAT' },
    { id: 'kasneb', label: 'KASNEB' }
  ];

  const filteredPapers = pastPapers.filter((paper) => {
    if (selectedUniversity !== 'all') {
      const u = paper.university.toLowerCase();
      if (selectedUniversity === 'uon' && !u.includes('nairobi')) return false;
      if (selectedUniversity === 'ku' && !u.includes('kenyatta')) return false;
      if (selectedUniversity === 'jkuat' && !u.includes('jkuat')) return false;
      if (selectedUniversity === 'kasneb' && !u.includes('kasneb')) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        paper.title.toLowerCase().includes(q) ||
        paper.courseCode.toLowerCase().includes(q) ||
        paper.university.toLowerCase().includes(q) ||
        paper.sampleQuestions.some((sq) => sq.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleDownload = (paper: PastPaper, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDownloadingId(paper.id);
    setTimeout(() => {
      setDownloadingId(null);
      setDownloadSuccessId(paper.id);
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {}

      const blob = new Blob(
        [
          `--- ENERHUB KENYA PAST EXAMINATION PAPER ---\n\nTitle: ${paper.title}\nCourse Code: ${paper.courseCode}\nUniversity: ${paper.university}\nYear: ${paper.year} (${paper.semester})\nDuration: ${paper.durationHours} Hours\n\nSample Questions:\n${paper.sampleQuestions.join('\n\n')}\n\nWorked Solutions & Marking Scheme Summary:\n${paper.workedSolutionsSummary}\n\nDownloaded via EnerHub Kenya.`
        ],
        { type: 'text/plain;charset=utf-8' }
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${paper.courseCode.replace(/[^a-z0-9]/gi, '_')}_${paper.year}_Exam.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setTimeout(() => setDownloadSuccessId(null), 3000);
    }, 800);
  };

  return (
    <div className="space-y-4">
      {/* University Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {universities.map((u) => (
          <button
            key={u.id}
            onClick={() => setSelectedUniversity(u.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedUniversity === u.id
                ? 'bg-[#FFD700] text-black shadow-lg shadow-[#FFD700]/20 font-bold'
                : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800'
            }`}
          >
            {u.label}
          </button>
        ))}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-neutral-400">
        <span>Showing {filteredPapers.length} past exam papers with solutions</span>
        <span className="flex items-center gap-1 text-[#FFD700]">
          <Award className="w-3.5 h-3.5" /> 100% Solved Schemes
        </span>
      </div>

      {/* Papers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {filteredPapers.map((paper) => {
          const isDownloading = downloadingId === paper.id;
          const isDownloaded = downloadSuccessId === paper.id;

          return (
            <div
              key={paper.id}
              onClick={() => setActivePaper(paper)}
              className="bg-neutral-900/80 hover:bg-neutral-900 border border-neutral-800 hover:border-[#FFD700]/50 rounded-2xl p-4 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-[#FFD700]/15 text-[#FFD700] border border-[#FFD700]/30 rounded-md text-xs font-mono font-bold">
                      {paper.courseCode}
                    </span>
                    <span className="px-2 py-0.5 bg-neutral-800 text-neutral-300 rounded-md text-[11px] font-mono">
                      {paper.year}
                    </span>
                  </div>
                  {paper.hasMarkingScheme && (
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[10px] font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Solved
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-[#FFD700] transition-colors line-clamp-2 mb-1">
                  {paper.title}
                </h3>

                <p className="text-xs text-neutral-400 mb-3 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                  <span className="truncate">{paper.university} • {paper.semester} ({paper.durationHours} hrs)</span>
                </p>

                {/* Sample Question Preview */}
                <div className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-800/80 mb-3">
                  <span className="text-[10px] font-mono text-[#FFD700] block mb-0.5">Sample Question:</span>
                  <p className="text-xs text-neutral-300 italic line-clamp-2">
                    "{paper.sampleQuestions[0]}"
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2 pt-3 border-t border-neutral-800/80">
                <span className="text-[11px] text-neutral-500 font-mono">
                  {paper.downloadCount} downloads
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePaper(paper);
                    }}
                    className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-xl flex items-center gap-1 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Solutions</span>
                  </button>

                  <button
                    onClick={(e) => handleDownload(paper, e)}
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

      {/* Solutions Modal */}
      {activePaper && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 animate-in fade-in">
          <div className="bg-neutral-900 border border-neutral-700 rounded-3xl w-full max-w-3xl h-[85vh] flex flex-col shadow-2xl overflow-hidden text-neutral-100">
            {/* Header */}
            <div className="p-4 border-b border-neutral-800 bg-neutral-950 flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-[#FFD700]/20 text-[#FFD700] text-xs font-mono font-bold rounded-md">
                    {activePaper.courseCode}
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs font-mono rounded-md">
                    {activePaper.year} EXAM
                  </span>
                  <span className="text-xs text-neutral-400 font-mono">
                    {activePaper.university}
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-white">
                  {activePaper.title}
                </h2>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleDownload(activePaper)}
                  className="px-3 py-1.5 bg-[#FFD700] hover:bg-yellow-300 text-black text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
                <button
                  onClick={() => setActivePaper(null)}
                  className="p-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-full text-neutral-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Exam Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-xs text-neutral-300">
              {/* Questions Section */}
              <div className="space-y-3">
                <h3 className="font-bold text-white uppercase tracking-wider text-xs flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#FFD700]" /> Exam Questions ({activePaper.durationHours} Hours)
                </h3>

                <div className="space-y-2">
                  {activePaper.sampleQuestions.map((q, idx) => (
                    <div key={idx} className="p-3 bg-neutral-950 rounded-xl border border-neutral-800">
                      <div className="font-mono text-[11px] text-[#FFD700] font-bold mb-1">
                        Question {idx + 1}:
                      </div>
                      <p className="text-neutral-200">{q}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Worked Solutions */}
              <div className="space-y-3 pt-2">
                <h3 className="font-bold text-emerald-400 uppercase tracking-wider text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" /> Step-by-Step Worked Solutions & Marking Scheme
                </h3>

                <div className="p-4 bg-neutral-950 rounded-xl border border-emerald-500/30 font-mono text-emerald-200/90 whitespace-pre-line leading-relaxed">
                  {activePaper.workedSolutionsSummary}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
