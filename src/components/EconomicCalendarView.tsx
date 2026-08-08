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
      <div className="bg-gradient-to-br from-[#071426] via-[#030B16] to-[#071426] text-white rounded-2xl p-4 sm:p-5 border border-[#00E5FF]/30 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00E5FF]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30">
              <Flame className="w-3 h-3 text-[#00E5FF] animate-pulse" />
              <span>MACRO CALENDAR XAU/USD</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold flex items-center gap-2 text-white">
              <Calendar className="w-4 h-4 text-[#00E5FF]" />
              Calendrier Économique Réel
            </h3>
            <p className="text-xs text-slate-300 max-w-xl">
              Annonces officielles, NFP, CPI & Décisions FED en direct. Anticipez la volatilité sur l'Or (XAU/USD).
            </p>
          </div>

          {/* Countdown Ticker Box */}
          {nextHighImpactEvent && (
            <div className="bg-[#030B16]/90 border border-[#00E5FF]/40 rounded-xl p-3 shrink-0 flex flex-col items-start md:items-end space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-[#00E5FF] font-mono flex items-center gap-1 font-bold">
                <Clock className="w-3 h-3 text-[#00E5FF]" /> Prochain Choc Macro USD
              </span>
              <span className="text-sm sm:text-base font-black font-mono text-[#22C55E] tracking-tight">
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
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#071426] p-3 rounded-xl border border-[#00E5FF]/20 text-slate-100">
        <div className="flex flex-wrap items-center gap-2">
          {/* Currency Filter */}
          <div className="flex items-center gap-1 bg-[#030B16] p-1 rounded-lg border border-[#00E5FF]/20 text-xs font-mono font-bold">
            <button
              onClick={() => setCurrencyFilter('ALL')}
              className={`px-2 py-1 rounded transition-colors ${
                currencyFilter === 'ALL'
                  ? 'bg-[#00E5FF] text-[#030B16] font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setCurrencyFilter('USD')}
              className={`px-2 py-1 rounded transition-colors flex items-center gap-1 ${
                currencyFilter === 'USD'
                  ? 'bg-[#00E5FF] text-[#030B16] font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🇺🇸 USD
            </button>
            <button
              onClick={() => setCurrencyFilter('EUR')}
              className={`px-2 py-1 rounded transition-colors flex items-center gap-1 ${
                currencyFilter === 'EUR'
                  ? 'bg-[#00E5FF] text-[#030B16] font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🇪🇺 EUR
            </button>
          </div>

          {/* Impact Filter */}
          <div className="flex items-center gap-1 bg-[#030B16] p-1 rounded-lg border border-[#00E5FF]/20 text-xs font-mono font-bold">
            <button
              onClick={() => setImpactFilter('HIGH')}
              className={`px-2 py-1 rounded transition-colors flex items-center gap-1 ${
                impactFilter === 'HIGH'
                  ? 'bg-[#EF4444] text-white font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Flame className="w-3 h-3 text-rose-300" /> Impact Élevé 🔴
            </button>
            <button
              onClick={() => setImpactFilter('ALL')}
              className={`px-2 py-1 rounded transition-colors ${
                impactFilter === 'ALL'
                  ? 'bg-[#00E5FF] text-[#030B16] font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Tous
            </button>
          </div>
        </div>

        {/* Sync Status & Manual Refresh */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
            MàJ : {lastRefreshed}
          </span>
          <button
            onClick={handleRefresh}
            className="p-1.5 rounded-lg bg-[#030B16] text-slate-200 hover:text-white border border-[#00E5FF]/30 transition-all text-xs font-mono flex items-center gap-1 cursor-pointer"
            title="Rafraîchir les flux économiques"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#00E5FF]" />
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
                  ? 'bg-[#071426] border-[#00E5FF]/30 hover:border-[#00E5FF]/60 shadow-md'
                  : 'bg-[#071426] border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                
                {/* Time, Country & Title */}
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center justify-center bg-[#030B16] px-2.5 py-1.5 rounded-lg border border-[#00E5FF]/20 min-w-[70px] shrink-0 text-center">
                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">{event.dateStr}</span>
                    <span className="text-xs font-mono font-black text-[#00E5FF]">{event.timeGmt}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm">{event.currencyFlag}</span>
                      <span className="text-xs font-mono font-bold text-white">
                        {event.currency}
                      </span>

                      {/* Impact Badge */}
                      {isHighImpact ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30 flex items-center gap-1">
                          <Flame className="w-3 h-3 text-[#EF4444]" /> Impact Élevé
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30">
                          Moyen
                        </span>
                      )}

                      {/* Status Badge */}
                      {isReleased ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-[#22C55E]" /> Publié
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#00E5FF]" /> À Venir
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-white">
                      {event.eventName}
                    </h4>
                  </div>
                </div>

                {/* Values Table (Actual / Forecast / Previous) */}
                <div className="flex items-center gap-3 shrink-0 bg-[#030B16] p-2.5 rounded-xl border border-[#00E5FF]/20 text-xs font-mono self-start sm:self-center">
                  <div className="text-center px-2">
                    <span className="text-[9px] text-slate-400 uppercase block font-bold">Actuel</span>
                    <span className={`font-bold ${
                      event.actual ? 'text-[#22C55E] font-black' : 'text-slate-400'
                    }`}>
                      {event.actual || '--'}
                    </span>
                  </div>
                  <div className="h-6 w-px bg-slate-800" />
                  <div className="text-center px-2">
                    <span className="text-[9px] text-slate-400 uppercase block font-bold">Prévision</span>
                    <span className="text-slate-200 font-semibold">{event.forecast}</span>
                  </div>
                  <div className="h-6 w-px bg-slate-800" />
                  <div className="text-center px-2">
                    <span className="text-[9px] text-slate-400 uppercase block font-bold">Précédent</span>
                    <span className="text-slate-400 font-semibold">{event.previous}</span>
                  </div>
                </div>

              </div>

              {/* XAU/USD Scalp Impact Guidance Note */}
              <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-start gap-2 text-xs text-slate-300 font-mono bg-[#030B16]/60 p-2 rounded-lg border border-[#00E5FF]/15">
                <ShieldAlert className="w-3.5 h-3.5 text-[#00E5FF] shrink-0 mt-0.5" />
                <span>{event.xauImpactNote}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
