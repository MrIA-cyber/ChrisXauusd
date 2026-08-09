import React from 'react';
import { motion } from 'motion/react';
import { Eye, Sparkles, CheckCircle2, Lock, ArrowRight, ShieldCheck, LogIn, Zap, Crown } from 'lucide-react';
import { formatFcfa, SUBSCRIPTION_PRICE_FCFA } from '../lib/subscriptionService';
import { ChrisXauusdHomeLogo } from './ChrisXauusdLogo';

interface OnboardingProfileSelectorProps {
  onSelectVisitor: () => void;
  onSelectTraderPayment: () => void;
  onOpenLoginModal: () => void;
}

export const OnboardingProfileSelector: React.FC<OnboardingProfileSelectorProps> = ({
  onSelectVisitor,
  onSelectTraderPayment,
  onOpenLoginModal,
}) => {
  return (
    <div className="min-h-screen bg-[#030B16] flex flex-col justify-center items-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans text-slate-100 selection:bg-[#00E5FF] selection:text-[#030B16]">
      
      <div className="max-w-5xl w-full space-y-6 sm:space-y-8">
        
        {/* Crafted Logo Header Display */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full flex justify-center"
        >
          <ChrisXauusdHomeLogo />
        </motion.div>

        {/* Profile Choice Subtitle */}
        <div className="text-center space-y-2">
          <h1 className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight">
            Choisissez votre profil d'accès
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto font-sans">
            Sélectionnez le Mode Visiteur pour découvrir le terminal ou activez le Profil Trader VIP pour débloquer 100% des signaux.
          </p>
        </div>

        {/* Profile Choice Grid (2 Large Cards Side-by-Side on md+, Stacked on Mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-stretch">
          
          {/* CARD 1: VISITEUR */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-[#071426] border border-[#00E5FF]/20 hover:border-[#00E5FF]/50 hover:shadow-[0_0_25px_rgba(0,229,255,0.1)] transition-all duration-300 rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative group"
          >
            <div className="space-y-5">
              
              {/* Header Badge & Icon */}
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#030B16] border border-[#00E5FF]/20 text-[#00E5FF] flex items-center justify-center font-bold shadow-md">
                  <Eye className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-slate-800/80 text-slate-300 border border-slate-700 uppercase tracking-wider">
                  GRATUIT • ACCÈS IMMÉDIAT
                </span>
              </div>

              {/* Title & Description */}
              <div>
                <h2 className="text-base sm:text-lg font-bold font-mono text-white group-hover:text-[#00E5FF] transition-colors flex items-center gap-2">
                  <span>PROFIL VISITEUR</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
                  Accès libre pour explorer la plateforme et suivre les analyses macroéconomiques sans inscription.
                </p>
              </div>

              {/* Included / Restricted Features List */}
              <div className="space-y-2.5 pt-3 border-t border-slate-800 text-xs font-mono">
                <div className="flex items-start gap-2 text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                  <span>Accès direct au tableau de bord sans inscription</span>
                </div>
                <div className="flex items-start gap-2 text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                  <span>Flux de prix XAU/USD et graphique M1/M5 en direct</span>
                </div>
                <div className="flex items-start gap-2 text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                  <span>Accès libre aux actualités & guides éducation</span>
                </div>

                <div className="flex items-start gap-2 text-slate-400 bg-[#030B16] p-3 rounded-xl border border-slate-800">
                  <Lock className="w-4 h-4 text-[#00E5FF] shrink-0 mt-0.5" />
                  <span className="text-[11px]">
                    Niveaux Entrée, Stop Loss & TP floutés. Direction remplacée par <strong className="text-slate-200">« Setup verrouillé »</strong>.
                  </span>
                </div>
              </div>

            </div>

            {/* Action CTA Button */}
            <div className="pt-6 mt-6 border-t border-slate-800 space-y-2">
              <button
                onClick={onSelectVisitor}
                className="w-full bg-[#030B16] hover:bg-[#030B16]/80 border border-[#00E5FF]/30 text-slate-200 hover:text-white font-bold py-3.5 px-5 rounded-2xl text-xs sm:text-sm font-mono transition-all flex items-center justify-center gap-2 group/btn cursor-pointer active:scale-[0.98]"
              >
                <span>Accéder en Mode Visiteur</span>
                <ArrowRight className="w-4 h-4 text-[#00E5FF] group-hover/btn:translate-x-1 transition-transform" />
              </button>
              <p className="text-[11px] text-center text-slate-400 font-mono">
                Aucune carte ni abonnement requis
              </p>
            </div>

          </motion.div>

          {/* CARD 2: TRADER VIP */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-[#071426] border-2 border-[#00E5FF] shadow-[0_0_30px_rgba(0,229,255,0.15)] hover:shadow-[0_0_40px_rgba(0,229,255,0.25)] transition-all duration-300 rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group"
          >
            {/* Top Recommended Banner */}
            <div className="absolute top-0 right-0 bg-[#00E5FF] text-[#030B16] text-[10px] font-mono font-black px-3.5 py-1 rounded-bl-2xl uppercase tracking-wider shadow-md">
              DÉBLOCAGE TOTAL VIP
            </div>

            <div className="space-y-5">
              
              {/* Header Icon & Price */}
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#00E5FF] text-[#030B16] flex items-center justify-center font-extrabold shadow-[0_0_20px_rgba(0,229,255,0.4)]">
                  <Sparkles className="w-6 h-6 fill-[#030B16]" />
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono text-slate-400 block">Tarif mensuel</span>
                  <span className="text-xl sm:text-2xl font-black font-mono text-[#00E5FF] tracking-tight">
                    {formatFcfa(SUBSCRIPTION_PRICE_FCFA)}
                  </span>
                  <span className="text-[10px] text-slate-400 block font-mono">/ mois (30 jours)</span>
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h2 className="text-base sm:text-lg font-bold font-mono text-white group-hover:text-[#00E5FF] transition-colors flex items-center gap-2">
                  <span>PROFIL TRADER VIP</span>
                  <Crown className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
                  Débloquez instantanément tous les signaux avec prix d'entrée exacts, Stop Loss et Take Profits.
                </p>
              </div>

              {/* Included Full Access Checklist */}
              <div className="space-y-2.5 pt-3 border-t border-slate-800 text-xs font-mono">
                <div className="flex items-start gap-2 text-white font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                  <span>Déblocage à 100% des niveaux d'Entrée, SL, TP1, TP2</span>
                </div>
                <div className="flex items-start gap-2 text-white font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                  <span>Badges réels Achat (BUY) & Vente (SELL) visibles</span>
                </div>
                <div className="flex items-start gap-2 text-white font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                  <span>Journal de trading historique & statistiques PnL du jour</span>
                </div>
                <div className="flex items-start gap-2 text-white font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                  <span>Aucun flou, aucun masque, aucun bandeau restrictif</span>
                </div>
              </div>

            </div>

            {/* Action CTA Button */}
            <div className="pt-6 mt-6 border-t border-slate-800 space-y-3">
              <button
                onClick={onSelectTraderPayment}
                className="w-full bg-[#00E5FF] hover:bg-[#00E5FF]/80 text-[#030B16] font-black py-3.5 px-5 rounded-2xl text-xs sm:text-sm font-mono shadow-[0_0_20px_rgba(0,229,255,0.25)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group/btn cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-[#030B16]" />
                <span>Devenir Trader VIP – {formatFcfa(SUBSCRIPTION_PRICE_FCFA)}</span>
              </button>

              <div className="text-center pt-1 border-t border-slate-800">
                <button
                  onClick={onOpenLoginModal}
                  className="text-xs font-mono text-[#00E5FF] hover:text-[#00E5FF]/80 font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Déjà membre VIP ? Se connecter</span>
                </button>
              </div>
            </div>

          </motion.div>

        </div>

        {/* Legal & Security Footnote */}
        <div className="text-center text-xs font-mono text-slate-400 space-y-2 pt-2">
          <p className="flex items-center justify-center gap-1.5 pt-1">
            <ShieldCheck className="w-4 h-4 text-[#22C55E] inline shrink-0" />
            <span>Paiements sécurisés via Mobile Money (Orange, Wave, MTN, Moov) & Carte Bancaire</span>
          </p>
          <p className="text-[11px] text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Le trading comporte un risque de perte en capital. Ces signaux sont fournis à titre informatif, pas comme un conseil en investissement.
          </p>
          <p className="text-[10px] font-medium text-slate-400 pt-1 text-center">
            Fondateur : Chris Pokam
          </p>
          <p className="text-[11px] text-slate-400">
            Vous pourrez changer de profil ou réviser votre abonnement à tout moment depuis le terminal.
          </p>
        </div>

      </div>

    </div>
  );
};

