import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Zap, Calculator, Clock, Globe, LogIn, LogOut, Sparkles, Users, CheckCircle2, ChevronDown } from 'lucide-react';
import { MarketSession, AuthUser, UserSubscription } from '../types';
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
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

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
    <header className="bg-white/90 border-b border-slate-200/80 text-[#0F172A] px-4 py-2 sm:py-2.5 shadow-xs backdrop-blur-xl sticky top-0 z-40 transition-all font-sans">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left: Branding, Symbol Badge & Live Status */}
        <div className="flex items-center gap-3">
          <div
            {...handlers}
            className="flex items-center gap-2.5 cursor-pointer select-none relative group"
            title="ChrisXauusd Terminal"
          >
            <div className="relative">
              <ChrisXauusdLogoIcon className="w-8 h-8 sm:w-8.5 sm:h-8.5" />
              {isPressing && (
                <svg className="absolute -inset-1 w-[42px] h-[42px] pointer-events-none z-20">
                  <circle
                    cx="21"
                    cy="21"
                    r="18"
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
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-black tracking-tight text-[#0F172A] flex items-center gap-1.5 font-mono">
                  <span className="text-[#0F172A]">ChrisXauusd</span>
                </h1>
                
                {/* Badge XAU/USD */}
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-300 uppercase">
                  XAU/USD
                </span>

                {/* LIVE Status Indicator */}
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  LIVE
                </span>
              </div>
            </div>
          </div>

          {/* Active Sessions Bar */}
          <div className="hidden lg:flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-xl border border-slate-200 text-xs ml-2">
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <div className="flex items-center gap-1">
              {marketSessions.map((session) => (
                <div
                  key={session.name}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-semibold transition-colors ${
                    session.isActiveNow
                      ? 'bg-emerald-600 text-white font-bold shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                  title={`${session.name} (${session.openTimeGmt}-${session.closeTimeGmt} GMT)`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      session.isActiveNow ? 'bg-white animate-ping' : 'bg-slate-400'
                    }`}
                  />
                  <span>{session.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Primary CTA + Grouped Secondary Actions Menu */}
        <div className="flex items-center gap-2.5">
          
          {/* Main Primary Visible CTA */}
          {isSubscriberActive ? (
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded-xl text-xs font-mono shadow-xs backdrop-blur-md">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-emerald-900 font-bold tracking-tight hidden sm:inline">
                Abonnement VIP Actif
              </span>
              <span className="text-[10px] bg-emerald-600 text-white border border-emerald-700 px-2 py-0.5 rounded-full font-bold">
                J-{subscription.daysRemaining}
              </span>
            </div>
          ) : (
            <button
              onClick={onOpenSubscribeModal}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-bold font-mono px-4 py-2 rounded-xl text-xs shadow-md shadow-amber-500/20 active:scale-[0.98] transition-all shrink-0"
            >
              <Sparkles className="w-4 h-4 fill-slate-950 text-slate-950" />
              <span>Découvrir Premium</span>
            </button>
          )}

          {/* Grouped Secondary Tools Dropdown Button */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all active:scale-95"
              title="Outils & Options"
            >
              <span>Options</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-600 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu Overlay */}
            {isMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 space-y-1 font-mono text-xs backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                  Options du Terminal
                </div>

                {/* Risk Calculator */}
                <button
                  onClick={onOpenCalculator}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 text-slate-800 flex items-center justify-between transition-colors font-semibold"
                >
                  <span className="flex items-center gap-2">
                    <Calculator className="w-3.5 h-3.5 text-blue-600" /> Calcul Risque
                  </span>
                </button>

                {/* Sound Toggle */}
                <button
                  onClick={onToggleSound}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 text-slate-800 flex items-center justify-between transition-colors font-semibold"
                >
                  <span className="flex items-center gap-2">
                    {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-600" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
                    Avertissements Sonores
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${soundEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}>
                    {soundEnabled ? 'ON' : 'OFF'}
                  </span>
                </button>

                {/* Generate Signal */}
                <button
                  onClick={onManualGenerateSignal}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 text-blue-700 flex items-center gap-2 transition-colors font-semibold"
                >
                  <Zap className="w-3.5 h-3.5 text-blue-600" /> Émettre un Signal
                </button>

                {/* Login or Profile switch */}
                {!isSubscriberActive && (
                  <button
                    onClick={onOpenLoginModal}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-amber-50 text-amber-800 flex items-center gap-2 transition-colors font-bold"
                  >
                    <LogIn className="w-3.5 h-3.5 text-amber-600" /> Connexion Membre
                  </button>
                )}

                <button
                  onClick={onChangeProfile}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 text-slate-700 flex items-center gap-2 transition-colors font-semibold"
                >
                  <Users className="w-3.5 h-3.5 text-slate-500" /> Changer de Profil
                </button>

                {isSubscriberActive && (
                  <button
                    onClick={onLogout}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-rose-50 text-rose-700 flex items-center gap-2 transition-colors border-t border-slate-100 mt-1 font-bold"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-600" /> Se déconnecter
                  </button>
                )}
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
