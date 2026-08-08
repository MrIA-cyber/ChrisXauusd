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
  MAX_DAILY_TRADES,
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
} from './lib/subscriptionService';
import {
  saveSetupToFirestore,
  saveMultipleSetupsToFirestore,
  subscribeToSetupsFromFirestore,
  saveUserSubscriptionToFirestore,
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

  const handleOpenCalendar = () => {
    setProfileModalTab('CALENDAR');
    setIsProfileModalOpen(true);
  };

  const handleOpenProfile = () => {
    setProfileModalTab('PHOTO');
    setIsProfileModalOpen(true);
  };

  // Admin Portal Mode State (Triggered via /admin.chris or Ctrl+Shift+A)
  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    const path = window.location.pathname;
    const search = window.location.search;
    const hash = window.location.hash;
    return path.includes('admin.chris') || search.includes('admin.chris') || hash.includes('admin.chris');
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
    const interval = setInterval(fetchQuote, 10000); // Refresh live baseline every 10 seconds

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
    if (tradesRef.current.length >= MAX_DAILY_TRADES) return;
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

  // Ensure 1 active signal is running at initial load (if daily limit not reached)
  useEffect(() => {
    const hasActive = tradesRef.current.some((t) => t.status === 'ACTIVE');
    if (!hasActive && !isAnalyzingRef.current && tradesRef.current.length < MAX_DAILY_TRADES) {
      handleGenerateNewSignal();
    }
  }, []);

  // Sequential Auto Signal Checker (ensures next signal triggers if no active signal exists)
  useEffect(() => {
    if (!autoSignalActive) return;

    const signalTimer = setInterval(() => {
      const activeCount = tradesRef.current.filter((t) => t.status === 'ACTIVE').length;
      if (activeCount === 0 && !isAnalyzingRef.current && tradesRef.current.length < MAX_DAILY_TRADES) {
        triggerNextSequentialSignal();
      }
    }, 4000);

    return () => clearInterval(signalTimer);
  }, [autoSignalActive]);

  // Manual / Auto Signal Generator Trigger (strictly maintains 1 active signal at a time, max 4 trades per day)
  const handleGenerateNewSignal = (forceType?: 'BUY' | 'SELL') => {
    const hasActive = tradesRef.current.some((t) => t.status === 'ACTIVE');
    if (tradesRef.current.length >= MAX_DAILY_TRADES && !hasActive) {
      alert("Quota journalier atteint (4/4 trades). La plateforme ChrisXauusd est limitée à un maximum de 4 trades par jour pour garantir une gestion stricte du risque.");
      return;
    }

    const newSetup = createNewTradeSetup(currentPriceRef.current, forceType);
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
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed top-1/3 right-10 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed bottom-10 left-10 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none z-0" />

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
      <main className="flex-1 max-w-7xl w-full mx-auto px-2.5 sm:px-6 lg:px-8 py-3 sm:py-6 space-y-4 sm:space-y-6 relative z-10">
        
        {isVisitor ? (
          /* Institutional Visitor Landing Presentation Page */
          <VisitorLandingView
            onOpenSubscribeModal={() => setIsSubscribeModalOpen(true)}
            onOpenLoginModal={() => setIsLoginModalOpen(true)}
          />
        ) : (
          /* Active Subscriber VIP Real-Time Trading Terminal */
          <>
            {/* 5. Daily Statistics Cards */}
            <StatsGrid stats={dailyStats} />

            {/* 6. Main Active Setups & Live Chart Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column (7 cols): Active Sequential Trade Setup Ticket */}
              <div className="lg:col-span-7 space-y-4">
                
                {/* Section Header Card */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4.5 rounded-[20px] border border-slate-200/80 shadow-[0_10px_30px_rgba(15,23,42,0.05)] backdrop-blur-md gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                    <div>
                      <h2 className="text-xs sm:text-sm font-bold text-[#0F172A] flex items-center gap-2 font-mono">
                        <Ticket className="w-4 h-4 text-amber-500" />
                        <span>SIGNAL SÉQUENTIEL EN TEMPS RÉEL</span>
                      </h2>
                      <div className="text-[11px] font-mono font-semibold text-slate-500 mt-0.5">
                        Quota quotidien : <strong className="text-amber-600">{trades.length} / {MAX_DAILY_TRADES} trades max</strong>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs font-mono shrink-0">
                    <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> VIP
                    </span>
                    <button
                      onClick={() => handleGenerateNewSignal('BUY')}
                      disabled={trades.length >= MAX_DAILY_TRADES && !activeSetup}
                      className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white border border-emerald-700 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
                    >
                      + ACHAT
                    </button>
                    <button
                      onClick={() => handleGenerateNewSignal('SELL')}
                      disabled={trades.length >= MAX_DAILY_TRADES && !activeSetup}
                      className="bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed text-white border border-rose-700 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
                    >
                      + VENTE
                    </button>
                  </div>
                </div>

                {/* Daily Quota Reached Banner */}
                {trades.length >= MAX_DAILY_TRADES && !activeSetup && !isAnalyzingNextSignal && (
                  <div className="bg-[#0F172A] border-2 border-amber-500 rounded-[20px] p-5 text-white font-mono space-y-2.5 shadow-xl">
                    <div className="flex items-center gap-2.5 text-amber-400 font-black text-sm uppercase">
                      <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
                      <span>QUOTA MAXIMUM DE {MAX_DAILY_TRADES} TRADES PAR JOUR ATTEINT ({trades.length}/{MAX_DAILY_TRADES})</span>
                    </div>
                    <p className="text-xs text-slate-300 font-sans leading-relaxed">
                      Afin d'assurer une régularité maximale et de respecter une discipline stricte de gestion du capital, la plateforme <strong>ChrisXauusd</strong> est limitée à <strong>un maximum de {MAX_DAILY_TRADES} trades par jour</strong> sur le Gold (XAU/USD). Tous les trades programmés pour aujourd'hui ont été exécutés.
                    </p>
                  </div>
                )}

                {/* Analysis Transition State Banner when generating next signal */}
                {isAnalyzingNextSignal && (
                  <div className="bg-amber-50/90 border border-amber-300 rounded-[20px] p-4.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-[0_10px_25px_rgba(245,158,11,0.1)] font-mono animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 shrink-0">
                        <Sparkles className="w-5 h-5 animate-spin" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-2">
                          <span>ANALYSE DU MARCHÉ & PRÉPARATION DU PROCHAIN SIGNAL</span>
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                        </div>
                        <p className="text-[11px] text-slate-700 mt-0.5 font-sans">
                          Balayage des zones d'Order Block M1/M5 et validation des confluences (R:R ≥ 1:1.5)...
                        </p>
                      </div>
                    </div>
                    <div className="bg-white px-3 py-1 rounded-xl border border-amber-300 text-amber-800 font-bold text-xs whitespace-nowrap shadow-xs">
                      Signal imminent ({nextSignalCountdown > 0 ? `${nextSignalCountdown}s` : '1s'})
                    </div>
                  </div>
                )}

                {/* Render Primary Active Signal Ticket */}
                <div className="space-y-3">
                  <div className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between px-1">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      {activeSetup ? 'SIGNAL ACTIF EN COURS' : 'DERNIER SIGNAL CLÔTURÉ'}
                    </span>
                    {activeSetup && (
                      <span className="text-amber-600 text-[11px] font-bold animate-pulse">● Suivi du prix en temps réel</span>
                    )}
                  </div>

                  {displayedTicket ? (
                    <TradeTicket
                      key={displayedTicket.id}
                      setup={displayedTicket}
                      currentTick={currentTick}
                      onSelectSetup={(s) => setSelectedTicket(s)}
                      isVisitor={isVisitor}
                      onOpenSubscribeModal={() => setIsSubscribeModalOpen(true)}
                      index={0}
                    />
                  ) : (
                    <div className="bg-white border border-slate-200/80 rounded-[20px] p-8 text-center text-slate-500 font-mono shadow-sm">
                      Génération du premier ticket de trade en cours...
                    </div>
                  )}
                </div>

                {/* Recent Closed Signals History preview */}
                {recentClosedTickets.length > 0 && (
                  <div className="space-y-3 pt-2 border-t border-slate-200">
                    <div className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between px-1">
                      <span>HISTORIQUE DES DERNIERS SIGNALS CLÔTURÉS</span>
                      <span className="text-[10px] text-slate-400">Ordre Chronologique</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {recentClosedTickets.map((setup, idx) => (
                        <TradeTicket
                          key={setup.id}
                          setup={setup}
                          currentTick={currentTick}
                          onSelectSetup={(s) => setSelectedTicket(s)}
                          isVisitor={isVisitor}
                          onOpenSubscribeModal={() => setIsSubscribeModalOpen(true)}
                          index={idx + 1}
                        />
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Right Column (5 cols): Interactive Chart & Signal Details */}
              <div className="lg:col-span-5 space-y-4">
                <LiveChartWidget
                  candles={candles}
                  currentTick={currentTick}
                  activeSetup={selectedTicket || activeSetup || null}
                />

                {/* Quick Risk Rules Card */}
                <div className="bg-white border border-slate-200/80 rounded-[20px] p-4.5 text-xs font-mono space-y-3 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
                  <div className="flex items-center justify-between text-[#0F172A] font-bold border-b border-slate-100 pb-2.5">
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-amber-500" /> RÈGLES DE SCALPING STRICTES
                    </span>
                    <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-bold">
                      VERIFIED
                    </span>
                  </div>
                  <ul className="space-y-2 text-slate-600 text-[11px] list-disc list-inside font-sans">
                    <li><strong className="text-rose-600 font-mono font-bold">Stop Loss Obligatoire :</strong> Aucun trade ne peut être émis sans SL défini.</li>
                    <li><strong className="text-amber-700 font-mono font-bold">Ratio Risque/Rendement :</strong> Tous les tickets exigent au minimum R:R 1:1.50.</li>
                    <li><strong className="text-emerald-700 font-mono font-bold">Prise de Profits Scalp :</strong> Objectifs de 20 à 60 pips sur l'Or.</li>
                  </ul>
                </div>
              </div>

            </div>

            {/* 6.5. Live Signals from Railway Backend API */}
            <RailwayLiveSignals />

            {/* 7. Trade Journal Table (Full Session History) */}
            <TradeJournalTable
              trades={trades}
              isVisitor={isVisitor}
              onOpenSubscribeModal={() => setIsSubscribeModalOpen(true)}
            />

            {/* 8. News & Education Section */}
            <NewsAndEducationSection
              isVisitor={isVisitor}
              onOpenSubscribeModal={() => setIsSubscribeModalOpen(true)}
              onOpenEbookModal={() => setIsEbookModalOpen(true)}
            />

            {/* 9. Premium User Reviews Section */}
            <UserReviewsSection
              isVisitor={isVisitor}
              onOpenSubscribeModal={() => setIsSubscribeModalOpen(true)}
              onOpenLoginModal={() => setIsLoginModalOpen(true)}
            />
          </>
        )}

      </main>

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

      {/* 9. Legal Footer */}
      <LegalFooter />

    </div>
  );
}

