import React, { useState } from 'react';
import {
  FileText,
  Download,
  BookOpen,
  Search,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  ExternalLink,
  Tag,
  Plus,
  Eye,
  X,
  GraduationCap,
  FileCheck2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { PastPaperItem } from '../types';

export const PastPapersRevisionHub: React.FC = () => {
  const { pastPapers, addPastPaper, showToast } = useApp();
  const { user } = useAuth();

  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activePaperModal, setActivePaperModal] = useState<PastPaperItem | null>(null);
  const [showAnswerKey, setShowAnswerKey] = useState<{ [qIdx: number]: boolean }>({});
  const [showAddModal, setShowAddModal] = useState(false);

  // New paper form state
  const [newTitle, setNewTitle] = useState('');
  const [newLevel, setNewLevel] = useState<PastPaperItem['level']>('CBC Junior School (Grade 7-9)');
  const [newSubject, setNewSubject] = useState('');
  const [newYear, setNewYear] = useState(2025);
  const [newCurriculum, setNewCurriculum] = useState<PastPaperItem['curriculumBody']>('KNEC');
  const [newTags, setNewTags] = useState('Grade 8, Revision, KNEC');
  const [newQ1Text, setNewQ1Text] = useState('');
  const [newQ1Answer, setNewQ1Answer] = useState('');

  const levels = [
    'All',
    'CBC Junior School (Grade 7-9)',
    'KCSE (Form 1-4)',
    'University Units',
    'TVET / Diploma'
  ];

  const filteredPapers = pastPapers.filter((p) => {
    const matchesLevel = selectedLevel === 'All' || p.level === selectedLevel;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.institutionOrSchool && p.institutionOrSchool.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesLevel && matchesSearch;
  });

  const handleDownload = (p: PastPaperItem) => {
    showToast(`Downloading "${p.title}" (PDF & Marking Scheme)...`);
  };

  const handleAddPaper = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSubject.trim()) return;

    addPastPaper({
      title: newTitle.trim(),
      level: newLevel,
      curriculumBody: newCurriculum,
      subject: newSubject.trim(),
      year: Number(newYear),
      termOrSemester: 'Term / Semester Assessment',
      hasMarkingScheme: !!newQ1Answer.trim(),
      institutionOrSchool: user?.schoolName || 'Kenyan Academic Repository',
      downloadUrl: `https://enemind.co.ke/pastpapers/${encodeURIComponent(newTitle)}.pdf`,
      tags: newTags.split(',').map((t) => t.trim()).filter(Boolean),
      previewQuestions: [
        {
          questionNumber: '1',
          text: newQ1Text || 'Explain the core principles and demonstrate solutions for this topic.',
          marks: 5,
          answerKey: newQ1Answer || 'Detailed step-by-step marking guide and grading rubric.'
        }
      ]
    });

    setNewTitle('');
    setNewSubject('');
    setNewQ1Text('');
    setNewQ1Answer('');
    setShowAddModal(false);
    showToast('Past paper resource contributed to free student library!');
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[10px] font-bold uppercase tracking-wider">
              100% Free & Open Access
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
              KNEC & KICD Aligned
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display">
            CBC Junior School & University Past Paper Hub
          </h2>
          <p className="text-xs text-slate-300">
            Download revision questions, solved solutions, and official KNEC & campus marking schemes without any paywalls.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/30 self-start md:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Past Paper / Notes</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by topic, unit (e.g. CSC 211, Grade 8 Math, Physics P2, Thermodynamics)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto">
          {levels.map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedLevel === lvl
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Papers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPapers.map((paper) => (
          <div
            key={paper.id}
            className="p-5 bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold">
                  {paper.level}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-mono font-semibold">
                  {paper.curriculumBody} • {paper.year}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 leading-snug">
                {paper.title}
              </h3>

              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                <span>{paper.institutionOrSchool || paper.subject}</span>
              </p>

              <div className="mt-3 flex flex-wrap gap-1">
                {paper.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 text-[10px] font-medium border border-slate-100"
                  >
                    #{t}
                  </span>
                ))}
              </div>

              {/* Sample preview box */}
              {paper.previewQuestions && paper.previewQuestions.length > 0 && (
                <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                    <span className="flex items-center gap-1">
                      <HelpCircle className="w-3 h-3 text-indigo-600" />
                      Sample Question {paper.previewQuestions[0].questionNumber} ({paper.previewQuestions[0].marks} Marks)
                    </span>
                    {paper.hasMarkingScheme && (
                      <span className="text-emerald-700 text-[10px] flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" /> Solved
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-2 italic">
                    "{paper.previewQuestions[0].text}"
                  </p>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <span className="text-[11px] text-slate-400">
                {paper.downloadsCount.toLocaleString()} student downloads
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setActivePaperModal(paper);
                    setShowAnswerKey({});
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition cursor-pointer flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview & Solve</span>
                </button>

                <button
                  onClick={() => handleDownload(paper)}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Free PDF</span>
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Interactive Question & Marking Scheme Modal */}
      {activePaperModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
            
            <div className="p-5 bg-indigo-950 text-white flex items-center justify-between">
              <div>
                <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[10px] font-bold">
                  {activePaperModal.level} • {activePaperModal.year}
                </span>
                <h3 className="text-base font-bold font-display mt-1">{activePaperModal.title}</h3>
              </div>
              <button
                onClick={() => setActivePaperModal(null)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-2">
                <span>Curriculum Board: <b>{activePaperModal.curriculumBody}</b></span>
                <span>Institution: <b>{activePaperModal.institutionOrSchool}</b></span>
              </div>

              <div className="space-y-4">
                {activePaperModal.previewQuestions.map((q, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-indigo-950">
                        Question {q.questionNumber} ({q.marks} Marks)
                      </span>
                    </div>

                    <p className="text-xs text-slate-800 leading-relaxed font-medium">
                      {q.text}
                    </p>

                    {q.answerKey && (
                      <div className="pt-2 border-t border-slate-200">
                        <button
                          onClick={() => setShowAnswerKey({ ...showAnswerKey, [idx]: !showAnswerKey[idx] })}
                          className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
                        >
                          <FileCheck2 className="w-3.5 h-3.5" />
                          <span>{showAnswerKey[idx] ? 'Hide Marking Scheme Solution' : 'View Official Marking Scheme'}</span>
                        </button>

                        {showAnswerKey[idx] && (
                          <div className="mt-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-mono leading-relaxed animate-in fade-in duration-150">
                            <p className="font-bold text-[11px] text-emerald-950 mb-1">KNEC / Examiner Rubric Solution:</p>
                            {q.answerKey}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-3 flex items-center justify-between">
                <button
                  onClick={() => setActivePaperModal(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleDownload(activePaperModal);
                    setActivePaperModal(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Full PDF & Answers</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Upload Past Paper Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
            <div className="p-5 bg-indigo-950 text-white flex items-center justify-between">
              <h3 className="text-base font-bold font-display">Contribute a Past Paper / Revision Paper</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddPaper} className="p-6 space-y-3 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Paper Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2025 KCSE Chemistry Paper 1 (Theory)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Education Level</label>
                  <select
                    value={newLevel}
                    onChange={(e) => setNewLevel(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none"
                  >
                    <option value="CBC Junior School (Grade 7-9)">CBC Junior School (Grade 7-9)</option>
                    <option value="KCSE (Form 1-4)">KCSE (Form 1-4)</option>
                    <option value="University Units">University Units</option>
                    <option value="TVET / Diploma">TVET / Diploma</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Subject / Unit</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chemistry, CSC 211"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Sample Question 1</label>
                <textarea
                  rows={2}
                  placeholder="Type a key question from the exam..."
                  value={newQ1Text}
                  onChange={(e) => setNewQ1Text(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Marking Scheme Solution (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Solution steps, formula used, or marking key points..."
                  value={newQ1Answer}
                  onChange={(e) => setNewQ1Answer(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Upload & Publish Free
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
