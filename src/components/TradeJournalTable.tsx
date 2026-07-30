import React, { useState } from 'react';
import {
  ListFilter,
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
} from 'lucide-react';
import { TradeSetup, TradeStatus } from '../types';
import { formatFcfa, SUBSCRIPTION_PRICE_FCFA } from '../lib/subscriptionService';

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
  const handleExportCSV = () => {
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

  return (
    <div className="bg-white border border-slate-200/80 rounded-[20px] overflow-hidden shadow-[0_10px_30px_rgba(15,23,42,0.05)] my-6 relative font-sans">
      
      {/* Table Header Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-100 space-y-3 bg-slate-50/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-blue-600" />
              <span>JOURNAL DES TRADES & HISTORIQUE D'AUDIT</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              TRANSPARENCE TOTALE : 100% des échecs et réussites enregistrés en direct.
            </p>
          </div>

          {/* CSV Export */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200/80 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all shrink-0 active:scale-[0.97]"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Exporter Journal (.CSV)</span>
          </button>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pt-1">
          
          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1 rounded-xl border transition-all ${
                filter === 'ALL'
                  ? 'bg-blue-600 text-white font-bold border-blue-700 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900'
              }`}
            >
              Tous ({trades.length})
            </button>
            <button
              onClick={() => setFilter('TP_HIT')}
              className={`px-3 py-1 rounded-xl border transition-all ${
                filter === 'TP_HIT'
                  ? 'bg-emerald-600 text-white font-bold border-emerald-700 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:text-emerald-700'
              }`}
            >
              Gagnés ({trades.filter((t) => t.status === 'TP_HIT').length})
            </button>
            <button
              onClick={() => setFilter('SL_HIT')}
              className={`px-3 py-1 rounded-xl border transition-all ${
                filter === 'SL_HIT'
                  ? 'bg-rose-600 text-white font-bold border-rose-700 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:text-rose-700'
              }`}
            >
              Perdus ({trades.filter((t) => t.status === 'SL_HIT').length})
            </button>
            <button
              onClick={() => setFilter('ACTIVE')}
              className={`px-3 py-1 rounded-xl border transition-all ${
                filter === 'ACTIVE'
                  ? 'bg-amber-500 text-slate-950 font-bold border-amber-600 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:text-blue-800'
              }`}
            >
              En cours ({trades.filter((t) => t.status === 'ACTIVE').length})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher ticket ou signal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 font-mono focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto relative">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200 font-bold">
            <tr>
              <th className="px-4 py-3">Ticket / Heure</th>
              <th className="px-4 py-3">Qualité</th>
              <th className="px-4 py-3">Sens</th>
              <th className="px-4 py-3">Prix Entrée</th>
              <th className="px-4 py-3 text-rose-600">Stop Loss</th>
              <th className="px-4 py-3 text-emerald-600">Take Profit</th>
              <th className="px-4 py-3">Ratio R:R</th>
              <th className="px-4 py-3">PnL (Pips)</th>
              <th className="px-4 py-3">Résultat / Statut</th>
              <th className="px-4 py-3">Confluence</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 bg-white">
            {filteredTrades.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center text-slate-500 font-mono">
                  Aucun setup de trade ne correspond aux critères de recherche.
                </td>
              </tr>
            ) : (
              filteredTrades.map((t) => {
                const isBuy = t.type === 'BUY';
                const isTpHit = t.status === 'TP_HIT';
                const isSlHit = t.status === 'SL_HIT';
                const isActive = t.status === 'ACTIVE';
                const grade = t.grade || 'A+';
                const score = t.score || 5;

                return (
                  <tr
                    key={t.id}
                    className="hover:bg-slate-50/80 transition-colors duration-150"
                  >
                    {/* Ticket & Time */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-bold text-[#0F172A]">{t.ticketNumber}</div>
                      <div className="text-[10px] text-slate-500">{t.timestamp}</div>
                    </td>

                    {/* Setup Quality Grade */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                          grade === 'A+'
                            ? 'bg-amber-50 text-amber-900 border-amber-300'
                            : grade === 'A'
                            ? 'bg-blue-50 text-blue-900 border-blue-300'
                            : 'bg-slate-100 text-slate-800 border-slate-300'
                        }`}
                      >
                        Setup {grade} ({score}/5)
                      </span>
                    </td>

                    {/* Type BUY/SELL */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      {isVisitor ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-bold text-[10px] bg-slate-100 text-slate-700 border border-slate-200">
                          <Lock className="w-3 h-3 text-slate-500" /> Verrouillé
                        </span>
                      ) : (
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-bold text-[10px] ${
                            isBuy
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-rose-50 text-rose-800 border border-rose-200'
                          }`}
                        >
                          {isBuy ? (
                            <>
                              <ArrowUpRight className="w-3 h-3 text-emerald-600" /> ACHAT
                            </>
                          ) : (
                            <>
                              <ArrowDownRight className="w-3 h-3 text-rose-600" /> VENTE
                            </>
                          )}
                        </span>
                      )}
                    </td>

                    {/* Entry Price */}
                    <td className={`px-4 py-3 font-bold text-[#0F172A] whitespace-nowrap ${isVisitor ? 'blur-[3px] select-none text-slate-400' : ''}`}>
                      {isVisitor ? '$2,3XX.XX' : `$${t.entryPrice.toFixed(2)}`}
                    </td>

                    {/* Stop Loss (Required) */}
                    <td className={`px-4 py-3 font-bold text-rose-600 whitespace-nowrap ${isVisitor ? 'blur-[3px] select-none' : ''}`}>
                      {isVisitor ? '$2,3XX.XX' : `$${t.stopLoss.toFixed(2)}`}
                    </td>

                    {/* Take Profit */}
                    <td className={`px-4 py-3 font-bold text-emerald-600 whitespace-nowrap ${isVisitor ? 'blur-[3px] select-none' : ''}`}>
                      {isVisitor ? '$2,3XX.XX' : `$${t.takeProfit.toFixed(2)}`}
                    </td>

                    {/* Risk:Reward */}
                    <td className="px-4 py-3 font-bold text-amber-700 whitespace-nowrap">
                      1:{t.rrRatio}
                    </td>

                    {/* PnL Pips */}
                    <td className={`px-4 py-3 font-bold whitespace-nowrap ${isVisitor ? 'blur-[3px] select-none' : ''}`}>
                      {isVisitor ? (
                        <span className="text-blue-600">+•• pips</span>
                      ) : isActive ? (
                        <span className="text-slate-500">En cours...</span>
                      ) : isTpHit ? (
                        <span className="text-emerald-600">+{t.pnlPips || t.rewardPips} pips</span>
                      ) : (
                        <span className="text-rose-600">-{Math.abs(t.pnlPips || t.riskPips)} pips</span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      {isActive && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-amber-900 bg-amber-50 border border-amber-300 px-2 py-0.5 rounded-full font-bold">
                          <Clock className="w-3 h-3 text-amber-600 animate-spin" /> En cours
                        </span>
                      )}
                      {isTpHit && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-900 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded-full font-bold">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> TP GAGNÉ
                        </span>
                      )}
                      {isSlHit && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-rose-900 bg-rose-50 border border-rose-300 px-2 py-0.5 rounded-full font-bold">
                          <XCircle className="w-3 h-3 text-rose-600" /> SL PERDU
                        </span>
                      )}
                    </td>

                    {/* Confluence */}
                    <td className="px-4 py-3 text-slate-600 text-[11px] max-w-xs truncate">
                      {t.confluence.join(' • ')}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Visitor Blur Overlay for Table (Informative Only) */}
        {isVisitor && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center space-y-4 font-mono z-20 overflow-hidden">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-300 flex items-center justify-center text-amber-600 shadow-lg shadow-amber-500/10">
                <Lock className="w-7 h-7" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500" />
              </span>
            </div>

            <div className="space-y-1.5 max-w-md">
              <span className="inline-block px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-50 text-amber-900 border border-amber-300 uppercase tracking-wider">
                JOURNAL D'AUDIT COMPLET DÉBLOQUÉ SUR ABONNEMENT
              </span>
              <h3 className="text-sm sm:text-base font-bold text-[#0F172A] tracking-tight">
                Accédez à l'Historique Exact des Entrées & Gains en Pips
              </h3>
              <p className="text-xs text-slate-600 font-sans leading-relaxed">
                Abonnez-vous pour afficher le journal de trading audité en temps réel avec tous les Stop Loss et Take Profits.
              </p>
            </div>

            <button
              onClick={() => onOpenSubscribeModal?.()}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold py-3 px-7 rounded-xl text-xs sm:text-sm shadow-xl shadow-amber-500/20 transform hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 fill-current text-slate-950" />
              <span>Débloquer le Journal VIP</span>
            </button>
          </div>
        )}

      </div>

    </div>
  );
};

