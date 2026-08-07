import React from 'react';
import { ShieldAlert, Info, Lock, Terminal } from 'lucide-react';
import { ChrisXauusdHorizontalLogo } from './ChrisXauusdLogo';

export const LegalFooter: React.FC = () => {
  return (
    <footer className="bg-slate-100 border-t border-slate-200 text-slate-600 text-xs py-8 px-4 mt-12 font-mono">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Discrete Risk Disclaimer */}
        <p className="text-[11px] sm:text-xs text-slate-500 text-center sm:text-left leading-relaxed">
          Le trading comporte un risque de perte en capital. Ces signaux sont fournis à titre informatif, pas comme un conseil en investissement.
        </p>

        {/* Main Disclaimer Banner */}
        <div className="bg-white border border-blue-200 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center gap-3 shadow-2xs">
          <div className="w-10 h-10 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-900">MENTIONS LÉGALES & AVERTISSEMENT DE DÉMONSTRATION</h4>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Cette application est un environnement de démonstration technique. Les cours XAU/USD, ticks et setups de trading sont 
              <strong className="text-blue-900"> intégralement simulés par algorithme</strong> et ne constituent pas un flux de marché réel ni un conseil en investissement financièrement engagé.
            </p>
          </div>
        </div>

        {/* Risk Grid Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[11px] text-slate-600">
          <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1 shadow-2xs">
            <div className="text-blue-700 font-bold flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" /> 1. Données Simulées
            </div>
            <p className="text-slate-500 leading-normal">
              Les prix de l'Or (XAU/USD) affichés sont générés localement à des fins d'illustration visuelle et d'expérimentation de stratégie de scalping.
            </p>
          </div>

          <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1 shadow-2xs">
            <div className="text-emerald-700 font-bold flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" /> 2. Gestion du Risque Stricte
            </div>
            <p className="text-slate-500 leading-normal">
              Tous les billets de trade générés intègrent obligatoirement un Stop Loss et un Ratio Risque/Rendement d'au moins 1:1.50 pour promouvoir une pratique disciplinée.
            </p>
          </div>

          <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1 shadow-2xs">
            <div className="text-rose-600 font-bold flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" /> 3. Avertissement Trading
            </div>
            <p className="text-slate-500 leading-normal">
              Le trading sur marge (Forex/CFD/Commodities) comporte un niveau de risque élevé qui peut ne pas convenir à tous les investisseurs. Vous pouvez perdre la totalité de votre capital.
            </p>
          </div>
        </div>

        {/* Footer Brand Logo & Copyright */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-500 gap-3">
          <div className="flex items-center gap-3">
            <ChrisXauusdHorizontalLogo variant="light" showTagline={false} />
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="hidden sm:inline">© {new Date().getFullYear()} ChrisXauusd — Signaux de trading Or. Tous droits réservés.</span>
          </div>
          <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400 text-center">
            Fondateur : Chris Pokam • Trader certifié : Osher Nikos
          </div>
          <div className="flex items-center gap-3">
            <span>Terminal Version: <strong className="text-blue-700">2.4.0-LIGHT</strong></span>
            <span>•</span>
            <span>Protocole: <strong className="text-emerald-700 font-mono">SIMULATION_TICK_STREAM</strong></span>
          </div>
        </div>

      </div>
    </footer>
  );
};
