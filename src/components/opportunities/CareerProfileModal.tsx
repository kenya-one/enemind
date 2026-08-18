/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  GraduationCap,
  Briefcase,
  Award,
  Sparkles,
  Save,
  Plus,
  Trash2,
  Lock,
  Globe,
  FileText,
  CheckCircle2,
} from 'lucide-react';
import { CareerProfile } from '../../types/index.js';
import { api } from '../../services/api.js';

interface CareerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export function CareerProfileModal({ isOpen, onClose, onSaved }: CareerProfileModalProps) {
  const [headline, setHeadline] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const [skills, setSkills] = useState<string>('');
  const [interests, setInterests] = useState<string>('');
  const [targetRoles, setTargetRoles] = useState<string>('');
  const [preferredLocations, setPreferredLocations] = useState<string>('');
  const [githubUrl, setGithubUrl] = useState<string>('');
  const [linkedinUrl, setLinkedinUrl] = useState<string>('');
  const [portfolioUrl, setPortfolioUrl] = useState<string>('');
  const [resumeDriveFileId, setResumeDriveFileId] = useState<string>('');
  const [resumeFileName, setResumeFileName] = useState<string>('My_University_Resume_2026.pdf');
  const [isPublicToEmployers, setIsPublicToEmployers] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadProfile();
    }
  }, [isOpen]);

  async function loadProfile() {
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.getCareerProfile();
      if (res.profile) {
        const p = res.profile;
        setHeadline(p.headline || '');
        setBio(p.bio || '');
        setSkills(p.skills ? p.skills.join(', ') : '');
        setInterests(p.interests ? p.interests.join(', ') : '');
        setTargetRoles(p.targetRoles ? p.targetRoles.join(', ') : '');
        setPreferredLocations(p.preferredLocations ? p.preferredLocations.join(', ') : '');
        setGithubUrl(p.githubUrl || '');
        setLinkedinUrl(p.linkedinUrl || '');
        setPortfolioUrl(p.portfolioUrl || '');
        setResumeDriveFileId(p.resumeDriveFileId || '');
        setResumeFileName(p.resumeFileName || 'My_University_Resume_2026.pdf');
        setIsPublicToEmployers(p.isPublicToEmployers || false);
      }
    } catch (err: any) {
      console.error('Failed to load career profile:', err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    try {
      setIsSaving(true);
      setError(null);

      const parsedSkills = skills
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const parsedInterests = interests
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const parsedRoles = targetRoles
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const parsedLocations = preferredLocations
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      await api.saveCareerProfile({
        headline,
        bio,
        skills: parsedSkills,
        interests: parsedInterests,
        targetRoles: parsedRoles,
        preferredLocations: parsedLocations,
        githubUrl,
        linkedinUrl,
        portfolioUrl,
        resumeDriveFileId,
        resumeFileName,
        isPublicToEmployers,
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      if (onSaved) onSaved();
    } catch (err: any) {
      setError(err.message || 'Failed to save career profile.');
    } finally {
      setIsSaving(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div
        id="modal-career-profile"
        className="relative w-full max-w-2xl my-8 bg-[#12141D] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#50E3C2]/10 text-[#50E3C2] flex items-center justify-center border border-[#50E3C2]/20">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Student Career Profile</h2>
              <p className="text-xs text-white/40">Private by default. Powers AI job matching & 1-click applications.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 rounded-full border-2 border-[#50E3C2] border-t-transparent animate-spin mx-auto" />
          </div>
        ) : (
          <form onSubmit={handleSave} className="p-6 overflow-y-auto flex-1 space-y-5">
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
                {error}
              </div>
            )}

            {saveSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Career profile updated successfully!</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs text-white/60 font-medium">Professional Headline</label>
              <input
                type="text"
                placeholder="e.g. Computer Science Junior | Aspiring Cloud & ML Engineer"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#50E3C2]/50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-white/60 font-medium">Bio & Career Objective</label>
              <textarea
                rows={3}
                placeholder="Brief summary of your academic focus, passions, and what internships or projects you are seeking..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#50E3C2]/50 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-white/60 font-medium">Core Skills (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="Python, React, Data Analysis, SQL, Java"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#50E3C2]/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-white/60 font-medium">Target Roles (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="Software Engineer Intern, Data Analyst, Product Intern"
                  value={targetRoles}
                  onChange={(e) => setTargetRoles(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#50E3C2]/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-white/60 font-medium">GitHub Profile</label>
                <input
                  type="url"
                  placeholder="https://github.com/username"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#50E3C2]/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-white/60 font-medium">LinkedIn Profile</label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/username"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#50E3C2]/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-white/60 font-medium">Portfolio / Website</label>
                <input
                  type="url"
                  placeholder="https://myportfolio.dev"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#50E3C2]/50"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <FileText className="w-4 h-4 text-[#50E3C2]" />
                <span>Default Resume / CV Document</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={resumeFileName}
                  onChange={(e) => setResumeFileName(e.target.value)}
                  placeholder="Resume filename or Drive URL"
                  className="flex-1 px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#50E3C2]/50"
                />
              </div>
              <p className="text-[11px] text-white/40">
                Connected to your Private Google Drive Vault for seamless 1-click applications.
              </p>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-white/50">
                <Lock className="w-3.5 h-3.5" />
                <span>Protected by Enermind Privacy Shield</span>
              </div>

              <button
                id="btn-save-career-profile"
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 rounded-full bg-[#50E3C2] hover:bg-[#40cbb0] text-black font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : 'Save Profile'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
