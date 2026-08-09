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
        className="absolute inset-0 z-20 backdrop-blur-xl bg-[#071426]/95 rounded-2xl border-2 border-[#00E5FF]/40 p-4 flex flex-col items-center justify-center text-center shadow-2xl overflow-hidden"
      >
        {/* Background ambient glow */}
        <div className="absolute -top-10 -left-10 w-28 h-28 bg-[#00E5FF]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-28 h-28 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative mb-2">
          <div className="w-10 h-10 rounded-2xl bg-[#030B16] border border-[#00E5FF]/40 flex items-center justify-center text-[#00E5FF] shadow-md">
            <Lock className="w-5 h-5" />
          </div>
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E5FF] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00E5FF]" />
          </span>
        </div>

        <h3 className="text-xs font-bold font-mono text-white mb-1 max-w-xs">{title}</h3>
        <p className="text-[11px] text-slate-300 font-sans max-w-xs mb-3 line-clamp-2 leading-tight">{description}</p>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={onOpenSubscribeModal}
            className="bg-[#00E5FF] hover:bg-[#00E5FF]/90 text-[#030B16] text-xs font-black font-mono px-3.5 py-1.5 rounded-xl shadow-md active:scale-[0.98] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 fill-[#030B16]" />
            <span>Voir les offres Premium</span>
          </button>
          <button
            onClick={onOpenLoginModal}
            className="bg-[#030B16] hover:bg-[#030B16]/80 text-[#00E5FF] border border-[#00E5FF]/30 text-xs font-mono font-bold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
          >
            <LogIn className="w-3 h-3 text-[#00E5FF]" />
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
      className="absolute inset-0 z-20 backdrop-blur-2xl bg-[#071426]/95 rounded-3xl border-2 border-[#00E5FF]/40 p-6 sm:p-8 flex flex-col items-center justify-center text-center shadow-2xl space-y-4 overflow-hidden"
    >
      {/* Radial Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-[#00E5FF]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Lock emblem with pulsing radar */}
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-[#030B16] border border-[#00E5FF]/40 flex items-center justify-center text-[#00E5FF] shadow-xl shadow-[#00E5FF]/10 backdrop-blur-md">
          <Sparkles className="w-8 h-8 fill-[#00E5FF]/20 text-[#00E5FF] drop-shadow-md" />
        </div>
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E5FF] opacity-75" />
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#00E5FF]" />
        </span>
      </div>

      {/* Header Info */}
      <div className="space-y-1.5 max-w-md relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-[#030B16] text-[#00E5FF] border border-[#00E5FF]/40 uppercase tracking-widest shadow-xs">
          <Zap className="w-3 h-3 fill-[#00E5FF] text-[#00E5FF]" />
          <span>{title}</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed pt-1">
          {description}
        </p>
      </div>

      {/* Checklist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left text-xs font-mono text-slate-200 bg-[#030B16] p-3.5 rounded-2xl border border-slate-800 max-w-md w-full shadow-inner relative z-10">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0" />
          <span>Setups ACHAT/VENTE M1/M5</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0" />
          <span>Niveaux SL & TP exacts</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0" />
          <span>Calculateur de Risque Auto</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0" />
          <span>Confluences & Contexte M5</span>
        </div>
      </div>

      {/* Primary & Secondary Action CTAs */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md pt-1 relative z-10">
        <button
          onClick={onOpenSubscribeModal}
          className="w-full bg-[#00E5FF] hover:bg-[#00E5FF]/90 text-[#030B16] font-mono font-black py-3 px-5 rounded-2xl text-xs sm:text-sm shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 group cursor-pointer"
        >
          <Sparkles className="w-4 h-4 fill-[#030B16] text-[#030B16] group-hover:rotate-12 transition-transform" />
          <span>Voir les offres Premium</span>
          <ArrowRight className="w-4 h-4 text-[#030B16] group-hover:translate-x-1 transition-transform" />
        </button>

        <button
          onClick={onOpenLoginModal}
          className="w-full bg-[#030B16] hover:bg-[#030B16]/80 text-[#00E5FF] border border-[#00E5FF]/30 font-mono font-bold py-3 px-4 rounded-2xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <LogIn className="w-4 h-4 text-[#00E5FF]" />
          <span>Déjà abonné ? Se connecter</span>
        </button>
      </div>

      <p className="text-[10px] font-mono text-slate-400 flex items-center gap-1.5 relative z-10">
        <ShieldCheck className="w-3.5 h-3.5 text-[#22C55E]" />
        <span>Paiement sécurisé par Mobile Money (Orange, MTN, Wave) & Carte Bancaire</span>
      </p>

    </motion.div>
  );
};


