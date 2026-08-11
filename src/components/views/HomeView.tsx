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
  Brain,
  Globe,
  Award,
} from 'lucide-react';
import { TradeSetup, PriceTick, MarketSession, DailyStats } from '../../types';
import { AIPredictiveSentimentModule } from '../AIPredictiveSentimentModule';
import { RailwayLiveSignals } from '../RailwayLiveSignals';
import { GlobalRankingCard } from '../GlobalRankingCard';

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
    <div className="font-sans pb-2">
      
      {/* Top Mobile/Tablet Brand Banner */}
      <div className="flex items-center justify-between bg-slate-900 dark:bg-[#081226] text-white p-3.5 sm:p-4 rounded-2xl border border-slate-800 shadow-md mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center font-black text-slate-950 text-xs sm:text-sm shadow-xs">
            XAU
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-black tracking-wider text-amber-400 font-mono">CHRISXAUUSD</h1>
            <div className="flex items-center gap-1.5 text-xs text-slate-300 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>XAU/USD • LIVE SPOT</span>
            </div>
          </div>
        </div>

        <div className="text-right font-mono">
          <div className="text-sm sm:text-base font-black text-white">${currentTick.price.toFixed(2)}</div>
          <div className={`text-xs font-bold ${currentTick.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {currentTick.change24h >= 0 ? '+' : ''}{currentTick.change24h.toFixed(2)} ({currentTick.changePercent24h.toFixed(2)}%)
          </div>
        </div>
      </div>

      {/* Signal Analysis In-Progress Banner */}
      {isAnalyzingNextSignal && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800/80 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between text-xs sm:text-sm font-mono animate-pulse shadow-sm mb-4">
          <div className="flex items-center gap-2.5 text-amber-900 dark:text-amber-300 font-bold">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 animate-spin" />
            <span>Analyse SMC/ICT & Signal imminent...</span>
          </div>
          <span className="bg-amber-500 text-slate-950 px-2.5 py-1 rounded-lg font-black text-xs">
            {nextSignalCountdown > 0 ? `${nextSignalCountdown}s` : '1s'}
          </span>
        </div>
      )}

      {/* DUAL COLUMN RESPONSIVE GRID FOR DESKTOP (lg: grid-cols-12) / SINGLE STACK FOR MOBILE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-start">
        
        {/* LEFT MAIN COLUMN (Mobile: 100%, Desktop lg: 7/12 or 8/12) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4 lg:space-y-6">
          
          {/* MAIN PROMINENT CARD: SETUP ACTIF (or Latest Setup) */}
          <div className="bg-white dark:bg-[#0B132B] border-2 border-amber-400/80 dark:border-amber-500/60 rounded-[22px] p-4 sm:p-6 shadow-[0_10px_30px_rgba(245,158,11,0.08)] relative overflow-hidden">
            
            {/* Card Header Badge */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${displaySetup ? 'bg-amber-500 animate-ping' : 'bg-slate-400'}`} />
                <span className="text-xs sm:text-sm md:text-base font-extrabold uppercase font-mono text-slate-900 dark:text-white tracking-wider">
                  {displaySetup ? (activeSetup ? 'SETUP ACTIF EN COURS' : 'DERNIER SETUP PUBLIÉ') : 'STATUS: NO TRADE'}
                </span>
              </div>

              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-extrabold border border-amber-500/20">
                Gold (XAU/USD)
              </span>
            </div>

            {displaySetup ? (
              <div className="mt-4 space-y-4">
                
                {/* Direction & Timeframe */}
                <div className="flex items-center justify-between">
                  <div
                    className={`px-4 py-2 rounded-xl text-sm sm:text-base font-black font-mono flex items-center gap-2 shadow-xs min-h-[44px] ${
                      isBuy
                        ? 'bg-emerald-500 text-white'
                        : 'bg-rose-500 text-white'
                    }`}
                  >
                    {isBuy ? <ArrowUpRight className="w-5 h-5 stroke-[3]" /> : <ArrowDownRight className="w-5 h-5 stroke-[3]" />}
                    {displaySetup.type} • ACHAT / VENTE
                  </div>

                  <div className="text-right font-mono">
                    <div className="text-xs sm:text-sm text-slate-400 font-bold">Ticket #{displaySetup.ticketNumber}</div>
                    <div className="text-sm sm:text-base font-extrabold text-amber-500">{displaySetup.timeframe}</div>
                  </div>
                </div>

                {/* Key Price Levels (Entry, SL, TP) - Large 18-24px Values */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 text-center font-mono py-1">
                  <div className="bg-slate-50 dark:bg-[#060D1E] p-3 rounded-2xl border border-slate-200 dark:border-slate-800 flex sm:flex-col justify-between items-center sm:items-start min-h-[58px]">
                    <div className="text-xs text-slate-400 uppercase font-sans font-bold flex items-center gap-1">
                      Prix d'Entrée
                    </div>
                    <div className="text-base sm:text-lg lg:text-xl font-black text-slate-900 dark:text-white mt-0.5">
                      ${displaySetup.entryPrice.toFixed(2)}
                    </div>
                  </div>

                  <div className="bg-rose-50 dark:bg-rose-950/20 p-3 rounded-2xl border border-rose-200 dark:border-rose-900/40 flex sm:flex-col justify-between items-center sm:items-start min-h-[58px]">
                    <div className="text-xs text-rose-500 uppercase font-sans font-bold flex items-center gap-1">
                      Stop Loss
                    </div>
                    <div className="text-base sm:text-lg lg:text-xl font-black text-rose-600 dark:text-rose-400 mt-0.5">
                      ${displaySetup.stopLoss.toFixed(2)}
                    </div>
                  </div>

                  <div className="bg-emerald-50 dark:bg-emerald-950/20 p-3 rounded-2xl border border-emerald-200 dark:border-emerald-900/40 flex sm:flex-col justify-between items-center sm:items-start min-h-[58px]">
                    <div className="text-xs text-emerald-500 uppercase font-sans font-bold flex items-center gap-1">
                      Take Profit
                    </div>
                    <div className="text-base sm:text-lg lg:text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                      ${displaySetup.takeProfit.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Conviction & Confirmation Metrics (14-16px font size) */}
                <div className="flex items-center justify-around bg-slate-50 dark:bg-[#060D1E] p-3 rounded-2xl border border-slate-200 dark:border-slate-800 font-mono text-sm sm:text-base">
                  <div className="text-center">
                    <span className="text-xs text-slate-400 font-sans block font-bold">Conviction</span>
                    <span className="font-extrabold text-amber-500 text-sm sm:text-base">{displaySetup.convictionRate}%</span>
                  </div>

                  <div className="h-7 w-px bg-slate-200 dark:bg-slate-800" />

                  <div className="text-center">
                    <span className="text-xs text-slate-400 font-sans block font-bold">Confirmation</span>
                    <span className="font-extrabold text-blue-500 text-sm sm:text-base">{displaySetup.score}/5</span>
                  </div>

                  <div className="h-7 w-px bg-slate-200 dark:bg-slate-800" />

                  <div className="text-center">
                    <span className="text-xs text-slate-400 font-sans block font-bold">Ratio R:R</span>
                    <span className="font-extrabold text-emerald-500 text-sm sm:text-base">1:{displaySetup.rrRatio}</span>
                  </div>
                </div>

                {/* MAIN ACTION BUTTON: [ VOIR LE SETUP ] */}
                <button
                  onClick={() => onOpenSetupDetail(displaySetup)}
                  className="w-full min-h-[48px] py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-sm sm:text-base rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer"
                >
                  <span>VOIR LE SETUP COMPLET</span>
                  <ChevronRight className="w-5 h-5" />
                </button>

              </div>
            ) : (
              <div className="py-6 px-3 sm:px-4 space-y-4 text-center cursor-default font-sans">
                <div className="inline-flex items-center gap-2 bg-slate-100 dark:bg-[#060D1E] text-slate-800 dark:text-slate-200 border-2 border-slate-300 dark:border-slate-700 px-4 py-2.5 rounded-2xl font-mono font-black text-xs sm:text-sm shadow-inner">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400 dark:bg-slate-500" />
                  <span>STATUS : NO TRADE — CONDITIONS NON RÉUNIES</span>
                </div>

                <div className="space-y-1.5 max-w-md mx-auto">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wide">
                    Attente de Confluence Algorithmique (Score &lt; 5/5)
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                    Le protocole algorithmique ChrisXauusd exige la validation stricte des 5 piliers de confirmation SMC/ICT. Lorsque les conditions ne sont pas réunies à 100%, le terminal reste en NO TRADE pour garantir un taux de réussite optimal (90% – 94%).
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-[#060D1E] p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-left font-mono text-xs sm:text-sm space-y-2 max-w-md mx-auto">
                  <div className="text-slate-400 font-bold uppercase pb-1 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <span>Diagnostic Algorithmique M5</span>
                    <span className="text-amber-500 font-bold">En Recherche</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5 text-slate-600 dark:text-slate-300 font-semibold">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                      <span>Structure BOS/CHoCH : Neutre</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                      <span>Zone Order Block : Non atteinte</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                      <span>RSI / MACD : Incomplet</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                      <span>Filtre Session : OK ({activeSession.name})</span>
                    </div>
                  </div>
                </div>

                <div className="text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 font-mono font-bold bg-emerald-500/10 py-2 px-3.5 rounded-xl inline-block border border-emerald-500/20">
                  🛡️ Zero Risque · Exécution Uniquement en Hautes Confluences
                </div>
              </div>
            )}

          </div>

          {/* RAILWAY LIVE SIGNALS STREAM FEED */}
          <div className="bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white font-mono uppercase flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>FLUX SIGNAUX DIRECT API</span>
              </h2>
              <span className="text-xs font-mono text-emerald-500 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                LIVE
              </span>
            </div>
            <RailwayLiveSignals />
          </div>

        </div>

        {/* RIGHT SIDEBAR COLUMN (Mobile: 100%, Desktop lg: 5/12 or 4/12) */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-4 lg:space-y-6">
          
          {/* QUICK SIGNAL GENERATOR TRIGGER BUTTONS */}
          <div className="bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3 shadow-xs">
            <div className="text-xs font-extrabold text-slate-500 dark:text-slate-400 font-mono tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>DÉCLENCHEMENT MANUEL ACCÉLÉRÉ</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5 font-mono">
              <button
                onClick={() => onGenerateNewSignal('BUY')}
                className="min-h-[48px] py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm sm:text-base rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer shadow-md"
              >
                + ACHAT IMMÉDIAT
              </button>
              <button
                onClick={() => onGenerateNewSignal('SELL')}
                className="min-h-[48px] py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-sm sm:text-base rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer shadow-md"
              >
                + VENTE IMMÉDIATE
              </button>
            </div>
          </div>

          {/* ESSENTIAL MARKET SUMMARY (Session & Win rate) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
            {/* Session Status */}
            <div className="bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
              <div className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-blue-500" />
                <span>SESSION ACTIVE</span>
              </div>
              <div className="text-sm sm:text-base font-black text-slate-900 dark:text-white mt-1 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{activeSession.name} ({activeSession.city})</span>
              </div>
            </div>

            {/* Win Rate Today */}
            <div className="bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
              <div className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span>WIN RATE DU JOUR</span>
              </div>
              <div className="text-sm sm:text-base font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {dailyStats.winRate}% ({dailyStats.winners}G / {dailyStats.losers}P)
              </div>
            </div>
          </div>

          {/* AI PREDICTIVE SENTIMENT & MACRO MODULE */}
          <div className="bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
            <AIPredictiveSentimentModule />
          </div>

          {/* GLOBAL MEMBER RANKING CARD */}
          <GlobalRankingCard />

        </div>

      </div>

    </div>
  );
};

