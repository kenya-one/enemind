/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Clock,
  MapPin,
  Bookmark,
  BookmarkCheck,
  CheckCircle,
  Users,
  ShieldCheck,
  Briefcase,
  AlertCircle,
} from 'lucide-react';
import { Task, TaskStatus, RemoteType } from '../../types/index.js';
import { useCurrency } from '../../context/CurrencyContext.js';

interface TaskCardProps {
  key?: React.Key;
  task: Task;
  isSaved?: boolean;
  onSelect: (task: Task) => void;
  onToggleSave?: (taskId: string, e: React.MouseEvent) => void;
  onApply?: (task: Task, e: React.MouseEvent) => void;
}

export function TaskCard({ task, isSaved = false, onSelect, onToggleSave, onApply }: TaskCardProps) {
  const { formatPrice } = useCurrency();

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.APPLICATIONS_OPEN:
      case TaskStatus.PUBLISHED:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Open
          </span>
        );
      case TaskStatus.IN_PROGRESS:
      case TaskStatus.ASSIGNED:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
            In Progress
          </span>
        );
      case TaskStatus.SUBMITTED:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Under Review
          </span>
        );
      case TaskStatus.REVISION_REQUESTED:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
            Revision Requested
          </span>
        );
      case TaskStatus.COMPLETED:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <CheckCircle className="w-3 h-3" />
            Completed
          </span>
        );
      case TaskStatus.DISPUTED:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertCircle className="w-3 h-3" />
            Disputed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
            {status}
          </span>
        );
    }
  };

  const getRemoteBadge = (remoteType: RemoteType) => {
    switch (remoteType) {
      case RemoteType.REMOTE:
        return <span className="text-[11px] font-medium text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">Remote</span>;
      case RemoteType.HYBRID:
        return <span className="text-[11px] font-medium text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">Hybrid</span>;
      case RemoteType.ON_SITE:
        return <span className="text-[11px] font-medium text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/40">On-Campus / On-Site</span>;
    }
  };

  const formatDaysLeft = (deadlineDate: string) => {
    const diff = new Date(deadlineDate).getTime() - Date.now();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days < 0) return 'Expired';
    if (days === 0) return 'Due today';
    if (days === 1) return '1 day left';
    return `${days} days left`;
  };

  return (
    <div
      onClick={() => onSelect(task)}
      className="group relative flex flex-col justify-between bg-slate-900/80 hover:bg-slate-900 border border-slate-800/80 hover:border-blue-500/40 rounded-xl p-5 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md hover:shadow-blue-950/20"
    >
      <div className="space-y-3.5">
        {/* Top bar: Category + Status + Save button */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-semibold text-blue-400 bg-blue-950/80 px-2.5 py-0.5 rounded-full border border-blue-800/40 uppercase tracking-wider">
              {task.category.replace(/_/g, ' ')}
            </span>
            {getStatusBadge(task.status)}
            {getRemoteBadge(task.remoteType)}
          </div>

          {onToggleSave && (
            <button
              onClick={(e) => onToggleSave(task.id, e)}
              className="text-slate-400 hover:text-amber-400 p-1 rounded-lg hover:bg-slate-800/60 transition-colors"
              title={isSaved ? 'Remove from saved' : 'Save task'}
            >
              {isSaved ? (
                <BookmarkCheck className="w-4 h-4 text-amber-400 fill-amber-400/20" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>
          )}
        </div>

        {/* Task Title */}
        <div>
          <h3 className="text-base font-bold text-slate-100 group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
            {task.title}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
            {task.description}
          </p>
        </div>

        {/* Skills Pills */}
        {task.skills && task.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {task.skills.slice(0, 4).map((skill, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium text-slate-300 bg-slate-800/90 px-2 py-0.5 rounded border border-slate-700/50"
              >
                {skill}
              </span>
            ))}
            {task.skills.length > 4 && (
              <span className="text-[11px] font-medium text-slate-500 bg-slate-800/40 px-1.5 py-0.5 rounded">
                +{task.skills.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Poster & Campus details */}
        <div className="flex items-center gap-2 pt-1 text-xs text-slate-400">
          {task.posterAvatar ? (
            <img
              src={task.posterAvatar}
              alt={task.posterName}
              className="w-5 h-5 rounded-full object-cover border border-slate-700"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-slate-300 font-bold">
              {task.posterName.charAt(0)}
            </div>
          )}
          <span className="truncate font-medium text-slate-300">{task.posterName}</span>
          {task.posterVerified && (
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" title="Verified Poster" />
          )}

          {task.campusName && (
            <>
              <span className="text-slate-600">•</span>
              <span className="truncate flex items-center gap-1 text-slate-400">
                <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                {task.campusName}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Card Footer: Budget + Proposals / Deadline + Action */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
        <div>
          <div className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
            {task.budgetType === 'HOURLY' ? 'Hourly Rate' : 'Budget'}
          </div>
          <div className="text-base font-extrabold text-emerald-400">
            {formatPrice(task.budgetMin, task.currency)}
            {task.budgetMax && task.budgetMax > task.budgetMin && ` - ${formatPrice(task.budgetMax, task.currency)}`}
            {task.budgetType === 'HOURLY' && <span className="text-xs font-medium text-slate-400">/hr</span>}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right text-[11px] text-slate-400 space-y-0.5">
            <div className="flex items-center justify-end gap-1 text-slate-300 font-medium">
              <Users className="w-3 h-3 text-slate-500" />
              <span>{task.proposalsCount || 0} {task.proposalsCount === 1 ? 'proposal' : 'proposals'}</span>
            </div>
            <div className="flex items-center justify-end gap-1 text-slate-400">
              <Clock className="w-3 h-3 text-slate-500" />
              <span>{formatDaysLeft(task.deadline)}</span>
            </div>
          </div>

          {task.status === TaskStatus.APPLICATIONS_OPEN && onApply && (
            <button
              onClick={(e) => onApply(task, e)}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              Apply
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
