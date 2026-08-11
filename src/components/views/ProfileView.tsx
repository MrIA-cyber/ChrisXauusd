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
    <div className="font-sans pb-2">
      
      {/* Title Header */}
      <div className="bg-white dark:bg-[#0B132B] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white font-mono uppercase tracking-wide">
            PROFIL & CONFIGURATION DU TERMINAL
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-sans mt-0.5">
            Gestion de votre compte membre ChrisXAUUSD et préférences
          </p>
        </div>

        <div className="text-xs font-mono font-bold text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 self-start sm:self-auto">
          ID: {userSession?.id || 'VISITOR-001'}
        </div>
      </div>

      {/* DUAL COLUMN RESPONSIVE GRID FOR DESKTOP (lg: grid-cols-12) / SINGLE STACK FOR MOBILE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-start">
        
        {/* LEFT COLUMN: ACCOUNT & SETTINGS (lg:col-span-7 xl:col-span-8) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          
          {/* USER CARD (Avatar, Name, Status) */}
          <div className="bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-slate-900 text-amber-400 font-black text-base sm:text-lg flex items-center justify-center overflow-hidden border-2 border-amber-500 shadow-xs">
                  {userSession?.avatarUrl ? (
                    <img src={userSession.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : userSession?.name ? (
                    userSession.name.charAt(0).toUpperCase()
                  ) : (
                    <User className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400" />
                  )}
                </div>
                {isVip && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 p-1 rounded-full border-2 border-white dark:border-[#0B132B]">
                    <Crown className="w-3 h-3" />
                  </span>
                )}
              </div>

              <div>
                <div className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white font-mono">
                  {userSession?.name || 'Visiteur ChrisXAUUSD'}
                </div>
                <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-sans mt-0.5">
                  {userSession?.email || 'trader@xau-scalp.com'}
                </div>
              </div>
            </div>

            <button
              onClick={onOpenProfileModal}
              className="min-h-[40px] px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer font-mono"
            >
              ÉDITER
            </button>
          </div>

          {/* SUBSCRIPTION STATUS CARD */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-[#0A1224] text-white border border-slate-800 rounded-2xl p-4.5 sm:p-6 shadow-md space-y-4 font-mono">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400" />
                <span className="text-xs sm:text-sm font-extrabold text-amber-400 uppercase">Statut Abonnement</span>
              </div>

              <span
                className={`text-xs font-bold px-3 py-1 rounded-full ${
                  isVip
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}
              >
                {isVip ? '● ABONNÉ VIP ACTIF' : 'PASSE GRATUIT'}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm">
              <div>
                <div className="text-xs text-slate-400 font-sans">Temps Restant</div>
                <div className="text-sm sm:text-base font-black text-white mt-0.5">
                  {subscription.daysRemaining > 0 ? `${subscription.daysRemaining} jours` : 'Expiré'}
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-slate-400 font-sans">Forfait Mensuel</div>
                <div className="text-sm sm:text-base font-black text-amber-400 mt-0.5">
                  700 000 FCFA / mois
                </div>
              </div>
            </div>

            <button
              onClick={onOpenSubscribeModal}
              className="w-full min-h-[48px] py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-98"
            >
              <CreditCard className="w-4 h-4 text-slate-950" />
              <span>{isVip ? 'RENNOUVELER / GÉRER L\'ABONNEMENT' : 'PASSER EN ABONNEMENT VIP'}</span>
            </button>
          </div>

          {/* QUICK SETTINGS MENU LIST */}
          <div className="bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800/80 shadow-xs text-xs sm:text-sm font-sans">
            
            {/* Mon Abonnement */}
            <button
              onClick={onOpenSubscribeModal}
              className="w-full min-h-[48px] px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-3 text-slate-800 dark:text-slate-200 font-semibold">
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                <span>Mon abonnement VIP</span>
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            {/* Notifications & Alertes */}
            <div className="min-h-[48px] px-4 py-3.5 flex items-center justify-between">
              <span className="flex items-center gap-3 text-slate-800 dark:text-slate-200 font-semibold">
                <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                <span>Sons & Notifications Web</span>
              </span>
              <button
                onClick={onToggleSound}
                className={`px-3 py-1.5 rounded-full text-xs font-bold font-mono transition-all cursor-pointer ${
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
              className="w-full min-h-[48px] px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-3 text-slate-800 dark:text-slate-200 font-semibold">
                <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
                <span>Sécurité & Appareils</span>
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            {/* Calculateur de Risque */}
            <button
              onClick={onOpenCalculator}
              className="w-full min-h-[48px] px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-3 text-slate-800 dark:text-slate-200 font-semibold">
                <Calculator className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
                <span>Calculateur de Risque XAU/USD</span>
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            {/* Ebook Scalping PDF */}
            <button
              onClick={onOpenEbookModal}
              className="w-full min-h-[48px] px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-3 text-slate-800 dark:text-slate-200 font-semibold">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500" />
                <span>Ebook Scalping Masterclass (PDF)</span>
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            {/* Mode Sombre / Clair */}
            <div className="min-h-[48px] px-4 py-3.5 flex items-center justify-between">
              <span className="flex items-center gap-3 text-slate-800 dark:text-slate-200 font-semibold">
                {theme === 'dark' ? <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" /> : <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />}
                <span>Apparence (Thème)</span>
              </span>
              <button
                onClick={onToggleTheme}
                className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-full text-xs font-bold font-mono cursor-pointer"
              >
                {theme === 'dark' ? 'SOMBRE' : 'CLAIR'}
              </button>
            </div>

          </div>

          {/* LOGOUT / LOGIN BUTTON */}
          {userSession ? (
            <button
              onClick={onLogout}
              className="w-full min-h-[48px] py-3.5 bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40 font-bold text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer font-mono"
            >
              <LogOut className="w-4 h-4" />
              <span>SE DÉCONNECTER</span>
            </button>
          ) : (
            <button
              onClick={onOpenLoginModal}
              className="w-full min-h-[48px] py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer font-mono shadow-sm"
            >
              <span>CONNEXION ESPACE MEMBRE</span>
            </button>
          )}

        </div>

        {/* RIGHT SIDEBAR COLUMN: VIP BENEFITS & SECURITY AUDIT (lg:col-span-5 xl:col-span-4) */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-4">
          
          {/* VIP BENEFITS CARD */}
          <div className="bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3 font-sans">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white font-mono uppercase pb-2 border-b border-slate-100 dark:border-slate-800">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>AVANTAGES EXCLUSIFS VIP</span>
            </div>

            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Signaux SMC/ICT en temps réel avec notification push instantanée.</span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Calculateur de lots MT4/MT5 automatique ajusté à votre capital.</span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Téléchargement gratuit de l'Ebook Scalping Gold Masterclass PDF.</span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Support prioritaire 24/7 sur Telegram & WhatsApp VIP.</span>
              </li>
            </ul>
          </div>

          {/* APPLICATION INFOS */}
          <div className="bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs text-xs font-mono space-y-2 text-slate-500 dark:text-slate-400">
            <div className="flex justify-between">
              <span>Version Terminal:</span>
              <span className="text-slate-900 dark:text-white font-bold">v3.8.5 PWA</span>
            </div>
            <div className="flex justify-between">
              <span>Serveur Engine:</span>
              <span className="text-emerald-500 font-bold">Node.js + Railway</span>
            </div>
            <div className="flex justify-between">
              <span>Algorithme:</span>
              <span className="text-amber-500 font-bold">ChrisXauusd SMC/ICT v5.0</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
