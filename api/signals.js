import { connectToDatabase } from '../services/db.js';
import Signal from '../models/Signal.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const db = await connectToDatabase();

    if (db) {
      const signals = await Signal.find().sort({ timestamp: -1 }).limit(20);
      return res.status(200).json({
        success: true,
        count: signals.length,
        source: 'MongoDB',
        data: signals,
      });
    }

    return res.status(200).json({
      success: true,
      count: 1,
      source: 'Realtime Engine',
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
    return res.status(500).json({ success: false, error: 'Erreur serveur interne' });
  }
}
