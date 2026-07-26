import { TradeSetup, TradeStatus, TradeType, Candle, PriceTick, MarketSession, DailyStats } from '../types';

// Helper to format currency
export function formatPrice(price: number): string {
  return price.toFixed(2);
}

export function formatPips(pips: number): string {
  const sign = pips > 0 ? '+' : '';
  return `${sign}${pips.toFixed(1)} pips`;
}

// Generate realistic technical confluences for XAU/USD
const BUY_CONFLUENCES = [
  "Cassure de structure M1 + Rejet Order Block à $[PRICE]",
  "Sweeping de liquidité Sell-side + RSI en survente (27)",
  "Rebond précis sur EMA 20/50 + Divergence haussière M5",
  "Validation Fair Value Gap (FVG) + Pression acheteuse vWAP",
  "Rejet du niveau psychologique $[PRICE] avec mèche basse",
  "Re-test support clé Londres + Modèle de retournement ICT",
];

const SELL_CONFLUENCES = [
  "Rejet résistant sur la zone de liquidité Buy-side à $[PRICE]",
  "Cassure oblique baissière M1 + Imbalance baissière (FVG)",
  "Rejet EMA 200 M5 + RSI en surachat (74)",
  "Absorption acheteuse + Structure M1 sous le vWAP",
  "Rejet niveau haut de session + Divergence baissière MACD",
  "Sweeping des plus hauts récents + Signal de rejet Order Block",
];

let ticketCounter = 8040;

export function createNewTradeSetup(
  currentPrice: number,
  forceType?: TradeType
): TradeSetup {
  ticketCounter += 1;
  const isBuy = forceType ? forceType === 'BUY' : Math.random() > 0.48; // Slightly balanced
  
  // Gold pricing: 1 pip = $0.10 ($1 = 10 pips)
  // Scalping SL: 15 to 28 pips ($1.50 to $2.80)
  const slPips = Math.floor(Math.random() * 14) + 15; // 15 - 28 pips
  const slOffset = slPips * 0.10;
  
  // Risk / Reward Ratio: Minimum 1:1.5, up to 1:3.2
  const rrRatio = Number((1.5 + Math.random() * 1.7).toFixed(2));
  const tpPips = Math.round(slPips * rrRatio);
  const tpOffset = tpPips * 0.10;

  let entryPrice = Number(currentPrice.toFixed(2));
  let stopLoss: number;
  let takeProfit: number;
  let takeProfit2: number;

  if (isBuy) {
    stopLoss = Number((entryPrice - slOffset).toFixed(2));
    takeProfit = Number((entryPrice + tpOffset).toFixed(2));
    takeProfit2 = Number((entryPrice + tpOffset * 1.5).toFixed(2));
  } else {
    stopLoss = Number((entryPrice + slOffset).toFixed(2));
    takeProfit = Number((entryPrice - tpOffset).toFixed(2));
    takeProfit2 = Number((entryPrice - tpOffset * 1.5).toFixed(2));
  }

  const confluenceTemplates = isBuy ? BUY_CONFLUENCES : SELL_CONFLUENCES;
  const selectedConfluences = [
    confluenceTemplates[Math.floor(Math.random() * confluenceTemplates.length)].replace('[PRICE]', entryPrice.toFixed(2)),
    confluenceTemplates[Math.floor(Math.random() * confluenceTemplates.length)].replace('[PRICE]', stopLoss.toFixed(2)),
  ];

  const now = new Date();
  const timeStr = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return {
    id: `setup-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    ticketNumber: `#XAU-${ticketCounter}`,
    timestamp: timeStr,
    type: isBuy ? 'BUY' : 'SELL',
    timeframe: Math.random() > 0.3 ? 'M1' : 'M5',
    entryPrice,
    stopLoss,
    takeProfit,
    takeProfit2,
    rrRatio,
    riskPips: slPips,
    rewardPips: tpPips,
    status: 'ACTIVE',
    confluence: selectedConfluences,
    entryReason: isBuy ? 'Scalp Long sur niveau de liquidité' : 'Scalp Short sur rejet de résistance',
  };
}

