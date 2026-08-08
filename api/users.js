import { connectToDatabase } from '../services/db.js';
import User from '../models/User.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const db = await connectToDatabase();

    // GET /api/users?email=xxx - Récupère un profil utilisateur
    if (req.method === 'GET') {
      const email = req.query?.email;
      if (!email) {
        return res.status(400).json({ success: false, error: 'Email requis' });
      }

      if (!db) {
        return res.status(200).json({
          success: true,
          source: 'Fallback local',
          data: null,
        });
      }

      const user = await User.findOne({ email: email.toLowerCase().trim() });
      return res.status(200).json({
        success: true,
        source: 'MongoDB',
        data: user,
      });
    }

    // POST or PUT /api/users - Crée ou met à jour un profil utilisateur
    if (req.method === 'POST' || req.method === 'PUT') {
      const { email, name, phone, avatarUrl, subscription, traderLevel, tradingAccountBalance, preferredCurrency, preferredRiskPercentage, tradingStyle, telegramUsername, tradingPlatform, privacyMode } = req.body || {};

      if (!email) {
        return res.status(400).json({ success: false, error: 'Email obligatoire' });
      }

      if (!db) {
        return res.status(200).json({
          success: true,
          source: 'Memory mode',
          data: req.body,
        });
      }

      const cleanEmail = email.toLowerCase().trim();
      let user = await User.findOne({ email: cleanEmail });

      if (!user) {
        user = new User({
          email: cleanEmail,
          name: name || cleanEmail.split('@')[0],
          phone: phone || '',
          avatarUrl: avatarUrl || '',
          subscription: subscription || {
            status: 'VISITOR',
            startDate: null,
            expirationDate: null,
            daysRemaining: 0,
            amountFcfa: 700000,
          },
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
        if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;
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

      return res.status(200).json({
        success: true,
        source: 'MongoDB',
        data: user,
      });
    }

    return res.status(405).json({ success: false, error: 'Méthode non autorisée' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
