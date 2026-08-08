import React, { useState } from 'react';
import {
  Search,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  FileSpreadsheet,
  Lock,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { TradeSetup } from '../types';

interface TradeJournalTableProps {
  trades: TradeSetup[];
  isVisitor?: boolean;
  onOpenSubscribeModal?: () => void;
}

export const TradeJournalTable: React.FC<TradeJournalTableProps> = ({
  trades,
  isVisitor = false,
  onOpenSubscribeModal,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [filter, setFilter] = useState<'ALL' | 'TP_HIT' | 'SL_HIT' | 'ACTIVE' | 'BUY' | 'SELL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter trades based on user selection
  const filteredTrades = trades.filter((t) => {
    if (filter === 'TP_HIT' && t.status !== 'TP_HIT') return false;
    if (filter === 'SL_HIT' && t.status !== 'SL_HIT') return false;
    if (filter === 'ACTIVE' && t.status !== 'ACTIVE') return false;
    if (filter === 'BUY' && t.type !== 'BUY') return false;
    if (filter === 'SELL' && t.type !== 'SELL') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.ticketNumber.toLowerCase().includes(q) ||
        t.entryReason.toLowerCase().includes(q) ||
        t.confluence.some((c) => c.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Export CSV
  const handleExportCSV = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isVisitor) {
      onOpenSubscribeModal?.();
      return;
    }
    const headers = [
      'Ticket,Heure,Sens,Entree,StopLoss,TakeProfit,RatioRR,PnlPips,Statut,Confluence',
    ];
    const rows = trades.map(
      (t) =>
        `${t.ticketNumber},${t.timestamp},${t.type},${t.entryPrice},${t.stopLoss},${t.takeProfit},1:${t.rrRatio},${t.pnlPips || 0},${t.status},"${t.confluence.join(' | ')}"`
    );

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Journal_Trades_XAUUSD_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const activeCount = trades.filter((t) => t.status === 'ACTIVE').length;
  const tpCount = trades.filter((t) => t.status === 'TP_HIT').length;
  const slCount = trades.filter((t) => t.status === 'SL_HIT').length;

  return (
    <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-xs my-4 transition-all font-sans">
      
      {/* Discreet Header / Toggle Bar */}
      <div
        onClick={() => setIsExpanded((prev) => !prev)}
        className="p-3.5 sm:p-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-500/5 transition-colors select-none"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-slate-500/10 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0">
            <FileSpreadsheet className="w-4 h-4 text-blue-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs sm:text-sm font-bold text-[var(--text-primary)] font-mono">
                Journal de Trading ({trades.length})
              </h2>
              <span className="hidden xs:inline-flex items-center gap-1 text-[10px] font-mono text-slate-500 dark:text-slate-400">
                • <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{tpCount} TP</span>
                • <span className="text-rose-600 dark:text-rose-400 font-semibold">{slCount} SL</span>
                {activeCount > 0 && <span className="text-amber-600 dark:text-amber-400 font-semibold">• {activeCount} en cours</span>}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans">
              Consulter l'historique d'exécution des signaux XAU/USD
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExportCSV}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-500/10 hover:bg-slate-500/20 text-slate-700 dark:text-slate-300 border border-slate-500/20 text-[11px] font-mono font-medium transition-all"
            title="Exporter l'historique CSV"
          >
            <Download className="w-3 h-3 text-blue-500" />
            <span>CSV</span>
          </button>

          <button
            type="button"
            className="p-1.5 rounded-lg bg-slate-500/10 text-slate-600 dark:text-slate-300 hover:bg-slate-500/20 transition-all"
            title={isExpanded ? "Masquer le journal" : "Afficher le journal"}
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Expandable Content Panel */}
      {isExpanded && (
        <div className="border-t border-[var(--border-color)]">
          
          {/* Filters & Search Controls */}
          <div className="p-3 sm:p-4 bg-slate-500/5 space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
              
              {/* Filter Pills */}
              <div className="flex flex-wrap items-center gap-1 text-[11px] font-mono">
                <button
                  onClick={() => setFilter('ALL')}
                  className={`px-2.5 py-1 rounded-lg border transition-all ${
                    filter === 'ALL'
                      ? 'bg-blue-600 text-white font-bold border-blue-700'
                      : 'bg-[var(--card-bg)] text-slate-600 dark:text-slate-300 border-[var(--border-color)] hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Tous ({trades.length})
                </button>
                <button
                  onClick={() => setFilter('TP_HIT')}
                  className={`px-2.5 py-1 rounded-lg border transition-all ${
                    filter === 'TP_HIT'
                      ? 'bg-emerald-600 text-white font-bold border-emerald-700'
                      : 'bg-[var(--card-bg)] text-slate-600 dark:text-slate-300 border-[var(--border-color)] hover:text-emerald-600'
                  }`}
                >
                  Gagnés ({tpCount})
                </button>
                <button
                  onClick={() => setFilter('SL_HIT')}
                  className={`px-2.5 py-1 rounded-lg border transition-all ${
                    filter === 'SL_HIT'
                      ? 'bg-rose-600 text-white font-bold border-rose-700'
                      : 'bg-[var(--card-bg)] text-slate-600 dark:text-slate-300 border-[var(--border-color)] hover:text-rose-600'
                  }`}
                >
                  Perdus ({slCount})
                </button>
                <button
                  onClick={() => setFilter('ACTIVE')}
                  className={`px-2.5 py-1 rounded-lg border transition-all ${
                    filter === 'ACTIVE'
                      ? 'bg-amber-500 text-slate-950 font-bold border-amber-600'
                      : 'bg-[var(--card-bg)] text-slate-600 dark:text-slate-300 border-[var(--border-color)] hover:text-amber-500'
                  }`}
                >
                  En cours ({activeCount})
                </button>
              </div>

              {/* Search Box */}
              <div className="relative w-full sm:w-56">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg pl-7 pr-2.5 py-1 text-[11px] text-[var(--text-primary)] placeholder-slate-400 font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

            </div>
          </div>

          {/* Table Area */}
          <div className="overflow-x-auto relative">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-500/10 text-slate-500 dark:text-slate-400 uppercase text-[9px] tracking-wider border-b border-[var(--border-color)] font-bold">
                <tr>
                  <th className="px-3.5 py-2.5">Ticket</th>
                  <th className="px-3.5 py-2.5">Sens</th>
                  <th className="px-3.5 py-2.5">Entrée</th>
                  <th className="px-3.5 py-2.5 text-rose-500">SL</th>
                  <th className="px-3.5 py-2.5 text-emerald-500">TP</th>
                  <th className="px-3.5 py-2.5">R:R</th>
                  <th className="px-3.5 py-2.5">PnL</th>
                  <th className="px-3.5 py-2.5">Statut</th>
                  <th className="px-3.5 py-2.5">Confluence</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[var(--border-color)]">
                {filteredTrades.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-6 text-center text-slate-500 font-mono text-xs">
                      Aucun trade trouvé.
                    </td>
                  </tr>
                ) : (
                  filteredTrades.map((t) => {
                    const isBuy = t.type === 'BUY';
                    const isTpHit = t.status === 'TP_HIT';
                    const isSlHit = t.status === 'SL_HIT';
                    const isActive = t.status === 'ACTIVE';

                    return (
                      <tr
                        key={t.id}
                        className="hover:bg-slate-500/5 transition-colors"
                      >
                        {/* Ticket & Time */}
                        <td className="px-3.5 py-2.5 whitespace-nowrap">
                          <div className="font-bold text-[var(--text-primary)] text-xs">{t.ticketNumber}</div>
                          <div className="text-[10px] text-slate-500">{t.timestamp}</div>
                        </td>

                        {/* Type BUY/SELL */}
                        <td className="px-3.5 py-2.5 whitespace-nowrap">
                          {isVisitor ? (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-bold text-[10px] bg-slate-500/10 text-slate-500">
                              <Lock className="w-3 h-3" /> Privé
                            </span>
                          ) : (
                            <span
                              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-bold text-[10px] ${
                                isBuy
                                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
                                  : 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20'
                              }`}
                            >
                              {isBuy ? (
                                <>
                                  <ArrowUpRight className="w-3 h-3 text-emerald-500" /> ACHAT
                                </>
                              ) : (
                                <>
                                  <ArrowDownRight className="w-3 h-3 text-rose-500" /> VENTE
                                </>
                              )}
                            </span>
                          )}
                        </td>

                        {/* Entry Price */}
                        <td className={`px-3.5 py-2.5 font-bold text-[var(--text-primary)] whitespace-nowrap ${isVisitor ? 'blur-[3px] select-none text-slate-400' : ''}`}>
                          {isVisitor ? '$2,3XX.XX' : `$${t.entryPrice.toFixed(2)}`}
                        </td>

                        {/* Stop Loss */}
                        <td className={`px-3.5 py-2.5 font-bold text-rose-500 whitespace-nowrap ${isVisitor ? 'blur-[3px] select-none' : ''}`}>
                          {isVisitor ? '$2,3XX.XX' : `$${t.stopLoss.toFixed(2)}`}
                        </td>

                        {/* Take Profit */}
                        <td className={`px-3.5 py-2.5 font-bold text-emerald-500 whitespace-nowrap ${isVisitor ? 'blur-[3px] select-none' : ''}`}>
                          {isVisitor ? '$2,3XX.XX' : `$${t.takeProfit.toFixed(2)}`}
                        </td>

                        {/* Risk:Reward */}
                        <td className="px-3.5 py-2.5 font-bold text-amber-600 dark:text-amber-400 whitespace-nowrap">
                          1:{t.rrRatio}
                        </td>

                        {/* PnL Pips */}
                        <td className={`px-3.5 py-2.5 font-bold whitespace-nowrap ${isVisitor ? 'blur-[3px] select-none' : ''}`}>
                          {isVisitor ? (
                            <span className="text-blue-500">+•• pips</span>
                          ) : isActive ? (
                            <span className="text-slate-400">En cours</span>
                          ) : isTpHit ? (
                            <span className="text-emerald-500">+{t.pnlPips || t.rewardPips} pips</span>
                          ) : (
                            <span className="text-rose-500">-{Math.abs(t.pnlPips || t.riskPips)} pips</span>
                          )}
                        </td>

                        {/* Status Badge */}
                        <td className="px-3.5 py-2.5 whitespace-nowrap">
                          {isActive && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-amber-700 dark:text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full font-bold">
                              <Clock className="w-3 h-3 text-amber-500 animate-spin" /> En cours
                            </span>
                          )}
                          {isTpHit && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                              <CheckCircle2 className="w-3 h-3 text-emerald-500" /> TP GAGNÉ
                            </span>
                          )}
                          {isSlHit && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-rose-700 dark:text-rose-300 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full font-bold">
                              <XCircle className="w-3 h-3 text-rose-500" /> SL PERDU
                            </span>
                          )}
                        </td>

                        {/* Confluence */}
                        <td className="px-3.5 py-2.5 text-slate-500 dark:text-slate-400 text-[10px] max-w-xs truncate">
                          {t.confluence.join(' • ')}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

            {/* Visitor Overlay */}
            {isVisitor && (
              <div className="absolute inset-0 bg-[var(--card-bg)]/90 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center space-y-3 font-mono z-20">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
                  <Lock className="w-5 h-5" />
                </div>

                <div className="space-y-1 max-w-sm">
                  <h3 className="text-xs font-bold text-[var(--text-primary)]">
                    Journal détaillé réservé aux abonnés VIP
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans">
                    Abonnez-vous pour voir tous les prix d'entrées, SL/TP et analyses.
                  </p>
                </div>

                <button
                  onClick={() => onOpenSubscribeModal?.()}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold py-2 px-5 rounded-lg text-xs shadow-md shadow-amber-500/10 active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  <span>Débloquer le Journal VIP</span>
                </button>
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
};


