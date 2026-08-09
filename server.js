/**
 * server.js
 * Serveur backend Express principal pour ChrisXauusd avec connexion MongoDB et Cron Job
 */

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

import Signal from './models/Signal.js';
import User from './models/User.js';
import Subscription from './models/Subscription.js';
import { connectToDatabase, getDbStatus } from './services/db.js';
import { startSignalCron, runSignalAnalysis } from './cron/signalCron.js';
import { getForexData, getLiveQuote, getQuotaStatus } from './services/forexData.js';
import { generateSignal } from './services/signalGenerator.js';
import { fetchLiveMarketNews } from './services/realNewsService.js';
import { analyzeMacroSentiment } from './services/aiMacroService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(express.json());

// 1. Connexion à la base de données MongoDB via le service réutilisable
connectToDatabase()
  .then((conn) => {
    if (conn) {
      console.log('✅ Connexion MongoDB établie avec succès.');
    } else {
      console.warn('⚠️ MongoDB non connecté. Mode fallback actif.');
    }
  })
  .catch((err) => {
    console.error('❌ Erreur de connexion MongoDB:', err.message);
  });

// 2. Endpoint de vérification de santé du serveur
app.get('/health', (req, res) => {
  const mongoStatus = getDbStatus();
  const quota = getQuotaStatus();
  res.json({
    status: 'OK',
    app: 'ChrisXauusd Signal Engine',
    timestamp: new Date().toISOString(),
    database: {
      type: 'MongoDB',
      status: mongoStatus,
    },
    twelveDataQuota: quota,
    twelveDataApiKeyConfigured: true,
  });
});

// Endpoint Twelve Data Real-Time Price
app.get('/api/price/xauusd', async (req, res) => {
  try {
    const symbol = req.query.symbol || 'XAU/USD';
    const quoteResult = await getLiveQuote(symbol);
    return res.json(quoteResult);
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Erreur lors de la récupération du prix' });
  }
});

