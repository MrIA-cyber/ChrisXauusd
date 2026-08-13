/**
 * server.js
 * Serveur backend Express principal pour ChrisXauusd
 */

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import Signal from './models/Signal.js';
import User from './models/User.js';
import Subscription from './models/Subscription.js';
import { connectToDatabase, getDbStatus } from './services/db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration CORS & Express
app.use(cors());
app.use(express.json());

// Connexion BDD
connectToDatabase().catch(err => console.error('Erreur DB:', err));

// Route Santé / Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', dbStatus: getDbStatus() });
});

// Route Signaux Trading
app.get('/api/signals', async (req, res) => {
  try {
    const signals = await Signal.find().sort({ createdAt: -1 }).limit(10);
    res.json(signals);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des signaux' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serveur actif sur le port ${PORT}`);
});
