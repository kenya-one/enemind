import React, { useState } from 'react';
import {
  GraduationCap,
  Award,
  ListTodo,
  DollarSign,
  Calendar,
  Bell,
  BookOpen,
  Plus,
  FileSpreadsheet,
  CheckCircle2,
  Lock,
  ShieldAlert,
  Users,
  Download,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { SchoolMarksModal } from '../components/SchoolMarksModal';
import { CustomTracker, StudentMarkRow } from '../types';

export const SchoolDashboard: React.FC = () => {
  const { user, isFinanceOfficerMode, setFinanceOfficerMode } = useAuth();
  const {
    schoolMarks,
    customTrackers,
    updateTrackerRecord,
    addNewTracker,
    openDriveModal,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'marks' | 'trackers' | 'fees' | 'notices' | 'materials'>('marks');
  const [isMarksModalOpen, setIsMarksModalOpen] = useState(false);
  const [newTrackerName, setNewTrackerName] = useState('');
  const [newTrackerCol, setNewTrackerCol] = useState('');
  const [showNewTrackerForm, setShowNewTrackerForm] = useState(false);

  // Fee management sample rows
  const [feeRecords, setFeeRecords] = useState([
    { id: 'FEE-1', studentName: 'Zawadi Achieng', grade: 'Grade 8 Blue', feeTotalKes: 32000, feePaidKes: 32000, balanceKes: 0, status: 'Cleared' },
    { id: 'FEE-2', studentName: 'Kevin Kiprop', grade: 'Grade 8 Blue', feeTotalKes: 32000, feePaidKes: 18000, balanceKes: 14000, status: 'Partial Balance' },
    { id: 'FEE-3', studentName: 'David Kariuki', grade: 'Form 4 East', feeTotalKes: 45000, feePaidKes: 45000, balanceKes: 0, status: 'Cleared' }
  ]);

  const handleRecordFeePayment = (id: string, amount: number) => {
    setFeeRecords((prev) =>
      prev.map((f) => {
        if (f.id !== id) return f;
        const newPaid = f.feePaidKes + amount;
        const newBal = Math.max(0, f.feeTotalKes - newPaid);
        return {
          ...f,
          feePaidKes: newPaid,
          balanceKes: newBal,
          status: newBal === 0 ? 'Cleared' : 'Partial Balance'
        };
      })
    );
    showToast('Fee payment recorded and auto-written to Fee_Tracker Google Sheet!');
  };

  const handleCreateTracker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrackerName.trim()) return;
    const cols = newTrackerCol.split(',').map((c) => c.trim()).filter(Boolean);
    addNewTracker(
      newTrackerName,
      'Custom event / checklist tracker',
      cols.length > 0 ? cols : ['Paid (KES)', 'Permission Slip Signed', 'Bus Assigned']
    );
    setNewTrackerName('');
    setNewTrackerCol('');
    setShowNewTrackerForm(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* School Organisation Header */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-bold text-2xl shadow-md shadow-purple-600/20 shrink-0">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
                {user?.schoolName || 'Alliance High & Riara Springs Academy'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold">
                Verified School Portal
              </span>
              {isFinanceOfficerMode && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold">
                  Finance Officer Role Active
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              CBC Primary, JSS & High School Academic Administration • Google Drive Sheets Source of Truth
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setFinanceOfficerMode(!isFinanceOfficerMode)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
              isFinanceOfficerMode
                ? 'bg-amber-100 border-amber-300 text-amber-900'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {isFinanceOfficerMode ? 'Exit Finance Role' : 'Toggle Finance Officer Role'}
          </button>

          <button
            onClick={openDriveModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold hover:bg-purple-100 transition"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Open School Sheets</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-slate-200 pb-2">
        {[
          { id: 'marks', label: 'CBC Marks & Competencies', icon: <Award className="w-4 h-4" /> },
          { id: 'trackers', label: 'Custom Trackers & Checklists', icon: <ListTodo className="w-4 h-4" /> },
          { id: 'fees', label: 'Fee Management & Finance', icon: <DollarSign className="w-4 h-4" /> },
          { id: 'notices', label: 'School Notices & Broadcasts', icon: <Bell className="w-4 h-4" /> },
          { id: 'materials', label: 'Approved Study Materials', icon: <BookOpen className="w-4 h-4" /> }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Marks Entry & Reports */}
      {activeTab === 'marks' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">CBC Competency Scale Assessments</h2>
              <p className="text-xs text-slate-500">
                Qualitative ratings (Exceeding / Meeting / Approaching / Below Expectation) synced to Marks sheet.
              </p>
            </div>
            <button
              onClick={() => setIsMarksModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>Enter New Student Mark</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                    <th className="py-3 px-4 font-semibold">Adm No</th>
                    <th className="py-3 px-4 font-semibold">Student Name</th>
                    <th className="py-3 px-4 font-semibold">Class / Grade</th>
                    <th className="py-3 px-4 font-semibold">Subject</th>
                    <th className="py-3 px-4 font-semibold">Term</th>
                    <th className="py-3 px-4 font-semibold">CBC Rating</th>
                    <th className="py-3 px-4 font-semibold">Remarks</th>
                    <th className="py-3 px-4 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {schoolMarks.map((m, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono font-bold text-purple-700">{m.studentId}</td>
                      <td className="py-3 px-4 font-semibold">{m.studentName}</td>
                      <td className="py-3 px-4">{m.gradeClass}</td>
                      <td className="py-3 px-4">{m.subject}</td>
                      <td className="py-3 px-4">{m.term}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            m.cbcRating === 'Exceeding Expectation'
                              ? 'bg-emerald-100 text-emerald-800'
                              : m.cbcRating === 'Meeting Expectation'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {m.cbcRating}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 max-w-xs truncate">{m.teacherRemarks}</td>
                      <td className="py-3 px-4 text-slate-400">{m.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Custom Trackers & Checklists */}
      {activeTab === 'trackers' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Custom Event & Activity Trackers</h2>
              <p className="text-xs text-slate-500">
                Instant real-time checkbox status writes directly to Google Drive Sheets (e.g. Field Trips, Uniforms, PTA).
              </p>
            </div>
            <button
              onClick={() => setShowNewTrackerForm(!showNewTrackerForm)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Tracker Sheet</span>
            </button>
          </div>

          {showNewTrackerForm && (
            <form onSubmit={handleCreateTracker} className="p-4 bg-purple-50 rounded-2xl border border-purple-200 space-y-3">
              <h3 className="text-xs font-bold text-purple-900">New Custom Tracker Setup</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Tracker Name (e.g. Term 2 Olkaria Science Trip)"
                  value={newTrackerName}
                  onChange={(e) => setNewTrackerName(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-purple-300 text-xs bg-white outline-none"
                />
                <input
                  type="text"
                  placeholder="Columns comma separated (e.g. Consent Signed, Fee Paid, Bus Assigned)"
                  value={newTrackerCol}
                  onChange={(e) => setNewTrackerCol(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-purple-300 text-xs bg-white outline-none"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold shadow-xs"
              >
                Provision Tracker Sheet in Drive
              </button>
            </form>
          )}

          {customTrackers.map((t) => (
            <div key={t.id} className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{t.trackerName}</h3>
                  <p className="text-xs text-slate-500">{t.description}</p>
                </div>
                <span className="text-[11px] font-mono font-semibold text-purple-700 bg-purple-50 px-2 py-1 rounded-lg">
                  {t.sheetName}
                </span>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                      <th className="py-2.5 px-3 font-semibold">Student Name</th>
                      <th className="py-2.5 px-3 font-semibold">Class</th>
                      <th className="py-2.5 px-3 font-semibold">Parent Phone</th>
                      {t.columns.map((c) => (
                        <th key={c} className="py-2.5 px-3 font-semibold">{c}</th>
                      ))}
                      <th className="py-2.5 px-3 font-semibold">Last Updated</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {t.records.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-semibold">{r.studentName}</td>
                        <td className="py-2.5 px-3">{r.grade}</td>
                        <td className="py-2.5 px-3 text-slate-500">{r.parentPhone}</td>
                        {t.columns.map((col) => {
                          const val = r.status[col];
                          const isDone = val === 'Yes' || String(val).includes('Paid');
                          return (
                            <td key={col} className="py-2.5 px-3">
                              <button
                                onClick={() =>
                                  updateTrackerRecord(
                                    t.id,
                                    r.id,
                                    col,
                                    isDone ? 'Pending' : 'Yes'
                                  )
                                }
                                className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition cursor-pointer ${
                                  isDone
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                    : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                                }`}
                              >
                                {String(val || 'Pending')}
                              </button>
                            </td>
                          );
                        })}
                        <td className="py-2.5 px-3 text-slate-400">{r.lastUpdated}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Fee Management & Finance Officer Role */}
      {activeTab === 'fees' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
            <DollarSign className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-bold text-amber-900">
                Scoped Finance Officer Access & Pesapal Connection
              </h3>
              <p className="text-[11px] text-amber-800 mt-0.5">
                The school bursar / finance team manages fee balances and connects Pesapal / M-Pesa Till without needing access to student marks or academic records.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Student Term Fee Register</h3>
              <span className="text-xs text-slate-500 font-mono">Sheet: Fee_Tracker</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                    <th className="py-3 px-4 font-semibold">Student Name</th>
                    <th className="py-3 px-4 font-semibold">Class</th>
                    <th className="py-3 px-4 font-semibold">Term Total</th>
                    <th className="py-3 px-4 font-semibold">Amount Paid</th>
                    <th className="py-3 px-4 font-semibold">Balance Due</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {feeRecords.map((f) => (
                    <tr key={f.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-semibold">{f.studentName}</td>
                      <td className="py-3 px-4">{f.grade}</td>
                      <td className="py-3 px-4">KES {f.feeTotalKes.toLocaleString()}</td>
                      <td className="py-3 px-4 text-emerald-600 font-bold">KES {f.feePaidKes.toLocaleString()}</td>
                      <td className="py-3 px-4 text-rose-600 font-bold">KES {f.balanceKes.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            f.status === 'Cleared' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {f.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {f.balanceKes > 0 && (
                          <button
                            onClick={() => handleRecordFeePayment(f.id, f.balanceKes)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold transition"
                          >
                            Mark Paid
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Notices */}
      {activeTab === 'notices' && (
        <div className="space-y-4">
          <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-2">Publish School Notice to Parents & Students</h3>
            <p className="text-xs text-slate-500 mb-4">
              Notices are published to your school profile page and logged in the "Notices" Google Drive sheet.
            </p>
            <div className="space-y-3">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900">Term 2 Academic Visiting Day & Science Fair</h4>
                  <span className="text-[10px] text-slate-500">2026-06-14</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  All parents are invited for open consultation with class teachers and exhibition of CBC robotics and agriculture projects.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Approved Study Materials */}
      {activeTab === 'materials' && (
        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">School Curated & Approved Study Materials</h3>
          <p className="text-xs text-slate-500">
            Vetted notes compiled by senior teachers. Students linked to your school can browse and access these free of charge.
          </p>
          <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-100 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-purple-900">CBC Grade 8 Integrated Science Strand Notes</h4>
              <p className="text-[11px] text-purple-700">KICD aligned worksheets & lab practical guides</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              Approved
            </span>
          </div>
        </div>
      )}

      {/* CBC Marks Entry Modal */}
      <SchoolMarksModal
        isOpen={isMarksModalOpen}
        onClose={() => setIsMarksModalOpen(false)}
      />

    </div>
  );
};
