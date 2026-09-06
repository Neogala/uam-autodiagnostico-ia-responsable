import React from 'react';
import {
  EvaluationReportState,
  PrincipleScoreResult,
  generateStandaloneRadarHtml
} from '../types';

interface PrintableReportViewProps {
  state: EvaluationReportState;
  results: PrincipleScoreResult[];
  globalScore: number;
}

export const PrintableReportView: React.FC<PrintableReportViewProps> = ({
  state,
  results,
  globalScore
}) => {
  const hasAnyScore = results.some(r => r.scaledScore != null);

  return (
    <div id="uam-print-area" className="hidden print:block p-8 bg-white text-ink-900 font-sans">
      {/* Official UAM Letterhead */}
      <div className="border-b-2 border-ink-900 pb-4 mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-xl font-bold text-ink-900 uppercase tracking-tight">
            Universidad Autónoma Metropolitana
          </h1>
          <h2 className="text-sm font-semibold text-ink-700">
            Unidad {state.unit} — {state.division || 'División Académica'}
          </h2>
          <p className="text-xs text-ink-500 italic mt-0.5">
            Casa abierta al tiempo
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold uppercase tracking-wider block text-ink-700">
            Dictamen de Autodiagnóstico
          </span>
          <span className="text-xs text-ink-500">
            Fecha: {new Date().toLocaleDateString('es-MX', { dateStyle: 'long' })}
          </span>
        </div>
      </div>

      {/* Title */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-ink-900">
          Evaluación Institucional de IA Responsable (Decálogo UAM)
        </h3>
        <p className="text-sm text-ink-700 mt-1">
          <strong>Proyecto:</strong> {state.projectTitle || 'Sin título especificado'} | <strong>Evaluador(a):</strong> {state.evaluatorName || 'Anónimo'} ({state.role})
        </p>
        <p className="text-sm text-ink-900 mt-1">
          <strong>Índice Global de Cumplimiento Ético:</strong> <span className="font-bold text-base">{hasAnyScore ? globalScore.toFixed(1) + ' / 10' : 'Sin evaluar'}</span>
          {hasAnyScore && ' — ' + (globalScore >= 9 ? '🟢 Cumplimiento Óptimo' : globalScore >= 6 ? '🟡 Riesgo Moderado' : '🔴 Riesgo Crítico')}
        </p>
      </div>

      {/* a) Table of Results */}
      <div className="mb-8">
        <h4 className="text-sm font-bold text-ink-900 uppercase border-b border-line pb-1 mb-3">
          a) Tabla de Resultados y Semáforo de Riesgo
        </h4>
        <table className="w-full text-xs text-left border-collapse border border-line">
          <thead>
            <tr className="bg-surface-2 border-b border-line">
              <th className="p-2 border-r border-line">Principio del Decálogo UAM</th>
              <th className="p-2 text-center border-r border-line w-28">Puntaje (1-10)</th>
              <th className="p-2 text-center w-40">Estado de Riesgo</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r.principle.id} className="border-b border-line">
                <td className="p-2 border-r border-line font-medium">
                  {r.principle.name}
                </td>
                <td className="p-2 text-center font-bold font-mono border-r border-line">
                  {r.scaledScore != null ? `${r.scaledScore} / 10` : 'Sin evaluar'}
                </td>
                <td className="p-2 text-center font-semibold text-[11px]">
                  {r.riskLevel}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* c) Dynamic Analysis */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-ink-900 uppercase border-b border-line pb-1 mb-2">
          c) Análisis y Recomendaciones Dinámicas
        </h4>

        <div className="p-2.5 bg-surface-2 border border-line rounded text-[11px] text-ink-700 mb-3">
          <strong>Aviso institucional:</strong> El diagnóstico y las recomendaciones provienen de contenido fijo, predefinido a partir del Decálogo de Ética UAM para cada nivel de la escala. Se requiere revisión humana por especialistas o comités colegiados UAM.
        </div>

        {results.map((r) => (
          <div key={r.principle.id} className="border border-line rounded p-3 text-xs mb-3 break-inside-avoid">
            <div className="flex justify-between font-bold text-ink-900 mb-1">
              <span>{r.principle.name} ({r.scaledScore != null ? `${r.scaledScore}/10` : 'Sin evaluar'})</span>
              <span>{r.riskLevel}</span>
            </div>
            <p className="text-ink-700 mb-1">
              <strong>Diagnóstico:</strong> {r.diagnostic}
            </p>
            <p className="text-ink-700 mb-1">
              <strong>Recomendación Técnica:</strong> {r.technicalRecommendation || 'N/A — principio sin evaluar.'}
              <span className="block text-[10px] text-blue-700 italic mt-0.5">Fuente técnica: {r.principle.sources.technical}</span>
            </p>
            <p className="text-ink-900 font-medium">
              <strong>Normativa UAM:</strong> {r.normativeRecommendation || 'N/A — principio sin evaluar.'}
              <span className="block text-[10px] text-violet-700 italic mt-0.5">Fuente normativa: {r.principle.sources.normative}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Signatures footer */}
      <div className="mt-12 pt-8 border-t border-ink-500 grid grid-cols-2 gap-8 text-center text-xs">
        <div>
          <div className="border-b border-ink-500 pb-8 mb-1"></div>
          <p className="font-bold text-ink-700">{state.evaluatorName || 'Responsable del Proyecto'}</p>
          <p className="text-ink-500">{state.role} - UAM {state.unit}</p>
        </div>
        <div>
          <div className="border-b border-ink-500 pb-8 mb-1"></div>
          <p className="font-bold text-ink-700">Comité / Coordinación Colegiada</p>
          <p className="text-ink-500">{state.division || 'Universidad Autónoma Metropolitana'}</p>
        </div>
      </div>
    </div>
  );
};
