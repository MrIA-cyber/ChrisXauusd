/**
 * models/Subscription.js
 * Schéma Mongoose pour l'historique des abonnements et demandes de paiement VIP
 */

import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
      index: true,
    },
    userEmail: {
      type: String,
      required: true,
      trim: true,
    },
    userName: {
      type: String,
      default: 'Abonné ChrisXauusd',
    },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED', 'EXPIRED'],
      default: 'PENDING',
    },
    paymentMethod: {
      type: String,
      default: 'Mobile Money',
    },
    amountFcfa: {
      type: Number,
      default: 700000,
    },
    transactionRef: {
      type: String,
      default: '',
    },
    activatedAt: {
      type: Date,
      default: null,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Subscription = mongoose.models.Subscription || mongoose.model('Subscription', subscriptionSchema);

export default Subscription;
