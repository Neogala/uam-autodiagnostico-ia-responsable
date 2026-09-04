import React from 'react';
import { PlusCircle, RotateCcw } from 'lucide-react';
import { EvaluationReportState, UserRole } from '../types';

interface ProjectMetadataBarProps {
  state: EvaluationReportState;
  onChangeState: (updates: Partial<EvaluationReportState>) => void;
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

export const ProjectMetadataBar: React.FC<ProjectMetadataBarProps> = ({
  state,
  onChangeState,
  onNewProject,
  onResetScores
}) => {
  const handleResetScoresClick = () => {
    if (window.confirm('¿Deseas reiniciar la escala? Esto borrará las respuestas del cuestionario (volverán a "Sin evaluar").')) {
      onResetScores();
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-4 sm:p-5 mb-6">

      {/* Top Banner with Clear "Nuevo Proyecto" Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Registro y Datos del Proyecto Evaluado
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-new-project-main"
            onClick={onNewProject}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition shadow-xs cursor-pointer"
            title="Crear un nuevo registro de proyecto con campos limpios"
          >
            <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Nuevo Registro de Proyecto</span>
          </button>

          <button
            id="btn-reset-scores-bar"
            onClick={handleResetScoresClick}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition border border-slate-200"
            title="Borrar las respuestas del cuestionario (vuelven a Sin evaluar)"
          >
            <RotateCcw className="w-3 h-3 text-slate-500" />
            <span>Reiniciar Escala</span>
          </button>
        </div>
      </div>

      {/* Project inputs */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1">
            <label htmlFor="input-project-title" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Título del Proyecto o Sistema de IA
            </label>
            <input
              id="input-project-title"
              type="text"
              value={state.projectTitle}
              onChange={(e) => onChangeState({ projectTitle: e.target.value })}
              placeholder="Ej. Tutor Inteligente de Matemáticas / Sistema de Admisión Predictivo"
              className="w-full text-sm font-medium text-slate-900 bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:bg-white focus:outline-none transition"
            />
          </div>

          <div className="w-full sm:w-64">
            <label htmlFor="select-evaluator-role" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Rol de la Persona Responsable / Evaluadora
            </label>
            <select
              id="select-evaluator-role"
              value={state.role}
              onChange={(e) => onChangeState({ role: e.target.value as UserRole })}
              className="w-full text-sm font-medium text-slate-900 bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:bg-white focus:outline-none transition"
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
            <label htmlFor="input-division" className="block text-xs font-medium text-slate-600 mb-1">
              División Académica / Coordinación
            </label>
            <input
              id="input-division"
              type="text"
              value={state.division}
              onChange={(e) => onChangeState({ division: e.target.value })}
              placeholder="Ej. CBI / CSH / CBS / CAD / CNI / Sistemas Escolares"
              className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-amber-500 focus:bg-white focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="input-evaluator-name" className="block text-xs font-medium text-slate-600 mb-1">
              Nombre de la Persona Evaluadora / Titular
            </label>
            <input
              id="input-evaluator-name"
              type="text"
              value={state.evaluatorName}
              onChange={(e) => onChangeState({ evaluatorName: e.target.value })}
              placeholder="Ej. Dra. / Dr. Nombre y Apellido (Comunidad UAM)"
              className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-amber-500 focus:bg-white focus:outline-none"
            />
          </div>
        </div>
      </div>

    </div>
  );
};
