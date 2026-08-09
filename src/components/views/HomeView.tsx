import React from 'react';
import {
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Clock,
  Ticket,
} from 'lucide-react';
import { TradeSetup, PriceTick, MarketSession, DailyStats } from '../../types';

interface HomeViewProps {
  activeSetup: TradeSetup | null;
  latestSetup: TradeSetup | null;
  currentTick: PriceTick;
  marketSessions: MarketSession[];
  dailyStats: DailyStats;
  isAnalyzingNextSignal: boolean;
  nextSignalCountdown: number;
  onOpenSetupDetail: (setup: TradeSetup) => void;
  onGenerateNewSignal: (forceType?: 'BUY' | 'SELL') => void;
  isVisitor?: boolean;
  onOpenSubscribeModal?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  activeSetup,
  latestSetup,
  currentTick,
  marketSessions,
  dailyStats,
  isAnalyzingNextSignal,
  nextSignalCountdown,
  onOpenSetupDetail,
  onGenerateNewSignal,
  isVisitor = false,
  onOpenSubscribeModal,
}) => {
  const displaySetup = activeSetup || latestSetup;
  const isBuy = displaySetup ? displaySetup.type === 'BUY' : true;
  const activeSession = marketSessions.find((s) => s.isActiveNow) || marketSessions[0];

  return (
    <div className="space-y-4 font-sans pb-2">
      
      {/* App Mobile Brand Banner */}
      <div className="flex items-center justify-between bg-slate-900 dark:bg-[#081226] text-white p-3.5 rounded-2xl border border-slate-800 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center font-black text-slate-950 text-xs shadow-xs">
            XAU
          </div>
          <div>
            <h1 className="text-sm font-black tracking-wider text-amber-400 font-mono">CHRISXAUUSD</h1>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-300 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>XAU/USD • LIVE</span>
            </div>
          </div>
        </div>

        <div className="text-right font-mono">
          <div className="text-xs font-black text-white">{currentTick.price.toFixed(2)}$</div>
          <div className={`text-[10px] font-bold ${currentTick.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {currentTick.change24h >= 0 ? '+' : ''}{currentTick.change24h.toFixed(2)} ({currentTick.changePercent24h.toFixed(2)}%)
          </div>
        </div>
      </div>

      {/* Signal Analysis In-Progress Banner */}
      {isAnalyzingNextSignal && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800/80 rounded-2xl p-3.5 flex items-center justify-between text-xs font-mono animate-pulse shadow-sm">
          <div className="flex items-center gap-2.5 text-amber-900 dark:text-amber-300 font-bold">
            <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
            <span>Analyse SMC/ICT & Signal imminent...</span>
          </div>
          <span className="bg-amber-500 text-slate-950 px-2 py-0.5 rounded-lg font-black text-[11px]">
            {nextSignalCountdown > 0 ? `${nextSignalCountdown}s` : '1s'}
          </span>
        </div>
      )}

      {/* MAIN PROMINENT CARD: SETUP ACTIF (or Latest Setup) */}
      <div className="bg-white dark:bg-[#0B132B] border-2 border-amber-400/80 dark:border-amber-500/60 rounded-[22px] p-4.5 shadow-[0_10px_30px_rgba(245,158,11,0.08)] relative overflow-hidden">
        
        {/* Card Header Badge */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            <span className="text-xs font-extrabold uppercase font-mono text-slate-900 dark:text-white tracking-wider">
              {activeSetup ? 'SETUP ACTIF EN COURS' : 'DERNIER SETUP PUBLIÉ'}
            </span>
          </div>

          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/20">
            Gold (XAU/USD)
          </span>
        </div>

        {displaySetup ? (
          <div className="mt-3.5 space-y-3.5">
            
            {/* Direction & Timeframe */}
            <div className="flex items-center justify-between">
              <div
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black font-mono flex items-center gap-1.5 shadow-xs ${
                  isBuy
                    ? 'bg-emerald-500 text-white'
                    : 'bg-rose-500 text-white'
                }`}
              >
                {isBuy ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {displaySetup.type} • ACHAT / VENTE
              </div>

              <div className="text-right font-mono">
                <div className="text-[10px] text-slate-400">Ticket #{displaySetup.ticketNumber}</div>
                <div className="text-xs font-bold text-amber-500">{displaySetup.timeframe}</div>
              </div>
            </div>

            {/* Key Price Levels (Entry, SL, TP) */}
            <div className="grid grid-cols-3 gap-2 text-center font-mono py-1">
              <div className="bg-slate-50 dark:bg-[#060D1E] p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="text-[9px] text-slate-400 uppercase font-sans">Entry</div>
                <div className="text-xs font-black text-slate-900 dark:text-white mt-0.5">
                  {displaySetup.entryPrice.toFixed(2)}
                </div>
              </div>

              <div className="bg-rose-50 dark:bg-rose-950/20 p-2.5 rounded-xl border border-rose-200 dark:border-rose-900/40">
                <div className="text-[9px] text-rose-500 uppercase font-sans">Stop Loss</div>
                <div className="text-xs font-black text-rose-600 dark:text-rose-400 mt-0.5">
                  {displaySetup.stopLoss.toFixed(2)}
                </div>
              </div>

              <div className="bg-emerald-50 dark:bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-900/40">
                <div className="text-[9px] text-emerald-500 uppercase font-sans">Take Profit</div>
                <div className="text-xs font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {displaySetup.takeProfit.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Conviction & Confirmation Metrics */}
            <div className="flex items-center justify-around bg-slate-50 dark:bg-[#060D1E] p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-sans block">Conviction</span>
                <span className="font-extrabold text-amber-500">{displaySetup.convictionRate}%</span>
              </div>

              <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />

              <div>
                <span className="text-[10px] text-slate-400 font-sans block">Confirmation</span>
                <span className="font-extrabold text-blue-500">{displaySetup.score}/5</span>
              </div>

              <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />

              <div>
                <span className="text-[10px] text-slate-400 font-sans block">Ratio R:R</span>
                <span className="font-extrabold text-emerald-500">1:{displaySetup.rrRatio}</span>
              </div>
            </div>

            {/* MAIN ACTION BUTTON: [ VOIR LE SETUP ] */}
            <button
              onClick={() => onOpenSetupDetail(displaySetup)}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer"
            >
              <span>VOIR LE SETUP COMPLET</span>
              <ChevronRight className="w-4 h-4" />
            </button>

          </div>
        ) : (
          <div className="py-8 text-center text-slate-500 font-mono text-xs">
            Aucun setup actif pour le moment.
          </div>
        )}

      </div>

      {/* QUICK ESSENTIAL MARKET SUMMARY (NO CLUTTER) */}
      <div className="grid grid-cols-2 gap-3">
        
        {/* Session Status */}
        <div className="bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 shadow-xs">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Session Active</div>
          <div className="text-xs font-bold text-slate-900 dark:text-white mt-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{activeSession.name} ({activeSession.city})</span>
          </div>
        </div>

        {/* Win Rate Today */}
        <div className="bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 shadow-xs">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Win Rate du Jour</div>
          <div className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
            {dailyStats.winRate}% ({dailyStats.winners}G / {dailyStats.losers}P)
          </div>
        </div>

      </div>

      {/* QUICK SIGNAL GENERATOR TRIGGER BUTTONS */}
      <div className="bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 space-y-2 shadow-xs">
        <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 font-mono">
          DÉCLENCHEMENT MANUEL ACCÉLÉRÉ
        </div>
        <div className="grid grid-cols-2 gap-2 font-mono">
          <button
            onClick={() => onGenerateNewSignal('BUY')}
            className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer shadow-xs"
          >
            + ACHAT IMMÉDIAT
          </button>
          <button
            onClick={() => onGenerateNewSignal('SELL')}
            className="py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer shadow-xs"
          >
            + VENTE IMMÉDIATE
          </button>
        </div>
      </div>

    </div>
  );
};
