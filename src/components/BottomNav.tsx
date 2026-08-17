import React from 'react';
import { Compass, Film, MapPin, ShoppingBag, User } from 'lucide-react';
import { useApp, ActivePage } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export const BottomNav: React.FC = () => {
  const { activePage, setActivePage } = useApp();
  const { user } = useAuth();

  const getWorkspacePage = (): ActivePage => {
    if (!user) return 'students';
    switch (user.accountType) {
      case 'school':
        return 'schools';
      case 'company':
      case 'dealer':
        return 'companies';
      case 'landlord':
        return 'landlords';
      case 'student':
      default:
        return 'students';
    }
  };

  const navs = [
    { id: 'home' as ActivePage, label: 'Discover', icon: <Compass className="w-5 h-5" /> },
    { id: 'feed' as ActivePage, label: 'Shorts', icon: <Film className="w-5 h-5" /> },
    { id: 'findlocal' as ActivePage, label: 'Findlocal', icon: <MapPin className="w-5 h-5" /> },
    { id: 'marketplace' as ActivePage, label: 'Market', icon: <ShoppingBag className="w-5 h-5" /> },
    { id: getWorkspacePage(), label: 'Channel', icon: <User className="w-5 h-5" /> }
  ];

  return (
    <div className="md:hidden fixed bottom-3 left-3 right-3 z-40">
      <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl px-2 py-2 shadow-2xl shadow-black/40">
        <div className="flex items-center justify-around">
          {navs.map((n) => {
            const isActive = activePage === n.id;
            return (
              <button
                key={n.id}
                id={`mobile-bottom-nav-${n.id}`}
                onClick={() => setActivePage(n.id)}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition duration-150 relative ${
                  isActive
                    ? 'text-emerald-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {n.icon}
                <span className="text-[10px] mt-0.5 tracking-tight">{n.label}</span>
                {isActive && (
                  <span className="w-1 h-1 rounded-full bg-emerald-400 absolute bottom-0"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