// Generate initial historical trades for a realistic terminal experience
export function generateInitialHistory(basePrice: number): TradeSetup[] {
  const initialSetups: TradeSetup[] = [];
  const count = 12; // 12 trades earlier today
  
  let price = basePrice - 8.50; // Previous price area

  for (let i = count; i >= 1; i--) {
    ticketCounter += 1;
    const isBuy = Math.random() > 0.45;
    const slPips = Math.floor(Math.random() * 12) + 16;
    const rrRatio = Number((1.5 + Math.random() * 1.5).toFixed(2));
    const tpPips = Math.round(slPips * rrRatio);

    const entryPrice = Number((price + (Math.random() * 2 - 1)).toFixed(2));
    let stopLoss: number;
    let takeProfit: number;

    if (isBuy) {
      stopLoss = Number((entryPrice - slPips * 0.10).toFixed(2));
      takeProfit = Number((entryPrice + tpPips * 0.10).toFixed(2));
    } else {
      stopLoss = Number((entryPrice + slPips * 0.10).toFixed(2));
      takeProfit = Number((entryPrice - tpPips * 0.10).toFixed(2));
    }

    // Historical status: 70% won, 30% lost (realistic successful scalping strategy)
    const isWin = Math.random() < 0.72;
    const status: TradeStatus = isWin ? 'TP_HIT' : 'SL_HIT';
    const pnlPips = isWin ? tpPips : -slPips;
    const pnlAmount = pnlPips * 10; // $10 per pip on 1 standard lot

    const now = new Date(Date.now() - i * 18 * 60 * 1000); // spread over hours
    const timeStr = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    const confluenceTemplates = isBuy ? BUY_CONFLUENCES : SELL_CONFLUENCES;

    initialSetups.push({
      id: `setup-hist-${i}`,
      ticketNumber: `#XAU-${8000 + i}`,
      timestamp: timeStr,
      type: isBuy ? 'BUY' : 'SELL',
      timeframe: 'M1',
      entryPrice,
      stopLoss,
      takeProfit,
      rrRatio,
      riskPips: slPips,
      rewardPips: tpPips,
      status,
      confluence: [
        confluenceTemplates[0].replace('[PRICE]', entryPrice.toFixed(2)),
        "Validation du momentum scalping"
      ],
      closedAt: new Date(now.getTime() + 12 * 60 * 1000).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      closedPrice: isWin ? takeProfit : stopLoss,
      pnlPips,
      pnlAmount,
      entryReason: isBuy ? 'Rebond Order Block' : 'Cassure vWAP',
    });
  }

  return initialSetups.reverse(); // Newest first
}

// Calculate Market Sessions
export function getMarketSessions(): MarketSession[] {
  const now = new Date();
  const utcHours = now.getUTCHours();

  return [
    {
      name: 'Sydney',
      city: 'Sydney',
      status: utcHours >= 22 || utcHours < 7 ? 'OPEN' : 'CLOSED',
      openTimeGmt: '22:00',
      closeTimeGmt: '07:00',
      isActiveNow: utcHours >= 22 || utcHours < 7,
    },
    {
      name: 'Tokyo',
      city: 'Tokyo',
      status: utcHours >= 0 && utcHours < 9 ? 'OPEN' : 'CLOSED',
      openTimeGmt: '00:00',
      closeTimeGmt: '09:00',
      isActiveNow: utcHours >= 0 && utcHours < 9,
    },
    {
      name: 'Londres',
      city: 'London',
      status: utcHours >= 8 && utcHours < 17 ? 'OPEN' : 'CLOSED',
      openTimeGmt: '08:00',
      closeTimeGmt: '17:00',
      isActiveNow: utcHours >= 8 && utcHours < 17,
    },
    {
      name: 'New York',
      city: 'New York',
      status: utcHours >= 13 && utcHours < 22 ? 'OPEN' : 'CLOSED',
      openTimeGmt: '13:00',
      closeTimeGmt: '22:00',
      isActiveNow: utcHours >= 13 && utcHours < 22,
    },
  ];
}

// Generate initial candles for M1 chart view
export function generateInitialCandles(currentPrice: number, count = 30): Candle[] {
  const candles: Candle[] = [];
  let price = currentPrice - 3.20;

  for (let i = count; i >= 0; i--) {
    const time = new Date(Date.now() - i * 60 * 1000).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    const open = price;
    const change = (Math.random() - 0.48) * 0.90; // slight upward drift
    const close = Number((open + change).toFixed(2));
    const high = Number((Math.max(open, close) + Math.random() * 0.45).toFixed(2));
    const low = Number((Math.min(open, close) - Math.random() * 0.45).toFixed(2));
    const volume = Math.floor(120 + Math.random() * 450);

    candles.push({
      time,
      open,
      high,
      low,
      close,
      volume,
      isGreen: close >= open,
    });

    price = close;
  }

  return candles;
}

// Calculate daily stats from trade history
export function calculateDailyStats(trades: TradeSetup[]): DailyStats {
  const totalSetups = trades.length;
  const winners = trades.filter((t) => t.status === 'TP_HIT').length;
  const losers = trades.filter((t) => t.status === 'SL_HIT').length;
  const active = trades.filter((t) => t.status === 'ACTIVE').length;

  const closedTrades = trades.filter((t) => t.status !== 'ACTIVE');
  const winRate = closedTrades.length > 0 ? Number(((winners / closedTrades.length) * 100).toFixed(1)) : 0;

  const totalPips = trades.reduce((sum, t) => sum + (t.pnlPips || 0), 0);

  const winningPips = trades
    .filter((t) => t.status === 'TP_HIT')
    .reduce((sum, t) => sum + (t.pnlPips || 0), 0);
  
  const losingPips = Math.abs(
    trades
      .filter((t) => t.status === 'SL_HIT')
      .reduce((sum, t) => sum + (t.pnlPips || 0), 0)
  );

  const profitFactor = losingPips > 0 ? Number((winningPips / losingPips).toFixed(2)) : winningPips > 0 ? 3.5 : 0;

  const avgRR = trades.length > 0
    ? Number((trades.reduce((sum, t) => sum + t.rrRatio, 0) / trades.length).toFixed(2))
    : 1.8;

  return {
    totalSetups,
    winners,
    losers,
    active,
    winRate,
    totalPips: Number(totalPips.toFixed(1)),
    profitFactor,
    avgRR,
  };
}
