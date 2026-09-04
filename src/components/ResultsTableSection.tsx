import React from 'react';
import {
  Table,
  Copy,
  Check,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  HelpCircle,
  Filter
} from 'lucide-react';
import { PrincipleScoreResult, RiskLevel, RiskClass } from '../types';

interface ResultsTableSectionProps {
  results: PrincipleScoreResult[];
  globalScore: number;
}

export const ResultsTableSection: React.FC<ResultsTableSectionProps> = ({
  results,
  globalScore
}) => {
  const [copied, setCopied] = React.useState(false);
  const [filterClass, setFilterClass] = React.useState<'all' | RiskClass>('all');

  const filteredResults = results.filter(r => {
    if (filterClass === 'all') return true;
    return r.riskClass === filterClass;
  });

  const answeredCount = results.filter(r => r.riskClass !== 'unscored').length;

  const getMarkdownTable = () => {
    const header = `| Principio | Puntaje (1-10) | Estado de Riesgo |\n| :--- | :---: | :--- |\n`;
    const rows = results
      .map(r => `| ${r.principle.name} | ${r.scaledScore != null ? r.scaledScore + ' / 10' : 'Sin evaluar'} | ${r.riskLevel} |`)
      .join('\n');
    return header + rows;
  };

  const copyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(getMarkdownTable());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error copying table:', err);
    }
  };

  return (
    <section id="uam-results-table-section" className="bg-white border border-slate-200 rounded-xl shadow-xs p-5 sm:p-6 mb-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4 mb-5">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Tabla de Resultados y Semáforo de Riesgo
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Matriz de evaluación escalada del 1 al 10 con clasificación semafórica institucional de la UAM. Solo lectura — el puntaje se fija en el paso de Autoevaluación.
          </p>
        </div>

        {/* Action button */}
        <button
          id="btn-copy-markdown-table"
          onClick={copyMarkdown}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg border border-slate-300 transition"
          title="Copiar tabla en formato Markdown al portapapeles"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? '¡Copiado!' : 'Copiar Tabla Markdown'}</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-500 ml-1.5 mr-0.5" />
          <button
            onClick={() => setFilterClass('all')}
            className={`px-2.5 py-1 rounded font-medium transition ${
              filterClass === 'all'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Todos ({results.length})
          </button>
          <button
            onClick={() => setFilterClass('critical')}
            className={`px-2.5 py-1 rounded font-medium transition ${
              filterClass === 'critical'
                ? 'bg-red-600 text-white shadow-2xs font-semibold'
                : 'text-red-700 hover:bg-red-50'
            }`}
          >
            Críticos ({results.filter(r => r.riskClass === 'critical').length})
          </button>
          <button
            onClick={() => setFilterClass('moderate')}
            className={`px-2.5 py-1 rounded font-medium transition ${
              filterClass === 'moderate'
                ? 'bg-amber-500 text-slate-950 shadow-2xs font-semibold'
                : 'text-amber-700 hover:bg-amber-50'
            }`}
          >
            Moderados ({results.filter(r => r.riskClass === 'moderate').length})
          </button>
          <button
            onClick={() => setFilterClass('optimal')}
            className={`px-2.5 py-1 rounded font-medium transition ${
              filterClass === 'optimal'
                ? 'bg-emerald-600 text-white shadow-2xs font-semibold'
                : 'text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            Óptimos ({results.filter(r => r.riskClass === 'optimal').length})
          </button>
          <button
            onClick={() => setFilterClass('unscored')}
            className={`px-2.5 py-1 rounded font-medium transition ${
              filterClass === 'unscored'
                ? 'bg-slate-600 text-white shadow-2xs font-semibold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Sin evaluar ({results.filter(r => r.riskClass === 'unscored').length})
          </button>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Promedio Global: <strong className="text-slate-900">{answeredCount > 0 ? globalScore.toFixed(1) + ' / 10' : '—'}</strong>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto border border-slate-200 rounded-lg">
        <table className="w-full text-left text-xs sm:text-sm text-slate-700">
          <thead className="bg-slate-900 text-white uppercase text-[11px] tracking-wider">
            <tr>
              <th className="px-4 py-3 font-semibold">Principio del Decálogo UAM</th>
              <th className="px-4 py-3 text-center font-semibold w-36">Puntaje (1-10)</th>
              <th className="px-4 py-3 text-center font-semibold w-48">Estado de Riesgo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {filteredResults.map((r) => {
              let badgeStyle = '';
              let badgeIcon = null;

              if (r.riskClass === 'optimal') {
                badgeStyle = 'bg-emerald-100 text-emerald-800 border-emerald-300';
                badgeIcon = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />;
              } else if (r.riskClass === 'moderate') {
                badgeStyle = 'bg-amber-100 text-amber-800 border-amber-300';
                badgeIcon = <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />;
              } else if (r.riskClass === 'critical') {
                badgeStyle = 'bg-red-100 text-red-800 border-red-300';
                badgeIcon = <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />;
              } else {
                badgeStyle = 'bg-slate-100 text-slate-600 border-slate-300';
                badgeIcon = <HelpCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />;
              }

              return (
                <tr key={r.principle.id} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900">{r.principle.name}</div>
                    <div className="text-xs text-slate-500 line-clamp-1">{r.principle.question}</div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-mono font-bold text-sm text-slate-900 bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
                      {r.scaledScore != null ? `${r.scaledScore} / 10` : '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${badgeStyle}`}>
                      {badgeIcon}
                      <span>{r.riskLevel}</span>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </section>
  );
};
