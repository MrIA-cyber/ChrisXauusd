import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, CheckCircle2, XCircle, Clock, ChevronRight } from 'lucide-react';
import { TradeSetup, PriceTick } from '../../types';

interface SetupsViewProps {
  trades: TradeSetup[];
  currentTick: PriceTick;
  onOpenSetupDetail: (setup: TradeSetup) => void;
  isVisitor?: boolean;
  onOpenSubscribeModal?: () => void;
}

export const SetupsView: React.FC<SetupsViewProps> = ({
  trades,
  currentTick,
  onOpenSetupDetail,
  isVisitor = false,
  onOpenSubscribeModal,
}) => {
  const [filter, setFilter] = useState<'ACTIVE' | 'PENDING' | 'CLOSED'>('ACTIVE');

  const activeSetups = trades.filter((t) => t.status === 'ACTIVE');
  // Pending setups are setups generated with limit or pending trigger
  const pendingSetups = trades.filter((t) => t.status === 'ACTIVE' && t.score >= 4);
  const closedSetups = trades.filter((t) => t.status !== 'ACTIVE');

  let filteredTrades: TradeSetup[] = [];
  if (filter === 'ACTIVE') {
    filteredTrades = activeSetups;
  } else if (filter === 'PENDING') {
    filteredTrades = pendingSetups;
  } else {
    filteredTrades = closedSetups;
  }

  return (
    <div className="space-y-4 font-sans pb-2">
      
      {/* Page Title & Subtabs Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white dark:bg-[#0B132B] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white font-mono uppercase tracking-wide">
            SETUPS DE TRADING XAU/USD
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-sans mt-0.5">
            Flux séquentiel filtré par confluences SMC/ICT & Score Algorithmique 5/5
          </p>
        </div>

        <div className="self-start sm:self-auto text-xs font-mono font-extrabold text-amber-500 bg-amber-500/10 px-3.5 py-1.5 rounded-full border border-amber-500/20 whitespace-nowrap">
          {trades.length} Niveaux
        </div>
      </div>

      {/* Filter Tabs (Actifs | En attente | Terminés) - Touch Friendly 44px+ */}
      <div className="grid grid-cols-3 bg-slate-100 dark:bg-[#081226] p-1.5 rounded-2xl font-mono text-xs sm:text-sm text-center border border-slate-200/80 dark:border-slate-800">
        <button
          onClick={() => setFilter('ACTIVE')}
          className={`min-h-[44px] py-2.5 rounded-xl font-extrabold transition-all cursor-pointer ${
            filter === 'ACTIVE'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Actifs ({activeSetups.length})
        </button>

        <button
          onClick={() => setFilter('PENDING')}
          className={`min-h-[44px] py-2.5 rounded-xl font-extrabold transition-all cursor-pointer ${
            filter === 'PENDING'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          En attente ({pendingSetups.length})
        </button>

        <button
          onClick={() => setFilter('CLOSED')}
          className={`min-h-[44px] py-2.5 rounded-xl font-extrabold transition-all cursor-pointer ${
            filter === 'CLOSED'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Terminés ({closedSetups.length})
        </button>
      </div>

      {/* Setups List Cards: 1 col on mobile, 2 cols on tablet/desktop (md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-4">
        {filteredTrades.length === 0 ? (
          <div className="col-span-full bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center text-slate-500 font-mono text-xs">
            Aucun setup trouvé dans cette catégorie.
          </div>
        ) : (
          filteredTrades.map((setup) => {
            const isBuy = setup.type === 'BUY';
            const isActive = setup.status === 'ACTIVE';
            const isTpHit = setup.status === 'TP_HIT';

            return (
              <div
                key={setup.id}
                onClick={() => onOpenSetupDetail(setup)}
                className="bg-white dark:bg-[#0B132B] border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-4 space-y-3 hover:border-amber-400 transition-all shadow-xs cursor-pointer flex flex-col justify-between"
              >
                {/* Header Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-black font-mono flex items-center gap-1 ${
                        isBuy
                          ? 'bg-emerald-500 text-white'
                          : 'bg-rose-500 text-white'
                      }`}
                    >
                      {isBuy ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                      {setup.type} XAU/USD
                    </span>

                    <span className="text-xs font-mono text-slate-400">
                      Ticket #{setup.ticketNumber}
                    </span>
                  </div>

                  <span
                    className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30'
                        : isTpHit
                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
                        : 'bg-rose-500/10 text-rose-500 border border-rose-500/30'
                    }`}
                  >
                    {isActive ? '● ACTIF' : isTpHit ? '✓ TP ATTEINT' : '✗ SL ATTEINT'}
                  </span>
                </div>

                {/* Grid Levels */}
                <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs my-1">
                  <div className="bg-slate-50 dark:bg-[#060D1E] p-2 rounded-xl border border-slate-200/80 dark:border-slate-800">
                    <div className="text-[10px] text-slate-400 font-sans font-bold">Entry</div>
                    <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                      ${setup.entryPrice.toFixed(2)}
                    </div>
                  </div>

                  <div className="bg-rose-50 dark:bg-rose-950/20 p-2 rounded-xl border border-rose-200/80 dark:border-rose-900/40">
                    <div className="text-[10px] text-rose-500 font-sans font-bold">SL</div>
                    <div className="font-bold text-rose-600 dark:text-rose-400 mt-0.5">
                      ${setup.stopLoss.toFixed(2)}
                    </div>
                  </div>

                  <div className="bg-emerald-50 dark:bg-emerald-950/20 p-2 rounded-xl border border-emerald-200/80 dark:border-emerald-900/40">
                    <div className="text-[10px] text-emerald-500 font-sans font-bold">TP</div>
                    <div className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                      ${setup.takeProfit.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Footer Bar & Button */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 font-mono text-xs">
                  <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 font-semibold">
                    <span>Conviction: <strong className="text-amber-500">{setup.convictionRate}%</strong></span>
                    <span>Conf: <strong className="text-blue-500">{setup.score}/5</strong></span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenSetupDetail(setup);
                    }}
                    className="min-h-[38px] px-3.5 py-1.5 bg-slate-900 dark:bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-white text-xs font-bold rounded-xl flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <span>DÉTAILS</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
