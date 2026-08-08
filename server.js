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
import { startSignalCron, runSignalAnalysis } from './cron/signalCron.js';
import { getForexData } from './services/forexData.js';
import { generateSignal } from './services/signalGenerator.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(express.json());

// 1. Connexion à la base de données MongoDB (Si l'URI est fournie)
if (MONGODB_URI) {
  console.log('[MongoDB] Connexion en cours à MongoDB...');
  mongoose
    .connect(MONGODB_URI)
    .then(() => {
      console.log('✅ Connexion MongoDB établie avec succès.');
    })
    .catch((err) => {
      console.error('❌ Erreur de connexion MongoDB:', err.message);
      console.log('ℹ️ Le serveur continue de fonctionner en mode dégradé.');
    });
} else {
  console.warn('⚠️ Variable MONGODB_URI non définie dans le fichier .env. Connexion MongoDB en attente.');
}

// 2. Endpoint de vérification de santé du serveur
app.get('/health', (req, res) => {
  const mongoStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({
    status: 'OK',
    app: 'ChrisXauusd Signal Engine',
    timestamp: new Date().toISOString(),
    database: {
      type: 'MongoDB',
      status: mongoStatus,
    },
    twelveDataApiKeyConfigured: !!(process.env.TWELVE_DATA_API_KEY || 'b7a3a115daf84f289e283ef25041cee4'),
  });
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
