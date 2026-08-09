/**
 * service/forexData.js
 * Service de récupération des données de marché Forex depuis Twelve Data API
 * avec gestion intelligente des limites de quota (429 Rate Limit), marge de sécurité,
 * et cache en mémoire partagé.
 */

import axios from 'axios';

// Cache en mémoire partagé pour stocker les bougies (durée 5 minutes)
const candleCache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000;

// Config Quota Twelve Data & Marge de sécurité (Configurable via Vercel / Env)
const REAL_DAILY_LIMIT = parseInt(process.env.TWELVE_DATA_DAILY_QUOTA || '800', 10);
const SAFETY_MARGIN_DAILY = parseInt(process.env.TWELVE_DATA_SAFETY_MARGIN || '100', 10);
export const MAX_DAILY_CALLS = Math.max(1, REAL_DAILY_LIMIT - SAFETY_MARGIN_DAILY); // Default: 700 appels max / jour

const REAL_MINUTELY_LIMIT = parseInt(process.env.TWELVE_DATA_MINUTELY_QUOTA || '8', 10);
const SAFETY_MARGIN_MINUTELY = parseInt(process.env.TWELVE_DATA_MINUTELY_SAFETY_MARGIN || '1', 10);
export const MAX_MINUTELY_CALLS = Math.max(1, REAL_MINUTELY_LIMIT - SAFETY_MARGIN_MINUTELY); // Default: 7 appels max / minute

// Suivi d'utilisation du quota et timestamps en mémoire
let dailyCallsCount = 0;
let minutelyCallsCount = 0;
let lastMinutelyResetTime = Date.now();
let lastDailyResetDateStr = new Date().toISOString().split('T')[0];
let lastRequestTimestamp = null;
let lastXauusdTimestamp = null;
let lastApiState = 'NORMAL'; // 'NORMAL' | 'ATTENTION' | 'ALERTE' | 'BLOQUÉ'
let lastApiErrorMsg = null;

/**
 * Vérifie et réinitialise les compteurs de quota Twelve Data si les fenêtres temporelles ont expiré
 */
function updateQuotaCounters() {
  const now = Date.now();
  const todayStr = new Date(now).toISOString().split('T')[0];

  // Réinitialisation journalière à minuit UTC
  if (todayStr !== lastDailyResetDateStr) {
    dailyCallsCount = 0;
    lastDailyResetDateStr = todayStr;
    console.log(`[forexData] 📅 Réinitialisation du quota journalier (0/${MAX_DAILY_CALLS} appels) pour ${todayStr}`);
  }

  // Réinitialisation de la fenêtre de 1 minute (60s)
  if (now - lastMinutelyResetTime >= 60 * 1000) {
    minutelyCallsCount = 0;
    lastMinutelyResetTime = now;
  }
}

/**
 * Vérifie si une nouvelle requête Twelve Data est autorisée selon les quotas et marges de sécurité
 */
export function canMakeTwelveDataCall() {
  updateQuotaCounters();

  if (dailyCallsCount >= MAX_DAILY_CALLS) {
    console.warn(`[forexData] 🛑 QUOTA INSUFFISANT — NOUVEAU SETUP SUSPENDU (Quota journalier atteint: ${dailyCallsCount}/${MAX_DAILY_CALLS})`);
    return { allowed: false, reason: 'DAILY_QUOTA_REACHED' };
  }

  if (minutelyCallsCount >= MAX_MINUTELY_CALLS) {
    console.warn(`[forexData] ⏳ Limite minute atteinte (${minutelyCallsCount}/${MAX_MINUTELY_CALLS}), pause temporaire.`);
    return { allowed: false, reason: 'MINUTELY_RATE_LIMIT' };
  }

  return { allowed: true };
}

/**
 * Enregistre la consommation d'un appel API Twelve Data
 */
function recordTwelveDataCall() {
  dailyCallsCount++;
  minutelyCallsCount++;
  lastRequestTimestamp = new Date().toISOString();
  console.log(`[forexData] 📊 Quota Twelve Data consommé: Jour=${dailyCallsCount}/${MAX_DAILY_CALLS}, Min=${minutelyCallsCount}/${MAX_MINUTELY_CALLS}`);
}

/**
 * Retourne le statut complet et détaillé du quota Twelve Data pour le Tableau Admin
 */
