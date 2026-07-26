import React from 'react';
import { Lock, Sparkles, LogIn, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { formatFcfa, SUBSCRIPTION_PRICE_FCFA } from '../lib/subscriptionService';

interface VisitorSignalOverlayProps {
  onOpenSubscribeModal: () => void;
  onOpenLoginModal: () => void;
  title?: string;
  description?: string;
  compact?: boolean;
}

export const VisitorSignalOverlay: React.FC<VisitorSignalOverlayProps> = ({
  onOpenSubscribeModal,
  onOpenLoginModal,
  title = 'Abonnez-vous pour débloquer les signaux en temps réel',
  description = "Accédez aux prix d'entrée exacts, Stop Loss, Take Profits et notifications de scalping XAU/USD M1/M5.",
  compact = false,
}) => {
  if (compact) {
    return (
      <div className="absolute inset-0 z-20 backdrop-blur-md bg-[#08090c]/85 rounded-xl border border-amber-500/30 flex flex-col items-center justify-center p-4 text-center">
        <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-400 mb-2">
          <Lock className="w-4 h-4" />
        </div>
        <h3 className="text-xs font-bold text-slate-100 font-mono mb-1">{title}</h3>
        <p className="text-[11px] text-slate-400 max-w-xs mb-3 line-clamp-2">{description}</p>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSubscribeModal}
            className="bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-lg shadow-md transition-all flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>S'abonner – {formatFcfa(SUBSCRIPTION_PRICE_FCFA)}</span>
          </button>
          <button
            onClick={onOpenLoginModal}
            className="bg-[#161a26] hover:bg-[#202638] text-amber-300 border border-amber-500/30 text-xs px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 font-mono"
          >
            <LogIn className="w-3 h-3" />
            <span>Connexion</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-20 backdrop-blur-md bg-[#090b11]/90 rounded-2xl border border-amber-500/40 p-6 flex flex-col items-center justify-center text-center shadow-2xl space-y-4">
      
      {/* Icon Badge */}
      <div className="relative">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400/20 via-amber-600/20 to-amber-900/30 border border-amber-500/50 flex items-center justify-center text-amber-400 shadow-xl shadow-amber-500/10">
          <Lock className="w-7 h-7" />
        </div>
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500" />
        </span>
      </div>

      {/* Main Title & Subtitle */}
      <div className="space-y-1.5 max-w-md">
        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-950/80 text-amber-300 border border-amber-500/40 uppercase tracking-widest">
          ACCÈS RÉSERVÉ AUX ABONNÉS
        </span>
        <h3 className="text-base sm:text-lg font-bold text-slate-100 font-mono tracking-tight">
          {title}
        </h3>
        <p className="text-xs text-slate-300 font-sans leading-relaxed">
          {description}
        </p>
      </div>

      {/* Key Benefits Checklist */}
      <div className="grid grid-cols-2 gap-2 text-left text-[11px] font-mono text-slate-300 bg-[#10131d] p-3 rounded-xl border border-[#202536] max-w-sm w-full">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Setups ACHAT/VENTE</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Stop Loss & Take Profit</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Calculateur de Risque</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Confluences M1/M5</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-xs pt-1">
        <button
          onClick={onOpenSubscribeModal}
          className="w-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm shadow-lg shadow-amber-500/25 active:scale-98 transition-all flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 fill-current" />
          <span>S'abonner – {formatFcfa(SUBSCRIPTION_PRICE_FCFA)} / mois</span>
        </button>

        <button
          onClick={onOpenLoginModal}
          className="w-full bg-[#161a26] hover:bg-[#202638] text-amber-300 border border-amber-500/30 font-medium py-2 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 font-mono"
        >
          <LogIn className="w-3.5 h-3.5 text-amber-400" />
          <span>Déjà abonné ? Se connecter</span>
        </button>
      </div>

      <p className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
        <ShieldCheck className="w-3 h-3 text-emerald-400" />
        Accès immédiat après paiement simulé ou connexion
      </p>

    </div>
  );
};
