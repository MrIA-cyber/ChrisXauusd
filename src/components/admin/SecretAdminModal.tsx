import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, ShieldCheck, Lock, Eye, EyeOff, X, AlertTriangle, Key } from 'lucide-react';

interface SecretAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdminAuthenticated: () => void;
}

export const SecretAdminModal: React.FC<SecretAdminModalProps> = ({
  isOpen,
  onClose,
  onAdminAuthenticated,
}) => {
  const [emailInput, setEmailInput] = useState('admin@chrisxauusd.com');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [failedCount, setFailedCount] = useState(0);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Verify credentials & role
    if (emailInput.trim() === 'admin@chrisxauusd.com' && passwordInput === 'Chris2026!') {
      // Save authenticated session in localStorage
      localStorage.setItem('chris_admin_auth_v1', 'true');
      setErrorMessage(null);
      setFailedCount(0);
      onAdminAuthenticated();
      onClose();
    } else {
      const nextCount = failedCount + 1;
      setFailedCount(nextCount);
      setErrorMessage('Accès refusé : Identifiants ou privilèges Administrateur invalides.');

      if (nextCount >= 3) {
        setTimeout(() => {
          setErrorMessage(null);
          setFailedCount(0);
          onClose(); // Automatically close modal after 3 failed attempts for security
        }, 1800);
      }
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-md bg-slate-900 border border-amber-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 font-mono space-y-6 overflow-hidden"
        >
          {/* Subtle Accent Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto shadow-lg shadow-amber-500/10">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-500/30 uppercase tracking-widest mb-1">
                Authentification Sécurisée
              </span>
              <h2 className="text-lg font-bold text-white tracking-tight">Accès Console Administrateur</h2>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Vérification des droits du compte administrateur
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-rose-950/90 border border-rose-500/60 text-rose-300 p-3 rounded-2xl flex items-center gap-2.5 shadow-lg"
              >
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="font-mono text-[11px] font-bold">{errorMessage}</span>
              </motion.div>
            )}

            <div className="space-y-1 font-mono">
              <label className="text-slate-300 font-bold block text-[11px]">
                Email Administrateur :
              </label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="admin@chrisxauusd.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500/60 font-sans"
              />
            </div>

            <div className="space-y-1 font-mono">
              <label className="text-slate-300 font-bold block text-[11px]">
                Mot de Passe :
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500/60 font-sans pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-bold py-3 px-4 rounded-xl shadow-lg shadow-amber-500/20 active:scale-98 transition-all flex items-center justify-center gap-2 font-mono text-xs"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Valider l'Accès Administrateur</span>
              </button>
            </div>
          </form>

          {/* Footer Note */}
          <div className="text-center pt-2">
            <span className="text-[10px] text-slate-500 font-mono">
              ID de session chiffré • admin.chris
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
