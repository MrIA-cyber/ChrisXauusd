/**
 * service/signalGenerator.js
 * Moteur d'analyse technique et de génération de signaux Forex / Or (XAU/USD)
 */

import pkg from 'technicalindicators';
const { RSI, MACD, SMA } = pkg;

/**
 * Génère un signal de trading basé sur l'analyse RSI, MACD et SMA(50)
 * @param {Array} candles - Liste des bougies { datetime, open, high, low, close, volume }
 * @param {string} pair - Nom de la paire d'actifs (ex: "EUR/USD")
 * @returns {Object} - Résultat de l'analyse avec décision (ACHAT, VENTE, ATTENDRE)
 */
export function generateSignal(candles, pair = 'XAU/USD') {
  if (!candles || !Array.isArray(candles) || candles.length < 50) {
    console.warn(`[signalGenerator] Données insuffisantes pour ${pair} (minimum 50 bougies requises)`);
    return {
      pair,
      signal: 'ATTENDRE',
      price: candles && candles.length > 0 ? candles[candles.length - 1].close : 0,
      rsi: null,
      macd: null,
      sma50: null,
      confidence: 0,
      timestamp: new Date().toISOString(),
      reason: 'Données insuffisantes'
    };
  }

  // Extraction des prix de clôture
  const closePrices = candles.map((c) => c.close);
  const currentPrice = closePrices[closePrices.length - 1];

  // 1. Calcul du RSI (période 14)
  const rsiValues = RSI.calculate({
    values: closePrices,
    period: 14,
  });
  const currentRsi = rsiValues.length > 0 ? rsiValues[rsiValues.length - 1] : 50;

  // 2. Calcul du MACD (12, 26, 9)
  const macdValues = MACD.calculate({
    values: closePrices,
    fastPeriod: 12,
    slowPeriod: 26,
    signalPeriod: 9,
    SimpleMAOscillator: false,
    SimpleMASignal: false,
  });
  const currentMacd = macdValues.length > 0 ? macdValues[macdValues.length - 1] : { MACD: 0, signal: 0, histogram: 0 };

  // 3. Calcul de la Moyenne Mobile Simple SMA (période 50)
  const smaValues = SMA.calculate({
    values: closePrices,
    period: 50,
  });
  const currentSma50 = smaValues.length > 0 ? smaValues[smaValues.length - 1] : currentPrice;

  // Evaluation des biais (Haussier vs Baissier)
  let bullishCount = 0;
  let bearishCount = 0;

  // Analyse RSI
  if (currentRsi > 52) {
    bullishCount++;
  } else if (currentRsi < 48) {
    bearishCount++;
  }

  // Analyse MACD (Histogramme ou Croisement MACD > Signal)
  if (currentMacd.histogram > 0 || currentMacd.MACD > currentMacd.signal) {
    bullishCount++;
  } else if (currentMacd.histogram < 0 || currentMacd.MACD < currentMacd.signal) {
    bearishCount++;
  }

  // Analyse SMA 50 (Prix au-dessus ou en-dessous)
  if (currentPrice > currentSma50) {
    bullishCount++;
  } else if (currentPrice < currentSma50) {
    bearishCount++;
  }

  // Détermination du signal (au moins 2 indicateurs sur 3 alignés)
  let signal = 'ATTENDRE';
  let confidence = 50;

  if (bullishCount >= 2) {
    signal = 'ACHAT'; // 'BUY'
    confidence = bullishCount === 3 ? 90 : 75;
  } else if (bearishCount >= 2) {
    signal = 'VENTE'; // 'SELL'
    confidence = bearishCount === 3 ? 90 : 75;
  }

  return {
    pair,
    signal,
    price: parseFloat(currentPrice.toFixed(2)),
    rsi: parseFloat(currentRsi.toFixed(2)),
    macd: {
      macd: parseFloat((currentMacd.MACD || 0).toFixed(4)),
      signal: parseFloat((currentMacd.signal || 0).toFixed(4)),
      histogram: parseFloat((currentMacd.histogram || 0).toFixed(4)),
    },
    sma50: parseFloat(currentSma50.toFixed(2)),
    confidence,
    timestamp: new Date().toISOString(),
  };
}
