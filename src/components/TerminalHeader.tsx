import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, Zap, Calculator, Clock, Globe, UserCheck, LogIn, LogOut, Sparkles, User, ShieldAlert, Users, RefreshCw, CheckCircle2 } from 'lucide-react';
import { MarketSession, AuthUser, UserSubscription } from '../types';
import { formatFcfa, SUBSCRIPTION_PRICE_FCFA } from '../lib/subscriptionService';
import { ChrisXauusdLogoIcon } from './ChrisXauusdLogo';
import { useLongPress } from '../lib/useLongPress';

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
  onLogout: () => void;
  onTriggerSecretAdmin?: () => void;
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
  onLogout,
  onTriggerSecretAdmin,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');

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
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 px-4 py-3.5 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4">
        
        {/* Left: Branding & Session Status */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-between lg:justify-start">
          <div
            {...handlers}
            className="flex items-center gap-2.5 cursor-pointer select-none relative group"
            title="ChrisXauusd Terminal"
          >
            <div className="relative">
              <ChrisXauusdLogoIcon className="w-9 h-9" />
              {isPressing && (
                <svg className="absolute -inset-1 w-[44px] h-[44px] pointer-events-none z-20">
                  <circle
                    cx="22"
                    cy="22"
                    r="19"
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="2.5"
                    strokeDasharray="120"
                    strokeDashoffset={120 - (120 * progress) / 100}
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                  <span className="text-blue-400 font-black tracking-wider">ChrisXauusd</span>
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-950 text-blue-300 border border-blue-700/60">
                  XAU/USD M1/M5
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                SIGNAUX DE TRADING OR EN TEMPS RÉEL
              </p>
            </div>
          </div>

          {/* Active Sessions Bar */}
          <div className="hidden sm:flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/80 text-xs">
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            <div className="flex items-center gap-1.5">
              {marketSessions.map((session) => (
                <div
                  key={session.name}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                    session.isActiveNow
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-900/60 text-slate-400 border border-slate-800'
                  }`}
                  title={`${session.name} (${session.openTimeGmt}-${session.closeTimeGmt} GMT)`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      session.isActiveNow ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'
                    }`}
                  />
                  <span>{session.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Actions, Subscription & User Session Controls */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-end">
          
          {/* Subscription / User Auth Pill & Switch Profile Button */}
          {isSubscriberActive ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-emerald-950/90 border border-emerald-500/50 px-3 py-1.5 rounded-xl text-xs font-mono shadow-md backdrop-blur-md">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-emerald-300 font-bold tracking-tight">
                    Abonnement Premium actif
                  </span>
                  <span className="text-[10px] bg-emerald-900/90 text-emerald-200 border border-emerald-400/50 px-2 py-0.5 rounded-full font-bold ml-1">
                    J-{subscription.daysRemaining}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  className="text-slate-400 hover:text-rose-400 p-1 rounded transition-colors ml-1 active:scale-95"
                  title="Se déconnecter"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={onChangeProfile}
                className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-2.5 py-1.5 rounded-lg text-xs font-mono active:scale-[0.97] transition-all"
                title="Changer de profil d'accès"
              >
                <Users className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline">Changer profil</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenSubscribeModal}
                className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-bold font-mono px-3.5 py-1.5 rounded-xl text-xs shadow-md shadow-amber-500/20 active:scale-[0.97] hover:shadow-amber-500/30 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 fill-current text-slate-950" />
                <span>Voir les offres Premium</span>
              </button>

              {!userSession && (
                <button
                  onClick={onOpenLoginModal}
                  className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 px-2.5 py-1.5 rounded-lg text-xs font-mono active:scale-[0.97] transition-all"
                  title="Espace membre abonné"
                >
                  <LogIn className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Connexion</span>
                </button>
              )}

              <button
                onClick={onChangeProfile}
                className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-2.5 py-1.5 rounded-lg text-xs font-mono active:scale-[0.97] transition-all"
                title="Changer de profil d'accès"
              >
                <Users className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline">Changer profil</span>
              </button>
            </div>
          )}

          {/* UTC Clock */}
          <div className="hidden xl:flex items-center gap-1.5 bg-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-700 text-xs font-mono text-slate-300">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span>{currentTime || '00:00:00 GMT'}</span>
          </div>

          {/* Risk Calculator Toggle */}
          <button
            onClick={onOpenCalculator}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-2.5 py-1.5 rounded-lg text-xs font-medium active:scale-[0.97] transition-all"
            title="Calculateur de Taille de Position & Risque"
          >
            <Calculator className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Calcul Risk</span>
          </button>

          {/* Sound Mute/Unmute */}
          <button
            onClick={onToggleSound}
            className={`p-1.5 rounded-lg border active:scale-[0.97] transition-all ${
              soundEnabled
                ? 'bg-blue-950/80 border-blue-500/50 text-blue-300'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title={soundEnabled ? 'Avertissements sonores activés' : 'Désactivé'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Immediate Signal Generation Button */}
          <button
            onClick={onManualGenerateSignal}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs active:scale-[0.97] transition-all shadow-sm"
          >
            <Zap className="w-3.5 h-3.5 fill-current text-blue-200" />
            <span className="hidden sm:inline">+ Signal</span>
          </button>

        </div>

      </div>
    </header>
  );
};

