import React from 'react';
import { PlusCircle, RotateCcw } from 'lucide-react';
import { UAMUnit } from '../types';

interface HeaderProps {
  activeUnit: UAMUnit;
  onUnitChange: (unit: UAMUnit) => void;
  onNewProject: () => void;
}

const UAM_UNITS: UAMUnit[] = [
  'Azcapotzalco',
  'Cuajimalpa',
  'Iztapalapa',
  'Lerma',
  'Xochimilco',
  'Rectoría General'
];

export const Header: React.FC<HeaderProps> = ({
  activeUnit,
  onUnitChange,
  onNewProject
}) => {
  return (
    <header id="uam-main-header" className="bg-slate-900 text-white border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Brand & Institutional identity */}
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 via-orange-600 to-red-700 flex items-center justify-center shadow-lg text-white font-black text-xl tracking-tight border border-amber-400/30">
              UAM
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-50 flex items-center gap-1.5">
                  Autodiagnóstico de IA Responsable
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Decálogo UAM
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Universidad Autónoma Metropolitana • <em>Casa abierta al tiempo</em>
              </p>
            </div>
          </div>

          {/* Unit selector and Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center bg-slate-800/80 rounded-lg p-1 border border-slate-700 text-xs">
              <span className="text-slate-400 px-2 font-medium hidden sm:inline">Unidad:</span>
              <select
                id="uam-unit-selector"
                value={activeUnit}
                onChange={(e) => onUnitChange(e.target.value as UAMUnit)}
                aria-label="Seleccionar Unidad Universitaria UAM"
                className="bg-slate-900 text-amber-300 font-semibold px-2.5 py-1 rounded focus:outline-none focus:ring-1 focus:ring-amber-400 text-xs cursor-pointer border border-slate-700"
              >
                {UAM_UNITS.map((u) => (
                  <option key={u} value={u}>
                    UAM-{u}
                  </option>
                ))}
              </select>
            </div>

            <button
              id="btn-new-project-header"
              onClick={onNewProject}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg shadow-sm transition border border-amber-400/50 cursor-pointer"
              title="Iniciar una nueva evaluación o registro de proyecto en blanco"
            >
              <PlusCircle className="w-3.5 h-3.5 text-slate-950" />
              <span>Nuevo Registro de Proyecto</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
