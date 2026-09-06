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
import { PrincipleScoreResult, RiskLevel, RiskClass, NivelMadurez, NIVEL_MADUREZ_LABEL } from '../types';

interface ResultsTableSectionProps {
  results: PrincipleScoreResult[];
  globalScore: number;
  autovaloraciones: Record<number, NivelMadurez | null>;
}

// Approximate, illustrative mapping — same one used in QuestionnaireSection to
// show the contrast between self-assessment and the deterministic calculation.
function nivelMadurezSugiereRiesgo(nivel: NivelMadurez): 'critical' | 'moderate' | 'optimal' {
  if (nivel === 'no_existente' || nivel === 'bajo') return 'critical';
  if (nivel === 'moderado') return 'moderate';
  return 'optimal';
}

export const ResultsTableSection: React.FC<ResultsTableSectionProps> = ({
  results,
  globalScore,
  autovaloraciones
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
    <section id="uam-results-table-section" className="bg-white border border-line rounded-xl shadow-xs p-5 sm:p-6 mb-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-4 mb-5">
        <div>
          <h2 className="text-lg font-bold text-ink-900">
            Tabla de Resultados y Semáforo de Riesgo
          </h2>
          <p className="text-xs text-ink-500 mt-1">
            Matriz de evaluación escalada del 1 al 10 con clasificación semafórica institucional de la UAM. Solo lectura — el puntaje se fija en el paso de Autoevaluación.
          </p>
        </div>

        {/* Action button */}
        <button
          id="btn-copy-markdown-table"
          onClick={copyMarkdown}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-surface-2 hover:bg-line text-ink-700 rounded-lg border border-line transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          title="Copiar tabla en formato Markdown al portapapeles"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-sem-optimo" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? '¡Copiado!' : 'Copiar Tabla Markdown'}</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-1 bg-surface-2 p-1 rounded-lg border border-line text-xs">
          <Filter className="w-3.5 h-3.5 text-ink-500 ml-1.5 mr-0.5" />
          <button
            onClick={() => setFilterClass('all')}
            className={`px-2.5 py-1 rounded font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus ${
              filterClass === 'all'
                ? 'bg-white text-ink-900 shadow-2xs font-semibold'
                : 'text-ink-700 hover:text-ink-900'
            }`}
          >
            Todos ({results.length})
          </button>
          <button
            onClick={() => setFilterClass('critical')}
            className={`px-2.5 py-1 rounded font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus ${
              filterClass === 'critical'
                ? 'bg-sem-critico text-white shadow-2xs font-semibold'
                : 'text-sem-critico hover:bg-sem-critico-bg'
            }`}
          >
            Críticos ({results.filter(r => r.riskClass === 'critical').length})
          </button>
          <button
            onClick={() => setFilterClass('moderate')}
            className={`px-2.5 py-1 rounded font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus ${
              filterClass === 'moderate'
                ? 'bg-sem-moderado text-white shadow-2xs font-semibold'
                : 'text-sem-moderado hover:bg-sem-moderado-bg'
            }`}
          >
            Moderados ({results.filter(r => r.riskClass === 'moderate').length})
          </button>
          <button
            onClick={() => setFilterClass('optimal')}
            className={`px-2.5 py-1 rounded font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus ${
              filterClass === 'optimal'
                ? 'bg-sem-optimo text-white shadow-2xs font-semibold'
                : 'text-sem-optimo hover:bg-sem-optimo-bg'
            }`}
          >
            Óptimos ({results.filter(r => r.riskClass === 'optimal').length})
          </button>
          <button
            onClick={() => setFilterClass('unscored')}
            className={`px-2.5 py-1 rounded font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus ${
              filterClass === 'unscored'
                ? 'bg-ink-700 text-white shadow-2xs font-semibold'
                : 'text-ink-700 hover:bg-line'
            }`}
          >
            Sin evaluar ({results.filter(r => r.riskClass === 'unscored').length})
          </button>
        </div>

        <div className="text-xs text-ink-500 font-medium">
          Promedio Global: <strong className="text-ink-900">{answeredCount > 0 ? globalScore.toFixed(1) + ' / 10' : '—'}</strong>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto border border-line rounded-lg">
        <table className="w-full text-left text-xs sm:text-sm text-ink-700">
          <thead className="bg-ink-900 text-white uppercase text-[11px] tracking-wider">
            <tr>
              <th className="px-4 py-3 font-semibold">Principio del Decálogo UAM</th>
              <th className="px-4 py-3 text-center font-semibold w-36">Puntaje (1-10)</th>
              <th className="px-4 py-3 text-center font-semibold w-48">Estado de Riesgo</th>
              <th className="px-4 py-3 text-center font-semibold w-40">Autovaloración vs. cálculo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line bg-white">
            {filteredResults.map((r) => {
              let badgeStyle = '';
              let badgeIcon = null;

              if (r.riskClass === 'optimal') {
                badgeStyle = 'bg-sem-optimo-bg text-sem-optimo border-sem-optimo/30';
                badgeIcon = <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />;
              } else if (r.riskClass === 'moderate') {
                badgeStyle = 'bg-sem-moderado-bg text-sem-moderado border-sem-moderado/30';
                badgeIcon = <AlertTriangle className="w-3.5 h-3.5 shrink-0" />;
              } else if (r.riskClass === 'critical') {
                badgeStyle = 'bg-sem-critico-bg text-sem-critico border-sem-critico/30';
                badgeIcon = <AlertCircle className="w-3.5 h-3.5 shrink-0" />;
              } else {
                badgeStyle = 'bg-surface-2 text-ink-500 border-line';
                badgeIcon = <HelpCircle className="w-3.5 h-3.5 shrink-0" />;
              }

              return (
                <tr key={r.principle.id} className="hover:bg-surface-2 transition">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-ink-900">{r.principle.name}</div>
                    <div className="text-xs text-ink-500 line-clamp-1">{r.principle.question}</div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-mono font-bold text-sm text-ink-900 bg-surface-2 px-2.5 py-1 rounded border border-line">
                      {r.scaledScore != null ? `${r.scaledScore} / 10` : '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${badgeStyle}`}>
                      {badgeIcon}
                      <span>{r.riskLevel}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-[11px]">
                    {(() => {
                      const autoval = autovaloraciones[r.principle.id];
                      if (!autoval) return <span className="text-ink-500">—</span>;
                      if (r.riskClass === 'unscored') return <span className="text-ink-500">{NIVEL_MADUREZ_LABEL[autoval]}</span>;
                      const coincide = nivelMadurezSugiereRiesgo(autoval) === r.riskClass;
                      return (
                        <span className={coincide ? 'text-sem-optimo font-semibold' : 'text-sem-moderado font-semibold'}>
                          {NIVEL_MADUREZ_LABEL[autoval]} {coincide ? '✓' : '⚠'}
                        </span>
                      );
                    })()}
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
