import React from 'react';
import { motion } from 'motion/react';
import { Target, CheckCircle2, XCircle, Percent, ShieldCheck, Scale, Award, Sparkles, Layers } from 'lucide-react';
import { DailyStats } from '../types';

interface StatsGridProps {
  stats: DailyStats;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  return (
    <div className="max-w-7xl mx-auto py-1 space-y-4 font-sans text-slate-100">
      
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        
        {/* 1. Setups Générés */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="bg-[#071426] border border-[#00E5FF]/20 rounded-[18px] sm:rounded-[20px] p-3.5 sm:p-5 relative overflow-hidden group hover:border-[#00E5FF]/50 hover:shadow-[0_15px_35px_rgba(0,229,255,0.1)] hover:-translate-y-1 transition-all duration-300 shadow-md"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00E5FF] to-blue-600" />
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] sm:text-xs font-mono font-extrabold text-slate-400 uppercase tracking-wider truncate">Total Setups</span>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF] shadow-xs group-hover:scale-110 transition-transform shrink-0">
              <Target className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3 flex flex-wrap items-baseline gap-1.5 sm:gap-2">
            <span className="text-lg sm:text-2xl font-black font-mono text-white tracking-tight">
              {stats.totalSetups} <span className="text-xs sm:text-sm font-normal text-slate-400">/ 4 max</span>
            </span>
            <span className="text-[10px] sm:text-xs font-mono text-[#00E5FF] font-bold bg-[#00E5FF]/10 px-2 sm:px-2.5 py-0.5 rounded-full border border-[#00E5FF]/30">
              {stats.active} en cours
            </span>
          </div>
          <div className="mt-2.5 sm:mt-3 flex items-center gap-1 text-[10px] sm:text-[11px] text-slate-300 font-mono font-semibold truncate">
            <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#00E5FF] shrink-0" />
            <span>Limite stricte : 4 trades / jour</span>
          </div>
        </motion.div>

