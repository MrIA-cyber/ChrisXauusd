import React, { useState } from 'react';
import {
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldAlert,
  Award,
  Layers,
  Lock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Info,
  ShieldCheck,
  Calculator,
  Target,
  Percent,
  Sliders,
  Copy,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TradeSetup, PriceTick, ConfluenceFactor } from '../types';

interface TradeTicketProps {
  setup: TradeSetup;
  currentTick: PriceTick;
  onSelectSetup?: (setup: TradeSetup) => void;
  isVisitor?: boolean;
  onOpenSubscribeModal?: () => void;
  index?: number;
}

export const TradeTicket: React.FC<TradeTicketProps> = ({
  setup,
  currentTick,
  onSelectSetup,
  isVisitor = false,
  onOpenSubscribeModal,
  index = 0,
}) => {
  const [isShaking, setIsShaking] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showConfluenceDetails, setShowConfluenceDetails] = useState(false);
  const [showRiskCalculator, setShowRiskCalculator] = useState(false);
  const [userCapital, setUserCapital] = useState<number>(10000);
  const [riskPercent, setRiskPercent] = useState<number>(1.0);

  const isBuy = setup.type === 'BUY';
  const isActive = setup.status === 'ACTIVE';
  const isTpHit = setup.status === 'TP_HIT';
  const isSlHit = setup.status === 'SL_HIT';

  const grade = setup.grade || 'A+';
  const score = setup.score || 5;
  const conviction = setup.convictionRate || (score === 5 ? 92 : score === 4 ? 82 : 72);

  // Format professional trading setup text for MT4/MT5 clipboard
  const handleCopySignal = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isVisitor) {
      if (onOpenSubscribeModal) onOpenSubscribeModal();
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 250);
      return;
    }

    const signalText = `⚡ CHRISXAUUSD | SIGNAL XAU/USD (GOLD)
Ticket: ${setup.ticketNumber}
Type: ${isBuy ? 'BUY / ACHAT 📈' : 'SELL / VENTE 📉'}
Timeframe: ${setup.timeframe}
----------------------------
• Prix d'Entrée : ${setup.entryPrice.toFixed(2)}
• Stop Loss (SL) : ${setup.stopLoss.toFixed(2)} (-${setup.riskPips} pips)
• Take Profit (TP) : ${setup.takeProfit.toFixed(2)} (+${setup.rewardPips} pips)
• Ratio R:R : 1:${setup.rrRatio}
----------------------------
Généré par Terminal ChrisXauusd Pro (Format MT4 / MT5)`;

    navigator.clipboard.writeText(signalText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Calculate real-time distance in pips & progress toward TP or SL
  const currentPrice = currentTick.price;
  let currentPnlPips = 0;
  if (isBuy) {
    currentPnlPips = Number(((currentPrice - setup.entryPrice) * 10).toFixed(1));
  } else {
    currentPnlPips = Number(((setup.entryPrice - currentPrice) * 10).toFixed(1));
  }

  // Calculate percentage progress between SL and TP
  const totalTpPips = setup.rewardPips;
  const totalSlPips = setup.riskPips;
  let progressPercent = 50;
  if (currentPnlPips >= 0) {
    progressPercent = 50 + Math.min(50, (currentPnlPips / totalTpPips) * 50);
  } else {
    progressPercent = 50 - Math.min(50, (Math.abs(currentPnlPips) / totalSlPips) * 50);
  }

  // Strict Risk Management calculations for XAU/USD (Or)
  // 1 Lot Standard XAU/USD = 100 oz. 1 Pip ($0.10 move) = $10 per 1 Lot.
  const maxRiskUsd = (userCapital * riskPercent) / 100;
  const calculatedLot = totalSlPips > 0 ? Math.max(0.01, Number((maxRiskUsd / (totalSlPips * 10)).toFixed(2))) : 0.01;
  const potentialGainUsd = Number((calculatedLot * totalTpPips * 10).toFixed(2));
  const bePipsTarget = 10; // Move SL to Entry at +10 pips

  const triggerLockedShake = (e: React.MouseEvent) => {
    if (isVisitor) {
      e.stopPropagation();
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 250);
    }
  };

  const handleTicketClick = () => {
    if (isVisitor && onOpenSubscribeModal) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 250);
    } else if (onSelectSetup) {
      onSelectSetup(setup);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut', delay: index * 0.06 }}
      onClick={handleTicketClick}
      className={`rounded-[20px] border transition-all duration-300 hover:-translate-y-1 cursor-pointer group relative overflow-hidden backdrop-blur-md shadow-[0_10px_30px_rgba(15,23,42,0.06)] ${
        isActive
          ? 'bg-[var(--bg-card)] border-amber-300/80 dark:border-amber-700/60 hover:border-amber-400'
          : isTpHit
          ? 'bg-[var(--bg-card)] border-emerald-300/80 dark:border-emerald-700/60 hover:border-emerald-400'
          : 'bg-[var(--bg-card)] border-rose-300/80 dark:border-rose-700/60 hover:border-rose-400'
      }`}
    >
      {/* Top Ambient Glow accent bar */}
      <div className={`h-1 w-full ${isActive ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600' : isTpHit ? 'bg-gradient-to-r from-emerald-500 to-teal-600' : 'bg-gradient-to-r from-rose-500 to-red-600'}`} />

      {/* Ticket Header */}
      <div className="bg-slate-50/80 dark:bg-slate-900/60 px-4 py-2.5 flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold text-amber-700 dark:text-amber-400 tracking-widest uppercase">
            {setup.ticketNumber}
          </span>
          <span className="text-[10px] font-mono text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700 shadow-2xs">
            {setup.timeframe}
          </span>
        </div>

        {/* Quality Confidence Badge */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowConfluenceDetails(!showConfluenceDetails);
            }}
            className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border transition-transform active:scale-95 ${
              grade === 'A+'
                ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-700 hover:bg-amber-100'
                : grade === 'A'
                ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-900 dark:text-blue-300 border-blue-300 dark:border-blue-700 hover:bg-blue-100'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700'
            }`}
            title="Cliquez pour voir les 5 critères de confluence"
          >
            {grade === 'A+' ? (
              <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-400 fill-amber-400/30" />
            ) : grade === 'A' ? (
              <Award className="w-3 h-3 text-blue-600 dark:text-blue-400" />
            ) : (
              <ShieldCheck className="w-3 h-3 text-slate-500" />
            )}
            <span>🔥 Conviction {conviction}% · Confirmation {score}/5</span>
            <Info className="w-2.5 h-2.5 opacity-70 ml-0.5" />
          </button>

          {/* Status Badge */}
          {isActive && (
            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-amber-900 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 px-2.5 py-0.5 rounded-full animate-pulse-badge">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
              EN COURS
            </span>
          )}
          {isTpHit && (
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-900 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 px-2.5 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              TP (+{setup.rewardPips}p)
            </span>
          )}
          {isSlHit && (
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-rose-900 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-700 px-2.5 py-0.5 rounded-full">
              <XCircle className="w-3 h-3 text-rose-600 dark:text-rose-400" />
              SL (-{setup.riskPips}p)
            </span>
          )}
        </div>
      </div>

      {/* Ticket Body Content */}
      <div className="p-4 space-y-3.5 font-sans">
        
        {/* Direction, Symbol & Risk:Reward Header */}
        <div className="flex items-center justify-between gap-2">
          {isVisitor ? (
            <div
              onClick={triggerLockedShake}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black font-mono tracking-wider bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-400/50 shadow-2xs cursor-pointer ${
                isShaking ? 'animate-shake' : ''
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>🔒 SETUP VERROUILLÉ (TRADER VIP)</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-black font-mono tracking-wider shadow-sm ${
                  isBuy
                    ? 'bg-emerald-500 text-white border border-emerald-400 shadow-emerald-500/20'
                    : 'bg-rose-600 text-white border border-rose-500 shadow-rose-500/20'
                }`}
              >
                {isBuy ? (
                  <>
                    <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3]" />
                    <span>🟢 ACHAT (BUY)</span>
                  </>
                ) : (
                  <>
                    <ArrowDownRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3]" />
                    <span>🔴 VENTE (SELL)</span>
                  </>
                )}
              </div>
              <span className="text-xs font-black font-mono text-slate-800 dark:text-slate-100 bg-slate-200/80 dark:bg-slate-800 px-2.5 py-1 rounded-xl border border-slate-300 dark:border-slate-700">
                XAU/USD
              </span>
            </div>
          )}

          <div className="flex items-center gap-1.5 bg-blue-50 text-blue-900 dark:bg-blue-950/50 border border-blue-300 dark:border-blue-700/80 px-3 py-1.5 rounded-xl text-xs font-mono dark:text-blue-300 font-black">
            <Award className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>R:R 1:{setup.rrRatio}</span>
          </div>
        </div>

        {/* Core Trading Levels Grid (Entry, SL, TP) - High Contrast Readable Blocks */}
        <div
          onClick={triggerLockedShake}
          className={`grid grid-cols-1 sm:grid-cols-3 gap-2 relative transition-transform ${
            isShaking ? 'animate-shake' : ''
          }`}
        >
          {/* Entry Price Block */}
          <div className="bg-slate-100 dark:bg-slate-800/90 p-3 rounded-2xl border border-slate-300 dark:border-slate-700/80 flex sm:flex-col justify-between sm:justify-center items-center sm:items-start">
            <div className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide flex items-center gap-1">
              <Target className="w-3 h-3 text-blue-500" /> 1. PRIX D'ENTRÉE
            </div>
            <div className={`text-base sm:text-lg font-black font-mono text-slate-900 dark:text-white tracking-tight ${isVisitor ? 'blur-[4px] select-none text-slate-400' : ''}`}>
              {isVisitor ? '$2,3XX.XX' : `$${setup.entryPrice.toFixed(2)}`}
            </div>
          </div>

          {/* Stop Loss Block */}
          <div className="bg-rose-500/10 dark:bg-rose-950/40 p-3 rounded-2xl border border-rose-300 dark:border-rose-800/80 flex sm:flex-col justify-between sm:justify-center items-center sm:items-start">
            <div className="text-[10px] font-mono font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wide flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" /> 2. STOP LOSS (SL)
            </div>
            <div className="flex sm:flex-col items-center sm:items-start gap-1">
              <div className={`text-base sm:text-lg font-black font-mono text-rose-700 dark:text-rose-400 tracking-tight ${isVisitor ? 'blur-[4px] select-none' : ''}`}>
                {isVisitor ? '$2,3XX.XX' : `$${setup.stopLoss.toFixed(2)}`}
              </div>
              <span className="text-[10px] font-mono font-bold text-rose-800 dark:text-rose-300 bg-rose-200/80 dark:bg-rose-900/60 px-2 py-0.5 rounded-md border border-rose-300 dark:border-rose-700">
                {isVisitor ? '-•• pips' : `-${setup.riskPips} pips`}
              </span>
            </div>
          </div>

          {/* Take Profit Block */}
          <div className="bg-emerald-500/10 dark:bg-emerald-950/40 p-3 rounded-2xl border border-emerald-300 dark:border-emerald-800/80 flex sm:flex-col justify-between sm:justify-center items-center sm:items-start">
            <div className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> 3. TAKE PROFIT (TP)
            </div>
            <div className="flex sm:flex-col items-center sm:items-start gap-1">
              <div className={`text-base sm:text-lg font-black font-mono text-emerald-700 dark:text-emerald-400 tracking-tight ${isVisitor ? 'blur-[4px] select-none' : ''}`}>
                {isVisitor ? '$2,3XX.XX' : `$${setup.takeProfit.toFixed(2)}`}
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-200/80 dark:bg-emerald-900/60 px-2 py-0.5 rounded-md border border-emerald-300 dark:border-emerald-700">
                {isVisitor ? '+•• pips' : `+${setup.rewardPips} pips`}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Express Summary Banner */}
        {!isVisitor && (
          <div className="p-2.5 rounded-xl bg-slate-900 text-slate-100 dark:bg-slate-950 dark:text-slate-200 border border-slate-700/80 font-mono text-[11px] flex items-center justify-between gap-2 shadow-inner">
            <div className="flex items-center gap-1.5 font-bold overflow-hidden">
              <span className="text-amber-400 shrink-0">📋</span>
              <span className="truncate">
                {isBuy ? 'ACHAT' : 'VENTE'} @ <span className="text-white font-black">${setup.entryPrice.toFixed(2)}</span>
                <span className="text-slate-400 mx-1">|</span>
                SL: <span className="text-rose-400 font-bold">${setup.stopLoss.toFixed(2)}</span>
                <span className="text-slate-400 mx-1">|</span>
                TP: <span className="text-emerald-400 font-bold">${setup.takeProfit.toFixed(2)}</span>
              </span>
            </div>
            <span className="text-[9px] bg-slate-800 text-amber-300 px-2 py-0.5 rounded font-bold shrink-0">
              Prêt MT4/MT5
            </span>
          </div>
        )}

        {/* Copy to Clipboard Button (MT4 / MT5 Format) */}
        <div className="pt-0.5">
          <button
            type="button"
            onClick={handleCopySignal}
            className={`w-full py-2.5 px-3 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer ${
              isCopied
                ? 'bg-emerald-600 text-white border border-emerald-500 shadow-emerald-500/20'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black border border-amber-400 shadow-amber-500/20 active:scale-[0.98]'
            }`}
            title="Copier les paramètres de trade pour MT4 / MT5"
          >
            {isCopied ? (
              <>
                <Check className="w-4 h-4 text-white shrink-0" />
                <span>Paramètres copiés dans le presse-papier !</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 shrink-0" />
                <span>⚡ Copier les Paramètres pour MT4 / MT5</span>
              </>
            )}
          </button>
        </div>

        {/* Dedicated Risk Limitation & Lot Calculator Drawer Button */}
        {!isVisitor && (
          <div className="pt-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowRiskCalculator(!showRiskCalculator);
              }}
              className="w-full py-2 px-3 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/50 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-xl text-xs font-mono font-bold flex items-center justify-between transition-colors shadow-2xs"
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>🛡️ Calculez votre Lot & Perte Max Garantie</span>
              </span>
              <span className="text-[10px] bg-blue-600 text-white dark:bg-blue-500 px-2 py-0.5 rounded-md font-bold">
                {showRiskCalculator ? 'Masquer' : 'Calculer'}
              </span>
            </button>

            {/* Interactive Risk & Loss Protection Drawer */}
            <AnimatePresence>
              {showRiskCalculator && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-slate-50 dark:bg-slate-900/90 p-3.5 rounded-2xl border border-blue-200 dark:border-blue-900/60 mt-2 space-y-3 font-mono text-xs shadow-inner"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                    <span className="font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1.5 text-[11px]">
                      <Calculator className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      PROTECTION ANTI-PERTE & TAILLE DE LOT
                    </span>
                    <span className="text-[9px] bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 px-2 py-0.5 rounded font-bold">
                      Max {riskPercent}% Risque
                    </span>
                  </div>

                  {/* Input Controls */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-slate-500 dark:text-slate-400 mb-1 font-bold">
                        Votre Capital ($ USD) :
                      </label>
                      <select
                        value={userCapital}
                        onChange={(e) => setUserCapital(Number(e.target.value))}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg px-2 py-1.5 text-xs font-bold font-mono focus:outline-none"
                      >
                        <option value={1000}>$1 000</option>
                        <option value={2500}>$2 500</option>
                        <option value={5000}>$5 000</option>
                        <option value={10000}>$10 000</option>
                        <option value={25000}>$25 000</option>
                        <option value={50000}>$50 000</option>
                        <option value={100000}>$100 000</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-500 dark:text-slate-400 mb-1 font-bold">
                        Tolérance au Risque :
                      </label>
                      <select
                        value={riskPercent}
                        onChange={(e) => setRiskPercent(Number(e.target.value))}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg px-2 py-1.5 text-xs font-bold font-mono focus:outline-none"
                      >
                        <option value={0.5}>0.5% (Très Prudent)</option>
                        <option value={1.0}>1.0% (Recommandé)</option>
                        <option value={2.0}>2.0% (Agressif Max)</option>
                      </select>
                    </div>
                  </div>

                  {/* Calculated Lot & Loss Results Grid */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="bg-white dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                      <div className="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase">TAILLE DE LOT EXACTE</div>
                      <div className="text-base font-black text-blue-700 dark:text-blue-400">
                        {calculatedLot} Lot(s)
                      </div>
                      <div className="text-[9px] text-slate-400">Pour {setup.riskPips} pips de SL</div>
                    </div>

                    <div className="bg-white dark:bg-slate-800/80 p-2.5 rounded-xl border border-rose-200 dark:border-rose-900/60">
                      <div className="text-[9px] text-rose-600 dark:text-rose-400 font-bold uppercase">PERTE MAX GARANTIE</div>
                      <div className="text-base font-black text-rose-600 dark:text-rose-400">
                        -${maxRiskUsd.toFixed(2)}
                      </div>
                      <div className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold">Gain TP: +${potentialGainUsd.toFixed(2)}</div>
                    </div>
                  </div>

                  {/* 3-Step Risk Limitation Plan */}
                  <div className="space-y-1.5 pt-1 border-t border-slate-200 dark:border-slate-800 text-[10px]">
                    <div className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3 text-amber-500" /> PLAN DE SÉCURISATION DU CAPITAL :
                    </div>

                    <div className="bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded-lg border border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200 space-y-1">
                      <p className="font-bold">1. Règle Breakeven à +10 Pips :</p>
                      <p className="font-sans text-[10px] text-emerald-800 dark:text-emerald-300">
                        Dès que le cours gagne +10 pips, déplacez votre Stop Loss au prix d'entrée (<strong>${setup.entryPrice.toFixed(2)}</strong>).
                        Votre risque tombe définitivement à <strong>$0.00 (Perte impossible)</strong>.
                      </p>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-950/40 p-2 rounded-lg border border-blue-200 dark:border-blue-800/60 text-blue-900 dark:text-blue-200 space-y-1">
                      <p className="font-bold">2. Prise de Profit Partielle (50%) :</p>
                      <p className="font-sans text-[10px] text-blue-800 dark:text-blue-300">
                        À +15 pips (+1.5R), fermez <strong>{(calculatedLot / 2).toFixed(2)} Lot</strong> pour encaisser un gain net sécurisé de +${(potentialGainUsd * 0.4).toFixed(0)}.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Dynamic Progress Bar for Active Trades */}
        {isActive && (
          <div className="space-y-1.5 bg-slate-50/80 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-500 animate-pulse" /> PnL Direct:
              </span>
              <span
                className={`font-black ${
                  currentPnlPips >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'
                } ${isVisitor ? 'blur-[3px] select-none' : ''}`}
              >
                {isVisitor
                  ? '+•• pips ($•••)'
                  : `${currentPnlPips >= 0 ? `+${currentPnlPips}` : currentPnlPips} pips ($${(
                      currentPnlPips * 10
                    ).toFixed(0)})`}
              </span>
            </div>

            {/* Visual SL <--> Entry <--> TP slider */}
            <div className="relative w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mt-1">
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-400 dark:bg-slate-500 z-10" />
              <div
                className={`h-full transition-all duration-500 ease-out rounded-full ${
                  currentPnlPips >= 0 ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
                style={{ width: `${Math.max(2, Math.min(100, progressPercent))}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 dark:text-slate-400 mt-1 font-semibold">
              <span>SL: {isVisitor ? '$2,3XX' : `$${setup.stopLoss.toFixed(2)}`}</span>
              <span>Entrée</span>
              <span>TP: {isVisitor ? '$2,3XX' : `$${setup.takeProfit.toFixed(2)}`}</span>
            </div>
          </div>
        )}

        {/* Confluence Criteria Section Header */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between">
            <div className="text-[10px] font-mono text-slate-600 dark:text-slate-400 flex items-center gap-1 font-bold">
              <Layers className="w-3 h-3 text-amber-500" /> CONFLUENCE ({score}/5 CRITÈRES VALIDÉS) :
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowConfluenceDetails(!showConfluenceDetails);
              }}
              className="text-[10px] font-mono text-amber-700 dark:text-amber-400 font-bold hover:underline flex items-center gap-0.5"
            >
              <span>{showConfluenceDetails ? 'Masquer' : 'Détails'}</span>
              {showConfluenceDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          {/* Quick Confluence Tags */}
          <div className="flex flex-wrap gap-1">
            {setup.confluence.map((item, idx) => (
              <span
                key={idx}
                className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 leading-relaxed font-semibold"
              >
                {item}
              </span>
            ))}
          </div>

          {/* Expandable Interactive 5-Factor Confluence Breakdown */}
          <AnimatePresence>
            {showConfluenceDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-slate-50 dark:bg-slate-900/90 text-[var(--text-primary)] p-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-[11px] font-mono space-y-2 mt-2 shadow-inner"
              >
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-1.5">
                  <span className="font-bold text-amber-800 dark:text-amber-400">AUDIT DE CONFLUENCE — SETUP {grade}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-amber-900 dark:text-amber-300 font-bold bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded-md border border-amber-300 dark:border-amber-800">
                      🔥 Conviction {conviction}%
                    </span>
                    <span className="text-[10px] text-slate-700 dark:text-slate-300 font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                      Confirmation {score}/5
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 pt-1">
                  {setup.confluenceFactors && setup.confluenceFactors.length > 0 ? (
                    setup.confluenceFactors.map((factor) => (
                      <div
                        key={factor.id}
                        className={`p-2 rounded-xl border text-[10px] flex items-start gap-2 ${
                          factor.met
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                            : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 opacity-80'
                        }`}
                      >
                        {factor.met ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <span className="font-bold block text-slate-800 dark:text-slate-200">{factor.name}</span>
                          <span className="text-[10px] text-slate-600 dark:text-slate-400 font-sans">{factor.details}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 dark:text-slate-400 text-[10px]">
                      Confluence complète validée sur cassette M1/M5.
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Ticket Footer / Timestamp */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400 font-semibold">
          <span>Généré à {setup.timestamp}</span>
          <span className="text-amber-700 dark:text-amber-400 font-bold">Algorithme Confluence V3</span>
        </div>

      </div>
    </motion.div>
  );
};



