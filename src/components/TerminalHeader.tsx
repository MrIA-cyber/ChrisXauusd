import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Zap, Calculator, Clock, Globe, LogIn, LogOut, Sparkles, Users, CheckCircle2, ChevronDown, Sun, Moon, Database, Download, Bell, BellOff, BellRing } from 'lucide-react';
import { MarketSession, AuthUser, UserSubscription } from '../types';
import { ChrisXauusdLogoIcon } from './ChrisXauusdLogo';
import { useLongPress } from '../lib/useLongPress';
import { getNotificationPermission, requestWebNotificationPermission, sendWebPushNotification } from '../lib/notificationService';
import { NotificationModal } from './NotificationModal';

interface TerminalHeaderProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  autoSignalActive: boolean;
  onToggleAutoSignal: () => void;
  onManualGenerateSignal: () => void;
  onOpenCalculator: () => void;
  marketSessions: MarketSession[];
  userSession: AuthUser | null;
  subscription: UserSubscription;
  onOpenSubscribeModal: () => void;
  onOpenLoginModal: () => void;
  onChangeProfile: () => void;
  onOpenProfileModal?: () => void;
  onLogout: () => void;
  onTriggerSecretAdmin?: () => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  onOpenInstallModal?: () => void;
}

export const TerminalHeader: React.FC<TerminalHeaderProps> = ({
  soundEnabled,
  onToggleSound,
  autoSignalActive,
  onToggleAutoSignal,
  onManualGenerateSignal,
  onOpenCalculator,
  marketSessions,
  userSession,
  subscription,
  onOpenSubscribeModal,
  onOpenLoginModal,
  onChangeProfile,
  onOpenProfileModal,
  onLogout,
  onTriggerSecretAdmin,
  theme = 'light',
  onToggleTheme,
  onOpenInstallModal,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isNotifModalOpen, setIsNotifModalOpen] = useState<boolean>(false);
  const [notifPermission, setNotifPermission] = useState<string>(() => getNotificationPermission());

  const handleTogglePushNotifications = () => {
    setIsNotifModalOpen(true);
  };

  // 5-second long press hook for secret administrator portal trigger
  const { isPressing, progress, handlers } = useLongPress({
    onLongPress: () => {
      if (onTriggerSecretAdmin) onTriggerSecretAdmin();
    },
    ms: 5000,
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZoneName: 'short',
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const isSubscriberActive = subscription.status === 'ACTIVE' || subscription.status === 'EXPIRING_SOON';

  return (
    <header className="bg-[var(--header-bg)] border-b border-[var(--border-card)] text-[var(--text-primary)] px-2.5 sm:px-4 py-2 sm:py-2.5 shadow-xs backdrop-blur-xl sticky top-0 z-40 transition-colors duration-300 font-sans">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left: Branding, Symbol Badge & Live Status */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div
            {...handlers}
            className="flex items-center gap-1.5 sm:gap-2.5 cursor-pointer select-none relative group"
            title="ChrisXauusd Terminal"
          >
            <div className="relative shrink-0">
              <ChrisXauusdLogoIcon className="w-7 h-7 sm:w-8.5 sm:h-8.5" />
              {isPressing && (
                <svg className="absolute -inset-1 w-[36px] h-[36px] sm:w-[42px] sm:h-[42px] pointer-events-none z-20">
                  <circle
                    cx="18"
                    cy="18"
                    r="15"
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="2.5"
                    strokeDasharray="115"
                    strokeDashoffset={115 - (115 * progress) / 100}
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </div>

            <div>
              <div className="flex items-center gap-1 sm:gap-2">
                <h1 className="text-xs sm:text-base font-extrabold tracking-tight text-[var(--text-primary)] flex items-center gap-1 font-sans">
                  <span>ChrisXauusd</span>
                </h1>
                
                {/* Badge XAU/USD */}
                <span className="hidden xs:inline-flex px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-mono font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60 uppercase">
                  XAU/USD
                </span>

                {/* LIVE Status Indicator */}
                <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse" />
                  LIVE
                </span>

                {/* Firestore Database Badge */}
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800" title="Connecté à la vraie base de données Firebase Firestore">
                  <Database className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                  Firestore DB
                </span>

                {/* Twelve Data API Badge */}
                <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-400/40" title="Flux de prix réel Gold XAU/USD connecté via API Twelve Data">
                  <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                  Twelve Data API
                </span>
              </div>
            </div>
          </div>

          {/* Active Sessions Bar */}
          <div className="hidden lg:flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700/70 text-xs ml-2">
            <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <div className="flex items-center gap-1">
              {marketSessions.map((session) => (
                <div
                  key={session.name}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-semibold transition-colors ${
                    session.isActiveNow
                      ? 'bg-emerald-600 text-white font-bold shadow-xs'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                  title={`${session.name} (${session.openTimeGmt}-${session.closeTimeGmt} GMT)`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      session.isActiveNow ? 'bg-white animate-ping' : 'bg-slate-400 dark:bg-slate-500'
                    }`}
                  />
                  <span>{session.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Primary CTA + Theme Selector + Grouped Secondary Actions Menu */}
        <div className="flex items-center gap-2">
          
          {/* Main Primary Visible CTA & User Profile Button */}
          {subscription.status === 'PENDING_VERIFICATION' ? (
            <button
              type="button"
              onClick={onOpenSubscribeModal}
              className="flex items-center gap-1.5 bg-amber-500/20 text-amber-950 dark:text-amber-300 border-2 border-amber-500 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl text-xs font-mono font-bold shadow-md hover:bg-amber-500/30 transition-all cursor-pointer animate-pulse shrink-0"
              title="Votre reçu Mobile Money est en cours de vérification par Chris Pokam (640406412)"
            >
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 shrink-0" />
              <span className="hidden sm:inline">Validation WhatsApp en cours</span>
              <span className="sm:hidden text-[10px] bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded font-bold">En vérification</span>
            </button>
          ) : isSubscriberActive ? (
            <button
              type="button"
              onClick={onOpenProfileModal}
              className="flex items-center gap-2 bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800 dark:hover:bg-slate-700 border border-amber-500/50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl text-xs font-mono shadow-md backdrop-blur-md transition-all active:scale-95 cursor-pointer group"
              title="Mon Profil Abonné — Modifier photo et informations"
            >
              <div className="relative shrink-0">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full overflow-hidden ring-2 ring-amber-400 bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-[10px]">
                  {userSession?.avatarUrl ? (
                    <img src={userSession.avatarUrl} alt={userSession.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{userSession?.name ? userSession.name.substring(0, 2).toUpperCase() : 'VIP'}</span>
                  )}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
              </div>

              <div className="text-left hidden sm:block leading-tight">
                <div className="font-bold text-[11px] text-amber-300 group-hover:text-amber-200 truncate max-w-[110px]">
                  {userSession?.name || 'Abonné VIP'}
                </div>
                <div className="text-[9px] text-slate-400 flex items-center gap-1">
                  <span>J-{subscription.daysRemaining}</span>
                  <span className="text-emerald-400">• Actif</span>
                </div>
              </div>

              <span className="sm:hidden text-[10px] bg-emerald-500 text-slate-950 px-1.5 py-0.5 rounded font-bold">
                J-{subscription.daysRemaining}
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenSubscribeModal}
              className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-bold font-mono px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs shadow-md shadow-amber-500/20 active:scale-[0.98] transition-all shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-slate-950 text-slate-950" />
              <span>
                <span className="hidden sm:inline">Découvrir </span>Premium
              </span>
            </button>
          )}

          {/* Dedicated Web Push Notification Button */}
          <button
            onClick={handleTogglePushNotifications}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all active:scale-95 cursor-pointer shadow-2xs border ${
              notifPermission === 'granted'
                ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/40'
                : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-500/30'
            }`}
            title={
              notifPermission === 'granted'
                ? 'Notifications Push Actives (Cliquer pour tester)'
                : 'Activer les notifications Push Web sur cet appareil'
            }
          >
            {notifPermission === 'granted' ? (
              <>
                <BellRing className="w-3.5 h-3.5 text-emerald-500 animate-bounce" />
                <span className="hidden md:inline">Push Actif</span>
              </>
            ) : (
              <>
                <Bell className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden md:inline">Notifications Push</span>
              </>
            )}
          </button>

          {/* Dedicated PWA Install App Button */}
          {onOpenInstallModal && (
            <button
              onClick={onOpenInstallModal}
              className="flex items-center gap-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all active:scale-95 cursor-pointer shadow-2xs"
              title="Installer l'application sur votre écran d'accueil"
            >
              <Download className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden md:inline">Installer l'App</span>
            </button>
          )}

          {/* Dedicated Theme Selector Toggle Button */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all active:scale-95 cursor-pointer"
              title={theme === 'dark' ? 'Basculer en Mode Clair' : 'Basculer en Mode Sombre'}
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="hidden sm:inline">Clair</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-slate-700" />
                  <span className="hidden sm:inline">Sombre</span>
                </>
              )}
            </button>
          )}

          {/* Grouped Secondary Tools Dropdown Button */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all active:scale-95 cursor-pointer"
              title="Outils & Options"
            >
              <span>Options</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-600 dark:text-slate-400 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu Overlay */}
            {isMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-56 bg-[var(--dropdown-bg)] border border-[var(--border-card)] rounded-2xl shadow-xl p-2 z-50 space-y-1 font-mono text-xs backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">
                  Options du Terminal
                </div>

                {/* Install App Option */}
                {onOpenInstallModal && (
                  <button
                    onClick={onOpenInstallModal}
                    className="w-full text-left px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 flex items-center justify-between transition-colors font-bold"
                  >
                    <span className="flex items-center gap-2">
                      <Download className="w-3.5 h-3.5 text-amber-500" /> Installer l'App
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-amber-500 text-slate-950">
                      PWA
                    </span>
                  </button>
                )}

                {/* Theme Switcher in Dropdown */}
                {onToggleTheme && (
                  <button
                    onClick={onToggleTheme}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-between transition-colors font-semibold cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-600" />}
                      Mode Thème
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                      {theme === 'dark' ? 'Sombre' : 'Clair'}
                    </span>
                  </button>
                )}

                {/* Risk Calculator */}
                <button
                  onClick={onOpenCalculator}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-between transition-colors font-semibold"
                >
                  <span className="flex items-center gap-2">
                    <Calculator className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> Calcul Risque
                  </span>
                </button>

                {/* Sound Toggle */}
                <button
                  onClick={onToggleSound}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-between transition-colors font-semibold"
                >
                  <span className="flex items-center gap-2">
                    {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
                    Avertissements Sonores
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${soundEnabled ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
                    {soundEnabled ? 'ON' : 'OFF'}
                  </span>
                </button>

                {/* Generate Signal */}
                <button
                  onClick={onManualGenerateSignal}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-blue-700 dark:text-blue-400 flex items-center gap-2 transition-colors font-semibold"
                >
                  <Zap className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> Émettre un Signal
                </button>

                {/* Subscriber Profile Option */}
                {isSubscriberActive && onOpenProfileModal && (
                  <button
                    onClick={onOpenProfileModal}
                    className="w-full text-left px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 flex items-center justify-between transition-colors font-bold"
                  >
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full overflow-hidden bg-amber-500 text-slate-950 flex items-center justify-center text-[9px] font-bold shrink-0">
                        {userSession?.avatarUrl ? (
                          <img src={userSession.avatarUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span>P</span>
                        )}
                      </div>
                      Mon Profil & Photo
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-amber-500 text-slate-950">
                      VIP
                    </span>
                  </button>
                )}

                {/* Login or Profile switch */}
                {!isSubscriberActive && (
                  <button
                    onClick={onOpenLoginModal}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-950/40 text-amber-800 dark:text-amber-300 flex items-center gap-2 transition-colors font-bold"
                  >
                    <LogIn className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> Connexion Membre
                  </button>
                )}

                <button
                  onClick={onChangeProfile}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-2 transition-colors font-semibold"
                >
                  <Users className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" /> Changer de Profil
                </button>

                {isSubscriberActive && (
                  <button
                    onClick={onLogout}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-700 dark:text-rose-400 flex items-center gap-2 transition-colors border-t border-slate-100 dark:border-slate-800 mt-1 font-bold"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" /> Se déconnecter
                  </button>
                )}
              </div>
            )}
          </div>

        </div>

      </div>

      <NotificationModal
        isOpen={isNotifModalOpen}
        onClose={() => setIsNotifModalOpen(false)}
        soundEnabled={soundEnabled}
        onToggleSound={onToggleSound}
      />
    </header>
  );
};
