export type TradeType = 'BUY' | 'SELL';

export type TradeStatus = 'ACTIVE' | 'TP_HIT' | 'SL_HIT';

export type SetupGrade = 'A+' | 'A' | 'B';

export type ConfluenceFactorCategory = 'STRUCTURE' | 'ZONE' | 'MOMENTUM' | 'SESSION' | 'MTF';

export interface ConfluenceFactor {
  id: ConfluenceFactorCategory;
  name: string;
  met: boolean;
  details: string;
}

export interface TradeSetup {
  id: string;
  ticketNumber: string;
  timestamp: string; // ISO string or formatted HH:mm:ss
  type: TradeType;
  timeframe: 'M1' | 'M5' | 'M15';
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  takeProfit2?: number;
  rrRatio: number; // e.g. 1.85
  riskPips: number;
  rewardPips: number;
  status: TradeStatus;
  confluence: string[];
  confluenceFactors: ConfluenceFactor[];
  grade: SetupGrade;
  score: number; // 3, 4, or 5 out of 5
  convictionRate: number; // e.g. 82 (% conviction)
  notes?: string;
  closedAt?: string;
  closedPrice?: number;
  pnlPips?: number;
  pnlAmount?: number; // e.g., +$180 or -$100 based on standard lot
  entryReason: string;
}

export interface PriceTick {
  timestamp: number;
  price: number;
  bid: number;
  ask: number;
  spread: number;
  high24h: number;
  low24h: number;
  change24h: number;
  changePercent24h: number;
}

export interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  isGreen: boolean;
}

export interface MarketSession {
  name: string;
  city: string;
  status: 'OPEN' | 'CLOSED';
  openTimeGmt: string; // e.g. "08:00"
  closeTimeGmt: string; // e.g. "17:00"
  isActiveNow: boolean;
}

export interface GradeStats {
  grade: SetupGrade;
  total: number;
  winners: number;
  losers: number;
  winRate: number;
  pips: number;
}

export interface DailyStats {
  totalSetups: number;
  winners: number;
  losers: number;
  active: number;
  winRate: number; // e.g. 71.4%
  totalPips: number; // e.g. +142.5 pips
  profitFactor: number; // e.g. 2.45
  avgRR: number; // e.g. 1:2.1
  byGrade: {
    A_PLUS: GradeStats;
    A: GradeStats;
    B: GradeStats;
  };
}

export interface RiskCalculatorParams {
  accountBalance: number;
  riskPercentage: number;
  stopLossPips: number;
  contractSize: number; // Default 100 oz per lot for XAU/USD
}

// Subscription & Auth Types
export type SubscriptionStatus = 'VISITOR' | 'ACTIVE' | 'EXPIRING_SOON' | 'EXPIRED' | 'PENDING_VERIFICATION';

export interface UserSubscription {
  status: SubscriptionStatus;
  startDate: string | null; // ISO string
  expirationDate: string | null; // ISO string
  daysRemaining: number;
  paymentMethod?: string;
  amountFcfa: number; // Default 700 000
}

export interface AuthUser {
  id: string;
  email: string;
  phone?: string;
  name: string;
  avatarUrl?: string;
  subscription: UserSubscription;
  // VIP Trader Preferences & Customizations
  traderLevel?: 'DEBUTANT' | 'INTERMEDIAIRE' | 'SCALPER_PRO' | 'MASTER_TRADER';
  tradingAccountBalance?: number;
  preferredCurrency?: 'USD' | 'EUR' | 'FCFA' | 'NGN' | 'GBP';
  preferredRiskPercentage?: number;
  tradingStyle?: 'SCALPING_M1_M5' | 'DAY_TRADING' | 'SWING_TRADING' | 'BREAKOUT';
  telegramUsername?: string;
  tradingPlatform?: 'MT4' | 'MT5' | 'TRADINGVIEW' | 'CTRADER';
  privacyMode?: boolean;
}

// News & Education Types
export type NewsCategory = 'MACRO' | 'SCALPING_GUIDE' | 'STORIES' | 'ANALYSIS';

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: NewsCategory;
  categoryLabel: string;
  date: string;
  readTime: string;
  imageUrl?: string;
  author: string;
  tags: string[];
}

