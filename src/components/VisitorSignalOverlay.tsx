import React from 'react';
import { motion } from 'motion/react';
import { Lock, Sparkles, LogIn, CheckCircle2, ShieldCheck, Zap, ArrowRight } from 'lucide-react';

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
  title = 'Mode Visiteur',
  description = "Vous consultez un aperçu des performances. Passez à l'offre Premium pour accéder aux signaux en temps réel, aux prix d'entrée précis, aux Stop Loss et Take Profit.",
  compact = false,
}) => {
  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="absolute inset-0 z-20 backdrop-blur-xl bg-white/95 dark:bg-slate-950/90 rounded-2xl border-2 border-blue-500/60 dark:border-amber-500/40 p-4 flex flex-col items-center justify-center text-center shadow-xl overflow-hidden"
      >
        {/* Background ambient glow */}
        <div className="absolute -top-10 -left-10 w-28 h-28 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-28 h-28 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative mb-2">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-amber-500/20 border border-blue-300 dark:border-amber-400/50 flex items-center justify-center text-blue-600 dark:text-amber-400 shadow-md">
            <Lock className="w-5 h-5" />
          </div>
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600" />
          </span>
        </div>

        <h3 className="text-xs font-bold font-mono text-slate-900 dark:text-slate-100 mb-1 max-w-xs">{title}</h3>
        <p className="text-[11px] text-slate-600 dark:text-slate-300 font-sans max-w-xs mb-3 line-clamp-2 leading-tight">{description}</p>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={onOpenSubscribeModal}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold font-mono px-3.5 py-1.5 rounded-xl shadow-md active:scale-[0.98] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>Voir les offres Premium</span>
          </button>
          <button
            onClick={onOpenLoginModal}
            className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-blue-700 dark:text-amber-300 border border-blue-300 dark:border-amber-500/40 text-xs font-mono font-bold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
          >
            <LogIn className="w-3 h-3 text-blue-600 dark:text-amber-400" />
            <span>Connexion</span>
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute inset-0 z-20 backdrop-blur-2xl bg-white/95 dark:bg-slate-950/92 rounded-3xl border-2 border-blue-600/70 dark:border-amber-500/40 p-6 sm:p-8 flex flex-col items-center justify-center text-center shadow-2xl space-y-4 overflow-hidden"
    >
      {/* Radial Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Lock emblem with pulsing radar */}
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-amber-500/20 border border-blue-300 dark:border-amber-400/60 flex items-center justify-center text-blue-600 dark:text-amber-400 shadow-xl shadow-blue-500/10 backdrop-blur-md">
          <Sparkles className="w-8 h-8 fill-blue-600/20 text-blue-600 dark:text-amber-400 drop-shadow-md" />
        </div>
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-blue-600" />
        </span>
      </div>

      {/* Header Info */}
      <div className="space-y-1.5 max-w-md relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-blue-50 dark:bg-amber-950/90 text-blue-800 dark:text-amber-300 border border-blue-300 dark:border-amber-500/50 uppercase tracking-widest shadow-xs">
          <Zap className="w-3 h-3 fill-blue-600 text-blue-600 dark:fill-amber-400 dark:text-amber-400" />
          <span>{title}</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-sans leading-relaxed pt-1">
          {description}
        </p>
      </div>

      {/* Checklist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left text-xs font-mono text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-900/90 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800/90 max-w-md w-full shadow-inner relative z-10">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Setups ACHAT/VENTE M1/M5</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Niveaux SL & TP exacts</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Calculateur de Risque Auto</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Confluences & Contexte M5</span>
        </div>
      </div>

      {/* Primary & Secondary Action CTAs */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md pt-1 relative z-10">
        <button
          onClick={onOpenSubscribeModal}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-mono font-bold py-3 px-5 rounded-2xl text-xs sm:text-sm shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 group cursor-pointer"
        >
          <Sparkles className="w-4 h-4 fill-white text-white group-hover:rotate-12 transition-transform" />
          <span>Voir les offres Premium</span>
          <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
        </button>

        <button
          onClick={onOpenLoginModal}
          className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-blue-700 dark:text-amber-300 border border-blue-300 dark:border-amber-500/40 font-mono font-semibold py-3 px-4 rounded-2xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <LogIn className="w-4 h-4 text-blue-600 dark:text-amber-400" />
          <span>Déjà abonné ? Se connecter</span>
        </button>
      </div>

      <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1.5 relative z-10">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
        <span>Paiement sécurisé par Mobile Money (Orange, MTN, Wave) & Carte Bancaire</span>
      </p>

    </motion.div>
  );
};


