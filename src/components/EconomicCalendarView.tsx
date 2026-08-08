import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Zap,
  AlertTriangle,
  Info,
  TrendingUp,
  TrendingDown,
  Filter,
  RefreshCw,
  Flame,
  ShieldAlert,
  CheckCircle2,
  Globe,
} from 'lucide-react';
import { EconomicEvent, getRealEconomicEvents } from '../lib/economicCalendar';

export const EconomicCalendarView: React.FC = () => {
  const [events, setEvents] = useState<EconomicEvent[]>(() => getRealEconomicEvents());
  const [currencyFilter, setCurrencyFilter] = useState<'ALL' | 'USD' | 'EUR'>('ALL');
  const [impactFilter, setImpactFilter] = useState<'ALL' | 'HIGH'>('HIGH');
  const [lastRefreshed, setLastRefreshed] = useState<string>('');
  const [countdownText, setCountdownText] = useState<string>('');
  const [nextHighImpactEvent, setNextHighImpactEvent] = useState<EconomicEvent | null>(null);

  // Refresh events & timestamp
  const handleRefresh = () => {
    setEvents(getRealEconomicEvents());
    const now = new Date();
    setLastRefreshed(now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  };

  useEffect(() => {
    handleRefresh();
  }, []);

  // Calculate live countdown to next upcoming High Impact USD event
  useEffect(() => {
    const upcomingHighImpact = events
      .filter((e) => e.status === 'UPCOMING' && e.impact === 'HIGH')
      .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime())[0];

    setNextHighImpactEvent(upcomingHighImpact || null);

    if (!upcomingHighImpact) {
      setCountdownText('Aucun évènement imminents');
      return;
    }

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const target = upcomingHighImpact.dateObj.getTime();
      const diff = target - now;

      if (diff <= 0) {
        setCountdownText('🚨 EN COURS / EN DIRECT !');
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setCountdownText(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [events]);

  const filteredEvents = events.filter((ev) => {
    if (currencyFilter !== 'ALL' && ev.currency !== currencyFilter) return false;
    if (impactFilter === 'HIGH' && ev.impact !== 'HIGH') return false;
    return true;
  });

  return (
    <div className="space-y-5">
      {/* Header Banner & Live Countdown Box */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950 text-white rounded-2xl p-4 sm:p-5 border border-amber-500/30 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
              <Flame className="w-3 h-3 text-amber-400 animate-pulse" />
              <span>MACRO CALENDAR XAU/USD</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold flex items-center gap-2 text-amber-100">
              <Calendar className="w-4 h-4 text-amber-400" />
              Calendrier Économique Réel
            </h3>
            <p className="text-xs text-slate-300 max-w-xl">
              Annonces officielles, NFP, CPI & Décisions FED en direct. Anticipez la volatilité sur l'Or (XAU/USD).
            </p>
          </div>

          {/* Countdown Ticker Box */}
          {nextHighImpactEvent && (
            <div className="bg-slate-950/80 border border-amber-500/40 rounded-xl p-3 shrink-0 flex flex-col items-start md:items-end space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-amber-400 font-mono flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-400" /> Prochain Choc Macro USD
              </span>
              <span className="text-sm sm:text-base font-black font-mono text-emerald-400 tracking-tight">
                {countdownText}
              </span>
              <span className="text-[10px] text-slate-400 truncate max-w-[220px]">
                {nextHighImpactEvent.currencyFlag} {nextHighImpactEvent.eventName}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-100 dark:bg-slate-900/80 p-3 rounded-xl border border-[var(--border-color)]">
        <div className="flex flex-wrap items-center gap-2">
          {/* Currency Filter */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-950 p-1 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold">
            <button
              onClick={() => setCurrencyFilter('ALL')}
              className={`px-2 py-1 rounded transition-colors ${
                currencyFilter === 'ALL'
                  ? 'bg-amber-500 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setCurrencyFilter('USD')}
              className={`px-2 py-1 rounded transition-colors flex items-center gap-1 ${
                currencyFilter === 'USD'
                  ? 'bg-amber-500 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              🇺🇸 USD
            </button>
            <button
              onClick={() => setCurrencyFilter('EUR')}
              className={`px-2 py-1 rounded transition-colors flex items-center gap-1 ${
                currencyFilter === 'EUR'
                  ? 'bg-amber-500 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              🇪🇺 EUR
            </button>
          </div>

          {/* Impact Filter */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-950 p-1 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold">
            <button
              onClick={() => setImpactFilter('HIGH')}
              className={`px-2 py-1 rounded transition-colors flex items-center gap-1 ${
                impactFilter === 'HIGH'
                  ? 'bg-rose-500 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Flame className="w-3 h-3 text-rose-300" /> Impact Élevé 🔴
            </button>
            <button
              onClick={() => setImpactFilter('ALL')}
              className={`px-2 py-1 rounded transition-colors ${
                impactFilter === 'ALL'
                  ? 'bg-amber-500 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Tous
            </button>
          </div>
        </div>

        {/* Sync Status & Manual Refresh */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
            MàJ : {lastRefreshed}
          </span>
          <button
            onClick={handleRefresh}
            className="p-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 transition-all text-xs font-mono flex items-center gap-1 cursor-pointer"
            title="Rafraîchir les flux économiques"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Actualiser</span>
          </button>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-3">
        {filteredEvents.map((event) => {
          const isHighImpact = event.impact === 'HIGH';
          const isReleased = event.status === 'RELEASED';

          return (
            <div
              key={event.id}
              className={`p-4 rounded-xl border transition-all ${
                isHighImpact
                  ? 'bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/30 hover:border-amber-500/60'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                
                {/* Time, Country & Title */}
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 min-w-[70px] shrink-0 text-center">
                    <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">{event.dateStr}</span>
                    <span className="text-xs font-mono font-black text-amber-600 dark:text-amber-400">{event.timeGmt}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm">{event.currencyFlag}</span>
                      <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                        {event.currency}
                      </span>

                      {/* Impact Badge */}
                      {isHighImpact ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 flex items-center gap-1">
                          <Flame className="w-3 h-3 text-rose-500" /> Impact Élevé
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                          Moyen
                        </span>
                      )}

                      {/* Status Badge */}
                      {isReleased ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Publié
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/30 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-sky-500" /> À Venir
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {event.eventName}
                    </h4>
                  </div>
                </div>

                {/* Values Table (Actual / Forecast / Previous) */}
                <div className="flex items-center gap-3 shrink-0 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800/80 text-xs font-mono self-start sm:self-center">
                  <div className="text-center px-2">
                    <span className="text-[9px] text-slate-400 uppercase block font-bold">Actuel</span>
                    <span className={`font-bold ${
                      event.actual ? 'text-emerald-600 dark:text-emerald-400 font-black' : 'text-slate-400'
                    }`}>
                      {event.actual || '--'}
                    </span>
                  </div>
                  <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />
                  <div className="text-center px-2">
                    <span className="text-[9px] text-slate-400 uppercase block font-bold">Prévision</span>
                    <span className="text-slate-700 dark:text-slate-300 font-semibold">{event.forecast}</span>
                  </div>
                  <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />
                  <div className="text-center px-2">
                    <span className="text-[9px] text-slate-400 uppercase block font-bold">Précédent</span>
                    <span className="text-slate-500 font-semibold">{event.previous}</span>
                  </div>
                </div>

              </div>

              {/* XAU/USD Scalp Impact Guidance Note */}
              <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-800/60 flex items-start gap-2 text-xs text-amber-900 dark:text-amber-200 font-mono bg-amber-500/5 p-2 rounded-lg">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span>{event.xauImpactNote}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
