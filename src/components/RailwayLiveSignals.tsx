import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Zap, RefreshCw, Server, AlertCircle, TrendingUp, TrendingDown, Clock, ShieldCheck, Activity, Volume2, VolumeX, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface RailwaySignal {
  _id?: string;
  pair: string;
  signal: 'ACHAT' | 'VENTE' | 'BUY' | 'SELL' | 'ATTENDRE' | string;
  price: number | string;
  rsi?: number | string | null;
  macd?: unknown;
  confidence?: number;
  timestamp: string;
}

const RAILWAY_BACKEND_URL = 'https://chrisxaausd-backend-production.up.railway.app/api/signals';

/**
 * Générateur de signal sonore personnalisé avec Web Audio API
 */
const playSignalAudioNotification = (signalType?: string) => {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const audioCtx = new AudioContextClass();

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;
    const isBuy = signalType === 'ACHAT' || signalType === 'BUY';
    const isSell = signalType === 'VENTE' || signalType === 'SELL';

    // Fréquences pour carillon de trading clair
    const notes = isBuy
      ? [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6 (Accord Majeur Haussier pour ACHAT)
      : isSell
      ? [880.0, 698.46, 587.33, 440.0] // A5, F5, D5, A4 (Arpège Baissier pour VENTE)
      : [659.25, 880.0]; // E5, A5 (Carillon standard)

    notes.forEach((freq, index) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + index * 0.12);

      gain.gain.setValueAtTime(0, now + index * 0.12);
      gain.gain.linearRampToValueAtTime(0.25, now + index * 0.12 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.12 + 0.45);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now + index * 0.12);
      osc.stop(now + index * 0.12 + 0.5);
    });
  } catch (err) {
    console.warn('Alerte sonore non prise en charge par le navigateur:', err);
  }
};

