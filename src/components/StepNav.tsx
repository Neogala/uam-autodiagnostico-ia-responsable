import React from 'react';
import { Check } from 'lucide-react';

export type StepId = 'datos' | 'autoevaluacion' | 'resultados' | 'dictamen';

interface Step {
  id: StepId;
  label: string;
}

const STEPS: Step[] = [
  { id: 'datos', label: 'Datos del proyecto' },
  { id: 'autoevaluacion', label: 'Autoevaluación' },
  { id: 'resultados', label: 'Resultados' },
  { id: 'dictamen', label: 'Dictamen y entregables' }
];

interface StepNavProps {
  currentStep: StepId;
  onStepChange: (step: StepId) => void;
  /** Steps considered "reached" / with content worth showing a check for. */
  completedSteps: StepId[];
}

export const StepNav: React.FC<StepNavProps> = ({ currentStep, onStepChange, completedSteps }) => {
  return (
    <nav aria-label="Progreso de la autoevaluación" className="bg-white border border-line rounded-xl shadow-xs mb-6 p-2 sm:p-3">
      <ol className="flex flex-col sm:flex-row gap-1.5 sm:gap-2">
        {STEPS.map((step, index) => {
          const isActive = step.id === currentStep;
          const isDone = completedSteps.includes(step.id) && !isActive;

          return (
            <li key={step.id} className="flex-1">
              <button
                type="button"
                onClick={() => onStepChange(step.id)}
                aria-current={isActive ? 'step' : undefined}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-1 ${
                  isActive
                    ? 'bg-ink-900 text-white shadow-sm'
                    : 'bg-surface-2 text-ink-700 hover:bg-line'
                }`}
              >
                <span
                  className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shrink-0 ${
                    isActive
                      ? 'bg-brand text-white'
                      : isDone
                      ? 'bg-sem-optimo text-white'
                      : 'bg-ink-500/30 text-ink-700'
                  }`}
                >
                  {isDone ? <Check className="w-3.5 h-3.5" /> : index + 1}
                </span>
                <span className="text-xs sm:text-sm font-semibold leading-tight">
                  {step.label}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
