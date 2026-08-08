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
    <div className="bg-[#071426]/95 border-b border-[#00E5FF]/20 px-4 py-3 sm:py-3.5 shadow-xs backdrop-blur-xl text-slate-100 relative overflow-hidden font-sans">
      {/* Background Subtle Grid Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,229,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,229,255,0.03)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
        
        {/* Left: Ticker Symbol & Centerpiece Main Market Price */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF] shrink-0 shadow-[0_0_12px_rgba(0,229,255,0.15)]">
              <Layers className="w-5 h-5 text-[#00E5FF] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-extrabold tracking-wider text-white font-mono whitespace-nowrap">
                  XAU/USD
                </span>
                <span className="text-[10px] bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30 px-2 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider whitespace-nowrap">
                  SPOT GOLD
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5 mt-0.5 whitespace-nowrap">
                <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-ping shrink-0" />
                <span className="text-slate-300 font-bold">LIVE INSTITUTIONAL FEED</span>
              </span>
            </div>
          </div>

          {/* MAIN PRICE CENTERPIECE WITH DYNAMIC TICK ANIMATION */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div
              className={`text-base sm:text-xl lg:text-2xl font-extrabold font-mono tracking-tight transition-all duration-300 px-2.5 sm:px-3 py-1 rounded-xl sm:rounded-2xl ${
                tickDirection === 'UP'
                  ? 'text-[#22C55E] bg-[#22C55E]/15 shadow-[0_0_25px_rgba(34,197,94,0.3)] border border-[#22C55E]/40 scale-[1.02]'
                  : tickDirection === 'DOWN'
                  ? 'text-[#EF4444] bg-[#EF4444]/15 shadow-[0_0_25px_rgba(239,68,68,0.3)] border border-[#EF4444]/40 scale-[1.02]'
                  : 'text-white bg-[#030B16] border border-[#00E5FF]/20 shadow-xs'
              }`}
            >
              ${currentTick.price.toFixed(2)}
            </div>

            <div
              className={`flex items-center gap-1 font-mono text-xs sm:text-sm font-bold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl border transition-all ${
                isUp
                  ? 'bg-[#22C55E]/10 border-[#22C55E]/30 text-[#22C55E] shadow-xs'
                  : 'bg-[#EF4444]/10 border-[#EF4444]/30 text-[#EF4444] shadow-xs'
              }`}
            >
              {isUp ? <ArrowUpRight className="w-4 h-4 text-[#22C55E]" /> : <ArrowDownRight className="w-4 h-4 text-[#EF4444]" />}
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
            <div className="bg-[#030B16]/80 border border-[#00E5FF]/20 p-2 sm:p-3 rounded-[16px] sm:rounded-[20px] shadow-xs text-center hover:border-[#00E5FF]/50 transition-colors">
              <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-widest font-extrabold block mb-0.5 sm:mb-1">
                SPREAD
              </span>
              <span className="text-xs sm:text-sm font-black text-[#00E5FF] block font-mono truncate">
                ${currentTick.spread.toFixed(2)}
              </span>
            </div>

            {/* 2. BID Card */}
            <div className="bg-[#030B16]/80 border border-[#00E5FF]/20 p-2 sm:p-3 rounded-[14px] sm:rounded-[20px] shadow-xs text-center hover:border-[#22C55E]/50 transition-colors">
              <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-widest font-extrabold block mb-0.5 sm:mb-1 truncate">
                BID<span className="hidden sm:inline"> (OFFRE)</span>
              </span>
              <span className="text-xs sm:text-sm font-black text-[#22C55E] block font-mono truncate">
                ${currentTick.bid.toFixed(2)}
              </span>
            </div>

            {/* 3. ASK Card */}
            <div className="bg-[#030B16]/80 border border-[#00E5FF]/20 p-2 sm:p-3 rounded-[14px] sm:rounded-[20px] shadow-xs text-center hover:border-[#EF4444]/50 transition-colors">
              <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-widest font-extrabold block mb-0.5 sm:mb-1 truncate">
                ASK<span className="hidden sm:inline"> (DEMANDE)</span>
              </span>
              <span className="text-xs sm:text-sm font-black text-[#EF4444] block font-mono truncate">
                ${currentTick.ask.toFixed(2)}
              </span>
            </div>

          </div>

          {/* Mini Sparkline Graph & 24h High/Low */}
          <div className="hidden lg:flex items-center gap-4 bg-[#030B16]/80 border border-[#00E5FF]/20 p-2.5 rounded-[20px] shadow-xs">
            <div className="flex flex-col text-[11px] font-mono space-y-1 pr-3 border-r border-[#00E5FF]/15">
              <div className="flex items-center gap-1 text-slate-400">
                <TrendingUp className="w-3 h-3 text-[#22C55E]" />
                <span>H: <strong className="text-white">${currentTick.high24h.toFixed(2)}</strong></span>
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                <TrendingDown className="w-3 h-3 text-[#EF4444]" />
                <span>L: <strong className="text-white">${currentTick.low24h.toFixed(2)}</strong></span>
              </div>
            </div>

            <div className="w-[180px] h-[36px] overflow-hidden">
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
