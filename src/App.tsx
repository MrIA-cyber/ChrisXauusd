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
  loadSavedSubscription,
  saveSubscription,
  loadSavedUserSession,
  saveUserSession,
  calculateSubscriptionDetails,
  createDatesForDaysLeft,
  generateActiveSubscription,
} from './lib/subscriptionService';

import { RiskWarningBanner } from './components/RiskWarningBanner';
import { TerminalHeader } from './components/TerminalHeader';
import { LivePriceBanner } from './components/LivePriceBanner';
import { StatsGrid } from './components/StatsGrid';
import { TradeTicket } from './components/TradeTicket';
import { LiveChartWidget } from './components/LiveChartWidget';
import { TradeJournalTable } from './components/TradeJournalTable';
import { RiskCalculatorModal } from './components/RiskCalculatorModal';
import { LegalFooter } from './components/LegalFooter';

import { SubscriptionBanner } from './components/SubscriptionBanner';
import { SubscriptionModal } from './components/SubscriptionModal';
import { LoginModal } from './components/LoginModal';
import { ExpirationAlertModal } from './components/ExpirationAlertModal';
import { NewsAndEducationSection } from './components/NewsAndEducationSection';
import { OnboardingProfileSelector } from './components/OnboardingProfileSelector';
import { ChrisBioBubble } from './components/ChrisBioBubble';

import { Zap, Ticket, ShieldCheck, Lock, Sparkles, Clock, CheckCircle2, ArrowRight } from 'lucide-react';

