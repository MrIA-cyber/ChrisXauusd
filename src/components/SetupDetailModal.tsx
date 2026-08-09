import React, { useState } from 'react';
import {
  X,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Target,
  Sparkles,
  Layers,
  BarChart2,
  Zap,
  TrendingUp,
  Copy,
  Check,
  Calculator,
  Compass,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TradeSetup, PriceTick } from '../types';

interface SetupDetailModalProps {
  setup: TradeSetup | null;
  currentTick?: PriceTick;
  isOpen: boolean;
  onClose: () => void;
  isVisitor?: boolean;
  onOpenSubscribeModal?: () => void;
}

export const SetupDetailModal: React.FC<SetupDetailModalProps> = ({
  setup,
  currentTick,
  isOpen,
  onClose,
  isVisitor = false,
  onOpenSubscribeModal,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  
  // Accordion section states (closed by default as requested in rule 4)
  const [openSection, setOpenSection] = useState<string | null>(null);

  if (!isOpen || !setup) return null;

  const isBuy = setup.type === 'BUY';
  const isActive = setup.status === 'ACTIVE';
  const isTpHit = setup.status === 'TP_HIT';
  const isSlHit = setup.status === 'SL_HIT';

  const currentPrice = currentTick ? currentTick.price : setup.entryPrice;
  
  let currentPnlPips = 0;
  if (isActive) {
    currentPnlPips = isBuy
      ? Number(((currentPrice - setup.entryPrice) * 10).toFixed(1))
      : Number(((setup.entryPrice - currentPrice) * 10).toFixed(1));
  } else {
    currentPnlPips = setup.pnlPips || 0;
  }

  const toggleSection = (sectionId: string) => {
    setOpenSection((prev) => (prev === sectionId ? null : sectionId));
  };

  const handleCopySignal = () => {
    if (isVisitor) {
      if (onOpenSubscribeModal) onOpenSubscribeModal();
      return;
    }

    const text = `⚡ CHRISXAUUSD | SETUP ${setup.type} (${setup.timeframe})
Ticket: ${setup.ticketNumber}
Entry: ${setup.entryPrice.toFixed(2)}
SL: ${setup.stopLoss.toFixed(2)} (-${setup.riskPips} pips)
TP: ${setup.takeProfit.toFixed(2)} (+${setup.rewardPips} pips)
Conviction: ${setup.convictionRate}% | Confirmation: ${setup.score}/5
R:R = 1:${setup.rrRatio}`;

    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 rounded-[24px] shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col font-sans"
        >
          {/* Top Bar / Header */}
          <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-2.5">
              <span
                className={`px-3 py-1 rounded-full text-xs font-black font-mono flex items-center gap-1 ${
                  isBuy
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                }`}
              >
                {isBuy ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                {setup.type} XAU/USD
              </span>
              <span className="text-xs font-mono text-slate-400">{setup.ticketNumber}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                {setup.timeframe}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body Scrollable */}
          <div className="p-5 overflow-y-auto space-y-5 text-slate-800 dark:text-slate-100 font-sans">
            
            {/* 1. PRIMARY ESSENTIAL INFO (Always visible at top as required) */}
            <div className="bg-slate-50 dark:bg-[#060D1E] border border-slate-200 dark:border-slate-800 rounded-2xl p-4.5 space-y-4">
              
              {/* Status & PnL Header */}
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Statut :</span>
                  <span
                    className={`text-xs font-bold font-mono px-2.5 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                        : isTpHit
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {isActive ? '● ACTIF EN COURS' : isTpHit ? '✓ TP ATTEINT' : '✗ SL ATTEINT'}
                  </span>
                </div>

                <div className="font-mono text-xs font-bold">
                  PnL :{' '}
                  <span className={currentPnlPips >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                    {currentPnlPips >= 0 ? `+${currentPnlPips}` : currentPnlPips} pips
                  </span>
                </div>
              </div>

              {/* Price Targets Grid (Entry, SL, TP) */}
              <div className="grid grid-cols-3 gap-2.5 text-center font-mono">
                <div className="bg-white dark:bg-[#0E1A38] p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
                  <div className="text-[10px] text-slate-400 uppercase font-sans font-medium">Prix d'Entrée</div>
                  <div className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                    {setup.entryPrice.toFixed(2)}
                  </div>
                </div>

                <div className="bg-rose-50 dark:bg-rose-950/20 p-3 rounded-xl border border-rose-200 dark:border-rose-900/40 shadow-xs">
                  <div className="text-[10px] text-rose-600 dark:text-rose-400 uppercase font-sans font-medium">Stop Loss (SL)</div>
                  <div className="text-sm font-black text-rose-600 dark:text-rose-400 mt-0.5">
                    {setup.stopLoss.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-rose-500 mt-0.5">-{setup.riskPips} pips</div>
                </div>

                <div className="bg-emerald-50 dark:bg-emerald-950/20 p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/40 shadow-xs">
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase font-sans font-medium">Take Profit (TP)</div>
                  <div className="text-sm font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {setup.takeProfit.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-emerald-500 mt-0.5">+{setup.rewardPips} pips</div>
                </div>
              </div>

              {/* Conviction & Confirmation Bar */}
              <div className="grid grid-cols-3 gap-2.5 pt-1 text-center font-mono text-xs">
                <div className="bg-white dark:bg-[#0E1A38] p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-sans">Conviction</div>
                  <div className="text-xs font-extrabold text-amber-500 mt-0.5">{setup.convictionRate}%</div>
                </div>

                <div className="bg-white dark:bg-[#0E1A38] p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-sans">Confirmation</div>
                  <div className="text-xs font-extrabold text-blue-500 mt-0.5">{setup.score}/5</div>
                </div>

                <div className="bg-white dark:bg-[#0E1A38] p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-sans">Ratio R:R</div>
                  <div className="text-xs font-extrabold text-indigo-500 mt-0.5">1:{setup.rrRatio}</div>
                </div>
              </div>

              {/* Quick Copy Signal Button */}
              <button
                onClick={handleCopySignal}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-98"
              >
                {isCopied ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4 text-slate-950" />}
                <span>{isCopied ? 'Copié dans le presse-papier !' : 'Copier le setup MT4 / MT5'}</span>
              </button>

            </div>

            {/* 2. SECONDARY COLLAPSIBLE SECTIONS (CLOSED BY DEFAULT) */}
            <div className="space-y-2 pt-1 font-sans">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-mono">
                Analyse & Confluences Détaillées
              </div>

              {/* Accordion 1: Analyse technique */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-[#0A1224]">
                <button
                  onClick={() => toggleSection('tech')}
                  className="w-full px-4 py-3 flex items-center justify-between text-left font-semibold text-xs text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-amber-500" />
                    <span>▸ Analyse Technique & Structure</span>
                  </span>
                  {openSection === 'tech' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                {openSection === 'tech' && (
                  <div className="px-4 py-3 bg-slate-50/50 dark:bg-[#070E1E] border-t border-slate-200 dark:border-slate-800 text-xs space-y-2 text-slate-600 dark:text-slate-300 font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-sans">Tendance Multi-Timeframe :</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">Bullish H4 / M15</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-sans">Niveau VWAP Session :</span>
                      <span className="font-bold">{setup.entryPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-sans">Alignement Pivots :</span>
                      <span className="font-bold text-blue-500">Validation R1 / S1</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 2: SMC / ICT */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-[#0A1224]">
                <button
                  onClick={() => toggleSection('smc')}
                  className="w-full px-4 py-3 flex items-center justify-between text-left font-semibold text-xs text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-500" />
                    <span>▸ SMC / ICT (Institutional Order Block)</span>
                  </span>
                  {openSection === 'smc' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                {openSection === 'smc' && (
                  <div className="px-4 py-3 bg-slate-50/50 dark:bg-[#070E1E] border-t border-slate-200 dark:border-slate-800 text-xs space-y-2 text-slate-600 dark:text-slate-300 font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-sans">Zone d'Order Block M5 :</span>
                      <span className="font-bold text-amber-500">Validation OB Institutionnel</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-sans">Fair Value Gap (FVG) :</span>
                      <span className="font-bold text-emerald-500">Comblé à 100%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-sans">Liquidity Sweep (SSL/BSL) :</span>
                      <span className="font-bold text-purple-400">Purge de liquidité effectuée</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-sans">Change of Character (CHoCH) :</span>
                      <span className="font-bold text-emerald-400">Confirmé en M1</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 3: Momentum */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-[#0A1224]">
                <button
                  onClick={() => toggleSection('momentum')}
                  className="w-full px-4 py-3 flex items-center justify-between text-left font-semibold text-xs text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>▸ Momentum & Accélération Flux</span>
                  </span>
                  {openSection === 'momentum' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                {openSection === 'momentum' && (
                  <div className="px-4 py-3 bg-slate-50/50 dark:bg-[#070E1E] border-t border-slate-200 dark:border-slate-800 text-xs space-y-2 text-slate-600 dark:text-slate-300 font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-sans">RSI (M5) :</span>
                      <span className="font-bold">58.4 (Zone d'accélération)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-sans">Vitesse de Bougie M1 :</span>
                      <span className="font-bold text-emerald-500">Pression acheteuse dominante</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 4: Volatilité */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-[#0A1224]">
                <button
                  onClick={() => toggleSection('volatility')}
                  className="w-full px-4 py-3 flex items-center justify-between text-left font-semibold text-xs text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    <span>▸ Volatilité & Spread</span>
                  </span>
                  {openSection === 'volatility' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                {openSection === 'volatility' && (
                  <div className="px-4 py-3 bg-slate-50/50 dark:bg-[#070E1E] border-t border-slate-200 dark:border-slate-800 text-xs space-y-2 text-slate-600 dark:text-slate-300 font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-sans">Spread moyen :</span>
                      <span className="font-bold text-emerald-500">0.20$ (Faible / Idéal Scalping)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-sans">ATR M15 :</span>
                      <span className="font-bold">2.85$</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 5: Sentiment */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-[#0A1224]">
                <button
                  onClick={() => toggleSection('sentiment')}
                  className="w-full px-4 py-3 flex items-center justify-between text-left font-semibold text-xs text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Compass className="w-4 h-4 text-purple-500" />
                    <span>▸ Sentiment du Marché (Retail Positioning)</span>
                  </span>
                  {openSection === 'sentiment' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                {openSection === 'sentiment' && (
                  <div className="px-4 py-3 bg-slate-50/50 dark:bg-[#070E1E] border-t border-slate-200 dark:border-slate-800 text-xs space-y-2 text-slate-600 dark:text-slate-300 font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-sans">Biais institutionnel :</span>
                      <span className="font-bold text-emerald-500">HAUSSIER (Accumulation Smart Money)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-sans">Positionnement Retail :</span>
                      <span className="font-bold text-rose-500">68% Vendeurs (Contrarian Buy Setup)</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 6: Risk Management */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-[#0A1224]">
                <button
                  onClick={() => toggleSection('risk')}
                  className="w-full px-4 py-3 flex items-center justify-between text-left font-semibold text-xs text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>▸ Risk Management & Management du Lot</span>
                  </span>
                  {openSection === 'risk' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                {openSection === 'risk' && (
                  <div className="px-4 py-3 bg-slate-50/50 dark:bg-[#070E1E] border-t border-slate-200 dark:border-slate-800 text-xs space-y-2 text-slate-600 dark:text-slate-300 font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-sans">Risque Maximal Conseillé :</span>
                      <span className="font-bold text-rose-500">1.0% à 2.0% par trade</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-sans">Passage à Break-Even (BE) :</span>
                      <span className="font-bold text-emerald-500">À +10 pips de gain</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-sans">Prise de Partial Profits (TP1) :</span>
                      <span className="font-bold text-amber-500">50% de la position clôturée à +15 pips</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 7: Raisons du setup */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-[#0A1224]">
                <button
                  onClick={() => toggleSection('reasons')}
                  className="w-full px-4 py-3 flex items-center justify-between text-left font-semibold text-xs text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-amber-500" />
                    <span>▸ Raisons du Setup ({setup.confluenceFactors?.length || setup.confluence.length} confluences)</span>
                  </span>
                  {openSection === 'reasons' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                {openSection === 'reasons' && (
                  <div className="px-4 py-3 bg-slate-50/50 dark:bg-[#070E1E] border-t border-slate-200 dark:border-slate-800 text-xs space-y-2 font-mono">
                    <p className="text-slate-600 dark:text-slate-300 font-sans text-xs leading-relaxed mb-2">
                      {setup.entryReason}
                    </p>
                    <div className="space-y-1.5 pt-1">
                      {setup.confluenceFactors && setup.confluenceFactors.length > 0 ? (
                        setup.confluenceFactors.map((factor, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-700 dark:text-slate-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span><strong>{factor.name}</strong> : {factor.details}</span>
                          </div>
                        ))
                      ) : (
                        setup.confluence.map((c, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-700 dark:text-slate-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span>{c}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
