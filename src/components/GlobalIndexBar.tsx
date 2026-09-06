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
    <div className="sticky top-0 z-40 bg-ink-900 text-white border-b border-ink-700 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-5">

        {/* Global index */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-medium text-ink-500 uppercase tracking-wide">
            Índice Global
          </span>
          <span
            className="text-xl font-black font-mono transition-all duration-300"
            aria-live="polite"
          >
            {answeredCount > 0 ? globalScore.toFixed(1) : '—'}
          </span>
          <span className="text-xs text-ink-500">/ 10</span>

          {answeredCount === 0 ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-white/80 bg-white/10 px-2 py-0.5 rounded-full border border-white/20">
              <HelpCircle className="w-3 h-3" /> Sin evaluar
            </span>
          ) : globalScore >= 9 ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-sem-optimo px-2 py-0.5 rounded-full border border-sem-optimo">
              <CheckCircle2 className="w-3 h-3" /> Óptimo
            </span>
          ) : globalScore >= 6 ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-sem-moderado px-2 py-0.5 rounded-full border border-sem-moderado">
              <AlertTriangle className="w-3 h-3" /> Moderado
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-sem-critico px-2 py-0.5 rounded-full border border-sem-critico">
              <AlertCircle className="w-3 h-3" /> Crítico
            </span>
          )}
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-2 flex-1 min-w-[160px]">
          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-white/80 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="text-[11px] font-semibold text-ink-500 whitespace-nowrap">
            {answeredCount} de {total} evaluados
          </span>
        </div>

        {/* Semaphore counts */}
        <div className="flex items-center gap-1.5 text-[11px] font-semibold shrink-0">
          <span className="px-1.5 py-0.5 rounded bg-sem-critico/20 text-white border border-sem-critico/50">
            {criticalCount} Crítico
          </span>
          <span className="px-1.5 py-0.5 rounded bg-sem-moderado/20 text-white border border-sem-moderado/50">
            {moderateCount} Moderado
          </span>
          <span className="px-1.5 py-0.5 rounded bg-sem-optimo/20 text-white border border-sem-optimo/50">
            {optimalCount} Óptimo
          </span>
        </div>

      </div>
    </div>
  );
};
