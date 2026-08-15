import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileSpreadsheet,
  HardDrive,
  Users,
  Film,
  Image as ImageIcon,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  Download,
  Folder,
  X,
  FileText,
  UserCheck,
  Database,
  Lock,
  ArrowRight
} from 'lucide-react';
import { googleWorkspace, SheetUserRecord, GoogleDriveFileResult } from '../utils/googleWorkspace';
import { UserProfile } from '../types';

interface GoogleDatabaseViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
}

export const GoogleDatabaseViewerModal: React.FC<GoogleDatabaseViewerModalProps> = ({
  isOpen,
  onClose,
  currentUser
}) => {
  const [activeTab, setActiveTab] = useState<'sheet_auth' | 'user_drive'>('sheet_auth');
  const [sheetUsers, setSheetUsers] = useState<SheetUserRecord[]>([]);
  const [userDriveFiles, setUserDriveFiles] = useState<GoogleDriveFileResult[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const users = googleWorkspace.getAllSheetUsers();
      setSheetUsers(users);

      const email = currentUser.email || 'sidneywafula30@gmail.com';
      const files = googleWorkspace.getUserDriveFiles(email);
      setUserDriveFiles(files);
      setIsRefreshing(false);
    }, 300);
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, currentUser.email]);

  if (!isOpen) return null;

  const currentEmail = currentUser.email || 'sidneywafula30@gmail.com';
  const folderName = `KenyaHouseHunt_Reels_${currentEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-xl animate-in fade-in">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="relative w-full max-w-4xl bg-neutral-950 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-neutral-100 max-h-[92vh]"
        >
          {/* Top Header */}
          <div className="p-4 sm:p-5 border-b border-neutral-800 bg-neutral-900/80 backdrop-blur-xl flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg text-white flex items-center gap-2">
                  <span>Google Sheets & Google Drive Live Database</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                    Connected
                  </span>
                </h3>
                <p className="text-xs text-neutral-400">
                  Google Sheet: Master Sign-Up/Login DB • User Google Drive: Video & Photo Storage DB
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={loadData}
                disabled={isRefreshing}
                className="p-2 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                title="Refresh Live Google Data"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#FFD700]' : ''}`} />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Database Selector Tabs */}
          <div className="flex border-b border-neutral-800 bg-neutral-950 px-4 gap-2 pt-2">
            <button
              onClick={() => setActiveTab('sheet_auth')}
              className={`py-2.5 px-4 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'sheet_auth'
                  ? 'border-emerald-400 text-emerald-400'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>1. Google Sheet (Auth Database)</span>
              <span className="px-1.5 py-0.2 rounded-full bg-neutral-800 text-[10px] font-mono">
                {sheetUsers.length} users
              </span>
            </button>

            <button
              onClick={() => setActiveTab('user_drive')}
              className={`py-2.5 px-4 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'user_drive'
                  ? 'border-blue-400 text-blue-400'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              <HardDrive className="w-4 h-4 text-blue-400" />
              <span>2. User Google Drive (Media Database)</span>
              <span className="px-1.5 py-0.2 rounded-full bg-neutral-800 text-[10px] font-mono">
                {userDriveFiles.length} files
              </span>
            </button>
          </div>

          {/* Body Content */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-neutral-950 space-y-4 scrollbar-thin">
            {/* 1. GOOGLE SHEET AUTH DATABASE VIEW */}
            {activeTab === 'sheet_auth' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg">
                      📊
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <span>Master Google Sheet: User Auth Database</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded">
                          Sheet Tab: Users!A:H
                        </span>
                      </h4>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        Every user signup and login is saved as a verified record row in your Master Google Sheet.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Live Synced
                    </span>
                  </div>
                </div>

                {/* Google Sheet Table Display */}
                <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 overflow-hidden">
                  <div className="p-3 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between text-xs text-neutral-400 font-bold uppercase tracking-wider">
                    <span>Google Sheets Registered Users Table</span>
                    <span className="font-mono text-emerald-400">{sheetUsers.length} Recorded Rows</span>
                  </div>

                  <div className="overflow-x-auto max-h-80">
                    <table className="w-full text-left text-xs text-neutral-300">
                      <thead className="bg-neutral-950 text-[10px] uppercase tracking-wider text-neutral-400 border-b border-neutral-800">
                        <tr>
                          <th className="p-3">User & Profile</th>
                          <th className="p-3">Email Address</th>
                          <th className="p-3">Role</th>
                          <th className="p-3">Preferred Mode</th>
                          <th className="p-3">Drive Folder Link</th>
                          <th className="p-3">Last Login (EAT)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-800/60 font-mono text-[11px]">
                        {sheetUsers.map((user) => (
                          <tr key={user.id} className="hover:bg-neutral-800/40 transition-colors">
                            <td className="p-3 font-sans">
                              <div className="flex items-center gap-2">
                                <img
                                  src={user.avatarUrl}
                                  alt={user.fullName}
                                  className="w-7 h-7 rounded-full object-cover border border-neutral-700"
                                />
                                <div>
                                  <span className="font-bold text-white block">{user.fullName}</span>
                                  <span className="text-[10px] text-neutral-500 font-mono">{user.id}</span>
                                </div>
                              </div>
                            </td>
                            <td className="p-3 text-emerald-400">{user.email}</td>
                            <td className="p-3 font-sans">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-neutral-800 text-neutral-300 border border-neutral-700">
                                {user.role}
                              </span>
                            </td>
                            <td className="p-3 font-sans text-neutral-300">
                              {user.preferredMode === 'campus' ? '🎓 Campus Student' : '🇰🇪 Kenya General'}
                            </td>
                            <td className="p-3 text-blue-400">
                              <span className="flex items-center gap-1 font-mono text-[10px]">
                                <Folder className="w-3 h-3" />
                                {user.driveFolderId || 'drive_root'}
                              </span>
                            </td>
                            <td className="p-3 text-neutral-400 text-[10px]">
                              {new Date(user.lastLoginAt).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 2. USER GOOGLE DRIVE MEDIA DATABASE VIEW */}
            {activeTab === 'user_drive' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-lg">
                      📁
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <span>User Google Drive Folder:</span>
                        <span className="text-[11px] font-mono px-2 py-0.5 bg-blue-950 text-blue-300 border border-blue-800 rounded">
                          {folderName}
                        </span>
                      </h4>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        Videos (.mp4) and photos (.jpg/.png) posted by <strong>{currentEmail}</strong> are stored inside their private Google Drive storage.
                      </p>
                    </div>
                  </div>

                  <a
                    href={`https://drive.google.com/drive/search?q=${encodeURIComponent(folderName)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shrink-0 cursor-pointer"
                  >
                    <span>Open in Google Drive</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Stored Files Grid */}
                {userDriveFiles.length === 0 ? (
                  <div className="p-10 border-2 border-dashed border-neutral-800 rounded-2xl text-center space-y-3 bg-neutral-900/30">
                    <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto">
                      <HardDrive className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">No Drive Uploads Yet for {currentEmail}</h4>
                      <p className="text-xs text-neutral-400 max-w-sm mx-auto mt-1">
                        When you post a video or photo reel via the "Add / Post Reel" studio with Google Drive enabled, your files will be stored and indexed here automatically.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {userDriveFiles.map((file) => {
                      const isVideo = file.mimeType.startsWith('video/');
                      return (
                        <div
                          key={file.id}
                          className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-blue-500/50 transition-all flex flex-col justify-between space-y-2 group"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                                {isVideo ? <Film className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
                              </div>
                              <div className="min-w-0">
                                <h5 className="text-xs font-bold text-white truncate">{file.name}</h5>
                                <p className="text-[10px] text-neutral-400 font-mono truncate">{file.mimeType}</p>
                              </div>
                            </div>
                            <span className="px-1.5 py-0.5 rounded bg-neutral-800 text-[9px] font-mono text-neutral-400">
                              GDrive
                            </span>
                          </div>

                          <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-[11px]">
                            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Stored in Drive
                            </span>
                            <a
                              href={file.webViewLink}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 text-[11px]"
                            >
                              <span>View</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-4 border-t border-neutral-800 bg-neutral-900/90 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Google OAuth Verified • Drive Storage & Sheets DB Active</span>
            </div>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-[#FFD700] transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
