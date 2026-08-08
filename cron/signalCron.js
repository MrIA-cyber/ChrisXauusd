/**
 * cron/signalCron.js
 * Planificateur de tâches automatiques (cron) exécuté toutes les 15 minutes
 */

import cron from 'node-cron';
import { getForexData } from '../services/forexData.js';
import { generateSignal } from '../services/signalGenerator.js';
import Signal from '../models/Signal.js';
import { saveSetupToFirestore } from '../src/lib/firebase.js';

// Liste des paires à surveiller
const FOREX_PAIRS = ['XAU/USD', 'EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD'];

/**
 * Fonction d'exécution de l'analyse globale
 */
export async function runSignalAnalysis() {
  console.log(`\n[CRON] 🚀 Début de l'analyse automatique des signaux (${new Date().toISOString()})...`);

  for (const pair of FOREX_PAIRS) {
    try {
      console.log(`[CRON] Analyse en cours pour ${pair}...`);
      
      // 1. Récupération des données historiques des bougies
      const candles = await getForexData(pair, '15min');
      if (!candles || candles.length === 0) {
        console.warn(`[CRON] ⚠️ Aucune donnée reçue pour ${pair}, passage à la paire suivante.`);
        continue;
      }

      // 2. Génération du signal technique (RSI, MACD, SMA)
      const signalResult = generateSignal(candles, pair);
      console.log(`[CRON] Résultat pour ${pair}: Signal=${signalResult.signal}, Prix=${signalResult.price}, RSI=${signalResult.rsi}`);

      // 3. Sauvegarde uniquement si le signal est un ordre actif (ACHAT ou VENTE)
      if (signalResult.signal === 'ACHAT' || signalResult.signal === 'VENTE' || signalResult.signal === 'BUY' || signalResult.signal === 'SELL') {
        
        // A. Sauvegarde dans MongoDB (si connecté)
        try {
          const newSignal = new Signal({
            pair: signalResult.pair,
            signal: signalResult.signal,
            price: signalResult.price,
            rsi: signalResult.rsi,
            macd: signalResult.macd,
            confidence: signalResult.confidence,
            timestamp: new Date(signalResult.timestamp),
          });

          await newSignal.save();
          console.log(`[CRON] ✅ Signal enregistrée dans MongoDB avec succès pour ${pair}`);
        } catch (dbErr) {
          console.warn(`[CRON] Note MongoDB pour ${pair}:`, dbErr.message);
        }

        // B. Synchronisation temps réel avec Firestore (pour l'application Web ChrisXauusd)
        try {
          const ticketNum = Math.floor(100000 + Math.random() * 900000).toString();
          const riskPips = pair.includes('XAU') ? 35 : 20;
          const rewardPips = riskPips * 2.5;

          const entryPrice = signalResult.price;
          const isBuy = signalResult.signal === 'ACHAT' || signalResult.signal === 'BUY';
          const stopLoss = isBuy ? Number((entryPrice - (riskPips / 10)).toFixed(2)) : Number((entryPrice + (riskPips / 10)).toFixed(2));
          const takeProfit = isBuy ? Number((entryPrice + (rewardPips / 10)).toFixed(2)) : Number((entryPrice - (rewardPips / 10)).toFixed(2));

          await saveSetupToFirestore({
            id: `cron-${pair.replace('/', '')}-${Date.now()}`,
            ticketNumber: ticketNum,
            timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            type: isBuy ? 'BUY' : 'SELL',
            timeframe: 'M15',
            entryPrice,
            stopLoss,
            takeProfit,
            takeProfit2: isBuy ? Number((takeProfit + 2).toFixed(2)) : Number((takeProfit - 2).toFixed(2)),
            rrRatio: 2.5,
            riskPips,
            rewardPips,
            status: 'ACTIVE',
            confluence: ['RSI 14 Alignement', 'MACD Histogramme', 'SMA 50 Filtre de Tendance'],
            grade: 'A+',
            score: signalResult.confidence,
            notes: `Signal automatique généré par le moteur Twelve Data pour ${pair}`,
            entryReason: `Signal de confirmation technique ${signalResult.signal} (${signalResult.confidence}% confiance)`,
          });
          console.log(`[CRON] ⚡ Signal synchronisé sur Firestore DB pour ${pair}`);
        } catch (fsErr) {
          console.warn(`[CRON] Firestore Note:`, fsErr.message);
        }

      } else {
        console.log(`[CRON] ℹ️ Signal pour ${pair} est ATTENDRE. Pas d'enregistrement.`);
      }

      // Pause de 8 secondes entre chaque appel pour respecter rigoureusement le quota Twelve Data (max 8 requêtes / min)
      await new Promise((res) => setTimeout(res, 8000));
    } catch (err) {
      console.error(`[CRON] ❌ Erreur lors du traitement de ${pair}:`, err.message);
    }
  }

  console.log(`[CRON] ✨ Analyse terminée avec succès.\n`);
}

/**
 * Lance le job cron planifié toutes les 15 minutes
 */
export function startSignalCron() {
  console.log('[CRON] Initialisation du planificateur de tâches (node-cron toutes les 15 minutes)...');
  
  // Syntaxe Cron: '*/15 * * * *' = toutes les 15 minutes
  cron.schedule('*/15 * * * *', async () => {
    await runSignalAnalysis();
  });

  // Exécution initiale immédiate au démarrage du serveur
  setTimeout(() => {
    runSignalAnalysis();
  }, 5000);
}
