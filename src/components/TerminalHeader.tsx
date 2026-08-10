import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Volume2, VolumeX, Zap, Calculator, Clock, Globe, LogIn, LogOut, Sparkles, Users, CheckCircle2, ChevronDown, Sun, Moon, Database, Download, Bell, BellOff, BellRing, Calendar, BookOpen, Newspaper, Info, Settings, Check, Trash2, TrendingUp, TrendingDown, ShieldAlert, SlidersHorizontal, Brain, X, Gift } from 'lucide-react';
import { MarketSession, AuthUser, UserSubscription } from '../types';
import { ChrisXauusdLogoIcon } from './ChrisXauusdLogo';
import { useLongPress } from '../lib/useLongPress';
import { getNotificationPermission, requestWebNotificationPermission, sendWebPushNotification } from '../lib/notificationService';
import { soundService } from '../lib/audioService';
import { NotificationModal } from './NotificationModal';
import { getHourlyThemeConfig } from '../utils/hourlyTheme';

const AIPredictiveSentimentModule = React.lazy(() =>
  import('./AIPredictiveSentimentModule').then((m) => ({ default: m.AIPredictiveSentimentModule }))
);

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
  onOpenCalendar?: () => void;
  onLogout: () => void;
  onTriggerSecretAdmin?: () => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  onOpenInstallModal?: () => void;
  onOpenEbookModal?: () => void;
  onOpenMerchandiseModal?: () => void;
}

interface AlertFeedItem {
  id: string;
  type: 'BUY' | 'SELL' | 'TP' | 'SL' | 'ECONOMIC' | 'SYSTEM';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  badge: string;
}

