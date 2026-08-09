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
    <div className="space-y-4 font-sans pb-2">
      
      {/* Title Header */}
      <div>
        <h2 className="text-base font-extrabold text-slate-900 dark:text-white font-mono">
          HISTORIQUE & PERFORMANCE
        </h2>
        <p className="text-[11px] text-slate-500 font-sans">
          Relevé de compte en temps réel des setups clôturés
        </p>
      </div>

      {/* TOP STATS SUMMARY CARD */}
      <div className="bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3 font-mono">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
          <span>Statistiques Globales</span>
          <span className="text-emerald-500 text-[10px]">Verified Audit</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
          <div className="bg-slate-50 dark:bg-[#060D1E] p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <div className="text-[10px] text-slate-400 font-sans">Win Rate</div>
            <div className="text-sm font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
              {dailyStats.winRate}%
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-[#060D1E] p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <div className="text-[10px] text-slate-400 font-sans">Performance</div>
            <div className={`text-sm font-black mt-0.5 ${dailyStats.totalPips >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {dailyStats.totalPips >= 0 ? '+' : ''}{dailyStats.totalPips} pips
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-[#060D1E] p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <div className="text-[10px] text-slate-400 font-sans">R:R Moyen</div>
            <div className="text-sm font-black text-amber-500 mt-0.5">
              1:{dailyStats.avgRR.toFixed(2)}
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-[#060D1E] p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <div className="text-[10px] text-slate-400 font-sans">Total Setups</div>
            <div className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
              {closedTrades.length}
            </div>
          </div>
        </div>
      </div>

      {/* FILTER SUB-TABS (Tous | Gagnants | Perdants) */}
      <div className="grid grid-cols-3 bg-slate-100 dark:bg-[#081226] p-1 rounded-xl font-mono text-xs text-center border border-slate-200/80 dark:border-slate-800">
        <button
          onClick={() => setFilter('ALL')}
          className={`py-2 rounded-lg font-bold transition-all cursor-pointer ${
            filter === 'ALL'
              ? 'bg-amber-500 text-slate-950 shadow-xs'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Tous ({closedTrades.length})
        </button>

        <button
          onClick={() => setFilter('WINNERS')}
          className={`py-2 rounded-lg font-bold transition-all cursor-pointer ${
            filter === 'WINNERS'
              ? 'bg-emerald-500 text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Gagnants ({winners.length})
        </button>

        <button
          onClick={() => setFilter('LOSERS')}
          className={`py-2 rounded-lg font-bold transition-all cursor-pointer ${
            filter === 'LOSERS'
              ? 'bg-rose-500 text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Perdants ({losers.length})
        </button>
      </div>

      {/* HISTORICAL CARDS LIST */}
      <div className="space-y-2.5">
        {filteredTrades.length === 0 ? (
          <div className="bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center text-slate-500 font-mono text-xs">
            Aucun trade clôturé dans cette catégorie.
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
                className="bg-white dark:bg-[#0B132B] border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-3.5 flex items-center justify-between hover:border-amber-400 transition-all shadow-xs cursor-pointer font-mono"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-white shrink-0 ${
                      isBuy ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                  >
                    {isBuy ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                  </div>

                  <div>
                    <div className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{setup.type} XAU/USD</span>
                      <span className="text-[10px] text-slate-400 font-normal">#{setup.ticketNumber}</span>
                    </div>

                    <div className="text-[10px] text-slate-400 font-sans mt-0.5">
                      Entrée: {setup.entryPrice.toFixed(2)} • Clôture: {setup.closedPrice ? setup.closedPrice.toFixed(2) : '-'}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className={`text-xs font-black ${
                      pnlPips >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {pnlPips >= 0 ? `+${pnlPips}` : pnlPips} pips
                  </div>

                  <div className="text-[10px] text-slate-400 font-sans mt-0.5">
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
