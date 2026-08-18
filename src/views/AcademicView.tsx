/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import {
  BookOpen,
  Sparkles,
  Search,
  CheckCircle2,
  ChevronRight,
  Upload,
  FileText,
  Download,
  Share2,
  Filter,
  ExternalLink,
  Plus,
  RefreshCw,
  X,
  Eye,
  GraduationCap,
  Layers,
  FolderLock,
  Clock,
  ShieldCheck,
  Check,
  AlertCircle,
  HelpCircle,
  FileCode,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { api } from '../services/api.js';
import {
  AcademicResourceType,
  AcademicSubmissionRequest,
  EnermindFile,
} from '../types/index.js';

export function AcademicView({ onOpenAI }: { onOpenAI: () => void }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'NOTES' | 'PAST_PAPERS' | 'PUBLIC_CATALOG'>('NOTES');
  const [files, setFiles] = useState<EnermindFile[]>([]);
  const [publicCatalog, setPublicCatalog] = useState<EnermindFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Filters
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('ALL');
  const [selectedExamTypeFilter, setSelectedExamTypeFilter] = useState<string>('ALL');
  const [selectedYearFilter, setSelectedYearFilter] = useState<string>('ALL');

  // Active AI Explainer & Paper selection
  const [selectedPaper, setSelectedPaper] = useState<EnermindFile | null>(null);
  const [questionText, setQuestionText] = useState('');
  const [aiExplanation, setAiExplanation] = useState<any | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);

  // Modals
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadResourceType, setUploadResourceType] = useState<AcademicResourceType>('NOTE');
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadCourseCode, setUploadCourseCode] = useState(user?.courseName?.split(' ')[0] || 'CSC 301');
  const [uploadUnitCode, setUploadUnitCode] = useState('CSC 301');
  const [uploadUnitName, setUploadUnitName] = useState('Design & Analysis of Algorithms');
  const [uploadTopic, setUploadTopic] = useState('');
  const [uploadAcademicYear, setUploadAcademicYear] = useState('2025');
  const [uploadSemester, setUploadSemester] = useState('Semester 1');
  const [uploadExamType, setUploadExamType] = useState<'MAIN' | 'SPECIAL' | 'CAT' | 'SUPPLEMENTARY' | 'RETAKE'>('MAIN');
  const [uploadSampleQuestion, setUploadSampleQuestion] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Submission / Sharing Modal
  const [selectedFileForShare, setSelectedFileForShare] = useState<EnermindFile | null>(null);
  const [shareNotes, setShareNotes] = useState('');
  const [isSubmittingShare, setIsSubmittingShare] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadAcademicData();
  }, [user, activeTab]);

  function showToast(text: string, type: 'success' | 'error' = 'success') {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  }

  async function loadAcademicData() {
    setIsLoading(true);
    try {
      if (activeTab === 'PUBLIC_CATALOG') {
        const res = await api.getPublicAcademicCatalog();
        setPublicCatalog(res.catalog);
      } else {
        const resourceType = activeTab === 'NOTES' ? 'NOTE' : 'PAST_PAPER';
        const res = await api.getUserFiles({
          userId: user?.id,
          resourceType,
        });
        setFiles(res.files);
        if (activeTab === 'PAST_PAPERS' && res.files.length > 0 && !selectedPaper) {
          setSelectedPaper(res.files[0]);
          setQuestionText(res.files[0].sampleQuestion || 'Explain core examination concepts for this unit.');
        }
      }
    } catch (err: any) {
      console.error('Failed to load academic data:', err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUploadAcademicFile(e: FormEvent) {
    e.preventDefault();
    if (!uploadFileName.trim()) return;

    setIsUploading(true);
    try {
      await api.uploadFile({
        name: uploadFileName.trim(),
        mimeType: uploadFileName.endsWith('.docx')
          ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          : 'application/pdf',
        sizeBytes: 2100000,
        category: uploadUnitCode || 'ACADEMIC',
        resourceType: uploadResourceType,
        institutionId: user?.institutionId,
        institutionName: user?.institutionName,
        campusId: user?.campusId,
        campusName: user?.campusName,
        courseName: user?.courseName,
        courseCode: uploadCourseCode,
        unitCode: uploadUnitCode,
        unitName: uploadUnitName,
        topic: uploadTopic,
        academicYear: uploadAcademicYear,
        semester: uploadSemester,
        examType: uploadExamType,
        sampleQuestion: uploadSampleQuestion,
      });

      setIsUploadModalOpen(false);
      setUploadFileName('');
      setUploadTopic('');
      setUploadSampleQuestion('');
      showToast(`Uploaded to Google Drive (Enermind/Academic/${uploadResourceType === 'NOTE' ? 'Notes' : 'Past Papers'})!`, 'success');
      loadAcademicData();
    } catch (err: any) {
      showToast(err.message || 'Upload failed', 'error');
    } finally {
      setIsUploading(false);
    }
  }

  async function handleConfirmShare(e: FormEvent) {
    e.preventDefault();
    if (!selectedFileForShare) return;

    setIsSubmittingShare(true);
    try {
      const submissionReq: AcademicSubmissionRequest = {
        fileId: selectedFileForShare.id,
        resourceType: selectedFileForShare.resourceType as AcademicResourceType,
        title: selectedFileForShare.name,
        institutionId: user?.institutionId || 'inst-uon-ke',
        institutionName: user?.institutionName || 'University of Nairobi',
        campusName: user?.campusName,
        courseCode: selectedFileForShare.courseCode || 'CSC 301',
        courseName: selectedFileForShare.courseName || user?.courseName,
        unitCode: selectedFileForShare.unitCode || 'CSC 301',
        unitName: selectedFileForShare.unitName,
        academicYear: selectedFileForShare.academicYear,
        semester: selectedFileForShare.semester,
        examType: selectedFileForShare.examType,
        notesOrDescription: shareNotes,
      };

      await api.submitAcademicResource(submissionReq);
      setSelectedFileForShare(null);
      setShareNotes('');
      showToast('Resource submitted for academic moderation review!', 'success');
      loadAcademicData();
    } catch (err: any) {
      showToast(err.message || 'Sharing submission failed', 'error');
    } finally {
      setIsSubmittingShare(false);
    }
  }

  async function handleExplainQuestion() {
    if (!questionText.trim()) return;
    setIsExplaining(true);
    try {
      const res = await api.explainPaper({
        paperTitle: selectedPaper?.name || 'Academic Exam Question',
        questionText,
        courseName: selectedPaper?.courseName || user?.courseName || 'Computer Science',
      });
      setAiExplanation(res);
    } catch (err) {
      showToast('AI Explanation generation failed', 'error');
    } finally {
      setIsExplaining(false);
    }
  }

  function formatBytes(bytes?: number) {
    if (!bytes) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  const currentDisplayFiles = activeTab === 'PUBLIC_CATALOG' ? publicCatalog : files;

  const filteredFiles = currentDisplayFiles.filter((f) => {
    if (selectedCourseFilter !== 'ALL' && f.courseCode !== selectedCourseFilter) {
      return false;
    }
    if (selectedExamTypeFilter !== 'ALL' && f.examType !== selectedExamTypeFilter) {
      return false;
    }
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      return (
        f.name.toLowerCase().includes(q) ||
        f.courseCode?.toLowerCase().includes(q) ||
        f.unitName?.toLowerCase().includes(q) ||
        f.topic?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl text-xs font-semibold shadow-2xl flex items-center gap-2 border transition-all ${
            toastMessage.type === 'success'
              ? 'bg-[#12141D] text-[#50E3C2] border-[#50E3C2]/30 shadow-[#50E3C2]/10'
              : 'bg-red-950 text-red-200 border-red-800'
          }`}
        >
          {toastMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Main Header */}
      <div className="p-6 rounded-2xl bg-[#12141D] border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#50E3C2]/10 text-[#50E3C2] flex items-center justify-center border border-[#50E3C2]/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">Academic Workspace & Exam Engine</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-white/5 text-[#50E3C2] border border-white/5">
                  {user?.institutionName || 'Global Campus'}
                </span>
              </div>
              <p className="text-xs text-white/50 mt-0.5">
                Organize authorized course notes, review past examination papers, and generate step-by-step AI breakdowns.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenAI}
            className="flex items-center gap-2 px-3.5 py-2 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white rounded-xl text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#50E3C2]" />
            <span>AI Study Assistant</span>
          </button>

          <button
            onClick={() => {
              setUploadResourceType(activeTab === 'PAST_PAPERS' ? 'PAST_PAPER' : 'NOTE');
              setIsUploadModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-[#50E3C2] hover:bg-[#40d0b0] text-black rounded-xl text-xs font-bold transition-all shadow-lg shadow-[#50E3C2]/20 cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Upload {activeTab === 'PAST_PAPERS' ? 'Past Paper' : 'Course Notes'}</span>
          </button>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('NOTES')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'NOTES'
                ? 'bg-[#50E3C2] text-black shadow-lg shadow-[#50E3C2]/20'
                : 'bg-white/5 text-white/60 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Course Notes</span>
          </button>

          <button
            onClick={() => setActiveTab('PAST_PAPERS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'PAST_PAPERS'
                ? 'bg-[#50E3C2] text-black shadow-lg shadow-[#50E3C2]/20'
                : 'bg-white/5 text-white/60 hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Past Papers & AI Explainer</span>
          </button>

          <button
            onClick={() => setActiveTab('PUBLIC_CATALOG')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'PUBLIC_CATALOG'
                ? 'bg-[#50E3C2] text-black shadow-lg shadow-[#50E3C2]/20'
                : 'bg-white/5 text-white/60 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Verified Campus Catalog</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-white/40 font-mono">
          <FolderLock className="w-3.5 h-3.5 text-[#50E3C2]" />
          <span>Stored in Google Drive: Enermind/Academic/</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, unit code, or topic..."
            className="w-full pl-10 pr-4 py-2 bg-[#12141D] border border-white/10 rounded-xl text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#50E3C2] transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {activeTab === 'PAST_PAPERS' && (
            <select
              value={selectedExamTypeFilter}
              onChange={(e) => setSelectedExamTypeFilter(e.target.value)}
              className="p-2 bg-[#12141D] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#50E3C2]"
            >
              <option value="ALL">All Exam Types</option>
              <option value="MAIN">Main Exam</option>
              <option value="CAT">CAT / Midterm</option>
              <option value="SPECIAL">Special Exam</option>
              <option value="SUPPLEMENTARY">Supplementary</option>
              <option value="RETAKE">Retake</option>
            </select>
          )}

          <button
            onClick={loadAcademicData}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            title="Refresh academic list"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* ========================================== */}
      {/* SECTION 1: COURSE NOTES TAB */}
      {/* ========================================== */}
      {activeTab === 'NOTES' && (
        <div className="grid grid-cols-1 gap-3">
          {isLoading ? (
            <div className="p-12 text-center text-white/40 text-xs">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#50E3C2] mb-2" />
              <span>Loading your course notes...</span>
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="p-12 rounded-2xl bg-[#12141D] border border-white/5 text-center space-y-3">
              <BookOpen className="w-8 h-8 text-white/30 mx-auto" />
              <h3 className="text-sm font-bold text-white">No course notes uploaded yet</h3>
              <p className="text-xs text-white/40 max-w-sm mx-auto">
                Upload your lecture notes, summaries, and revision guides directly into your Enermind Google Drive folder.
              </p>
              <button
                onClick={() => {
                  setUploadResourceType('NOTE');
                  setIsUploadModalOpen(true);
                }}
                className="px-4 py-2 bg-[#50E3C2] text-black font-bold text-xs rounded-xl inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Upload First Note</span>
              </button>
            </div>
          ) : (
            filteredFiles.map((file) => (
              <div
                key={file.id}
                className="p-5 rounded-2xl bg-[#12141D] border border-white/5 hover:border-white/15 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg group"
              >
                <div className="flex items-start gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#50E3C2]/10 flex items-center justify-center text-[#50E3C2] border border-[#50E3C2]/20 shrink-0 mt-0.5">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="truncate space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-bold text-[#50E3C2] bg-[#50E3C2]/10 px-2 py-0.5 rounded border border-[#50E3C2]/20">
                        {file.courseCode || 'CSC 301'}
                      </span>
                      <h4 className="text-xs font-bold text-white truncate">{file.name}</h4>
                      {file.submissionStatus === 'APPROVED' ? (
                        <span className="px-2 py-0.2 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono border border-emerald-500/30">
                          Shared with Enermind
                        </span>
                      ) : file.submissionStatus === 'SUBMITTED' ? (
                        <span className="px-2 py-0.2 rounded bg-amber-500/10 text-amber-400 text-[10px] font-mono border border-amber-500/30">
                          Review Pending
                        </span>
                      ) : (
                        <span className="px-2 py-0.2 rounded bg-white/5 text-white/50 text-[10px] font-mono border border-white/5">
                          Private Only
                        </span>
                      )}
                    </div>

                    {file.topic && (
                      <p className="text-[11px] text-white/60 line-clamp-1">
                        <span className="text-white/40">Topic:</span> {file.topic}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-white/40">
                      <span>{file.unitName || 'Academic Unit'}</span>
                      <span>•</span>
                      <span>{file.academicYear || 2025} ({file.semester || 'Semester 1'})</span>
                      <span>•</span>
                      <span>{formatBytes(file.sizeBytes)}</span>
                      <span>•</span>
                      <span className="text-[#50E3C2] font-mono">{file.folderPath}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {file.webViewLink && (
                    <a
                      href={file.webViewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                      title="Open in Google Drive"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}

                  {file.submissionStatus !== 'APPROVED' && file.submissionStatus !== 'SUBMITTED' && (
                    <button
                      onClick={() => setSelectedFileForShare(file)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-[#50E3C2]/10 text-white/70 hover:text-[#50E3C2] border border-white/5 hover:border-[#50E3C2]/30 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                      title="Share with Enermind academic community"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share with Campus</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ========================================== */}
      {/* SECTION 2: PAST PAPERS & AI EXPLAINER TAB */}
      {/* ========================================== */}
      {activeTab === 'PAST_PAPERS' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Past Papers Browser */}
          <div className="lg:col-span-6 space-y-3">
            <div className="flex items-center justify-between text-xs text-white/40 px-1">
              <span>{filteredFiles.length} Past Examination Papers</span>
              <span>Click to load into AI solver</span>
            </div>

            <div className="space-y-3">
              {filteredFiles.map((paper) => {
                const isSelected = selectedPaper?.id === paper.id;
                return (
                  <div
                    key={paper.id}
                    onClick={() => {
                      setSelectedPaper(paper);
                      setQuestionText(paper.sampleQuestion || 'Explain core examination questions for this unit.');
                      setAiExplanation(null);
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-lg ${
                      isSelected
                        ? 'bg-[#50E3C2]/5 border-[#50E3C2]/40 text-white'
                        : 'bg-[#12141D] border-white/5 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-mono font-bold text-[#50E3C2] bg-[#50E3C2]/10 px-2 py-0.5 rounded border border-[#50E3C2]/20">
                        {paper.courseCode}
                      </span>
                      <span className="text-[11px] text-white/40 font-mono">
                        {paper.academicYear || 2024} • {paper.semester || 'Semester 1'} • {paper.examType || 'MAIN'}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-white mt-2">{paper.name}</h4>
                    {paper.sampleQuestion && (
                      <p className="text-[11px] text-white/40 mt-1 line-clamp-2">{paper.sampleQuestion}</p>
                    )}

                    <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
                      <span className="text-white/30">{paper.downloadCount || 120} peer downloads</span>
                      <span className="text-[#50E3C2] font-semibold flex items-center gap-1">
                        Select for AI Breakdown <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: AI Past Paper Question Solver */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-6 rounded-2xl bg-[#12141D] border border-white/5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#50E3C2]/10 text-[#50E3C2] flex items-center justify-center border border-[#50E3C2]/20">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Gemini Academic Question Explainer</h3>
                    <p className="text-xs text-white/40">Step-by-step theorem & equation breakdown</p>
                  </div>
                </div>
                <span className="text-[10px] bg-[#50E3C2]/10 text-[#50E3C2] border border-[#50E3C2]/30 px-2 py-0.5 rounded font-mono">
                  Gemini 3.7
                </span>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-white/40">
                  Question Text for {selectedPaper?.courseCode || 'Course'}
                </label>
                <textarea
                  rows={4}
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="Paste exam question or select a paper from the list on the left..."
                  className="w-full bg-[#0A0B10] border border-white/10 rounded-xl p-3 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#50E3C2]/50 resize-none leading-relaxed font-sans"
                />
              </div>

              <button
                onClick={handleExplainQuestion}
                disabled={isExplaining || !questionText.trim()}
                className="w-full py-2.5 px-4 bg-[#50E3C2] hover:bg-[#40d0b0] disabled:opacity-40 text-black font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-[#50E3C2]/20 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isExplaining ? 'Analyzing with Gemini AI...' : 'Explain Question & Provide Solution'}</span>
              </button>

              {/* AI Explanation Result */}
              {aiExplanation && (
                <div className="p-4 rounded-xl bg-[#0A0B10] border border-[#50E3C2]/30 space-y-3">
                  <div className="flex items-center gap-2 text-[#50E3C2] text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Academic Solution & Methodology</span>
                  </div>

                  <div className="text-xs text-white/90 leading-relaxed whitespace-pre-wrap">
                    {aiExplanation.explanation}
                  </div>

                  {aiExplanation.solutionSteps && aiExplanation.solutionSteps.length > 0 && (
                    <div className="pt-2 border-t border-white/5 space-y-1.5">
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Solution Steps</p>
                      <ul className="list-disc list-inside text-xs text-[#50E3C2] space-y-1">
                        {aiExplanation.solutionSteps.map((step: string, i: number) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* SECTION 3: PUBLIC CAMPUS CATALOG TAB */}
      {/* ========================================== */}
      {activeTab === 'PUBLIC_CATALOG' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {publicCatalog.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-[#12141D] border border-white/5 space-y-3 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#50E3C2] bg-[#50E3C2]/10 px-2 py-0.5 rounded border border-[#50E3C2]/20">
                  {item.courseCode}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Moderator Verified
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-white">{item.name}</h4>
                <p className="text-[11px] text-white/40 mt-0.5">{item.institutionName} • {item.unitName || 'Official Resource'}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] text-white/40">
                <span>{item.downloadCount || 350} student downloads</span>
                {item.webViewLink && (
                  <a
                    href={item.webViewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#50E3C2] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>View Resource</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL 1: UPLOAD ACADEMIC RESOURCE MODAL */}
      {/* ========================================== */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-[#12141D] border border-white/10 p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-[#50E3C2]" />
                <h3 className="text-sm font-bold text-white">
                  Upload {uploadResourceType === 'NOTE' ? 'Course Notes' : 'Past Paper'}
                </h3>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1 rounded-lg text-white/40 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadAcademicFile} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-white/60 font-medium">Resource Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setUploadResourceType('NOTE')}
                    className={`p-2 rounded-xl border text-center font-semibold ${
                      uploadResourceType === 'NOTE'
                        ? 'bg-[#50E3C2] text-black border-[#50E3C2]'
                        : 'bg-[#0A0B10] text-white/60 border-white/10'
                    }`}
                  >
                    Course Notes
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadResourceType('PAST_PAPER')}
                    className={`p-2 rounded-xl border text-center font-semibold ${
                      uploadResourceType === 'PAST_PAPER'
                        ? 'bg-[#50E3C2] text-black border-[#50E3C2]'
                        : 'bg-[#0A0B10] text-white/60 border-white/10'
                    }`}
                  >
                    Past Exam Paper
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-white/60 font-medium">Document Title</label>
                <input
                  type="text"
                  required
                  value={uploadFileName}
                  onChange={(e) => setUploadFileName(e.target.value)}
                  placeholder={
                    uploadResourceType === 'NOTE'
                      ? 'e.g., CSC301_Complete_Graph_Algorithms_Notes.pdf'
                      : 'e.g., CSC301_2024_Semester_1_Final_Exam.pdf'
                  }
                  className="w-full p-2.5 bg-[#0A0B10] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#50E3C2]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-white/60 font-medium">Course / Unit Code</label>
                  <input
                    type="text"
                    required
                    value={uploadCourseCode}
                    onChange={(e) => setUploadCourseCode(e.target.value)}
                    placeholder="e.g., CSC 301"
                    className="w-full p-2.5 bg-[#0A0B10] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#50E3C2]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-white/60 font-medium">Academic Year</label>
                  <input
                    type="text"
                    value={uploadAcademicYear}
                    onChange={(e) => setUploadAcademicYear(e.target.value)}
                    placeholder="2025"
                    className="w-full p-2.5 bg-[#0A0B10] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#50E3C2]"
                  />
                </div>
              </div>

              {uploadResourceType === 'NOTE' ? (
                <div className="space-y-1">
                  <label className="text-white/60 font-medium">Topic / Key Chapters</label>
                  <input
                    type="text"
                    value={uploadTopic}
                    onChange={(e) => setUploadTopic(e.target.value)}
                    placeholder="e.g., Dynamic Programming, Greedy Solvers"
                    className="w-full p-2.5 bg-[#0A0B10] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#50E3C2]"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-white/60 font-medium">Exam Type</label>
                    <select
                      value={uploadExamType}
                      onChange={(e) => setUploadExamType(e.target.value as any)}
                      className="w-full p-2.5 bg-[#0A0B10] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#50E3C2]"
                    >
                      <option value="MAIN">Main Examination</option>
                      <option value="CAT">CAT / Midterm</option>
                      <option value="SPECIAL">Special Exam</option>
                      <option value="SUPPLEMENTARY">Supplementary</option>
                      <option value="RETAKE">Retake</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-white/60 font-medium">Semester</label>
                    <select
                      value={uploadSemester}
                      onChange={(e) => setUploadSemester(e.target.value)}
                      className="w-full p-2.5 bg-[#0A0B10] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#50E3C2]"
                    >
                      <option value="Semester 1">Semester 1</option>
                      <option value="Semester 2">Semester 2</option>
                      <option value="Semester 3">Semester 3 / Trimester</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="p-4 rounded-xl border border-dashed border-white/10 bg-[#0A0B10] text-center text-[11px] text-white/40 space-y-1">
                <Upload className="w-5 h-5 text-[#50E3C2] mx-auto" />
                <div>Drag PDF, DOCX, PPTX or click to select</div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-3.5 py-2 bg-white/5 text-white/70 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading || !uploadFileName.trim()}
                  className="px-4 py-2 bg-[#50E3C2] hover:bg-[#40d0b0] text-black font-bold rounded-xl flex items-center gap-2"
                >
                  {isUploading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  <span>Save to Google Drive</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL 2: SHARE WITH ENERMIND CONFIRMATION */}
      {/* ========================================== */}
      {selectedFileForShare && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-[#12141D] border border-white/10 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-[#50E3C2]">
              <Share2 className="w-5 h-5" />
              <h3 className="text-sm font-bold text-white">Share Resource with Enermind Community</h3>
            </div>

            <p className="text-xs text-white/70 leading-relaxed">
              You are proposing to share <span className="font-bold text-white font-mono">{selectedFileForShare.name}</span> with students at <span className="font-bold text-[#50E3C2]">{user?.institutionName || 'your institution'}</span>.
            </p>

            <div className="p-3.5 rounded-xl bg-[#0A0B10] border border-white/5 text-xs text-white/60 space-y-2">
              <div className="flex items-center gap-2 text-white font-semibold">
                <ShieldCheck className="w-4 h-4 text-[#50E3C2]" />
                <span>Academic Sharing Rules:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-white/50">
                <li>Your file stays in your personal Google Drive account.</li>
                <li>The document will enter the moderation queue with status <span className="text-amber-400 font-mono">SUBMITTED</span>.</li>
                <li>Once approved by campus moderators, it will appear in the verified course catalog.</li>
                <li>Private Vault documents can NEVER be shared through this flow.</li>
              </ul>
            </div>

            <form onSubmit={handleConfirmShare} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs text-white/60 font-medium">Notes for Campus Moderators (Optional)</label>
                <textarea
                  rows={2}
                  value={shareNotes}
                  onChange={(e) => setShareNotes(e.target.value)}
                  placeholder="e.g., Complete 2024 final exam paper with verified solutions..."
                  className="w-full p-2.5 bg-[#0A0B10] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#50E3C2]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setSelectedFileForShare(null)}
                  className="px-3.5 py-2 bg-white/5 text-white/70 text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingShare}
                  className="px-4 py-2 bg-[#50E3C2] hover:bg-[#40d0b0] text-black font-bold text-xs rounded-xl flex items-center gap-2"
                >
                  {isSubmittingShare ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>Confirm & Submit for Review</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