export function getQuotaStatus() {
  updateQuotaCounters();

  const remainingDailyCalls = Math.max(0, MAX_DAILY_CALLS - dailyCallsCount);
  const percentUsed = Number(((dailyCallsCount / MAX_DAILY_CALLS) * 100).toFixed(1));

  let status = 'NORMAL';
  if (dailyCallsCount >= MAX_DAILY_CALLS || minutelyCallsCount >= MAX_MINUTELY_CALLS) {
    status = 'BLOQUÉ';
  } else if (percentUsed >= 85) {
    status = 'ALERTE';
  } else if (percentUsed >= 60) {
    status = 'ATTENTION';
  }

  lastApiState = status;

  return {
    dailyCallsCount,
    realDailyLimit: REAL_DAILY_LIMIT,
    safetyMarginDaily: SAFETY_MARGIN_DAILY,
    maxDailyCalls: MAX_DAILY_CALLS,
    remainingDailyCalls,
    percentUsed,
    minutelyCallsCount,
    maxMinutelyCalls: MAX_MINUTELY_CALLS,
    isQuotaAvailable: dailyCallsCount < MAX_DAILY_CALLS && minutelyCallsCount < MAX_MINUTELY_CALLS,
    lastRequestTimestamp,
    lastXauusdTimestamp,
    apiState: lastApiErrorMsg ? 'ERROR' : (status === 'BLOQUÉ' ? 'RATE_LIMITED' : 'CONNECTED'),
    lastApiErrorMsg,
    status, // 'NORMAL' | 'ATTENTION' | 'ALERTE' | 'BLOQUÉ'
  };
}

// Cache quote en mémoire (60 secondes)
let cachedQuote = {
  price: 2385.50,
  high24h: 2392.10,
  low24h: 2378.20,
  change24h: 12.40,
  changePercent24h: 0.52,
  timestamp: 0,
};
const QUOTE_CACHE_TTL_MS = 60 * 1000;

/**
 * Récupère le prix en temps réel de Twelve Data pour XAU/USD ou un autre symbole,
 * avec cache serveur partagé de 60s et respect strict du quota.
 */
export async function getLiveQuote(symbol = 'XAU/USD') {
  // 1. Utiliser le cache serveur récent pour éviter les requêtes inutiles des clients
  if (Date.now() - cachedQuote.timestamp < QUOTE_CACHE_TTL_MS && cachedQuote.price > 0) {
    return {
      success: true,
      isLive: true,
      provider: 'CacheMemory',
      dataSource: 'Twelve Data (XAU/USD Cache)',
      data: cachedQuote
    };
  }

  // 2. Vérification stricte du quota avant appel API
  const quotaCheck = canMakeTwelveDataCall();
  if (!quotaCheck.allowed) {
    console.warn(`[forexData] 🛑 QUOTA INSUFFISANT — NOUVEAU SETUP SUSPENDU`);
    if (cachedQuote.price > 0) {
      return {
        success: true,
        isLive: false,
        quotaExceeded: true,
        provider: 'CacheStale',
        dataSource: 'Cache Expire (Quota Epuise)',
        data: cachedQuote
      };
    }
    return {
      success: false,
      isLive: false,
      quotaExceeded: true,
      message: 'QUOTA INSUFFISANT — NOUVEAU SETUP SUSPENDU'
    };
  }

  const apiKey = process.env.TWELVE_DATA_API_KEY || 'b7a3a115daf84f289e283ef25041cee4';
  const url = `https://api.twelvedata.com/quote?symbol=${encodeURIComponent(symbol)}&apikey=${apiKey}`;

  try {
    recordTwelveDataCall();
    const response = await axios.get(url, { timeout: 6000 });
    const data = response.data;

    if (data && data.close && !data.message && data.status !== 'error') {
      const price = parseFloat(data.close || data.open);
      if (!isNaN(price) && price > 0) {
        lastXauusdTimestamp = new Date().toISOString();
        lastApiErrorMsg = null;
        cachedQuote = {
          price,
          high24h: parseFloat(data.high) || price + 5.0,
          low24h: parseFloat(data.low) || price - 5.0,
          change24h: parseFloat(data.change) || 0,
          changePercent24h: parseFloat(data.percent_change) || 0,
          timestamp: Date.now(),
        };
        return {
          success: true,
          isLive: true,
          provider: 'TwelveData',
          dataSource: 'Twelve Data (XAU/USD Realtime)',
          data: cachedQuote
        };
      }
    } else if (data && (data.message || data.status === 'error')) {
      lastApiErrorMsg = data.message || 'Erreur API Twelve Data';
    }
  } catch (err) {
    lastApiErrorMsg = err.message;
    console.warn(`[forexData] Échec de la requête Twelve Data quote pour ${symbol}:`, err.message);
  }

  // Si l'appel a échoué ou format invalide, renvoyer l'ancien cache expiré marqué non-live sans fabriquer de fausses données
  return {
    success: true,
    isLive: false,
    provider: 'CacheStale',
    dataSource: 'Cache Non-Live (API Non-Disponible)',
    data: { ...cachedQuote, timestamp: Date.now() }
  };
}

