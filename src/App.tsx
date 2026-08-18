/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { CurrencyProvider } from './context/CurrencyContext.js';
import { ConfigProvider } from './context/ConfigContext.js';
import { Preloader } from './components/Preloader.js';
import { Header } from './components/Header.js';
import { Sidebar } from './components/Sidebar.js';
import { MobileNav } from './components/MobileNav.js';
import { OnboardingModal } from './components/OnboardingModal.js';
import { AuthModal } from './components/AuthModal.js';
import { MyCampusProfileModal } from './components/MyCampusProfileModal.js';
import { CurrencyModal } from './components/CurrencyModal.js';
import { IntegrationStatusModal } from './components/IntegrationStatusModal.js';
import { AIAssistantDrawer } from './components/AIAssistantDrawer.js';

// Views
import { HomeDashboard } from './views/HomeDashboard.js';
import { AcademicView } from './views/AcademicView.js';
import { AccommodationView } from './views/AccommodationView.js';
import { OpportunitiesView } from './views/OpportunitiesView.js';
import { GigsMarketplaceView } from './views/GigsMarketplaceView.js';
import { CommunitiesView } from './views/CommunitiesView.js';
import { EventsView } from './views/EventsView.js';
import { SheetStoreView } from './views/SheetStoreView.js';
import { PrivateVaultView } from './views/PrivateVaultView.js';
import { AdminPortalView } from './views/AdminPortalView.js';

function MainLayout() {
  const { isLoading: isAuthLoading } = useAuth();
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [activeView, setActiveView] = useState('home');
  const [isAIDrawerOpen, setIsAIDrawerOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    // Initial brand presentation preloader
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 1400);
    return () => clearTimeout(timer);
  }, []);

  const renderActiveView = () => {
    switch (activeView) {
      case 'home':
        return <HomeDashboard onNavigate={setActiveView} onOpenAI={() => setIsAIDrawerOpen(true)} />;
      case 'academic':
        return <AcademicView onOpenAI={() => setIsAIDrawerOpen(true)} />;
      case 'accommodation':
        return <AccommodationView />;
      case 'opportunities':
        return <OpportunitiesView />;
      case 'gigs':
        return <GigsMarketplaceView />;
      case 'communities':
        return <CommunitiesView />;
      case 'events':
        return <EventsView />;
      case 'sheets':
        return <SheetStoreView />;
      case 'vault':
        return <PrivateVaultView />;
      case 'admin':
        return <AdminPortalView />;
      default:
        return <HomeDashboard onNavigate={setActiveView} onOpenAI={() => setIsAIDrawerOpen(true)} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Brand Preloader with Stationary Logo & Orbiting Glow */}
      <Preloader isLoading={isAppLoading || isAuthLoading} />

      {/* Persistent Global Header */}
      <Header
        activeView={activeView}
        onNavigate={setActiveView}
        onOpenAI={() => setIsAIDrawerOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      {/* Main App Canvas: Sidebar + Scrollable Content */}
      <div className="max-w-7xl mx-auto w-full flex-1 flex">
        {/* Desktop Sidebar */}
        <Sidebar
          activeView={activeView}
          onNavigate={setActiveView}
          onOpenAI={() => setIsAIDrawerOpen(true)}
        />

        {/* View Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto max-w-full">
          {renderActiveView()}
        </main>
      </div>

      {/* Mobile Navigation */}
      <MobileNav
        activeView={activeView}
        onNavigate={setActiveView}
        onOpenAI={() => setIsAIDrawerOpen(true)}
      />

      {/* Global Modals & Drawers */}
      <AuthModal />
      <OnboardingModal />
      <MyCampusProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
      <CurrencyModal />
      <IntegrationStatusModal />
      <AIAssistantDrawer
        isOpen={isAIDrawerOpen}
        onClose={() => setIsAIDrawerOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ConfigProvider>
      <AuthProvider>
        <CurrencyProvider>
          <MainLayout />
        </CurrencyProvider>
      </AuthProvider>
    </ConfigProvider>
  );
}
