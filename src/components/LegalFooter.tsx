import React from 'react';
import { ShieldAlert, Info, Lock, Terminal } from 'lucide-react';
import { ChrisXauusdHorizontalLogo } from './ChrisXauusdLogo';

export const LegalFooter: React.FC = () => {
  return (
    <footer className="bg-slate-100 border-t border-slate-200 text-slate-600 text-xs py-8 px-4 mt-12 font-mono">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Discrete Risk Disclaimer */}
        <p className="text-[11px] sm:text-xs text-slate-500 text-center sm:text-left leading-relaxed">
          Le trading comporte un risque de perte en capital. Les signaux et analyses sont générés par l'Algorithme Moteur V2 à titre décisionnel et d'assistance au trading.
        </p>

        {/* Main Disclaimer Banner */}
        <div className="bg-white border border-blue-200 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center gap-3 shadow-2xs">
          <div className="w-10 h-10 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-900 uppercase">Mentions Légales & Protocole Moteur Algo V2</h4>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Plateforme d'analyse et d'exécution algorithmique sur l'Or (XAU/USD). Les flux de ticks et setups de trading sont alimentés en direct par le 
              <strong className="text-blue-900"> Moteur Algo V2 et l'IA Gemini 3.6</strong> avec contrôle continu des confluences de marché.
            </p>
          </div>
        </div>

        {/* Risk Grid Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[11px] text-slate-600">
          <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1 shadow-2xs">
            <div className="text-blue-700 font-bold flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" /> 1. Flux & Ticks Algorithmiques
            </div>
            <p className="text-slate-500 leading-normal">
              Les variations de prix XAU/USD et les signaux de scalping sont calculés en temps réel avec une latence ultra-faible pour une lisibilité optimale sur MT4/MT5.
            </p>
          </div>

          <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1 shadow-2xs">
            <div className="text-emerald-700 font-bold flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" /> 2. Gestion du Risque Stricte
            </div>
            <p className="text-slate-500 leading-normal">
              Chaque ticket de trade intègre automatiquement un Stop Loss (SL) et un Take Profit (TP) avec un Ratio Risque/Rendement d'au moins 1:1.50.
            </p>
          </div>

          <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1 shadow-2xs">
            <div className="text-rose-600 font-bold flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" /> 3. Avertissement Trading
            </div>
            <p className="text-slate-500 leading-normal">
              Le trading sur marge (Forex/CFD/Commodities) comporte un risque de perte en capital. Veillez à respecter vos règles de money management.
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
            Fondateur : Chris Pokam
          </div>
          <div className="flex items-center gap-3">
            <span>Terminal Version: <strong className="text-blue-700">2.4.0-LIGHT</strong></span>
            <span>•</span>
            <span>Protocole: <strong className="text-emerald-700 font-mono">ALGO_V2_TICK_STREAM</strong></span>
          </div>
        </div>

      </div>
    </footer>
  );
};

