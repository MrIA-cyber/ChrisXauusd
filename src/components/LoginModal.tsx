import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  LogIn,
  Lock,
  AlertCircle,
  ShieldAlert,
  CheckCircle2,
  User,
  LockKeyhole,
  Star,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { DEMO_ACCOUNTS, createDatesForDaysLeft, calculateSubscriptionDetails, formatDateFr, formatFcfa, SUBSCRIPTION_PRICE_FCFA } from '../lib/subscriptionService';
import { AuthUser, UserSubscription } from '../types';
import { ChrisXauusdLogoIcon } from './ChrisXauusdLogo';

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
  const [identifier, setIdentifier] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [expiredSubWarning, setExpiredSubWarning] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Escape key listener
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

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
          avatarUrl: matchedAccount.avatarUrl,
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

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/80 backdrop-blur-xl overflow-y-auto animate-fade-in cursor-pointer"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl relative text-slate-900 dark:text-white font-sans my-auto cursor-default"
      >
        {/* Top Premium Dark Header */}
        <div className="relative bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-8 text-center overflow-hidden border-b border-blue-900/50">
          
          {/* Close Cross Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 shadow-lg backdrop-blur-md transition-all active:scale-95 cursor-pointer flex items-center justify-center"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          {/* Background Glow Effects */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

          {/* Centered Logo & Branding */}
          <div className="flex flex-col items-center justify-center space-y-2 relative z-10">
            <ChrisXauusdLogoIcon className="w-14 h-14 sm:w-16 sm:h-16 drop-shadow-xl" />

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-sans font-bold bg-gradient-to-r from-amber-500/20 via-blue-500/20 to-purple-500/20 border border-amber-400/40 text-amber-300 shadow-2xs">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span>ACCÈS ESPACE MEMBRE VIP</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold font-sans tracking-tight text-white uppercase">
                Connexion Terminal
              </h2>
              <p className="text-xs sm:text-sm text-blue-200/90 font-sans max-w-md mx-auto flex items-center justify-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-blue-400 inline shrink-0" />
                <span>Authentification Sécurisée & Accès Protégé</span>
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-7 space-y-5">
          
          {/* Generic Error Message Box */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 p-3.5 rounded-2xl text-xs font-mono flex items-center gap-2.5 shadow-2xs"
            >
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          {/* Expired Subscription Warning Box */}
          {expiredSubWarning && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 p-4 rounded-2xl text-xs font-mono space-y-3"
            >
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold uppercase tracking-tight">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>Accès Suspendu — Abonnement Expiré</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-700 dark:text-slate-300">{expiredSubWarning}</p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenSubscriptionModal();
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs font-mono transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 cursor-pointer"
              >
                <span>Renouveler mon abonnement maintenant</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            
            {/* Field 1: Identifier */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-500" />
                <span>Identifiant (Email ou Numéro de Téléphone) *</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Ex: jean.kouassi@gmail.com ou 699001122"
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-900 dark:text-white font-sans outline-none transition-all shadow-2xs placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Field 2: Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <LockKeyhole className="w-3.5 h-3.5 text-blue-500" />
                <span>Mot de Passe / Code d'Accès *</span>
              </label>
              <div className="relative">
                <LockKeyhole className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-900 dark:text-white font-mono outline-none transition-all shadow-2xs placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 hover:from-blue-500 hover:to-indigo-700 text-white font-mono font-bold text-xs sm:text-sm shadow-xl shadow-blue-600/25 flex items-center justify-center gap-2.5 transition-all transform active:scale-98 cursor-pointer disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Se Connecter au Terminal VIP</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          {/* Footer Call to Subscription */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800/80 text-center text-xs font-mono text-slate-600 dark:text-slate-300 space-y-2">
            <div className="flex items-center justify-center gap-1.5 text-slate-500 dark:text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Vous n'avez pas encore de compte VIP actif ?</span>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenSubscriptionModal();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 font-bold border border-blue-300 dark:border-blue-500/40 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Activer mon Abonnement — {formatFcfa(SUBSCRIPTION_PRICE_FCFA)}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </motion.div>
    </div>
  );
};

