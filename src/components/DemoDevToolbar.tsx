import React from 'react';
import { Sliders, UserCheck, Clock, ShieldAlert, User, Sparkles } from 'lucide-react';
import { SubscriptionStatus, UserSubscription } from '../types';
import { createDatesForDaysLeft, calculateSubscriptionDetails, SUBSCRIPTION_PRICE_FCFA } from '../lib/subscriptionService';

interface DemoDevToolbarProps {
  currentSubscription: UserSubscription;
  onSimulateState: (daysLeft: number) => void;
  onResetVisitor: () => void;
  onChangeProfile?: () => void;
}

export const DemoDevToolbar: React.FC<DemoDevToolbarProps> = ({
  currentSubscription,
  onSimulateState,
  onResetVisitor,
  onChangeProfile,
}) => {
  return (
    <div className="bg-slate-900 border-b border-slate-800 px-4 py-1.5 text-xs font-mono text-slate-300">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 font-bold text-blue-400 text-[11px]">
            <Sliders className="w-3.5 h-3.5" />
            <span>SIMULATEUR DE STATUT (DÉMO) :</span>
          </span>
          <span className="text-[10px] text-slate-400 hidden md:inline">
            Testez instantanément les comportements visiteur, alerte J-3 et expiration
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
          {onChangeProfile && (
            <button
              onClick={onChangeProfile}
              className="px-2.5 py-1 rounded border bg-blue-950 text-blue-300 border-blue-700/80 font-bold hover:bg-blue-900 transition-colors"
            >
              Écran Choix Profil
            </button>
          )}

          <button
            onClick={onResetVisitor}
            className={`px-2.5 py-1 rounded border transition-colors ${
              currentSubscription.status === 'VISITOR'
                ? 'bg-slate-700 text-white border-slate-500 font-bold'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            Mode Visiteur
          </button>

          <button
            onClick={() => onSimulateState(30)}
            className={`px-2.5 py-1 rounded border transition-colors flex items-center gap-1 ${
              (currentSubscription.status === 'ACTIVE' || currentSubscription.status === 'EXPIRING_SOON') && currentSubscription.daysRemaining > 3
                ? 'bg-emerald-950 text-emerald-300 border-emerald-500 font-bold'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserCheck className="w-3 h-3 text-emerald-400" />
            <span>Abonné Actif (30j)</span>
          </button>

          <button
            onClick={() => onSimulateState(2)}
            className={`px-2.5 py-1 rounded border transition-colors flex items-center gap-1 ${
              currentSubscription.expirationDate !== null && currentSubscription.daysRemaining > 0 && currentSubscription.daysRemaining <= 3
                ? 'bg-amber-950 text-amber-300 border-amber-500 font-bold'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3 h-3 text-amber-400" />
            <span>Alerte J-2 Expiration</span>
          </button>

          <button
            onClick={() => onSimulateState(0)}
            className={`px-2.5 py-1 rounded border transition-colors flex items-center gap-1 ${
              currentSubscription.status === 'EXPIRED'
                ? 'bg-rose-950 text-rose-300 border-rose-500 font-bold'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3 h-3 text-rose-400" />
            <span>Abonnement Expiré</span>
          </button>
        </div>

      </div>
    </div>
  );
};

