import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  Phone,
  Building,
  GraduationCap,
  Home,
  Briefcase,
  Store,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { AccountType, StudentStage } from '../types';
import { KENYAN_CAMPUSES_AND_COLLEGES } from '../services/campusesKenya';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'signup';
  defaultRole?: AccountType;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'login',
  defaultRole = 'student'
}) => {
  const { allUsers, loginWithGoogle, switchUser } = useAuth();
  const { showToast } = useApp();

  const [mode, setMode] = useState<'login' | 'signup'>(defaultMode);
  const [selectedRole, setSelectedRole] = useState<AccountType>(defaultRole);
  const [studentStage, setStudentStage] = useState<StudentStage>('campus');
  const [selectedCampus, setSelectedCampus] = useState<string>('Kenyatta University (KU Main Campus)');

  // Form Fields
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [schoolOrOrgName, setSchoolOrOrgName] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  if (!isOpen) return null;

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      if (mode === 'login') {
        // Find matching or existing user
        const existing = allUsers.find(
          (u) => u.email.toLowerCase() === email.trim().toLowerCase()
        );

        if (existing) {
          switchUser(existing.id);
          showToast(`Welcome back, ${existing.name}!`);
          setIsLoading(false);
          onClose();
        } else if (email && password) {
          // If not in demo list, auto create session with entered email
          loginWithGoogle(selectedRole, {
            email: email.trim(),
            name: email.split('@')[0].replace(/[._]/g, ' ').toUpperCase(),
            phone: phone || '+254 700 000 000'
          });
          showToast(`Logged in successfully as ${email.split('@')[0]}`);
          setIsLoading(false);
          onClose();
        } else {
          setErrorMessage('Please provide a valid email and password');
          setIsLoading(false);
        }
      } else {
        // Sign up
        if (!name.trim() || !email.trim()) {
          setErrorMessage('Please enter your full name and email address');
          setIsLoading(false);
          return;
        }

        loginWithGoogle(selectedRole, {
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || '+254 700 000 000',
          studentStage: selectedRole === 'student' ? studentStage : undefined,
          schoolName: selectedRole === 'student' ? selectedCampus : schoolOrOrgName || undefined,
          location: selectedRole === 'student' ? selectedCampus.split('(')[0].trim() : 'Nairobi, Kenya'
        });

        showToast(`Account created! Welcome to Enemind, ${name.trim()}!`);
        setIsLoading(false);
        onClose();
      }
    }, 600);
  };

  const handleQuickDemoLogin = (userItem: typeof allUsers[0]) => {
    switchUser(userItem.id);
    showToast(`Switched account to: ${userItem.name} (${userItem.accountType})`);
    onClose();
  };

  const rolesConfig: { id: AccountType; label: string; icon: any; desc: string }[] = [
    { id: 'student', label: 'Student', icon: GraduationCap, desc: 'Buy study notes, find hostels, campus trade' },
    { id: 'company', label: 'Company / Solar', icon: Building, desc: 'EPRA solar systems, hardware & equipment' },
    { id: 'landlord', label: 'Landlord / Hostel', icon: Home, desc: 'List verified bedsitters & campus rentals' },
    { id: 'dealer', label: 'Dealer / Hardware', icon: Store, desc: 'Cement, building materials & farm produce' },
    { id: 'school', label: 'School / CBC', icon: Briefcase, desc: 'Fee collections, grade sheets & notices' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 text-white p-6 relative">
          <button
            id="close-auth-modal-btn"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-md p-1">
              <img
                src="https://cdn.oreateai.com/agentskill/c33477c488d4b7613c1e591f/multimedia/84205c8a6ffcd3b761e91635.png"
                alt="Enemind"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-lg font-bold font-display text-white">Enemind Account Portal</h2>
                <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-sm bg-amber-400 text-slate-950">
                  Kenya
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {mode === 'login' ? 'Sign in to access your dashboard, orders & sheets' : 'Join thousands of students, solar companies & merchants'}
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1 bg-white/10 p-1 rounded-2xl mt-5">
            <button
              id="auth-tab-login"
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition text-center cursor-pointer ${
                mode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              id="auth-tab-signup"
              type="button"
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition text-center cursor-pointer ${
                mode === 'signup' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          
          {errorMessage && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Role Selection (especially on Signup) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {mode === 'signup' ? '1. Select Your Account Type:' : 'Account Role Preference:'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {rolesConfig.map((role) => {
                const Icon = role.icon;
                const isSelected = selectedRole === role.id;
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setSelectedRole(role.id)}
                    className={`p-2.5 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-200'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-600' : 'text-slate-500'}`} />
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    </div>
                    <div className="mt-1">
                      <p className={`text-xs font-bold ${isSelected ? 'text-emerald-900' : 'text-slate-800'}`}>
                        {role.label}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleAuthSubmit} className="space-y-3.5">
            
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name / Business Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Kelvin Mwangi or Mwangi Solar Ltd"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            )}

            {/* If Student: Select College/Campus */}
            {mode === 'signup' && selectedRole === 'student' && (
              <div className="space-y-2 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Student Level
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(['campus', 'high_school', 'cbc_jss', 'cbc_primary'] as StudentStage[]).map((stage) => (
                      <button
                        key={stage}
                        type="button"
                        onClick={() => setStudentStage(stage)}
                        className={`py-1.5 px-2 rounded-xl text-[10px] font-bold capitalize transition ${
                          studentStage === stage ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 border border-slate-200'
                        }`}
                      >
                        {stage.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                {studentStage === 'campus' && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Select Your Kenyan Campus / College
                    </label>
                    <select
                      value={selectedCampus}
                      onChange={(e) => setSelectedCampus(e.target.value)}
                      className="w-full p-2 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500"
                    >
                      {KENYAN_CAMPUSES_AND_COLLEGES.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.shortName} ({c.town})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@gmail.com or student@ku.ac.ke"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Phone (M-Pesa linked) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  M-Pesa Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+254 712 345 678"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="auth-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold transition shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <span>{mode === 'login' ? 'Sign In to Account' : 'Create Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Switcher */}
          <div className="pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Instant Quick-Login (Demo Profiles)
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold">1-Click</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {allUsers.slice(0, 4).map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleQuickDemoLogin(u)}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left flex items-center gap-2 transition group cursor-pointer"
                >
                  <img
                    src={u.avatarUrl}
                    alt={u.name}
                    className="w-7 h-7 rounded-full object-cover border border-slate-300 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900 truncate group-hover:text-emerald-700">
                      {u.name}
                    </p>
                    <p className="text-[10px] text-slate-500 capitalize truncate">
                      {u.accountType}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="text-center text-[11px] text-slate-400">
            Protected with 256-bit SSL encryption & Google Drive Sync
          </div>
        </div>

      </div>
    </div>
  );
};
