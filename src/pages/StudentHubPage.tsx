import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  DollarSign,
  Users,
  MessageSquare,
  Award,
  Sparkles,
  Gamepad2,
  Lock,
  Plus,
  CheckCircle,
  FileText,
  Star,
  Download,
  FolderSync
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { StudentStage } from '../types';

export const StudentHubPage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const {
    studyMaterials,
    quizzes,
    studyGroups,
    sendStudyGroupMessage,
    mentors,
    tournament,
    joinTournament,
    openCheckout,
    addStudyMaterial,
    openDriveModal,
    showToast
  } = useApp();

  const stage: StudentStage = user?.studentStage || 'campus';

  const [activeSubTab, setActiveSubTab] = useState<'notes' | 'quizzes' | 'groups' | 'mentors' | 'efootball' | 'earnings'>('notes');
  const [activeQuizIndex, setActiveQuizIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showQuizResult, setShowQuizResult] = useState(false);

  const [activeGroupId, setActiveGroupId] = useState(studyGroups[0]?.id || '');
  const [chatMessage, setChatMessage] = useState('');

  const [showUploadNote, setShowUploadNote] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteSubject, setNoteSubject] = useState('Engineering Mathematics');
  const [notePrice, setNotePrice] = useState(150);

  const [playerUsername, setPlayerUsername] = useState('Nairobi_Sniper99');

  const handleStageChange = (newStage: StudentStage) => {
    updateProfile({ studentStage: newStage });
    showToast(`Switched stage view to ${newStage.replace('_', ' ').toUpperCase()}`);
  };

  const handleAnswerSelect = (qIdx: number, optIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    sendStudyGroupMessage(activeGroupId, user ? user.name : 'Student', chatMessage.trim());
    setChatMessage('');
  };

  const handleUploadNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim()) return;

    addStudyMaterial({
      uploaderId: user?.id || 'user_student_campus',
      uploaderName: user?.name || 'Campus Creator',
      uploaderStage: 'campus',
      schoolName: user?.schoolName || 'University of Nairobi',
      title: noteTitle,
      gradeLevel: 'Campus (Degree/Diploma)',
      subject: noteSubject,
      isPaid: Number(notePrice) > 0,
      priceKes: Number(notePrice),
      previewUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80',
      fullContentPreview: 'Student verified revision notes and worked exam past paper questions.',
      driveFileUrl: 'https://drive.google.com/file/sample/view',
      tags: [noteSubject, 'Campus', 'Revision']
    });

    setNoteTitle('');
    setShowUploadNote(false);
  };

  const currentQuiz = quizzes[activeQuizIndex] || quizzes[0];
  const activeGroup = studyGroups.find((g) => g.id === activeGroupId) || studyGroups[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Stage Gating & Identity Switcher */}
      <div className="p-6 rounded-3xl bg-indigo-950 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center font-bold text-2xl shadow-lg shadow-indigo-600/30 shrink-0">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold font-display">
                {user?.name || 'Enemind Student Learning & Creator Hub'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[10px] font-bold uppercase">
                {stage.replace('_', ' ')} Stage
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {user?.schoolName || 'University of Nairobi / Kenyan Education System'}
            </p>
          </div>
        </div>

        {/* Stage Selector Pills */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 flex-wrap">
          <span className="text-[10px] text-slate-400 font-bold px-2 uppercase">Stage:</span>
          {(['cbc_primary', 'cbc_jss', 'high_school', 'campus'] as StudentStage[]).map((st) => (
            <button
              key={st}
              onClick={() => handleStageChange(st)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition cursor-pointer ${
                stage === st
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {st === 'cbc_primary' ? 'CBC Primary' : st === 'cbc_jss' ? 'CBC JSS' : st === 'high_school' ? 'High School' : 'Campus'}
            </button>
          ))}
        </div>
      </div>

      {/* Stage-Gated Feature Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubTab('notes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
            activeSubTab === 'notes' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>{stage === 'campus' || stage === 'high_school' ? 'Notes & Pastpapers' : 'Curated Study Materials'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('quizzes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
            activeSubTab === 'quizzes' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Career & CBC Competency Quizzes</span>
        </button>

        {/* Study Groups (Gated for JSS/HighSchool/Campus) */}
        {stage !== 'cbc_primary' && (
          <button
            onClick={() => setActiveSubTab('groups')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              activeSubTab === 'groups' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Study Groups & Peer Revision</span>
          </button>
        )}

        {/* Mentors */}
        <button
          onClick={() => setActiveSubTab('mentors')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
            activeSubTab === 'mentors' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Mentors Directory</span>
        </button>

        {/* Campus Only: Creator Earnings & 15% platform cut */}
        {stage === 'campus' && (
          <>
            <button
              onClick={() => setActiveSubTab('earnings')}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                activeSubTab === 'earnings' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Creator Earnings & 15% Cut</span>
            </button>

            <button
              onClick={() => setActiveSubTab('efootball')}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                activeSubTab === 'efootball' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Gamepad2 className="w-4 h-4 text-amber-400" />
              <span>eFootball Kenya Cup (Pilot)</span>
            </button>
          </>
        )}
      </div>

      {/* Safety Notice for CBC Primary / JSS */}
      {(stage === 'cbc_primary' || stage === 'cbc_jss') && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <b>Safety-First Child Protection Active:</b> Direct messaging with strangers and open selling are strictly disabled for this grade stage under Kenyan child privacy laws.
            </span>
          </div>
          <span className="font-semibold text-emerald-800">Protected Mode</span>
        </div>
      )}

      {/* Content Area */}

      {/* 1. Notes & Pastpapers Marketplace */}
      {activeSubTab === 'notes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {stage === 'campus' ? 'Campus Notes & Solved Past Papers Marketplace' : 'Curated Study Materials & Guides'}
              </h2>
              <p className="text-xs text-slate-500">
                {stage === 'campus'
                  ? 'Buy & sell revision summaries with Pesapal. 85% goes directly to student creator.'
                  : 'Vetted curriculum resources from certified school departments.'}
              </p>
            </div>

            {stage === 'campus' && (
              <button
                onClick={() => setShowUploadNote(!showUploadNote)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition"
              >
                <Plus className="w-4 h-4" />
                <span>Upload & Sell Notes</span>
              </button>
            )}
          </div>

          {showUploadNote && (
            <form onSubmit={handleUploadNote} className="p-5 bg-indigo-50 rounded-3xl border border-indigo-200 space-y-3">
              <h3 className="text-xs font-bold text-indigo-900">Upload Campus Pastpaper / Summary Notes</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Notes Title (e.g. Calculus IV Worked Past Papers)"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-indigo-300 text-xs bg-white outline-none"
                />
                <input
                  type="text"
                  required
                  placeholder="Subject / Course"
                  value={noteSubject}
                  onChange={(e) => setNoteSubject(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-indigo-300 text-xs bg-white outline-none"
                />
                <input
                  type="number"
                  required
                  placeholder="Price in KES (e.g. 150)"
                  value={notePrice}
                  onChange={(e) => setNotePrice(Number(e.target.value))}
                  className="px-3 py-2 rounded-xl border border-indigo-300 text-xs bg-white outline-none"
                />
              </div>
              <p className="text-[11px] text-indigo-700">
                Notes stay stored in your personal Google Drive. On each sale, you receive 85% directly to your M-Pesa.
              </p>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-xs"
              >
                Publish & Log to Notes_Pastpapers Sheet
              </button>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {studyMaterials.map((mat) => (
              <div
                key={mat.id}
                className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                      {mat.gradeLevel}
                    </span>
                    <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400" /> {mat.rating}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                    {mat.title}
                  </h3>

                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {mat.fullContentPreview}
                  </p>

                  <div className="mt-3 flex items-center gap-1 text-[11px] text-slate-400">
                    <span>By {mat.uploaderName}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-400">Price</p>
                    <p className="text-sm font-extrabold text-indigo-700">
                      {mat.isPaid ? `KES ${mat.priceKes}` : 'Free'}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      if (mat.isPaid) {
                        openCheckout({
                          orderId: `NOTE-${Date.now()}`,
                          itemTitle: mat.title,
                          amountKes: mat.priceKes,
                          customerName: user ? user.name : 'Student',
                          customerEmail: user ? user.email : 'student@enemind.co.ke',
                          customerPhone: user?.phone || '+254700000000',
                          sellerId: mat.uploaderId,
                          sellerName: mat.uploaderName,
                          sellerType: 'student',
                          isStudentContent: true
                        });
                      } else {
                        showToast('Opening free study notes preview!');
                      }
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                  >
                    {mat.isPaid ? 'Unlock via Pesapal' : 'Download Free'}
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Career & CBC Competency Quizzes */}
      {activeSubTab === 'quizzes' && (
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold uppercase">
                {currentQuiz.gradeLevel} • {currentQuiz.subject}
              </span>
              <h2 className="text-lg font-bold text-slate-900 font-display mt-1">
                {currentQuiz.title}
              </h2>
              <p className="text-xs text-slate-500">Competency: {currentQuiz.competencyArea}</p>
            </div>
            <div className="flex gap-2">
              {quizzes.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => {
                    setActiveQuizIndex(idx);
                    setSelectedAnswers({});
                    setShowQuizResult(false);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                    activeQuizIndex === idx
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Quiz {idx + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {currentQuiz.questions.map((q, qIdx) => (
              <div key={qIdx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <p className="text-xs font-bold text-slate-900">
                  Question {qIdx + 1}: {q.question}
                </p>
                <div className="space-y-1.5">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = selectedAnswers[qIdx] === optIdx;
                    const isCorrect = optIdx === q.correctIndex;
                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleAnswerSelect(qIdx, optIdx)}
                        className={`w-full text-left p-2.5 rounded-xl text-xs font-medium border transition cursor-pointer flex items-center justify-between ${
                          showQuizResult
                            ? isCorrect
                              ? 'bg-emerald-100 border-emerald-400 text-emerald-900'
                              : isSelected
                              ? 'bg-rose-100 border-rose-400 text-rose-900'
                              : 'bg-white border-slate-200 text-slate-700'
                            : isSelected
                            ? 'bg-indigo-100 border-indigo-400 text-indigo-900 ring-2 ring-indigo-200'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span>{opt}</span>
                        {showQuizResult && isCorrect && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                      </button>
                    );
                  })}
                </div>
                {showQuizResult && (
                  <p className="text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-slate-200 mt-2">
                    <b>Explanation:</b> {q.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowQuizResult(true)}
            className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition cursor-pointer"
          >
            Check Answers & Score Competency
          </button>
        </div>
      )}

      {/* 3. Study Groups Chat (Firestore Peer Revision) */}
      {activeSubTab === 'groups' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs min-h-[450px]">
          
          {/* Group List */}
          <div className="p-4 border-r border-slate-100 bg-slate-50 space-y-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2">
              Active Peer Study Groups
            </h3>
            {studyGroups.map((grp) => (
              <button
                key={grp.id}
                onClick={() => setActiveGroupId(grp.id)}
                className={`w-full text-left p-3 rounded-2xl border transition cursor-pointer ${
                  activeGroupId === grp.id
                    ? 'bg-white border-indigo-500 shadow-xs ring-2 ring-indigo-100'
                    : 'bg-white/80 border-slate-200 hover:bg-white'
                }`}
              >
                <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{grp.name}</h4>
                <p className="text-[11px] text-slate-500">{grp.memberCount} members • {grp.campusOrSchool}</p>
              </button>
            ))}
          </div>

          {/* Group Chat */}
          <div className="md:col-span-2 p-6 flex flex-col justify-between">
            <div className="border-b border-slate-100 pb-3 mb-3">
              <h3 className="text-sm font-bold text-slate-900">{activeGroup?.name}</h3>
              <p className="text-xs text-slate-500">{activeGroup?.description}</p>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 mb-4 max-h-72">
              {activeGroup?.messages.map((msg) => (
                <div key={msg.id} className="flex items-start gap-2.5">
                  <img
                    src={msg.senderAvatar}
                    alt={msg.senderName}
                    className="w-7 h-7 rounded-full object-cover border border-slate-200"
                  />
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-2.5 text-xs max-w-md">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span className="font-bold text-slate-900">{msg.senderName}</span>
                      <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                    </div>
                    <p className="text-slate-700">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Type a revision question or attach notes..."
                className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition cursor-pointer"
              >
                Send
              </button>
            </form>
          </div>

        </div>
      )}

      {/* 4. Mentors */}
      {activeSubTab === 'mentors' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mentors.map((m) => (
            <div
              key={m.id}
              className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={m.avatarUrl}
                    alt={m.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-100"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{m.name}</h3>
                    <p className="text-xs text-indigo-600 font-semibold">{m.title}</p>
                    <p className="text-[11px] text-slate-400">{m.institution}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{m.bio}</p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {m.expertise.map((exp) => (
                    <span
                      key={exp}
                      className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-medium"
                    >
                      {exp}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900">
                    KES {m.hourlyRateKes.toLocaleString()} / session
                  </span>
                </div>
                <button
                  onClick={() => showToast(`1:1 Mentorship booked with ${m.name}`)}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  Book Session
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* 5. Creator Earnings & 15% Platform Cut (Campus Stage) */}
      {activeSubTab === 'earnings' && stage === 'campus' && (
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Campus Notes Creator Revenue</h3>
              <p className="text-xs text-slate-500">
                You receive 85% of each sale directly to your M-Pesa. Enemind platform fee is 15%.
              </p>
            </div>
            <button
              onClick={openDriveModal}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold"
            >
              <FolderSync className="w-3.5 h-3.5" />
              <span>Earnings Sheet</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
              <p className="text-xs text-indigo-600 font-semibold">Total Gross Sales</p>
              <p className="text-2xl font-extrabold text-indigo-950 mt-1">KES 57,600</p>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
              <p className="text-xs text-emerald-600 font-semibold">Your Net Earnings (85%)</p>
              <p className="text-2xl font-extrabold text-emerald-950 mt-1">KES 48,960</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <p className="text-xs text-slate-600 font-semibold">Platform Fee (15%)</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">KES 8,640</p>
            </div>
          </div>
        </div>
      )}

      {/* 6. eFootball Kenya Campus Cup (Pilot) */}
      {activeSubTab === 'efootball' && stage === 'campus' && (
        <div className="p-6 bg-slate-950 text-white rounded-3xl border border-slate-800 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold uppercase">
                  Manual Pilot Season 1
                </span>
              </div>
              <h2 className="text-xl font-bold font-display">{tournament.title}</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Low-stakes entry: <b>10 KSH</b> • Prize pool: <b>KES {tournament.prizePoolKes.toLocaleString()}</b>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={playerUsername}
                onChange={(e) => setPlayerUsername(e.target.value)}
                placeholder="Your eFootball Tag"
                className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white outline-none"
              />
              <button
                onClick={() => joinTournament(playerUsername)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                Join (10 KSH Entry)
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Single-Elimination Bracket Matches
            </h3>
            {tournament.bracket.map((match) => (
              <div
                key={match.matchId}
                className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-between"
              >
                <div className="text-xs space-y-1">
                  <p className="font-bold text-slate-300">{match.round}</p>
                  <p className="text-slate-400">
                    <span className="text-white font-semibold">{match.player1.username}</span> vs{' '}
                    <span className="text-white font-semibold">{match.player2.username}</span>
                  </p>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    match.status === 'confirmed'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {match.status === 'confirmed' ? `Winner: ${match.winner}` : 'Pending Match'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
