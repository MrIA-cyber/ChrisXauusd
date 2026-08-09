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
    <div className="space-y-4 font-sans pb-2">
      
      {/* Real-time Header & Trend Badge */}
      <div className="bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-xs">
        <div>
          <div className="text-[10px] font-mono text-slate-400 uppercase">MARCHÉ SPOT • XAU/USD</div>
          <div className="text-lg font-black text-slate-900 dark:text-white font-mono mt-0.5">
            {currentTick.price.toFixed(2)} USD
          </div>
        </div>

        <div className="text-right font-mono">
          <span
            className={`text-xs font-black px-2.5 py-1 rounded-full border ${
              currentTick.change24h >= 0
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
            }`}
          >
            {currentTick.change24h >= 0 ? '▲ HAUSSE' : '▼ BAISSE'}{' '}
            {currentTick.changePercent24h >= 0 ? '+' : ''}{currentTick.changePercent24h.toFixed(2)}%
          </span>
          <div className="text-[10px] text-slate-400 mt-1">Spread: {currentTick.spread.toFixed(2)}$</div>
        </div>
      </div>

      {/* PROMINENT LARGE CHART (Readable on mobile) */}
      <div className="bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 rounded-2xl p-2.5 shadow-sm min-h-[340px] flex flex-col justify-center">
        <LiveChartWidget
          candles={candles}
          currentTick={currentTick}
          activeSetup={activeSetup}
        />
      </div>

      {/* SECONDARY INFORMATION IN ACCORDIONS UNDERNEATH */}
      <div className="space-y-2 pt-1">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono px-1">
          Informations de Marché Sécondaires
        </div>

        {/* Accordion 1: Sessions de Marché */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-[#0A1224]">
          <button
            onClick={() => toggleSection('sessions')}
            className="w-full px-4 py-3 flex items-center justify-between text-left font-semibold text-xs text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-500" />
              <span>▸ Sessions de Marché Internationales</span>
            </span>
            {openSection === 'sessions' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {openSection === 'sessions' && (
            <div className="p-3 bg-slate-50/50 dark:bg-[#070E1E] border-t border-slate-200 dark:border-slate-800 text-xs space-y-2">
              <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                {marketSessions.map((session, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl border ${
                      session.isActiveNow
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-700 dark:text-emerald-300 font-bold'
                        : 'bg-white dark:bg-[#0E1A38] border-slate-200 dark:border-slate-800 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{session.name} ({session.city})</span>
                      {session.isActiveNow && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 font-sans">
                      {session.openTimeGmt} - {session.closeTimeGmt} GMT
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Accordion 2: Flux Direct Railway Signals */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-[#0A1224]">
          <button
            onClick={() => toggleSection('railway')}
            className="w-full px-4 py-3 flex items-center justify-between text-left font-semibold text-xs text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>▸ Signaux Backend & Flux API Direct</span>
            </span>
            {openSection === 'railway' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {openSection === 'railway' && (
            <div className="p-3 bg-slate-50/50 dark:bg-[#070E1E] border-t border-slate-200 dark:border-slate-800">
              <RailwayLiveSignals />
            </div>
          )}
        </div>

        {/* Accordion 3: Calendrier Économique */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-[#0A1224]">
          <button
            onClick={() => toggleSection('calendar')}
            className="w-full px-4 py-3 flex items-center justify-between text-left font-semibold text-xs text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-500" />
              <span>▸ Calendrier Économique (Impact Fort USD)</span>
            </span>
            {openSection === 'calendar' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {openSection === 'calendar' && (
            <div className="p-3 bg-slate-50/50 dark:bg-[#070E1E] border-t border-slate-200 dark:border-slate-800">
              <EconomicCalendarView />
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
