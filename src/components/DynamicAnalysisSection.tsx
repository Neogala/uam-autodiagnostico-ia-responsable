import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Cpu,
  Scale,
  FileText,
  Copy,
  Check,
  Printer,
  HelpCircle,
  BookOpen,
  Info,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { PrincipleScoreResult, getMarcosForPrinciple } from '../types';

interface DynamicAnalysisSectionProps {
  results: PrincipleScoreResult[];
  completedSafeguards: Record<number, boolean>;
  onToggleSafeguard: (principleId: number) => void;
  onPrintReport: () => void;
  notasPorPrincipio: Record<number, string>;
  onSetNota: (principleId: number, texto: string) => void;
}

export const DynamicAnalysisSection: React.FC<DynamicAnalysisSectionProps> = ({
  results,
  completedSafeguards,
  onToggleSafeguard,
  onPrintReport,
  notasPorPrincipio,
  onSetNota
}) => {
  const [copiedAll, setCopiedAll] = React.useState(false);
  const [copiedSingleId, setCopiedSingleId] = React.useState<number | null>(null);

  const safeguardsAttended = results.filter(r => completedSafeguards[r.principle.id]).length;

  const getAnalysisText = () => {
    return results
      .map(
        r => `### ${r.principle.name}
- Puntaje (1-10): ${r.scaledScore != null ? r.scaledScore + ' / 10' : 'Sin evaluar'}
- Estado de Riesgo: ${r.riskLevel}
- Diagnóstico de Situación: ${r.diagnostic}
- Recomendación Técnica: ${r.technicalRecommendation || 'N/A'}
  * Fuente Técnica: ${r.principle.sources.technical}
- Recomendación Normativa UAM: ${r.normativeRecommendation || 'N/A'}
  * Fuente Normativa: ${r.principle.sources.normative}`
      )
      .join('\n\n');
  };

  const copyAnalysisAll = async () => {
    try {
      await navigator.clipboard.writeText(getAnalysisText());
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2500);
    } catch (err) {
      console.error('Error copying analysis:', err);
    }
  };

  const copySinglePrinciple = async (r: PrincipleScoreResult) => {
    const text = `Principio ${r.principle.name} (${r.scaledScore != null ? r.scaledScore + '/10' : 'Sin evaluar'} - ${r.riskLevel})
• Diagnóstico: ${r.diagnostic}
• Recomendación Técnica: ${r.technicalRecommendation || 'N/A'}
  (Fuente técnica: ${r.principle.sources.technical})
• Recomendación Normativa UAM: ${r.normativeRecommendation || 'N/A'}
  (Fuente normativa: ${r.principle.sources.normative})`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSingleId(r.principle.id);
      setTimeout(() => setCopiedSingleId(null), 2000);
    } catch (err) {
      console.error('Error copying single principle:', err);
    }
  };

  return (
    <section id="uam-dynamic-analysis-section" className="bg-white border border-line rounded-xl shadow-xs p-5 sm:p-6 mb-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-4 mb-5">
        <div>
          <h2 className="text-lg font-bold text-ink-900">
            Análisis y Recomendaciones por Principio
          </h2>
          <p className="text-xs text-ink-500 mt-1">
            Diagnóstico detallado y salvaguardas técnicas y normativas fundamentadas y calibradas según el nivel de riesgo de cada principio.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Enhanced Copy Button with explicit label */}
          <div className="relative group">
            <button
              id="btn-copy-analysis-text"
              onClick={copyAnalysisAll}
              className="w-full inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-surface-2 hover:bg-brand-tint hover:text-brand-ink hover:border-brand/30 text-ink-700 rounded-lg border border-line transition shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              title="Copiar todo el análisis para pegarlo en Word, oficios o minutas"
            >
              {copiedAll ? <Check className="w-3.5 h-3.5 text-sem-optimo" /> : <Copy className="w-3.5 h-3.5 text-brand-ink" />}
              <span>{copiedAll ? '¡Texto Copiado al Portapapeles!' : 'Copiar Análisis (para Word / Oficios)'}</span>
            </button>
          </div>

          <button
            id="btn-print-analysis-section"
            onClick={onPrintReport}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-brand hover:bg-brand-hover text-white rounded-lg transition shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2"
            title="Imprimir o guardar como PDF institucional"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir / PDF</span>
          </button>
        </div>
      </div>

      {/* Institutional Disclaimer Legend Banner */}
      <div className="bg-surface-2 border border-line rounded-xl p-4 mb-5 flex items-start gap-3 text-xs text-ink-700">
        <div className="p-1.5 bg-ink-900/5 rounded-lg text-ink-700 shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="space-y-1">
          <div className="font-bold text-ink-900 flex items-center gap-1.5 text-xs">
            <span>Aviso sobre el carácter orientativo de este autodiagnóstico</span>
          </div>
          <p className="text-ink-700 leading-relaxed">
            El diagnóstico y las recomendaciones de esta herramienta provienen de contenido fijo, predefinido a partir del Decálogo de Ética UAM para cada nivel de la escala (no se generan en tiempo real). Los resultados deben considerarse únicamente de carácter <strong>orientativo e ilustrativo</strong> y deben ser <strong>revisados y validados por personas especialistas o los comités colegiados competentes de la UAM</strong> antes de tomar decisiones institucionales o de despliegue.
          </p>
        </div>
      </div>

      {/* Info callout clarifying what "Copiar Análisis" does */}
      <div className="bg-surface-2 border border-line rounded-lg p-3 mb-5 flex items-start gap-2.5 text-xs text-ink-700">
        <HelpCircle className="w-4 h-4 text-ink-500 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>¿Para qué sirve el botón "Copiar Análisis"?</strong> Copia todo el diagnóstico, las recomendaciones técnicas y normativas, y las fuentes de verificación en texto limpio para que puedas pegarlo directamente en documentos Word o Google Docs.
        </div>
      </div>

      {/* Plan de salvaguardas summary */}
      <div className="bg-ink-900 text-white rounded-xl p-4 mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-white/70 shrink-0" />
          <div>
            <div className="text-sm font-bold">Plan de salvaguardas</div>
            <div className="text-xs text-ink-500">Salvaguardas marcadas como atendidas por principio</div>
          </div>
        </div>
        <div className="text-2xl font-black font-mono text-white">
          {safeguardsAttended} <span className="text-sm text-ink-500 font-semibold">/ {results.length}</span>
        </div>
      </div>

      {/* Cards list */}
      <div className="grid grid-cols-1 gap-5">
        {results.map((r) => {
          const isDone = !!completedSafeguards[r.principle.id];
          const isSingleCopied = copiedSingleId === r.principle.id;

          return (
            <div
              key={r.principle.id}
              id={`analysis-card-${r.principle.id}`}
              className={`rounded-xl border p-5 transition-all ${
                r.riskClass === 'critical'
                  ? 'border-sem-critico/30 bg-sem-critico-bg/40'
                  : r.riskClass === 'moderate'
                  ? 'border-sem-moderado/30 bg-sem-moderado-bg/40'
                  : r.riskClass === 'optimal'
                  ? 'border-sem-optimo/30 bg-sem-optimo-bg/40'
                  : 'border-line bg-surface-2'
              }`}
            >
              {/* Header card */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line pb-3 mb-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-ink-900 text-white text-xs font-bold shrink-0">
                    {r.principle.id}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-ink-900">
                      {r.principle.name}
                    </h3>
                    <p className="text-xs text-ink-500">{r.principle.question}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {getMarcosForPrinciple(r.principle).map((m) => (
                        <span key={m} className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-ink-900/5 text-ink-500 border border-line">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span className="text-xs font-mono font-bold bg-surface-2 text-ink-900 px-2.5 py-0.5 rounded border border-line">
                    {r.scaledScore != null ? `${r.scaledScore} / 10` : '—'}
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                    r.riskClass === 'optimal'
                      ? 'bg-sem-optimo-bg text-sem-optimo border-sem-optimo/30'
                      : r.riskClass === 'moderate'
                      ? 'bg-sem-moderado-bg text-sem-moderado border-sem-moderado/30'
                      : r.riskClass === 'critical'
                      ? 'bg-sem-critico-bg text-sem-critico border-sem-critico/30'
                      : 'bg-surface-2 text-ink-500 border-line'
                  }`}>
                    {r.riskLevel}
                  </span>

                  <button
                    onClick={() => copySinglePrinciple(r)}
                    className="p-1 rounded text-ink-500 hover:text-ink-900 hover:bg-surface-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                    title="Copiar recomendación y fuentes de este principio"
                  >
                    {isSingleCopied ? <Check className="w-3.5 h-3.5 text-sem-optimo" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* 3-column analysis grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">

                {/* 1. Diagnóstico */}
                <div className="bg-white p-3.5 rounded-lg border border-line flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-ink-900 mb-1.5">
                      <FileText className="w-3.5 h-3.5 text-ink-700" />
                      <span>Diagnóstico de Situación</span>
                    </div>
                    <p className="text-ink-700 leading-relaxed">
                      {r.diagnostic}
                    </p>
                  </div>
                </div>

                {/* 2. Recomendación Técnica */}
                <div className="bg-blue-50/60 p-3.5 rounded-lg border border-blue-200/80 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-blue-900 mb-1.5">
                      <Cpu className="w-3.5 h-3.5 text-blue-700" />
                      <span>Recomendación Técnica</span>
                    </div>
                    <p className="text-blue-950 leading-relaxed">
                      {r.technicalRecommendation || 'Disponible una vez que califiques este principio en el cuestionario.'}
                    </p>
                  </div>
                  {/* Technical Source Citation */}
                  <div className="mt-2.5 pt-2 border-t border-blue-200/60 text-[11px] text-blue-800/90 flex items-start gap-1">
                    <BookOpen className="w-3 h-3 text-blue-600 shrink-0 mt-0.5" />
                    <span><strong>Fuente técnica:</strong> {r.principle.sources.technical}</span>
                  </div>
                </div>

                {/* 3. Recomendación Normativa UAM */}
                <div className="bg-violet-50/60 p-3.5 rounded-lg border border-violet-200/80 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-violet-900 mb-1.5">
                      <Scale className="w-3.5 h-3.5 text-violet-700" />
                      <span>Recomendación Normativa UAM</span>
                    </div>
                    <p className="text-violet-950 leading-relaxed">
                      {r.normativeRecommendation || 'Disponible una vez que califiques este principio en el cuestionario.'}
                    </p>
                  </div>
                  {/* Normative Source Citation */}
                  <div className="mt-2.5 pt-2 border-t border-violet-200/60 text-[11px] text-violet-800/90 flex items-start gap-1">
                    <BookOpen className="w-3 h-3 text-violet-600 shrink-0 mt-0.5" />
                    <span><strong>Fuente normativa:</strong> {r.principle.sources.normative}</span>
                  </div>
                </div>

              </div>

              {/* Subdimensiones (banco de respaldo ALTAI): solo en principios piloto */}
              {r.principle.subdimensiones && r.principle.subdimensiones.length > 0 && (
                <div className="mt-3.5 pt-3.5 border-t border-line space-y-2.5 text-xs">
                  <strong className="text-ink-900 block">Detalle por subdimensión:</strong>
                  {r.principle.subdimensiones.map((sub) => {
                    const tier = r.riskClass === 'unscored' ? null : r.riskClass;
                    const bancoEntry = tier ? sub.banco[tier] : null;
                    return (
                      <div key={sub.id} className="bg-surface-2 border border-line rounded-lg p-3">
                        <div className="font-bold text-ink-900 mb-1">{sub.nombre}</div>
                        {bancoEntry ? (
                          <>
                            <p className="text-ink-700"><strong>Diagnóstico:</strong> {bancoEntry.diagnostico}</p>
                            <p className="text-ink-700 mt-0.5"><strong>Recomendación:</strong> {bancoEntry.recomendacion}</p>
                            <p className="text-[11px] text-ink-500 italic mt-1">Fuente: {bancoEntry.fuente}</p>
                          </>
                        ) : (
                          <p className="text-ink-500">Disponible una vez que califiques este principio en el cuestionario.</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Notas libres por principio (punto 10) */}
              <div className="mt-3.5 pt-3.5 border-t border-line">
                <label htmlFor={`nota-${r.principle.id}`} className="block text-[11px] font-semibold text-ink-700 mb-1">
                  Notas de seguimiento (privadas, se guardan solo en este navegador)
                </label>
                <textarea
                  id={`nota-${r.principle.id}`}
                  value={notasPorPrincipio[r.principle.id] || ''}
                  onChange={(e) => onSetNota(r.principle.id, e.target.value)}
                  placeholder="Ej. pendientes, acuerdos con el comité, próximos pasos..."
                  rows={2}
                  className="w-full text-xs text-ink-900 bg-white border border-line rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-focus focus:outline-none transition resize-y"
                />
              </div>

              {/* Action checklist item */}
              <div className="mt-3.5 pt-2.5 border-t border-line flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer select-none text-ink-700 hover:text-ink-900 font-medium">
                  <input
                    type="checkbox"
                    checked={isDone}
                    onChange={() => onToggleSafeguard(r.principle.id)}
                    className="w-4 h-4 rounded text-brand focus-visible:ring-2 focus-visible:ring-focus border-line"
                  />
                  <span>
                    {isDone ? '✅ Salvaguarda implementada y verificada' : 'Marcar como salvaguarda atendida'}
                  </span>
                </label>

                <span className="text-[11px] text-ink-500">
                  Fundamento: Decálogo UAM P{r.principle.id}
                </span>
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
};
