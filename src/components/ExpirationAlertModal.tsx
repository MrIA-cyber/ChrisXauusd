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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#071426] border border-[#00E5FF]/30 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative text-slate-100 font-sans p-6 text-center space-y-4">
        
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-md">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-1.5">
          <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30 uppercase tracking-widest inline-block">
            SESSION REPASSEE EN MODE VISITEUR
          </span>
          <h3 className="text-base font-bold font-mono text-white tracking-tight">
            VOTRE ABONNEMENT A EXPIRÉ
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            Votre abonnement ChrisXauusd a pris fin le{' '}
            <strong className="text-amber-400 underline">{expFormatted}</strong>.
          </p>
          <p className="text-[11px] text-slate-400 font-mono">
            Les tickets de signaux et le journal de trading sont à nouveau masqués.
          </p>
        </div>

        <div className="pt-2 flex flex-col gap-2.5 font-mono">
          <button
            onClick={() => {
              onClose();
              onOpenRenewalModal();
            }}
            className="w-full bg-[#00E5FF] hover:bg-[#00E5FF]/90 text-[#030B16] font-black py-3 px-4 rounded-2xl text-xs sm:text-sm shadow-[0_0_20px_rgba(0,229,255,0.25)] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Renouveler mon abonnement ({formatFcfa(SUBSCRIPTION_PRICE_FCFA)})</span>
          </button>

          <button
            onClick={onClose}
            className="w-full bg-[#030B16] hover:bg-[#030B16]/80 text-slate-300 hover:text-white py-2.5 rounded-2xl text-xs transition-colors border border-slate-800 cursor-pointer"
          >
            Continuer en mode visiteur
          </button>
        </div>

      </div>
    </div>
  );
};
