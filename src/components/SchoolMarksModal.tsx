import React, { useState } from 'react';
import { X, Award, CheckCircle2, FileText, Download } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { StudentMarkRow } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const SchoolMarksModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { addSchoolMark, schoolMarks, showToast } = useApp();
  const { user } = useAuth();

  const [studentName, setStudentName] = useState('Zawadi Achieng');
  const [studentId, setStudentId] = useState('ADM-8901');
  const [gradeClass, setGradeClass] = useState('Grade 8 Blue');
  const [subject, setSubject] = useState('Integrated Science');
  const [term, setTerm] = useState<'Term 1' | 'Term 2' | 'Term 3'>('Term 1');
  const [assessmentType, setAssessmentType] = useState<'CBC Competency' | 'Midterm Exam' | 'Endterm Exam' | 'Project'>('CBC Competency');
  const [cbcRating, setCbcRating] = useState<'Exceeding Expectation' | 'Meeting Expectation' | 'Approaching Expectation' | 'Below Expectation'>('Meeting Expectation');
  const [teacherRemarks, setTeacherRemarks] = useState('Great analytical and practical problem-solving competency.');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mark: StudentMarkRow = {
      studentId,
      studentName,
      gradeClass,
      subject,
      term,
      assessmentType,
      cbcRating,
      teacherRemarks,
      date: new Date().toISOString().split('T')[0]
    };

    addSchoolMark(mark);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-purple-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-sm">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">CBC Competency Mark Entry</h3>
              <p className="text-[11px] text-purple-700 font-medium">Auto-writes to School's "Marks" Drive Sheet</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-purple-100 text-slate-400 hover:text-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Student Name</label>
              <input
                type="text"
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:border-purple-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Admission No</label>
              <input
                type="text"
                required
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:border-purple-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Class / Grade</label>
              <select
                value={gradeClass}
                onChange={(e) => setGradeClass(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:border-purple-500 outline-none bg-white"
              >
                <option>Grade 7 East</option>
                <option>Grade 8 Blue</option>
                <option>Grade 9 Green</option>
                <option>Form 3 West</option>
                <option>Form 4 East</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Subject / Strand</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:border-purple-500 outline-none bg-white"
              >
                <option>Integrated Science</option>
                <option>Mathematics</option>
                <option>Pre-Technical Studies</option>
                <option>English</option>
                <option>Kiswahili</option>
                <option>Social Studies</option>
                <option>Agriculture & Nutrition</option>
              </select>
            </div>
          </div>

          {/* CBC Competency Scale Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2">
              CBC Competency Scale Rating
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Exceeding Expectation', color: 'border-emerald-500 bg-emerald-50 text-emerald-800' },
                { label: 'Meeting Expectation', color: 'border-blue-500 bg-blue-50 text-blue-800' },
                { label: 'Approaching Expectation', color: 'border-amber-500 bg-amber-50 text-amber-800' },
                { label: 'Below Expectation', color: 'border-rose-500 bg-rose-50 text-rose-800' }
              ].map((item) => (
                <button
                  type="button"
                  key={item.label}
                  onClick={() => setCbcRating(item.label as any)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition ${
                    cbcRating === item.label
                      ? `${item.color} ring-2 ring-purple-300`
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Teacher's Qualitative Remarks</label>
            <textarea
              rows={2}
              value={teacherRemarks}
              onChange={(e) => setTeacherRemarks(e.target.value)}
              placeholder="e.g. Has demonstrated mastery in botanical taxonomy and laboratory safety."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:border-purple-500 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition cursor-pointer"
          >
            Save to School Google Sheet & Notify Parent
          </button>
        </form>

      </div>
    </div>
  );
};
