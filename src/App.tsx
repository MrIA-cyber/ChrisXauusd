import React, { useState, useEffect, useRef } from 'react';
import {
  PriceTick,
  TradeSetup,
  Candle,
  MarketSession,
  DailyStats,
  UserSubscription,
  AuthUser,
} from './types';
import {
  createNewTradeSetup,
  generateInitialHistory,
  getMarketSessions,
  generateInitialCandles,
  calculateDailyStats,
} from './lib/marketEngine';
import { soundService } from './lib/audioService';
import {
  sendNewSignalWebNotification,
  sendTpNotification,
  sendSlNotification,
} from './lib/notificationService';
import {
  loadSavedSubscription,
  saveSubscription,
  loadSavedUserSession,
  saveUserSession,
  calculateSubscriptionDetails,
  createDatesForDaysLeft,
  generateActiveSubscription,
  getLocalDeviceId,
} from './lib/subscriptionService';
import {
  saveSetupToFirestore,
  saveMultipleSetupsToFirestore,
  subscribeToSetupsFromFirestore,
  saveUserSubscriptionToFirestore,
  registerDeviceSessionInFirestore,
  subscribeToUserSubscriptionFromFirestore,
} from './lib/firebase';
import { fetchLiveXauUsdQuote } from './lib/twelveDataService';

import { TerminalHeader } from './components/TerminalHeader';
import { LivePriceBanner } from './components/LivePriceBanner';
import { StatsGrid } from './components/StatsGrid';
import { TradeTicket } from './components/TradeTicket';
import { LiveChartWidget } from './components/LiveChartWidget';
import { TradeJournalTable } from './components/TradeJournalTable';
import { RailwayLiveSignals } from './components/RailwayLiveSignals';
import { RiskCalculatorModal } from './components/RiskCalculatorModal';
import { LegalFooter } from './components/LegalFooter';

import { SubscriptionBanner } from './components/SubscriptionBanner';
import { SubscriptionModal } from './components/SubscriptionModal';
import { LoginModal } from './components/LoginModal';
import { ExpirationAlertModal } from './components/ExpirationAlertModal';
import { NewsAndEducationSection } from './components/NewsAndEducationSection';
import { UserReviewsSection } from './components/UserReviewsSection';
import { VisitorLandingView } from './components/VisitorLandingView';
import { AdminPortal } from './components/admin/AdminPortal';
import { SecretAdminModal } from './components/admin/SecretAdminModal';
import { OnboardingProfileSelector } from './components/OnboardingProfileSelector';
import { ChrisBioBubble } from './components/ChrisBioBubble';
import { InstallPwaModal } from './components/InstallPwaModal';
import { UserProfileModal } from './components/UserProfileModal';
import { ScalpingEbookPdfModal } from './components/ScalpingEbookPdfModal';
import { DeviceConflictModal } from './components/DeviceConflictModal';
import { GlobalRankingCard } from './components/GlobalRankingCard';
import { MobileBottomNav, ActiveTabType } from './components/MobileBottomNav';
import { HomeView } from './components/views/HomeView';
import { SetupsView } from './components/views/SetupsView';
import { MarketView } from './components/views/MarketView';
import { HistoryView } from './components/views/HistoryView';
import { ProfileView } from './components/views/ProfileView';
import { SetupDetailModal } from './components/SetupDetailModal';

