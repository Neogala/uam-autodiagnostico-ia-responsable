import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Info,
  FlaskConical
} from 'lucide-react';
import { DecalogoPrinciple, PrincipleScoreResult, calculatePrincipleResult } from '../types';

interface QuestionnaireSectionProps {
  principles: DecalogoPrinciple[];
  scores: Record<number, number | null>;
  onScoreChange: (principleId: number, newScore: number) => void;
  onSetAllScores: (score: number) => void;
}

export const QuestionnaireSection: React.FC<QuestionnaireSectionProps> = ({
  principles,
  scores,
  onScoreChange,
  onSetAllScores
}) => {
  const [expandedId, setExpandedId] = React.useState<number | null>(null);
  const [showDemoMode, setShowDemoMode] = React.useState(false);

  const toggleExpand = (id: number) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const getSemaphoreBadge = (scaledScore: number | null) => {
    if (scaledScore == null) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-300">
          <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
          <span>Sin evaluar</span>
        </span>
      );
    }
    if (scaledScore >= 9) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Verde ({scaledScore}/10) - Cumplimiento Óptimo</span>
        </span>
      );
    }
    if (scaledScore >= 6) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          <span>Amarillo ({scaledScore}/10) - Riesgo Moderado</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300">
        <AlertCircle className="w-3.5 h-3.5 text-red-600" />
        <span>Rojo ({scaledScore}/10) - Riesgo Crítico</span>
      </span>
    );
  };

  return (
    <section id="uam-questionnaire-section" className="bg-white border border-slate-200 rounded-xl shadow-xs p-5 sm:p-6 mb-8">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Cuestionario de Autoevaluación Ética UAM
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Responde a cada uno de los 10 principios institucionales en escala del <strong>1</strong> (No cumple / Totalmente en desacuerdo) al <strong>5</strong> (Cumple totalmente / Totalmente de acuerdo).
          </p>
        </div>

      </div>

      {/* Scale guide banner */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Escala:</strong> el puntaje 1–10 es tu respuesta (1 a 5) reescalada ×2 — nada más.
          </span>
        </div>
        <div className="flex items-center gap-3 font-medium text-[11px]">
          <span className="text-red-700 flex items-center gap-1">● 1 a 5.9: Crítico</span>
          <span className="text-amber-700 flex items-center gap-1">● 6 a 8.9: Moderado</span>
          <span className="text-emerald-700 flex items-center gap-1">● 9 a 10: Óptimo</span>
        </div>
      </div>

      {/* Demo mode: bulk-fill presets, clearly separated from real evaluation */}
      <div className="border border-dashed border-slate-300 rounded-lg mb-6 bg-slate-50/60">
        <button
          type="button"
          onClick={() => setShowDemoMode(prev => !prev)}
          className="w-full flex items-center justify-between gap-2 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          <span className="flex items-center gap-1.5">
            <FlaskConical className="w-3.5 h-3.5 text-slate-500" />
            Modo demostración (rellenar automáticamente, no es una evaluación real)
          </span>
          {showDemoMode ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
        {showDemoMode && (
          <div className="px-3 pb-3 flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[11px] text-slate-500">
              Para ver la app funcionando con datos de ejemplo:
            </span>
            <button
              onClick={() => onSetAllScores(5)}
              className="px-2 py-1 bg-white hover:bg-emerald-50 text-emerald-700 font-semibold rounded border border-slate-200 shadow-2xs transition text-[11px]"
              title="Asignar 5 a todos los principios (demostración)"
            >
              Todo 5 (Óptimo)
            </button>
            <button
              onClick={() => onSetAllScores(3)}
              className="px-2 py-1 bg-white hover:bg-amber-50 text-amber-700 font-semibold rounded border border-slate-200 shadow-2xs transition text-[11px]"
              title="Asignar 3 a todos los principios (demostración)"
            >
              Todo 3 (Moderado)
            </button>
            <button
              onClick={() => onSetAllScores(1)}
              className="px-2 py-1 bg-white hover:bg-red-50 text-red-700 font-semibold rounded border border-slate-200 shadow-2xs transition text-[11px]"
              title="Asignar 1 a todos los principios (demostración)"
            >
              Todo 1 (Crítico)
            </button>
          </div>
        )}
      </div>

      {/* Principles List */}
      <div className="space-y-4">
        {principles.map((principle) => {
          const currentRaw = scores[principle.id] ?? null;
          const result = calculatePrincipleResult(principle, currentRaw);
          const isExpanded = expandedId === principle.id;

          return (
            <div
              key={principle.id}
              id={`principle-card-${principle.id}`}
              className={`border rounded-xl transition-all duration-200 ${
                result.riskClass === 'critical'
                  ? 'border-red-200 bg-red-50/20 hover:border-red-300'
                  : result.riskClass === 'moderate'
                  ? 'border-amber-200 bg-amber-50/20 hover:border-amber-300'
                  : result.riskClass === 'optimal'
                  ? 'border-emerald-200 bg-emerald-50/20 hover:border-emerald-300'
                  : 'border-slate-200 bg-slate-50/40 hover:border-slate-300'
              }`}
            >
              <div className="p-4 sm:p-5">
                
                {/* Top row: Title and Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-start gap-2.5">
                    <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-900 text-amber-400 font-black text-xs shrink-0 mt-0.5 shadow-2xs">
                      #{principle.id}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        {principle.name}
                      </h3>
                      <p className="text-xs font-medium text-slate-700 mt-0.5">
                        {principle.question}
                      </p>
                    </div>
                  </div>

                  <div className="self-end sm:self-center shrink-0">
                    {getSemaphoreBadge(result.scaledScore)}
                  </div>
                </div>

                {/* Score Selection Buttons (1 to 5) */}
                <div className="mt-4 pt-3 border-t border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="text-xs font-semibold text-slate-600">
                    Nivel de cumplimiento del proyecto:
                  </div>

                  {/* 1 to 5 Pill Buttons */}
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {[1, 2, 3, 4, 5].map((val) => {
                      const isSelected = currentRaw === val;
                      const scaledVal = val * 2;
                      let activeStyle = '';

                      if (isSelected) {
                        if (scaledVal >= 9) {
                          activeStyle = 'bg-emerald-600 text-white ring-2 ring-emerald-400 ring-offset-1 font-bold shadow-sm';
                        } else if (scaledVal >= 6) {
                          activeStyle = 'bg-amber-500 text-slate-950 ring-2 ring-amber-300 ring-offset-1 font-bold shadow-sm';
                        } else {
                          activeStyle = 'bg-red-600 text-white ring-2 ring-red-400 ring-offset-1 font-bold shadow-sm';
                        }
                      } else {
                        activeStyle = 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-medium';
                      }

                      return (
                        <button
                          key={val}
                          type="button"
                          id={`btn-principle-${principle.id}-val-${val}`}
                          onClick={() => onScoreChange(principle.id, val)}
                          className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs transition duration-150 flex flex-col items-center min-w-[54px] ${activeStyle}`}
                          title={`Calificar con ${val} de 5 (equivale a ${scaledVal}/10)`}
                        >
                          <span className="text-sm leading-tight">{val}</span>
                          <span className="text-[9px] opacity-80 leading-none">({scaledVal}/10)</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Expand / Collapse Details Toggle */}
                <div className="mt-3 flex justify-between items-center text-xs">
                  <button
                    type="button"
                    onClick={() => toggleExpand(principle.id)}
                    className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium py-1"
                  >
                    <span>{isExpanded ? 'Ocultar indicadores y justificación' : 'Ver indicadores y criterios UAM'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Expanded Details Drawer */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-slate-200/90 text-xs text-slate-600 space-y-2.5 bg-slate-50/80 p-3.5 rounded-lg">
                    <p>
                      <strong className="text-slate-800">Criterio Institucional:</strong> {principle.explanation}
                    </p>
                    
                    <div>
                      <strong className="text-slate-800 block mb-1">Indicadores verificables:</strong>
                      <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
                        {principle.indicators.map((ind, i) => (
                          <li key={i}>{ind}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row gap-2 text-[11px]">
                      <div className="flex-1 bg-white p-2 rounded border border-slate-200">
                        <strong className="text-slate-800 block mb-0.5">Diagnóstico actual:</strong>
                        <span className="text-slate-600">{result.diagnostic}</span>
                      </div>
                      <div className="flex-1 bg-white p-2 rounded border border-slate-200">
                        <strong className="text-slate-800 block mb-0.5">Recomendación técnica:</strong>
                        <span className="text-slate-600">{result.technicalRecommendation || 'Disponible una vez que califiques este principio.'}</span>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};
