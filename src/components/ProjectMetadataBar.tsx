import React from 'react';
import { PlusCircle, RotateCcw, ClipboardList, ShieldQuestion } from 'lucide-react';
import { EvaluationReportState, UserRole, PerfilProyecto, SupervisionHumana } from '../types';

interface ProjectMetadataBarProps {
  state: EvaluationReportState;
  onChangeState: (updates: Partial<EvaluationReportState>) => void;
  onChangePerfil: (updates: Partial<PerfilProyecto>) => void;
  onNewProject: () => void;
  onResetScores: () => void;
}

const ROLES: UserRole[] = [
  'Docente',
  'Investigador(a)',
  'Personal Administrativo',
  'Alumnado de Posgrado / Licenciatura',
  'Coordinador(a) Académico(a) o Directivo(a)'
];

const TIPO_SISTEMA_OPCIONES = [
  'Generación de texto o contenido',
  'Recomendación o priorización',
  'Clasificación o predicción',
  'Detección (plagio, fraude, anomalías)',
  'Asistente conversacional',
  'Otro'
];

const SUPERVISION_OPCIONES: { value: SupervisionHumana; label: string }[] = [
  { value: 'no_aplica', label: 'No aplica / aún no definido' },
  { value: 'in-the-loop', label: 'In-the-loop (una persona aprueba cada decisión antes de aplicarse)' },
  { value: 'on-the-loop', label: 'On-the-loop (una persona supervisa y puede intervenir en curso)' },
  { value: 'in-command', label: 'In-command (una persona puede desactivar o anular el sistema en cualquier momento)' }
];

