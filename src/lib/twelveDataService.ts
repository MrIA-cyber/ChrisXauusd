import { Candle } from '../types';

export interface TwelveDataQuoteResponse {
  price: number;
  high24h: number;
  low24h: number;
  change24h: number;
  changePercent24h: number;
  isLive: boolean;
  message?: string;
}

/**
 * Récupère la cotation en temps réel pour XAU/USD via le backend proxy sécurisé
 */
export async function fetchLiveXauUsdQuote(): Promise<TwelveDataQuoteResponse | null> {
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
    console.warn('Backend endpoint /api/price/xauusd non disponible:', err);
  }

  return null;
}

/**
 * Récupère l'historique des bougies (OHLC) via le backend proxy sécurisé
 */
export async function fetchTwelveDataCandles(pair = 'XAU/USD', interval = '15min'): Promise<Candle[]> {
  try {
    const url = `/api/forex/candles?pair=${encodeURIComponent(pair)}&interval=${encodeURIComponent(interval)}`;
    const apiRes = await fetch(url);
    if (apiRes.ok) {
      const payload = await apiRes.json();
      if (payload && payload.success && Array.isArray(payload.candles)) {
        return payload.candles;
      }
    }
  } catch (err) {
    console.warn('Backend endpoint /api/forex/candles non disponible:', err);
  }

  return [];
}
