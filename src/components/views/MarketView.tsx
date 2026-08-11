import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Clock, Globe, Zap, Calendar, TrendingUp } from 'lucide-react';
import { PriceTick, Candle, MarketSession, TradeSetup } from '../../types';
import { LiveChartWidget } from '../LiveChartWidget';
import { RailwayLiveSignals } from '../RailwayLiveSignals';
import { EconomicCalendarView } from '../EconomicCalendarView';

interface MarketViewProps {
  currentTick: PriceTick;
  candles: Candle[];
  activeSetup: TradeSetup | null;
  marketSessions: MarketSession[];
}

export const MarketView: React.FC<MarketViewProps> = ({
  currentTick,
  candles,
  activeSetup,
  marketSessions,
}) => {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (id: string) => {
    setOpenSection((prev) => (prev === id ? null : id));
  };

  return (
    <div className="font-sans pb-2">
      
      {/* Real-time Header & Trend Badge */}
      <div className="bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-xs mb-4">
        <div>
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider font-bold">MARCHÉ SPOT • XAU/USD</div>
          <div className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 dark:text-white font-mono mt-0.5">
            ${currentTick.price.toFixed(2)} USD
          </div>
        </div>

        <div className="text-right font-mono">
          <span
            className={`text-xs sm:text-sm font-black px-3 py-1.5 rounded-full border inline-block ${
              currentTick.change24h >= 0
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
            }`}
          >
            {currentTick.change24h >= 0 ? '▲ HAUSSE' : '▼ BAISSE'}{' '}
            {currentTick.changePercent24h >= 0 ? '+' : ''}{currentTick.changePercent24h.toFixed(2)}%
          </span>
          <div className="text-xs text-slate-400 mt-1 font-bold">Spread: {currentTick.spread.toFixed(2)}$</div>
        </div>
      </div>

      {/* DUAL COLUMN RESPONSIVE GRID FOR DESKTOP (lg: grid-cols-12) / SINGLE STACK FOR MOBILE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-start">
        
        {/* LEFT COLUMN: LIVE CHART & RAILWAY SIGNALS (lg:col-span-7 xl:col-span-8) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          
          {/* PROMINENT LARGE CHART (Readable on mobile and desktop) */}
          <div className="bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 rounded-2xl p-2.5 sm:p-4 shadow-sm min-h-[380px] lg:min-h-[480px] flex flex-col justify-center">
            <LiveChartWidget
              candles={candles}
              currentTick={currentTick}
              activeSetup={activeSetup}
            />
          </div>

          {/* FLUX DIRECT API RAILWAY SIGNALS */}
          <div className="bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
              <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white font-mono uppercase flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>FLUX SIGNAUX DIRECT API</span>
              </h3>
              <span className="text-xs font-mono text-emerald-500 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                LIVE
              </span>
            </div>
            <RailwayLiveSignals />
          </div>

        </div>

        {/* RIGHT SIDEBAR COLUMN: SESSIONS & CALENDAR (lg:col-span-5 xl:col-span-4) */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-4">
          
          {/* SESSIONS DE MARCHÉ */}
          <div className="bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900 dark:text-white font-mono uppercase pb-2 border-b border-slate-100 dark:border-slate-800">
              <Globe className="w-4 h-4 text-blue-500" />
              <span>SESSIONS DE MARCHÉ</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 font-mono text-xs">
              {marketSessions.map((session, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border ${
                    session.isActiveNow
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-700 dark:text-emerald-300 font-extrabold'
                      : 'bg-slate-50 dark:bg-[#060D1E] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold">{session.name} ({session.city})</span>
                    {session.isActiveNow ? (
                      <span className="text-[10px] bg-emerald-500 text-white font-black px-2 py-0.5 rounded-full">OUVERT</span>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-bold">FERMÉ</span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 font-sans">
                    {session.openTimeGmt} - {session.closeTimeGmt} GMT
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CALENDRIER ÉCONOMIQUE */}
          <div className="bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900 dark:text-white font-mono uppercase pb-2 border-b border-slate-100 dark:border-slate-800">
              <Calendar className="w-4 h-4 text-purple-500" />
              <span>CALENDRIER ÉCONOMIQUE USD</span>
            </div>
            <EconomicCalendarView />
          </div>

        </div>

      </div>

    </div>
  );
};