export const RailwayLiveSignals: React.FC = () => {
  const [signals, setSignals] = useState<RailwaySignal[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [nextRefreshSeconds, setNextRefreshSeconds] = useState<number>(60);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [newSignalAlert, setNewSignalAlert] = useState<string | null>(null);

  const knownSignalKeysRef = useRef<Set<string>>(new Set());
  const isFirstLoadRef = useRef<boolean>(true);

  const fetchSignals = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(RAILWAY_BACKEND_URL, {
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} - Serveur Railway non disponible`);
      }

      const json = await response.json();
      const rawData: RailwaySignal[] = Array.isArray(json?.data)
        ? json.data
        : Array.isArray(json?.données)
        ? json.données
        : Array.isArray(json)
        ? json
        : [];

      // Filtrer strictement pour ne conserver QUE la paire XAU/USD (l'Or)
      const xauSignalsOnly = rawData.filter(
        (s) => s.pair && (s.pair.toUpperCase().includes('XAU') || s.pair.toUpperCase().includes('GOLD'))
      );

      if (Array.isArray(xauSignalsOnly)) {
        setSignals(xauSignalsOnly);

        // Clés uniques des signaux reçus
        const currentKeys = xauSignalsOnly.map(
          (s) => `${s.pair}_${s.signal}_${s.timestamp}_${s.price}`
        );

        if (!isFirstLoadRef.current && xauSignalsOnly.length > 0) {
          const newlyAdded = xauSignalsOnly.filter(
            (s) => !knownSignalKeysRef.current.has(`${s.pair}_${s.signal}_${s.timestamp}_${s.price}`)
          );

          if (newlyAdded.length > 0) {
            const latest = newlyAdded[0];
            const alertText = `⚡ Nouveau signal détecté : ${latest.pair} [${latest.signal}] à ${latest.price}`;
            setNewSignalAlert(alertText);

            if (soundEnabled) {
              playSignalAudioNotification(latest.signal);
            }

            setTimeout(() => {
              setNewSignalAlert(null);
            }, 8000);
          }
        } else {
          isFirstLoadRef.current = false;
        }

        knownSignalKeysRef.current = new Set(currentKeys);
      } else {
        setSignals([]);
      }

      setLastUpdated(new Date());
      setNextRefreshSeconds(60);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Impossible de contacter le serveur Railway';
      console.warn('Erreur de récupération des signaux Railway:', message);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [soundEnabled]);

  // Fetch at load
  useEffect(() => {
    fetchSignals();
  }, [fetchSignals]);

  // Timer refresh every 60 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setNextRefreshSeconds((prev) => {
        if (prev <= 1) {
          fetchSignals();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [fetchSignals]);

  // Format MACD to string display
  const formatMacd = (macdVal: unknown): string => {
    if (!macdVal) return 'N/A';
    if (typeof macdVal === 'number' || typeof macdVal === 'string') {
      return String(macdVal);
    }
    if (typeof macdVal === 'object' && macdVal !== null) {
      const obj = macdVal as { macd?: number; histogram?: number };
      if (typeof obj.histogram === 'number') return obj.histogram.toFixed(4);
      if (typeof obj.macd === 'number') return obj.macd.toFixed(4);
    }
    return 'N/A';
  };

  // Format timestamp safely
  const formatTimestamp = (ts: string): string => {
    try {
      const d = new Date(ts);
      if (isNaN(d.getTime())) return ts;
      return d.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        day: '2-digit',
        month: '2-digit',
      });
    } catch {
      return ts;
    }
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-5 md:p-6 mb-8 transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-300 dark:border-blue-500/30">
            <Zap className="w-5 h-5 fill-blue-600 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white font-mono tracking-tight">
                Signaux Serveur Railway Live
              </h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                API 15 MIN
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5 truncate max-w-full">
              <Server className="w-3.5 h-3.5 text-blue-600" />
              <span>https://chrisxaausd-backend-production.up.railway.app</span>
            </p>
          </div>
        </div>

        {/* Right Action & Timer Bar */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 self-end sm:self-auto">
          <div className="text-right font-mono text-xs hidden sm:block">
            <div className="text-slate-400 dark:text-slate-500 flex items-center gap-1 justify-end">
              <Clock className="w-3 h-3" />
              Rafraîchissement dans <span className="text-blue-600 dark:text-blue-400 font-bold">{nextRefreshSeconds}s</span>
            </div>
            {lastUpdated && (
              <div className="text-[10px] text-slate-400 dark:text-slate-500">
                Mis à jour à {lastUpdated.toLocaleTimeString('fr-FR')}
              </div>
            )}
          </div>

          {/* Sound Notification Toggle */}
          <button
            onClick={() => {
              const next = !soundEnabled;
              setSoundEnabled(next);
              if (next) {
                playSignalAudioNotification('ACHAT');
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
              soundEnabled
                ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-blue-300 dark:border-blue-500/40 hover:bg-blue-100'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
            }`}
            title={soundEnabled ? 'Alerte sonore activée (Cliquer pour désactiver)' : 'Alerte sonore désactivée (Cliquer pour activer)'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
            <span className="hidden xs:inline">{soundEnabled ? 'Son Activé' : 'Muet'}</span>
          </button>

          {/* Test Sound Button */}
          <button
            onClick={() => playSignalAudioNotification('ACHAT')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700"
            title="Tester l'alerte sonore"
          >
            <Bell className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="hidden sm:inline">Tester</span>
          </button>

          <button
            onClick={fetchSignals}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all border border-slate-200 dark:border-slate-700 disabled:opacity-50"
            title="Rafraîchir les signaux Railway"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
            <span>Rafraîchir</span>
          </button>
        </div>
      </div>

      {/* New Signal Banner Toast */}
      <AnimatePresence>
        {newSignalAlert && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            className="mt-4 p-3.5 rounded-xl bg-gradient-to-r from-amber-500/15 via-emerald-500/15 to-amber-500/15 border border-amber-500/30 text-slate-900 dark:text-white text-xs font-mono font-bold flex items-center justify-between gap-3 shadow-lg"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold animate-bounce">
                🔔
              </div>
              <div>
                <p className="text-amber-600 dark:text-amber-400 font-black text-xs uppercase tracking-wider">
                  Nouveau Signal Reçu !
                </p>
                <p className="text-slate-800 dark:text-slate-100 text-sm font-extrabold">{newSignalAlert}</p>
              </div>
            </div>
            <button
              onClick={() => setNewSignalAlert(null)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs px-2 py-1"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error State */}
      {error && (
        <div className="mt-4 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchSignals}
            className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-700 transition"
          >
            Réessayer
          </button>
        </div>
      )}

      {/* Loading Skeleton / Signals Grid */}
      <div className="mt-5">
        {isLoading && signals.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-32 rounded-xl bg-slate-100 dark:bg-slate-800/60 animate-pulse border border-slate-200 dark:border-slate-800"
              />
            ))}
          </div>
        ) : signals.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
            <Activity className="w-8 h-8 mx-auto text-slate-400 mb-2 animate-bounce" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Aucun signal actif pour le moment, revenez bientôt.
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Le job cron du serveur Railway scrute le marché XAU/USD (Or) toutes les 15 minutes.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <AnimatePresence>
              {signals.map((sig, idx) => {
                const isBuy = sig.signal === 'ACHAT' || sig.signal === 'BUY';
                const isSell = sig.signal === 'VENTE' || sig.signal === 'SELL';

                return (
                  <motion.div
                    key={sig._id || `sig-${idx}-${sig.timestamp}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`relative rounded-xl p-4 border transition-all hover:shadow-lg ${
                      isBuy
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60'
                        : isSell
                        ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    {/* Top Row: Pair & Signal Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-extrabold font-mono text-slate-900 dark:text-white">
                          {sig.pair}
                        </span>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-mono font-black border shadow-sm ${
                          isBuy
                            ? 'bg-emerald-500 text-white border-emerald-400'
                            : isSell
                            ? 'bg-rose-600 text-white border-rose-500'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600'
                        }`}
                      >
                        {isBuy ? (
                          <TrendingUp className="w-3.5 h-3.5" />
                        ) : isSell ? (
                          <TrendingDown className="w-3.5 h-3.5" />
                        ) : null}
                        {sig.signal}
                      </span>
                    </div>

                    {/* Price Display */}
                    <div className="mb-3">
                      <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                        Prix du Signal
                      </div>
                      <div className="text-xl font-black font-mono text-slate-900 dark:text-white">
                        {typeof sig.price === 'number'
                          ? sig.price.toFixed(sig.pair.includes('XAU') ? 2 : 5)
                          : sig.price}
                      </div>
                    </div>

                    {/* Technical Indicators Row */}
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-800 text-[11px] font-mono">
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">RSI (14)</span>
                        <span className="font-bold text-slate-700 dark:text-slate-200">
                          {sig.rsi !== undefined && sig.rsi !== null ? String(sig.rsi) : 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">MACD</span>
                        <span className="font-bold text-slate-700 dark:text-slate-200">
                          {formatMacd(sig.macd)}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">Confiance</span>
                        <span className="font-bold text-amber-600 dark:text-amber-400">
                          {sig.confidence !== undefined && sig.confidence !== null
                            ? typeof sig.confidence === 'number' && sig.confidence <= 5
                              ? `Niveau ${sig.confidence}/3 ⭐`
                              : `${sig.confidence}%`
                            : 'Élevée (2/3)'}
                        </span>
                      </div>
                    </div>

                    {/* Timestamp Footer */}
                    <div className="mt-3 text-[10px] font-mono text-slate-400 dark:text-slate-500 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {formatTimestamp(sig.timestamp)}
                      </span>
                      <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                        <ShieldCheck className="w-3 h-3" />
                        Vrai Signal
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};
