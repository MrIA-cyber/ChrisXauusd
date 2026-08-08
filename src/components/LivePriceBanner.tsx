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
    <div className="bg-white/95 dark:bg-slate-900/95 border-b border-slate-200/80 dark:border-slate-800 px-4 py-3 sm:py-3.5 shadow-xs backdrop-blur-xl text-slate-900 dark:text-slate-100 relative overflow-hidden font-sans">
      {/* Background Subtle Grid Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f005_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f005_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
        
        {/* Left: Ticker Symbol & Centerpiece Main Market Price */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-600 shrink-0">
              <Layers className="w-5 h-5 text-amber-500 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-bold tracking-wider text-slate-900 dark:text-slate-100 font-mono whitespace-nowrap">
                  XAU/USD
                </span>
                <span className="text-[10px] bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 px-2 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider whitespace-nowrap">
                  SPOT GOLD
                </span>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1.5 mt-0.5 whitespace-nowrap">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping shrink-0" />
                <span className="text-slate-700 dark:text-slate-300 font-bold">LIVE INSTITUTIONAL FEED</span>
              </span>
            </div>
          </div>

          {/* MAIN PRICE CENTERPIECE WITH DYNAMIC TICK ANIMATION */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div
              className={`text-base sm:text-xl lg:text-2xl font-extrabold font-mono tracking-tight transition-all duration-300 px-2.5 sm:px-3 py-1 rounded-xl sm:rounded-2xl ${
                tickDirection === 'UP'
                  ? 'text-emerald-700 bg-emerald-50 shadow-[0_0_25px_rgba(22,163,74,0.25)] border border-emerald-300 scale-[1.02]'
                  : tickDirection === 'DOWN'
                  ? 'text-rose-700 bg-rose-50 shadow-[0_0_25px_rgba(220,38,38,0.25)] border border-rose-300 scale-[1.02]'
                  : 'text-[#0F172A] bg-slate-50 border border-slate-200/80 shadow-xs'
              }`}
            >
              ${currentTick.price.toFixed(2)}
            </div>

            <div
              className={`flex items-center gap-1 font-mono text-xs sm:text-sm font-bold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl border transition-all ${
                isUp
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-xs'
                  : 'bg-rose-50 border-rose-300 text-rose-800 shadow-xs'
              }`}
            >
              {isUp ? <ArrowUpRight className="w-4 h-4 text-emerald-600" /> : <ArrowDownRight className="w-4 h-4 text-rose-600" />}
              <span>{isUp ? '+' : ''}{currentTick.change24h.toFixed(2)}</span>
              <span className="opacity-80">({isUp ? '+' : ''}{currentTick.changePercent24h.toFixed(2)}%)</span>
            </div>
          </div>
        </div>

        {/* Center/Right: 3 Identical Institutional Cards (SPREAD, BID, ASK) + Sparkline */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 font-mono w-full md:w-auto justify-between md:justify-end">
          
          {/* 3 Identical Cards: SPREAD, BID, ASK */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-3 w-full sm:w-auto">
            
            {/* 1. SPREAD Card */}
            <div className="bg-slate-50/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 p-2 sm:p-3 rounded-[16px] sm:rounded-[20px] shadow-xs text-center hover:border-amber-400 transition-colors">
              <span className="text-[9px] sm:text-[10px] text-slate-600 dark:text-slate-400 uppercase tracking-widest font-extrabold block mb-0.5 sm:mb-1">
                SPREAD
              </span>
              <span className="text-xs sm:text-sm font-black text-amber-700 dark:text-amber-400 block font-mono truncate">
                ${currentTick.spread.toFixed(2)}
              </span>
            </div>

            {/* 2. BID Card */}
            <div className="bg-slate-50/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 p-2 sm:p-3 rounded-[14px] sm:rounded-[20px] shadow-xs text-center hover:border-emerald-400 transition-colors">
              <span className="text-[9px] sm:text-[10px] text-slate-600 dark:text-slate-400 uppercase tracking-widest font-extrabold block mb-0.5 sm:mb-1 truncate">
                BID<span className="hidden sm:inline"> (OFFRE)</span>
              </span>
              <span className="text-xs sm:text-sm font-black text-emerald-700 dark:text-emerald-400 block font-mono truncate">
                ${currentTick.bid.toFixed(2)}
              </span>
            </div>

            {/* 3. ASK Card */}
            <div className="bg-slate-50/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 p-2 sm:p-3 rounded-[14px] sm:rounded-[20px] shadow-xs text-center hover:border-rose-400 transition-colors">
              <span className="text-[9px] sm:text-[10px] text-slate-600 dark:text-slate-400 uppercase tracking-widest font-extrabold block mb-0.5 sm:mb-1 truncate">
                ASK<span className="hidden sm:inline"> (DEMANDE)</span>
              </span>
              <span className="text-xs sm:text-sm font-black text-rose-700 dark:text-rose-400 block font-mono truncate">
                ${currentTick.ask.toFixed(2)}
              </span>
            </div>

          </div>

          {/* Mini Sparkline Graph & 24h High/Low */}
          <div className="hidden lg:flex items-center gap-4 bg-slate-50/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 p-2.5 rounded-[20px] shadow-xs">
            <div className="flex flex-col text-[11px] font-mono space-y-1 pr-3 border-r border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                <TrendingUp className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>H: <strong className="text-slate-900 dark:text-slate-100">${currentTick.high24h.toFixed(2)}</strong></span>
              </div>
              <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                <TrendingDown className="w-3 h-3 text-rose-600 dark:text-rose-400" />
                <span>L: <strong className="text-slate-900 dark:text-slate-100">${currentTick.low24h.toFixed(2)}</strong></span>
              </div>
            </div>

            <div className="w-[180px] h-[36px] overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 200 40">
                <defs>
                  <linearGradient id="sparklineGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={isUp ? '#16a34a' : '#dc2626'} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={isUp ? '#16a34a' : '#dc2626'} stopOpacity="0.0" />
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
                      stroke={isUp ? '#16a34a' : '#dc2626'}
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
