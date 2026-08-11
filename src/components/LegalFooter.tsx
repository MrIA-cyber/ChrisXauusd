import React, { useState } from 'react';
import { ShieldAlert, Info, Lock, Terminal, ChevronDown } from 'lucide-react';
import { ChrisXauusdHorizontalLogo } from './ChrisXauusdLogo';

interface LegalSection {
  id: string;
  number: string;
  title: string;
  icon: React.ReactNode;
  content: string;
}

export const LegalFooter: React.FC = () => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const sections: LegalSection[] = [
    {
      id: 'flux',
      number: '①',
      title: 'Flux & Ticks Algorithmiques',
      icon: <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />,
      content:
        'Les variations de prix XAU/USD et les signaux de scalping sont calculés en temps réel avec une latence ultra-faible pour une lisibilité optimale sur MT4/MT5.',
    },
    {
      id: 'risk',
      number: '②',
      title: 'Gestion du Risque Stricte',
      icon: <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />,
      content:
        "Chaque ticket de trade intègre automatiquement un Stop Loss (SL) et un Take Profit (TP) avec un Ratio Risque/Rendement d'au moins 1:1.50.",
    },
    {
      id: 'warning',
      number: '③',
      title: 'Avertissement Trading',
      icon: <Terminal className="w-3.5 h-3.5 text-rose-600 shrink-0" />,
      content:
        'Le trading sur marge (Forex/CFD/Commodities) comporte un risque de perte en capital. Veillez à respecter vos règles de money management.',
    },
  ];

  return (
    <footer className="bg-slate-100 border-t border-slate-200 text-slate-600 text-xs py-4 px-3 sm:px-4 mt-6 font-mono">
      <div className="max-w-7xl mx-auto space-y-3">
        
        {/* Carte Globale Unique Compacte */}
        <div className="bg-white border border-blue-200/80 rounded-xl p-3 sm:p-4 shadow-2xs space-y-2.5">
          
          {/* En-tête de la carte */}
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-600 shrink-0">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-tight leading-none">
                MENTIONS LÉGALES & PROTOCOLE DE TRADING
              </h4>
              <p className="text-slate-500 text-[11px] mt-1 truncate">
                Plateforme d'analyse et d'assistance au trading sur l'Or (XAU/USD).
              </p>
            </div>
          </div>

          {/* 3 Lignes Accordéons Compactes */}
          <div className="space-y-1.5">
            {sections.map((section) => {
              const isOpen = !!openSections[section.id];
              return (
                <div
                  key={section.id}
                  className="border border-slate-150 hover:border-blue-200 rounded-lg overflow-hidden transition-colors bg-slate-50/50"
                >
                  <button
                    type="button"
                    onClick={() => toggleSection(section.id)}
                    className="w-full min-h-[44px] flex items-center justify-between px-3.5 py-2.5 text-left cursor-pointer transition-colors hover:bg-blue-50/50 select-none gap-2"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {section.icon}
                      <span className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                        <span className="text-slate-500 font-black mr-1.5">{section.number}</span>
                        {section.title}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-blue-600' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-3.5 pb-3 pt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-white">
                      {section.content}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

        {/* Pied de page Copyright & Signatures */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-500 gap-2">
          <div className="flex items-center gap-2">
            <ChrisXauusdHorizontalLogo variant="light" showTagline={false} />
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="hidden sm:inline">© {new Date().getFullYear()} ChrisXauusd — Signaux XAU/USD</span>
          </div>
          <div className="text-[10px] font-medium text-slate-500 text-center">
            Fondateur : Chris Pokam
          </div>
          <div className="flex items-center gap-2">
            <span>Terminal: <strong className="text-blue-700">v2.4.0-LIGHT</strong></span>
            <span>•</span>
            <span>Protocole: <strong className="text-emerald-700 font-mono">LIVE_STREAM</strong></span>
          </div>
        </div>

      </div>
    </footer>
  );
};


