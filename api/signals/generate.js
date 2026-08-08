import { connectToDatabase } from '../../services/db.js';
import Signal from '../../models/Signal.js';
import { getForexData } from '../../services/forexData.js';
import { generateSignal } from '../../services/signalGenerator.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const pair = req.body?.pair || 'XAU/USD';
    const interval = req.body?.interval || '15min';

    const candles = await getForexData(pair, interval);
    if (!candles) {
      return res.status(500).json({ success: false, error: 'Impossible de récupérer les données Twelve Data' });
    }

    const signalResult = generateSignal(candles, pair);

    const db = await connectToDatabase();

    if (db && signalResult.signal !== 'ATTENDRE') {
      const savedSignal = await Signal.create({
        pair: signalResult.pair,
        signal: signalResult.signal,
        price: signalResult.price,
        rsi: signalResult.rsi,
        macd: signalResult.macd,
        confidence: signalResult.confidence,
        timestamp: new Date(signalResult.timestamp),
      });
      return res.status(200).json({ success: true, saved: true, data: savedSignal });
    }

    return res.status(200).json({ success: true, saved: false, data: signalResult });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
