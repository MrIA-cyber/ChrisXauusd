import {
  TradeSetup,
  TradeStatus,
  TradeType,
  Candle,
  PriceTick,
  MarketSession,
  DailyStats,
  ConfluenceFactor,
  SetupGrade,
  GradeStats,
} from '../types';

// Helper to format currency
export function formatPrice(price: number): string {
  return price.toFixed(2);
}

export function formatPips(pips: number): string {
  const sign = pips > 0 ? '+' : '';
  return `${sign}${pips.toFixed(1)} pips`;
}

let ticketCounter = 8040;

/**
 * Multi-Factor Confluence Evaluator (5 Core Factors):
 * 1. Market Structure (BOS / CHoCH M5/M15)
 * 2. Liquidity Zone / Order Block / Fibonacci (61.8% - 78.6%)
 * 3. Momentum Confirmation (RSI / MACD divergence)
 * 4. Session & Macro Filter (London/NY high-vol, news blackout check)
 * 5. Multi-Timeframe Alignment (H1/H4 trend cohesion)
 */
export function buildConfluenceSet(isBuy: boolean, entryPrice: number): {
  factors: ConfluenceFactor[];
  score: number; // 3, 4, or 5
  grade: SetupGrade; // 'A+' | 'A' | 'B'
  confluenceStrings: string[];
} {
  // Determine target score weighted toward high confluence (minimum 3/5 criteria required)
  const rand = Math.random();
  let targetScore = 5; // Setup A+ (5/5)
  if (rand > 0.52 && rand <= 0.85) {
    targetScore = 4; // Setup A (4/5)
  } else if (rand > 0.85) {
    targetScore = 3; // Setup B (3/5)
  }

  // 1. Structure de marché (BOS / CHoCH M5/M15)
  const factorStructure: ConfluenceFactor = {
    id: 'STRUCTURE',
    name: 'Structure de marché (BOS/CHoCH M5)',
    met: true, // Primary structural requirement
    details: isBuy
      ? `Cassure haussière (BOS M5) + CHoCH M15 confirmé à $${entryPrice.toFixed(2)}`
      : `Cassure baissière (BOS M5) + CHoCH M15 confirmé à $${entryPrice.toFixed(2)}`,
  };

  // 2. Zone de liquidité / Order Block
  const factorZone: ConfluenceFactor = {
    id: 'ZONE',
    name: 'Zone d\'intérêt (Order Block & Fibo 61.8%)',
    met: true, // Primary zone requirement
    details: isBuy
      ? `Rejet Order Block acheteur à $${entryPrice.toFixed(2)} + FVG M5 comblé`
      : `Rejet Order Block vendeur à $${entryPrice.toFixed(2)} + Sweeping liquidité Buy-side`,
  };

  // 3. Momentum de confirmation (RSI / MACD)
  const factorMomentum: ConfluenceFactor = {
    id: 'MOMENTUM',
    name: 'Momentum de confirmation (RSI/MACD)',
    met: targetScore >= 4,
    details: isBuy
      ? 'Divergence haussière RSI (28) + Croisement haussier MACD M5'
      : 'Divergence baissière RSI (74) + Pression vendeuse MACD M5',
  };

  // 4. Contexte de session & Filtre Macro
  const factorSession: ConfluenceFactor = {
    id: 'SESSION',
    name: 'Contexte de session & Filtre Macro',
    met: targetScore === 5 || (targetScore === 3 && Math.random() > 0.5),
    details: 'Session haute liquidité (Londres/NY Open) — Aucun impact news NFP/CPI imminent',
  };

  // 5. Alignement Multi-Timeframe (H1/H4)
  const factorMTF: ConfluenceFactor = {
    id: 'MTF',
    name: 'Alignement Multi-Timeframe (H1/H4)',
    met: targetScore === 5 || (targetScore === 4 && !factorSession.met) || (targetScore === 3 && !factorSession.met),
    details: isBuy
      ? 'Tendance majeure H1/H4 haussière alignée au scalp M1/M5'
      : 'Tendance majeure H1/H4 baissière alignée au scalp M1/M5',
  };

  const factors = [factorStructure, factorZone, factorMomentum, factorSession, factorMTF];
  const actualScore = factors.filter((f) => f.met).length;

  let grade: SetupGrade = 'A+';
  if (actualScore === 4) grade = 'A';
  else if (actualScore <= 3) grade = 'B';

  const confluenceStrings = factors.filter((f) => f.met).map((f) => f.details);

  return {
    factors,
    score: actualScore,
    grade,
    confluenceStrings,
  };
}

export function createNewTradeSetup(
  currentPrice: number,
  forceType?: TradeType
): TradeSetup {
  ticketCounter += 1;
  const isBuy = forceType ? forceType === 'BUY' : Math.random() > 0.48;
  
  // Gold pricing: 1 pip = $0.10 ($1 = 10 pips)
  // Scalping SL: 15 to 28 pips ($1.50 to $2.80)
  const slPips = Math.floor(Math.random() * 14) + 15;
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

  // Generate Confluence Factors and Setup Quality Grade
  const { factors, score, grade, confluenceStrings } = buildConfluenceSet(isBuy, entryPrice);

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
    confluence: confluenceStrings,
    confluenceFactors: factors,
    grade,
    score,
    entryReason: isBuy
      ? `Scalp Long Confluence (${grade} - ${score}/5)`
      : `Scalp Short Confluence (${grade} - ${score}/5)`,
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

    const { factors, score, grade, confluenceStrings } = buildConfluenceSet(isBuy, entryPrice);

    // Realistic historical performance correlation:
    // Grade A+: ~85% win rate
    // Grade A:  ~72% win rate
    // Grade B:  ~58% win rate
    let winProb = 0.72;
    if (grade === 'A+') winProb = 0.85;
    else if (grade === 'B') winProb = 0.58;

    const isWin = Math.random() < winProb;
    const status: TradeStatus = isWin ? 'TP_HIT' : 'SL_HIT';
    const pnlPips = isWin ? tpPips : -slPips;
    const pnlAmount = pnlPips * 10; // $10 per pip on 1 standard lot

    const now = new Date(Date.now() - i * 18 * 60 * 1000); // spread over hours
    const timeStr = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

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
      confluence: confluenceStrings,
      confluenceFactors: factors,
      grade,
      score,
      closedAt: new Date(now.getTime() + 12 * 60 * 1000).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      closedPrice: isWin ? takeProfit : stopLoss,
      pnlPips,
      pnlAmount,
      entryReason: isBuy ? `Scalp Long (${grade} - ${score}/5)` : `Scalp Short (${grade} - ${score}/5)`,
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

function calculateGradeStats(trades: TradeSetup[], targetGrade: SetupGrade): GradeStats {
  const filtered = trades.filter((t) => t.grade === targetGrade);
  const total = filtered.length;
  const winners = filtered.filter((t) => t.status === 'TP_HIT').length;
  const losers = filtered.filter((t) => t.status === 'SL_HIT').length;
  const closed = winners + losers;
  const winRate = closed > 0 ? Number(((winners / closed) * 100).toFixed(1)) : 0;
  const pips = filtered.reduce((sum, t) => sum + (t.pnlPips || 0), 0);

  return {
    grade: targetGrade,
    total,
    winners,
    losers,
    winRate,
    pips: Number(pips.toFixed(1)),
  };
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
    byGrade: {
      A_PLUS: calculateGradeStats(trades, 'A+'),
      A: calculateGradeStats(trades, 'A'),
      B: calculateGradeStats(trades, 'B'),
    },
  };
}
