import React from 'react';
import { AlertTriangle, Clock, Sparkles } from 'lucide-react';
import { UserSubscription } from '../types';
import { formatDateFr, formatFcfa } from '../lib/subscriptionService';

interface SubscriptionBannerProps {
  subscription: UserSubscription;
  onOpenRenewalModal: () => void;
}

export const SubscriptionBanner: React.FC<SubscriptionBannerProps> = ({
  subscription,
  onOpenRenewalModal,
}) => {
  // Banner MUST ONLY show for active subscribers whose expiration date is in 3 days or less (and > 0 days)
  const isExpiringSoon =
    (subscription.status === 'EXPIRING_SOON' || subscription.status === 'ACTIVE') &&
    subscription.expirationDate !== null &&
    subscription.daysRemaining > 0 &&
    subscription.daysRemaining <= 3;

  if (!isExpiringSoon) {
    return null;
  }

  const expDateFormatted = formatDateFr(subscription.expirationDate);

  return (
    <div className="bg-gradient-to-r from-amber-950/95 via-amber-900/90 to-amber-950/95 border-b border-amber-500/50 text-amber-100 px-4 py-2.5 shadow-lg relative z-30 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 animate-pulse shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <p className="font-semibold text-amber-200 flex items-center gap-1.5">
              <span>AVERTISSEMENT DE FIN D'ABONNEMENT</span>
              <span className="bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded text-[10px] font-bold font-mono">
                J-{subscription.daysRemaining}
              </span>
            </p>
            <p className="text-amber-300/90 text-[11px] font-mono mt-0.5">
              Votre abonnement expire le <strong className="text-amber-100 underline decoration-amber-400">{expDateFormatted}</strong>. Pensez à le renouveler pour ne pas perdre l'accès aux signaux.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
          <button
            onClick={onOpenRenewalModal}
            className="w-full sm:w-auto bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-bold px-3.5 py-1.5 rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>Renouveler ({formatFcfa(subscription.amountFcfa)})</span>
          </button>
        </div>

      </div>
    </div>
  );
};
