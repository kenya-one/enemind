/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Upload,
  HardDrive,
  FileText,
  ExternalLink,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { Task } from '../../types/index.js';
import { api } from '../../services/api.js';

interface SubmitDeliverableModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onDeliverableSubmitted: () => void;
}

export function SubmitDeliverableModal({
  task,
  isOpen,
  onClose,
  onDeliverableSubmitted,
}: SubmitDeliverableModalProps) {
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<{ name: string; url?: string; size?: number; isGoogleDrive?: boolean }[]>([]);
  const [newFileName, setNewFileName] = useState('');
  const [newFileUrl, setNewFileUrl] = useState('');
  const [isDriveFile, setIsDriveFile] = useState(false);

  const [links, setLinks] = useState<string[]>([]);
  const [newLink, setNewLink] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !task) return null;

  function addFile() {
    if (newFileName.trim()) {
      setFiles([
        ...files,
        {
          name: newFileName.trim(),
          url: newFileUrl.trim() || undefined,
          isGoogleDrive: isDriveFile,
        },
      ]);
      setNewFileName('');
      setNewFileUrl('');
      setIsDriveFile(false);
    }
  }

  function removeFile(index: number) {
    setFiles(files.filter((_, i) => i !== index));
  }

  function addLink() {
    if (newLink.trim()) {
      setLinks([...links, newLink.trim()]);
      setNewLink('');
    }
  }

  function removeLink(index: number) {
    setLinks(links.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!message.trim() || message.length < 15) {
      setError('Please provide submission notes detailing the work completed (at least 15 characters).');
      return;
    }

    if (files.length === 0 && links.length === 0) {
      setError('Please attach at least one deliverable file or external URL link.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await api.submitTaskDeliverable(task.id, {
        message: message.trim(),
        files,
        links,
      });

      if (res.success) {
        onDeliverableSubmitted();
        onClose();
      } else {
        setError('Failed to submit deliverable.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit deliverable.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-start justify-between gap-4 bg-slate-950/60 shrink-0">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-400" />
              <span>Submit Task Deliverables</span>
            </h2>
            <p className="text-xs text-slate-400">
              Deliverable for: <strong className="text-slate-200">{task.title}</strong>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Revision Indicator */}
          <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-800/40 flex items-center justify-between text-xs">
            <span className="text-blue-300 font-medium">
              Submitting Revision #{task.revisionCount + 1}
            </span>
            <span className="text-slate-400 font-mono">
              Max Revisions: {task.maxRevisions}
            </span>
          </div>

          {/* Submission Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
              Deliverable Summary & Notes *
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe the deliverables provided, how requirements were met, instructions to run/review the work..."
              rows={4}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500 leading-relaxed"
              required
            />
          </div>

          {/* File Attachments (Drive / Vault / Direct) */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Attach Deliverable Files / Google Drive Vault
            </label>

            <div className="space-y-2">
              {files.map((file, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-2 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-xs text-slate-200"
                >
                  <div className="flex items-center gap-2 truncate">
                    {file.isGoogleDrive ? (
                      <HardDrive className="w-4 h-4 text-blue-400 shrink-0" />
                    ) : (
                      <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                    <span className="font-medium truncate">{file.name}</span>
                    {file.isGoogleDrive && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-950 text-blue-400 border border-blue-800/40">
                        Google Drive
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {/* Add file row */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    placeholder="File name (e.g., Final_Report.pdf, Design_Assets.zip)"
                    className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="url"
                    value={newFileUrl}
                    onChange={(e) => setNewFileUrl(e.target.value)}
                    placeholder="Drive / Cloud URL link (optional)"
                    className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isDriveFile}
                      onChange={(e) => setIsDriveFile(e.target.checked)}
                      className="rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0 cursor-pointer"
                    />
                    <span>Google Drive Vault / Workspace File</span>
                  </label>

                  <button
                    type="button"
                    onClick={addFile}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add File</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* External Links */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              External Work Links (GitHub, Figma, Live Demo)
            </label>

            <div className="space-y-2">
              {links.map((link, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-xs text-blue-400 truncate"
                >
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate flex-1">{link}</span>
                  <button
                    type="button"
                    onClick={() => removeLink(i)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              <div className="flex gap-2">
                <input
                  type="url"
                  value={newLink}
                  onChange={(e) => setNewLink(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addLink())}
                  placeholder="https://figma.com/..., https://github.com/..., etc."
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={addLink}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Link</span>
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3 shrink-0">
          <span className="text-xs text-slate-400">
            Poster will be notified immediately to review the submission.
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Deliverable'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
