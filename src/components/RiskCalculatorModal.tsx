import React, { useState } from 'react';
import { X, Calculator, ShieldCheck, DollarSign, Percent, Scale, HelpCircle } from 'lucide-react';

interface RiskCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSlPips?: number;
}

export const RiskCalculatorModal: React.FC<RiskCalculatorModalProps> = ({
  isOpen,
  onClose,
  defaultSlPips = 20,
}) => {
  const [balance, setBalance] = useState<number>(10000);
  const [riskPercent, setRiskPercent] = useState<number>(1.0);
  const [slPips, setSlPips] = useState<number>(defaultSlPips);
  const [rrTarget, setRrTarget] = useState<number>(2.0);

  // Escape key listener to close
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Calculation logic for XAU/USD:
  // 1 Standard Lot XAU/USD = 100 oz
  // $1 move in gold = $100 per 1 standard lot (10 pips = $1 move, 1 pip = $10 per 1 lot)
  const maxRiskUsd = (balance * riskPercent) / 100;
  // Lot size = maxRiskUsd / (slPips * $10)
  const calculatedLotSize = maxRiskUsd > 0 && slPips > 0 ? Number((maxRiskUsd / (slPips * 10)).toFixed(2)) : 0;
  const potentialProfitUsd = Number((maxRiskUsd * rrTarget).toFixed(2));

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto cursor-pointer animate-fade-in font-sans"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden relative text-slate-900 dark:text-slate-100 font-sans my-auto cursor-default"
      >
        
        {/* Header */}
        <div className="px-5 py-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 font-mono">CALCULATEUR DE RISQUE & TAILLE DE LOT</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">XAU/USD (Or) • Standard 1 Lot = 100 oz</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 font-mono text-xs">
          
          {/* Capital Balance Input */}
          <div>
            <label className="block text-slate-600 dark:text-slate-300 mb-1 font-semibold flex items-center justify-between">
              <span>Capital du Compte ($ USD) :</span>
              <span className="text-blue-700 dark:text-blue-400 font-mono font-bold">${balance.toLocaleString()}</span>
            </label>
            <div className="relative">
              <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="number"
                value={balance}
                onChange={(e) => setBalance(Math.max(100, Number(e.target.value)))}
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-9 pr-3 py-2 text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Risk Percentage Input */}
          <div>
            <div className="flex justify-between text-slate-600 dark:text-slate-300 mb-1 font-semibold">
              <span>Risque par Trade (%) :</span>
              <span className="text-blue-700 dark:text-blue-400 font-bold">{riskPercent}% (${maxRiskUsd.toFixed(0)})</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0.25"
                max="5.0"
                step="0.25"
                value={riskPercent}
                onChange={(e) => setRiskPercent(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 mt-1">
              <span>Prudent (0.5%)</span>
              <span>Recommandé (1.0%)</span>
              <span>Agressif (2.0%+)</span>
            </div>
          </div>

          {/* Stop Loss Pips Input */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 dark:text-slate-300 mb-1 font-semibold">Stop Loss (Pips) :</label>
              <input
                type="number"
                value={slPips}
                onChange={(e) => setSlPips(Math.max(5, Number(e.target.value)))}
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 block">10 pips = $1.00 sur l'Or</span>
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-300 mb-1 font-semibold">Objectif R:R :</label>
              <select
                value={rrTarget}
                onChange={(e) => setRrTarget(Number(e.target.value))}
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value={1.5}>1:1.50 (Minimum)</option>
                <option value={2.0}>1:2.00 (Standard)</option>
                <option value={2.5}>1:2.50 (Optimal)</option>
                <option value={3.0}>1:3.00 (Agressif)</option>
              </select>
            </div>
          </div>

          {/* Results Highlight Box */}
          <div className="bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl p-4 space-y-3 mt-2 shadow-2xs">
            <div className="flex items-center justify-between border-b border-blue-200/60 dark:border-blue-800/60 pb-2">
              <span className="text-slate-700 dark:text-slate-300 font-semibold">Taille de Lot Recommandée :</span>
              <span className="text-base sm:text-lg font-black font-mono text-blue-900 dark:text-blue-200 bg-white dark:bg-slate-800 border border-blue-300 dark:border-blue-700 px-2.5 py-1 rounded-lg shadow-2xs">
                {calculatedLotSize} Lot(s)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xs">
                <div className="text-[10px] text-rose-600 dark:text-rose-400 font-bold uppercase">Perte Maximale (SL)</div>
                <div className="text-base font-bold font-mono text-rose-600 dark:text-rose-400">-${maxRiskUsd.toFixed(2)}</div>
              </div>
              <div className="bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xs">
                <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold uppercase">Gain Potentiel (TP)</div>
                <div className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">+${potentialProfitUsd.toFixed(2)}</div>
              </div>
            </div>
          </div>

          {/* Legal Compliance Check */}
          <div className="flex items-center gap-2 text-[11px] text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 p-2.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>Règle de sécurité : Tous les setups générés respectent un R:R ≥ 1:1.5 et incluent un Stop Loss strict.</span>
          </div>

        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-1.5 rounded-lg text-xs font-mono transition-colors shadow-2xs"
          >
            Fermer le Calculateur
          </button>
        </div>

      </div>
    </div>
  );
};

