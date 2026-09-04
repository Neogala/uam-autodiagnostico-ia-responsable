import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, HelpCircle } from 'lucide-react';
import { PrincipleScoreResult } from '../types';

interface GlobalIndexBarProps {
  results: PrincipleScoreResult[];
  globalScore: number;
}

export const GlobalIndexBar: React.FC<GlobalIndexBarProps> = ({ results, globalScore }) => {
  const total = results.length;
  const answeredCount = results.filter(r => r.riskClass !== 'unscored').length;
  const criticalCount = results.filter(r => r.riskClass === 'critical').length;
  const moderateCount = results.filter(r => r.riskClass === 'moderate').length;
  const optimalCount = results.filter(r => r.riskClass === 'optimal').length;
  const progressPct = total > 0 ? Math.round((answeredCount / total) * 100) : 0;

  return (
    <div className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-5">

        {/* Global index */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">
            Índice Global
          </span>
          <span
            className="text-xl font-black font-mono transition-all duration-300"
            aria-live="polite"
          >
            {answeredCount > 0 ? globalScore.toFixed(1) : '—'}
          </span>
          <span className="text-xs text-slate-400">/ 10</span>

          {answeredCount === 0 ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
              <HelpCircle className="w-3 h-3" /> Sin evaluar
            </span>
          ) : globalScore >= 9 ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/40">
              <CheckCircle2 className="w-3 h-3" /> Óptimo
            </span>
          ) : globalScore >= 6 ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/40">
              <AlertTriangle className="w-3 h-3" /> Moderado
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-400 bg-red-950/60 px-2 py-0.5 rounded-full border border-red-500/40">
              <AlertCircle className="w-3 h-3" /> Crítico
            </span>
          )}
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-2 flex-1 min-w-[160px]">
          <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-400 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="text-[11px] font-semibold text-slate-300 whitespace-nowrap">
            {answeredCount} de {total} evaluados
          </span>
        </div>

        {/* Semaphore counts */}
        <div className="flex items-center gap-1.5 text-[11px] font-semibold shrink-0">
          <span className="px-1.5 py-0.5 rounded bg-red-950/50 text-red-300 border border-red-800/40">
            {criticalCount} Crítico
          </span>
          <span className="px-1.5 py-0.5 rounded bg-amber-950/50 text-amber-300 border border-amber-800/40">
            {moderateCount} Moderado
          </span>
          <span className="px-1.5 py-0.5 rounded bg-emerald-950/50 text-emerald-300 border border-emerald-800/40">
            {optimalCount} Óptimo
          </span>
        </div>

      </div>
    </div>
  );
};
