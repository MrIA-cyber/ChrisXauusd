import React, { useState } from 'react';
import { X, Sparkles, ShieldCheck, PenTool, BookOpen, Check, ExternalLink, Award, Gift } from 'lucide-react';
import { ChrisXauusdLogoIcon } from './ChrisXauusdLogo';
import { getHourlyThemeConfig } from '../utils/hourlyTheme';

interface ChrisMerchandiseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChrisMerchandiseModal: React.FC<ChrisMerchandiseModalProps> = ({
  isOpen,
  onClose,
}) => {
  const currentHourlyConfig = getHourlyThemeConfig();
  const [selectedVariant, setSelectedVariant] = useState<'bleu' | 'orange' | 'jaune'>(currentHourlyConfig.id);

  if (!isOpen) return null;

  const themesData = {
    bleu: {
      name: 'Édition Nocturne (00h - 08h)',
      color: '#1877F2',
      bgGradient: 'from-[#040E20] via-[#091A3A] to-[#040E20]',
      border: 'border-blue-500/40',
      textAccent: 'text-blue-400',
      badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
      fontName: 'Alex Brush',
      fontStyle: { fontFamily: "'Alex Brush', cursive, sans-serif" },
      motto: "L'élégance décisionnelle des sessions nocturnes",
    },
    orange: {
      name: 'Édition Diurne (08h - 16h)',
      color: '#FF7900',
      bgGradient: 'from-[#0D0803] via-[#1C1106] to-[#0D0803]',
      border: 'border-amber-500/40',
      textAccent: 'text-amber-400',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
      fontName: 'Calligraffiti',
      fontStyle: { fontFamily: "'Calligraffiti', cursive, sans-serif" },
      motto: "La puissance d'exécution des sessions de Londres & New York",
    },
    jaune: {
      name: 'Édition Solaire (16h - 00h)',
      color: '#FFCC00',
      bgGradient: 'from-[#0E0C02] via-[#1E1B05] to-[#0E0C02]',
      border: 'border-yellow-500/40',
      textAccent: 'text-yellow-400',
      badgeBg: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30',
      fontName: 'Lovers Quarrel',
      fontStyle: { fontFamily: "'Lovers Quarrel', cursive, sans-serif" },
      motto: "L'excellence analytique des fins de sessions mondiales",
    },
  };

  const activeTheme = themesData[selectedVariant];

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-xl overflow-y-auto animate-in fade-in duration-200 font-sans cursor-pointer"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-[#030B16] border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden my-auto cursor-default text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="px-5 py-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <span>Gamme Officielle ChrisXAUUSD</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  LUXURY MERCH
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Stylo de précision & Cahier de Trading d'exception aux 3 thèmes horaires
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 space-y-6 max-h-[82vh] overflow-y-auto">
          {/* Variant Selector */}
          <div className="space-y-2">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Sélectionnez l'Édition Horodatée :</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {(['bleu', 'orange', 'jaune'] as const).map((v) => {
                const t = themesData[v];
                const isSelected = selectedVariant === v;
                return (
                  <button
                    key={v}
                    onClick={() => setSelectedVariant(v)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? `${t.border} bg-slate-900 shadow-lg ring-1 ring-amber-400/50`
                        : 'border-slate-800 bg-slate-950/60 hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${t.textAccent}`}>{t.name}</span>
                      {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 mt-1">Police: {t.fontName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Edition Visual Showcase Container */}
          <div className={`p-6 sm:p-8 rounded-3xl bg-gradient-to-br ${activeTheme.bgGradient} border ${activeTheme.border} space-y-8 relative overflow-hidden shadow-2xl`}>
            {/* Background Glow */}
            <div
              className="absolute -right-16 -top-16 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
              style={{ backgroundColor: activeTheme.color }}
            />

            {/* Title & Badge */}
            <div className="space-y-2 text-center relative z-10">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold ${activeTheme.badgeBg} border`}>
                <Award className="w-3.5 h-3.5" />
                <span>POLICE OFFICIELLE : {activeTheme.fontName}</span>
              </span>
              <h2
                className="text-2xl sm:text-4xl text-white tracking-wide py-1"
                style={activeTheme.fontStyle}
              >
                ChrisXAUUSD Precision Gear
              </h2>
              <p className="text-xs text-slate-300 italic max-w-md mx-auto">
                "{activeTheme.motto}"
              </p>
            </div>

            {/* Product 1: Stylo ChrisXAUUSD */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <PenTool className="w-7 h-7" />
              </div>
              <div className="space-y-1 text-center sm:text-left flex-1">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h4 className="text-sm sm:text-base font-bold text-white">Stylo Tactique Haute Précision ChrisXAUUSD</h4>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                    EDITION LIMITÉE
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Corps en aluminium brossé anodisé noir et finitions or métallisé. Pointe fine 0.5mm à encre fluide séchage rapide, gravure laser du logo ChrisXAUUSD et devise en police{' '}
                  <span className="font-bold text-amber-300">{activeTheme.fontName}</span>.
                </p>
              </div>
            </div>

            {/* Product 2: Cahier de Trading ChrisXAUUSD */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                <BookOpen className="w-7 h-7" />
              </div>
              <div className="space-y-1 text-center sm:text-left flex-1">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h4 className="text-sm sm:text-base font-bold text-white">Cahier de Journalisation & Plan de Trading XAU/USD</h4>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-bold">
                    FORMAT A5 PREM
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Couverture rigide cuir synthétique texturé avec marquage à chaud doré, 200 pages de grilles d'analyse SMC / Risk Management et suivi de discipline quotidienne personnalisé.
                </p>
              </div>
            </div>

            {/* Bottom Guarantee */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 relative z-10">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Distribué exclusivement aux membres VIP ChrisXAUUSD Terminal.</span>
              </div>
              <div className="font-mono text-amber-400 font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Certification Moteur SMC V2</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 bg-slate-900/90 border-t border-slate-800 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-mono transition-all cursor-pointer shadow-lg shadow-amber-500/20"
          >
            Fermer l'Aperçu
          </button>
        </div>
      </div>
    </div>
  );
};
