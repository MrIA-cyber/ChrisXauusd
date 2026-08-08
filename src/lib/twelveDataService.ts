import { PriceTick } from '../types';

const TWELVE_DATA_API_KEY =
  ((import.meta as unknown as { env: Record<string, string> }).env?.VITE_TWELVE_DATA_API_KEY as string) ||
  'b7a3a115daf84f289e283ef25041cee4';

export interface TwelveDataQuote {
  symbol: string;
  name: string;
  currency: string;
  exchange: string;
  mic_code: string;
  datetime: string;
  timestamp: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  previous_close: string;
  change: string;
  percent_change: string;
  average_volume: string;
  is_market_open: boolean;
  fifty_two_week?: {
    low: string;
    high: string;
  };
  status?: string;
  message?: string;
}

/**
 * Fetch real-time XAU/USD quote from Twelve Data
 */
export async function fetchLiveXauUsdQuote(apiKey?: string): Promise<{
  price: number;
  high24h: number;
  low24h: number;
  change24h: number;
  changePercent24h: number;
  isLive: boolean;
  message?: string;
} | null> {
  // First attempt backend API proxy endpoint to prevent CORS & client-side rate limits
  try {
    const apiRes = await fetch('/api/price/xauusd');
    if (apiRes.ok) {
      const payload = await apiRes.json();
      if (payload && payload.data && payload.data.price) {
        return {
          price: payload.data.price,
          high24h: payload.data.high24h,
          low24h: payload.data.low24h,
          change24h: payload.data.change24h,
          changePercent24h: payload.data.changePercent24h,
          isLive: !!payload.isLive,
        };
      }
    }
  } catch (err) {
    // Silent fallback to direct fetch
  }

  const key = apiKey || TWELVE_DATA_API_KEY;
  if (!key) return null;

  try {
    const url = `https://api.twelvedata.com/quote?symbol=XAU/USD&apikey=${key}`;
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`Twelve Data HTTP error ${response.status}`);
      return null;
    }

    const data: TwelveDataQuote = await response.json();

    if (data.status === 'error' || data.message) {
      console.warn('Twelve Data API response warning/error:', data.message);
      return null;
    }

    const price = parseFloat(data.close || data.open);
    if (isNaN(price) || price <= 0) {
      return null;
    }

    const high24h = parseFloat(data.high) || price + 5.0;
    const low24h = parseFloat(data.low) || price - 5.0;
    const change24h = parseFloat(data.change) || 0;
    const changePercent24h = parseFloat(data.percent_change) || 0;

    return {
      price,
      high24h,
      low24h,
      change24h,
      changePercent24h,
      isLive: true,
    };
  } catch (err) {
    console.warn('Twelve Data direct client fetch unavailable, using live tick engine:', err);
    return null;
  }
}
