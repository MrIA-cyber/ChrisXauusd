import React, { useState } from 'react';
import { X, LogIn, Lock, AlertCircle, ShieldAlert, CheckCircle2, UserCheck, KeyRound } from 'lucide-react';
import { DEMO_ACCOUNTS, createDatesForDaysLeft, calculateSubscriptionDetails, formatDateFr } from '../lib/subscriptionService';
import { AuthUser, UserSubscription } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AuthUser) => void;
  onOpenSubscriptionModal: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onOpenSubscriptionModal,
}) => {
  const [identifier, setIdentifier] = useState<string>('trader.pro@xau-scalp.com');
  const [password, setPassword] = useState<string>('Gold2026!');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [expiredSubWarning, setExpiredSubWarning] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setExpiredSubWarning(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const cleanId = identifier.trim().toLowerCase();

      // Find matching demo account or match any custom input with password "Gold2026!"
      const matchedAccount = DEMO_ACCOUNTS.find(
        (acc) =>
          (acc.email.toLowerCase() === cleanId || acc.phone.replaceAll(' ', '') === cleanId.replaceAll(' ', '')) &&
          acc.password === password
      );

      if (matchedAccount) {
        // Calculate subscription details for this demo account
        const dates = createDatesForDaysLeft(matchedAccount.subscriptionDaysLeft);
        const subDetails: UserSubscription = calculateSubscriptionDetails(
          dates.startDate,
          dates.expirationDate
        );

        if (subDetails.status === 'EXPIRED') {
          // Credentials match BUT subscription expired
          const expFormatted = formatDateFr(subDetails.expirationDate);
          setExpiredSubWarning(
            `Votre abonnement a expiré le ${expFormatted}. Veuillez le renouveler pour accéder aux signaux.`
          );
          return;
        }

        // Login success
        const loggedUser: AuthUser = {
          id: 'user-' + Date.now(),
          email: matchedAccount.email,
          phone: matchedAccount.phone,
          name: matchedAccount.name,
          subscription: subDetails,
        };

        onLoginSuccess(loggedUser);
        onClose();
        return;
      }

      // Check for generic valid input (e.g., custom user email/phone with any password)
      if (cleanId.includes('@') || cleanId.length >= 8) {
        // If password equals "Gold2026!" create an active user session
        if (password === 'Gold2026!') {
          const dates = createDatesForDaysLeft(30);
          const subDetails = calculateSubscriptionDetails(dates.startDate, dates.expirationDate);
          const loggedUser: AuthUser = {
            id: 'user-' + Date.now(),
            email: cleanId.includes('@') ? cleanId : `${cleanId}@user.com`,
            phone: cleanId.includes('@') ? '+221 77 000 00 00' : cleanId,
            name: 'Abonné Terminal',
            subscription: subDetails,
          };
          onLoginSuccess(loggedUser);
          onClose();
          return;
        }
      }

      // Security requirement: generic error message, never specify which field is wrong
      setErrorMessage('Identifiant ou mot de passe incorrect.');
    }, 600);
  };

  const fillQuickDemo = (demo: typeof DEMO_ACCOUNTS[0]) => {
    setIdentifier(demo.email);
    setPassword(demo.password);
    setErrorMessage(null);
    setExpiredSubWarning(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative text-slate-900 font-sans">
        
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600">
              <LogIn className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold font-mono text-slate-900">
                CONNEXION CHRISXAUUSD
              </h2>
              <p className="text-[11px] text-slate-500 font-mono">
                ChrisXauusd — Saisissez vos identifiants d'accès
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          
          {/* Generic Error Message Box */}
          {errorMessage && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs font-mono flex items-center gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Expired Subscription Warning Box */}
          {expiredSubWarning && (
            <div className="bg-amber-50 border border-amber-300 text-amber-900 p-3.5 rounded-xl text-xs font-mono space-y-2 animate-fade-in">
              <div className="flex items-center gap-2 text-amber-800 font-bold">
                <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600" />
                <span>ACCÈS INTERDIT - ABONNEMENT EXPIRÉ</span>
              </div>
              <p className="text-[11px] leading-relaxed text-amber-900">{expiredSubWarning}</p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenSubscriptionModal();
                }}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-1.5 px-3 rounded-lg text-xs transition-colors flex items-center justify-center gap-1 mt-1 shadow-2xs"
              >
                Renouveler mon abonnement maintenant
              </button>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            
            <div>
              <label className="text-[11px] font-mono text-slate-600 block mb-1">
                Identifiant (Email ou Numéro de Téléphone) :
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="trader@xau-scalp.com ou +221..."
                  className="w-full bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-3.5 py-2.5 text-slate-900 font-sans text-xs outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-mono text-slate-600 block mb-1">
                Mot de Passe / Code d'Accès :
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-3.5 py-2.5 text-slate-900 font-mono text-xs outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs sm:text-sm shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50 font-mono"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Se Connecter</span>
                </>
              )}
            </button>

          </form>

          {/* Quick Demo Fill Accounts Box */}
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-2">
            <span className="text-[10px] font-mono text-blue-900 font-bold flex items-center gap-1 uppercase tracking-wider">
              <KeyRound className="w-3 h-3 text-blue-600" /> Comptes Démo pour Tester (1 Clic) :
            </span>

            <div className="space-y-1.5">
              {DEMO_ACCOUNTS.map((acc, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => fillQuickDemo(acc)}
                  className="w-full text-left bg-white hover:bg-slate-100 border border-slate-200 p-2 rounded-lg text-[11px] font-mono flex items-center justify-between text-slate-700 transition-colors shadow-2xs"
                >
                  <span className="truncate pr-2 font-medium">{acc.name}</span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                      acc.subscriptionDaysLeft > 3
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : acc.subscriptionDaysLeft > 0
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-rose-100 text-rose-800 border border-rose-300'
                    }`}
                  >
                    {acc.subscriptionDaysLeft > 0 ? `${acc.subscriptionDaysLeft}j restants` : 'Expiré'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Footer link to payment */}
          <div className="pt-1 text-center text-xs font-mono text-slate-500">
            <span>Pas encore d'abonnement ? </span>
            <button
              onClick={() => {
                onClose();
                onOpenSubscriptionModal();
              }}
              className="text-blue-600 font-bold hover:underline ml-1"
            >
              S'abonner pour 700 000 FCFA
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
