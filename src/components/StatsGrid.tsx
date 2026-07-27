import React from 'react';
import { Target, CheckCircle2, XCircle, Percent, ShieldCheck, Scale, Award, Sparkles, Layers } from 'lucide-react';
import { DailyStats } from '../types';

interface StatsGridProps {
  stats: DailyStats;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-3 space-y-3">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
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
            <span className="text-xs font-semibold text-slate-500">Taux Réel Calculé</span>
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

      {/* Grade Performance Breakdown (A+, A, B) */}
      {stats.byGrade && (
        <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between text-slate-700 font-bold border-b border-slate-100 pb-2">
            <span className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-600" />
              JOURNAL DES PERFORMANCES PAR QUALITÉ DE SETUP (CONFLUENCE)
            </span>
            <span className="text-[10px] text-slate-500 font-normal">Basé sur les résultats réels</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
            {/* Grade A+ */}
            <div className="bg-amber-50/70 border border-amber-200 p-2.5 rounded-lg flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="inline-flex items-center gap-1 font-bold text-amber-900">
                  <Sparkles className="w-3 h-3 text-amber-600 fill-amber-400" /> Setup A+ (5/5)
                </span>
                <p className="text-[10px] text-slate-500">{stats.byGrade.A_PLUS.total} setups émis</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-black text-amber-900">{stats.byGrade.A_PLUS.winRate}% TP</span>
                <p className="text-[10px] font-bold text-emerald-700">+{stats.byGrade.A_PLUS.pips} pips</p>
              </div>
            </div>

            {/* Grade A */}
            <div className="bg-blue-50/70 border border-blue-200 p-2.5 rounded-lg flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="inline-flex items-center gap-1 font-bold text-blue-900">
                  <Award className="w-3 h-3 text-blue-600" /> Setup A (4/5)
                </span>
                <p className="text-[10px] text-slate-500">{stats.byGrade.A.total} setups émis</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-black text-blue-900">{stats.byGrade.A.winRate}% TP</span>
                <p className="text-[10px] font-bold text-emerald-700">+{stats.byGrade.A.pips} pips</p>
              </div>
            </div>

            {/* Grade B */}
            <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="inline-flex items-center gap-1 font-bold text-slate-800">
                  <ShieldCheck className="w-3 h-3 text-slate-600" /> Setup B (3/5)
                </span>
                <p className="text-[10px] text-slate-500">{stats.byGrade.B.total} setups émis</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-black text-slate-800">{stats.byGrade.B.winRate}% TP</span>
                <p className="text-[10px] font-bold text-slate-700">+{stats.byGrade.B.pips} pips</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

