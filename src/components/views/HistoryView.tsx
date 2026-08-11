import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, CheckCircle2, XCircle, TrendingUp, Award, Clock } from 'lucide-react';
import { TradeSetup, DailyStats } from '../../types';

interface HistoryViewProps {
  trades: TradeSetup[];
  dailyStats: DailyStats;
  onOpenSetupDetail: (setup: TradeSetup) => void;
  isVisitor?: boolean;
  onOpenSubscribeModal?: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  trades,
  dailyStats,
  onOpenSetupDetail,
  isVisitor = false,
  onOpenSubscribeModal,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'WINNERS' | 'LOSERS'>('ALL');

  const closedTrades = trades.filter((t) => t.status !== 'ACTIVE');
  const winners = closedTrades.filter((t) => t.status === 'TP_HIT');
  const losers = closedTrades.filter((t) => t.status === 'SL_HIT');

  let filteredTrades: TradeSetup[] = [];
  if (filter === 'WINNERS') {
    filteredTrades = winners;
  } else if (filter === 'LOSERS') {
    filteredTrades = losers;
  } else {
    filteredTrades = closedTrades;
  }

  return (
    <div className="space-y-4 sm:space-y-6 font-sans pb-2">
      
      {/* Title Header */}
      <div className="bg-white dark:bg-[#0B132B] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white font-mono uppercase tracking-wide">
            HISTORIQUE & PERFORMANCE XAU/USD
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-sans mt-0.5">
            Relevé de compte en temps réel des setups SMC/ICT clôturés
          </p>
        </div>

        <div className="text-xs font-mono font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 self-start sm:self-auto">
          Audit Temps Réel Verifié
        </div>
      </div>

      {/* TOP STATS SUMMARY CARD */}
      <div className="bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3 font-mono">
        <div className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
          <span>STATISTIQUES GLOBALES DU TERMINAL</span>
          <span className="text-emerald-500 text-xs">Win Rate Cible &gt; 93%</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs sm:text-sm">
          <div className="bg-slate-50 dark:bg-[#060D1E] p-3 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <div className="text-xs text-slate-400 font-sans font-bold uppercase">Win Rate</div>
            <div className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
              {dailyStats.winRate}%
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-[#060D1E] p-3 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <div className="text-xs text-slate-400 font-sans font-bold uppercase">Performance</div>
            <div className={`text-base sm:text-lg font-black mt-0.5 ${dailyStats.totalPips >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {dailyStats.totalPips >= 0 ? '+' : ''}{dailyStats.totalPips} pips
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-[#060D1E] p-3 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <div className="text-xs text-slate-400 font-sans font-bold uppercase">R:R Moyen</div>
            <div className="text-base sm:text-lg font-black text-amber-500 mt-0.5">
              1:{dailyStats.avgRR.toFixed(2)}
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-[#060D1E] p-3 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <div className="text-xs text-slate-400 font-sans font-bold uppercase">Total Setups</div>
            <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-0.5">
              {closedTrades.length}
            </div>
          </div>
        </div>
      </div>

      {/* FILTER SUB-TABS (Tous | Gagnants | Perdants) - Touch Friendly 44px+ */}
      <div className="grid grid-cols-3 bg-slate-100 dark:bg-[#081226] p-1.5 rounded-2xl font-mono text-xs sm:text-sm text-center border border-slate-200/80 dark:border-slate-800">
        <button
          onClick={() => setFilter('ALL')}
          className={`min-h-[44px] py-2.5 rounded-xl font-extrabold transition-all cursor-pointer ${
            filter === 'ALL'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Tous ({closedTrades.length})
        </button>

        <button
          onClick={() => setFilter('WINNERS')}
          className={`min-h-[44px] py-2.5 rounded-xl font-extrabold transition-all cursor-pointer ${
            filter === 'WINNERS'
              ? 'bg-emerald-500 text-white shadow-md'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Gagnants ({winners.length})
        </button>

        <button
          onClick={() => setFilter('LOSERS')}
          className={`min-h-[44px] py-2.5 rounded-xl font-extrabold transition-all cursor-pointer ${
            filter === 'LOSERS'
              ? 'bg-rose-500 text-white shadow-md'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Perdants ({losers.length})
        </button>
      </div>

      {/* HISTORICAL CARDS GRID (1 col mobile, 2-3 cols tablet/desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
        {filteredTrades.length === 0 ? (
          <div className="col-span-full bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 rounded-2xl p-8 sm:p-12 text-center text-slate-500 dark:text-slate-400 font-mono text-xs sm:text-sm">
            Aucun trade clôturé dans la catégorie sélectionnée.
          </div>
        ) : (
          filteredTrades.map((setup) => {
            const isBuy = setup.type === 'BUY';
            const isTpHit = setup.status === 'TP_HIT';
            const pnlPips = setup.pnlPips || (isTpHit ? setup.rewardPips : -setup.riskPips);

            return (
              <div
                key={setup.id}
                onClick={() => onOpenSetupDetail(setup)}
                className="bg-white dark:bg-[#0B132B] border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-4 flex items-center justify-between hover:border-amber-400 transition-all shadow-xs cursor-pointer font-mono"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-white shrink-0 ${
                      isBuy ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                  >
                    {isBuy ? <ArrowUpRight className="w-5 h-5 stroke-[3]" /> : <ArrowDownRight className="w-5 h-5 stroke-[3]" />}
                  </div>

                  <div>
                    <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{setup.type} XAU/USD</span>
                      <span className="text-xs text-slate-400 font-normal">#{setup.ticketNumber}</span>
                    </div>

                    <div className="text-xs text-slate-400 font-sans mt-0.5">
                      Entrée: ${setup.entryPrice.toFixed(2)} • Clôture: {setup.closedPrice ? `$${setup.closedPrice.toFixed(2)}` : '-'}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className={`text-xs sm:text-sm font-black ${
                      pnlPips >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {pnlPips >= 0 ? `+${pnlPips}` : pnlPips} pips
                  </div>

                  <div className="text-xs text-slate-400 font-sans mt-0.5">
                    {setup.closedAt || setup.timestamp}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