export default function App() {
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
        } else {
          soundService.playSlHitSound(soundEnabledRef.current);
        }

        return {
          ...t,
          status: statusHit,
          closedAt: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          closedPrice: price,
          pnlPips,
          pnlAmount: pnlPips * 10,
        };
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
    soundService.playNewSignalSound(soundEnabledRef.current);

    setTrades((prev) => {
      // Close any previous active trades so only 1 active signal exists
      const sanitized = prev.map((t) => {
        if (t.status === 'ACTIVE') {
          return {
            ...t,
            status: 'SL_HIT' as const,
            closedAt: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            closedPrice: currentPriceRef.current,
            pnlPips: -t.riskPips,
            pnlAmount: -t.riskPips * 10,
          };
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

    const newUser: AuthUser = {
      id: userSession?.id || 'user-' + Date.now(),
      email: userDetails?.email || userSession?.email || 'trader@xau-scalp.com',
      name: userDetails?.name || userSession?.name || 'Abonné XAU',
      subscription: newSub,
    };

    setUserSession(newUser);
    saveUserSession(newUser);
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
    localStorage.setItem('xau_scalp_profile_choice_v1', 'TRADER');
    setIsOnboardingView(false); // Seamless redirect to main page
    setBioProfileType('TRADER');
    setShowBioBubble(true);
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

  // Render Onboarding Profile Selection View if active
  if (isOnboardingView) {
    return (
      <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
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
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <ChrisBioBubble
        isVisible={showBioBubble}
        onClose={() => setShowBioBubble(false)}
        profileType={bioProfileType}
      />
      
      {/* 1. Persistent J-3 Expiration Warning Banner */}
      <SubscriptionBanner
        subscription={subscription}
        onOpenRenewalModal={() => setIsSubscribeModalOpen(true)}
      />

      {/* 2. Permanent Risk Warning Banner */}
      <RiskWarningBanner />

      {/* 3. Terminal Header */}
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
        onLogout={handleLogout}
      />

      {/* 4. Live Price Banner */}
      <LivePriceBanner currentTick={currentTick} recentCandles={candles} />

      {/* Main Content Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-4 space-y-6">
        
        {/* Global Sticky Visitor Subscription Banner (Single Unique Banner) */}
        {isVisitor && (
          <div className="sticky top-2 z-30 bg-blue-900/95 border border-blue-700 text-white rounded-xl p-3 sm:p-3.5 shadow-xl backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-3 font-mono transition-shadow">
            <div className="flex items-start sm:items-center gap-2.5 sm:gap-3 w-full md:w-auto">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-800 border border-blue-600 flex items-center justify-center text-blue-200 shrink-0 mt-0.5 sm:mt-0">
                <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="text-xs">
                <div className="text-white font-bold flex items-center gap-2 text-xs sm:text-sm leading-tight">
                  <span>🔒 Mode Visiteur — Débloquez tous les signaux (700 000 FCFA/mois)</span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-blue-200 mt-0.5 font-sans sm:font-mono">
                  Accès instantané aux sens Achat/Vente, prix d'entrée exacts, Stop Loss et Take Profit en temps réel.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsSubscribeModalOpen(true)}
              className="w-full md:w-auto bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded-xl text-xs shadow-md active:scale-[0.97] transition-all flex items-center justify-center gap-1.5 shrink-0"
            >
              <Sparkles className="w-4 h-4 fill-current text-blue-200" />
              <span>S'abonner maintenant</span>
            </button>
          </div>
        )}

        {/* 5. Daily Statistics Cards (Visible to everyone) */}
        <StatsGrid stats={dailyStats} />

        {/* 6. Main Active Setups & Live Chart Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column (7 cols): Active Sequential Trade Setup Ticket */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Section Header */}
            <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping" />
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 font-mono">
                  <Ticket className="w-4 h-4 text-blue-600" />
                  <span>SIGNAL DE TRADING SÉQUENTIEL (1 SEUL EN COURS)</span>
                </h2>
              </div>
              
              <div className="flex items-center gap-2 text-xs font-mono">
                {!isVisitor ? (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Accès Abonné Actif
                  </span>
                ) : (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-blue-800 bg-blue-100 border border-blue-300 px-2 py-0.5 rounded-full">
                    <Lock className="w-3 h-3 text-blue-600" /> Mode Visiteur (Masqué)
                  </span>
                )}
                <button
                  onClick={() => handleGenerateNewSignal('BUY')}
                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-1 rounded-lg text-[10px] font-bold transition-all active:scale-95"
                >
                  + ACHAT
                </button>
                <button
                  onClick={() => handleGenerateNewSignal('SELL')}
                  className="bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 px-2 py-1 rounded-lg text-[10px] font-bold transition-all active:scale-95"
                >
                  + VENTE
                </button>
              </div>
            </div>

            {/* Analysis Transition State Banner when generating next signal */}
            {isAnalyzingNextSignal && (
              <div className="bg-blue-50 border border-blue-300 rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md font-mono animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 border border-blue-300 flex items-center justify-center text-blue-700 shrink-0">
                    <Sparkles className="w-5 h-5 animate-spin" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-2">
                      <span>ANALYSE DU MARCHÉ & PRÉPARATION DU PROCHAIN SIGNAL</span>
                      <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                    </div>
                    <p className="text-[11px] text-slate-700 mt-0.5 font-sans">
                      Balayage des zones d'Order Block M1/M5 et validation des confluences (R:R ≥ 1:1.5)...
                    </p>
                  </div>
                </div>
                <div className="bg-white px-3 py-1 rounded-lg border border-blue-200 text-blue-800 font-bold text-xs whitespace-nowrap">
                  Signal imminent ({nextSignalCountdown > 0 ? `${nextSignalCountdown}s` : '1s'})
                </div>
              </div>
            )}

            {/* Render Primary Active Signal Ticket */}
            <div className="space-y-3">
              <div className="text-xs font-mono font-bold text-slate-600 uppercase tracking-wider flex items-center justify-between px-1">
                <span>{activeSetup ? '🟢 SIGNAL ACTIF EN COURS' : '🏁 DERNIER SIGNAL CLÔTURÉ'}</span>
                {activeSetup && (
                  <span className="text-blue-700 text-[11px] animate-pulse">● Suivi du prix en temps réel</span>
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
                <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500 font-mono">
                  Génération du premier ticket de trade en cours...
                </div>
              )}
            </div>

            {/* Recent Closed Signals History preview */}
            {recentClosedTickets.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <div className="text-xs font-mono font-bold text-slate-600 uppercase tracking-wider flex items-center justify-between px-1">
                  <span>HISTORIQUE DES DERNIERS SIGNALS CLÔTURÉS</span>
                  <span className="text-[10px] text-slate-500">Ordre Chronologique</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
            <div className="bg-white border border-slate-200 rounded-xl p-4 text-xs font-mono space-y-2.5 shadow-sm">
              <div className="flex items-center justify-between text-blue-900 font-bold border-b border-slate-200 pb-2">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600" /> RÈGLES DE SCALPING STRICTES
                </span>
                <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                  VERIFIED
                </span>
              </div>
              <ul className="space-y-1.5 text-slate-700 text-[11px] list-disc list-inside font-sans">
                <li><strong className="text-rose-700 font-mono">Stop Loss Obligatoire :</strong> Aucun trade ne peut être émis sans SL défini.</li>
                <li><strong className="text-blue-800 font-mono">Ratio Risque/Rendement :</strong> Tous les tickets exigent au minimum R:R 1:1.50.</li>
                <li><strong className="text-emerald-700 font-mono">Prise de Profits Scalp :</strong> Objectifs de 20 à 60 pips sur l'Or.</li>
              </ul>
            </div>
          </div>

        </div>

        {/* 7. Trade Journal Table (Full Session History - Blurred for Visitors) */}
        <TradeJournalTable
          trades={trades}
          isVisitor={isVisitor}
          onOpenSubscribeModal={() => setIsSubscribeModalOpen(true)}
        />

        {/* 8. News & Education Section ("Actualités & Éducation" - Fully accessible to ALL) */}
        <NewsAndEducationSection
          isVisitor={isVisitor}
          onOpenSubscribeModal={() => setIsSubscribeModalOpen(true)}
        />

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

      {/* 9. Legal Footer */}
      <LegalFooter />

    </div>
  );
}

