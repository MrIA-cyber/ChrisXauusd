import React from 'react';
import { motion } from 'motion/react';
import { Target, CheckCircle2, XCircle, Percent, ShieldCheck, Scale, Award, Sparkles, Layers, ArrowUpRight, Lock } from 'lucide-react';
import { DailyStats } from '../types';

interface StatsGridProps {
  stats: DailyStats;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-3 space-y-4">
      
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* 1. Setups Générés */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="bg-white border border-slate-200/90 rounded-2xl p-4 relative overflow-hidden group hover:border-blue-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">Total Setups</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-600 shadow-2xs group-hover:scale-110 transition-transform">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-slate-900 tracking-tight">
              {stats.totalSetups}
            </span>
            <span className="text-xs font-mono text-blue-800 font-bold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
              {stats.active} en cours
            </span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-blue-700 font-mono font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Strictement R:R ≥ 1:1.5</span>
          </div>
        </motion.div>

        {/* 2. Gagnants (TP) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white border border-slate-200/90 rounded-2xl p-4 relative overflow-hidden group hover:border-emerald-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-600" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">Gagnants (TP)</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600 shadow-2xs group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-600 tracking-tight">
              {stats.winners}
            </span>
            <span className="text-xs font-mono text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              +{stats.totalPips > 0 ? stats.totalPips : 0} pips
            </span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-emerald-700 font-mono font-bold">
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            <span>Objectifs TP Validés</span>
          </div>
        </motion.div>

        {/* 3. Perdants (SL) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="bg-white border border-slate-200/90 rounded-2xl p-4 relative overflow-hidden group hover:border-rose-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-red-600" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">Perdants (SL)</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200/80 flex items-center justify-center text-rose-600 shadow-2xs group-hover:scale-110 transition-transform">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-rose-600 tracking-tight">
              {stats.losers}
            </span>
            <span className="text-xs font-mono text-slate-600 font-bold bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
              100% Transparence
            </span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-rose-700 font-mono font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
            <span>SL Réellement Exécuté</span>
          </div>
        </motion.div>

        {/* 4. Taux de Réussite (%) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white border border-slate-200/90 rounded-2xl p-4 relative overflow-hidden group hover:border-purple-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">Taux Réel Calculé</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200/80 flex items-center justify-center text-purple-600 shadow-2xs group-hover:scale-110 transition-transform">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-purple-700 tracking-tight">
              {stats.winRate}%
            </span>
            <span className="text-xs font-mono text-purple-800 font-bold bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
              {stats.totalPips >= 0 ? `+${stats.totalPips}` : stats.totalPips} pips
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-600 font-mono font-bold">
            <span className="flex items-center gap-1">
              <Scale className="w-3.5 h-3.5 text-purple-600" /> PF: <strong className="text-slate-900">{stats.profitFactor}</strong>
            </span>
            <span>R:R: <strong className="text-slate-900">1:{stats.avgRR}</strong></span>
          </div>
        </motion.div>

      </div>

      {/* Grade Performance Breakdown (A+, A, B) */}
      {stats.byGrade && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
          className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-3 text-xs font-mono shadow-sm"
        >
          <div className="flex items-center justify-between text-slate-900 font-bold border-b border-slate-100 pb-2.5">
            <span className="flex items-center gap-2 text-xs sm:text-sm">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>JOURNAL DES PERFORMANCES PAR QUALITÉ DE SETUP</span>
            </span>
            <span className="text-[11px] text-slate-500 font-mono font-normal hidden sm:inline">
              Audit en temps réel
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            
            {/* Grade A+ */}
            <div className="bg-gradient-to-br from-amber-50/90 via-amber-50/50 to-white border border-amber-200/90 p-3.5 rounded-xl space-y-2 relative overflow-hidden group hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 font-bold text-amber-900 text-xs">
                  <Sparkles className="w-4 h-4 text-amber-600 fill-amber-400" />
                  <span>Setup A+ (5/5)</span>
                </span>
                <span className="text-xs font-black text-amber-900 font-mono bg-amber-100/80 px-2 py-0.5 rounded border border-amber-300/80">
                  {stats.byGrade.A_PLUS.winRate}% TP
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="w-full bg-amber-100 rounded-full h-2 overflow-hidden border border-amber-200">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.byGrade.A_PLUS.winRate}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="bg-gradient-to-r from-amber-500 to-amber-600 h-full rounded-full"
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-600">
                  <span>{stats.byGrade.A_PLUS.total} setups émis</span>
                  <span className="font-bold text-emerald-700">+{stats.byGrade.A_PLUS.pips} pips</span>
                </div>
              </div>
            </div>

            {/* Grade A */}
            <div className="bg-gradient-to-br from-blue-50/90 via-blue-50/50 to-white border border-blue-200/90 p-3.5 rounded-xl space-y-2 relative overflow-hidden group hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 font-bold text-blue-900 text-xs">
                  <Award className="w-4 h-4 text-blue-600" />
                  <span>Setup A (4/5)</span>
                </span>
                <span className="text-xs font-black text-blue-900 font-mono bg-blue-100/80 px-2 py-0.5 rounded border border-blue-300/80">
                  {stats.byGrade.A.winRate}% TP
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="w-full bg-blue-100 rounded-full h-2 overflow-hidden border border-blue-200">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.byGrade.A.winRate}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full"
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-600">
                  <span>{stats.byGrade.A.total} setups émis</span>
                  <span className="font-bold text-emerald-700">+{stats.byGrade.A.pips} pips</span>
                </div>
              </div>
            </div>

            {/* Grade B */}
            <div className="bg-gradient-to-br from-slate-50 via-slate-50/50 to-white border border-slate-200/90 p-3.5 rounded-xl space-y-2 relative overflow-hidden group hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 font-bold text-slate-800 text-xs">
                  <ShieldCheck className="w-4 h-4 text-slate-600" />
                  <span>Setup B (3/5)</span>
                </span>
                <span className="text-xs font-black text-slate-800 font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                  {stats.byGrade.B.winRate}% TP
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.byGrade.B.winRate}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="bg-gradient-to-r from-slate-400 to-slate-600 h-full rounded-full"
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-600">
                  <span>{stats.byGrade.B.total} setups émis</span>
                  <span className="font-bold text-slate-700">+{stats.byGrade.B.pips} pips</span>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      )}

    </div>
  );
};