        {/* 2. Gagnants (TP) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-[#071426] border border-[#00E5FF]/20 rounded-[18px] sm:rounded-[20px] p-3.5 sm:p-5 relative overflow-hidden group hover:border-[#22C55E]/50 hover:shadow-[0_15px_35px_rgba(34,197,94,0.1)] hover:-translate-y-1 transition-all duration-300 shadow-md"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#22C55E] to-emerald-600" />
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] sm:text-xs font-mono font-extrabold text-slate-400 uppercase tracking-wider truncate">Gagnants (TP)</span>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#22C55E]/10 border border-[#22C55E]/30 flex items-center justify-center text-[#22C55E] shadow-xs group-hover:scale-110 transition-transform shrink-0">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3 flex flex-wrap items-baseline gap-1.5 sm:gap-2">
            <span className="text-lg sm:text-2xl font-black font-mono text-[#22C55E] tracking-tight">
              {stats.winners}
            </span>
            <span className="text-[10px] sm:text-xs font-mono text-[#22C55E] font-bold bg-[#22C55E]/10 px-2 sm:px-2.5 py-0.5 rounded-full border border-[#22C55E]/30">
              +{stats.totalPips > 0 ? stats.totalPips : 0} pips
            </span>
          </div>
          <div className="mt-2.5 sm:mt-3 flex items-center gap-1 text-[10px] sm:text-[11px] text-[#22C55E] font-mono font-semibold truncate">
            <Award className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#22C55E] shrink-0" />
            <span>Objectifs TP Validés</span>
          </div>
        </motion.div>

        {/* 3. Perdants (SL) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="bg-[#071426] border border-[#00E5FF]/20 rounded-[18px] sm:rounded-[20px] p-3.5 sm:p-5 relative overflow-hidden group hover:border-[#EF4444]/50 hover:shadow-[0_15px_35px_rgba(239,68,68,0.1)] hover:-translate-y-1 transition-all duration-300 shadow-md"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#EF4444] to-rose-600" />
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] sm:text-xs font-mono font-extrabold text-slate-400 uppercase tracking-wider truncate">Perdants (SL)</span>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#EF4444]/10 border border-[#EF4444]/30 flex items-center justify-center text-[#EF4444] shadow-xs group-hover:scale-110 transition-transform shrink-0">
              <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3 flex flex-wrap items-baseline gap-1.5 sm:gap-2">
            <span className="text-lg sm:text-2xl font-black font-mono text-[#EF4444] tracking-tight">
              {stats.losers}
            </span>
            <span className="text-[10px] sm:text-xs font-mono text-slate-300 font-bold bg-[#030B16] px-2 sm:px-2.5 py-0.5 rounded-full border border-slate-700">
              100% Transparence
            </span>
          </div>
          <div className="mt-2.5 sm:mt-3 flex items-center gap-1 text-[10px] sm:text-[11px] text-[#EF4444] font-mono font-semibold truncate">
            <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#EF4444] shrink-0" />
            <span>SL Réellement Exécuté</span>
          </div>
        </motion.div>

        {/* 4. Taux de Réussite (%) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-[#071426] border border-[#00E5FF]/20 rounded-[18px] sm:rounded-[20px] p-3.5 sm:p-5 relative overflow-hidden group hover:border-[#00E5FF]/50 hover:shadow-[0_15px_35px_rgba(0,229,255,0.1)] hover:-translate-y-1 transition-all duration-300 shadow-md"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00E5FF] via-cyan-400 to-[#00E5FF]" />
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] sm:text-xs font-mono font-bold text-slate-400 uppercase tracking-wider truncate">Taux Réel</span>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF] shadow-xs group-hover:scale-110 transition-transform shrink-0">
              <Percent className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3 flex flex-wrap items-baseline gap-1.5 sm:gap-2">
            <span className="text-lg sm:text-2xl font-black font-mono text-[#00E5FF] tracking-tight">
              {stats.winRate}%
            </span>
            <span className="text-[10px] sm:text-xs font-mono text-[#00E5FF] font-bold bg-[#00E5FF]/10 px-2 sm:px-2.5 py-0.5 rounded-full border border-[#00E5FF]/30">
              {stats.totalPips >= 0 ? `+${stats.totalPips}` : stats.totalPips} pips
            </span>
          </div>
          <div className="mt-2.5 sm:mt-3 flex flex-wrap items-center justify-between gap-1 text-[10px] sm:text-[11px] text-slate-300 font-mono font-semibold">
            <span className="flex items-center gap-0.5 sm:gap-1">
              <Scale className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#00E5FF] shrink-0" /> PF: <strong className="text-white">{stats.profitFactor}</strong>
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
          className="bg-[#071426] border border-[#00E5FF]/20 rounded-[20px] p-5 space-y-3.5 text-xs font-mono shadow-md text-slate-100"
        >
          <div className="flex items-center justify-between text-white font-bold border-b border-[#00E5FF]/15 pb-3">
            <span className="flex items-center gap-2 text-xs sm:text-sm text-[#00E5FF]">
              <Layers className="w-4 h-4 text-[#00E5FF]" />
              <span>JOURNAL DES PERFORMANCES PAR QUALITÉ DE SETUP</span>
            </span>
            <span className="text-[11px] text-slate-400 font-mono font-normal hidden sm:inline">
              Audit en temps réel
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
            
            {/* Grade A+ */}
            <div className="bg-[#030B16] border border-[#00E5FF]/30 p-4 rounded-2xl space-y-2.5 relative overflow-hidden group hover:border-[#00E5FF] transition-all">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 font-bold text-[#00E5FF] text-xs">
                  <Sparkles className="w-4 h-4 text-[#00E5FF] fill-[#00E5FF]/20" />
                  <span>Setup A+ (5/5)</span>
                </span>
                <span className="text-xs font-black text-[#00E5FF] font-mono bg-[#00E5FF]/10 px-2.5 py-0.5 rounded-lg border border-[#00E5FF]/30 shadow-2xs">
                  {stats.byGrade.A_PLUS.winRate}% TP
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.byGrade.A_PLUS.winRate}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="bg-gradient-to-r from-[#00E5FF] to-cyan-400 h-full rounded-full"
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                  <span>{stats.byGrade.A_PLUS.total} setups émis</span>
                  <span className="font-bold text-[#22C55E]">+{stats.byGrade.A_PLUS.pips} pips</span>
                </div>
              </div>
            </div>

            {/* Grade A */}
            <div className="bg-[#030B16] border border-[#00E5FF]/20 p-4 rounded-2xl space-y-2.5 relative overflow-hidden group hover:border-[#00E5FF]/60 transition-all">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 font-bold text-blue-400 text-xs">
                  <Award className="w-4 h-4 text-blue-400" />
                  <span>Setup A (4/5)</span>
                </span>
                <span className="text-xs font-black text-blue-300 font-mono bg-blue-950/60 px-2.5 py-0.5 rounded-lg border border-blue-800 shadow-2xs">
                  {stats.byGrade.A.winRate}% TP
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.byGrade.A.winRate}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="bg-gradient-to-r from-blue-400 to-blue-600 h-full rounded-full"
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                  <span>{stats.byGrade.A.total} setups émis</span>
                  <span className="font-bold text-[#22C55E]">+{stats.byGrade.A.pips} pips</span>
                </div>
              </div>
            </div>

            {/* Grade B */}
            <div className="bg-[#030B16] border border-slate-800 p-4 rounded-2xl space-y-2.5 relative overflow-hidden group hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 font-bold text-slate-300 text-xs">
                  <ShieldCheck className="w-4 h-4 text-slate-400" />
                  <span>Setup B (3/5)</span>
                </span>
                <span className="text-xs font-black text-slate-300 font-mono bg-slate-800 px-2.5 py-0.5 rounded-lg border border-slate-700 shadow-2xs">
                  {stats.byGrade.B.winRate}% TP
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.byGrade.B.winRate}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="bg-gradient-to-r from-slate-500 to-slate-700 h-full rounded-full"
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold">
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


