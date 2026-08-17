import React, { useState } from 'react';
import { X, Folder, FileSpreadsheet, RefreshCw, CheckCircle2, ExternalLink, HardDrive, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { DriveSheetsService } from '../services/driveSheetsService';
import { SheetEntry } from '../types';

export const DriveSyncModal: React.FC = () => {
  const { isDriveModalOpen, closeDriveModal, showToast } = useApp();
  const { user } = useAuth();
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedSheetName, setSelectedSheetName] = useState<string | null>(null);

  if (!isDriveModalOpen || !user) return null;

  const sheets: SheetEntry[] = DriveSheetsService.getSheetsForUser(user);
  const activeSheet = sheets.find((s) => s.sheetName === selectedSheetName) || sheets[0];

  const handleTriggerSync = async () => {
    setIsSyncing(true);
    try {
      const result = await DriveSheetsService.syncAllUserSheets(user.id);
      showToast(`Synced ${result.syncedSheets} Google Sheets (${result.totalRows} rows) into Supabase Index Cache!`);
    } catch {
      showToast('Sync failed. Please verify Drive credentials.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleExportCSV = (sheet: SheetEntry) => {
    const headers = sheet.columns.join(',');
    const rows = sheet.sampleRows.map((r) => sheet.columns.map((c) => r[c] || '').join(',')).join('\n');
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${sheet.sheetName}_EnemindData.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${sheet.sheetName}.csv successfully!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
              <Folder className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">{user.driveFolderName}</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Source of Truth
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Google Drive API + Sheets Auto-Provisioned • Supabase Read Cache
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTriggerSync}
              disabled={isSyncing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync to Supabase'}</span>
            </button>

            <button
              onClick={closeDriveModal}
              className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 overflow-hidden">
          
          {/* Left Column: List of Auto-Provisioned Sheets */}
          <div className="p-4 border-r border-slate-100 bg-slate-50/50 space-y-2 overflow-y-auto">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider px-2">
              <span>Drive Sheets ({sheets.length})</span>
              <span className="text-[10px] text-emerald-600">Auto-Linked</span>
            </div>

            {sheets.map((sheet) => {
              const isSelected = activeSheet?.sheetName === sheet.sheetName;
              return (
                <button
                  key={sheet.sheetName}
                  onClick={() => setSelectedSheetName(sheet.sheetName)}
                  className={`w-full text-left p-3 rounded-2xl border transition flex items-start justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-white border-blue-500 shadow-xs ring-2 ring-blue-100'
                      : 'bg-white/80 border-slate-200 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{sheet.sheetName}</p>
                      <p className="text-[11px] text-slate-500">
                        {sheet.rowCount} rows • {sheet.columns.length} columns
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0">{sheet.syncStatus}</span>
                </button>
              );
            })}

            {/* Architecture Info Box */}
            <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-100 text-[11px] text-blue-900 space-y-1">
              <p className="font-bold flex items-center gap-1">
                <HardDrive className="w-3.5 h-3.5 text-blue-600" />
                Zero-Cost Data Engine
              </p>
              <p className="text-slate-600 leading-relaxed">
                All data resides in your personal Google Sheet. Supabase pulls hourly deltas (via modifiedTime check) for blazing-fast search without database hosting costs.
              </p>
            </div>
          </div>

          {/* Right Column: Sheet Table Preview */}
          <div className="md:col-span-2 p-6 flex flex-col justify-between overflow-y-auto bg-white">
            {activeSheet ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                      <span>{activeSheet.sheetName}</span>
                    </h4>
                    <p className="text-xs text-slate-500">
                      Last modified: <span className="font-medium text-slate-700">{activeSheet.lastModified}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleExportCSV(activeSheet)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-500" />
                      <span>Export CSV</span>
                    </button>

                    <a
                      href={`https://docs.google.com/spreadsheets/d/mock_${user.id}_${activeSheet.sheetName}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition"
                    >
                      <span>Open in Sheets</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  </div>
                </div>

                {/* Columns Definition */}
                <div>
                  <p className="text-xs font-semibold text-slate-600 mb-1.5">Columns Schema</p>
                  <div className="flex flex-wrap gap-1.5">
                    {activeSheet.columns.map((col) => (
                      <span
                        key={col}
                        className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs rounded-lg font-mono"
                      >
                        {col}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Table Data Preview */}
                <div className="border border-slate-200 rounded-2xl overflow-x-auto shadow-xs">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                        {activeSheet.columns.map((col) => (
                          <th key={col} className="py-2.5 px-3 font-semibold">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      {activeSheet.sampleRows.length > 0 ? (
                        activeSheet.sampleRows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-slate-50">
                            {activeSheet.columns.map((col) => (
                              <td key={col} className="py-2.5 px-3 whitespace-nowrap">
                                {String(row[col] ?? '—')}
                              </td>
                            ))}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={activeSheet.columns.length}
                            className="py-8 text-center text-slate-400"
                          >
                            No entries logged yet in this Sheet. Any action in Enemind will auto-write here!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                Select a sheet on the left to preview data.
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
