import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, CheckCircle2, XCircle, Clock, ShieldAlert, Award, Layers, Lock, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { TradeSetup, PriceTick } from '../types';

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

  const isBuy = setup.type === 'BUY';
  const isActive = setup.status === 'ACTIVE';
  const isTpHit = setup.status === 'TP_HIT';
  const isSlHit = setup.status === 'SL_HIT';

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
      className={`trade-ticket rounded-b-xl transition-all duration-400 hover:-translate-y-0.5 cursor-pointer group relative overflow-hidden ${
        isActive
          ? 'hover:border-blue-400 hover:shadow-lg shadow-blue-500/10'
          : isTpHit
          ? 'border-emerald-500 bg-emerald-50/20 shadow-emerald-500/10'
          : 'border-rose-500 bg-rose-50/20 shadow-rose-500/10'
      }`}
    >
      {/* Sawtooth perforated top tear effect */}
      <div className="ticket-top-sawtooth" />

      {/* Ticket Header */}
      <div className="trade-ticket-header px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold text-blue-700 tracking-widest uppercase">
            {setup.ticketNumber}
          </span>
          <span className="text-[10px] font-mono text-slate-600 bg-white px-1.5 py-0.5 rounded border border-slate-200 shadow-2xs">
            {setup.timeframe}
          </span>
        </div>

        {/* Status Badge */}
        <div>
          {isActive && (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-blue-800 bg-blue-100 border border-blue-300 px-2.5 py-0.5 rounded-full animate-pulse-badge">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
              EN COURS
            </span>
          )}
          {isTpHit && (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full transition-all duration-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 animate-in zoom-in-75 duration-300" />
              TP ATTEINT (+{setup.rewardPips} pips)
            </span>
          )}
          {isSlHit && (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-rose-800 bg-rose-100 border border-rose-300 px-2.5 py-0.5 rounded-full transition-all duration-400">
              <XCircle className="w-3.5 h-3.5 text-rose-600 animate-in zoom-in-75 duration-300" />
              SL ATTEINT (-{setup.riskPips} pips)
            </span>
          )}
        </div>
      </div>

      {/* Ticket Body Content */}
      <div className="p-4 space-y-3.5">
        
        {/* Direction & Risk:Reward Header */}
        <div className="flex items-center justify-between">
          {isVisitor ? (
            <div
              onClick={triggerLockedShake}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-black font-mono tracking-wider bg-blue-50 text-blue-800 border border-blue-300 shadow-2xs cursor-pointer ${
                isShaking ? 'animate-shake' : ''
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-blue-600" />
              <span>🔒 SETUP VERROUILLÉ</span>
            </div>
          ) : (
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-black font-mono tracking-wider ${
                isBuy
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-2xs'
                  : 'bg-rose-50 text-rose-800 border border-rose-300 shadow-2xs'
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

          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md text-xs font-mono text-slate-700 font-medium">
            <Award className="w-3.5 h-3.5 text-blue-600" />
            <span>R:R 1:{setup.rrRatio}</span>
          </div>
        </div>

        {/* Core Trading Levels Grid (Entry, SL, TP) - Masked or Blurred in Visitor Mode */}
        <div
          onClick={triggerLockedShake}
          className={`grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 relative transition-transform ${
            isShaking ? 'animate-shake' : ''
          }`}
        >
          
          {/* Entry Price */}
          <div className="text-left">
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-tight font-medium">ENTRÉE</div>
            <div className={`text-sm font-bold font-mono text-slate-900 tracking-tight ${isVisitor ? 'blur-[3px] select-none text-slate-400' : ''}`}>
              {isVisitor ? '$2,3XX.XX' : `$${setup.entryPrice.toFixed(2)}`}
            </div>
          </div>

          {/* Stop Loss */}
          <div className="text-left border-l border-slate-200 pl-2">
            <div className="text-[10px] font-mono text-rose-600 font-bold uppercase tracking-tight flex items-center gap-0.5">
              <ShieldAlert className="w-2.5 h-2.5" /> STOP LOSS
            </div>
            <div className={`text-sm font-bold font-mono text-rose-600 tracking-tight ${isVisitor ? 'blur-[3px] select-none' : ''}`}>
              {isVisitor ? '$2,3XX.XX' : `$${setup.stopLoss.toFixed(2)}`}
            </div>
            <div className="text-[9px] font-mono text-rose-600/80 font-medium">
              {isVisitor ? '-•• pips' : `-${setup.riskPips} pips`}
            </div>
          </div>

          {/* Take Profit */}
          <div className="text-left border-l border-slate-200 pl-2">
            <div className="text-[10px] font-mono text-emerald-600 font-bold uppercase tracking-tight">
              TAKE PROFIT
            </div>
            <div className={`text-sm font-bold font-mono text-emerald-600 tracking-tight ${isVisitor ? 'blur-[3px] select-none' : ''}`}>
              {isVisitor ? '$2,3XX.XX' : `$${setup.takeProfit.toFixed(2)}`}
            </div>
            <div className="text-[9px] font-mono text-emerald-600/80 font-medium">
              {isVisitor ? '+•• pips' : `+${setup.rewardPips} pips`}
            </div>
          </div>

        </div>

        {/* Dynamic Progress Bar for Active Trades */}
        {isActive && (
          <div className="space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-600 font-medium flex items-center gap-1">
                <Clock className="w-3 h-3 text-blue-600 animate-pulse" /> PnL Direct:
              </span>
              <span
                className={`font-bold ${
                  currentPnlPips >= 0 ? 'text-emerald-600' : 'text-rose-600'
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

            <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 mt-1 font-medium">
              <span>SL: {isVisitor ? '$2,3XX' : `$${setup.stopLoss.toFixed(2)}`}</span>
              <span>Entrée</span>
              <span>TP: {isVisitor ? '$2,3XX' : `$${setup.takeProfit.toFixed(2)}`}</span>
            </div>
          </div>
        )}

        {/* Confluence Technical Justifications */}
        <div className="space-y-1">
          <div className="text-[10px] font-mono text-slate-500 flex items-center gap-1 font-semibold">
            <Layers className="w-3 h-3 text-blue-600" /> CONFLUENCE TECHNIQUE :
          </div>
          <div className="flex flex-wrap gap-1">
            {setup.confluence.map((item, idx) => (
              <span
                key={idx}
                className="text-[10px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 leading-relaxed font-medium"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Ticket Footer / Timestamp */}
        <div className="pt-2 border-t border-dashed border-slate-200 flex items-center justify-between text-[10px] font-mono text-slate-500 font-medium">
          <span>Généré à {setup.timestamp}</span>
          <span className="text-blue-600 font-semibold">Ticket Certifié V2</span>
        </div>

      </div>

    </motion.div>
  );
};

