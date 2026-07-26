import React from 'react';
import { ShieldAlert, RefreshCw, X } from 'lucide-react';
import { formatDateFr, formatFcfa, SUBSCRIPTION_PRICE_FCFA } from '../lib/subscriptionService';

interface ExpirationAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRenewalModal: () => void;
  expirationDate: string | null;
}

export const ExpirationAlertModal: React.FC<ExpirationAlertModalProps> = ({
  isOpen,
  onClose,
  onOpenRenewalModal,
  expirationDate,
}) => {
  if (!isOpen) return null;

  const expFormatted = formatDateFr(expirationDate);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative text-slate-900 font-sans p-6 text-center space-y-4">
        
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 rounded-full bg-amber-50 border border-amber-300 text-amber-600 flex items-center justify-center mx-auto shadow-md">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-1.5">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-300 uppercase tracking-widest">
            SESSION REPASSEE EN MODE VISITEUR
          </span>
          <h3 className="text-base font-bold font-mono text-slate-900">
            VOTRE ABONNEMENT A EXPIRÉ
          </h3>
          <p className="text-xs text-slate-700 leading-relaxed font-sans">
            Votre abonnement ChrisXauusd a pris fin le{' '}
            <strong className="text-amber-800 underline">{expFormatted}</strong>.
          </p>
          <p className="text-[11px] text-slate-500 font-mono">
            Les tickets de signaux et le journal de trading sont à nouveau masqués.
          </p>
        </div>

        <div className="pt-2 flex flex-col gap-2 font-mono">
          <button
            onClick={() => {
              onClose();
              onOpenRenewalModal();
            }}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Renouveler mon abonnement ({formatFcfa(SUBSCRIPTION_PRICE_FCFA)})</span>
          </button>

          <button
            onClick={onClose}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 py-2 rounded-xl text-xs transition-colors border border-slate-200"
          >
            Continuer en mode visiteur
          </button>
        </div>

      </div>
    </div>
  );
};