// Endpoint Admin Status Twelve Data Quota
app.get('/api/admin/twelve-data-status', (req, res) => {
  try {
    const quotaStatus = getQuotaStatus();
    return res.json({
      success: true,
      timestamp: new Date().toISOString(),
      quotaStatus,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Endpoint Twelve Data Historical Candles & Time Series
app.get('/api/forex/candles', async (req, res) => {
  try {
    const pair = (req.query.pair || 'XAU/USD').toString();
    const interval = (req.query.interval || '15min').toString();

    const candles = await getForexData(pair, interval);
    return res.json({
      success: true,
      pair,
      interval,
      candles,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Erreur lors de la récupération des bougies' });
  }
});

// Endpoint Actualités Financières & Or en Direct (Live Satellite News)
app.get('/api/news/live', async (req, res) => {
  try {
    const liveArticles = await fetchLiveMarketNews();
    return res.json({
      success: true,
      count: liveArticles.length,
      data: liveArticles,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Erreur lors de la récupération des actualités réelles' });
  }
});

// Endpoint IA Prédictive & Analyse de Sentiment Macro (Fed, NFP, Inflation CPI)
app.all('/api/ai/macro-analysis', async (req, res) => {
  try {
    const analysis = await analyzeMacroSentiment();
    return res.json(analysis);
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Erreur lors de l\'analyse IA macroéconomique: ' + err.message,
    });
  }
});

// Endpoint User Profile & Preferences
app.get('/api/users', async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email requis' });
    }
    if (getDbStatus() === 'connected') {
      const user = await User.findOne({ email: email.toLowerCase().trim() });
      return res.json({ success: true, source: 'MongoDB', data: user });
    }
    return res.json({ success: true, source: 'Memory', data: null });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const { email, name, phone, subscription, traderLevel, tradingAccountBalance, preferredCurrency, preferredRiskPercentage, tradingStyle, telegramUsername, tradingPlatform, privacyMode } = req.body || {};
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email requis' });
    }
    if (getDbStatus() === 'connected') {
      const cleanEmail = email.toLowerCase().trim();
      let user = await User.findOne({ email: cleanEmail });
      if (!user) {
        user = new User({
          email: cleanEmail,
          name: name || cleanEmail.split('@')[0],
          phone: phone || '',
          subscription,
          traderLevel,
          tradingAccountBalance,
          preferredCurrency,
          preferredRiskPercentage,
          tradingStyle,
          telegramUsername,
          tradingPlatform,
          privacyMode,
        });
      } else {
        if (name) user.name = name;
        if (phone !== undefined) user.phone = phone;
        if (subscription) user.subscription = { ...user.subscription, ...subscription };
        if (traderLevel) user.traderLevel = traderLevel;
        if (tradingAccountBalance !== undefined) user.tradingAccountBalance = tradingAccountBalance;
        if (preferredCurrency) user.preferredCurrency = preferredCurrency;
        if (preferredRiskPercentage !== undefined) user.preferredRiskPercentage = preferredRiskPercentage;
        if (tradingStyle) user.tradingStyle = tradingStyle;
        if (telegramUsername !== undefined) user.telegramUsername = telegramUsername;
        if (tradingPlatform) user.tradingPlatform = tradingPlatform;
        if (privacyMode !== undefined) user.privacyMode = privacyMode;
      }
      await user.save();
      return res.json({ success: true, source: 'MongoDB', data: user });
    }
    return res.json({ success: true, source: 'Memory', data: req.body });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Endpoint API GET /api/signals - Récupère les 20 derniers signaux
app.get('/api/signals', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const signals = await Signal.find().sort({ timestamp: -1 }).limit(20);
      return res.json({
        success: true,
        count: signals.length,
        source: 'MongoDB',
        data: signals,
      });
    }

    // Fallback de démonstration si MongoDB n'est pas encore configuré
    return res.json({
      success: true,
      count: 1,
      source: 'Realtime Engine',
      message: 'MongoDB non connecté. Exemple de signal généré en direct:',
      data: [
        {
          pair: 'XAU/USD',
          signal: 'ACHAT',
          price: 2385.5,
          rsi: 58.4,
          macd: { macd: 0.85, signal: 0.42, histogram: 0.43 },
          confidence: 85,
          timestamp: new Date().toISOString(),
        },
      ],
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des signaux:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur interne' });
  }
});

// 4. Endpoint manuel POST /api/signals/generate - Génère un signal instantané
app.post('/api/signals/generate', async (req, res) => {
  try {
    const pair = req.body?.pair || 'XAU/USD';
    const interval = req.body?.interval || '15min';

    const candles = await getForexData(pair, interval);
    if (!candles) {
      return res.status(500).json({ success: false, error: 'Impossible de récupérer les données Twelve Data' });
    }

    const signalResult = generateSignal(candles, pair);

    if (mongoose.connection.readyState === 1 && signalResult.signal !== 'ATTENDRE') {
      const savedSignal = await Signal.create({
        pair: signalResult.pair,
        signal: signalResult.signal,
        price: signalResult.price,
        rsi: signalResult.rsi,
        macd: signalResult.macd,
        confidence: signalResult.confidence,
        timestamp: new Date(signalResult.timestamp),
      });
      return res.json({ success: true, saved: true, data: savedSignal });
    }

    res.json({ success: true, saved: false, data: signalResult });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Intégration Vite Middleware pour le front-end React en mode Développement / Production
async function startAppServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Lancement du serveur Express
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 Serveur ChrisXauusd démarré avec succès sur le port ${PORT}`);
    console.log(`👉 URL Locale: http://localhost:${PORT}`);
    console.log(`👉 Endpoint Santé: http://localhost:${PORT}/health`);
    console.log(`👉 Endpoint Signaux: http://localhost:${PORT}/api/signals\n`);

    // Démarrage du job cron
    startSignalCron();
  });
}

startAppServer();
