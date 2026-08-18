/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CheckCircle2, AlertTriangle, ShieldCheck, X, Sparkles, RefreshCw } from 'lucide-react';
import { useConfig } from '../context/ConfigContext.js';

export function IntegrationStatusModal() {
  const { isModalOpen, closeStatusModal, readiness, refreshConfig, unconfiguredCount } = useConfig();

  if (!isModalOpen || !readiness) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0B10]/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-xl bg-[#12141D] border border-white/10 rounded-2xl p-6 space-y-5 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#50E3C2]/10 text-[#50E3C2] flex items-center justify-center border border-[#50E3C2]/20">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">Production System Readiness</h3>
              <p className="text-[11px] text-white/40">Zero-secret client architecture status</p>
            </div>
          </div>
          <button
            onClick={closeStatusModal}
            className="p-1.5 text-white/40 hover:text-white rounded-lg bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Readiness Overview Banner */}
        <div
          className={`p-4 rounded-xl border flex items-center justify-between ${
            unconfiguredCount === 0
              ? 'bg-[#50E3C2]/10 border-[#50E3C2]/30 text-[#50E3C2]'
              : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
          }`}
        >
          <div className="flex items-center gap-3">
            {unconfiguredCount === 0 ? (
              <CheckCircle2 className="w-5 h-5 text-[#50E3C2]" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            )}
            <div>
              <p className="text-xs font-bold text-white">
                {unconfiguredCount === 0
                  ? 'All Enterprise Integrations Configured'
                  : `${unconfiguredCount} Integration(s) Require Server Credentials`}
              </p>
              <p className="text-[11px] text-white/50">
                {unconfiguredCount === 0
                  ? 'Gemini AI, Google OAuth, and PesaPal endpoints are live.'
                  : 'Features remain operable with fallback test endpoints.'}
              </p>
            </div>
          </div>

          <button
            onClick={refreshConfig}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 transition-colors"
            title="Refresh status"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Services Checklist */}
        <div className="space-y-2.5">
          
          {/* Gemini AI */}
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">Google Gemini 3.7 Flash</span>
                {readiness.geminiAi.configured ? (
                  <span className="text-[9px] bg-[#50E3C2]/10 text-[#50E3C2] border border-[#50E3C2]/30 px-1.5 py-0.5 rounded font-mono">
                    LIVE
                  </span>
                ) : (
                  <span className="text-[9px] bg-amber-500/10 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded font-mono">
                    FALLBACK
                  </span>
                )}
              </div>
              <p className="text-[11px] text-white/40 mt-1">
                Model: {readiness.geminiAi.model} • Server-side reasoning for exams, schedules, and past paper breakdown.
              </p>
            </div>
            <Sparkles className="w-4 h-4 text-[#50E3C2] shrink-0 mt-0.5" />
          </div>

          {/* Google Workspace */}
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">Google Workspace (Drive & Sheets REST v4)</span>
                <span className="text-[9px] bg-[#50E3C2]/10 text-[#50E3C2] border border-[#50E3C2]/30 px-1.5 py-0.5 rounded font-mono">
                  READY
                </span>
              </div>
              <p className="text-[11px] text-white/40 mt-1">
                Zero-knowledge private vault storage. Scopes: drive.file, drive.metadata.readonly, spreadsheets.
              </p>
            </div>
            <ShieldCheck className="w-4 h-4 text-[#50E3C2] shrink-0 mt-0.5" />
          </div>

          {/* PesaPal Gateway */}
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">PesaPal v3 Payment Gateway</span>
                {readiness.pesapalGateway.configured ? (
                  <span className="text-[9px] bg-[#50E3C2]/10 text-[#50E3C2] border border-[#50E3C2]/30 px-1.5 py-0.5 rounded font-mono">
                    ACTIVE
                  </span>
                ) : (
                  <span className="text-[9px] bg-white/10 text-white/60 border border-white/10 px-1.5 py-0.5 rounded font-mono">
                    SANDBOX_SIMULATION
                  </span>
                )}
              </div>
              <p className="text-[11px] text-white/40 mt-1">
                Environment: {readiness.pesapalGateway.environment} • IPN: {readiness.pesapalGateway.ipnStatus}
              </p>
            </div>
          </div>

        </div>

        {/* Action button */}
        <div className="pt-2">
          <button
            onClick={closeStatusModal}
            className="w-full py-2.5 bg-white hover:bg-white/90 text-black font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Close Status Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
