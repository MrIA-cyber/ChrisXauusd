import React from 'react';
import { Home, BarChart2, TrendingUp, BookOpen, User } from 'lucide-react';

export type ActiveTabType = 'home' | 'setups' | 'market' | 'history' | 'profile';

interface MobileBottomNavProps {
  activeTab: ActiveTabType;
  onTabChange: (tab: ActiveTabType) => void;
  activeSetupCount?: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onTabChange,
  activeSetupCount = 0,
}) => {
  const tabs = [
    {
      id: 'home' as ActiveTabType,
      label: 'Accueil',
      icon: Home,
    },
    {
      id: 'setups' as ActiveTabType,
      label: 'Setups',
      icon: BarChart2,
      badge: activeSetupCount > 0 ? activeSetupCount : undefined,
    },
    {
      id: 'market' as ActiveTabType,
      label: 'Marché',
      icon: TrendingUp,
    },
    {
      id: 'history' as ActiveTabType,
      label: 'Historique',
      icon: BookOpen,
    },
    {
      id: 'profile' as ActiveTabType,
      label: 'Profil',
      icon: User,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#060D1E]/95 border-t border-slate-200/90 dark:border-slate-800/90 backdrop-blur-xl shadow-[0_-8px_30px_rgba(0,0,0,0.1)] px-2 pt-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom,0px))] transition-all">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-2 min-w-[56px] min-h-[44px] rounded-xl transition-all cursor-pointer select-none active:scale-95 ${
                isActive
                  ? 'text-amber-500 font-bold dark:text-amber-400'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {/* Active Tab Ambient Top Accent Line */}
              {isActive && (
                <div className="absolute -top-1.5 w-6 h-1 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full shadow-[0_2px_8px_rgba(245,158,11,0.5)]" />
              )}

              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 text-amber-500 dark:text-amber-400' : ''
                  }`}
                />
                {tab.badge !== undefined && (
                  <span className="absolute -top-1 -right-2 bg-emerald-500 text-white font-mono font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center animate-pulse border border-white dark:border-[#060D1E]">
                    {tab.badge}
                  </span>
                )}
              </div>

              <span className={`text-[10px] font-medium tracking-tight mt-0.5 ${isActive ? 'font-bold' : ''}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
