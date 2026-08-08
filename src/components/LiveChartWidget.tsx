import React, { useState } from 'react';
import { CandlestickChart, LineChart, Layers, Eye, RefreshCw } from 'lucide-react';
import { Candle, TradeSetup, PriceTick } from '../types';

interface LiveChartWidgetProps {
  candles: Candle[];
  currentTick: PriceTick;
  activeSetup: TradeSetup | null;
}

export const LiveChartWidget: React.FC<LiveChartWidgetProps> = ({
  candles,
  currentTick,
  activeSetup,
}) => {
  const [chartType, setChartType] = useState<'candle' | 'line'>('candle');
  const [selectedTimeframe, setSelectedTimeframe] = useState<'M1' | 'M5'>('M1');

  if (!candles || candles.length === 0) return null;

  // Compute min/max for scaling
  const prices = candles.flatMap((c) => [c.low, c.high]);
  if (activeSetup) {
    prices.push(activeSetup.entryPrice, activeSetup.stopLoss, activeSetup.takeProfit);
  }
  prices.push(currentTick.price);

  const minPrice = Math.min(...prices) - 0.40;
  const maxPrice = Math.max(...prices) + 0.40;
  const priceRange = maxPrice - minPrice || 1;

  const svgWidth = 720;
  const svgHeight = 280;

  // Helper function to map price value to SVG Y coordinate
  const getY = (val: number) => {
    return svgHeight - ((val - minPrice) / priceRange) * (svgHeight - 30) - 15;
  };

  const candleWidth = Math.max(4, (svgWidth / candles.length) * 0.65);

  return (
    <div className="bg-[#071426] border border-[#00E5FF]/20 rounded-[20px] p-4.5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] font-sans text-slate-100">
      
      {/* Chart Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#00E5FF]/15">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold font-mono text-[#00E5FF] flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-[#00E5FF]" /> GRAPHIQUE DIRECT XAU/USD
          </span>
          <span className="text-[10px] font-mono bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30 px-2 py-0.5 rounded font-bold">
            {selectedTimeframe} SCALPING
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Timeframe selector */}
          <div className="flex bg-[#030B16] p-0.5 rounded-lg border border-[#00E5FF]/20 text-xs font-mono font-medium">
            <button
              onClick={() => setSelectedTimeframe('M1')}
              className={`px-2 py-0.5 rounded transition-colors ${
                selectedTimeframe === 'M1' ? 'bg-[#00E5FF] text-[#030B16] font-extrabold' : 'text-slate-400 hover:text-white'
              }`}
            >
              M1
            </button>
            <button
              onClick={() => setSelectedTimeframe('M5')}
              className={`px-2 py-0.5 rounded transition-colors ${
                selectedTimeframe === 'M5' ? 'bg-[#00E5FF] text-[#030B16] font-extrabold' : 'text-slate-400 hover:text-white'
              }`}
            >
              M5
            </button>
          </div>

          {/* Chart type toggle */}
          <div className="flex bg-[#030B16] p-0.5 rounded-lg border border-[#00E5FF]/20 text-xs">
            <button
              onClick={() => setChartType('candle')}
              className={`p-1 rounded transition-colors ${
                chartType === 'candle' ? 'bg-[#00E5FF] text-[#030B16]' : 'text-slate-400'
              }`}
              title="Bougies Japonaises"
            >
              <CandlestickChart className="w-4 h-4" />
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`p-1 rounded transition-colors ${
                chartType === 'line' ? 'bg-[#00E5FF] text-[#030B16]' : 'text-slate-400'
              }`}
              title="Graphique en Ligne"
            >
              <LineChart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main SVG Canvas */}
      <div className="relative mt-3 w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-[260px] bg-[#030B16] rounded-lg border border-[#00E5FF]/20"
        >
          {/* Background Grid Lines */}
          {[0.2, 0.4, 0.6, 0.8].map((ratio, i) => {
            const y = svgHeight * ratio;
            const priceVal = maxPrice - ratio * priceRange;
            return (
              <g key={i}>
                <line
                  x1="0"
                  y1={y}
                  x2={svgWidth - 60}
                  y2={y}
                  stroke="rgba(0, 229, 255, 0.1)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x={svgWidth - 55}
                  y={y + 3}
                  fill="#94A3B8"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  ${priceVal.toFixed(2)}
                </text>
              </g>
            );
          })}

          {/* Render Candlesticks or Line */}
          {chartType === 'candle' ? (
            candles.map((c, idx) => {
              const x = (idx / candles.length) * (svgWidth - 70) + 15;
              const yOpen = getY(c.open);
              const yClose = getY(c.close);
              const yHigh = getY(c.high);
              const yLow = getY(c.low);
              const isGreen = c.close >= c.open;
              const color = isGreen ? '#22C55E' : '#EF4444';

              const topBody = Math.min(yOpen, yClose);
              const bodyHeight = Math.max(2, Math.abs(yClose - yOpen));

              return (
                <g key={idx} className="transition-opacity hover:opacity-80">
                  {/* High/Low Wick */}
                  <line
                    x1={x}
                    y1={yHigh}
                    x2={x}
                    y2={yLow}
                    stroke={color}
                    strokeWidth="1.2"
                  />
                  {/* Open/Close Body */}
                  <rect
                    x={x - candleWidth / 2}
                    y={topBody}
                    width={candleWidth}
                    height={bodyHeight}
                    fill={color}
                    rx="1"
                  />
                </g>
              );
            })
          ) : (
            <polyline
              fill="none"
              stroke="#00E5FF"
              strokeWidth="2"
              points={candles
                .map((c, idx) => {
                  const x = (idx / candles.length) * (svgWidth - 70) + 15;
                  const y = getY(c.close);
                  return `${x},${y}`;
                })
                .join(' ')}
            />
          )}

          {/* Active Setup Overlay Lines (Entry, SL, TP) */}
          {activeSetup && (
            <g>
              {/* Entry Price Line (Cyan) */}
              <line
                x1="0"
                y1={getY(activeSetup.entryPrice)}
                x2={svgWidth - 60}
                y2={getY(activeSetup.entryPrice)}
                stroke="#00E5FF"
                strokeWidth="1.5"
                strokeDasharray="5 3"
              />
              <rect
                x={svgWidth - 60}
                y={getY(activeSetup.entryPrice) - 9}
                width="58"
                height="18"
                fill="#00E5FF"
                rx="3"
              />
              <text
                x={svgWidth - 56}
                y={getY(activeSetup.entryPrice) + 3}
                fill="#030B16"
                fontSize="9"
                fontWeight="bold"
                fontFamily="monospace"
              >
                E: ${activeSetup.entryPrice.toFixed(1)}
              </text>

              {/* Stop Loss Line (Red) */}
              <line
                x1="0"
                y1={getY(activeSetup.stopLoss)}
                x2={svgWidth - 60}
                y2={getY(activeSetup.stopLoss)}
                stroke="#EF4444"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <rect
                x={svgWidth - 60}
                y={getY(activeSetup.stopLoss) - 9}
                width="58"
                height="18"
                fill="#EF4444"
                rx="3"
              />
              <text
                x={svgWidth - 56}
                y={getY(activeSetup.stopLoss) + 3}
                fill="#fff"
                fontSize="9"
                fontWeight="bold"
                fontFamily="monospace"
              >
                SL: ${activeSetup.stopLoss.toFixed(1)}
              </text>

              {/* Take Profit Line (Green) */}
              <line
                x1="0"
                y1={getY(activeSetup.takeProfit)}
                x2={svgWidth - 60}
                y2={getY(activeSetup.takeProfit)}
                stroke="#22C55E"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <rect
                x={svgWidth - 60}
                y={getY(activeSetup.takeProfit) - 9}
                width="58"
                height="18"
                fill="#22C55E"
                rx="3"
              />
              <text
                x={svgWidth - 56}
                y={getY(activeSetup.takeProfit) + 3}
                fill="#fff"
                fontSize="9"
                fontWeight="bold"
                fontFamily="monospace"
              >
                TP: ${activeSetup.takeProfit.toFixed(1)}
              </text>
            </g>
          )}

          {/* Current Live Tick Price Line */}
          <line
            x1="0"
            y1={getY(currentTick.price)}
            x2={svgWidth - 60}
            y2={getY(currentTick.price)}
            stroke="#00E5FF"
            strokeWidth="1.2"
          />
          <circle
            cx={svgWidth - 60}
            cy={getY(currentTick.price)}
            r="3.5"
            fill="#00E5FF"
            className="animate-ping"
          />
        </svg>
      </div>

      {/* Footer Legend */}
      <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 mt-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 font-medium">
            <span className="w-2.5 h-0.5 bg-[#00E5FF] inline-block" /> Entrée Trade
          </span>
          <span className="flex items-center gap-1 font-medium">
            <span className="w-2.5 h-0.5 bg-[#22C55E] inline-block" /> Take Profit (TP)
          </span>
          <span className="flex items-center gap-1 font-medium">
            <span className="w-2.5 h-0.5 bg-[#EF4444] inline-block" /> Stop Loss (SL)
          </span>
        </div>
        <span className="font-medium text-slate-400">Support / Résistance automatique ICT</span>
      </div>

    </div>
  );
};
