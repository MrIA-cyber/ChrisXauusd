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
  const [pushEnabled, setPushEnabled] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    const saved = localStorage.getItem('chrisxauusd_push_enabled');
    if (saved !== null) return saved === 'true';
    return getNotificationPermission() === 'granted';
  });
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
    const saved = localStorage.getItem('chrisxauusd_push_enabled');
    if (saved !== null) {
      setPushEnabled(saved === 'true');
    }
  }, [isOpen]);

  const handleTogglePushSetting = async () => {
    if (pushEnabled) {
      setPushEnabled(false);
      localStorage.setItem('chrisxauusd_push_enabled', 'false');
    } else {
      if (permission !== 'granted') {
        const res = await requestWebNotificationPermission();
        setPermission(res);
        if (res === 'granted') {
          setPushEnabled(true);
          localStorage.setItem('chrisxauusd_push_enabled', 'true');
        }
      } else {
        setPushEnabled(true);
        localStorage.setItem('chrisxauusd_push_enabled', 'true');
        sendWebPushNotification('🛎️ Notifications Push Activées', {
          body: 'Vous recevrez les alertes VIP instantanément.',
        });
      }
    }
  };

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

  // Keyboard Escape listener to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto cursor-pointer animate-fade-in font-sans"
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-lg bg-[#071426] rounded-3xl shadow-2xl border border-[#00E5FF]/30 overflow-hidden text-slate-100 my-auto cursor-default"
        >
          {/* Header */}
          <div className="relative px-6 pt-6 pb-5 bg-gradient-to-r from-[#030B16] via-[#071426] to-amber-950/80 text-white border-b border-slate-800">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
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
                <p className="text-xs text-amber-300/90 font-mono mt-0.5">
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
                ? 'bg-[#22C55E]/10 border-[#22C55E]/30 text-emerald-300'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
            }`}>
              {permission === 'granted' ? (
                <CheckCircle2 className="w-5 h-5 text-[#22C55E] shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              )}
              <div className="text-xs space-y-1 font-mono">
                <div className="font-bold uppercase tracking-wider text-[11px] text-white">
                  Statut Push Web : {permission === 'granted' ? 'ACTIVÉ (VIP)' : 'EN ATTENTE D\'ACTIVATION'}
                </div>
                <p className="font-sans text-slate-300 text-[11px] leading-relaxed">
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
                className="p-3.5 bg-[#00E5FF] text-[#030B16] rounded-2xl flex items-center justify-between gap-3 text-xs font-mono font-bold shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#030B16] animate-spin" />
                  <span>Notification de test émise avec succès !</span>
                </div>
                <span className="text-[10px] bg-[#030B16]/20 px-2 py-0.5 rounded-full font-black">100% OK</span>
              </motion.div>
            )}

            {/* Main Action Buttons */}
            <div className="space-y-2.5">
              {permission !== 'granted' && (
                <button
                  onClick={handleRequestPermission}
                  className="w-full py-3.5 px-4 bg-amber-400 hover:bg-amber-300 active:scale-[0.99] text-[#030B16] font-mono font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Bell className="w-4 h-4" />
                  <span>Activer les Notifications Push</span>
                  {isInIframe && <ExternalLink className="w-3.5 h-3.5 ml-1" />}
                </button>
              )}

              <button
                onClick={handleSendTestNotification}
                className="w-full py-3 px-4 bg-[#030B16] hover:bg-slate-900 active:scale-[0.99] text-[#00E5FF] font-mono font-bold text-xs rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#00E5FF]/30"
              >
                <BellRing className="w-4 h-4 text-amber-400" />
                <span>Tester une alerte signal (Son + Pop-up)</span>
              </button>

              {isInIframe && (
                <button
                  onClick={() => window.open(window.location.href, '_blank')}
                  className="w-full py-2.5 px-4 bg-[#030B16] hover:bg-slate-900 text-slate-300 font-mono font-semibold text-[11px] rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-800"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#00E5FF]" />
                  <span>Ouvrir dans un nouvel onglet (Pour autoriser le navigateur)</span>
                </button>
              )}
            </div>

            {/* Toggles */}
            <div className="pt-3 border-t border-slate-800 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between p-2.5 bg-[#030B16] rounded-xl border border-slate-800">
                <div className="flex items-center gap-2.5">
                  <Bell className={`w-4 h-4 ${pushEnabled && permission === 'granted' ? 'text-[#22C55E]' : 'text-slate-500'}`} />
                  <span className="font-bold text-slate-200">Notifications Push Web</span>
                </div>
                <button
                  onClick={handleTogglePushSetting}
                  className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                    pushEnabled && permission === 'granted'
                      ? 'bg-[#22C55E] text-[#030B16]'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {pushEnabled && permission === 'granted' ? 'ACTIVÉ' : 'DÉSACTIVÉ'}
                </button>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-[#030B16] rounded-xl border border-slate-800">
                <div className="flex items-center gap-2.5">
                  {soundEnabled ? (
                    <Volume2 className="w-4 h-4 text-[#22C55E]" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-slate-500" />
                  )}
                  <span className="font-bold text-slate-200">Alertes Sonores VIP</span>
                </div>
                <button
                  onClick={onToggleSound}
                  className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                    soundEnabled
                      ? 'bg-[#22C55E] text-[#030B16]'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {soundEnabled ? 'ACTIVÉ' : 'DÉSACTIVÉ'}
                </button>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-[#030B16] rounded-xl border border-slate-800">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-slate-200">Bannières In-App Direct</span>
                </div>
                <button
                  onClick={() => setInAppAlerts(!inAppAlerts)}
                  className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                    inAppAlerts
                      ? 'bg-[#22C55E] text-[#030B16]'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {inAppAlerts ? 'ACTIVÉ' : 'DÉSACTIVÉ'}
                </button>
              </div>
            </div>

            {/* Security Guarantee */}
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono justify-center pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#22C55E]" />
              <span>Cryptage SSL - Aucune publicité ni spam - Signaux stricts uniquement</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
