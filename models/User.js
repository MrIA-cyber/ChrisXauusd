/**
 * models/User.js
 * Schéma Mongoose pour les utilisateurs, leurs profils et abonnements
 */

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      default: '',
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    subscription: {
      status: {
        type: String,
        enum: ['VISITOR', 'ACTIVE', 'EXPIRING_SOON', 'EXPIRED', 'PENDING_VERIFICATION'],
        default: 'VISITOR',
      },
      startDate: { type: Date, default: null },
      expirationDate: { type: Date, default: null },
      daysRemaining: { type: Number, default: 0 },
      paymentMethod: { type: String, default: 'Mobile Money' },
      amountFcfa: { type: Number, default: 700000 },
    },
    traderLevel: {
      type: String,
      enum: ['DEBUTANT', 'INTERMEDIAIRE', 'SCALPER_PRO', 'MASTER_TRADER'],
      default: 'INTERMEDIAIRE',
    },
    tradingAccountBalance: {
      type: Number,
      default: 10000,
    },
    preferredCurrency: {
      type: String,
      default: 'USD',
    },
    preferredRiskPercentage: {
      type: Number,
      default: 1.0,
    },
    tradingStyle: {
      type: String,
      default: 'SCALPING_M1_M5',
    },
    telegramUsername: {
      type: String,
      default: '',
    },
    tradingPlatform: {
      type: String,
      default: 'MT5',
    },
    privacyMode: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
