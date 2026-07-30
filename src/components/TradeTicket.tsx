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
  const [showConfluenceDetails, setShowConfluenceDetails] = useState(false);

  const isBuy = setup.type === 'BUY';
  const isActive = setup.status === 'ACTIVE';
  const isTpHit = setup.status === 'TP_HIT';
  const isSlHit = setup.status === 'SL_HIT';

  const grade = setup.grade || 'A+';
  const score = setup.score || 5;

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
          ? 'bg-white border-amber-300/80 hover:border-amber-400'
          : isTpHit
          ? 'bg-white border-emerald-300/80 hover:border-emerald-400'
          : 'bg-white border-rose-300/80 hover:border-rose-400'
      }`}
    >
      {/* Top Ambient Glow accent bar */}
      <div className={`h-1 w-full ${isActive ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600' : isTpHit ? 'bg-gradient-to-r from-emerald-500 to-teal-600' : 'bg-gradient-to-r from-rose-500 to-red-600'}`} />

      {/* Ticket Header */}
      <div className="bg-slate-50/80 px-4 py-2.5 flex items-center justify-between gap-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold text-amber-700 tracking-widest uppercase">
            {setup.ticketNumber}
          </span>
          <span className="text-[10px] font-mono text-slate-700 bg-white px-2 py-0.5 rounded-full border border-slate-200 shadow-2xs">
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
                ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                : grade === 'A'
                ? 'bg-blue-50 text-blue-900 border-blue-300 hover:bg-blue-100'
                : 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200'
            }`}
            title="Cliquez pour voir les 5 critères de confluence"
          >
            {grade === 'A+' ? (
              <Sparkles className="w-3 h-3 text-amber-600 fill-amber-400/30" />
            ) : grade === 'A' ? (
              <Award className="w-3 h-3 text-blue-600" />
            ) : (
              <ShieldCheck className="w-3 h-3 text-slate-500" />
            )}
            <span>Setup {grade} ({score}/5)</span>
            <Info className="w-2.5 h-2.5 opacity-70 ml-0.5" />
          </button>

          {/* Status Badge */}
          {isActive && (
            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-amber-900 bg-amber-50 border border-amber-300 px-2.5 py-0.5 rounded-full animate-pulse-badge">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
              EN COURS
            </span>
          )}
          {isTpHit && (
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-900 bg-emerald-50 border border-emerald-300 px-2.5 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              TP (+{setup.rewardPips}p)
            </span>
          )}
          {isSlHit && (
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-rose-900 bg-rose-50 border border-rose-300 px-2.5 py-0.5 rounded-full">
              <XCircle className="w-3 h-3 text-rose-600" />
              SL (-{setup.riskPips}p)
            </span>
          )}
        </div>
      </div>

      {/* Ticket Body Content */}
      <div className="p-4 space-y-3 font-sans">
        
        {/* Direction & Risk:Reward Header */}
        <div className="flex items-center justify-between">
          {isVisitor ? (
            <div
              onClick={triggerLockedShake}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black font-mono tracking-wider bg-amber-50 text-amber-900 border border-amber-300 shadow-2xs cursor-pointer ${
                isShaking ? 'animate-shake' : ''
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              <span>🔒 SETUP VERROUILLÉ</span>
            </div>
          ) : (
            <div
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black font-mono tracking-wider ${
                isBuy
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-300 shadow-2xs'
                  : 'bg-rose-50 text-rose-900 border border-rose-300 shadow-2xs'
              }`}
            >
              {isBuy ? (
                <>
                  <ArrowUpRight className="w-4 h-4 text-emerald-600 stroke-[3]" />
                  <span>ACHAT (LONG)</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="w-4 h-4 text-rose-600 stroke-[3]" />
                  <span>VENTE (SHORT)</span>
                </>
              )}
            </div>
          )}

          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1 rounded-xl text-xs font-mono text-slate-800 font-bold">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span>R:R 1:{setup.rrRatio}</span>
          </div>
        </div>

        {/* Core Trading Levels Grid (Entry, SL, TP) */}
        <div
          onClick={triggerLockedShake}
          className={`grid grid-cols-3 gap-2 bg-slate-50/80 p-3 rounded-2xl border border-slate-200/80 relative transition-transform ${
            isShaking ? 'animate-shake' : ''
          }`}
        >
          {/* Entry Price */}
          <div className="text-left">
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-tight font-bold">ENTRÉE</div>
            <div className={`text-sm sm:text-base font-black font-mono text-[#0F172A] tracking-tight ${isVisitor ? 'blur-[3px] select-none text-slate-400' : ''}`}>
              {isVisitor ? '$2,3XX.XX' : `$${setup.entryPrice.toFixed(2)}`}
            </div>
          </div>

          {/* Stop Loss */}
          <div className="text-left border-l border-slate-200 pl-2.5">
            <div className="text-[10px] font-mono text-rose-600 font-bold uppercase tracking-tight flex items-center gap-0.5">
              <ShieldAlert className="w-2.5 h-2.5" /> STOP LOSS
            </div>
            <div className={`text-sm sm:text-base font-black font-mono text-rose-600 tracking-tight ${isVisitor ? 'blur-[3px] select-none' : ''}`}>
              {isVisitor ? '$2,3XX.XX' : `$${setup.stopLoss.toFixed(2)}`}
            </div>
            <div className="text-[9px] font-mono text-rose-700 font-bold">
              {isVisitor ? '-•• pips' : `-${setup.riskPips} pips`}
            </div>
          </div>

          {/* Take Profit */}
          <div className="text-left border-l border-slate-200 pl-2.5">
            <div className="text-[10px] font-mono text-emerald-600 font-bold uppercase tracking-tight">
              TAKE PROFIT
            </div>
            <div className={`text-sm sm:text-base font-black font-mono text-emerald-600 tracking-tight ${isVisitor ? 'blur-[3px] select-none' : ''}`}>
              {isVisitor ? '$2,3XX.XX' : `$${setup.takeProfit.toFixed(2)}`}
            </div>
            <div className="text-[9px] font-mono text-emerald-700 font-bold">
              {isVisitor ? '+•• pips' : `+${setup.rewardPips} pips`}
            </div>
          </div>
        </div>

        {/* Dynamic Progress Bar for Active Trades */}
        {isActive && (
          <div className="space-y-1.5 bg-slate-50/80 p-3 rounded-2xl border border-slate-200/80">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-700 font-semibold flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-500 animate-pulse" /> PnL Direct:
              </span>
              <span
                className={`font-black ${
                  currentPnlPips >= 0 ? 'text-emerald-700' : 'text-rose-700'
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
            <div className="relative w-full h-2 bg-slate-200 rounded-full overflow-hidden mt-1">
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-400 z-10" />
              <div
                className={`h-full transition-all duration-500 ease-out rounded-full ${
                  currentPnlPips >= 0 ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
                style={{ width: `${Math.max(2, Math.min(100, progressPercent))}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 mt-1 font-semibold">
              <span>SL: {isVisitor ? '$2,3XX' : `$${setup.stopLoss.toFixed(2)}`}</span>
              <span>Entrée</span>
              <span>TP: {isVisitor ? '$2,3XX' : `$${setup.takeProfit.toFixed(2)}`}</span>
            </div>
          </div>
        )}

        {/* Confluence Criteria Section Header */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between">
            <div className="text-[10px] font-mono text-slate-600 flex items-center gap-1 font-bold">
              <Layers className="w-3 h-3 text-amber-500" /> CONFLUENCE ({score}/5 CRITÈRES VALIDÉS) :
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowConfluenceDetails(!showConfluenceDetails);
              }}
              className="text-[10px] font-mono text-amber-700 font-bold hover:underline flex items-center gap-0.5"
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
                className="text-[10px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200 leading-relaxed font-semibold"
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
                className="bg-slate-50 text-[#0F172A] p-3 rounded-2xl border border-slate-200 text-[11px] font-mono space-y-2 mt-2 shadow-inner"
              >
                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                  <span className="font-bold text-amber-800">AUDIT DE CONFLUENCE — SETUP {grade}</span>
                  <span className="text-[10px] text-amber-900 font-bold bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300">
                    {score}/5 Critères
                  </span>
                </div>

                <div className="space-y-1.5 pt-1">
                  {setup.confluenceFactors && setup.confluenceFactors.length > 0 ? (
                    setup.confluenceFactors.map((factor) => (
                      <div
                        key={factor.id}
                        className={`p-2 rounded-xl border text-[10px] flex items-start gap-2 ${
                          factor.met
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                            : 'bg-slate-100 border-slate-200 text-slate-500 opacity-80'
                        }`}
                      >
                        {factor.met ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <span className="font-bold block text-slate-800">{factor.name}</span>
                          <span className="text-[10px] text-slate-600 font-sans">{factor.details}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 text-[10px]">
                      Confluence complète validée sur cassette M1/M5.
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Ticket Footer / Timestamp */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-500 font-semibold">
          <span>Généré à {setup.timestamp}</span>
          <span className="text-amber-700 font-bold">Algorithme Confluence V3</span>
        </div>

      </div>
    </motion.div>
  );
};