import { Zap, Ticket, ShieldCheck, Lock, Sparkles, Clock, CheckCircle2, ArrowRight, LogIn, Calendar, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  // Theme State ('light' | 'dark')
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('chrisxauusd_theme');
    return saved === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('chrisxauusd_theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // 1. Initial Market State Setup
  const [currentPrice, setCurrentPrice] = useState<number>(2385.50);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [autoSignalActive, setAutoSignalActive] = useState<boolean>(true);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState<boolean>(false);
  const [selectedTicket, setSelectedTicket] = useState<TradeSetup | null>(null);

  // 5-Section Mobile Navigation State & Progressive Setup Detail Modal
  const [activeTab, setActiveTab] = useState<ActiveTabType>('home');
  const [detailModalSetup, setDetailModalSetup] = useState<TradeSetup | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);

  const handleOpenSetupDetail = (setup: TradeSetup) => {
    setDetailModalSetup(setup);
    setIsDetailModalOpen(true);
  };

  // Sequential Signal Engine State
  const [isAnalyzingNextSignal, setIsAnalyzingNextSignal] = useState<boolean>(false);
  const [nextSignalCountdown, setNextSignalCountdown] = useState<number>(0);
  const isAnalyzingRef = useRef<boolean>(false);
  const autoSignalActiveRef = useRef<boolean>(autoSignalActive);
  autoSignalActiveRef.current = autoSignalActive;

  // Subscription & Authentication State
  const [subscription, setSubscription] = useState<UserSubscription>(() => loadSavedSubscription());
  const [userSession, setUserSession] = useState<AuthUser | null>(() => loadSavedUserSession());

  // Onboarding View State
  const [isOnboardingView, setIsOnboardingView] = useState<boolean>(() => {
    const savedProfileChoice = localStorage.getItem('xau_scalp_profile_choice_v1');
    const savedUser = loadSavedUserSession();
    const savedSub = loadSavedSubscription();
    // Skip onboarding if user is logged in as active trader or explicit profile choice saved
    if (savedUser || savedSub.status === 'ACTIVE' || savedSub.status === 'EXPIRING_SOON' || savedProfileChoice) {
      return false;
    }
    return true; // Show onboarding choice screen on initial visit
  });

  // Modal Controls State
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isExpirationAlertOpen, setIsExpirationAlertOpen] = useState<boolean>(false);
  const [expiredDateForAlert, setExpiredDateForAlert] = useState<string | null>(null);
  const [isSecretAdminModalOpen, setIsSecretAdminModalOpen] = useState<boolean>(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [profileModalTab, setProfileModalTab] = useState<'PHOTO' | 'INFO' | 'TRADING' | 'PREF' | 'CALENDAR'>('PHOTO');
  const [isEbookModalOpen, setIsEbookModalOpen] = useState<boolean>(false);

  // Single Device Licensing Enforcement State (1 abonnement = 1 compte = 1 appareil)
  const [isDeviceConflictModalOpen, setIsDeviceConflictModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!userSession || userSession.subscription?.status === 'VISITOR') {
      setIsDeviceConflictModalOpen(false);
      return;
    }

    const currentDeviceId = getLocalDeviceId();

    // Verify local device ID alignment
    if (userSession.activeDeviceId && userSession.activeDeviceId !== currentDeviceId) {
      setIsDeviceConflictModalOpen(true);
    }

    // Subscribe to Firestore for live subscription status & multi-device session updates
    if (userSession.id) {
      const unsub = subscribeToUserSubscriptionFromFirestore(userSession.id, (remoteSub, remoteDeviceId) => {
        if (remoteDeviceId && remoteDeviceId !== currentDeviceId) {
          setIsDeviceConflictModalOpen(true);
        }

        if (remoteSub && remoteSub.status) {
          setSubscription((prev) => {
            if (prev.status !== remoteSub.status || prev.daysRemaining !== remoteSub.daysRemaining) {
              saveSubscription(remoteSub);
              setUserSession((uPrev) => {
                if (!uPrev) return uPrev;
                const updated = { ...uPrev, subscription: remoteSub };
                saveUserSession(updated);
                return updated;
              });
              return remoteSub;
            }
            return prev;
          });
        }
      });
      return () => unsub();
    }
  }, [userSession]);

  const handleTransferToThisDevice = () => {
    if (!userSession) return;
    const currentDeviceId = getLocalDeviceId();
    const updatedUser: AuthUser = {
      ...userSession,
      activeDeviceId: currentDeviceId,
      lastDeviceLogin: new Date().toISOString(),
    };
    setUserSession(updatedUser);
    saveUserSession(updatedUser);
    registerDeviceSessionInFirestore(updatedUser.id, currentDeviceId);
    setIsDeviceConflictModalOpen(false);
  };

  const handleOpenCalendar = () => {
    setProfileModalTab('CALENDAR');
    setIsProfileModalOpen(true);
  };

  const handleOpenProfile = () => {
    setProfileModalTab('PHOTO');
    setIsProfileModalOpen(true);
  };

  // Admin Portal Mode State (Triggered via /admin.chris, Ctrl+Shift+A, or Admin Login)
  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    const path = window.location.pathname;
    const search = window.location.search;
    const hash = window.location.hash;
    const isAuthAdmin = localStorage.getItem('chris_admin_auth_v1') === 'true';
    return path.includes('admin.chris') || search.includes('admin.chris') || hash.includes('admin.chris') || isAuthAdmin;
  });

  useEffect(() => {
    const checkAdminRoute = () => {
      const path = window.location.pathname;
      const search = window.location.search;
      const hash = window.location.hash;
      if (path.includes('admin.chris') || search.includes('admin.chris') || hash.includes('admin.chris')) {
        setIsAdminMode(true);
      }
    };
    checkAdminRoute();
    window.addEventListener('popstate', checkAdminRoute);
    return () => window.removeEventListener('popstate', checkAdminRoute);
  }, []);

  // Keyboard shortcut (Ctrl + Shift + A) for discrete admin portal access
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminMode((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Chris Animated Bio Bubble State
  const [showBioBubble, setShowBioBubble] = useState<boolean>(false);
  const [bioProfileType, setBioProfileType] = useState<'VISITOR' | 'TRADER' | null>(null);

  // Derived state: Visitor if status is VISITOR or EXPIRED
  const isVisitor = subscription.status === 'VISITOR' || subscription.status === 'EXPIRED';

  // Check subscription expiration on mount
  useEffect(() => {
    if (subscription.startDate && subscription.expirationDate) {
      const refreshed = calculateSubscriptionDetails(subscription.startDate, subscription.expirationDate);
      if (refreshed.status === 'EXPIRED' && subscription.status !== 'EXPIRED' && subscription.status !== 'VISITOR') {
        // Expiration just occurred!
        setExpiredDateForAlert(subscription.expirationDate);
        setIsExpirationAlertOpen(true);
      }
      setSubscription(refreshed);
      saveSubscription(refreshed);
    }
  }, []);

  // Market Ticks State
  const [currentTick, setCurrentTick] = useState<PriceTick>({
    timestamp: Date.now(),
    price: 2385.50,
    bid: 2385.40,
    ask: 2385.60,
    spread: 0.20,
    high24h: 2398.80,
    low24h: 2374.10,
    change24h: 12.40,
    changePercent24h: 0.52,
  });

  // Candles & Sessions
  const [candles, setCandles] = useState<Candle[]>(() => generateInitialCandles(2385.50));
  const [marketSessions, setMarketSessions] = useState<MarketSession[]>(() => getMarketSessions());

  // Trades History and Active Setups
  const [trades, setTrades] = useState<TradeSetup[]>(() => generateInitialHistory(2385.50));

  // Firebase Firestore Real-Time Listener & Initial Seeding
  useEffect(() => {
    let unsubscribe: () => void = () => {};
    let isSubscribed = true;

    unsubscribe = subscribeToSetupsFromFirestore((firestoreSetups) => {
      if (!isSubscribed) return;
      if (firestoreSetups && firestoreSetups.length > 0) {
        // Keep active setup at top or sort by timestamp
        const sorted = [...firestoreSetups].sort((a, b) => {
          if (a.status === 'ACTIVE' && b.status !== 'ACTIVE') return -1;
          if (a.status !== 'ACTIVE' && b.status === 'ACTIVE') return 1;
          return 0;
        });
        setTrades(sorted);
      } else {
        // If Firestore is empty on first launch, seed initial setups
        const initial = generateInitialHistory(2385.50);
        saveMultipleSetupsToFirestore(initial);
      }
    });

    return () => {
      isSubscribed = false;
      unsubscribe();
    };
  }, []);

  // Twelve Data Real-Time Price Fetcher for XAU/USD (Gold)
  useEffect(() => {
    let isMounted = true;

    const fetchQuote = async () => {
      const quote = await fetchLiveXauUsdQuote();
      if (quote && isMounted) {
        const livePrice = quote.price;
        setCurrentPrice(livePrice);
        setCurrentTick((prev) => ({
          ...prev,
          price: livePrice,
          bid: Number((livePrice - 0.10).toFixed(2)),
          ask: Number((livePrice + 0.10).toFixed(2)),
          high24h: quote.high24h,
          low24h: quote.low24h,
          change24h: quote.change24h,
          changePercent24h: quote.changePercent24h,
        }));
      }
    };

    fetchQuote();
    const interval = setInterval(fetchQuote, 30000); // Refresh live baseline every 30 seconds (optimized for API quota)

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Refs for interval closures
  const currentPriceRef = useRef(currentPrice);
  currentPriceRef.current = currentPrice;

  const tradesRef = useRef(trades);
  tradesRef.current = trades;

  const soundEnabledRef = useRef(soundEnabled);
  soundEnabledRef.current = soundEnabled;

  // Trigger next sequential signal after a short 3.5s delay
  const triggerNextSequentialSignal = () => {
    if (isAnalyzingRef.current) return;
    isAnalyzingRef.current = true;
    setIsAnalyzingNextSignal(true);
    setNextSignalCountdown(3);

    const countdownInterval = setInterval(() => {
      setNextSignalCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setTimeout(() => {
      setIsAnalyzingNextSignal(false);
      isAnalyzingRef.current = false;
      if (autoSignalActiveRef.current) {
        handleGenerateNewSignal();
      }
    }, 3500);
  };

  // 2. Real-time Price Tick Simulation Loop (vibrates price every 1.5s)
  useEffect(() => {
    const tickInterval = setInterval(() => {
      const prevPrice = currentPriceRef.current;
      const delta = (Math.random() - 0.49) * 0.45;
      const newPrice = Number((prevPrice + delta).toFixed(2));
      const spread = Number((0.15 + Math.random() * 0.10).toFixed(2));
      const halfSpread = spread / 2;

      setCurrentPrice(newPrice);

      const newTick: PriceTick = {
        timestamp: Date.now(),
        price: newPrice,
        bid: Number((newPrice - halfSpread).toFixed(2)),
        ask: Number((newPrice + halfSpread).toFixed(2)),
        spread,
        high24h: Math.max(2398.80, newPrice),
        low24h: Math.min(2374.10, newPrice),
        change24h: Number((newPrice - 2373.10).toFixed(2)),
        changePercent24h: Number((((newPrice - 2373.10) / 2373.10) * 100).toFixed(2)),
      };
      setCurrentTick(newTick);

      // Update M1 Candle
      setCandles((prevCandles) => {
        if (!prevCandles.length) return prevCandles;
        const lastCandle = { ...prevCandles[prevCandles.length - 1] };
        lastCandle.close = newPrice;
        lastCandle.high = Math.max(lastCandle.high, newPrice);
        lastCandle.low = Math.min(lastCandle.low, newPrice);
        lastCandle.isGreen = lastCandle.close >= lastCandle.open;

        return [...prevCandles.slice(0, prevCandles.length - 1), lastCandle];
      });

      // Check Active Trades for TP or SL hit
      checkTradesStatus(newPrice);
    }, 1500);

    return () => clearInterval(tickInterval);
  }, []);

  // 3. Check Active Trade for TP or SL
  const checkTradesStatus = (price: number) => {
    const activeTrades = tradesRef.current.filter((t) => t.status === 'ACTIVE');
    if (activeTrades.length === 0) return;

    let updated = false;
    let tradeJustClosed = false;

    const newTrades = tradesRef.current.map((t) => {
      if (t.status !== 'ACTIVE') return t;

      const isBuy = t.type === 'BUY';
      let statusHit: 'TP_HIT' | 'SL_HIT' | null = null;

      if (isBuy) {
        if (price >= t.takeProfit) statusHit = 'TP_HIT';
        else if (price <= t.stopLoss) statusHit = 'SL_HIT';
      } else {
        if (price <= t.takeProfit) statusHit = 'TP_HIT';
        else if (price >= t.stopLoss) statusHit = 'SL_HIT';
      }

      if (statusHit) {
        updated = true;
        tradeJustClosed = true;
        const isWin = statusHit === 'TP_HIT';
        const pnlPips = isWin ? t.rewardPips : -t.riskPips;

        if (isWin) {
          soundService.playTpHitSound(soundEnabledRef.current);
          sendTpNotification(t.takeProfit, t.rewardPips);
        } else {
          soundService.playSlHitSound(soundEnabledRef.current);
          sendSlNotification(t.stopLoss);
        }

        const closedTrade = {
          ...t,
          status: statusHit,
          closedAt: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          closedPrice: price,
          pnlPips,
          pnlAmount: pnlPips * 10,
        };
        saveSetupToFirestore(closedTrade);
        return closedTrade;
      }

      return t;
    });

    if (updated) {
      setTrades(newTrades);
      if (tradeJustClosed) {
        triggerNextSequentialSignal();
      }
    }
  };

  // Ensure 1 active signal is running at initial load
  useEffect(() => {
    const hasActive = tradesRef.current.some((t) => t.status === 'ACTIVE');
    if (!hasActive && !isAnalyzingRef.current) {
      handleGenerateNewSignal();
    }
  }, []);

  // Sequential Auto Signal Checker (ensures next signal triggers if no active signal exists)
  useEffect(() => {
    if (!autoSignalActive) return;

    const signalTimer = setInterval(() => {
      const activeCount = tradesRef.current.filter((t) => t.status === 'ACTIVE').length;
      if (activeCount === 0 && !isAnalyzingRef.current) {
        triggerNextSequentialSignal();
      }
    }, 4000);

    return () => clearInterval(signalTimer);
  }, [autoSignalActive]);

  // Manual / Auto Signal Generator Trigger (strictly maintains 1 active signal at a time)
  const handleGenerateNewSignal = (forceType?: 'BUY' | 'SELL') => {

    const newSetup = createNewTradeSetup(currentPriceRef.current, forceType);
    if (!newSetup) {
      setIsAnalyzingNextSignal(false);
      return;
    }
    soundService.playNewSignalSound(soundEnabledRef.current);
    sendNewSignalWebNotification(newSetup.type, newSetup.entryPrice, newSetup.takeProfit, newSetup.stopLoss);
    saveSetupToFirestore(newSetup);

    setTrades((prev) => {
      // Close any previous active trades so only 1 active signal exists
      const sanitized = prev.map((t) => {
        if (t.status === 'ACTIVE') {
          const closed = {
            ...t,
            status: 'SL_HIT' as const,
            closedAt: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            closedPrice: currentPriceRef.current,
            pnlPips: -t.riskPips,
            pnlAmount: -t.riskPips * 10,
          };
          saveSetupToFirestore(closed);
          return closed;
        }
        return t;
      });
      return [newSetup, ...sanitized];
    });

    setSelectedTicket(newSetup);
  };

  // Onboarding & Profile Handlers
  const handleSelectVisitorProfile = () => {
    localStorage.setItem('xau_scalp_profile_choice_v1', 'VISITOR');
    setIsOnboardingView(false);
    setBioProfileType('VISITOR');
    setShowBioBubble(true);
    if (subscription.status !== 'VISITOR' && subscription.status !== 'EXPIRED') {
      const visitorSub: UserSubscription = {
        status: 'VISITOR',
        startDate: null,
        expirationDate: null,
        daysRemaining: 0,
        amountFcfa: 700000,
      };
      setSubscription(visitorSub);
      saveSubscription(visitorSub);
    }
  };

  const handleSelectTraderPayment = () => {
    setIsSubscribeModalOpen(true);
  };

  const handleChangeProfile = () => {
    setIsOnboardingView(true);
  };

  // Subscription Actions
  const handleSubscriptionActivated = (
    newSub: UserSubscription,
    userDetails?: { name: string; email: string }
  ) => {
    setSubscription(newSub);
    saveSubscription(newSub);

    const userId = userSession?.id || 'user-' + Date.now();
    const newUser: AuthUser = {
      id: userId,
      email: userDetails?.email || userSession?.email || 'trader@xau-scalp.com',
      name: userDetails?.name || userSession?.name || 'Abonné XAU',
      subscription: newSub,
    };

    setUserSession(newUser);
    saveUserSession(newUser);
    saveUserSubscriptionToFirestore(userId, newSub, { name: newUser.name, email: newUser.email });
    localStorage.setItem('xau_scalp_profile_choice_v1', 'TRADER');
    setIsOnboardingView(false); // Seamless redirect to main page with full access
    setBioProfileType('TRADER');
    setShowBioBubble(true);
  };

  const handleLoginSuccess = (user: AuthUser) => {
    setUserSession(user);
    saveUserSession(user);
    setSubscription(user.subscription);
    saveSubscription(user.subscription);
    saveUserSubscriptionToFirestore(user.id, user.subscription, { name: user.name, email: user.email, avatarUrl: user.avatarUrl });
    localStorage.setItem('xau_scalp_profile_choice_v1', 'TRADER');
    setIsOnboardingView(false); // Seamless redirect to main page
    setBioProfileType('TRADER');
    setShowBioBubble(true);

    // Auto-direct to Admin Portal if logging in as Admin
    if (
      user.id === 'admin-master' ||
      (user.phone && user.phone.includes('658151516')) ||
      user.email === 'admin@chrisxauusd.com' ||
      localStorage.getItem('chris_admin_auth_v1') === 'true'
    ) {
      setIsAdminMode(true);
    }
  };

  const handleSaveProfile = (updatedUser: AuthUser) => {
    setUserSession(updatedUser);
    saveUserSession(updatedUser);
    saveUserSubscriptionToFirestore(updatedUser.id, updatedUser.subscription, {
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      avatarUrl: updatedUser.avatarUrl,
    });

    // Sync profile changes with MongoDB backend
    if (updatedUser.email) {
      fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: updatedUser.email,
          name: updatedUser.name,
          phone: updatedUser.phone,
          avatarUrl: updatedUser.avatarUrl || '',
          subscription: updatedUser.subscription,
          traderLevel: updatedUser.traderLevel,
          tradingAccountBalance: updatedUser.tradingAccountBalance,
          preferredCurrency: updatedUser.preferredCurrency,
          preferredRiskPercentage: updatedUser.preferredRiskPercentage,
          tradingStyle: updatedUser.tradingStyle,
          telegramUsername: updatedUser.telegramUsername,
          tradingPlatform: updatedUser.tradingPlatform,
          privacyMode: updatedUser.privacyMode,
        }),
      }).catch((err) => console.log('API user profile sync notice:', err));
    }
  };

  const handleLogout = () => {
    setUserSession(null);
    saveUserSession(null);
    localStorage.removeItem('xau_scalp_profile_choice_v1');
    const visitorSub: UserSubscription = {
      status: 'VISITOR',
      startDate: null,
      expirationDate: null,
      daysRemaining: 0,
      amountFcfa: 700000,
    };
    setSubscription(visitorSub);
    saveSubscription(visitorSub);
  };

  // Demo Toolbar Simulators
  const handleSimulateDaysLeft = (daysLeft: number) => {
    const dates = createDatesForDaysLeft(daysLeft);
    const subDetails = calculateSubscriptionDetails(dates.startDate, dates.expirationDate);
    setSubscription(subDetails);
    saveSubscription(subDetails);

    if (daysLeft > 0) {
      const demoUser: AuthUser = {
        id: 'user-demo',
        email: 'trader.pro@xau-scalp.com',
        name: 'Abonné Démo',
        subscription: subDetails,
      };
      setUserSession(demoUser);
      saveUserSession(demoUser);
      localStorage.setItem('xau_scalp_profile_choice_v1', 'TRADER');
      setIsOnboardingView(false);
    } else {
      // Expiration simulation
      setExpiredDateForAlert(dates.expirationDate);
      setIsExpirationAlertOpen(true);
    }
  };

  const handleResetVisitor = () => {
    handleLogout();
  };

  // Calculate Daily Stats
  const dailyStats: DailyStats = calculateDailyStats(trades);

  // Active Setup vs Closed History
  const activeSetup = trades.find((t) => t.status === 'ACTIVE');
  const displayedTicket = activeSetup || trades[0];
  const recentClosedTickets = trades.filter((t) => t.status !== 'ACTIVE').slice(0, 3);

  // Render Private Admin Portal if route is /admin.chris or shortcut active
  if (isAdminMode) {
    return <AdminPortal onExitAdmin={() => setIsAdminMode(false)} />;
  }

  // Render Onboarding Profile Selection View if active
  if (isOnboardingView) {
    return (
      <div className="min-h-screen bg-[#FAFBFC] text-[#0F172A] flex flex-col font-sans selection:bg-amber-500 selection:text-white">
        <ChrisBioBubble
          isVisible={showBioBubble}
          onClose={() => setShowBioBubble(false)}
          profileType={bioProfileType}
        />

        <OnboardingProfileSelector
          onSelectVisitor={handleSelectVisitorProfile}
          onSelectTraderPayment={handleSelectTraderPayment}
          onOpenLoginModal={() => setIsLoginModalOpen(true)}
        />

        {/* Subscription Payment Simulation Modal */}
        <SubscriptionModal
          isOpen={isSubscribeModalOpen}
          onClose={() => setIsSubscribeModalOpen(false)}
          onSubscriptionActivated={(newSub, userDetails) => {
            handleSubscriptionActivated(newSub, userDetails);
            setIsOnboardingView(false);
          }}
          onSwitchToLogin={() => {
            setIsSubscribeModalOpen(false);
            setIsLoginModalOpen(true);
          }}
        />

        {/* Member Login Modal */}
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLoginSuccess={(user) => {
            handleLoginSuccess(user);
            setIsOnboardingView(false);
          }}
          onAdminLogin={() => setIsAdminMode(true)}
          onOpenSubscriptionModal={() => {
            setIsLoginModalOpen(false);
            setIsSubscribeModalOpen(true);
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] flex flex-col font-sans selection:bg-amber-500 selection:text-white relative overflow-x-hidden transition-colors duration-300">
      {/* Background Subtle Ambient Glows in Light Palette */}
      <div className="fixed top-0 left-1/4 w-[min(50vw,500px)] h-[min(50vw,500px)] bg-amber-500/5 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed top-1/3 right-10 w-[min(50vw,500px)] h-[min(50vw,500px)] bg-blue-600/5 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed bottom-10 left-10 w-[min(50vw,500px)] h-[min(50vw,500px)] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none z-0" />

      <ChrisBioBubble
        isVisible={showBioBubble}
        onClose={() => setShowBioBubble(false)}
        profileType={bioProfileType}
        onTriggerSecretAdmin={() => setIsSecretAdminModalOpen(true)}
      />
      
      {/* 1. Persistent J-3 Expiration Warning Banner */}
      <SubscriptionBanner
        subscription={subscription}
        onOpenRenewalModal={() => setIsSubscribeModalOpen(true)}
      />

      {/* 2. Terminal Header */}
      <TerminalHeader
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        autoSignalActive={autoSignalActive}
        onToggleAutoSignal={() => setAutoSignalActive(!autoSignalActive)}
        onManualGenerateSignal={() => handleGenerateNewSignal()}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
        marketSessions={marketSessions}
        userSession={userSession}
        subscription={subscription}
        onOpenSubscribeModal={() => setIsSubscribeModalOpen(true)}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onChangeProfile={handleChangeProfile}
        onOpenProfileModal={handleOpenProfile}
        onOpenCalendar={handleOpenCalendar}
        onLogout={handleLogout}
        onTriggerSecretAdmin={() => setIsSecretAdminModalOpen(true)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        onOpenEbookModal={() => setIsEbookModalOpen(true)}
      />

      {/* 4. Live Price Banner */}
      <LivePriceBanner currentTick={currentTick} recentCandles={candles} />

      {/* Main Content Dashboard */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-3 sm:px-6 py-3 sm:py-6 relative z-10 pb-24">
        
        {isVisitor ? (
          /* Institutional Visitor Landing Presentation Page */
          <VisitorLandingView
            onOpenSubscribeModal={() => setIsSubscribeModalOpen(true)}
            onOpenLoginModal={() => setIsLoginModalOpen(true)}
          />
        ) : (
          /* Active VIP Subscriber 5-Section Uncluttered Mobile Architecture */
          <>
            {activeTab === 'home' && (
              <HomeView
                activeSetup={activeSetup || null}
                latestSetup={trades[0] || null}
                currentTick={currentTick}
                marketSessions={marketSessions}
                dailyStats={dailyStats}
                isAnalyzingNextSignal={isAnalyzingNextSignal}
                nextSignalCountdown={nextSignalCountdown}
                onOpenSetupDetail={handleOpenSetupDetail}
                onGenerateNewSignal={handleGenerateNewSignal}
                isVisitor={isVisitor}
                onOpenSubscribeModal={() => setIsSubscribeModalOpen(true)}
              />
            )}

            {activeTab === 'setups' && (
              <SetupsView
                trades={trades}
                currentTick={currentTick}
                onOpenSetupDetail={handleOpenSetupDetail}
                isVisitor={isVisitor}
                onOpenSubscribeModal={() => setIsSubscribeModalOpen(true)}
              />
            )}

            {activeTab === 'market' && (
              <MarketView
                currentTick={currentTick}
                candles={candles}
                activeSetup={activeSetup || null}
                marketSessions={marketSessions}
              />
            )}

            {activeTab === 'history' && (
              <HistoryView
                trades={trades}
                dailyStats={dailyStats}
                onOpenSetupDetail={handleOpenSetupDetail}
                isVisitor={isVisitor}
                onOpenSubscribeModal={() => setIsSubscribeModalOpen(true)}
              />
            )}

            {activeTab === 'profile' && (
              <ProfileView
                userSession={userSession}
                subscription={subscription}
                soundEnabled={soundEnabled}
                onToggleSound={() => setSoundEnabled(!soundEnabled)}
                theme={theme}
                onToggleTheme={handleToggleTheme}
                onOpenSubscribeModal={() => setIsSubscribeModalOpen(true)}
                onOpenLoginModal={() => setIsLoginModalOpen(true)}
                onOpenProfileModal={handleOpenProfile}
                onOpenCalculator={() => setIsCalculatorOpen(true)}
                onOpenEbookModal={() => setIsEbookModalOpen(true)}
                onLogout={handleLogout}
              />
            )}
          </>
        )}

      </main>

      {/* Fixed 5-Section Mobile Bottom Navigation Bar */}
      {!isVisitor && (
        <MobileBottomNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          activeSetupCount={activeSetup ? 1 : 0}
        />
      )}

      {/* Setup Detail Modal with Progressive Disclosure Accordions */}
      <SetupDetailModal
        setup={detailModalSetup}
        currentTick={currentTick}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        isVisitor={isVisitor}
        onOpenSubscribeModal={() => setIsSubscribeModalOpen(true)}
      />

      {/* Subscription Payment Simulation Modal */}
      <SubscriptionModal
        isOpen={isSubscribeModalOpen}
        onClose={() => setIsSubscribeModalOpen(false)}
        onSubscriptionActivated={handleSubscriptionActivated}
        onSwitchToLogin={() => {
          setIsSubscribeModalOpen(false);
          setIsLoginModalOpen(true);
        }}
      />

      {/* Member Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onAdminLogin={() => setIsAdminMode(true)}
        onOpenSubscriptionModal={() => {
          setIsLoginModalOpen(false);
          setIsSubscribeModalOpen(true);
        }}
      />

      {/* Auto-Expiration Alert Modal */}
      <ExpirationAlertModal
        isOpen={isExpirationAlertOpen}
        onClose={() => setIsExpirationAlertOpen(false)}
        onOpenRenewalModal={() => setIsSubscribeModalOpen(true)}
        expirationDate={expiredDateForAlert}
      />

      {/* Risk Calculator Popup Modal */}
      <RiskCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      />

      {/* Secret Admin Login Modal */}
      <SecretAdminModal
        isOpen={isSecretAdminModalOpen}
        onClose={() => setIsSecretAdminModalOpen(false)}
        onAdminAuthenticated={() => {
          setIsAdminMode(true);
        }}
      />

      {/* PWA App Installation Guidance Modal */}
      <InstallPwaModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />

      {/* Subscriber Profile & Photo Management Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        userSession={userSession}
        onSaveProfile={handleSaveProfile}
        onOpenRenewalModal={() => setIsSubscribeModalOpen(true)}
        initialTab={profileModalTab}
      />

      {/* Scalping Masterclass Ebook PDF Modal */}
      <ScalpingEbookPdfModal
        isOpen={isEbookModalOpen}
        onClose={() => setIsEbookModalOpen(false)}
      />

      {/* Single Device Policy Modal (1 abonnement = 1 compte = 1 appareil) */}
      <DeviceConflictModal
        isOpen={isDeviceConflictModalOpen}
        user={userSession}
        onTransferToThisDevice={handleTransferToThisDevice}
        onLogout={handleLogout}
      />

      {/* 9. Legal Footer */}
      <LegalFooter />

    </div>
  );
}

