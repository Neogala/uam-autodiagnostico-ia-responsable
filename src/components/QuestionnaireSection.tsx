import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Info,
  FlaskConical,
  BookOpen,
  Lightbulb,
  Gauge,
  ShieldCheck,
  Users,
  UserCog
} from 'lucide-react';
import {
  DecalogoPrinciple,
  calculatePrincipleResult,
  getMarcosForPrinciple,
  NivelMadurez,
  NIVEL_MADUREZ_LABEL,
  PerfilProyecto,
  RespuestaCualitativa,
  ProgresoPrincipio
} from '../types';

interface QuestionnaireSectionProps {
  principles: DecalogoPrinciple[];
  scores: Record<number, number | null>;
  onScoreChange: (principleId: number, newScore: number) => void;
  onSetAllScores: (score: number) => void;
  perfilProyecto: PerfilProyecto;
  autovaloraciones: Record<number, NivelMadurez | null>;
  onSetAutovaloracion: (principleId: number, nivel: NivelMadurez | null) => void;
  respuestasCualitativas: Record<string, RespuestaCualitativa>;
  onSetRespuestaCualitativa: (preguntaId: string, valor: string, justificacion?: string) => void;
  progresoEfectivo: Record<number, ProgresoPrincipio>;
  onToggleValidado: (principleId: number) => void;
}

const NIVELES_MADUREZ: NivelMadurez[] = ['no_existente', 'bajo', 'moderado', 'significativo', 'alto'];

// Approximate, illustrative mapping only — used to show a contrast hint between
// self-assessment and the deterministic calculated result, not to replace it.
function nivelMadurezSugiereRiesgo(nivel: NivelMadurez): 'critical' | 'moderate' | 'optimal' {
  if (nivel === 'no_existente' || nivel === 'bajo') return 'critical';
  if (nivel === 'moderado') return 'moderate';
  return 'optimal';
}

