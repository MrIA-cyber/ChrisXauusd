import React from 'react';
import { motion } from 'motion/react';
import { Target, CheckCircle2, XCircle, Percent, ShieldCheck, Scale, Award, Sparkles, Layers } from 'lucide-react';
import { DailyStats } from '../types';

interface StatsGridProps {
  stats: DailyStats;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  return (
    <div className="max-w-7xl mx-auto py-1 space-y-4">
      
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Setups Générés */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4.5 relative overflow-hidden group hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 backdrop-blur-md"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Total Setups</span>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-md group-hover:scale-110 transition-transform">
              <Target className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
              {stats.totalSetups}
            </span>
            <span className="text-xs font-mono text-blue-300 font-bold bg-blue-950/80 px-2.5 py-0.5 rounded-full border border-blue-500/40">
              {stats.active} en cours
            </span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-blue-300 font-mono font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Strictement R:R ≥ 1:1.5</span>
          </div>
        </motion.div>

        {/* 2. Gagnants (TP) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4.5 relative overflow-hidden group hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1 transition-all duration-300 backdrop-blur-md"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-600" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Gagnants (TP)</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-md group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-400 tracking-tight">
              {stats.winners}
            </span>
            <span className="text-xs font-mono text-emerald-300 font-bold bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
              +{stats.totalPips > 0 ? stats.totalPips : 0} pips
            </span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-emerald-300 font-mono font-bold">
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            <span>Objectifs TP Validés</span>
          </div>
        </motion.div>

        {/* 3. Perdants (SL) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4.5 relative overflow-hidden group hover:border-rose-500/50 hover:shadow-2xl hover:shadow-rose-500/10 hover:-translate-y-1 transition-all duration-300 backdrop-blur-md"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-red-600" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Perdants (SL)</span>
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-md group-hover:scale-110 transition-transform">
              <XCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-rose-400 tracking-tight">
              {stats.losers}
            </span>
            <span className="text-xs font-mono text-slate-300 font-bold bg-slate-950/80 px-2 py-0.5 rounded-full border border-slate-700">
              100% Transparence
            </span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-rose-300 font-mono font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
            <span>SL Réellement Exécuté</span>
          </div>
        </motion.div>

        {/* 4. Taux de Réussite (%) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4.5 relative overflow-hidden group hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-1 transition-all duration-300 backdrop-blur-md"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Taux Réel Calculé</span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-md group-hover:scale-110 transition-transform">
              <Percent className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-amber-400 tracking-tight">
              {stats.winRate}%
            </span>
            <span className="text-xs font-mono text-amber-300 font-bold bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-500/40">
              {stats.totalPips >= 0 ? `+${stats.totalPips}` : stats.totalPips} pips
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-300 font-mono font-bold">
            <span className="flex items-center gap-1">
              <Scale className="w-3.5 h-3.5 text-amber-400" /> PF: <strong className="text-white">{stats.profitFactor}</strong>
            </span>
            <span>R:R: <strong className="text-white">1:{stats.avgRR}</strong></span>
          </div>
        </motion.div>

      </div>

      {/* Grade Performance Breakdown (A+, A, B) */}
      {stats.byGrade && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
          className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4.5 space-y-3 text-xs font-mono shadow-xl backdrop-blur-md"
        >
          <div className="flex items-center justify-between text-white font-bold border-b border-slate-800 pb-2.5">
            <span className="flex items-center gap-2 text-xs sm:text-sm">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>JOURNAL DES PERFORMANCES PAR QUALITÉ DE SETUP</span>
            </span>
            <span className="text-[11px] text-slate-400 font-mono font-normal hidden sm:inline">
              Audit en temps réel
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            
            {/* Grade A+ */}
            <div className="bg-slate-950/80 border border-amber-500/30 p-3.5 rounded-xl space-y-2 relative overflow-hidden group hover:border-amber-500/60 transition-all">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 font-bold text-amber-300 text-xs">
                  <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400/30" />
                  <span>Setup A+ (5/5)</span>
                </span>
                <span className="text-xs font-black text-amber-300 font-mono bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/40">
                  {stats.byGrade.A_PLUS.winRate}% TP
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.byGrade.A_PLUS.winRate}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="bg-gradient-to-r from-amber-400 to-amber-600 h-full rounded-full"
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>{stats.byGrade.A_PLUS.total} setups émis</span>
                  <span className="font-bold text-emerald-400">+{stats.byGrade.A_PLUS.pips} pips</span>
                </div>
              </div>
            </div>

            {/* Grade A */}
            <div className="bg-slate-950/80 border border-blue-500/30 p-3.5 rounded-xl space-y-2 relative overflow-hidden group hover:border-blue-500/60 transition-all">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 font-bold text-blue-300 text-xs">
                  <Award className="w-4 h-4 text-blue-400" />
                  <span>Setup A (4/5)</span>
                </span>
                <span className="text-xs font-black text-blue-300 font-mono bg-blue-950/80 px-2 py-0.5 rounded border border-blue-500/40">
                  {stats.byGrade.A.winRate}% TP
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.byGrade.A.winRate}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="bg-gradient-to-r from-blue-400 to-blue-600 h-full rounded-full"
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>{stats.byGrade.A.total} setups émis</span>
                  <span className="font-bold text-emerald-400">+{stats.byGrade.A.pips} pips</span>
                </div>
              </div>
            </div>

            {/* Grade B */}
            <div className="bg-slate-950/80 border border-slate-700/80 p-3.5 rounded-xl space-y-2 relative overflow-hidden group hover:border-slate-600 transition-all">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 font-bold text-slate-300 text-xs">
                  <ShieldCheck className="w-4 h-4 text-slate-400" />
                  <span>Setup B (3/5)</span>
                </span>
                <span className="text-xs font-black text-slate-300 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                  {stats.byGrade.B.winRate}% TP
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.byGrade.B.winRate}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="bg-gradient-to-r from-slate-500 to-slate-700 h-full rounded-full"
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>{stats.byGrade.B.total} setups émis</span>
                  <span className="font-bold text-slate-300">+{stats.byGrade.B.pips} pips</span>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      )}

    </div>
  );
};


