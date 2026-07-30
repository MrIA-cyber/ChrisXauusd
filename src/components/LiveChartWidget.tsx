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
    <div className="bg-white border border-slate-200/80 rounded-[20px] p-4.5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] font-sans">
      
      {/* Chart Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold font-mono text-blue-900 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-blue-600" /> GRAPHIQUE DIRECT XAU/USD
          </span>
          <span className="text-[10px] font-mono bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded font-bold">
            {selectedTimeframe} SCALPING
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Timeframe selector */}
          <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-mono font-medium">
            <button
              onClick={() => setSelectedTimeframe('M1')}
              className={`px-2 py-0.5 rounded transition-colors ${
                selectedTimeframe === 'M1' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              M1
            </button>
            <button
              onClick={() => setSelectedTimeframe('M5')}
              className={`px-2 py-0.5 rounded transition-colors ${
                selectedTimeframe === 'M5' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              M5
            </button>
          </div>

          {/* Chart type toggle */}
          <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setChartType('candle')}
              className={`p-1 rounded transition-colors ${
                chartType === 'candle' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-500'
              }`}
              title="Bougies Japonaises"
            >
              <CandlestickChart className="w-4 h-4" />
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`p-1 rounded transition-colors ${
                chartType === 'line' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-500'
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
          className="w-full h-[260px] bg-slate-50 rounded-lg border border-slate-200"
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
                  stroke="#e2e8f0"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x={svgWidth - 55}
                  y={y + 3}
                  fill="#64748b"
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
              const color = isGreen ? '#059669' : '#dc2626';

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
              stroke="#2563eb"
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
              {/* Entry Price Line (Blue) */}
              <line
                x1="0"
                y1={getY(activeSetup.entryPrice)}
                x2={svgWidth - 60}
                y2={getY(activeSetup.entryPrice)}
                stroke="#2563eb"
                strokeWidth="1.5"
                strokeDasharray="5 3"
              />
              <rect
                x={svgWidth - 60}
                y={getY(activeSetup.entryPrice) - 9}
                width="58"
                height="18"
                fill="#2563eb"
                rx="3"
              />
              <text
                x={svgWidth - 56}
                y={getY(activeSetup.entryPrice) + 3}
                fill="#fff"
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
                stroke="#dc2626"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <rect
                x={svgWidth - 60}
                y={getY(activeSetup.stopLoss) - 9}
                width="58"
                height="18"
                fill="#dc2626"
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
                stroke="#059669"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <rect
                x={svgWidth - 60}
                y={getY(activeSetup.takeProfit) - 9}
                width="58"
                height="18"
                fill="#059669"
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
            stroke="#0284c7"
            strokeWidth="1.2"
          />
          <circle
            cx={svgWidth - 60}
            cy={getY(currentTick.price)}
            r="3"
            fill="#0284c7"
            className="animate-ping"
          />
        </svg>
      </div>

      {/* Footer Legend */}
      <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-500 mt-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 font-medium">
            <span className="w-2.5 h-0.5 bg-blue-600 inline-block" /> Entrée Trade
          </span>
          <span className="flex items-center gap-1 font-medium">
            <span className="w-2.5 h-0.5 bg-emerald-600 inline-block" /> Take Profit (TP)
          </span>
          <span className="flex items-center gap-1 font-medium">
            <span className="w-2.5 h-0.5 bg-rose-600 inline-block" /> Stop Loss (SL)
          </span>
        </div>
        <span className="font-medium">Support / Résistance automatique ICT</span>
      </div>

    </div>
  );
};
