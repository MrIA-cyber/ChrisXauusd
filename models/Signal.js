/**
 * models/Signal.js
 * Schéma Mongoose pour l'enregistrement des signaux de trading Forex / XAUUSD
 */

import mongoose from 'mongoose';

const signalSchema = new mongoose.Schema(
  {
    pair: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    signal: {
      type: String,
      required: true,
      enum: ['ACHAT', 'VENTE', 'BUY', 'SELL', 'ATTENDRE'],
    },
    price: {
      type: Number,
      required: true,
    },
    rsi: {
      type: Number,
      default: null,
    },
    macd: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    confidence: {
      type: Number,
      default: 0,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Pour éviter la sur-compilation en mode développement
const Signal = mongoose.models.Signal || mongoose.model('Signal', signalSchema);

export default Signal;
