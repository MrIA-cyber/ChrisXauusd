import React from 'react';
import { motion } from 'motion/react';
import { Target, CheckCircle2, XCircle, Percent, ShieldCheck, Scale, Award, Sparkles, Layers } from 'lucide-react';
import { DailyStats } from '../types';

interface StatsGridProps {
  stats: DailyStats;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  return (
    <div className="max-w-7xl mx-auto py-1 space-y-4 font-sans">
      
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        
        {/* 1. Setups Générés */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[18px] sm:rounded-[20px] p-3.5 sm:p-5 relative overflow-hidden group hover:border-blue-400 hover:shadow-[0_15px_35px_rgba(15,23,42,0.08)] hover:-translate-y-1 transition-all duration-300 shadow-xs"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600" />
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] sm:text-xs font-mono font-extrabold text-slate-600 dark:text-slate-400 uppercase tracking-wider truncate">Total Setups</span>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-xs group-hover:scale-110 transition-transform shrink-0">
              <Target className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3 flex flex-wrap items-baseline gap-1.5 sm:gap-2">
            <span className="text-lg sm:text-2xl font-black font-mono text-slate-900 dark:text-slate-100 tracking-tight">
              {stats.totalSetups} <span className="text-xs sm:text-sm font-normal text-slate-500 dark:text-slate-400">/ 4 max</span>
            </span>
            <span className="text-[10px] sm:text-xs font-mono text-blue-900 dark:text-blue-300 font-bold bg-blue-50 dark:bg-blue-950/60 px-2 sm:px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
              {stats.active} en cours
            </span>
          </div>
          <div className="mt-2.5 sm:mt-3 flex items-center gap-1 text-[10px] sm:text-[11px] text-slate-700 dark:text-slate-300 font-mono font-semibold truncate">
            <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>Limite stricte : 4 trades / jour</span>
          </div>
        </motion.div>

        {/* 2. Gagnants (TP) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[18px] sm:rounded-[20px] p-3.5 sm:p-5 relative overflow-hidden group hover:border-emerald-400 hover:shadow-[0_15px_35px_rgba(15,23,42,0.08)] hover:-translate-y-1 transition-all duration-300 shadow-xs"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-600" />
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] sm:text-xs font-mono font-extrabold text-slate-600 dark:text-slate-400 uppercase tracking-wider truncate">Gagnants (TP)</span>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-xs group-hover:scale-110 transition-transform shrink-0">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3 flex flex-wrap items-baseline gap-1.5 sm:gap-2">
            <span className="text-lg sm:text-2xl font-black font-mono text-emerald-700 dark:text-emerald-400 tracking-tight">
              {stats.winners}
            </span>
            <span className="text-[10px] sm:text-xs font-mono text-emerald-900 dark:text-emerald-300 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 sm:px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              +{stats.totalPips > 0 ? stats.totalPips : 0} pips
            </span>
          </div>
          <div className="mt-2.5 sm:mt-3 flex items-center gap-1 text-[10px] sm:text-[11px] text-emerald-800 dark:text-emerald-300 font-mono font-semibold truncate">
            <Award className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Objectifs TP Validés</span>
          </div>
        </motion.div>

        {/* 3. Perdants (SL) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[18px] sm:rounded-[20px] p-3.5 sm:p-5 relative overflow-hidden group hover:border-rose-400 hover:shadow-[0_15px_35px_rgba(15,23,42,0.08)] hover:-translate-y-1 transition-all duration-300 shadow-xs"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-red-600" />
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] sm:text-xs font-mono font-extrabold text-slate-600 dark:text-slate-400 uppercase tracking-wider truncate">Perdants (SL)</span>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-600 dark:text-rose-400 shadow-xs group-hover:scale-110 transition-transform shrink-0">
              <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3 flex flex-wrap items-baseline gap-1.5 sm:gap-2">
            <span className="text-lg sm:text-2xl font-black font-mono text-rose-700 dark:text-rose-400 tracking-tight">
              {stats.losers}
            </span>
            <span className="text-[10px] sm:text-xs font-mono text-slate-700 dark:text-slate-300 font-bold bg-slate-100 dark:bg-slate-800 px-2 sm:px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
              100% Transparence
            </span>
          </div>
          <div className="mt-2.5 sm:mt-3 flex items-center gap-1 text-[10px] sm:text-[11px] text-rose-800 dark:text-rose-300 font-mono font-semibold truncate">
            <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
            <span>SL Réellement Exécuté</span>
          </div>
        </motion.div>

        {/* 4. Taux de Réussite (%) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white border border-slate-200/80 rounded-[18px] sm:rounded-[20px] p-3.5 sm:p-5 relative overflow-hidden group hover:border-amber-400 hover:shadow-[0_15px_35px_rgba(15,23,42,0.08)] hover:-translate-y-1 transition-all duration-300 shadow-[0_10px_30px_rgba(15,23,42,0.05)]"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600" />
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] sm:text-xs font-mono font-bold text-slate-500 uppercase tracking-wider truncate">Taux Réel</span>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-xs group-hover:scale-110 transition-transform shrink-0">
              <Percent className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3 flex flex-wrap items-baseline gap-1.5 sm:gap-2">
            <span className="text-lg sm:text-2xl font-black font-mono text-amber-600 tracking-tight">
              {stats.winRate}%
            </span>
            <span className="text-[10px] sm:text-xs font-mono text-amber-800 font-bold bg-amber-50 px-2 sm:px-2.5 py-0.5 rounded-full border border-amber-200">
              {stats.totalPips >= 0 ? `+${stats.totalPips}` : stats.totalPips} pips
            </span>
          </div>
          <div className="mt-2.5 sm:mt-3 flex flex-wrap items-center justify-between gap-1 text-[10px] sm:text-[11px] text-slate-600 font-mono font-semibold">
            <span className="flex items-center gap-0.5 sm:gap-1">
              <Scale className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-600 shrink-0" /> PF: <strong className="text-[#0F172A]">{stats.profitFactor}</strong>
            </span>
            <span>R:R: <strong className="text-[#0F172A]">1:{stats.avgRR}</strong></span>
          </div>
        </motion.div>

      </div>

      {/* Grade Performance Breakdown (A+, A, B) */}
      {stats.byGrade && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
          className="bg-white border border-slate-200/80 rounded-[20px] p-5 space-y-3.5 text-xs font-mono shadow-[0_10px_30px_rgba(15,23,42,0.05)]"
        >
          <div className="flex items-center justify-between text-[#0F172A] font-bold border-b border-slate-100 pb-3">
            <span className="flex items-center gap-2 text-xs sm:text-sm">
              <Layers className="w-4 h-4 text-amber-500" />
              <span>JOURNAL DES PERFORMANCES PAR QUALITÉ DE SETUP</span>
            </span>
            <span className="text-[11px] text-slate-400 font-mono font-normal hidden sm:inline">
              Audit en temps réel
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
            
            {/* Grade A+ */}
            <div className="bg-amber-50/50 border border-amber-200 p-4 rounded-2xl space-y-2.5 relative overflow-hidden group hover:border-amber-400 transition-all">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 font-bold text-amber-900 text-xs">
                  <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400/30" />
                  <span>Setup A+ (5/5)</span>
                </span>
                <span className="text-xs font-black text-amber-800 font-mono bg-white px-2.5 py-0.5 rounded-lg border border-amber-300 shadow-2xs">
                  {stats.byGrade.A_PLUS.winRate}% TP
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden border border-slate-200">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.byGrade.A_PLUS.winRate}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="bg-gradient-to-r from-amber-400 to-amber-600 h-full rounded-full"
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-600 font-semibold">
                  <span>{stats.byGrade.A_PLUS.total} setups émis</span>
                  <span className="font-bold text-emerald-700">+{stats.byGrade.A_PLUS.pips} pips</span>
                </div>
              </div>
            </div>

            {/* Grade A */}
            <div className="bg-blue-50/50 border border-blue-200 p-4 rounded-2xl space-y-2.5 relative overflow-hidden group hover:border-blue-400 transition-all">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 font-bold text-blue-900 text-xs">
                  <Award className="w-4 h-4 text-blue-600" />
                  <span>Setup A (4/5)</span>
                </span>
                <span className="text-xs font-black text-blue-800 font-mono bg-white px-2.5 py-0.5 rounded-lg border border-blue-300 shadow-2xs">
                  {stats.byGrade.A.winRate}% TP
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden border border-slate-200">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.byGrade.A.winRate}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="bg-gradient-to-r from-blue-400 to-blue-600 h-full rounded-full"
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-600 font-semibold">
                  <span>{stats.byGrade.A.total} setups émis</span>
                  <span className="font-bold text-emerald-700">+{stats.byGrade.A.pips} pips</span>
                </div>
              </div>
            </div>

            {/* Grade B */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2.5 relative overflow-hidden group hover:border-slate-300 transition-all">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 font-bold text-slate-800 text-xs">
                  <ShieldCheck className="w-4 h-4 text-slate-500" />
                  <span>Setup B (3/5)</span>
                </span>
                <span className="text-xs font-black text-slate-800 font-mono bg-white px-2.5 py-0.5 rounded-lg border border-slate-200 shadow-2xs">
                  {stats.byGrade.B.winRate}% TP
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden border border-slate-200">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.byGrade.B.winRate}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="bg-gradient-to-r from-slate-400 to-slate-600 h-full rounded-full"
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-600 font-semibold">
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


