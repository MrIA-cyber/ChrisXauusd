import React, { useState, useEffect } from 'react';
import { Download, Smartphone, Share, PlusSquare, CheckCircle2, X, Monitor, ShieldCheck, Zap, ExternalLink, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface InstallPwaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallPwaModal: React.FC<InstallPwaModalProps> = ({ isOpen, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [isInIframe, setIsInIframe] = useState<boolean>(false);

  useEffect(() => {
    // Detect iframe environment
    try {
      setIsInIframe(window.self !== window.top);
    } catch {
      setIsInIframe(true);
    }

    // Check if running on iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const iosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(iosDevice);

    // Check if app is already running in standalone (PWA) mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    if (isStandalone) {
      setIsInstalled(true);
    }

    // Capture beforeinstallprompt event on Android/Desktop Chrome/Edge
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } catch (err) {
      console.warn('Install prompt failed:', err);
    }
  };

  const handleOpenNewTab = () => {
    window.open(window.location.href, '_blank');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative overflow-hidden text-slate-900 dark:text-white"
        >
          {/* Header Ambient Glow */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 via-emerald-500 to-amber-500" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icon + Title */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-amber-500/20 shrink-0">
              ⚡
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
                <span>Installer ChrisXauusd</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Accès direct depuis votre écran d'accueil
              </p>
            </div>
          </div>

          {/* Warning if running inside preview iframe */}
          {isInIframe && !isInstalled && (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-900 dark:text-amber-200 mb-4 space-y-2">
              <div className="font-bold flex items-center gap-2 text-amber-600 dark:text-amber-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Étape requise pour installer l'application</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                Vous êtes dans la prévisualisation intégrée. Pour pouvoir installer l'application sur votre téléphone ou PC, <strong>ouvrez l'application dans un nouvel onglet</strong>.
              </p>
              <button
                onClick={handleOpenNewTab}
                className="w-full py-2 px-3 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 mt-1"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Ouvrir dans un nouvel onglet</span>
              </button>
            </div>
          )}

          {/* Body Content depending on state */}
          {isInstalled ? (
            <div className="py-6 text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/30">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                L'application est déjà installée !
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Vous pouvez lancer ChrisXauusd directement depuis l'écran d'accueil de votre téléphone ou ordinateur.
              </p>
            </div>
          ) : deferredPrompt ? (
            /* Direct 1-Click Install Button for Android/Chrome/Desktop */
            <div className="space-y-4 py-2">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs">
                  <Zap className="w-4 h-4" />
                  <span>Installation Rapide en 1 Clic</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Profitez de performances fluides, d'une expérience plein écran native et de notifications sonores en direct pour les signaux XAU/USD.
                </p>
              </div>

              <button
                onClick={handleInstallClick}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <Download className="w-4 h-4" />
                <span>Installer sur mon appareil</span>
              </button>
            </div>
          ) : isIOS ? (
            /* Instructions for iPhone / iPad (Safari) */
            <div className="space-y-4 py-2">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-amber-500" />
                  <span>Guide d'installation pour iPhone / iPad :</span>
                </p>
                <ol className="text-xs text-slate-600 dark:text-slate-300 space-y-2.5 pl-1">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-amber-500 shrink-0">1.</span>
                    <span>
                      Ouvrez ce site dans <strong>Safari</strong> (bouton "Ouvrir dans un nouvel onglet" ci-dessus).
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-amber-500 shrink-0">2.</span>
                    <span>
                      Appuyez sur l'icône <strong className="text-amber-500 inline-flex items-center gap-1">Partager <Share className="w-3.5 h-3.5 inline" /></strong> en bas de Safari.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-amber-500 shrink-0">3.</span>
                    <span>
                      Sélectionnez <strong className="text-amber-500 inline-flex items-center gap-1 font-bold">Sur l'écran d'accueil <PlusSquare className="w-3.5 h-3.5 inline" /></strong> puis validez par <strong>Ajouter</strong>.
                    </span>
                  </li>
                </ol>
              </div>
            </div>
          ) : (
            /* General Instructions for Android & Desktop */
            <div className="space-y-4 py-2">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-amber-500" />
                  <span>Comment installer sur Android ou PC :</span>
                </p>
                <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2.5">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">1.</span>
                    <span>Ouvrez le site dans un nouvel onglet de votre navigateur (Chrome / Brave / Edge / Samsung Internet).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">2.</span>
                    <span>
                      Cliquez sur le menu <strong>(3 petits points ⋮)</strong> en haut à droite.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">3.</span>
                    <span>
                      Sélectionnez <strong>"Installer l'application"</strong> ou <strong>"Ajouter à l'écran d'accueil"</strong>.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Footer Note */}
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> PWA Certifiée
            </span>
            <span>Accès direct 100% sécurisé</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

