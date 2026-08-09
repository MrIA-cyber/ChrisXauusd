/**
 * cron/signalCron.js
 * Planificateur de tâches automatiques (cron) exécuté toutes les 15 minutes
 * pour la détection et publication automatique de setups XAU/USD sur données réelles Twelve Data
 */

import cron from 'node-cron';
import { getForexData, getQuotaStatus } from '../services/forexData.js';
import { generateSignal } from '../services/signalGenerator.js';
import Signal from '../models/Signal.js';
import { saveSetupToFirestore } from '../src/lib/firebase.js';

// Liste des paires à surveiller (uniquement XAU/USD)
const FOREX_PAIRS = ['XAU/USD'];

// Suivi d'activité journalière pour les logs et statistiques
let publishedTradesTodayCount = 0;
let lastResetDateStr = new Date().toISOString().split('T')[0];

function checkAndResetDailyStats() {
  const todayStr = new Date().toISOString().split('T')[0];
  if (todayStr !== lastResetDateStr) {
    publishedTradesTodayCount = 0;
    lastResetDateStr = todayStr;
    console.log(`[CRON] 📅 Réinitialisation des statistiques du jour pour ${todayStr}`);
  }
}

/**
 * Fonction d'exécution de l'analyse globale
 */
export async function runSignalAnalysis() {
  checkAndResetDailyStats();

  // 1. VÉRIFICATION PRÉALABLE DU QUOTA TWELVE DATA (Marge de sécurité incluse)
  const quota = getQuotaStatus();
  if (!quota.isQuotaAvailable) {
    console.warn(`[CRON] 🛑 QUOTA INSUFFISANT — NOUVEAU SETUP SUSPENDU (Usage API: Jour ${quota.dailyCallsCount}/${quota.maxDailyCalls}, Min ${quota.minutelyCallsCount}/${quota.maxMinutelyCalls})`);
    return;
  }

  console.log(`\n[CRON] 🚀 Analyse automatique des opportunités XAU/USD en cours (${new Date().toISOString()})... [Setups publiés aujourd'hui: ${publishedTradesTodayCount}] [Quota API: ${quota.dailyCallsCount}/${quota.maxDailyCalls}]`);

  for (const pair of FOREX_PAIRS) {
    try {
      console.log(`[CRON] Recherche de setups valides sur données réelles pour ${pair}...`);
      
      // 2. Récupération des données historiques des bougies réelles Twelve Data
      const candles = await getForexData(pair, '15min');
      
      if (!candles || !Array.isArray(candles) || candles.length === 0) {
        console.warn(`[CRON] ⚠️ Aucune donnée réelle reçue pour ${pair}, analyse reportée.`);
        continue;
      }

      // GARANTIE SÉCURITÉ: Refuser catégoriquement la publication si les données sont synthétiques/fallback ou si quota dépassé
      if (candles.isFallback || candles.isLive === false || candles.quotaExceeded) {
        console.warn(`[CRON] 🛑 Données non-live ou quota Twelve Data épuisé. Publication annulée pour ${pair} afin de garantir 100% de données réelles.`);
        continue;
      }

      // 3. Génération et validation technique du signal (RSI, MACD, SMA)
      const signalResult = generateSignal(candles, pair);
      console.log(`[CRON] Résultat technique pour ${pair}: Signal=${signalResult.signal}, Prix=${signalResult.price}, Confiance=${signalResult.confidence}%`);

      // 4. Publication UNIQUEMENT si le setup est une opportunité active validée (ACHAT ou VENTE)
      if (signalResult.signal === 'ACHAT' || signalResult.signal === 'VENTE' || signalResult.signal === 'BUY' || signalResult.signal === 'SELL') {
        
        const timestampIso = new Date().toISOString();
        const dataTimeStr = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

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
            dataSource: candles.dataSource || 'Twelve Data (XAU/USD Realtime)',
          });

          await newSignal.save();
          console.log(`[CRON] ✅ Signal enregistré dans MongoDB avec succès pour ${pair}`);
        } catch (dbErr) {
          console.warn(`[CRON] Note MongoDB pour ${pair}:`, dbErr.message);
        }

        // B. Synchronisation temps réel sur Firestore DB (pour les traders de l'application ChrisXauusd)
        try {
          const ticketNum = Math.floor(100000 + Math.random() * 900000).toString();
          const riskPips = pair.includes('XAU') ? 35 : 20;
          const rewardPips = Math.round(riskPips * 2.5);

          const entryPrice = signalResult.price;
          const isBuy = signalResult.signal === 'ACHAT' || signalResult.signal === 'BUY';
          const stopLoss = isBuy ? Number((entryPrice - (riskPips / 10)).toFixed(2)) : Number((entryPrice + (riskPips / 10)).toFixed(2));
          const takeProfit = isBuy ? Number((entryPrice + (rewardPips / 10)).toFixed(2)) : Number((entryPrice - (rewardPips / 10)).toFixed(2));

          await saveSetupToFirestore({
            id: `cron-${pair.replace('/', '')}-${Date.now()}`,
            ticketNumber: `#XAU-${ticketNum}`,
            timestamp: dataTimeStr,
            type: isBuy ? 'BUY' : 'SELL',
            timeframe: 'M15',
            entryPrice,
            stopLoss,
            takeProfit,
            takeProfit2: isBuy ? Number((takeProfit + 2.5).toFixed(2)) : Number((takeProfit - 2.5).toFixed(2)),
            rrRatio: 2.5,
            riskPips,
            rewardPips,
            status: 'ACTIVE',
            confluence: ['RSI 14 Alignement Momentum', 'MACD Histogramme Institutionnel', 'SMA 50 Filtre de Tendance'],
            grade: 'A+',
            score: signalResult.confidence,
            notes: `Signal réel calculé sur données Twelve Data (${candles.dataSource || 'XAU/USD Live'}) - Horodatage: ${timestampIso}`,
            entryReason: `Signal de confirmation technique réel ${signalResult.signal} (${signalResult.confidence}% confiance)`,
          });

          publishedTradesTodayCount++;
          console.log(`[CRON] ⚡ SETUP VALIDE PUBLIÉ pour ${pair}! Total aujourd'hui: ${publishedTradesTodayCount} [Source: ${candles.dataSource || 'Twelve Data'}]`);
        } catch (fsErr) {
          console.warn(`[CRON] Note Firestore:`, fsErr.message);
        }

      } else {
        console.log(`[CRON] ℹ️ Analyse ${pair}: Signal neutre (ATTENDRE). Aucun setup publié.`);
      }

      // Pause de sécurité de 8 secondes entre les paires si plusieurs paires
      await new Promise((res) => setTimeout(res, 8000));
    } catch (err) {
      console.error(`[CRON] ❌ Erreur lors du traitement de ${pair}:`, err.message);
    }
  }

  console.log(`[CRON] ✨ Analyse terminée [Setups publiés aujourd'hui: ${publishedTradesTodayCount}].\n`);
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

  // Exécution initiale au démarrage du serveur
  setTimeout(() => {
    runSignalAnalysis();
  }, 5000);
}

