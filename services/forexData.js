/**
 * service/forexData.js
 * Service de récupération des données de marché Forex depuis Twelve Data API
 */

import axios from 'axios';

/**
 * Récupère l'historique des bougies (candles) pour une paire Forex donnée.
 * @param {string} pair - La paire d'actifs (ex: "EUR/USD", "XAU/USD")
 * @param {string} interval - L'intervalle de temps (ex: "15min", "1h", "5min")
 * @returns {Promise<Array|null>} - Un tableau de bougies ordonnées chronologiquement ou null en cas d'erreur
 */
export async function getForexData(pair = 'XAU/USD', interval = '15min') {
  const apiKey = process.env.TWELVE_DATA_API_KEY || 'b7a3a115daf84f289e283ef25041cee4';

  if (!apiKey) {
    console.error('[forexData] Clé API TWELVE_DATA_API_KEY manquante.');
    return null;
  }

  try {
    const symbol = pair.trim();
    const url = `https://api.twelvedata.com/time_series?symbol=${encodeURIComponent(
      symbol
    )}&interval=${interval}&outputsize=100&apikey=${apiKey}`;

    console.log(`[forexData] Appel Twelve Data API pour ${symbol} (${interval})...`);
    const response = await axios.get(url, { timeout: 10000 });

    const data = response.data;

    // Vérification des erreurs retournées par l'API Twelve Data
    if (!data || data.status === 'error' || !data.values || !Array.isArray(data.values)) {
      console.warn(`[forexData] Erreur API pour ${symbol}:`, data?.message || 'Format de réponse invalide');
      return null;
    }

    // Réorganisation des bougies de la plus ancienne à la plus récente (ordre chronologique)
    const rawCandles = [...data.values].reverse();

    const candles = rawCandles.map((c) => ({
      datetime: c.datetime,
      open: parseFloat(c.open),
      high: parseFloat(c.high),
      low: parseFloat(c.low),
      close: parseFloat(c.close),
      volume: parseInt(c.volume, 10) || 0,
    }));

    console.log(`[forexData] ${candles.length} bougies récupérées avec succès pour ${symbol}`);
    return candles;
  } catch (error) {
    console.error(`[forexData] Échec de la requête pour ${pair}:`, error.message);
    return null;
  }
}
