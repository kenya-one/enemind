import React, { useState } from 'react';
import {
  Briefcase,
  MapPin,
  Calendar,
  Clock,
  ExternalLink,
  Mail,
  Sparkles,
  CheckCircle,
  FileText,
  X,
  Copy,
  Check
} from 'lucide-react';
import { IndustrialAttachment } from '../../types';

interface AttachmentsTabProps {
  attachments: IndustrialAttachment[];
  searchQuery: string;
}

export const AttachmentsTab: React.FC<AttachmentsTabProps> = ({ attachments, searchQuery }) => {
  const [selectedAttachment, setSelectedAttachment] = useState<IndustrialAttachment | null>(null);
  const [showCoverLetterModal, setShowCoverLetterModal] = useState<IndustrialAttachment | null>(null);
  const [copiedLetter, setCopiedLetter] = useState(false);

  const filteredAttachments = attachments.filter((att) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        att.title.toLowerCase().includes(q) ||
        att.company.toLowerCase().includes(q) ||
        att.location.toLowerCase().includes(q) ||
        att.eligibleDisciplines.some((d) => d.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const generateCoverLetterText = (att: IndustrialAttachment) => {
    return `[Your Full Name]
[Your Phone Number: +254 7XX XXX XXX]
[Your Student Email: student@university.ac.ke]
[Department of Computing / Engineering]
[University of Nairobi / Kenyatta University / JKUAT]

Date: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}

The Human Resource Manager,
${att.company},
${att.location}, Kenya.

RE: APPLICATION FOR 3-MONTH INDUSTRIAL ATTACHMENT - [YOUR DEGREE PROGRAM]

Dear Hiring Manager,

I am writing to express my enthusiasm in applying for the ${att.title} position at ${att.company} as published on the National Student Industrial Attachment portal. I am currently a continuing undergraduate student pursuing a Bachelor's Degree in ${att.eligibleDisciplines[0] || 'Computer Science / Engineering'}.

In fulfillment of our university degree program requirements, undergraduate students must complete a mandatory 3-month industrial attachment period to bridge academic knowledge with practical corporate industry experience. Given ${att.company}'s distinguished track record in ${att.location}, I am eager to contribute productively to your teams.

During my coursework, I have developed solid foundational skills, practical problem-solving capabilities, and a diligent work ethic. I am prepared to assist with:
${att.duties.map((d) => `- ${d}`).join('\n')}

Attached to this application are:
1. Official University Attachment Introduction Letter from the Dean
2. Certified Academic Transcripts
3. Curriculum Vitae & Student Identification Card

Thank you for your time and consideration. I welcome the opportunity to discuss my qualifications in an interview.

Yours sincerely,

[Your Full Name]
Reg No: [e.g., F17/84920/2022]`;
  };

  const handleCopyCoverLetter = (att: IndustrialAttachment) => {
    const text = generateCoverLetterText(att);
    navigator.clipboard.writeText(text);
    setCopiedLetter(true);
    setTimeout(() => setCopiedLetter(false), 2500);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-neutral-400">
        <span>Showing {filteredAttachments.length} verified Kenyan attachments</span>
        <span className="text-[#FFD700] flex items-center gap-1 font-mono text-[11px]">
          <Sparkles className="w-3.5 h-3.5" /> High Placement Success Rate
        </span>
      </div>

      {/* Grid of Attachment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {filteredAttachments.map((att) => (
          <div
            key={att.id}
            className="bg-neutral-900/80 hover:bg-neutral-900 border border-neutral-800 hover:border-[#FFD700]/50 rounded-2xl p-4 transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              {/* Header with Company Logo & Status */}
              <div className="flex items-start justify-between gap-3 mb-2.5">
                <div className="flex items-center gap-2.5">
                  <img
                    src={att.logoUrl}
                    alt={att.company}
                    className="w-10 h-10 rounded-xl object-cover border border-neutral-800 bg-neutral-950"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-neutral-300 font-mono">{att.company}</h4>
                    <span className="text-[11px] text-neutral-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#FFD700]" /> {att.location}
                    </span>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded-full ${
                    att.status === 'Urgent'
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {att.status}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white mb-2 line-clamp-2">
                {att.title}
              </h3>

              {/* Stipend & Duration */}
              <div className="flex items-center gap-3 text-xs mb-3 bg-neutral-950 p-2 rounded-xl border border-neutral-800">
                <div className="text-[#FFD700] font-mono font-bold">
                  Stipend: {att.stipend}
                </div>
                <div className="text-neutral-400 font-mono">
                  Duration: {att.durationMonths} Months
                </div>
              </div>

              {/* Target Disciplines */}
              <div className="mb-3">
                <span className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">Eligible Courses:</span>
                <div className="flex flex-wrap gap-1">
                  {att.eligibleDisciplines.map((d, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-neutral-800/90 text-[11px] text-neutral-300 rounded-md"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              {/* Key Duties */}
              <div className="space-y-1 mb-3 bg-neutral-950 p-2.5 rounded-xl border border-neutral-800/80 text-xs text-neutral-400">
                <span className="text-[10px] font-mono text-neutral-500 block mb-0.5">Key Duties:</span>
                {att.duties.slice(0, 2).map((duty, idx) => (
                  <div key={idx} className="flex items-start gap-1.5">
                    <span className="text-[#FFD700]">•</span>
                    <span className="line-clamp-1">{duty}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-2 pt-3 border-t border-neutral-800/80">
              <span className="text-[11px] text-neutral-500 font-mono">
                Deadline: {att.deadline}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowCoverLetterModal(att)}
                  className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-[#FFD700]" />
                  <span>Cover Letter</span>
                </button>

                <a
                  href={att.applicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 bg-[#FFD700] hover:bg-yellow-300 text-black text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <span>Apply</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cover Letter Generator Modal */}
      {showCoverLetterModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 animate-in fade-in">
          <div className="bg-neutral-900 border border-neutral-700 rounded-3xl w-full max-w-2xl h-[80vh] flex flex-col shadow-2xl overflow-hidden text-neutral-100">
            <div className="p-4 border-b border-neutral-800 bg-neutral-950 flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-mono text-[#FFD700] block mb-0.5">
                  AI Cover Letter Generator
                </span>
                <h3 className="text-base font-bold text-white">
                  Application Letter — {showCoverLetterModal.company}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyCoverLetter(showCoverLetterModal)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                    copiedLetter
                      ? 'bg-emerald-500 text-black'
                      : 'bg-[#FFD700] hover:bg-yellow-300 text-black'
                  }`}
                >
                  {copiedLetter ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLetter ? 'Copied' : 'Copy Letter'}</span>
                </button>
                <button
                  onClick={() => setShowCoverLetterModal(null)}
                  className="p-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-full text-neutral-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-neutral-950 font-mono text-xs text-neutral-300 whitespace-pre-line leading-relaxed border border-neutral-800 m-4 rounded-2xl">
              {generateCoverLetterText(showCoverLetterModal)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
