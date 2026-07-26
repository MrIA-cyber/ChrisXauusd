import React from 'react';
import { Target, CheckCircle2, XCircle, Percent, ShieldCheck, Scale, Award } from 'lucide-react';
import { DailyStats } from '../types';

interface StatsGridProps {
  stats: DailyStats;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-7xl mx-auto px-4 py-3">
      
      {/* 1. Setups Générés */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 relative overflow-hidden group hover:border-blue-400 hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">Total Setups Aujourd'hui</span>
          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <Target className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-black font-mono text-slate-900">
            {stats.totalSetups}
          </span>
          <span className="text-xs font-mono text-slate-500 font-medium">
            ({stats.active} en cours)
          </span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-blue-700 font-mono font-medium">
          <ShieldCheck className="w-3 h-3 text-blue-600" />
          <span>Strictement R:R ≥ 1:1.5</span>
        </div>
      </div>

      {/* 2. Gagnants (TP) */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 relative overflow-hidden group hover:border-emerald-400 hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">Gagnants (TP Atteint)</span>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-600">
            {stats.winners}
          </span>
          <span className="text-xs font-mono text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
            +{stats.totalPips > 0 ? stats.totalPips : 0} pips
          </span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-700 font-mono font-medium">
          <Award className="w-3 h-3 text-emerald-600" />
          <span>Pips nets gagnés</span>
        </div>
      </div>

      {/* 3. Perdants (SL) */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 relative overflow-hidden group hover:border-rose-400 hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">Perdants (SL Atteint)</span>
          <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
            <XCircle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-black font-mono text-rose-600">
            {stats.losers}
          </span>
          <span className="text-xs font-mono text-slate-500 font-medium">
            (Transparence 100%)
          </span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-rose-700 font-mono font-medium">
          <ShieldCheck className="w-3 h-3 text-rose-600" />
          <span>Stop Loss obligatoire</span>
        </div>
      </div>

      {/* 4. Taux de Réussite (%) */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 relative overflow-hidden group hover:border-blue-400 hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">Taux de Réussite</span>
          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <Percent className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-black font-mono text-blue-700">
            {stats.winRate}%
          </span>
          <span className="text-xs font-mono text-blue-800 font-bold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
            {stats.totalPips >= 0 ? `+${stats.totalPips}` : stats.totalPips} pips
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 font-mono font-medium">
          <span className="flex items-center gap-1">
            <Scale className="w-3 h-3 text-blue-600" /> Profit Factor: <strong className="text-slate-900">{stats.profitFactor}</strong>
          </span>
          <span>R:R Moyen: <strong className="text-slate-900">1:{stats.avgRR}</strong></span>
        </div>
      </div>

    </div>
  );
};