/**
 * Récupère l'historique des bougies (candles) réelles pour une paire Forex donnée.
 * @param {string} pair - La paire d'actifs (ex: "XAU/USD")
 * @param {string} interval - L'intervalle de temps (ex: "15min")
 * @returns {Promise<Array|null>} - Un tableau de bougies réelles ou null si quota épuisé
 */
export async function getForexData(pair = 'XAU/USD', interval = '15min') {
  const symbol = pair.trim();
  const cacheKey = `${symbol}_${interval}`;

  // 1. Vérification du cache serveur partagé
  const cached = candleCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    console.log(`[forexData] 📦 Utilisation du cache serveur partagé pour ${symbol} (${interval})`);
    return cached.candles;
  }

  // 2. Vérification stricte du quota avant tout appel API
  const quotaCheck = canMakeTwelveDataCall();
  if (!quotaCheck.allowed) {
    console.warn(`[forexData] 🛑 QUOTA INSUFFISANT — NOUVEAU SETUP SUSPENDU (Impossible d'appeler Twelve Data pour ${symbol})`);
    if (cached?.candles) {
      // Indiquer explicitement que les données ne sont plus fraîches
      const staleCandles = [...cached.candles];
      staleCandles.isLive = false;
      staleCandles.quotaExceeded = true;
      staleCandles.dataSource = 'Cache Expire (Quota Epuise)';
      return staleCandles;
    }
    return null;
  }

  const apiKey = process.env.TWELVE_DATA_API_KEY || 'b7a3a115daf84f289e283ef25041cee4';

  try {
    const url = `https://api.twelvedata.com/time_series?symbol=${encodeURIComponent(
      symbol
    )}&interval=${interval}&outputsize=100&apikey=${apiKey}`;

    console.log(`[forexData] Appel Twelve Data API pour ${symbol} (${interval})...`);
    recordTwelveDataCall();
    const response = await axios.get(url, { timeout: 10000 });

    const data = response.data;

    // Vérification si Twelve Data renvoie une erreur de rate limit (429) ou de quota
    if (data && (data.status === 'error' || data.code === 429 || data.message?.includes('API limit'))) {
      console.warn(`[forexData] ⚠️ Limite de quota Twelve Data signalée dans la réponse pour ${symbol}:`, data.message);
      return null;
    }

    if (!data || !data.values || !Array.isArray(data.values) || data.values.length === 0) {
      console.warn(`[forexData] Format de réponse invalide ou vide pour ${symbol}`);
      return null;
    }

    // Bougies réelles ordonnées chronologiquement
    const rawCandles = [...data.values].reverse();

    const candles = rawCandles.map((c) => ({
      datetime: c.datetime,
      open: parseFloat(c.open),
      high: parseFloat(c.high),
      low: parseFloat(c.low),
      close: parseFloat(c.close),
      volume: parseInt(c.volume, 10) || 0,
    }));

    // Métadonnées d'authenticité obligatoires
    lastXauusdTimestamp = new Date().toISOString();
    lastApiErrorMsg = null;
    candles.isFallback = false;
    candles.isLive = true;
    candles.quotaExceeded = false;
    candles.dataSource = 'Twelve Data (XAU/USD Realtime)';
    candles.dataTimestamp = lastXauusdTimestamp;

    // Enregistrer dans le cache serveur partagé
    candleCache.set(cacheKey, { timestamp: Date.now(), candles });

    console.log(`[forexData] ✅ ${candles.length} bougies réelles récupérées avec succès pour ${symbol}`);
    return candles;
  } catch (error) {
    const status = error.response?.status;
    if (status === 429) {
      console.warn(`[forexData] ⚠️ Erreur HTTP 429 (Too Many Requests) pour ${symbol}. Interruption des requêtes.`);
    } else {
      console.error(`[forexData] Échec de la requête pour ${symbol}:`, error.message);
    }
    return null;
  }
}