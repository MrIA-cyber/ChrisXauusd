import { connectToDatabase, getDbStatus } from '../services/db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    await connectToDatabase();
  } catch (err) {
    // Silent catch for health check
  }

  const dbStatus = getDbStatus();

  return res.status(200).json({
    status: 'OK',
    app: 'ChrisXauusd Signal Engine',
    timestamp: new Date().toISOString(),
    database: {
      type: 'MongoDB',
      status: dbStatus,
    },
    twelveDataApiKeyConfigured: true,
  });
}
