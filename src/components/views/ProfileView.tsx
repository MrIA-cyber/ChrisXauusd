import React from 'react';
import {
  User,
  CreditCard,
  Bell,
  ShieldCheck,
  Calculator,
  BookOpen,
  Moon,
  Sun,
  LogOut,
  ChevronRight,
  Smartphone,
  Crown,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { AuthUser, UserSubscription } from '../../types';

interface ProfileViewProps {
  userSession: AuthUser | null;
  subscription: UserSubscription;
  soundEnabled: boolean;
  onToggleSound: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenSubscribeModal: () => void;
  onOpenLoginModal: () => void;
  onOpenProfileModal: () => void;
  onOpenCalculator: () => void;
  onOpenEbookModal: () => void;
  onLogout: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  userSession,
  subscription,
  soundEnabled,
  onToggleSound,
  theme,
  onToggleTheme,
  onOpenSubscribeModal,
  onOpenLoginModal,
  onOpenProfileModal,
  onOpenCalculator,
  onOpenEbookModal,
  onLogout,
}) => {
  const isVip = subscription.status === 'ACTIVE' || subscription.status === 'EXPIRING_SOON';

  return (
    <div className="space-y-4 font-sans pb-2">
      
      {/* Title Header */}
      <div>
        <h2 className="text-base font-extrabold text-slate-900 dark:text-white font-mono">
          PROFIL & CONFIGURATION
        </h2>
        <p className="text-[11px] text-slate-500 font-sans">
          Gestion de votre compte ChrisXAUUSD et préférences
        </p>
      </div>

      {/* USER CARD (Avatar, Name, Status) */}
      <div className="bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 rounded-2xl p-4.5 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-amber-400 font-black text-base flex items-center justify-center overflow-hidden border-2 border-amber-500 shadow-xs">
              {userSession?.avatarUrl ? (
                <img src={userSession.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : userSession?.name ? (
                userSession.name.charAt(0).toUpperCase()
              ) : (
                <User className="w-6 h-6 text-amber-400" />
              )}
            </div>
            {isVip && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 p-0.5 rounded-full border-2 border-white dark:border-[#0B132B]">
                <Crown className="w-3 h-3" />
              </span>
            )}
          </div>

          <div>
            <div className="text-sm font-bold text-slate-900 dark:text-white font-mono">
              {userSession?.name || 'Visiteur ChrisXAUUSD'}
            </div>
            <div className="text-xs text-slate-500 font-sans">
              {userSession?.email || 'trader@xau-scalp.com'}
            </div>
          </div>
        </div>

        <button
          onClick={onOpenProfileModal}
          className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-all cursor-pointer font-mono"
        >
          ÉDITER
        </button>
      </div>

      {/* SUBSCRIPTION STATUS CARD */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-[#0A1224] text-white border border-slate-800 rounded-2xl p-4.5 shadow-md space-y-3 font-mono">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-amber-400 uppercase">Statut Abonnement</span>
          </div>

          <span
            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
              isVip
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
            }`}
          >
            {isVip ? '● ABONNÉ VIP ACTIF' : 'PASSE GRATUIT'}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <div>
            <div className="text-[10px] text-slate-400 font-sans">Temps Restant</div>
            <div className="text-sm font-bold text-white mt-0.5">
              {subscription.daysRemaining > 0 ? `${subscription.daysRemaining} jours` : 'Expiré'}
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] text-slate-400 font-sans">Forfait</div>
            <div className="text-sm font-bold text-amber-400 mt-0.5">
              700 000 FCFA / mois
            </div>
          </div>
        </div>

        <button
          onClick={onOpenSubscribeModal}
          className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-98"
        >
          <CreditCard className="w-4 h-4 text-slate-950" />
          <span>{isVip ? 'RENNOUVELER / GÉRER L\'ABONNEMENT' : 'PASSER EN ABONNEMENT VIP'}</span>
        </button>
      </div>

      {/* QUICK SETTINGS MENU LIST */}
      <div className="bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800/80 shadow-xs text-xs font-sans">
        
        {/* Mon Abonnement */}
        <button
          onClick={onOpenSubscribeModal}
          className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-3 text-slate-800 dark:text-slate-200 font-medium">
            <CreditCard className="w-4 h-4 text-amber-500" />
            <span>Mon abonnement</span>
          </span>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        {/* Notifications & Alertes */}
        <div className="px-4 py-3.5 flex items-center justify-between">
          <span className="flex items-center gap-3 text-slate-800 dark:text-slate-200 font-medium">
            <Bell className="w-4 h-4 text-blue-500" />
            <span>Sons & Notifications Web</span>
          </span>
          <button
            onClick={onToggleSound}
            className={`px-3 py-1 rounded-full text-[10px] font-bold font-mono transition-all cursor-pointer ${
              soundEnabled
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
            }`}
          >
            {soundEnabled ? 'ACTIVES' : 'MUET'}
          </button>
        </div>

        {/* Sécurité & Appareils */}
        <button
          onClick={onOpenProfileModal}
          className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-3 text-slate-800 dark:text-slate-200 font-medium">
            <Smartphone className="w-4 h-4 text-purple-500" />
            <span>Sécurité & Appareils</span>
          </span>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        {/* Calculateur de Risque */}
        <button
          onClick={onOpenCalculator}
          className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-3 text-slate-800 dark:text-slate-200 font-medium">
            <Calculator className="w-4 h-4 text-emerald-500" />
            <span>Calculateur de Risque XAU/USD</span>
          </span>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        {/* Ebook Scalping PDF */}
        <button
          onClick={onOpenEbookModal}
          className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-3 text-slate-800 dark:text-slate-200 font-medium">
            <BookOpen className="w-4 h-4 text-indigo-500" />
            <span>Ebook Scalping Masterclass (PDF)</span>
          </span>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        {/* Mode Sombre / Clair */}
        <div className="px-4 py-3.5 flex items-center justify-between">
          <span className="flex items-center gap-3 text-slate-800 dark:text-slate-200 font-medium">
            {theme === 'dark' ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
            <span>Apparence (Thème)</span>
          </span>
          <button
            onClick={onToggleTheme}
            className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-full text-[10px] font-bold font-mono cursor-pointer"
          >
            {theme === 'dark' ? 'SOMBRE' : 'CLAIR'}
          </button>
        </div>

      </div>

      {/* LOGOUT / LOGIN BUTTON */}
      {userSession ? (
        <button
          onClick={onLogout}
          className="w-full py-3 bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40 font-bold text-xs rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer font-mono"
        >
          <LogOut className="w-4 h-4" />
          <span>SE DÉCONNECTER</span>
        </button>
      ) : (
        <button
          onClick={onOpenLoginModal}
          className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer font-mono shadow-sm"
        >
          <span>CONNEXION ESPACE MEMBRE</span>
        </button>
      )}

    </div>
  );
};