const INITIAL_ALERTS: AlertFeedItem[] = [
  {
    id: 'alt-1',
    type: 'BUY',
    title: '🚀 ACHAT XAU/USD @ 2742.50 $',
    message: 'Nouveau signal Scalping M5 - Validation Order Block & balayage de liquidité.',
    time: 'il y a 4 min',
    isRead: false,
    badge: 'SIGNAL VIP',
  },
  {
    id: 'alt-2',
    type: 'TP',
    title: '🎯 Take Profit 1 Atteint (+75 Pips)',
    message: 'Objectif TP1 touché sur l’Or à 2 750.00 $. Sécurisez vos gains à Breakeven.',
    time: 'il y a 18 min',
    isRead: false,
    badge: 'TAKE PROFIT',
  },
  {
    id: 'alt-3',
    type: 'SL',
    title: '🛡️ Stop Loss Ajusté à Breakeven',
    message: 'Position sécurisée sans risque sur le trade VIP en cours.',
    time: 'il y a 42 min',
    isRead: false,
    badge: 'PROTECTION',
  },
  {
    id: 'alt-4',
    type: 'ECONOMIC',
    title: '📅 Alerte NFP / Inflation IPC dans 15 min',
    message: 'Forte volatilité à venir sur le XAU/USD. Prudence sur les nouveaux ordres.',
    time: 'il y a 1h',
    isRead: true,
    badge: 'RISQUE ÉCO',
  },
];

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
  onOpenCalendar,
  onLogout,
  onTriggerSecretAdmin,
  theme = 'light',
  onToggleTheme,
  onOpenInstallModal,
  onOpenEbookModal,
  onOpenMerchandiseModal,
}) => {
  const hourlyConfig = getHourlyThemeConfig();
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isInfosMenuOpen, setIsInfosMenuOpen] = useState<boolean>(false);
  const [isNotifPopoverOpen, setIsNotifPopoverOpen] = useState<boolean>(false);
  const [isNotifModalOpen, setIsNotifModalOpen] = useState<boolean>(false);
  const [isAIMacroModalOpen, setIsAIMacroModalOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [notifPermission, setNotifPermission] = useState<string>(() => getNotificationPermission());
  const [pushEnabled, setPushEnabled] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    const saved = localStorage.getItem('chrisxauusd_push_enabled');
    if (saved !== null) return saved === 'true';
    return getNotificationPermission() === 'granted';
  });
  
  // Notification Feed state
  const [alerts, setAlerts] = useState<AlertFeedItem[]>(INITIAL_ALERTS);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'SIGNALS' | 'ECO'>('ALL');

  const unreadCount = alerts.filter((a) => !a.isRead).length;

  const infosMenuRef = useRef<HTMLDivElement>(null);
  const optionsMenuRef = useRef<HTMLDivElement>(null);
  const notifCenterRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const handleToggleNotifPopover = () => {
    setIsNotifPopoverOpen((prev) => {
      const next = !prev;
      if (next) {
        setIsMenuOpen(false);
        setIsInfosMenuOpen(false);
        setIsMobileMenuOpen(false);
      }
      return next;
    });
  };

  const handleMarkAllRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, isRead: true })));
  };

  const handleClearAlerts = () => {
    setAlerts([]);
  };

  const handleTogglePush = async () => {
    if (pushEnabled) {
      setPushEnabled(false);
      localStorage.setItem('chrisxauusd_push_enabled', 'false');
    } else {
      if (notifPermission !== 'granted') {
        const res = await requestWebNotificationPermission();
        setNotifPermission(res);
        if (res === 'granted') {
          setPushEnabled(true);
          localStorage.setItem('chrisxauusd_push_enabled', 'true');
        }
      } else {
        setPushEnabled(true);
        localStorage.setItem('chrisxauusd_push_enabled', 'true');
        sendWebPushNotification('🛎️ Notifications Push Réactivées', {
          body: 'Vous recevrez à nouveau les alertes VIP XAU/USD sur votre appareil.',
        });
      }
    }
  };

  // Close menus when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (infosMenuRef.current && !infosMenuRef.current.contains(event.target as Node)) {
        setIsInfosMenuOpen(false);
      }
      if (optionsMenuRef.current && !optionsMenuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (notifCenterRef.current && !notifCenterRef.current.contains(event.target as Node)) {
        setIsNotifPopoverOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsInfosMenuOpen(false);
        setIsMenuOpen(false);
        setIsNotifPopoverOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    if (isInfosMenuOpen || isMenuOpen || isNotifPopoverOpen || isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isInfosMenuOpen, isMenuOpen, isNotifPopoverOpen, isMobileMenuOpen]);

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
    <header className="bg-[var(--header-bg)] border-b border-[var(--border-card)] text-[var(--text-primary)] px-2 sm:px-3 py-1 sm:py-1.5 shadow-xs backdrop-blur-xl sticky top-0 z-40 transition-colors duration-300 font-sans w-full box-border">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-1.5 sm:gap-3 w-full min-w-0">
        
        {/* Left: Branding (Logo & App Name preserved), Symbol Badge & Live Status */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
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
              <div className="flex items-center gap-1 sm:gap-1.5">
                <h1 className="text-xs sm:text-base font-extrabold tracking-tight text-[var(--text-primary)] flex items-center gap-1 font-sans">
                  <span>CHRIS<span className="text-amber-500 font-black">XAUUSD</span></span>
                </h1>
                
                {/* Badge XAU/USD */}
                <span className="px-1.5 py-0.2 rounded text-[8px] sm:text-[9px] font-mono font-bold bg-blue-50 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-300 dark:border-blue-500/30 uppercase">
                  XAU/USD
                </span>

                {/* Schedule Lun - Ven */}
                <span className="hidden md:inline-flex items-center gap-0.5 px-1 py-0.2 rounded text-[8px] font-mono text-slate-500 dark:text-slate-400 bg-slate-500/10 border border-slate-500/20">
                  <Clock className="w-2 h-2" /> Lun — Ven
                </span>

                {/* LIVE Status Indicator */}
                <span className="inline-flex items-center gap-0.5 px-1 sm:px-1.5 py-0.2 rounded-full text-[8px] sm:text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                  <span className="w-1.2 h-1.2 rounded-full bg-emerald-500 animate-pulse" />
                  LIVE
                </span>

                {/* Hourly Theme Badge & Merchandise Link */}
                <button
                  type="button"
                  onClick={onOpenMerchandiseModal}
                  className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[8px] sm:text-[9px] font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 transition-all cursor-pointer"
                  title="Voir la gamme d'objets publicitaires (Stylo & Cahier) & Thèmes Horaires"
                >
                  <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                  <span>THÈME {hourlyConfig.timeRange} : {hourlyConfig.fontName}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Active Sessions Bar */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700/70 text-[10px] ml-1">
            <Globe className="w-3 h-3 text-blue-600 dark:text-blue-400" />
            <div className="flex items-center gap-0.5">
              {marketSessions.map((session) => (
                <div
                  key={session.name}
                  className={`flex items-center gap-1 px-1.5 py-0.2 rounded text-[9px] font-semibold transition-colors ${
                    session.isActiveNow
                      ? 'bg-emerald-600 text-white font-bold shadow-xs'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                  title={`${session.name} (${session.openTimeGmt}-${session.closeTimeGmt} GMT)`}
                >
                  <span
                    className={`w-1 h-1 rounded-full ${
                      session.isActiveNow ? 'bg-white animate-ping' : 'bg-slate-400 dark:bg-slate-500'
                    }`}
                  />
                  <span>{session.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section: Tablet & Desktop Controls */}
        <div className="hidden md:flex items-center gap-1.5 shrink-0">
          
          {/* Main Primary Visible CTA & User Profile Button */}
          {subscription.status === 'PENDING_VERIFICATION' ? (
            <button
              type="button"
              onClick={onOpenSubscribeModal}
              className="flex items-center gap-1 bg-blue-50 text-blue-900 dark:bg-blue-950/60 dark:text-blue-200 border border-blue-500 px-2 py-1 rounded-lg text-xs font-mono font-bold shadow-xs hover:bg-blue-100 transition-all cursor-pointer animate-pulse shrink-0"
              title="Votre reçu Mobile Money est en cours de vérification par Chris Pokam (640406412)"
            >
              <Clock className="w-3 h-3 text-blue-600 shrink-0" />
              <span>Validation WhatsApp</span>
            </button>
          ) : isSubscriberActive ? (
            <button
              type="button"
              onClick={onOpenProfileModal}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white border border-blue-500 px-2 py-1 rounded-lg text-xs font-mono shadow-xs backdrop-blur-md transition-all active:scale-95 cursor-pointer group shrink-0"
              title="Mon Profil Abonné — Modifier photo et informations"
            >
              <div className="relative shrink-0">
                <div className="w-5.5 h-5.5 rounded-full overflow-hidden ring-1 ring-white bg-blue-700 text-white flex items-center justify-center font-bold text-[9px]">
                  {userSession?.avatarUrl ? (
                    <img src={userSession.avatarUrl} alt={userSession.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{userSession?.name ? userSession.name.substring(0, 2).toUpperCase() : 'VIP'}</span>
                  )}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-1 ring-blue-600" />
              </div>

              <div className="text-left leading-tight">
                <div className="font-bold text-[10px] text-white group-hover:text-blue-100 truncate max-w-[90px]">
                  {userSession?.name || 'Abonné VIP'}
                </div>
                <div className="text-[8px] text-blue-100 flex items-center gap-0.5">
                  <span>J-{subscription.daysRemaining}</span>
                  <span className="text-emerald-300">• Actif</span>
                </div>
              </div>
            </button>
          ) : null}

          {/* Menu INFOS Dropdown Button */}
          <div className="relative" ref={infosMenuRef}>
            <button
              type="button"
              onClick={() => {
                setIsInfosMenuOpen((prev) => !prev);
                if (isMenuOpen) setIsMenuOpen(false);
              }}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/80 text-xs font-mono font-medium transition-all active:scale-95 cursor-pointer shrink-0"
              title="Menu Informations — Livres, Calendrier Économique & Actualités"
            >
              <Info className="w-3 h-3 text-blue-500 shrink-0" />
              <span>Infos</span>
              <ChevronDown className={`w-2.5 h-2.5 text-slate-400 transition-transform ${isInfosMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu INFOS */}
            {isInfosMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-60 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-1.5 z-50 space-y-1 font-mono text-xs backdrop-blur-md animate-in fade-in slide-in-from-top-1 duration-150"
                onClick={() => setIsInfosMenuOpen(false)}
              >
                <div className="px-2.5 py-1.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold flex items-center gap-1">
                    <Info className="w-3 h-3 text-blue-500" /> Centre d'information
                  </span>
                </div>

                {/* 1. Livre PDF & Masterclass */}
                {onOpenEbookModal && (
                  <button
                    onClick={onOpenEbookModal}
                    className="w-full text-left p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200 flex items-center justify-between transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-amber-500 shrink-0" />
                      <div>
                        <div className="font-semibold text-xs">Livre Scalping (PDF)</div>
                        <div className="text-[10px] text-slate-400">Guide & Masterclass</div>
                      </div>
                    </div>
                  </button>
                )}

                {/* 2. Calendrier Économique Réel */}
                {onOpenCalendar && (
                  <button
                    onClick={onOpenCalendar}
                    className="w-full text-left p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200 flex items-center justify-between transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-500 shrink-0" />
                      <div>
                        <div className="font-semibold text-xs">Calendrier Économique</div>
                        <div className="text-[10px] text-slate-400">FED, CPI, NFP Live</div>
                      </div>
                    </div>
                  </button>
                )}

                {/* 3. Fil Satellite Actualités */}
                <button
                  onClick={() => {
                    const newsElem = document.getElementById('news-section');
                    if (newsElem) newsElem.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full text-left p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200 flex items-center justify-between transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Newspaper className="w-4 h-4 text-emerald-500 shrink-0" />
                    <div>
                      <div className="font-semibold text-xs">Actualités du Marché</div>
                      <div className="text-[10px] text-slate-400">Annonces XAU/USD</div>
                    </div>
                  </div>
                </button>

                {/* 4. Option Abonnement VIP / Premium si non actif */}
                {!isSubscriberActive && (
                  <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={onOpenSubscribeModal}
                      className="w-full text-left p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 font-semibold flex items-center justify-between transition-colors cursor-pointer text-xs"
                    >
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                        <span>Abonnement Premium VIP</span>
                      </div>
                    </button>
                  </div>
                )}

              </div>
            )}
          </div>

          {/* Discrete & Compact Notification Center Dropdown */}
          <div className="relative" ref={notifCenterRef}>
            <button
              onClick={handleToggleNotifPopover}
              className={`relative flex items-center justify-center p-1.5 rounded-lg text-xs font-mono font-bold transition-all active:scale-95 cursor-pointer border shrink-0 ${
                isNotifPopoverOpen
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-xs'
                  : notifPermission === 'granted'
                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
              title="Notifications & Alertes XAU/USD"
            >
              <div className="relative flex items-center justify-center">
                {notifPermission === 'granted' ? (
                  <BellRing className={`w-3.5 h-3.5 ${isNotifPopoverOpen ? 'text-slate-950' : 'text-emerald-500'}`} />
                ) : (
                  <Bell className={`w-3.5 h-3.5 ${isNotifPopoverOpen ? 'text-slate-950' : 'text-slate-700 dark:text-slate-200'}`} />
                )}
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[8px] font-extrabold text-white shadow-xs">
                    {unreadCount}
                  </span>
                )}
              </div>
            </button>

            {/* Compact & Discrete Notification Popover */}
            {isNotifPopoverOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-88 max-w-[calc(100vw-1rem)] bg-[var(--dropdown-bg)] border border-[var(--border-card)] rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150 font-sans">
                
                {/* Popover Header */}
                <div className="px-3.5 py-2.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <BellRing className="w-4 h-4 text-amber-400 shrink-0" />
                    <h4 className="font-bold text-xs font-mono flex items-center gap-1.5">
                      Alertes XAU/USD
                      {unreadCount > 0 && (
                        <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-red-500 text-white font-mono font-extrabold leading-none">
                          {unreadCount}
                        </span>
                      )}
                    </h4>
                  </div>

                  <div className="flex items-center gap-1">
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAllRead();
                        }}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-emerald-400 transition-colors cursor-pointer text-[10px] flex items-center gap-1 font-mono font-bold"
                        title="Tout marquer comme lu"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Tout lire</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsNotifPopoverOpen(false);
                        setIsNotifModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                      title="Préférences de notification"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Quick Toggle Bar */}
                <div className="px-3 py-1.5 bg-slate-100 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between font-mono text-[11px]">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSound();
                      if (!soundEnabled) soundService.playNewSignalSound(true);
                    }}
                    className={`flex items-center gap-1.5 px-2 py-0.5 rounded border transition-all cursor-pointer font-bold ${
                      soundEnabled
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-800 dark:text-emerald-300'
                        : 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {soundEnabled ? <Volume2 className="w-3 h-3 text-emerald-500" /> : <VolumeX className="w-3 h-3 text-slate-400" />}
                    <span>Son: {soundEnabled ? 'ON' : 'OFF'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTogglePush();
                    }}
                    className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded border transition-all cursor-pointer font-bold ${
                      pushEnabled && notifPermission === 'granted'
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-800 dark:text-emerald-300'
                        : 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
                    }`}
                    title={pushEnabled ? "Désactiver les notifications push" : "Activer les notifications push"}
                  >
                    {pushEnabled && notifPermission === 'granted' ? (
                      <Bell className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <BellOff className="w-3 h-3 text-slate-400" />
                    )}
                    <span>Push: {pushEnabled && notifPermission === 'granted' ? 'ON' : 'OFF'}</span>
                  </button>
                </div>

                {/* Alert Items List */}
                <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80">
                  {alerts.length === 0 ? (
                    <div className="p-5 text-center space-y-1 text-slate-600 dark:text-slate-300">
                      <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto" />
                      <p className="text-[11px] font-bold">Aucune alerte non lue</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">Vos alertes de trading apparaîtront ici.</p>
                    </div>
                  ) : (
                    alerts.map((item) => (
                      <div
                        key={item.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setAlerts((prev) => prev.map((a) => (a.id === item.id ? { ...a, isRead: true } : a)));
                          const signalsSection = document.getElementById('signals-section') || document.getElementById('trading-signals');
                          if (signalsSection) signalsSection.scrollIntoView({ behavior: 'smooth' });
                          setIsNotifPopoverOpen(false);
                        }}
                        className={`p-2.5 transition-colors cursor-pointer flex items-start gap-2.5 hover:bg-amber-500/10 dark:hover:bg-slate-800/80 ${
                          !item.isRead ? 'bg-amber-500/10 dark:bg-amber-500/15' : ''
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {item.type === 'BUY' && (
                            <div className="w-5 h-5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                              <TrendingUp className="w-3 h-3" />
                            </div>
                          )}
                          {item.type === 'SELL' && (
                            <div className="w-5 h-5 rounded bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center font-bold">
                              <TrendingDown className="w-3 h-3" />
                            </div>
                          )}
                          {item.type === 'TP' && (
                            <div className="w-5 h-5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center text-[10px]">
                              🎯
                            </div>
                          )}
                          {item.type === 'SL' && (
                            <div className="w-5 h-5 rounded bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center text-[10px]">
                              🛡️
                            </div>
                          )}
                          {item.type === 'ECONOMIC' && (
                            <div className="w-5 h-5 rounded bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                              <ShieldAlert className="w-3 h-3" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 space-y-0.5 min-w-0">
                          <div className="flex items-center justify-between gap-1.5">
                            <h5 className="font-bold text-[11px] text-slate-900 dark:text-slate-100 truncate leading-tight">
                              {item.title}
                            </h5>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono font-medium shrink-0">{item.time}</span>
                          </div>
                          <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-tight font-sans">
                            {item.message}
                          </p>
                          <div className="flex items-center justify-between pt-0.5">
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold border border-slate-300 dark:border-slate-700">
                              {item.badge}
                            </span>
                            {!item.isRead && (
                              <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold flex items-center gap-1 font-mono">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> NOUVEAU
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Popover Footer */}
                <div className="px-3 py-2 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between font-mono text-[11px]">
                  {alerts.length > 0 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClearAlerts();
                      }}
                      className="text-slate-600 dark:text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1 font-bold cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Effacer</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsNotifPopoverOpen(false);
                      setIsNotifModalOpen(true);
                    }}
                    className="ml-auto text-amber-700 dark:text-amber-400 hover:underline font-bold cursor-pointer"
                  >
                    Réglages complets →
                  </button>
                </div>

              </div>
            )}
          </div>

          {/* Compact Theme Selector Toggle Button */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 transition-all active:scale-95 cursor-pointer shrink-0"
              title={theme === 'dark' ? 'Basculer en Mode Clair' : 'Basculer en Mode Sombre'}
            >
              {theme === 'dark' ? (
                <Sun className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-slate-700" />
              )}
            </button>
          )}

          {/* Grouped Options Dropdown Button */}
          <div className="relative" ref={optionsMenuRef}>
            <button
              type="button"
              onClick={() => {
                setIsMenuOpen((prev) => !prev);
                if (isInfosMenuOpen) setIsInfosMenuOpen(false);
              }}
              className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded-lg text-[10px] sm:text-xs font-mono font-bold transition-all active:scale-95 cursor-pointer shrink-0"
              title="Outils & Options du Terminal"
            >
              <span className="hidden sm:inline">Options</span>
              <ChevronDown className={`w-3 h-3 text-slate-600 dark:text-slate-400 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu Overlay */}
            {isMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-60 sm:w-64 max-w-[calc(100vw-1.5rem)] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl p-2 z-50 space-y-1 font-mono text-[10px] sm:text-[10.5px] backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="px-2 py-1 mb-1 border-b border-slate-200 dark:border-slate-800 text-[9px] text-slate-700 dark:text-slate-300 uppercase tracking-wider font-extrabold flex items-center justify-between">
                  <span>Options du Terminal</span>
                </div>

                {/* Install App Option */}
                {onOpenInstallModal && (
                  <button
                    type="button"
                    onClick={onOpenInstallModal}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-950 dark:text-amber-300 flex items-center justify-between transition-colors font-medium cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5 text-[10px] whitespace-nowrap">
                      <Download className="w-3.5 h-3.5 text-amber-500 shrink-0" /> Installer l'App
                    </span>
                    <span className="text-[8px] sm:text-[9px] px-1.5 py-0.2 rounded font-bold bg-amber-500 text-slate-950 shrink-0 whitespace-nowrap">
                      PWA
                    </span>
                  </button>
                )}

                {/* IA Prédictive & Sentiment Macro */}
                <button
                  type="button"
                  onClick={() => {
                    setIsAIMacroModalOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-950 dark:text-cyan-300 flex items-center justify-between transition-colors font-medium cursor-pointer"
                >
                  <span className="flex items-center gap-1.5 text-[10px] whitespace-nowrap">
                    <Brain className="w-3.5 h-3.5 text-cyan-500 shrink-0" /> IA Prédictive & Sentiment
                  </span>
                  <span className="text-[8px] sm:text-[9px] px-1.5 py-0.2 rounded font-bold bg-cyan-500 text-slate-950 shrink-0 whitespace-nowrap">
                    IA
                  </span>
                </button>

                {/* Gamme Objets Publicitaires (Stylo & Cahier) */}
                {onOpenMerchandiseModal && (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenMerchandiseModal();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-950 dark:text-amber-300 flex items-center justify-between transition-colors font-medium cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5 text-[10px] whitespace-nowrap">
                      <Gift className="w-3.5 h-3.5 text-amber-500 shrink-0" /> Objets ChrisXAUUSD
                    </span>
                    <span className="text-[8px] sm:text-[9px] px-1.5 py-0.2 rounded font-bold bg-amber-500 text-slate-950 shrink-0 whitespace-nowrap">
                      STYLO & CAHIER
                    </span>
                  </button>
                )}

                {/* Generate Signal */}
                <button
                  type="button"
                  onClick={onManualGenerateSignal}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center gap-1.5 transition-colors font-medium cursor-pointer text-[10px] whitespace-nowrap"
                >
                  <Zap className="w-3.5 h-3.5 text-blue-500 shrink-0" /> Émettre un Signal
                </button>

                {/* Subscriber Profile Option */}
                {isSubscriberActive && onOpenProfileModal && (
                  <button
                    type="button"
                    onClick={onOpenProfileModal}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-950 dark:text-amber-300 flex items-center justify-between transition-colors font-medium cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5 text-[10px] whitespace-nowrap">
                      <div className="w-3.5 h-3.5 rounded-full overflow-hidden bg-amber-500 text-slate-950 flex items-center justify-center text-[8px] font-bold shrink-0">
                        {userSession?.avatarUrl ? (
                          <img src={userSession.avatarUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span>P</span>
                        )}
                      </div>
                      Mon Profil & Photo
                    </span>
                    <span className="text-[8px] sm:text-[9px] px-1.5 py-0.2 rounded font-bold bg-amber-500 text-slate-950 shrink-0 whitespace-nowrap">
                      VIP
                    </span>
                  </button>
                )}

                {/* Login or Profile switch */}
                {!isSubscriberActive && (
                  <button
                    type="button"
                    onClick={onOpenLoginModal}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-950/40 text-amber-950 dark:text-amber-300 flex items-center gap-1.5 transition-colors font-medium cursor-pointer text-[10px] whitespace-nowrap"
                  >
                    <LogIn className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" /> Connexion Membre
                  </button>
                )}

                <button
                  type="button"
                  onClick={onChangeProfile}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100 flex items-center gap-1.5 transition-colors font-medium cursor-pointer text-[10px] whitespace-nowrap"
                >
                  <Users className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400 shrink-0" /> Changer de Profil
                </button>

                {isSubscriberActive && (
                  <button
                    type="button"
                    onClick={onLogout}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-700 dark:text-rose-400 flex items-center gap-1.5 transition-colors border-t border-slate-100 dark:border-slate-800 mt-1 font-medium cursor-pointer text-[10px] whitespace-nowrap"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" /> Se déconnecter
                  </button>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Right Section: Clean Single MENU Button for Mobile (< md) */}
        <div className="flex md:hidden items-center gap-1.5 shrink-0" ref={mobileMenuRef}>
          
          {/* VIP Badge icon shortcut if logged in */}
          {isSubscriberActive && onOpenProfileModal && (
            <button
              type="button"
              onClick={onOpenProfileModal}
              className="flex items-center gap-1 bg-amber-500/20 border border-amber-500/40 text-amber-400 px-1.5 py-1 rounded-lg text-[10px] font-mono font-bold shrink-0"
              title="Mon Profil VIP"
            >
              <div className="w-4 h-4 rounded-full overflow-hidden bg-amber-500 text-slate-950 flex items-center justify-center text-[8px] font-black shrink-0">
                {userSession?.avatarUrl ? (
                  <img src={userSession.avatarUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span>V</span>
                )}
              </div>
              <span className="text-[9px] font-extrabold text-amber-300">J-{subscription.daysRemaining}</span>
            </button>
          )}

          {/* Single Mobile MENU Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 border border-amber-400 px-2.5 py-1 rounded-lg text-xs font-mono font-black shadow-xs transition-all active:scale-95 cursor-pointer relative shrink-0"
            title="Menu CHRISXAUUSD"
          >
            {isMobileMenuOpen ? (
              <X className="w-4 h-4 text-slate-950 shrink-0" />
            ) : (
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-950 shrink-0" />
            )}
            <span>MENU</span>

            {/* Unread dot indicator on Mobile MENU button */}
            {unreadCount > 0 && !isMobileMenuOpen && (
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
              </span>
            )}
          </button>

          {/* Comprehensive Mobile Menu Overlay Dropdown */}
          {isMobileMenuOpen && (
            <div className="absolute right-1 top-full mt-1.5 w-[calc(100vw-0.75rem)] max-w-sm bg-slate-900 border border-slate-700/80 text-white rounded-2xl shadow-2xl p-3 z-50 space-y-2.5 font-mono text-xs backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150 box-border">
              
              {/* Header / Profile Status */}
              <div className="p-2.5 rounded-xl bg-slate-800/90 border border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xs shrink-0 overflow-hidden">
                    {userSession?.avatarUrl ? (
                      <img src={userSession.avatarUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span>C</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-xs text-white truncate">
                      {userSession?.name || 'Membre CHRISXAUUSD'}
                    </div>
                    <div className="text-[10px] text-amber-400 font-bold">
                      {isSubscriberActive ? `VIP Actif (J-${subscription.daysRemaining})` : 'Compte Visiteur'}
                    </div>
                  </div>
                </div>

                {!isSubscriberActive ? (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenSubscribeModal();
                    }}
                    className="px-2 py-1 rounded bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[10px] shrink-0"
                  >
                    REJOINDRE VIP
                  </button>
                ) : onOpenProfileModal ? (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenProfileModal();
                    }}
                    className="px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-amber-300 font-bold text-[10px] shrink-0"
                  >
                    Profil
                  </button>
                ) : null}
              </div>

              {/* Quick Settings Bar: Theme, Sound, Push */}
              <div className="grid grid-cols-3 gap-1.5 text-[10px] font-bold">
                {/* Theme Toggle */}
                {onToggleTheme && (
                  <button
                    onClick={() => {
                      onToggleTheme();
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center gap-1 text-slate-200 cursor-pointer"
                  >
                    {theme === 'dark' ? (
                      <>
                        <Sun className="w-3.5 h-3.5 text-amber-400" />
                        <span>Clair</span>
                      </>
                    ) : (
                      <>
                        <Moon className="w-3.5 h-3.5 text-blue-400" />
                        <span>Sombre</span>
                      </>
                    )}
                  </button>
                )}

                {/* Sound Toggle */}
                <button
                  onClick={() => {
                    onToggleSound();
                    if (!soundEnabled) soundService.playNewSignalSound(true);
                  }}
                  className={`p-1.5 rounded-lg border flex items-center justify-center gap-1 cursor-pointer ${
                    soundEnabled
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
                  <span>Son {soundEnabled ? 'ON' : 'OFF'}</span>
                </button>

                {/* Push Toggle */}
                <button
                  onClick={() => handleTogglePush()}
                  className={`p-1.5 rounded-lg border flex items-center justify-center gap-1 cursor-pointer ${
                    pushEnabled && notifPermission === 'granted'
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>Push {pushEnabled && notifPermission === 'granted' ? 'ON' : 'OFF'}</span>
                </button>
              </div>

              {/* Navigation Options Group */}
              <div className="space-y-1 pt-1 border-t border-slate-800">
                <div className="text-[9px] uppercase text-slate-400 font-extrabold px-1 tracking-wider">
                  Menu & Ressources
                </div>

                {/* Notifications Modal */}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsNotifModalOpen(true);
                  }}
                  className="w-full text-left p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-100 flex items-center justify-between transition-colors font-medium cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <BellRing className="w-4 h-4 text-amber-400 shrink-0" /> Alertes XAU/USD
                  </span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-red-500 text-white font-extrabold text-[9px]">
                      {unreadCount} non lues
                    </span>
                  )}
                </button>

                {/* Livre PDF */}
                {onOpenEbookModal && (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenEbookModal();
                    }}
                    className="w-full text-left p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-100 flex items-center justify-between transition-colors font-medium cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-amber-400 shrink-0" /> Livre Scalping (PDF)
                    </span>
                    <span className="text-[9px] text-amber-300 bg-amber-500/20 px-1.5 py-0.5 rounded font-bold">
                      EBOOK
                    </span>
                  </button>
                )}

                {/* Calendrier Économique */}
                {onOpenCalendar && (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenCalendar();
                    }}
                    className="w-full text-left p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-100 flex items-center justify-between transition-colors font-medium cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-400 shrink-0" /> Calendrier Économique
                    </span>
                    <span className="text-[9px] text-blue-300 bg-blue-500/20 px-1.5 py-0.5 rounded font-bold">
                      FED / CPI
                    </span>
                  </button>
                )}

                {/* IA Prédictive */}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsAIMacroModalOpen(true);
                  }}
                  className="w-full text-left p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-100 flex items-center justify-between transition-colors font-medium cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-cyan-400 shrink-0" /> IA Prédictive & Sentiment
                  </span>
                  <span className="text-[9px] text-cyan-300 bg-cyan-500/20 px-1.5 py-0.5 rounded font-bold">
                    MACRO
                  </span>
                </button>

                {/* Objets Publicitaires */}
                {onOpenMerchandiseModal && (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenMerchandiseModal();
                    }}
                    className="w-full text-left p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-100 flex items-center justify-between transition-colors font-medium cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Gift className="w-4 h-4 text-amber-400 shrink-0" /> Objets ChrisXAUUSD
                    </span>
                    <span className="text-[9px] text-amber-300 bg-amber-500/20 px-1.5 py-0.5 rounded font-bold">
                      STYLO & CAHIER
                    </span>
                  </button>
                )}

                {/* PWA Installer */}
                {onOpenInstallModal && (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenInstallModal();
                    }}
                    className="w-full text-left p-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 flex items-center justify-between transition-colors font-medium cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Download className="w-4 h-4 text-amber-400 shrink-0" /> Installer l'Application
                    </span>
                    <span className="text-[9px] text-slate-950 bg-amber-400 px-1.5 py-0.5 rounded font-black">
                      PWA
                    </span>
                  </button>
                )}
              </div>

              {/* Account Actions */}
              <div className="pt-1.5 border-t border-slate-800 space-y-1">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onManualGenerateSignal();
                  }}
                  className="w-full text-left p-2 rounded-xl hover:bg-slate-800 text-blue-400 flex items-center gap-2 font-medium cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-blue-400 shrink-0" /> Émettre un Signal
                </button>

                {!isSubscriberActive && (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenLoginModal();
                    }}
                    className="w-full text-left p-2 rounded-xl hover:bg-slate-800 text-amber-400 flex items-center gap-2 font-medium cursor-pointer"
                  >
                    <LogIn className="w-4 h-4 text-amber-400 shrink-0" /> Connexion Membre
                  </button>
                )}

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onChangeProfile();
                  }}
                  className="w-full text-left p-2 rounded-xl hover:bg-slate-800 text-slate-300 flex items-center gap-2 font-medium cursor-pointer"
                >
                  <Users className="w-4 h-4 text-slate-400 shrink-0" /> Changer de Profil
                </button>

                {isSubscriberActive && (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full text-left p-2 rounded-xl hover:bg-rose-950/40 text-rose-400 flex items-center gap-2 font-medium border-t border-slate-800 pt-2 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-rose-400 shrink-0" /> Se déconnecter
                  </button>
                )}
              </div>

            </div>
          )}
        </div>

      </div>

      <NotificationModal
        isOpen={isNotifModalOpen}
        onClose={() => setIsNotifModalOpen(false)}
        soundEnabled={soundEnabled}
        onToggleSound={onToggleSound}
      />

      {/* Modal IA Prédictive & Sentiment Macro */}
      {isAIMacroModalOpen && createPortal(
        <div className="fixed inset-0 z-[99999] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-5 overflow-y-auto animate-in fade-in duration-200 font-sans">
          <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl shadow-2xl bg-slate-900 border border-cyan-500/30 p-2 sm:p-4 my-auto">
            <button
              onClick={() => setIsAIMacroModalOpen(false)}
              className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-10 p-1.5 sm:p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700 cursor-pointer"
              title="Fermer"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <React.Suspense fallback={
              <div className="py-12 text-center space-y-3 font-mono">
                <Brain className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
                <p className="text-xs text-cyan-300 animate-pulse">
                  Chargement du module d'analyse macroéconomique...
                </p>
              </div>
            }>
              <AIPredictiveSentimentModule className="my-0 border-0 bg-transparent p-1 sm:p-3 shadow-none" />
            </React.Suspense>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
};
