import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Smartphone, RefreshCw, LogOut, Lock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { AuthUser } from '../types';
import { getLocalDeviceId } from '../lib/subscriptionService';
import { ChrisXauusdLogoIcon } from './ChrisXauusdLogo';

interface DeviceConflictModalProps {
  isOpen: boolean;
  user: AuthUser | null;
  onTransferToThisDevice: () => void;
  onLogout: () => void;
}

export const DeviceConflictModal: React.FC<DeviceConflictModalProps> = ({
  isOpen,
  user,
  onTransferToThisDevice,
  onLogout,
}) => {
  if (!isOpen || !user) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-xl animate-fade-in font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-slate-900 border border-amber-500/40 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative text-white font-sans"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-950 via-amber-950/50 to-slate-950 p-6 text-center border-b border-amber-500/20 relative">
            <div className="flex justify-center mb-3">
              <div className="relative">
                <ChrisXauusdLogoIcon className="w-14 h-14 drop-shadow-xl" />
                <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 p-1 rounded-full shadow-lg border border-slate-900">
                  <ShieldAlert className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-400/40">
                1 ABONNEMENT = 1 COMPTE = 1 APPAREIL
              </span>
              <h3 className="text-base font-bold text-white uppercase tracking-tight">
                Connexion Décelée sur un autre appareil
              </h3>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4 text-xs font-sans text-slate-300">
            <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl space-y-2 text-amber-200">
              <div className="flex items-center gap-2 font-bold text-amber-300">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Politique d'Appareil Unique Active</span>
              </div>
              <p className="leading-relaxed text-[11px] text-slate-300">
                Afin de garantir l'exclusivité et la sécurité maximale des signaux scalping institutionnels de <strong>{user.email}</strong>, la règle stricte est d'un seul appareil autorisé simultanément.
              </p>
            </div>

            <p className="text-slate-400 text-center leading-relaxed">
              Souhaitez-vous déconnecter la session précédente et transférer l'autorisation d'accès VIP sur cet appareil maintenant ?
            </p>

            <div className="pt-2 space-y-2.5">
              <button
                type="button"
                onClick={onTransferToThisDevice}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-slate-950 font-bold font-mono text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Autoriser et Utiliser Cet Appareil</span>
              </button>

              <button
                type="button"
                onClick={onLogout}
                className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold font-mono text-xs flex items-center justify-center gap-2 border border-slate-700 transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Se Déconnecter</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
