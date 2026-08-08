// Web Push & Browser Notifications Service for ChrisXauusd Terminal

export type NotificationPermissionState = 'default' | 'granted' | 'denied' | 'unsupported';

export function getNotificationPermission(): NotificationPermissionState {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission as NotificationPermissionState;
}

export async function requestWebNotificationPermission(): Promise<NotificationPermissionState> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }

  // Check if running inside an iframe where Notification API may be restricted by Permissions-Policy
  const isIframe = window.self !== window.top;

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      sendWebPushNotification('🛎️ Notifications ChrisXauusd activées', {
        body: 'Vous recevrez désormais les alertes VIP XAU/USD instantanément sur cet appareil.',
        tag: 'chrisxauusd-welcome',
      });
    } else if (permission === 'denied' && isIframe) {
      console.warn('Notification permission denied or restricted by iframe permissions policy.');
    }
    return permission as NotificationPermissionState;
  } catch (err) {
    console.error('Error requesting notification permission:', err);
    return getNotificationPermission();
  }
}

export function sendWebPushNotification(
  title: string,
  options?: NotificationOptions & { url?: string }
) {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return;
  }

  if (Notification.permission !== 'granted') {
    return;
  }

  try {
    const defaultOptions: NotificationOptions = {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      requireInteraction: false,
      ...options,
    };

    const notification = new Notification(title, defaultOptions);

    notification.onclick = (event) => {
      event.preventDefault();
      window.focus();
      if (options?.url) {
        window.open(options.url, '_blank');
      }
      notification.close();
    };
  } catch (err) {
    console.warn('Native Notification fallback error:', err);
  }
}

// Dedicated Signal Helpers
export function sendNewSignalWebNotification(type: 'BUY' | 'SELL', entryPrice: number, tp: number, sl: number, symbol = 'XAU/USD') {
  const isBuy = type === 'BUY';
  const emoji = isBuy ? '🚀' : '🔻';
  const actionText = isBuy ? 'ACHAT (BUY)' : 'VENTE (SELL)';

  sendWebPushNotification(`${emoji} NOUVEAU SIGNAL VIP CHRISXAUUSD`, {
    body: `${actionText} sur ${symbol} à ${entryPrice.toFixed(2)} FCFA/$\n🎯 TP: ${tp.toFixed(2)} | 🛑 SL: ${sl.toFixed(2)}`,
    tag: `signal-${Date.now()}`,
    requireInteraction: true,
  });
}

export function sendTpNotification(tpPrice: number, pips: number, symbol = 'XAU/USD') {
  sendWebPushNotification(`🎯 TAKE PROFIT ATTEINT - ${symbol}`, {
    body: `Le niveau TP à ${tpPrice.toFixed(2)} a été touché avec succès ! (+${pips} pips)`,
    tag: `tp-${Date.now()}`,
  });
}

export function sendSlNotification(slPrice: number, symbol = 'XAU/USD') {
  sendWebPushNotification(`🛑 STOP LOSS TOUCHÉ - ${symbol}`, {
    body: `Le niveau SL à ${slPrice.toFixed(2)} a été atteint. Respectez scrupuleusement la gestion de risque.`,
    tag: `sl-${Date.now()}`,
  });
}
