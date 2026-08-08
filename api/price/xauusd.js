import { getLiveQuote } from '../../services/forexData.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const symbol = req.query?.symbol || 'XAU/USD';
    const result = await getLiveQuote(symbol);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération de la cotation',
    });
  }
}