export const QuestionnaireSection: React.FC<QuestionnaireSectionProps> = ({
  principles,
  scores,
  onScoreChange,
  onSetAllScores,
  perfilProyecto,
  autovaloraciones,
  onSetAutovaloracion,
  respuestasCualitativas,
  onSetRespuestaCualitativa,
  progresoEfectivo,
  onToggleValidado
}) => {
  const [expandedId, setExpandedId] = React.useState<number | null>(null);
  const [showDemoMode, setShowDemoMode] = React.useState(false);

  const toggleExpand = (id: number) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const getSemaphoreBadge = (scaledScore: number | null) => {
    if (scaledScore == null) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-surface-2 text-ink-700 border border-line">
          <HelpCircle className="w-3.5 h-3.5 text-ink-500" />
          <span>Sin evaluar</span>
        </span>
      );
    }
    if (scaledScore >= 9) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-sem-optimo-bg text-sem-optimo border border-sem-optimo/30">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Verde ({scaledScore}/10) - Cumplimiento Óptimo</span>
        </span>
      );
    }
    if (scaledScore >= 6) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-sem-moderado-bg text-sem-moderado border border-sem-moderado/30">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Amarillo ({scaledScore}/10) - Riesgo Moderado</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-sem-critico-bg text-sem-critico border border-sem-critico/30">
        <AlertCircle className="w-3.5 h-3.5" />
        <span>Rojo ({scaledScore}/10) - Riesgo Crítico</span>
      </span>
    );
  };

  const getProgresoBadge = (progreso: ProgresoPrincipio) => {
    if (progreso === 'completado_validado') {
      return <span className="inline-flex items-center gap-1 text-[10px] font-bold text-sem-optimo"><ShieldCheck className="w-3 h-3" /> Completado y validado</span>;
    }
    if (progreso === 'parcial') {
      return <span className="text-[10px] font-semibold text-ink-500">Parcialmente completado</span>;
    }
    return <span className="text-[10px] font-semibold text-ink-500">Sin responder</span>;
  };

  return (
    <section id="uam-questionnaire-section" className="bg-white border border-line rounded-xl shadow-xs p-5 sm:p-6 mb-8">

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-ink-900">
            Cuestionario de Autoevaluación Ética UAM
          </h2>
          <p className="text-xs text-ink-500 mt-1">
            Responde a cada uno de los 10 principios institucionales en escala del <strong>1</strong> (No cumple / Totalmente en desacuerdo) al <strong>5</strong> (Cumple totalmente / Totalmente de acuerdo).
          </p>
        </div>

      </div>

      {/* Scale guide banner */}
      <div className="bg-surface-2 border border-line rounded-lg p-3 mb-4 flex flex-wrap items-center justify-between gap-2 text-xs text-ink-700">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-brand-ink shrink-0" />
          <span>
            <strong>Escala:</strong> el puntaje 1–10 es tu respuesta (1 a 5) reescalada ×2 — nada más.
          </span>
        </div>
        <div className="flex items-center gap-3 font-medium text-[11px]">
          <span className="text-sem-critico flex items-center gap-1">● 1 a 5.9: Crítico</span>
          <span className="text-sem-moderado flex items-center gap-1">● 6 a 8.9: Moderado</span>
          <span className="text-sem-optimo flex items-center gap-1">● 9 a 10: Óptimo</span>
        </div>
      </div>

      {/* Demo mode: bulk-fill presets, clearly separated from real evaluation */}
      <div className="border border-dashed border-line rounded-lg mb-6 bg-surface-2">
        <button
          type="button"
          onClick={() => setShowDemoMode(prev => !prev)}
          className="w-full flex items-center justify-between gap-2 px-3 py-2 text-xs font-semibold text-ink-700 hover:text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded-lg"
        >
          <span className="flex items-center gap-1.5">
            <FlaskConical className="w-3.5 h-3.5 text-ink-500" />
            Modo demostración (rellenar automáticamente, no es una evaluación real)
          </span>
          {showDemoMode ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
        {showDemoMode && (
          <div className="px-3 pb-3 flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[11px] text-ink-500">
              Para ver la app funcionando con datos de ejemplo:
            </span>
            <button
              onClick={() => onSetAllScores(5)}
              className="px-2 py-1 bg-white hover:bg-sem-optimo-bg text-sem-optimo font-semibold rounded border border-line shadow-2xs transition text-[11px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              title="Asignar 5 a todos los principios (demostración)"
            >
              Todo 5 (Óptimo)
            </button>
            <button
              onClick={() => onSetAllScores(3)}
              className="px-2 py-1 bg-white hover:bg-sem-moderado-bg text-sem-moderado font-semibold rounded border border-line shadow-2xs transition text-[11px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              title="Asignar 3 a todos los principios (demostración)"
            >
              Todo 3 (Moderado)
            </button>
            <button
              onClick={() => onSetAllScores(1)}
              className="px-2 py-1 bg-white hover:bg-sem-critico-bg text-sem-critico font-semibold rounded border border-line shadow-2xs transition text-[11px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
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
          const marcos = getMarcosForPrinciple(principle);
          const autovaloracion = autovaloraciones[principle.id] ?? null;
          const progreso = progresoEfectivo[principle.id] ?? 'sin_responder';
          const contrasteVisible = autovaloracion != null && result.riskClass !== 'unscored';
          const contrasteCoincide = contrasteVisible && nivelMadurezSugiereRiesgo(autovaloracion as NivelMadurez) === result.riskClass;

          return (
            <div
              key={principle.id}
              id={`principle-card-${principle.id}`}
              className={`border rounded-xl transition-all duration-200 ${
                result.riskClass === 'critical'
                  ? 'border-sem-critico/30 bg-sem-critico-bg/40 hover:border-sem-critico/50'
                  : result.riskClass === 'moderate'
                  ? 'border-sem-moderado/30 bg-sem-moderado-bg/40 hover:border-sem-moderado/50'
                  : result.riskClass === 'optimal'
                  ? 'border-sem-optimo/30 bg-sem-optimo-bg/40 hover:border-sem-optimo/50'
                  : 'border-line bg-surface-2 hover:border-ink-500/40'
              }`}
            >
              <div className="p-4 sm:p-5">

                {/* Top row: Title and Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-start gap-2.5">
                    <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-ink-900 text-white font-black text-xs shrink-0 mt-0.5 shadow-2xs">
                      #{principle.id}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-ink-900">
                        {principle.name}
                      </h3>
                      <p className="text-xs font-medium text-ink-700 mt-0.5">
                        {principle.question}
                      </p>
                    </div>
                  </div>

                  <div className="self-end sm:self-center shrink-0">
                    {getSemaphoreBadge(result.scaledScore)}
                  </div>
                </div>

                {/* Trazabilidad a marcos + progreso */}
                <div className="flex flex-wrap items-center gap-1.5 mb-3 pl-9">
                  {marcos.map((m) => (
                    <span key={m} className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-ink-900/5 text-ink-500 border border-line">
                      {m}
                    </span>
                  ))}
                  <span className="text-ink-500">•</span>
                  {getProgresoBadge(progreso)}
                </div>

                {/* Autovaloración previa al cálculo (punto 2, Bloque B) */}
                <div className="mb-3 pl-9">
                  <label htmlFor={`autoval-${principle.id}`} className="flex items-center gap-1.5 text-[11px] font-semibold text-ink-700 mb-1">
                    <Gauge className="w-3.5 h-3.5 text-ink-500" />
                    Tu autovaloración de madurez (antes de ver el resultado calculado)
                  </label>
                  <select
                    id={`autoval-${principle.id}`}
                    value={autovaloracion ?? ''}
                    onChange={(e) => onSetAutovaloracion(principle.id, e.target.value ? (e.target.value as NivelMadurez) : null)}
                    className="text-xs font-medium text-ink-900 bg-white border border-line rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-focus focus:outline-none transition"
                  >
                    <option value="">Sin autovaloración</option>
                    {NIVELES_MADUREZ.map((n) => (
                      <option key={n} value={n}>{NIVEL_MADUREZ_LABEL[n]}</option>
                    ))}
                  </select>
                  {contrasteVisible && (
                    <span className={`ml-2 text-[11px] font-semibold ${contrasteCoincide ? 'text-sem-optimo' : 'text-sem-moderado'}`}>
                      {contrasteCoincide ? '✓ Coincide con el resultado calculado' : '⚠ Difiere del resultado calculado — vale la pena revisar por qué'}
                    </span>
                  )}
                </div>

                {/* Score Selection Buttons (1 to 5) */}
                <div className="mt-4 pt-3 border-t border-line flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="text-xs font-semibold text-ink-700">
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
                          activeStyle = 'bg-sem-optimo text-white ring-2 ring-sem-optimo/40 ring-offset-1 font-bold shadow-sm';
                        } else if (scaledVal >= 6) {
                          activeStyle = 'bg-sem-moderado text-white ring-2 ring-sem-moderado/40 ring-offset-1 font-bold shadow-sm';
                        } else {
                          activeStyle = 'bg-sem-critico text-white ring-2 ring-sem-critico/40 ring-offset-1 font-bold shadow-sm';
                        }
                      } else {
                        activeStyle = 'bg-white hover:bg-surface-2 text-ink-700 border border-line font-medium';
                      }

                      return (
                        <button
                          key={val}
                          type="button"
                          id={`btn-principle-${principle.id}-val-${val}`}
                          onClick={() => onScoreChange(principle.id, val)}
                          className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs transition duration-150 flex flex-col items-center min-w-[54px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-1 ${activeStyle}`}
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
                    className="inline-flex items-center gap-1 text-ink-700 hover:text-ink-900 font-medium py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded"
                  >
                    <span>{isExpanded ? 'Ocultar indicadores y justificación' : 'Ver indicadores y criterios UAM'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  <label className="flex items-center gap-1.5 cursor-pointer select-none text-ink-700 hover:text-ink-900 font-medium">
                    <input
                      type="checkbox"
                      checked={progreso === 'completado_validado'}
                      onChange={() => onToggleValidado(principle.id)}
                      className="w-3.5 h-3.5 rounded text-brand focus-visible:ring-2 focus-visible:ring-focus border-line"
                    />
                    <span>Marcar como completado y validado</span>
                  </label>
                </div>

                {/* Expanded Details Drawer */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-line text-xs text-ink-700 space-y-3 bg-surface-2/80 p-3.5 rounded-lg">
                    <p>
                      <strong className="text-ink-900">Criterio Institucional:</strong> {principle.explanation}
                    </p>

                    <div>
                      <strong className="text-ink-900 block mb-1">Indicadores verificables:</strong>
                      <ul className="list-disc list-inside space-y-1 text-ink-700 pl-1">
                        {principle.indicators.map((ind, i) => (
                          <li key={i}>{ind}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Intro pedagógica (punto 4): solo en principios piloto */}
                    {principle.intro && (
                      <div className="pt-2 border-t border-line space-y-2">
                        <div className="flex items-start gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-ink-500 shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-ink-900 block mb-0.5">Definiciones:</strong>
                            <ul className="list-disc list-inside space-y-1">
                              {principle.intro.definiciones.map((d, i) => <li key={i}>{d}</li>)}
                            </ul>
                          </div>
                        </div>
                        <div className="flex items-start gap-1.5">
                          <Lightbulb className="w-3.5 h-3.5 text-ink-500 shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-ink-900 block mb-0.5">Ejemplos en contexto UAM:</strong>
                            <ul className="list-disc list-inside space-y-1">
                              {principle.intro.ejemplosUAM.map((ex, i) => <li key={i}>{ex}</li>)}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Preguntas cualitativas por subdimensión (puntos 1, 5, 6, 7): solo en principios piloto */}
                    {principle.subdimensiones && principle.subdimensiones.length > 0 && (
                      <div className="pt-2 border-t border-line space-y-3">
                        <strong className="text-ink-900 block">Preguntas de diagnóstico (contextualizan tu puntaje, no lo sustituyen):</strong>
                        {principle.subdimensiones.map((sub) => (
                          <div key={sub.id} className="bg-white border border-line rounded-lg p-3">
                            <div className="text-[11px] font-bold text-ink-900 uppercase tracking-wide mb-2">{sub.nombre}</div>
                            <div className="space-y-3">
                              {sub.preguntas
                                .filter(p => !p.aplicaSiPerfil || p.aplicaSiPerfil(perfilProyecto))
                                .map((pregunta) => {
                                  const respuesta = respuestasCualitativas[pregunta.id];
                                  return (
                                    <div key={pregunta.id}>
                                      <div className="flex items-start gap-1.5 mb-1">
                                        {pregunta.distincionSujeto === 'sujeto_afectado'
                                          ? <Users className="w-3.5 h-3.5 text-ink-500 shrink-0 mt-0.5" />
                                          : <UserCog className="w-3.5 h-3.5 text-ink-500 shrink-0 mt-0.5" />}
                                        <p className="text-ink-900 font-medium">{pregunta.enunciado}</p>
                                      </div>
                                      <div className="flex flex-wrap gap-1.5 pl-5">
                                        {(pregunta.opciones || []).map((op) => (
                                          <button
                                            key={op}
                                            type="button"
                                            onClick={() => onSetRespuestaCualitativa(pregunta.id, op, respuesta?.justificacion)}
                                            className={`px-2 py-1 rounded text-[11px] font-medium border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus ${
                                              respuesta?.valor === op
                                                ? 'bg-ink-900 text-white border-ink-900'
                                                : 'bg-surface-2 text-ink-700 border-line hover:bg-line'
                                            }`}
                                          >
                                            {op}
                                          </button>
                                        ))}
                                      </div>
                                      {pregunta.permiteJustificacion && (
                                        <input
                                          type="text"
                                          value={respuesta?.justificacion || ''}
                                          onChange={(e) => onSetRespuestaCualitativa(pregunta.id, respuesta?.valor || '', e.target.value)}
                                          placeholder="Justificación breve (opcional)"
                                          className="mt-1.5 ml-5 w-[calc(100%-1.25rem)] text-[11px] text-ink-900 bg-surface-2 border border-line rounded px-2 py-1 focus:ring-1 focus:ring-focus focus:bg-white focus:outline-none"
                                        />
                                      )}
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="pt-2 border-t border-line flex flex-col sm:flex-row gap-2 text-[11px]">
                      <div className="flex-1 bg-white p-2 rounded border border-line">
                        <strong className="text-ink-900 block mb-0.5">Diagnóstico actual:</strong>
                        <span className="text-ink-700">{result.diagnostic}</span>
                      </div>
                      <div className="flex-1 bg-white p-2 rounded border border-line">
                        <strong className="text-ink-900 block mb-0.5">Recomendación técnica:</strong>
                        <span className="text-ink-700">{result.technicalRecommendation || 'Disponible una vez que califiques este principio.'}</span>
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
