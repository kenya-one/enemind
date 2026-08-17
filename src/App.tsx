import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { YouTubeLiveModal } from './components/YouTubeLiveModal';
import { PesapalModal } from './components/PesapalModal';
import { DriveSyncModal } from './components/DriveSyncModal';
import { AuthModal } from './components/AuthModal';

import { Home } from './pages/Home';
import { ShortsFeedPage } from './pages/ShortsFeedPage';
import { FindlocalPage } from './pages/FindlocalPage';
import { MarketplacePage } from './pages/MarketplacePage';
import { SchoolDashboard } from './pages/SchoolDashboard';
import { CompanyChannelPage } from './pages/CompanyChannelPage';
import { LandlordChannelPage } from './pages/LandlordChannelPage';
import { StudentHubPage } from './pages/StudentHubPage';

const AppContent: React.FC = () => {
  const { toastMessage, isAuthModalOpen, authModalMode, closeAuthModal } = useApp();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col antialiased selection:bg-blue-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar />

      {/* Global In-App Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 animate-bounce">
          <div className="px-4 py-2.5 rounded-2xl bg-slate-950/95 text-white text-xs font-semibold shadow-2xl border border-slate-700 backdrop-blur-md flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Main Page Routing */}
      <main className="flex-1 pb-24 sm:pb-12">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/feed" element={<ShortsFeedPage />} />
          <Route path="/findlocal" element={<FindlocalPage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/school" element={<SchoolDashboard />} />
          <Route path="/company" element={<CompanyChannelPage />} />
          <Route path="/landlord" element={<LandlordChannelPage />} />
          <Route path="/student" element={<StudentHubPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Mobile Floating Bottom Bar */}
      <BottomNav />

      {/* Modals & Overlays */}
      <YouTubeLiveModal />
      <PesapalModal />
      <DriveSyncModal />
      <AuthModal
        isOpen={isAuthModalOpen}
        defaultMode={authModalMode}
        onClose={closeAuthModal}
      />
    </div>
  );
};

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </AuthProvider>
    </HashRouter>
  );
}