export const ProjectMetadataBar: React.FC<ProjectMetadataBarProps> = ({
  state,
  onChangeState,
  onChangePerfil,
  onNewProject,
  onResetScores
}) => {
  const perfil = state.perfilProyecto;

  const toggleTipoSistema = (opcion: string) => {
    const has = perfil.tipoSistema.includes(opcion);
    onChangePerfil({
      tipoSistema: has ? perfil.tipoSistema.filter(o => o !== opcion) : [...perfil.tipoSistema, opcion]
    });
  };

  const handleResetScoresClick = () => {
    if (window.confirm('¿Deseas reiniciar la escala? Esto borrará las respuestas del cuestionario (volverán a "Sin evaluar").')) {
      onResetScores();
    }
  };

  return (
    <div className="bg-white border border-line rounded-xl shadow-xs p-4 sm:p-5 mb-6">

      {/* Top Banner with Clear "Nuevo Proyecto" Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-line">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-brand"></div>
          <h2 className="text-sm font-bold text-ink-900 uppercase tracking-wider">
            Registro y Datos del Proyecto Evaluado
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-new-project-main"
            onClick={onNewProject}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-brand hover:bg-brand-hover text-white rounded-lg transition shadow-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2"
            title="Crear un nuevo registro de proyecto con campos limpios"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Nuevo Registro de Proyecto</span>
          </button>

          <button
            id="btn-reset-scores-bar"
            onClick={handleResetScoresClick}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-ink-700 hover:text-ink-900 bg-surface-2 hover:bg-line rounded-lg transition border border-line focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            title="Borrar las respuestas del cuestionario (vuelven a Sin evaluar)"
          >
            <RotateCcw className="w-3 h-3 text-ink-500" />
            <span>Reiniciar Escala</span>
          </button>
        </div>
      </div>

      {/* Project inputs */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1">
            <label htmlFor="input-project-title" className="block text-xs font-semibold text-ink-700 uppercase tracking-wider mb-1">
              Título del Proyecto o Sistema de IA
            </label>
            <input
              id="input-project-title"
              type="text"
              value={state.projectTitle}
              onChange={(e) => onChangeState({ projectTitle: e.target.value })}
              placeholder="Ej. Tutor Inteligente de Matemáticas / Sistema de Admisión Predictivo"
              className="w-full text-sm font-medium text-ink-900 bg-surface-2 border border-line rounded-lg px-3 py-2 focus:ring-2 focus:ring-focus focus:bg-white focus:outline-none transition"
            />
          </div>

          <div className="w-full sm:w-64">
            <label htmlFor="select-evaluator-role" className="block text-xs font-semibold text-ink-700 uppercase tracking-wider mb-1">
              Rol de la Persona Responsable / Evaluadora
            </label>
            <select
              id="select-evaluator-role"
              value={state.role}
              onChange={(e) => onChangeState({ role: e.target.value as UserRole })}
              className="w-full text-sm font-medium text-ink-900 bg-surface-2 border border-line rounded-lg px-3 py-2 focus:ring-2 focus:ring-focus focus:bg-white focus:outline-none transition"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="input-division" className="block text-xs font-medium text-ink-700 mb-1">
              División Académica / Coordinación
            </label>
            <input
              id="input-division"
              type="text"
              value={state.division}
              onChange={(e) => onChangeState({ division: e.target.value })}
              placeholder="Ej. CBI / CSH / CBS / CAD / CNI / Sistemas Escolares"
              className="w-full text-xs text-ink-900 bg-surface-2 border border-line rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-focus focus:bg-white focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="input-evaluator-name" className="block text-xs font-medium text-ink-700 mb-1">
              Nombre de la Persona Evaluadora / Titular
            </label>
            <input
              id="input-evaluator-name"
              type="text"
              value={state.evaluatorName}
              onChange={(e) => onChangeState({ evaluatorName: e.target.value })}
              placeholder="Ej. Dra. / Dr. Nombre y Apellido (Comunidad UAM)"
              className="w-full text-xs text-ink-900 bg-surface-2 border border-line rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-focus focus:bg-white focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Perfil del proyecto (punto 7, Bloque B): caracteriza el sistema para
          poder, en el futuro, adaptar qué preguntas del cuestionario aplican. */}
      <div className="mt-5 pt-5 border-t border-line">
        <div className="flex items-center gap-2 mb-3">
          <ClipboardList className="w-4 h-4 text-brand-ink" />
          <h3 className="text-sm font-bold text-ink-900">Perfil del Sistema de IA (opcional)</h3>
        </div>
        <p className="text-xs text-ink-500 mb-3">
          Ayuda a caracterizar el sistema evaluado. No cambia el puntaje ni el semáforo.
        </p>

        <div className="space-y-4">
          <div>
            <span className="block text-xs font-semibold text-ink-700 mb-1.5">Tipo de sistema (puedes marcar varios)</span>
            <div className="flex flex-wrap gap-1.5">
              {TIPO_SISTEMA_OPCIONES.map((opcion) => {
                const checked = perfil.tipoSistema.includes(opcion);
                return (
                  <button
                    key={opcion}
                    type="button"
                    onClick={() => toggleTipoSistema(opcion)}
                    aria-pressed={checked}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus ${
                      checked
                        ? 'bg-brand-tint text-brand-ink border-brand/30'
                        : 'bg-surface-2 text-ink-700 border-line hover:bg-line'
                    }`}
                  >
                    {opcion}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <label className="flex items-center gap-2 text-xs text-ink-700 bg-surface-2 border border-line rounded-lg px-3 py-2 cursor-pointer">
              <input
                type="checkbox"
                checked={perfil.autonomo}
                onChange={(e) => onChangePerfil({ autonomo: e.target.checked })}
                className="w-4 h-4 rounded text-brand focus-visible:ring-2 focus-visible:ring-focus border-line"
              />
              <span>Actúa de forma autónoma (sin intervención humana por defecto)</span>
            </label>
            <label className="flex items-center gap-2 text-xs text-ink-700 bg-surface-2 border border-line rounded-lg px-3 py-2 cursor-pointer">
              <input
                type="checkbox"
                checked={perfil.autoaprendizaje}
                onChange={(e) => onChangePerfil({ autoaprendizaje: e.target.checked })}
                className="w-4 h-4 rounded text-brand focus-visible:ring-2 focus-visible:ring-focus border-line"
              />
              <span>Se reentrena o ajusta con datos nuevos en producción</span>
            </label>
            <label className="flex items-center gap-2 text-xs text-ink-700 bg-surface-2 border border-line rounded-lg px-3 py-2 cursor-pointer">
              <input
                type="checkbox"
                checked={perfil.decideSobrePersonas}
                onChange={(e) => onChangePerfil({ decideSobrePersonas: e.target.checked })}
                className="w-4 h-4 rounded text-brand focus-visible:ring-2 focus-visible:ring-focus border-line"
              />
              <span>Sus resultados afectan directamente a personas (calificar, admitir, priorizar)</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="select-supervision" className="block text-xs font-semibold text-ink-700 mb-1">
                Tipo de supervisión humana
              </label>
              <select
                id="select-supervision"
                value={perfil.supervision}
                onChange={(e) => onChangePerfil({ supervision: e.target.value as SupervisionHumana })}
                className="w-full text-xs font-medium text-ink-900 bg-surface-2 border border-line rounded-lg px-3 py-2 focus:ring-2 focus:ring-focus focus:bg-white focus:outline-none transition"
              >
                {SUPERVISION_OPCIONES.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <label className="flex items-center gap-2 text-xs text-ink-700 bg-surface-2 border border-line rounded-lg px-3 py-2 cursor-pointer self-end">
              <input
                type="checkbox"
                checked={perfil.abortoSeguro}
                onChange={(e) => onChangePerfil({ abortoSeguro: e.target.checked })}
                className="w-4 h-4 rounded text-brand focus-visible:ring-2 focus-visible:ring-focus border-line"
              />
              <span>Existe un mecanismo para detener el sistema de forma segura ("stop")</span>
            </label>
          </div>
        </div>
      </div>

      {/* Aviso de privacidad (punto 10, Bloque B) */}
      <div className="mt-5 bg-surface-2 border border-line rounded-lg p-3 flex items-start gap-2.5 text-xs text-ink-700">
        <ShieldQuestion className="w-4 h-4 text-ink-500 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Aviso de privacidad:</strong> esta herramienta guarda todo localmente en tu navegador (no se envía a ningún servidor). Evita capturar datos personales innecesarios de terceros — usa solo la información mínima para identificar el proyecto (título, división, persona responsable), conforme a la LGPDPPSO.
        </div>
      </div>

    </div>
  );
};
