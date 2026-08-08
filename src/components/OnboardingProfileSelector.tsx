import React from 'react';
import { motion } from 'motion/react';
import { Eye, Sparkles, CheckCircle2, Lock, ArrowRight, ShieldCheck, Smartphone, CreditCard, LogIn, RefreshCw, Zap, Award, BadgeCheck } from 'lucide-react';
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
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans text-slate-900">
      
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

        {/* Profile Choice Grid (2 Large Cards Side-by-Side on md+, Stacked on Mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-stretch">
          
          {/* CARD 1: VISITEUR */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white border border-slate-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative group"
          >
            <div className="space-y-5">
              
              {/* Header Badge & Icon */}
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold">
                  <Eye className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200 uppercase tracking-wider">
                  GRATUIT • ACCÈS IMMÉDIAT
                </span>
              </div>

              {/* Title & Description */}
              <div>
                <h2 className="text-base sm:text-lg font-bold font-mono text-slate-900 group-hover:text-blue-700 transition-colors">
                  PROFIL VISITEUR
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  Accès libre pour explorer la plateforme et suivre les analyses macroéconomiques sans inscription.
                </p>
              </div>

              {/* Included / Restricted Features List */}
              <div className="space-y-2.5 pt-3 border-t border-slate-100 text-xs font-mono">
                <div className="flex items-start gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Accès direct au tableau de bord sans inscription</span>
                </div>
                <div className="flex items-start gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Flux de prix XAU/USD et graphique M1/M5 en direct</span>
                </div>
                <div className="flex items-start gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Accès libre aux actualités & guides éducation</span>
                </div>

                <div className="flex items-start gap-2 text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <Lock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span className="text-[11px]">
                    Niveaux Entrée, Stop Loss & TP floutés. Direction remplacée par <strong>« Setup verrouillé »</strong>.
                  </span>
                </div>
              </div>

            </div>

            {/* Action CTA Button */}
            <div className="pt-6 mt-6 border-t border-slate-100 space-y-2">
              <button
                onClick={onSelectVisitor}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-5 rounded-xl text-xs sm:text-sm font-mono shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 group/btn"
              >
                <span>Accéder en Mode Visiteur</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
              <p className="text-[11px] text-center text-slate-400 font-mono">
                Aucune carte ni abonnement requis
              </p>
            </div>

          </motion.div>

          {/* CARD 2: TRADER */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white border-2 border-blue-600 hover:border-blue-700 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group"
          >
            {/* Top Recommended Banner */}
            <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-mono font-bold px-3 py-1 rounded-bl-xl shadow-xs uppercase tracking-wider">
              DÉBLOCAGE TOTAL
            </div>

            <div className="space-y-5">
              
              {/* Header Icon & Price */}
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 border border-blue-700 text-white flex items-center justify-center font-bold shadow-md shadow-blue-600/30">
                  <Sparkles className="w-6 h-6 fill-current" />
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono text-slate-500 block">Tarif unique</span>
                  <span className="text-lg sm:text-xl font-black font-mono text-blue-900">
                    {formatFcfa(SUBSCRIPTION_PRICE_FCFA)}
                  </span>
                  <span className="text-[10px] text-slate-500 block font-mono">/ mois (30 jours)</span>
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h2 className="text-base sm:text-lg font-bold font-mono text-slate-900 group-hover:text-blue-700 transition-colors">
                  PROFIL TRADER
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  Débloquez instantanément tous les signaux avec prix d'entrée exacts, Stop Loss et Take Profits.
                </p>
              </div>

              {/* Included Full Access Checklist */}
              <div className="space-y-2.5 pt-3 border-t border-slate-100 text-xs font-mono">
                <div className="flex items-start gap-2 text-slate-900 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Déblocage à 100% des niveaux d'Entrée, SL, TP1, TP2</span>
                </div>
                <div className="flex items-start gap-2 text-slate-900 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Badges réels Achat (BUY) & Vente (SELL) visibles</span>
                </div>
                <div className="flex items-start gap-2 text-slate-900 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Journal de trading historique & statistiques PnL du jour</span>
                </div>
                <div className="flex items-start gap-2 text-slate-900 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Aucun flou, aucun masque, aucun bandeau restrictif</span>
                </div>
              </div>

            </div>

            {/* Action CTA Button */}
            <div className="pt-6 mt-6 border-t border-slate-100 space-y-3">
              <button
                onClick={onSelectTraderPayment}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 px-5 rounded-xl text-xs sm:text-sm font-mono shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 group/btn"
              >
                <Zap className="w-4 h-4 fill-current text-blue-200" />
                <span>Devenir Trader – {formatFcfa(SUBSCRIPTION_PRICE_FCFA)}</span>
              </button>

              <div className="text-center pt-1 border-t border-slate-100">
                <button
                  onClick={onOpenLoginModal}
                  className="text-xs font-mono text-blue-600 hover:text-blue-800 font-bold hover:underline inline-flex items-center gap-1"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Déjà abonné ? Se connecter à mon compte</span>
                </button>
              </div>
            </div>

          </motion.div>

        </div>

        {/* Legal & Security Footnote */}
        <div className="text-center text-xs font-mono text-slate-500 space-y-2">
          <p className="flex items-center justify-center gap-1.5 pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600 inline" />
            <span>Paiements sécurisés via Mobile Money (Orange, Wave, MTN, Moov) & Carte Bancaire</span>
          </p>
          <p className="text-[11px] text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Le trading comporte un risque de perte en capital. Ces signaux sont fournis à titre informatif, pas comme un conseil en investissement.
          </p>
          <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 pt-1 text-center">
            Fondateur : Chris Pokam • Trader certifié : Osher Nikos
          </p>
          <p className="text-[11px] text-slate-400">
            Vous pourrez changer de profil ou réviser votre abonnement à tout moment depuis le terminal.
          </p>
        </div>

      </div>

    </div>
  );
};
