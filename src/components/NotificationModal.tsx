import React, { useState, useEffect } from 'react';
import { Bell, BellRing, BellOff, Volume2, VolumeX, ShieldCheck, ExternalLink, Sparkles, X, CheckCircle2, AlertTriangle, Smartphone, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getNotificationPermission, requestWebNotificationPermission, sendWebPushNotification, NotificationPermissionState } from '../lib/notificationService';
import { soundService } from '../lib/audioService';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  soundEnabled,
  onToggleSound,
}) => {
  const [permission, setPermission] = useState<NotificationPermissionState>(() => getNotificationPermission());
  const [isInIframe, setIsInIframe] = useState<boolean>(false);
  const [testSent, setTestSent] = useState<boolean>(false);
  const [inAppAlerts, setInAppAlerts] = useState<boolean>(true);

  useEffect(() => {
    try {
      setIsInIframe(window.self !== window.top);
    } catch {
      setIsInIframe(true);
    }
    setPermission(getNotificationPermission());
  }, [isOpen]);

  const handleRequestPermission = async () => {
    soundService.playNewSignalSound(true);

    if (permission === 'granted') {
      sendWebPushNotification('🛎️ Test Notification Push ChrisXauusd', {
        body: 'Les notifications push sont 100% actives sur cet appareil !',
      });
      setTestSent(true);
      setTimeout(() => setTestSent(false), 4000);
      return;
    }

    if (isInIframe && permission !== 'granted') {
      // If inside iframe, open in new tab so permission prompt can be triggered
      window.open(window.location.href, '_blank');
      return;
    }

    const res = await requestWebNotificationPermission();
    setPermission(res);
    if (res === 'granted') {
      setTestSent(true);
      setTimeout(() => setTestSent(false), 4000);
    }
  };

  const handleSendTestNotification = () => {
    soundService.playNewSignalSound(true);
    sendWebPushNotification('🚀 NOUVEAU SIGNAL TEST - XAU/USD', {
      body: 'ACHAT à 2865.50 | TP: 2880.00 | SL: 2855.00',
    });
    setTestSent(true);
    setTimeout(() => setTestSent(false), 4000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden text-slate-900 font-sans"
        >
          {/* Header */}
          <div className="relative px-6 pt-6 pb-5 bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-500/20 border border-amber-500/40 rounded-2xl text-amber-400">
                <BellRing className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-mono tracking-tight text-white flex items-center gap-2">
                  <span>CENTRE DE NOTIFICATIONS VIP</span>
                </h3>
                <p className="text-xs text-amber-200/80 font-mono mt-0.5">
                  Ne manquez plus aucun signal XAU/USD sur vos appareils
                </p>
              </div>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-5">
            {/* Status Banner */}
            <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
              permission === 'granted'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}>
              {permission === 'granted' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div className="text-xs space-y-1 font-mono">
                <div className="font-bold uppercase tracking-wider text-[11px]">
                  Statut Push Web : {permission === 'granted' ? 'ACTIVÉ (VIP)' : 'EN ATTENTE D\'ACTIVATION'}
                </div>
                <p className="font-sans text-slate-600 text-[11px] leading-relaxed">
                  {permission === 'granted'
                    ? 'Les notifications système sont configurées. Vous recevrez les signaux directement sur votre écran même en arrière-plan.'
                    : 'Activez les notifications pour recevoir les alertes d\'achat/vente XAU/USD en temps réel sur votre mobile et PC.'}
                </p>
              </div>
            </div>

            {/* Test Banner Alert if triggered */}
            {testSent && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 bg-blue-600 text-white rounded-2xl flex items-center justify-between gap-3 text-xs font-mono shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
                  <span>Notification de test émise avec succès !</span>
                </div>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">100% OK</span>
              </motion.div>
            )}

            {/* Main Action Buttons */}
            <div className="space-y-2.5">
              {permission !== 'granted' && (
                <button
                  onClick={handleRequestPermission}
                  className="w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-slate-950 font-mono font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Bell className="w-4 h-4" />
                  <span>Activer les Notifications Push</span>
                  {isInIframe && <ExternalLink className="w-3.5 h-3.5 ml-1" />}
                </button>
              )}

              <button
                onClick={handleSendTestNotification}
                className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 active:scale-[0.99] text-slate-800 font-mono font-bold text-xs rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-200"
              >
                <BellRing className="w-4 h-4 text-amber-600" />
                <span>Tester une alerte signal (Son + Pop-up)</span>
              </button>

              {isInIframe && (
                <button
                  onClick={() => window.open(window.location.href, '_blank')}
                  className="w-full py-2.5 px-4 bg-blue-50 hover:bg-blue-100 text-blue-700 font-mono font-semibold text-[11px] rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer border border-blue-200"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Ouvrir dans un nouvel onglet (Pour autoriser le navigateur)</span>
                </button>
              )}
            </div>

            {/* Toggles */}
            <div className="pt-3 border-t border-slate-150 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2.5">
                  {soundEnabled ? (
                    <Volume2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-slate-400" />
                  )}
                  <span className="font-bold text-slate-700">Alertes Sonores VIP</span>
                </div>
                <button
                  onClick={onToggleSound}
                  className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                    soundEnabled
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {soundEnabled ? 'ACTIVÉ' : 'DÉSACTIVÉ'}
                </button>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span className="font-bold text-slate-700">Bannières In-App Direct</span>
                </div>
                <button
                  onClick={() => setInAppAlerts(!inAppAlerts)}
                  className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                    inAppAlerts
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {inAppAlerts ? 'ACTIVÉ' : 'DÉSACTIVÉ'}
                </button>
              </div>
            </div>

            {/* Security Guarantee */}
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono justify-center pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Cryptage SSL - Aucune publicité ni spam - Signaux stricts uniquement</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
