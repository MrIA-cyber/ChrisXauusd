import React from 'react';
import { TrendingUp, TrendingDown, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { PriceTick, Candle } from '../types';

interface LivePriceBannerProps {
  currentTick: PriceTick;
  recentCandles: Candle[];
}

export const LivePriceBanner: React.FC<LivePriceBannerProps> = ({ currentTick, recentCandles }) => {
  const isUp = currentTick.change24h >= 0;

  // Build SVG path points for sparkline chart
  const sparklinePoints = React.useMemo(() => {
    if (!recentCandles.length) return '';
    const closes = recentCandles.map((c) => c.close);
    const min = Math.min(...closes);
    const max = Math.max(...closes);
    const range = max - min || 1;
    const width = 220;
    const height = 44;

    return closes
      .map((val, idx) => {
        const x = (idx / (closes.length - 1)) * width;
        const y = height - ((val - min) / range) * (height - 8) - 4;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  }, [recentCandles]);

  return (
    <div className="bg-white border-b border-slate-200 px-4 py-3 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left: Ticker Symbol & Main Price */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-wider text-slate-900 font-mono">
                  XAU/USD
                </span>
                <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded font-mono font-bold">
                  OR COMPTANT
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1 mt-0.5">
                <Activity className="w-3 h-3 text-emerald-600 animate-pulse" />
                FLUX DE MARCHÉ DIRECT (SIMULÉ)
              </span>
            </div>
          </div>

          {/* Main Price Big Display */}
          <div className="flex items-baseline gap-3">
            <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight transition-colors duration-200 text-slate-900">
              ${currentTick.price.toFixed(2)}
            </div>

            <div
              className={`flex items-center gap-1 font-mono text-xs font-bold px-2 py-1 rounded border ${
                isUp
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                  : 'bg-rose-50 border-rose-300 text-rose-700'
              }`}
            >
              {isUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              <span>{isUp ? '+' : ''}{currentTick.change24h.toFixed(2)}</span>
              <span>({isUp ? '+' : ''}{currentTick.changePercent24h.toFixed(2)}%)</span>
            </div>
          </div>
        </div>

        {/* Center: Bid/Ask & Spread + 24h Range */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs font-mono w-full md:w-auto justify-around md:justify-end">
          
          {/* Bid / Ask */}
          <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">OFFRE (BID)</div>
              <div className="text-emerald-700 font-bold font-mono">${currentTick.bid.toFixed(2)}</div>
            </div>
            <div className="h-6 w-px bg-slate-200" />
            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">DEMANDE (ASK)</div>
              <div className="text-rose-700 font-bold font-mono">${currentTick.ask.toFixed(2)}</div>
            </div>
            <div className="h-6 w-px bg-slate-200" />
            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">SPREAD</div>
              <div className="text-blue-700 font-bold font-mono">${currentTick.spread.toFixed(2)}</div>
            </div>
          </div>

          {/* 24h High / Low */}
          <div className="hidden sm:flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-600" /> HAUT 24H
              </div>
              <div className="text-slate-800 font-bold font-mono">${currentTick.high24h.toFixed(2)}</div>
            </div>
            <div className="h-6 w-px bg-slate-200" />
            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold flex items-center gap-1">
                <TrendingDown className="w-3 h-3 text-rose-600" /> BAS 24H
              </div>
              <div className="text-slate-800 font-bold font-mono">${currentTick.low24h.toFixed(2)}</div>
            </div>
          </div>

          {/* Mini Sparkline Graph */}
          <div className="hidden lg:flex flex-col items-end">
            <span className="text-[10px] font-mono text-slate-500 mb-0.5 font-medium">TENDANCE M1 (30 DERN. MIN)</span>
            <div className="w-[220px] h-[36px] bg-slate-50 rounded border border-slate-200 p-1 overflow-hidden">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 220 44">
                <defs>
                  <linearGradient id="sparklineGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={isUp ? '#059669' : '#dc2626'} stopOpacity="0.25" />
                    <stop offset="100%" stopColor={isUp ? '#059669' : '#dc2626'} stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {sparklinePoints && (
                  <>
                    <polygon
                      points={`0,44 ${sparklinePoints} 220,44`}
                      fill="url(#sparklineGrad)"
                    />
                    <polyline
                      fill="none"
                      stroke={isUp ? '#059669' : '#dc2626'}
                      strokeWidth="2"
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
