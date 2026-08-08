import { AuthUser, UserSubscription, SubscriptionStatus } from '../types';

export const SUBSCRIPTION_PRICE_FCFA = 700000;
export const SUBSCRIPTION_DURATION_DAYS = 30;
export const WARNING_THRESHOLD_DAYS = 3;

const SESSION_STORAGE_KEY = 'xau_scalp_user_session_v1';
const SUBSCRIPTION_STORAGE_KEY = 'xau_scalp_subscription_v1';

// Helper to format currency in FCFA (e.g., "700 000 FCFA")
export function formatFcfa(amount: number): string {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
}

// Helper to calculate days remaining until expiration
export function calculateSubscriptionDetails(
  startDateIso: string | null,
  expirationDateIso: string | null
): UserSubscription {
  if (!startDateIso || !expirationDateIso) {
    return {
      status: 'VISITOR',
      startDate: null,
      expirationDate: null,
      daysRemaining: 0,
      amountFcfa: SUBSCRIPTION_PRICE_FCFA,
    };
  }

  const now = new Date();
  const expDate = new Date(expirationDateIso);
  const diffTime = expDate.getTime() - now.getTime();
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let status: SubscriptionStatus = 'ACTIVE';

  if (daysRemaining <= 0) {
    status = 'EXPIRED';
  } else if (daysRemaining <= WARNING_THRESHOLD_DAYS) {
    status = 'EXPIRING_SOON';
  }

  return {
    status,
    startDate: startDateIso,
    expirationDate: expirationDateIso,
    daysRemaining: Math.max(0, daysRemaining),
    amountFcfa: SUBSCRIPTION_PRICE_FCFA,
  };
}

// Pre-configured Demo Accounts for Testing & Login Verification
export interface DemoAccount {
  email: string;
  phone: string;
  password: string; // "Gold2026!"
  name: string;
  avatarUrl?: string;
  subscriptionDaysLeft: number; // 28, 2, or -1 for expired
  description: string;
}

export interface PresetAvatar {
  id: string;
  name: string;
  url: string;
}

export const PRESET_TRADER_AVATARS: PresetAvatar[] = [
  {
    id: 'trader-1',
    name: 'Moussa (Trader PRO)',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
  },
  {
    id: 'trader-2',
    name: 'Koffi (VIP Scalper)',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
  },
  {
    id: 'trader-3',
    name: 'Pauline (Analyste Gold)',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  },
  {
    id: 'trader-4',
    name: 'Executive Alpha',
    url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=250',
  },
  {
    id: 'trader-5',
    name: 'Institutional Pro',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
  },
  {
    id: 'trader-6',
    name: 'Master Scalper',
    url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250',
  },
];

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    email: 'trader.pro@xau-scalp.com',
    phone: '+221 77 123 45 67',
    password: 'Gold2026!',
    name: 'Moussa Diop (Trader PRO)',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    subscriptionDaysLeft: 28,
    description: 'Abonné Actif (28 jours restants)',
  },
  {
    email: 'scalper.vip@xau-scalp.com',
    phone: '+225 07 89 01 23',
    password: 'Gold2026!',
    name: 'Koffi Armand (VIP Scalper)',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    subscriptionDaysLeft: 2,
    description: 'Expiration Proche (2 jours restants - Alerte J-3)',
  },
  {
    email: 'ancien.membre@xau-scalp.com',
    phone: '+237 690 12 34 56',
    password: 'Gold2026!',
    name: 'Pauline Mbida',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    subscriptionDaysLeft: -1,
    description: 'Abonnement Expiré (Date dépassée)',
  },
];

// Helper to create a subscription dates payload given a desired number of days remaining
export function createDatesForDaysLeft(daysLeft: number) {
  const now = new Date();
  const exp = new Date(now);
  exp.setDate(now.getDate() + daysLeft);

  const start = new Date(now);
  start.setDate(now.getDate() - (SUBSCRIPTION_DURATION_DAYS - daysLeft));

  return {
    startDate: start.toISOString(),
    expirationDate: exp.toISOString(),
  };
}

// Generate an active 30-day subscription object
export function generateActiveSubscription(paymentMethod = 'Mobile Money'): UserSubscription {
  const dates = createDatesForDaysLeft(30);
  return {
    status: 'ACTIVE',
    startDate: dates.startDate,
    expirationDate: dates.expirationDate,
    daysRemaining: 30,
    paymentMethod,
    amountFcfa: SUBSCRIPTION_PRICE_FCFA,
  };
}

// Load initial subscription state from localStorage or default to VISITOR
export function loadSavedSubscription(): UserSubscription {
  try {
    const raw = localStorage.getItem(SUBSCRIPTION_STORAGE_KEY);
    if (!raw) {
      return {
        status: 'VISITOR',
        startDate: null,
        expirationDate: null,
        daysRemaining: 0,
        amountFcfa: SUBSCRIPTION_PRICE_FCFA,
      };
    }
    const parsed = JSON.parse(raw);
    return calculateSubscriptionDetails(parsed.startDate, parsed.expirationDate);
  } catch (e) {
    return {
      status: 'VISITOR',
      startDate: null,
      expirationDate: null,
      daysRemaining: 0,
      amountFcfa: SUBSCRIPTION_PRICE_FCFA,
    };
  }
}

// Save subscription to localStorage
export function saveSubscription(sub: UserSubscription): void {
  try {
    localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, JSON.stringify(sub));
  } catch (e) {
    console.error('Failed to save subscription', e);
  }
}

// Load user session from localStorage
export function loadSavedUserSession(): AuthUser | null {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const user: AuthUser = JSON.parse(raw);
    // Refresh subscription status
    const refreshedSub = calculateSubscriptionDetails(
      user.subscription.startDate,
      user.subscription.expirationDate
    );
    user.subscription = refreshedSub;
    return user;
  } catch (e) {
    return null;
  }
}

// Save user session
export function saveUserSession(user: AuthUser | null): void {
  try {
    if (user) {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  } catch (e) {
    console.error('Failed to save user session', e);
  }
}

// Format date for display in French (e.g., "25 août 2026" or "25/08/2026")
export function formatDateFr(isoDateString: string | null): string {
  if (!isoDateString) return 'N/A';
  try {
    const date = new Date(isoDateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return isoDateString;
  }
}
