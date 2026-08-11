import React, { useEffect, useRef, useState } from 'react';
import { TrendingUp, TrendingDown, Activity, ArrowUpRight, ArrowDownRight, Layers } from 'lucide-react';
import { PriceTick, Candle } from '../types';

interface LivePriceBannerProps {
  currentTick: PriceTick;
  recentCandles: Candle[];
}

export const LivePriceBanner: React.FC<LivePriceBannerProps> = ({ currentTick, recentCandles }) => {
  const isUp = currentTick.change24h >= 0;
  
  // Tick Direction Animation State (Green flash on rise, Red flash on drop)
  const [tickDirection, setTickDirection] = useState<'UP' | 'DOWN' | 'NEUTRAL'>('NEUTRAL');
  const prevPriceRef = useRef<number>(currentTick.price);

  useEffect(() => {
    if (currentTick.price > prevPriceRef.current) {
      setTickDirection('UP');
    } else if (currentTick.price < prevPriceRef.current) {
      setTickDirection('DOWN');
    }
    prevPriceRef.current = currentTick.price;

    const timer = setTimeout(() => {
      setTickDirection('NEUTRAL');
    }, 450);

    return () => clearTimeout(timer);
  }, [currentTick.price]);

  // Build SVG path points for sparkline chart
  const sparklinePoints = React.useMemo(() => {
    if (!recentCandles.length) return '';
    const closes = recentCandles.map((c) => c.close);
    const min = Math.min(...closes);
    const max = Math.max(...closes);
    const range = max - min || 1;
    const width = 200;
    const height = 40;

    return closes
      .map((val, idx) => {
        const x = (idx / (closes.length - 1)) * width;
        const y = height - ((val - min) / range) * (height - 8) - 4;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  }, [recentCandles]);

  return (
    <div className="bg-[var(--bg-card)]/95 border-b border-[var(--border-card)] px-2 sm:px-3 py-1.5 sm:py-2 shadow-xs backdrop-blur-xl text-slate-100 relative overflow-hidden font-sans w-full max-w-full box-border min-w-0 transition-colors duration-300">
      {/* Background Subtle Grid Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-1.5 sm:gap-3 relative z-10 w-full min-w-0 max-w-full">
        
        {/* Left: Ticker Symbol & Centerpiece Main Market Price */}
        <div className="flex flex-row items-center gap-1.5 sm:gap-3 w-full md:w-auto justify-between md:justify-start min-w-0 max-w-full">
          <div className="flex items-center gap-1.5 sm:gap-2 shrink min-w-0">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-[var(--cyan-electric)]/10 border border-[var(--cyan-electric)]/30 flex items-center justify-center text-[var(--cyan-electric)] shrink-0 shadow-xs">
              <Layers className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[var(--cyan-electric)] animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-xs sm:text-sm font-extrabold tracking-wider text-white font-mono whitespace-nowrap">
                  XAU/USD
                </span>
                <span className="text-[9px] sm:text-[10px] bg-[var(--cyan-electric)]/10 text-[var(--cyan-electric)] border border-[var(--cyan-electric)]/30 px-1.5 py-0.2 rounded-full font-mono font-bold uppercase tracking-wider whitespace-nowrap">
                  GOLD
                </span>
              </div>
              <span className="text-[9px] sm:text-[11px] text-slate-300 font-mono flex items-center gap-1 mt-0.5 whitespace-nowrap font-medium truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-ping shrink-0" />
                <span className="truncate">FLUX INSTITUTIONNEL</span>
              </span>
            </div>
          </div>

          {/* MAIN PRICE CENTERPIECE WITH DYNAMIC TICK ANIMATION */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 min-w-0">
            <div
              className={`text-sm sm:text-lg lg:text-xl font-black font-mono tracking-tight transition-all duration-300 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg ${
                tickDirection === 'UP'
                  ? 'text-[#22C55E] bg-[#22C55E]/15 shadow-[0_0_15px_rgba(34,197,94,0.3)] border border-[#22C55E]/40 scale-[1.01]'
                  : tickDirection === 'DOWN'
                  ? 'text-[#EF4444] bg-[#EF4444]/15 shadow-[0_0_15px_rgba(239,68,68,0.3)] border border-[#EF4444]/40 scale-[1.01]'
                  : 'text-white bg-[var(--bg-main)] border border-[var(--border-card)] shadow-xs'
              }`}
            >
              ${currentTick.price.toFixed(2)}
            </div>

            <div
              className={`flex items-center gap-0.5 font-mono text-[10px] sm:text-xs font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-lg border transition-all shrink-0 ${
                isUp
                  ? 'bg-[#22C55E]/10 border-[#22C55E]/30 text-[#22C55E] shadow-xs'
                  : 'bg-[#EF4444]/10 border-[#EF4444]/30 text-[#EF4444] shadow-xs'
              }`}
            >
              {isUp ? <ArrowUpRight className="w-3 h-3 text-[#22C55E] shrink-0" /> : <ArrowDownRight className="w-3 h-3 text-[#EF4444] shrink-0" />}
              <span>{isUp ? '+' : ''}{currentTick.change24h.toFixed(2)}</span>
              <span className="opacity-80 hidden xs:inline sm:inline">({isUp ? '+' : ''}{currentTick.changePercent24h.toFixed(2)}%)</span>
            </div>
          </div>
        </div>

        {/* Center/Right: 3 Identical Institutional Cards (SPREAD, BID, ASK) + Sparkline */}
        <div className="flex flex-wrap items-center gap-1 sm:gap-2 font-mono w-full md:w-auto justify-between md:justify-end min-w-0 max-w-full">
          
          {/* 3 Identical Cards: SPREAD, BID, ASK */}
          <div className="grid grid-cols-3 gap-1 w-full sm:w-auto min-w-0">
            
            {/* 1. SPREAD Card */}
            <div className="bg-[var(--bg-main)]/80 border border-[var(--border-card)] px-1.5 py-1 rounded-lg shadow-xs text-center hover:border-[var(--cyan-electric)]/60 transition-colors min-w-0 overflow-hidden">
              <span className="text-[8px] sm:text-[9px] text-slate-400 uppercase tracking-wider font-extrabold block truncate">
                SPREAD
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-[var(--cyan-electric)] block font-mono truncate">
                ${currentTick.spread.toFixed(2)}
              </span>
            </div>

            {/* 2. BID Card */}
            <div className="bg-[var(--bg-main)]/80 border border-[var(--border-card)] px-1.5 py-1 rounded-lg shadow-xs text-center hover:border-[#22C55E]/50 transition-colors min-w-0 overflow-hidden">
              <span className="text-[8px] sm:text-[9px] text-slate-400 uppercase tracking-wider font-extrabold block truncate">
                BID<span className="hidden sm:inline"> (OFFRE)</span>
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-[#22C55E] block font-mono truncate">
                ${currentTick.bid.toFixed(2)}
              </span>
            </div>

            {/* 3. ASK Card */}
            <div className="bg-[var(--bg-main)]/80 border border-[var(--border-card)] px-1.5 py-1 rounded-lg shadow-xs text-center hover:border-[#EF4444]/50 transition-colors min-w-0 overflow-hidden">
              <span className="text-[8px] sm:text-[9px] text-slate-400 uppercase tracking-wider font-extrabold block truncate">
                ASK<span className="hidden sm:inline"> (DEMANDE)</span>
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-[#EF4444] block font-mono truncate">
                ${currentTick.ask.toFixed(2)}
              </span>
            </div>

          </div>

          {/* Mini Sparkline Graph & 24h High/Low */}
          <div className="hidden lg:flex items-center gap-2.5 bg-[var(--bg-main)]/80 border border-[var(--border-card)] p-1.5 rounded-xl shadow-xs">
            <div className="flex flex-col text-[10px] font-mono space-y-0.5 pr-2 border-r border-[#00E5FF]/15">
              <div className="flex items-center gap-1 text-slate-400">
                <TrendingUp className="w-2.5 h-2.5 text-[#22C55E]" />
                <span>H: <strong className="text-white">${currentTick.high24h.toFixed(2)}</strong></span>
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                <TrendingDown className="w-2.5 h-2.5 text-[#EF4444]" />
                <span>L: <strong className="text-white">${currentTick.low24h.toFixed(2)}</strong></span>
              </div>
            </div>

            <div className="w-24 lg:w-28 h-6 overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 200 40">
                <defs>
                  <linearGradient id="sparklineGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={isUp ? '#22C55E' : '#EF4444'} stopOpacity="0.4" />
                    <stop offset="100%" stopColor={isUp ? '#22C55E' : '#EF4444'} stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {sparklinePoints && (
                  <>
                    <polygon
                      points={`0,40 ${sparklinePoints} 200,40`}
                      fill="url(#sparklineGrad)"
                    />
                    <polyline
                      fill="none"
                      stroke={isUp ? '#22C55E' : '#EF4444'}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={sparklinePoints}
                    />
                  </>
                )}
              </svg>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
